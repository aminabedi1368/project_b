import { Module } from '@nestjs/common';
import {
  ConfigModule as NestConfigModule,
  ConfigService,
} from '@nestjs/config';
import developmentConfig from './development';
import productionConfig from './production';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      load: [
        process.env.NODE_ENV === 'production'
          ? productionConfig
          : developmentConfig,
      ],
      envFilePath: '.env',
    }),
  ],
  providers: [
    {
      provide: 'CUSTOM_CONFIG',
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const environment = configService.get<string>('NODE_ENV');
        if (environment === 'development') {
          return developmentConfig();
        } else {
          return productionConfig();
        }
      },
    },
  ],
  exports: ['CUSTOM_CONFIG'],
})
export class ConfigModule {}
