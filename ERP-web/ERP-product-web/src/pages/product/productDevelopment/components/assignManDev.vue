<template>
  <v-form direction="horizontal">
    <v-form-item :wrapper-col="{span:24}">
      <v-select size="lg" :data="options" v-model="ruleForm.developerId"></v-select>
      <!-- <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="输入原因" v-model="ruleForm.auditReason"></v-input> -->
    </v-form-item>
  </v-form>
</template>

<script>
import { fetchData } from "common/common";
import apis from "apis";

export default {
  created() {
    fetchData({ ...apis.DEVELOP_USER_LIST }).then(res => {
      console.log(res);
      if (res.data.code === 0) {
        res.data.rows.map(el => {
          el.label = el.nickName;
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
