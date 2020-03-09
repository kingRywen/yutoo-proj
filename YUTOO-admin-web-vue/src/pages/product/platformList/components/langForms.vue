<template>
  <v-spin tip="正在读取数据..." :spinning="spinning" style="height:100%">
    <div class="content">
      <el-steps :active="activeName" simple class="__langForms_step">
        <el-step title="选择分类" icon="el-icon-menu"></el-step>
        <el-step title="填写详细信息" icon="el-icon-edit"></el-step>
        <!-- <el-step title="预览" icon="el-icon-view"></el-step> -->
        <el-step title="提交审核" icon="el-icon-circle-check-outline"></el-step>
      </el-steps>
      <div class="__langForms_step_content">
        <div class="__main">
          <div v-show="activeName == 1" class="__main_box" style="height: auto;">

            <v-card v-for="(item, index) in siteList" :title="item.siteName + '站'" style="margin-bottom:20px;flex:1" noHovering>
              <v-form direction="horizontal">
                <v-form-item label="基础产品类目" :label-col="labelcol" :wrapper-col="wrappercol">
                  <v-input :disabled="true" :value="item.categoryPath && item.categoryPath.replace(/\;/ig, ' > ')"></v-input>
                </v-form-item>
                <v-form-item label="映射类目" :label-col="labelcol" :wrapper-col="wrappercol">
                  <v-input :disabled="true" :value="item.pltCategoryPath && item.pltCategoryPath.replace(/\:/ig, ' > ')"></v-input>
                </v-form-item>
                <v-form-item label="选择类目" :label-col="labelcol" :wrapper-col="wrappercol">
                  <SyncCascader :load="lists" :props="prop" @change="getTemp(item, $event, index)" v-model="item._val" :disabled="$attrs.show" ref="_this"></SyncCascader>
                </v-form-item>
                <v-form-item label="选择模板" :label-col="labelcol" :wrapper-col="wrappercol" v-if="item._val.length">
                  <v-select :data="item._select" size="lg" label="templateNameCh" clue="salePfTemplateId" v-model="item._temp" :disabled="$attrs.show"></v-select>
                </v-form-item>
              </v-form>
            </v-card>
            <div class="btn_wrapper">
              <v-button v-if="showFirstNextBtn && siteList.length" type="primary" @click="toTwo">下一步</v-button>
              <v-button v-if="showFirstNextBtn && siteList.length && !isshow" type="primary" @click="save(0)" :loading="saveLoading">保存</v-button>
            </div>

          </div>
          <div v-show="activeName == 2" class="__name_2_box">
            <el-tabs ref="tab" type="card" v-model="tabsName" class="product_box" style="padding-bottom: 0;">
              <el-tab-pane v-for="(data, key, index) in secondData" :label="descMap[key]" :key="key" :name="index + ''" style="flex:1">
                <PurchaseInputNew direction="horizontal" :rules="rules" :data="data" :labelcol="{span:6}" :wrappercol="{span:14}" :bind-field="bindField" :mappingFieldData="mappingFieldData" ref="purchaseinput" :variantDataList="variantDataList" :name="key" :disabled="$attrs.show"></PurchaseInputNew>
              </el-tab-pane>
            </el-tabs>
            <div class="btn_wrapper">
              <v-button v-if="showFirstNextBtn" type="primary" @click="prev">上一步</v-button>
              <v-button v-if="showFirstNextBtn" type="primary" @click="next">下一步</v-button>
              <v-button v-if="showFirstNextBtn && !isshow" type="primary" @click="save(0)" :loading="saveLoading">保存</v-button>
            </div>
          </div>
          <!-- <div v-show="activeName == 3" class="__main_box">
          3
          <div class="btn_wrapper">
            <v-button v-if="showFirstNextBtn" type="primary" @click="activeName = 2">上一步</v-button>
            <v-button v-if="showFirstNextBtn" type="primary" @click="activeName = 4">下一步</v-button>
          </div>
        </div> -->
          <div v-show="activeName == 3" class="__main_box">
            <el-collapse accordion>
              <el-collapse-item v-for="(data, key, index) in secondData" :key="key">
                <template slot="title">
                  {{descMap[key]}}
                  <!-- <el-tooltip placement="top">
                    <div slot="content">
                      123
                    </div>
                    <i class="header-icon el-icon-info"></i>
                  </el-tooltip> -->

                </template>
                <PurchaseInputNew :disabled="true" direction="horizontal" :rules="rules" :data="data" :labelcol="{span:6}" :wrappercol="{span:14}" :bind-field="bindField" :mappingFieldData="mappingFieldData" :variantDataList="variantDataList" :name="key"></PurchaseInputNew>
              </el-collapse-item>
            </el-collapse>
            <div class="btn_wrapper">

              <v-button v-if="showFirstNextBtn" type="primary" @click="activeName = 2">上一步</v-button>
              <v-button v-if="showFirstNextBtn && !isshow" type="primary" @click="save(0)" :loading="saveLoading">保存</v-button>
              <v-button v-if="showFirstNextBtn && !isVariant && !isshow" type="primary" @click="save(1)">提交审核</v-button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </v-spin>
