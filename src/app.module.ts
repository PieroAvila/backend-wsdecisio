import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { CargoModule } from './cargo/cargo.module';
import { join } from 'path';
import { PersonalModule } from './personal/personal.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ClienteModule } from './cliente/cliente.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { CompraModule } from './compra/compra.module';
import { DetaCompraModule } from './detallecompra/detallecompra.module';
import { MaquinariaModule } from './maquinaria/maquinaria.module';
import { MaterialModule } from './material/material.module';
import { ProyectoModule } from './proyecto/proyecto.module';
import { DetaProyectoModule } from './detaproyecto/detaproyecto.module';
import { DetaMaterialModule } from './detamaterial/detamaterial.module';
import { DetaMaquinariaModule } from './detamaquinaria/detamaquinaria.module';
import { ActividadModule } from './actividad/actividad.module';
import { MantenimientoModule } from './mantenimiento/mantenimiento.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      introspection: true,
      path: '/graphql',
    }),
    PrismaModule,
    CargoModule,
    PersonalModule,
    UsuarioModule,
    ClienteModule,
    ProveedorModule,
    CompraModule,
    DetaCompraModule,
    MaquinariaModule,
    MaterialModule,
    ProyectoModule,
    DetaProyectoModule,
    DetaMaterialModule,
    DetaMaquinariaModule,
    ActividadModule,
    MantenimientoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
