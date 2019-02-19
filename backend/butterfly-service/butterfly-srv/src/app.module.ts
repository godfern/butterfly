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
  imports: [UserModule, CategoryModule, LanguageModule, MongooseModule.forRoot(`mongodb://${MONGO_DB.hosts}/${MONGO_DB.database_name}${MONGO_DB.replica_set}`,
    { user: MONGO_DB.user_name, pass: MONGO_DB.password, auth: { authdb: 'admin' } })],
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
