import { Field, ObjectType } from "@nestjs/graphql";
import { Proyecto } from "src/proyecto/proyecto.model";

@ObjectType()
export class Condicion {
    @Field()
    idCondicion: number;

    @Field()
    condicion: string;

    @Field(() => [Proyecto] , { nullable: true })
    proyectos?: Proyecto[];
}