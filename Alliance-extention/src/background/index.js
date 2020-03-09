import axios from 'axios'
/*import  fs from 'fs';

 */
let accountId = window.accountId

// eslint-disable-next-line no-unused-vars
function fetchData({ url, params }, cb, errCb) {
  url = `${window._URL}${url}`
  axios
    .post(url, { ...params, accountId })
    .then(res => {
      if (res.data.code == 0) {
        cb(res)
      } else {
        if (res.data.msg !== '该帐号没有可执行的任务！') {
          let pop = chrome.extension
            .getViews()
            .find(w => w.location.pathname === '/popup.html')
          pop.vm.$message.error(res.data ? res.data.msg : '操作成功')
          errCb && errCb(res)
        } else {
          cb && cb(res)
        }
      }
    })
    .catch(res => {
      // debugger
      let pop = chrome.extension
        .getViews()
        .find(w => w.location.pathname === '/popup.html')
      pop.vm.$message.error(res.data ? res.data.msg : '操作失败')
      errCb && errCb(res)
    })
}

// var config = {
//   bypassList: ["localhost", "127.0.0.1", "192.168.*.*"]
// };

// chrome.proxy.settings.set({
//   value: config,
//   // scope: "regular"
// }, function () {});

// chrome.webRequest.onBeforeRequest.addListener(
//   function(details) {
//     return details;
//   },
//   {urls: ["<all_urls>"]},
//   ["blocking"]
// );

// chrome.privacy.network.webRTCIPHandlingPolicy.set({
// 	value: 'disable_non_proxied_udp',
// });

window.fetchData = fetchData
