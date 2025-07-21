import { Field, InputType } from "@nestjs/graphql";
import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

@InputType()
export class ActualizarDetaCompraInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'La descripcion debe ser una cadena de texto' })
    @MaxLength(255, { message: 'La descripcion debe tener maximo 255 caracteres' })
    descripcion?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsInt({ message: 'La cantidad debe ser un numero entero' })
    @Min(1, { message: 'La cantidad deber ser al menos 1' })
    cantidad?: number;

    @Field({ nullable: true})
    @IsOptional()
    @IsNumber({}, { message: 'El precio unitario debe ser un numero valido' })
    @Min(0, { message: 'El precio unitario no puede ser un numero negativo' })
    precioUnit?: number;
}