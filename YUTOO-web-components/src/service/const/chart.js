

export default [{
  name: 'COLOR',
  desc: '图表项颜色',
  value: ['#5793f3', '#d14a61', '#675bba', '#ffcd56', '#4bc0c0', '#ff6384', '#c9cbcf']
}, {
  name: 'ITEM_STYLE',
  desc: '图表项样式',
  value: {
    symbol: 'circle',
    symbolSize: 7,
    lineStyle: {
      // color: 'rgb(33,148,246)'
    },
    itemStyle: {
      // color: 'rgb(33,148,246)',
      borderWidth: 2,
      borderColor: '#FFF'
    },
    smooth: true,
    smoothMonotone: 'x',
  }
}]