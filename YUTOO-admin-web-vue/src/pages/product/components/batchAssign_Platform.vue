<template>
  <v-form direction="horizontal">
    <v-form-item :wrapper-col="{span:24}">
      <v-select size="lg" :data="options" v-model="ruleForm.operatorId"></v-select>
    </v-form-item>
    <v-form-item :wrapper-col="{span:24}" style="text-align: center;">

      <v-button type="primary" @click="ok">确定</v-button>
    </v-form-item>
  </v-form>
</template>

<script>
import { fetchData, showToast } from "common/common";
import apis from "apis";

export default {
  created() {
    fetchData({
      ...apis.PRODUCT_PLATFORM_OPERATION_OPERATOR_LIST,
      data: {
        operatorType: this.$attrs.type
      }
    }).then(res => {
      if (res.data.code !== 0) {
        showToast("error", res.data.msg);
        return;
      }
      this.options = res.data.rows.map(el => ({
        label: el.username,
        value: el.userId
      }));
    });
  },
  data() {
    return {
      options: [],

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
