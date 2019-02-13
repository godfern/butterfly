import { Document } from 'mongoose';
export interface Category extends Document {
    _id: string;
    type: String;
    messages: any;
    langId: any;
    createTime: number;
    updatedTime: number;
}