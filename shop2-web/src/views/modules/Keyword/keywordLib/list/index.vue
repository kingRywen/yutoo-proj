<template>
  <div>
    <el-row class="row-bg">
      <ElCol class="row" :xs="6" :sm="5" :md="4" :lg="4">
        <div @click="addKeyword" class="content add">
          <i class="el-icon-plus"></i>
          <span>添加</span>
        </div>
      </ElCol>
      <el-col class="row" :xs="6" :sm="5" :md="4" :lg="4" v-for="(item, index) in list" :key="index">
        <div class="content" @click="toDetail(item)">
          <div class="title">{{item.categoryName}}</div>
          <!-- <div class="num">{{item.num}}</div> -->
          <div class="actions">
            <el-button type="text" icon="el-icon-delete" @click.stop="deleteKeyword(item.categoryId)"></el-button>
            <el-button type="text" icon="el-icon-edit" @click.stop="editKeyword(item)"></el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <!-- FIXME: 改成下拉懒加载 -->
    <el-pagination
      class="mt20"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[50, 100, 150, 200]"
      :page-size="pageSize"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list: [],
      currentPage: 1,
      pageSize: 50,
      total: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    handleCurrentChange(val) {
      this.currentPage = val
      this.getList()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    getList() {
      this.$api[`keyword/keywordLibCategoryList`]({
        ...this.storeInfo,
        pageSize: this.pageSize,
        pageNumber: this.currentPage
      }).then(({ rows, pageSize, pageNumber, total }) => {
        this.list = rows
        this.total = total
        this.pageSize = pageSize
        this.currentPage = pageNumber
      })
    },
    addKeyword() {
      let vm = this
      this._openDialog({
        size: 'small',
        fullscreen: false,
        title: '添加词库',
        params: {
          // ...this.storeInfo
          onSuccess() {
            vm.getList()
          }
        },

        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./dialogs/add.vue')
      })
    },
    deleteKeyword(categoryId) {
      this.showTips({ msg: '是否删除关键词?' }, () => {
        return this.$api[`keyword/keywordLibRemoveCategory`]({
          categoryId,
          ...this.storeInfo
        }).then(() => {
          this.getList()
        })
      })
    },
    editKeyword(editInfo) {
      let vm = this

      this._openDialog({
        size: 'small',
        fullscreen: false,
        title: '编辑词库名称',
        params: {
          editInfo,
          onSuccess() {
            vm.getList()
          }
        },
        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./dialogs/add.vue')
      })
    },
    toDetail(item) {
      this.$router.push({
        path: '/keyword/kewordLib/detail',
        query: {
          id: item.categoryId,
          title: item.categoryName
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.row-bg {
  margin-right: -10px;
}
.row {
  padding: 0 10px 10px 0;
  height: 120px;
  // overflow: auto;
  .content {
    position: relative;
    border: 1px solid transparent;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-content: center;
    flex-direction: column;
    text-align: center;
    height: 100%;
    background-color: #fff;
    .actions {
      display: none;
      position: absolute;
      right: 10px;
      top: 4px;
      button {
        opacity: 0.7;
        padding: 6px 0;
        font-size: 16px;
        & + button {
          margin-left: 4px;
        }
        &:hover {
          color: #333;
          opacity: 1;
        }
      }
    }
    .title {
      font-size: 14px;
    }
    .num {
      font-size: 18px;
      margin-top: 10px;
      color: $btnColor;
    }
    &:hover {
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
      .actions {
        display: block;
      }
    }
    &.add {
      span {
        margin-top: 10px;
        font-size: 14px;
        color: $btnColor;
      }
      i {
        color: $btnColor;
      }
    }
    &.add:hover {
      border: 1px solid $btnColor;
      box-shadow: none;
    }
  }
}
</style>