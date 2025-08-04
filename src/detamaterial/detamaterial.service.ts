import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DetaMaterialData } from "./detamaterial.interface";

@Injectable()
export class DetaMaterialService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerDetaMaterial(): Promise<DetaMaterialData[]> {
        const detamateriales = await this.prisma.detaMaterial.findMany({
            include: {
                detaProyecto: {
                    include: {
                        proyecto: true,
                    }
                },
                material: true,
            },
        });
        return detamateriales.map((dmat) => ({
            codProyecto: dmat.detaProyecto?.codProyecto,
            codMaterial: dmat.codMaterial,
            descripcion: dmat.material?.descripcion || '',
            cantidad: dmat.cantidad,
            cantidadUsada: dmat.cantidadUsada ?? 0,
            cantidadRestante: dmat.cantidadRestante ?? 0,
            cantidadDisponible: dmat.material?.cantidad ?? 0,
        }));
    }

    async obtenerConteoDetaMateriales(filtro?: {
        proyecto?: string;
    }): Promise<number> {
        let where: any = {};

        if (filtro?.proyecto) {
            where.detaProyecto = {
                codProyecto: filtro.proyecto,
            };
        }
        const resultado = await this.prisma.detaMaterial.aggregate({
            _count: {
                codMaterial: true,
            },
            where,
        })
        return Number(resultado._count.codMaterial) || 0;
    }

    async obtenerTotalMaterialUsado(filtro?: {
        proyecto?: string;
        desde?: string;
        hasta?: string;
    }): Promise<number> {
        let where: any = {};

        if (filtro?.desde && filtro?.hasta) {
            const desde = new Date(filtro.desde);
            const hasta = new Date(filtro.hasta);
            hasta.setHours(23, 59, 59, 999);

            where.detaProyecto = {
                ...(where.detaProyecto || {}),
                proyecto: {
                    fechaInicio: {
                        gte: desde,
                        lte: hasta,
                    },
                },
            };
        }

        if (filtro?.proyecto) {
            where.detaProyecto = {
                codProyecto: filtro.proyecto,
            }
        }
        const resultado = await this.prisma.detaMaterial.aggregate({
            _sum: {
                cantidadUsada: true,
            },
            where,
        });
        return Number(resultado._sum.cantidadUsada) || 0;
    }
}