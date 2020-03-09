<template>
  <div class="add-product">
    <ElForm :model="form" v-model="form" size="small" ref="form">
      <t-form-item
        v-if="isShowSku == false ? false : true"
        :list="list"
        type="multiple"
        :value.sync="form.productRepoIds"
        prop="productRepoIds"
        label="选择SKU:"
      ></t-form-item>
    </ElForm>
    <ElRow>
      <ElCol :span="24">
        <!-- product/prProductRepoPartsGet  productRepoId-->
        <customTable
          :url="getUrl || 'product/prProductRepoPartsGet'"
          :isShowPag="true"
          :columns="columns"
          v-model="selectData"
          :searchConfig="searchConfig"
          :moreParams="{type:type}"
          :rowKey="id || 'productRepoId'"
        ></customTable>
      </ElCol>
      <ElCol :span="24" style="margin-top: 20px">
        <div class="ready-wrap">已选择列表</div>
        <customTable
          :rowKey="id || 'productRepoId'"
          :columns="yetColumns"
          :tableData="tableData"
          ref="table"
          :hasSearch="false"
        ></customTable>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    },
    type: {
      type: Number,
      default: 1
    },
    accessoryId: {
      type: Number,
      default: null
    },
    productRepoId: {
      type: Number,
      default: null
    },
    columns: {
      type: Array,
      default: () => []
    },
    yetColumns: {
      type: Array,
      default: () => []
    },
    select: {
      type: Array,
      default: () => []
    },
    getUrl: {
      type: String,
      default: ""
    },
    saveUrl: {
      type: String,
      default: ""
    },
    id: {
      type: String,
      default: ""
    },
    isShowSku: {
      type: Boolean,
      default: true
    },
    getList: {
      type: Function
    }
  },
  data() {
    return {
      form: {
        productRepoIds: []
      },
      list: [],
      tableData: [],
      searchConfig: [
        {
          label: "筛选条件",
          type: "input",
          value: "search",
          fn() {}
        }
      ],
      selectData: []
    };
  },
  created() {
    this.selectData = this.select;

    let vm = this;
    if (this.isShowSku == false) {
      return;
    }
    console.log(vm.productRepoId);
    vm.$api[`product/prProductRepoVariantGetComboBox`]({
      productRepoId: vm.productRepoId
    }).then(({ rows }) => {
      let options = rows.map(item => {
        return {
          label: item.repoSku,
          value: item.productRepoId
        };
      });
      this.$set(vm, "list", options);
    });
  },

  mounted() {
    // let vm = this;
    // if (vm.isShowSku == false) {
    //   return;
    // }
    // vm.$api["product/prProductRepoVariantGetComboBox"]({
    //   productRepoId: vm.productRepoId
    // }).then(({ rows }) => {
    //   vm.list = rows.map(item => {
    //     return {
    //       label: item.repoSku,
    //       value: item.productRepoId
    //     };
    //   });
    // });
  },
  methods: {
    submit() {
      let vm = this;

      let productRepoIds = vm.form.productRepoIds,
        accessoryList = vm.$refs.table.getTableData().map(item => {
          return {
            num: +item.num,
            id: item.productRepoId
          };
        });
      if (!vm.utils.isArrLength(productRepoIds) && vm.isShowSku != false) {
        vm.$message.error("请选择SKU");
        return false;
      }
      if (!accessoryList.length || !accessoryList.every(item => !!item.num)) {
        vm.$message.error("请选择产品并填写数量");
        return false;
      }
      let paramsFlag = vm.utils.isEmpty(vm.params);
      let params = vm.params;
      if (!paramsFlag) {
        params = {
          ...vm.params,
          productVariantIds: vm.form.productRepoIds,
          materialList: vm.tableData.map(item => {
            return {
              materialId: +item.consumablesId,
              materialNum: item.num
            };
          })
        };
      }
      params = !paramsFlag
        ? params
        : {
            productRepoIds,
            accessoryList,
            accessoryId: vm.accessoryId
          };
      return vm.$api[vm.saveUrl || "product/prProductRepoAccessorySave"](
        params
      ).then(() => {
        vm.getList();
      });
    }
  },
  watch: {
    selectData: {
      deep: true,
      handler(val) {
        let vm = this,
          data = vm.utils.clone(val);
        data = data.map(item => {
          if (vm.utils.isEmpty(item.num)) {
            item.num = 1;
          }
          return item;
        });
        this.tableData = data;
      }
    }
  },
  components: {
    customTable: () => import("../../../components/customTable/src")
  }
};
</script>

<style lang='scss'>
.add-product {
  background: #fff;
  .ready-wrap {
    height: 40px;
    background: rgba(242, 242, 242, 1);
    line-height: 40px;
    text-indent: 1rem;
  }
}
</style>