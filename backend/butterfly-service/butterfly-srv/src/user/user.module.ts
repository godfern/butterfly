import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { OtpLookupSchema } from "./model/otp.lookup.schema";
import { UserSchema } from "./model/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserServiceHelper } from "./user.service.helper";

@Module({
    imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, { name: 'OtpLookup', schema: OtpLookupSchema }])],
    controllers: [UserController],
    providers: [UserService, UserServiceHelper],
})
export class UserModule {
}