<template>

  <div v-if="data.prodSrcSupplier">

    <v-card title="类目" noHovering class="margin-bottom-20">
      <v-form direction="horizontal">
        <v-form-item label="类目名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier && data.prodSrcSupplier.categoryNameArry}}</span>
        </v-form-item>
      </v-form>
    </v-card>

    <v-card title="基本内容编辑" noHovering class="margin-bottom-20">
      <v-form direction="horizontal">
        <v-form-item label="中文名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.productNameCn}}</span>
        </v-form-item>
        <v-form-item label="英文文名称" :label-col="labelCol" :wrapper-col="wrapperCol">
          <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.productNameEn}}</span>
        </v-form-item>
      </v-form>
    </v-card>

    <v-card title="产品基本信息" noHovering class="margin-bottom-20">
      <v-form direction="horizontal">
        <v-row :gutter="12">
          <v-col :span="8">
            <v-form-item label="包装前重量" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.netWeight}}</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="包装后重量" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.grossWeight}}</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="体积" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">长{{data.prodSrcSupplier.packageLong}} / 宽{{data.prodSrcSupplier.packageWide}} / 高{{data.prodSrcSupplier.packageHigh}}</span>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row :gutter="12">
          <v-col :span="8">
            <v-form-item label="交货期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.deliveryTerm}}天</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="采购价(RMB)" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.spurchasePrice}}</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="运费(RMB)" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.freight}}</span>
            </v-form-item>
          </v-col>
        </v-row>
        <v-row :gutter="12">
          <v-col :span="8">
            <v-form-item label="货源" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.source == 1?'市场采购':data.prodSrcSupplier.source == 2 ? '网络采购':'工厂采购'}}</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="产品描述" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.productDesc}}</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="备注" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.remarks}}</span>
            </v-form-item>
          </v-col>
        </v-row>
        <v-row :gutter="12">
          <v-col :span="8">
            <v-form-item label="参考网站链接" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.referenceWebsite}}</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="上传附件" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName"><a :href="data.prodSrcSupplier.enclosureUrl">{{data.prodSrcSupplier.enclosureName}}</a></span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="产品侵权风险" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{risk[data.prodSrcSupplier.risk]}}</span>
            </v-form-item>
          </v-col>
        </v-row>
        <v-row :gutter="12">
          <v-col :span="8">
            <v-form-item label="产品物流属性" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.logisticsProperty}}</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="强电插头" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.productNameEn ? '有' :'无'}}</span>
            </v-form-item>
          </v-col>
          <v-col :span="8">
            <v-form-item label="强电插头类型" :label-col="labelCol" :wrapper-col="wrapperCol">
              <span class="ant-form-text" id="userName" name="userName">{{data.prodSrcSupplier.plugSpec}}</span>
            </v-form-item>
          </v-col>
        </v-row>

        <v-form-item label="产品图片" :label-col="{span:2}" :wrapper-col="{span:22}">
          <v-row :gutter="12">
            <v-col :span="3" v-for="img in data.limg">
              <span class="ant-form-text" id="userName" name="userName"><img :src="img.imgUrl" :alt="img.imgName" style="margin:10px;width:100%;height:auto"></span>
            </v-col>
          </v-row>

        </v-form-item>
      </v-form>
    </v-card>
  </div>
</template>

<script>
import { showToast, fetchData } from "common/common";
import apis from "apis";
export default {
  created() {
    this.getData();
  },
  data() {
    return {
      labelCol: { span: 6 },
      wrapperCol: {
        span: 14
      },
      data: {},
      risk: ["仿牌", "非仿牌", "未选择"]
    };
  },
  methods: {
    getData() {
      fetchData({
        ...apis.PRODSRCSUPPLIER_INFO,
        data: { prodSrcSupplierId: this.$attrs.item.prodSrcSupplierId }
      }).then(res => {
        if (res.data.code === 0) {
          this.data = res.data.rows;
        } else {
          showToast("error", "获取信息失败");
        }
      });
    }
  }
};
</script>

<style>
</style>
