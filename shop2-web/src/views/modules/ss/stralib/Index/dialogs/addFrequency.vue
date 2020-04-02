<template>
  <div class="w800 no-asterisk">
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
    <el-divider class="mt10" content-position="left">
      监控频率策略
      <el-tooltip content="监控策略是全局的，影响整个跟卖，包含库存、价格&价格范围、跟卖数量策略。" placement="top">
        <i class="el-icon-info"></i>
      </el-tooltip>
    </el-divider>
    <new-form label-position="left" ref="form1" label-width="120px" inline :form-schema="formSchema1" :value="value1"></new-form>
  </div>
</template>
<script>
export default {
  props: ['strategyId'],
  data() {
    return {
      formSchema: {
        ddd: {
          widget: 'txt',
          text: '策略名称',
          style: {
            fontSize: '16px',
            textAlign: 'right'
          },
          span: 2
        },
        strategyName: {
          // label: '策略名称',
          required: true,
          span: 10
        },
        defaultFlag: {
          widget: 'checkbox',
          span: 12,
          options: [{ label: '设为默认', value: 1 }]
        }
      },
      value: {},
      formSchema1: {
        d: {
          defaultVal: '跟卖监控频率',
          style: {
            fontSize: '16px'
          },

          width: '50px',
          widget: 'text'
        },
        d1: {
          label: ' ',
          labelWidth: '30px',
          widget: 'text',
          tip: {
            content: '监控跟卖是否丢失购物车'
          }
        },
        d2: {
          widget: 'equal'
        },
        cartFrequency: {
          placeholder: '5~60分钟',
          required: true,
          widget: 'number',
          min: 5,
          max: 60,
          width: '200px'
        },
        d3: {
          widget: 'text',
          labelWidth: '50px',
          label: '/分钟',
          style: {
            width: '300px',
            display: 'block'
          }
        },
        d4: {
          defaultVal: '数据更新频率',
          style: {
            fontSize: '16px'
          },

          width: '50px',
          widget: 'text'
        },
        d5: {
          label: ' ',
          labelWidth: '30px',
          widget: 'text',
          tip: {
            content: '更新加入可跟卖库的跟卖源基础数据，和跟卖库的跟卖数据'
          }
        },
        d6: {
          widget: 'equal'
        },
        d7: {
          defaultVal: '基础数据',
          style: {
            fontSize: '16px'
          },

          width: '50px',
          widget: 'text'
        },
        baseFrequency: {
          placeholder: '',
          width: '100px',
          widget: 'number',
          required: true,
          min: 1,
          max: 60
        },
        d8: {
          widget: 'text',
          labelWidth: '50px',
          label: '/天',
          style: {
            width: '30px',
            display: 'block'
          }
        },
        d9: {
          defaultVal: '跟卖数据',
          style: {
            fontSize: '16px'
          },

          width: '50px',
          widget: 'text'
        },
        sellingFrequency: {
          placeholder: '',
          widget: 'number',
          width: '100px',
          required: true,
          min: 1,
          max: 10
        },
        d10: {
          widget: 'text',
          labelWidth: '50px',
          label: '/天',
          width: '10px',
          style: {
            display: 'block',
            width: '20px'
          }
        },
        d11: {
          defaultVal: '排除店铺',
          style: {
            fontSize: '16px'
          },

          widget: 'text'
        },
        d12: {
          label: ' ',
          labelWidth: '30px',
          style: {
            paddingLeft: '32px'
          },
          widget: 'text',
          tip: {
            content:
              '自己店铺默认必须排除，这里可以排除更多店铺，包含库存、价格&价格范围、跟卖数量策略量。'
          }
        },
        d13: {
          widget: 'equal'
        },
        excludeSellerList: {
          style: {
            width: '500px'
          },
          widget: 'textarea',
          rows: 5,
          placeholder: '店铺ID，一行一个'
        }
      },
      value1: {}
    }
  },
  created() {
    if (this.strategyId) {
      this.getInfo()
    }
  },
  methods: {
    validate() {
      return Promise.all(
        [this.$refs.form, this.$refs.form1].map(e => e.validate())
      )
    },
    getInfo() {
      this.$api[`ss/sellingStrategyInfoByFrequency`]({
        ...this.storeInfo,
        strategyId: this.strategyId
      }).then(data => {
        data = data.data
        let {
          cartFrequency,
          baseFrequency,
          strategyName,
          sellingFrequency,
          excludeSellerList
        } = data
        if (excludeSellerList) {
          excludeSellerList = excludeSellerList.join('\n')
        }
        this.value = {
          ...this.value,
          strategyName,
          defaultFlag: data.defaultFlag ? [1] : []
        }
        this.value1 = {
          ...this.value1,
          cartFrequency,
          baseFrequency,
          sellingFrequency,
          excludeSellerList
        }
      })
    },
    _submit() {
      return this.validate().then(() => {
        let {
          cartFrequency,
          baseFrequency,
          sellingFrequency,
          excludeSellerList
        } = this.value1
        excludeSellerList = excludeSellerList.split(/[\n|\r\n]/)
        let params = {
          ...this.storeInfo,
          ...this.value,
          defaultFlag: !!this.value.defaultFlag[0],
          cartFrequency,
          baseFrequency,
          sellingFrequency,
          excludeSellerList,
          strategyId: this.strategyId
        }
        return this.$api[
          `ss/${
            this.strategyId
              ? 'sellingStrategyUpdateByFrequency'
              : 'sellingStrategySaveByFrequency'
          }`
        ](params)
      })
    }
  }
}
</script>