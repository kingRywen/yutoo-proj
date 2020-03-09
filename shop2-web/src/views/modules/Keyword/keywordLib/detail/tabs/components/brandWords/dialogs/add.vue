<template>
  <div>
    <addTasks :defaultList="defaultList" :addOptions="addOptions" @clearInput="clearInput" ref="child">
      <div slot="leftContent">
        <el-form :model="formData" ref="formData">
          <el-form-item label="类型" prop="brandType" :rules="[{required:true,message:'请选择品牌词类型'}]">
            <el-radio-group v-model="formData.brandType">
              <el-radio
                :label="item.value"
                v-for="(item, index) in $const['KEYWORD/brandType']"
                :key="item.value"
              >{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-input v-model="formData.keyword" placeholder="多个换行输入关键词，最多限制200个..." type="textarea" rows="5"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </addTasks>
  </div>
</template>

<script>
import addTasks from 'Views/common/dialog/addTasks.vue'
export default {
  props: ['categoryId', 'productId', 'brandType'],
  data() {
    return {
      defaultList: [],
      //传给子组件参数
      addOptions: {
        num: 200,
        rightTitle: '关键词', //右侧表格标题
        regText: this.$const['OTHER/keywordExp'] //验证规则,现在是逐个验证;
      },
      formData: {
        brandType: this.brandType
      }
    }
  },
  created() {
    // this.taskId && this.getInfo()
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
    validateFn() {
      return this.$refs.formData.validate()
    },
    _submit() {
      return this.validateFn().then(() => {
        let [...childData] = this.$refs.child.formList
        if (childData && childData.length == 0) {
          this.$message.warning('请添加关键词!')
          return
        }

        let params = {
          ...this.storeInfo,
          categoryId: this.categoryId,
          brandType: this.formData.brandType,
          brandNames: childData
        }
        return this.$api['keyword/keywordLibBrandSave'](params)
      })
    }
  },
  components: {
    addTasks
  }
}
</script>

<style>
</style>
