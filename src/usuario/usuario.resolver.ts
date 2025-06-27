import { Int, Query, Resolver } from "@nestjs/graphql";
import { Usuario } from "./usuario.model";
import { UsuarioService } from "./usuario.service";
import { UsuarioData } from "./usuario.interface";

@Resolver(() => Usuario)
export class UsuarioResolver {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Query(() => [Usuario])
    async obtenerUsuarios(): Promise<UsuarioData[]> {
        return this.usuarioService.obtenerUsuarios();
    }

    @Query(() => Int)
    async obtenerConteoUsuarios() {
        return this.usuarioService.obtenerConteoUsuarios();
    }

    
}