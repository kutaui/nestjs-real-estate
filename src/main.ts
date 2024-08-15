import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('RealEstate API')
    .setDescription('Real Estate Api using Nestjs, Typeorm and Passport')
    .setVersion('1.0')
    .addTag('Real')
    .addCookieAuth('token')
    .build();
   
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
