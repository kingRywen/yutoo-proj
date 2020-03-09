<template>
  <div>
    <!-- {{$attrs.arrs}} -->
    <div v-if="$attrs.arrs && $attrs.arrs.length">
      <v-form direction="horizontal" ref="ruleForm1" style="margin:60px 0">
        <v-form-item label="审核结果" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-radio-group v-model="ruleForm1.auditType" :data="[{value: 1, text: '审核通过'},{value: 0, text: '审核不通过'}]"></v-radio-group>
        </v-form-item>
        <v-form-item label="原因" :label-col="labelCol" :wrapper-col="wrapperCol">
          <v-input type="textarea" v-model="ruleForm1.refuseReason" :autosize="{minRows:8}"></v-input>
        </v-form-item>
      </v-form>
    </div>

    <v-form v-else direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">

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
        <!-- <v-col span="24">
          <v-form-item label="SKU(渠道SKU)" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div>{{publicInfo.StoreName}}</div>
          </v-form-item>
        </v-col> -->
        <v-col span="24">
          <v-form-item label="模板设置基准属性" :label-col="labelCol" :wrapper-col="wrapperCol">
            <div v-for="item in rows" v-if="typeof item.propertyValue === 'object'">
              <h3>{{item.propertyHead}}</h3>
              <div v-for="val in item.propertyValue">
                <div style="text-indent:12px">{{val.skuStore}} : {{val.value}}</div>
              </div>

            </div>
            <div v-else>
              <div style="text-indent:12px">
                <b>{{item.propertyHead}}</b> : {{item.propertyValue}}</div>
            </div>

          </v-form-item>
        </v-col>

        <v-col span="24">
          <v-form-item label="images" :label-col="labelCol" :wrapper-col="wrapperCol">
            <UploadImg :show="true"></UploadImg>
          </v-form-item>
        </v-col>
        <v-col span="24">
          <v-form :model="ruleForm" :rules="rulesForm" ref="form">
            <!-- {{rulesForm}} == {{ruleForm}} -->
            <v-col span="24">
              <v-form-item label="审核" :label-col="labelCol" :wrapper-col="wrapperCol" prop="auditType" style="width:100%">
                <v-radio-group v-model="ruleForm.auditType" :data="[{value: 1, text: '通过同意上架'},{value: 0, text: '不通过'}]">
                </v-radio-group>
              </v-form-item>
            </v-col>
            <v-col span="24" v-if="ruleForm.auditType == 1" :key="1">
              <v-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol" style="width:100%">
                <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.refuseReason"></v-input>
              </v-form-item>
            </v-col>
            <v-col span="24" v-else :key="2">
              <v-form-item label="拒绝原因" :label-col="labelCol" :key="ruleForm.auditType" :wrapper-col="wrapperCol" style="width:100%" :required="ruleForm.auditType === 0" :rules="[{required:ruleForm.auditStatus === 3 ? true : false, message: '请填写不通过的原因'}]" prop="refuseReason">
                <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.refuseReason"></v-input>
              </v-form-item>
            </v-col>
          </v-form>
        </v-col>

      </v-row>
    </v-form>
  </div>
</template>

<script>
import apis from "apis";
import { fetchData, showModal, showToast } from "common/common";
import UploadImg from "components/base/uploadImg";

export default {
  components: {
    UploadImg
  },
  created() {
    if (this.$attrs.arrs) {
      return;
    }
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
  data() {
    return {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 14
      },
      ruleForm: {},
      ruleForm1: {},
      rulesForm: {
        refuseReason: {
          required: true,
          message: "不能为空",
          trigger: "blur,change"
        }
      },
      rules: {},

      publicInfo: {},
      rows: []
    };
  },
  methods: {
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    ok() {
      if (this.$attrs.arrs && this.$attrs.arrs.length) {
        let pros = this.$attrs.arrs.map(el => ({
          productId: el.storeProductId,
          productType: el.productType,
          auditType: this.ruleForm1.auditType,
          refuseReason: this.ruleForm1.refuseReason
        }));
        this.$listeners.set(pros, this);
      } else {
        this.$refs.form.validate(valid => {
          if (valid) {
            this.$listeners.set(this.ruleForm, this);
          } else {
            showToast("error", "请填写审核不通过的原因");
          }
        });
      }
    }
  },
  watch: {
    ruleForm() {
      this.$refs.form.validate();
    }
  }
};
</script>

<style>
</style>
