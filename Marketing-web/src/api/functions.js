// 根据数组指定下标删除某一项的公用方法，用于批量删除
// Array.prototype.remove=function(obj){
//     for (var i =0;i < this.length; i++) {
//         var temp = this[i];
//             if (!isNaN(obj)) {
//             temp=i;
//         }
//         if (temp == obj) {
//             for(var j = i;j <this.length;j++){
//             this[j]=this[j+1];
//         }
//             this.length = this.length-1;
//         }
//     }
// }
// 删除下标为3的对象
// var arr = [0,1,2,3,'vvv'];
// arr.remove(3);
// console.log(arr) // [0,1,2,'vvv']
// 删除对象值为“vvv”
// var str = 'vvv';
// arr.remove(str);
// console.log(arr) // [0,1,2]
// 另外无需封装的es6快速删除数组某个对象元素的方法
// arr.splice(arr.splice(arr.findIndex(item === 1), 1)) // 删除之为1的项，适用于纯属组
// arr.splice(arr.splice(arr.findIndex(item => item.id === '1'), 1))
// 删除某个对象中的id为1的项，适用数组的项为一个对象

// 时间类
// 返回当天日期
// export function todayDate() {
//     return new Date().toLocaleDateString().replace(/\//ig, '-')
// }
// getDay(-10),getDay(10) =>{today: today, computedDay: computedDay}
export function getDay(daycount) {
  var date1 = new Date();
  let today = date1.getFullYear() + "-" + (date1.getMonth() + 1) + "-" + date1.getDate()
  let date2 = new Date(date1);
  date2.setDate(date1.getDate() - daycount);
  var computedDay = date2.getFullYear() + "-" + (date2.getMonth() + 1) + "-" + date2.getDate();
  let arr1 = today.split('-');
  let arr2 = computedDay.split('-');
  arr1.forEach((item, index) => {
    if (index === 1 && item.length !== 2) {
      item = ("0" + item).substr(-2);
      arr1.splice(index, 1, item);
    }
    if (index === 2 && item.length !== 2) {
      item = ("0" + item).substr(-2);
      arr1.splice(index, 1, item);
    }
  })
  arr2.forEach((item, index) => {
    if (index === 1 && item.length !== 2) {
      item = ("0" + item).substr(-2);
      arr2.splice(index, 1, item);
    }
    if (index === 2 && item.length !== 2) {
      item = ("0" + item).substr(-2);
      arr2.splice(index, 1, item);
    }
  })
  let today1 = arr1.join('-');
  let computedDay1 = arr2.join('-');
  return {
    today: today1,
    computedDay: computedDay1
  }
}
// 去掉字符空格Trim(str, is_global)
export function Trim(str, is_global) {
  var result;
  result = str.replace(/(^\s+)|(\s+$)/g, "");
  if (is_global.toLowerCase() == "g") {
    result = result.replace(/\s/g, "");
  }
  return result;
}
// 去除数组空值removeArrEmpty(skuArr)
export function removeArrEmpty(arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == "" || typeof (arr[i]) == "undefined") {
      arr.splice(i, 1);
      i--;
    }
  }
  return arr;
};
// 根据某个值删除数组的项
export function removeArrItem(arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item);
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
// 一维数组转二维数组subArrayNum：二维的单个长度，arrData:原数组
export function oArrToTwoArr(subArrayNum, arrData) {
  var dataArr = new Array(Math.ceil(arrData.length / subArrayNum));
  for (let i = 0; i < dataArr.length; i++) {
    dataArr[i] = new Array();
    for (let j = 0; j < subArrayNum; j++) {
      dataArr[i][j] = '';
    }
  }
  for (let i = 0; i < arrData.length; i++) {
    dataArr[parseInt(i / subArrayNum)][i % subArrayNum] = arrData[i];
  }
  return dataArr
}
// 移除数组中的空值
export function clearArrTrim(array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == "" || typeof (array[i]) == "undefined") {
      array.splice(i, 1);
      i = i - 1;
    }
  }
  return array;
}
// 判断值是否存在于数组 isInArray(arr,'a')
export function isInArray(arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true;
    }
  }
  return false;
}
// 12取20    23取30
export function getBigNum(n) {
  n = Math.floor(n) + "";
  let len = n.length - 1;
  let firstNum = n.slice(0, 1);
  let arr = [1];
  let arr2 = [parseInt(firstNum)];
  let i = 0;
  while (len > i) {
    arr.push(0);
    arr2.push(0);
    i++
  }
  let newArr = arr.join("");
  let newArr2 = arr2.join("")
  let num = parseInt(newArr) + parseInt(newArr2);
  if (num < 10) {
    return 10
  } else {
    return num
  }
}
// 根据数组对象的某个属性值找到指定的元素
// var datas = [
//   {
//     "name": "产品房",
//     "bianma": "11"
//   },
//   {
//     "name": "商铺",
//     "bianma": "12"
//   }
// ]
// var data= datas.filter(function(item){
//    return item.bianma == "12"; 
// })
// console.log(data); // [{name: "商铺", bianma: "12"}]
export function getItemFromArr(datas, func) {
  let items = datas.filter(func)
  return items
}
// querystring
export function getQueryString() {
  var url = decodeURIComponent(window.location.href);
  var num = url.indexOf("?");
  var str = url.substr(num + 1);
  var arr = str.split("&");
  var name = "";
  var value = "";
  for (var i = 0; i < arr.length; i++) {
    num = arr[i].indexOf("=");
    if (num > 0) {
      name = arr[i].substring(0, num);
      value = arr[i].substr(num + 1);
      this[name] = value;
    }
  }
}
// M 转kb
// export function KBtoM(KB) {
//   if (KB === 0 || KB === "0") {
//     return "0KB"
//   }
//   return Math.ceil(KB / 1024 / 1024)
// }
// 按钮是否disabled
export function isDisabled(data) {
  if (Object.keys(data).length > 0) {
    for (let key in data) {
      if (data[key] !== "" && data[key] !== null && JSON.stringify(data[key]) !== '[]' && JSON.stringify(data[key]) !== '{}') {
        return false
      }
    }
    // 遍历走完，如果key对应的每一个值都是约等于空，则disabled
    return true
  } else {
    // 如果没有key值,则disabled
    return true
  }
}