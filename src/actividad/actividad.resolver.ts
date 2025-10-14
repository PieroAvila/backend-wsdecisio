import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Actividad } from "./actividad.model";
import { ActividadService } from "./actividad.service";
import { ActividadData } from "./actividad.interface";
import { CrearActividadInput } from "./crear-actividad.input";
import { ActualizarActividadInput } from "./actualizar-actividad.input";

@Resolver(() => Actividad)
export class ActividadResolver {
    constructor(private readonly actividadService: ActividadService) {}
    
    @Query(() => [Actividad])
    async obtenerActividades(
        @Args('proyecto', { nullable: true }) proyecto?: string,
        @Args('personal', { nullable: true }) personal?: string,
        @Args('estado', { nullable: true }) estado?: string,
    ): Promise<ActividadData[]> {
        return this.actividadService.obtenerActividad({ proyecto, personal, estado });
    }

    @Query(() => Int)
    async obtenerConteoActividades(
        @Args('proyecto', { nullable: true }) proyecto?: string,
        @Args('personal', { nullable: true }) personal?: string,
        @Args('estado', { nullable: true }) estado?: string,
    ): Promise<number> {
        return this.actividadService.obtenerConteoActividades({ proyecto, personal, estado });
    }

    @Query(() => Int)
    async obtenerConteoActividadesFinalizadas(
        @Args('personal', { nullable: true }) personal?: string,
    ) {
        return this.actividadService.obtenerConteoActividadesCompletadas({ personal });
    }

    @Query(() => [String])
    async obtenerEstadosActividad() {
        return this.actividadService.obtenerEstados();
    }

    @Mutation(() => Boolean)
    async crearActividad(
        @Args('data') data: CrearActividadInput,
    ): Promise<boolean> {
        await this.actividadService.crearActividad(data);
        return true;
    }

    @Mutation(() => [Actividad])
    async actualizarActividad(
        @Args('idActividad', { type: () => Int}) idActividad: number,
        @Args('data') data: ActualizarActividadInput,
    ) {
        return this.actividadService.actualizarActividad(idActividad, data);
    }

    @Mutation(() => Boolean)
    async borrarActividad(
        @Args('idActividad', { type: () => Int}) idActividad: number,
    ) {
        await this.actividadService.borrarActividad(idActividad);
        return true;
    }
}