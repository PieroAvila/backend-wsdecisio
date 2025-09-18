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
    async obtenerDetalleCompra(
        @Args('codigo', { nullable: true}) codigo?: string,
    ): Promise<DetalleCompraData[]> {
        return this.detacompraService.obtenerDetalleCompra({ codigo });
    }

    @Query(() => Int)
    async obtenerConteoDetalles(
        @Args('codigo', { nullable: true }) codigo?: string,
    ): Promise<number> {
        return this.detacompraService.obtenerConteoDetalles({ codigo });
    }

    @Query(() => Int)
    async obtenerIdentificador(): Promise<number> {
        return this.detacompraService.generarIdentificador();
    }

    @Mutation(() => Boolean)
    async crearDetaCompra(
        @Args('data') data: CrearDetaCompraInput,
    ): Promise<boolean> {
        await this.detacompraService.crearDetalleCompra(data);
        return true;
    }
    
    @Mutation(() => DetalleCompra)
  async actualizarDetalleCompra(
    @Args('idDetalle', { type: () => Int }) idDetalle: number,
    @Args('data') data: ActualizarDetaCompraInput,
  ) {
    return this.detacompraService.actualizarDetalleCompra(idDetalle, data);
  }

    @Mutation(() => Boolean)
    async borrarDetalleCompra(
        @Args('idDetalle', { type: () => Int}) idDetalle: number,
    ) {
        await this.detacompraService.borrarDetalleCompra(idDetalle);
        return true;
    }
}