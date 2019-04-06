import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserStatus } from "./model/user.interface";
import { OtpLookup } from "./model/otp.lookup.interface";

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>,
        @InjectModel('OtpLookup')private readonly otpLookupModel:Model<OtpLookup>) { }

    getUserService(name: string) {
        return "Welcome " + name + " butterfly";
    }

    async createUser(userReq: User) {

        var isExits = await this.getUserByEmail(userReq.emailId);

        if(isExits){
            throw new HttpException({
                status: HttpStatus.CONFLICT,
                error: `User already exists with email ${userReq.emailId}`,
            }, HttpStatus.CONFLICT);
        }
        const createdCat = new this.userModel(userReq);
        return await createdCat.save();
    }

    async updateUser(userReq: User) {
        //  var user = new this.userModel(userReq);
        //  user._id = userReq._id;
        return await this.userModel.update({ _id: userReq._id }, { userReq});
    }

    async updateUserEmailVerified(userId) {
        //  var user = new this.userModel(userReq);
        //  user._id = userReq._id;
        return await this.userModel.update({ _id: userId }, { userStatus: UserStatus.VERIFIED,emailVerified : true });
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
        return await this.userModel.findOne({ emailId: email });
    }

    async removeUser(_id: string) {
        return await this.userModel.findByIdAndRemove(_id);
    }

    async createOtpLookup(otpLookup:OtpLookup){
        return await this.otpLookupModel.create(otpLookup);
    }

    async updateOtpLookup(otpLookup: OtpLookup) {
        return await this.otpLookupModel.update({_id:otpLookup._id},{otpLookup});
    }

    async getOtpLookupEntry(id:string){
        return await this.otpLookupModel.findById({_id:id});
    }

    async getOtpLookupsByUser(userId: string) {
        return await this.otpLookupModel.find({ userId: userId });
    }
}