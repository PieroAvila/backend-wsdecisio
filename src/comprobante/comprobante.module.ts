import { Module } from "@nestjs/common";
import { ComprobanteService } from "./comprobante.service";
import { ComprobanteResolver } from "./comprobante.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [ComprobanteService, ComprobanteResolver, PrismaService],
})
export class ComprobanteModule {}