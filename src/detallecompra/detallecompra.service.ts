import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CrearDetaCompraInput } from "./crear-detallecompra.input";
import { Decimal } from "@prisma/client/runtime/library";
import { DetalleCompraData } from "./detallecompra.interface";
import { DetalleCompra } from "@prisma/client";
import { ActualizarDetaCompraInput } from "./actualizar-detallecompra.input";

@Injectable()
export class DetaCompraService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerDetalleCompra(filtro?: {
        codigo?: string;
    }): Promise<DetalleCompraData[]> {
        let where: any = {};

        if (filtro?.codigo) {
            where.codCompra = filtro.codigo;
        }

        const detallescompra = await this.prisma.detalleCompra.findMany({
            include: {
                compra: true,
            },
            where,
        });

        const detalleData: DetalleCompraData[] = detallescompra.map((dc) => ({
            idDetalle: dc.idDetalle,
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

    async generarIdentificador(): Promise<number> {
        try {
            const ultimo = await this.prisma.detalleCompra.findFirst({
                orderBy: { idDetalle: 'desc'},
                select: { idDetalle: true }
            });

            const nuevoId = (ultimo?.idDetalle ?? 0) + 1;

            return nuevoId;
        } catch (error) {
            throw new Error(`Error generando el identificador`);
        }
    }

    async crearDetalleCompra(input: CrearDetaCompraInput): Promise<void> {
        const {
          idDetalle,
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
          await this.prisma.$transaction(async (tx) => {
            const compraExistente = await tx.compra.findUnique({
              where: { codCompra },
            });
      
            if (!compraExistente) {
              throw new HttpException('Compra no encontrada', HttpStatus.NOT_FOUND);
            }
      
            // 1️⃣ buscar si ya existe el detalle con mismo codCompra + codigo
            const detalleExistente = await tx.detalleCompra.findFirst({
              where: { codCompra, codigo },
            });
      
            const subtotal = new Decimal(cantidad).mul(precioUnit);
      
            if (detalleExistente) {
              // 2️⃣ actualizar cantidad
              await tx.detalleCompra.update({
                where: { idDetalle: detalleExistente.idDetalle },
                data: {
                  cantidad: detalleExistente.cantidad + cantidad,
                },
              });
            } else {
              // 3️⃣ crear nuevo detalle
              await tx.detalleCompra.create({
                data: {
                  idDetalle,
                  codCompra,
                  codigo,
                  descripcion,
                  categoria,
                  cantidad,
                  estado: 'DISPONIBLE',
                  unidadMedida,
                  precioUnit,
                },
              });
            }
      
            // actualizar costo de compra
            await tx.compra.update({
              where: { codCompra },
              data: {
                costoTotal: new Decimal(compraExistente.costoTotal ?? 0).add(subtotal),
              },
            });
      
            // stock en maquinaria o material
            if (categoria === 'MAQUINARIA') {
                // Verificar si ya existe la maquinaria con ese código
                const maquinariaExistente = await tx.maquinaria.findFirst({
                  where: { codMaquinaria: codigo },
                  select: { descripcion: true, estado: true }, // 👈 ahora también traemos estado
                });
              
                // Usar valores existentes si ya hay, o los del input
                const descripcionFinal = maquinariaExistente
                  ? maquinariaExistente.descripcion
                  : descripcion;
              
                  const estadoFinal =
                  estado && estado.trim() !== ""
                    ? estado
                    : "DISPONIBLE";
              
                let ultimoId =
                  (
                    await tx.maquinaria.findFirst({
                      orderBy: { idMaquinaria: 'desc' },
                      select: { idMaquinaria: true },
                    })
                  )?.idMaquinaria ?? 0;
              
                for (let i = 0; i < cantidad; i++) {
                  ultimoId++;
                  await tx.maquinaria.create({
                    data: {
                      idMaquinaria: ultimoId,
                      codMaquinaria: codigo,
                      descripcion: descripcionFinal,
                      estado: estadoFinal, // 👈 ya no se pierde
                    },
                  });
                }
              }
               else if (categoria === 'MATERIAL') {
              const materialExistente = await tx.material.findUnique({
                where: { codMaterial: codigo },
              });
      
              if (materialExistente) {
                await tx.material.update({
                  where: { codMaterial: codigo },
                  data: {
                    cantidad: materialExistente.cantidad + cantidad,
                  },
                });
              } else {
                await tx.material.create({
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
          });
        } catch (error) {
          if (error instanceof HttpException) {
            throw error;
          }
          throw new HttpException(
            `Error al registrar el detalle de compra: ${error.message}`,
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }
      

async actualizarDetalleCompra(
    idDetalle: number,
    input: ActualizarDetaCompraInput,
  ): Promise<DetalleCompra> {
    const detalleExistente = await this.prisma.detalleCompra.findUnique({
      where: { idDetalle },
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

    // 3) recalcular costo total de la compra asociada
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
        costoTotal: new Decimal(nuevoCostoTotal.toFixed(2)),
      },
    });

    return detalleActualizado;
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