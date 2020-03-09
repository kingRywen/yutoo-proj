<template>
  <div id="components-layout-demo-top-side" class="supplier_add">
    <!-- {{ruleForm}} == {{ ruleForm1}} -->
    <v-layout>
      <yt-header :index="1"></yt-header>
      <v-layout style="flex-direction: row;">
        <v-layout style="padding:24px 24px">
          <v-content>
            <!-- 主体内容开始 -->
            <div>

              <v-card>
                <v-steps :current="current - 1" class="step">
                  <v-step :key="s.index" :title="s.title" v-for="s in steps"></v-step>
                </v-steps>

                <div class="tab_wrapper" v-show="current == 1">
                  <!-- 选择分类 -->
                  <v-form style="width:100%">
                    <v-form-item :label-col="{span:8}" :wrapper-col="{span:9}" label="选择类目" style="width:100%">
                      <el-cascader size='small' :options="options" v-model="ruleForm.categoryIdArry" :props="prop" style="width:100%">
                      </el-cascader>
                    </v-form-item>
                  </v-form>

                  <v-button class="next" type="primary" @click="next(1)">下一步</v-button>
                </div>
                <div class="tab_wrapper" v-show="current == 2">
                  <!-- 填写详细信息 -->
                  <v-form :model="ruleForm1" direction="horizontal" :rules="rules1" ref="ruleForm1">
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="产品中文名称" prop="productNameCn" :required="true">
                      <v-input v-model="ruleForm1.productNameCn"></v-input>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="产品英文名称" prop="productNameEn" :required="true">
                      <v-input v-model="ruleForm1.productNameEn"></v-input>
                    </v-form-item>
                    <div class="group_btn">
                      <v-form-item :label-col="{span:8}" :wrapper-col="{span:16}" label="单个产品尺寸" prop="length">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.length">
                          </v-input-number>
                          <span>（长/cm）</span>
                        </div>

                      </v-form-item>
                      <v-form-item :wrapper-col="{span:24}" prop="wide">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.wide">
                          </v-input-number>
                          <span>（宽/cm）</span>
                        </div>

                      </v-form-item>
                      <v-form-item :wrapper-col="{span:24}" prop="high">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.high">
                          </v-input-number>
                          <span>（高/cm）</span>
                        </div>

                      </v-form-item>
                    </div>
                    <div class="group_btn">
                      <v-form-item :label-col="{span:8}" :wrapper-col="{span:16}" label="外箱包装尺寸" prop="packageLong">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.packageLong">
                          </v-input-number>
                          <span>（长/cm）</span>
                        </div>

                      </v-form-item>
                      <v-form-item :wrapper-col="{span:24}" prop="packageWide">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.packageWide">
                          </v-input-number>
                          <span>（宽/cm）</span>
                        </div>

                      </v-form-item>
                      <v-form-item :wrapper-col="{span:24}" prop="packageHigh">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.packageHigh">
                          </v-input-number>
                          <span>（高/cm）</span>
                        </div>

                      </v-form-item>
                    </div>
                    <div class="group_btn">
                      <v-form-item :label-col="{span:8}" :wrapper-col="{span:16}" label="单个产品重量" prop="grossWeight" :required="true">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.grossWeight">
                          </v-input-number>
                          <span>（毛重/g）</span>
                        </div>

                      </v-form-item>
                      <v-form-item :wrapper-col="{span:24}" prop="netWeight">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.netWeight">
                          </v-input-number>
                          <span>（净重/g）</span>
                        </div>

                      </v-form-item>
                      <v-form-item :wrapper-col="{span:24}" prop="packageWeight">
                        <div class="num-box">
                          <v-input-number size="large" :min="1" v-model="ruleForm1.packageWeight">
                          </v-input-number>
                          <span>（包裹重量/g）</span>
                        </div>

                      </v-form-item>
                    </div>

                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="产品单位" prop="productUnit">
                      <v-select size="lg" v-model="ruleForm1.productUnit" :data="unitOpts"></v-select>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="交货期限" prop="deliveryTerm">
                      <div class="num-box">
                        <v-input-number v-model.number="ruleForm1.deliveryTerm" size="large" :min="1"></v-input-number>
                        <span>天</span>
                      </div>
                      <!-- <v-input v-model.number="ruleForm1.deliveryTerm">
                        <span slot="after">天</span>
                      </v-input> -->
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="交货时间类型" prop="deliveryTimeType">
                      <v-radio-group v-model="ruleForm1.deliveryTimeType" :data="[{value: 1, text: '任何时间可送货'},{value: 2, text: '工作日（周一至周五）送货'},{value: 3, text: '周一至周六送货'}]">
                      </v-radio-group>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="采购价" prop="spurchasePrice" :required="true">
                      <v-input-number style="width:100%" v-model.number="ruleForm1.spurchasePrice" :min="1" size="large"></v-input-number>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="运费" prop="freight">
                      <v-input-number :min="1" style="width:100%" v-model.number="ruleForm1.freight" size="large"></v-input-number>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="货源" prop="source">
                      <v-radio-group v-model="ruleForm1.source" :data="[{value: 1, text: '市场采购'},{value: 2, text: '网络采购'},{value: 3, text: '工厂采购'}]">
                      </v-radio-group>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="产品描述" prop="productDesc">
                      <v-input v-model="ruleForm1.productDesc" type="textarea" :autosize="{minRows:6}"></v-input>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="备注" prop="remarks">
                      <v-input v-model="ruleForm1.remarks"></v-input>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="参考网站" prop="referenceWebsite">
                      <v-input v-model="ruleForm1.referenceWebsite"></v-input>
                    </v-form-item>
                    <v-form-item class="upload" :label-col="{span:3}" :wrapper-col="{span:21}" label="上传附件" prop="enclosure">
                      <el-upload style="width:100%" :auto-upload="false" action="" list-type="text" :on-change="handleChange" :on-remove="handleRemove" :file-list="fileList">
                        <v-input style="width:100%" slot="trigger" :value="fileList[0] && fileList[0].name">
                          <v-button slot="after" type="primary">上传文件</v-button>
                        </v-input>

                      </el-upload>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="产品侵权风险" prop="risk">
                      <v-radio-group v-model="ruleForm1.risk" :data="[{value: 3, text: '未选择'},{value: 2, text: '非仿牌'},{value: 1, text: '仿牌'}]">
                      </v-radio-group>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="物流属性" prop="logisticsProperty">
                      <v-select v-model="ruleForm1.logisticsProperty" :data="logisticsPropertyOpt"></v-select>
                    </v-form-item>
                    <v-form-item :label-col="{span:3}" :wrapper-col="{span:21}" label="是否有强电插头" prop="plugFlag">
                      <v-switch v-model="ruleForm1.plugFlag" :true-value="1" :false-value="0"></v-switch>
                    </v-form-item>
                    <v-form-item v-show="ruleForm1.plugFlag" :label-col="{span:3}" :wrapper-col="{span:21}" label="强电插头" prop="plugSpec">
                      <!-- <v-radio-group v-model="ruleForm1.plugSpec" :data="plugSpecOpt">
                      </v-radio-group> -->
                      <el-radio-group v-model="ruleForm1.plugSpec" class="div-radio-group">
                        <el-radio v-for="opt in plugSpecOpt" :label="opt.value">{{opt.text}}</el-radio>
                      </el-radio-group>
                    </v-form-item>

                  </v-form>

                  <v-button type="primary" class="next" @click="next(2)">下一步</v-button>
                </div>
                <div class="tab_wrapper" v-show="current == 3">
                  <!-- 选择分类 -->
                  <uploadImg :show-upload="true" :has-img="imgList" ref="upload"></uploadImg>
                  <v-button type="primary" class="next" @click="next(3)">下一步</v-button>
                </div>
                <div class="tab_wrapper" v-show="current == 4">
                  <!-- 选择分类 -->

                  <v-button type="primary" class="next" @click="done" :loading="loadingBtn">{{loadingBtn ? '正在提交' : '提交审核'}}</v-button>
                </div>
              </v-card>

            </div>
          </v-content>
        </v-layout>
      </v-layout>
    </v-layout>
  </div>
