const port = 3005
// const host = 'http://192.168.0.98:7080/yutoo-admin-erp'
const host = 'http://192.168.0.123:8080'

module.exports = {
  // 请求地址配置
  mockPort: port,
  BASE_URL: host,

  // 基本信息页附件上传
  attachmentConfig: {
    path: host + '/product/attachment/upload',
    header: {
      token: localStorage.getItem('token')
    }
  },

  // echarts全局配置
  echartsCommonConfig: {
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    },
  },

  // 上传图片插件配置
  uploadImageConfig: {
    accept: 'image/png,image/gif,image/jpeg,image/webp',
    extensions: 'gif,jpg,jpeg,png,webp',
    // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
    // extensions: /\.(gif|jpe?g|png|webp)$/i,
    minSize: 1024,
    size: 1024 * 1024 * 10,
    multiple: true,
    directory: false,
    drop: true,
    dropDirectory: true,
    addIndex: false,
    thread: 3,
    name: 'file',
    postAction: host + '/product/img/upload',
    autoCompress: 1024 * 1024,
    uploadAuto: false,
    isOption: false,
  }

}