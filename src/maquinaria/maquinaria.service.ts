import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class MaquinariaService {
    constructor(private readonly prisma: PrismaService) {}

    async obtenerMaquinarias() {
        return this.prisma.maquinaria.findMany();
    }

    
}