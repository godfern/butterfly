import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { AuthService } from "../auth/auth.service";
import { ResponseEntity } from "../common/ResponseEntity";
import SMTP_CONFIG from "../config/mailjet-mail-config.json";
import FCM_CONFIG from "../fcm.conf.json";
import MSG_CONFIG from "../twillio_msg_config.json";
import { LoginLookup } from "./model/login.lookup.interface";
import { OtpLookup } from "./model/otp.lookup.interface";
import { ResetPasswordRequest } from "./model/reset.password.req";
import { UserStatus } from "./model/user.interface";
import { UserService } from "./user.service";

var otpGenerator = require('otp-generator')
let dateTime = require('date-and-time');
// var nodeMailer = require('nodemailer');
var FCM = require('fcm-node');
const mailjet = require('node-mailjet')
    .connect('d6bdc0c4196e4ccc2a4e736bf270c814', '93b639039ed6b3b4e25565972447bdb3')
const sendEmail = mailjet.post("send", { 'version': 'v3.1' })

// let transpoter = nodeMailer.createTransport({
//     service:'gmail',
//     logger: true,
//     port: 465,
//     secure: true,
//     auth: {
//         user: 'ggtest1213@gmail.com',
//         pass: '1213ggtest'
//     },
//     tls: {
//         rejectUnauthorized: false
//     }
// });

var accountSid = MSG_CONFIG.account_sid; // Your Account SID from www.twilio.com/console
var authToken = MSG_CONFIG.authToken;   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client



@Injectable()
export class UserServiceHelper {

    constructor(@Inject('UserService') private userService: UserService,
        @Inject('AuthService') private readonly authService: AuthService) {
        client = new twilio(accountSid, authToken);
    }

    async initiateVerification(userId: string) {

        // get user from db
        var user: any = await this.userService.getUser(userId);

        if (user) {

            var attempts: any = await this.userService.getOtpLookupsByUser(userId);

            if (attempts) {
                if (attempts.length > 5) {
                    return new ResponseEntity(false, HttpStatus.FORBIDDEN, "Exceeded verification attempts ", null);
                }
            }

            var otpLookup: OtpLookup = {} as OtpLookup;

            otpLookup.code = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
            otpLookup.userId = userId;
            otpLookup.expireTime = dateTime.addHours(new Date, 1);

            var otpLookupRes = await this.userService.createOtpLookup(otpLookup);

            // let HelperOptions = {
            //     from: 'ggtest1213@gmail.com',
            //     to: user.emailId,
            //     subject: "Butterfly verification code",
            //     text: "Your verification code is " + otpLookup.code
            // }
            let HelperOptions = {
                "Messages": [
                    {
                        "From": {
                            "Email": SMTP_CONFIG.senderEmailId,
                            "Name": SMTP_CONFIG.senderName,
                        },
                        "To": [
                            {
                                "Email": user.emailId,
                                "Name": user.firstName
                            }
                        ],
                        "Subject": SMTP_CONFIG.mailSubject,
                        "HTMLPart": "<h3>Your verification code</h3><br />" + otpLookup.code
                    }
                ]
            }

            await this.testMail(HelperOptions);

            console.log(otpLookupRes);

            return new ResponseEntity(true, HttpStatus.CREATED, null, { "accId": otpLookupRes._id });

        } else {
            return new ResponseEntity(false, HttpStatus.NOT_FOUND, "User not found ", null);
        }
    }
    async initiatePasswordReset(email: string) {

        // get user from db
        var userRes: any = await this.userService.getUserByEmail(email);

        if (!userRes) {
            return new ResponseEntity(false, HttpStatus.NOT_FOUND, "User not found ", null);
        }

        // get login lookup

        let loginLookupRes = await this.userService.getLoginLookupByEmail(email);

        if (!loginLookupRes) {
            return new ResponseEntity(false, HttpStatus.NOT_FOUND, "User not found ", null);
        }

        let resetToken = await otpGenerator.generate(10, { alphabets: true, upperCase: false, specialChars: false });
        console.log('reset token ', resetToken)
        
        loginLookupRes.resetPasswordToken = resetToken

        console.log(`req `, loginLookupRes);
        // reset password in login lookup
        var otpLookupRes = await this.userService.updateResetPasswordLookup(loginLookupRes);

        let HelperOptions = {
            "Messages": [
                {
                    "From": {
                        "Email": SMTP_CONFIG.senderEmailId,
                        "Name": SMTP_CONFIG.senderName,
                    },
                    "To": [
                        {
                            "Email": email,
                            "Name": userRes.firstName
                        }
                    ],
                    "Subject": SMTP_CONFIG.mailResetSubject,
                    "HTMLPart": "<h3>Your password reset link token </h3><br />" + loginLookupRes.resetPasswordToken
                }
            ]
        }

        await this.testMail(HelperOptions);

        console.log(otpLookupRes);

        return new ResponseEntity(true, HttpStatus.OK, null, { "success": "Password reset initiated, please follow the instruction" });

    }

