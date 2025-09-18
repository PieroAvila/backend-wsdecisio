import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, IsString, MaxLength, Min } from "class-validator";

@InputType()
export class CrearMaquinariaInput {

    @Field()
    @IsNotEmpty({ message: 'El codigo de maquinaria es requerido' })
    @IsString({ message: 'El codigo debe ser una cadena de texto' })
    @MaxLength(10, { message: 'El codigo debe tener 10 caracteres como maximo' })
    codMaquinaria: string;

    @Field()
    @IsNotEmpty({ message: 'La cantidad es requerida' })
    @IsInt({ message: 'La cantidad debe ser un entero' })
    @Min(0, { message: 'La cantidad no debe ser negativo' })
    cantidad: number;

    @Field()
    @IsNotEmpty({ message: 'La descripcion es requerida' })
    @IsString({ message: 'La descripcion debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La descripcion debe tener 255 caracteres como maximo' })
    descripcion: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El estado debes ser una cadena de texto' })
    @MaxLength(20, { message: 'El estado debe tener como maximo 20 caracteres' })
    estado?: string;
}