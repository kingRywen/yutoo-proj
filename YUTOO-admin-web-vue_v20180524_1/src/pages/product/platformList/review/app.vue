<template>
  <div>
    {{ruleForm}}
    <div style="height:100%">

      <!-- 平台信息，图片 -->
      <vue-tabs ref="tab" style="height:100%" @tab-change="onTabClick">
        <v-tab v-for="item in tabs" :key="item.title" :title="item.title">
          <keep-alive>
            <component ref="com" :is="name" v-if="name === item.component" :disable="true"></component>
          </keep-alive>
          <v-card v-if="name === 'PlatformInformation'">
            <v-form direction="horizontal" :model="ruleForm" :rules="rules" ref="ruleForm">
              <v-row>
                <v-col span="24">
                  <v-form-item label="审核">
                    <v-radio-group v-model="ruleForm.auditStatus" :data="[{value: 1, text: '未审核'},{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]">
                    </v-radio-group>
                  </v-form-item>
                </v-col>
                <v-col span="24">
                  <v-form-item label="原因">
                    <v-input type="textarea" :autosize="{ minRows: 8 }" placeholder="" v-model="ruleForm.auditReason"></v-input>
                  </v-form-item>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
          <v-card v-if="name === 'Picture'">
            <v-form direction="horizontal" :model="ruleForm1" :rules="rules" ref="ruleForm1">
              <v-row>
                <v-col span="24">
                  <v-form-item label="审核">
                    <v-radio-group v-model="ruleForm1.auditStatus" :data="[{value: 1, text: '未审核'},{value: 2, text: '审核通过'},{value: 3, text: '审核不通过'}]">
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
        </v-tab>
      </vue-tabs>
      <!-- 平台信息，图片 -->

    </div>

    <div class="saveBtn">
      <div style="margin: 0 auto">
        <v-button type="primary" @click.prevent="save">确定</v-button>
        <v-button type="primary" @click.prevent="cancel">取消</v-button>
      </div>
    </div>
  </div>
</template>

<script>
import { fetchData, showModal } from "common/common";
import { getQueryString } from "common/util";
import apis from "apis";

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
    fetchData({
      ...apis.PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
      data: {
        languageIds: [1],
        productPlatformId: +getQueryString("productPlatformId"),
        productPltDetailId: +getQueryString("productPltDetailId")
      }
    }).then(res => {
      console.log(res);
      this.ruleForm = res.data[0];
      this.ruleForm1.productId = this.ruleForm.productId;
      this.ruleForm1.platformId = this.ruleForm.platformId;
      this.ruleForm1.productPlatformId = this.ruleForm.productPlatformId;

      this.ruleForm1.auditType = 2;
    });
  },
  data() {
    return {
      name: "PlatformInformation",
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
    onTabClick(tabIndex, newTab, oldTab) {
      this.name = this.tabs[tabIndex].component;
    },

    cancel() {
      history.go(-1);
    },

    save() {
      if (this.name === "PlatformInformation") {
        fetchData({
          ...apis.PRODUCT_PLT_LANGUAGE_AUDIT_UPDATE,
          data: this.ruleForm
        }).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            showModal("success", "审核成功");
            // history.go(-1);
          } else {
            showModal("error", "审核失败");
          }
        });
      } else {
        fetchData({
          ...apis.PRODUCT_PLT_AUDIT_UPDATE,
          data: this.ruleForm1
        }).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            showModal("success", "审核成功");
            // history.go(-1);
          } else {
            showModal("error", "审核失败");
          }
        });
      }
    }
  }
};
</script>

<style>
</style>
