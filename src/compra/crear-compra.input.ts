import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from "class-validator";

@InputType()
export class CrearCompraInput {

    @Field()
    @IsNotEmpty({ message: 'El ID es requerido' })
    @IsInt({message: 'El ID debe ser un numero entero'})
    @Min(1, { message: 'El ID debe ser un numero mayor de 0'})
    @Max(2, {message: 'El ID debe ser menor de 3'})
    idComprobante: number;

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
    @IsNotEmpty({message: 'El codigo del proyecto es requerido'})
    @IsString({ message: 'El codigo del proyecto debe ser una cadena de texto'})
    @Length(8,8, { message: 'El codigo debe tener 8 caracteres' })
    codProyecto: string;

    @Field()
    @IsNotEmpty({ message: 'La fecha de compra es requerida' })
    @IsDateString()
    fechaCompra: string;
}