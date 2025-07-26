import { Args, Int, Query, Resolver } from "@nestjs/graphql";
import { Material } from "./material.model";
import { MaterialService } from "./material.service";

@Resolver(() => Material)
export class MaterialResolver {
    constructor(private readonly materialService: MaterialService) {}
    
    @Query(() => [Material])
    async obtenerMateriales(
        @Args('codigo', { nullable: true }) codigo?: string, 
    ) {
        return this.materialService.obtenerMateriales({codigo});
    }

    @Query(() => Int)
    async obtenerConteoMateriales(
        @Args('codigo', { nullable: true }) codigo?: string,
    ): Promise<number> {
        return this.materialService.obtenerConteoMateriales({codigo});
    }
}