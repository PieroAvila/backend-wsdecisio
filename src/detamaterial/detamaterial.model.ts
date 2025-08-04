import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DetaProyecto } from 'src/detaproyecto/detaproyecto.model';
import { Material } from 'src/material/material.model';

@ObjectType()
export class DetaMaterial {
  @Field(() => Int)
  idDetaMaterial: number;

  @Field(() => Int)
  idDetaProyecto: number;

  @Field()
  codProyecto: string;

  @Field()
  codMaterial: string;

  @Field()
  descripcion: string;

  @Field(() => Int)
  cantidad: number;

  @Field(() => Int, { nullable: true })
  cantidadUsada?: number;

  @Field(() => Int, { nullable: true })
  cantidadRestante?: number;

  @Field(() => Int)
  cantidadDisponible: number;

  @Field(() => DetaProyecto)
  detaProyecto: DetaProyecto;

  @Field(() => Material)
  material: Material;
}
