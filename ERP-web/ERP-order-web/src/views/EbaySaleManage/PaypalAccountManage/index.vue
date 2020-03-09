<template>
  <div class="paypal-account-manage">
    <yt-page
      url="order/paypalAccountList"
      reserveSelection="ebayPaypalAccountId"
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
              title: '添加PayPal',
              width: '500px',
              visible: true,
              component: () => import('./addPayPalAccount.vue')
            })
          }
        },
        {
          name: '删除',
          fn: () => {
            if (vm.$editMsg(vm.selectData, false)) {
              return
            }
            vm.$api[`order/paypalAccountRemove`]({
              ebayPaypalAccountIds: vm.selectData.map(
                item => item.ebayPaypalAccountId
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
          label: '账号',
          value: 'customAccount'
        },
        {
          label: '用户名',
          value: 'apiName'
        },
        {
          label: '签名',
          value: 'apiSign'
        },
        {
          label: '运行环境',
          // value: 'apiRunAmbient',
          render(h, scope) {
            return <div>{scope.row.apiRunAmbient == 1 ? '测试' : '正式'}</div>
          }
        },
        {
          label: '添加时间',
          value: 'createTime',
          width: '150px'
        }
      ]
    }
  },

  methods: {
    handleEdit(index, row) {
      let vm = this
      vm.$refs.page.$dialog({
        title: '编辑PayPal',
        width: '500px',
        visible: true,
        component: () => import('./addPayPalAccount.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              ebayPaypalAccountId: row.ebayPaypalAccountId
            }
          }
        ]
      })
    },
    handleOperatorLog(index, row) {
      this.logParams = {
        url: 'order/paypalAccountGetOperatorLog',
        info: {
          ebayPaypalAccountId: row.ebayPaypalAccountId
        },
        visible: true
      }
    },
    async submitForm(data, title) {
      let vm = this
      console.log(title)
      switch (title) {
        case '添加PayPal':
          vm.$api[`order/paypalAccountSave`](data).then(() => {
            vm.$refs.page.closeForm()
          })
          break
        case '编辑PayPal':
          vm.$api[`order/paypalAccountUpdate`](data).then(() => {
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
.paypal-account-manage {
  background: #fff;
}
</style>