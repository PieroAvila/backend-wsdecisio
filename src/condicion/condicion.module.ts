import { Module } from "@nestjs/common";
import { CondicionService } from "./condicion.service";
import { CondicionResolver } from "./condicion.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [CondicionService, CondicionResolver, PrismaService],
})
export class CondicionModule {}