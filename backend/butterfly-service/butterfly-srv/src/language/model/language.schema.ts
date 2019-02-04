import * as mongoose from "mongoose";
import { UserSchema } from "src/user/model/user.schema";
const uuid = require('uuid/v1');

export const LanguageSchema = new mongoose.Schema({

    _id: { type: String, default: uuid },
    locale: String,
    name: String,
    country: String,
    region: String,
    countryCode: String,
    actorId: { type: String, ref: UserSchema }
}, {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    })