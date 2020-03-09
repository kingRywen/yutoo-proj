<template>
  <el-tabs class="noShadow noBorder __flex h100" v-model="activeName" @tab-click="handleClick" type="border-card">
    <el-tab-pane label="常用面单" name="first">
      <CommonlyUsed/>
    </el-tab-pane>
    <el-tab-pane lazy label="自定义面单" name="second">
      <CustomUsed/>
    </el-tab-pane>
  </el-tabs>
</template>
<script>
import CommonlyUsed from './components/CommonlyUsed'
import CustomUsed from './components/CustomUsed'
export default {
  components: {
    CommonlyUsed,
    CustomUsed
  },
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab) {
      if (tab.$children[0]) {
        tab.$children[0].getList()
      }
    }
  }
}
</script>
<style lang="scss">
</style>