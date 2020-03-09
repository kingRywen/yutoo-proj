<template>
  <div class="saleCreate">
    <v-form :model="ruleForm" direction="horizontal" :rules="rules" ref="form">

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="输入网址" prop="websites" required>
        <v-input v-model="ruleForm.websites" type="textarea" placeholder="输入要采集的网址，多个网址换行" :autosize="{minRows:4}"></v-input>
        <p style="line-height: 1.6;
    font-size: 14px;
    margin-top: 10px;
    opacity: 0.7;">系统支持采集以下网址：<br> 速卖通(www.aliexpress.com) , Ebay国际(www.ebay.com) , 亚马逊所有站 , Wish(www.wish.com) , Lazada(www.lazada.com.my)</p>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="指定认领人" prop="claimantId" required>
        <v-select size="lg" v-model="ruleForm.claimantId" :data="options"></v-select>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注" prop="remarks" required>
        <v-input v-model="ruleForm.remarks" type="textarea" :autosize="{minRows:4}"></v-input>
      </v-form-item>

      <v-form-item :wrapper-col="{span:24}">
        <div style="display:flex;justify-content:center">
          <div>
            <v-button type="primary" @click="save">保 存</v-button>
          </div>

        </div>
      </v-form-item>
    </v-form>
  </div>
</template>

<script>
import Vue from "vue";
import { fetchData, showModal, showToast, handlerCode } from "common/common";
import { isURL } from "common/util";
import apis from "apis";

export default {
  data() {
    return {
      options: [],

      // 表单  验证
      ruleForm: {},
      rules: {
        websites: {
          required: true,
          message: "不能为空"
        },
        claimantId: {
          required: true,
          message: "不能为空"
        },
        websites: {
          required: true,
          message: "不能为空"
        }
      },

      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    getUserList() {
      fetchData({ ...apis.DEVELOP_USER_LIST }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          res.data.rows.map(el => {
            el.label = el.nickName;
            el.value = el.userId;
          });
        }
        this.options = res.data.rows;
      });
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },

    ok() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 提交数据
          this.send();
        } else {
          return false;
        }
      });
    },

    send() {
      let vm = this;
      const data = {
        ...this.ruleForm,
        websites: this.ruleForm.websites.replace(/[\n\r]/g, ",")
      };
      fetchData({ ...apis.PRODUCTSRCCOLLECT_SAVE, data }).then(res => {
        console.log(res);
        handlerCode(res, () => {
          this.$listeners.set();
          this.cancel();
        });
      });
    },

    // 保存
    save() {
      this.ok();
    }
  }
};
</script>

<style lang="less">
.saleCreate {
  .el-upload-list {
    position: absolute;
    z-index: 9999;
    right: -170px;
  }
  .el-upload-list--picture-card
    .el-upload-list__item-actions:hover
    span.el-upload-list__item-preview {
    display: none;
  }
  .el-upload-list--picture-card .el-upload-list__item-actions span + span {
    margin-left: 0;
  }
  .ant-input-group-addon {
    padding: 0;
    border: none;
    button {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
    }
  }
  .el-upload--picture-card {
    height: 100%;
    width: 100%;
    border: none;

    input[type="file"] {
      display: none;
    }
  }
}
</style>
