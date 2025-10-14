import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MaquinariaDescripcion {
    @Field()
    codMaquinaria: string;

    @Field()
    descripcion: string;
}