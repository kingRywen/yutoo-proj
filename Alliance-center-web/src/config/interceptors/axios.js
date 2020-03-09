import axios from 'axios';
import store from '@/store/index';
import router from '@/router/index'
import Vue from 'vue';
import {
    CONSOLE_REQUEST_ENABLE
} from "../index.js";
import storage from 'Utils/saver'

let CancelToken = axios.CancelToken;
let pending = []
let removePending = (config) => {

    for (let p in pending) {
        if (!config) {
            pending[p].f();
            pending.splice(p, 1);
        } else {
            if (pending[p].u === config.url + '&' + config.method) { //当当前请求在数组中存在时执行函数体
                console.log(`${config.url} 重复请求（相同地址、相同参数同时请求两次）,检查一下是否必要，如特殊业务必须同时发一模一样的请求，可在api中加参数 keep: true`);
                pending[p].f(); //执行取消操作
                pending.splice(p, 1); //把这条记录从数组中移除
            }
        }

    }
}

let codeStragy = {
    // 跳转登录页并记录重定向网址
    redirectToLogin(msg) {
        Vue.prototype.$message.error(msg)
        storage.remove('local', 'token')
        sessionStorage.clear()
        store.commit('setUserInfo', {})
        let {
            path
        } = router.history.current
        router.replace({
            path: '/login',
            query: {
                redirect: path
            }
        });
    }
};

export function requestSuccessFunc(requestObj) {
    CONSOLE_REQUEST_ENABLE &&
        console.info(
            "requestInterceptorFunc",
            `url: ${requestObj.url}`,
            requestObj
        );

    // 移除相同请求
    // if (!requestObj.keep) {
    //     removePending(requestObj);
    // }

    if (pending.length > 6) {
        pending.shift()
    }

    // 推入当前的请求到记录请求的数组
    requestObj.cancelToken = new CancelToken((c) => {
        pending.push({
            u: requestObj.url + '&' + requestObj.method,
            f: c
        })
    })

    if (!requestObj.singleLoading) {
        store.state.isloading = true;
    } else {
        store.state.loading = true;
    }
    // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
    let token = storage.get('local', 'token')
    const reqWhiteList = GLOBAL.$const['OTHER/reqWhiteList']
    if (!token && reqWhiteList.indexOf(requestObj.url) === -1) {
        router.push('/login')
        removePending()
        // codeStragy.redirectToLogin('登录失效，请重新登录')
        return Promise.reject('登录失效，请重新登录')
    }
    requestObj.headers.token = token
    // 

    // 如果是走mock数据，清除token
    if (requestObj.isMock) {
        delete requestObj.withCredentials
        delete requestObj.credentials
        requestObj.headers = {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    }

    // 清空空字符数据
    requestObj = Vue.prototype.$.dealObjectValue(requestObj)

    return requestObj;
}

export function requestFailFunc(requestError) {
    // 自定义发送请求失败逻辑，断网，请求发送监控等
    // ...
    // 

    return Promise.reject(requestError);

}

export function responseSuccessFunc(responseObj) {
    // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
    // ...
    // 假设我们请求体为
    // {
    //     code: 1010,
    //     msg: 'this is a msg',
    //     data: null
    // }

    if (!responseObj.config.singleLoading) {
        store.state.isloading = false;
    } else {
        store.state.loading = false;
    }
    let resData = responseObj.data;
    let {
        code,
        msg,
    } = resData;
    let {
        status
    } = responseObj
    // 响应代码
    switch (code) {
        case '0':
        case 0: // 如果业务成功，直接进成功回调
            responseObj.config.showSuccess && GLOBAL.vbus.$emit("business.response.success", msg);
            return resData;

        // 如果业务失败，弹窗提示
        // 比如最常见的授权过期跳登录
        // 特定弹窗
        // 跳转特定页面等
        case 401: // 401 403 token 过期， 跳转登录面，要记录当前url, 方便下次登录后跳转回来
            codeStragy.redirectToLogin('登录失效，请重新登录');
            return;
        case 403:
            router.push({
                path: '/dash'
            })
            // codeStragy.redirectToLogin(msg);
            return;
        case 404:
            router.push({
                path: '/404'
            })
            break;
        case 407: // 无权限，跳转无权限页（需要修改）
            codeStragy.redirectToLogin(msg);
            return;
        case undefined:
            if (status === 200) {
                return resData;
            }
            break
        default:

            // 业务中还会有一些特殊 code 逻辑，我们可以在这里做统一处理，也可以下放它们到业务层
            !responseObj.config.noShowDefaultError &&
                GLOBAL.vbus.$emit("business.response.incorrect", resData.msg);
            return Promise.reject(resData);

    }
}

export function responseFailFunc(responseError) {
    // 响应失败，可根据 responseError.message 和 responseError.response.status 来做监控处理
    // ...
    // console.log(responseError);
    store.state.loading = false;
    store.state.isloading = false;
    GLOBAL.vbus.$emit("business.response.incorrect", responseError.message);
    return Promise.reject(responseError);
}