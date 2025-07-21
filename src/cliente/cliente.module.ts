import { Module } from "@nestjs/common";
import { ClienteService } from "./cliente.service";
import { ClienteResolver } from "./cliente.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [ClienteService, ClienteResolver, PrismaService],
})
export class ClienteModule {}