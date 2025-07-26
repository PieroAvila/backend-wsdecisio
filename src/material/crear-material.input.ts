import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsString, MaxLength, Min } from "class-validator";

@InputType()
export class CrearMaterialInput {
    @Field()
    @IsNotEmpty({ message: 'El codigo de compra es requerido' })
    @IsString({ message: 'El codigo de compra debe ser una cadena de texto' })
    @MaxLength(10, { message: 'El codigo compra debe tener maximo 10 caracteres' })
    codMaterial: string;

    @Field()
    @IsNotEmpty({ message: 'La descripcion es requerida' })
    @IsString({ message: 'La descripcion debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La descripcion debe tener maximo 255 caracteres' })
    descripcion: string;

    @Field()
    @IsNotEmpty({ message: 'La cantidad es requerida' })
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    cantidad: number;

    @Field()
    @IsNotEmpty({ message: 'La unidad de medida es requerida' })
    @IsString({ message: 'La unidad de medida debe ser una cadena de texto' })
    @MaxLength(20, { message: 'La unidad de medida debe tener maximo 20 caracteres' })
    unidadMedida: string;
}