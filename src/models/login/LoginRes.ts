import { UserInfo } from "./UserInfo";

export interface LoginRes {
    success: boolean;
    message: string;
    data: {
        user: UserInfo;
        token: string;
    }
}