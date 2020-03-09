<template>
  <div style="height:100%" v-if="!base" class="viewProduct___app">
    <!-- 单页模式 -->
    <keep-alive v-if="type">
      <component is="purchaseMain" :field="formatField" :category="category" :all-info="tabInfo" :edit="true"></component>
    </keep-alive>

    <!-- 编辑标签页 -->
    <el-tabs style="height: 100%;display: flex;flex-direction: column;" type="border-card" v-model="name">
      <el-tab-pane label="基本信息" key="基本信息" name="基本信息" lazy>
        <iframe :src="src" ref="frame" frameborder="0" style="width:100%;height:700px"></iframe>
      </el-tab-pane>
      <el-tab-pane label="采购编辑" key="采购编辑" name="采购编辑" lazy>
        <iframe :src="src1" ref="frame" frameborder="0" style="width:100%;height:700px"></iframe>
      </el-tab-pane>
      <el-tab-pane v-for="(item, index) in mainTabs" :label="item.title" :key="item.title" :name="item.title" lazy>
        <component
          :is="item.component"
          :field="formatField"
          :category="category"
          :all-info="tabInfo"
          :type="type"
          :show="true"
          :info="(platformId === 1 || platformId === 3) ? info : wishInfo"
          :language-id="languageId"
          :disable="true"
          :is-variant="isVariant"
          :siteData="siteData"
          :productPltDetailId="productPltDetailId"
          :platformId="platformId"
          :review="true"

        ></component>
      </el-tab-pane>
    </el-tabs>
  </div>
  <div v-else>
    <v-card class="product_box" title="基本信息" :loading="loading">
      <iframe :src="src" ref="frame" frameborder="0" style="width:100%;height:700px"></iframe>
    </v-card>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tabs, TabPane } from 'element-ui'
import { fixFrameHeight, fetchData, setRule } from 'common/common'
import { getQueryString, isArray } from 'common/util'
import apis from 'apis'
import {getTempList} from '@/pages/product/platformList/ebayEditLists/components/common/fetch.js';

Vue.use(Tabs)
Vue.use(TabPane)

const purchaseMain = () =>
  import('../../productList/editPurchase/components/purchaseMain.vue').then(
    m => m.default
  )
const PlatformInformation = () =>
  import('../components/PlatformInformation.vue').then(m => m.default)
const EbayPlatformInformation = () =>
  import('../ebayEditLists/components/PlatformInformation.vue').then(m => m.default)
const Picture = () => import('../components/picture.vue').then(m => m.default)

