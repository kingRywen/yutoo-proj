<template>
  <ElTabs @tab-click="TogglePlat" type="card" v-model="activePlat" class="wrapper">
    <ElTabPane lazy v-for="item in platformList" :label="item.label" :key="item.label" :name="item.value">
      <Content v-if="activePlat" :activePlat="activePlat" />
    </ElTabPane>
  </ElTabs>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Content from './content'
export default {
  components: { Content },
  data() {
    return {
      activePlat: undefined
    }
  },
  created() {
    this.getPlatformList().then(() => {
      this.activePlat = this.platformList[0].value
    })
  },
  computed: {
    ...mapState(['platformList'])
  },
  methods: {
    ...mapActions(['getPlatformList']),
    TogglePlat(tab) {
      console.log(tab)
    }
  }
}
</script>
<style lang="scss" scoped>
.wrapper {
  max-width: 1100px;
  margin: 0 auto;
}
</style>