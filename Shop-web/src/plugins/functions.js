let cfuns = {}
const storageName = 'shop_'
cfuns.pacPickerOptions={
	disabledDate(time) {
		return  time.getTime() > Date.now() - 15 * 3600 * 1000
	}
},
cfuns.__pickerOptions = {
    shortcuts: [{
        text: '今日',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '7天',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '30天',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
            picker.$emit('pick', [start, end]);
        }
    }]
};
// 定义添加监控只能是今日之后
cfuns._pickerFuture = {
    disabledDate(time) {
        return time.getTime() < Date.now() - 3600 * 24 * 1000;
    }
};
// 定义添加监控只能是今日之前
cfuns._pickerBefore = {
    disabledDate(date) {
        return date.getTime() > Date.now();
    }
};
// 去掉字符空格Trim(str, is_global)
cfuns.Trim = (str, is_global) => {
    var result;
    result = str.replace(/(^\s+)|(\s+$)/g, "");
    if (is_global.toLowerCase() == "g") {
        result = result.replace(/\s/g, "");
    }
    return result;
}
// 驼峰转换下划线
cfuns.toLine = (name) => {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase()
};
cfuns.noValue = (data) => {
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
cfuns.getDay = (daycount) => {
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
// 前后不超过一年，且不能选择以前的日期
cfuns.onlyOneYear = {
    disabledDate: function (time) {
        return time.getTime() > Date.now();
    },
    // 前后限制一年
    onPick(date) {
        // 当前时间
        let date_min = date.minDate;
        let date_max = date.maxDate;
        // console.log(date_min);
        if (date_max === null) {
            this.disabledDate = function (time) {
                let curDate = date_min.getTime();
                let one_year = 365 * 24 * 3600 * 1000;
                // 上一年
                let curr_year = curDate - one_year;
                // 下一年
                let next_year = curDate + one_year;
                let small;
                if (next_year > Date.now()) {
                    // 如果下一年，比现在的时间大，则选择现在的时间禁用
                    small = Date.now()
                } else {
                    // 如果下一年都比当前时间少，则选择下一年为禁用
                    small = next_year
                }
                return time.getTime() < curr_year || time.getTime() > small;
            }
        } else {
            // 两个值都有的时候，表示重新打开时间框或者选好了。重置一下
            this.disabledDate = function (time) {
                return time.getTime() > Date.now();
            }
        }
    },
    shortcuts: [{
        text: '今日',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '7天',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 6);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '30天',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 29);
            picker.$emit('pick', [start, end]);
        }
    }]
};
// souq类目分析
cfuns.onlyTwoYear = {
    disabledDate: function (time) {
        return time.getTime() > Date.now();
    },
    // 前后限制两年
    onPick(date) {
        // 当前时间
        let date_min = date.minDate;
        let date_max = date.maxDate;
        // console.log(date_min);
        if (date_max === null) {
            this.disabledDate = function (time) {
                let curDate = date_min.getTime();
                let one_year = 730 * 24 * 3600 * 1000;
                // 上一年
                let curr_year = curDate - one_year;
                // 下一年
                let next_year = curDate + one_year;
                let small;
                if (next_year > Date.now()) {
                    // 如果下一年，比现在的时间大，则选择现在的时间禁用
                    small = Date.now()
                } else {
                    // 如果下一年都比当前时间少，则选择下一年为禁用
                    small = next_year
                }
                return time.getTime() < curr_year || time.getTime() > small;
            }
        } else {
            // 两个值都有的时候，表示重新打开时间框或者选好了。重置一下
            this.disabledDate = function (time) {
                return time.getTime() > Date.now();
            }
        }
    },
    shortcuts: [
		{
			text: '今日',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 0);
				picker.$emit('pick', [start, end]);
			}
		}, 
		{
        text: '7天',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
				picker.$emit('pick', [start, end]);
			}
		}, 
		{
			text: '30天',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
				picker.$emit('pick', [start, end]);
			}
		},
		{
			text: '180天',
			onClick(picker) {
				const end = new Date();
				const start = new Date();
				start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
				picker.$emit('pick', [start, end]);
			}
		},
	]
};
// 成交统计
cfuns.TsYear = {
    disabledDate: function (time) {
        return time.getTime() > Date.now();
    },
    // 前后限制两年
    onPick(date) {
        // 当前时间
        let date_min = date.minDate;
        let date_max = date.maxDate;
        // console.log(date_min);
        if (date_max === null) {
            this.disabledDate = function (time) {
                let curDate = date_min.getTime();
                let one_year = 100000000 * 24 * 3600 * 1000;
                // 上一年
                let curr_year = curDate - one_year;
                // 下一年
                let next_year = curDate + one_year;
                let small;
                if (next_year > Date.now()) {
                    // 如果下一年，比现在的时间大，则选择现在的时间禁用
                    small = Date.now()
                } else {
                    // 如果下一年都比当前时间少，则选择下一年为禁用
                    small = next_year
                }
                return time.getTime() < curr_year || time.getTime() > small;
            }
        } else {
            // 两个值都有的时候，表示重新打开时间框或者选好了。重置一下
            this.disabledDate = function (time) {
                return time.getTime() > Date.now();
            }
        }
    },
    shortcuts: [{
        text: '一年',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '7天',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
        }
    }, {
        text: '30天',
        onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
        }
    }]
};
// 12取20    23取30
cfuns.getBigNum = (n) => {
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
};
cfuns.getStorage = (name) => {
    const obj = sessionStorage.getItem(storageName + name)
    if (!obj) {
        return {}
    }
    return JSON.parse(sessionStorage.getItem(storageName + name))
}

cfuns.setStorage = (name, val) => {
    sessionStorage.setItem(storageName + name, val)
}
// 处理类目太长
cfuns.handCate = (_this) => {
    let el = document.getElementsByClassName('el-cascader-menus')[0]
    // let windowInnerWidth = window.innerWidth / 2 + 50 + "px";
    let windowInnerWidth = window.innerWidth / 2 - 200 + 'px'
    el.style.maxWidth = windowInnerWidth
    el.style.overflow = 'auto'
    _this.$nextTick(() => {
        el.scrollLeft = 1000000
    }, 10)
    // console.log(el.scrollLeft, "el.scrollLeft");
};
// 比较两个数组返回差异值
cfuns.diff = (arr1, arr2) => {
    var newArr = [];
    var arr3 = [];
    for (var i = 0; i < arr1.length; i++) {
        if (arr2.indexOf(arr1[i]) === -1)
            arr3.push(arr1[i]);
    }
    var arr4 = [];
    for (var j = 0; j < arr2.length; j++) {
        if (arr1.indexOf(arr2[j]) === -1)
            arr4.push(arr2[j]);
    }
    newArr = arr3.concat(arr4);
    return newArr;
};
// 时间从明天起
// cfuns.future: { 
//     disabledDate(time) {
//        return time.getTime() < Date.now() - 8.64e7;//如果没有后面的-8.64e7就是不可以选择今天的 
//     }
// },

export default cfuns