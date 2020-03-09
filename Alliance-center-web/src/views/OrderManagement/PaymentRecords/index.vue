<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :outerParams="outerParams"
      :edits="edits"
      ref="lay"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <el-form ref="form" :model="data" size="small" label-width="80px">
        <ElRow :gutter="12">
          <ElCol :span="12">
            <ElFormItem label="记录ID">
              <ElInput disabled v-model="data.orderPayId" placeholder></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="付款方式">
              <ElRadioGroup disabled v-model="data.payType">
                <ElRadio :label="0">支付宝</ElRadio>
                <ElRadio :label="1">微信</ElRadio>
              </ElRadioGroup>
            </ElFormItem>
          </ElCol>
        </ElRow>
        <ElRow :gutter="12">
          <ElCol :span="12">
            <ElFormItem label="订单编号">
              <ElInput disabled v-model="data.orderId" placeholder></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="支付姓名">
              <ElInput disabled v-model="data.payName" placeholder></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="支付账号">
              <ElInput disabled v-model="data.payAccount" placeholder></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="应付金额">
              <ElInput disabled v-model="data.needPay" placeholder></ElInput>
            </ElFormItem>
          </ElCol>
          <ElCol :span="12">
            <ElFormItem label="实付金额" prop="realPay" :rules="[{ required: true, message: '请输入实付金额' }]">
              <div class="flex">
                <ElInput v-model="data.realPay" placeholder class="mr10"></ElInput>
                <ElButton type="text" @click="data.realPay = data.needPay">准确无误</ElButton>
              </div>
            </ElFormItem>
          </ElCol>
          <ElCol :span="24">
            <ElFormItem label="审核意见">
              <ElInput v-model="data.auditIdea" type="textarea" :rows="5" placeholder></ElInput>
            </ElFormItem>
          </ElCol>
        </ElRow>
      </el-form>
      <template slot="btns">
        <ElButton type="danger" size="small" @click="handleRefuse" :loading="loading">拒绝</ElButton>
      </template>
    </yt-dialog>
  </div>
</template>

<script>
import ReviewOrder from './components/ReviewOrder'
import mixin from '@/mixin'
export default {
  components: {
    ReviewOrder
  },
  props: ['orderId'],
  mixins: [mixin],
  data() {
    let vm = this
    return {
      outerParams: {
        orderId: this.orderId
      },
      loading: false,
      data: {},
      dialogOptions: {
        visible: false,
        title: '付费审核',
        width: '800px',
        okBtnText: '通过',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick(optionType = 1) {
          // 拒绝时不调用 查询接口
          return vm.$refs.form.validate().then(() => {
            let api = `main/merchantOrderPayAudit`
            let { orderPayId, realPay, auditIdea } = vm.data
            return vm.$api[api]({
              orderPayId,
              realPay,
              optionType,
              auditIdea
            }).then(data => {
              if (!optionType) {
                vm.$message.success(data.msg)
                vm.dialogOptions.visible = false
                vm.$refs.lay.handleSearch()
                return
              }
              vm.$confirm(data.msg, '审核成功!', {
                confirmButtonText: '确认',
                type: 'success'
              })
                .then(() => {
                  vm.dialogOptions.visible = false
                  vm.$refs.lay.handleSearch()
                })
                .catch(() => {
                  vm.dialogOptions.visible = false
                  vm.$refs.lay.handleSearch()
                })
            })
          })
        },
        handleOpen() {
          // if (vm.dialogOptions.title === '新增IP价格') return

          vm.$api[`main/merchantOrderPayInfo`]({ orderPayId: vm.editId })
            .then(data => {
              vm.data = data.rows
              vm.$nextTick(() => {
                vm.$refs.form.clearValidate()
              })
            })
            .catch(err => {})
        }
      },
      btns: [],
      edits: [
        {
          name: '审核',
          show: scope => {
            return scope.row.status !== 2 && scope.row.status !== 3
          },
          fn: scope => {
            this.openAdd('付费审核', scope.row.orderPayId)
          }
        }
      ],
      searchFields: [
        {
          name: 'merchantEmail',
          label: '商户邮箱'
        },
        {
          name: 'type',
          label: '记录类型',
          type: 'select',
          options: [
            { label: '激活账号', value: '0' },
            { label: '重新激活账号', value: '1' },
            { label: '会员费', value: '2' }
          ]
        },

        {
          name: 'orderId',
          label: '订单编号'
        },
        {
          name: 'status',
          label: '审核状态',
          type: 'select',
          options: [
            // { label: '待支付', value: '0' },
            { label: '待审核', value: '1' },
            { label: '已通过', value: '2' },
            { label: '已拒绝', value: '3' }
          ]
        }
      ],
      tableCols: [
        {
          label: '记录ID',
          prop: 'orderPayId',
          width: 60
        },
        {
          label: '商户邮箱',
          prop: 'merchantEmail',
          minWidth: 120
        },
        {
          label: '记录类型',
          prop: 'type',
          width: 100,
          render(h, scope) {
            return (
              <span>
                {scope.row.type == 1
                  ? '重新激活账号'
                  : scope.row.type == 0
                  ? '激活账号'
                  : '会员费'}
              </span>
            )
          }
        },
        {
          label: '订单编号',
          prop: 'orderId'
        },
        {
          label: '总账号数',
          prop: 'accountCount',
          width: 70
        },
        {
          label: '支付账号数',
          prop: 'accountUseCount',
          width: 85
        },
        {
          label: '有效时长（月）',
          prop: 'effectiveTime'
        },
        {
          label: '实付金额',
          prop: 'realPay',
          render(h, scope) {
            return (
              <span class="danger" style="font-weight:bolder">
                {scope.row.realPay != null ? scope.row.realPay.toFixed(2) : '-'}
              </span>
            )
          }
        },

        {
          label: '应付金额',
          prop: 'needPay',
          render(h, scope) {
            return (
              <span style="font-weight:bolder">
                {scope.row.needPay != null ? scope.row.needPay.toFixed(2) : '-'}
              </span>
            )
          }
        },

        {
          label: '支付姓名',
          prop: 'payName'
        },
        {
          label: '支付账号',
          prop: 'payAccount'
        },
        {
          label: '留言',
          prop: 'remark'
        },
        {
          label: '支付时间',
          prop: 'payTime'
        },
        {
          label: '审核状态',
          prop: 'status',
          width: 80,
          render(h, scope) {
            let { status } = scope.row
            if (status === 0) {
              return <span>-</span>
            }
            if (status === 1) {
              return <span>待审核</span>
            }
            if (status === 2) {
              return <span class="success">已通过</span>
            }
            if (status === 3) {
              return <span class="warning">已拒绝</span>
            }
          }
        },
        {
          label: '审核意见',
          prop: 'auditIdea'
        }
      ]
    }
  },
  methods: {
    async handleRefuse() {
      if (this.data.auditIdea == null || this.data.auditIdea === '') {
        this.$message.warning('请填写审核意见')
        return
      }
      this.loading = true
      try {
        await this.dialogEvents.handleOkClick(0)
        this.loading = false
      } catch (error) {
        this.loading = false
      }
    },
    loadData(data) {
      return this.$api[`main/merchantOrderPayList`](data)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    }
  }
}
</script>

<style scoped lang="scss">
.back-wrapper {
  // text-align: right;
}
</style>
