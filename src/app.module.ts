import { Module } from '@nestjs/common';
import { UserModule } from './modules/users/user.module';
import { DatabaseModule } from './modules/database/database.module';
import { ConfigModule } from '@nestjs/config';
import * as Joi from '@hapi/joi';
import { PropertyModule } from './modules/properties/property.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PORT: Joi.number(),
      }),
    }),
    UserModule,
    DatabaseModule,
    PropertyModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
