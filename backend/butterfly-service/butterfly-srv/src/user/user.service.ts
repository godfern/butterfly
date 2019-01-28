import { Injectable } from "@nestjs/common";

@Injectable()
export class UserService {

    getUserService(name: string) {
        return "Welcome " + name + " butterfly";
    }

}