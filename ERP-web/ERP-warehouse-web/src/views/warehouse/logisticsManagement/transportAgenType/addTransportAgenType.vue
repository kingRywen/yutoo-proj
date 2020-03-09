<template>
  <div class="add-transport-agen-type">
    <el-form ref="form" :rules="rules" :model="form" label-width="90px">
      <el-form-item label="运输商:" prop="logisticForwarderId">
        <el-select v-model="form.logisticForwarderId" size="small" placeholder="请选择" class="normal-input">
          <!-- <el-option label="区域一" :value="1"></el-option> -->
          <el-option v-for="item in forwarderList" :label="item.label" :value="item.value" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="运输方式:" prop="logisticTransportTypeId">
        <el-select v-model="form.logisticTransportTypeId" size="small" placeholder="请选择" class="normal-input">
          <!-- <el-option label="区域一" :value="1"></el-option>
          <el-option label="区域二" :value="0"></el-option>-->
          <el-option v-for="item in forwarderTypeList" :label="item.label" :value="item.value" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="货币类型:" prop="currency">
        <el-select v-model="form.currency" size="small" placeholder="请选择" class="normal-input">
          <el-option v-for="item in currencyList" :label="item.label" :value="item.value" :key="item.id"></el-option>
          <!-- <el-option label="区域一" :value="1"></el-option>
          <el-option label="区域二" :value="0"></el-option>-->
        </el-select>
      </el-form-item>
      <el-form-item label="每票处理费:" prop="registrationFee">
        <el-input v-model="form.registrationFee" size="small" placeholder="处理费不打折，如有打折，请输入折后价" class="normal-input"></el-input>
      </el-form-item>
      <el-form-item label="每票挂号费:" prop="handlingFee">
        <el-input v-model="form.handlingFee" size="small" placeholder="挂号费不打折，如有打折，请输入折后价)" class="normal-input"></el-input>
      </el-form-item>
      <el-form-item label="运输商折扣:" prop="discount">
        <el-input v-model="form.discount" size="small" placeholder="例:九折=0.9;八五折=0.85" class="normal-input"></el-input>
      </el-form-item>
      <el-form-item label="备注:" prop="remark">
        <el-input v-model="form.remark" size="small" class="normal-input"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    // let discount = (rule, value, callback) => {
    //   let reg = /(^0\.[1-9]{1,2}$)|(^0\.[0-9]{1}[1-9]{1}$)|(^1{1}$)|(^1{1}\.0{2}$)|(^1{1}\.0{1}$)/g
    //   if (!reg.test(value)) {
    //     callback(new Error('请输入正确的折扣'))
    //   } else {
    //     callback()
    //   }
    // }
    let vm = this
    return {
      form: {},
      // rules: {
      //   logisticForwarderId: [{ required: true, message: '请选择运输商' }],
      //   logisticTransportTypeId: [
      //     { required: true, message: '请选择运输方式' }
      //   ],
      //   currency: [{ required: true, message: '请选择货币类型' }],
      //   registrationFee: [{ required: true, message: '每票处理费不能为空' }],
      //   handlingFee: [{ required: true, message: '每票挂号费不能为空' }],
      //   discount: [{ required: true, validator: discount }],
      //   remark: [{ required: true, message: '备注不能为空' }]
      // },
      rules: vm.$formValidate([
        {
          label: '运输商',
          value: 'logisticForwarderId',
          select: true
        },
        {
          label: '运输方式',
          value: 'logisticTransportTypeId',
          select: true
        },
        {
          label: '货币类型',
          value: 'currency',
          select: true
        },
        {
          label: '每票处理费',
          value: 'registrationFee',
          type: 'number'
        },
        {
          label: '每票挂号费',
          value: 'handlingFee',
          type: 'number'
        },
        {
          label: '运输商折扣',
          value: 'discount',
          type: 'discount'
        },
        {
          label: '备注',
          value: 'remark'
        }
      ])
    }
  },
  created() {
    this.getForwarderList()
    this.getForwarderTypeList()
    this.getCurrencyList()
  },
  computed: {
    ...mapState('logistics', [
      'forwarderList',
      'forwarderTypeList',
      'currencyList'
    ])
  },
  methods: {
    ...mapActions('logistics', [
      'getForwarderList',
      'getForwarderTypeList',
      'getCurrencyList'
    ]),
    edit(params) {
      let vm = this
      vm.$api['warehouse/forwarderTransportTypeGet'](params)
        .then(({ rows }) => {
          vm.form = rows
          vm.$emit('loading')
        })
        .catch(() => {
          vm.$emit('loading')
        })
    },
    resetForm() {},
    submitForm(cb) {
      let _data = JSON.parse(JSON.stringify(this.form))
      this.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(_data)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.add-transport-agen-type {
  background: #fff;
  .normal-input {
    width: 300px;
  }
}
</style>
