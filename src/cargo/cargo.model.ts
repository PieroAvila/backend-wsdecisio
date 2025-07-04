import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Personal } from 'src/personal/personal.model';

@ObjectType()
export class Cargo {
  @Field(() => Int)
  idCargo: number;

  @Field({ nullable: true})
  cargo: string;

  @Field(() => Float)
  pagoHora: number;

  @Field(() => [Personal], { nullable: true })
  personales?: Personal[];
}
