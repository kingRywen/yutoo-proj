<template>
  <div class="add-parts">
    <addProduct
      ref="part"
      :columns="columns"
      :yetColumns="yetColumns"
      :select="params.select"
      :getList="params.getList"
      :accessoryId="params.accessoryId"
      :isShowSku="isShowSku"
      :productRepoId="params.productRepoId"
      :params="params.params"
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
      isShowSku: true,
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
          label: "仓库SKU",
          value: "repoSku"
        },
        {
          label: "系统SKU",
          value: "sysSku"
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
          label: "仓库SKU",
          value: "repoSku"
        },
        {
          label: "系统SKU",
          value: "sysSku"
        },
        {
          label: "数量",
          input: true,
          value: "num"
        }
      ],
      select: []
    };
  },
  created() {
    this.isShowSku = this.params.isShowSku == false ? false : true;
  },
  methods: {
    submit() {
      return this.$refs.part.submit();
    }
  },
  components: {
    addProduct: () => import("../../common/addProduct")
  }
};
</script>

<style lang='scss'>
.add-parts {
  background: #fff;
}
</style>