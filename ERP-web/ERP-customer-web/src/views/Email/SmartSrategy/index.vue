<template>
  <div class="smart-srategy">
    <universal-layout
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <section slot="search">
        <search ref="search" :searchList="searchList" @search="handleSearch"></search>
      </section>
      <section slot="allbtn">
        <el-button type="primary" size="mini" class="search-submit" @click="handleConditionOut">当前条件导出</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleStrategyOut">按策略统计导出</el-button>
      </section>
      <section slot="table">
        <yt-table
          :columns="tableColumns"
          reserveSelection="emailAutoReplyHistoryId"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
        ></yt-table>
      </section>
    </universal-layout>
  </div>
</template>

<script>
import CopyBtn from '../Comment/CopyBtn'
import { mapActions, mapState } from 'vuex'
import { downloadFile } from 'Utils/tools.js'
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'timeType',
          type: 'select',
          placeholder: '支付时间',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: 1,
              label: '支付时间'
            },
            {
              value: 2,
              label: '邮件发送时间'
            }
          ]
        },
        {
          value: 'time',
          type: 'time',
          size: 'small'
        },
        {
          value: 'emailAccountId',
          type: 'select',
          placeholder: '邮箱账号',
          size: 'small',
          style: {
            width: '120px'
          },
          children: []
        },
        {
          value: 'emailReplyPolicyId',
          type: 'select',
          placeholder: '选择策略',
          size: 'small',
          style: {
            width: '120px'
          },
          children: []
        },
        {
          value: 'orderType',
          type: 'select',
          placeholder: '系统订单号',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: 1,
              label: '系统订单号'
            },
            {
              value: 2,
              label: '平台订单号'
            }
          ]
        },
        {
          value: 'orderNum',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '170px'
          }
        }
      ],
      tableColumns: [
        {
          value: 'paymentTime',
          label: '订单支付时间'
        },
        {
          value: 'createTime',
          label: '发邮时间'
        },
        {
          value: 'subject',
          label: '邮件主题'
        },
        {
          value: 'orderNumSystem',
          label: '系统订单号'
        },
        {
          value: 'orderNumPlatform',
          label: '平台订单号'
        },
        {
          value: 'emailAccount',
          label: '邮箱账号'
        },
        {
          value: 'emailReplyPolicy',
          label: '策略'
        }
      ],
      tableData: [],
      options: {
        visible: false,
        title: '添加',
        width: '930px',
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
      listParams: {
        pageNumber: 1,
        pageSize: 10,
        total: 1,
        sortOrder: 'asc'
      },
      selectData: []
    }
  },
  created() {
    let vm = this
    vm.getEmailAccountList()
    vm.getList()
    vm.$api['email/replyPolicyList']({})
      .then(data => {
        if (!data) {
          return
        }
        let val = data.rows
        val = val.map(item => {
          return {
            label: item.policyName,
            value: item.emailReplyPolicyId
          }
        })
        vm.searchList[3].children = val
      })
      .catch(err => {
        console.log(err)
      })
  },
  computed: {
    ...mapState('email', ['emailAccountList'])
  },
  watch: {
    emailAccountList(val) {
      this.searchList[2].children = val
    }
  },
  methods: {
    ...mapActions('email', ['getEmailAccountList']),
    handleCurrentChange(val) {
      this.extendObj({
        pageNumber: val
      })
      this.getList()
    },
    handleSizeChange(val) {
      this.extendObj({
        pageSize: val
      })
      this.getList()
    },
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleSearch(val) {
      let vm = this
      let data = vm.$.deepClone(val)
      if (data.time && data.time.length) {
        data.timeStart = data.time[0]
        data.timeEnd = data.time[1]
        delete data.time
      }
      vm.extendObj(true, data)
      vm.getList()
    },
    handleDetail(index, row) {
      console.log(index, row)
    },
    onSubmit() {
      console.log('submit')
    },
    sendEmail() {
      this.options.visible = true
    },
    handleConditionOut() {
      let vm = this
      let params = vm.$refs.search.search()
      if (params.time) {
        params.timeStart = params.time[0]
        params.timeEnd = params.time[1]
        delete params.time
      }
      vm.$api['email/historyDownloadConditions'](params)
        .then(data => {
          let { path } = data
          downloadFile(path)
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleStrategyOut() {
      let vm = this
      vm.$api['email/historyDownloadPolicy']()
        .then(data => {
          let { path } = data
          downloadFile(path)
        })
        .catch(err => {
          console.log(err)
        })
    },
    getList() {
      let vm = this
      return vm.$api['email/autoHistoryPage'](vm.extendObj(vm.listParams))
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (data) {
            if (!data || !data.rows) {
              return
            }
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
      if (typeof obj[0] === 'boolean') {
        obj.shift()
        listParams = {}
        listParams.pageNumber = 1
        listParams.pageSize = 10
        listParams.sortOrder = 'asc'
      }
      return (this.listParams = Object.assign(listParams, ...obj))
    }
  },
  mounted() {},
  components: {
    CopyBtn
  }
}
</script>

<style lang='scss'>
.smart-srategy {
  .search-top-form {
    .el-form-item {
      margin-bottom: 0;
    }
    .el-form-item__content {
      line-height: 33px;
    }
    .channel-input {
      .el-input {
        width: 110px;
      }
    }
    .select-time {
      .el-form-item__content {
        width: 170px;
      }
    }
    .search-input {
      .el-input {
        width: 200px;
      }
    }
  }
  .dialog-form {
    .normal-input-width {
      width: 260px !important;
    }
    .el-form-item {
      margin-bottom: 4px;
    }
    .inlude-width {
      width: 100px;
    }
    .line {
      width: 30px;
      padding-left: 16px;
    }
    .marginLeft10 {
      margin-left: 10px;
    }
    .warp-input {
      .el-input {
        width: 250px;
      }
    }
    .padding6 {
      padding: 0 6px;
    }
    .partition {
      width: 100%;
      height: 40px;
      line-height: 40px;
      text-align: center;
      background: #f1f1f1;
      margin: 8px 0;
    }
  }

  .isChecked {
    padding-left: 0px;
  }
}
</style>
