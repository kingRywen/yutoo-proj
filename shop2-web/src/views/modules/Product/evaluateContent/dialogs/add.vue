<template>
  <div>
    <addTasks v-if="show" :defaultList="defaultList" :addOptions="addOptions" @clearInput="clearInput" ref="child">
      <div slot="leftContent">
        <el-form :model="formData" ref="formData">
          <el-form-item label="任务名称" :rules="[{required:true,message:'请输入任务名称'}]">
            <el-input v-model="formData.taskName"></el-input>
          </el-form-item>
          <el-form-item prop="keyword" :rules="[{required:true,message:'请输入关键词'}]">
            <el-input v-model="formData.keyword" placeholder="多个换行输入ASIN，最多限制200个..." type="textarea" rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </addTasks>
  </div>
</template>

<script>
import addTasks from 'Views/common/dialog/addTasks.vue'

export default {
  props: ['taskId', 'info'],
  data() {
    return {
      show: !this.taskId,
      defaultList: [],
      //传给子组件参数
      addOptions: {
        num: 200,
        rightTitle: 'ASIN', //右侧表格标题
        regText: this.$const['OTHER/asinExp'] //验证规则,现在是逐个验证;
      },
      formData: {
        taskName: this.taskId ? null : this.cfuns.geRandomNum(),
        keyword: null
      }
    }
  },
  created() {
    this.taskId && this.getInfo()
  },
  methods: {
    getInfo() {
      this.$api[`productAnalysis/rcAsinList`]({
        taskId: this.taskId,
        ...this.storeInfo
      }).then(data => {
        this.defaultList = data.data ? data.data.map(el => el.asin) : []
        this.show = true
        this.formData = { ...this.info }
      })
    },
    //判断是否需要清空input,如果全部验证通过需要清空input,反之则留下未验证通过的;
    clearInput(data) {
      if (data) {
        this.formData.keyword = data
      } else {
        this.formData.keyword = null
        this.$nextTick(() => {
          this.$refs.formData.clearValidate()
        })
      }
    },
    validateFn() {
      return this.$refs.formData.validate()
    },
    _submit() {
      let [...childData] = this.$refs.child.formList
      if (childData && childData.length == 0)
        return this.$message.warning('请添加ASIN!')
      let params = {
        ...this.storeInfo,
        taskName: this.formData.taskName,
        asins: childData
      }
      return this.$api['productAnalysis/rcSaveTask'](params)
    }
  },
  components: {
    addTasks
  }
}
</script>

<style>
</style>