    async initiatePhoneVerification(userId: string) {

        // get user from db
        var user: any = await this.userService.getUser(userId);

        if (user) {

            // var attempts: any = await this.userService.getOtpLookupsByUser(userId);

            // if (attempts) {
            //     if (attempts.length > 5) {
            //         return new ResponseEntity(false, HttpStatus.FORBIDDEN, "Exceeded verification attempts ", null);
            //     }
            // }

            var otpLookup: OtpLookup = {} as OtpLookup;

            otpLookup.code = otpGenerator.generate(6, { alphabets: false, upperCase: false, specialChars: false });
            otpLookup.userId = userId;
            otpLookup.expireTime = dateTime.addHours(new Date, 1);

            var otpLookupRes = await this.userService.createOtpLookup(otpLookup);

            let HelperOptions = {
                from: 'ggtest1213@gmail.com',
                to: user.emailId,
                subject: "Butterfly verification code",
                text: "Your verification code is " + otpLookup.code
            }

            await this.testMail(HelperOptions);

            console.log(otpLookupRes);

            return new ResponseEntity(true, HttpStatus.CREATED, null, { "accId": otpLookupRes._id });

        } else {
            return new ResponseEntity(false, HttpStatus.NOT_FOUND, "User not found ", null);
        }
    }

    async verifyOtp(userId, accId, code) {

        var user: any = await this.userService.getUser(userId);
        var lookupEntry: any = await this.userService.getOtpLookupEntry(accId);

        if (!user) {
            return new ResponseEntity(false, HttpStatus.NOT_FOUND, "User not found ", null);
        }

        console.log(lookupEntry)
        if (!lookupEntry) {
            return new ResponseEntity(false, HttpStatus.BAD_REQUEST, "Invalid acc id", null);
        }

        if (lookupEntry) {
            // todo expire time check
            // dateTime.format(new Date(lookupEntry.expireTime)).
            if (lookupEntry.code == code) {

                console.log(UserStatus.VERIFIED);
                user.userStatus = UserStatus.VERIFIED;
                user.emailVerified = true;

                console.log(user);
                var updateUserRes = await this.userService.updateUserEmailVerified(userId);

                console.log(updateUserRes);

                var tokenRes = await this.authService.login(user);

                return new ResponseEntity(true, HttpStatus.OK, null, tokenRes);
            } else {
                return new ResponseEntity(false, HttpStatus.BAD_REQUEST, "Invalid verification code", null);
            }
        }

    }

    async verifyPasswordResetToken(passwordResetReq: ResetPasswordRequest) {


        var lookupEntry: LoginLookup = await this.userService.getLoginLookupByEmail(passwordResetReq.emailId);

        if (!lookupEntry) {
            return new ResponseEntity(false, HttpStatus.NO_CONTENT, "User not found ", null);
        }

        console.log(lookupEntry)
        // todo expire time check
        // dateTime.format(new Date(lookupEntry.expireTime)).
        if (lookupEntry.resetPasswordToken == passwordResetReq.resetToken) {

            let resetPasswordRes = await this.userService.updateUserPassword(passwordResetReq.emailId, passwordResetReq.newpassword)

            console.log('reset password res ', resetPasswordRes)
            return new ResponseEntity(true, HttpStatus.OK, null, "User password resetted successfully");
        } else {
            return new ResponseEntity(false, HttpStatus.BAD_REQUEST, "Invalid verification code", null);
        }


    }

    async testMail(helperOption) {
        sendEmail.request(helperOption).then((result) => {
            console.log(result.body)
        })
            .catch((err) => {
                console.log(err.statusCode)
            })
        // await transpoter.sendMail(HelperOptions, (error, info) => {
        //     if (error) {
        //         console.log(error);
        //         return error;
        //     }
        //     console.log(info)
        //     return info;
        // })
    }

    async sendFcmNotification(token: string, title, body) {
        var serverKey = FCM_CONFIG.server_key; //put your server key here
        var fcm = new FCM(serverKey);

        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            to: token,
            //  collapse_key: 'your_collapse_key',

            notification: {
                title: title,
                body: body
            },

            data: {  //you can send only notification or only data(or include both)
                title: title,
                body: body
            }
        };

        await fcm.send(message, function (err, response) {
            if (err) {
                console.log("Something has gone wrong!");
            } else {
                console.log("Successfully sent with response: ", response);
            }
        });

    }


}