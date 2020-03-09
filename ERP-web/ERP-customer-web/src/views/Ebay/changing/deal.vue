<template>
  <div class="deal">
    <div v-for="(item,index) in columns" :key="item.id">
      <twp-simple-table :columns="item" :data="tableData[index]"></twp-simple-table>
    </div>
    <!-- 退货产品列表 -->
    <ElRow>
      <ElCol :span="24" class="mt10">退货产品列表</ElCol>
    </ElRow>
    <ElRow>
      <ElCol :span="24" class="mt10">
        <twp-simple-table :columns="logColumns" :data="logData"></twp-simple-table>
      </ElCol>
    </ElRow>

    <!--处理情况  -->
    <ElRow>
      <ElCol :span="24" class="mt10">
        <ElCol :span="22">处理情况</ElCol>
        <ElCol :span="2" v-if="files.length" style="color: #108ee9">
          <span @click="handleViews">查看附件</span>
        </ElCol>
      </ElCol>
    </ElRow>
    <ElRow class="deal mt10" v-for="item in records" :key="item.id">
      <ElCol :span="24" style="background: #f5f7fa;">
        <ElCol :span="20">{{item.contentTypeName || '-'}}</ElCol>
        <ElCol :span="4">{{item.handleTime}}</ElCol>
      </ElCol>
      <ElCol :span="24" style="border-top: none">{{item.content}}</ElCol>
    </ElRow>

    <!-- 处理 -->
    <ElRow>
      <ElCol :span="24" class="mt10">处理</ElCol>
    </ElRow>
    <ElRow style="border: 1px solid #ebeef5;margin-top: 10px;padding-right: 20px;padding-top: 10px;">
      <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
        <ElFormItem prop="customAccount" label-width="30px">
          <!-- <el-input v-model="form.customAccount" placeholder class="normal-input"></el-input> -->
          <el-radio-group v-model="form.handleType">
            <el-radio :label="1">接收退货请求</el-radio>
            <el-radio :label="2">全部退款</el-radio>
            <el-radio :label="3">部分退款</el-radio>
            <el-radio :label="4">发送massage</el-radio>
          </el-radio-group>
        </ElFormItem>
        <ElRow v-if="form.handleType == 1">
          <ElCol :span="5">
            <ElFormItem label="退货地址">
              <el-input v-model="form.address" placeholder style="width: 120px"></el-input>
            </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="收件人" label-width="80px">
              <el-input v-model="form.receiver" placeholder style="width: 120px"></el-input>
            </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="联系电话" label-width="80px">
              <el-input v-model="form.phone" placeholder style="width: 120px"></el-input>
            </ElFormItem>
          </ElCol>
          <ElCol :span="5">
            <ElFormItem label="邮编" label-width="50px">
              <el-input v-model="form.postCode" placeholder style="width: 120px"></el-input>
            </ElFormItem>
          </ElCol>
          <ElCol :span="4">
            <ElButton type="primary" size="small" @click="handleAddAdress">选择地址</ElButton>
          </ElCol>
        </ElRow>
        <ElRow v-if="form.handleType == 3">
          <ElCol :span="5">
            <ElFormItem label="退款金额">
              <el-input v-model="form.returnAmount" placeholder class="normal-input"></el-input>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow v-else-if="form.handleType == 4">
          <ElCol :span="24">
            <ElFormItem label="Message">
              <el-input :autosize="{ minRows: 4, maxRows: 4}" v-model="form.message" type="textarea" placeholder></el-input>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </ElForm>
    </ElRow>
    <yt-dialog ref="dialog" :options="dialogOptions">
      <add-adress :value.sync="selectInfo"></add-adress>
    </yt-dialog>
    <twp-dialog-component ref="dialogCom"></twp-dialog-component>
  </div>
</template>

