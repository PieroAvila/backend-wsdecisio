import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DetaProyectoService } from "./detaproyecto.service";
import { DetaProyectoResolver } from "./detaproyecto.resolver";

@Module({
    providers: [PrismaService, DetaProyectoService, DetaProyectoResolver]
})
export class DetaProyectoModule {}