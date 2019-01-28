import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('butterfly-user-srv');
  // app.use(cors());
  await app.listen(3000);
}
bootstrap();
