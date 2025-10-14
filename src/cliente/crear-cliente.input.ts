import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Length, Matches, MaxLength, Max, Min, IsInt, IsOptional } from "class-validator";

@InputType()
export class CrearClienteInput{
    @Field()
    @IsNotEmpty({ message: 'El DNI es requerido' })
    @IsString({ message: 'El DNI debe ser una cadena de texto' })
    @Matches(/^[0-9]+$/, { message: 'El DNI solo debe contener números' })
    @Length(8, 8, { message: 'El DNI debe contener 8 digitos' })
    dniCliente: string;
    
    @Field()
    @IsNotEmpty({ message: 'El nombre es requerido' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Matches(/^[A-Za-zñÑ\s]+$/, {
        message: 'El nombre solo debe contener letras',
    })
    @MaxLength(60, { message: 'El nombre debe tener 60 caracteres como máximo' })
    nombre: string;

    @Field()
    @IsNotEmpty({ message: 'El apellido es requerido' })
    @IsString({ message: 'El apellido debe ser una cadena de texto' })
    @Matches(/^[A-Za-zñÑ\s]+$/, {
        message: 'El apellido solo debe contener letras',
    })
    @MaxLength(60, { message: 'El apellido debe tener 60 caracteres como máximo' })
    apellido: string;

    @Field()
    @IsNotEmpty({ message: 'El tipo de cliente es requerido' })
    @IsInt({ message: 'El tipo de cliente debe ser un numero entero' })
    @Min(1, { message: 'El tipo de cliente debe ser mayor a 0' })
    @Max(2, { message: 'El tipo de cliente debe ser menor a 3' })
    idTipoCliente: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El RUC debe ser una cadena de texto' })
    @MaxLength(14, { message: 'El RUC debe tener al menos 14 digitos' })
    @Matches(/^[0-9]+$/, { message: 'El RUC solo debe contener números' })
    ruc?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'La razon social debe ser una cadena de texto' })
    @MaxLength(100, { message: 'La razon social debe tener 100 caracteres como máximo' })
    razonSocial?: string;
}