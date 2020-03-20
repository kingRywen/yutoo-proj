<template>
  <div v-loading="loading" class="w1200">
    <Info />
    <section class="mt20">
      <section>
        <el-select size="small" style="width: 350px" v-model="labelType">
          <el-option v-for="item in labelTypes" :key="item.label" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-button class="ml10" type="primary" @click="_print">打印标签</el-button>
      </section>
      <main-layout
        :tableRowClassName="tableRowClassName"
        :showSelection="false"
        class="mt10"
        :columns="columns"
        :cellStyle="cellStyle"
        :outerTableList="tableList"
        ref="layout"
      >
        <el-table-column slot="right" :width="45" label align="left">
          <template slot-scope="scope">
            <el-button v-if="scope.$index !== 0" type="text" icon="el-icon-close" @click="del(scope.row, scope.$index)"></el-button>
          </template>
        </el-table-column>
      </main-layout>
    </section>
    <article class="mt20">
      <el-button type="default" @click="$emit('cancel')">取消创建</el-button>
      <el-button type="primary" @click="next">继续下一步</el-button>
    </article>
  </div>
</template>
<script>
import Info from './info'
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  components: {
    Info
  },
  data() {
    return {
      loading: false,
      labelType: '63.5,38.1',
      labelTypes: [
        // {
        //   label: '每张US信纸最多30个标签(1英寸X2-5/8英寸)',
        //   value: ''
        // },
        {
          label: '每页纸最多21个标签(A4纸,63.5毫米X38.1毫米)',
          value: '63.5,38.1'
        },
        {
          label: '每页纸最多24个标签(A4纸,63.5毫米X33.9豪米)',
          value: '63.5,33.9'
        },
        {
          label: '每页纸最多24个标签(A4纸,66毫米X35室米)',
          value: '66,35'
        },
        {
          label: '每页纸最多24个标签(A4纸,70毫米x36豪米)',
          value: '70,36'
        },
        {
          label: '每页纸最多24个标签(A4纸,70毫米X37豪米)',
          value: '70,37'
        },
        {
          label: '每页纸最多27个标签(A4纸,63.5毫米X29.6豪米)',
          value: '63.5,29.6'
        },
        {
          label: '每页纸最多40个标签(A4纸,52.5毫米X29.7豪米)',
          value: '52.5,29.7'
        },
        {
          label: '每页纸最多44个标签(A4纸,48.5毫米X25.4毫米)',
          value: '48.5,25.4'
        }
      ],
      tableList: [
        { intro: '适用于全部' },
        ...JSON.parse(
          JSON.stringify(this.$store.state.fba.selectProjProduct)
        ).map(e => ({
          ...e,
          intro: 'Polybagging'
        }))
      ],
      columns: [
        {
          label: 'SKU',
          value: 'sellerSku',
          noTooltip: true
        },
        {
          label: 'ASIN',
          value: 'asin',
          width: 110
        },
        {
          label: '主图',
          img: true,
          width: 70,
          value: 'img'
        },
        {
          label: '标题',
          minWidth: 300,
          url: true,
          btnClick: scope => {
            window.open(this.storeUrls.asinUrl + scope.row['asin'])
          },
          value: 'title',
          noTooltip: true
        },
        {
          label: '商品数量',
          value: 'quantity'
        },
        {
          label: '贴标方',
          value: 'prepOwner',
          render: (h, scope) => {
            return (
              <span>{scope.row.prepOwner == 'AMAZON' ? '亚马逊' : '卖家'}</span>
            )
          }
        },
        {
          label: '需打印标签数量',
          value: 'labelNum',
          width: 140,
          render: (h, scope) => {
            if (scope.$index == 0) {
              return <span></span>
            } else {
              return (
                <el-input-number
                  class="printNum"
                  style="width:100%"
                  size="small"
                  vModel={scope.row.labelNum}
                  min={0}
                  max={999999999999}
                  controls={false}
                ></el-input-number>
              )
            }
          }
        },
        {
          label: '标签成本',
          value: 'prepCost',
          render: (h, scope) => {
            if (scope.$index == 0) {
              const total = this.tableList.reduce(
                (total, cur) =>
                  (total +=
                    cur.prepOwner && cur.prepOwner.indexOf('AMAZON') == -1
                      ? 0
                      : scope.row.perFees
                      ? scope.row.perFees * scope.row.quantity
                      : 0 || 0),
                0
              )
              return <span>{total ? `$${total}` : ''}</span>
            } else {
              const total =
                scope.row.prepOwner &&
                scope.row.prepOwner.indexOf('AMAZON') == -1
                  ? 0
                  : scope.row.perFees
                  ? scope.row.perFees
                  : ''
              return <span>{total ? `$${total}` : ''}</span>
            }
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('fba', ['planInfo'])
  },
  methods: {
    ...mapMutations('fba', ['setSelectedPro', 'saveCreateInfo']),
    ...mapActions('fba', ['submitPro']),
    _print() {
      let el = this.cfuns.hasEmptyValue('.printNum .el-input__inner')
      if (el) {
        el.focus()
        return this.$message.warning('请填写打印标签数量')
      }
      this.printPage()
    },
    printPage() {
      let vm = this

      let d = document.querySelectorAll('#print-page')[0]
      const [width, height] = this.labelType.split(',').map(e => +e)
      const href = this.$router.resolve({
        path: '/shopManage/fba/warehouse/print',
        query: {
          width,
          height,
          codes: this.tableList
            .slice(1)
            .map(e => [e.fnsku, e.labelNum, e.title].join('$'))
            .join('$$')
        }
      }).href
      if (!d) {
        this.loading = true
        d = document.createElement('frame')
        d.id = 'print-page'
        d.src = this._cachedHref = href
        document.body.appendChild(d)

        // console.log(d)
      } else {
        if (this._cachedHref == href) {
          d.contentWindow.print()
        } else {
          d.src = this._cachedHref = href
          this.loading = true
          d.contentWindow.location.reload(href)
        }
      }
      window.__closeLoading = function() {
        vm.loading = false
        d.contentWindow.print()
      }
    },
    async del(row, index) {
      this.tableList.splice(index, 1)
      const params = {
        planId: this.planInfo.planId,
        planProcess: 3,
        items: this.tableList.slice(1).map(el => ({
          sellerSku: el.sellerSku,
          storeId: el.storeId,
          quantity: el.quantity,
          prepInstruction: !el.s ? el.prepInstruction : el.s.join(','),
          prepOwner: !el.s
            ? el.prepOwner
            : el.s.map(() => el.prepOwner).join(','),
          prepCost: null,
          fnsku: el.fnsku
        }))
      }
      await this.submitPro(params)
      this.setSelectedPro(this.tableList.slice(1))
    },
    create() {
      return this.$store.dispatch('fba/createShipments')
    },
    async next() {
      await this.create()
      this.setSelectedPro(this.tableList.slice(1))
      this.saveCreateInfo(4)
      // await this.$store.dispatch('fba/createShipments')
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex == 0) {
        return '___first'
      }
    },
    cellStyle({ column, rowIndex }) {
      const arrs = ['SKU', 'ASIN', '主图', '标题', '商品数量']
      if (rowIndex == 0 && arrs.indexOf(column.label) > -1) {
        return 'opacity: 0'
      }
    }
  }
}
</script>
<style lang="scss">
.___first {
  background-color: #e4e7ed !important;
}
tr.___first:hover > td {
  background-color: #e4e7ed !important;
}
</style>