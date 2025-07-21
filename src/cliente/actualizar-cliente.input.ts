import { Field, InputType } from "@nestjs/graphql";
import { IsString, Length, Matches, MaxLength, IsEmail, IsOptional } from "class-validator";

@InputType()
export class ActualizarClienteInput{
    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @Matches(/^[A-Za-zñÑ\s]+$/, {
        message: 'El nombre solo debe contener letras',
    })
    @MaxLength(60, { message: 'El nombre debe tener 60 caracteres como máximo' })
    nombre?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsEmail({}, { message: 'debe cumplir con el formato del correo' })
    correo?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El telefono debe ser una cadena de texto' })
    @Matches(/^9\d{8}$/, {
        message: 'El número debe tener 9 dígitos y comenzar con 9',
    })
    @Length(9, 9, { message: 'El telefono debe tener 9 digitos' })
    telefono?: string;
}