import { Field, ObjectType } from "@nestjs/graphql";
import { Compra } from "src/compra/compra.model";

@ObjectType()
export class Comprobante {
    @Field()
    idComprobante: number;

    @Field()
    comprobante: string;

    @Field(() => [Compra], {nullable: true})
    compras?: Compra[];
}