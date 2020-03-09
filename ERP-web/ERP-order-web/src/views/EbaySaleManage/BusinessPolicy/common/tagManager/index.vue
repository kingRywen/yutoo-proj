<template>
  <div class="tag-manager">
    <ElRow>
      <ElCol :span="24">
        <search :searchList="searchList" @search="search"></search>
      </ElCol>
    </ElRow>
    <ElRow class="mt10">
      <ElCol :span="24">
        <el-button type="primary" size="small" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="small" @click="handleDelete">删除</el-button>
      </ElCol>
    </ElRow>
    <ElRow class="mt10">
      <ElCol :span="24">
        <yt-table
          reserveSelection="ebayLabelId"
          ref="table"
          :data="data"
          :columns="columns"
          @handleSelectionChange="val => selectData = val"
        >
          <template slot="right">
            <el-table-column label="操作" align="center" width="100px">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
                  <i @click="handleEdit(scope.$index,scope.row)" class="el-icon-edit iconBtn"/>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="top" :open-delay="500">
                  <i @click="handleDelete(scope.$index,scope.row)" class="el-icon-delete iconBtn"/>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
        </yt-table>
      </ElCol>
    </ElRow>
    <ElRow>
      <ElCol :span="24">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageNo"
          :page-sizes="[10,30,60,80]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        ></el-pagination>
      </ElCol>
    </ElRow>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>

<script>
export default {
  data() {
    return {
      labelName: '',
      searchList: [
        {
          label: '关键词',
          value: 'labelName',
          type: 'input'
        }
      ],
      data: [],
      columns: [
        {
          label: '名称',
          value: 'labelName'
        },
        {
          label: '添加人员',
          value: 'creatorName'
        },
        {
          label: '添加时间',
          value: 'createTime'
        }
      ],
      selectData: [],
      pageNo: 1,
      pageSize: 10,
      total: 0
    }
  },
  methods: {
    submitForm(cb) {
      cb && cb({ aaa: 1111 })
    },
    handleEdit(index, row) {
      let vm = this
      vm.$refs.dialog.$dialog({
        title: '编辑标签',
        visible: true,
        width: '500px',
        component: () => import('./addManager.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              ebayLabelId: row.ebayLabelId
            }
          }
        ],
        submitForm(data) {
          return vm.$api[`order/ebayLabelUpdate`](data).then(() => {
            vm.getList()
          })
        }
      })
    },
    handleDelete(index, row) {
      let vm = this
      let ebayLabelIds = this.selectData.map(item => item.ebayLabelId)
      if (row) {
        ebayLabelIds = [row.ebayLabelId]
      } else {
        if (this.$editMsg(this.selectData, false)) return
        ebayLabelIds = this.selectData.map(item => item.ebayLabelId)
      }

      vm.$api[`order/ebayLabelRemove`]({ ebayLabelIds }).then(() => {
        vm.getList('search')
        this.$refs.table.clearSelection()
      })
    },
    handleAdd() {
      let vm = this
      vm.$refs.dialog.$dialog({
        title: '添加标签',
        visible: true,
        width: '500px',
        component: () => import('./addManager.vue'),
        submitForm(data) {
          return vm.$api[`order/ebayLabelSave`](data).then(() => {
            vm.getList()
          })
        }
      })
    },
    search(val) {
      this.labelName = val.labelName
      this.getList('search')
    },
    handleSizeChange(val) {
      let vm = this
      vm.pageSize = val
      vm.getList('search')
    },
    handleCurrentChange(val) {
      let vm = this
      vm.pageNo = val
      vm.getList('search', true)
    },
    getList(type, flag) {
      let vm = this
      if (flag !== true) {
        vm.pageNo = 1
      }
      let params = {
        sortOrder: 'asc',
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo
      }
      if (type) {
        params.labelName = vm.labelName
      }
      vm.$api[`order/ebayLabelList`](params).then(
        ({ rows = [], pageNo, total, pageSize }) => {
          vm.data = rows
          vm.pageNo = pageNo
          vm.total = total
          vm.pageSize = pageSize
        }
      )
    }
  }
}
</script>

<style lang='scss'>
.tag-manager {
  background: #fff;
  .mt10 {
    margin-top: 10px;
  }
}
</style>