import { Module } from "@nestjs/common";
import { DetaCompraService } from "./detallecompra.service";
import { DetaCompraResolver } from "./detallecompra-resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [DetaCompraService, DetaCompraResolver, PrismaService],
})
export class DetaCompraModule {}