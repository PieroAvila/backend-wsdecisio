import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class MaquinariaDisponibleDTO {
  @Field(() => Int)
  idMaquinaria: number;

  @Field()
  codMaquinaria: string;

  @Field()
  descripcion: string;
}
