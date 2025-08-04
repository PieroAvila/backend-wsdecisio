import { Module } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { DetaMaterialService } from "./detamaterial.service";
import { DetaMaterialResolver } from "./detamaterial.resolver";

@Module({
    providers: [PrismaService, DetaMaterialService, DetaMaterialResolver],
})
export class DetaMaterialModule {}