
import { Module } from "@nestjs/common";
import { jwtConstants } from "./constants";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./jwt.strategy";
import { UserModule } from "user/user.module";
import { CategoryModule } from "../category/category.module";
import { LanguageModule } from "../language/language.module";
@Module({
    
    imports:[
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions:{expiresIn: '60s'}
        })
    ],
    providers: [AuthService],
    exports: [AuthService]

})
export class AuthModule{

}