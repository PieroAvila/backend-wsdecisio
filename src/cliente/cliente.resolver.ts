import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Cliente } from "./cliente.model";
import { ClienteService } from "./cliente.service";
import { CrearClienteInput } from "./crear-cliente.input";
import { ActualizarClienteInput } from "./actualizar-cliente.input";

@Resolver(() => Cliente)
export class ClienteResolver {
    constructor(private readonly clienteService: ClienteService) {}

    @Query(() => [Cliente])
    async obtenerClientes(): Promise<Cliente[]> {
        return this.clienteService.obtenerClientes();
    }

    @Query(() => Int)
    async obtenerConteoClientes() {
        return this.clienteService.obtenerConteoClientes();
    }

    @Query(() => [Cliente])
    async obtenerClientesPorDNI(
        @Args('dniCliente') dniCliente: string,
    ) {
        return this.clienteService.obtenerClientesPorDNI(dniCliente);
    }

    @Query(() => [Cliente])
    async obtenerClientesPorNombre(
        @Args('nombre') nombre: string,
    ) {
        return this.clienteService.obtenerClientesPorNombre(nombre);
    }

    @Mutation(() => Boolean)
    async crearCliente(
        @Args('data') data: CrearClienteInput,
    ): Promise<boolean> {
        await this.clienteService.crearCliente(data);
        return true;
    }

    @Mutation(() => Cliente)
    async actualizarCliente(
        @Args('dniCliente') dniCliente: string,
        @Args('data') data: ActualizarClienteInput,
    ) {
        return this.clienteService.actualizarCLiente(dniCliente,data);
    }

    @Mutation(() => Boolean)
    async borrarCliente(
        @Args('dniCliente') dniCliente: string,
    ) {
        await this.clienteService.borrarCliente(dniCliente);
        return true;
    }
}