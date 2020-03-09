import downloadTxt from './download';
import $ from 'Plugins/$';
export function getNumb() {
    var num = new Array();
    for (var i = 0; i < 10; i++) {
        var val = Math.ceil(Math.random() * 30);
        var isEqu = false;
        for (var idx in num) {
            if (num[idx] == val) {
                isEqu = true;
                break;
            }
        }
        if (isEqu) i--;
        else num[num.length] = val;
    }
    return num;
}

// scrollTop animation
export function scrollTop(el, from = 0, to, duration = 500) {
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = (
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                return window.setTimeout(callback, 1000 / 60);
            }
        );
    }
    const difference = Math.abs(from - to);
    const step = Math.ceil(difference / duration * 50);

    function scroll(start, end, step) {
        if (start === end) return;

        let d = (start + step > end) ? end : start + step;
        if (start > end) {
            d = (start - step < end) ? end : start - step;
        }

        if (el === window) {
            window.scrollTo(d, d);
        } else {
            el.scrollTop = d;
        }
        window.requestAnimationFrame(() => scroll(d, end, step));
    }
    scroll(from, to, step);
}

export function assert(condition, msg) {
    if (!condition) throw new Error(`[Apior] ${msg}`)
}

//echart 随机颜色
export function handleColors() {
    let color = '';
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    color = `rgb(${r},${g},${b})`;
    return color;
}

//12取20  67取70
export function getBigNumMethod(n){
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

export function isRepeat(arr) {
    var hash = {};
    for (var i in arr) {
        if (hash[arr[i]])
            return true;
        hash[arr[i]] = true;
    }
    return false;
}

//找出两数组不同的元素
export function getArrDifference(arr1, arr2) {
    return arr1.concat(arr2).filter(function (v, i, arr) {
        return arr.indexOf(v) === arr.lastIndexOf(v);
    });
}

//找出两数组相同的元素
export function getArrEqual(arr1, arr2) {
        let newArr = [];
        for (let i = 0; i < arr2.length; i++) {
            for (let j = 0; j < arr1.length; j++) {
                if(arr1[j] === arr2[i]){
                    newArr.push(arr1[j]);
                }
        }
     }
     return newArr;
}

//数组去重
export function unique(arr) {
    const res = new Map();
    return arr.filter((a) => !res.has(a) && res.set(a, 1))
}

//递归寻找id,返回id数组
export function deepFind(arr, condition, children) {
    let main = []
    try {
        (function poll(arr, level) {
            if (!Array.isArray(arr)) return
            for (let i = 0; i < arr.length; i++) {
                const item = arr[i]
                main[level] = item
                const isFind = condition && condition(item, i, level) || false
                if (isFind) {
                    throw Error
                } else if (children && item[children] && item[children].length) {
                    poll(item[children], level + 1)
                } else if (i === arr.length - 1) {
                    main.length = main.length - 1
                }
            }
        })(arr, 0)
    } catch (err) { }
    return main
}

//数字累加
export function totalMethod(arr){
	return arr.reduce((prev, curr) => {
	  const value = Number(curr);
	  if (!isNaN(value)) {
		return prev + value;
	  } else {
		return prev;
	  }
	},0);
}

/**
 * 下载文件
 * @param {String, data} url 下载路径或二进制流
 * @param {Boolean} txt 下载为txt
 * 
 */
export const downloadFile = (url, txt = '下载-' + $.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}'), _blank) => {
    process.env.NODE_ENV !== 'production' && console.info('下载时如果是二进制文件流，必须在api接口中配置 config.responseType= "blob"');
    var link
    if (typeof url === 'string') {
        // 如果是url
        if (!txt) {
            link = document.createElement("a");
            document.body.appendChild(link)
            link.style.display = 'none'
            if (_blank) {
                link.target = '_blank'
            }
            link.href = url
            let exts = url.split('.')
            let ext = '.' + exts[exts.length - 1]
            link.download = '下载' + ext
            link.click();
            window.URL.revokeObjectURL(link.href);
            document.body.removeChild(link)
        } else {
            downloadTxt(url, txt, "text/plain")
        }
    } else {
        // 二进制
        // 接口传入
        // config : {responseType: 'blob'}
        // console.log(url);
        url = window.URL.createObjectURL(new Blob([url]));
        link = document.createElement("a");
        document.body.appendChild(link)
        link.style.display = 'none'
        link.href = url;
        // console.log(txt);
        link.setAttribute("download", txt.replace('.xlsx', '') + '.xlsx' || `下载.xlsx`);
        if (navigator.userAgent.indexOf('Firefox/') === -1) {
            link.click();
        } else {
            var evt = document.createEvent("MouseEvents");
            evt.initEvent("click", true, true);
            link.dispatchEvent(evt);
        }

        window.URL.revokeObjectURL(url);
    }



}


/**
 * 深拷贝
 * @param {Object} obj 需要拷贝的对象
 */
export const deepClone = function fnDeepClone(obj) {
    var result = typeof obj.splice === 'function' ? [] : {},
        key;
    if (obj && typeof obj === 'object') {
        for (key in obj) {
            if (obj[key] && typeof obj[key] === 'object') {
                result[key] = fnDeepClone(obj[key]);//如果对象的属性值为object的时候，递归调用deepClone，即再把某个值对象复制一份到新的对象的对应值中
            } else {
                result[key] = obj[key];//如果对象的属性值不为object的时候，直接复制参数对象的每一个键/值到新对象对应的键/值中
            }

        }
        return result;
    }
    return obj;


}