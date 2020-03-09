<template>
  <div class="email-index">
    <el-tabs type="border-card" @tab-click="tabClick" class="email-box" v-model="name">
      <el-tab-pane label="收件箱" name="inbox">
        <router-view v-if="name === 'inbox'"></router-view>
      </el-tab-pane>
      <el-tab-pane label="发件箱" name="outbox">
        <router-view v-if="name === 'outbox'"></router-view>
      </el-tab-pane>
      <el-tab-pane label="草稿箱" name="Drafts">
        <router-view v-if="name === 'Drafts'"></router-view>
      </el-tab-pane>
      <el-tab-pane label="回收站" name="Recycled">
        <router-view v-if="name === 'Recycled'"></router-view>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  provide: {
    platformId: 2,
    deleteList(params) {
      let vm = this
      vm.$confirm('此操作将删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/recycleAdd'](params).then(data => {
            vm.$message({
              dangerouslyUseHTMLString: true,
              type: 'warning',
              message: `<strong>成功移动到回收站${
                data.successNum
              }条邮件</strong>，<strong>失败${data.failNum}条邮件</strong>`
            })
            vm.getList()
            vm.$refs.table.clearSelection()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getList() {
      let vm = this
      return vm.$api['email/emailPage'](vm.extendObj(vm.listParams))
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (data) {
            vm.replyNum = data.replyNum
            vm.noReplyNum = data.noReplyNum
            vm.pageNo = data.pageNo
            vm.pageSize = data.pageSize
            vm.total = data.total
            vm.tableData = data.rows
            vm.tableData.map(item => {
              if (item.replyType === 1) {
                item.replyTypeName = '未回复'
              } else if (item.replyType === 2) {
                item.replyTypeName = '已回复'
              } else if (item.replyType === 3) {
                item.replyTypeName = '不需要回复'
              }
            })
            if (vm.emailAllBaseIds) {
              vm.emailAllBaseIds = vm.tableData.map(item => {
                return item.emailBaseId
              })
            }
          }
          return data
        })
    },
    extendObj(...obj) {
      let listParams = this.listParams
      if (typeof obj[0] === 'boolean') {
        obj.shift()
        listParams.pageNumber = 1
        listParams.pageSize = 10
        if (listParams.receiveTimeStart || listParams.receiveTimeEnd) {
          delete listParams.receiveTimeStart
          delete listParams.receiveTimeEnd
        }
        if (listParams.replyTimeEnd || listParams.replyTimeStart) {
          delete listParams.replyTimeEnd
          delete listParams.replyTimeStart
        }
        if (listParams.createTimeEnd || listParams.createTimeStart) {
          delete listParams.createTimeEnd
          delete listParams.createTimeStart
        }
      }
      return (this.listParams = Object.assign(listParams, ...obj))
    }
  },
  data() {
    return {
      name: 'outbox'
    }
  },
  created() {
    let routeArr = this.$route.path.split('/')
    this.name = routeArr.pop()
  },
  computed: {},
  methods: {
    tabClick(tab) {
      this.$router.push({ path: tab.name })
    }
  }
}
</script>

<style lang="scss">
.email-index {
  .email-box {
    .el-tab-pane {
      height: 700px;
    }
  }
}
</style>
