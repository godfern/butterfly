import { Document } from 'mongoose';

export interface User extends Document {

    _id: string;
    locale: string;
    provider: ProviderType;
    primaryType: PrimaryType;
    emailId: string;
    email_verified: boolean;
    firstName: string;
    lastName: string;
    user_status: UserStatus;
    profilePicUrl: string;
    deleted: boolean;
    createTime: number;
    updatedTime: number;
    roles: UserRoles[];
}

export enum ProviderType {
    SELF = 'SELF',
    GOOGLE = 'GOOGLE',
    FACEBOOK = 'FACEBOOK'
}
export enum PrimaryType {
    EMAIL = 'EMAIL',
    PHONE_NUMBER = 'PHONE_NUMBER',
    USERNAME = 'USERNAME'
}
export enum UserRoles {
    USER = 'USER',
    ADMIN = 'ADMIN',
    SUPER_ADMIN = 'SUPER_ADMIN'
}
export enum UserStatus {
    VERIFIED = 'VERIFIED',
    REGISTERED = 'REGISTERED',
    DELETED = 'DELETED'
}