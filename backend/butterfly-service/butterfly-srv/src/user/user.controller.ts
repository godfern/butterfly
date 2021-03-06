import { BadRequestException, Body, Controller, Delete, Get, HttpStatus, Inject, Param, Post, Put, Query, Res, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ApiUseTags } from "@nestjs/swagger";
import { ResponseEntity } from "../common/ResponseEntity";
import { LoginReqModel } from "./model/login.req.model";
import { PrimaryType, User, UserStatus } from "./model/user.interface";
import { UserService } from "./user.service";
import { UserServiceHelper } from "./user.service.helper";
import { ResetPasswordRequest } from "./model/reset.password.req";

@ApiUseTags('user')
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

    @UseGuards(AuthGuard('jwt'))
    @Get('/welcome')
    async getUserService(@Query() query) {
        return await this.userService.getUserService(query.name);
    }

    @Get('/all')
    async getAllUser() {
        return await this.userService.getAllUser();
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

    @Post('/initiate/phone/verification')
    async initiatePhoneVerification(@Query() userId, @Res() response) {

        if (!userId) {
            throw new BadRequestException('userid is missing in params');
        }

        console.log("initiating verfication for " + userId);

        const res = await this.serviceHelper.initiateVerification(userId);

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
    async loginUser(@Body() body: LoginReqModel, @Res() response) {

        console.log("login user")
        if (!body.provider) {
            throw new BadRequestException('provider is missing in request');
        }
        if (body.provider == PrimaryType.EMAIL && !body.emailId) {
            throw new BadRequestException('emailId is missing in body');
        } if (body.provider == PrimaryType.PHONE_NUMBER && !body.phoneNumber) {
            throw new BadRequestException('phoneNumber is missing in body');
        }
        if (!body.password) {
            throw new BadRequestException('password is missing in body');
        }

        var isUserExists

        switch (body.provider) {
            case PrimaryType.EMAIL:
                isUserExists = await this.userService.getUserByEmail(body.emailId);
                break;

            case PrimaryType.PHONE_NUMBER:
                isUserExists = await this.userService.getUserByPhone(body.phoneNumber);
                break;
        }

        var res;

        console.log(isUserExists);

        if (isUserExists.success) {

            if (isUserExists.data.userStatus == UserStatus.VERIFIED) {
                //  once user is verified return access token

                // check password from lookup collection
                res = await this.userService.checkLoginLookup(body.emailId, body.password, isUserExists);
            } else {
                return response.status(HttpStatus.BAD_REQUEST).json(`User email ${body.emailId} is not verified yet.`);
            }

        } else {
            res = isUserExists;
        }

        return response.status(res.statusCode).json(res);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/email/:emailId')
    async getUserByEmail(@Param() params, @Res() res) {

        if (!params.emailId) {
            throw new BadRequestException('emailId is empty');
        }
        var response = await this.userService.getUserByEmail(params.emailId);

        return res.status(response.statusCode).json(response);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/:userId')
    async getUser(@Param() params) {

        if (!params.userId) {
            throw new BadRequestException(' user id is empty');
        }

        return await this.userService.getUser(params.userId);
    }

    @UseGuards(AuthGuard('jwt'))
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

    @Put('/fcmids/:userId')
    async updateUserFcmIds(@Param() params, @Body() body, @Res() response) {

        if (!params.userId) {
            throw new BadRequestException('user id is empty');
        }

        if (!body.fcmIds) {
            throw new BadRequestException('fcm id is empty in request body');
        }
        const res = await this.userService.updateUserFcmIds(params.userId, body.fcmIds);

        return response.json(res);

    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/remove/:userId')
    async removeUser(@Param() params) {
        if (!params.userId) {
            throw new BadRequestException('user id is empty');
        }
        return await this.userService.removeUser(params.userId);
    }

    @Post('/send/fcm/notification')
    async sendFcmNotification(@Query('fcmId') fcmId: string,
        @Query('title') title: string,
        @Query('body') body: string, ) {
        return await this.serviceHelper.sendFcmNotification(fcmId, title, body);
    }

    @Put('/initiate/password-reset')
    async initiatePasswordReset(@Query('email') email:string, @Res() response) {

        if (!email) {
            throw new BadRequestException('email is missing in params');
        }

        console.log("initiating passoword reset for " + email);

        const res = await this.serviceHelper.initiatePasswordReset(email);

        return response.status(res.statusCode).json(res);
    }

    @Put('/verify/password-reset')
    async verifyPasswordReset(@Body() resetPasswordReq: ResetPasswordRequest,@Res() response) {

        if (!resetPasswordReq || !resetPasswordReq.emailId || !resetPasswordReq.newpassword || !resetPasswordReq.resetToken) {
            throw new BadRequestException('Invalid resetPassword Request. Please check the payload.');
        }

        console.log("verifying passoword reset for " + resetPasswordReq.emailId);

        const res = await this.serviceHelper.verifyPasswordResetToken(resetPasswordReq);

        return response.status(res.statusCode).json(res);
    }
    // @Get('/send/tesst/mail')
    // async testMail() {
    //     return await this.serviceHelper.testMail();
    // }
}