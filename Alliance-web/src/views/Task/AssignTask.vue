<template>
  <div>
    <SimpleForm labelWidth="80px" :fields="addFields" ref="form"></SimpleForm>
    <main-layout
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :tableMaxHeight="360"
      ref="lay"
      @handleSelectionChange="handleSelectionChange"
      :tableCols="tableCols"
    ></main-layout>
  </div>
</template>

<script>
export default {
  props: {
    taskSource: false
  },
  data() {
    let tableCols = [
      {
        label: `任务${this.taskSource ? 'ID' : '名称'}`,
        prop: this.taskSource ? 'taskSourceId' : 'taskName'
      },
      {
        label: '任务数量',
        prop: this.taskSource ? 'taskNum' : 'taskSubCount'
      }
    ]
    let searchFields = [
      {
        name: tableCols[0].prop,
        label: tableCols[0].label,
        span: 12
      },
      {
        type: 'cascader',
        name: 'categoryId',
        getEl: true,
        label: '类目',
        options: this.loadTreeHasLast,
        span: 12,
        bind: {
          label: 'name',
          value: 'categoryId',
          children: 'childs',
          enabled: 'enabled'
        }
      }
    ]
    return {
      addFields: [
        {
          label: '操作员',
          required: true,
          name: 'userIdArray',
          type: 'select',
          multi: true,
          options: [],
          span: 12
        },
        {
          label: '任务数量',
          name: 'subNum',
          disabled: true,
          placeholder: '  ',
          span: 12
        }
      ],
      searchFields,
      recipientUsers: [],

      tableCols
    }
  },
  created() {
    this.init()
  },
  methods: {
    handleSelectionChange(val) {
      let total = val.reduce(
        (total, cur) =>
          (total += this.taskSource ? cur.taskNum : cur.taskSubCount),
        0
      )
      this.$set(this.$refs.form.formData, 'subNum', total)
    },
    // 列表
    loadData(data) {
      let { time = [], categoryId = [], ...info } = data
      categoryId = categoryId.slice().pop()
      let [queryStartDate, queryEndDate] = time
      let params = { queryStartDate, queryEndDate, categoryId, ...info }

      return this.$api[
        `main/${this.taskSource ? 'taskSourceUnAllotList' : 'taskListUnAllot'}`
      ](params)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    init() {
      this.getRecipientUsers()
    },
    getRecipientUsers() {
      this.$api[`main/sysUserRecipientDropdownList`]({})
        .then(data => {
          // this.recipientUsers = data
          this.addFields[0].options = data.map(el => ({
            label: el.value,
            value: el.key
          }))
        })
        .catch(err => {})
    }
  }
}
</script>

<style>
</style>
