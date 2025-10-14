import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { TipoClienteData } from "./tipocliente.interface";

@Injectable()
export class TipoClienteService {
    constructor(private prisma: PrismaService) {}

    async obtenerTipoCliente(): Promise<TipoClienteData[]> {
        const tipos = await this.prisma.tipoCliente.findMany({});

        const tipoData: TipoClienteData[] = tipos.map((tc) => ({
            idTipoCliente: tc.idTipoCliente,
            tipoCliente: tc.tipoCliente,
        }));
        return tipoData;
    }
}