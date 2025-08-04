import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsString, Length } from "class-validator";

@InputType()
export class CrearDetaProyectoInput {
    @Field()
    @IsNotEmpty({ message: 'El codigo es requerido' })
    @IsString({ message: 'El codigo debe ser una cadena de texto' })
    @Length(7,7, { message: 'El codigo debe tener 7 caracteres' })
    codProyecto: string;
}