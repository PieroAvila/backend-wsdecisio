import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { DetalleCompra } from "./detacompra.model";
import { DetaCompraService } from "./detallecompra.service";
import { CrearDetaCompraInput } from "./crear-detallecompra.input";
import { DetalleCompraData } from "./detallecompra.interface";
import { ActualizarDetaCompraInput } from "./actualizar-detallecompra.input";

@Resolver(() => DetalleCompra)
export class DetaCompraResolver {
    constructor(private readonly detacompraService: DetaCompraService) {}
    
    @Query(() => [DetalleCompra])
    async obtenerDetalleCompra(): Promise<DetalleCompraData[]> {
        return this.detacompraService.obtenerDetalleCompra();
    }

    @Query(() => Int)
    async obtenerConteoDetallePorCompra(
        @Args('codigo', { nullable: true }) codigo?: string,
    ): Promise<number> {
        return this.detacompraService.obtenerConteoDetalles({ codigo });
    }

    @Query(() => [String])
    async obtenerComprasDisponibles() {
        return this.detacompraService.obtenerComprasDisponibles();
    }

    @Mutation(() => Boolean)
    async crearDetaCompra(
        @Args('data') data: CrearDetaCompraInput,
    ): Promise<boolean> {
        await this.detacompraService.crearDetalleCompra(data);
        return true;
    }
    
    @Mutation(() => [DetalleCompra])
    async actualizarDetalleCompra(
        @Args('idDetalle', { type: () => Int }) idDetalle: number,
        @Args('data') data: ActualizarDetaCompraInput,
    ): Promise<DetalleCompraData[]> {
        return this.detacompraService.actualizarDetalleCompra(idDetalle,data)
    }

    @Mutation(() => Boolean)
    async borrarDetalleCompra(
        @Args('idDetalle') idDetalle: number,
    ) {
        await this.detacompraService.borrarDetalleCompra(idDetalle);
        return true;
    }
}