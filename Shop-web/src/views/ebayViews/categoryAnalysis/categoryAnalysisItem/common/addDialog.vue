<template>
  <yt-form ref="form" label-width="120px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      activeFields: [
        {
          label: '类目',
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
          required: true
        }
      ],
      formData: {
      },
    }
  },
  methods: {
    loadTree(id = [0], selEl, itemDisabled) {
      if (!selEl) {
        selEl = {
          pcid: 0
        }
      }
      let { pcid } = selEl
      let params = {
        parentPcid:pcid,
        siteId: this.siteId,
        platformId: this.ebayPlatformId
      }
      return this.$api[`ebProductCategoryGetCategory`](params)
        .then(data => {
          if (data && data.code && data.code !== 0) {
            this.$message.error(data.msg)
            return
          }
          

          return data.data.map(el => {
            return {
              ...el,
              childs: el.haveChildren ? [] : null,
              enabled: true,
              isLeaf: !el.haveChildren
            }
          })
        })
        .catch(() => {})
    },
    _submit() {
	    return this.$refs.form.validate().then(() => {
			return this.$api[`ebTaskCateAysSave`]({
				categoryId: this.formData.categoryId.slice(0).pop(),
				platformId: this.ebayPlatformId,
				siteId: this.siteId
			})
		})
    }
  }
}
</script>
<style lang="scss" scoped>
ul,
li {
  margin: 0;
  padding: 0;
}
.select-container {
  list-style: none;
  display: flex;
  // flex-wrap: nowrap;
  flex-wrap: wrap;
  overflow: auto;
  .select-box {
    margin-left: 10px;
    list-style: none;
    flex: 0 0 230px;
    height: 500px;
    overflow: auto;
    display: flex;
    flex-direction: column;
    border: 1px solid #ddd;
    border-radius: 5px;
    float: left;
    .text {
      flex: 1;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .item {
      display: flex;
      cursor: pointer;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      &.active {
        background: rgb(239, 243, 248);
      }
    }
  }
}
</style>
