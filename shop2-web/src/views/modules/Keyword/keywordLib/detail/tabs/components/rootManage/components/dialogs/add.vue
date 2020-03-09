<template>
  <div>
    <addTasks :defaultList="defaultList" :addOptions="addOptions" @clearInput="clearInput" ref="child">
      <div slot="leftContent">
        <el-form :model="formData" ref="formData">
          <el-form-item
            v-if="rootType == 'INVALID'"
            label="无效类型"
            prop="rootType"
            :rules="[{required:true,message:'请选择无效类型'}]"
          >
            <el-select ref="sel" class="w100" v-model="formData.rootType" placeholder="请选择无效类型">
              <el-option
                v-for="(item, index) in $const['KEYWORD/invalidTypeOp']"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
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
  props: ['categoryId', 'rootType'],
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
        keyword: null
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
          rootType: this.rootType == 'VALID' ? 'VALID' : this.formData.rootType,
          rootTexts: childData
        }
        return this.$api['keyword/keywordLibRootSave'](params)
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
