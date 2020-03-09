<template>
  <div class="product-select">
    <div class="top-title-sign">{{title}}</div>
    <MainLayout
      class="mt10"
      @requestSuccess="requestSuccess"
      :url="url"
      :columns="columns"
      :searchFields="searchFields"
      reserveSelection="costSign"
      :editBtns="editBtns"
      :isShowPag="false"
      v-on="$listeners"
      v-bind="$attrs"
    ></MainLayout>
  </div>
</template>

<script>
export default {
  props: {
    value: {
      type: Array,
      default: () => []
    },
    url: {
      type: String,
      default: ""
    },
    title: {
      type: String,
      default: "已选择列表"
    },
    showEdit: {
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default: () => [
        {
          label: "是否纳入利润统计",
          value: "calculateFlagStr",
          width: 120
        },
        {
          label: "应用平台",
          value: "platformStr",
          width: 120
        },
        {
          label: "添加人",
          value: "creatorName"
        },
        {
          label: "是否需要导入成本",
          value: "importFlagStr",
          width: 120
        }
      ]
    }
  },
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
      tableData: []
    };
  },
  created() {
    if (this.showEdit) {
      this.$set(this, "editBtns", [
        {
          name: "选择更多",
          fn: () => {
            this._dialog({
              title: "选择产品",
              width: "80%",
              component: () => import("./addProduct")
            });
          }
        },
        {
          name: "删除",
          fn: () => {}
        }
      ]);
    }
  },
  watch: {},
  methods: {
    requestSuccess(flag, data) {
      this.tableData = data;
    }
  }
};
</script>

<style lang='scss'>
.product-select {
  background: #fff;
}
</style>