<template>
  <ElForm :disabled="disabled" ref="form" style="flex: 1" size="small" :model="data" label-width="90px">
    <div v-for="(item, index) in strategyDetail" class="flex" style="align-items: self-start;">
      <ElFormItem label="时间段">
        <div class="flex"  style="align-items: self-start;">
          <ElFormItem
            label-width="0"
            :prop="`strategyDetail.${index}.hourStart`"
            :rules="timeRule('start', item, index)"
          >
            <el-time-select
              style="width:130px"
              placeholder="起始时间"
              v-model="item.hourStart"
              :picker-options="{start: '01:00',step: '01:00',end: '24:00', minTime: index === 0 ? undefined : getMinTime(data.strategyDetail[index - 1].hourEnd)}"
            ></el-time-select>
          </ElFormItem>
          <span class="ml10 mr10">~</span>
          <ElFormItem label-width="0" :prop="`strategyDetail.${index}.hourEnd`" :rules="timeRule('end', item, index)">
            <el-time-select
              placeholder="结束时间"
              style="width:130px"
              v-model="item.hourEnd"
              :picker-options="{start: '01:00',step: '01:00',end: '24:00', minTime: item.hourStart}"
            ></el-time-select>
          </ElFormItem>
        </div>
      </ElFormItem>
      <ElFormItem
        :label="title"
        label-width="100px"
        class="custom-label-right"
        :prop="`strategyDetail.${index}.price`"
        :rules="[{ required: true, message: `请输入${title}` }]"
      >
        <ElInputNumber v-model="item.price" :min="1" :precision="2" :max="9999999999" :controls="false"></ElInputNumber>
      </ElFormItem>
      <div class="ml10" v-if="!disabled">
        <ElButton @click="addItem(index)" size="small" type="plain" icon="el-icon-plus" plain></ElButton>
        <ElButton @click="delItem(index)" v-if="strategyDetail.length > 1" size="small" type="danger" icon="el-icon-delete" plain></ElButton>
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
    title: String,
    data: {
      default: () => ({
        strategyDetail: [
          {
            hourStart: null,
            hourEnd: null
          }
        ]
      })
    },
    strategyDetail: Array,
    weekDay: Number
  },
  data() {
    return {
      valid: false
    }
  },
  methods: {
	validateItem(){
		return this.$refs.form.validate()
	},
    validate() {
      this.valid = false
      if (this.weekDay != null) {
        if (this.strategyDetail.length === 1) {
          let { price, hourEnd, hourStart } = this.strategyDetail[0]
          if (price == null && hourEnd == null && hourStart == null) {
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
          cb(new Error('时间不能为空'))
        }
        if (type === 'start') {
          if (parseInt(value) > parseInt(item.hourEnd)) {
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
      this.data.strategyDetail.splice(index + 1, 0, el)
    },
    delItem(index) {
      this.data.strategyDetail.splice(index, 1)
    }
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
