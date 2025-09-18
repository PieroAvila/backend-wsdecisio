import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, MaxLength, Min } from "class-validator";

@InputType()
export class CrearCompraInput {
    @Field()
    @IsNotEmpty({ message: 'El ruc del proveedor es requerido' })
    @IsString({ message: 'El ruc debe ser una cadena de texto' })
    @Length(11,11, { message: 'El ruc debe tener 11 digitos' })
    @Matches(/^[0-9]+$/, { message: 'El RUC solo debe contener números' })
    rucProveedor: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber({}, { message: 'El costo debe ser un numero valido' })
    @Min(0, { message: 'El costo no puede ser un numero negativo' })
    costoTotal?: number;

    @Field()
    @IsNotEmpty({ message: 'La fecha de compra es requerida' })
    @IsDateString()
    fechaCompra: string;
}