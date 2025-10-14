import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Cliente } from "./cliente.model";
import { ClienteService } from "./cliente.service";
import { CrearClienteInput } from "./crear-cliente.input";
import { ActualizarClienteInput } from "./actualizar-cliente.input";
import { ClienteData } from "./cliente.interface";

@Resolver(() => Cliente)
export class ClienteResolver {
    constructor(private readonly clienteService: ClienteService) {}

    @Query(() => [Cliente])
    async obtenerClientes(
        @Args('dni', {nullable: true}) dni?: string,
        @Args('nombre', {nullable: true}) nombre?: string,
    ): Promise<ClienteData[]> {
        return this.clienteService.obtenerClientes({dni, nombre});
    }

    @Query(() => Int)
    async obtenerConteoClientes(
        @Args('dni', {nullable: true}) dni?: string,
        @Args('nombre', {nullable: true}) nombre?: string,
    ) {
        return this.clienteService.obtenerConteoClientes({dni, nombre});
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
        return this.clienteService.actualizarCliente(dniCliente,data);
    }

    @Mutation(() => Boolean)
    async borrarCliente(
        @Args('dniCliente') dniCliente: string,
    ) {
        await this.clienteService.borrarCliente(dniCliente);
        return true;
    }
}