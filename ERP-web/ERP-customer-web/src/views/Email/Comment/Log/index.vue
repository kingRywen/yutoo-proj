<template>
  <div class="log">
    <yt-dialog :options="options">
      <el-row>
        <el-table :data="tableData" style="width: 100%">
          <el-table-column fixed prop="operatorName" label="操作人" width="120"></el-table-column>
          <el-table-column prop="createTime" label="操作时间" width="200"></el-table-column>
          <el-table-column prop="bussinessName" label="操作内容"></el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <div class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10,20,30,60,80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </div>
      </el-row>
    </yt-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 10,
      tableData: [],
      listParams: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      options: {
        visible: false,
        title: '操作日志',
        width: '800px',
        fullscreen: false,
        top: '20vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      emaiUrl: ''
    }
  },
  created() {},
  watch: {},
  methods: {
    getlogOption(url, ids) {
      let vm = this
      vm.emaiUrl = url
      vm.extendObj(ids)
      vm.getList()
      vm.options.visible = true
    },
    handleSizeChange(val) {
      this.extendObj({
        pageSize: val
      })
      this.getList()
    },
    handleCurrentChange(val) {
      this.extendObj({
        pageNumber: val
      })
      this.getList()
    },
    getList() {
      let vm = this
      return vm.$api[vm.emaiUrl](vm.listParams)
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (data) {
            vm.pageNo = data.pageNo
            vm.pageSize = data.pageSize
            vm.total = data.total
            vm.tableData = data.rows
          }
          return data
        })
    },
    extendObj(...obj) {
      let listParams = this.listParams
      this.listParams = Object.assign(listParams, ...obj)
    }
  }
}
</script>

<style lang="scss">
.log {
  .pagination {
    text-align: right;
    margin-top: 10px;
    // position: absolute;
    // bottom: 10px;
    // left: 0;
    // right: 0;
  }
}
</style>
