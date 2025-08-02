import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Maquinaria } from "@prisma/client";
import { PrismaService } from "src/prisma/prisma.service";
import { ActualizarMaquinariaInput } from "./actualizar-maquinaria.input";
import { CrearMaquinariaInput } from "./crear-maquinaria.input";

@Injectable()
export class MaquinariaService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerMaquinarias(filtro?: {
        estado?: string;
        codigo?: string;
    }) {
        let where: any = {};

        if (filtro?.estado) {
            where.estado = filtro.estado;
        }

        if (filtro?.codigo) {
            where.codMaquinaria = filtro.codigo;
        }

        const maquinarias = await this.prisma.maquinaria.findMany({
            where,
        })

        return maquinarias;
    }

    async obtenerConteoMaquinarias(filtro?: {
        codigo?: string;
    }): Promise<number> {
        let where: any = {};

        if (filtro?.codigo) {
            where.codMaquinaria = filtro.codigo;
        }

        const resultado = await this.prisma.maquinaria.aggregate({
            _count: {
                idMaquinaria: true,
            },
            where,
        });

        return Number(resultado._count.idMaquinaria) ?? 0;
    }

    async crearMaquinaria(
        input: CrearMaquinariaInput,
    ): Promise<void> {
        const { codMaquinaria, descripcion, cantidad, estado } = input;
        const maquinariaExistente = await this.prisma.maquinaria.findMany({
            where: { codMaquinaria, descripcion },
        });

        if (maquinariaExistente.length > 0) {
            const nuevasUnidades = Array.from({ length: cantidad }, () => ({
                codMaquinaria,
                descripcion,
                estado,
            }));

            await this.prisma.maquinaria.createMany({
                data: nuevasUnidades,
            })
        } else {
            const nuevasUnidades = Array.from({ length: cantidad }, () => ({
                codMaquinaria,
                descripcion,
                estado,
            }));

            await this.prisma.maquinaria.createMany({
                data: nuevasUnidades,
            })
        }
    }

    async actualizarMaquinaria(
        idMaquinaria: number,
        input: ActualizarMaquinariaInput,
    ): Promise<Maquinaria> {
        const maquinariaExistente = await this.prisma.maquinaria.findUnique({
            where: { idMaquinaria },
        });

        if (!maquinariaExistente) {
            throw new HttpException(
                'La maquinaria no existe en la base de datos',
                HttpStatus.NOT_FOUND,
            );
        }

        return this.prisma.maquinaria.update({
            where: { idMaquinaria },
            data: {
                ...input,
            },
        });
    }

    async borrarMaquinaria(idMaquinaria: number): Promise<void> {
        const maquinarias = await this.prisma.maquinaria.findMany({
            where: { idMaquinaria },
        });
        if (maquinarias.length === 0) {
            throw new HttpException(
                `La maquinaria con codigo ${idMaquinaria} no existe en la base de datos`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.maquinaria.deleteMany({
            where: { idMaquinaria },
        });
    }
}