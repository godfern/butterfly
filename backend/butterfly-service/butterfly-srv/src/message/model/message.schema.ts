import * as mongoose from 'mongoose';
const uuid = require('uuid/v1');

export const MessageSchema = new mongoose.Schema({
    _id: { type: String, default: uuid },
    locale: String,
    message: String,
    deleted: Boolean,
}, {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    })