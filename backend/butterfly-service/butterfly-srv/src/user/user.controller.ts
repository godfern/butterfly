import { Controller, Inject, Get, Query } from "@nestjs/common";
import { UserService } from "./user.service";
import { async } from "rxjs/internal/scheduler/async";
import { queue } from "rxjs/internal/scheduler/queue";

@Controller('user')
export class UserController {

    constructor(@Inject('UserService') private userService: UserService) {
    }

    @Get('/test')
    async hello() {
        console.log("hello ");
        return "success";
    }

    @Get('/welcome')
    async getUserService(@Query() query) {
        return await this.userService.getUserService(query.name);
    }


}