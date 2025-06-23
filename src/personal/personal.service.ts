import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { PersonalData } from "./personal.interface";

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

    
}