<script>
import addAdress from './addAdress/add'
import { downloadFile } from 'Utils/tools.js'
export default {
  data() {
    let vm = this
    return {
      selectInfo: {},
      dialogOptions: {
        title: '添加地址',
        width: '1000px',
        visible: false,
        appendToBody: true
      },
      fileList: [],
      form: {},
      rules: {},
      records: [{}],
      logColumns: [
        {
          label: '物品ID',
          value: 'returnProductId'
        },
        {
          label: '标题',
          value: 'title',
          render(h, scope) {
            return (
              <div
                style="color:#108ee9;cursor:pointer"
                onClick={() => {
                  vm.pageJump(scope.itemLink)
                }}
              >
                {scope.title}
              </div>
            )
          }
        },
        {
          label: '退货数量',
          value: 'returnQuantity'
        },
        {
          label: '价格',
          value: 'price'
        }
      ],
      logData: [{}],
      columns: [
        [
          {
            label: '退货编号',
            value: 'returnNum'
          },
          {
            label: '退货状态',
            value: 'returnStatusName'
          },
          {
            label: '订单号',
            value: 'orderNumber'
          },
          {
            label: '订单国家',
            value: 'country'
          },
          {
            label: '支付状态',
            value: 'paymentState'
          },
          {
            label: '支付时间',
            value: 'paymentTime'
          }
        ],
        [
          {
            label: '发货状态',
            value: 'deliveryState'
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
            label: '创建时间',
            value: 'createTime'
          },
          {
            label: '退货原因',
            value: 'returnReasonName'
          },
          {
            label: '总金额',
            value: 'totalAmount'
          }
        ]
      ],
      tableData: [{}],
      returnId: null,
      files: [],
      imgFiles: [],
      textFiles: []
    }
  },
  watch: {
    selectInfo(val) {
      if (Object.keys(val).length) {
        this.form.address = val.senderContacts
        this.form.receiver = val.senderAddress
        this.form.phone = val.senderContactPhone
        this.form.postCode = val.senderPostcode
      }
    }
  },
  methods: {
    handleViews() {
      // this.files.forEach(link => {
      //   downloadFile(link, null, true)
      // })
      let vm = this
      vm.imgFiles = vm.files.filter(item => item.fileIsImage)
      vm.textFiles = vm.files.filter(item => !item.fileIsImage)
      if (vm.imgFiles.length) {
        this.$refs.dialogCom.$dialog({
          title: '查看附件',
          width: '600px',
          visible: true,
          display: false,
          component: () => import('./productsImg'),
          childFn: [
            {
              name: 'edit',
              params: {
                files: vm.imgFiles,
                hiddenBotton: true
              }
            }
          ]
        })
      }
      if (vm.textFiles.length) {
        vm.textFiles.forEach(element => {
          downloadFile(element.file)
        })
      }
    },
    pageJump(href) {
      let a = document.createElement('a')
      a.href = href
      a.target = '_blank'
      a.click()
      a = null
    },
    handleAddAdress() {
      this.dialogOptions.visible = true
    },
    edit(params) {
      let vm = this
      vm.returnId = params.returnId
      return vm.$api[`email/ebayReturnInfo`](params).then(({ rows }) => {
        vm.files = rows.files || []
        vm.$set(vm.tableData, 0, {
          returnNum: rows.returnNum,
          returnStatusName: rows.returnStatusName,
          orderNumber: rows.orderNumber,
          country: rows.country,
          paymentState: rows.paymentState,
          paymentTime: rows.paymentTime
        })
        vm.$set(vm.tableData, 1, {
          deliveryState: rows.deliveryState,
          deliveryTime: rows.deliveryTime,
          transportName: rows.transportName,
          createTime: rows.createTime,
          returnReasonName: rows.returnReasonName,
          totalAmount: rows.totalAmount
        })
        vm.logData = rows.products
        vm.records = rows.handles
      })
    },
    submitForm(cb) {
      let vm = this
      console.log(vm.form)
      let _data = vm.$clone(vm.form)
      _data.returnId = vm.returnId
      vm.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(_data)
        } else {
          console.log('error')
        }
      })
    },
    resetForm() {}
  },
  components: {
    addAdress
  }
}
</script>

<style lang='scss'>
.deal {
  background: #fff;
  .normal-input {
    width: 100px;
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