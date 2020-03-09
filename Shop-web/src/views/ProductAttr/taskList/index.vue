<template>
  <div>
    <MainLayout
      :outerParams="outerParams"
      :edits="edits"
      :searchFields="searchFields"
      :editBtns="editBtns"
      :columns="columns"
      :treeTable="treeTable"
      :searchFunc="searchFunc"
      @selectChange="selectChange"
      ref="layout"
      url="taskSelAttrListTask"
    >
      <!-- <div slot="left">123</div> -->
    </MainLayout>
  </div>
</template>

<script>
export default {
  props: ['cateId', 'cateFlag', 'currentCateId'],
  data() {
    let vm = this
    return {
      treeTable: false,
      treeTableOtions: {},
      //筛选条件的搜索
      searchFields: [
        {
          label: '数据源',
          name: 'popularFlag',
          type: 'select',
          width: '140px',
          labelWidth:'50px',
          placeholder: '请选择数据源',
          options: [{ label: '爆款', value: 1 }, { label: '衰款', value: 0 }]
        },
        {
          label: '链接',
          name: 'dataSource',
          type: 'input',
          labelWidth: '50px',
          placeholder: '请输入链接'
        },
        {
          label: '抓取状态',
          name: 'status',
          type: 'select',
          width: '140px',
          placeholder: '请选择抓取状态',
          options: [
            // { label: '待处理', value: 0 },
            { label: '处理中', value: 1 },
            { label: ':处理成功', value: 2 },
            { label: '处理失败', value: 3 }
          ]
        },
        {
          label: '时间范围',
          name: 'time',
          type: 'dateRange',
          placeholder: '请选择',
          width: 200
        }
      ],
      //表格头部操作按钮
      editBtns: [
        {
          name: '添加任务',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '添加任务',
              size: 'small',
              params: {
                isLink: false,
                type: 'store',
                siteId: this.outerParams.siteId,
                sellerId: this.outerParams.sellerId,
                cateId: this.cateId,
                currentCateId: this.currentCateId
              },
              component: () =>
                import('../FirstPage/cateBtnDialogs/addTask.vue'),
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '删除',
          fn: () => {
            this.delBtn()
          }
        },
        {
          name: '重新抓取',
          disabled: () => {
              return this.$refs.layout && this.$refs.layout.selection.length === 0
          },
          showLoading:true,
          fn: () => {
             return this.refsehData()
          }
        }
      ],
      //columns表格
      columns: [
        {
          label: '任务名称',
          value: 'taskName',
          minWidth: 150
        },
        {
          label: '数据源',
          value: 'popularFlag',
          minWidth: 150,
          render(h, scope) {
            return (
              <div>
                <span>{scope.row.popularFlag === 0 ? '衰款' : '爆款'}</span>
              </div>
            )
          }
          // enum:{
          //   0:"衰款",
          //   1:"爆款",
          // }
        },
        {
          label: '抓取源',
          value: 'dataSourceList',
          minWidth: 150,
          render(h, scope) {
            return (
              <el-button
                type="text"
                onClick={() => {
                  vm.$refs.layout.$dialog({
                    title: '数据源',
                    size: 'medium',
                    params: {
                      dataSourceList: scope.row.dataSourceList,
                      type: scope.row.dataType,
                      row: scope.row
                    },
                    component: () => import('./dialogs/dataSourceDialog.vue')
                    //okBtnText: "",
                    //cancelBtnText: "取消"
                  })
                }}
              >
                {scope.row.dataSourceList.length}
              </el-button>
            )
          }
        },
        {
          label: '创建时间',
          value: 'createTime',
          minWidth: 150
        },
        {
          label: '抓取状态',
          value: 'status',
          minWidth: 150,
          render(h, scope) {
            return (
              <span>
                {scope.row.status == 0
                  ? '待处理'
                  : scope.row.status == 1
                  ? '处理中'
                  : scope.row.status == 2
                  ? '处理成功'
                  : '抓取失败'}
              </span>
            )
          }
        },
        {
          label: '结果生成时间',
          value: 'resultTime',
          minWidth: 150
        }
      ],
      //外部参数
      outerParams: {
        startTime: null,
        endTime: null,
        platformId: null,
        siteId: null,
        sellerId: null,
        cateId: this.cateId
      },
      //表格列表操作按钮
      edits: [
        {
          name: '重新抓取',
          icon: 'el-icon-refresh',
          show: scope => {
            return scope.row.status !== 1
          },
          fn: scope => {
            //console.log(scope);
            return this.refsehData(scope.row.taskId)
          }
        }
      ],

      selectIds: [] //勾选的id的数组
    }
  },
  methods: {
    //搜索参数处理
    searchFunc(data) {
      let { time, status, ...info } = data
      let [startTime, endTime] = time || []
      if (status === '') {
        status = null
      }
      return { startTime, status, endTime, ...info }
    },
    //勾选改变
    selectChange(v) {
      this.selectIds = []
      //console.log(v);
      v.forEach(i => {
        this.selectIds.push(i.taskId)
      })
      // console.log(v);
      // console.log(this.selectIds);
    },
    //删除按钮
    delBtn() {
      if (!this.selectIds.length) {
        this.$message({
          message: '请至少选择一项',
          type: 'warning'
        })
        return
      }
      this.$confirm('是否删除选中任务？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['LtaskSelAttrBatchRemove']({
            sellerId: this.outerParams.sellerId,
            platformId: this.outerParams.platformId,
            siteId: this.outerParams.siteId,
            taskIds: this.selectIds
          }).then(data => {
            if (data.code === 0) {
              this.$refs.layout.getList()
            }
          })
        })
        .catch(() => {})
    },
    //重新抓取数据
    refsehData(v) {
      let datas = {
        taskIds: []
      }
      //勾选刷新
      if (this.selectIds.length) {
        datas.taskIds = this.selectIds
      }
      //单个的刷新
      if (v) {
        datas.taskIds = [v]
      }
      return this.$api['LtaskSelAttrreCrawl'](datas)
        .then(data => {
          if (data.code === 0) {
            this.$refs.layout.getList()
          }
        })
        .catch(() => {})
    }
  },
  created() {
    this.outerParams.platformId=this.platformId;
    if (this.sellerId && this.siteId) {
      this.outerParams.siteId = this.siteId
      this.outerParams.sellerId = this.sellerId
    }
  },
  watch: {
    sellerData() {
      if (this.sellerId && this.siteId) {
        this.outerParams.siteId = this.siteId
        this.outerParams.sellerId = this.sellerId
      }
    },
    cateId() {
      this.outerParams.cateId = this.cateId
    }
  }
}
</script>

<style scoped lang="less">
</style>
