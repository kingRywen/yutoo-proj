let rankData = {
    title: {
        // text: "日新增评价数-详情曲线图"
    },
    tooltip: {
        trigger: "axis"
    },
    grid: {
        top: "17%",
        left: "6%",
        right: "6%",
        bottom: "14%",
        containLabel: true
    },
    dataZoom: [
        {
            type: "inside",
            start: 0,
            end: 100,
        },
        {
            start: 0,
            end: 100,
            handleIcon:
                "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
                color: "#fff",
                shadowBlur: 3,
                shadowColor: "rgba(0, 0, 0, 0.6)",
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }
    ],
    toolbox: {
        trigger: "axais",
        feature: {
            // restore: {},
            // saveAsImage: { title: "保存" }
        }
    },
    xAxis: {
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        type: "category", // category time
        // name: "时间",
        boundaryGap: false,
        axisLabel: {
            textStyle: {
                color: "#999"
            }
        },
        splitLine: {
            show: false,
            lineStyle: {
                // 使用深浅的间隔色
                color: ["#aaa", "#ddd"]
            }
        },
        data: []
    },
    yAxis: {
        splitNumber: 5,
        axisLine: {
            show: false
        },
        axisTick: {
            show: false
        },
        type: "value",
        // name: "数量",
        axisLabel: {
            textStyle: {
                color: "#999"
            }
        },
        inverse: true,
        min: 1,
        minInterval: 1,
        // splitLine:{
        // 	　　　　show:false
        // 	　　 }
    },
    legend: {
        selectedMode: false,
        padding: [
            0,  // 上
            50, // 右
            5,  // 下
            0, // 左
        ],
        data: []
    },
    splitLine: {
        show: true,
        lineStyle: {
            // 使用深浅的间隔色
            color: ["#aaa", "#ddd"]
        }
    },
    axisTick: {
        interval: 0
    },
    series: [

    ]
};

export default {
    rankData
}