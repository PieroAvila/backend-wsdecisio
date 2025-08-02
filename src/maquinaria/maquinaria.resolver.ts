import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Maquinaria } from "./maquinaria.model";
import { MaquinariaService } from "./maquinaria.service";
import { CrearMaquinariaInput } from "./crear-maquinaria.input";
import { ActualizarMaquinariaInput } from "./actualizar-maquinaria.input";

@Resolver(() => Maquinaria)
export class MaquinariaResolver {
    constructor(private readonly maquinariaService: MaquinariaService) {}

    @Query(() => [Maquinaria])
    async obtenerMaquinarias(
        @Args('estado', { nullable: true }) estado?: string,
        @Args('codigo', { nullable: true }) codigo?: string,
    ) {
        return this.maquinariaService.obtenerMaquinarias({ estado, codigo });
    }

    @Query(() => Int)
    async obtenerConteoMaquinarias(
        @Args('codigo', { nullable: true }) codigo?: string,
    ): Promise<number> {
        return this.maquinariaService.obtenerConteoMaquinarias({ codigo });
    }

    @Mutation(() => Boolean)
    async crearMaquinaria(
        @Args('data') data: CrearMaquinariaInput,
    ): Promise<boolean> {
        await this.maquinariaService.crearMaquinaria(data);
        return true;
    }

    @Mutation(() => Maquinaria)
    async actualizarMaquinaria(
        @Args('idMaquinaria') idMaquinaria: number,
        @Args('data') data: ActualizarMaquinariaInput,
    ) {
        return this.maquinariaService.actualizarMaquinaria(idMaquinaria, data)
    }

    @Mutation(() => Boolean)
    async borrarMaquinaria(
        @Args('idMaquinaria') idMaquinaria: number,
    ) {
        await this.maquinariaService.borrarMaquinaria(idMaquinaria);
        return true;
    }
}