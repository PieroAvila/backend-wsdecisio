import { Field, InputType } from "@nestjs/graphql";
import {IsNotEmpty, IsString, Length, Matches, MaxLength, MinLength} from "class-validator";

@InputType()
export class CrearUsuarioInput {
    @Field()
    @IsNotEmpty({ message: 'El usuario es requerido' })
    @IsString({ message: 'El usuario debe ser una cadena de texto' })
    @MaxLength(10, { message: 'El usuario debe tener 10 caracteres como maximo' })
    @MinLength(4, { message: 'El usuario debe tener 4 caracterescomo minimo' })
    usuario: string;

    @Field()
    @IsNotEmpty({ message: 'La clave es requerida' })
    @IsString({ message: 'La clave debe ser una cadena de texto' })
    clave: string;

    @Field()
    @IsNotEmpty({ message: 'El dni es requerido' })
    @IsString({ message: 'El dni debe ser una cadena de texto' })
    @Length(8,8, { message: 'El dni debe tener 8 digitos' })
    @Matches(/^[0-9]+$/, { message: 'El DNI solo debe contener números' })
    dniPersonal: string;
}