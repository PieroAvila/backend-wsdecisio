import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Length, Matches, Max, MaxLength, Min } from "class-validator";

@InputType()
export class CrearProyectoInput {
    @Field()
    @IsNotEmpty({ message: 'El codigo es requerido' })
    @IsString({ message: 'El codigo debe ser una cadena de texto' })
    @Length(8,8, { message: 'El codigo debe tener 8 caracteres' })
    codProyecto: string;

    @Field()
    @IsNotEmpty({ message: 'El nombre del proyecto es requerido' })
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @MaxLength(255, { message: 'El nombre debe tener un maximo de 255 caracteres' })
    nombreProyecto: string;

    @Field()
    @IsNotEmpty({ message: 'El DNI es requerido' })
    @IsString({ message: 'El DNI debe ser una cadena de texto' })
    @Matches(/^[0-9]+$/, { message: 'El DNI solo debe contener números' })
    @Length(8, 8, { message: 'El DNI debe contener 8 digitos' })
    dniCliente: string;

    @Field()
    @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
    @IsDateString()
    fechaInicio: string;

    @Field()
    @IsNotEmpty({ message: 'Los dias programados es requerido' })
    @IsInt({ message: 'Los dias deben ser un numero entero' })
    @Min(1, { message: 'La cantidad de dias no pueden ser negativos' })
    diasProgramados: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    fechaFin?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener maximo 20 caracteres' })
    estado?: string;

    @Field()
    @IsNotEmpty({ message: 'El ID es requerido' })
    @IsInt({ message: 'El ID debe ser un numero entero' })
    @Min(1, { message: 'El ID minimo es 1' })
    @Max(2, { message: 'El ID debe ser menor de 3' })
    idCondicion: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber({}, { message: 'El costo debe ser un numero valido' })
    @Min(0, { message: 'El costo no puede ser un numero negativo' })
    costoProyecto?: number;
}