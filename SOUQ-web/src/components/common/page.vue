<!-- 分页组件 -->
<template>
    <div>
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="childPages.pageNo" :page-count="childPages.totalPages" :page-sizes="[10, 20, 50, 100]" :page-size="Size" layout="total, sizes, prev, pager, next, jumper" :total="childPages.total">
        </el-pagination>
    </div>
</template>

<script>
export default {
  name: "PageVue",
  props: {
    childPages: {
      type: Object
    } //表格数据总数,
  },
  components: {},
  data() {
    return {
      // 分页
      currentPage: 1,
      Size: 10
      // total: 31
    };
  },

  created() {},
  mounted() {},
  methods: {
    // 分页
    handleSizeChange(size) {
      console.log(`每页 ${size} 条`);
      this.$emit("size-change", size);
    },
    handleCurrentChange(currentPage) {
      console.log(`当前页: ${currentPage}`);
      this.$emit("current-page", currentPage);
    }
  },
  computed: {},
  watch: {}
};
</script>

<style lang='scss' scoped>
</style>
