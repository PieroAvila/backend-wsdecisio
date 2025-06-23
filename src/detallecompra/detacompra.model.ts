import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Compra } from 'src/compra/compra.model';

@ObjectType()
export class DetalleCompra {
  @Field(() => Int)
  idDetalle: number;

  @Field()
  codCompra: string;

  @Field()
  codigo: string;

  @Field()
  descripcion: string;

  @Field()
  categoria: string;

  @Field(() => Int)
  cantidad: number;

  @Field()
  estado: string;

  @Field(() => Compra)
  compra: Compra;
}
