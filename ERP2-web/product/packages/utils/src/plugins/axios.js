import axios from 'axios'

// axios.defaults.transformRequest = [
//     function (data, config) {
//         // if (!config['Content-Type']) {
//         //     return data
//         // } else {
//         //     if (config['Content-Type'].toLowerCase() === 'multipart/form-data;charset=utf-8') {
//         //         return data
//         //     } else {
//         //         return data
//         //     }
//         // }
//         console.log(data);

//         return data
//     }
// ]

export default (AXIOS_DEFAULT_CONFIG, Interceptors = {}) => {
    let axiosInstance = {},
        {
            requestSuccessFunc,
            requestFailFunc,
            responseSuccessFunc,
            responseFailFunc
        } = Interceptors
    axiosInstance = axios.create(AXIOS_DEFAULT_CONFIG)
    // 注入请求拦截
    axiosInstance
        .interceptors.request.use(requestSuccessFunc, requestFailFunc)
    // 注入失败拦截
    axiosInstance
        .interceptors.response.use(responseSuccessFunc, responseFailFunc)
    return axiosInstance
};
