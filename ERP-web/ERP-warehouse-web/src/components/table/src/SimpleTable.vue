<template>
  <div class="simple-table">
    <el-row>
      <el-col :span="24" class="table-head">{{ label }}</el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="table-content">
        <slot></slot>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'simple-table',
  props: {
    label: {
      type: String,
      default: () => {
        return '默认'
      }
    }
  },
  data() {
    return {}
  }
}
</script>

<style lang="scss">
.simple-table {
  border: 1px solid rgba(242, 242, 242, 1);
  margin-bottom: 10px;
  .table-head {
    height: 33px;
    line-height: 33px;
    padding: 0 10px;
    background: rgba(242, 242, 242, 1);
  }
  .table-content {
    padding: 10px;
  }
}
</style>
