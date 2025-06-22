import { Field, Float, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Cargo {
    @Field(() => Int)
    idCargo: number;

    @Field()
    cargo: string;

    @Field(() => Float)
    pagoHora: number;
}