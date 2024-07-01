import { Module } from '@nestjs/common';
import { ConfigModule as CustomConfigModule } from './config/config.module'; // Custom ConfigModule
import { ConfigService } from '@nestjs/config'; // Correct import
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bull';
import { join } from 'path';
import { EmployeeModule } from './employee/employee.module';
import { QueueModule } from './queue/queue.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    CustomConfigModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      playground: true, // Enable GraphQL Playground
    }),
    MongooseModule.forRootAsync({
      imports: [CustomConfigModule],
      // useFactory: async (configService: ConfigService) => {
      //   const uri = configService.get<string>('MONGODB_URI');
      //   const inv = configService.get<string>('NODE_ENV');
      //   console.log('MongoDB URI:', uri); // Log the value
      //   console.log('inv:', inv); // Log the value
      //   return {
      //     uri,
      //   };
      // },
      // useFactory: async (configService: ConfigService) => ({
      //   uri: configService.get<string>('MONGODB_URI'),
      // }),
      useFactory: async (configService: ConfigService, customConfig: any) => {
        const uri =
          configService.get<string>('NODE_ENV') === 'development'
            ? customConfig.MONGODB_URI
            : configService.get<string>('MONGODB_URI');
        console.log('MongoDB URI:', uri); // Log the value
        return {
          uri,
        };
      },
      inject: [ConfigService, 'CUSTOM_CONFIG'],
    }),
    BullModule.forRootAsync({
      imports: [CustomConfigModule],
      useFactory: async (configService: ConfigService, customConfig: any) => ({
        redis: {
          host:
            configService.get<string>('NODE_ENV') === 'development'
              ? customConfig.REDIS_HOST
              : configService.get<string>('REDIS_HOST'),
          port: configService.get<number>('REDIS_PORT'),
          maxRetriesPerRequest: configService.get<number>('REDIS_MAX_RETRIES'),
        },
      }),
      inject: [ConfigService, 'CUSTOM_CONFIG'],
    }),
    EmployeeModule,
    EmailModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
