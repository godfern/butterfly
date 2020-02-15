import { Module } from "@nestjs/common";
import { NotificationService } from "../service/notification.service";
import { NotificationController } from "../controller/notification.controller";
import { AuthModule } from "auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { NotificationSchema } from "../model/notification.schema";
import { UserModule } from "../../user/user.module";
import { UserService } from "../../user/user.service";

@Module({
    imports: [UserModule,
        MongooseModule.forFeature([{ name: 'Notification', schema: NotificationSchema }])],
    controllers:[NotificationController],
    providers:[NotificationService,UserService]
})
export class NotificationModule{
    constructor(){}
}