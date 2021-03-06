import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { LoginLookupSchema } from "./model/login.lookup.schema";
import { OtpLookupSchema } from "./model/otp.lookup.schema";
import { UserSchema } from "./model/user.schema";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { UserServiceHelper } from "./user.service.helper";

@Module({
    imports: [AuthModule,
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema },
        { name: 'LoginLookup', schema: LoginLookupSchema }
            , { name: 'OtpLookup', schema: OtpLookupSchema }])],
    controllers: [UserController],
    providers: [UserService, UserServiceHelper],
})
export class UserModule {
}