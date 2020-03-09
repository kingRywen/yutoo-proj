export default [
  {
    name: "COLOR",
    desc: "图表项颜色",
    value: [
      "#3fb1e3",
      "#6be6c1",
      "#626c91",
      "#a0a7e6",
      "#c4ebad",
      "#96dee8",
      "#c9cbcf"
    ]
  },
  {
    name: "ITEM_STYLE",
    desc: "图表项样式",
    value: {
      // symbol: 'circle',
      // symbolSize: 3,
      // showSymbol: false,
      // itemStyle: {
      //   // color: 'rgb(33,148,246)',
      //   borderWidth: 1,
      //   borderColor: '#FFF'
      // },
      smooth: true,
      smoothMonotone: "x",
      itemStyle: {
        normal: {
          borderWidth: 2
        }
      },
      lineStyle: {
        normal: {
          width: 3
        }
      },
      symbolSize: 8,
      symbol: "emptyCircle"
    }
  }
];
