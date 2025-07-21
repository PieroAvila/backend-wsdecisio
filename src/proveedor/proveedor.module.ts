import { Module } from "@nestjs/common";
import { ProveedorResolver } from "./proveedor.resolver";
import { ProveedorService } from "./proveedor.service";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [ProveedorResolver, ProveedorService, PrismaService]
})
export class ProveedorModule {}