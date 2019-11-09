import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './logger/LoggerMiddleware';
import { UserModule } from './user/user.module';
import { CategoryModule } from './category/category.module';
import { LanguageModule } from './language/language.module';
import { NotificationModule } from './notification/module/notification.module';
const MONGO_DB = 'mongodb+srv://butterfly-user-write:Butterfly1234@butterfly-cluster-lmy3d.mongodb.net/test?retryWrites=true&w=majority';

@Module({
  imports: [AuthModule, UserModule, CategoryModule, LanguageModule, NotificationModule, MongooseModule.forRoot(/*`mongodb://${MONGO_DB.hosts}/${MONGO_DB.database_name}${MONGO_DB.replica_set}`,
    { user: MONGO_DB.user_name, pass: MONGO_DB.password, auth: { authdb: 'admin' } }*/MONGO_DB, { useNewUrlParse: true })],
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
