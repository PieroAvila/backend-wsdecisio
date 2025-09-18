import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MantenimientoData } from "./mantenimiento.interface";
import { CrearMantenimientoInput } from "./crear-mantenimientos.input";
import { ActualizarMantenimientoInput } from "./actualizar-mantenimiento.input";

@Injectable()
export class MantenimientoService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerMantenimiento(
        filtro?: {
            desde?: string;
            hasta?: string;
            maquinaria?: number;
            estado?: string;
        }
    ): Promise<MantenimientoData[]> {
        let where: any = {};

        if (filtro?.desde && filtro?.hasta) {
            const desde = new Date(filtro.desde);
            const hasta = new Date(filtro.hasta);
            hasta.setHours(23, 59, 59, 999);

            where.fechaInicio = {
                gte: desde,
                lte: hasta,
            };
        }

        if (filtro?.maquinaria) {
            where.idMaquinaria = filtro.maquinaria;
        }

        if (filtro?.estado) {
            where.estado = filtro.estado;
        }

        const mantenimientos = await this.prisma.mantenimiento.findMany({
            include: {
                maquinaria: true,
            },
            where,
        });
        return mantenimientos.map((m) => ({
            idMantenimiento: m.idMantenimiento,
            codMaquinaria: m.maquinaria?.codMaquinaria,
            maquina: m.maquinaria?.descripcion,
            fechaInicio: m.fechaInicio.toISOString().split('T')[0],
            fechaFin: m.fechaFin?.toISOString().split('T')[0] || '',
            estado: m.estado,
        }));
    }

    async obtenerConteoMantenimientos(
        filtro?: {
            desde?: string;
            hasta?: string;
            maquinaria?: number;
            estado?: string;
        }
    ): Promise<number> {
        let where: any = {};

        if (filtro?.desde && filtro?.hasta) {
            const desde = new Date(filtro.desde);
            const hasta = new Date(filtro.hasta);
            hasta.setHours(23, 59, 59, 999);

            where.fechaInicio = {
                gte: desde,
                lte: hasta,
            };
        }

        if (filtro?.maquinaria) {
            where.idMaquinaria = filtro.maquinaria;
        }

        if (filtro?.estado) {
          where.estado = filtro.estado;
      }

        const resultado = await this.prisma.mantenimiento.aggregate({
            _count: {
                idMantenimiento: true,
            },
            where,
        })
        return Number(resultado._count.idMantenimiento) || 0;
    }

    async obtenerEstadosDisponibles(): Promise<string[]> {
      const mantenimientos = await this.prisma.mantenimiento.findMany({
        select: { estado: true },
        distinct: ['estado'],
      });
      return mantenimientos.map((m) => m.estado);
    }

    async generarIdentificador(): Promise<number> {
      try {
        const ultimo = await this.prisma.mantenimiento.findFirst({
          orderBy: { idMantenimiento: 'desc' },
          select: { idMantenimiento: true }
        });
        const nuevoId = (ultimo?.idMantenimiento ?? 0) + 1;
        return nuevoId;
      } catch (error) {
        throw new Error(`Error generando el identificador`);
      }
    }

    async crearMantenimiento(
        input: CrearMantenimientoInput,
      ): Promise<void> {
        const { idMantenimiento ,idMaquinaria, fechaInicio, fechaFin, estado } = input;
      
        const maquinariaExistente = await this.prisma.maquinaria.findFirst({
          where: { idMaquinaria },
        });
      
        if (!maquinariaExistente) {
          throw new HttpException(
            'La maquinaria no existe en la base de datos',
            HttpStatus.CONFLICT,
          );
        }
      
        if (maquinariaExistente.estado === 'NO DISPONIBLE') {
          throw new HttpException(
            'La maquinaria no se encuentra disponible',
            HttpStatus.CONFLICT,
          );
        }
      
        try {
          await this.prisma.mantenimiento.create({
            data: {
              idMantenimiento,
              idMaquinaria,
              fechaInicio: new Date(fechaInicio),
              fechaFin: fechaFin ? new Date(fechaFin) : null,
              estado,
            },
            include: {
              maquinaria: true,
            },
          });

          await this.prisma.maquinaria.update({
            where: { idMaquinaria },
            data: {
              estado: 'EN MANTENIMIENTO',
            },
          });
        } catch (error) {
          throw new HttpException(
            `Error al registrar el mantenimiento: ${error}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      
      async actualizarMantenimiento(
        idMantenimiento: number,
        input: ActualizarMantenimientoInput,
      ): Promise<MantenimientoData[]> {
        const { fechaFin, estado } = input;
      
        const mantenimientoExistente = await this.prisma.mantenimiento.findUnique({
          where: { idMantenimiento },
          include: { maquinaria: true },
        });
      
        if (!mantenimientoExistente) {
          throw new HttpException(
            'El mantenimiento no existe',
            HttpStatus.NOT_FOUND,
          );
        }

        if (fechaFin && new Date(fechaFin) <= new Date(mantenimientoExistente.fechaInicio)) {
          throw new HttpException(
            'La fecha de fin debe ser mayor a la fecha de inicio',
            HttpStatus.BAD_REQUEST,
          );
        }
      
        if (estado === 'FINALIZADO') {
          if (!fechaFin) {
            throw new HttpException(
              'Debe asignar una fecha de fin para finalizar el mantenimiento',
              HttpStatus.BAD_REQUEST,
            );
          }
          const hoy = new Date();
          if (new Date(fechaFin) > hoy) {
            throw new HttpException(
              'No se puede finalizar el mantenimiento antes de la fecha de fin',
              HttpStatus.BAD_REQUEST,
            );
          }
        }
      
        const updateMantenimiento = await this.prisma.mantenimiento.update({
          where: { idMantenimiento },
          data: {
            fechaFin: fechaFin ? new Date(fechaFin) : null,
            estado,
          },
          include: { maquinaria: true },
        });
      
        if (estado === 'FINALIZADO') {
          await this.prisma.maquinaria.update({
            where: { idMaquinaria: mantenimientoExistente.idMaquinaria },
            data: { estado: 'DISPONIBLE' },
          });
        }

        const mantenimientos = await this.prisma.mantenimiento.findMany({
          include: { maquinaria: true },
        });
      
        return mantenimientos.map((m) => ({
          idMantenimiento: m.idMantenimiento,
          codMaquinaria: m.maquinaria?.codMaquinaria,
          maquina: m.maquinaria?.descripcion,
          fechaInicio: m.fechaInicio.toISOString().split('T')[0],
          fechaFin: m.fechaFin?.toISOString().split('T')[0] || '',
          estado: m.estado,
        }));
      }

    async borrarMantenimiento(idMantenimiento: number): Promise<void> {
      const mantenimientos = await this.prisma.mantenimiento.findMany({
        where: { idMantenimiento }
      });
      if (!mantenimientos) {
        throw new HttpException(
          `El mantenimiento con ID ${idMantenimiento} no se encuentra en la base de datos`,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.prisma.mantenimiento.delete({
        where: { idMantenimiento }
      });
    }
}