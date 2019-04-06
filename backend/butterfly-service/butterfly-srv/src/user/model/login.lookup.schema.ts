import * as mongoose from 'mongoose';
const uuid = require('uuid/v1');


export const LoginLookupSchema = new mongoose.Schema({
    _id: { type: String, default: uuid },
    userId: String,
    emailId: String,
    password: String
}, {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    })