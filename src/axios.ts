import axios from 'axios'
import { getToken } from "@/utils/auth";
import { showMessage } from "@/utils/message";
import router from "@/router";

// 创建axios实例
const instance = axios.create({
    baseURL: '/api', // 你的 API 基础 URL
    timeout: 7000, // 请求超时时间
})

// 添加请求拦截器
instance.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    const token = getToken();
    console.log('统一添加请求头中的 Token:' + token);

    // 当 token 不为空时
    if (token) {
        // 添加请求头, key 为 Authorization，value 值的前缀为 'Bearer '
        config.headers['Authorization'] = 'Bearer ' + token;
    } else {
        showMessage('请先登录', 'error');
        router.push('/login');
    }
    return config;
}, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么

    // 假设后台返回的错误信息格式为 { code: 500, message: '错误信息' }
    if (response.data.code && response.data.code !== 200) {
        showMessage(response.data.message || '请求失败', 'error');
        return Promise.reject(new Error(response.data.message || '请求失败'));
    }

    return response;
}, function (error) {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 若后台有错误提示就用提示文字，默认提示为 '请求失败'
    let errorMsg = '请求失败';
    if (error.response) {
        switch (error.response.status) {
            case 401:
                errorMsg = '未授权，请重新登录';
                router.push('/login');
                break;
            case 403:
                errorMsg = '拒绝访问';
                break;
            case 404:
                errorMsg = '请求地址出错';
                break;
            case 500:
                errorMsg = '服务器内部错误';
                break;
            default:
                errorMsg = error.response.data.message || '请求失败';
        }
    }
    showMessage(errorMsg, 'error');
    return Promise.reject(error);
});

// 暴露出实例
export default instance;
