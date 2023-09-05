import { Module } from '@nestjs/common';
import GraphQLJSON from 'graphql-type-json';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import * as path from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './infrastructure/prisma.service';
import { RegistryModule } from './registry/registry.module';
import { ContributionManagerModule } from './contribution-manager/contribution-manager.module';
import { ConsoleModule } from './console/console.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: process.env.NODE_ENV !== 'production',
      typePaths: [path.join('src/schemas/*.graphql')],
      resolvers: { JSON: GraphQLJSON },
    }),
    RegistryModule,
    ContributionManagerModule,
    ConsoleModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
