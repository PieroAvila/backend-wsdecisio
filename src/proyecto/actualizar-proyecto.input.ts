import { Field, InputType } from "@nestjs/graphql";
import { IsDateString, IsOptional, IsString, MaxLength } from "class-validator";

@InputType()
export class ActualizarProyectoInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsDateString()
    fechaFin?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El estado debe ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener maximo 20 caracteres' })
    estado?: string;
}