import axios from 'axios';
import {message} from 'antd';
import Constants from '../constants';

var axiosConfig = axios.create({
    baseURL: Constants.API_BASE_URL,
    withCredentials: true
});
axiosConfig.interceptors.response.use(function (response) {
    if (response.data.success === true) {
        return response;
    } else {
        message.error(response.data.msg);
        return Promise.reject(response);
    }
}, function (error) {
    message.destroy();
    if (!error.response) {
        message.error(error.message);
    } else if (error.response.status) {
        switch (error.response.status) {
            case 400:
                message.error('语法格式有误，服务器请求失败');
                break;
            case 404:
                message.error('该请求页面不存在');
                break;
            case 500:
                if (error.response.data.msg && error.response.data.msg.indexOf('未登录') !== -1) {
                    message.error('请重新登录');
                    window.location.href = '#/';
                } else {
                    message.error(error.response.data.msg || '服务器请求失败，请重试');
                }
                break;
            default:
                message.error('服务器请求失败');
        }
    }
    return Promise.reject(error);
});
export {axiosConfig};
