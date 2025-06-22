import { Field, ObjectType } from "@nestjs/graphql";
import { Proyecto } from "src/proyecto/proyecto.model";

@ObjectType()
export class Cliente {
  @Field()
  dniCliente: string;

  @Field()
  nombre: string;

  @Field()
  correo: string;

  @Field()
  telefono: string;

  @Field(() => [Proyecto], { nullable: true })
  proyectos?: Proyecto[];
}
