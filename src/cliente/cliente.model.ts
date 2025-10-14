import { Field, ObjectType } from '@nestjs/graphql';
import { Proyecto } from 'src/proyecto/proyecto.model';
import { TipoCliente } from 'src/tipocliente/tipocliente.model';

@ObjectType()
export class Cliente {
  @Field(() => String)
  dniCliente: string;

  @Field(() => String)
  nombre: string;

  @Field(() => String)
  apellido: string;

  @Field()
  cliente: string;

  @Field(() => Number)
  idTipoCliente: number;

  @Field()
  tipoCliente: string;

  @Field(()=> String,{ nullable: true })
  ruc?: string | null;

  @Field(() => String,{ nullable: true })
  razonSocial?: string | null;

  @Field(() => [Proyecto], { nullable: true })
  proyectos?: Proyecto[];

  @Field(() => TipoCliente)
  tipoclientes?: TipoCliente;
}
