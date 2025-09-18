import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CrearDetaProyectoInput } from "./crear-detaproyecto.input";

@Injectable()
export class DetaProyectoService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerConteoDetaProyectos(filtro?: {
        proyecto?: string;
    }): Promise<number> {
        let where: any = {};

        if (filtro?.proyecto) {
            where.codProyecto = filtro.proyecto;
        }

        const resultado = await this.prisma.proyecto.aggregate({
            _count: {
                codProyecto: true,
            },
            where,
        })
        return Number(resultado._count.codProyecto) || 0;
    }

    async crearDetaProyecto(
        input: CrearDetaProyectoInput,
    ): Promise<void> {
        const {
            codProyecto,
            idDetaProyecto,
        } = input;
        const proyectoExistente = await this.prisma.proyecto.findFirst({
            where: { codProyecto },
        });
        if (!proyectoExistente) {
            throw new HttpException(
                'El proyecto no existe en la base de datos',
                HttpStatus.NOT_FOUND,
            );
        }
        try {
            await this.prisma.detaProyecto.create({
                data: {
                    idDetaProyecto,
                    codProyecto,
                },
            });
        } catch (error) {
            throw new HttpException(
                `Error al registrar el detaproyecto ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async borrarDetaProyecto(idDetaProyecto: number): Promise<void> {
        const detalles = await this.prisma.detaProyecto.findMany({
            where: { idDetaProyecto },
        });
        if (detalles.length === 0) {
            throw new HttpException(
                `El detalle con ID ${idDetaProyecto} no existe en la base de datos`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.detaProyecto.deleteMany({
            where: { idDetaProyecto },
        });
    }
}