<template>
  <cate :id="1" :product-id="selProduct" type="product">
    <el-button class="link" type="text" @click="libManage">产品词库管理</el-button>
    <el-select
      size="small"
      v-model="selProduct"
      @change="setCache"
      ref="sel"
      filterable
      class="w100 mb10"
      placeholder="请选择商品"
    >
      <el-option v-for="item in cateProps" :key="item.productId" :label="item.productName" :value="item.productId"></el-option>
    </el-select>
  </cate>
</template>
<script>
import cate from './cate'
import { setLibCache, getGroupCache } from '../cache'
export default {
  components: {
    cate
  },
  data() {
    let cached = getGroupCache(+this.$route.query.id)
    return {
      categoryId: +this.$route.query.id,
      selProduct: cached.selProduct,
      products: [],
      pageSize: 10,
      pageNumber: 1,
      cateProps: [],
      hasLoadedCateProps: []
    }
  },
  created() {
    this.loadSelect()
  },
  methods: {
    setCache(val) {
      setLibCache('selProduct', val, this.categoryId)
    },
    loadSelect() {
      return this.getProducts().then(({ rows }) => {
        this.cateProps = rows
        if (!rows.find(el => el.productId === this.selProduct)) {
          this.setCache(null)
          setLibCache('secondTree', null, this.categoryId)
          this.selProduct = null
        }
      })
    },
    getProducts(params = {}) {
      return this.$api[`keyword/keywordLibProductList`](
        {
          categoryId: this.categoryId,
          ...this.storeInfo,
          ...params,
          pageNumber: 1,
          pageSize: 1000000,
          searchText: this.lastFetchIsQuery
        },
        { singleLoading: true }
      )
    },
    libManage() {
      this._openDialog({
        size: 'medium',
        title: '产品词库管理',
        params: {
          categoryId: this.categoryId,
          closeFn: () => {
            this.loadSelect()
          }
        },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/libManage.vue')
      })
    }
  }
}
</script>