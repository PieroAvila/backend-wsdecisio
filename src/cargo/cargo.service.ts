import { Injectable } from '@nestjs/common';
import { Cargo } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
}
