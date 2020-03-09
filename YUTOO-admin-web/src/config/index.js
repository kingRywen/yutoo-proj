import axios from 'axios'

const BASE_URL = 'http://localhost:8080'

axios.interceptors.response.use(function (res) {
  // 对响应数据做点什么
  if (res.data.code == 401) {
    if (top) {
      top.location.replace('/login/index.html')
    } else {
      window.location.replace('/login/index.html')
    }
    return Promise.reject(res.data.msg)
  }
  return res;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});

/**
 * post formdata 请求
 * @param {String} url 请求的pathname
 * @param {Object} data 请求的主体对象
 */
const formDataReq = (pathname, data) => {
  return Promise.resolve().then(() => axios({
    baseURL: BASE_URL,
    method: 'post',
    url: pathname,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data,
    transformRequest: [function (data) {
      return Qs.stringify(data)
    }]
  }))
}