import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class ActualizarPersonalInput {
  @Field()
  @IsOptional()
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @Matches(/^[A-Za-zñÑ\s]+$/, {
    message: 'El nombre solo debe contener letras',
  })
  @MaxLength(60, { message: 'El nombre debe tener 60 caracteres como máximo' })
  nombre?: string;

  @Field()
  @IsOptional()
  @IsString({ message: 'El apellido debe ser una cadena de texto' })
  @Matches(/^[A-Za-zñÑ\s]+$/, {
    message: 'El apellido solo debe contener letras',
  })
  @MaxLength(60, { message: 'El nombre debe tener 60 caracteres como máximo' })
  apellido?: string;

  @Field(() => Int)
  @IsOptional()
  @IsInt({ message: 'La edad debe ser un numero entero' })
  @Min(18, { message: 'La edad debe ser mayor de 17 años' })
  @Max(65, { message: 'La edad debe ser menor a 66 años' })
  edad?: number;

  @Field()
  @IsOptional()
  @IsEmail({}, { message: 'debe cumplir con el formato del correo' })
  @Matches(/^[\w.-]+@weldingsteelsg\.com$/, {
    message: 'El correo debe pertenecer al dominio @weldingsteelsg.com',
  })
  @MaxLength(60, { message: 'El correo debe tener 60 caracteres' })
  correo?: string;

  @Field()
  @IsOptional()
  @IsString({ message: 'El telefono debe ser una cadena de texto' })
  @Matches(/^9\d{8}$/, {
    message: 'El número debe tener 9 dígitos y comenzar con 9',
  })
  @Length(9, 9, { message: 'El telefono debe tener 9 digitos' })
  telefono?: string;

  @Field()
  @IsOptional()
  @IsString({ message: 'La cuenta BCP debe ser una cadena de texto' })
  @Matches(/^[0-9]+$/, { message: 'La cuenta BCP solo debe contener números' })
  @Length(14, 14, { message: 'La cuenta BCP debe contener 14 digitos' })
  cuentaBcp?: string;

  @Field(() => Int)
  @IsOptional()
  @IsInt({ message: 'El cargo debe ser un numero entero' })
  idCargo?: number;
}
