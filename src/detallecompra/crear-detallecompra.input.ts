import { Field, InputType } from "@nestjs/graphql";
import { IsIn, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

@InputType()
export class CrearDetaCompraInput {
    @Field()
    @IsNotEmpty({ message: 'El ID del detalle es requerido'})
    @IsInt({ message: 'El ID debe ser un numero entero'})
    @Min(1, { message: 'El ID no debe ser un numero negativo'})
    idDetalle: number;

    @Field()
    @IsNotEmpty({ message: 'El codigo de compra es requerido' })
    @IsString({ message: 'El codigo de compra debe ser una cadena de texto' })
    @MaxLength(10, { message: 'El codigo compra debe tener maximo 10 caracteres' })
    codCompra: string;

    @Field()
    @IsNotEmpty({ message: 'El codigo es requerido' })
    @IsString({ message: 'El codigo debe ser una cadena de texto' })
    @MaxLength(10, { message: 'El codigo debe tener maximo 10 caracteres' })
    codigo: string;

    @Field()
    @IsNotEmpty({ message: 'La descripcion es requerida' })
    @IsString({ message: 'La descripcion debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La descripcion debe tener maximo 255 caracteres' })
    descripcion: string;

    @Field()
    @IsNotEmpty({ message: 'La categoria es requerida' })
    @IsString({ message: 'La categoria debe ser una cadena de texto' })
    @IsIn(['MAQUINARIA', 'MATERIAL'], { message: 'La categoria debe ser MAQUINARIA o MATERIAL' })
    categoria: string;

    @Field()
    @IsNotEmpty({ message: 'La cantidad es requerida' })
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @Min(1, { message: 'La cantidad debe ser al menos 1' })
    cantidad: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener maximo 20 caracteres' })
    estado?: string;

    @Field()
    @IsNotEmpty({ message: 'La unidad de medida es requerida' })
    @IsString({ message: 'La unidad de medida debe ser una cadena de texto' })
    @MaxLength(20, { message: 'La unidad de medida debe tener maximo 20 caracteres' })
    unidadMedida: string;

    @Field()
    @IsNotEmpty({ message: 'El precio unitario es requerido' })
    @IsNumber({}, { message: 'El precio unitario debe ser un numero valido' })
    @Min(0, { message: 'El precio unitario no puede ser un numero negativo' })
    precioUnit: number;
}