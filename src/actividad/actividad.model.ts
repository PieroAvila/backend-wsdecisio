import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Personal } from 'src/personal/personal.model';
import { Proyecto } from 'src/proyecto/proyecto.model';

@ObjectType()
export class Actividad {
  @Field(() => Int)
  idActividad: number;

  @Field()
  codProyecto: string;

  @Field()
  proyecto: string;

  @Field()
  dniPersonal: string;

  @Field()
  personal: string;

  @Field()
  encargado: string;

  @Field()
  tipoActividad: string;

  @Field()
  estado: string;

  @Field(() => Int)
  duracionEstimada: number;

  @Field(() => Int, { nullable: true })
  duracionReal?: number;

  @Field(() => Proyecto)
  proyectos: Proyecto;

  @Field(() => Personal)
  personales: Personal;
}
