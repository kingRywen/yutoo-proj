<template>
  <div style="height:100%" class="fix_tabs_height">
    <el-tabs
      :tab-position="'left'"
      style="height: 100%;"
      type="border-card"
      v-model="name"
      stretch
      :before-leave="handlerTabLeave"
      @tab-click="handlerTabClick"
    >
      <el-tab-pane
        v-for="(item, index) in tabs"
        :label="item.title"
        :key="item.title"
        :name="item.title"
        lazy
        :class="{'cantUse': !sku}"
        style="height: 100%;"
      >
        <v-card noHovering class="product_box" :title="item.title" :loading="loading">
          <keep-alive>
            <component
              ref="com"
              :is="item.component"
              v-bind="{category, allData,formatField:field, allInfo, tabInfo:allInfo, type, show, parentId}"
              :data.sync="allData[item.dataName || name]"
              :cate.sync="catelogy"
              :tabdata.sync="tabInfo"
              :flag.sync="flag"
              :is-purchase="true"
              :is-variant="isVariantShow"
              :parent-id="parentId"
              @toggle-tab="handleToggle"
            ></component>
          </keep-alive>
        </v-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tabs, TabPane } from 'element-ui'
import { fixFrameHeight, fetchData, _storage, showConfirm } from 'common/common'
import { getQueryString } from 'common/util'
import apis from 'apis'
import _isEqual from 'lodash/isEqual'

Vue.use(Tabs)
Vue.use(TabPane)

// 异步组件
const VariantState = () => import('./VariantState.vue').then(m => m.default)
const productPrice = () => import('./productPriceMain.vue').then(m => m.default)
const ProductHeaderSetting = () =>
  import('./ProductHeaderSetting.vue').then(m => m.default)
const CustomsDeclarationMain = () =>
  import('./CustomsDeclarationMain.vue').then(m => m.default)
const AddingFinishedProducts = () =>
  import('./AddingFinishedProductsMain.vue').then(m => m.default)
const RelatedPictures = () =>
  import('../../addProduct/components/RelatedPictures.vue').then(m => m.default)

