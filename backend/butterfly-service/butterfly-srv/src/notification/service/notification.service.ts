import { HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ResponseEntity } from "../../common/ResponseEntity";
import FCM_CONFIG from "../../fcm.conf.json";
import { UserDto } from "../../user/model/user.dto";
import { UserService } from "../../user/user.service";
import { Notification } from "../model/notification.interface";
import { SendNotificationReq } from "../model/send.notification.req.model";

var FCM = require('fcm-node');


@Injectable()
export class NotificationService {
    constructor(private readonly userService: UserService,
        @InjectModel('Notification') private readonly notificaitonModel: Model<Notification>) {

    }

    async sendNotfication(sendNotficationReq: SendNotificationReq) {

        // get reciver user
        var reciverUserRes: ResponseEntity = await this.userService.getUserByEmail(sendNotficationReq.reciverEmail)

        if (reciverUserRes.statusCode == HttpStatus.OK) {
            var reciverUser: UserDto = reciverUserRes.data
            console.log(reciverUser.firstName)

            return await this.sendFcmNotification(sendNotficationReq, reciverUser.fcmIds)
        } else {
            return new ResponseEntity(false, HttpStatus.NO_CONTENT, null, null)
        }

    }

    async sendFcmNotification(sendNotficationReq: SendNotificationReq, tokens: string[]) {
        var serverKey = FCM_CONFIG.server_key; //put your server key here
        var fcm = new FCM(serverKey);

        if (tokens) {

            var isSent = false
            for (let token of tokens) {

                var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
                    to: token,
            
                    notification: {
                        title: sendNotficationReq.title,
                        body: sendNotficationReq.content
                    },

                    data: {  //you can send only notification or only data(or include both)
                        title: sendNotficationReq.title,
                        body: sendNotficationReq.content
                    }
                };

                var obj: boolean = await new Promise(function (resolve, reject) {
                    fcm.send(message, function (err, data) {
                        if (err !== null) reject(false);
                        else resolve(true);
                    });
                });

                if (obj) {
                    isSent = obj
                }

                console.log("loop " + JSON.stringify(obj))
            }
            if (isSent) {
                // once success of notification delivered save into history
                var notification: Notification = {} as Notification

                notification.senderId = sendNotficationReq.senderId
                notification.reciverEmail = sendNotficationReq.reciverEmail
                notification.title = sendNotficationReq.title
                notification.content = sendNotficationReq.content
                var res = await this.notificaitonModel.create(notification)

                return new ResponseEntity(true, HttpStatus.OK, null, res)
            } else {
                return new ResponseEntity(false, HttpStatus.EXPECTATION_FAILED, null, { message: "could not send notification" })
            }

        } else {
            return new ResponseEntity(false, HttpStatus.EXPECTATION_FAILED, null, { message: "FcmIds for reciver not found" })
        }

    }

    async refreshContactList(err, response) {
        alert('Hello World' + response);
    }


    async getNotifications(userId: string) {
        return await this.notificaitonModel.find({})
    }
}