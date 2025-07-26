import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsOptional, IsString, MaxLength, Min } from "class-validator";

@InputType()
export class ActualizarMaquinariaInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'La descripcion debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La descripcion debe tener 255 caracteres como maximo' })
    descripcion?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El estado debes ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener como maximo 20 caracteres' })
    estado?: string;
}