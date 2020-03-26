<template>
  <div>
    <ElTabs type="card" v-model="activename">
      <ElTabPane name="first" label="货件" lazy>
        <Hou />
      </ElTabPane>
      <ElTabPane name="second" label="入库计划" lazy>
        <PlanInfo />
      </ElTabPane>
    </ElTabs>
    <el-dropdown class="anay" @command="handleCommand">
      <span class="el-dropdown-link">
        <!-- <i class="iconfont">&#xe60e;</i> -->
        <el-button type="text" style="padding: 0" icon="iconfont icongongju"></el-button>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="f">FBA管理</el-dropdown-item>
        <el-dropdown-item command="c">补货记录</el-dropdown-item>
        <el-dropdown-item command="d">发货计划</el-dropdown-item>
        <el-dropdown-item command="a">生命周期管理</el-dropdown-item>
        <el-dropdown-item command="b">运输方式</el-dropdown-item>
        <el-dropdown-item command="e">设置滞销预警天数</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import dropdownMixin from '../dropdown-mixin'

import Hou from './huo'
import PlanInfo from './planInfo'
export default {
  mixins: [dropdownMixin],
  components: {
    Hou,
    PlanInfo
  },
  data() {
    return {
      activename: this.$route.query.active || 'first'
    }
  },
  watch: {
    activename(val) {
      this.$router.replace({
        path: this.$route.path,
        query: {
          active: val
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.anay {
  position: absolute;
  right: 23px;
  top: -20px;
  /deep/ i {
    font-size: 24px;
  }
}
</style>