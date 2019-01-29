import * as mongoose from 'mongoose';
const uuid = require('uuid/v1');

export const userSchema = new mongoose.Schema({
    _id: { type: String, default: uuid },
    locale: String,
    provider: {
        type: String, enum: ['SELF', 'GOOGLE', 'FACEBOOK'], default: 'SELF'
    },
    primaryType: {
        type: String, enum: ['EMAIL', 'PHONE_NUMBER', 'USERNAME'], default: 'EMAIL'
    },
    emailId: String,
    emailVerified: Boolean,
    roles: [{
        type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER'
    }],
    firstName: String,
    lastName: String,
    userStatus: {
        type: String, enum: ['REGISTERED', 'VERIFIED', 'DELETED'], default: 'REGISTERED'
    },
    profilePicUrl: String,
    deleted: Boolean,
}, {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    })