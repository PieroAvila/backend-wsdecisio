import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Proveedor } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { CrearProveedorInput } from "./crear-proveedor.input";
import { ActualizarProveedorInput } from "./actualizar-proveedor.input";

@Injectable()
export class ProveedorService {
    constructor(private prisma: PrismaService) {}

    async obtenerProveedores(): Promise<Proveedor[]> {
        return this.prisma.proveedor.findMany();
    }

    async obtenerConteoProveedores() {
        const resultado = await this.prisma.proveedor.aggregate({
            _count: {
                rucProveedor: true,
            },
        });
        return Number(resultado._count.rucProveedor) || 0;
    }

    async obtenerProveedoresPorRUC(rucProveedor: string): Promise<Proveedor | null> {
        return this.prisma.proveedor.findFirst({
            where: {
                rucProveedor: {
                    equals: rucProveedor,
                }
            }
        });
    }

    async obtenerProveedoresPorRazonSocial(razonSocial: string): Promise<Proveedor | null> {
        return this.prisma.proveedor.findFirst({
            where: {
                razonSocial: {
                    equals: razonSocial,
                }
            }
        });
    }

    async crearProveedor(
        input: CrearProveedorInput,
    ): Promise<void> {
        const {
            rucProveedor,
            razonSocial,
            cuentaBcp,
        } = input;
        const rucExistente = await this.prisma.proveedor.findUnique({
            where: { rucProveedor },
        });
        const razonExistente = await this.prisma.proveedor.findFirst({
            where: { razonSocial },
        });
        const cuentaExistente = await this.prisma.proveedor.findFirst({
            where: { cuentaBcp },
        });
        if (rucExistente || razonExistente) {
            throw new HttpException(
                'La empresa ya existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        if (cuentaExistente) {
            throw new HttpException(
                'La cuenta BCP ya existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        try {
            await this.prisma.proveedor.create({
                data: {
                    rucProveedor,
                    razonSocial,
                    cuentaBcp,
                },
            });
        } catch (error) {
            throw new HttpException(
                `Error al registrar al proveedor ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async actualizarProveedor(
        rucProveedor: string,
        input: ActualizarProveedorInput,
    ): Promise<Proveedor> {
        const rucExistente = await this.prisma.proveedor.findUnique({
            where: { rucProveedor },
        });
        if (!rucExistente) {
            throw new HttpException(
                'El proveedor no existe en la base de datos',
                HttpStatus.NOT_FOUND,
            );
        }
        if (input.cuentaBcp) {
            const cuentaExistente = await this.prisma.proveedor.findFirst({
                where: {
                    cuentaBcp: input.cuentaBcp,
                    rucProveedor: { not: rucProveedor },
                },
            });
            if (cuentaExistente) {
                throw new HttpException(
                    'La cuenta BCP ya existe en la base de datos',
                    HttpStatus.CONFLICT,
                );
            }
        }
        return this.prisma.proveedor.update({
            where: { rucProveedor },
            data: {
                ...input,
            }
        });
    }

    async borrarProveedor(rucProveedor: string): Promise<void> {
        const proveedores = await this.prisma.proveedor.findMany({
            where: { rucProveedor },
        });
        if (proveedores.length === 0) {
            throw new HttpException(
                `El proveedor con RUC ${rucProveedor} no existe en la base de datos`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.proveedor.deleteMany({
            where: { rucProveedor },
        })
    }
}