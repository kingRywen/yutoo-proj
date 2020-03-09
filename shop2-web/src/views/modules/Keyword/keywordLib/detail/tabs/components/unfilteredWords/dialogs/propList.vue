<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo, categoryId}"
      :searchFields="searchFields"
      :columns="columns"
      :right-edit-btns="editBtns"
      edit-width="160px"
      :radioMode="true"
      url="keyword/keywordLibClassifyList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['categoryId', 'keywordTexts'],
  data() {
    return {
      searchFields: {
        searchText: {
          placeholder: '分类属性名称'
        }
      },
      columns: [
        {
          label: '分类属性名称',
          value: 'classifyName'
        }
      ],
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.add()
          }
        }
      ]
    }
  },

  methods: {
    add() {
      let vm = this
      this._openDialog({
        size: 'medium',
        title: '添加属性',
        params: {
          categoryId: this.categoryId,
          keywordTexts: this.keywordTexts,
          close() {
            vm.$emit('dialog.close')
          }
        },
        cancelBtnText: '取消',
        okBtnText: '确认添加',
        component: () => import('./addName.vue')
      })
    },
    _submit() {
      if (!this.$refs.layout.selection.length) {
        // this.$message.warning('请选择至少一个分类属性')
        return Promise.reject('请选择至少一个分类属性')
      }
      let params = {
        ...this.storeInfo,
        categoryId: this.categoryId,
        classifyId: this.$refs.layout.selection[0].classifyId,
        keywordTexts: this.keywordTexts
      }
      return this.$api[`keyword/keywordLibClassifySaveKeywordText`](params)
    }
  }
}
</script>