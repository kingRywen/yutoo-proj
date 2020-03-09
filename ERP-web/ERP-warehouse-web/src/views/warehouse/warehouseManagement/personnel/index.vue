<template>
  <div class="personel">
    <el-tabs v-model="activeName" type="card">
      <el-tab-pane label="仓库管理人员" name="warehouseManager">
        <common v-if="activeName == 'warehouseManager'" :types="1"></common>
      </el-tab-pane>
      <el-tab-pane label="拣货人员管理" name="orderManager">
        <common v-if="activeName == 'orderManager'" :types="2"></common>
      </el-tab-pane>
      <el-tab-pane label="包装人员管理" name="packageManager">
        <common v-if="activeName == 'packageManager'" :types="3"></common>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from './common/index'
export default {
  data() {
    return {
      activeName: 'warehouseManager'
    }
  },
  components: {
    common
  }
}
</script>

<style lang='scss'>
.personel {
  height: 100%;
  overflow: hidden;
  .el-tabs__content {
    height: 100%;
  }
  .el-tabs--card {
    height: 100%;
  }
}
</style>