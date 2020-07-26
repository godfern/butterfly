import {Document} from 'mongoose';
 
export interface LoginLookup extends Document{

    _id:string;
    userId:string;

    emailId:string;

    phoneNumber:string

    password:string

    resetPasswordToken:string
 
}