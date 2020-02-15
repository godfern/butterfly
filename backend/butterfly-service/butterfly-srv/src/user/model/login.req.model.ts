import {PrimaryType} from "./user.interface"
export class LoginReqModel{
    emailId:string
    phoneNumber:string
    password:string
    provider: PrimaryType
}