import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DetaMaterial } from "./detamaterial.model";
import { DetaMaterialService } from "./detamaterial.service";
import { DetaMaterialData } from "./detamaterial.interface";
import { CrearDetaMaterialInput } from "./crear-detamaterial.input";
import { ActualizarDetaMaterialInput } from "./actualizar-detamaterial.input";
import { DetaProyecto } from "src/detaproyecto/detaproyecto.model";
import { DetaProyectoData } from "./detaProyectoData.dto";

@Resolver(() => DetaMaterial)
export class DetaMaterialResolver {
    constructor(private readonly detamaterialService: DetaMaterialService) {}

    @Query(() => [DetaMaterial])
    async obtenerDetaMaterial(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta', { nullable: true }) hasta?: string,
        @Args('proyecto', { nullable: true }) proyecto?: string,
        @Args('material', { nullable: true }) material?: string,
    ): Promise<DetaMaterialData[]> {
        return this.detamaterialService.obtenerDetaMaterial({ desde, hasta, proyecto, material });
    }

    @Query(() => Int)
    async obtenerConteoDetaMateriales(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta', { nullable: true }) hasta?: string,
        @Args('proyecto', { nullable: true }) proyecto?: string,
        @Args('material', { nullable: true }) material?: string,
    ): Promise<number> {
        return this.detamaterialService.obtenerConteoDetaMateriales({ desde, hasta, material, proyecto });
    }

    @Query(() => Int)
    async obtenerTotalMaterialUsado(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta', { nullable: true }) hasta?: string,
        @Args('proyecto', { nullable: true }) proyecto?: string,
        @Args('material', { nullable: true }) material?: string,
    ): Promise<number> {
        return this.detamaterialService.obtenerTotalMaterialUsado({ desde, hasta, proyecto, material });
    }

    @Query(() => [String])
    async obtenerMaterialesDisponibles() {
        return this.detamaterialService.obtenerMaterialesDisponibles();
    }

    @Query(() => [DetaProyectoData])
    async obtenerDetaProyecto():Promise<DetaProyectoData[]> {
        return this.detamaterialService.obtenerDetaProyectos();
    }

    @Mutation(() => Boolean)
    async CrearDetaMaterial(
        @Args('data') data: CrearDetaMaterialInput,
    ): Promise<boolean> {
        await this.detamaterialService.crearDetaMaterial(data);
        return true;
    }

    @Mutation(() => [DetaMaterial])
    async actualizarDetaMaterial(
        @Args('idDetaMaterial', { type: () => Int}) idDetaMaterial: number,
        @Args('data') data: ActualizarDetaMaterialInput,
    ) {
        return this.detamaterialService.actualizarDetaMaterial(idDetaMaterial, data);
    }

    @Mutation(() => Boolean)
    async borrarDetaMaterial(
        @Args('idDetaMaterial', {type: () => Int}) idDetaMaterial: number,
    ) {
        await this.detamaterialService.borrarDetaMaterial(idDetaMaterial);
        return true;
    }
}