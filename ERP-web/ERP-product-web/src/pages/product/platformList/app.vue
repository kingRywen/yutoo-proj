<template>
  <v-spin :tip="`加载中...`" :spinning="spinning" style="min-height:300px;height: 100%;">
    <el-tabs type="border-card" class="product_box" v-model="active" @tab-click="handleTabClick">
      <el-tab-pane v-for="(item, index) in activePlatform" :key="index" :name="item.name" lazy>
        <span slot="label">{{item.name}}</span>
        <app-main :platform="item.platformId" ref="appmain"/>
      </el-tab-pane>
    </el-tabs>
  </v-spin>
</template>

<script>
import AppMain from './appMain'
import { fetchData, _storage } from 'common/common'
import apis from 'apis'

export default {
  components: {
    AppMain
  },
  data() {
    return {
      activePlatform: [],
      spinning: true,
      active: undefined
    }
  },
  created() {
    this.getPlatform()
  },
  methods: {
    // 搜索相应产品列表
    searchColumns(categoryId) {
      let current = this.activePlatform.find(el => el.name === this.active)
      let currentIndex = this.activePlatform.findIndex(
        el => el.name === this.active
      )
      let currentAppMain
      this.$refs.appmain.forEach(el => {
        if (el.platformId === current.platformId) {
          currentAppMain = el
        }
      })
      if (currentAppMain) {
        currentAppMain.searchColumns({
          platformId: current.platformId,
          categoryId
        })
      }
    },
    getPlatform() {
      fetchData({ ...apis.PLATFORM_LIST_ALL_ACTIVATE_PLATFORM }).then(res => {
        this.spinning = false
        if (res.data.code === 0) {
          this.activePlatform = res.data.rows
          let plat = _storage._get('session', 'platCurrentPlatform')
          if (plat) {
            this.active = plat.name
          } else {
            this.active = res.data.rows[0].name
          }
        }
      })
    },
    handleTabClick(tab) {
      let current = this.activePlatform.find(el => el.name === tab.name)
      _storage.set('session', 'platCurrentPlatform', current)
      top.vm.$children[0].refreshRightCol(current.platformId)
      // this.getTabNum(tab.name)
    }
  }
}
</script>

<style scoped>
body {
  padding: 0;
  background-color: none !important;
}
</style>
