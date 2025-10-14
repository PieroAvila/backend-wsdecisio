import { Module } from "@nestjs/common";
import { TipoClienteService } from "./tipocliente.service";
import { TipoClienteResolver } from "./tipocliente.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [TipoClienteService, TipoClienteResolver, PrismaService],
})
export class TipoClienteModule {}