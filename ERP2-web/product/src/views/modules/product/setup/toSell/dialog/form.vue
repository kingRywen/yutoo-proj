<template>
  <ElForm :disabled="disabled" ref="form" style="flex: 1;width:100%" size="small" :model="data" label-width="90px">
    <div v-for="(item, index) in strategyList" class="flex" style="width: 100%;">
      <ElFormItem label="时间段" style="width:86.5%">
        <div  style="width: 100%;display: flex;">
          <ElFormItem
            label-width="0"
            :prop="`strategyList.${index}.hourStart`"
            :rules="timeRule('start', item, index)"
			style="width: 100%;"
          >
            <el-time-select
              style="width: 100%;"
              placeholder="起始时间"
              v-model="item.hourStart"
              :picker-options="{start: '00:00',step: '01:00',end: '23:00', minTime: index === 0 ? undefined : getMinTime(data.strategyList[index - 1].hourEnd)}"
            ></el-time-select>
          </ElFormItem>&nbsp;
          <ElFormItem style="width: 100%;"  label="~" label-width="14px" :prop="`strategyList.${index}.hourEnd`" :rules="timeRule('end', item, index)">
            <el-time-select
              placeholder="结束时间"
               style="width: 100%;"
              v-model="item.hourEnd"
              :picker-options="{start: '01:00',step: '01:00',end: '24:00', minTime: item.hourStart}"
            ></el-time-select>
          </ElFormItem>
		  
        </div>
		
      </ElFormItem>	  
      <div class="ml10" v-if="!disabled" style="margin-top: -36px;">
        <ElButton @click="addItem(index)" size="small" type="plain" icon="el-icon-plus" plain></ElButton>
        <ElButton @click="delItem(index)" v-if="strategyList.length > 1" size="small" type="danger" icon="el-icon-delete" plain></ElButton>
      </div>
    </div>
  </ElForm>
</template>

<script>
export default {
  props: {
    disabled: {
      default: false
    },
    data: {
      default: () => ({
        strategyList: [
          {
            hourStart: null,
            hourEnd: null
          }
        ]
      })
    },
    strategyList: Array,
    weekDay: Number
  },
  data() {
    return {
      valid: false,
    }
  },
  mounted(){
	this.$nextTick(()=>{

	})  
  },
  methods: {
	validateItem(){
		return this.$refs.form.validate()
	},
    validate() {
      this.valid = false
      if (this.weekDay != null) {
        if (this.strategyList.length === 1) {
          let { bid, hourEnd, hourStart,bidPct } = this.strategyList[0]
          if (hourEnd == null && hourStart == null) {
			return Promise.resolve()										   
          } else {
            return this.$refs.form
              .validate()
              .then(() => {
                this.valid = true
              })
              .catch(() => {
                return Promise.reject(this.weekDay)
              })
          }
        }
      }
      return this.$refs.form
        .validate()
        .then(() => {
          this.valid = true
        })
        .catch(() => {
          return Promise.reject(this.weekDay)
        })
    },
    timeRule(type, item, index) {
      let checkTime = (rule, value, cb) => {
        if (!value || value === '') {
          if(  this.strategyList[index].hourStart === null &&  this.strategyList[index].hourEnd){
            return cb(new Error('开始时间不能大于结束时间'))
          }
          cb(new Error('时间不能为空'))
        }
        if (type === 'start') {
          if (parseInt(value) > parseInt(item.hourEnd)) {
            this.strategyList[index].hourStart = null
            cb(new Error('开始时间不能大于结束时间'))
          }
        }
        cb()
      }
      return [
        {
          validator: checkTime
        }
      ]
    },
    getMinTime(time) {
      time = parseInt(time) - 1
      if (time < 10) {
        return `0${time}: 00`
      } else {
        return `${time}: 00`
      }
    },
    addItem(index) {
      let el = {
        hourStart: null,
        hourEnd: null
      }
      if (this.weekDay != null) {
        el.weekDay = this.weekDay
      }
      this.data.strategyList.splice(index + 1, 0, el)
    },
    delItem(index) {
      this.data.strategyList.splice(index, 1)
    },
  }
}
</script>

<style lang='scss' scoped>
/deep/.custom-label-right {
  /deep/.el-form-item__label {
    text-align: right;
  }
}
</style>
