<template>
  <div>
    <addTasks :addOptions="addOptions" @clearInput="clearInput" ref="child">
      <div slot="leftContent">
        <el-form :model="formData" ref="formData">
          <el-form-item prop="keyword">
            <el-input v-model="formData.keyword" placeholder="多个换行输入ASIN，最多限制500个..." type="textarea" rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </addTasks>
  </div>
</template>

<script>
import addTasks from 'Views/common/dialog/addTasks.vue'
export default {
  data() {
    return {
      //传给子组件参数
      addOptions: {
        num: 500,
        rightTitle: 'ASIN', //右侧表格标题
        regText: this.$const['OTHER/asinExp'] //验证规则,现在是逐个验证;
      },
      formData: {
        keyword: null
      }
    }
  },
  methods: {
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
    _submit() {
      let [...childData] = this.$refs.child.formList
      if (childData && childData.length == 0)
        return this.$message.warning('请添加ASIN!')
      let params = {
        ...this.storeInfo,
        asins: childData
      }
      return this.$api['productAnalysis/paSaveTask'](params)
    }
  },
  components: {
    addTasks
  }
}
</script>

<style>
</style>
