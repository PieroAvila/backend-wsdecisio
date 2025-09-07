import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CompraData } from "./compra.interface";
import { CrearCompraInput } from "./crear-compra.input";

@Injectable()
export class CompraService{
    constructor(private readonly prisma: PrismaService) {}

    async obtenerCompras(filtro?: {
      desde?: string;
      hasta?: string;
      ruc?: string;
    }): Promise<CompraData[]> {
      let where: any = {};
      
      if (filtro?.desde && filtro?.hasta) {
        const desde = new Date(filtro.desde);
        const hasta = new Date(filtro.hasta);
        hasta.setHours(23, 59, 59, 999);

        where.fechaCompra = {
          gte: desde,
          lte: hasta,
        }
      }
      if (filtro?.ruc) {
        where.rucProveedor = filtro.ruc;
      }

      const compras = await this.prisma.compra.findMany({
          include: {
                proveedor: true,
            },
            where,
        });
        return compras.map((c) => ({
            codCompra: c.codCompra,
            rucProveedor: c.rucProveedor || '',
            razonSocial: c.proveedor?.razonSocial || '',
            costoTotal: c.costoTotal,
            fechaCompra: c.fechaCompra.toISOString().split('T')[0],
        }))
    }

    async obtenerConteoCompras(filtro?: {
      desde?: string;
      hasta?: string;
      ruc?: string;
    }): Promise<number> {
        let where: any= {};

        if (filtro?.desde && filtro?.hasta) {
          const desde = new Date(filtro.desde);
          const hasta = new Date(filtro.hasta);
          hasta.setHours(23, 59, 59, 999);

          where.fechaCompra = {
            gte: desde,
            lte: hasta,
          };
        }

        if (filtro?.ruc) {
          where.rucProveedor = filtro.ruc;
        }

        const resultado = await this.prisma.compra.aggregate({
          _count: {
            codCompra: true,
          },
          where,
        })
        return Number(resultado._count.codCompra) || 0;
    }

    async obtenerMontoCompras(filtro: {
      desde?: string;
      hasta?: string;
      ruc?: string;
    }): Promise<number> {
      const where: any = {};

      if (filtro?.desde && filtro.hasta) {
        const desde = new Date(filtro.desde);
        const hasta = new Date(filtro.hasta);
        hasta.setHours(23, 59, 59, 999);
        
        where.fechaCompra = {
          gte: desde,
          lte: hasta,
        }; 
      }

      if (filtro?.ruc) {
        where.rucProveedor = filtro.ruc;
      }

      const resultado = await this.prisma.compra.aggregate({
        _sum: {
          costoTotal: true,
        },
        where,
      });

      return Number(resultado._sum.costoTotal) || 0;
    }

    async obtenerProveedoresDisponibles(): Promise<string[]> {
      const proveedores = await this.prisma.proveedor.findMany({
        select: {
          rucProveedor: true,
        },
        distinct: ['rucProveedor']
      });

      return proveedores.map((p) => p.rucProveedor)
    }

    async obtenerProveedoresActivos(): Promise<number> {
      return this.prisma.proveedor.count({
        where: {
          Compra: {
            some: {},
          }
        }
      })
    }

    async obtenerProveedoresInactivos(): Promise<number> {
      return this.prisma.proveedor.count({
        where: {
          Compra: {
            none: {},
          }
        }
      })
    }

    async crearCompra(
      input: CrearCompraInput,
    ): Promise<void> {
      const {
        codCompra,
        rucProveedor,
        costoTotal,
        fechaCompra,
      } = input;

      const codigoExistente = await this.prisma.compra.findFirst({
        where: { codCompra },
      });

      if (codigoExistente) {
        throw new HttpException(
          'El codigo de compra ya existe en la base de datos',
          HttpStatus.CONFLICT,
        );
      }
      try {
        await this.prisma.compra.create({
          data: {
            codCompra,
            rucProveedor,
            costoTotal,
            fechaCompra: new Date(fechaCompra),
          },
        })
      } catch (error) {
        throw new HttpException(
          `Error al registrar la compra ${error}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    }

    async borrarCompra(codCompra: string): Promise<void> {
      const compras = await this.prisma.compra.findMany({
        where: { codCompra },
      });
      if (compras.length === 0) {
        throw new HttpException(
          `La compra con codigo ${codCompra} no existe en la base de datos`,
          HttpStatus.NOT_FOUND,
        );
      }
      await this.prisma.compra.deleteMany({
        where: { codCompra },
      });
    }
}