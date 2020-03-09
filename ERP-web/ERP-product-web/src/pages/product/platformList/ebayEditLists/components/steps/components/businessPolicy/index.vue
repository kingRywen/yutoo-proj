<template>
  <div class="business-policy" v-loading="loading">
    <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
      <el-tab-pane label="付款模板" name="paymentTemplate">
        <payment-template
          ref="paymentTemplate"
          type="1"
          :data="data.five"
          :review="review"
          @setLoading="val => loading = val"
          @setData="$emit('setData', $event)"
          :parentFlag="parentFlag"
          :platformId="platformId"
          :productType="productType"
          :productId="productId"
          :productPltDetailId="productPltDetailId"
        ></payment-template>
      </el-tab-pane>
      <el-tab-pane label="退货政策" name="returnsPolicy">
        <returns-policy
          @setLoading="val => loading = val"
          ref="returnsPolicy"
          type="2"
          :data="data.six"
          :review="review"
          @setData="$emit('setData', $event)"
          :parentFlag="parentFlag"
          :platformId="platformId"
          :productType="productType"
          :productId="productId"
          :productPltDetailId="productPltDetailId"
        ></returns-policy>
      </el-tab-pane>
      <el-tab-pane label="买家条件" name="buyerConditions">
        <buyer-conditions
          @setLoading="val => loading = val"
          ref="buyerConditions"
          type="3"
          :data="data.seven"
          :review="review"
          @setData="$emit('setData', $event)"
          :parentFlag="parentFlag"
          :platformId="platformId"
          :productType="productType"
          :productId="productId"
          :productPltDetailId="productPltDetailId"
        ></buyer-conditions>
      </el-tab-pane>
      <el-tab-pane label="运输方式" name="transportaionMode">
        <transportaion-mode
          @setLoading="val => loading = val"
          ref="transportaionMode"
          type="4"
          @setData="$emit('setData', $event)"
          :data="data.eight"
          :review="review"
          :parentFlag="parentFlag"
          :platformId="platformId"
          :productType="productType"
          :productId="productId"
          :productPltDetailId="productPltDetailId"
        ></transportaion-mode>
      </el-tab-pane>
      <el-tab-pane label="刊登偏好" name="publishedPreference">
        <published-preference
          @setLoading="val => loading = val"
          ref="publishedPreference"
          type="5"
          @setData="$emit('setData', $event)"
          :data="data.nine"
          :review="review"
          :parentFlag="parentFlag"
          :platformId="platformId"
          :productType="productType"
          :productId="productId"
          :productPltDetailId="productPltDetailId"
        ></published-preference>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Vue from 'vue'
import paymentTemplate from './paymentTemplate'
import returnsPolicy from './returnsPolicy'
import buyerConditions from './buyerConditions'
import transportaionMode from './transportaionMode/'
import publishedPreference from './publishedPreference'
export default {
  props: {
    data: {
      default: () => ({})
    },
    // 是否审核状态
    review: {
      default: false
    },
    // 母变体
    parentFlag: Number,
    // 平台id
    productPltDetailId: Number,
    platformId: Number,
    productType: Number,
    productId: Number
  },
  data() {
    return {
      loading: false,
      activeName: 'paymentTemplate'
    }
  },
  methods: {
    handleClick(tab, event) {
      // console.log(tab, event)
    },
    validate() {
      let formsName = [
          'paymentTemplate',
          'returnsPolicy',
          'buyerConditions',
          'transportaionMode',
          'publishedPreference'
        ],
        vm = this
      return Promise.all(
        formsName.reverse().map(el => {
          return vm.$refs[el].validate().catch(() => {
            this.activeName = el
            return Promise.reject()
          })
        })
      )
    }
  },
  components: {
    paymentTemplate,
    returnsPolicy,
    buyerConditions,
    transportaionMode,
    publishedPreference
  }
}
</script>

<style lang='scss'>
.business-policy {
  background: #fff;
}
</style>