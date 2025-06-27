import { Module } from "@nestjs/common";
import { UsuarioService } from "./usuario.service";
import { UsuarioResolver } from "./usuario.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [UsuarioService, UsuarioResolver, PrismaService],
})
export class UsuarioModule {}