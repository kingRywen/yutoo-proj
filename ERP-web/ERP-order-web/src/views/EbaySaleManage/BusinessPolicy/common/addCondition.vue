<template>
  <div class="add-condition">
    <el-form ref="form" :model="form" :rules="rules" :disabled="disabled" size="small" label-width="100px">
      <ElFormItem label="模板名称:" prop="templateName">
        <ElInput v-model="form.templateName" class="normal-input"></ElInput>
      </ElFormItem>
      <ElFormItem label="站点:" prop="siteId">
        <ElSelect v-model="form.siteId" placeholder class="normal-input">
          <ElOption v-for="(item,index) in siteList" :label="item.label" :value="item.value" :key="index"></ElOption>
          <!-- <ElOption v-for="" :key=""></ElOption> -->
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="来源店铺:" prop="storeId">
        <el-cascader :options="ebayStoreList" v-model="form.storeId" class="normal-input"></el-cascader>
      </ElFormItem>
      <ElFormItem label="购买条件:" prop="buyConditions">
        <el-radio v-model="form.buyConditions" :label="1">允许所有买家购买</el-radio>
        <el-radio v-model="form.buyConditions" :label="2">不予许以下卖家购买我的产品</el-radio>
      </ElFormItem>
      <template v-if="form.buyConditions == 2">
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="form.noPaypalAccountFlag">没有PayPal账户</el-checkbox>
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="form.addressOffscaleFlag">主要运送地址再我的运送范围之外</el-checkbox>
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="form.discardedCaseFlag">在过去</el-checkbox>
          <el-input-number
            v-model="form.discardedCaseDays"
            :min="0"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>天，曾收到
          <el-input-number
            v-model="form.discardedCaseCount"
            :min="0"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>个以上弃标个案
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="form.violationPolicyFlag">在过去</el-checkbox>
          <el-input-number
            v-model="form.violationPolicyDays"
            :min="0"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>天，曾收到
          <el-input-number
            v-model="form.violationPolicyCount"
            :min="0"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>个以上违反政策检举
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="form.creditIndexFlag">信用指标等于或低于</el-checkbox>
          <span style="padding: 0 4px;"></span>
          <el-input-number
            v-model="form.creditIndexCount"
            :min="0"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>
        </ElFormItem>
        <ElFormItem prop="value">
          <el-checkbox :true-label="1" :false-label="0" v-model="form.buyingMoreThanFlag">在过去10天内曾出价或购买我的物品，已达到我所设定的限制</el-checkbox>
          <span style="padding: 0 4px;"></span>
          <el-input-number
            v-model="form.buyingMoreThanCount"
            :min="0"
            :max="10000"
            style="width: 100px;"
            :controls="false"
          ></el-input-number>
        </ElFormItem>
      </template>
      <ElFormItem label="是否默认模板:" prop="value">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.defaultFlag"></el-checkbox>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
import { edit } from './mixin.js'
import { mapState } from 'vuex'
export default {
  mixins: [edit],
  data() {
    return {
      form: {
        buyConditions: 1,
        defaultFlag: 0
      },
      rules: {}
    }
  },

  computed: {
    ...mapState('common', ['siteList'])
  },
  methods: {}
}
</script>

<style lang='scss'>
.add-condition {
  background: #fff;
  .normal-input {
    width: 450px !important;
  }
}
</style>