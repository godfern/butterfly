import * as mongoose from 'mongoose';
const uuid = require('uuid/v1');

export const CategorySchema = new mongoose.Schema({
    _id: { type: String, default: uuid },
    type: String,
    messages: [{
        _id: { type: String, default: uuid },
        message: String
    }],
    langId: mongoose.Schema.Types.Mixed
},
    {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    });
