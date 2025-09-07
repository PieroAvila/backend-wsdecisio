import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

@InputType()
export class CrearMantenimientoInput {
    @Field()
    @IsNotEmpty({ message: 'La maquinaria es requerida' })
    @IsInt({ message: 'La maquinaria debe ser un numero entero' })
    @Min(1, { message: 'El numero de maquinaria no debe ser un valor negativo' })
    idMaquinaria: number;

    @Field()
    @IsNotEmpty({ message: 'La fecha de inicio es requerida' })
    @IsDateString()
    fechaInicio: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    fechaFin?: string;

    @Field()
    @IsNotEmpty({ message: 'El estado es requerido' })
    @IsString({ message: 'El estado debes ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener como maximo 20 caracteres' })
    estado: string;
}