</template>

<script>
import { Steps, Step, Collapse, CollapseItem, Tooltip } from "element-ui";
import Vue from "vue";
import PurchaseInputNew from "components/base/purchaseInputNew";
import {
  handlerCode,
  fetchData,
  showToast,
  showConfirm,
  toParamUrl,
  batchValidForm
} from "common/common";
import { getQueryString, isObj } from "common/util";
import apis from "apis";
import PurchaseInput from "components/base/purchaseInput";
import SyncCascader from "components/base/SyncCascader";

Vue.use(Steps);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Tooltip);
Vue.use(Step);

export default {
  inheritAttrs: false,
  components: {
    PurchaseInputNew,
    SyncCascader,
    PurchaseInput
  },
  created() {
    this.productPltDetailId = +getQueryString("productPltDetailId");
    this.parentProductPltDetailId = +getQueryString("parentProductPltDetailId");
    this.isshow =
      window.location.pathname === "/product/platformList/review.html";
    this.isVariant = getQueryString("variant") == true;
    this.getSiteList();
  },
  data() {
    return {
      saveLoading: false,
      keywords: [],
      tabsName: "0",
      descMap: {},
      mappingFieldData: {},
      productPltVariantDetailList: [],
      variantDataList: [],
      spinning: false,
      activeKey: "0",
      cateVal: [],
      labelcol: { span: 6 },
      wrappercol: { span: 14 },
      prop: {
        label: "categoryName",
        value: "platformCategoryId",
        children: "childs",
        enabled: "haveTemplate"
      },
      bindField: {
        label: "propertyHead",
        value: "value",
        bindval: "propertyName",
        type: "dataType",
        inputType: "controlType",
        required: "mustFlag"
      },
      lists(id) {
        return fetchData({
          ...apis.PRODUCT_PLT_DETAIL_A_EN_CATEGORY,
          data: {
            siteId: 1,
            cateId: id != null ? id[id.length - 1] : -1
          }
        }).then(res => {
          if (res.data.code !== 0) {
            showToast("error", res.data.msg);
            return;
          }
          if (res.data.cates) {
            return res.data.cates.map(el => {
              return {
                ...el,
                childs: el.childCount > 0 ? [] : null
              };
            });
          }
        });
      },
      ruleForm: {},
      rules: {},
      siteList: [],
      activeName: 1,
      firstData: {
        category: {
          label: "亚马逊类别",
          value: "",
          rules: "notEmpty",
          type: 9
        },
        category1: {
          label: "亚马逊类别",
          value: "",
          rules: "notEmpty",
          type: 1
        },
        category2: {
          label: "亚马逊类别",
          value: "",
          rules: "notEmpty",
          type: 1
        }
      },
      secondData: {}
    };
  },
  methods: {
    // 表单验证
    async submitForm() {
      let form = this.$refs.purchaseinput;
      form = form.filter(el => el.$refs.ruleForm.fields.length);
      return await batchValidForm(form, true);
    },
    prev() {
      let len = Object.keys(this.secondData).length;
      if (this.tabsName > 0) {
        this.tabsName = +this.tabsName - 1 + "";
      } else {
        this.activeName = 1;
      }
    },
    async next() {
      let len = Object.keys(this.secondData).length;
      // debugger
      if (this.tabsName < len - 1) {
        const _input = this.$refs.purchaseinput[this.tabsName];

        if (!_input.$refs.ruleForm.fields.length) {
          this.tabsName = +this.tabsName + 1 + "";
          return;
        }
        _input.$refs.ruleForm.validate(valid => {
          if (valid) {
            this.tabsName = +this.tabsName + 1 + "";
          } else {
            showToast("error", "请填写正确的必填项");
          }
        });
      } else {
        let valis = await this.submitForm();
        console.log(valis);
        if (valis.length > 0) {
          showToast("error", "请填写正确的必填项");
          this.tabsName = valis[0] + "";
        } else {
          this.activeName = 3;
        }
      }
    },

    // 验证敏感关键词
    setKeywords(data) {
      let vm = this;
      // let arr = [];
      vm.keywords = [];
      for (const key in data) {
        if (data.hasOwnProperty(key)) {
          const element = data[key];
          if (isObj(element)) {
            vm.setKeywords(element);
          } else {
            vm.keywords.push(element);
            // if (
            //   key === "titleEn" ||
            //   key === "entryNameEn" ||
            //   key === "entryNameZh"
            // ) {
            //   vm.keywords.push(element);
            // }
          }
        }
      }
    },

    async validKeyword(data) {
      this.setKeywords(data);
      let valis = await fetchData({
        ...apis.PRODUCT_KEY_WORD_VERIFY_1,
        data: { word: this.keywords.join(";") }
      });

      if (Object.keys(valis.data).length > 1) {
        let str = ``;
        for (const key in valis.data) {
          if (valis.data.hasOwnProperty(key)) {
            const element = valis.data[key];
            if (key === "code") {
              continue;
            }
            str += "<p>" + key + ": " + element + "</p>";
          }
        }
        return str;
      } else {
        return null;
      }
    },

    async save(commit) {
      let vm = this;
      console.log(commit);
      let api = apis.PRODUCT_PLT_DETAIL_A_EN_SAVE;
      if (commit) {
        api = apis.PRODUCT_PLT_DETAIL_A_EN_COMMIT;
      }
      let data = this.getData();

      let res = await this.validKeyword(data);
      if (res) {
        showConfirm({
          content: `您提交的表单信息中包含 <div class="text-error">${res}</div>是否继续？`,
          title: "警告",
          onOk() {
            vm.save1(data, api, commit);
          }
        });
        return;
      }

      this.save1(data, api, commit);
    },

    save1(data, api, commit) {
      this.spinning = true;
      this.saveLoading = true;
      fetchData({ ...api, data }).then(res => {
        this.saveLoading = false;
        this.spinning = false;
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        showToast("success", res.data.msg);
        if (commit) {
          toParamUrl("/product/platformList.html");
        }
      });
    },
    getData() {
      let vm = this;
      const datas = vm.$refs.purchaseinput
        ? vm.$refs.purchaseinput.map(el => el.ruleForm)
        : [];
      let ret = {
        productPltDetailId: vm.isVariant
          ? vm.parentProductPltDetailId
          : vm.productPltDetailId,
        siteList: [],
        parentDetail: {},
        variantDetailList: []
      };

      vm.siteList.forEach(el => {
        ret.siteList.push({
          ...el.siteInfo,
          templateId: el._temp,
          siteCategoryInfo: el._val.join(",")
        });
      });

      if (datas.length == 0) {
        return ret;
      }

      datas.forEach(element => {
        // debugger
        ret.parentDetail = { ...ret.parentDetail, ...element.parent };
      });
      let el = datas[0].variants;

      for (const key in el) {
        if (el.hasOwnProperty(key)) {
          const element = el[key];
          const productPltVariantDetail = vm.productPltVariantDetailList.find(
            el => el.sku === key
          );
          let productPltDetailId;
          if (productPltVariantDetail) {
            productPltDetailId = productPltVariantDetail.productPltDetailId;
          }
          let data = {};
          datas.forEach(el => {
            data = { ...data, ...el.variants[key] };
          });
          if (productPltDetailId) {
            ret.variantDetailList.push({
              productPltDetailId,
              data
            });
          }
        }
      }

      delete ret.parentDetail.reference;

      return ret;
    },
    secondNext() {
      console.log(this.$refs.tabs);
      if (this.$refs.tabs.activeIndex < Object.keys(this.secondData).length) {
      }
    },
    toTwo() {
      this.getFeild();
    },
    getFeild() {
      let vm = this;
      vm.spinning = true;
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_FIELD,
        data: {
          productPltDetailId: vm.productPltDetailId,
          templateIds: vm.selectedTempId,
          parentFlag: vm.isVariant ? 0 : 1
        }
      }).then(res => {
        vm.spinning = false;
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        vm.spinning = true;

        // 获取保存的数据
        fetchData({
          ...apis.PRODUCT_PLT_DETAIL_DATA,
          data: {
            parentFlag: vm.isVariant ? 0 : 1,
            productPltDetailId: vm.productPltDetailId
          }
        }).then(res1 => {
          vm.spinning = false;
          if (res1.data.code !== 0) {
            showToast("error", res1.data.msg);
            return;
          }

          /* 设置值 */
          const { parentData, variantDataList } = res1.data.rows;
          for (const key in parentData) {
            if (parentData.hasOwnProperty(key)) {
              const element = parentData[key];
              for (const subKey in element) {
                if (element.hasOwnProperty(subKey)) {
                  const subEl = element[subKey];
                  if (subEl == null) {
                    continue;
                  }
                  try {
                    res.data.field[key][subKey].value = subEl;
                  } catch (error) {}
                }
              }
            }
          }

          vm.activeName = 2;
          vm.secondData = res.data.field;
          vm.descMap = res.data.descMap;
          // debugger

          if (vm.isVariant) {
            // debugger
            // let {parent, variants: {}} = res.data.mappingFieldData
            // vm.mappingFieldData = {
            // }
            // vm.variantDataList = variantDataList.find(el => {el.})
          }
          vm.mappingFieldData = res.data.mappingFieldData;
          vm.variantDataList = variantDataList;
        });
      });
    },
    setFeild(list) {
      let ret = {};
      list.forEach(element => {
        ret[element.propertyName] = {
          label: element.propertyName,
          value: element.value,
          // ruleExp: element.dataRanges,
          type: element.dataType,
          required: !!element.mustFlag
        };
      });

      return ret;
    },
    getTemp(item, e, cb) {
      let siteCategoryId;
      console.log(e);
      if (!cb) {
        item._temp = null;
      }

      if (
        Object.prototype.toString.call(e) === "[object Object]" &&
        e.platformCategoryId != null
      ) {
        siteCategoryId = e.platformCategoryId;
      }
      if (
        Object.prototype.toString.call(e) === "[object Array]" &&
        e.length > 0
      ) {
        siteCategoryId = e[e.length - 1];
      }

      if (!siteCategoryId) {
        return;
      }
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_A_EN_MODULE,
        data: {
          siteCategoryId
        }
      }).then(res => {
        console.log(res);
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        item._select = res.data.categoryList;
        if (cb) cb(res);

        // item._select = res.data
      });
    },
    getSiteList() {
      let vm = this;
      fetchData({
        ...apis.PRODUCT_PLT_DETAIL_SITE_INFO,
        data: {
          parentFlag: this.isVariant ? 0 : 1,
          productPltDetailId: this.productPltDetailId
        }
      }).then(res => {
        handlerCode(
          res,
          () => {
            this.siteList = res.data.siteList.map((el, index) => {
              let siteCategoryInfo = el.siteInfo.siteCategoryInfo
                ? el.siteInfo.siteCategoryInfo.split(",").map(el => +el)
                : [].map(el => +el);
              if (el.siteInfo.templateId != null) {
                vm.getTemp(el, siteCategoryInfo, res => {
                  vm.siteList[index]._select = res.data.categoryList;
                });
              }
              return {
                ...el,
                _select: [],
                _val: el.siteInfo.siteCategoryInfo ? siteCategoryInfo : [],
                _temp: el.siteInfo.templateId
              };
            });

            this.productPltVariantDetailList =
              res.data.productPltVariantDetailList;
          },
          null,
          true
        );
      });
    }
  },
  computed: {
    showFirstNextBtn() {
      return !this.siteList.some(el => el._temp == null);
    },
    selectedTempId() {
      return this.siteList.filter(el => el._temp != null).map(el => el._temp);
    }
  }
};
</script>

<style lang="scss" scoped>
.content {
  display: flex;
  flex-direction: column;
  height: 100%;
  .__langForms_step {
    flex: none;
  }
  .__langForms_step_content {
    flex: auto;
    overflow: auto;
    height: 100%;
    .__main {
      padding-top: 20px;
      height: auto;
      overflow: auto;
      flex: auto;
      // box-sizing: content-box;
      display: flex;
      flex-direction: column;
      height: 100%;
      .__name_2_box {
        display: flex;
        height: 100%;
        flex-direction: column;
      }
      .__main_box {
        box-sizing: content-box;
        display: flex;
        flex-direction: column;
        overflow: auto;
        height: 100%;
        flex: auto;
      }
    }
  }
  .btn_wrapper {
    padding: 6px 0;
    margin: 0 auto;
    text-align: center;
    background: #fff;
    border-top: 1px solid #ddd;
    width: 100%;
    padding-top: 20px;
  }
}
</style>
