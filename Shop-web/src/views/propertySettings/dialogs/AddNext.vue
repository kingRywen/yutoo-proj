<template>
  <yt-form ref="form" label-width="120px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      formData: {
        taskName: ''
      },
      childsName: [],
      activeFields: [
        {
          label: '上级类目名称',
          name: 'taskName',
          span: 24,
          // required: true,
          disabled: true
        },
        {
          label: '类目',
          // name: 'productCategoryGetCategory',
          name: 'categoryId',
          span: 24,
          placeholder: '请选择类目',
          options: vm.loadTree,
          bind: {
            label: 'name',
            value: 'pcid',
            children: 'childs',
            enabled: 'enabled'
          },
          type: 'cascader',
          last: true,
          required: true

          // disabled: true
        }
      ]
    }
  },
  created() {
    this.formData.taskName = this.params.name
  },
  methods: {
    _initData() {
      if (this.params) {
        function getLastChild(arr) {
          arr.forEach(el =>{
            if (!el.haveChildren) {
              childsName.push(el.pcid)
            }
            if (el.childList) {
              getLastChild(el.childList)
            }
          })
        }
        // 获取已经添加的底层类目
        let childList = this.params.childList, childsName = []
        getLastChild(childList)
        this.childsName = childsName
      }
    },
    loadTree(id = [0], selEl, itemDisabled) {
      if (!selEl) {
        selEl = {
          pcid: this.params.pcid
        }
      }
      let { pcid } = selEl
      let params = {
        parentPcid: pcid,
        siteId: this.siteId,
        platformId: this.platformId
      }
      return this.$api[`productCategoryGetCategory`](params)
        .then(data => {
          if (data && data.code && data.code !== 0) {
            this.$message.error(data.msg)
            return
          }

          return data.data.map(el => {
            return {
              ...el,
              childs: el.haveChildren ? [] : null,
              enabled: this.childsName.length ? this.childsName.indexOf(el.pcid) === -1 : false,
              isLeaf: !el.haveChildren
            }
          })
        })
        .catch(() => {})
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        const { sellerId, siteId } = this.sellerData
        const { pcid } = this.params
        let { categoryId } = this.formData
        return this.$api[`sameAttrConfigSaveSub`]({
          sellerId,
          siteId,
          pcid: categoryId.slice(0).pop(),
          parentPcid: pcid
        })
      })
    }
  }
}
</script>

<style>
</style>
