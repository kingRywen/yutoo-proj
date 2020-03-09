<template>
  <yt-form ref="form" label-width="90px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    let childList = JSON.parse(JSON.stringify(vm.params.treeList[0].childList))
    vm.setDisabled(childList)
    return {
      formData: {},
      activeFields: [
        {
          label: '分组名称',
          name: 'classifyName',
          span: 24,
          maxlength: 20,
          required: true
        },
        {
          clearable: true,
          label: '选择上级分组',
          name: 'parentClassifyId',
          span: 24,
          width: '100%',
          placeholder: '请选择分组',
          every: true,
          options: childList,
          bind: {
            label: 'classifyName',
            value: 'classifyId',
            children: 'childList',
            enabled: 'enabled'
          },
          type: 'cascader',
          last: true
          // required: true
        }
      ]
    }
  },
  methods: {
    setDisabled(list) {
      list.forEach(el => {
        if (el.dataFlag) {
          el.disabled = true
        }
        if (el.childList) {
          this.setDisabled(el.childList)
        }
      })
    },
    loadTree(id = [0], selEl, itemDisabled) {
      if (!selEl) {
        selEl = {
          pcid: 0
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
              enabled: el.dataFlag ? false : true,
              isLeaf: !el.haveChildren
            }
          })
        })
        .catch(() => {})
    },
    _initData() {
      if (this.params.row && this.params.row.classifyId) {
        if (this.params._next) {
          // 添加下级分组
          this.formData.parentClassifyId = this.params.row.parentIds.slice(0)
          return
        }
        this.formData.classifyName = this.params.row.classifyName
        this.formData.parentClassifyId = this.params.row.parentIds.slice(0, -1)
      }
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        const parentClassifyId = this.formData.parentClassifyId
          ? this.formData.parentClassifyId.slice(0).pop() || 0
          : 0
        let params = {
          ...this.storeIds,
          classifyType: 4,
          parentClassifyId,
          classifyName: this.formData.classifyName
        }
        if (this.params.row && this.params.row.classifyId != null) {
          params.classifyId = this.params.row.classifyId
        }
        return this.$api[
          this.params.row &&
          this.params.row.classifyId != null &&
          !this.params._next
            ? `taskClassifyUpdate`
            : `taskClassifySave`
        ](params).then(() => {
          let specials = ['添加分组', '添加下级分组', '编辑分组']
          if (this.params.title.indexOf(specials) === -1) {
            this.params.parent.getTaskClassifyList()
          } else {
            this.params.parent.updateTree(this.params.title, parentClassifyId)
          }
          return Promise.resolve('close')
        })
      })
    }
  }
}
</script>

<style>
</style>
