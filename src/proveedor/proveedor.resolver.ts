import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Proveedor } from "./proveedor.model";
import { ProveedorService } from "./proveedor.service";
import { CrearProveedorInput } from "./crear-proveedor.input";
import { ActualizarProveedorInput } from "./actualizar-proveedor.input";

@Resolver(() => Proveedor)
export class ProveedorResolver {
    constructor(private readonly proveedorService: ProveedorService) {}

    @Query(() => [Proveedor])
    async obtenerProveedores() {
        return this.proveedorService.obtenerProveedores();
    }

    @Query(() => Int)
    async obtenerConteoProveedores() {
        return this.proveedorService.obtenerConteoProveedores();
    }

    @Query(() => Proveedor, { nullable: true })
    async obtenerProveedorPorRUC(
        @Args('rucProveedor') rucProveedor: string,
    ) {
        return this.proveedorService.obtenerProveedoresPorRUC(rucProveedor);
    }

    @Query(() => Proveedor, { nullable: true })
    async obtenerProveedorPorRazonSocial(
        @Args('razonSocial') razonSocial: string,
    ) {
        return this.proveedorService.obtenerProveedoresPorRazonSocial(razonSocial);
    }

    @Mutation(() => Boolean)
    async crearProveedor(
        @Args('data') data: CrearProveedorInput,
    ): Promise<boolean> {
        await this.proveedorService.crearProveedor(data);
        return true;
    }

    @Mutation(() => Proveedor)
    async actualizarProveedor(
        @Args('rucProveedor') rucProveedor: string,
        @Args('data') data: ActualizarProveedorInput,
    ) {
        return this.proveedorService.actualizarProveedor(rucProveedor, data);
    }

    @Mutation(() => Boolean)
    async borrarPersonal(
        @Args('rucProveedor') rucProveedor: string,
    ) {
        await this.proveedorService.borrarProveedor(rucProveedor);
        return true;
    }
}