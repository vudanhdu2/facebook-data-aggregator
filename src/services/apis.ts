import { LoginParams } from "@/models/login/LoginParams";
import axiosClient from "./axiosClient";
import { ResponseBase } from "@/models/response/ResponseBase";
import { UserInfo } from "@/models/login/UserInfo";
import { UserParam } from "@/models/user/UserParam";
import { UserResponse } from "@/models/user/UserResponse";
import { UserData } from "@/models/user/UserData";

export const doLogin = (params: LoginParams) : Promise<ResponseBase<UserInfo>> => {
    return axiosClient.post('auth/login', params);
}

export const addNewUser = (params: UserParam) : Promise<ResponseBase<any>> => {
    return axiosClient.post('auth/register', params);
}

export const getAllUsers = (params: any) : Promise<ResponseBase<UserResponse>> => {
    return axiosClient.post('auth/users', params);
}

export const updateUserInfo = (params: any) : Promise<ResponseBase<any>> => {
    return axiosClient.patch(`auth/users/${params?.id}`, params);
}
