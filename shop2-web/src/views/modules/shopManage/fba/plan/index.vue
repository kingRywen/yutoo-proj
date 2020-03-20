<template>
  <ElTabs type="card" v-model="activename">
    <ElTabPane name="first" label="货件" lazy>
      <Hou />
    </ElTabPane>
    <ElTabPane name="second" label="入库计划" lazy>
      <PlanInfo />
    </ElTabPane>
  </ElTabs>
</template>
<script>
import Hou from './huo'
import PlanInfo from './planInfo'
export default {
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