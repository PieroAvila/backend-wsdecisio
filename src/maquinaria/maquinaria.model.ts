import { Field, Int, ObjectType } from '@nestjs/graphql';
import { DetaMaquinaria } from 'src/detamaquinaria/detamaquinaria.model';
import { Mantenimiento } from 'src/mantenimiento/mantenimiento.model';

@ObjectType()
export class Maquinaria {

  @Field(() => Int)
  idMaquinaria: number;

  @Field()
  codMaquinaria: string;

  @Field()
  descripcion: string;

  @Field()
  estado: string;

  @Field(() => [Mantenimiento], { nullable: true })
  mantenimientos?: Mantenimiento[];

  @Field(() => [DetaMaquinaria], { nullable: true })
  detalleProyectos?: DetaMaquinaria[];
}
