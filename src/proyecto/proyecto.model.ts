import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Actividad } from 'src/actividad/actividad.model';
import { Cliente } from 'src/cliente/cliente.model';
import { Condicion } from 'src/condicion/condicion.model';
import { DetaProyecto } from 'src/detaproyecto/detaproyecto.model';

@ObjectType()
export class Proyecto {
  @Field()
  codProyecto: string;

  @Field()
  nombreProyecto: string;

  @Field(() => Cliente)
  cliente: Cliente;

  @Field()
  dniCliente: string;

  @Field()
  contacto: string;
  
  @Field()
  fechaInicio: string;

  @Field(() => Int, { nullable: true })
  diasProgramados: number;

  @Field()
  fechaFin: string;

  @Field()
  estado: string;

  @Field(() => Float)
  costoProyecto: number;

  @Field()
  idCondicion: number;

  @Field()
  condicion: string;

  @Field(() => Condicion, { nullable: true })
  condiciones: Condicion;

  @Field(() => [DetaProyecto], { nullable: true })
  detalles?: DetaProyecto[];

  @Field(() => [Actividad], { nullable: true })
  actividades?: Actividad[];
}
