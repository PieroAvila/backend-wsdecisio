import { Field, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class DetaProyectoData {
  @Field(() => Int)
  idDetaProyecto: number;

  @Field()
  codProyecto: string;

  @Field()
  nombreProyecto: string;
}
