<template>
  <div class="w1200">
    <Info />
    <section class="mt20">
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
            <el-button :disabled="$attrs.unedit" v-if="scope.$index !== 0" type="text" icon="el-icon-close" @click="del(scope.row, scope.$index)"></el-button>
          </template>
        </el-table-column>
      </main-layout>
    </section>
    <article class="mt20">
      <el-button type="default" :disabled="$attrs.unedit" @click="$emit('cancel')">取消创建</el-button>
      <el-button type="primary" :disabled="$attrs.unedit" @click="next">继续下一步</el-button>
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
        // {
        //   label: 'ASIN',
        //   value: 'asin',
        //   width: 110
        // },
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
          label: '准备指导',
          value: 'prepInstruction',
          width: 150,
          render: (h, scope) => {
            const { $index: i } = scope
            const { s } = scope.row
            const options = [
              { label: '塑料袋包装', value: 'Polybagging' },
              { label: '泡沫包装', value: 'BubbleWrapping' },
              { label: '胶带包装', value: 'Taping' },
              { label: '黑色热塑包装', value: 'BlackShrinkWrapping' },
              { label: '需要标签', value: 'Labeling' },
              { label: '衣架上的服装', value: 'HangGarment' }
            ]
            const exist = s && s.length

            if (i == 0) {
              return (
                <el-select
                  disabled={this.$attrs.unedit}
                  value={scope.row.prepInstruction}
                  on-change={val => {
                    // if (!exist) {

                    // }
                    this.tableList.map(e => {
                      if (!(e.s && e.s.length)) {
                        this.$set(e, 'prepInstruction', val)
                      }
                    })
                  }}
                  size="small"
                >
                  {options.map(e => (
                    <el-option label={e.label} value={e.value}></el-option>
                  ))}
                </el-select>
              )
            } else {
              return !exist ? (
                <el-select disabled={this.$attrs.unedit} vModel={scope.row.prepInstruction} size="small">
                  {options.map(e => (
                    <el-option label={e.label} value={e.value}></el-option>
                  ))}
                </el-select>
              ) : (
                <span>
                  {s.length == 1 && s[0] == 'Labeling' ? '需要标签' : s
                    .filter(e => e !== 'Labeling')
                    .map(e => options.find(el => el.value === e).label)
                    .join('、')}
                </span>
              )
            }
          }
        },
        {
          label: '预处理方',
          value: 'prepOwner',
          render: (h, scope) => {
            // if (scope.row.perFees) {

            // }
            const { s, prepOwner } = scope.row
            if (s) {
              return <span>{prepOwner == 'AMAZON' ? '亚马逊' : '卖家'}</span>
            }
            return (
              <el-select
                disabled={this.$attrs.unedit}
                size="small"
                onChange={val => {
                  if (scope.$index == 0) {
                    this.tableList.map(e => {
                      if (!e.s) {
                        this.$set(e, 'prepOwner', val)
                      }
                    })
                  }
                }}
                vModel={scope.row.prepOwner}
              >
                <el-option label="亚马逊" value="AMAZON"></el-option>
                <el-option label="卖家" value="SELLER"></el-option>
              </el-select>
            )
          }
        },
        {
          label: '商品数量',
          value: 'quantity',
          render: (h, scope) => {
            if (scope.$index == 0) {
              const total = this.tableList.reduce(
                (total, cur) => (total += cur.quantity || 0),
                0
              )
              return <span>{total}</span>
            } else {
              return <span>{scope.row.quantity}</span>
            }
          }
        },
        {
          label: '准备成本',
          value: 'prepCost',
          render: (h, scope) => {
            if (scope.$index == 0) {
              const total = this.tableList.reduce(
                (total, cur) => (total += parseInt(cur.prepCost) || 0),
                0
              )
              return <span>{total ? `$${total}` : ''}</span>
            } else {
              return <span>{scope.row.prepCost}</span>
            }
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('fba', ['planInfo'])
  },
  watch: {
    '$store.state.fba.selectProjProduct': {
      immediate: true,
      handler(val) {
        if (!val.length) {
          return
        }
        this.getPre()
      }
    }
  },
  methods: {
    ...mapMutations('fba', ['setSelectedPro', 'saveCreateInfo']),
    ...mapActions('fba', ['submitPro']),
    del(row, index) {
      this.tableList.splice(index, 1)
      this.save()
    },
    save() {
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
          fnsku: el.fnsku,
          labelNum: el.quantity
        }))
      }
      // return this.$api[`fba/fbaShipmentCreateItemSave`](params)
      this.submitPro(params)
    },
    async next() {
      await this.save()
      this.setSelectedPro(this.tableList.slice(1).map(e => ({...e, labelNum: e.quantity})))
      this.saveCreateInfo(3)
    },
    getPre() {
      if (this.has) {
        return
      }
      const select = this.$store.state.fba.selectProjProduct
      const params = {
        storeId: this.planInfo.storeId,
        targetCountryCode: this.planInfo.targetCountryCode,
        skus: select.map(e => e.sellerSku)
      }
      this.$api[`fba/fbaShipmentCreatePlanPrep`](params).then(data => {
        this.has = true
        const { prepInstructions } = data
        const selected = select.map(e => {
          const cur = prepInstructions.find(el => el.sellerSku === e.sellerSku)
          let s
          if (cur) {
            s =
              cur.prepInstructions &&
              cur.prepInstructions.map(e => e.prepInstruction)
          }
          return {
            ...e,
            s,
            perFees: cur.perFees,
            prepOwner: cur.perFees ? 'AMAZON' : 'SELLER'
          }
        })
        this.tableList = [{ intro: '适用于全部' }, ...selected]
        this.setSelectedPro(selected)
      })
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex == 0) {
        return '___first'
      }
    },
    cellStyle({ column, rowIndex }) {
      const arrs = ['SKU', 'ASIN', '主图', '标题']
      if (rowIndex == 0 && arrs.indexOf(column.label) > -1) {
        return 'opacity: 0'
      }
    }
  }
}
</script>
<style lang="scss">
.___first {
  background-color: #ddd !important;
}
</style>