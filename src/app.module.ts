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

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: false,
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
