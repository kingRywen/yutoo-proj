<template>
  <div class="w1100 no-asterisk">
    <new-form ref="form" label-width="80px" :form-schema="formSchema" :value="value"></new-form>
    <el-divider class="mt10" content-position="left">
      跟卖数量策略
      <el-tooltip content="目标站点（跟卖站点）的跟卖数量，根据排除自己店铺和“排除店铺”。" placement="top">
        <i class="el-icon-info"></i>
      </el-tooltip>
    </el-divider>
    <new-form ref="form1" label-width="120px" :form-schema="formSchema1" :value="value1"></new-form>
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
      value: {},
      formSchema1: {
        multiArray: {
          type: 'multiArray',

          children: {
            minCnt: {
              label: '目标总跟卖数量',
              labelWidth: '120px',
              width: '120px',
              widget: 'number',
              change: schema => {
                this.formSchema1.multiArray.children.maxCnt.min =
                  schema.value.minCnt
                this.$set(schema.value, 'maxCnt', undefined)
              },
              required: true,
              placeholder: '从'
            },
            maxCnt: {
              label: '~',
              labelWidth: '30px',
              width: '120px',
              min: 0,
              required: true,
              widget: 'number',
              placeholder: '到'
            },
            c: {
              widget: 'equal'
            },
            sellingCnt: {
              width: '120px',
              required: true,
              widget: 'number',
              max: 30,
              placeholder: '跟卖数量'
            }
          }
        }
      },
      value1: {
        multiArray: [{}]
      }
    }
  },
  created() {
    if (this.strategyId) {
      this.getInfo()
    }
  },
  methods: {
    getInfo() {
      const params = {
        ...this.storeInfo,
        siteId: this.$store.state.selling.curSiteId,
        strategyId: this.strategyId
      }
      this.$api[`ss/sellingStrategyInfoByCnt`](params).then(data => {
        const { strategyName, defaultFlag, detail } = data.data
        this.value = {
          ...this.value,
          strategyName,
          defaultFlag: defaultFlag ? [1] : []
        }
        this.value1 = {
          ...this.value1,
          multiArray: detail
        }
      })
    },
    validate() {
      return Promise.all(['form', 'form1'].map(e => this.$refs[e].validate()))
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          ...this.storeInfo,
          siteId: this.$store.state.selling.curSiteId,
          strategyId: this.strategyId,
          strategyName: this.value.strategyName,
          defaultFlag: !!this.value.defaultFlag[0],
          detail: this.value1.multiArray
        }
        return this.$api[
          `ss/${
            this.strategyId
              ? 'sellingStrategyUpdateByCnt'
              : 'sellingStrategySaveByCnt'
          }`
        ](params)
      })
    }
  }
}
</script>