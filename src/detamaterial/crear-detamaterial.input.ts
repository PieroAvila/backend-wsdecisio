import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

@InputType()
export class CrearDetaMaterialInput {

    @Field(() => Int)
    @IsInt({ message: 'El ID debe ser un numero entero'})
    idDetaProyecto: number;

    @Field()
    @IsNotEmpty({ message: 'El codigo de compra es requerido' })
    @IsString({ message: 'El codigo de compra debe ser una cadena de texto' })
    @MaxLength(10, { message: 'El codigo compra debe tener maximo 10 caracteres' })
    codMaterial: string;

    @Field(() => Int)
    @IsNotEmpty({ message: 'La cantidad es requerida' })
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    cantidad: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    cantidadUsada?: number;
}