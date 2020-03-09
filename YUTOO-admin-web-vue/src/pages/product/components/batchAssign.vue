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
import { fetchData } from "common/common";
import apis from "apis";

export default {
  created() {
    let api;
    if (this.$attrs.type === 1) {
      api = apis.PRODUCT_DEVELOP_USER_LIST;
    } else {
      api = apis.PRODUCT_PURCHASE_USER_LIST;
    }
    fetchData({ ...api }).then(res => {
      console.log(res);
      if (res.data.code === 0) {
        res.data.rows.map(el => {
          el.label = el.userName || el.username;
          el.value = el.userId;
        });
      }
      this.options = res.data.rows;
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
