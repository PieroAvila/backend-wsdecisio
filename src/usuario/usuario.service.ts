import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { UsuarioData } from "./usuario.interface";

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

    async crearUsuario(
        
    ): Promise<void> {

    }

}