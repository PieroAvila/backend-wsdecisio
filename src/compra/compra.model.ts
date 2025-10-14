import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Comprobante } from 'src/comprobante/comprobante.model';
import { DetalleCompra } from 'src/detallecompra/detacompra.model';
import { Proveedor } from 'src/proveedor/proveedor.model';
import { Proyecto } from 'src/proyecto/proyecto.model';

@ObjectType()
export class Compra {
  @Field()
  codCompra: string;

  @Field()
  idComprobante: number;

  @Field()
  comprobante: string;

  @Field()
  rucProveedor: string;

  @Field()
  razonSocial: string;

  @Field(() => Float, { nullable: true })
  costoTotal?: number;
  
  @Field()
  codProyecto: string;

  @Field()
  fechaCompra: string;

  @Field(() => Comprobante, { nullable: true })
  comprobantes: Comprobante;

  @Field(() => Proyecto, { nullable: true })
  proyecto: Proyecto;

  @Field(()=> Proveedor, { nullable: true})
  proveedor: Proveedor;

  @Field(() => [DetalleCompra], { nullable: true })
  detalles?: DetalleCompra[];
}
