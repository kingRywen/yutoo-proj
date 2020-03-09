<template>
  <div class="category-container">
    <!--  -->
    <div class="title-warp" v-if="showHeader">
      <h2 class="page-title">选择产品分类</h2>
      <p class="page-title-desc">
        要开始创建详情页面，首先请选择您的产品分类
        <span class="more" @click="moreDetails">了解更多详情</span>
      </p>
    </div>
    <!--  -->
    <div class="search-warp">
      <div class="actionable-title">搜索</div>
      <el-input placeholder="例如：女士时尚>服装" v-model.trim="keyword">
        <el-button slot="append" @click="search" icon="el-icon-search" :disabled="keyword?false:true"></el-button>
      </el-input>
    </div>
    <!--  -->
    <div class="collection-warp" v-if="showActionable">
      <div class="actionable-title">收藏夹</div>
      <list
        :data="allCollectionList"
        @handleNextPage="handleNextPage"
        @handleCategory="handleCategory"
        v-loading="loading"
        :index="checkedList.length - 2"
        element-loading-text="正在加载..."
        element-loading-spinner="el-icon-loading"
      />
    </div>
    <!--  -->
    <div class="browse-warp">
      <div class="actionable-title">
        浏览
        <span class="more" v-if="showMoreCategories" @click="moreCategories">添加更多类别</span>
      </div>
      <div class="checked">
        <template v-if="isSearch">
          <span class="search-placeholder">为 {{keyword}} 找到 {{allSearchList.length}}个结果</span>
          <span class="more" @click.stop="reduction('search')">清空搜索条件</span>
        </template>
        <template v-else>
          <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
            <el-breadcrumb-item
              v-if="checkedList.length"
              :to="{ path: $route.path,query:{categoryId:-1} }"
            >主类</el-breadcrumb-item>
            <el-breadcrumb-item
              v-for="(item,index) in checkedList"
              :to="{ path: $route.path,query:{...$route.query, categoryId:item.categoryId,index} }"
              :key="index"
            >{{item.categoryName}}</el-breadcrumb-item>
          </el-breadcrumb>
          <span v-if="!checkedList.length" class="placeholder">请选择下方类目</span>
          <span class="icon-close" v-if="checkedList.length" @click.stop="reduction">
            <i class="el-icon-close"></i>
          </span>
        </template>
      </div>
    </div>
    <div
      class="category-warp"
      v-loading="csLoading"
      element-loading-text="正在加载..."
      element-loading-spinner="el-icon-loading"
    >
      <search-list v-if="isSearch" :searchList="allSearchList" @handleNextPage="handleNextPage" />
      <list
        :showActionable="showActionable"
        v-else
        :data="allCategoryList"
        @handleCategory="handleCategory"
        @handleCollect="handleCollect"
        @handleNextPage="handleNextPage"
      />
    </div>
  </div>
</template>
<script>
import List from './list'
import SearchList from './search'
export default {
  components: { List, SearchList },
  props: {
    showHeader: {
      default: true
    },
    //是否显示收藏类目
    showActionable: {
      type: Boolean,
      default: true
    },
    //是否显示更多类目
    showMoreCategories: {
      type: Boolean,
      default: true
    },

    //收藏列表
    collectList: {
      type: Array,
      default: () => []
    },

    //类目列表
    categoryList: {
      type: Array,
      default: () => []
    },

    //
    searchList: {
      type: Array,
      default: () => []
    },

    loading: {
      type: Boolean,
      default: false
    },
    csLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      initialList: [], //最初的数据

      keyword: '',

      allCategoryList: [],

      allCollectionList: [],

      allSearchList: [],

      isSearch: false,

      checkedList: [] //已选中类目
    }
  },
  watch: {
    categoryList: {
      handler(val) {
        if (!this.initialList.length) {
          this.initialList = [...val]
        }
        this.allCategoryList = val
      },
      immediate: true
    },
    searchList(val) {
      this.allSearchList = [...val]
    },
    collectList(val) {
      this.allCollectionList = [...val]
    },
    $route(to) {
      if (to.query.categoryId) {
        const index = to.query.index
        this.checkedList.splice(index + 1)
        this.$emit('getCategoryChild', +to.query.categoryId)
      }
    }
  },
  methods: {
    //搜索
    search() {
      this.isSearch = true
      this.$emit('handleSearch', this.keyword)
    },
    //收藏、反收藏
    handleCollect(item) {
      console.log('收藏、反收藏', item)
      this.$emit('handleCollect', item)
    },

    // 选择类目
    handleCategory(item) {
      console.log(item)
      //选中的类目是否有这个id存在
      if (!this.checkedList.find(j => j.categoryId == item.categoryId)) {
        this.checkedList.push(item)
      }
      //请求下一级
      this.$emit('getCategoryChild', item.categoryId)
    },
    //重新选择还原数据  清空已经选择的
    reduction(isSearch) {
      this.allCategoryList = [...this.initialList]
      this.checkedList = []
      if (isSearch) {
        this.isSearch = false
        this.keyword = ''
        this.allSearchList = []
      }
      this.$emit('clear')
    },
    //选择类别
    handleNextPage(item, search = false) {
      if (search) {
        this.checkedList.splice(0)
        this.isSearch = false
      }
      if (!this.checkedList.find(j => j.categoryId == item.categoryId)) {
        this.checkedList.push(item)
      }
      this.$emit('handleNextPage', item)
    },
    //了解更多详情
    moreDetails() {
      this.$message.warning('此功能正在开发中...')
    },
    //更多类别
    moreCategories() {
      this.$router.push({
        path: '/product/common/setup/category'
      })
    },
    throttle(fn) {
      let canRun = true
      return function() {
        if (!canRun) return
        canRun = false
        setTimeout(() => {
          fn.apply(this, arguments)
          canRun = true
        }, 1000)
      }
    },
    handleScroll() {
      var scrollTop =
        document.documentElement.scrollTop || document.body.scrollTop
      var windowHeight =
        document.documentElement.clientHeight || document.body.clientHeight
      var scrollHeight =
        document.documentElement.scrollHeight || document.body.scrollHeight
      if (scrollTop + windowHeight == scrollHeight) {
        console.log('加载')
      }
    }
  },
  mounted() {
    this._throttle = this.throttle(this.handleScroll)
    window.addEventListener('scroll', this._throttle)
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this._throttle)
  }
}
</script>
<style lang="scss">
.clickable {
  cursor: pointer;
}
$--clickable-text-color: #0080c9;

