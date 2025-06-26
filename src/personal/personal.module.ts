import { Module } from "@nestjs/common";
import { PersonalService } from "./personal.service";
import { PersonalResolver } from "./personal.resolver";
import { PrismaService } from "src/prisma/prisma.service";

@Module({
    providers: [PersonalService, PersonalResolver, PrismaService],
})
export class PersonalModule {}