<template>
  <div style="height:100%" v-if="info">
    <!-- 平台信息 -->
    <el-tabs
      ref="tab"
      :tab-position="'left'"
      style="height: 100%;"
      type="border-card"
      v-model="name"
      class="info____tab"
    >
      <el-tab-pane
        v-for="(item, index) in info"
        :label="item.languageName"
        :key="item.languageName"
        :name="item.languageName"
        :disabled="item.productPltDetailId == null"
        style="height:100%;overflow: auto"
        lazy
      >
        <keep-alive>
          <component ref="com" :is="`langForms`" :show="$attrs.disable" :lang-info="item"></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <!-- 平台信息 -->
  </div>
</template>

<script>
import { Tabs, TabPane } from 'element-ui'
import Vue from 'vue'
import { fetchData } from 'common/common'
import { getQueryString } from 'common/util'
import apis from 'apis'
import langForms from './langForms'

Vue.use(Tabs)
Vue.use(TabPane)

export default {
  inheritAttrs: false,
  props: ['isVariant', 'languageId', 'info'],
  components: {
    langForms
  },

  data() {
    return {
      name: '英语',
      tabStyle: {},
      siteList: {}, // 站点信息
      parent: {}, // 公共字段
      moduleDifferenceList: {}, // 公共差异字段
      variant: {}, // 变体公共模板字段

      allData: {
        parent: {},
        variant: [],
        siteList: [],
        variantMap: {},
        parentMap: {}
      } // 传服务器数据
    }
  },
  watch: {
    languageId(val) {
      if (val != null) {
        this.name = this.info.find(el => el.languageId === val).languageName
      }
    }
  }
}
</script>

<style>
.fixTab__height__auto .el-tabs__content {
  height: 100%;
  overflow: auto;
  margin-right: 14px;
  margin-top: 20px;
}
.info____tab .el-tabs__content {
  height: 100%;
}
</style>
