<template>
  <div class="addcombination">
    <ElRow>
      <ElCol :span="24">
        <!-- product/prProductRepoPartsGet  productRepoId-->
        <customTable
          :url="'product/prProductRepoVariantGetCategory'"
          :isShowPag="true"
          :columns="columns"
          v-model="selectData"
          :searchConfig="searchConfig"
          :moreParams="{
            systemCategoryId:params.systemCategoryId
          }"
          :rowKey="'productRepoId'"
        ></customTable>
      </ElCol>
      <ElCol :span="24" style="margin-top: 20px">
        <div class="ready-wrap">已选择列表</div>
        <customTable
          :rowKey="'productRepoId'"
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
import { mapState, mapActions } from "vuex";
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      moreParams: {},
      list: [],
      tableData: [],
      searchConfig: [
        {
          label: "母SKU",
          type: "multiple",
          value: "productRepoIds",
          labelWidth: "60px",
          children: []
        },
        {
          label: "产品名称",
          type: "input",
          value: "name",
          labelWidth: "80px"
        }
      ],
      columns: [
        {
          label: "图片",
          value: "image",
          type: "image"
        },
        {
          label: "产品名称",
          value: "nameCn"
        },
        {
          label: "系统SKU",
          value: "sysSku"
        },
        {
          label: "自定义SKU",
          value: "repoSku"
        },
        {
          label: "产品英文名称",
          value: "nameEn"
        },
        {
          label: "产品属性",
          value: "variantProperty"
        }
      ],
      yetColumns: [
        {
          label: "图片",
          value: "image",
          type: "image"
        },
        {
          label: "产品名称",
          value: "nameCn"
        },
        {
          label: "系统SKU",
          value: "sysSku"
        },
        {
          label: "自定义SKU",
          value: "repoSku"
        },
        {
          label: "产品英文名称",
          value: "nameEn"
        },
        {
          label: "产品属性",
          value: "variantProperty"
        },
        {
          label: "产品数量",
          value: "productNumber",
          input: true
        }
      ],
      selectData: []
    };
  },
  created() {
    this.getMatrixList(this.params.systemCategoryId);
    this.selectData = this.params.tableData;
  },

  mounted() {},
  computed: {
    ...mapState("common", ["matrixList"])
  },
  methods: {
    ...mapActions("common", ["getMatrixList"]),
    submit() {
      this.params.addProduct(this.tableData);
      return true;
    }
  },
  watch: {
    selectData: {
      deep: true,
      handler(val) {
        let vm = this;
        this.tableData = vm.utils.clone(val);
      }
    },
    matrixList(val) {
      this.searchConfig[0].children = val;
    }
  },
  components: {
    customTable: () =>
      import("Views/modules/product/common/base/components/customTable/src")
  }
};
</script>

<style lang='scss'>
.addcombination {
  background: #fff;
  .ready-wrap {
    height: 40px;
    background: rgba(242, 242, 242, 1);
    line-height: 40px;
    text-indent: 1rem;
  }
}
</style>