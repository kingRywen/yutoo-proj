<template>
  <div>
    <v-row :gutter="12">
      <v-col span="20">
        <v-select style="width:100%" size="lg" :data="options" clue="categoryId" label="nameCn" :clearable="false" v-model="categoryId"></v-select>
      </v-col>
      <v-col span="4">
        <v-button type="primary" @click="add">添加</v-button>
      </v-col>
    </v-row>
    <v-row :gutter="12" style="margin-top:40px">
      <v-col span="24" style="text-align:center">
        <v-button type="primary" @click="confirm">确认上传</v-button>
        <v-button type="primary" @click="cancel">取消</v-button>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import apis from "apis";
import { fetchData, handlerCode, showToast, toParamUrl } from "common/common";
export default {
  created() {
    this.getData();
  },
  data() {
    return {
      categoryId: "",
      options: []
    };
  },
  methods: {
    add() {
      toParamUrl("/product/ProductCategoryManagement.html");
      this.cancel();
    },
    confirm() {
      let vm = this;
      const { productType } = vm.$attrs;
      fetchData({
        ...apis.STORE_PRODUCT_PLAT_CONFIRM,
        data: {
          categoryId: vm.categoryId,
          storeProductPlatId: vm.$attrs.storeProductPlatId,
          productType
        }
      }).then(res => {
        handlerCode(res, () => {
          vm.cancel();
        });
      });
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    getData() {
      let vm = this;
      const { storeProductPlatId, productType } = vm.$attrs;
      fetchData({
        ...apis.STORE_PRODUCT_PLAT_REVERSE,
        data: {
          storeProductPlatId,
          productType
        }
      }).then(res => {
        const { rows } = res.data;
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        if (!rows.isCategory) {
          showToast("error", rows.msg);
          return;
        }
        this.options = rows.data;
      });
    }
  }
};
</script>

<style>
</style>
