<template>
  <div class="add-publish">
    <el-form ref="form" :model="form" :disabled="disabled" :rules="rules" size="small" label-width="110px">
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
        <!-- <ElOption v-for="" :key=""></ElOption> -->
      </ElFormItem>
      <ElFormItem prop="statusPrivateFlag" label="发布状态为私人">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.statusPrivateFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem prop="titleThickeningFlag" label="标题加粗">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.titleThickeningFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem prop="boothUpgradeFlag" label="橱窗展位升级">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.boothUpgradeFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem prop="homeRecommendationFlag" label="首页推荐">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.homeRecommendationFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem prop="counterStyle" label="计数器风格">
        <ElSelect v-model="form.counterStyle" placeholder class="normal-input">
          <ElOption label="NoHitCounter" :value="1"></ElOption>
          <ElOption label="HonestyStyle" :value="2"></ElOption>
          <ElOption label="GreenLED" :value="3"></ElOption>
          <ElOption label="Hidden" :value="4"></ElOption>
          <ElOption label="BasicStyle" :value="5"></ElOption>
          <ElOption label="RetroStyle" :value="6"></ElOption>
          <ElOption label="HiddenStyle" :value="7"></ElOption>
          <ElOption label="CustomCode" :value="8"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem label="是否默认模板:" prop="defaultFlag">
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
    let vm = this
    return {
      form: {
        defaultFlag: 0,
        statusPrivateFlag: 0,
        titleThickeningFlag: 0,
        boothUpgradeFlag: 0,
        homeRecommendationFlag: 0
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
          label: '计数器风格',
          value: 'counterStyle'
        }
      ])
    }
  },
  computed: {
    ...mapState('common', ['siteList'])
  },
  methods: {}
}
</script>

<style lang='scss'>
.add-publish {
  background: #fff;
  .normal-input {
    width: 350px !important;
  }
}
</style>