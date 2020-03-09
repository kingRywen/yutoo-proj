<template>
  <v-spin :tip="loadingTip" :spinning="spinning" style="height:100%">
    <!-- 单页模式 -->
    <keep-alive v-if="type">
      <component
        is="purchaseMain"
        :is-variant-show="isVariant"
        :field="formatField"
        :category="category"
        :all-info="tabInfo"
        :edit="true"
      ></component>
    </keep-alive>

    <!-- 编辑标签页 -->
    <el-tabs
      :tab-position="'top'"
      style="height: 100%;"
      type="border-card"
      v-else
      v-model="name"
      class="__flex__column___"
    >
      <el-tab-pane
        v-for="(item, index) in mainTabs"
        :label="item.title"
        :key="item.title"
        :name="item.title"
        lazy
        style="height:100%"
      >
        <keep-alive>
          <component
            v-if="item.component && done"
            is="purchaseMain"
            :is-variant-show="isVariant"
            :field="formatField"
            :category="category"
            :all-info="tabInfo"
            :type="type"
            :edit="true"
            style="padding-bottom: 50px"
          ></component>
          <iframe v-else :src="src" ref="frame" frameborder="0" style="width:100%;height:100%"></iframe>
        </keep-alive>
      </el-tab-pane>
    </el-tabs>
  </v-spin>
</template>

<script>
import Vue from 'vue'
import { fixFrameHeight, fetchData, setRule } from 'common/common'
import { getQueryString, isArray } from 'common/util'
import { Tabs, TabPane } from 'element-ui'
import apis from 'apis'
import bus from 'common/bus'

Vue.use(Tabs)
Vue.use(TabPane)

const purchaseMain = () =>
  import('./components/purchaseMain.vue').then(m => m.default)

export default {
  inheritAttrs: false,
  created() {
    this.type = getQueryString('type')
    this.isVariant = getQueryString('variant')
    bus.$on('product.purchaseMain.loading', ({ spinning, loadingTip }) => {
      this.spinning = spinning
      this.loadingTip = loadingTip || '保存数据中...'
    })
  },
  mounted() {
    let id = getQueryString('productId')
    if (!id) {
      id = getQueryString('storeProductId')
    }
    if (this.isVariant) {
      this.src =
        '/product/productList/editVariant.html' + window.location.search
      id = +getQueryString('parentId')
    } else {
      this.src =
        '/product/productList/addProduct.html' +
        window.location.search +
        '&type=1'
    }

    this.id = id
    // 获取类目信息
    this.getCategory(id)
  },
  components: {
    purchaseMain,
    TabPane,
    Tabs
  },
  data() {
    return {
      spinning: false,
      loadingTip: '',
      done: false,
      type: null,
      field: {},
      formatField: {
        priceTabField: null,
        entryInfoTabField: null
      }, // 格式化后的动态字段 ，包括 1 无差异字段， 2 有差异字段， 3 验证规则
      category: {}, // 产品类目
      tabInfo: {},
      src: '',
      loading: false,
      name: '采购编辑',

      namePurchese: 'addProduct',
      mainTabs: [
        {
          title: '基本信息'
        },
        {
          title: '采购编辑',
          component: 'purchaseMain'
        }
      ]
    }
  },
  methods: {
    tabClickPurchase(tabIndex, newTab, oldTab) {
      console.log(tabIndex, newTab, oldTab)
      this.namePurchese = this.mainTabs[tabIndex].component
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

        this.done = true
      })
    },

    // 分离母体字段和差异字段
    setField(field) {
      let vm = this
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
              if (elIn.requireFlag) {
                vali[elIn.displayKey] = [
                  {
                    required: true,
                    message: '不能为空'
                  }
                ]
              }
              // if (
              //   elIn.displayKey === "titleEn" ||
              //   elIn.displayKey === "entryNameEn" ||
              //   elIn.displayKey === "entryNameZh"
              // ) {
              //   vm.setKeyword(vali[elIn.displayKey]);
              // }
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
          if (el.requireFlag) {
            vali[el.displayKey] = [
              {
                required: true,
                message: '不能为空'
              }
            ]
          }
          // if (
          //   el.displayKey === "titleEn" ||
          //   el.displayKey === "entryNameEn" ||
          //   el.displayKey === "entryNameZh"
          // ) {
          //   vm.setKeyword(vali[el.displayKey]);
          // }
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
          if (el.requireFlag) {
            vali[el.displayKey] = [
              {
                required: true,
                message: '不能为空'
              }
            ]
          }
          // if (
          //   el.displayKey === "titleEn" ||
          //   el.displayKey === "entryNameEn" ||
          //   el.displayKey === "entryNameZh"
          // ) {
          //   vm.setKeyword(vali[el.displayKey]);
          // }
        })
      }

      return {
        inputArrs,
        variants,
        vali
      }
    },
    getKeyword() {
      return fetchData({ ...apis.PRODUCT_KEY_WORD_VERIFY }).then(res => {
        if (res.data.code === 0) {
          return res.data.rows
        }
      })
    },

    getKeywordField(words) {
      return (rule, value, callback) => {
        let el = words.find(el => value && value.indexOf(el.keyword) > -1)
        if (el) {
          callback(
            new Error(`包含${el.sensitiveKeywordLibraryDesc} - ${el.keyword}`)
          )
        }
        callback()
      }
    },

    setKeyword(item) {
      let vm = this
      vm.getKeyword().then(words => {
        if (item) {
          item.push({
            required: false,
            validator: vm.getKeywordField(words)
          })
        } else {
          item = {
            required: false,
            validator: vm.getKeywordField(words)
          }
        }
      })
    }
  },
  updated() {
    fixFrameHeight(1)
  },
  watch: {
    // 监控类目获取类目的动态字段
    category(val) {
      this.getVariantData(val.categoryId || this.id)
    },
    formatField: {
      deep: true,
      handler(val) {
        console.log(val)
        this.field = val
      }
    }
  }
}
</script>

<style lang='less'>
@import '~assets/style/variables.less';

body {
  height: 100%;
}

// .purchase_box {
//   overflow: auto;
//   height: 560px;
// }

.vue-tabs {
  width: 120px @iehack;
  height: 100%;
  display: table @iehack;
  justify-content: center @iehack;
  .tab-content {
    height: 100%;
  }
  .left-vertical-tabs {
    display: table-cell @iehack;
    // float: left;
    min-width: 126px;
    background: @sub-title-color;
    border-right: 1px solid @sub-title-color-border;
    .nav-tabs {
      border: none;
      font-size: 14px;
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
