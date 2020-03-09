<template>
  <v-form direction="horizontal">
    <v-form-item :wrapper-col="wrapperCol" label="选择备注类型" :label-col="labelCol">
      <v-select size="lg" :data="options" v-model="ruleForm.remarkType"></v-select>
    </v-form-item>
    <v-form-item :wrapper-col="wrapperCol" style="text-align: center;" label="备注" :label-col="labelCol">
      <v-input type="textarea" v-model="ruleForm.remarkStr" :autosize="{minRows:6}"></v-input>
    </v-form-item>
    <v-form-item class="text-center">

      <v-button type="primary" @click="ok" :loading="loading">保 存</v-button>
    </v-form-item>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      loading: false,

      options: [
        { label: "开发备注", value: 1 },
        { label: "采购收货备注", value: 2 },
        { label: "质检备注", value: 3 }
      ],

      ruleForm: {},

      labelCol: {
        span: 6
      },
      wrapperCol: { span: 14 }
    };
  },
  methods: {
    ok() {
      this.$listeners.set(this);
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style>
</style>
