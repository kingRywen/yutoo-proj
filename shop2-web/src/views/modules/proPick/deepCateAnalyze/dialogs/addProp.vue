

<template>
  <div>
    <addTasks :defaultList="defaultList" :addOptions="addOptions" @clearInput="clearInput" ref="child">
      <div slot="leftContent">
        <el-form :model="formData" ref="formData">
          <el-form-item prop="keyword">
            <el-input v-model="formData.keyword" placeholder="多个换行输入属性名称，最多限制200个..." type="textarea" rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </addTasks>
  </div>
</template>

<script>
import addTasks from 'Views/common/dialog/addTasks.vue'
export default {
  props: {
    select: {
      default: () => [],
      type: Array
    },
    merchantTaskId: Number
  },
  computed: {
    defaultList() {
      return this.select.map(e => e.attrKey)
    }
  },
  data() {
    return {
      //传给子组件参数
      addOptions: {
        num: 200,
        rightTitle: '属性名称', //右侧表格标题
        regText: this.$const['OTHER/keywordExp'] //验证规则,现在是逐个验证;
      },
      formData: {
        dataType: 0,
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
      let ret = []
      let [...childData] = this.$refs.child.formList
      if (this.formData.dataType == 0 && childData && childData.length == 0)
        return this.$message.warning('请添加属性名称!')

      childData.forEach(e => {
        const el = this.select.find(k => k.attrKey == e)
        if (el) {
          ret.push(el)
        } else {
          ret.push({
            attrKey: e,
            attrValues: []
          })
        }
      })
      let params = {
        ...this.storeInfo,
        merchantTaskId: this.merchantTaskId,
        attrKeys: ret.map(el => el.attrKey)
      }
      return this.$refs.formData
        .validate()
        .then(() =>
          this.$api['proPick/categoryDepthTaskMerchantSaveAttr'](params)
        )
    }
  },
  components: {
    addTasks
  }
}
</script>

<style>
</style>
