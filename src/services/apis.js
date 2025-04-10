import axiosClient from "./axios.client";

export const login = (params) => {
    return axiosClient.post('auth/login', params);
}