export default {
  inheritAttrs: false,
  created() {
    this.type = getQueryString('type')
    this.base = getQueryString('base')
    this.productPlatformId = getQueryString('productPlatformId')
    this.isVariant = getQueryString('variant')
    this.productId = +getQueryString('productId')
    this.platformId = +getQueryString('platformId')
    this.productPltDetailId = +getQueryString('productPltDetailId')
    if (this.isVariant) {
      this.parentId = +getQueryString('parentId')
    }

    if (this.platformId !== 1  && this.platformId !== 3) {
      this.mainTabs[0].component = 'EbayPlatformInformation'
    }
    // console.log(this.isVariant)
    const src = this.isVariant
      ? '/product/productList/viewProductVariant.html'
      : '/product/productList/addProduct.html'
    this.src = `${src}?productId=${this.productId}&variant=${
      this.isVariant
    }&parentId=${this.parentId}&type=${this.type}&base=true&isshow=true`
    this.src1 = `/product/productList/editPurchase.html?productId=${
      this.productId
    }&variant=${this.isVariant}&base=${this.base}&parentId=${
      this.parentId
    }&isshow=true&type=2`

    this.getInfoData()
  },
  mounted() {
    // 获取类目信息
    this.getCategory(this.productId)
  },
  components: {
    purchaseMain,
    PlatformInformation,
    EbayPlatformInformation,
    Picture
  },
  data() {
    return {
      productPltDetailId: null,
      wishInfo: [],
      platformId: null,
      siteData: {},
      base: false,
      type: null,
      formatField: {}, // 格式化后的动态字段 ，包括 1 无差异字段， 2 有差异字段， 3 验证规则
      category: {}, // 产品类目
      tabInfo: {},
      info: {},
      languageId: null,

      src: '',
      loading: false,

      // namePurchese: "addProduct",
      name: '基本信息',
      mainTabs: [
        // {
        //   title: "采购编辑",
        //   component: "purchaseMain"
        // },
        {
          title: '平台上架信息',
          component: 'PlatformInformation'
        },
        {
          title: '图片',
          component: 'Picture'
        }
      ]
    }
  },
  methods: {
    getInfoData() {
      // wish ebay 获取信息
      if (this.platformId === 2 || this.platformId === 5) {
        this.initWishData()
        return
      }
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
          return
        }
        let { languageInfos, defaultFlag, id } = rows

        vm.info = languageInfos
        vm.languageId = id || languageInfos[0].languageId
        // if (defaultFlag === false) {
        //   vm.name = '图片'
        // }
      })
    },
    // 获取ebay wish 语种信息
    initWishData() {
      Promise.all([this.getLangInfoData(), this.getSiteInfo()]).then(res => {
        if (res.every(data => data.code === 0)) {
          // 获取到语种 站点信息
          const [infoRes, siteRes] = res
          const infoData = infoRes.rows
          // 处理语种信息，初始化
          const { languageInfos, defaultFlag, id } = infoData
          this.wishInfo = languageInfos
          this.languageId = id

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
            console.log(siteRes);
          this.siteData = siteRes
        } else {
          showToast('error', '初始化数据失败，请刷新重试')
        }
      })
    },

    // 获取wish ebay站点信息
    getSiteInfo() {
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_SITE_INFO,
        data: {
          parentFlag: this.isVariant ? 0 : 1,
          productPltDetailId: this.productPltDetailId
        }
      }).then(res => res.data)
    },
    // 获取wish ebay语种信息
    getLangInfoData() {
      return fetchData({
        ...apis.PRODUCT_PLT_DETAIL_LANGUAGE_LIST,
        data: {
          productPlatformId: this.productPlatformId,
          type: 1
        }
      }).then(res => res.data)
    },
    // 获取类目信息
    getCategory(id) {
      fetchData({
        ...apis.PRODUCT_CAT,
        data: { productId: +id }
      }).then(res => {
        console.log(res)
        this.category = res.data
      })
    },

    // 获取动态字段
    getVariantData(id) {
      fetchData({
        ...apis.PRODUCT_FIELD_PURCHASE_VARIANT_DIFFERENCE,
        data: { categoryId: id }
      }).then(res => {
        console.log(res)

        // 设置产品价格的动态字段数据
        if (res.data && res.data.priceTabField) {
          this.formatField.priceTabField = this.setField(res.data.priceTabField)
        }

        // 设置报关信息的动态字段数据
        if (res.data && res.data.entryInfoTabField) {
          this.formatField.entryInfoTabField = this.setField(
            res.data.entryInfoTabField
          )
        }

        // 存储所有数据
        this.tabInfo = res.data
      })
    },

    // 分离母体字段和差异字段
    setField(field) {
      let inputArrs = {}
      let variants = {}
      let vali = {}
      // 判断是否有分组字段
      if (!isArray(field)) {
        // 单个字段
        let arr = field.priceSingleField
        console.log(arr)
        // 分组字段
        let arr2 = []
        let arr3 = []
        let group = field.priceGroupField // 需要分组渲染的字段

        for (const key in group) {
          // 筛选差异字段
          if (group.hasOwnProperty(key)) {
            const element = group[key]
            if (element[0].variantsFlag) {
              arr3.push(element)
            } else {
              arr2.push(element)
            }

            //  设置表单验证
            element.forEach(elIn => {
              let rule = elIn.rule
              if (rule) {
                vali[elIn.displayKey] = setRule(rule)
              }
              if (elIn.requireFlag && !elIn.rule) {
                vali[elIn.displayKey] = [
                  {
                    required: true,
                    message: '不能为空'
                  }
                ]
              }
            })
          }
        }

        inputArrs = arr.filter(el => !el.variantsFlag).concat(arr2) // 母体输入字段
        variants = arr.filter(el => el.variantsFlag).concat(arr3) // 变体字段

        // 增加表单验证
        arr.forEach(el => {
          let rule = el.rule
          if (rule) {
            vali[el.displayKey] = setRule(rule)
          }
          if (el.requireFlag && !el.rule) {
            vali[el.displayKey] = [
              {
                required: true,
                message: '不能为空'
              }
            ]
          }
        })
      } else {
        let arr = field

        inputArrs = arr.filter(el => !el.variantsFlag) // 母体输入字段
        variants = arr.filter(el => el.variantsFlag) // 变体字段

        // 增加表单验证
        arr.forEach(el => {
          let rule = el.rule
          if (rule) {
            vali[el.displayKey] = setRule(rule)
          }
          if (el.requireFlag && !el.rule) {
            vali[el.displayKey] = [
              {
                required: true,
                message: '不能为空'
              }
            ]
          }
        })
      }

      return {
        inputArrs,
        variants,
        vali
      }
    }
  },
  updated() {
    fixFrameHeight(1)
  },
  watch: {
    // 监控类目获取类目的动态字段
    category(val) {
      this.getVariantData(val.categoryId)
    }
  }
}
</script>

<style lang='less'>
@import '~assets/style/variables.less';

body {
  height: 100%;
}

.purchase_box {
  overflow: auto;
  height: 560px;
}

// .vue-tabs {
//   width: 120px @iehack;
//   height: 100%;
//   display: table @iehack;
//   justify-content: center @iehack;
//   .tab-content {
//     height: 100%;
//   }
//   .left-vertical-tabs {
//     display: table-cell @iehack;
//     // float: left;
//     min-width: 126px;
//     background: @sub-title-color;
//     border-right: 1px solid @sub-title-color-border;
//     .nav-tabs {
//       border: none;
//       font-size: 14px;
//       li {
//         a {
//           margin-right: 0;
//           &:active,
//           &:hover,
//           &:focus,
//           &:visited {
//             border-color: transparent;
//             background-color: @title-color;
//             background: linear-gradient(
//               to left,
//               @title-color,
//               lighten(@title-color, 20%)
//             );
//             color: gray;
//             border-radius: 0;
//           }
//         }
//         &.active {
//           a {
//             border-color: transparent;
//             background-color: @title-color;
//             background: linear-gradient(
//               to left,
//               @title-color,
//               lighten(@title-color, 20%)
//             );
//             color: @bg-color;
//             border-radius: 0;
//           }
//         }
//       }
//     }
//   }
//   .tab-content {
//     display: table-cell @iehack;
//     flex: auto;
//     // float: left@iehack;

//     .tab-container {
//       width: 100%;
//       height: 100%;
//       .product_box.ant-card {
//         height: 100%;
//         border: none;
//         .ant-card-head {
//           height: 42px;
//           line-height: 42px;
//         }
//       }
//     }
//   }
// }
.viewProduct___app {
  .el-tabs__content {
    height: 100%;
    .el-tab-pane {
      height: 100%;
      overflow: auto;
      .el-tabs__content {
        overflow: auto;
      }
    }
  }
}
</style>
