<template>
  <v-form :model="ruleForm">
        <v-form-item label="SKU">
            <v-select size="lg" style="width: 120px;" v-model="ruleForm.skuType" :data="$attrs.select"></v-select>
        </v-form-item>
        <v-form-item>
            <v-input type="text" v-model="ruleForm.sku" placeholder="请输入SKU"></v-input>
        </v-form-item>
        <v-form-item label="产品名称">
            <v-input type="text" v-model="ruleForm.name" placeholder="请输入产品名称"></v-input>
        </v-form-item>
        <v-form-item>
            <v-button type="primary" html-type="button" @click.prevent="$emit('search', ruleForm)">搜索</v-button>
            <v-button type="default" html-type="button">高级搜索</v-button>
        </v-form-item>
    </v-form>
</template>

<script>
export default {
  name: "ytSimpleSearch",
  inheritAttrs: false,
  data: () => ({
    options: [],
    ruleForm: {
      name: "",
      skuType: "",
      sku: ""
    }
  })
};
</script>

<style>

</style>
