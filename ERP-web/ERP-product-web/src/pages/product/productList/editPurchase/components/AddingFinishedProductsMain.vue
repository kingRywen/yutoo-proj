<template>
  <div>
    <ProductDeliveryPackage
      v-if="!isTab"
      ref="parentTab"
      :productid="parentId"
      :up-index="curIndex"
      :show="$attrs.show"
    ></ProductDeliveryPackage>
    <el-tabs
      v-else
      ref="tab"
      type="border-card"
      v-model="name"
      class="__flex__column___ fixedHeight"
      style="padding-bottom: 0;"
    >
      <el-tab-pane label="母体" key="母体" name="母体" lazy>
        <ProductDeliveryPackage
          ref="parentTab"
          :productid="parentId"
          :up-index="curIndex"
          v-if="name==='母体'"
          :show="$attrs.show"
        ></ProductDeliveryPackage>
      </el-tab-pane>
      <el-tab-pane
        v-for="(val, key) in variantEntityList"
        :key="key"
        :label="val.variant.sku"
        v-if="val.variant.activateFlag != 0"
        :name="val.variant.sku"
        lazy
      >
        <ProductDeliveryPackage
          ref="subTab"
          :productid="val.variant.productId"
          :up-index="curIndex"
          v-if="name===val.variant.sku"
          :show="$attrs.show"
        ></ProductDeliveryPackage>
      </el-tab-pane>
    </el-tabs>
    <div class="saveBtn" v-if="!$attrs.type && !isVariant">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show && !isVariant" @click.prevent="submit" :loading="commitLoading">提交</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import ProductDeliveryPackage from './AddingFinishedProducts'
import { getQueryString } from 'common/util'
import { fetchData, showToast, toParamUrl } from 'common/common'
import apis from 'apis'

export default {
  inheritAttrs: false,
  components: {
    ProductDeliveryPackage
  },
  created() {
    this.isVariant = getQueryString('variant')
  },
  data() {
    return {
      name: '母体',
      Tabs: {},
      loading: false,
      commitLoading: false,
      parentId: +getQueryString('productId'),
      curIndex: 0
    }
  },
  methods: {
    submit() {
      this.commitLoading = true
      fetchData({
        ...apis.PRODUCT_PURCHASE_COMMIT,
        data: {
          productId: this.parentId
        }
      }).then(res => {
        this.commitLoading = false
        // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id

        if (res.data.code === 0) {
          showToast('success', res.data.msg)
          toParamUrl('/product/productList.html')
        } else {
          showToast('error', res.data.msg)
        }
      })
    }
  },
  computed: {
    // 获取变体list
    variantList() {
      let ret
      try {
        ret = this.$attrs.allData.variantTab.productVariantList
      } catch (e) {
        ret = []
      }
      return ret
    },

    // 获取basetab
    variantEntityList() {
      let ret
      try {
        ret = this.$attrs.allData.variantTab.productVariantList
      } catch (e) {
        ret = []
      }
      return ret
    },

    // 判断是否显示tab
    isTab() {
      console.log(this.$attrs)
      return !!this.$attrs.allInfo.materialsTabField[0]
    }
  }
  // watch: {
  //   // 监控根组件的变体数量
  //   variantList: {
  //     immediate: true,
  //     deep: true,
  //     handler: function(val) {

  //       this.Tabs = {}
  //       val.map(el => {
  //         this.Tabs[el.variant.sku] = {}
  //       })
  //     }
  //   }
  // }
}
</script>

<style>
</style>
