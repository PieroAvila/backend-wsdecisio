import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { DetaMaterial } from "./detamaterial.model";
import { DetaMaterialService } from "./detamaterial.service";
import { DetaMaterialData } from "./detamaterial.interface";

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
}