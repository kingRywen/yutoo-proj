<template>
  <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm" style="padding: 0 30px">
    <v-form-item :wrapper-col="{span:24}">
      <v-radio-group v-model="ruleForm.status" :data="[{value: 2, text: '通过转为新品'},{value: 3, text: '不通过'}]">
      </v-radio-group>

    </v-form-item>
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
      ruleForm: {},
      rules: {
        auditReasons: {
          required: false,
          message: "不能为空"
        }
      }
    };
  },
  methods: {
    ok() {
      if (!this.ruleForm.status) {
        showToast("info", "请选择结果");
        return;
      }
      let form = this.$refs.ruleForm;
      form.validate(valid => {
        if (valid && this.ruleForm.status) {
          this.$listeners.set(this);
        }
      });
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  },
  watch: {
    "ruleForm.status"(val) {
      this.rules.auditReasons.required = val !== 2 ? true : false;
    }
  }
};
</script>

<style>
</style>
