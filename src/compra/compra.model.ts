import { Field, Float, ObjectType } from '@nestjs/graphql';
import { DetalleCompra } from 'src/detallecompra/detacompra.model';
import { Proveedor } from 'src/proveedor/proveedor.model';

@ObjectType()
export class Compra {
  @Field()
  codCompra: string;

  @Field()
  rucProveedor: string;

  @Field()
  razonSocial: string;

  @Field(() => Float, { nullable: true })
  costoTotal?: number;

  @Field()
  fechaCompra: string;

  @Field(()=> Proveedor, { nullable: true})
  proveedor: Proveedor;

  @Field(() => [DetalleCompra], { nullable: true })
  detalles?: DetalleCompra[];
}
