<template>
  <div>
    <category-select
      :csLoading="loading"
      :categoryList="categoryList"
      :searchList="searchList"
      @handleSearch="handleSearch"
      @getCategoryChild="getCategoryList"
      @handleNextPage="handleNextPage"
      :showActionable="false"
      :showMoreCategories="false"
    />
    <div class="txc mt10">
      <ElButton type="primary" plain @click="$router.go(-1)">返回</ElButton>
    </div>
  </div>
</template>

<script>
import CategorySelect from '@/components/categorySelect/'
export default {
  components: { CategorySelect },
  data() {
    return {
      categoryList: [],
      searchList: [],
      loading: false
    }
  },
  methods: {
    getCategoryList(parentId, useType = 1) {
      this.loading = true
      this.$api['product/allcategoryList']({
        parentId,
        useType,
        dataType: 1
      }).then(res => {
        this.categoryList = res.rows
        this.loading = false
      })
    },

    handleNextPage(item) {
      const { parentId, categoryId } = item
      this.$api['product/categorySave']({
        parentId,
        systemCategoryId: categoryId
      }).then(res => {
        
        this.$message.success(res.msg)
        this.$router.push({
          path: '/product/common/setup/category'
        })
      })
    },
    handleSearch(keyword) {
      this.$api['product/allcategoryList']({
        keyword,
        dataType: 1,
        useType: 2
      }).then(res => {
        this.searchList = res.rows
      })
    }
  },
  mounted() {
    this.getCategoryList(
      this.$route.query.parentId ? +this.$route.query.parentId : 0
    )
  }
}
</script>