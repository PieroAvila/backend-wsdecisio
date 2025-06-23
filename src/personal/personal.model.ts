import { Field, Int, ObjectType } from '@nestjs/graphql';
import { Actividad } from 'src/actividad/actividad.model';
import { Cargo } from 'src/cargo/cargo.model';
import { Usuario } from 'src/usuario/usuario.model';

@ObjectType()
export class Personal {
  @Field()
  dniPersonal: string;

  @Field()
  nombre: string;

  @Field()
  apellido: string;

  @Field(() => Int)
  edad: number;

  @Field()
  correo: string;

  @Field()
  telefono: string;

  @Field()
  cuentaBcp: string;

  @Field(() => Int)
  idCargo: number;

  @Field(() => Cargo, { nullable: true })
  cargo?: Cargo;

  @Field(() => [Usuario], { nullable: true })
  usuarios?: Usuario[];

  @Field(() => [Actividad], { nullable: true })
  actividades?: Actividad[];
}
