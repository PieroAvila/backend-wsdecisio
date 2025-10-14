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
      comprobante?: string;
      proyecto?: string;
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
      if (filtro?.comprobante) {
        where.comprobante = {
          comprobante: filtro.comprobante,
        }
      }
      if (filtro?.proyecto) {
        where.codProyecto = filtro.proyecto;
      }

      const compras = await this.prisma.compra.findMany({
          include: {
                proveedor: true,
                comprobante: true,
            },
            where,
        });
        return compras.map((c) => ({
            codCompra: c.codCompra,
            comprobante: c.comprobante?.comprobante || '',
            rucProveedor: c.rucProveedor || '',
            razonSocial: c.proveedor?.razonSocial || '',
            costoTotal: c.costoTotal,
            codProyecto: c.codProyecto || '',
            fechaCompra: c.fechaCompra.toISOString().split('T')[0],
        }))
    }

    async obtenerConteoCompras(filtro?: {
      desde?: string;
      hasta?: string;
      ruc?: string;
      comprobante?: string;
      proyecto?: string;
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
        if (filtro?.comprobante) {
          where.comprobante = {
            comprobante: filtro.comprobante,
          }
        }
        if (filtro?.proyecto) {
          where.codProyecto = filtro.proyecto;
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
      comprobante?: string;
      proyecto?: string;
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
      if (filtro?.comprobante) {
        where.comprobante = {
          comprobante: filtro.comprobante,
        }
      }
      if (filtro?.proyecto) {
        where.codProyecto = filtro.proyecto;
      }

      const resultado = await this.prisma.compra.aggregate({
        _sum: {
          costoTotal: true,
        },
        where,
      });

      return Number(resultado._sum.costoTotal) || 0;
    }

    async obtenerProveedoresActivos(): Promise<number> {
      return this.prisma.proveedor.count({
        where: {
          compras: {
            some: {},
          }
        }
      })
    }

    async obtenerProveedoresInactivos(): Promise<number> {
      return this.prisma.proveedor.count({
        where: {
          compras: {
            none: {},
          }
        }
      })
    }

    async obtenerSiguienteCodigo(): Promise<string> {
      const codigo = await this.prisma.compra.findFirst({
        orderBy: { codCompra: 'desc' }
      });

      if (!codigo) {
        return "CMA-0001";
      }

      const ultimoNumero = parseInt(codigo.codCompra.split('-')[1], 10);
      const siguienteNumero = ultimoNumero + 1;

      return `CMA-${siguienteNumero.toString().padStart(4, '0')}`;
    }

    async obtenerUltimaCompra(): Promise<string | null> {
      const ultima = await this.prisma.compra.findFirst({
        orderBy: { codCompra: 'desc' },
        select: { codCompra: true }
      });

      return ultima ? ultima.codCompra: null;
    }

    async crearCompra(
      input: CrearCompraInput,
    ): Promise<void> {
      const {
        rucProveedor,
        idComprobante,
        costoTotal,
        codProyecto,
        fechaCompra,
      } = input;
      
      try {

        const nuevoCodigo = await this.obtenerSiguienteCodigo();

        await this.prisma.compra.create({
          data: {
            codCompra: nuevoCodigo,
            idComprobante,
            rucProveedor,
            costoTotal,
            codProyecto,
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