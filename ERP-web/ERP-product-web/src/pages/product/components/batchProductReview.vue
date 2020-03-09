<template>
  <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">
    <!-- {{ruleForm}} -->
    <v-row>
      <!-- <v-col span="24">
        <v-form-item label="审核" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-radio-group v-model="ruleForm.auditStatus" :data="[{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]">
          </v-radio-group>
        </v-form-item>
      </v-col> -->
      <v-col span="24">
        <v-form-item label="原因" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.auditReason"></v-input>
        </v-form-item>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
export default {
  // props: ["data"],
  data() {
    return {
      ruleForm: {},
      rules: {},
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      }
    };
  },
  methods: {
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    ok() {
      this.$listeners.set(this);
    }
  }
};
</script>

<style>
</style>
