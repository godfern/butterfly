import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, Res } from "@nestjs/common";
import { ResponseEntity } from "../common/ResponseEntity";
import { User, UserStatus } from "./model/user.interface";
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
    async createUser(@Body() userReq, @Res() response) {

        console.log("create user", userReq)
        if (!userReq) {
            throw new BadRequestException('create user req body is empty');
        }
        var userRes = await this.userService.getUserByEmail(userReq.emailId);

        // User response is success then user alreay exists so return 
        if (userRes.success) {
            return response.status(HttpStatus.CONFLICT)
                .json(new ResponseEntity(false, HttpStatus.CONFLICT, `User already exists with email ${userReq.emailId}`, null));
        }
        console.log(userReq);

        const res = await this.userService.createUser(userReq);

        console.log(res);
        return response.json(res);
    }

    @Post('/initiate/verification')
    async initiateUserVerification(@Body() body, @Res() response) {

        if (!body.userId) {
            throw new BadRequestException('userid is missing');
        }

        console.log("initiating verfication for " + body.userId);

        const res = await this.serviceHelper.initiateVerification(body.userId);

        return response.status(res.statusCode).json(res);
    }

    @Post('/verify/otp')
    async userVerifyOtp(@Body() body, @Res() response) {

        if (!body.userId) {
            throw new BadRequestException('userid is missing');
        }
        if (!body.code) {
            throw new BadRequestException('verification code is missing');
        }
        if (!body.accId) {
            throw new BadRequestException('accId is missing');
        }

        const res = await this.serviceHelper.verifyOtp(body.userId, body.accId, body.code);

        return response.status(res.statusCode).json(res);

    }

    @Post('/login')
    async loginUser(@Body() body, @Res() response) {

        console.log("login user")
        if (!body.emailId) {
            throw new BadRequestException('emailId is missing in body');
        }
        if (!body.password) {
            throw new BadRequestException('password is missing in body');
        }

        var isUserExists = await this.userService.getUserByEmail(body.emailId);

        var res;
        if (isUserExists.success) {

            if (isUserExists.data.userStatus == UserStatus.VERIFIED) {
                res = await this.userService.checkLoginLookup(body.emailId, body.password, isUserExists);
            } else {
                return response.status(HttpStatus.BAD_REQUEST).json(`User email ${body.emailId} is not verified yet.`);
            }

        } else {
            res = isUserExists;
        }

        return response.status(res.statusCode).json(res);
    }

    @Get('/email/:emailId')
    async getUserByEmail(@Param() params, @Res() res) {

        if (!params.emailId) {
            throw new BadRequestException('emailId is empty');
        }
        var response = await this.userService.getUserByEmail(params.emailId);

        return res.status(response.statusCode).json(response);
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