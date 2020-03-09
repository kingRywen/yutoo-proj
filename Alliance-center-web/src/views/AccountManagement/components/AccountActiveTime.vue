<template>
  <ElForm ref="form" :model="formData" size="small" label-width="0">
    <div class="box mb20" v-for="(time, index) in formData.list" :key="index">
      <div class="box-header mb20 flex-c">
        <ElFormItem style="flex:1" :prop="`list.${index}.week`" :rules="[{ required: true, message: '请选择星期' }]">
          <el-select
            multiple
            size="small"
            @visible-change="handleVisibleChange(time, index, $event)"
            v-model="time.week"
            style="width:100%"
            class="mr10"
          >
            <ElOption
              v-for="item in days"
              :key="item.value"
              :disabled="item.disabled"
              :label="item.label"
              :value="+item.value"
            ></ElOption>
          </el-select>
        </ElFormItem>
        <div style="flex: 0 0 80px; margin: 0 0 18px 10px">
          <el-button type="text" icon="el-icon-plus" @click="handle(time, index, true)"></el-button>
          <el-button v-if="formData.list.length > 1" type="text" icon="el-icon-minus" @click="handle(time, index)"></el-button>
        </div>
      </div>
      <div class="mar10">
        <el-checkbox
          :indeterminate="time.isIndeterminate"
          v-model="time.checkAll"
          @change="handleCheckAllChange($event, time)"
        >全选</el-checkbox>
      </div>
      <ElFormItem :prop="`list.${index}.time`" :rules="[{ required: true, message: '请选择时间段' }]">
        <div class="time-box">
          <ElCheckboxGroup ref="time" v-model="time.time" @change="handleCheckedChange($event, time)">
            <ElCheckbox v-for="item in timeList" :label="item.index" :key="item.index">{{item.time}}</ElCheckbox>
            <ElCheckbox v-for="i in currentNums" :key="i + 'a'" style="visibility: hidden">23:30:00 - 24:00:00</ElCheckbox>
          </ElCheckboxGroup>
        </div>
      </ElFormItem>
    </div>
  </ElForm>
</template>

<script>
import storage from 'Utils/saver'
export default {
  name: 'AccountActiveTime',
  props: ['list'],
  data() {
    return {
      currentNums: 1,
      isIndeterminate: false,
      checkAll: false,
      defaultData: {},
      timeList: [], // 时间选择
      days: [
        {
          label: '星期一',
          value: '1'
        },
        {
          label: '星期二',
          value: '2'
        },
        {
          label: '星期三',
          value: '3'
        },
        {
          label: '星期四',
          value: '4'
        },
        {
          label: '星期五',
          value: '5'
        },
        {
          label: '星期六',
          value: '6'
        },
        {
          label: '星期日',
          value: '7'
        }
      ],
      formData: {
        list: [
          {
            // accountActiveTimeId: null,
            isIndeterminate: false,
            checkAll: false,
            time: [],
            week: []
          }
        ]
      },
      addFields: [
        {
          label: '习惯名称',
          type: 'select',
          name: 'accountId',
          options: [
            {
              label: 1,
              value: 1
            }
          ]
        },
        {
          label: '习惯备注',
          name: 'remark',
          type: 'textarea',
          disabled: true,
          rows: 5
        }
      ]
    }
  },
  watch: {
    list: {
      deep: true,
      handler(val) {
        if (!val.length) {
          return
        }
        val.forEach(el => {
          let checkedCount = el.time.length
          el.checkAll = checkedCount === this.timeList.length
          el.isIndeterminate =
            checkedCount > 0 && checkedCount < this.timeList.length
        })
        this.formData.list = val
      }
    }
  },
  // mounted() {
  //   this.$nextTick(() => {
  //     this.getNums()
  //   })
  // },
  methods: {
    getNums() {
      const time = this.$refs.time[0].$el
      let rownum = Math.ceil(
        time.offsetWidth / time.firstElementChild.offsetWidth
      )
      this.currentNums = 24 % rownum
    },
    handleCheckAllChange(val, item) {
      item.time = val ? [...this.timeList.map(el => el.index)] : []
      item.isIndeterminate = false
    },
    handleCheckedChange(val, item) {
      let checkedCount = val.length
      item.checkAll = checkedCount === this.timeList.length
      item.isIndeterminate =
        checkedCount > 0 && checkedCount < this.timeList.length
    },
    clearData() {
      this.formData.list = [
        {
          isIndeterminate: false,
          checkAll: false,
          time: [],
          week: []
        }
      ]
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    handleVisibleChange(time, index, show) {
      if (show) {
        const selectedVal = [].concat(
          this.formData.list.reduce(
            (total, prev) => total.concat(prev.week),
            []
          )
        )
        this.days = this.days.map(el => ({
          ...el,
          disabled:
            selectedVal.indexOf(Number(el.value)) > -1 &&
            time.week.indexOf(Number(el.value)) === -1
        }))
      }
    },
    handle(time, index, add) {
      if (add) {
        this.formData.list.splice(index + 1, 0, {
          isIndeterminate: false,
          checkAll: false,
          time: [],
          week: []
        })
      } else {
        this.formData.list.splice(index, 1)
      }
    },
    validate() {
      return this.$refs.form.validate()
    },
    getTimeList() {
      let list = storage.get('session', 'timeList')
      if (list) {
        this.timeList = list
        this.$nextTick(() => this.getNums())
        return
      }
      return this.$api[`main/accountTimeList`]()
        .then(data => {
          storage.set('session', 'timeList', data)
          this.timeList = data
          this.$nextTick(() => this.getNums())
        })
        .catch(err => {})
    },
    getEditData(accountId) {
      this.$api[`main/accountActiveTime`]({ accountId })
        .then(data => {
          let { activeTimeArray, accountId } = data.rows
          if (activeTimeArray.length) {
            this.formData.list = activeTimeArray.map(el => {
              let checkedCount = el.time.length
              let checkAll = checkedCount === this.timeList.length
              let isIndeterminate =
                checkedCount > 0 && checkedCount < this.timeList.length
              return {
                checkAll,
                isIndeterminate,
                week: el.week,
                time: el.time.split(',').map(el => +el)
              }
            })
          }

          this.accountId = accountId
        })
        .catch(err => {})
    },
    getFormData() {
      return {
        accountId: this.accountId,
        activeTimeArray: this.formData.list.map(el => ({
          week: el.week,
          time: el.time.join(',')
        }))
      }
    },
    async init(accountId) {
      await this.getTimeList()
      if (accountId) {
        this.getEditData(accountId)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.box {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
}
</style>
<style lang="scss">
.time-box {
  .el-checkbox {
    margin: 10px;
    line-height: 1;
  }
  .el-checkbox + .el-checkbox {
    margin-left: 0;
    margin: 10px;
  }
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
}
</style>
