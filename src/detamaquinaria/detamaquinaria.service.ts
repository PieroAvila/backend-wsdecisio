import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DetaMaquinariaData } from "./detamaquinaria.interface";
import { CrearDetaMaquinariaInput } from "./crear-detamaquinaria.input";

@Injectable()
export class DetaMaquinariaService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerDetaMaquinaria(
        filtro?: {
            desde?: string;
            hasta?: string;
            proyecto?: string;
            maquinaria?: number;
        }
    ): Promise<DetaMaquinariaData[]> {
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

        if (filtro?.maquinaria) {
            where.idMaquinaria = filtro.maquinaria;
        }

        const detamaquinarias = await this.prisma.detaMaquinaria.findMany({
            include: {
                maquinaria: true,
                detaProyecto: {
                    include: {
                        proyecto: true,
                    }
                }
            },
            where,
        });

        return detamaquinarias.map((dmaq) => ({
            idDetaMaquinaria: dmaq.idDetaMaquinaria,
            codProyecto: dmaq.detaProyecto?.codProyecto,
            codMaquinaria: dmaq.maquinaria?.codMaquinaria,
            descripcion: dmaq.maquinaria?.descripcion,
        }));
    }

    async obtenerConteoDetaMaquinarias(
        filtro?: {
            desde?: string;
            hasta?: string;
            proyecto?: string;
            maquinaria?: number;
        }
    ): Promise<number> {
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

        if (filtro?.maquinaria) {
            where.idMaquinaria = filtro.maquinaria;
        }
        
        const resultado = await this.prisma.detaMaquinaria.aggregate({
            _count: {
                idDetaMaquinaria: true,
            },
            where,
        });

        return Number(resultado._count.idDetaMaquinaria) || 0;
    }

    async obtenerMaquinariasDisponibles(): Promise<{ 
        idMaquinaria: number; 
        codMaquinaria: string; 
        descripcion: string; 
      }[]> {
        const maquinarias = await this.prisma.maquinaria.findMany({
          where: { estado: "DISPONIBLE" },
          select: {
            idMaquinaria: true,
            codMaquinaria: true,
            descripcion: true,
          },
          distinct: ["idMaquinaria"],
        });
      
        return maquinarias;
      }
      
    
    async crearDetaMaquinaria(
        input: CrearDetaMaquinariaInput,
    ): Promise<void> {
        const {
            idDetaProyecto,
            idMaquinaria,
        } = input;
    
        const maquinariaEnUso = await this.prisma.maquinaria.findFirst({
            where: { idMaquinaria, estado: 'NO DISPONIBLE' }
        });
        if (maquinariaEnUso) {
            throw new HttpException(
                'La maquinaria no se encuentra disponible',
                HttpStatus.CONFLICT,
            );
        }
    
        // Obtener último ID y sumarle 1
        const ultimo = await this.prisma.detaMaquinaria.findFirst({
            orderBy: { idDetaMaquinaria: 'desc' },
        });
        const nuevoId = ultimo ? ultimo.idDetaMaquinaria + 1 : 1;
    
        try {
            await this.prisma.detaMaquinaria.create({
                data: {
                    idDetaMaquinaria: nuevoId,
                    idDetaProyecto,
                    idMaquinaria,
                }
            });
    
            await this.prisma.maquinaria.update({
                where: { idMaquinaria },
                data: { estado: 'NO DISPONIBLE' },
            });
        } catch (error) {
            throw new HttpException(
                `Error al registrar el detalle de la maquinaria ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }
    

    async borrarDetaMaquinaria(idDetaMaquinaria: number): Promise<void> {
        const detamaquinaria = await this.prisma.detaMaquinaria.findUnique({
            where: { idDetaMaquinaria },
        });
    
        if (!detamaquinaria) {
            throw new HttpException(
                `El detamaquinaria con ID ${idDetaMaquinaria} no se encuentra`,
                HttpStatus.NOT_FOUND,
            );
        }
    
        // Guardamos el idMaquinaria para actualizar su estado luego
        const { idMaquinaria } = detamaquinaria;
    
        await this.prisma.detaMaquinaria.delete({
            where: { idDetaMaquinaria }
        });
    
        // Liberar la maquinaria
        await this.prisma.maquinaria.update({
            where: { idMaquinaria },
            data: { estado: 'DISPONIBLE' },
        });
    }
}