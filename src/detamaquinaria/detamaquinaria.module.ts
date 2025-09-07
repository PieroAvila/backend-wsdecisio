import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DetaMaquinariaService } from "./detamaquinaria.service";
import { DetaMaquinariaResolver } from "./detamaquinaria.resolver";

@Module({
    providers: [PrismaService, DetaMaquinariaService, DetaMaquinariaResolver],
})

export class DetaMaquinariaModule {}