/*
 * @Author: rywen 
 * @Date: 2020-03-02 17:10:40 
 * @Last Modified by: rywen
 * @Last Modified time: 2020-03-18 17:27:40
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
          label: '库存阀值',
          headerTooltip:
            '平台采购库存阀值，满足库存阀值的其他卖家的SKU能力作为采购对象',
          min: 1,
          max: 100,
          value: 'stockThreshold'
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
        this.$refs.layout.toggleRowEdit(row, 'stockThreshold', true, false, 0)
        // this.$refs.layout.toggleRowEdit(row, 'purchasePrice', true, false, 2)
      })
    },
    validate() {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (this.selected.find(e => !e.__isedit.stockThreshold.editVal)) {
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
            stockQty: e.__isedit.stockThreshold.editVal,
            asin: e.asin
          }))
        }
        return this.$api[`ss/sellingMaybeUpdateStockThreshold`](params)
      })
    }
  }
}
</script>