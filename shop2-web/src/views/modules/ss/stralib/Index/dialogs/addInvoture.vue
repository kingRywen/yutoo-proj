<template>
  <div class="w1100 no-asterisk">
    <new-form ref="form" label-width="80px" :form-schema="formSchema" :value="value"></new-form>
    <el-divider class="mt10" content-position="left">库存策略</el-divider>

    <!-- <new-form class="mt20" ref="form1" inline label-width="120px" :form-schema="formSchema1" :value="value1"></new-form> -->
    <label class="lb">
      <span class="mr10">取值方式</span>
      <el-radio class="mt10" size="mini" v-model="calculation" :label="0">动态库存</el-radio>
      <el-radio size="mini" v-model="calculation" :label="1">固定库存</el-radio>
    </label>
    <new-form
      v-show="calculation == 1"
      class="mt20"
      ref="form2"
      inline
      label-width="120px"
      :form-schema="formSchema2"
      :value="value2"
    ></new-form>
  </div>
</template>
<script>
export default {
  props: ['strategyId'],
  data() {
    return {
      formSchema: {
        strategyName: {
          label: '策略名称',
          required: true,
          span: 12
        },
        defaultFlag: {
          widget: 'checkbox',
          span: 12,
          options: [{ label: '设为默认', value: 1 }]
        }
      },
      calculation: 0,
      formSchema1: {
        d: {
          text: '库存阀值',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d1: {
          widget: 'equal'
        },
        stockThreshold: {
          required: true,
          widget: 'number',
          precision: 0,
          min: 1,
          max: 100,
          width: '190px'
        }
      },
      value1: {},
      formSchema2: {
        d: {
          text: '库存',
          style: {
            fontSize: '16px'
          },
          labelWidth: '30px',
          widget: 'text'
        },
        d1: {
          widget: 'equal'
        },
        stockQty: {
          widget: 'number',
          required: true,
          placeholder: '自定义值'
        },
        autoRecoveryFlag: {
          widget: 'checkbox',
          options: [
            {
              label: '自动恢复库存',
              value: 1
            }
          ]
        }
      },
      value2: {},
      value: {}
    }
  },
  created() {
    if (this.strategyId) {
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      let params = { ...this.storeInfo, strategyId: this.strategyId }
      this.$api[`ss/sellingStrategyInfoByInventory`](params).then(data => {
        data = data.data
        this.value = {
          ...this.value,
          strategyId: data.strategyId,
          strategyName: data.strategyName,
          defaultFlag: data.defaultFlag ? [1] : []
        }
        this.calculation = data.calculation
        this.value1 = {
          ...this.value1
          // stockThreshold: data.stockThreshold
        }
        if (data.calculation == 1) {
          this.value2 = {
            ...this.value2,
            stockQty: data.stockQty,
            autoRecoveryFlag: data.autoRecoveryFlag ? [1] : []
          }
        }
      })
    },
    validate() {
      let forms = ['form']
      if (this.calculation) {
        forms.push('form2')
      }
      return Promise.all(forms.map(f => this.$refs[f].validate()))
    },
    _submit() {
      return this.validate().then(() => {
        let botVal = {}
        if (this.calculation) {
          botVal = {
            ...this.value2,
            autoRecoveryFlag: !!this.value2.autoRecoveryFlag[0]
          }
        }
        let params = {
          ...this.storeInfo,
          ...this.value,
          ...botVal,
          defaultFlag: !!this.value.defaultFlag[0],
          calculation: this.calculation,
          // stockThreshold: this.value1.stockThreshold,

          strategyId: this.strategyId
        }
        return this.$api[
          `ss/${
            this.strategyId
              ? 'sellingStrategyUpdateByInventory'
              : 'sellingStrategySaveByInventory'
          }`
        ](params)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.lb {
  font-size: 16px;
  padding-right: 20px;
}
</style>