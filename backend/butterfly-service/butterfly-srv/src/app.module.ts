import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserController } from './user/user.controller';
import { UserModule } from './user/user.module';
const MONGO_DB = require('./database.conf.json');

@Module({
  imports: [UserModule, MongooseModule.forRoot(`mongodb://${MONGO_DB.hosts}/${MONGO_DB.database_name}${MONGO_DB.replica_set}`,
    { user: MONGO_DB.user_name, pass: MONGO_DB.password, auth: { authdb: 'admin' } })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
