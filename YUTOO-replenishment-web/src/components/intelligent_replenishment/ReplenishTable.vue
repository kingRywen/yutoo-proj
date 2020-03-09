<template>
  <section>
    <el-table :data="tableData" border style="width: 100%" height="200">
      <template v-if="!type">
        <el-table-column prop="batchNumber" label="批次号" width="160" align="center" :formatter="_formatter"></el-table-column>
        <el-table-column prop="createTime" label="补货时间" width="180" align="center" :formatter="_formatter"></el-table-column>
        <el-table-column prop="batchReplenishCount" label="数量" width="80" align="center" :formatter="_formatter"></el-table-column>
        <el-table-column prop="remainingDays" label="备货剩余天数" width="120" align="center" :formatter="_formatter"></el-table-column>
      </template>
      <template v-else-if="type === 'produce'">
        <el-table-column prop="batchNumber" label="批次号" width="160" align="center" :formatter="_formatter"></el-table-column>
        <el-table-column prop="startProduceTime" label="生产开始日期" width="120" align="center" :formatter="_formatterData"></el-table-column>
        <el-table-column prop="endProduceTime" label="生产结束日期" width="120" align="center" :formatter="_formatterData"></el-table-column>
        <el-table-column prop="produceCount" label="生产数量" width="120" align="center" :formatter="_formatter"></el-table-column>
        <el-table-column prop="deliveryCount" label="交货数量" width="120" align="center" :formatter="_formatter"></el-table-column>
      </template>
    </el-table>
  </section>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        // "batchNumber": "FEE845418ABDE9E2",//批次号
        // "produceCount": 20,//生产数量
        // "deliveryCount": 0,//交货数量
        // "startProduceTime": "2019-01-04 17:03:13",//生产开始时间
        // "endProduceTime": "2019-02-07 00:00:00"//生产结束时间
        // return [
        //   {
        //     replenishTransportDescId: 2030,
        //     asin: "B015DN5TIQ",
        //     batchNumber: "08644391857E1809",
        //     availableDayCount: -1,
        //     availableStock: -1,
        //     lackDayCount: 16,
        //     lackCount: -1,
        //     batchReplenishCount: 100,
        //     replenishCount: 300,
        //     needCount: -1,
        //     firstFlag: 0,
        //     sorting: 8,
        //     standardFlag: 0,
        //     formulaId: "",
        //     replenishProductId: 137,
        //     transportFirstId: 4,
        //     createTime: "2018-06-29 00:00:00",
        //     transportFirstName: "海运-悠扬国际",
        //     remainingDays: null,
        //     transportDays: -1,
        //     insuredDays: -1,
        //     stockDays: -1
        //   }
        // ];
        return new Array()
      }
    },
    type: {
      type: String
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
