import { Field, Int, ObjectType } from "@nestjs/graphql";
import { DetaMaterial } from "src/detamaterial/detamaterial.model";

@ObjectType()
export class Material {
  @Field()
  codMaterial: string;

  @Field()
  descripcion: string;

  @Field(() => Int)
  cantidad: number;

  @Field()
  unidadMedida: string;

  @Field(() => [Material], { nullable: true })
  detalleProyectos?: DetaMaterial[];
}
