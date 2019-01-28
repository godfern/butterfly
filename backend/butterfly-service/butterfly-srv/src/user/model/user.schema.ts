import * as mongoose from 'mongoose';
const uuid = require('uuid/v1');

export const userSchema = new mongoose.Schema({
    _id: { type: String, default: uuid },
    locale: String,
    provider: {
        type: String, enum: ['SELF', 'GOOGLE', 'FACEBOOK'], default: 'SELF'
    },
    primaryType: String,
    emailId: String,
    email_verified: Boolean,
    roles: [{
        type: String, enum: ['USER', 'ADMIN', 'SUPER_ADMIN'], default: 'USER'
    }],
    firstName: String,
    lastName: String,
    user_status: {
        type: String, enum: ['REGISTERED', 'VERIFIED', 'DELETED'], default: 'USER'
    },
    profilePicUrl: String,
    deleted: Boolean,
}, {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    })