import { Document } from 'mongoose';

export interface OtpLookup extends Document {
    _id: string,
    userId: string,
    code: string,
    expireTime: Date
}