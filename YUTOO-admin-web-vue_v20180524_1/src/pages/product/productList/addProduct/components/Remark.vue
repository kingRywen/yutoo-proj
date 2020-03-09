<template>
  <div>
    <!-- {{ruleForm}} -->
    <h2 style="margin:30px 0" v-if="differ">变体:{{sku}}</h2>
    <v-form :model="ruleForm" direction="horizontal" :rules="rules" ref="ruleForm">
      <v-row>

        <v-col span="12" v-if="showField.indexOf('presellFlag') >= 0">
          <!-- {{rules}} -->
          <v-form-item :label-col="{span:8}" :wrapper-col="{span:9}" label="是否预售" prop="presellFlag" :required="!!rules.presellFlag">
            <v-switch :disabled="$attrs.show" :true-value="1" :false-value="0" v-model="ruleForm.presellFlag">
              <span slot="checkedChildren">是</span>
              <span slot="unCheckedChildren">否</span>
            </v-switch>
          </v-form-item>
        </v-col>
        <v-col span="12" v-if="showField.indexOf('presellTime') >= 0">
          <v-form-item :label-col="{span:8}" :wrapper-col="{span:12}" label="预售到货日期" v-if="ruleForm.presellFlag" prop="presellTime" :required="!!rules.presellTime">
            <!-- <v-date-picker style="width:100%" show-time v-model="presellTime"></v-date-picker> -->
            <v-input v-model.number="ruleForm.presellTime" style="width:100%"></v-input>
          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('saleTimeStart') >= 0">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="出售时间" prop="saleTimeStart" :required="!!rules.saleTimeStart">
            <v-date-picker style="width:100%" range show-time v-model="rangeTime" clearable></v-date-picker>
          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('developRemark') >= 0">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="开发备注" :required="!!rules.developRemark">
            <v-input type="textarea" v-model="ruleForm.developRemark" :autosize="{minRows:4}"></v-input>
          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('purchaseRemark') >= 0">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="采购备注" :required="!!rules.purchaseRemark">
            <v-input type="textarea" v-model="ruleForm.purchaseRemark" :autosize="{minRows:4}"></v-input>
            <span>提示：会显示在采购单产品详情外，方便收货人员查看注意事项。</span>
          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('packageType') >= 0">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品打包状态" :required="!!rules.packageType">
            <v-radio-group v-model="ruleForm.packageType" :data="[{value: 1, text: '不需打包'},{value: 2, text: '需自行打包'},{value: 3, text: '需供应商打包'}]"></v-radio-group>
          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('attachmentRemarkPath') >= 0">
          <v-form-item v-if="!$attrs.show" :label-col="labelCol" :multiple="false" :wrapper-col="wrapperCol" label="上传附件" :required="!!rules.attachmentRemarkPath">
            <v-row :gutter="10">
              <v-col span="18">
                <v-upload :name="upload.name" :action="upload.action" @change="onUploadChange" :header="upload.header" style="width:100%">
                  <v-row :gutter="10">
                    <v-col span="12">
                      <v-input placeholder="点击上传附件" disabled :value="filename" :fileurl="url"></v-input>
                    </v-col>
                    <v-col span="12">
                      <v-button type="primary">
                        <v-icon type="upload"></v-icon>上传附件
                      </v-button>
                    </v-col>
                  </v-row>
                </v-upload>
              </v-col>
              <v-col span="6">
                <v-button type="primary" @click.native="openLink">打开附件链接</v-button>
              </v-col>

            </v-row>
          </v-form-item>
          <v-form-item :label-col="labelCol" label="上传的附件" :wrapper-col="wrapperCol" v-else :required="!!rules.presellTime">
            <div>显示附件</div>
          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('productRemarkPath') >= 0">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品备注" :required="!!rules.productRemarkPath">
            <Editor v-show="!$attrs.show" @input="editInput('productRemarkPath', $event)" :defaultMsg=ruleForm.productRemarkPath :config=config :init-id="'editor-' + sku" ref="ue" />
            <v-row :gutter="10">
              <v-col span="4">
                上传文件路径
              </v-col>
              <v-col span="12">
                <v-input placeholder="点击上传"></v-input>
              </v-col>
              <v-col span="8">
                <v-button type="primary">上传文件插入编辑器</v-button>
              </v-col>
            </v-row>

          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('imgRemark') >= 0">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="图片处理备注" :required="!!rules.imgRemark">
            <v-input type="textarea" placeholder="" :autosize="{ minRows: 4 }" v-model="ruleForm.imgRemark"></v-input>
          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('qcRemarkPath') >= 0">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="质检备注" :required="!!rules.qcRemarkPath">
            <Editor v-show="!$attrs.show" @input="editInput('qcRemarkPath', $event)" :defaultMsg=ruleForm.qcRemarkPath :config=config :init-id="'editor1-' + sku" ref="ue1" />
            <v-row :gutter="10">
              <v-col span="4">
                上传文件路径
              </v-col>
              <v-col span="12">
                <v-input placeholder="点击上传"></v-input>
              </v-col>
              <v-col span="8">
                <v-button type="primary">上传文件插入编辑器</v-button>
              </v-col>
            </v-row>
          </v-form-item>
        </v-col>

        <v-col span="24" v-if="showField.indexOf('shipmentRemarkPath') >= 0">
          <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="发货打包备注" :required="!!rules.shipmentRemarkPath">
            <Editor v-show="!$attrs.show" @input="editInput('shipmentRemarkPath', $event)" :defaultMsg=ruleForm.shipmentRemarkPath :config=config :init-id="'editor2-' + sku" ref="ue2" v-model="ruleForm.productRemarkPath" />
            <v-row :gutter="10">
              <v-col span="4">
                上传文件路径
              </v-col>
              <v-col span="12">
                <v-input placeholder="点击上传"></v-input>
              </v-col>
              <v-col span="8">
                <v-button type="primary">上传文件插入编辑器</v-button>
              </v-col>
            </v-row>
          </v-form-item>
        </v-col>

      </v-row>
    </v-form>
  </div>
