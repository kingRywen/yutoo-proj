// import {
//   fetchData,
//   getVue,
//   showToast
// } from './common';
// import apis from 'apis';
import fetchData from "@/api/axios";
import Vue from "vue";
// import { mapMutations, mapState } from "vuex";
// import {
//   Toast
// } from "element-ui";
// Vue.use(Toast)


let accessid = ''
let accesskey = ''
let host = ''
let policyBase64 = ''
let signature = ''
let callbackbody = ''
let filename = ''
let key = ''
let expire = 0
let g_object_name = ''
let g_object_name_type = ''
let timestamp, now

now = timestamp = Date.parse(new Date()) / 1000;

export default {
  data: {
    host: '',
    policyBase64: '',
    accessid: '',
    signature: '',
    expire: '',
    callbackbody: '',
    key: '',
  },
  async get_signature(dir) {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
      let body
      try {
        body = await this.send_request(dir)
      } catch (e) {
        console.log('请求错误，请联系管理员')
      }
      this.data.host = body['host']
      this.data.policyBase64 = body['policy']
      this.data.accessid = body['accessid']
      this.data.signature = body['signature']
      this.data.expire = parseInt(body['expire'])
      this.data.callbackbody = body['callback']
      this.data.key = dir // OSS路径
      return true;
    }
    return false;
  },

  // 从自己的服务器获取到sign签名
  send_request(dir) {
    return new Promise((resolve, reject) => {
      // fetchData({})  // 路径
      // let data = new FormData()
      // data.append('dir', dir)
      fetchData({
        url: '/img/getSign',
        method: 'post',
        data: {
          objectName: dir
        }
      }).then(res => {
        if (res.data) {
          // 从自己的服务器获取到sign签名
          resolve(res.data)
        } else {
          reject()
        }
      })
    })
  },

  // 上传图片到oss
  async getUploadParam(file, dir, callback) {

    await this.get_signature(dir)
    let {
      key,
      policyBase64,
      accessid,
      signature,
      host
    } = this.data
    if (key === '') {
      console.log('签名不能为空')
    }
    var multipartParams = {
      'key': key,
      'policy': policyBase64,
      'OSSAccessKeyId': accessid,
      'success_action_status': '200', //让服务端返回200,不然，默认会返回204
      // 'callback' : sign.callback,
      'signature': signature
    };

    //上传到oss
    var formData = new FormData();
    formData.append("key", multipartParams.key);
    formData.append("policy", multipartParams.policy);
    formData.append("OSSAccessKeyId", multipartParams.OSSAccessKeyId);
    formData.append("success_action_status", multipartParams.success_action_status);
    formData.append("signature", multipartParams.signature);
    formData.append('file', file)

    return await this.sendOss(host, formData, key, callback);

  },

  // 批量上传图片
  async batchUpload(files, dir, callback) {

    if (files.length != 0) {
      const promises = files.map(async (file) => {
        let start = Date.now()
        let name = file.name
        let ext = name.split('.')[name.split('.').length - 1]
        let path = dir + '/' + start + '.' + ext
        while (Date.now() < start + 1) {
          // 1ms
        }
        console.log(file);

        const res = await this.getUploadParam(file, path, callback)
        return res
      })

      let ret = []

      for (const promise of promises) {
        ret.push(await promise)
      }
      return ret
    } else {
      return []
    }


  },

  // 保存文件到oss
  async sendOss(host, data, key, callback) {
    return fetchData({
        method: 'post',
        url: host,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data,
      },
      progressEvent => {
        if (progressEvent.lengthComputable) {
          console.log(Vue)
          console.log(progressEvent);
          let loaded = progressEvent.loaded;
          let total = progressEvent.total;
          // console.log(Math.round(loaded / total * 100));
          // this.$nextTick(() => {
          //   this.propgressLine = Math.round(loaded / total * 100);
          // });
        }
      }).then(res => {
      // console.log(res);
      if (res.status === 200) {
        if (callback) callback(key)
        return key
      } else {
        console.log('上传oss出错！')
      }

    })
  }
}