.category-container {
  // width: 1030px;
  // padding: 15px 34px;
  // margin: 0 auto;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100%;
  box-sizing: border-box;
  .page-title {
    margin: 0;
    font-family: '微软雅黑';
    font-weight: 400;
    font-style: normal;
    font-size: 28px;
    color: #000000;
  }
  .actionable-title {
    padding: 10px 0;
    font-family: '微软雅黑 Bold', '微软雅黑 Regular', '微软雅黑';
    font-weight: 700;
    font-size: 17px;
    color: #000000;
  }
  .page-title-desc {
    margin: 15px 0 10px;
  }
  .more {
    @extend .clickable;
    color: $--clickable-text-color;
    font-size: 14px;
    font-weight: 400;
    font-family: 'Arial Normal', 'Arial';
    margin-left: 6px;
  }
  .category-list {
    border: 1px solid rgba(228, 228, 228, 1);
    border-radius: 5px;
    color: #999999;
    background-color: rgba(255, 255, 255, 1);
    li {
      height: 32px;
      line-height: 32px;
      display: flex;
      justify-content: space-between;
      padding: 0 12px;
      background-color: rgba(242, 242, 242, 1);
      border-top: 1px solid rgba(228, 228, 228, 1);
      border-bottom: 1px solid rgba(228, 228, 228, 1);
      margin: 3px 0;
      border-radius: 5px;
      .icon {
        @extend .clickable;
        i {
          font-size: 20px;
          vertical-align: middle;
        }
        .icon-off {
          vertical-align: middle;
          padding: 0 4px;
        }
        .icon-on {
          font-size: 26px;
          vertical-align: sub;
          color: #efce4a;
        }
      }
      .min-w-icon {
        min-width: 62px;
        text-align: right;
      }
      .conten {
        flex: 1;
        // text-align: center;
        span {
          font-family: 'Arial Normal', 'Arial';
          font-size: 13px;
          color: #000;
        }
      }
      .childrens {
        @extend .clickable;
        @extend .more;
        font-weight: 400;
        padding: 8px 0;
      }
      &:hover {
        background: rgba(102, 204, 255, 0.44);
      }
    }
  }
  .browse-warp {
    .checked {
      @extend .clickable;
      border: 1px solid #dcdfe6;
      height: 40px;
      line-height: 40px;
      padding-left: 15px;
      border-radius: 4px;
      .breadcrumb {
        display: inline-block;
      }
      .icon-close {
        float: right;
        padding: 0 10px;
        @extend .clickable;
        i {
          font-size: 21px;
          color: #909399;
          vertical-align: middle;
        }
      }
      .placeholder {
        color: #909399;
        font-size: 14px;
      }
      .search-placeholder {
        font-size: 14px;
        margin-right: 20px;
      }
    }
  }
  .category-warp {
    flex: 1;
    overflow-y: auto;
    margin-top: 10px;
  }
  .el-breadcrumb__inner {
    color: $--clickable-text-color;
  }
  .el-breadcrumb__item:last-child .el-breadcrumb__inner {
    color: $--clickable-text-color;
  }
  .el-breadcrumb__inner a,
  .el-breadcrumb__inner.is-link {
    color: $--clickable-text-color;
  }
}
</style>
