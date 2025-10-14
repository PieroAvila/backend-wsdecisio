import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Length, Matches, MaxLength } from "class-validator";

@InputType()
export class CrearProveedorInput {
    @Field()
    @IsNotEmpty({ message: 'El RUC es requerido' })
    @IsString({ message: 'El RUC debe ser una cadena de texto' })
    @Length(11,11, { message: 'El RUC debe tener 11 digitos' })
    @Matches(/^[0-9]+$/, { message: 'El RUC solo debe contener números' })
    rucProveedor: string;

    @Field()
    @IsNotEmpty({ message: 'La razon social es requerida' })
    @IsString({ message: 'La razon social debe ser una cadena de texto' })
    @MaxLength(100, { message: 'La razon social debe tener 100 caracteres maximo' })
    razonSocial: string;

    @Field()
    @IsNotEmpty({ message: 'La cuenta BCP es requerido' })
    @IsString({ message: 'La cuenta BCP debe ser una cadena de texto' })
    @MaxLength(14, { message: 'La cuenta BCP debe tener como maximo 14 digitos' })
    @Matches(/^[0-9]+$/, { message: 'La cuenta BCP solo debe contener números' })
    cuentaBcp: string;
}