<template>
  <div class="business-policy">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabs">
      <el-tab-pane label="付款模板" name="paymentTemplate">
        <template v-if="activeName == 'paymentTemplate'">
          <common type="1"></common>
        </template>
      </el-tab-pane>
      <el-tab-pane label="退货政策" name="returnsPolicy">
        <template v-if="activeName == 'returnsPolicy'">
          <common type="2"></common>
        </template>
      </el-tab-pane>
      <el-tab-pane label="买家条件" name="buyerConditions">
        <template v-if="activeName == 'buyerConditions'">
          <common type="3"></common>
        </template>
      </el-tab-pane>
      <el-tab-pane label="运输方式" name="transportaionMode">
        <template v-if="activeName == 'transportaionMode'">
          <common type="4"></common>
        </template>
      </el-tab-pane>
      <el-tab-pane label="刊登偏好" name="publishedPreference">
        <template v-if="activeName == 'publishedPreference'">
          <common type="5"></common>
        </template>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import common from './common'
export default {
  data() {
    return {
      activeName: 'paymentTemplate'
    }
  },
  methods: {
    handleClick() {
      // if (tab.name = 'paymentTemplate') {
      // }
    }
  },
  components: {
    common
  }
}
</script>

<style lang='scss'>
.business-policy {
  background: #fff;
}
</style>