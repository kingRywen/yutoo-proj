<template>
  <!-- <el-tabs v-model="code">
    <el-tab-pane
      lazy
      v-for="item in $store.state.platformList"
      :key="item.code"
      :label="item.cnName"
      :name="item.platformSiteId"
    >
      <moneySettingInfo :code="code" />
    </el-tab-pane>
  </el-tabs>-->
  <moneySettingInfo ref="info" :code="code" />
</template>
<script>
import moneySettingInfo from './moneySettingInfo'
export default {
  components: {
    moneySettingInfo
  },
  data() {
    return {
      code: this.$store.state.currentSiteInfo.platformCode
    }
  },
  methods: {
    _submit() {
      return this.$refs.info._submit()
    }
  },
  computed: {
    currentSiteInfo() {
      return this.$store.state.currentSiteInfo
    }
  }
}
</script>