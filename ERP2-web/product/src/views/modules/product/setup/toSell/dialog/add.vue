<template>
  <ElForm :disabled="disabled" ref="form1" :model="data" size="small" label-width="90px" label-position="right">   
    <ElFormItem label="策略名称" prop="strategyName" :rules="[{ required: true, message: '请输入策略名称',trigger:'blur' }]">
      <ElInput v-model.trim="data.strategyName" style="width: 95%;" ></ElInput>
    </ElFormItem>
	<ElFormItem label="优化类型" prop="strategyType" :rules="[{ required: true, message: '请选择优化类型' }]">
	  <ElSelect v-model="data.strategyType" @change="handlerSeoChange"  style="width: 95%;" >
	    <ElOption v-for="(item, index) in strategyTypes" :key="index" :label="item.label" :value="item.value"></ElOption>
	  </ElSelect>
	</ElFormItem> 
    <!-- 每日 -->
    <template v-if="!data.strategyType">
      <Form :disabled="disabled" :data="data" :strategyList="data.strategyList" ref="form2"/>
    </template>
    <!-- 周一到周日 -->
    <template v-else>
      <ElTabs type="card" v-model="activeName">
        <ElTabPane v-for="(item, index) in weeks" :label="item.label" :name="item.name" :key="index">
          <Form
            :disabled="disabled"
            :data="item.data"
            :weekDay="+item.name"
            :strategyList="item.data.strategyList"
            ref="form3"
          />
        </ElTabPane>
      </ElTabs>
    </template>
    <ElFormItem label="是否激活" prop="pauseFlag">
      <ElSwitch v-model="data.pauseFlag" :active-value="1" :inactive-value="0"></ElSwitch>
    </ElFormItem>
  </ElForm>
</template>

<script>
import Form from './form'
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
      strategyTypes: [
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
		strategyType:0,
        strategyList: [
          {
            hourStart: null,
            hourEnd: null
          }
        ]
      }
    }
  },
  computed: {
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
        strategyList: [
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
        this.data.strategyList = [
          {
            hourStart: null,
            hourEnd: null
          }
        ]
      } else {
        this.weeks.forEach(el => {
          el.data.strategyList = [
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
      if (this.params && this.params.view) {
        this.disabled = true
      }
      if (this.params && this.params.edit) {
        if (Array.isArray(this.params.row)) {
          if (
            this.params.row.length === 1 &&
            this.params.row[0].pauseFlag === -1
          ) {
          }
        } else {
          if (this.params.row.pauseFlag === -1) {
            if (this.params.view) {
              return
            }
          } else {
            this.getEditData()
          }
        }
        if (this.params.row.length === 1) {
          this.getEditData()
        }
      }
    },

    // 设置weekday的值
    setWeekDay(strategyList, save) {
      strategyList = JSON.parse(JSON.stringify(strategyList))
      let getTime = time => {
        if (time < 10) {
          return `0${time}: 00`
        } else {
          return `${time}: 00`
        }
      }	  	  
      strategyList.forEach(el => {
        el.hourStart = save ? parseInt(el.hourStart) : getTime(el.hourStart)
        el.hourEnd = save ? parseInt(el.hourEnd) : getTime(el.hourEnd)
      })	    	  
      return strategyList
    },
    getEditData() {
      // debugger
      this.$api[`product/prSellStrategyAmzInfo`]({strategyId : this.params.strategyId})
        .then(data => {
          let { strategyType, strategyList } = data.rows
          if (!strategyList) {
            return
          }
          strategyList = data.rows.strategyList = this.setWeekDay(
            strategyList
          )

          // 分出stragy
          if (strategyType) {
            strategyList.forEach(de => {
              let { weekDay } = de
              let el = this.weeks.find(el => el.name == weekDay)
              if (el) {
                if (el.data.strategyList[0].hourStart == null) {
                  el.data.strategyList = []
                }
                el.data.strategyList.push(de)
              }
            })
			this.$nextTick(()=>{
				this.activeName = strategyList[0].weekDay
			})
          }
		  if(this.params.copyAdd) data.rows.strategyName = null
          this.data = data.rows	  
        })
        .catch(e => {
          console.error(e)
        })
    },
    _submit() {
      let { form1, form2, form3 = [] } = this.$refs
      let forms = [form1, form2, ...form3].filter(el => el != null)
      return Promise.all(forms.map(form => form.validate()))
        .then(() => {
          let strategyList = [],
            { strategyList: _strategyList, ...info } = this.data,
            params = {
              ...info
            }
          if (!info.strategyType) {
            strategyList.push(..._strategyList)
          } else {
            this.weeks.forEach((el, index) => {
              if (this.$refs.form3[index].valid) {
                let { strategyList: __strategyList } = el.data
                strategyList.push(...__strategyList)
              }
            })
          }
		  let onceType = this.setWeekDay(strategyList, 1).some((e)=>{
			  return e.hourEnd && e.hourStart
		  })
		  if(this.data.strategyType === 1 && !onceType) return this.$refs.form3[this.weekIndex].validateItem()
		  if(this.params && this.params.edit && !this.params.copyAdd){
			  params.strategyId = this.params.strategyId
			  params.pauseFlag = this.data.pauseFlag
		  }
		  if(this.params.copyAdd) delete params.strategyId
          return this.$api[
            this.params && this.params.edit && !this.params.copyAdd
              ? `product/prSellStrategyAmzUpdate`
              : `product/prSellStrategyAmzSave`
          ]({ ...params, strategyList: this.setWeekDay(strategyList, 1) })
        })
        .catch(weekDay => {
          if (weekDay) {
            this.activeName = weekDay + ''
          }
        })
    },
  }
}
</script>
