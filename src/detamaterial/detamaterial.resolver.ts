import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DetaMaterial } from "./detamaterial.model";
import { DetaMaterialService } from "./detamaterial.service";
import { DetaMaterialData } from "./detamaterial.interface";
import { CrearDetaMaterialInput } from "./crear-detamaterial.input";
import { ActualizarDetaMaterialInput } from "./actualizar-detamaterial.input";

@Resolver(() => DetaMaterial)
export class DetaMaterialResolver {
    constructor(private readonly detamaterialService: DetaMaterialService) {}

    @Query(() => [DetaMaterial])
    async obtenerDetaMaterial(): Promise<DetaMaterialData[]> {
        return this.detamaterialService.obtenerDetaMaterial();
    }

    @Query(() => Int)
    async obtenerConteoDetaMateriales(
        @Args('proyecto', { nullable: true }) proyecto?: string,
    ): Promise<number> {
        return this.detamaterialService.obtenerConteoDetaMateriales({ proyecto });
    }

    @Query(() => Int)
    async obtenerTotalMaterialUsado(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta', { nullable: true }) hasta?: string,
        @Args('proyecto', { nullable: true }) proyecto?: string,
    ): Promise<number> {
        return this.detamaterialService.obtenerTotalMaterialUsado({ desde, hasta, proyecto });
    }

    @Query(() => [String])
    async obtenerMaterialesDisponibles() {
        return this.detamaterialService.obtenerMaterialesDisponibles();
    }

    @Query(() => [String])
    async obtenerProyectosDisponibles() {
        return this.detamaterialService.obtenerProyectosDisponibles();
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
        @Args('idDetaMaterial') idDetaMaterial: number,
        @Args('data') data: ActualizarDetaMaterialInput,
    ) {
        return this.detamaterialService.actualizarDetaMaterial(idDetaMaterial, data);
    }

    @Mutation(() => Boolean)
    async borrarDetaMaterial(
        @Args('idDetaMaterial') idDetaMaterial: number,
    ) {
        await this.detamaterialService.borrarDetaMaterial(idDetaMaterial);
        return true;
    }
}