import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Cliente } from "src/cliente/cliente.model";

@ObjectType()
export class TipoCliente {

    @Field(() => Int)
    idTipoCliente: number;

    @Field()
    tipoCliente: string;

    @Field(() => Cliente)
    cliente: Cliente;
}