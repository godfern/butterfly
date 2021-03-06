import * as mongoose from 'mongoose';
const uuid = require('uuid/v1');

export const UserSchema = new mongoose.Schema({
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
    phoneNumber: String,
    phoneVerified: Boolean,
    roles: [{
        type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER'
    }],
    firstName: String,
    lastName: String,
    userStatus: {
        type: String, enum: ['REGISTERED', 'PHONE_VERIFIED', 'EMAIL_VERIFIED','VERIFIED', 'DELETED'], default: 'REGISTERED'
    },
    profilePicUrl: String,
    fcmIds: [String],
    deleted: Boolean,
}, {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    })