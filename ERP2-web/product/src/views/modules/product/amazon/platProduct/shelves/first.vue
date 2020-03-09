<template>
  <div>
    <new-form
      :validSuccess.sync="validSuccess"
      :is-dirty.sync="isDirty"
      label-width="140px"
      v-model="currentVal"
      :form-schema="schema"
    ></new-form>
  </div>
</template>
<script>
export default {
  props: ['params', 'value'],
  data() {
    return {
      validSuccess: false,
      isDirty: false,
      variantsList: [],
      // value: {},
      schema: {
        stores: {
          required: true,
          label: '选择店铺',
          widget: 'select',
          multi: true,
          options:() => {
            return this.$api[`product/platProductSelectStore`](this.params)
            .then((data) => {
              return data.map(el => ({label: el.storeName, value: el.storeId}))
            })
          }
        },
        variants: {
          required: true,
          label: '选择变体',
          widget: 'select',
          multi: true,
          options:() => {
            return this.$api[`product/platProductVariants`](this.params)
            .then((data) => {
              data = data.variants.map(el => ({label: el.platSku, value: el.productPlatId}))
              this.variantsList = data
              return data
            })
          }
        },
        saleType: {
          required: true,
          label: '销售类型',
          widget: 'select',
          tip: {
            content: '选择自主上架，表示为自己的新产品',
            icon: 'el-icon-question'
          },
          options: [
            {
              label: '跟卖',
              value:0
            },
            {
              label: '自主上架',
              value:1
            }
          ]
        },
        toSellAsins: {
          // 表格数据
          type: 'table',
          label: 'table',
          batch: false,
          width: 'auto',
          hidden: (data) => {
            return data.saleType !== 0
          },
          head: {
            // 头每列信息
            asin: {
              // 跟最外层的基本控件属性一致
              type: 'input',
              label: '跟卖ASIN',
              noLabel: true,
              required: true
            }
          },
          rows: {
            // 行信息
            label: '平台SKU', // 每一行的标记数据 一般为SKU,也是表头之一
            value: 'platSku',
            props: {
              // // 行数据
              // sku3: {
              //   // 每行数据一个对象，目前只有defaultVal，即默认值，当然默认值也可以设置在formData上，会覆盖此处的值
              //   defaultVal: {
              //     color: '1',
              //     size: '2'
              //   }
              // },
              // sku2: {}
            }
          }
        },
        putawayType: {
          required: true,
          label: '上架方式',
          widget: 'radio',
          options: [
            {
              label: '新建父产品',
              value:0
            },
            {
              label: '独立产品上架',
              value: 1
            },
            {
              label: '上传到指定父产品下',
              value: 2
            }
          ]
        },
      }
    }
  },
  watch: {
    validSuccess(val) {
      this.$emit('update:validSuccess', val)
    },
    'currentVal.variants'(val) {
      let res = this.variantsList.filter(el => val.indexOf(el.value) > -1)
      this.currentVal.toSellAsins =  res.map(el => ({platSku: el.label, productPlatId: el.value}))
    }
  },
  computed: {
    currentVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
}
</script>