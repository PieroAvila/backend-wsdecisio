import { Module } from "@nestjs/common";
import { MaquinariaService } from "./maquinaria.service";
import { MaquinariaResolver } from "./maquinaria.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [MaquinariaService, MaquinariaResolver, PrismaService],
})
export class MaquinariaModule {}