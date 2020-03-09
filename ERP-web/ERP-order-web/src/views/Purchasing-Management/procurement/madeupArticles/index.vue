<template lang="html">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabs">
        <el-tab-pane label="成品加工订单列表" name="first">
            <goodProductsList ref="goodProductsList"/>
        </el-tab-pane>
        <el-tab-pane label="待加工产品" name="second">
            <awaitHandleList ref="awaitHandleList"/>
        </el-tab-pane>
        <el-tab-pane label="加工明细" name="third">
            <processingDetails ref="processingDetails"/>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
/* eslint-disable */
import goodProductsList from './goodProductsList/goodProductsList'
import awaitHandleList from './awaitHandleList/awaitHandleList'
import processingDetails from './processingDetails/processingDetails'

export default {
  data() {
    return {
      activeName: 'first'
    }
  },
  methods: {
    handleClick(tab, event) {
      this.getList(tab.name)
    },
    getList(val) {
      switch (val) {
        case 'first':
          this.$refs.goodProductsList.getList(1)
          this.$router.push({
            path: '/purchasingManagement/procurement/madeupArticles'
          })
          break
        case 'second':
          this.$refs.awaitHandleList.getList(1)
          break
        case 'third':
          this.$refs.processingDetails.getList(1)
          this.$refs.processingDetails.gethandleUserlist()
          break
      }
    }
  },
  mounted() {
    this.getList('first')
  },
  components: {
    goodProductsList,
    awaitHandleList,
    processingDetails
  }
}
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
</style>
