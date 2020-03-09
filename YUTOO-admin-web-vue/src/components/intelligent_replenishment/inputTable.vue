<template lang="html">
    <section class="inputTable">
        <el-table :data="tableData" border style="width: 100%" :row-class-name="tableRowClassName" :height="isH ? null :'240'">
            <!-- <el-table-column prop="transportName" label="运输方式" width="80" align='center' :formatter="_formatter"/> -->
            <el-table-column label="运输方式" width="80" align='center'>
                <template slot-scope="scope">
                    <p v-if="scope.row.transportName">{{scope.row.transportName | _formatData}}</p>
                    <p v-else>{{scope.row.transportFirstName | _formatData}}</p>
                </template>
            </el-table-column>
            <el-table-column label="准备天数" width="130" align='center'>
                <template slot-scope="scope">
  <p>运输天数：{{scope.row.transportDays | _formatData}}</p>
  <p>保底运输天数：{{scope.row.insuredDays | _formatData}}</p>
</template>
            </el-table-column>
            <el-table-column prop="stockDays" label="备货天数" width="80" align='center' :formatter="_formatter"/>
            <el-table-column prop="availableDayCount" label="可售天数" width="80" align='center' :formatter="_formatter"/>
            <el-table-column prop="lackDayCount" label="缺货天数" width="80" align='center' :formatter="_formatter"/>
            <el-table-column label="补货详情" width="80" align='center'>
                <template slot-scope="scope">
  <p>
    <!-- 在补 -->
    <div v-if="scope.row.remainingDays != null">
      <span style="color:#00CCFF;">{{scope.row.remainingDays | _formatData}}</span>天</p>
  <el-button plain size="mini">{{scope.row.batchReplenishCount | _formatData}}</el-button>
  </div>
  <div v-else>
    <el-button plain size="mini">{{scope.row.needCount | _formatData}}</el-button>
  </div>

  <!-- <el-button type="info" size="mini">5</el-button> -->
</template>
            </el-table-column>
        </el-table>
    </section>
</template>
<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        // return new Array();
        return [
          {
            replenishTransportDescId: 0,
            asin: "-",
            batchNumber: "",
            availableDayCount: 0,
            availableStock: 0,
            lackDayCount: 0,
            lackCount: 0,
            batchReplenishCount: 0,
            replenishCount: 0,
            needCount: 0,
            firstFlag: 0,
            sorting: 0,
            standardFlag: 0,
            formulaId: "-",
            replenishProductId: 0,
            transportFirstId: 0,
            createTime: null,
            transportFirstName: "-",
            remainingDays: null,
            transportDays: 0,
            insuredDays: 0,
            stockDays: 0
          }
        ];
      }
    },
    isH: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    tableRowClassName({ row, rowIndex }) {
      if (!row.batchNumber || row.batchNumber === "") {
        return "____warning-row";
      }
      return "";
    }
  }
};
</script>

<style lang="scss">
.el-table .____warning-row {
  //   background: oldlace;
  color: rgb(192, 192, 192);
}
</style>
