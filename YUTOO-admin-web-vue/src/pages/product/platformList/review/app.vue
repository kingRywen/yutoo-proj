<template>
  <div style="height: 100%;">
    <div style="height:100%" class="review____box">
      <!-- 平台信息，图片 -->
      <el-tabs ref="tab" style="height: 100%;" type="border-card" v-model="name" class="review__tabs">
        <el-tab-pane v-for="(item, index) in tabs" :label="item.title" :key="item.title" :name="item.title" lazy>
          <component v-if="item.component" ref="com" :is="item.component" :disable="true" :show="true"></component>
          <div style="height: 100%;" v-else>
            <el-tabs style="height: 100%;" tabPosition="left" type="border-card" v-model="reviewName" lazy>
              <el-tab-pane label="平台信息审核" name="平台信息审核">
                <v-card v-if="reviewName === '平台信息审核'" span="24" style="margin-bottom: 70px;">
                  <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">
                    <v-row>
                      <v-col span="24">
                        <v-form-item label="审核">
                          <v-radio-group v-model="ruleForm.auditStatus" :data="[{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]">
                          </v-radio-group>
                        </v-form-item>
                      </v-col>
                      <v-col>
                        <v-form-item label="原因">
                          <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.auditReason"></v-input>
                        </v-form-item>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card>
              </el-tab-pane>
              <el-tab-pane label="图片信息审核" name="图片信息审核">
                <v-card v-if="reviewName === '图片信息审核'" style="margin-bottom: 70px;">
                  <v-form direction="horizontal" :model="ruleForm1" :rules="rules" ref="ruleForm1">
                    <v-row>
                      <v-col span="24">
                        <v-form-item label="审核">
                          <v-radio-group v-model="ruleForm1.auditStatus" :data="[{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]">
                          </v-radio-group>
                        </v-form-item>
                      </v-col>
                      <v-col span="24">
                        <v-form-item label="原因">
                          <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm1.auditReason"></v-input>
                        </v-form-item>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card>
              </el-tab-pane>
            </el-tabs>
          </div>

          <!-- <v-card v-if="name === '平台信息'" span="24" style="margin-bottom: 70px;">
            <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">
              <v-row>
                <v-col span="24">
                  <v-form-item label="审核">
                    <v-radio-group v-model="ruleForm.auditStatus" :data="[{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]">
                    </v-radio-group>
                  </v-form-item>
                </v-col>
                <v-col>
                  <v-form-item label="原因">
                    <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.auditReason"></v-input>
                  </v-form-item>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
          <v-card v-else style="margin-bottom: 70px;">
            <v-form direction="horizontal" :model="ruleForm1" :rules="rules" ref="ruleForm1">
              <v-row>
                <v-col span="24">
                  <v-form-item label="审核">
                    <v-radio-group v-model="ruleForm1.auditStatus" :data="[{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]">
                    </v-radio-group>
                  </v-form-item>
                </v-col>
                <v-col span="24">
                  <v-form-item label="原因">
                    <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm1.auditReason"></v-input>
                  </v-form-item>
                </v-col>
              </v-row>
            </v-form>
          </v-card> -->
        </el-tab-pane>
      </el-tabs>

    </div>

    <div v-if="name === '审核'" class="saveBtn" style="left: 0 !important">
      <div style="margin: 0 auto">
        <v-button type="primary" @click.prevent="save">确定</v-button>
        <v-button type="primary" @click.prevent="cancel">取消</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { Tabs, TabPane } from "element-ui";
import { fetchData, showToast } from "common/common";
import { getQueryString } from "common/util";
import apis from "apis";

Vue.use(Tabs);
Vue.use(TabPane);

// 异步组件
const PlatformInformation = () =>
  import("../components/PlatformInformation.vue").then(m => m.default);
const Picture = () => import("../components/picture.vue").then(m => m.default);

export default {
  components: {
    PlatformInformation,
    Picture
  },

  created() {
    /* 判断显示哪个页面 */
    this.name = '审核'
    if (getQueryString("tab") == 1) {
      this.reviewName = "平台信息审核";
    } else {
      this.reviewName = "图片信息审核";
    }

    fetchData({
      ...apis.PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
      data: {
        languageIds: [1],
        productPlatformId: +getQueryString("productPlatformId"),
        productPltDetailId: +getQueryString("productPltDetailId")
      }
    }).then(res => {
      console.log(res);
      this.ruleForm = res.data.EN;
      this.ruleForm1.productId = this.ruleForm.productId;
      this.ruleForm1.platformId = this.ruleForm.platformId;
      this.ruleForm1.productPlatformId = this.ruleForm.productPlatformId;

      this.ruleForm1.auditType = 2;
    });
  },
  data() {
    return {
      reviewName: "平台信息审核",
      name: "平台信息",
      tabs: [
        {
          title: "平台信息",
          component: "PlatformInformation",
          dataName: "f"
        },
        {
          title: "图片",
          component: "Picture",
          dataName: "w"
        },
        {
          title: "审核",
          dataName: "r"
        }
      ],

      ruleForm: {},
      ruleForm1: {},
      rules: {},

      // 获取到的语种审核信息
      reviewData: []
    };
  },
  methods: {
    cancel() {
      history.go(-1);
    },

    save() {
      // debugger
      if (this.reviewName === "平台信息审核") {
        fetchData({
          ...apis.PRODUCT_PLT_LANGUAGE_AUDIT_UPDATE,
          data: this.ruleForm
        }).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            showToast("success", "审核成功");
            top.location.href = "/product.html#/product/platformList.html";
            // history.go(-1);
          } else {
            showToast("error", "审核失败");
          }
        });
      } else {
        fetchData({
          ...apis.PRODUCT_PLT_AUDIT_IMG_UPDATE,
          data: this.ruleForm1
        }).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            showToast("success", "审核成功");
            top.location.href = "/product.html#/product/platformList.html";
            // history.go(-1);
          } else {
            showToast("error", "审核失败");
          }
        });
      }
    }
  }
};
</script>

<style lang="less">
.review____box {
  & > .el-tabs {
    height: 100%;
    display: flex;
    flex-direction: column;

    .el-tabs__content {
      height: 100%;
      padding-bottom: 50px;
      .el-tab-pane {
        height: 100%;
        .el-tabs--left {
          height: 100%;
          .el-tabs__content {
            overflow: auto;
          }
        }
      }
    }
  }
}
</style>
