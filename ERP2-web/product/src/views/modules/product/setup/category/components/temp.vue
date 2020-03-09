<template>
  <div>
    <MainLayout
      :leftTree="false"
      :treeTable="true"
      :topBatchBtn="topBatchBtn"
      :outerParams="outerParams"
      :edit-btns="edits"
      @left-batch-change="handleLeftBatchChange"
      :right-edit-btns="editBtns"
      :columns="columns"
      :searchFunc="searchFunc"
      ref="layout"
      url="product/categoryTemplatetList"
    ></MainLayout>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      topBatchBtn: {
        title: '删除',
        props: {
          label: 'label',
          value: 'label',
          expandTrigger: 'hover'
        },
        options: [],
        search: {
          field: 'templateName',
          placeholder: '请输入模板名称'
        }
      },
      edits: [],
      edits2: [
        {
          name: '编辑',
          fn: scope => {
            this.$router.push({
              path: '/product/common/setup/category/tempEdit',
              query: {
                templateId: scope.row.templateId,
                type: scope.row.type,
                submitType: 0,
                platId: this.$store.state.product.platProduct.selectedSite
                  .value,
                systemCategoryId: this.$route.query.systemCategoryId
              }
            })
          }
        },
        {
          name: '复制添加',
          hidden: () => {
            return this.outerParams.platId == 1
          },
          fn: scope => {
            this.$router.push({
              path: '/product/common/setup/category/tempEdit',
              query: {
                templateId: scope.row.templateId,
                type: scope.row.type,
                submitType: 1,
                platId: this.$store.state.product.platProduct.selectedSite.value
              }
            })
          }
        },
        {
          name: '删除',
          hidden: () => {
            return this.outerParams.platId == 1
          },
          fn: scope => {
            const { templateId, type } = scope.row
            this.remove([
              {
                templateId,
                type
              }
            ])
          }
        },
        {
          name: '操作日志',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '操作日志',
              width: '100%',
              // 可以传参到弹窗组件
              params: { modelLogType: 3 },
              component: () => import('../../common/log')
            })
          }
        }
      ],
      edits1: [
        {
          name: '编辑',
          fn: scope => {
            this.$router.push({
              path: '/product/common/setup/category/tempEdit',
              query: {
                templateId: scope.row.templateId,
                type: scope.row.type,
                submitType: 0,
                platId: this.$store.state.product.platProduct.selectedSite
                  .value,
                systemCategoryId: this.$route.query.systemCategoryId
              }
            })
          }
        },
        {
          name: '操作日志',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '操作日志',
              width: '100%',
              // 可以传参到弹窗组件
              params: { modelLogType: 3 },
              component: () => import('../../common/log')
            })
          }
        }
      ],
      editBtns: [],
      columns: [
        {
          label: '模板名称',
          value: 'nickName'
        },
        {
          label: '站点',
          value: 'siteName'
        },
        {
          label: '类目',
          value: 'category',
          width: 300
        },
        {
          label: '添加日期',
          sortable: true,
          value: 'createTime'
        },
        {
          label: '添加人员',
          value: 'createUser'
        }
      ]
    }
  },
  watch: {
    'outerParams.platId'(val) {
      if (val == 1) {
        this.topBatchBtn.options = []
        this.edits = this.edits1
      } else {
        this.topBatchBtn.options = [
          {
            label: '删除'
          }
        ]
        this.edits = this.edits2
      }
    }
  },
  computed: {
    outerParams() {
      return {
        platId:
          this.$store.state.product.platProduct.selectedSite &&
          this.$store.state.product.platProduct.selectedSite.value
      }
    }
  },
  methods: {
    sortChange({ column, prop, order }) {
      console.log({ column, prop, order })
    },
    searchFunc(data) {
      return data
    },
    handleLeftBatchChange(val, selection) {
      const isremove = val[val.length - 1] == '删除'
      const idArray = selection.map(i => {
        return {
          templateId: i.templateId,
          type: i.type
        }
      })
      isremove && this.remove(idArray)
    },
    remove(idArray) {
      this.$confirm('确定删除选中的类目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['product/categoryTemplatetDelete']({
            idArray
          }).then(res => {
            this.$refs.layout.getList()
          })
        })
        .catch(() => {
          return false
        })
    },
    ...mapActions('product/platProduct', ['getButtedSiteList'])
  },
  mounted() {
    if (!this.$route.query.systemCategoryId) {
      return this.$router.push({
        path: '/product/common/setup/category'
      })
    }
    this.getButtedSiteList({
      isSite: false,
      initVal: 1
    })
  }
}
</script>

<style>
.plat-wrapper .plat-select .el-input__inner {
  padding-left: 62px;
}
</style>
