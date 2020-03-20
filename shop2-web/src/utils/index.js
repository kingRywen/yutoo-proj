import download from "./download";
import axios from "axios";
import Vue from "vue";
/**
 * 获取数据的数据类型
 * @param {*} params  需要获取的数据
 * @return {string}   Number | String ...
 */
export function dataType(params) {
  if (params === null) {
    return "Null";
  } else if (params === undefined) {
    return "Undefined";
  } else {
    return Object.prototype.toString.call(params).slice(8, -1);
  }
}

/**
 * 格式化时间
 *
 * @param  {time}        时间
 * @param  {cFormat}     格式
 * @return {String}      字符串
 *
 * @example              formatDate('2018-1-29', '{y}/{m}/{d} {h}:{i}:{s}') // -> 2018/01/29 00:00:00
 */
export function formatDate(time, cFormat) {
  if (!time) {
    return null;
  }
  time = new Date(time).getTime();
  if (arguments.length === 0) return null;
  if ((time + "").length === 10) {
    time = +time * 1000;
  }
  const format = cFormat || "{y}-{m}-{d} {h}:{i}:{s}";
  let date;
  if (typeof time === "object") {
    date = time;
  } else {
    date = new Date(time);
  }
  var formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  };
  var timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    var value = formatObj[key];
    if (key === "a")
      return ["一", "二", "三", "四", "五", "六", "日"][value - 1];
    if (result.length > 0 && value < 10) {
      value = "0" + value;
    }
    return value || 0;
  });
  return timeStr;
}

/**
 *下载CSV文件
 *
 * @param {*} data 后台返回的数据 {path: 'csv下载路径'}
 */
export function downloadCsv(data) {
  if (data && data.path) {
    data = data.path;
  }
  if (data.split(".").pop() !== "csv") {
    return downloadFile(data, null);
  }

  return axios({
    // url: data.replace("http://127.0.0.1", "http://192.168.0.112"),
    method: "get",
    url: data,
    responseType: "blob",
    transformResponse: function(data1) {
      let reader = new FileReader();
      reader.readAsText(data1, "GBK");
      reader.onload = function() {
        downloadFile(
          "data:text/csv;charset=utf-8,\ufeff" + reader.result,
          null,
          null,
          data.split("/").pop()
        );
      };
      reader.onerror = function() {
        Vue.prototype.$message.error("下载失败，请重试");
      };
      return data1;
    }
  }).catch(() => {
    Vue.prototype.$message.error("下载失败，请重试");
    return Promise.reject();
  });
}

/**
 * 下载文件
 * @param {String, data} url 下载路径或二进制流
 * @param {Boolean} txt 下载为txt
 *
 */
export function downloadFile(url, txt, _blank, downloadName) {
  if (url == null) {
    Vue.prototype.$message.warning("没有任何数据可导出");
    return;
  }
  if (!(url instanceof Blob)) {
    process.env.NODE_ENV !== "production" &&
      console.info(
        '下载时如果是二进制文件流，必须在api接口中配置 config.responseType= "blob"'
      );
  }
  var link;
  // debugger;
  if (typeof url === "string") {
    // console.log(22);

    // 如果是url
    if (!txt) {
      link = document.createElement("a");
      document.body.appendChild(link);
      link.style.display = "none";
      if (_blank) {
        link.target = "_blank";
      }
      link.href = url;
      link.download = downloadName || url.split("/").pop();
      link.click();
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    } else {
      download(url, txt, "text/plain");
    }
  } else {
    // 二进制
    // 接口传入
    // config : {responseType: 'blob'}
    // console.log(url);
    let name = txt || url.name;
    // console.log(name);

    url = window.URL.createObjectURL(
      url instanceof Blob ? url : new Blob([url])
    );
    link = document.createElement("a");
    document.body.appendChild(link);
    link.style.display = "none";
    link.href = url;
    link.setAttribute("download", name || `下载.xlsx`);
    if (navigator.userAgent.indexOf("Firefox/") === -1) {
      link.click();
    } else {
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      link.dispatchEvent(evt);
    }

    window.URL.revokeObjectURL(url);
  }
}

export function arrayToObj(arr) {
  let obj = {};
  arr.forEach(el => {
    obj[el.value] = el.label;
  });
  return obj;
}

export function removeSearchEmpty(searchData) {
  let curSearchData = {};
  Object.keys(searchData).forEach(k => {
    let val = searchData[k];
    if (
      Object.prototype.toString.call(val) === "[object Array]" &&
      !val.length
    ) {
      return;
    }
    if (
      Object.prototype.toString.call(val) === "[object Object]" &&
      !Object.keys(val).length
    ) {
      return;
    }
    curSearchData[k] = searchData[k];
  });
  return curSearchData;
}
