import { Args, Int, Mutation, Query, Resolver } from "@nestjs/graphql";
import { Usuario } from "./usuario.model";
import { UsuarioService } from "./usuario.service";
import { UsuarioData } from "./usuario.interface";
import { CrearUsuarioInput } from "./crear-usuario.input";
import { ActualizarUsuarioInput } from "./actualizar-usuario.input";

@Resolver(() => Usuario)
export class UsuarioResolver {
    constructor(private readonly usuarioService: UsuarioService) {}

    @Query(() => [Usuario])
    async obtenerUsuarios(
        @Args('usuario', { nullable: true }) usuario?: string,
        @Args('dni', { nullable: true }) dni?: string,
    ): Promise<UsuarioData[]> {
        return this.usuarioService.obtenerUsuarios({usuario, dni});
    }

    @Query(() => Int)
    async obtenerConteoUsuarios(
        @Args('usuario', { nullable: true }) usuario?: string,
        @Args('dni', { nullable: true }) dni?: string,
    ) {
        return this.usuarioService.obtenerConteoUsuarios({usuario, dni});
    }

    @Mutation(() => Boolean)
    async crearUsuario(
        @Args('data') data: CrearUsuarioInput,
    ): Promise<boolean> {
        await this.usuarioService.crearUsuario(data);
        return true;
    }

    @Mutation(() => Usuario)
    async actualizarUsuario(
        @Args('usuario') usuario: string,
        @Args('data') data: ActualizarUsuarioInput,
    ) {
        return this.usuarioService.actualizarUsuario(usuario, data);
    }

    @Mutation(() => Boolean)
    async borrarUsuario(
        @Args('usuario') usuario: string,
    ) {
        await this.usuarioService.borrarUsuario(usuario);
        return true;
    }
}