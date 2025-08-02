import { Module } from "@nestjs/common";
import { ProyectoService } from "./proyecto.service";
import { ProyectoResolver } from "./proyecto.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [ProyectoService, ProyectoResolver, PrismaService],
})
export class ProyectoModule {}