import {Document} from 'mongoose';
 
export interface LoginLookup extends Document{

    _id:string;
    userId:string;

    emailId:string;

    password:string
}