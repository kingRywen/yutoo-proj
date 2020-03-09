let Mixins = {}

// 转义
const unescape = (html) => {
  return html
    // .replace(html ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "\'")
}

// 格式化表格数据
const _formatData = (val) => {
  return val == null || val === -1 || val === '' ? '-' : val
}

// 格式化百分比数据，如果无数据显示无穷大，
// 如果有，乘100加百分比号
const _formatPercent = (val) => {
  if (val) {
    return (val * 100).toFixed(0) + '%'
  } else {
    return '∞'
  }
}

// 格式化百分比数据，如果无数据显示无穷大，
// 如果有，乘100加百分比号
const _formatPercentter = (row, column) => {
  const val = row[column.property]
  if (val) {
    return (val * 100).toFixed(0) + '%'
  } else {
    return '∞'
  }
}

// 格式化发货方式
const _fbqFormatter = (row, column) => {
  const val = row[column.property]
  return val === 0 ? '自发货' : val === 1 ? 'FBS' : '不限'
}

// 格式华表格数据显示
const _formatter = (row, column) => {
  if ((!row[column.property] && row[column.property] !== 0) || row[column.property] === '' || row[column.property] === -1) {
    return '-'
  } else {
    return row[column.property]
  }
}

Mixins.install = function (Vue, opts) {
  const filters = {
    unescape,
    _formatData,
    _formatPercent
  }

  const methods = {
    _formatter,
    _formatPercentter,
    _fbqFormatter
  }

  Vue.mixin({
    filters,
    methods
  })
}

export default Mixins
