import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ComprobanteData } from "./comprobante.interface";

@Injectable()
export class ComprobanteService {
    constructor(private prisma: PrismaService) {}

    async obtenerComprobante(): Promise<ComprobanteData[]> {
        const comprobantes = await this.prisma.comprobante.findMany({});

        const comprobantesData: ComprobanteData[] = comprobantes.map((c) => ({
            idComprobante: c.idComprobante,
            comprobante: c.comprobante,
        }));

        return comprobantesData;
    }

    async obtenerComprobanteString(): Promise<string[]> {
        const comprobantes = await this.prisma.comprobante.findMany({
            select: { comprobante: true },
            distinct: ['comprobante'],
        });
        return comprobantes.map((c) => c.comprobante)
    }
}