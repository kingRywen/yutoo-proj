<template>
  <v-form direction="horizontal" :model="ruleForm" ref="ruleForm" style="padding: 0 30px">

    <v-form-item :wrapper-col="{span:24}" :required="ruleForm.status == 2" has-feedback prop="auditReasons">
      <v-input placeholder="请输入原因" type="textarea" v-model="ruleForm.auditReasons" :autosize={minRows:6}></v-input>
    </v-form-item>
  </v-form>
</template>

<script>
import { showToast } from "common/common";
export default {
  data() {
    return {
      ruleForm: {}
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
