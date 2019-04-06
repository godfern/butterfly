import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { ResponseEntity } from "../common/ResponseEntity";
import { OtpLookup } from "./model/otp.lookup.interface";
import { UserStatus } from "./model/user.interface";
import { UserService } from "./user.service";

var otpGenerator = require('otp-generator')
let dateTime = require('date-and-time');
var nodeMailer = require('nodemailer');

let transpoter = nodeMailer.createTransport({
    service: 'gmail',
    secure: false,
    port: 25,
    auth: {
        user: 'ggtest1213@gmail.com',
        pass: 'ggtest123456'
    },
    tls: {
        rejectUnauthorized: false
    }
});


@Injectable()
export class UserServiceHelper {

    constructor(@Inject('UserService') private userService: UserService) {

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

            let HelperOptions = {
                from: 'gg1213@gmail.com',
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

                return new ResponseEntity(true, HttpStatus.OK, null, "user verification success!");
            } else {
                return new ResponseEntity(false, HttpStatus.BAD_REQUEST, "Invalid verification code", null);
            }
        }

    }

    async testMail(HelperOptions) {
        await transpoter.sendMail(HelperOptions, (error, info) => {
            if (error) {
                console.log(error);
                return error;
            }
            console.log(info)
            return info;
        })
    }
}