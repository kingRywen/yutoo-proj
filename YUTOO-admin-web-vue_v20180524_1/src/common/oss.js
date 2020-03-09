import {
  fetchData,
  getVue
} from './common';
import apis from 'apis';


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
  async get_signature() {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
      let body
      try {
        body = await this.send_request()
      } catch (e) {
        getVue().$message.error('请求错误，请联系管理员')
      }
      this.data.host = body['host']
      this.data.policyBase64 = body['policy']
      this.data.accessid = body['accessid']
      this.data.signature = body['signature']
      this.data.expire = parseInt(body['expire'])
      this.data.callbackbody = body['callback']
      this.data.key = body['dir']
      return true;
    }
    return false;
  },

  // 从自己的服务器获取到sign签名
  send_request() {
    return new Promise((resolve, reject) => {
      fetchData(apis.IMG_GET_OSS_SIGNATURE).then(res => {
        if (res.data.rows) {
          // 从自己的服务器获取到sign签名
          resolve(res.data.rows)
        } else {
          reject()
        }
      })
    })
  },

  // 上传图片到oss
  async getUploadParam(file, productId, productPlatformId, callback) {
    await this.get_signature()
    let {
      key,
      policyBase64,
      accessid,
      signature,
      host
    } = this.data
    if (key === '') {
      getVue().$message.error('签名不能为空')
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

    this.sendOss(host, formData, key, productId, productPlatformId, callback);

  },

  // 保存文件到oss
  sendOss(host, data, key, productId, productPlatformId, callback) {
    fetchData({
      method: 'post',
      url: host,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data
    }).then(res => {
      console.log(res);
      fetchData({
        method: 'post',
        url: '/product/image/upload',
        data: {
          "remark": "remark",
          "productId": productId,
          productPlatformId,
          "objectName": key
        }
      }).then(res => {
        console.log(res);
        callback(res)
      })
    })
  }
}