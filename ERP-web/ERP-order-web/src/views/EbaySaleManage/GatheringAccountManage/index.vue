<template>
  <div class="gathering-account-manage">
    <yt-page
      url="order/ebayReceiptAccountList"
      reserveSelection="ebayReceiptAccountId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="val => selectData=val"
      ref="page"
    >
      <template slot="table">
        <el-table-column label="操作" align="center" width="90px">
          <template slot-scope="scope">
            <el-tooltip effect="dark" content="编辑" placement="top" :open-delay="500">
              <i class="el-icon-edit iconBtn" @click="handleEdit(scope.$index,scope.row)"/>
            </el-tooltip>
            <el-tooltip effect="dark" content="操作日志" placement="top" :open-delay="500">
              <i class="el-icon-document iconBtn" @click="handleOperatorLog(scope.$index,scope.row)"/>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </yt-page>
    <log-info :params="logParams"></log-info>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      logParams: {
        url: '',
        info: {},
        visible: true
      },
      selectData: [],
      searchData(val) {
        return val
      },
      btnConfig: [
        {
          name: '添加',
          fn: () => {
            vm.$refs.page.$dialog({
              title: 'eBay和Paypal关联信息添加',
              width: '500px',
              visible: true,
              component: () => import('./addGatheringAccount.vue')
            })
          }
        },
        {
          name: '删除',
          fn: () => {
            if (vm.$editMsg(vm.selectData, false)) {
              return
            }
            vm.$api[`order/ebayReceiptAccountRemove`]({
              ebayReceiptAccountIds: vm.selectData.map(
                item => item.ebayReceiptAccountId
              )
            }).then(() => {
              vm.$refs.page.getList('search')
              vm.$refs.page.clearSelection()
            })
          }
        }
      ],
      searchConfig: [
        {
          label: '账户名:',
          value: 'customAccount',
          type: 'input'
        },
        {
          label: '用户名:',
          value: 'apiName',
          type: 'input'
        },
        {
          label: '签名:',
          value: 'apiSign',
          type: 'input'
        }
      ],
      tableConfig: [
        {
          label: 'Ebay账号',
          value: 'ebayAccount'
        },
        {
          label: '关联Paypal账号',
          value: 'customAccount'
        },
        {
          label: '收款邮箱',
          value: 'ebayReceiptEmail'
        },
        {
          label: '添加时间',
          value: 'createTime'
        },
        {
          label: '添加人',
          value: 'creatorName'
        }
      ]
    }
  },
  mounted() {},
  methods: {
    handleEdit(index, row) {
      let vm = this
      vm.$refs.page.$dialog({
        title: 'eBay和Paypal关联信息编辑',
        width: '500px',
        visible: true,
        component: () => import('./addGatheringAccount.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              ebayReceiptAccountId: row.ebayReceiptAccountId
            }
          }
        ]
      })
    },
    handleOperatorLog(index, row) {
      this.logParams = {
        url: 'order/ebayReceiptAccountGetOperatorLog',
        info: {
          ebayReceiptAccountId: row.ebayReceiptAccountId
        },
        visible: true
      }
    },
    async submitForm(data, title) {
      let vm = this
      console.log(title)
      switch (title) {
        case 'eBay和Paypal关联信息添加':
          vm.$api[`order/ebayReceiptAccountSave`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case 'eBay和Paypal关联信息编辑':
          vm.$api[`order/ebayReceiptAccountUpdate`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        default:
          break
      }
    }
  }
}
</script>

<style lang='scss'>
.gathering-account-manage {
  background: #fff;
}
</style>