import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CondicionData } from "./condicion.interface";

@Injectable()
export class CondicionService {
    constructor(private prisma: PrismaService) {}

    async obtenerCondicion(): Promise<CondicionData[]> {
        const condiciones = await this.prisma.condicion.findMany({});

        const condicionesData: CondicionData[] = condiciones.map((c) => ({
            idCondicion: c.idCondicion,
            condicion: c.condicion,
        }));

        return condicionesData;
    }
}