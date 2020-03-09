<template>
  <div>
    <addTasks :defaultList="defaultList" :addOptions="addOptions" @clearInput="clearInput" ref="child">
      <div slot="leftContent">
        <el-form :model="formData" ref="formData">
          <el-form-item label="添加来源" prop="origin" :rules="[{required:true,message:'请选择添加来源'}]">
            <el-select ref="sel" class="w100" v-model="formData.origin" placeholder="请选择添加来源">
              <el-option
                v-for="(item, index) in $const['KEYWORD/relatedSource']"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="type !== 'unfilter'"
            label="添加类型"
            prop="keywordType"
            :rules="[{required:true,message:'请选择添加类型'}]"
          >
            <el-select ref="sel" class="w100" v-model="formData.keywordType" placeholder="请选择添加类型">
              <el-option
                v-for="(item, index) in $const['KEYWORD/releteTypeOptions']"
                :key="index"
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
import relatedMixin from '../../mixin'
export default {
  mixins: [relatedMixin],
  props: [
    'categoryId',
    'productId',
    'origin',
    'keywordType',
    'type',
    'callback'
  ],
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
        origin: this.origin,
        keywordType: this.keywordType
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
          relatedId: this.relatedId,
          categoryId: this.categoryId,
          categoryFlag: this.categoryFlag,
          origin: this.formData.origin,
          keywordType: this.formData.keywordType,
          keywordTexts: childData
        }
        return this.$api['keyword/keywordLibSaveKeyword'](params).then(data => {
          if (this.callback) {
            this.callback(data)
            return Promise.resolve('close')
          } else {
            return Promise.resolve(true)
          }
        })
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
