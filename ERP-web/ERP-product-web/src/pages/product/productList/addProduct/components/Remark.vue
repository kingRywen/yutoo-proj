<template>
  <v-spin tip="正在读取数据..." :spinning="spinning" style="height:100%">
    <div v-if="auditDataList">
      <!-- {{ruleForm}} -->
      <v-form :model="ruleForm" direction="horizontal" :rules="rules" ref="ruleForm">

        <v-row v-if="showInputs['presellFlag'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('presellFlag') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'presellFlag' + key">
          <v-col span="24" class="openTab">
            <v-row>
              <v-col span="12">
                <v-form-item class="tips_box" :label-col="{span:8}" :wrapper-col="{span:9}" label="是否预售" :prop="`${key}.presellFlag`" :required="showRequire.indexOf('presellFlag') >= 0" :rules="renderedField.vali['presellFlag']">
                  <v-switch :disabled="$attrs.show" v-model="ruleForm[key+''].presellFlag" @input="setSubVal('presellFlag', $event, index, key)" @blur="handlerBlur('presellFlag', $event, index, key)" :true-value="1" :false-value="0">
                    <span slot="checkedChildren">是</span>
                    <span slot="unCheckedChildren">否</span>
                  </v-switch>
                  <div class="tips" v-if="auditDataList && auditDataList.find(el => el.key === 'presellFlag') && auditDataList.find(el => el.key === 'presellFlag').value">
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content">旧值:<span style="color:red">{{auditDataList.find(el => el.key === 'presellFlag').value}}</span></div>
                      <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                    </el-tooltip>
                  </div>
                </v-form-item>
              </v-col>
              <v-col span="12">
                <v-form-item class="tips_box" :label-col="{span:8}" :wrapper-col="{span:12}" label="预售到货日期" v-if="ruleForm[key+''].presellFlag" :prop="`${key}.presellTime`" :required="showRequire.indexOf('presellTime') >= 0" :rules="renderedField.vali['presellTime']">
                  <el-date-picker :picker-options="pickerOptions" style="width:100%" :disabled="$attrs.show" v-model="ruleForm[key+''].presellTime" size="small" value-format="yyyy-MM-dd HH:mm:ss" type="datetime" placeholder="选择日期时间" @change="$refs.ruleForm.validateField(`${key}.presellTime`)" @input="setSubVal('presellTime', $event, index, key)" @blur="handlerBlur('presellTime', $event, index, key)">
                  </el-date-picker>
                  <div class="tips" v-if="auditDataList && auditDataList.find(el => el.key === 'presellTime') && auditDataList.find(el => el.key === 'presellTime').value">
                    <el-tooltip class="item" effect="light" placement="top">
                      <div slot="content">旧值:<span style="color:red">{{auditDataList.find(el => el.key === 'presellTime').value}}</span></div>
                      <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                    </el-tooltip>
                  </div>
                </v-form-item>
              </v-col>
            </v-row>

          </v-col>
        </v-row>

        <v-row v-if="showInputs['saleTimeStart'] || showInputs['saleTimeEnd'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('saleTimeStart') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'saleTimeStart' + key">
          <v-col span="24" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '出售时间' : item.skuCustom" :required="showRequire.indexOf('saleTimeStart') >= 0" :rules="renderedField.vali['saleTimeStart']" :prop="`${key}.saleTime`">
              <!-- <v-date-picker :disabled="$attrs.show" style="width:100%" range show-time :disabled-date="disabledDate" v-model="ruleForm[key+''].saleTime" @input="setSubVal('saleTime', $event, index, key, item)" @blur="handlerBlur('saleTime', $event, index, key)" clearable>
              </v-date-picker> -->
              <el-date-picker :picker-options="pickerOptions" style="width:100%;max-width:430px" :disabled="$attrs.show" v-model="ruleForm[key+''].saleTime" size="small" value-format="yyyy-MM-dd HH:mm:ss" type="datetimerange" @change="$refs.ruleForm.validateField(`${key}.saleTime`)" start-placeholder="开始日期" end-placeholder="结束日期" @input="setSubVal('saleTime', $event, index, key, item)" @blur="handlerBlur('saleTime', $event, index, key)">
              </el-date-picker>

              <div class="iconBox" @click="toggleTabs('saleTimeStart')" v-if="showField.indexOf('saleTimeStart') === -1">
                <v-icon type="down" v-if="!showInputs['saleTimeStart'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['saleTimeStart'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="auditDataList && auditDataList.find(el => el.key === 'saleTimeStart') && auditDataList.find(el => el.key === 'saleTimeStart').value">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{auditDataList.find(el => el.key === 'saleTimeStart').value}} - {{auditDataList.find(el => el.key === 'saleTimeEnd').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row v-if="showInputs['developRemark'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('developRemark') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'developRemark' + key">
          <v-col span="24" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '开发备注' : item.skuCustom" :prop="`${key}.developRemark`" :required="showRequire.indexOf('developRemark') >= 0" :rules="renderedField.vali['developRemark']">
              <v-input :disabled="$attrs.show" v-model="ruleForm[key+''].developRemark" @input="setSubVal('developRemark', $event, index, key)" @blur="handlerBlur('developRemark', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('developRemark')" v-if="showField.indexOf('developRemark') === -1">
                <v-icon type="down" v-if="!showInputs['developRemark'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['developRemark'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="auditDataList && auditDataList.find(el => el.key === 'developRemark') && auditDataList.find(el => el.key === 'developRemark').value">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{auditDataList.find(el => el.key === 'developRemark').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row v-if="showInputs['purchaseRemark'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('purchaseRemark') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'purchaseRemark' + key">
          <v-col span="24" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '采购备注' : item.skuCustom" :prop="`${key}.purchaseRemark`" :required="showRequire.indexOf('purchaseRemark') >= 0" :rules="renderedField.vali['purchaseRemark']">
              <v-input :disabled="$attrs.show" v-model="ruleForm[key+''].purchaseRemark" @input="setSubVal('purchaseRemark', $event, index, key)" @blur="handlerBlur('purchaseRemark', $event, index, key)"></v-input>
              <div class="iconBox" @click="toggleTabs('purchaseRemark')" v-if="showField.indexOf('purchaseRemark') === -1">
                <v-icon type="down" v-if="!showInputs['purchaseRemark'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['purchaseRemark'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="auditDataList && auditDataList.find(el => el.key === 'purchaseRemark') && auditDataList.find(el => el.key === 'purchaseRemark').value">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{auditDataList.find(el => el.key === 'purchaseRemark').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row v-if="showInputs['packageType'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('packageType') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'packageType' + key">
          <v-col span="24" class="openTab">
            <v-form-item class="tips_box" :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品打包状态' : item.skuCustom" :prop="`${key}.packageType`" :required="showRequire.indexOf('packageType') >= 0" :rules="renderedField.vali['packageType']">
              <v-radio-group :disabled="$attrs.show" :data="[{value: 1, text: '不需打包'},{value: 2, text: '需自行打包'},{value: 3, text: '需供应商打包'}]" v-model="ruleForm[key+''].packageType" @input="setSubVal('packageType', $event, index, key)" @blur="handlerBlur('packageType', $event, index, key)"></v-radio-group>
              <div class="iconBox" @click="toggleTabs('packageType')" v-if="showField.indexOf('packageType') === -1">
                <v-icon type="down" v-if="!showInputs['packageType'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['packageType'] && key ==='main'"></v-icon>
              </div>
              <div class="tips" v-if="auditDataList && auditDataList.find(el => el.key === 'packageType') && auditDataList.find(el => el.key === 'packageType').value">
                <el-tooltip class="item" effect="light" placement="top">
                  <div slot="content">旧值:<span style="color:red">{{auditDataList.find(el => el.key === 'packageType').value}}</span></div>
                  <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                </el-tooltip>
              </div>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row v-if="showInputs['attachmentRemarkPath'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('attachmentRemarkPath') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'attachmentRemarkPath' + key">
          <v-col span="24" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '上传附件' : item.skuCustom" :prop="`${key}.attachmentRemarkPath`" :required="showRequire.indexOf('attachmentRemarkPath') >= 0" :rules="renderedField.vali['attachmentRemarkPath']">
              <v-row :gutter="10">
                <v-col span="24">
                  <v-upload v-if="!$attrs.show" :disabled="$attrs.show" :name="upload.name" :action="upload.action" :beforeUpload="onUploadChange" :header="upload.header" style="width:100%">
                    <v-row :gutter="10">
                      <v-col span="12">
                        <v-input placeholder="点击上传附件" disabled v-model="ruleForm[key+''].attachmentRemarkPath" @input="setSubVal('attachmentRemarkPath', $event, index, key)" @blur="handlerBlur('packageType', $event, index, key)" :value="ruleForm[key+''].attachmentRemarkPath"></v-input>
                      </v-col>
                      <v-col span="12">
                        <v-row :gutter="10">
                          <v-col span="12">
                            <v-button :disabled="$attrs.show" type="primary">
                              <v-icon type="upload"></v-icon>上传附件
                            </v-button>
                          </v-col>
                          <v-col span="12">
                            <v-button :disabled="$attrs.show" type="primary" @click.native="openLink(item.attachmentRemarkPath)">打开附件链接</v-button>
                          </v-col>
                        </v-row>

                      </v-col>
                    </v-row>
                  </v-upload>
                  <div class="tips_box" v-else>
                    <v-input disabled v-model="ruleForm[key+''].attachmentRemarkPath"></v-input>
                    <div class="tips" v-if="auditDataList && auditDataList.find(el => el.key === 'attachmentRemarkPath') && auditDataList.find(el => el.key === 'attachmentRemarkPath').value">
                      <el-tooltip class="item" effect="light" placement="top">
                        <div slot="content">旧值:<span style="color:red">{{auditDataList.find(el => el.key === 'attachmentRemarkPath').value}}</span></div>
                        <v-icon type="clock-circle" style="color:#FFC107"></v-icon>
                      </el-tooltip>
                    </div>
                  </div>

                </v-col>
              </v-row>

              <div class="iconBox" @click="toggleTabs('attachmentRemarkPath')" v-if="showField.indexOf('attachmentRemarkPath') === -1">
                <v-icon type="down" v-if="!showInputs['attachmentRemarkPath'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['attachmentRemarkPath'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row v-if="showInputs['productRemarkPath'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('productRemarkPath') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'productRemarkPath' + key">
          <v-col span="24" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '产品备注' : item.skuCustom" :prop="`${key}.productRemarkPath`" :required="showRequire.indexOf('productRemarkPath') >= 0" :rules="renderedField.vali['productRemarkPath']">
              <!-- <v-input :disabled="$attrs.show" v-model="ruleForm[key+''].productRemarkPath" @input="setSubVal('productRemarkPath', $event, index, key)" @blur="handlerBlur('productRemarkPath', $event, index, key)"></v-input> -->
              <Editor :disabled="$attrs.show" @tooss="getOss($event, 'productRemarkPath')" :defaultMsg="ruleForm[key+''].productRemarkPath" :config=config :init-id="'editor-' + key + index + 'productRemarkPath'" ref="ue" :value="ruleForm[key+''].productRemarkPath" @input="setSubVal('productRemarkPath', $event, index, key, item, true)" @blur="handlerBlur('productRemarkPath', $event, index, key)" />
              <div class="iconBox" @click="toggleTabs('productRemarkPath')" v-if="showField.indexOf('productRemarkPath') === -1">
                <v-icon type="down" v-if="!showInputs['productRemarkPath'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['productRemarkPath'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row v-if="showInputs['imgRemarkPath'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('imgRemarkPath') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'imgRemarkPath' + key">
          <v-col span="24" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '图片处理备注' : item.skuCustom" :prop="`${key}.imgRemarkPath`" :required="showRequire.indexOf('imgRemarkPath') >= 0" :rules="renderedField.vali['imgRemarkPath']">
              <Editor :disabled="$attrs.show" @tooss="getOss($event, 'imgRemarkPath')" :defaultMsg="ruleForm[key+''].imgRemarkPath" :config=config :init-id="'editor-' + key + index + 'imgRemarkPath'" ref="ue" :value="ruleForm[key+''].imgRemarkPath" @input="setSubVal('imgRemarkPath', $event, index, key, item, true)" @blur="handlerBlur('imgRemarkPath', $event, index, key)" />
              <div class="iconBox" @click="toggleTabs('imgRemarkPath')" v-if="showField.indexOf('imgRemarkPath') === -1">
                <v-icon type="down" v-if="!showInputs['imgRemarkPath'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['imgRemarkPath'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row v-if="showInputs['qcRemarkPath'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('qcRemarkPath') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'qcRemarkPath' + key">
          <v-col span="24" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '质检备注' : item.skuCustom" :prop="`${key}.qcRemarkPath`" :required="showRequire.indexOf('qcRemarkPath') >= 0" :rules="renderedField.vali['qcRemarkPath']">
              <Editor :disabled="$attrs.show" @tooss="getOss($event, 'qcRemarkPath')" :defaultMsg="ruleForm[key+''].qcRemarkPath" :config=config :init-id="'editor-' + key + index + 'qcRemarkPath'" ref="ue" :value="ruleForm[key+''].qcRemarkPath" @input="setSubVal('qcRemarkPath', $event, index, key, item, true)" @blur="handlerBlur('qcRemarkPath', $event, index, key)" />
              <div class="iconBox" @click="toggleTabs('qcRemarkPath')" v-if="showField.indexOf('qcRemarkPath') === -1">
                <v-icon type="down" v-if="!showInputs['qcRemarkPath'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['qcRemarkPath'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>
        </v-row>

        <v-row v-if="showInputs['shipmentRemarkPath'] || key ==='main'" v-for="(item, key, index) in (!showField.indexOf('shipmentRemarkPath') === -1 ? {main: ruleForm.main} : ruleForm)" :key="'shipmentRemarkPath' + key">
          <v-col span="24" class="openTab">
            <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" :label="key === 'main' ? '发货打包备注' : item.skuCustom" :prop="`${key}.shipmentRemarkPath`" :required="showRequire.indexOf('shipmentRemarkPath') >= 0" :rules="renderedField.vali['shipmentRemarkPath']">
              <Editor :disabled="$attrs.show" @tooss="getOss($event, 'shipmentRemarkPath')" :defaultMsg="ruleForm[key+''].shipmentRemarkPath" :config=config :init-id="'editor-' + key + index + 'shipmentRemarkPath'" ref="ue" :value="ruleForm[key+''].shipmentRemarkPath" @input="setSubVal('shipmentRemarkPath', $event, index, key, item, true)" @blur="handlerBlur('shipmentRemarkPath', $event, index, key)" />
              <div class="iconBox" @click="toggleTabs('shipmentRemarkPath')" v-if="showField.indexOf('shipmentRemarkPath') === -1">
                <v-icon type="down" v-if="!showInputs['shipmentRemarkPath'] && key ==='main'"></v-icon>
                <v-icon type="up" v-if="showInputs['shipmentRemarkPath'] && key ==='main'"></v-icon>
              </div>
            </v-form-item>
          </v-col>
        </v-row>
      </v-form>
    </div>
  </v-spin>
</template>

<script>
import { showToast, uploadFileToOss, fetchData, _storage } from "common/common";
import { formatTime } from "common/util";
import Vue from "vue";
import Editor from "components/base/editor.vue";
import config from "common/config";
import inputVariant from "components/base/inputVariant.vue";
import apis from "apis";
import { DatePicker } from "element-ui";

Vue.use(DatePicker);
export default {
  inheritAttrs: false,
  props: ["model", "sku", "differ", "auditDataList"],
  components: {
    Editor,
    inputVariant
  },
  data() {
    let vm = this;
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 24 * 3600 * 1000 < Date.now();
        }
      },
      spinning: true,
      showInputs: {},
      defaultMsg: "",
      config: {
        initialFrameWidth: null,
        initialFrameHeight: 350
      },

      rangeTimeRule: [
        {
          type: "date",
          message: "不能选择以前的时间"
        }
      ],

      productRemarkPath: "",

      ruleForm: vm.$attrs.variantForm,

      upload: {
        name: "file",
        // action: config.BASE_URL + apis.PRODUCT_REMARK_UPLOAD.url,
        action: config.BASE_URL + apis.PRODUCT_REMARK_UPLOAD.url,
        header: {
          token: _storage._get("local", "token")
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
    };
  },
  methods: {
    toggleTabs(key) {
      // debugger;
      if (this.showInputs[key]) {
        this.$set(this.showInputs, key, false);
        return;
      }
      this.$set(this.showInputs, key, true);
    },
    setSubVal(k, val, index, keyIndex, item, ueditor) {
      if (index === 0) {
        for (const key in this.ruleForm) {
          if (this.ruleForm.hasOwnProperty(key)) {
            const element = this.ruleForm[key];
            if (val && k === "saleTime") {
              item["saleTimeStart"] = val[0];
              item["saleTimeEnd"] = val[1];
              // if (val[0].split(" ")[1].split(":").length == 3) {
              //   item["saleTimeStart"] = val[0];
              //   item["saleTimeEnd"] = val[1];
              // } else {
              //   item["saleTimeStart"] = val[0] + ":00";
              //   item["saleTimeEnd"] = val[1] + ":00";
              // }
            }

            if (~~val && k === "presellTime") {
              val = formatTime(val, "{y}-{m}-{d} {h}:{i}:{s}");
              this.ruleForm[key]["presellTime"] = val;
            }

            // productRemarkPath imgRemarkPath  qcRemarkPath  shipmentRemarkPath

            if (
              k === "productRemarkPath" ||
              k === "imgRemarkPath" ||
              k === "qcRemarkPath" ||
              k === "shipmentRemarkPath"
            ) {
              this.ruleForm[key][k] = val;
            }

            if (key === "main") {
              continue;
            }
            if (this.ruleForm[key]["edit"]) {
              continue;
            }
            this.ruleForm[key][k] = val;
          }
        }
      } else {
        if (ueditor) {
          item[k] = val;
        }
        if (k === "saleTime") {
          item["saleTimeStart"] = val[0];
          item["saleTimeEnd"] = val[1];
          // if (val[0].split(" ")[1].split(":").length == 3) {
          //   item["saleTimeStart"] = val[0];
          //   item["saleTimeEnd"] = val[1];
          // } else {
          //   item["saleTimeStart"] = val[0] + ":00";
          //   item["saleTimeEnd"] = val[1] + ":00";
          // }
        }
      }
    },

    handlerBlur(k, val, index, keyIndex) {
      if (val === this.ruleForm.main[k]) {
        this.ruleForm[keyIndex + ""]["edit"] = false;
      } else {
        this.ruleForm[keyIndex + ""]["edit"] = true;
      }
    },

    disabledDate(current) {
      return current && current.valueOf() + 24 * 3600 * 1000 < Date.now();
    },
    // 上传oss的附件
    async getOss(file, key) {
      this.fileToOss(file, path => {
        this.productRemarkPath = path;
      });
    },

    // 打开附件链接
    openLink(href) {
      window.open(href);
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

    // 从服务器获取上传的文件夹
    async getUrl() {
      return fetchData({
        ...apis.UPLOAD_REALPATH_GET,
        data: { uploadType: "remark" }
      }).then(res => {
        if (res.data.code === 0) {
          return res.data.msg;
        }
      });
    },

    // 上传附件
    onUploadChange(file) {
      this.fileToOss(file, path => {
        this.$set(this.ruleForm.main, "attachmentRemarkPath", path);
        return false;
      });
    },

    // 传文件到oss
    async fileToOss(file, cb) {
      let dir = await this.getUrl();

      uploadFileToOss(file, dir, key => {
        // 上传成功
        fetchData({
          ...apis.UPLOAD_VISIT_PATH_GET,
          data: { path: key }
        }).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            cb(res.data.msg);
          } else {
            showToast("error", res.data.msg);
          }
        });
      });
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

    // onChange(v) {
    //   let val = formatTime(new Date(v), "{y}-{m}-{d} {h}:{i}:{s}");
    //   this.$set(this.ruleForm, "presellTime", val);
    // }
  },
  watch: {
    // // 监听表单字段输入
    ruleForm: {
      immediate: true,
      handler() {
        this.spinning = false;
      }
    },

    // // 监听根组件传来的data
    // model(val) {
    //   console.log(val);
    //   this.ruleForm = val || {};
    // },

    // // 初始化日期
    // "ruleForm.rangeTime": {
    //   handler: function(v) {
    //     if (!v) {
    //       Vue.set(this.ruleForm, "saleTimeStart", null);
    //       Vue.set(this.ruleForm, "saleTimeEnd", null);
    //       return;
    //     }
    //     Vue.set(
    //       this.ruleForm,
    //       "saleTimeStart",
    //       formatTime(v[0] ? v[0] : null, "{y}-{m}-{d} {h}:{i}:{s}")
    //     );
    //     Vue.set(
    //       this.ruleForm,
    //       "saleTimeEnd",
    //       formatTime(v[1] ? v[1] : null, "{y}-{m}-{d} {h}:{i}:{s}")
    //     );
    //   },
    //   deep: true
    //   // immediate: true
    // },

    // // 日期格式
    // presellTime(val) {
    //   Vue.set(
    //     this.ruleForm,
    //     "presellTime",
    //     val ? formatTime(val, "{y}-{m}-{d} {h}:{i}:{s}") : null
    //   );
    // },

    // rangeTimeIS(val) {
    //   this.ruleForm.rangeTime = val;
    // },

    // "ruleForm.presellTime"(val) {
    //   this.presellTime = formatTime(
    //     val ? val : null,
    //     "{y}-{m}-{d} {h}:{i}:{s}"
    //   );
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
    },

    // 找到需要渲染的字段
    showRequire() {
      // 如果是母体
      if (this.$attrs.isParent) {
        return this.renderedField.inputArrs.map(
          el => el.requireFlag && el.displayKey
        );
      } else {
        return this.renderedField.variants.map(
          el => el.requireFlag && el.displayKey
        );
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

.openTab {
  .__btn {
    width: 33px;
    height: 33px;
    line-height: 33px;
    background: #eee;
    text-align: center;
    margin-left: 8px;
    cursor: pointer;
  }
  .iconBox {
    position: absolute;
    right: -20px;
    top: 0;
    line-height: 33px;
    cursor: pointer;
  }
  .iconBox1 {
    position: absolute;
    right: 47px;
    top: 0;
    line-height: 38px;
    display: block;
    cursor: pointer;
  }
  .hidden__label {
    .ant-form-item-label label {
      visibility: hidden;
      &.fix {
        width: 8%;
      }
    }
  }
  .__inlineInput {
    display: flex;
    margin-bottom: 10px;
    height: 42px;
  }
}
</style>
