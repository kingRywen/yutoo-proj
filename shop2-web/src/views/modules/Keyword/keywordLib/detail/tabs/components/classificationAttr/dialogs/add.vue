<template>
  <div>
    <addTasks :defaultList="defaultList" :addOptions="addOptions" @clearInput="clearInput" ref="child">
      <div slot="leftContent">
        <new-form v-if="!classifyId" ref="form" label-width="120px" :form-schema="formSchema" :value="value"></new-form>
        <el-form :model="formData" ref="formData">
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
  props: ['query', 'info', 'type', 'categoryId', 'classifyName', 'classifyId'],
  data() {
    return {
      formSchema: {
        classifyName: {
          required: true,
          widget: 'autocomplete',
          placeholder: '请选择或自定义输入分类名称',
          asyncSearch: true,
          lazy: true,
          options: searchText => this.getCateNames({ searchText })
        }
      },
      value: {},

      defaultList: [],
      pageSize: 10,
      pageNumber: 1,
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
    getCateNames(params = {}) {
      return this.$api[`keyword/keywordLibClassifyList`](
        {
          ...this.storeInfo,
          ...params,
          categoryId: this.categoryId,
          ...this.query,
          pageNumber: 1,
          pageSize: 10000000
        },
        { singleLoading: true }
      ).then(
        data =>
          (this._select = data.rows.map(e => ({ value: e.classifyName, ...e })))
      )
    },
    getInfo() {
      this.$api[`keyword/rcAsinList`]({
        ...this.storeInfo
      }).then(data => {
        this.defaultList = data.data ? data.data.map(el => el.asin) : []
        // this.show = true
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
      let promises = [this.$refs.formData.validate()]
      if (!this.classifyId) {
        promises.push(this.$refs.form.validate())
      }
      return Promise.all(promises)
    },
    _submit() {
      return this.validateFn().then(() => {
        let isExistCate =
          !this.classifyId &&
          this._select.find(e => e.value === this.value.classifyName)
        let [...childData] = this.$refs.child.formList
        if (childData && childData.length == 0) {
          this.$message.warning('请添加关键词!')
          return
        }

        let params = {
          categoryId: this.categoryId,
          ...this.storeInfo,
          ...this.query,
          classifyName:
            this.type == 'keyword' ? undefined : this.value.classifyName,
          classifyId:
            this.classifyId || (isExistCate && isExistCate.classifyId),
          keywordTexts: childData
        }
        return this.$api[
          `keyword/${
            this.type == 'keyword' || isExistCate
              ? 'keywordLibClassifySaveKeywordText'
              : 'keywordLibClassifySave'
          }`
        ](params)
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
