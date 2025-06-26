import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PersonalData } from "./personal.interface";
import { CrearPersonalInput } from "./crear-personal.input";
import { Cliente, Proveedor } from "@prisma/client";

@Injectable()
export class PersonalService {
    constructor(private prisma: PrismaService) {}

    async obtenerPersonales(): Promise<PersonalData[]> {
        const personales = await this.prisma.personal.findMany({
            include: {
                cargo: true,
            },
        });

        return personales.map((p) => ({
            dniPersonal: p.dniPersonal,
            nombre: p.nombre,
            apellido: p.apellido,
            edad: p.edad,
            correo: p.correo,
            telefono: p.telefono,
            cuentaBcp: p.cuentaBcp,
            idCargo: p.idCargo,
            cargo: p.cargo?.cargo || '',
        }));
    }

    async obtenerConteoPersonales() {
        const resultado = await this.prisma.personal.aggregate({
            _count: {
                dniPersonal: true,
            },
        });
        return Number(resultado._count.dniPersonal) || 0;
    }

    async obtenerConteoPersonalesConCargo(): Promise<number> {
        return this.prisma.personal.count({
            where: {
                idCargo: {
                    not: null,
                },
            },
        });
    }

    async obtenerConteoPersonalesSinCargo(): Promise<number> {
        return this.prisma.personal.count({
            where: {
                idCargo: null,
            },
        });
    }

    async obtenerMontoTotalPorHora(filtro?: {
        edad?: number;
        cargo?: string;
    }): Promise<number> {
        const personales = await this.prisma.personal.findMany({
            where: {
                ...(filtro?.edad && { edad: filtro.edad }),
                ...(filtro?.cargo && {
                    cargo: {
                        cargo: {
                            equals: filtro.cargo,
                        },
                    },
                }),
            },
            include: {
                cargo: true,
            },
        });
        const total = personales.reduce(
            (sum, p) => sum + Number(p.cargo?.pagoHora ?? 0), 0,
        );
        return total;
    }
    
    async obtenerMontoTotalPorDia(filtro?: {
        edad?: number;
        cargo?: string;
    }): Promise<number> {
        const personales = await this.prisma.personal.findMany({
            where: {
                ...(filtro?.edad && { edad: filtro.edad }),
                ...(filtro?.cargo && {
                    cargo: {
                        cargo: {
                            equals: filtro.cargo,
                        },
                    },
                }),
            },
            include: {
                cargo: true,
            },
        });
        const total = personales.reduce(
            (sum, p) => sum + Number(p.cargo?.pagoHora ?? 0),0,
        );
        return total * 8;
    }

    async obtenerMontoTotalPorSemana(filtro?: {
        edad?: number;
        cargo?: string;
    }): Promise<number> {
        const personales = await this.prisma.personal.findMany({
            where: {
                ...(filtro?.edad && { edad: filtro.edad }),
                ...(filtro?.cargo && {
                    cargo: {
                        cargo: {
                            equals: filtro.cargo,
                        },
                    },
                }),
            },
            include: {
                cargo: true,
            },
        });
        const total = personales.reduce(
            (sum, p) => sum + Number(p.cargo?.pagoHora ?? 0),
            0,
        );
        return (total * 8) * 6;
    }

    async obtenerMontoTotalPorMes(filtro?: {
        edad?: number;
        cargo?: string;
    }): Promise<number> {
        const personales = await this.prisma.personal.findMany({
            where: {
                ...(filtro?.edad && { edad: filtro.edad }),
                ...(filtro?.cargo && {
                    cargo: {
                        cargo: {
                            equals: filtro.cargo,
                        },
                    },
                }),
            },
            include: {
                cargo: true,
            },
        });
        const total = personales.reduce(
            (sum, p) => sum + Number(p.cargo?.pagoHora ?? 0),
            0,
        );
        return ((total * 8) * 6)*4;
    }

    async obtenerPersonalesPorCargo(cargo: string): Promise<PersonalData[]> {
        const personales = await this.prisma.personal.findMany({
            where: {
                cargo: {
                    cargo: {
                        equals: cargo,
                    },
                },
            },
            include: {
                cargo: true,
            },
        });
        return personales.map((p) => ({
            dniPersonal: p.dniPersonal,
            nombre: p.nombre,
            apellido: p.apellido,
            edad: p.edad,
            correo: p.correo,
            telefono: p.telefono,
            cuentaBcp: p.cuentaBcp,
            idCargo: p.idCargo,
            cargo: p.cargo?.cargo || '',
        }));
    }

    async obtenerPersonalesPorEdad(edad: number): Promise<PersonalData[]> {
        const personales = await this.prisma.personal.findMany({
            where: {
                edad: edad,
            },
            include: {
                cargo: true,
            },
        });
        return personales.map((p) => ({
            dniPersonal: p.dniPersonal,
            nombre: p.nombre,
            apellido: p.apellido,
            edad: p.edad,
            correo: p.correo,
            telefono: p.telefono,
            cuentaBcp: p.cuentaBcp,
            idCargo: p.idCargo,
            cargo: p.cargo?.cargo || '',
        }));
    }

    async obtenerCargosDisponibles(): Promise<string[]> {
        const cargos = await this.prisma.cargo.findMany({
            select: { cargo: true },
            distinct: ['cargo'],
        });
        return cargos.map((c) => c.cargo);
    }

    async obtenerEdadesDisponibles(): Promise<number[]> {
        const edades = await this.prisma.personal.findMany({
            select: { edad: true },
            distinct: ['edad'],
            orderBy: { edad: 'asc' }
        })
        return edades.map((e) => e.edad);
    }

    async crearPersonal(
        input: CrearPersonalInput,
        cliente: Cliente,
        proveedor: Proveedor,
    ): Promise<void> {
        const {
            dniPersonal,
            nombre,
            apellido,
            edad,
            correo,
            telefono,
            cuentaBcp,
            idCargo,
        } = input;
        const { dniCliente } = cliente;
        const dniExistente = await this.prisma.personal.findFirst({
            where: { dniPersonal },
        });
        const dniExistente2 = await this.prisma.cliente.findFirst({
            where: { dniCliente },
        });
        
    }
}