import { Query, Resolver } from "@nestjs/graphql";
import { TipoCliente } from "./tipocliente.model";
import { TipoClienteService } from "./tipocliente.service";
import { TipoClienteData } from "./tipocliente.interface";

@Resolver(() => TipoCliente)
export class TipoClienteResolver {
    constructor(private readonly tipoclienteService: TipoClienteService) {}

    @Query(() => [TipoCliente])
    async obtenerTipoCliente(): Promise<TipoClienteData[]> {
        return this.tipoclienteService.obtenerTipoCliente();
    }
}