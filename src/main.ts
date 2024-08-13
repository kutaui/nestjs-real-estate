import { NestFactory } from '@nestjs/core';
import { UserModule } from './modules/users/user.module';

async function bootstrap() {
  const app = await NestFactory.create(UserModule);
  await app.listen(3000);
}
bootstrap();
