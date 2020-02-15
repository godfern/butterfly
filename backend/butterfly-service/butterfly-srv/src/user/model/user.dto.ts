import { ProviderType, UserStatus, UserRoles, PrimaryType } from "./user.interface";

export class UserDto{
    _id: string;
    locale: string;
    provider: ProviderType;
    primaryType: PrimaryType;
    emailId: string;
    emailVerified: boolean;
    firstName: string;
    lastName: string;
    userStatus: UserStatus;
    profilePicUrl: string;
    fcmIds: string[];
    deleted: boolean;
    createTime: number;
    updatedTime: number;
    roles: UserRoles[];
}