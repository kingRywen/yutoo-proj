<template>
  <div class="batch-remove-product">
    <ElRow>
      <ElCol :span="12">
        <product-select v-model="aaa" title="选着目标移入父产品" url="finance/financeCostTypePage"></product-select>
      </ElCol>
      <ElCol :span="0.5">
        <div style="opacity: 0">232</div>
      </ElCol>
      <ElCol :span="11">
        <product-select
          :showEdit="false"
          url="finance/financePaymentAccountList"
          :columns="columns"
          v-model="bbb"
        ></product-select>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
import productSelect from "./productSelect";
export default {
  components: { productSelect },
  data() {
    return {
      yetSelect: [],
      columns: [
        {
          label: "支付方式",
          value: "paymentModeName"
        },
        {
          label: "状态",
          value: "activatedFlagName"
        },
        {
          label: "添加人",
          value: "creatorName"
        },
        {
          label: "添加时间",
          value: "createTime"
        },
        {
          label: "备注",
          value: "remark"
        }
      ],
      aaa: [],
      bbb: []
    };
  },
  watch: {
    forms(val) {
      console.log(val);
    }
  },
  computed: {
    forms() {
      return [this.aaa, this.bbb];
    }
  },

  methods: {
    submit() {
      return false;
    }
  }
};
</script>

<style lang='scss'>
.batch-remove-product {
  background: #fff;
  .top-title-sign {
    background: rgba(242, 242, 242, 1);
    height: 40px;
    line-height: 40px;
    padding-left: 10px;
  }
}
</style>