<template>
  <yt-form ref="form" label-width="146px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      formData: {},
      activeFields: [
        // {
        //   label: "分组名称",
        //   name: "classifyName",
        //   span: 24,
        //   required: true
        // },
        {
          label: '选择分组',
          name: 'parentClassifyId',
          span: 24,
          placeholder: '请选择类目',
          every: false,
          options: vm.params.treeList[0].childList,
          bind: {
            label: 'classifyName',
            value: 'classifyId',
            children: 'childList',
            enabled: 'enabled'
          },
          type: 'cascader',
          last: true,
          required: true
        }
      ]
    };
  },
  methods: {
    _initData() {
      if (this.params.row && this.params.row.classifyId) {
        this.formData.classifyName = this.params.row.classifyName
        this.formData.parentClassifyId = this.params.row.parentIds.slice(0, -1)
      }
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let params = {
          ...this.storeIds,
          objectIds: this.params.row.map(el => el.objectId),
          classifyId:this.formData.parentClassifyId.slice(0).pop()
        }
        return this.$api[`adManualUpdateClassifyId`](params).then(() => {
          this.params.parent.$parent.$parent.$parent.getTaskClassifyList()
          // this.params.parent.$refs.layout.getList()
          // return Promise.resolve('close')
					return Promise.resolve('reset')
        })
      });
    }
  }
};
</script>

<style>
</style>
