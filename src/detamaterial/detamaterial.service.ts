import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DetaMaterialData } from "./detamaterial.interface";
import { CrearDetaMaterialInput } from "./crear-detamaterial.input";
import { ActualizarDetaMaterialInput } from "./actualizar-detamaterial.input";

@Injectable()
export class DetaMaterialService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerDetaMaterial(
        filtro?: {
            proyecto: string;
        }
    ): Promise<DetaMaterialData[]> {
        let where: any = {};

        if (filtro?.proyecto) {
            where.detaProyecto = {
                codProyecto: filtro.proyecto,
            };
        }

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
                idDetaMaterial: true,
            },
            where,
        })
        return Number(resultado._count.idDetaMaterial) || 0;
    }

    async obtenerTotalMaterialUsado(filtro?: {
        proyecto?: string;
        material?: string;
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

        if (filtro?.material) {
            where.codMaterial = filtro.material;
        }

        const resultado = await this.prisma.detaMaterial.aggregate({
            _sum: {
                cantidadUsada: true,
            },
            where,
        });
        return Number(resultado._sum.cantidadUsada) || 0;
    }

    async obtenerMaterialesDisponibles(): Promise<string[]> {
        const materiales = await this.prisma.material.findMany({
            select: { codMaterial: true },
            distinct: ['codMaterial'],
        });
        return materiales.map((m) => m.codMaterial);
    }

    async obtenerProyectosDisponibles(): Promise<string[]> {
        const proyectos = await this.prisma.proyecto.findMany({
            select: { codProyecto: true },
            distinct: ['codProyecto'],
        });
        return proyectos.map((p) => p.codProyecto);
    }

    async crearDetaMaterial(
        input: CrearDetaMaterialInput,
    ): Promise<void> {
        const {
            idDetaProyecto,
            codMaterial,
            cantidad,
            cantidadUsada = 0,
        } = input;
        const detaproyectoExistente = await this.prisma.detaProyecto.findFirst({
            where: { idDetaProyecto },
        });
        const materialExistente = await this.prisma.material.findFirst({
            where: { codMaterial },
        });
        if (!detaproyectoExistente) {
            throw new HttpException(
                'El detaproyecto no existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        if (!materialExistente) {
            throw new HttpException(
                'El material no existe en la base de datos',
                HttpStatus.CONFLICT,
            );
        }
        if (cantidad > materialExistente.cantidad) {
            throw new HttpException(
                `Stock insuficiente. Stock actual: ${materialExistente.cantidad}`,
                HttpStatus.BAD_REQUEST,
            );
        }

        if (cantidadUsada > cantidad) {
            throw new HttpException(
                `${cantidadUsada} no puede ser mayor que la cantidad asignada (${cantidad})`,
                HttpStatus.BAD_REQUEST,
            );
        }
        const cantidadRestante = cantidad - cantidadUsada;

        try {
            await this.prisma.detaMaterial.create({
                data: {
                    idDetaProyecto,
                    codMaterial,
                    cantidad,
                    cantidadUsada,
                    cantidadRestante,
                }
            });
            await this.prisma.material.update({
                where: { codMaterial },
                data: {
                    cantidad: materialExistente.cantidad - cantidad,
                },
            });
        } catch (error) {
            throw new HttpException(
                `Error al registrar el detalle del material ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async actualizarDetaMaterial(
        idDetaMaterial: number,
        input: ActualizarDetaMaterialInput,
    ): Promise<DetaMaterialData[]> {
        const {
            cantidad,
            cantidadUsada = 0,
        } = input;
    
        const detaMaterialExistente = await this.prisma.detaMaterial.findUnique({
            where: { idDetaMaterial },
        });
        
        if (!detaMaterialExistente) {
            throw new HttpException(
                'El detalle de material no existe',
                HttpStatus.NOT_FOUND,
            );
        }
    
        const nuevaCantidad = cantidad ?? detaMaterialExistente.cantidad;
        const nuevaCantidadUsada = cantidadUsada ?? detaMaterialExistente.cantidadUsada;
        const nuevaCantidadRestante = nuevaCantidad - nuevaCantidadUsada;
    
        const material = await this.prisma.material.findUnique({
            where: { codMaterial: detaMaterialExistente.codMaterial },
        });
    
        if (!material) {
            throw new HttpException(
                'El material no cuenta con stock',
                HttpStatus.NOT_FOUND,
            );
        }
    
        const updateDetaMaterial = await this.prisma.detaMaterial.update({
            where: { idDetaMaterial },
            data: {
                cantidad: nuevaCantidad,
                cantidadUsada: nuevaCantidadUsada,
                cantidadRestante: nuevaCantidadRestante,
            },
            include: {
                material: true,
                detaProyecto: {
                    include: {
                        proyecto: true,
                    },
                },
            },
        });
    
        const updateMaterial = await this.prisma.material.update({
            where: { codMaterial: detaMaterialExistente.codMaterial },
            data: {
                cantidad: material.cantidad + nuevaCantidadRestante,
            },
        });
    
        const resultado: DetaMaterialData = {
            codProyecto: updateDetaMaterial.detaProyecto?.codProyecto ?? null,
            codMaterial: updateDetaMaterial.codMaterial,
            descripcion: updateDetaMaterial.material?.descripcion || '',
            cantidad: updateDetaMaterial.cantidad,
            cantidadUsada: updateDetaMaterial.cantidadUsada ?? 0,
            cantidadRestante: updateDetaMaterial.cantidadRestante ?? 0,
            cantidadDisponible: updateMaterial.cantidad, // ya actualizado
        };
        
        return [resultado];
    }
    
    async borrarDetaMaterial (idDetaMaterial: number): Promise<void> {
        const detalles = await this.prisma.detaMaterial.findUnique({
            where: { idDetaMaterial },
        });

        if (!detalles) {
            throw new HttpException(
                `El detalle con ID ${idDetaMaterial} no se encuentra`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.detaMaterial.delete({
            where: { idDetaMaterial }
        });
    }
}