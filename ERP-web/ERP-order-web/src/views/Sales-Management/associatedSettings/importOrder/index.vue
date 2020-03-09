<template>
  <!-- 批量导入订单 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabs">
    <el-tab-pane label="批量导入订单" name="first">
      <bulkimport/>
    </el-tab-pane>
    <el-tab-pane label="查看导单日志" name="second">
      <record ref="record"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
/* eslint-disable */
import record from './record'
import bulkimport from './bulkimport'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == 'second') {
        this.$refs.record.getList()
        this.$refs.record.getUser()
      }
    }
  },
  components: {
    record,
    bulkimport
  }
}
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
</style>
