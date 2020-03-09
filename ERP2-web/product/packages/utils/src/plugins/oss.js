import axios from 'axios';

let expire = 0
let now

now = Date.parse(new Date()) / 1000;

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
  /**
   * 获取签名
   * @param {String} dir 要上传到oss的路径
   * @param {String} signUrl 请求本地服务器获取签名的接口url
   */
  async get_signature(dir, signUrl, token) {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = Date.parse(new Date()) / 1000;
    if (expire < now + 3) {
      let body
      try {
        body = await this.send_request(dir, signUrl, token)
      } catch (e) {
        console.error(e);
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
  send_request(dir, signUrl, token) {
    return new Promise((resolve, reject) => {
      // 路径
      let data = new FormData()
      data.append('dir', dir)

      axios.post(signUrl, data, {
        withCredentials: true,
        headers: {
          'token': token
        }
      }).then(res => {
        if (res.data.rows) {
          resolve(res.data.rows)
        } else {
          reject('获取签名失败')
        }
      })
    })
  },

  // 上传图片到oss
  async getUploadParam(file, dir, signUrl, callback, token) {

    await this.get_signature(dir, signUrl, token)
    let {
      key,
      policyBase64,
      accessid,
      signature,
      host
    } = this.data
    if (key === '') {
      console.error('签名不能为空');
      return Promise.reject('签名不能为空')
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
  /**
   * 
   * @param {Array} files 要上传的文件数组，元素必须是二进制
   * @param {String} dir 上传路径 ，后端传
   * @param {String} signUrl OSS签名路径
   * @param {Function} callback 每个文件上传成功后的回调，每个文件成功都有
   * @returns {Array} 返回上传成功后的文件在OSs的路径，是一个数组
   */
  async batchUpload(files, dir, signUrl = '/img/get/oss/signature', callback, token) {

    if (files.length != 0) {
      const promises = files.map(async (file) => {
        let start = Date.now()
        let name = file.name
        let ext = name.split('.')[name.split('.').length - 1]
        let path = dir + '/' + start + '.' + ext
        while (Date.now() < start + 1) {
          // 1ms
        }
        try {
          let res = await this.getUploadParam(file, path, signUrl, callback, token)
          return res
        } catch (error) {
          return null
        }
      })

      let ret = []

      for (const promise of promises) {
        ret.push(await promise)
      }
      return ret.map(el => (this.data.host + '/' + el))
    } else {
      return []
    }


  },

  // 保存文件到oss
  async sendOss(host, data, key, callback) {
    return axios({
        method: 'post',
        url: host,
        withCredentials: false,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data,
      },
      progressEvent => {
        if (progressEvent.lengthComputable) {
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
        console.error('上传oss出错！');
        return Promise.reject('上传oss出错！')
      }

    })
  }
}