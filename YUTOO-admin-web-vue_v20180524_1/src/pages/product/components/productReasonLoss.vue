<template>
  <div>
    <!-- 打回原因显示 -->
    <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm" v-if="type > 2">
      <v-row>
        <v-col span="24">
          <v-form-item label="打回平台" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{ruleForm.platform}}</div>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="打回阶段" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{ruleForm.stage}}</div>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="原因" :label-col="labelCol" :wrapper-col="wrapperCol">
            <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.reason"></v-input>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="" style="text-align:center">
            <v-button type="primary" @click="edit">去编辑</v-button>
            <v-button type="primary" @click="cancel">暂不编辑</v-button>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
    <!-- 审核不通过显示 -->
    <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm" v-else>
      <v-row>
        <v-col span="24">
          <v-form-item label="审核阶段" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{type == 1 ? '基础信息不通过': '采购信息不通过'}}</div>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="原因" :label-col="labelCol" :wrapper-col="wrapperCol">
            <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.auditReason" disabled></v-input>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="" style="text-align:center">
            <v-button type="primary" @click="edit">去编辑</v-button>
            <v-button type="primary" @click="cancel">暂不编辑</v-button>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>

  </div>
</template>

<script>
import { fetchData, toParamUrl } from "common/common";
import apis from "apis";
export default {
  props: ["item", "type"],
  created() {
    if (this.type == 1 || this.type == 2) {
      // 基础信息 或者 采购审核不通过的原因
      fetchData({
        ...apis.PRODUCT_AUDIT_INFO,
        data: {
          productId: this.item.productId,
          auditType: this.type
        }
      }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          this.ruleForm = res.data.productAudit;
        }
      });
    } else {
      fetchData({
        ...apis.PRODUCT_PLT_AUDIT_INFO,
        data: {
          productId: this.item.productId
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.ruleForm = res.data;
        }
      });
    }
  },
  data: () => ({
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 14
    },
    ruleForm: {},
    rules: {}
  }),
  methods: {
    cancel() {
      this.ok();
    },
    edit() {
      toParamUrl("/product/productList/addProduct.html", {
        productId: this.item.productId
      });
      this.ok();
    },
    ok() {
      this.$root.$children[0].asyncModalVisible = false;
    }
  }
};
</script>

<style>
</style>
