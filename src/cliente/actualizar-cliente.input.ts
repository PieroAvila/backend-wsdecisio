import { Field, InputType } from "@nestjs/graphql";
import { IsString, Matches, MaxLength, IsOptional, IsInt, Min, Max } from "class-validator";

@InputType()
export class ActualizarClienteInput{
    @Field({ nullable: true})
    @IsOptional()
    @IsInt({ message: 'El ID debe ser un numero entero'})
    @Min(1, { message: 'El ID debe ser minimo 1'})
    @Max(2, { message: 'El ID debe ser menor de 3' })
    idTipoCliente?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'El ruc debe ser una cadena de texto'})
    @MaxLength(11, { message: 'El ruc debe tener al menos 11 digitos'})
    @Matches(/^[0-9]+$/, { message: 'El ruc solo debe contener numeros' })
    ruc?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'La razon social debe ser una cadena de texto'})
    @MaxLength(100, { message: 'La razon social debe contener al menos 100 caracteres como maximo'})
    razonSocial?: string;
}