import { Controller, Inject, Get, Query, Post, Body, BadRequestException, Param, Put, Delete } from "@nestjs/common";
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

    @Post('/create')
    async createUser(@Body() userReq) {

        if (!userReq) {
            throw new BadRequestException('create user req body is empty');
        }
        console.log(userReq);
        const res = await this.userService.createUser(userReq);
        console.log(res);
        return res;
    }

    @Get('/:userId')
    async getUser(@Param() params) {

        if (!params.userId) {
            throw new BadRequestException(' user id is empty');
        }

        return await this.userService.getUser(params.userId);
    }

    @Put('/:userId')
    async updateUser(@Param() params, @Body() userReq) {

        if (!params.userId) {
            throw new BadRequestException('user id is empty');
        }
        if (!userReq) {
            throw new BadRequestException('create user req body is empty');
        }
        console.log(userReq);
        const res = await this.userService.updateUser(userReq);
        console.log(res);
        return res;
    }

    @Delete('/remove/:userId')
    async removeUser(@Param() params) {
        if (!params.userId) {
            throw new BadRequestException('user id is empty');
        }
        return await this.userService.removeUser(params.userId);
    }

}