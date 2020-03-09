<template>
  <div class="add-return">
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
      <ElFormItem label="模板标签:" prop="templateLabelId">
        <ElSelect v-model="form.templateLabelId" placeholder @visible-change="visibleChange" style="width:260px">
          <ElOption v-for="(item,index) in ebayLabelGetCombobox" :label="item.label" :value="item.value" :key="index"></ElOption>
          <!-- <ElOption v-for="" :key=""></ElOption> -->
        </ElSelect>
        <span style="padding: 0 4px;"></span>
        <ElButton type="primary" @click="handleClick">标签管理</ElButton>
      </ElFormItem>
      <ElFormItem label="国内退货政策:" prop="value">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.domesticRefundFlag">接受申请退款</el-checkbox>
      </ElFormItem>
      <template v-if="form.domesticRefundFlag">
        <div style="margin-left: 100px">
          退货天数
          <ElFormItem prop="domesticReturnDays" label-width="0" style="display: inline-block">
            <ElSelect v-model="form.domesticReturnDays" placeholder style="width:120px">
              <ElOption :value="1" label="15天"></ElOption>
              <ElOption :value="2" label="30天"></ElOption>
              <ElOption :value="3" label="60天"></ElOption>
            </ElSelect>
          </ElFormItem>
          <span style="padding: 0 4px;"></span>
          运费承担
          <ElFormItem prop="domesticFreightCharges" label-width="0" style="display: inline-block">
            <ElSelect v-model="form.domesticFreightCharges" placeholder style="width:120px">
              <ElOption :value="1" label="卖家"></ElOption>
              <ElOption :value="2" label="客户"></ElOption>
            </ElSelect>
          </ElFormItem>
          <div></div>
          <el-checkbox
            :true-label="1"
            :false-label="0"
            v-model="form.domesticReplacementOrExchange"
          >replacement or exchange</el-checkbox>
        </div>
      </template>
      <ElFormItem label="国际退货政策:" prop="abroadRefundFlag">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.abroadRefundFlag">接受申请退款</el-checkbox>
      </ElFormItem>
      <template v-if="form.abroadRefundFlag">
        <div style="margin-left: 100px">
          退货天数
          <ElFormItem prop="abroadReturnDays" label-width="0" style="display: inline-block">
            <ElSelect v-model="form.abroadReturnDays" style="width:120px">
              <ElOption :value="1" label="15天"></ElOption>
              <ElOption :value="2" label="30天"></ElOption>
              <ElOption :value="3" label="60天"></ElOption>
            </ElSelect>
          </ElFormItem>
          <span style="padding: 0 4px;"></span>
          运费承担
          <ElFormItem prop="abroadFreightCharges" label-width="0" style="display: inline-block">
            <ElSelect v-model="form.abroadFreightCharges" style="width:120px">
              <ElOption :value="1" label="卖家"></ElOption>
              <ElOption :value="2" label="客户"></ElOption>
            </ElSelect>
          </ElFormItem>
          <div></div>
          <el-checkbox
            :true-label="1"
            :false-label="0"
            v-model="form.abroadReplacementOrExchange"
          >replacement or exchange</el-checkbox>
        </div>
      </template>
      <ElFormItem label="是否默认模板:" prop="defaultFlag">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.defaultFlag"></el-checkbox>
      </ElFormItem>
    </el-form>
    <dialog-component ref="dialog"></dialog-component>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { edit } from './mixin.js'
export default {
  mixins: [edit],
  data() {
    let vm = this
    return {
      form: {
        domesticRefundFlag: 0,
        abroadRefundFlag: 0,
        defaultFlag: 0,
        abroadReplacementOrExchange: 0,
        domesticReplacementOrExchange: 0,
        domesticReturnDays: null,
        domesticFreightCharges: null,
        abroadReturnDays: null,
        abroadFreightCharges: null
      },
      rules: vm.$formValidate([
        {
          label: '模板名称',
          value: 'templateName'
        },
        {
          label: '站点',
          value: 'siteId'
        },
        {
          label: '来源店铺',
          value: 'storeId'
        },
        {
          label: '模板标签',
          value: 'templateLabelId'
        },
        {
          label: '退货天数',
          value: 'domesticReturnDays'
        },
        {
          label: '运费承担',
          value: 'domesticFreightCharges'
        },
        {
          label: '退货天数',
          value: 'abroadReturnDays'
        },
        {
          label: '运费承担',
          value: 'abroadFreightCharges'
        }
      ])
    }
  },
  created() {
    this.getEbayPaypalAccountGetCombobox()
    this.getEbayLabelGetCombobox()
  },
  computed: {
    ...mapState('common', [
      'siteList',
      'ebayPaypalAccountGetCombobox',
      'ebayLabelGetCombobox'
    ])
  },
  methods: {
    ...mapActions('common', [
      'getSiteList',
      'getEbayPaypalAccountGetCombobox',
      'getEbayLabelGetCombobox'
    ]),
    handleClick() {
      let vm = this
      vm.$refs.dialog.$dialog({
        title: '标签管理',
        width: '700px',
        visible: true,
        component: () => import('./tagManager/index.vue'),
        childFn: [
          {
            name: 'getList',
            params: {}
          }
        ],
        submitForm() {
          vm.getEbayLabelGetCombobox()
          return Promise.resolve()
        }
      })
    },
    visibleChange() {}
  }
}
</script>

<style lang='scss'>
.add-return {
  background: #fff;
  .normal-input {
    width: 350px !important;
  }
}
</style>