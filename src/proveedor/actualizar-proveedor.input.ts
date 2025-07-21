import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString, Length, Matches } from "class-validator";

@InputType()
export class ActualizarProveedorInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString({ message: 'La cuenta BCP debe ser una cadena de texto' })
    @Length(14, 14, { message: 'La cuenta BCP debe tener 14 digitos' })
    @Matches(/^[0-9]+$/, { message: 'La cuenta BCP solo debe contener números' })
    cuentaBcp?: string;
}