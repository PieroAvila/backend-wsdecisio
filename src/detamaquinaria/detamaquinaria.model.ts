import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DetaProyecto } from 'src/detaproyecto/detaproyecto.model';
import { Maquinaria } from 'src/maquinaria/maquinaria.model';

@ObjectType()
export class DetaMaquinaria {
  @Field(() => Int)
  idDetaMaquinaria: number;

  @Field(() => Int)
  idDetaProyecto: number;

  @Field()
  codMaquinaria: string;

  @Field(() => DetaProyecto)
  detaProyecto: DetaProyecto;

  @Field(() => Maquinaria)
  maquinaria: Maquinaria;
}
