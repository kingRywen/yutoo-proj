/*
 * @Author: rywen 
 * @Date: 2020-03-02 17:10:40 
 * @Last Modified by: rywen
 * @Last Modified time: 2020-03-09 10:17:03
 */
<template>
  <div>
    <main-layout
      :showSelection="false"
      class="editcost"
      ref="layout"
      :columns="columns"
      @hook:mounted="listMount"
      :outerTableList="selected"
      :edit-btns="edits"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['sel'],
  data() {
    return {
      selected: [...this.sel],
      columns: [
        {
          label: 'ASIN',
          fixed: 'left',
          value: 'asin',
          url: true,
          expand: true,
          btnClick: scope => {
            window.open(this.storeUrls.asinUrl + scope.row['asin'])
          }
        },
        {
          label: '主图',
          value: 'imageUrl',
          img: true,
          link: row => {
            return this.storeUrls.asinUrl + row['asin']
          },
          title: 'title',
          width: 70
        },
        {
          label: '品牌名',
          value: 'brand'
        },
        {
          label: '源站点',
          value: 'srcSiteName'
        },
        {
          label: '库存(美元)',
          value: 'localStockQty'
        },
        {
          label: '成本价(美元)',
          value: 'cost'
        }
      ],
      edits:
        this.sel.length > 1
          ? [
              {
                name: '删除',
                perm: 'add',
                fn: scope => {
                  this.selected.splice(scope.$index, 1)
                }
              }
            ]
          : []
    }
  },
  methods: {
    listMount() {
      this.selected.forEach(row => {
        this.$refs.layout.toggleRowEdit(row, 'localStockQty', true, false, 0)
      })
    },
    validate() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.selected.find(e => !e.__isedit.localStockQty.editVal)) {
            this.$message.warning('请填写数据')
            let input = this.$refs.layout.$el.querySelectorAll(
              'input.el-input__inner'
            )
            let uninput = [].find.call(input, e => {
              return e.value == ''
            })
            uninput.focus()
            reject()
          }
          resolve()
        })
      })
    },
    _submit() {
      return this.validate().then(() => {
        let params = {
          ...this.storeInfo,
          stockSource: this.selected.map(e => ({
            localStockQty: e.__isedit.localStockQty.editVal,
            asin: e.asin
          }))
        }
        return this.$api[`ss/sellingMaybeUpdateLocalStock`](params)
      })
    }
  }
}
</script>