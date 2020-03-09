<template>
  <div style="height:100%" v-if="showTab && !error">
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
          <component
            ref="com"
            :is="item.component"
            :is-variant="isVariant"
            :review="isReview"
            :info="info"
            :siteData="siteData"
            :language-id="languageId"
            :productPltDetailId="productPltDetailId"
            :platformId="platformId"
          ></component>
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
  <None v-else-if="error"/>
</template>

<script>
import bus from 'common/bus'
import apis from 'apis'
import { fetchData, showToast, toParamUrl } from 'common/common'
import { getQueryString } from 'common/util'
import {getTempList} from './components/common/fetch';

export default {
  components: {
    PlatformInformation: () => import('./components/PlatformInformation.vue'),
    Picture: () => import('../components/picture.vue'),
    None: () => import('@/components/base/None')
  },

  created() {
    // 显示图片还是编辑信息
    this.showimg = getQueryString('showimg')
    // 展示不能编辑
    this.isshow = getQueryString('isshow')
    // 审核模式，有审核提示
    this.isReview = getQueryString('review')
    // 是否变体
    this.isVariant = getQueryString('variant')
    // 平台产品id
    this.productPlatformId = getQueryString('productPlatformId')
    // 平台详情id
    this.productPltDetailId = getQueryString('productPltDetailId')
    // 平台id
    this.platformId = getQueryString('platformId')
    // 初始化数据
    this.initData()
    if (!this.isshow) {
      this.tabStyle = {
        paddingBottom: '50px'
      }
    }
  },

  data() {
    return {
      // 站点信息
      siteData: {},
      error: false,
      showTab: true,
      platformId: null,
      tabStyle: {},
      name: '平台信息',
      isVariant: false,
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
    initData() {
      Promise.all([this.getInfoData(), this.getSiteInfo()]).then(res => {
        if (res.every(data => data.code === 0)) {
          // 获取到语种 站点信息
          const [infoRes, siteRes] = res
          const infoData = infoRes.rows
          // 处理语种信息，初始化
          const { languageInfos, defaultFlag, id } = infoData
          this.info = languageInfos
          this.languageId = id
          if (id) {
            this.name = '平台信息'
          } else {
            this.name = '图片'
          }
          // this.showTab = true

          // 传递站点信息
          siteRes.siteList &&
            siteRes.siteList.forEach(site => {
              let { siteCategoryInfo, categoryId } = site.siteInfo
              siteCategoryInfo = siteCategoryInfo ? siteCategoryInfo.split(',').map(el => +el) : []
              site.siteInfo.tempList = []
              site.siteInfo.selectedCate = siteCategoryInfo
              site.siteInfo.selectedCate1 = null
              if (siteCategoryInfo.length) {
                getTempList(categoryId, site)
              }
            })
          this.siteData = siteRes
        } else {
          showToast('error', '初始化数据失败，请刷新重试')
        }
      })
    },

    // 获取站点信息
    getSiteInfo() {
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_SITE_INFO,
        data: {
          parentFlag: this.isVariant ? 0 : 1,
          productPltDetailId: this.productPltDetailId
        }
      }).then(res => res.data)
    },
    // 获取语种信息
    getInfoData() {
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_LANGUAGE_LIST,
        data: {
          productPlatformId: this.productPlatformId,
          type: 1
        }
      }).then(res => res.data)
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
