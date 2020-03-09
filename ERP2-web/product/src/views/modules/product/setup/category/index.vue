<template>
  <div>
    <MainLayout
      :leftTree="false"
      :isShowPag="false"
      :treeTable="true"
      :treeTableOtions="treeTableOtions"
      :topBatchBtn="topBatchBtn"
      :outerParams="outerParams"
      :edit-btns="edits"
      @left-batch-change="handleLeftBatchChange"
      :right-edit-btns="editBtns"
      :columns="columns"
      :searchFunc="searchFunc"
      ref="layout"
      url="product/interestedCategoryList"
    >
      <!-- <template slot="table">
                <div>45646546</div>
      </template>-->
    </MainLayout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      treeTableOtions: {
        childs: 'children',
        expandFunc: row => {
          return row.childFlag == 0
        }
      },
      topBatchBtn: {
        title: '删除',
        props: {
          label: 'label',
          value: 'label',
          expandTrigger: 'hover'
        },
        options: [
          {
            label: '删除'
          }
        ],
        search: {
          field: 'keyword',
          placeholder: '请输入类目名称'
        }
      },

      // 外部参数
      outerParams: {
        parentId: 0
      },

      edits: [
        {
          name: '编辑',
          fn: scope => {
            this.$refs.layout.$dialog({
              title: '编辑',
              width: '100%',
              params: {
                id: scope.row.systemCategoryId,
                childFlag: scope.row.childFlag
              },
              component: () => import('./components/edit'),
              okBtnText: '保存',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '仓库属性管理',
          fn: scope => {
            this.$refs.layout.$dialog({
              title: '仓库属性管理',
              width: '100%',
              params: {
                systemCategoryId: scope.row.systemCategoryId,
                childFlag: scope.row.childFlag //是否底层类目
              },
              component: () => import('@/components/propertySettings/'),
              okBtnText: '保存',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '平台模板管理',
          fn: scope => {
            this.$router.push({
              path: '/product/common/setup/temp',
              query: {
                systemCategoryId: scope.row.systemCategoryId
              }
            })
          }
        },
        {
          name: '产品活跃度设置',
          fn: scope => {
            this.$refs.layout.$dialog({
              title: '类目活跃度规则设置',
              width: '100%',
              params: {
                id: scope.row.systemCategoryId
              },
              component: () => import('./components/activity'),
              okBtnText: '保存',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '删除',
          fn: scope => {
            this.remove(Array.of(scope.row.systemCategoryInterestedMId))
          }
        },
        {
          name: '操作日志',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '操作日志',
              width: '100%',
              params: { modelLogType: 1 },
              component: () => import('../common/log')
            })
          }
        }
      ],
      editBtns: [
        {
          name: '添加感兴趣类目',
          perm: 'addTask',
          fn: () => {
            this.$router.push({
              path: '/product/common/setup/category/add'
            })
          }
        }
      ],
      columns: [
        {
          label: '类目名称',
          value: 'systemCategoryName',
          async: true,
          expand: true,
          asyncFunc: row => {
            return this.$api[`product/interestedCategoryList`]({
              parentId: row.systemCategoryId || -1
            }).then(data => {
              return data.rows
            })
          },
          render:(h, scope) => {
            return (
              <span>
                {scope.row.systemCategoryName}
                {
                  !scope.row.childFlag ? <el-button
                  on-click={() => {
                    this.$router.push({
                      path: '/product/common/setup/category/add',
                      query:{
                        parentId: scope.row.systemCategoryId
                      }
                    })
                  }}
                  style="font-size:12px"
                  size="mini"
                  class="ml10 link-info"
                  type="text"
                  icon="el-icon-plus"
                >
                  新增下级
                </el-button> : null
                }
              </span>
            )
          }
        },
        {
          label: '添加日期',
          sortable: true,
          value: 'createTime',
          width: 300
        },
        {
          label: '添加人员',
          value: 'userName',
          width: 300
        }
      ]
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
      const ids = selection.map(i => i.systemCategoryInterestedMId)
      const isremove = val[val.length - 1] == '删除'
      isremove && this.remove(ids)
    },
    remove(systemCategoryInterestedMId) {
      this.$confirm('确定删除选中的类目吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['product/interestedCategoryRemovet']({
            idArray: systemCategoryInterestedMId
          }).then(res => {
            this.$message.success(res.msg)
            this.$refs.layout.getList()
          })
        })
        .catch(() => {
          return false
        })
    }
  },
  created() {}
}
</script>

<style>
</style>
