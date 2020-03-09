<template>
  <ul class="category-list">
    <template v-if="data.length">
      <li
        :class="!item.childFlag?'clickable':''"
        v-for="(item, index) in data"
        :key="index"
        @click.stop="handleCategory(item)"
      >
        <template v-if="showActionable">
          <span class="icon" @click.stop="handleCollect(item)">
            <i :class="item.concernFlag?'el-icon-star-on icon-on':'el-icon-star-off icon-off'"></i>
          </span>
        </template>
        <template v-else>
          <span class="icon"></span>
        </template>
        <div class="conten">
          <span>{{item.categoryName}}</span>
        </div>
        <span class="icon min-w-icon">
          <i v-show="!item.childFlag" class="el-icon-arrow-right"></i>
          <!--  -->
          <strong v-show="item.childFlag" class="childrens" @click.stop="handleNextPage(item)">选择类别</strong>
        </span>
      </li>
    </template>
    <template v-else>
      <div style="padding: 10px;font-size: 14px;">暂无数据</div>
    </template>
  </ul>
</template>

<script>
export default {
  props: {
    showActionable: {
      type: Boolean,
      default: true
    },
    index: Number,
    data: {
      type: Array,
      default: () => {
        return [
          // {
          //     name: '女士时尚', //类目名称
          //     isChild: true, //是否有下级
          //     isCollect: false, //是否收藏
          //     categoryId: 1 //类目ID
          // },
        ];
      }
    }
  },
  methods: {
    handleCollect(item) {
      this.$emit("handleCollect", item);
    },
    handleCategory(item) {
      if (!item.childFlag) {
        console.log("有下级");
        this.$router.replace({
          path: '/product/common/setup/category/add',
          // query: {
          //   categoryId: item.categoryId,
          // index: this.index
          // }
        })
        this.$emit("handleCategory", item);
      }
    },
    handleNextPage(item) {
      if (item.childFlag) {
        console.log("最后一级");
        this.$emit("handleNextPage", item);
      }
    }
  }
};
</script>
