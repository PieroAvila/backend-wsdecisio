import { Field, ObjectType } from '@nestjs/graphql';
import { Compra } from 'src/compra/compra.model';

@ObjectType()
export class Proveedor {
  @Field()
  rucProveedor: string;

  @Field()
  razonSocial: string;

  @Field()
  cuentaBcp: string;

  @Field(() => [Compra], { nullable: true })
  compras?: Compra[];
}
