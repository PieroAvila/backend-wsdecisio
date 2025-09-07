import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Maquinaria } from 'src/maquinaria/maquinaria.model';

@ObjectType()
export class Mantenimiento {
  @Field(() => Int)
  idMantenimiento: number;

  @Field()
  codMaquinaria: string;

  @Field()
  maquina: string;

  @Field()
  fechaInicio: string;

  @Field({ nullable: true })
  fechaFin?: string;

  @Field()
  estado: string;

  @Field(() => Maquinaria)
  maquinaria: Maquinaria;
}
