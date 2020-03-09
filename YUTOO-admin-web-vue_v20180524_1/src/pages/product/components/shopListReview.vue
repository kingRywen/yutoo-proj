<template>
  <div>
    <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">
      {{ruleForm}}
      <v-row>
        <v-col span="24">
          <v-form-item label="销售类型" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{publicInfo.saleType}}</div>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="站点" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{publicInfo.siteNameZh}}</div>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="店铺名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{publicInfo.StoreName}}</div>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="SKU(渠道SKU)" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{publicInfo.StoreName}}</div>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="模板设置基准属性" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div v-for="item in rows">
              <h3>{{item.propertyName}}</h3>
              <div v-for="val in item.propertyValue">
                <div style="text-indent:12px">{{val.skuStore}} : {{val.value}}</div>
              </div>
            </div>

          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="images" :label-col="labelCol" :wrapper-col="wrapperCol">
            <UploadImg :show="true"></UploadImg>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form-item label="审核" :label-col="labelCol" :wrapper-col="wrapperCol">
            <v-radio-group v-model="ruleForm.auditType" :data="[{value: 1, text: '通过同意上架'},{value: 0, text: '不通过'}]">
            </v-radio-group>
            <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.refuseReason"></v-input>
          </v-form-item>
        </v-col>
      </v-row>
    </v-form>
  </div>
</template>

<script>
import apis from "apis";
import { fetchData } from "common/common";
import UploadImg from "components/base/uploadImg";

export default {
  components: {
    UploadImg
  },
  created() {
    console.log("---------------------------", this.$attrs);
    let data = {};
    data.productId = +this.$attrs.storeProductId;
    data.productType = +this.$attrs.productType;
    fetchData({
      ...apis.STORE_PRODUCT_INFO,
      data: data
    }).then(res => {
      console.log(res);
      this.publicInfo = res.data.rows.publicInfo;
      this.rows = res.data.rows.properties;
    });
  },
  data: () => ({
    labelCol: {
      span: 6
    },
    wrapperCol: {
      span: 14
    },
    ruleForm: {},
    rules: {},

    publicInfo: {},
    rows: []
  }),
  methods: {
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    ok() {
      this.$listeners.set(this.ruleForm);
    }
  }
};
</script>

<style>
</style>
