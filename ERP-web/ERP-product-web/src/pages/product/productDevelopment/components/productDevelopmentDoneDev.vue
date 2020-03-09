<template>
  <v-form direction="horizontal">
    <v-form-item label="实际采购价格" :label-col="labelCol" :wrapper-col="wrapperCol">
      <!-- <v-input placeholder="" v-model="ruleForm.developPrice"></v-input> -->
      <v-input-number size="large" :min="1" v-model="ruleForm.developPrice" style="width:100%"></v-input-number>
    </v-form-item>
    <v-form-item label="开发说明" :label-col="labelCol" :wrapper-col="wrapperCol">
      <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="请输入原因" v-model="ruleForm.developDesc"></v-input>
    </v-form-item>
    <v-form-item style="display:flex;justify-content: center;">
      <v-button type="primary" @click="ok">确定</v-button>
    </v-form-item>
  </v-form>
</template>

<script>
export default {
  data() {
    return {
      ruleForm: {
        developPrice: 1,
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
