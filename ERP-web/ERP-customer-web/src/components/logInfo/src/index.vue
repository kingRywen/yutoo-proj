<template>
  <div class="log-info">
    <yt-dialog :options="options" :events="events">
      <search :searchList="searchList" @search="handleSearch"></search>
      <yt-table :data="data" :columns="columns" style="margin-top: 20px;"></yt-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-sizes="[10,30,60,80]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        style="margin-top: 10px;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;"
      ></el-pagination>
    </yt-dialog>
  </div>
</template>

<script>
export default {
  name: 'log-info',
  props: {
    params: {
      type: Object,
      default: () => {
        return {
          url: '',
          info: {},
          visible: false
        }
      }
    },
    columns: {
      type: Array,
      default: () => {
        return [
          {
            label: '操作时间',
            value: 'createTime'
          },
          {
            label: '操作人',
            value: 'operatorName'
          },
          {
            label: '操作内容',
            value: 'operatorMsg'
          }
        ]
      }
    },
    searchList: {
      type: Array,
      default: () => {
        return [
          {
            label: '操作时间:',
            type: 'time',
            value: 'time'
          },
          {
            label: '操作内容',
            type: 'input',
            value: 'input'
          }
        ]
      }
    }
  },
  data() {
    let vm = this
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      data: [],
      options: {
        visible: false,
        title: '操作日志',
        width: '80%',
        fullscreen: false,
        top: '10vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: true,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      events: {
        open() {
          vm.getList()
        }
      },
      searchData: {}
    }
  },
  created() {},
  watch: {
    logParams(val) {
      this.options.visible = val.visible
    }
  },
  computed: {
    logParams: {
      get() {
        let vm = this
        return vm.params
      },
      set() {}
    }
  },
  methods: {
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList('search', true)
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    handleSearch(val) {
      val = JSON.parse(JSON.stringify(val))
      if (val.time) {
        val.startTime = val.time[0]
        val.endTime = val.time[1]
        delete val.time
      }
      this.searchData = val
      this.getList('search')
    },
    getList(type, flag) {
      let vm = this
      if (!flag) {
        vm.pageNo = 1
      }
      let params = {
        pageSize: vm.pageSize,
        pageNumber: vm.pageNo,
        sort: 'asc',
        ...vm.logParams.info
      }

      if (type) {
        params = {
          ...params,
          ...vm.searchData
        }
      }
      if (!vm.logParams.url) {
        return
      }
      vm.$api[vm.logParams.url](params).then(({ rows }) => {
        vm.data = rows
      })
    }
  }
}
</script>

<style lang='scss'>
.log-info {
  background: #fff;
}
</style>