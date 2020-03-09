<template>
  <div>
    <ElForm :model="data" ref="form" size="small" label-width="100px">
    <ElRow>
      <ElCol :span="12">
        <ElFormItem label="人群名称" prop="crowdName" :rules="[{ required: true, message: '请输入人群名称' }]">
          <ElInput v-model="data.crowdName"></ElInput>
        </ElFormItem>
      </ElCol>
      <ElCol :span="12">
        <ElFormItem label="习惯名称" prop="habitId" :rules="[{ required: true, message: '请选择习惯名称' }]">
          <div class="flex">
            <el-select v-model="data.habitId" placeholder style="width:100%">
              <el-option
                v-for="item in habitDropdownList"
                :key="item.habitId"
                :label="item.habitName"
                :value="item.habitId"
              ></el-option>
            </el-select>
            <el-button style="margin-left:10px" type="text" @click="openHabit">新增习惯</el-button>
          </div>
        </ElFormItem>
      </ElCol>
    </ElRow>

    <ElFormItem label="备注">
      <ElInput type="textarea" :rows="4" v-model="data.remark"></ElInput>
    </ElFormItem>
    <div>
      <h4 class="title">人群属性</h4>
    </div>
    <div class="box">
      <ElRow type="flex" :gutter="12" v-for="(item, index) in list" :key="index">
        <ElCol :span="24">
          <ElFormItem :label="item.crowdPropertyName">
            <ElRadioGroup class="custom-radio" v-model="data.crowdPropertyValueRelArray[index]">
              <ElRadio :label="null">任意</ElRadio>
              <ElRadio
                v-for="i in item.crowdPropertyValueArray"
                :label="i.crowdPropertyValueId"
                :key="i.crowdPropertyValueId"
              >{{i.value}}</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
    </div>
  </ElForm>
  <yt-dialog :events="events" :options='options'>
    <AddHabit ref="habit" />
  </yt-dialog>
  </div>
  
</template>

<script>
import AddHabit from 'Views/AccountManagement/Habit/components/add.vue';
export default {
  components: {
    AddHabit
  },
  data() {
    let vm = this
    return {
      events: {
        handleOkClick() {
          let api =`main/habitSave`

          return vm.$refs.habit.validate().then(() => {
            let data = vm.$refs.habit.formData
            let habitConstActiveTimeArray = vm.$refs.habit.$refs.time.formData.list
            habitConstActiveTimeArray = habitConstActiveTimeArray.map(el => ({time: el.time.join(), week: el.week.join()}))
            return vm.$api[api]({...data, habitConstActiveTimeArray})
              .then(data => {
                vm.options.visible = false
                vm.getHabitDropdownList()
              })
              .catch(err => {})
          }).catch(() => {
            vm.$message.warning('请输入必填项')
            return Promise.reject()
          })
        },
        handleOpen() {
          vm.$nextTick(() => {
            vm.$refs.habit.reset()
            vm.$refs.habit.getAddData()
          })
        }
      },
      options: {
        visible: false,
        title: '新增习惯',
        width: '70%',
        appendToBody: true,
        okBtnText: '确认',
        cancelBtnText: '取消',
      },
      list: [],
      habitDropdownList: [],
      flag: false,
      data: {
        crowdName: null,
        remark: null,
        habitId: null,
        crowdPropertyValueRelArray: []
      }
    }
  },
  // created() {
  //   this.getCrowdPropertyList()
  //   this.getHabitDropdownList()
  // },
  methods: {
    openHabit() {
      this.options.visible = true
    },
    validate() {
      return this.$refs.form.validate()
    },
    clear() {
      Object.assign(this.$data, this.$options.data())
      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    init() {
      this.getCrowdPropertyList()
      this.getHabitDropdownList()
    },
    getCrowdPropertyList() {
      if (this.flag) {
        return
      }
      this.flag = true
      this.$api[`main/crowdPropertyDropdownList`]({})
        .then(data => {
          this.flag = false
          this.list = data
          this.data.crowdPropertyValueRelArray = Array.of.apply(
            null,
            data.map(el => null)
          )
          if (this._setData) {
            this._setData()
          }
        })
        .catch(err => {})
    },
    getHabitDropdownList() {
      this.$api[`main/habitDropdownList`]({})
        .then(data => {
          this.habitDropdownList = data
        })
        .catch(err => {})
    },
    setData(data) {
      if (data === true) {
        this.data = {
          crowdName: null,
          remark: null,
          habitId: null,
          crowdPropertyValueRelArray: []
        }
        return
      }
      // debugger
      if (this.flag) {
        this._setData = () => {
          this.list.forEach((el, index) => {
            let e = data.crowdPropertyValueRelArray[index]
            if (e == null) {
              data.crowdPropertyValueRelArray[index] = null
            }
          })
          this.data = Object.assign({}, this.data, data)
          this.$nextTick(() => {
            this.$refs.form.clearValidate()
          })
          this._setData = null
        }
      } else {
        this.list.forEach((el, index) => {
          let e = data.crowdPropertyValueRelArray[index]
          if (e == null) {
            data.crowdPropertyValueRelArray[index] = null
          }
        })
        this.data = Object.assign({}, this.data, data)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.box {
  background: #f2f2f2;
  padding: 20px 0 0;
}
</style>
