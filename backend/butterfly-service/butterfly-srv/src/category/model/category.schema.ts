import * as mongoose from 'mongoose';
import { LanguageSchema } from 'src/language/model/language.schema';
const uuid = require('uuid/v1');

export const CategorySchema = new mongoose.Schema({
    _id: { type: String, default: uuid },
    type: String,
    messages: [{
        _id: { type: String, default: uuid },
        message: String
    }],
    langId: { type: String, ref: LanguageSchema }
},
    {
        timestamps: { createdAt: 'createTime', updatedAt: 'updateTime' },
        versionKey: false // You should be aware of the outcome after set to false
    });
