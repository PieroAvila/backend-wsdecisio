import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Cliente } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CrearClienteInput } from "./crear-cliente.input";
import { ActualizarClienteInput } from "./actualizar-cliente.input";
import { ClienteData } from "./cliente.interface";

@Injectable()
export class ClienteService {
    constructor(private prisma: PrismaService) {}

    async obtenerClientes(filtro?: {
        dni?: string;
        nombre?: string;
    }): Promise<ClienteData[]> {
        let where: any = {};

        if (filtro?.dni) {
            where.dniCliente = filtro.dni;
        }

        if (filtro?.nombre) {
            where.nombre = filtro.nombre;
        }

        const clientes = await this.prisma.cliente.findMany({
            include: {
                tipoCliente: true,
            },
            where,
        });

        const clienteData: ClienteData[] = clientes.map((c) => ({
            dniCliente: c.dniCliente,
            cliente: c.nombre +" "+ c.apellido,
            tipoCliente: c.tipoCliente?.tipoCliente,
            ruc: c.ruc || '',
            razonSocial: c.razonSocial || '',
        }));
        return clienteData;
    }

    async obtenerConteoClientes(filtro?: {
        dni?: string;
        nombre?: string;
    }) {
        let where: any = {};

        if (filtro?.dni) {
            where.dniCliente = filtro.dni;
        }

        if (filtro?.nombre) {
            where.nombre = filtro.nombre;
        }

        const resultado = await this.prisma.cliente.aggregate({
            _count: {
                dniCliente: true,
            },
            where,
        });
        return Number(resultado._count.dniCliente) || 0;
    }

    async crearCliente(
        input: CrearClienteInput,
    ): Promise<void> {
        const {
            dniCliente,
            nombre,
            apellido,
            idTipoCliente,
            ruc,
            razonSocial,
        } = input;
        const dniExistente = await this.prisma.cliente.findFirst({
            where: { dniCliente },
        });
        const dniExistente2 = await this.prisma.personal.findFirst({
            where: { dniPersonal: dniCliente },
        });
        if (dniExistente || dniExistente2) {
            throw new HttpException(
                'El DNI ya existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        try {
            await this.prisma.cliente.create({
                data: {
                    dniCliente,
                    nombre,
                    apellido,
                    idTipoCliente,
                    ruc,
                    razonSocial,
                },
            });
        } catch (error) {
            throw new HttpException(
                `Error al registrar el cliente ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async actualizarCliente(
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