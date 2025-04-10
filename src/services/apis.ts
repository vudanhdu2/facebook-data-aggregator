import { LoginParams } from "@/models/login/LoginParams";
import axiosClient from "./axiosClient";
import { LoginRes } from "@/models/login/LoginRes";

export const doLogin = (params: LoginParams) : Promise<LoginRes> => {
    return axiosClient.post('auth/login', params);
}

