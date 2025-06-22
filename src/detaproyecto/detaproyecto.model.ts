import { Field, Int, ObjectType } from "@nestjs/graphql";
import { DetaMaquinaria } from "src/detamaquinaria/detamaquinaria.model";
import { DetaMaterial } from "src/detamaterial/detamaterial.model";
import { Proyecto } from "src/proyecto/proyecto.model";

@ObjectType()
export class DetaProyecto {
  @Field(() => Int)
  idDetaProyecto: number;

  @Field()
  codProyecto: string;

  @Field(() => Proyecto)
  proyecto: Proyecto;

  @Field(() => [DetaMaterial], { nullable: true })
  materiales?: DetaMaterial[];

  @Field(() => [DetaMaquinaria], { nullable: true })
  maquinarias?: DetaMaquinaria[];
}
