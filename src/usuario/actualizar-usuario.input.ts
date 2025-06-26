import { Field, InputType } from "@nestjs/graphql";
import {IsOptional, IsString} from "class-validator";

@InputType()
export class ActualizarUsuarioInput {
    @Field()
    @IsOptional()
    @IsString({ message: 'La clave debe ser una cadena de texto' })
    clave?: string;
}