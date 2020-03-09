<template>
  <div class="deal">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <ElFormItem prop="handleState">
        <el-radio-group v-model="form.handleState">
          <el-radio :label="1">买家还没付款</el-radio>
          <el-radio :label="2">双方取消交易</el-radio>
        </el-radio-group>
      </ElFormItem>
      <ElFormItem label="原因:" prop="reason">
        <ElSelect v-model="form.reason" clearable placeholder="请选择" style="width: 300px">
          <ElOption v-for="(item, index) in list" :key="index" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      form: {},
      rules: vm.$formValidate([
        {
          value: 'handleState'
        },
        {
          label: '原因',
          value: 'reason',
          must: true
        }
      ]),
      unpaidDisputeIds: [],
      list: [
        // {
        //   label: '买家没有回复',
        //   value: 1
        // },
        // {
        //   label: '买家不想要此商品',
        //   value: 2
        // },
        // {
        //   label: '买家未付清',
        //   value: 3
        // },
        // {
        //   label: '买家未付款',
        //   value: 4
        // },
        // {
        //   label: '买家付款未收到',
        //   value: 5
        // },
        // {
        //   label: '买家购买错误',
        //   value: 6
        // },
        // {
        //   label: '买家拒绝付款',
        //   value: 7
        // },
        // {
        //   label: '买家退货',
        //   value: 8
        // },
        // {
        //   label: '其他解释',
        //   value: 9
        // },
        // {
        //   label: '卖家不发货至此国家',
        //   value: 10
        // },
        // {
        //   label: '卖家缺货',
        //   value: 11
        // },
        // {
        //   label: '送货地址未确认',
        //   value: 12
        // }
      ]
    }
  },
  created() {
    let vm = this
    vm.$api[`email/ebayUnpaidDisputeReasonsList`]({}).then(({ rows }) => {
      vm.list = rows.map(item => {
        return {
          label: item.name,
          value: item.id
        }
      })
    })
  },
  methods: {
    getUnpaidDisputeIds(params) {
      let { unpaidDisputeIds = [] } = params
      this.unpaidDisputeIds = unpaidDisputeIds
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      vm.unpaidDisputeIds.length &&
        (_data.unpaidDisputeIds = vm.unpaidDisputeIds)
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
    width: 300px;
  }
}
</style>