import { Field, Int, ObjectType } from "@nestjs/graphql";
import { DetaProyecto } from "src/detaproyecto/detaproyecto.model";
import { Material } from "src/material/material.model";

@ObjectType()
export class DetaMaterial {
  @Field(() => Int)
  idDetaMaterial: number;

  @Field(() => Int)
  idDetaProyecto: number;

  @Field()
  codMaterial: string;

  @Field(() => Int)
  cantidad: number;

  @Field(() => Int)
  cantidadUsada: number;

  @Field(() => Int, { nullable: true })
  cantidadRestante?: number;

  @Field(() => DetaProyecto)
  detaProyecto: DetaProyecto;

  @Field(() => Material)
  material: Material;
}
