import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
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

  @Field()
  unidadMedida: string;

  @Field(() => Float)
  precioUnit: number

  @Field(() => Float, { nullable: true })
  subtotal?: number;

  @Field({ nullable: true })
  fechaCompra?: string;

  @Field(() => Compra)
  compra: Compra;
}
