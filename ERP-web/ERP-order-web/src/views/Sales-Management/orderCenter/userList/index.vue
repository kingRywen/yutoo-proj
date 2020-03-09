<template>
  <!-- 黑白名单用户 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabs">
    <el-tab-pane label="黑名单用户" name="first">
      <blackWhiteList type="0" ref="blackWhiteList1"/>
    </el-tab-pane>
    <el-tab-pane label="白名单用户" name="second">
      <blackWhiteList type="1" ref="blackWhiteList2"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
/* eslint-disable */
import blackWhiteList from './blackWhiteList/blackWhiteList'
export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == 'first') {
        this.$refs.blackWhiteList1.getList()
      } else {
        this.$refs.blackWhiteList2.getList()
      }
    }
  },
  components: {
    blackWhiteList
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.blackWhiteList1.getList()
    })
  }
}
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
</style>