export default {
  inheritAttrs: false,
  props: ['field', 'category', 'allInfo', 'isVariantShow'],
  components: {
    VariantState,
    productPrice,
    ProductHeaderSetting,
    CustomsDeclarationMain,
    AddingFinishedProducts,
    RelatedPictures
  },
  created() {
    this.isVariant = getQueryString('variant')
    this.type = getQueryString('type')
    this.show = !!getQueryString('isshow')

    if (this.isVariant || this.isVariantShow) {
      console.log('变体浏览')
      this.tabs = [
        {
          title: '产品价格',
          component: 'productPrice',
          dataName: 'priceTab'
        },
        {
          title: '相关图片',
          component: 'RelatedPictures',
          dataName: 'imgTab'
        },
        {
          title: '报关信息',
          component: 'CustomsDeclarationMain',
          dataName: 'entryInfoTab'
        },
        {
          title: '添加成品原料',
          component: 'AddingFinishedProducts'
        },
        {
          title: '产品头程设置',
          component: 'ProductHeaderSetting',
          dataName: 'ProductHeaderSetting'
        }
      ]
      this.name = '产品价格'

      // 获取变体的数据供后面展示tab页用
      this.getVariant(+getQueryString('productId'))
    }
  },
  data() {
    let vm = this
    return {
      flag: 0, // 是否加入规格参数
      type: null,
      show: null,
      parentId: null,

      // 切换标签之前的钩子
      handlerTabLeave(activeName, oldActiveName) {
        console.log(activeName, oldActiveName)
        // 报关信息
        if (activeName === '报关信息') {
          let _el = vm.$refs.com.find(
            el => el.$options._componentTag === 'CustomsDeclarationMain'
          )
          _el && _el.getPricePercent()
        }

        // 检查产品价格和报关信息数据是否更新
        // 有更新的话提示保存
        if (oldActiveName === '产品价格' || oldActiveName === '报关信息') {
          // let arrs = ['CustomsDeclarationMain', 'productPrice']
          let _el = vm.$refs.com.find(el => {
            return oldActiveName === '产品价格'
              ? el.$options._componentTag === 'productPrice'
              : el.$options._componentTag === 'CustomsDeclarationMain'
          })

          if (!_isEqual(_el.originData, JSON.stringify(_el.getOriginData()))) {
            return Promise.resolve().then(() => {
              return new Promise((resolve, reject) => {
                showConfirm({
                  title: '提示',
                  content: `是否保存 <span style="color:red;font-weight:bolder">${oldActiveName}</span> 的数据?`,
                  onOk() {
                    _el.save().then(res => {
                      if (res.data.code === 0) {
                        resolve()
                        vm.$nextTick(() => {
                          _el.originData = JSON.stringify(_el.getOriginData())
                        })
                      } else {
                        resolve()
                      }
                    })
                    // debugger
                  },
                  onCancel() {
                    resolve()
                  }
                })
              })
            })
          }
        }
      },

      allData: {
        //所有要提交的数据
        variantTab: {
          variantFlag: null
          // productVariantList: []
        },
        entryInfoTab: {
          parentEntryInfoEntity: {},
          variantEntryInfoEntityList: []
        }
      },

      catelogy: {}, // 选择的类目

      tabInfo: {}, // tab页的详细情况
      loading: false,
      name: '变体状态',
      tabs: [
        {
          title: '变体状态',
          component: 'VariantState',
          dataName: 'variantTab'
        },
        {
          title: '产品价格',
          component: 'productPrice',
          dataName: 'priceTab'
        },
        {
          title: '相关图片',
          component: 'RelatedPictures',
          dataName: 'imgTab'
        },
        {
          title: '报关信息',
          component: 'CustomsDeclarationMain',
          dataName: 'entryInfoTab'
        },
        {
          title: '添加成品原料',
          component: 'AddingFinishedProducts'
        },
        {
          title: '产品头程设置',
          component: 'ProductHeaderSetting',
          dataName: 'ProductHeaderSetting'
        }
      ]
    }
  },
  methods: {
    // tab 被选中时触发
    handlerTabClick(tabInstance) {
      console.log(tabInstance)
      this.$nextTick(() => {
        setTimeout(() => {
          let _vm = tabInstance.$children[0].$children[0]
          let data = _vm.ruleForm
          if (tabInstance.paneName === '产品价格') {
            _storage.set('session', 'purchase_price_data', data)
          }
          if (tabInstance.paneName === '报关信息') {
            _storage.set('session', 'purchase_header_data', data)
            // debugger;
            if (_vm.ruleForm) {
              let price = (
                (_storage._get(
                  'session',
                  'purchase.productSupplierPriceEntityList.0.supplierPrice'
                ) *
                  40) /
                100
              ).toFixed(2)
              if (price === '0.00') {
                price = ''
              }
              let form = _vm.ruleForm
              // debugger;
              if (
                form.main &&
                form.main.productEntryPriceEntityList &&
                form.main.productEntryPriceEntityList.length &&
                !form.main.productEntryPriceEntityList[0].entryInfoPrice
              ) {
                form.main.productEntryPriceEntityList[0].entryInfoPrice = price
              }

              _vm.priceOrigin = price

              for (const key in form) {
                if (form.hasOwnProperty(key)) {
                  const element = form[key]
                  if (key === 'main') {
                    continue
                  }
                  if (
                    element &&
                    element.productEntryPriceEntityList &&
                    element.productEntryPriceEntityList.length
                  ) {
                    element.productEntryPriceEntityList[0].entryInfoPrice =
                      price ||
                      form.main.productEntryPriceEntityList[0].entryInfoPrice
                  }
                }
              }

              _vm.originData = JSON.stringify(_vm.getOriginData())
            }
          }
        })
      })
    },
    handleToggle() {
      this.name = '报关信息'
    },
    getVariant(id) {
      fetchData({
        ...apis.TAB_VARIANT_GET,
        data: {
          productId: id
        }
      }).then(res => {
        if (res.data.code === 0) {
          console.log(res.data)
          this.allData.variantTab.productVariantList =
            res.data.productVariantList
          this.parentId = res.data.productId
        }
      })
    },

    tabClick(tabIndex, newTab, oldTab) {
      // 判断是否存在第一步带来的sku，如果没有，后面的都不能切换

      console.log(tabIndex, newTab, oldTab)
      console.log(this.$refs.com)
      this.name = this.tabs[tabIndex].component
    }
  },
  updated() {
    fixFrameHeight(1)
  },
  watch: {
    flag(val) {
      this.allData.variantTab.variantFlag = val
    }
  },
  computed: {
    // formatField() {
    //   return this.field;
    // },
    // 监控是否有选择必填项
    sku() {
      let sku = null
      console.log(this.allData)
      try {
        sku = this.allData.variantTab.productVariantList[0].variant.sku
      } catch (e) {
        sku = null
      }
      return sku
    }
  }
}
</script>

<style lang='less'>
@import '~assets/style/variables.less';

body {
  height: 100%;
}
.vue-tabs.cantUse {
  color: #999;
  background: #ddd;
}
.vue-tabs {
  width: 120px @iehack;
  height: 100%;
  display: table @iehack;
  justify-content: center @iehack;
  .left-vertical-tabs {
    display: table-cell @iehack;
    // float: left;
    min-width: 126px;
    background: @sub-title-color;
    border-right: 1px solid @sub-title-color-border;
    .nav-tabs {
      border: none;
      li {
        a {
          margin-right: 0;
          &:active,
          &:hover,
          &:focus,
          &:visited {
            border-color: transparent;
            background-color: @title-color;
            background: linear-gradient(
              to left,
              @title-color,
              lighten(@title-color, 20%)
            );
            color: gray;
            border-radius: 0;
          }
        }
        &.active {
          a {
            border-color: transparent;
            background-color: @title-color;
            background: linear-gradient(
              to left,
              @title-color,
              lighten(@title-color, 20%)
            );
            color: @bg-color;
            border-radius: 0;
          }
        }
      }
    }
  }
  .tab-content {
    display: table-cell @iehack;
    flex: auto;
    // float: left@iehack;

    .tab-container {
      width: 100%;
      height: 100%;
      .product_box.ant-card {
        height: 100%;
        border: none;
        .ant-card-head {
          height: 42px;
          line-height: 42px;
        }
      }
    }
  }
}
</style>
