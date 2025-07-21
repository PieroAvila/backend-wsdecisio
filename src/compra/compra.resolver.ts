import { Args, Float, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Compra } from "./compra.model";
import { CompraService } from "./compra.service";
import { CompraData } from "./compra.interface";
import { CrearCompraInput } from "./crear-compra.input";

@Resolver(() => Compra)
export class CompraResolver {
    constructor( private readonly compraService: CompraService) {}

    @Query(() => [Compra])
    async obtenerCompras(): Promise<CompraData[]> {
        return this.compraService.obtenerCompras();
    }
    
    @Query(() => Int)
    async obtenerConteoCompras(
      @Args('desde', { nullable: true }) desde?: string,
      @Args('hasta', { nullable: true }) hasta?: string,
      @Args('ruc', { nullable: true }) ruc?: string,
    ): Promise<number> {
      return this.compraService.obtenerConteoCompras({ desde, hasta, ruc });
    }


    @Query(() => [Compra])
    async obtenerComprasPorFecha(
      @Args('desde') desde: string,
      @Args('hasta') hasta: string,
    ): Promise<CompraData[]> {
      return this.compraService.obtenerComprasPorFecha({ desde, hasta});
    }

    @Query(() => Float)
    async obtenerMontoCompras(
      @Args('desde', { nullable: true }) desde?: string,
      @Args('hasta', { nullable: true }) hasta?: string,
      @Args('ruc', { nullable: true }) ruc?: string,
    ): Promise<number> {
      return this.compraService.obtenerMontoCompras({ desde, hasta, ruc });
    }

    @Query(() => [String])
    async obtenerProveedoresDisponibles() {
      return this.compraService.obtenerProveedoresDisponibles();
    }

    @Query(() => Int)
    async obtenerProveedoresActivos() {
      return this.compraService.obtenerProveedoresActivos();
    }

    @Query(() => Int)
    async obtenerProveedoresInactivos() {
      return this.compraService.obtenerProveedoresInactivos();
    }

    @Mutation(() => Boolean)
    async crearCompra(
      @Args('data') data: CrearCompraInput,
    ): Promise<boolean> {
      await this.compraService.crearCompra(data);
      return true;
    }

    @Mutation(() => Boolean)
    async borrarCompra(
      @Args('codCompra') codCompra: string,
    ) {
      await this.compraService.borrarCompra(codCompra);
      return true;
    }
}