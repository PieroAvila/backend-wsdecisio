import { Query, Resolver } from "@nestjs/graphql";
import { Maquinaria } from "./maquinaria.model";
import { MaquinariaService } from "./maquinaria.service";

@Resolver(() => Maquinaria)
export class MaquinariaResolver {
    constructor(private readonly maquinariaService: MaquinariaService) {}

    @Query(() => [Maquinaria])
    async obtenerMaquinarias() {
        return this.maquinariaService.obtenerMaquinarias();
    }
}