import apis from 'apis'
import { fetchData, handlerCode } from 'common/common'
import Vue from 'vue';

export const getTempList = (siteCategoryId, site) => {
  fetchData({
    ...apis.PRODUCT_PLT_DETAIL_A_EN_MODULE,
    data: {
      siteCategoryId
    }
  }).then(res => {
    handlerCode(res, () => {
      site.siteInfo.tempList = res.data.categoryList.map(el => ({
        label: el.templateNameCh,
        value: el.salePfTemplateId
      }))
    }, null, true)
  })
}

// 获取验证规则
export const getRules = (item, variant) => {
  const checkSame = (rule, value, cb) => {
    if (item.dataRanges && item.dataRanges !== 'null' && item.dataType !== 3) {
      let reg = new RegExp(item.dataRanges, 'gi')
      if (!reg.test(value)) {
        cb(new Error('输入字符不合法，请重新输入'))
      }
    }

    if (Array.isArray(value) && !value.length && (item.mustFlag || item.showFlag)) {
      cb(new Error('不能为空'))
    }

    if ((value == null || value === '') && (item.mustFlag || item.showFlag)) {
      cb(new Error('不能为空'))
    }

    if (item.variantList && item.nonPropertyFlag) {
      let values = variant ? [item.value] : []
      values.push(...item.variantList.map(el => (el !== variant && el.value)))
      values = values.filter(val => val != null && val !== '')
      if (values.indexOf(value) > -1) {
        Vue.set(item, '_show', false)
        cb(new Error('不能选择相同的值'))
      }
    }
    cb()
  }
  return [{
    validator: checkSame
  }]
}