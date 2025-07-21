import { Module } from "@nestjs/common";
import { CompraService } from "./compra.service";
import { CompraResolver } from "./compra.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [CompraService, CompraResolver, PrismaService]
})
export class CompraModule {}