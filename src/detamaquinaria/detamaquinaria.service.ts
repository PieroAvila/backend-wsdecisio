import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DetaMaquinariaData } from "./detamaquinaria.interface";
import { CrearDetaMaquinariaInput } from "./crear-detamaquinaria.input";

@Injectable()
export class DetaMaquinariaService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerDetaMaquinaria(): Promise<DetaMaquinariaData[]> {
        const detamaquinarias = await this.prisma.detaMaquinaria.findMany({
            include: {
                maquinaria: true,
                detaProyecto: {
                    include: {
                        proyecto: true,
                    }
                }
            }
        });

        return detamaquinarias.map((dmaq) => ({
            codProyecto: dmaq.detaProyecto?.codProyecto,
            codMaquinaria: dmaq.maquinaria?.codMaquinaria,
            descripcion: dmaq.maquinaria?.descripcion,
        }));
    }

    async obtenerConteoDetaMaquinarias(
        filtro?: {
            proyecto?: string;
            maquinaria?: number;
        }
    ): Promise<number> {
        let where: any = {};

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

    async obtenerMaquinariasDisponibles(): Promise<string[]>{
        const maquinarias = await this.prisma.maquinaria.findMany({
            where: { estado: 'DISPONIBLE'},
            select: {
                codMaquinaria: true,
            },
            distinct: ['codMaquinaria']
        });

        return maquinarias.map((m) => m.codMaquinaria)
    }
    
    async crearDetaMaquinaria(
        input: CrearDetaMaquinariaInput,
    ): Promise<void> {
        const {
            idDetaProyecto,
            idMaquinaria,
        } = input;
        const maquinariaEnUso = await this.prisma.maquinaria.findFirst({
            where: { idMaquinaria, estado : 'NO DISPONIBLE' }
        });
        if (maquinariaEnUso) {
            throw new HttpException(
                'La maquinaria no se encuentra disponible',
                HttpStatus.CONFLICT,
            );
        }
        
        try {
            await this.prisma.detaMaquinaria.create({
                data: {
                    idDetaProyecto,
                    idMaquinaria,
                }
            });
            await this.prisma.maquinaria.update({
                where: { idMaquinaria },
                data: {
                    estado: 'NO DISPONIBLE',
                },
            });
        } catch (error) {
            throw new HttpException(
                `Error al registrar el detalle de la maquinaria ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async borrarDetaMaquinaria(idDetaMaquinaria: number): Promise<void> {
        const detamaquinarias = await this.prisma.detaMaquinaria.findUnique({
            where: { idDetaMaquinaria },
        });
        if (!detamaquinarias) {
            throw new HttpException(
                `El detamaquinaria con ID ${idDetaMaquinaria} no se encuentra`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.detaMaquinaria.delete({
            where: { idDetaMaquinaria }
        });
    }
}