import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Length, Matches, MaxLength, IsEmail } from "class-validator";

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
    @IsNotEmpty({ message: 'El correo es requerido' })
    @IsEmail({}, { message: 'debe cumplir con el formato del correo' })
    correo: string;

    @Field()
    @IsNotEmpty({ message: 'El telefono es requerido' })
    @IsString({ message: 'El telefono debe ser una cadena de texto' })
    @Matches(/^9\d{8}$/, {
        message: 'El número debe tener 9 dígitos y comenzar con 9',
    })
    @Length(9, 9, { message: 'El telefono debe tener 9 digitos' })
    telefono: string;
}