import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CrearDetaCompraInput } from "./crear-detallecompra.input";
import { Decimal } from "@prisma/client/runtime/library";
import { DetalleCompraData } from "./detallecompra.interface";
import { DetalleCompra } from "@prisma/client";
import { ActualizarDetaCompraInput } from "./actualizar-detallecompra.input";

@Injectable()
export class DetaCompraService {
    constructor(private prisma: PrismaService) {}

    async obtenerDetalleCompra(): Promise<DetalleCompraData[]> {
        const detallescompra = await this.prisma.detalleCompra.findMany({
            include: {
                compra: true,
            },
        });

        const detalleData: DetalleCompraData[] = detallescompra.map((dc) => ({
            codCompra: dc.codCompra,
            codigo: dc.codigo,
            descripcion: dc.descripcion,
            categoria: dc.categoria,
            cantidad: dc.cantidad,
            estado: dc.estado,
            unidadMedida: dc.unidadMedida,
            precioUnit: parseFloat(dc.precioUnit.toString()),
            subtotal: parseFloat(dc.precioUnit.toString()) * dc.cantidad,
            fechaCompra: dc.compra ? dc.compra.fechaCompra.toISOString().split('T')[0]: '',
          }));
      
        return detalleData;
    }
    
    async obtenerConteoDetalles(filtro?: {
        codigo?: string;
    }): Promise<number> {
        let where: any = {};

        if(filtro?.codigo) {
            where.codCompra = filtro.codigo;
        }

        const resultado = await this.prisma.detalleCompra.aggregate({
            _count: {
                idDetalle: true,
            },
            where,
        })
        return Number(resultado._count.idDetalle) || 0;
    }

    async obtenerComprasDisponibles(): Promise<string[]> {
        const compras = await this.prisma.compra.findMany({
            select: {
                codCompra: true,
            },
            distinct: ['codCompra']
        });
        return compras.map((c) => c.codCompra)
    }

    async crearDetalleCompra(
        input: CrearDetaCompraInput,
    ): Promise<void> {
        const {
            codCompra,
            codigo,
            descripcion,
            categoria,
            cantidad,
            estado,
            unidadMedida,
            precioUnit,
        } = input;

        try {
            await this.prisma.detalleCompra.create({
                data: {
                    codCompra,
                    codigo,
                    descripcion,
                    categoria,
                    cantidad,
                    estado,
                    unidadMedida,
                    precioUnit,
                }
            });

            const compraExistente = await this.prisma.compra.findUnique({
                where: { codCompra },
            })

            if (!compraExistente) {
                throw new HttpException(
                    'Compra no encontrada',
                    HttpStatus.NOT_FOUND,
                );
            }

            const costoActual = compraExistente.costoTotal ?? new Decimal(0);
            const subtotal = new Decimal(cantidad).mul(precioUnit);

            await this.prisma.compra.update({
                where: { codCompra },
                data: {
                    costoTotal: costoActual.add(subtotal),
                },
            });

            if (categoria === 'MAQUINARIA') {
                const maquinariaExistente = await this.prisma.maquinaria.findUnique({
                    where: { codMaquinaria: codigo },
                });

                if (maquinariaExistente) {
                    await this.prisma.maquinaria.update({
                        where: { codMaquinaria: codigo },
                        data: {
                            cantidad: maquinariaExistente.cantidad + cantidad,
                        }
                    });
                } else {
                    await this.prisma.maquinaria.create({
                        data: {
                            codMaquinaria: codigo,
                            descripcion,
                            cantidad
                        },
                    });
                }
            } else if (categoria === 'MATERIAL') {
                if (!unidadMedida) {
                    throw new HttpException(
                        'La unidad de medida es requerida para materiales',
                        HttpStatus.BAD_REQUEST,
                    );
                }
                const materialExistente = await this.prisma.material.findUnique({
                    where: { codMaterial: codigo },
                });
                if (materialExistente) {
                    await this.prisma.material.update({
                        where: { codMaterial: codigo },
                        data: {
                            cantidad: materialExistente.cantidad + cantidad,
                        },
                    });
                } else {
                    await this.prisma.material.create({
                        data: {
                            codMaterial: codigo,
                            descripcion,
                            cantidad,
                            unidadMedida,
                        },
                    });
                }
            } else {
                throw new HttpException(
                    'Categoria no valida, debe ser MAQUINARIA o MATERIAL',
                    HttpStatus.BAD_REQUEST,
                );
            } 
        } catch (error) {
            throw new HttpException(
                `Error al registrar el detalle de compra ${error}`,
                HttpStatus.INTERNAL_SERVER_ERROR,
            );
        }
    }

    async actualizarDetalleCompra(
        idDetalle: number,
        input: ActualizarDetaCompraInput,
      ): Promise<DetalleCompraData[]> {
        const detalleExistente = await this.prisma.detalleCompra.findUnique({
          where: { idDetalle },
          include: { compra: true },
        });
      
        if (!detalleExistente) {
          throw new HttpException(
            'El detalle no existe en la base de datos',
            HttpStatus.NOT_FOUND,
          );
        }
      
        const detalleActualizado = await this.prisma.detalleCompra.update({
          where: { idDetalle },
          data: { ...input },
        });
      
        const detallesRelacionados = await this.prisma.detalleCompra.findMany({
          where: { codCompra: detalleActualizado.codCompra },
        });
      
        const nuevoCostoTotal = detallesRelacionados.reduce((total, detalle) => {
          const subtotal = detalle.precioUnit.toNumber() * detalle.cantidad;
          return total + subtotal;
        }, 0);
      
        await this.prisma.compra.update({
          where: { codCompra: detalleActualizado.codCompra },
          data: {
            costoTotal: new Decimal(nuevoCostoTotal.toFixed(2)), // redondear a 2 decimales
          },
        });
      
        const detallescompra = await this.prisma.detalleCompra.findMany({
          include: { compra: true },
        });
      
        const detalleData: DetalleCompraData[] = detallescompra.map((dc) => ({
          codCompra: dc.codCompra,
          codigo: dc.codigo,
          descripcion: dc.descripcion,
          categoria: dc.categoria,
          cantidad: dc.cantidad,
          estado: dc.estado,
          unidadMedida: dc.unidadMedida,
          precioUnit: parseFloat(dc.precioUnit.toFixed(2)),
          subtotal: parseFloat((dc.precioUnit.toNumber() * dc.cantidad).toFixed(2)),
          fechaCompra: dc.compra
            ? dc.compra.fechaCompra.toISOString().split('T')[0]
            : '',
        }));
      
        return detalleData;
      }
            

    async borrarDetalleCompra(idDetalle: number): Promise<void> {
        const detalles = await this.prisma.detalleCompra.findUnique({
            where: { idDetalle },
            include: { compra: true },
        });
        if (!detalles) {
            throw new HttpException(
                `El detalle con ID ${idDetalle} no se encuentra`,
                HttpStatus.NOT_FOUND,
            );
        }
        const subtotal = new Decimal(detalles.precioUnit).mul(detalles.cantidad);

        await this.prisma.compra.update({
            where: { codCompra: detalles.codCompra },
            data: {
                costoTotal: new Decimal(detalles.compra?.costoTotal ?? 0).minus(subtotal),
            },
        });

        await this.prisma.detalleCompra.delete({
            where: {idDetalle},
        })
    }
}