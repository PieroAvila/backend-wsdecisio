import { Field, Int, ObjectType } from "@nestjs/graphql";
import { DetaMaquinaria } from "src/detamaquinaria/detamaquinaria.model";
import { Mantenimiento } from "src/mantenimiento/mantenimiento.model";

@ObjectType()
export class Maquinaria {
  @Field()
  codMaquinaria: string;

  @Field()
  descripcion: string;

  @Field(() => Int)
  cantidad: number;

  @Field()
  estado: string;

  @Field(() => [Mantenimiento], { nullable: true })
  mantenimientos?: Mantenimiento[];

  @Field(() => [DetaMaquinaria], { nullable: true })
  detalleProyectos?: DetaMaquinaria[];
}
