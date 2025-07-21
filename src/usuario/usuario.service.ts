import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UsuarioData } from "./usuario.interface";
import { CrearUsuarioInput } from "./crear-usuario.input";
import { Usuario } from "@prisma/client";
import * as bcrypt from 'bcrypt';
import { ActualizarUsuarioInput } from "./actualizar-usuario.input";

@Injectable()
export class UsuarioService {
    constructor(private prisma: PrismaService) {}

    async obtenerUsuarios(): Promise<UsuarioData[]> {
        const usuarios = await this.prisma.usuario.findMany({
            include: {
                personal: {
                    include: {
                        cargo: true,
                    },
                },
            },
        });
        return usuarios.map((u) => ({
            usuario: u.usuario,
            clave: u.clave,
            dniPersonal: u.dniPersonal,
            nombre: u.personal?.nombre || '',
            cargo: u.personal?.cargo?.cargo ?? '',
        }));
    }

    async obtenerConteoUsuarios() {
        const resultado = await this.prisma.usuario.aggregate({
            _count: {
                usuario: true,
            },
        });
        return Number(resultado._count.usuario) || 0;
    }

    async obtenerUsuarioPorDNI(dniPersonal: string): Promise<UsuarioData[]> {
        const usuarios = await this.prisma.usuario.findMany({
            where: {
                dniPersonal: dniPersonal,
            },
            include: {
                personal: {
                    include: {
                        cargo: true,
                    }
                }
            }
        });
        return usuarios.map((u) => ({
            usuario: u.usuario,
            clave: u.clave,
            dniPersonal: u.dniPersonal,
            nombre: u.personal?.nombre || '',
            cargo: u.personal?.cargo?.cargo ?? '',
        }))
    }

    async crearUsuario(
        input: CrearUsuarioInput
    ): Promise<void> {
        const {
            usuario,
            clave,
            dniPersonal,
        } = input;

        const usuarioExistente = await this.prisma.usuario.findUnique({
            where: { usuario },
        });
        const personalExistente = await this.prisma.personal.findUnique({
            where: { dniPersonal },
        });
        if (usuarioExistente) {
            throw new HttpException(
                'El usuario ya existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        if (!personalExistente) {
            throw new HttpException(
                'Personal no encontrado',
                HttpStatus.NOT_FOUND,
            );
        }
        try {
            const salt = await bcrypt.genSalt();
            const claveEncriptada = await bcrypt.hash(clave, salt);
            await this.prisma.usuario.create({
                data: {
                    usuario,
                    clave: claveEncriptada,
                    dniPersonal,
                },
            });
        } catch (error) {
            throw new HttpException(
                'Error al registrar usuario',
                HttpStatus.BAD_REQUEST,
            );
        }
    }

    async actualizarUsuario(
        usuario: string,
        input: ActualizarUsuarioInput,
    ): Promise<Usuario> {
        const usuarioExistente = await this.prisma.usuario.findUnique({
            where: { usuario },
        });
        if (!usuarioExistente) {
            throw new HttpException(
                'El usuario no fue encontrado',
                HttpStatus.NOT_FOUND,
            );
        }
        const dataToUpdate: any = {};
        if (input.clave) {
            const salt = await bcrypt.genSalt();
            dataToUpdate.clave = await bcrypt.hash(input.clave, salt);
        }
        return this.prisma.usuario.update({
            where: { usuario },
            data: dataToUpdate,
            include: {
                personal: {
                    include: {
                        cargo: true,
                    }
                }
            }
        });
    }

    async borrarUsuario(usuario: string): Promise<void> {
        const usuarioExistente = await this.prisma.usuario.findUnique({
            where: { usuario },
        });
        if (!usuarioExistente) {
            throw new HttpException(
                'El usuario no fue encontrado',
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.usuario.delete({
            where: { usuario },
        });
    }
}