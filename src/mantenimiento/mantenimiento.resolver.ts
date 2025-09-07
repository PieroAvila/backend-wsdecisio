import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Mantenimiento } from "./mantenimiento.model";
import { MantenimientoService } from "./mantenimiento.service";
import { MantenimientoData } from "./mantenimiento.interface";
import { CrearMantenimientoInput } from "./crear-mantenimientos.input";
import { ActualizarMantenimientoInput } from "./actualizar-mantenimiento.input";

@Resolver(() => Mantenimiento)
export class MantenimientoResolver {
    constructor(private readonly mantenimientoService: MantenimientoService) {}

    @Query(() => [Mantenimiento])
    async obtenerMantenimientos(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta', { nullable: true }) hasta?: string,
        @Args('maquinaria', { nullable: true }) maquinaria?: number,
        @Args('estado', { nullable: true }) estado?: string,
    ): Promise<MantenimientoData[]> {
        return this.mantenimientoService.obtenerMantenimiento({ desde, hasta, maquinaria, estado });
    }

    @Query(() => Int)
    async obtenerConteoMantenimientos(
        @Args('desde', { nullable: true }) desde?: string,
        @Args('hasta', { nullable: true }) hasta?: string,
        @Args('maquinaria', { nullable: true }) maquinaria?: number,
    ): Promise<number> {
        return this.mantenimientoService.obtenerConteoMantenimientos({ desde, hasta, maquinaria });
    }

    @Mutation(() => Boolean)
    async crearMantenimiento(
        @Args('data') data: CrearMantenimientoInput,
    ): Promise<boolean> {
        await this.mantenimientoService.crearMantenimiento(data);
        return true;
    }

    @Mutation(() => [Mantenimiento])
    async actualizarMantenimiento(
        @Args('idMantenimiento') idMantenimiento: number,
        @Args('data') data: ActualizarMantenimientoInput,
    ) {
        return this.mantenimientoService.actualizarMantenimiento(idMantenimiento, data);
    }

    @Mutation(() => Boolean)
    async borrarMantenimiento(
        @Args('idMantenimiento') idMantenimiento: number,
    ) {
        await this.mantenimientoService.borrarMantenimiento(idMantenimiento);
        return true;
    }
}