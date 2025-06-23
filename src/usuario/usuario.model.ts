import { Field, ObjectType } from '@nestjs/graphql';
import { Personal } from 'src/personal/personal.model';

@ObjectType()
export class Usuario {
  @Field()
  usuario: string;

  @Field()
  clave: string;

  @Field()
  dniPersonal: string;

  @Field(() => Personal)
  personal: Personal;
}
