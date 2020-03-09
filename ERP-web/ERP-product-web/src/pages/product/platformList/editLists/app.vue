<template>
  <div style="height:100%" v-if="showTab">
    <!-- {{info}} -->
    <!-- 平台信息，图片 -->
    <el-tabs
      ref="tab"
      type="border-card"
      v-model="name"
      class="__flex__column___ fixedHeight"
      style="padding-bottom: 0;"
    >
      <el-tab-pane
        v-for="(item, index) in tabs1"
        :label="item.title"
        :key="item.title"
        :name="item.title"
        :class="item.title === '___pic' ? '' : ''"
        :style="{paddingBottom: name !== '图片' ? 0 : '50px'}"
        lazy
      >
        <keep-alive>
          <component ref="com" :is="item.component" :is-variant="isVariant" :info="info" :language-id="languageId"></component>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
    <!-- 平台信息，图片 -->
    <div class="saveBtn" style="left: 0 !important;" v-if="name === '图片' && !isVariant">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="name === '图片' && !isVariant" @click.prevent="submit(1)">提交</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { Tabs, TabPane } from 'element-ui'
import Vue from 'vue'

Vue.use(Tabs)
Vue.use(TabPane)

// 异步组件
const PlatformInformation = () =>
  import('../components/PlatformInformation.vue').then(m => m.default)
const Picture = () => import('../components/picture.vue').then(m => m.default)
import bus from 'common/bus'
import apis from 'apis'
import { fetchData, showToast, toParamUrl } from 'common/common'
import { getQueryString } from 'common/util'

export default {
  components: {
    PlatformInformation,
    Picture,
    Tabs,
    TabPane
  },

  created() {
    this.info = getQueryString('info')
    this.img = getQueryString('img')
    this.showimg = getQueryString('showimg')
    this.isshow = getQueryString('isshow')
    this.productPlatformId = getQueryString('productPlatformId')
    // if (this.img) {
    //   this.tabs[1].show = true
    // }
    if (!this.isshow) {
      this.tabStyle = {
        paddingBottom: '50px'
      }
    }
    this.isVariant = getQueryString('variant')

    this.getInfoData()

    // if (this.showimg) {
    //   this.name = '图片'
    // } else {
    //   this.name = '平台信息'
    // }
  },

  data() {
    return {
      showTab: false,
      tabStyle: {},
      name: '平台信息',
      info: [],
      languageId: null,
      tabs: [
        {
          title: '平台信息',
          component: 'PlatformInformation',
          dataName: 'f',
          show: true
        },
        {
          title: '图片',
          component: 'Picture',
          dataName: 'w',
          show: true
        }
      ]
    }
  },
  methods: {
    getInfoData() {
      let vm = this
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_LANGUAGE_LIST,
        data: {
          productPlatformId: this.productPlatformId,
          type: 1
        }
      }).then(res => {
        let { code, msg, rows } = res.data
        if (code !== 0) {
          showToast('error', msg)
          vm.showTab = true
          return
        }
        let { languageInfos, defaultFlag, id } = rows

        vm.info = languageInfos
        vm.languageId = id
        if (id) {
          vm.name = '平台信息'
        } else {
          vm.name = '图片'
        }
        vm.showTab = true
      })
    },
    onTabClick(tabIndex, newTab, oldTab) {
      this.name = this.tabs[tabIndex].component
    },
    translate() {},
    save(type) {
      if (type == 1) {
        // 变体保存
        console.log('变体保存')
        bus.$emit('saveVariant')
      } else {
        // 母体保存
        console.log('母体保存')
        bus.$emit('save')
      }
    },
    submit(type) {
      if (type == 1) {
        // 图片提交
        fetchData({
          ...apis.PRODUCT_IMAGE_COMMIT,
          data: { productPlatformId: +getQueryString('productPlatformId') }
        }).then(res => {
          if (res.data.code === 0) {
            showToast('success', res.data.msg)
            toParamUrl('/product/platformList.html')
          } else {
            showToast('error', res.data.msg)
          }
        })
      }
      if (type == 2) {
        // 平台信息提交
        bus.$emit('submit')
      }
    }
  },
  computed: {
    tabs1() {
      return this.tabs.filter(el => el.show)
    }
  }
}
</script>

<style lang="less">
.saveBtn {
  position: fixed;
  width: 100%;
  text-align: center;
  bottom: 0;
  left: 126px;
  background: #f7f7f7;
  z-index: 222;
  padding: 8px;
  box-sizing: border-box;
  button {
    width: 160px;
  }
}
.fixTab__height__auto .el-tabs__content {
  height: 600px;
  overflow: auto;
  margin-right: 14px;
  margin-top: 20px;
}
</style>
