<template>
  <category-select
    :csLoading="loading"
    :categoryList="categoryList"
    :searchList="searchList"
    @handleSearch="handleSearch"
    @getCategoryChild="getCategoryList"
    @handleNextPage="handleNextPage"
    :collectList="collectList"
    @handleCollect="handleCollect"
  />
</template>

<script>
import CategorySelect from '@/components/categorySelect/'
export default {
  components: { CategorySelect },
  data() {
    return {
      categoryList: [], // 下面的所有列表
      searchList: [], // 搜索的列表
      loading: false,
      collectList: [] // 搜藏列表
    }
  },
  methods: {
    getCollectList() {
      this.getCategoryList(null, 5)
    },
    getCategoryList(parentId, useType = 3) {
      this.loading = true
      this.$api['product/allcategoryList']({
        parentId,
        platSiteId: +this.$route.query.platSiteId,
        platId: +this.$route.query.platId,
        useType,
        dataType: 2
      }).then(res => {
        if (useType == 5) {
          this.collectList = res.rows
        } else {
          this.categoryList = res.rows
        }
        this.loading = false
      })
    },

    handleNextPage(item) {
      this.$emit('handleNextPage', item)
    },
    handleSearch(keyword) {
      this.$api['product/allcategoryList']({
        keyword,
        dataType: 2,
        platSiteId: this.$route.query.platSiteId,
        platId: this.$route.query.platId,
        useType: 3
      }).then(res => {
        this.searchList = res.rows
      })
    },
    handleCollect(item) {
      this.$api[`product/${!item.concernFlag ? 'catePlatConcernMAdd' : 'catePlatConcernMRemove'}`]({id:item.categoryId})
      .then(() => {
        item.concernFlag = !item.concernFlag
        this.getCollectList()
      })
      
    }
  },
  mounted() {
    this.getCategoryList(0)
    this.getCollectList()
  }
}
</script>