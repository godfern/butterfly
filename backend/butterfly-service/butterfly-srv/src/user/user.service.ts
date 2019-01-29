import { Injectable, Inject, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./model/user.interface";

@Injectable()
export class UserService {

    constructor(@InjectModel('User') private readonly userModel: Model<User>) { }

    getUserService(name: string) {
        return "Welcome " + name + " butterfly";
    }

    async createUser(userReq: User) {
        const createdCat = new this.userModel(userReq);
        return await createdCat.save();
    }

    async updateUser(userReq: User) {
        console.log(userReq)
        return await this.userModel.updateOne({ _id: userReq._id }, { $set: { userReq } }, { new: true });
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

    async removeUser(_id: string) {
        return await this.userModel.findByIdAndRemove(_id);
    }
}