<template>
  <div class="add-product">
    <MainLayout
      class="mt10"
      url="finance/financePaymentAccountList"
      :columns="columns"
      :searchFields="searchFields"
      reserveSelection="costSign"
      :editBtns="editBtns"
    ></MainLayout>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchFields: [
        {
          type: "select",
          multi: true,
          placeholder: "请选择类目",
          name: "aaa",
          options: [
            {
              label: "1",
              value: "1"
            }
          ]
        },
        {
          type: "input",
          placeholder: "输入仓库SKU/系统SKU/名称",
          name: "bbb"
        }
      ],
      editBtns: [],
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
      ]
    };
  },
  methods: {
    submit() {
      return Promise.reject();
    }
  }
};
</script>

<style lang='scss'>
.add-product {
  width: 99%;
  background: #fff;
}
</style>