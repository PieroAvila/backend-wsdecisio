import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, IsString, Length, Matches, MaxLength, Min } from "class-validator";

@InputType()
export class CrearActividadInput {

    @Field()
    @IsNotEmpty({ message: 'El codigo es requerido' })
    @IsString({ message: 'El codigo debe ser una cadena de texto' })
    @Length(7,7, { message: 'El codigo debe tener 7 caracteres' })
    codProyecto: string;

    @Field()
    @IsNotEmpty({ message: 'El DNI es requerido' })
    @IsString({ message: 'El DNI debe ser una cadena de texto' })
    @Matches(/^[0-9]+$/, { message: 'El DNI solo debe contener números' })
    @Length(8, 8, { message: 'El DNI debe contener 8 digitos' })
    dniPersonal: string;

    @Field()
    @IsNotEmpty({ message: 'El tipo de actividad es requerido' })
    @Matches(/^[A-Za-zñÑ\s]+$/, {
        message: 'El tipo solo debe contener letras',
    })
    @MaxLength(50, { message: 'El tipo debe contener 50 caracteres como maximo' })
    @IsString({ message: 'El tipo debe ser una cadena de texto' })
    tipoActividad: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El estado debes ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener como maximo 20 caracteres' })
    estado?: string;

    @Field()
    @IsNotEmpty({ message: 'La duracion estimada es requerida' })
    @IsInt({ message: 'La duracion estimada debe ser un numero entero' })
    @Min(1, { message: 'La duracion no debe ser un número negativo' })
    duracionEstimada: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsInt({ message: 'La duracion real debe ser un numero entero' })
    @Min(1, { message: 'La duracion real no debe ser un numero negativo' })
    duracionReal?: number;
}