<template>
  <v-spin tip="加载中..." :spinning="spinning" style="height: 100%;">
    <el-tabs
      style="height: 100%;"
      type="border-card"
      v-model="name"
      tab-position="left"
      @tab-click="handleTabClick"
      v-if="imgs.length > 1"
      class="__imginformation"
    >
      <el-tab-pane :label="item.skuStore" v-for="(item, index) in imgs" :name="item.variantId + ''" lazy>
        <UploadImg
          :shop-img="true"
          :oss="true"
          v-if="item.variantId == name"
          :key="item.skuStore"
          :has-img="item.imgList"
          :product-type="productType"
          :product-id="productId"
          :oss-config="{dir: item.dir, variantId: item.variantId}"
          @refresh="getTabImgs(item.variantId, imgs, index)"
          @updateimg="handleUpdate"
          :platform-value="item.platformValue"
          :platform-image="item.platformImage"
          :show="isShow"
          :variant-id="item.variantId"
        ></UploadImg>
      </el-tab-pane>
    </el-tabs>

    <UploadImg
      :oss="true"
      v-else
      :shop-img="true"
      :has-img="imgs[0] && imgs[0].imgList"
      :product-type="productType"
      @refresh="getTabImgs(imgs[0].variantId, imgs, 0)"
      @updateimg="handleUpdate"
      :product-id="productId"
      :show="isShow"
      :oss-config="{dir: imgs[0] && imgs[0].dir, variantId: imgs[0] && imgs[0].variantId}"
      :variant-id="imgs[0] && imgs[0].variantId"
    ></UploadImg>
  </v-spin>
</template>

<script>
import Vue from 'vue'
import UploadImg from 'components/base/uploadImg'
import { Tabs, TabPane } from 'element-ui'
import { fetchData, showConfirm, showToast } from 'common/common'
import apis from 'apis'
import { getQueryString } from 'common/util'

Vue.use(Tabs)
Vue.use(TabPane)

export default {
  components: {
    UploadImg,
    Tabs,
    TabPane
  },
  created() {
    this.isShow = getQueryString('isshow')
    this.productType = getQueryString('productType')
    this.storeProductId = getQueryString('storeProductId')
    this.deleteFlag = getQueryString('deleteFlag')
    // if (this.productType === 1) {
    //   this.getData()
    // }
    this.getData()
  },
  data() {
    return {
      name: null,
      spinning: false,
      imgs: [],
      productType: null,
      productId: null
    }
  },
  methods: {
    apply() {
      fetchData({
        ...apis.STORE_IMG_UPDATE_PLATFORM,
        data: {
          productId: this.storeProductId,
          productType: this.productType
        }
      }).then(res => {
        if (res.data.code === 0) {
          showToast('success', res.data.msg)
          this.getData()
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    handleUpdate({ file, val }) {
      console.log(file, val)
      let { storeImgId, mainFlag, remark } = file
      remark = val
      fetchData({
        ...apis.STORE_IMG_UPDATE,
        data: {
          storeImgId,
          mainFlag,
          remark
        }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
        }
      })
    },
    handleTabClick(tabInstance) {
      console.log(tabInstance)
      let { index, name } = tabInstance
      this.getTabImgs(+name, this.imgs, index)
    },
    getData() {
      let vm = this
      this.productId = +getQueryString('storeProductId')
      this.productType = +getQueryString('productType')
      this.spinning = true
      // 获取变体列表
      fetchData({
        ...apis.STORE_IMG_LIST_VARIANT,
        data: {
          productId: this.productId,
          productType: this.productType,
          deleteFlag: this.deleteFlag
        }
      }).then(res => {
        vm.spinning = false
        if (res.data.code === 0) {
          let [first] = res.data.rows
          vm.name = first.variantId + ''
          vm.getTabImgs(first.variantId, res.data.rows)
        } else {
          showToast('error', res.data.msg)
        }
      })
    },
    getTabImgs(variantId, _imgs, index = 0) {
      let vm = this
      this.spinning = true
      fetchData({
        ...apis.STORE_IMG_LIST,
        data: {
          variantId
        }
      }).then(res1 => {
        this.spinning = false
        let { code, rows, msg } = res1.data
        if (code === 0) {
          _imgs[index].imgList = rows
          if (!vm.imgs.length) {
            vm.imgs = _imgs
          } else {
            vm.imgs.splice(index, 1, _imgs[index])
          }
        } else {
          showToast('error', msg)
        }
      })
    }
  }
}
</script>

<style>
.__imginformation .el-tabs__content {
  overflow: auto;
}
</style>
