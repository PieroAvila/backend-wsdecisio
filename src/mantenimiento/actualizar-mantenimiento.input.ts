import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

@InputType()
export class ActualizarMantenimientoInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    fechaFin?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El estado debes ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener como maximo 20 caracteres' })
    estado?: string;
}