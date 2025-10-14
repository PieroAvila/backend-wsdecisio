import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UsuarioLogin {
  @Field()
  usuario: string;

  @Field()
  dniPersonal: string;
}
