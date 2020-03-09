<template>
  <ElForm :disabled="disabled" ref="form1" :model="data" size="small" label-width="90px" label-position="left">
    <ElFormItem label="优化方式" prop="seoType" :rules="[{ required: true, message: '请选择优化方式' }]">
      <ElSelect v-model="data.seoType" @change="handlerSeoChange">
        <ElOption v-for="(item, index) in seoTypes" :key="index" :label="item.label" :value="item.value"></ElOption>
      </ElSelect>
    </ElFormItem>
    <!-- 每日 -->
    <template v-if="!data.seoType">
      <Form :disabled="disabled" :title="labelName" :data="data" :strategyDetail="data.strategyDetail" ref="form2"/>
    </template>
    <!-- 周一到周日 -->
    <template v-else>
      <ElTabs type="card" v-model="activeName">
        <ElTabPane v-for="(item, index) in weeks" :label="item.label" :name="item.name" :key="index">
          <Form
            :disabled="disabled"
            :title="labelName"
            :data="item.data"
            :weekDay="+item.name"
            :strategyDetail="item.data.strategyDetail"
            ref="form3"
          />
        </ElTabPane>
      </ElTabs>
    </template>
  </ElForm>
</template>

<script>
import Form from './priceRulesItem/form.vue'
export default {
  props: ['params'],
  components: {
    Form
  },
  data() {
    return {
      disabled: false,
      loading: false,
      activeName: '1',
      weeks: [
        {
          label: '周一',
          name: '1'
        },
        {
          label: '周二',
          name: '2'
        },
        {
          label: '周三',
          name: '3'
        },
        {
          label: '周四',
          name: '4'
        },
        {
          label: '周五',
          name: '5'
        },
        {
          label: '周六',
          name: '6'
        },
        {
          label: '周日',
          name: '0'
        }
      ],
      seoTypes: [
        {
          label: '每日',
          value: 0
        },
        {
          label: '周一到周日',
          value: 1
        }
      ],
      data: {
        strategyDetail: [
          {
            hourStart: null,
            hourEnd: null
          }
        ]
      }
    }
  },
  computed: {
    labelName() {
      return '价格($)'
    },
	weekIndex(){
		let num = 0
		switch(parseInt(this.activeName)){
			case 1:
				num = 0
			break;
			case 2:
				num = 1
			break;
			case 3:
				num = 2
			break;
			case 4:
				num = 3
			break;
			case 5:
				num = 4
			break;
			case 6:
				num = 5
			break;
			case 0:
				num = 6
			break;
		}
		return num
	}
  },
  created() {
    let _weeks = this.weeks.map(el => ({
      ...el,
      data: {
        strategyDetail: [
          {
            weekDay: +el.name,
            hourStart: null,
            hourEnd: null
          }
        ]
      }
    }))
    this.weeks = _weeks
  },
  methods: {
    handlerSeoChange(val) {
      if (!val) {
        this.data.strategyDetail = [
          {
            hourStart: null,
            hourEnd: null
          }
        ]
      } else {
        this.weeks.forEach(el => {
          el.data.strategyDetail = [
            {
              hourStart: null,
              weekDay: +el.name,
              hourEnd: null
            }
          ]
        })
        this.activeName = '1'
      }
    },
    _initData() {
      // console.log(123132);
      if (this.params && this.params.view) {
        this.disabled = true
      }
      if (this.params && this.params.edit) {
        let originShow = false
        // 编辑数据
        // 如果只有一条，回显， 否则不操作
        // 如果判断没有策略，则回显原预算
        if (Array.isArray(this.params.row)) {
          if (
            this.params.row.length === 1 &&
            this.params.row[0].status === -1
          ) {
            originShow = true
          }
        } else {
          if (this.params.row.status === -1) {
            originShow = true
            if (this.params.view) {
              return
            }
          } else {
            this.getEditData(originShow)
          }
        }

        if (this.params.row.length === 1) {
          this.getEditData(originShow)
        }
      }
    },

    // 设置weekday的值
    setWeekDay(strategyDetail, save) {
      strategyDetail = JSON.parse(JSON.stringify(strategyDetail))
      let getTime = time => {
        if (time < 10) {
          return `0${time}: 00`
        } else {
          return `${time}: 00`
        }
      }
      strategyDetail.forEach(el => {
        el.hourStart = save ? parseInt(el.hourStart) : getTime(el.hourStart)
        el.hourEnd = save ? parseInt(el.hourEnd) : getTime(el.hourEnd)
      })
      return strategyDetail
    },

    getEditData(originShow) {
      this.$api[`adManualStrategyInfo`]({})
        .then(data => {
          let { seoType, strategyDetail } = data.data
          if (!strategyDetail) {
            return
          }
          strategyDetail = data.data.strategyDetail = this.setWeekDay(
            strategyDetail
          )

          // 分出stragy
          if (seoType) {
            strategyDetail.forEach(de => {
              let { weekDay } = de
              let el = this.weeks.find(el => el.name == weekDay)
              if (el) {
                if (el.data.strategyDetail[0].hourStart == null) {
                  el.data.strategyDetail = []
                }
                el.data.strategyDetail.push(de)
              }
            })
          }

          this.data = data.data
        })
        .catch(e => {
          console.error(e)
        })
    },
    validateFn() {
      let { form1, form2, form3 = [] } = this.$refs
      let forms = [form1, form2, ...form3].filter(el => el != null)
      return Promise.all(forms.map(form => form.validate()))
        .then(() => {
          let strategyDetail = [],
            { strategyDetail: _strategyDetail, ...info } = this.data
          if (!info.seoType) {
            strategyDetail.push(..._strategyDetail)
          } else {
            this.weeks.forEach((el, index) => {
              if (this.$refs.form3[index].valid) {
                let { strategyDetail: __strategyDetail } = el.data
                strategyDetail.push(...__strategyDetail)
              }
            })
          }
		  let onceType = this.setWeekDay(strategyDetail, 1).some((e)=>{
		  		return e.hourEnd && e.hourStart && e.price
		  })
		  if(this.data.seoType === 1 && !onceType) return this.$refs.form3[this.weekIndex].validateItem()
		  return Promise.resolve({strategyType:this.data.seoType,strategyDetail:this.setWeekDay(strategyDetail, 1)})
        })
        .catch(weekDay => {
          if (weekDay) {
            this.activeName = weekDay + ''
          }
		  return Promise.reject()
        })
    }
  }
}
</script>

<style>
</style>
