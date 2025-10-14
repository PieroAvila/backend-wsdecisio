import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Material } from "./material.model";
import { MaterialService } from "./material.service";
import { CrearMaterialInput } from "./crear-material.input";
import { ActualizarMaterialInput } from "./actualizar-material.input";

@Resolver(() => Material)
export class MaterialResolver {
    constructor(private readonly materialService: MaterialService) {}
    
    @Query(() => [Material])
    async obtenerMateriales(
        @Args('codigo', { nullable: true }) codigo?: string,
        @Args('medida', { nullable: true }) medida?: string,
    ) {
        return this.materialService.obtenerMateriales({codigo, medida});
    }

    @Query(() => Int)
    async obtenerConteoMateriales(
        @Args('codigo', { nullable: true }) codigo?: string,
        @Args('medida', { nullable: true }) medida?: string,
    ): Promise<number> {
        return this.materialService.obtenerConteoMateriales({codigo, medida });
    }

    @Query(() => [String])
    async obtenerMedidas() {
        return this.materialService.obtenerMedidas();
    }

    @Mutation(() => Boolean)
    async crearMaterial(
        @Args('data') data: CrearMaterialInput,
    ): Promise<boolean> {
        await this.materialService.crearMaterial(data);
        return true;
    }

    @Mutation(() => Material)
    async actualizarMaterial(
        @Args('codMaterial') codMaterial: string,
        @Args('data') data: ActualizarMaterialInput,
    ) {
        return this.materialService.actualizarMaterial(codMaterial, data);
    }

    @Mutation(() => Boolean)
    async borrarMaterial(
        @Args('codMaterial') codMaterial: string,
        @Args('cantidad', { type: () => Int }) cantidad: number,
    ): Promise<boolean> {
        await this.materialService.borrarMaterial(codMaterial, cantidad);
        return true;
    }

}