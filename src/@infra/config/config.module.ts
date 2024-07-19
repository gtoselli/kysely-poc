import { Global, Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as Joi from 'joi';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        DB_CONNECTION_STRING: Joi.string().required(),
        PORT: Joi.number().required(),
      }),
    }),
  ],
})
export class ConfigModule {}
