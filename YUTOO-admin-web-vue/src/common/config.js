// 产品库
const productPort = 8080;
// 登录
const loginPort = 8081;
// 权限
const permsPort = 8082;
// 补货
const REP = 8083;

// 登录跳转的首页
const loginRedirect = '/'

const host = "http://192.168.0.200:";


// // 产品库
// const productPort = 8080;
// // 登录
// const loginPort = 8081;
// // 权限
// const permsPort = 8082;
// // 补货
// const REP = 8083;

// // 登录跳转的首页
// const loginRedirect = "/";

// const host = "http://192.168.0.135:";


// const productPort = 8090;
// // 登录
// const loginPort = 8070;
// // 权限
// const permsPort = 8060;
// // 补货
// const REP = 8080;

// // 登录跳转的首页
// const loginRedirect = "/";

// const host = "http://192.168.0.102:";

// const productPort = 7083;
// // 登录
// const loginPort = 7081;
// // 权限
// const permsPort = 7082;
// // 补货
// const REP = 7084;

// // 登录跳转的首页
// const loginRedirect = '/'

// const host = "http://192.168.0.98:";

// // 正式服
// const productPort = '/erp-product';
// // 登录
// const loginPort = '/erp-sso';
// // 权限
// const permsPort = '/erp-permission';
// // 补货
// const REP = '/erp-replenish';

// // 登录跳转的首页
// const loginRedirect = '/erp/'

// const host = "";


module.exports = {
  loginRedirect,
  // 产品库
  BASE_URL: host + productPort,
  // 登录
  LOGIN_URL: host + loginPort,
  // 权限
  PERMS_URL: host + permsPort,
  // 补货
  REP_URL: host + REP,

  // loginPort: 8082,
  //
  // permsPort: 8081,
  // 产品库

  // 基本信息页附件上传
  attachmentConfig: {
    path: host + "/product/attachment/upload",
    header: {
      token: localStorage.getItem(window.location.host + "_token")
    }
  },

  // echarts全局配置
  echartsCommonConfig: {
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true
    }
  },

  // 上传图片插件配置
  uploadImageConfig: {
    accept: "image/png,image/gif,image/jpeg,image/webp",
    extensions: "gif,jpg,jpeg,png,webp",
    // extensions: ['gif', 'jpg', 'jpeg','png', 'webp'],
    // extensions: /\.(gif|jpe?g|png|webp)$/i,
    minSize: 1024,
    size: 1024 * 1024,
    maximum: 12,
    multiple: true,
    directory: false,
    drop: true,
    dropDirectory: true,
    addIndex: false,
    thread: 3,
    name: "file",
    postAction: host + "/product/img/upload",
    autoCompress: 1024 * 1024,
    uploadAuto: false,
    isOption: false
  }
};