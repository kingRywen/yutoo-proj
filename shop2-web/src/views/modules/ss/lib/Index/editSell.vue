<template>
  <new-form
    class="w800"
    style="overflow: hidden;"
    inline
    ref="form"
    label-width="120px"
    :form-schema="formSchema"
    :value="value"
  ></new-form>
</template>
<script>
export default {
  props: ['siteId'],
  data() {
    const labelStyle = {
      fontSize: '16px',
      width: '100px',
      display: 'inline-block'
    }
    return {
      formSchema: {
        d1: {
          text: '站点',
          style: labelStyle,
          widget: 'text'
        },
        siteId: {
          // label: '站点',
          widget: 'select',
          width: 280,
          disabled: true,
          bind: {
            label: 'siteName',
            value: 'siteId'
          },
          options: this.$store.getters['storeInfo/currentPlat'].sites
        },
        d22: {
          text: ' ',
          style: { ...labelStyle, width: '300px' },
          widget: 'text'
        },
        d: {
          text: '跟卖监控频率',
          style: labelStyle,
          widget: 'text'
        },
        d3: {
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
        d4: {
          widget: 'text',
          labelWidth: '50px',
          label: '/分钟',
          style: {
            width: '280px',
            display: 'block'
          }
        },

        e: {
          text: '库存更新频率',
          style: labelStyle,
          widget: 'text'
        },
        e3: {
          label: ' ',
          labelWidth: '30px',
          widget: 'text',
          tip: {
            content: '亚马逊库存更新频率'
          }
        },
        e2: {
          widget: 'equal'
        },
        inventoryFrequency: {
          placeholder: '5~1440分钟',
          required: true,
          widget: 'number',
          min: 5,
          max: 1440,
          width: '200px'
        },
        e4: {
          widget: 'text',
          labelWidth: '50px',
          label: '/分钟',
          style: {
            width: '280px',
            display: 'block'
          }
        },

        f: {
          text: '数据更新频率',
          style: labelStyle,
          widget: 'text'
        },
        f3: {
          label: ' ',
          labelWidth: '30px',
          widget: 'text',
          tip: {
            content: '亚马逊库存更新频率'
          }
        },
        f2: {
          widget: 'equal'
        },
        f5: {
          text: '基础数据',
          style: { ...labelStyle, width: '70px' },
          widget: 'text'
        },
        baseFrequency: {
          placeholder: '1~60',
          required: true,
          widget: 'number',
          min: 1,
          max: 60,
          width: '70px'
        },
        f4: {
          widget: 'text',
          labelWidth: '50px',
          label: '/天',
          style: {
            width: '0',
            display: 'block'
          }
        },
        f6: {
          text: '跟卖数据',
          style: { ...labelStyle, width: '70px' },
          widget: 'text'
        },
        sellingFrequency: {
          // placeholder: '5~1440分钟',
          required: true,
          widget: 'number',
          min: 1,
          max: 10,
          width: 30
        },
        f7: {
          widget: 'text',
          labelWidth: '50px',
          label: '/天',
          style: {
            width: '0',
            display: 'block'
          }
        },
        d11: {
          text: '排除店铺',
          style: labelStyle,

          widget: 'text'
        },
        d12: {
          label: ' ',
          labelWidth: '30px',
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
      value: { siteId: this.siteId }
    }
  },
  created() {
    this.getInfo()
  },
  methods: {
    validate() {
      return Promise.all([this.$refs.form].map(e => e.validate()))
    },
    getInfo() {
      this.$api[`ss/sellingLibConfigInfo`](this.storeInfo).then(data => {
        this.value = {
          siteId: this.siteId,
          ...data.data,
          excludeSellerList: (data.data.excludeSellerList || []).join('\n')
        }
      })
    },
    _submit() {
      return this.validate().then(() => {
        let { excludeSellerList } = this.value
        excludeSellerList &&
          (excludeSellerList = excludeSellerList.split(/[\n|\r\n]/).map(e => e.trim()))
        let params = {
          platformId: this.storeInfo.platformId,
          ...this.value,
          excludeSellerList
        }
        return this.$api[`ss/sellingLibSaveConfig`](params)
      })
    }
  }
}
</script>