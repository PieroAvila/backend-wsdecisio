import { Args, Float, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Proyecto } from "./proyecto.model";
import { ProyectoService } from "./proyecto.service";
import { ProyectoData } from "./proyecto.interface";
import { CrearProyectoInput } from "./crear-proyecto.input";
import { ActualizarProyectoInput } from "./actualizar-proyecto.input";

@Resolver(() => Proyecto)
export class ProyectoResolver {
    constructor(private readonly proyectoService: ProyectoService) {}
    
    @Query(() => [Proyecto])
    async obtenerProyectos(): Promise<ProyectoData[]> {
        return this.proyectoService.obtenerProyectos();
    }

    @Query(() => Int)
    async obtenerConteoProyectos(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta', { nullable: true }) hasta?: string,
        @Args('cliente', { nullable: true }) cliente?: string,
        @Args('estado', { nullable: true }) estado?: string,
    ): Promise<number> {
        return this.proyectoService.obtenerConteoProyectos({ desde, hasta, cliente, estado });
    }

    @Query(() => Float)
    async obtenerMontoTotalProyecto(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta', { nullable: true }) hasta?: string,
        @Args('cliente', { nullable: true }) cliente?: string,
    ): Promise<number> {
        return this.proyectoService.obtenerMontoTotal({ desde, hasta, cliente });
    }

    @Query(() => [Proyecto])
    async obtenerProyectosPorFecha(
        @Args('desde') desde: string,
        @Args('hasta') hasta: string,
    ): Promise<ProyectoData[]> {
        return this.proyectoService.obtenerProyectosPorFecha({ desde, hasta });
    }

    @Query(() => [String])
    async obtenerClientesDisponibles() {
        return this.proyectoService.obtenerClientesDisponibles();
    }

    @Query(() => Float)
    async obtenerPromedioProyectosPorCliente(): Promise<number> {
        return this.proyectoService.obtenerPromedioProyectosPorCliente();
    }

    @Mutation(() => Boolean)
    async crearProyecto(
        @Args('data') data: CrearProyectoInput,
    ): Promise<boolean> {
        await this.proyectoService.crearProyecto(data);
        return true;
    }

    @Mutation(() => [Proyecto])
    async actualizarProyecto(
        @Args('codProyecto') codProyecto: string,
        @Args('data') data: ActualizarProyectoInput,
    ): Promise<ProyectoData[]> {
        return this.proyectoService.actualizarProyecto(codProyecto, data);
    }

    @Mutation(() => Boolean)
    async borrarProyecto(
        @Args('codProyecto') codProyecto: string,
    ) {
        return this.proyectoService.borrarProyecto(codProyecto);
    }
}