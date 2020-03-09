<template>
  <v-form direction="horizontal">
    <v-form-item label="打回阶段" :label-col="labelCol" :wrapper-col="wrapperCol">
      <v-checkbox v-model="ruleForm.status1" :true-value="1" :false-value="0">基础信息</v-checkbox>
      <v-checkbox v-model="ruleForm.status2" :true-value="1" :false-value="0">采购</v-checkbox>
    </v-form-item>
    <v-form-item label="原因" :label-col="labelCol" :wrapper-col="wrapperCol">
      <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="输入原因" v-model="ruleForm.auditReason"></v-input>
    </v-form-item>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        auditStatus: 3
      },

      labelCol: {
        span: 6
      },
      wrapperCol: { span: 14 }
    };
  },
  methods: {
    ok() {
      if (this.ruleForm.status1 == 1 && this.ruleForm.status2 != 1) {
        this.ruleForm.repulse = 1;
      } else if (this.ruleForm.status1 != 1 && this.ruleForm.status2 == 1) {
        this.ruleForm.repulse = 2;
      } else if (this.ruleForm.status1 == 1 && this.ruleForm.status2 == 1) {
        this.ruleForm.repulse = 3;
      }
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
