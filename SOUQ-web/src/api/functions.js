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
export function getDay (daycount) {
  var date1 = new Date()
  let today = date1.getFullYear() + '-' + (date1.getMonth() + 1) + '-' + date1.getDate()
  let date2 = new Date(date1)
  date2.setDate(date1.getDate() - daycount)
  var computedDay = date2.getFullYear() + '-' + (date2.getMonth() + 1) + '-' + date2.getDate()
  return {
    today: today,
    computedDay: computedDay
  }
}
// 去掉字符空格Trim(str, is_global)
export function Trim (str, is_global) {
  var result
  result = str.replace(/(^\s+)|(\s+$)/g, '')
  if (is_global.toLowerCase() == 'g') {
    result = result.replace(/\s/g, '')
  }
  return result
}
// 去除数组空值removeArrEmpty(skuArr)
export function removeArrEmpty (arr) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] == '' || typeof (arr[i]) === 'undefined') {
      arr.splice(i, 1)
      i--
    }
  }
  return arr
};
// 根据某个值删除数组的项
export function removeArrItem (arr, item) {
  if (arr.length) {
    var index = arr.indexOf(item)
    if (index > -1) {
      return arr.splice(index, 1)
    }
  }
}
// 一维数组转二维数组subArrayNum：二维的单个长度，arrData:原数组
export function oArrToTwoArr (subArrayNum, arrData) {
  var dataArr = new Array(Math.ceil(arrData.length / subArrayNum))
  for (let i = 0; i < dataArr.length; i++) {
    dataArr[i] = new Array()
    for (let j = 0; j < subArrayNum; j++) {
      dataArr[i][j] = ''
    }
  }
  for (let i = 0; i < arrData.length; i++) {
    dataArr[parseInt(i / subArrayNum)][i % subArrayNum] = arrData[i]
  }
  return dataArr
}
// 移除数组中的空值
export function clearArrTrim (array) {
  for (var i = 0; i < array.length; i++) {
    if (array[i] == '' || typeof (array[i]) === 'undefined') {
      array.splice(i, 1)
      i = i - 1
    }
  }
  return array
}
// 判断值是否存在于数组
export function isInArray (arr, value) {
  for (var i = 0; i < arr.length; i++) {
    if (value === arr[i]) {
      return true
    }
  }
  return false
}
