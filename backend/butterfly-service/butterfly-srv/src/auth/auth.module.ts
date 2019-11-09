
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./auth.service";
import { jwtConstants } from "./constants";
import { JwtStrategy } from "./jwt.strategy";
@Module({

    imports: [
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '600s' }
        })
    ],
    providers: [AuthService, JwtStrategy],
    exports: [AuthService]

})
export class AuthModule {

}