import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsString, Length, Min } from "class-validator";

@InputType()
export class CrearDetaProyectoInput {

    @Field()
    @IsNotEmpty({ message: 'El ID del detalle es requerido'})
    @IsInt({ message: 'El ID debe ser un numero entero'})
    @Min(1, { message: 'El ID no debe ser un numero negativo'})
    idDetaProyecto: number;

    @Field()
    @IsNotEmpty({ message: 'El codigo es requerido' })
    @IsString({ message: 'El codigo debe ser una cadena de texto' })
    @Length(7,7, { message: 'El codigo debe tener 7 caracteres' })
    codProyecto: string;
}