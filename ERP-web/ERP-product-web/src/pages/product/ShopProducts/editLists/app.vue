<template>
  <div style="height:100%">
    <v-button type="success" class="btn" v-if="!isShow && name === '图片' && applyBtn" @click="applyImg">一键应用平台图片</v-button>
    <el-tabs style="height: 100%;" type="border-card" v-model="name" class="product_box">
      <el-tab-pane
        v-for="(item, index) in mainTabs"
        :label="item.title"
        :key="item.title"
        :name="item.title"
        lazy
        style="height:100%"
      >
        <div class="product_box" :loading="loading" ref="card" style="height:100%">
          <iframe
            :src="item.src"
            ref="frame"
            frameborder="0"
            style="width:100%;height:100%"
            class="frame"
            :id="`_`+ index"
          ></iframe>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import { getQueryString } from 'common/util'
import { fetchData } from 'common/common'
import apis from 'apis'
import { Tabs, TabPane } from 'element-ui'
import { loginRedirect } from 'common/config'

Vue.use(Tabs)
Vue.use(TabPane)

export default {
  data() {
    let vm = this
    vm.isShow = getQueryString('isshow')
    vm.isVariant = getQueryString('variant')
    vm.productId = getQueryString('productId')
    vm.storeProductId = getQueryString('storeProductId')
    vm.productType = getQueryString('productType')
    vm.parentId = getQueryString('baseProductParentId')
    return {
      applyBtn: false,
      // productType: 1,
      src: '',
      name: '平台上架信息',
      curIndex: 0,
      loading: false
      // mainTabs: tabs
    }
  },
  created() {
    this.getGroup()
    this.getApplyBtn()
  },
  computed: {
    mainTabs() {
      let vm = this
      console.log(vm.isVariant, '--------_____------')
      return [
        {
          title: '基本信息',
          src:
            loginRedirect.slice(0, -1) +
            (vm.isVariant
              ? `/product/productList/viewProductVariant.html?productId=${
                  vm.productId
                }&isshow=true&variant=${vm.isVariant}&base=true&&parent=${
                  vm.productId
                }&parentId=${vm.productId}&${
                  vm.productType === 3 ? 'groupFlag=true' : null
                }`
              : '/product/productList/addProduct.html' +
                window.location.search +
                `isshow=true&${vm.productType === 3 ? 'groupFlag=true' : null}`)
        },
        {
          title: '采购编辑',
          src:
            loginRedirect.slice(0, -1) +
            '/product/productList/editPurchase.html' +
            window.location.search +
            '&type=1&isshow=true&parentId=' +
            vm.parentId
        },
        {
          title: '平台上架信息',
          src:
            loginRedirect.slice(0, -1) +
            '/product/ShopProducts/upInfomation.html' +
            window.location.search
        },
        {
          title: '图片',
          src:
            loginRedirect.slice(0, -1) +
            '/product/ShopProducts/imgInfomation.html' +
            window.location.search
        }
      ]
    }
  },
  methods: {
    applyImg() {
      console.log(this.$refs.frame)
      let imgTab = this.$refs.frame.find(el => el.id === '_3')
      imgTab.contentWindow.vm.$children[0].apply()
    },
    getApplyBtn() {
      let vm = this
      fetchData({
        ...apis.STORE_PRODUCT_PLATFORM,
        data: {
          productId: vm.storeProductId,
          productType: vm.productType
        }
      }).then(res => {
        let {
          rows: { img, info }
        } = res.data

        vm.applyBtn = img
      })
    },
    getGroup() {
      let vm = this
      return fetchData({
        ...apis.PRODUCT_TYPE_GET,
        data: {
          productId: vm.productId,
          parentFlag: vm.isVariant ? 0 : 1
        }
      }).then(res => {
        if (res.data.productType) {
          this.productType = res.data.productType
        }
      })
    },
    tabClickPurchase(tabIndex, newTab, oldTab) {
      let vm = this
      this.src = this.mainTabs[tabIndex].src
    }
  }
}
</script>

<style scoped>
.btn {
  position: absolute;
  z-index: 9999;
  border-radius: 0;
  right: 0;
  top: 0;
  line-height: 40px;
  height: 40px !important;
}
</style>
