import { Field, Float } from '@nestjs/graphql';
import { IsNumber, IsOptional, Min } from 'class-validator';

export class ActualizarCargoDto {
  @Field(() => Float)
  @IsOptional()
  @IsNumber(
    { maxDecimalPlaces: 2 },
    { message: 'La cantidad debe ser un numero con 2 decimales' },
  )
  @Min(4, { message: 'El pago hora no debe ser menor a 4 soles' })
  pagoHora?: number;
}
