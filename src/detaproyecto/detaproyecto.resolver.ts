import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DetaProyecto } from "./detaproyecto.model";
import { DetaProyectoService } from "./detaproyecto.service";
import { CrearDetaProyectoInput } from "./crear-detaproyecto.input";

@Resolver(() => DetaProyecto)
export class DetaProyectoResolver {
    constructor(private readonly detaproyectoService: DetaProyectoService) {}

    @Query(() => Int)
    async obtenerConteoDetaProyecto() {
        return this.detaproyectoService.obtenerConteoDetaProyectos();
    }

    @Mutation(() => Boolean)
    async crearDetaProyecto(
        @Args('data') data: CrearDetaProyectoInput,
    ): Promise<boolean> {
        await this.detaproyectoService.crearDetaProyecto(data);
        return true;
    }

    @Mutation(() => Boolean)
    async borrarDetaProyecto(
        @Args('idDetaProyecto') idDetaProyecto: number,
    ) {
        await this.detaproyectoService.borrarDetaProyecto(idDetaProyecto);
        return true;
    }
}