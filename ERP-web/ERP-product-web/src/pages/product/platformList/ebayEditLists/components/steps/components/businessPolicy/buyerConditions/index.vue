<template>
  <div class="buyer-conditions">
    <el-form :disabled="review" ref="form" :model="data" :rules="rules" size="small" label-width="100px">
      <ElFormItem label="选择模板:">
        <ElSelect v-model="data.templateId" placeholder class="normal-input" @change="tempChange">
          <!-- <ElOption v-for="" :key=""></ElOption> -->
          <ElOption v-for="item in tempList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="购买条件:" prop="buyConditions">
        <el-radio v-model="data.buyConditions" :label="1">允许所有买家购买</el-radio>
        <el-radio v-model="data.buyConditions" :label="2">不予许以下卖家购买我的产品</el-radio>
      </ElFormItem>
      <template v-if="data.buyConditions == 2">
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="data.noPaypalAccountFlag">没有PayPal账户</el-checkbox>
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="data.addressOffscaleFlag">主要运送地址再我的运送范围之外</el-checkbox>
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="data.discardedCaseFlag">在过去</el-checkbox>
          <el-input-number
            v-model="data.discardedCaseDays"
            :min="1"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>天，曾收到
          <el-input-number
            v-model="data.discardedCaseCount"
            :min="1"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>个以上弃标个案
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="data.violationPolicyFlag">在过去</el-checkbox>
          <el-input-number
            v-model="data.violationPolicyDays"
            :min="1"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>天，曾收到
          <el-input-number
            v-model="data.violationPolicyCount"
            :min="1"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>个以上违反政策检举
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="data.creditIndexFlag">信用指标等于或低于</el-checkbox>
          <span style="padding: 0 4px;"></span>
          <el-input-number
            v-model="data.creditIndexCount"
            :min="1"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="data.buyingMoreThanFlag">在过去10天内曾出价或购买我的物品，已达到我所设定的限制</el-checkbox>
          <span style="padding: 0 4px;"></span>
          <el-input-number
            v-model="data.buyingMoreThanCount"
            :min="1"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>
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
      //   buyConditions: 1,
      //   defaultFlag: 0
      // },
      rules: {
        templateId: [{ required: true, message: '请选择模板' }],
        buyConditions: [{ required: true, message: '请选择购买条件' }],
        discardedCaseDays: [{ required: true, message: '请输入' }],
        discardedCaseCount: [{ required: true, message: '请输入' }],
        violationPolicyDays: [{ required: true, message: '请输入' }],
        violationPolicyCount: [{ required: true, message: '请输入' }],
        creditIndexCount: [{ required: true, message: '请输入' }],
        buyingMoreThanCount: [{ required: true, message: '请输入' }]
      },
      tempList: [],
      groupCode: 3,
      tempName: 'ebayBuyersConditionsId',
      tempApi: 'ebayBuyersConditionsInfo'
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
      Promise.all([this.getData('ebayBuyersConditionsGetCombobox')])
        .then(res => {
          this.tempList = res[0]
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
.buyer-conditions {
  background: #fff;
  .normal-input {
    width: 450px;
  }
}
</style>