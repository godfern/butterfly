import * as mongoose from "mongoose";
const uuid = require('uuid/v1');

export const NotificationSchema = new mongoose.Schema({

    _id: { type: String, default: uuid },
    senderId:String,
    title:String,
    content:String,
    reciverEmail:String
}, {
    timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
    versionKey: false // You should be aware of the outcome after set to false
})