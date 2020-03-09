<template>
  <div class="add-materials">
    <addProduct
      ref="materials"
      :columns="columns"
      :yetColumns="yetColumns"
      :select="params.selectData"
      :getList="params.getList"
      :accessoryId="params.accessoryId"
      :isShowSku="params.isShowSku"
      id="consumablesId"
      getUrl="product/prConsumablesList"
      saveUrl="product/prProductRepoPackageMaterialSave"
      :params="params.params"
      :productRepoId="params.productRepoId"
      :type="null"
    ></addProduct>
  </div>
</template>

<script>
export default {
  props: {
    params: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columns: [
        {
          label: "包材名称",
          value: "nameCn"
        },
        {
          label: "SKU",
          value: "consumablesSku"
        },
        {
          label: "型号",
          value: "model"
        },
        {
          label: "规格",
          value: "specs"
        },
        {
          label: "价格",
          value: "price"
        }
      ],
      yetColumns: [
        {
          label: "包材名称",
          value: "nameCn"
        },
        {
          label: "SKU",
          value: "consumablesSku"
        },
        {
          label: "型号",
          value: "model"
        },
        {
          label: "规格",
          value: "specs"
        },
        {
          label: "价格",
          value: "price"
        },
        {
          label: "数量",
          input: true,
          value: "num"
        }
      ]
    };
  },
  created() {},
  methods: {
    submit() {
      return this.$refs.materials.submit();
    }
  },
  components: {
    addProduct: () => import("../../common/addProduct")
  }
};
</script>

<style lang='scss'>
.add-materials {
  background: #fff;
}
</style>