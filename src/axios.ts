import axios from 'axios'

//创建axios实例
const instance = axios.create({
    baseURL: '/api',// 你的 API 基础 URL
    timeout: 7000,// 请求超时时间
})
//暴露出实例
export default instance
