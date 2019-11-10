import { Document } from 'mongoose';

export interface Notification extends Document {
    _id: string;
    senderId: string;
    title: string;
    content: string;
    reciverEmail: string;
    createTime: Date
    updateTime: Date
}