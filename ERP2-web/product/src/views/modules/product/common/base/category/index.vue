<template>
  <!-- tangwenping -->
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
import CategorySelect from "@/components/categorySelect/";
export default {
  components: { CategorySelect },
  data() {
    return {
      categoryList: [], // 下面的所有列表

      searchList: [], // 搜索的列表

      loading: false,

      collectList: [] // 搜藏列表
    };
  },
  methods: {
    getCategoryList(parentId, useType = 3, keyword = null) {
      this.loading = true;
      this.$api["product/allcategoryList"]({
        parentId,
        useType,
        dataType: 1,
        keyword
      }).then(res => {
        this.categoryList = res.rows;
        this.loading = false;
      });
      this.$api["product/allcategoryList"]({
        parentId,
        useType: 5,
        dataType: 1,
        keyword
      }).then(res => {
        this.collectList = res.rows;
        this.loading = false;
      });
    },
    handleNextPage(item) {
      // console.log(item);
      console.log(item);
      this.$router.push(
        `/product/common/base/productOperate?id=${item.categoryId}&path=${item.path}`
      );
    },
    handleSearch(keyword) {
      this.loading = true;
      this.$api["product/allcategoryList"]({
        useType: 4,
        dataType: 1,
        keyword
      }).then(res => {
        this.searchList = res.rows;
        this.loading = false;
      });
    },
    handleCollect(item) {
      let vm = this;
      let url = "product/";
      if (!item.concernFlag) {
        url += "cateSystemCategoryConcernMAdd";
      } else {
        url += "cateSystemCategoryConcernMRemove";
      }
      vm.$api[url]({ id: item.categoryId }).then(() => {
        vm.getCategoryList();
      });
    }
  },
  mounted() {
    this.getCategoryList(0);
  }
};
</script>