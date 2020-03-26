<template>
  <div>
    <section>
      <p>
        <input type="radio" id="new" v-model="exportType" :value="1" />
        <label for="new">
          确认补货并导出数据
          <br />
          <span>选择该项默认产品正在补货，系统会把本次导出的数据计算到在补数量，可以在补货记录查看数据</span>
        </label>
      </p>
      <p>
        <input type="radio" id="new1" v-model="exportType" :value="0" />
        <label for="new1">
          仅导出数据
          <br />
          <span>选择该项任务没有进行补货，本次导出的数据不会从待补数量中减除</span>
        </label>
      </p>
    </section>
  </div>
</template>
<script>
import { downloadCsv } from 'Utils'
export default {
  props: ['sel', 'parent'],
  data() {
    return {
      exportType: 1
    }
  },
  methods: {
    _submit() {
      let sel = [],
        obj = {}
      this.sel.forEach(el => {
        if (el._level == 2) {
          if (
            obj[el.parent.sellerSku] &&
            obj[el.parent.sellerSku].childs.indexOf(el) == -1
          ) {
            obj[el.parent.sellerSku].childs.push(el)
          } else {
            obj[el.parent.sellerSku] = {
              ...el.parent,
              childs: [el]
            }
          }
        } else {
          obj[el.sellerSku] = { ...el }
          if (el.childs) {
            obj[el.sellerSku].childs = el.childs.filter(
              e => this.sel.indexOf(e) > -1
            )
          }
        }
      })
      sel = Object.values(obj)
      const list = sel.map(el => {
        let {
          sellerSku,
          asin,
          fnsku,
          avgSales,
          expectedSale,
          fbaInventory,
          storeId,
          listSMP,
          childs,
          variationType,
          needReplenishNum
        } = el
        const parentFlag = variationType == 1
        listSMP = listSMP.map(e => ({ ...e, needReplenishNum }))
        childs &&
          (childs = childs.map(e => {
            let {
              sellerSku,
              asin,
              fnsku,
              avgSales,
              expectedSale,
              fbaInventory,
              variantsFlag,
              storeId,
              listSMP,
              needReplenishNum
            } = e
            listSMP = listSMP.map(e => ({ ...e, needReplenishNum }))
            return {
              sellerSku,
              asin,
              fnsku,
              avgSales,
              expectedAvgSales: expectedSale,
              fbaInventory,
              variantsFlag,
              storeId,
              listSMP
            }
          }))
        return {
          sellerSku,
          asin,
          fnsku,
          expectedAvgSales: expectedSale,
          avgSales,
          fbaInventory,
          replenishQty: needReplenishNum,
          storeId,
          listSMP,
          childs,
          parentFlag
        }
      })
      const params = {
        list,
        exportType: this.exportType
      }
      return this.$api[`fba/FbaReplenishExport`](params).then(data => {
        return downloadCsv(data).then(() => {
          if (this.exportType) {
            this.$router.replace('/shopManage/fba/reprecord')
          }
          return Promise.resolve('close')
        })
      })
    }
  }
}
</script>
<style lang="scss" scoped>
span {
  font-size: 12px;
  color: #999;
  margin: 10px 0 0 18px;
  display: block;
}
</style>