</template>

<script>
import Vue from "vue";
import { Upload, Cascader, Radio, RadioGroup } from "element-ui";
import uploadImg from "components/base/uploadImg";
import ytHeader from "components/layout/header.vue";
import { fetchData, handlerCode, showToast, showConfirm } from "common/common";
import { getQueryString } from "common/util";
import apis from "apis";

Vue.use(Cascader);
Vue.use(Upload);
Vue.use(Radio);
Vue.use(RadioGroup);

export default {
  name: "WarehousingLogisticsManagement",
  components: {
    ytHeader,
    Upload,
    Cascader,
    uploadImg
  },
  created() {
    // this.getEnumList();
    this.getBaseEnumList();
    // 获取所有类目树
    fetchData({ ...apis.PRODUCT_CATEGORY_LIST, data: {} }).then(res => {
      let vm = this;
      let rows = res.data;
      function removeEmpty(lists) {
        if (lists.childs && lists.childs.length == 0) {
          delete lists.childs;
        } else {
          lists.childs.forEach(el => {
            removeEmpty(el);
          });
        }
      }
      removeEmpty(rows);
      this.options = [rows];
    });
    let id = +getQueryString("id");
    if (id) {
      // 编辑模式，请求数据
      this.getEditData(id);
    }
  },
  data: function() {
    return {
      imgList: [],
      fileList: [],
      loadingBtn: false,
      unitOpts: [],
      logisticsPropertyOpt: [],
      plugSpecOpt: [],
      ruleForm: {},
      ruleForm1: {
        grossWeight: "",
        deliveryTerm: "",
        netWeight: "",
        packageWeight: "",
        spurchasePrice: "",
        freight: "",
        packageHigh: "",
        packageWide: "",
        packageLong: "",
        high: "",
        wide: "",
        length: ""
      },
      rules1: {
        productNameCn: {
          required: true,
          message: "不能为空"
        },
        spurchasePrice: {
          required: true,
          message: "不能为空"
        },
        grossWeight: {
          required: true,
          message: "不能为空"
        },
        productNameEn: {
          required: true,
          message: "不能为空"
        }
      },
      current: 1,
      steps: [
        {
          title: "选择分类",
          index: 0
        },
        {
          title: "填写详细信息",
          index: 1
        },
        {
          title: "上传图片",
          index: 2
        },
        {
          title: "提交审核",
          index: 3
        }
      ],
      prop: {
        value: "categoryId",
        label: "nameCn",
        children: "childs"
      },
      mainMenu: [
        {
          icon: "desktop",
          name: "我的工作台",
          href: "/admin.html"
        },
        {
          icon: "appstore",
          name: "产品库中心",
          href: "/product.html#/product/productList.html"
        },
        {
          icon: "rocket",
          name: "仓储物流管理",
          href: "/WarehousingLogisticsManagement.html"
        },
        {
          icon: "shop",
          name: "销售管理"
        },
        {
          icon: "customer-service",
          name: "CRM客服管理"
        },
        {
          icon: "setting",
          name: "系统管理"
        },
        {
          icon: "pay-circle-o",
          name: "财务管理"
        },
        {
          icon: "area-chart",
          name: "报告中心"
        }
      ],

      options: []
    };
  },
  methods: {
    getEditData(data) {
      fetchData({
        ...apis.PRODSRCSUPPLIER_INFO,
        data: { prodSrcSupplierId: data }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast("error", "获取信息失败");
        } else {
          // 渲染数据
          console.log(res.data);
          let { prodSrcSupplier, limg } = res.data.rows;
          this.ruleForm.categoryIdArry = JSON.parse(
            prodSrcSupplier.categoryIdArry
          );

          this.ruleForm1 = prodSrcSupplier;
          if (this.plugSpecOpt.length == 0) {
            setTimeout(() => {
              this.ruleForm1.plugSpec = 1;
            }, 1500);
          }

          this.imgList = limg.map(el => ({
            remark:
              el.imgRemarks === "undefined" || el.imgRemarks == undefined
                ? null
                : el.imgRemarks,
            name: el.imgName,
            size: (el.imgSize / 1024).toFixed(2),
            imgM: el.imgMUrl,
            manFlag: el.isMaster
          }));
        }
      });
    },

    // 获取下拉，单选，多选选项
    getBaseEnumList() {
      fetchData({
        ...apis.PRODUCT_BASE_ENUM,
        data: {}
      }).then(res => {
        let ress = res.data;
        delete ress.code;
        console.log("获取下拉，单选，多选选项", ress);
        this.unitOpts = ress.unitList.map(el => ({
          label: el.value,
          value: el.key
        }));

        this.plugSpecOpt = ress.plugTypeList.map(el => ({
          text: el.value,
          value: el.key
        }));
        this.logisticsPropertyOpt = ress.logisticList.map(el => ({
          label: el.value,
          value: el.key
        }));
      });
    },

    addNew() {},
    batchSubmissionAudit() {},
    next(type) {
      if (this.current < this.steps.length) {
        if (type === 1) {
          // 第一步
          if (!this.ruleForm.categoryIdArry) {
            showToast("info", "请选择类目");
            return;
          } else {
            this.current++;
          }
        }

        if (type === 2) {
          // 第二步
          this.$refs.ruleForm1.validate(valid => {
            if (!valid) {
              showToast("info", "请填写必填项");
            } else {
              this.current++;
            }
          });
        }

        if (type === 3) {
          // 第二步
          if (this.$refs.upload.files.length === 0) {
            123;
            showToast("info", "必须上传图片");
          } else {
            this.current++;
          }
        }
      } else {
        this.current = 1;
      }
    },

    done() {
      this.loadingBtn = true;
      console.log("object");
      let data = new FormData();
      // 类目Id
      if (this.ruleForm.categoryIdArry) {
        data.append(
          "categoryId",
          this.ruleForm.categoryIdArry[this.ruleForm.categoryIdArry.length - 1]
        );
        if (
          Object.prototype.toString.call(this.ruleForm.categoryIdArry) ===
          "[object Array]"
        ) {
          data.append("categoryIdArry", this.ruleForm.categoryIdArry);
        } else {
          data.append(
            "categoryIdArry",
            this.ruleForm.categoryIdArry.split(",")
          );
        }

        let name = document
          .querySelectorAll(".el-cascader__label")[0]
          .innerText.replace(/(\n|\r|\b|\s)/g, "")
          .replace(/\//g, " / ");
        data.append("categoryNameArry", name);
      } else {
        showToast("error", "请填写类目");
      }

      for (const key in this.ruleForm1) {
        if (key === "categoryIdArry") {
          continue;
        }
        if (this.ruleForm1.hasOwnProperty(key)) {
          const element = this.ruleForm1[key];
          data.append(key, element);
        }
      }

      if (this.fileList[0]) {
        data.append("file", this.fileList[0].file);
      } else {
        // showToast("error", "请上传附件");
      }

      let files = this.$refs.upload.files;
      let mainFlag = this.$refs.upload.radio;
      console.log(files);
      if (files[0]) {
        files.forEach((el, index) => {
          if (index === mainFlag) {
            data.append("isMaster", 1);
          } else {
            data.append("isMaster", 0);
          }
          data.append("imgRemarks", el.remark);
          data.append("images", el.file);
        });
      }

      fetchData({ ...apis.PRODSRCSUPPLIER_SAVE, data }).then(res => {
        this.loadingBtn = false;
        if (res.data.code === 0) {
          window.location.href = "/supplier.html";
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = [];
    },

    // 传输多个文件
    handleExceed(files, fileList) {
      console.log(files, fileList);
    },

    handleChange(file, fileList) {
      if (fileList.length === 0) {
        this.ruleForm1.imageUrl = "";
      } else {
        let _file = fileList[fileList.length - 1];
        console.log(file, fileList);
        this.fileList = [_file];
      }
    }
  }
};
</script>

<style lang="less">
#components-layout-demo-top-side {
  background: #ececec;
  .ant-card {
    margin-bottom: 20px;
  }
  .logo {
    width: 120px;
    height: 48px;
    background: #333;
    border-radius: 6px;
    margin: 16px 28px 16px 0;
    float: left;
  }
}

.supplier_add {
  .step {
    width: 800px;
    margin: 0 auto;
  }
  .tab_wrapper {
    .upload .ant-input-group-addon {
      border: 0;
      padding: 0;
    }
    margin: 120px 0;
    // text-align: center;
    .group_btn {
      display: flex;
      .ant-form-item {
        flex: auto;
        padding: 0 12px;
      }

      .ant-form-item-control {
        .num-box {
          text-align: left;
          display: flex;
          .ant-input-number-lg {
            width: 100% !important;
          }
          span {
            white-space: nowrap;
          }
        }
      }
    }
    .next {
      margin: 0 auto;
      margin-top: 60px;
      display: block;
    }
  }
  .el-upload {
    width: 100%;
  }
  .el-upload-list {
    position: absolute;
    z-index: 9999;
    right: -170px;
  }
  .ant-form-item-control {
    text-align: left;
  }
  .upload {
    .el-upload--text .el-upload__input {
      display: none;
    }
    .el-upload-list--text {
      display: none;
    }
  }
}
</style>