import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DetaMaquinaria } from "./detamaquinaria.model";
import { DetaMaquinariaService } from "./detamaquinaria.service";
import { DetaMaquinariaData } from "./detamaquinaria.interface";
import { CrearDetaMaquinariaInput } from "./crear-detamaquinaria.input";
import { MaquinariaDisponibleDTO } from "./maquinariaDisponible.dto";

@Resolver(() => DetaMaquinaria)
export class DetaMaquinariaResolver {
    constructor(private readonly detamaquinariaService: DetaMaquinariaService) {}
    
    @Query(() => [DetaMaquinaria])
    async obtenerDetaMaquinaria(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta' , { nullable: true }) hasta?: string,
        @Args('proyecto', { nullable: true }) proyecto?: string,
        @Args('maquinaria', {type: () => Int, nullable: true }) maquinaria?: number,
    ): Promise<DetaMaquinariaData[]> {
        return this.detamaquinariaService.obtenerDetaMaquinaria({ desde, hasta, proyecto, maquinaria });
    }

    @Query(() => Int)
    async obtenerConteoDetaMaquinarias(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta' , { nullable: true }) hasta?: string,
        @Args('proyecto', { nullable: true }) proyecto?: string,
        @Args('maquinaria', {type: () => Int, nullable: true }) maquinaria?: number,
    ): Promise<number> {
        return this.detamaquinariaService.obtenerConteoDetaMaquinarias({ desde, hasta, proyecto, maquinaria });
    }

    @Query(() => [MaquinariaDisponibleDTO])
  async obtenerMaquinariasDisponibles(): Promise<MaquinariaDisponibleDTO[]> {
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
        @Args('idDetaMaquinaria', {type: () => Int}) idDetaMaquinaria: number,
    ) {
        await this.detamaquinariaService.borrarDetaMaquinaria(idDetaMaquinaria);
        return true;
    }
}