<template>
  <div class="returns-policy">
    <el-form :disabled="review" ref="form" :model="data" :rules="rules" size="small" label-width="100px">
      <ElFormItem label="选择模板:">
        <ElSelect v-model="data.templateId" placeholder class="normal-input" @change="tempChange">
          <!-- <ElOption v-for="" :key=""></ElOption> -->
          <ElOption v-for="item in tempList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="国内退货政策:" prop="value">
        <el-checkbox :true-label="1" :false-label="0" v-model="data.domesticRefundFlag">接受申请退款</el-checkbox>
      </ElFormItem>
      <template v-if="data.domesticRefundFlag">
        <ElFormItem>
          <ElFormItem label="退货天数:" prop="domesticReturnDays">
            <ElSelect v-model="data.domesticReturnDays" placeholder>
              <ElOption :value="1" label="15天"></ElOption>
              <ElOption :value="2" label="30天"></ElOption>
              <ElOption :value="3" label="60天"></ElOption>
            </ElSelect>
          </ElFormItem>

          <ElFormItem label="运费承担:" prop="domesticFreightCharges">
            <ElSelect v-model="data.domesticFreightCharges" placeholder>
              <ElOption :value="1" label="卖家"></ElOption>
              <ElOption :value="2" label="客户"></ElOption>
            </ElSelect>
          </ElFormItem>
          <div></div>
          <el-checkbox
            :true-label="1"
            :false-label="0"
            v-model="data.domesticReplacementOrExchange"
          >replacement or exchange</el-checkbox>
        </ElFormItem>
      </template>
      <ElFormItem label="国际退货政策:" prop="value">
        <el-checkbox :true-label="1" :false-label="0" v-model="data.abroadRefundFlag">接受申请退款</el-checkbox>
      </ElFormItem>
      <template v-if="data.abroadRefundFlag">
        <ElFormItem>
          <ElFormItem label="退货天数:" prop="abroadReturnDays">
            <ElSelect v-model="data.abroadReturnDays">
              <ElOption :value="1" label="15天"></ElOption>
              <ElOption :value="2" label="30天"></ElOption>
              <ElOption :value="3" label="60天"></ElOption>
            </ElSelect>
          </ElFormItem>
          <ElFormItem label="运费承担:" prop="abroadFreightCharges">
            <ElSelect v-model="data.abroadFreightCharges">
              <ElOption :value="1" label="卖家"></ElOption>
              <ElOption :value="2" label="客户"></ElOption>
            </ElSelect>
          </ElFormItem>
          <div></div>
          <el-checkbox
            :true-label="1"
            :false-label="0"
            v-model="data.abroadReplacementOrExchange"
          >replacement or exchange</el-checkbox>
        </ElFormItem>
      </template>
    </el-form>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode, showToast } from 'common/common'
import mixins from '../../../mixins'
import tempMixin from '../mixin';

export default {
  mixins: [mixins, tempMixin],
  data() {
    return {
      // form: {
      //   domesticRefundFlag: 0,
      //   abroadRefundFlag: 0
      // },
      rules: {
        templateId: [{ required: true, message: '请选择模板' }],
        domesticReturnDays: [{ required: true, message: '请选择退货天数' }],
        domesticFreightCharges: [{ required: true, message: '请选择运费承担' }],
        abroadReturnDays: [{ required: true, message: '请选择退货天数' }],
        abroadFreightCharges: [{ required: true, message: '请选择运费承担' }]
      },
      tempList: [],
      groupCode: 6,
      tempName: 'ebayReturnPolicyId',
      tempApi: 'ebayReturnPolicyInfo'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    validate() {
      return this.$refs.form.validate().then(() => {
        this.saveData({ dataMap: this.data })
      })
    },
    initData() {
      Promise.all([this.getData('ebayReturnPolicyGetCombobox')])
        .then(res => {
          this.tempList = res[0]
          // this.paymentTypeList = res[1]
          // this.paypalList = res[1]
        })
        .catch(() => {
          showToast('error','初始化数据失败，请刷新重试')
        })
    },
    getData(name, params = {}) {
      return fetchData({
        ...apis[name],
        data: params
      }).then(res =>
        res.data.rows.map(el => ({ label: el.name, value: el.id }))
      )
    }
  }
}
</script>

<style lang='scss'>
.returns-policy {
  background: #fff;
  .normal-input {
    width: 350px;
  }
}
</style>