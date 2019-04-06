import { BadRequestException, Body, Controller, Delete, Get, HttpException, HttpStatus, Inject, Param, Post, Put, Query } from "@nestjs/common";
import { ResponseEntity } from "src/common/ResponseEntity";
import { User } from "./model/user.interface";
import { UserService } from "./user.service";
import { UserServiceHelper } from "./user.service.helper";

@Controller('user')
export class UserController {

    constructor(@Inject('UserService') private userService: UserService,
        @Inject('UserServiceHelper') private serviceHelper: UserServiceHelper) {
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

        console.log("create user",userReq)
        if (!userReq) {
            throw new BadRequestException('create user req body is empty');
        }
        var userRes = await this.userService.getUserByEmail(userReq.emailId);
        console.log("is ", userRes);

        // User response is success then user alreay exists so return 
        if (userRes.success) {
            return userRes;
        }
        console.log(userReq);

        const res = await this.userService.createUser(userReq);

        console.log(res);
        return res;
    }

    @Post('/initiate/verification')
    async initiateUserVerification(@Body() body) {

        if (!body.userId) {
            throw new BadRequestException('userid is missing');
        }
       
        console.log("initiating verfication for " + body.userId);

        const res = await this.serviceHelper.initiateVerification(body.userId);
        console.log(res);
        return res;
    }

    @Post('/verify/otp')
    async userVerifyOtp(@Body() body) {

        if (!body.userId) {
            throw new BadRequestException('userid is missing');
        }
        if (!body.code) {
            throw new BadRequestException('verification code is missing');
        }
        if (!body.accId) {
            throw new BadRequestException('accId is missing');
        }

        return await this.serviceHelper.verifyOtp(body.userId, body.accId, body.code);

    }

    @Post('/login')
    async loginUser(@Body() body) {

        if (!body.emailId) {
            throw new BadRequestException('userid is missing in body');
        }
        if (!body.password) {
            throw new BadRequestException('password is missing in body');
        }
        console.log("initiating verfication for " + body.userId);

        var isUserExists = await this.getUserByEmail(body.emailId);

        if (isUserExists) {
            return await this.userService.checkLoginLookup(body.emailId, body.password, isUserExists);
        } else {
            return new ResponseEntity(false, HttpStatus.NO_CONTENT, `No user with email ${body.emailId}`, null);
        }

    }

    @Get('/email/:emailId')
    async getUserByEmail(@Param() params) {

        if (!params.emailId) {
            throw new BadRequestException('emailId is empty');
        }

        return await this.userService.getUserByEmail(params.emailId);
    }

    @Get('/:userId')
    async getUser(@Param() params) {

        if (!params.userId) {
            throw new BadRequestException(' user id is empty');
        }

        return await this.userService.getUser(params.userId);
    }

    @Put('/:userId')
    async updateUser(@Param() params, @Body() userReq: User) {

        if (!params.userId) {
            throw new BadRequestException('user id is empty');
        }
        if (!userReq) {
            throw new BadRequestException('create user req body is empty');
        }
        if (!userReq.emailId) {
            throw new BadRequestException('emailId is missing in body is');
        }
        if (!userReq._id) {
            throw new BadRequestException('_id is missing in body is');
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




    // @Get('/send/tesst/mail')
    // async testMail() {
    //     return await this.serviceHelper.testMail();
    // }
}