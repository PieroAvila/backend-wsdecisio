import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Proveedor } from "./proveedor.model";
import { ProveedorService } from "./proveedor.service";
import { CrearProveedorInput } from "./crear-proveedor.input";
import { ActualizarProveedorInput } from "./actualizar-proveedor.input";

@Resolver(() => Proveedor)
export class ProveedorResolver {
    constructor(private readonly proveedorService: ProveedorService) {}

    @Query(() => [Proveedor])
    async obtenerProveedores(
        @Args('ruc', { nullable: true }) ruc?: string,
        @Args('razon', { nullable: true }) razon?: string,
    ) {
        return this.proveedorService.obtenerProveedores({ ruc, razon});
    }

    @Query(() => Int)
    async obtenerConteoProveedores(
        @Args('ruc', { nullable: true }) ruc?: string,
        @Args('razon', { nullable: true }) razon?: string,
    ) {
        return this.proveedorService.obtenerConteoProveedores({ruc, razon});
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
    async borrarProveedor(
        @Args('rucProveedor') rucProveedor: string,
    ) {
        await this.proveedorService.borrarProveedor(rucProveedor);
        return true;
    }
}