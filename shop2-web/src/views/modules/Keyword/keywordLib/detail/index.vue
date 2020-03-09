<template>
  <div class="box">
    <el-select class="select" size="mini" v-model="selected" @change="selectChange" filterable placeholder="选择分类">
      <el-option v-for="item in keywords" :key="item.categoryId" :label="item.categoryName" :value="item.categoryId"></el-option>
    </el-select>
    <el-tabs :key="selected" type="card" v-model="activeName">
      <el-tab-pane name="first" label="类目词库" lazy>
        <Cate />
      </el-tab-pane>
      <el-tab-pane name="second" label="产品词库" lazy>
        <Product />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import Cate from './tabs/cate'
import Product from './tabs/product'
import { setLibCache, getGroupCache } from './cache'
export default {
  components: {
    Cate,
    Product
  },
  data() {
    let id = +this.$route.query.id
    let cached = getGroupCache(id)
    return {
      activeName: cached.tab || 'first',
      selected: id,
      // 关键词
      keywords: [],
      pageSize: 10,
      pageNumber: 1
    }
  },
  created() {
    this.load()
  },
  watch: {
    activeName(val) {
      setLibCache('tab', val, this.selected)
    }
  },
  methods: {
    load() {
      return this.$api[`keyword/keywordLibCategoryList`](
        {
          ...this.storeInfo,
          pageSize: 1000000,
          pageNumber: 1
        },
        { singleLoading: true }
      ).then(({ rows }) => {
        this.keywords = rows
      })
    },
    selectChange(val) {
      // this.activeName = 'first'
      this.$router.replace({
        path: this.$route.path,
        query: {
          title: this.keywords.find(e => e.categoryId == val).categoryName,
          id: val
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  position: relative;
  .select {
    position: absolute;
    right: 0;
    top: 0;
    z-index: 2;
  }
}
</style>