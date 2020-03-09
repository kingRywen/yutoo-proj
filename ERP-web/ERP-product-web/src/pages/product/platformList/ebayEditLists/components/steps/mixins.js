import apis from 'apis'
import bus from '@/common/bus';
import { fetchData, handlerCode, showToast } from 'common/common'
export default {
  props: {
    data: {
      default: () => ({})
    },
    // 是否审核状态
    review: {
      default: false
    },
    // 母变体
    parentFlag: {
      default: 1
    },
    // 平台id
    productPltDetailId: Number,
    platformId: Number,
    productType: Number,
    productId: Number
  },
  created() {
    this.getEditData()
  },
  methods: {
    getEditData() {

      let vm = this, api, params
      if (this.productPltDetailId) {
        // 平台编辑
        api = 'PRODUCT_PLT_DETAIL_DATA'
        params = {
          flag: this.review ? 1 : 0,
          parentFlag: this.parentFlag,
          platformId: this.platformId,
          productPltDetailId: this.productPltDetailId,
          groupCode: this.groupCode
        }
      } else {

        // 店铺编辑
        api = 'STORE_PRODUCT_INFO'
        params = {
          productId: this.productId,
          groupCode: this.groupCode,
          platformId: this.platformId,
          productType: this.productType
        }
      }
      bus.$emit('setLoading', true)
      fetchData({
        ...apis[api],
        data: params
      }).then(res => {

        bus.$emit('setLoading', false)
        handlerCode(
          res,
          () => {
            if (params.groupCode == 0 && this.productPltDetailId == null) {
              // 店铺产品编辑 基本信息需要特殊处理UPC, 排序UPC和数量
              let general = res.data.rows.properties.general, obj = {}
              general.forEach(el => {
                if (el.propertyName === 'Selas Inventory') {
                  el.propertyValue.forEach(_el => {
                    if (!_el.value || _el.value === '') {
                      _el.value = undefined
                    }
                  })
                  if (!el.value || el.value === '') {
                    el.value = undefined
                  }
                }
                obj[el.propertyName] = el
              })
              res.data.rows.properties.special = obj
            }
            if (params.groupCode == 2 && (typeof res.data.rows.properties === 'string')) {
              
              res.data.rows.properties = {description: res.data.rows.properties}
            }
            vm.$emit('setData', { data: this.productPltDetailId == null ? res.data.rows.properties || {} : res.data.rows.dataMap || {}, code: vm.groupCode })
            vm.flag = true
          },
          () => {
            showToast('error', res.data.msg)
          },
          true
        )
      })
    },
    saveData(params) {
      if (this.review) {
        return
      }
      let api, data
      if (this.productPltDetailId != null) {
        // 平台保存接口
        api = 'PRODUCT_PLT_DETAIL_A_EN_SAVE'
        data = {
          groupCode: this.groupCode,
          platformId: this.platformId,
          parentFlag: this.parentFlag,
          productPltDetailId: this.productPltDetailId,
          ...params
        }
      } else {
        // 店铺保存接口
        api = 'STORE_PRODUCT_EDIT'
        data = {
          groupCode: this.groupCode,
          productId: this.productId,
          platformId: this.platformId,
          productType: this.productType,
          ...params
        }
      }
      bus.$emit('setLoading', true)

      return fetchData({
        ...apis[api],
        data
      }).then(res => {
        handlerCode(
          res,
          () => {
            bus.$emit('setLoading', false)
            console.log('保存成功')
          },
          () => {
            showToast('error', res.data.msg)
          },
          true
        )
      })
    }
  }
};
