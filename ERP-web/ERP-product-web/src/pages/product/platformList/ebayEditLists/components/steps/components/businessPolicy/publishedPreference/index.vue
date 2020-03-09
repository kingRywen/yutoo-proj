<template>
  <div class="published-preference">
    <el-form :disabled="review" ref="form" :model="data" :rules="rules" size="small" label-width="110px">
      <ElFormItem label="选择模板:">
        <ElSelect v-model="data.templateId" placeholder class="normal-input" @change="tempChange">
          <!-- <ElOption v-for="" :key=""></ElOption> -->
          <ElOption v-for="item in tempList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem>
      <ElFormItem prop="value" label="发布状态为私人">
        <el-checkbox :true-label="1" :false-label="0" v-model="data.statusPrivateFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem prop="value" label="标题加粗">
        <el-checkbox :true-label="1" :false-label="0" v-model="data.titleThickeningFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem prop="value" label="橱窗展位升级">
        <el-checkbox :true-label="1" :false-label="0" v-model="data.boothUpgradeFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem prop="value" label="首页推荐">
        <el-checkbox :true-label="1" :false-label="0" v-model="data.homeRecommendationFlag"></el-checkbox>
      </ElFormItem>
      <ElFormItem prop="value" label="计数器风格">
        <ElSelect v-model="data.counterStyle" placeholder class="normal-input">
          <!-- <ElOption v-for="" :key=""></ElOption> -->
          <ElOption v-for="item in counterStyles" :key="item.value" :label="item.label" :value="item.value"></ElOption>
          <!-- <ElOption label="HonestyStyle" :value="2"></ElOption>
          <ElOption label="GreenLED" :value="3"></ElOption>
          <ElOption label="Hidden" :value="4"></ElOption>
          <ElOption label="BasicStyle" :value="5"></ElOption>
          <ElOption label="RetroStyle" :value="6"></ElOption>
          <ElOption label="HiddenStyle" :value="7"></ElOption>
          <ElOption label="CustomCode" :value="8"></ElOption> -->
        </ElSelect>
      </ElFormItem>
    </el-form>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode, showToast } from 'common/common'
import mixins from '../../../mixins';
import tempMixin from '../mixin';
export default {
  mixins: [mixins, tempMixin],
  data() {
    return {
      form: {},
      rules: {
        
      },
      counterStyles: [],
      tempList: [],
      groupCode: 5,
      tempName: 'ebayPublishPreferenceId',
      tempApi: 'ebayPublishPreferenceInfo'
    }
  },
  created() {
    this.initData()
  },
  methods: {
    // 一次性获取下拉
    getAllList() {
      let selects = [
        // {
        //   propertyName: 'saleType',
        //   listName: 'saleTypes'
        // },
        {
          propertyName: 'counterStyle',
          listName: 'counterStyles'
        }
      ]
      Promise.all(selects.map(el => this.getSelectList(el))).catch(() => {
        showToast('error', '初始化数据失败， 请刷新重试')
      })
    },
    // 获取单个下拉取值
    getSelectList({ propertyName, listName }) {
      return fetchData({
        ...apis.saleEbayProItemSaleEbayProItem,
        data: { propertyName }
      }).then(res => {
        this[listName] = res.data.data.map(el => ({
          label: el.name,
          value: el.id
        }))
      })
    },
    validate() {
      return this.$refs.form.validate().then(() => {
        this.saveData({dataMap:this.data})
      })
    },
    initData() {
      this.getAllList()
      Promise.all([
        this.getData('ebayPublishPreferenceGetCombobox')
      ])
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
.published-preference {
  background: #fff;
  .normal-input {
    width: 350px;
  }
}
</style>