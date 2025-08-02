import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CrearMaterialInput } from "./crear-material.input";
import { Material } from "@prisma/client";
import { ActualizarMaterialInput } from "./actualizar-material.input";

@Injectable()
export class MaterialService {
    constructor(private readonly prisma: PrismaService) {}
    
    async obtenerMateriales(filtro?: {
        codigo?: string;
    }) {
        let where: any = {};

        if (filtro?.codigo) {
            where.codMaterial = filtro.codigo;
        }

        const materiales = await this.prisma.material.findMany({
            where,
        })

        return materiales;
    }

    async obtenerConteoMateriales(
        filtro?: {
            codigo?: string;
        }
    ): Promise<number> {
        let where: any = {};

        if (filtro?.codigo) {
            where.codMaterial = filtro.codigo;
        }

        const resultado = await this.prisma.material.aggregate({
            _sum: {
                cantidad: true,
            },
            where,
        });
        return Number(resultado._sum.cantidad) ?? 0;
    }

    async crearMaterial(
        input: CrearMaterialInput,
    ): Promise<void> {
        const { codMaterial, descripcion, cantidad, unidadMedida } = input;
        const materialExistente = await this.prisma.material.findFirst({
            where: { codMaterial },
        });

        if (materialExistente) {
            await this.prisma.material.update({
                where: { codMaterial: materialExistente.codMaterial},
                data: {
                    cantidad: materialExistente.cantidad + cantidad,
                },
            });
        } else {
            await this.prisma.material.create({
                data: {
                    codMaterial,
                    descripcion,
                    cantidad,
                    unidadMedida,
                },
            });
        }
    }

    async actualizarMaterial(
        codMaterial: string,
        input: ActualizarMaterialInput,
    ): Promise<Material> {
        const materialExistente = await this.prisma.material.findUnique({
            where: { codMaterial },
        });

        if (!materialExistente) {
            throw new HttpException(
                'El material no existe en la base de datos',
                HttpStatus.NOT_FOUND,
            );
        }
        
        return this.prisma.material.update({
            where: { codMaterial },
            data: {
                ...input,
            },
        });
    }

    async borrarMaterial(codMaterial: string): Promise<void> {
        const materiales = await this.prisma.material.findMany({
            where: { codMaterial },
        });
        if (materiales.length === 0) {
            throw new HttpException(
                `El material con codigo ${codMaterial} no existe en la base de datos`,
                HttpStatus.NOT_FOUND,
            );
        }
        await this.prisma.material.deleteMany({
            where: { codMaterial },
        })
    }
}