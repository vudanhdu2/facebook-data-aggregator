import axios from 'axios';
import { BASE_URL } from '../config/config';
import TokenProvider from '../utils/TokenProvider';
import { message } from 'antd';
import { consoleLogUtil } from '../utils/consoleLogUtil';


const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});
function apiLogger(msg, color, params) {
    if (process.env.NODE_ENV === 'development') {
        console.log(msg, color, params);
    }
}
axiosClient.interceptors.request.use(
    async config => {
        const token = TokenProvider.getToken();
        consoleLogUtil("token", token);
        if (token) {
            config.headers.Authorization = 'Bearer ' + token;
        }
        return config;
    },
    error => {
        apiLogger(
            `%c FAILED ${error.response.method?.toUpperCase()} from ${error.response.config.url
            }:`,
            'background: red; color: #fff',
            error,
        );
        return Promise.reject(error);
    },
);
axiosClient.interceptors.response.use(
    (res) => {
        consoleLogUtil("response", res);
        return res.data
    },
    async error => {
        
        const {response} = error || {};
        const {data, status} = response || {};
        const {msg} = data || {};
        consoleLogUtil("ERRRR", response);
        apiLogger(
          `%c FAILED ${error.config?.method?.toUpperCase()} from ${
            error?.config?.url
          }:`,
          'background: red; color: #fff',
          error.response,
        );
        if (status === 401) {
          TokenProvider.logOut();
          message.warning("Hết phiên làm việc. Vui lòng đăng nhập lại");
          // return Promise.reject(error);
        }
        if (error.message === 'Network Error') {
          message.warning("Quý khách vui lòng kiểm tra kết nối mạng.");
        }
        // error.message = msg || "Có lỗi xảy ra. Vui lòng thử lại";
        // return Promise.reject({message: error.message, code: status});
      }
);
export default axiosClient;