</template>

<script>
import { showToast } from "common/common";
import { formatTime } from "common/util";
import Vue from "vue";
import Editor from "components/base/editor.vue";
import config from "common/config";
import inputVariant from "components/base/inputVariant.vue";
import apis from "apis";
export default {
  inheritAttrs: false,
  props: ["model", "sku", "differ"],
  components: {
    Editor,
    inputVariant
  },
  mounted() {
    if (this.$attrs.show) {
      let input = this.$refs.content.querySelectorAll("input,select,textarea");
      input.forEach(el => (el.disabled = true));
    }
    console.log(this.model);
  },
  data: () => ({
    defaultMsg: "",
    config: {
      initialFrameWidth: null,
      initialFrameHeight: 350
    },

    ruleForm: {},
    rangeTime: ["", ""],
    upload: {
      name: "file",
      // action: config.BASE_URL + apis.PRODUCT_REMARK_UPLOAD.url,
      action: config.BASE_URL + apis.PRODUCT_REMARK_UPLOAD.url,
      header: {
        token: localStorage.getItem("token")
      }
    },
    rules: {},
    labelCol: {
      span: 4
    },
    wrapperCol: {
      span: 18
    },

    presellTime: "",

    filename: "",
    url: "",

    inputArrs: [], //基础属性字段
    variants: [], // 变体差异字段
    // productVariantRemarkMap: {}, // 存储变体数据

    remarkTab: {
      // 最终要提交的数据
      productVariantRemarkMap: {},
      productParentRemark: {}
    }
  }),
  methods: {
    // 打开附件链接
    openLink() {
      window.open(this.url);
    },

    // 编辑器输入事件
    editInput(name, val) {
      // this.ruleForm[name] = val;
      Vue.set(this.ruleForm, name, val);
    },

    getUEContent() {
      let content = this.$refs.ue.getUEContent();
      console.log(content);
    },
    onUploadChange(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        showToast("success", info.file.name + " 上传成功.");
        if (info.file.response.code == 0) {
          this.filename = info.file.name;
          this.url = info.file.response.remarkFilePath;
          this.ruleForm.attachmentRemarkPath =
            info.file.response.remarkFilePath;
        } else {
          showToast("warning", info.file.name + " 上传失败.");
        }
      } else if (info.file.status === "error") {
        showToast("warning", info.file.name + " 上传失败.");
      }
    },

    // 表单验证
    async submitForm(callback) {
      return new Promise((resolve, reject) => {
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            resolve();
          } else {
            console.log("error submit!!");
            reject();
          }
        });
      });
    }
  },
  watch: {
    // 监听表单字段输入
    ruleForm: {
      handler: function(v) {
        console.log(v);
        this.$emit("change", v);
      },
      deep: true
    },

    // 监听根组件传来的data
    model(val) {
      console.log(val);
      this.ruleForm = val || {};
    },

    // 初始化日期
    rangeTime: {
      handler: function(v) {
        Vue.set(
          this.ruleForm,
          "saleTimeStart",
          formatTime(v[0] ? v[0] : new Date(), "{y}-{m}-{d} {h}:{i}:{s}")
        );
        Vue.set(
          this.ruleForm,
          "saleTimeEnd",
          formatTime(v[1] ? v[1] : new Date(), "{y}-{m}-{d} {h}:{i}:{s}")
        );
      },
      deep: true
      // immediate: true
    },

    // // 日期格式
    // presellTime(val) {
    //   Vue.set(
    //     this.ruleForm,
    //     "presellTime",
    //     formatTime(~~val ? val : new Date(), "{y}-{m}-{d} {h}:{i}:{s}")
    //   );
    // },

    rangeTimeIS(val) {
      this.rangeTime = val;
    },

    // "ruleForm.presellTime"(val) {
    //   this.presellTime = val;
    // },

    // 绑定动态字段
    renderedField: {
      immediate: true,
      handler: function(val) {
        console.log(val);
        this.inputArrs = val.inputArrs;
        this.variants = val.variants;
        this.rules = val.vali;
      }
    }
  },
  computed: {
    rangeTimeIS() {
      return [this.ruleForm.saleTimeStart, this.ruleForm.saleTimeEnd];
    },

    // 获取动态字段
    renderedField() {
      return this.$attrs.formatField.remarkTabFied;
    },

    // 找到需要渲染的字段
    showField() {
      // 如果是母体
      if (this.$attrs.isParent) {
        return this.inputArrs.map(el => el.displayKey);
      } else {
        return this.variants.map(el => el.displayKey);
      }
    }
  }
};
</script>

<style lang="less">
.remark {
  .ant-form-inline .ant-form-item {
    margin-bottom: 24px;
  }
}
.vue-tabs .tab-content .tab-container .product_box.ant-card .ant-card-body {
  height: calc(100% - 115px);
}
.remark {
  .ant-upload-list {
    display: none;
  }
}
</style>
