import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MaterialService {
    constructor(private readonly prisma: PrismaService) {}
    
    async obtenerMateriales(filtro?: {
        codigo?: string;
    }) {
        let where: any = {};

        if (filtro?.codigo) {
            where.codMaterial = filtro.codigo;
        }

        const materiales = await this.prisma.material.findMany({
            where,
        })

        return materiales;
    }

    async obtenerConteoMateriales(
        filtro?: {
            codigo?: string;
        }
    ): Promise<number> {
        let where: any = {};

        if (filtro?.codigo) {
            where.codMaterial = filtro.codigo;
        }

        const resultado = await this.prisma.material.aggregate({
            _sum: {
                cantidad: true,
            },
            where,
        });
        return Number(resultado._sum.cantidad) ?? 0;
    }

    crearMaterial
}