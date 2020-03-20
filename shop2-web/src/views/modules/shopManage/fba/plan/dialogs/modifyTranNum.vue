<template>
  <div>
    <div style="text-align:right">
      <el-button :disabled="isClear" type="text" @click="del()">全部删除</el-button>
    </div>
    <main-layout
      class="_tt"
      url="fba/FbaReplenishShippingViewItems"
      :outerParams="queries"
      :columns="columns"
      :showSelection="false"
      :isShowPag="false"
      edit-width="160px"
      ref="layout"
    >
      <template slot="right">
        <el-table-column label="操作" width="90px">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-close" @click="del(scope)"></el-button>
          </template>
        </el-table-column>
      </template>
    </main-layout>
  </div>
</template>
<script>
export default {
  props: ['queries'],
  data() {
    return {
      isClear: false,
      columns: [
        {
          label: 'SKU',
          value: 'sellerSku'
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: '主图',
          value: 'img',
          width: 65,
          img: true
        },
        {
          label: '标题',
          value: 'title',
          minWidth: 300
        },
        {
          label: '计划发货数量',
          value: 'quantityPlanSend',
          sortable: true,
          width: 155
          // render: (h, scope) => {
          //   return (
          //     <el-input-number
          //       style="width:100%"
          //       value={scope.row.quantityPlanSend}
          //       min={1}
          //       max={99999999999}
          //       controls={false}
          //       size="mini"
          //       onChange={e => {
          //         this.$set(scope.row, 'quantityPlanSend', e)
          //       }}
          //     ></el-input-number>
          //   )
          // }
        },
        {
          label: '真实发货数量',
          sortable: true,
          width: 155,
          value: 'quantityReal',
          render: (h, scope) => {
            return (
              <el-input-number
                style="width:100%"
                value={scope.row.quantityReal}
                min={1}
                max={99999999999}
                controls={false}
                size="mini"
                onChange={e => {
                  this.$set(scope.row, 'quantityReal', e)
                }}
              ></el-input-number>
            )
          }
        }
      ]
    }
  },
  methods: {
    del(scope) {
      if (!scope) {
        this.isClear = true
        return this.$refs.layout.tableList.splice(0)
      }
      this.$refs.layout.tableList.splice(scope.$index, 1)
      if (!this.$refs.layout.tableList.length) {
        this.isClear = true
      }
    },
    validate() {
      return new Promise((resolve, reject) => {
        let inputs = [].slice.call(document.querySelectorAll('._tt input'), 0)
        let emptyInput = inputs.find(el => el.value === '')
        if (emptyInput) {
          this.$message.warning('请输入数量')
          emptyInput.focus()
          reject()
        }
        resolve()
      })
    },
    _submit() {
      return this.validate().then(() => {
        const params = {
          ...this.queries,
          data: this.$refs.layout.tableList
        }
        return this.$api[`fba/FbaReplenishShippingUpdateQty`](params)
      })
    }
  }
}
</script>