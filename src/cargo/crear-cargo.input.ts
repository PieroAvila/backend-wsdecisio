import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';

@InputType()
export class CrearCargoInput {
  @Field()
  @IsString({ message: 'El cargo debe ser una cadena de texto' })
  @Matches(/^[A-Za-zñÑ\s]+$/, {
    message: 'El cargo solo debe contener letras',
  })
  @MaxLength(60, { message: 'El cargo debe tener 60 caracteres maximo' })
  cargo: string;

  @Field(() => Float)
  @IsNotEmpty({ message: 'El pago hora no debe quedar vacio' })
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La cantidad debe ser un numero con 2 decimales' },
  )
  @Min(4, { message: 'El pago no debe ser menor de 4 soles por hora' })
  pagoHora: number;
}
