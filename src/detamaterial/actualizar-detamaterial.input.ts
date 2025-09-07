import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsOptional, Min } from "class-validator";

@InputType()
export class ActualizarDetaMaterialInput {
    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    cantidad?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    cantidadUsada?: number;
}