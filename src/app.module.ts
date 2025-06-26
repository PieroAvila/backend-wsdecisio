import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { PrismaModule } from './prisma/prisma.module';
import { CargoModule } from './cargo/cargo.module';
import { join } from 'path';
import { PersonalModule } from './personal/personal.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true,
      path: '/graphql',
    }),
    PrismaModule,
    CargoModule,
    PersonalModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
