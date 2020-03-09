const utils = (function (root, globalName, factory) {
  // eslint-disable-next-line
  if (typeof define === 'function' && define.amd) {
    // AMD:
    // eslint-disable-next-line
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    // Node:
    module.exports = factory();
    // Use module export as simulated ES6 default export:(将模块导出用作模拟ES6默认导出)
    module.exports.default = module.exports;
  } else {
    // Browser:

    return (window[globalName] = factory());
  }
})(this, 'myNpmUtils', function () {
  return function myNpmUtils(host) {
    function dataType(params) {
      if (params === null) {
        return 'Null';
      } else if (params === undefined) {
        return 'Undefined';
      } else {
        return Object.prototype.toString.call(params).slice(8, -1);
      }
    }

    const isArray = function (params) {
      return dataType(params) == 'Array';
    };
    const isObject = function (params) {
      return dataType(params) == 'Object';
    };
    const isString = function (params) {
      return dataType(params) == 'String';
    };
    const isNumber = function (params) {
      return dataType(params) == 'Number';
    };
    const isFunction = function (params) {
      return dataType(params) == 'Function';
    };
    const isNull = function (params) {
      return dataType(params) == 'Null';
    };
    const isBoolean = function (params) {
      return dataType(params) == 'Boolean';
    };
    const isUndefined = function (params) {
      return dataType(params) == 'Undefined';
    };
    const isEmpty = function (params) {
      if (isObject(params)) {
        return Object.keys(params).length == 0;
      } else if (isArray(params)) {
        return params.length == 0;
      } else if (
        (isNull(params) ||
          isUndefined(params) ||
          params == '' ||
          params != params) &&
        params != 0
      ) {
        return true;
      } else {
        return false;
      }
    };

    const isArrLength = function (params) {
      return !!(isArray(params) && params.length);
    };

    // 去除对象键值为空的值
    const filterObj = function filterObj(obj) {
      if (isObject(obj) || isArray(obj)) {
        let result;
        if (isObject(obj)) {
          result = {};
        } else {
          result = [];
        }
        for (let k in obj) {
          if (!isEmpty(obj[k])) {
            if (isObject(obj[k]) || isArray(obj[k])) {
              result[k] = filterObj(obj[k]);
            } else {
              result[k] = obj[k];
            }
          } else {
            continue;
          }
        }
        return result;
      } else {
        console.error('The incoming value is not an object or array');
        return obj;
      }
    };

    // 深拷贝
    function clone(target) {
      //判断拷贝的数据类型
      //初始化变量result 成为最终克隆的数据
      let result;
      if (isObject(target)) {
        result = {};
      } else if (isArray(target)) {
        result = [];
      } else {
        return target;
      }
      //遍历目标数据
      for (const i in target) {
        if (target.hasOwnProperty(i)) {
          //获取遍历数据结构的每一项值
          let value = target[i];
          //判断目标结构里的每一项值是否存在对象/数组
          if (isObject(value) || isArray(value)) {
            //继续遍历获取到的value值
            result[i] = clone(value);
          } else {
            //获取到的value值是基本的数据类型或者是函数
            result[i] = value;
          }
        }
      }
      return result;
    }

    function intersection(arr, arr1) { // 两数据交集
      return arr.filter(item => {
        return !!arr1.find(i => isSame(i, item));
      });
    }

    function diffSet(arr, arr1) { // 两数组差集
      return arr.filter(item => {
        return !arr1.find(i => isSame(i, item))
      })
    }

    function dealDouble(arr) { // 处理数组去重
      let newArr = []
      for (const key in arr) {
        if (arr.hasOwnProperty(key)) {
          const item = arr[key];
          if (!newArr.some(i => isSame(item, i))) {
            newArr.push(item)
          }
        }
      }
      return newArr
    }

    function debounce(fn, timeout) { // 防抖
      // eslint-disable-next-line no-unused-vars
      let timer = null
      return function (...arg) {
        let _this = this
        timer = setTimeout(() => {
          fn.apply(_this, arg)
        }, timeout);

      }
    }

    function throttle(fn, timeout) { // 节流
      let timer = null
      return function (...arg) {
        if (!timer) {
          timer = setTimeout(() => {
            fn.apply(this, arg)
            timer = null
          }, timeout);
        }
      }
    }

    function traversal(arr, callback) { // 遍历指定次数
      let i = 0,
        len = null
      switch (dataType(arr)) {
        case "Array":
          len = arr.length

          break;
        case "Number":
          len = arr
          break;
      }
      while (i < len) {
        callback(i, arr[i]);
        i++;
      }
    }


    function isSame(origin, target) { // 比较2个变量是否一样
      if (dataType(origin) !== dataType(target)) {
        return false
      }
      if ((origin != origin) && (target != target)) {
        return true
      }
      if (typeof origin == "function") {
        return true
      }

      if (typeof origin === "object") {
        for (const key in origin) {
          if (origin.hasOwnProperty(key)) {
            const value = origin[key];
            if (!isSame(target[key], value)) {
              return false
            }
          }
        }
        for (const key in target) {
          if (target.hasOwnProperty(key)) {
            const value = target[key];
            if (!isSame(origin[key], value)) {
              return false
            }
          }
        }
        return true
      } else {
        if (origin === target) {
          return true
        } else {
          return false
        }
      }

    }

    let obj = {
      dataType,
      isArray,
      isArrLength,
      isObject,
      isString,
      isNumber,
      isBoolean,
      isFunction,
      isNull,
      isUndefined,
      isEmpty,
      filterObj,
      clone,
      intersection,
      isSame,
      diffSet,
      dealDouble,
      debounce,
      throttle,
      traversal
    };
    if (typeof host == 'function') {
      if (isUndefined(host.prototype.utils)) {
        host.prototype.utils = obj;
      } else {
        console.info(`${obj}中存在utils，已使用_`);
        host.prototype._ = obj;
      }
    } else if (typeof host == 'object') {
      if (isUndefined(host.utils)) {
        host.utils = obj;
      } else {
        console.info(`${obj}中存在utils，已使用_`);
        host._ = obj;
      }
    }
  };
});

export default utils;