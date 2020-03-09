<template>
  <v-form direction="horizontal">
    <v-form-item label="原因" :label-col="labelCol" :wrapper-col="wrapperCol">
      <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="请输入原因" v-model="ruleForm.developDesc"></v-input>
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
