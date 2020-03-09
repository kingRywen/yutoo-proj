import {BASE_URL} from "./config";
import {_storage} from './common';
import axios from "axios";

export const getData = (requestURL, params,ip=BASE_URL)=> {
    return axios({
            method: "post",
            url: ip + "/" + requestURL,
            withCredentials: true,
            data: params,
            headers: {
                token: _storage._get('local', 'token'),
                "Content-Type": "application/json"
            }
        }).then(res => {
            return res;
        })
        .catch(err => {
            return err;
        });
}
