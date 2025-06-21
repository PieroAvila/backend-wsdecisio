import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cargo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CrearCargoInput } from './crear-cargo.input';

@Injectable()
export class CargoService {
  constructor(private prisma: PrismaService) {}

  async obtenerCargos(): Promise<Cargo[]> {
    return this.prisma.cargo.findMany();
  }

  async obtenerConteoCargos() {
    const resultado = await this.prisma.cargo.aggregate({
      _count: {
        cargo: true,
      },
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

  async obtenerCargoPorNombre(cargo: string): Promise<Cargo | null> {
    return this.prisma.cargo.findFirst({
      where: {
        cargo: {
          equals: cargo,
        },
      },
    });
  }

  async crearCargo(input: CrearCargoInput): Promise<void> {
    const { cargo, pagoHora } = input;
    const cargoExistente = await this.prisma.cargo.findFirst({
      where: { cargo },
    });
    if(cargoExistente) {
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
        'Error al registrar el cargo',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  
}
