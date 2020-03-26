<template>
  <div class="w800 no-asterisk">
    <new-form ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
    <el-divider class="mt10" content-position="left">跟卖时间策略</el-divider>
    <h4>非跟卖时段</h4>
    <el-radio v-model="noSellingOp" v-for="item in ops" :label="item.value" :key="item.value">{{item.label}}</el-radio>
    <h4>跟卖时段</h4>
    <el-radio v-model="seoType" v-for="item in dayTypes" :label="item.value" :key="item.label">{{item.label}}</el-radio>
    <time-form ref="form1" v-if="seoType == 0" :formData="everyTime" />
    <div v-else>
      <div class="multi-array-item flex" v-for="(item, index) in someTimes">
        <time-form @changebox="changebox" :ref="`tform${index}`" :formData="item" :show-week="true" :weeks="weeks" />
        <el-button @click="addItem(index)" v-if="index == someTimes.length -1 && !allDisabled">+</el-button>
        <el-button @click="someTimes.splice(index, 1)" v-if="someTimes.length > 1">-</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import TimeForm from './time-form'
export default {
  props: ['strategyId'],
  components: {
    TimeForm
  },
  data() {
    return {
      noSellingOp: 0,
      weekMap: {
        周一: 1,
        周二: 2,
        周三: 3,
        周四: 4,
        周五: 5,
        周六: 6,
        周日: 0
      },
      seoType: 0,
      ops: [
        { label: '修改库存为0', value: 0 },
        { label: '直接删除SKU', value: 1 }
      ],
      dayTypes: [
        { label: '每日', value: 0 },
        { label: '周一到周日', value: 1 }
      ],
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
      someTimes: [
        {
          week: [],
          range: [
            {
              start: '',
              end: ''
            }
          ]
        }
      ],
      everyTime: {
        range: [
          {
            start: '',
            end: ''
          }
        ]
      },
      weeks: [
        {
          label: '周一',
          disabled: false,
          value: 1
        },
        {
          label: '周二',
          disabled: false,
          value: 1
        },
        {
          label: '周三',
          disabled: false,
          value: 1
        },
        {
          label: '周四',
          disabled: false,
          value: 1
        },
        {
          label: '周五',
          disabled: false,
          value: 1
        },
        {
          label: '周六',
          disabled: false,
          value: 1
        },
        {
          label: '周日',
          disabled: false,
          value: 1
        }
      ]
    }
  },
  computed: {
    allDisabled() {
      return this.weeks.every(e => e.disabled)
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
      this.$api[`ss/sellingStrategyInfoByTime`](params).then(data => {
        const {
          defaultFlag,
          strategyName,
          noSellingOp,
          seoType,
          seoDetail
        } = data.data
        this.value = {
          ...this.value,
          strategyName,
          defaultFlag: defaultFlag ? [1] : []
        }
        if (noSellingOp) {
          this.noSellingOp = noSellingOp
        }
        if (seoType) {
          this.seoType = seoType
        }
        if (seoType == 0) {
          this.everyTime.range = seoDetail
        } else {
          let obj = {},
            seoObj = {},
            weekMap = {}
          Object.entries(this.weekMap).forEach(([val, key]) => {
            weekMap[key] = val
          })
          seoDetail.forEach(e => {
            const { weekDay } = e
            if (!seoObj[weekDay]) {
              seoObj[weekDay] = []
            }
            seoObj[weekDay].push(e)
          })
          Object.keys(seoObj).forEach(k => {
            let d = seoObj[k]
            let key = '_',
              range = []

            d.sort((a, b) => a.sort - b.sort).forEach(e => {
              const { start, end } = e || {}
              key += start + end
              range.push({ start, end })
            })
            if (obj[key]) {
              obj[key].week.push(weekMap[k])
            } else {
              obj[key] = {
                week: [weekMap[k]],
                range
              }
            }
          })
          this.someTimes = Object.values(obj)
        }
      })
    },
    changebox() {
      let val = []
      this.someTimes.forEach(e => (val = val.concat(e.week)))
      this.weeks.forEach(e => {
        if (val.indexOf(e.label) > -1) {
          e.disabled = true
        } else {
          e.disabled = false
        }
      })
    },
    addItem(index) {
      if (!this.someTimes[index].week.length) {
        return this.$refs[`tform${index}`][0].$refs.form.validateField('week')
      }
      if (this.weeks.some(e => !e.disabled)) {
        this.someTimes.push({
          week: [],
          range: [
            {
              start: '',
              end: ''
            }
          ]
        })
      }
    },
    validate() {
      let forms = ['form']
      if (this.seoType == 0) {
        forms.push('form1')
      } else {
        forms = forms.concat(this.someTimes.map((e, index) => `tform${index}`))
      }
      let promises = forms.map(f =>
        f.indexOf('tform') == -1
          ? this.$refs[f].validate()
          : this.$refs[f][0].validate()
      )

      return Promise.all(promises)
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          ...this.storeInfo,
          siteId: this.$store.state.selling.curSiteId,
          ...this.value,
          defaultFlag: !!this.value.defaultFlag[0],
          noSellingOp: this.noSellingOp,
          seoType: this.seoType,
          strategyId: this.strategyId
        }
        if (this.seoType == 0) {
          Object.assign(params, {
            seoDetail: this.everyTime.range.map((e, index) => ({
              ...e,
              weekDay: -1,
              sort: index + 1
            }))
          })
        } else {
          let ret = [],
            weekMap = this.weekMap

          this.someTimes.map(e => {
            if (e.week) {
              e.week.map((w, index) => {
                e.range.map(j => {
                  ret.push({ ...j, sort: ++index, weekDay: weekMap[w] })
                })
              })
            }
          })
          Object.assign(params, { seoDetail: ret })
        }
        return this.$api[
          `ss/${
            this.strategyId
              ? 'sellingStrategyUpdateByTime'
              : 'sellingStrategySaveByTime'
          }`
        ](params)
      })
    }
  }
}
</script>
