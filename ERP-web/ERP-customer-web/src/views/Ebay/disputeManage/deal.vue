<template>
  <div class="deal">
    <div v-for="(item, index) in columns" :key="item.id">
      <twp-simple-table :columns="item" :data="tableData[index]"></twp-simple-table>
    </div>
    <!-- 处理记录 -->
    <ElRow>
      <ElCol :span="24" class="mt10">处理记录</ElCol>
    </ElRow>
    <div v-for="item in records" :key="item.id">
      <ElRow class="deal mt10">
        <ElCol :span="24" style="background: #f5f7fa;">
          <ElCol :span="18">{{ item.handleRoleName }}</ElCol>
          <ElCol :span="4">{{ item.createTime }}</ElCol>
        </ElCol>
        <ElCol :span="24" style="border-top: none">{{ item.handleTypeName }} ({{item.message}})</ElCol>
      </ElRow>
    </div>

    <!-- 处理 -->
    <ElRow>
      <ElCol :span="24" class="mt10">处理</ElCol>
    </ElRow>
    <ElRow style="border: 1px solid #ebeef5;margin-top: 10px;padding-right: 20px;padding-top: 10px;">
      <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="110px">
        <ElFormItem prop="handleType" label-width="30px">
          <!-- <el-input v-model="form.customAccount" placeholder class="normal-input"></el-input> -->
          <el-radio-group v-model="form.handleType">
            <el-radio :label="1">全额退款</el-radio>
            <el-radio :label="2">提供其他解决方案</el-radio>
            <el-radio :label="3">提供物流跟踪号</el-radio>
            <el-radio :label="4">提供退款凭证</el-radio>
          </el-radio-group>
        </ElFormItem>
        <ElRow v-if="form.handleType == 3">
          <ElCol :span="5">
            <ElFormItem label="承运人" prop="carrier">
              <el-input v-model="form.carrier" placeholder class="normal-input"></el-input>
            </ElFormItem>
          </ElCol>
          <ElCol :span="8">
            <ElFormItem label="追踪号" label-width="130px" prop="trackingNumber">
              <el-input v-model="form.trackingNumber" placeholder class="normal-input"></el-input>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow v-else-if="form.handleType == 4">
          <ElCol :span="24">
            <ElFormItem label="上传退款凭证" label-width="130px" prop="refundOucher">
              <!-- 上传文件 -->
              <twp-updata
                :list.sync="form.refundOucher"
                @success="val => upFlag=val"
                listType="picture"
                btnMsg="上传退款凭证"
                accept="image"
              ></twp-updata>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElFormItem label="附加留言" prop="message">
          <el-input :autosize="{ minRows: 6, maxRows: 6}" v-model="form.message" type="textarea" placeholder></el-input>
        </ElFormItem>
      </ElForm>
    </ElRow>
  </div>
</template>

<script>
import mixins from '../mixins.js'
export default {
  mixins: [mixins],
  data() {
    let vm = this
    return {
      searchConfig: [{}],
      dealFlag: true,
      fileList: [],
      form: {},
      rules: vm.$formValidate([
        {
          label: '自定义账户名',
          value: 'handleType'
        },
        {
          label: '承运人',
          value: 'carrier'
        },
        {
          label: '追踪号',
          value: 'trackingNumber'
        },
        {
          label: '上传退款凭证',
          value: 'refundOucher'
        },
        {
          label: '附加留言',
          value: 'message'
        }
      ]),
      upFlag: false,
      columns: [
        [
          {
            label: '纠纷编号',
            value: 'disputeNumber'
          },
          {
            label: '订单号',
            value: 'orderNumber',
            render: vm.orderJump()
          },
          {
            label: '订单国家',
            value: 'countryName'
          },
          {
            label: '客户ID',
            value: 'memberId'
          },
          {
            label: '卖家评价',
            value: 'sellerEvaluateName'
          },
          {
            label: '买家评价',
            value: 'memberEvaluateName'
          }
        ],
        [
          {
            label: '支付状态',
            value: 'paymentStateName'
          },
          {
            label: '支付时间',
            value: 'paymentTime'
          },
          {
            label: '发货状态',
            value: 'deliveryStateName'
          },
          {
            label: '发货时间',
            value: 'deliveryTime'
          },
          {
            label: '运输方式',
            value: 'transportName'
          },
          {
            label: '包裹追踪号',
            value: 'trackingNumber',
            href: 'https://www.kuaidi100.com/',
            render: vm.pageJump()
          }
        ],
        [
          {
            label: '发起时间',
            value: 'disputeTime'
          },
          {
            label: '开启原因',
            value: 'disputeReason'
          },
          {
            label: '详细状态',
            value: 'disputeStateName'
          },
          {
            label: '金额',
            value: 'orderAmount'
          },
          {
            label: '物品名',
            value: 'productName',
            render(h, scope) {
              return (
                <div
                  onClick={() => {
                    let a = document.createElement('a')
                    a.href = vm.productLink
                    a.target = '_blank'
                    a.click()
                    a = null
                  }}
                  style="color:#108ee9;cursor:pointer"
                >
                  {scope.productName}
                </div>
              )
            }
          },
          {
            label: '买家期望',
            value: 'memberExpect'
          }
        ]
      ],
      tableData: [{}],
      records: [],
      disputeId: null,
      productLink: ''
    }
  },
  watch: {},
  methods: {
    edit(params) {
      let vm = this
      vm.disputeId = params.disputeId
      return vm.$api[`email/ebayDisputeInfo`](params).then(({ rows }) => {
        vm.productLink = rows.productLink
        vm.records = rows.records
        this.$set(vm.tableData, 0, {
          disputeNumber: rows.disputeNumber,
          orderNumber: rows.orderNumber,
          countryName: rows.countryName,
          memberId: rows.memberId,
          sellerEvaluateName: rows.sellerEvaluateName,
          memberEvaluateName: rows.memberEvaluateName
        })
        this.$set(vm.tableData, 1, {
          paymentStateName: rows.paymentStateName,
          paymentTime: rows.paymentTime,
          deliveryStateName: rows.deliveryStateName,
          deliveryTime: rows.deliveryTime,
          transportName: rows.transportName,
          trackingNumber: rows.trackingNumber
        })
        this.$set(vm.tableData, 2, {
          disputeTime: rows.disputeTime,
          disputeReason: rows.disputeReason,
          disputeStateName: rows.disputeStateName,
          orderAmount: rows.orderAmount,
          productName: rows.productName,
          memberExpect: rows.memberExpect
        })
        return Promise.resolve()
      })
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      _data.disputeId = vm.disputeId
      if (!vm.upFlag) {
        delete _data.refundOucher
      }
      vm.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(_data)
        } else {
          console.log('error')
        }
      })
    },
    resetForm() {}
  }
}
</script>

<style lang='scss'>
.deal {
  background: #fff;
  .normal-input {
    width: 160px;
  }
  .mt10 {
    margin-top: 10px;
  }
  .deal {
    & > .el-col {
      padding: 10px;
      border: 1px solid #ebeef5;
    }
  }
}
</style>