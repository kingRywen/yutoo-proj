<template lang="html">
    <section>
        <el-table :data="tableData" border style="width: 100%" height="240">
            <el-table-column prop="batchNumber" label="批次号" width="160" align='center'></el-table-column>
            <el-table-column prop="sku" label="sku" width="130" align='center'></el-table-column>
            <el-table-column prop="confirmTime" label="发货时间" width="150" align='center'></el-table-column>
            <el-table-column prop="shipped" label="数量" width="80" align='center'></el-table-column>
            <el-table-column prop="price" label="价格" width="80" align='center'></el-table-column>
            <el-table-column prop="receiveDate" label="预计到货时间" width="150" align='center'></el-table-column>
        </el-table>
    </section>
</template>

<script>
export default {
  props: {
    tableData: {
      type: Array,
      default() {
        return new Array();
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
