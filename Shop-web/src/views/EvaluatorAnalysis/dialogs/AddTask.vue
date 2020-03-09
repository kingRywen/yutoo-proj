<template>
  <yt-form ref="form" label-width="90px" :fields="activeFields" :formData="formData"></yt-form>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    let pages = new Array(10)
      .toString()
      .split(',')
      .map((el, index) => ({ label: index + 1, value: index + 1 }))

    return {
      formData: {
        dataType: 0
      },
      activeFields: [
        {
          label: '任务名称',
          name: 'taskName',
          span: 24,
          required: true
        },
        {
          label: '数据类型',
          name: 'dataType',
          type: 'select',
          options: [
            {
              label: '产品链接',
              value: 0
            },
            {
              label: '店铺链接',
              value: 1
            },
            {
              label: '类目',
              value: 2
            },
            {
              label: 'Top10000链接',
              value: 3
            },
            {
              label: '关键词',
              value: 4
            }
          ],
          span: 24,
          required: true
        },
        {
          label: '产品链接',
          name: 'asin',
          span: 24,
          type: 'textarea',
          placeholder: '多个换行输入',
          rows: 5,
          required: 'multiUrl',
          hidden(data) {
            return data.dataType === 0
          }
        },
        {
          label: '店铺链接',
          name: 'url',
          span: 24,
          type: 'textarea',
          placeholder: '多个换行输入',
          rows: 5,
          required: 'multiUrl',
          hidden(data) {
            return data.dataType === 1
          }
          // disabled: true
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
          required: true,
          hidden(data) {
            return data.dataType === 2
          }

          // disabled: true
        },
        {
          label: '关键词',
          name: 'keyword',
          span: 24,
          type: 'textarea',
          placeholder: '请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号, 最多500个',
          rows: 5,
          hidden(data) {
            return data.dataType === 4
          },
          required: true
        },
        {
          label: '搜索页数',
          name: 'searchPages',
          type: 'select',
          options: pages,
          span: 24,
          hidden(data) {
            return data.dataType === 2 || data.dataType === 4
          },
          required: true
        },
        {
          label: 'TOP10000',
          name: 'top',
          span: 24,
          type: 'textarea',
          placeholder: '多个换行输入',
          rows: 5,
          hidden(data) {
            return data.dataType === 3
          },
          required: 'multiUrl'
        }
      ]
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
        platformId: this.platformId
      }
			this.$const['OTHER/phoneExp']
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
              enabled: true,
              isLeaf: !el.haveChildren
            }
          })
        })
        .catch(() => {
				})
    },
		_initData() {
			console.log('open')
		},
    _submit() {
      return this.$refs.form.validate().then(() => {
        let {taskName, asin, dataType, url, searchPages, top, keyword, categoryId } = this.formData,
          dataSource = []
        let { platformId, sellerId, siteId } = this.sellerData
        switch (dataType) {
          case 0:
            dataSource = this.$.getAsins(asin)
            break
          case 1:
            dataSource = this.$.getAsins(url)
            break
          case 2:
            dataSource.push(categoryId.slice(0).pop())
            break
          case 3:
            dataSource = this.$.getAsins(top)
            break
          case 4:
            dataSource = this.$.getAsins(keyword)
            break

          default:
            break
        }
        return this.$api[`taskReviewerAnalysisSave`]({
          taskName,
          platformId,
          sellerId,
          siteId,
          dataType,
          dataSource,
          searchPages
        }).then(data => {
          return Promise.resolve('reset')
        })
      })
    }
  }
}
</script>

<style>
</style>
