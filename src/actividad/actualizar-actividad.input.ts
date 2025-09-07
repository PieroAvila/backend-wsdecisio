import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString, Length, Matches, MaxLength, Min } from "class-validator";

@InputType()
export class ActualizarActividadInput {

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El DNI debe ser una cadena de texto' })
    @Matches(/^[0-9]+$/, { message: 'El DNI solo debe contener números' })
    @Length(8, 8, { message: 'El DNI debe contener 8 digitos' })
    dniPersonal?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El estado debes ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener como maximo 20 caracteres' })
    estado?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsInt({ message: 'La duracion real debe ser un numero entero' })
    @Min(1, { message: 'La duracion real no debe ser un numero negativo' })
    duracionReal?: number;
}