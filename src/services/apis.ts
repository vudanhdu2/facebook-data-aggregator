import { LoginParams } from "@/models/login/LoginParams";
import axiosClient from "./axiosClient";
import { ResponseBase } from "@/models/response/ResponseBase";
import { UserInfo } from "@/models/login/UserInfo";
import { UserParam } from "@/models/user/UserParam";
import { UserResponse } from "@/models/user/UserResponse";
import { FileTypeImport } from "@/models/import/FileTypeImport";
import { AccountType } from "@/models/import/AccountType";
import { ImportUIDParam } from "@/models/import/ImportUIDParam";
import { ImportResponse } from "@/models/import/ImportResponse";
import { HistoryResponse } from "@/models/history/HistoryResponse";
import { DetailFileResponse } from "@/models/history/DetailFileResponse";
import { ImportPostParam } from "@/models/import/ImportPostParam";

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

export const getAllFileTypeImport = () : Promise<ResponseBase<FileTypeImport[]>> => {
    return axiosClient.get('master/import-file-types');
}

export const getAllAccountType = () : Promise<ResponseBase<AccountType[]>> => {
    return axiosClient.get('master/account-type');
}

export const importFileEntities = (params: ImportUIDParam) : Promise<ResponseBase<ImportResponse>> => {
    return axiosClient.post('entities/import', params);
}

export const getHistoryUploadByUser = (params: any) : Promise<ResponseBase<HistoryResponse[]>> => {
    return axiosClient.post(`uploaded-files`, params);
}

export const getDetailDataFileById = (params: any) : Promise<ResponseBase<DetailFileResponse>> => {
    return axiosClient.post(`entities/by-file`, params);
}

export const importFileGroupEntities = (params: ImportUIDParam) : Promise<ResponseBase<ImportResponse>> => {
    return axiosClient.post('entities/importGroup', params);
}

export const importFileGeneralEntities = (params: ImportUIDParam) : Promise<ResponseBase<ImportResponse>> => {
    return axiosClient.post('entities/importGeneral', params);
}

export const importFileComments = (params: ImportUIDParam) : Promise<ResponseBase<ImportResponse>> => {
    return axiosClient.post('comments/importComments', params);
}

export const importFilePosts = (params: ImportPostParam) : Promise<ResponseBase<ImportPostParam>> => {
    return axiosClient.post('posts/importPosts', params);
}