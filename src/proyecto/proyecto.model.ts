import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Actividad } from 'src/actividad/actividad.model';
import { Cliente } from 'src/cliente/cliente.model';
import { DetaProyecto } from 'src/detaproyecto/detaproyecto.model';

@ObjectType()
export class Proyecto {
  @Field()
  codProyecto: string;

  @Field()
  nombre: string;

  @Field(() => Cliente)
  cliente: Cliente;

  @Field()
  fechaInicio: string;

  @Field()
  fechaFin: string;

  @Field()
  estado: string;

  @Field(() => Float)
  costoProyecto: number;

  @Field(() => [DetaProyecto], { nullable: true })
  detalles?: DetaProyecto[];

  @Field(() => [Actividad], { nullable: true })
  actividades?: Actividad[];
}
