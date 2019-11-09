import { Controller, HttpStatus, Post, Body, Get, Query } from "@nestjs/common";
import { ApiUseTags } from "@nestjs/swagger";
import { ResponseEntity } from "../../common/ResponseEntity";
import { UserService } from "user/user.service";
import { UserDto } from "../../user/model/user.dto";
import { SendNotificationReq } from "../model/send.notification.req.model";
import { NotificationService } from "../service/notification.service";

@ApiUseTags('notifications')
@Controller('notifications')
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {

    }

    @Post('/send')
    async sendNotfication(@Body()sendNotficationReq: SendNotificationReq) {

        // get reciver user
        var reciverUserRes: ResponseEntity = await this.notificationService.sendNotfication(sendNotficationReq)

        return reciverUserRes;
    }

    @Get('/history')
    async getNofications(@Query('userId')userId:string){
        return await this.notificationService.getNotifications(userId);
    }
}