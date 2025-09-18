import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, Min } from "class-validator";

@InputType()
export class CrearDetaMaquinariaInput {

    @Field()
    @IsNotEmpty({ message: 'El ID del detalle es requerido'})
    @IsInt({ message: 'El ID debe ser un numero entero'})
    @Min(1, { message: 'El ID no debe ser un numero negativo'})
    idDetaMaquinaria: number;
        
    @Field()
    @IsNotEmpty({ message: 'El ID del detaproyecto es requerido' })
    @IsInt({ message: 'EL ID debe ser un numerop entero' })
    idDetaProyecto: number;

    @Field()
    @IsNotEmpty({ message: 'El ID de la maquinaria es requerido' })
    @IsInt({ message: 'El ID debe ser un número entero' })
    idMaquinaria: number;
}