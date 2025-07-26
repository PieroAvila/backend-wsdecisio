import { Module } from "@nestjs/common";
import { MaterialService } from "./material.service";
import { MaterialResolver } from "./material.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [MaterialService, MaterialResolver, PrismaService],
})
export class MaterialModule {}