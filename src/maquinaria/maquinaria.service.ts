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
        estado?: string;
    }): Promise<number> {
        let where: any = {};

        if (filtro?.estado) {
            where.estado = filtro.estado;
        }

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

    async obtenerCodigosYDescripcionMaquinaria(): Promise<{ codMaquinaria: string; descripcion: string }[]> {
        const maquinarias = await this.prisma.maquinaria.findMany({
          select: { codMaquinaria: true, descripcion: true },
          orderBy: { descripcion: 'asc' },
        });
        const mapa = new Map<string, { codMaquinaria: string; descripcion: string }>();
      
        for (const m of maquinarias) {
          const clave = m.descripcion.trim().toLowerCase();
          if (!mapa.has(clave)) {
            mapa.set(clave, {
              codMaquinaria: m.codMaquinaria,
              descripcion: m.descripcion.trim(),
            });
          }
        }
        return Array.from(mapa.values());
      }

    async obtenerEstados(): Promise<string[]> {
        const estados = await this.prisma.maquinaria.findMany({
            select: { estado: true},
            distinct: ['estado'],
            orderBy: { estado: 'desc'}
        });
        return estados.map((es) => es.estado);
    }

    async obtenerMaquinariasEnMantenimiento(filtro?: { codigo?: string }): Promise<number> {
        let where: any = { estado: "EN MANTENIMIENTO" };
        if (filtro?.codigo) {
            where.codMaquinaria = filtro.codigo;
        }
        const resultado = await this.prisma.maquinaria.count({
            where,
        });
        return resultado;
    }

    async obtenerMaquinariasDisponibles(filtro?: {codigo?: string }): Promise<number> {
        let where: any = { estado: "DISPONIBLE" };
        if (filtro?.codigo) {
            where.codMaquinaria = filtro.codigo;
        }
        const resultado = await this.prisma.maquinaria.count({
            where,
        });
        return resultado;
    }

    async obtenerMaquinariasEnUso(filtro?: {codigo?: string}): Promise<number> {
        let where: any = { estado: "EN USO" };
        if (filtro?.codigo) {
            where.codMaquinaria = filtro.codigo;
        }
        const resultado = await this.prisma.maquinaria.count({
            where,
        });
        return resultado;
    }

    async generarIdentificador(): Promise<number> {
        try {
            const ultimo = await this.prisma.maquinaria.findFirst({
                orderBy: { idMaquinaria: 'desc'},
                select: { idMaquinaria: true }
            });

            const nuevoId = (ultimo?.idMaquinaria ?? 0) + 1;
            return nuevoId;
        } catch (error) {
            throw new Error(`Error generando el identificador`);
        }
    }

    async crearMaquinaria(
        input: CrearMaquinariaInput,
    ): Promise<void> {
        const { codMaquinaria, descripcion, cantidad, estado } = input;
        let ultimoId = (await this.prisma.maquinaria.findFirst({
            orderBy: { idMaquinaria: 'desc' },
            select: { idMaquinaria: true },
        }))?.idMaquinaria ?? 0;
    
        const nuevasUnidades = Array.from({ length: cantidad }, () => {
            ultimoId++;
            return {
                idMaquinaria: ultimoId,
                codMaquinaria,
                descripcion,
                estado: estado ?? 'DISPONIBLE',
            };
        });
    
        await this.prisma.maquinaria.createMany({
            data: nuevasUnidades,
        });
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