import * as mongoose from 'mongoose';
const uuid = require('uuid/v1');

export const OtpLookupSchema = new mongoose.Schema({
    _id: { type: String, default: uuid },
    userId: String,
    code: String,
    expireTime: Date

}, {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    })