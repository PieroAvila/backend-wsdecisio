import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { MantenimientoService } from "./mantenimiento.service";
import { MantenimientoResolver } from "./mantenimiento.resolver";

@Module({
    providers: [PrismaService, MantenimientoService, MantenimientoResolver],
})
export class MantenimientoModule {}