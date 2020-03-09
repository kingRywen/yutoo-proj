<template>
  <yt-form ref="form" label-width="100px" :fields="activeFields" :formData="formData"></yt-form>
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
        pcId: this.params.currentCateId
      },
      activeFields: [
        {
          label: '数据源',
          name: 'popularFlag',
          span: 24,
          type: 'select',
          required: true,
          options: [
            {
              label: '衰款',
              value: 0
            },
            {
              label: '爆款',
              value: 1
            }
          ],
          onChange() {
            if (vm.formData.dataType === 3 && vm.formData.popularFlag === 0) {
              vm.formData.dataType = null
            }
          }
        },
        {
          label: '爆款源',
          name: 'dataType',
          type: 'select',
          options: [
            {
              label: '关键词',
              value: 1
            },
            {
              label: '类目',
              value: 2
            },
            {
              label: 'Top100链接',
              value: 3
            }
          ],
          span: 24,
          required: true,
          visibleChange(show) {
            if (show) {
              if (vm.formData.popularFlag == 0) {
                vm.activeFields[1].options.pop()
              }
            } else {
              vm.$set(vm.activeFields[1], 'options', [
                {
                  label: '关键词',
                  value: 1
                },
                {
                  label: '类目',
                  value: 2
                },
                {
                  label: 'Top100链接',
                  value: 3
                }
              ])
            }
          }
        },
        {
          label: '关键词',
          name: 'keyword',
          span: 24,
          type: 'textarea',
          placeholder: '多个换行输入, 最多500个',
          rows: 5,
          hidden(data) {
            return data.dataType === 1
          },
          required: true
        },
        {
          label: '类目',
          // name: 'productCategoryGetCategory',
          name: 'pcId',
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
          last: false,
          disabled: true,
          required: true,
          hidden(data) {
            return data.dataType === 2
          }

          // disabled: true
        },
        {
          label: 'TOP100',
          name: 'top',
          span: 24,
          type: 'textarea',
          placeholder: '多个换行输入',
          rows: 5,
          hidden(data) {
            return data.dataType === 3
          },
          required: 'multiUrl'
        },
        {
          label: '搜索页数',
          name: 'searchPages',
          type: 'select',
          options: pages,
          span: 24,
          required: true,
          hidden(data) {
            return data.dataType !== 3
          }
        },
        {
          label: '按类目',
          name: 'categoryType',
          span: 24,
          type: 'select',
          required: true,
          options: [
            {
              label: '大类',
              value: 0
            },
            {
              label: '小类',
              value: 1
            }
          ],
          hidden(data) {
            return data.dataType !== 3
          }
        },
        {
          label: 'BSR最小值',
          type: 'number',
          name: 'minRank',
          span: 12,
          min: 0,
          max: 10000000,
          required: true,
          hidden(data) {
            return data.dataType !== 3
          },
          onChange(item, val) {
            vm.activeFields[8].min = val
          }
        },
        {
          label: 'BSR最大值',
          span: 12,
          type: 'number',
          name: 'maxRank',
          required: true,
          min: 0,
          max: 10000000,
          hidden(data) {
            return data.dataType !== 3
          },
          // onChange(item, val) {
          //   vm.activeFields[7].max = val
          // }
        },
        {
          label: '任务名称',
          name: 'taskName',
          span: 24,
          required: true
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
              enabled: true,
              isLeaf: !el.haveChildren
            }
          })
        })
        .catch(() => {})
    },
    _submit() {
      return this.$refs.form.validate().then(() => {
        let {
            popularFlag,
            pcId,
            searchPages,
            categoryType,
            minRank,
            maxRank,
            taskName,
            dataType,
            keyword,
            top,
            categoryId
          } = this.formData,
          dataSource = []
        switch (dataType) {
          case 2:
            dataSource.push(pcId.slice(0).pop())
            break
          case 3:
            dataSource = this.$.getAsins(top)
            break
          case 1:
            dataSource = this.$.getAsins(keyword)
            break

          default:
            break
        }
        let { platformId, sellerId, siteId } = this.sellerData
        return this.$api[`taskSelAttrSave`]({
          platformId,
          pcId: this.params.cateId,
          dataSourceArr: dataSource,
          sellerId,
          siteId,
          dataType,
          popularFlag,
          searchPages,
          categoryType,
          minRank,
          maxRank,
          taskName
        }).then(data => {
          if (this.params && this.params.close) {
            this.params.close(this.params.cateId)
          }
          return true
        })
      })
    }
  }
}
</script>

<style>
</style>
