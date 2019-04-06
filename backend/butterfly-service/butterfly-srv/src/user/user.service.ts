import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { ResponseEntity } from "src/common/ResponseEntity";
import { AddUserModel } from "./model/add.user.model";
import { LoginLookup } from "./model/login.lookup.interface";
import { OtpLookup } from "./model/otp.lookup.interface";
import { User, UserStatus } from "./model/user.interface";

const bcrypt = require('bcrypt');
const saltRounds = 10;

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('OtpLookup') private readonly otpLookupModel: Model<OtpLookup>,
        @InjectModel('LoginLookup') private readonly loginLookupModel: Model<LoginLookup>) { }

    getUserService(name: string) {
        return "Welcome " + name + " butterfly";
    }

    async createUser(userReq: AddUserModel) {
        const createdUserModel = new this.userModel(userReq);
        console.log("createdUserModel", createdUserModel);

        const userRes = await createdUserModel.save();

        const saveLoginLookup = await this.createLoginLookup(userRes._id, userReq);

        console.log(saveLoginLookup);
        return userRes;
    }

    async updateUser(userReq: User) {
        //  var user = new this.userModel(userReq);
        //  user._id = userReq._id;
        return await this.userModel.update({ _id: userReq._id }, { userReq });
    }

    async updateUserEmailVerified(userId) {
        //  var user = new this.userModel(userReq);
        //  user._id = userReq._id;
        return await this.userModel.update({ _id: userId }, { userStatus: UserStatus.VERIFIED, emailVerified: true });
    }

    async getUser(userId: string) {
        const userRes = await this.userModel.findOne({ _id: userId });
        if (userRes) {
            return userRes;
        } else {
            throw new HttpException({
                status: HttpStatus.NO_CONTENT,
                error: `No user with id ${userId}`,
            }, 204);
        }
    }

    async getUserByEmail(email: string) {
        const userRes = await this.userModel.findOne({ emailId: email });

        if (userRes) {
            return new ResponseEntity(true, HttpStatus.OK, null, userRes);
        } else {
            return new ResponseEntity(false, HttpStatus.NO_CONTENT, `No user with email ${email}`, null);
        }
    }

    async removeUser(_id: string) {
        return await this.userModel.findByIdAndRemove(_id);
    }

    async createLoginLookup(userId, userRes: AddUserModel) {
        var loginLookup: LoginLookup = {} as LoginLookup;
        loginLookup.userId = userId;
        loginLookup.emailId = userRes.emailId;

        console.log('createLoginLookup');
        bcrypt.hash(userRes.password, saltRounds, async function (err, res) {
            if (res) {
                loginLookup.password = res;
                console.log("bcrypt success", res)
                const loginLookUpRes = await this.loginLookupModel.create(loginLookup);
            } else {
                console.log("bcrypt err", err)
                return new ResponseEntity(false, HttpStatus.INTERNAL_SERVER_ERROR, err, null);
            }
            // Store hash in your password DB.
        });
        // bcrypt.hash(userRes.password, saltRounds).then(async res => {
        //     loginLookup.password = res;
        //     console.log("bcrypt success",res)
        //     const loginLookUpRes = await this.loginLookupModel.create(loginLookup);
        //     return new ResponseEntity(true, HttpStatus.CREATED, null, loginLookUpRes);
        // }).catch(err => {
        //     console.log("bcrypt err", err)

        //     return new ResponseEntity(false, HttpStatus.INTERNAL_SERVER_ERROR, err, null);
        // });
    }

    async checkLoginLookup(emailId, password, dbUser) {

        const loginLookup = await this.getLoginLookupByEmail(emailId);
        if (loginLookup) {
            const match = bcrypt.compare(password, loginLookup.password);

            if (match) {
                return new ResponseEntity(true, HttpStatus.OK, null, dbUser);
            } else {
                return new ResponseEntity(false, HttpStatus.BAD_REQUEST, "Invalid username / password", null);
            }
        } else {
            return new ResponseEntity(false, HttpStatus.INTERNAL_SERVER_ERROR, "Unable to find login lookup", null);
        }
    }
    async createOtpLookup(otpLookup: OtpLookup) {
        return await this.otpLookupModel.create(otpLookup);
    }

    async updateOtpLookup(otpLookup: OtpLookup) {
        return await this.otpLookupModel.update({ _id: otpLookup._id }, { otpLookup });
    }

    async getOtpLookupEntry(id: string) {
        return await this.otpLookupModel.findById({ _id: id });
    }

    async getOtpLookupsByUser(userId: string) {
        return await this.otpLookupModel.find({ userId: userId });
    }

    async getLoginLookupByEmail(email: string) {
        return await this.loginLookupModel.findOne({ emailId: email });
    }
}