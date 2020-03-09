<template>
  <div v-loading="loading">
    <template v-if="!pay">
      <div style="margin-bottom:20px">*提示：正常/暂停的账号可以重新激活账号，所有用户历史数据清零，请谨慎操作。另需额外收取一次性手续费。</div>
      <el-form :model="data" label-width="80px" size="small" ref="form1" :rules="rules1">
        <el-row type="flex">
          <ElCol :span="12">
            <ElFormItem label="账号数">
              <el-input v-model="num" disabled placeholder></el-input>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="应付金额" prop="needPay">
              <el-input-number class="w100" controls-position="right" v-model="data.needPay" :min="1" placeholder></el-input-number>
            </ElFormItem>
          </ElCol>
        </el-row>
      </el-form>
      <el-table :data="outerData.list">
        <NoneData slot="empty"></NoneData>
        <ElTableColumn label="账号" prop="account"></ElTableColumn>
        <ElTableColumn label="姓名" prop="name"></ElTableColumn>
        <ElTableColumn label="类目" prop="categoryCount">
          <template slot-scope="scope">
            <div>
              <el-popover placement="right" trigger="hover" @show="handleShow(scope)">
                <div>
                  <el-table v-if="scope.row.cateList" :data="scope.row.cateList || []">
                    <el-table-column label="类目" prop="name"/>
                  </el-table>
                  <p v-else>加载中...</p>
                </div>
                <el-button type="text" slot="reference">
                  <b>{{scope.row.categoryCount}}</b>
                </el-button>
              </el-popover>
            </div>
          </template>
        </ElTableColumn>
      </el-table>
    </template>
    <template v-else>
      <el-row :gutter="20" type="flex" class="per100">
        <el-col :span="12">
          <SimpleForm labelWidth="120px" :fields="payFields" :default-data="defaultPayData" ref="activate"></SimpleForm>
        </el-col>
        <el-col :span="12" class="txc">
          <div class="txc mt20">
            <el-radio :label="0" v-model="selectPayStyle">支付宝</el-radio>
            <el-radio :label="1" v-model="selectPayStyle">微信</el-radio>
          </div>
          <img class="mt10" v-if="selectPayStyle === 0" src="../../components/alipay.gif">
          <img class="mt10" v-else src="../../components/weipay.png">
        </el-col>
      </el-row>
    </template>
  </div>
</template>

<script>
export default {
  props: ['outerData'],
  data() {
    return {
      rules1: {
        needPay: [{ required: true, message: '请输入应付金额' }]
      },
      loading: false,
      data: {},
      num: null,
      tableData: [],
      pay: false,
      payFields: [
        {
          label: '账号数',
          name: 'accountCount',
          disabled: true
        },
        {
          label: '应付金额',
          name: 'needPay',
          disabled: true
        },
        {
          label: '支付姓名',
          name: 'payName',
          required: true
        },
        {
          label: '支付账号',
          name: 'payAccount',
          required: true
        },
        {
          label: '留言',
          name: 'remark',
          type: 'textarea',
          rows: 5
        }
      ],
      defaultPayData: {},
      selectPayStyle: 0
    }
  },
  methods: {
    handleShow(scope) {
      let { accountId } = scope.row
      this.$set(scope.row, 'cateList', null)
      this.$api[`main/accountListCategory`]({ accountId })
        .then(data => {
          this.$set(scope.row, 'cateList', data)
        })
        .catch(err => {})
    },
    initData() {
      console.log(this.outerData)
    },
    active(params, close, name = 'accountReactive') {
      return this.$api[`main/${name}`](params).then(data => {
        this.defaultPayData = data.rows
        this.pay = !close
        return Promise.resolve(close)
      })
    },
    submit() {
      if (!this.pay) {
        // 获取重新支付数据  第一个页面
        return this.$refs.form1.validate().then(() => {
          let params = {
            accountIdArray: this.lists,
            needPay: this.data.needPay
          }
          return this.active(params, false)
        })
      } else {
        // debugger
        // 重新激活支付 第二个页面
        let vm = this
        return vm.$refs.activate.validate().then(() => {
          let {
            accountCount,
            accountIdArray,
            needPay,
            payName,
            payAccount,
            remark
          } = vm.$refs.activate.formData

          let params = {
            type: 1,
            orderType: 1,
            accountCount,
            accountIdArray,
            needPay,
            payType: vm.selectPayStyle,
            payName,
            payAccount,
            remark
          }
          return vm.active(params, true, 'merchantOrderPayReactivePay')
          // return Promise.resolve(true)
        })
      }
    }
  },
  beforeDestroy() {
    this.pay = true
  },
  computed: {
    lists() {
      return this.outerData.list.map(el => el.accountId)
    }
  },
  watch: {
    'outerData.list.length': {
      immediate: true,
      handler(val) {
        this.num = val
      }
    },
    lists(val) {
      console.log(val)
    }
  }
}
</script>

<style>
</style>
