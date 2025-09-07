import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { ActividadService } from "./actividad.service";
import { ActividadResolver } from "./actividad.resolver";

@Module({
    providers: [PrismaService, ActividadService, ActividadResolver],
})
export class ActividadModule {}