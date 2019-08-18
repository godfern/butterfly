import { JwtService  } from "@nestjs/jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class AuthService{
    constructor( private readonly jwtService:JwtService){

    }

    async login(user: any) {
        const payload = { username: user.emailId, sub: user._id };
        console.log(payload)
        return {
            access_token: this.jwtService.sign(payload),
            userId:user._id
        };
    }
}