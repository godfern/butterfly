import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
//import cors from 'cors';
import { AppModule } from './app.module';
import { MyLogger } from './logger/MyLogger';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('butterfly-srv');
  app.useLogger(MyLogger);
  app.enableCors();
  const options = new DocumentBuilder()
    .setTitle('Butterfly Services')
    .setDescription('The butterfly API documentation')
    .setBasePath('butterfly-srv/')
    .setVersion('1.0')
    .addTag('user', 'butterfly user services')
    .addTag('language', 'butterfly language services')
    .addTag('category', 'butterfly category services')
    .build();
  const document = SwaggerModule.createDocument(app, options);

  SwaggerModule.setup('butterfly-srv/docs', app, document);

  await app.listen(3000);

}
bootstrap();
