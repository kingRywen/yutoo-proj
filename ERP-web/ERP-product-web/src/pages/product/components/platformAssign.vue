<template>
  <div>
    <v-form :model="ruleForm" direction="horizontal" :rules="rules" ref="ruleForm">
      <v-form-item :wrapper-col="{span:24}" label="">
        <v-select size="lg" placeholder="请选择编辑项" :data="options1" v-model="ruleForm.operationType"></v-select>
      </v-form-item>
      <v-form-item :wrapper-col="{span:24}" label="">
        <v-select size="lg" placeholder="请选择人员" :data="options2" v-model="ruleForm.operatorId"></v-select>
      </v-form-item>

    </v-form>
  </div>
</template>

<script>
import { fetchData } from "common/common";
import apis from "apis";

export default {
  created() {
    this.getOpeList();
    // this.getUserList();
  },
  data() {
    return {
      ruleForm: {
        operatorId: null
      },
      options1: [],
      options2: [],
      rules: {}
    };
  },
  watch: {
    "ruleForm.operationType"(val) {
      this.ruleForm.operatorId = null;
      this.getUserList(val);
    }
  },
  methods: {
    getOpeList() {
      fetchData({ ...apis.PRODUCT_PLATFORM_OPERATION_TYPE_LIST }).then(res => {
        if (res.data.code === 0) {
          this.options1 = res.data.list.map(el => ({
            value: el.key,
            label: el.value
          }));
        }
      });
    },
    getUserList(val) {
      fetchData({
        ...apis.PRODUCT_PLATFORM_OPERATION_OPERATOR_LIST,
        data: {
          operatorType: val
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          res.data.rows.map(el => {
            el.label = el.nickName;
            el.value = el.userId;
          });
        }
        this.options2 = res.data.rows;
      });
    },
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
