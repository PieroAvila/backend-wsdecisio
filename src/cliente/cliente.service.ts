import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Cliente } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CrearClienteInput } from "./crear-cliente.input";
import { ActualizarClienteInput } from "./actualizar-cliente.input";

@Injectable()
export class ClienteService {
    constructor(private prisma: PrismaService) {}

    async obtenerClientes(): Promise<Cliente[]> {
        return await this.prisma.cliente.findMany();
    }

    async obtenerConteoClientes() {
        const resultado = await this.prisma.cliente.aggregate({
            _count: {
                dniCliente: true,
            },
        });
        return Number(resultado._count.dniCliente) || 0;
    }

    async obtenerClientesPorDNI(dniCliente: string): Promise<Cliente[]> {
        return await this.prisma.cliente.findMany({
            where: {
                dniCliente: dniCliente,
            }
        });
    }

    async obtenerClientesPorNombre(nombre: string): Promise<Cliente[]> {
        return await this.prisma.cliente.findMany({
            where: {
                nombre: nombre,
            }
        });
    }

    async crearCliente(
        input: CrearClienteInput,
    ): Promise<void> {
        const {
            dniCliente,
            nombre,
            correo,
            telefono,
        } = input;
        const dniExistente = await this.prisma.cliente.findFirst({
            where: { dniCliente },
        });
        const dniExistente2 = await this.prisma.personal.findFirst({
            where: { dniPersonal: dniCliente },
        });
        const correoExistente = await this.prisma.cliente.findFirst({
            where: { correo },
        });
        const telefonoExistente = await this.prisma.cliente.findFirst({
            where: { telefono },
        });
        if (dniExistente || dniExistente2) {
            throw new HttpException(
                'El DNI ya existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        if (correoExistente) {
            throw new HttpException(
                'El correo ya existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        if (telefonoExistente) {
            throw new HttpException(
                'El telefono ya existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        try {
            await this.prisma.cliente.create({
                data: {
                    dniCliente,
                    nombre,
                    correo,
                    telefono,
                },
            });
        } catch (error) {
            throw new HttpException(
                `Error al registrar el cliente ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async actualizarCLiente(
        dniCliente: string,
        input: ActualizarClienteInput,
    ): Promise<Cliente> {
        const dniExistente = await this.prisma.cliente.findUnique({
            where: { dniCliente },
        });
        if (!dniExistente) {
            throw new HttpException(
                'El cliente no existe en la base de datos',
                HttpStatus.NOT_FOUND,
            );
        }
        return this.prisma.cliente.update({
            where: { dniCliente },
            data: {
                ...input,
            }
        });
    }

    async borrarCliente(dniCliente: string): Promise<void> {
        const clientes = await this.prisma.cliente.findMany({
            where: { dniCliente },
        });
        if (clientes.length === 0) {
            throw new HttpException(
                `El cliente con DNI ${dniCliente} no existe en la base de datos`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.cliente.deleteMany({
            where: { dniCliente },
        });
    }
}