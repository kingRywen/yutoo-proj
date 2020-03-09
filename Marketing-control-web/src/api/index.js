import request from '@/utils/request'

export const login = params => {
    return request({
        method: 'post',
        url: '/sys/login',
        data: params,
        withCredentials: true,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
    })
}

export const downloadFile = data => {
    return request({
        method: 'post',
        url: data.url,
        data: data.params,
        responseType: 'blob'
    })
}

export const uploadFileToOSS = data => {
    return request({
        method: 'post',
        url: data.url,
        data: data.params,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        }
        ,validateStatus:(status)=>{
            return status >= 200 && status < 300;//默认
        }
    })
}

export const httpPost = data => {
    if(data.params===undefined){
        return request.post(data.url)
    }else{
        // data.params 是数组，typeof(data.params) 也是 object
        if(typeof(data.params) ==='object'){
            return request.post(data.url, data.params)
        }else{
            //typeof(data.params) ==='number'
            return request({
                method: 'post',
                url: data.url,
                data: data.params,
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
        }
    }
}

export const httpGet = data => {
    if(data.params===undefined){
        return request.get(data.url)
    }else{
        return request.get(data.url, data.params)
    }

}
