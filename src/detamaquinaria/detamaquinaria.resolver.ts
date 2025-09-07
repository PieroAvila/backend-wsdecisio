import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DetaMaquinaria } from "./detamaquinaria.model";
import { DetaMaquinariaService } from "./detamaquinaria.service";
import { DetaMaquinariaData } from "./detamaquinaria.interface";
import { CrearDetaMaquinariaInput } from "./crear-detamaquinaria.input";

@Resolver(() => DetaMaquinaria)
export class DetaMaquinariaResolver {
    constructor(private readonly detamaquinariaService: DetaMaquinariaService) {}
    
    @Query(() => [DetaMaquinaria])
    async obtenerDetaMaquinaria(): Promise<DetaMaquinariaData[]> {
        return this.detamaquinariaService.obtenerDetaMaquinaria();
    }

    @Query(() => Int)
    async obtenerConteoDetaMatequinarias(
        @Args('proyecto', { nullable: true }) proyecto?: string,
        @Args('maquinaria', {type: () => Int, nullable: true }) maquinaria?: number,
    ): Promise<number> {
        return this.detamaquinariaService.obtenerConteoDetaMaquinarias({ proyecto, maquinaria });
    }

    @Query(() => [String])
    async obtenerMaquinariasDisponibles() {
        return this.detamaquinariaService.obtenerMaquinariasDisponibles();
    }

    @Mutation(() => Boolean)
    async crearDetaMaquinaria(
        @Args('data') data: CrearDetaMaquinariaInput,
    ): Promise<boolean> {
        await this.detamaquinariaService.crearDetaMaquinaria(data);
        return true;
    }

    @Mutation(() => Boolean)
    async borrarDetaMaquinaria(
        @Args('idDetaMaquinaria') idDetaMaquinaria: number,
    ) {
        await this.detamaquinariaService.borrarDetaMaquinaria(idDetaMaquinaria);
        return true;
    }
}