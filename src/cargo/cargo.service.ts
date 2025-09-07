import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cargo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearCargoInput } from './crear-cargo.input';
import { ActualizarCargoInput } from './actualizar-cargo.input';

@Injectable()
export class CargoService {
  constructor(private prisma: PrismaService) {}

  async obtenerCargos(filtro?: {
    cargo?: string;
  }): Promise<Cargo[]> {
    let where: any = {};

    if (filtro?.cargo) {
      where.cargo = filtro.cargo;
    }

    const cargos = await this.prisma.cargo.findMany({
      where,
    });
    return cargos.map((c) => ({
      idCargo: c.idCargo,
      cargo: c.cargo,
      pagoHora: c.pagoHora,
    }));
    
  }

  async obtenerConteoCargos(filtro?: {
    cargo?: string;
  }) {

    let where: any = {};

    if (filtro?.cargo) {
      where.cargo = filtro.cargo;
    }
    
    const resultado = await this.prisma.cargo.aggregate({
      _count: {
        cargo: true,
      },
      where,
    });

    return Number(resultado._count.cargo) || 0;
  }

  async obtenerMontoTotalHora(cargo?: string): Promise<number> {
    const resultado = await this.prisma.cargo.aggregate({
      _sum: {
        pagoHora: true,
      },
      where: cargo
        ? {
            cargo: {
              equals: cargo,
            },
          }
        : undefined,
    });
    return Number(resultado._sum.pagoHora) || 0;
  }

  async obtenerCargoMejorPagado(): Promise<string | null> {
    const resultado = await this.prisma.cargo.findFirst({
      orderBy: {
        pagoHora: 'desc',
      },
      select: {
        cargo: true,
      },
    });
    return resultado?.cargo || null;
  }

  async crearCargo(input: CrearCargoInput): Promise<void> {
    const { cargo, pagoHora } = input;
    const cargoExistente = await this.prisma.cargo.findFirst({
      where: { cargo },
    });
    if (cargoExistente) {
      throw new HttpException(
        'El cargo ya existe en la base de datos',
        HttpStatus.CONFLICT,
      );
    }
    try {
      await this.prisma.cargo.create({
        data: {
          cargo,
          pagoHora,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Error al registrar el cargo ${error}`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async actualizarCargo(
    idCargo: number,
    input: ActualizarCargoInput,
  ): Promise<Cargo> {
    const cargoExistente = await this.prisma.cargo.findUnique({
      where: { idCargo },
    });
    if (!cargoExistente) {
      throw new HttpException(
        'El cargo no existe en la base de datos',
        HttpStatus.NOT_FOUND,
      );
    }

    return this.prisma.cargo.update({
      where: { idCargo },
      data: {
        ...input,
      },
    });
  }

  async borrarCargo(cargo: string): Promise<void> {
    const cargos = await this.prisma.cargo.findMany({
      where: { cargo },
    });
    if (cargos.length === 0) {
      throw new HttpException(
        `El cargo ${cargo} no existe en la base de datos`,
        HttpStatus.NOT_FOUND,
      );
    }
    await this.prisma.cargo.deleteMany({
      where: { cargo },
    });
  }
}
