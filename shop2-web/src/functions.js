import { formatDate, arrayToObj } from "Utils";
import store from "@/store/index";
import Vue from "vue";

let cfuns = {
  arrayToObj,
  openASINLink,
  timeInterval,
  copyText
};

/**
 * 获取两个时间的天数间隔
 * @param {Array} times 需要比对的时间
 */
function timeInterval(times) {
  let tamp = new Date(times[1]).getTime() - new Date(times[0]).getTime();
  return Math.abs(tamp / (24 * 3600 * 1000));
}

/**
 * 打开产品详情页
 * @param {String} asin 要打开的产品ID
 */
function openASINLink(asin) {
  window.open(store.getters["storeInfo/currentSite"].asinUrl + asin);
}

function copyText(text) {
  const proto = Vue.prototype;
  proto.$copyText(text).then(
    function() {
      proto.$message.success("复制成功");
    },
    function() {
      proto.$message.error("复制失败");
    }
  );
}

cfuns.getDay = (daycount, isFieldData) => {
  var date1 = new Date();

  //如果需要固定结束时间的,需要传入isFieldData  时间格式为 yyyy-mm-dd
  if (isFieldData) date1 = new Date(isFieldData);
  let today =
    date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate();
  let date2 = new Date(date1);
  date2.setDate(date1.getDate() - daycount);
  var computedDay =
    date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
  let arr1 = today.split("-");
  let arr2 = computedDay.split("-");
  arr1.forEach((item, index) => {
    if (index === 1 && item.length !== 2) {
      item = ("0" + item).substr(-2);
      arr1.splice(index, 1, item);
    }
    if (index === 2 && item.length !== 2) {
      item = ("0" + item).substr(-2);
      arr1.splice(index, 1, item);
    }
  });
  arr2.forEach((item, index) => {
    if (index === 1 && item.length !== 2) {
      item = ("0" + item).substr(-2);
      arr2.splice(index, 1, item);
    }
    if (index === 2 && item.length !== 2) {
      item = ("0" + item).substr(-2);
      arr2.splice(index, 1, item);
    }
  });
  let today1 = arr1.join("-");
  let computedDay1 = arr2.join("-");
  return {
    today: today1,
    computedDay: computedDay1
  };
};

/**
 * 生成流水号
 */
cfuns.geRandomNum = () => {
  // return formatDate(Date.now(), '{y}{m}{d}{h}{i}{s}') + Math.random().toString().slice(2, 8)
  return formatDate(Date.now(), "{y}{m}{d}{h}{i}{s}");
};

/**
 * 获取范围日期内的所有日期数据
 * @param {Array} timeRange 需要处理的日期范围
 * @return {Array}          返回处理后的日期数据
 */
cfuns.getTimeRanges = timeRange => {
  let timeArr = [],
    currentTime = timeRange[0];
  while (new Date(currentTime) <= new Date(timeRange[1])) {
    timeArr.push(formatDate(currentTime, "{y}-{m}-{d}"));
    currentTime = new Date(currentTime).getTime() + 24 * 3600 * 1000;
  }
  return timeArr;
};

/**
 * 过滤图表中为0或为空的数据显示
 * @param {Array<object>} params 要处理的图表数据
 */
cfuns.getChartTooltip = (params = [], cb) => {
  params = params.filter(
    el => !(el.data == 0 || el.data === "" || el.data == null || isNaN(el.data))
  );
  if (!params.length) {
    return;
  }

  let html = [
    `${params[0].axisValue}`,
    ...params.map(
      el => `${el.marker} ${el.seriesName}: ${cb ? cb(el) : el.data}`
    )
  ].join("<br>");
  return html;
};

//十六进制颜色值的正则表达式
const reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
/*16进制颜色转为RGB格式*/

function toRgb(hls, opacity) {
  var sColor = hls.toLowerCase();
  if (sColor && reg.test(sColor)) {
    if (sColor.length === 4) {
      var sColorNew = "#";
      for (var i = 1; i < 4; i += 1) {
        sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
      }
      sColor = sColorNew;
    }
    //处理六位的颜色值
    var sColorChange = [];
    for (var j = 1; j < 7; j += 2) {
      sColorChange.push(parseInt("0x" + sColor.slice(j, j + 2)));
    }
    if (opacity) {
      sColorChange.push(opacity);
    }
    return "rgb(" + sColorChange.join(",") + ")";
    //或
    //return "rgba(" + sColorChange.join(",") + ",0.8)";
  } else {
    return sColor;
  }
}
cfuns.toRgb = toRgb;

export default cfuns;
