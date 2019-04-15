import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoryModule } from './category/category.module';
import { LanguageModule } from './language/language.module';
import { LoggerMiddleware } from './logger/LoggerMiddleware';
import { UserModule } from './user/user.module';
const MONGO_DB = require('./database.conf.json');

@Module({
  imports: [UserModule, CategoryModule, LanguageModule, MongooseModule.forRoot(`${MONGO_DB.hosts}`,
    { useNewUrlParser: true })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('')
  }
}
