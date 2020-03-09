<template>
  <div class="________saleCreate">
    <!-- {{ruleForm}} -->
    <v-form :model="ruleForm" direction="horizontal" :rules="rules" ref="form">

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品名称" prop="productName" required>
        <v-input :disabled="$attrs.edit == 2" v-model="ruleForm.productName"></v-input>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品图片" prop="imageUrl" required>
        <!-- <v-input v-model="ruleForm.imageUrl"></v-input> -->
        <el-upload :disabled="$attrs.edit == 2" :auto-upload="false" action="/" accept="image/*" list-type="picture-card" :on-preview="handlePictureCardPreview" :on-change="handleChange" :on-remove="handleRemove" :file-list="fileList">
          <v-input :disabled="$attrs.edit == 2" slot="trigger" v-model="ruleForm.imageUrl">
            <v-button :disabled="$attrs.edit == 2" slot="after" type="primary">上传文件</v-button>
          </v-input>

        </el-upload>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品类目" prop="categoryIdArry">
        <el-cascader :disabled="$attrs.edit == 2" size='small' :options="options" v-model="ruleForm.categoryIdArry" :props="prop" style="width:100%" @change="handleCascaderChange">
        </el-cascader>
      </v-form-item>

      <v-row :gutter="12">
        <v-col span='12'>
          <v-form-item :label-col="{span:12}" :wrapper-col="{span:12}" label="销售平台/站点" prop="platformId">
            <v-select :disabled="$attrs.edit == 2" size='lg' :data="platformList" v-model="ruleForm.platformId"></v-select>
          </v-form-item>
        </v-col>
        <v-col span='12'>
          <v-form-item :wrapper-col="{span:16}" prop="siteId">
            <v-select :disabled="$attrs.edit == 2" size='lg' :data="siteList" v-model="ruleForm.siteId" not-found-content="暂无站点"></v-select>
          </v-form-item>
        </v-col>
      </v-row>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="销售价usd" prop="price" required>
        <v-input :disabled="$attrs.edit == 2" v-model.number="ruleForm.price"></v-input>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="销售价RMB" prop="priceRmb" required>
        <v-input :disabled="$attrs.edit == 2" v-model.number="ruleForm.priceRmb"></v-input>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="目标采购价" prop="targetPrice">
        <v-input :disabled="$attrs.edit == 2" v-model.number="ruleForm.targetPrice"></v-input>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="成本采购价" prop="costPrice">
        <v-input :disabled="$attrs.edit == 2" v-model.number="ruleForm.costPrice"></v-input>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="日销量估算" prop="dailyForecastSales" required>
        <v-input :disabled="$attrs.edit == 2" v-model.number="ruleForm.dailyForecastSales"></v-input>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="参考链接" prop="referenceLink">
        <v-input :disabled="$attrs.edit == 2" v-model="ruleForm.referenceLink">
          <v-button :disabled="$attrs.edit == 2" slot="after" type="primary" @click="handleOpen">打开链接</v-button>
        </v-input>
      </v-form-item>

      <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="备注">
        <v-input :disabled="$attrs.edit == 2" v-model="ruleForm.remark" type="textarea" :autosize="{minRows:4}"></v-input>
      </v-form-item>
      <v-form-item :wrapper-col="{span:24}">
        <div style="display:flex;justify-content:center">
          <div v-if="$attrs.edit != 2">
            <v-button type="primary" @click="save">保 存</v-button>
            <v-button type="primary" @click="submit">提 交</v-button>
          </div>
          <div v-else>
            <v-button type="primary" @click="review">审核</v-button>
          </div>

        </div>
      </v-form-item>
    </v-form>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import Vue from "vue";
import { Upload, Dialog, Cascader } from "element-ui";
import { fetchData, showToast } from "common/common";
import { isURL } from "common/util";
import apis from "apis";

Vue.use(Upload);
Vue.use(Dialog);
Vue.use(Cascader);

export default {
  components: {
    Upload,
    Cascader,
    Dialog
  },
  data() {
    let checkFloat = (rule, value, callback) => {
      if (isNaN(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      dialogImageUrl: "",

      fileList: [],

      platformList: [],
      siteList: [],

      options: [],
      prop: {
        value: "categoryId",
        label: "nameCn",
        children: "childs"
      },
      prop1: {
        value: "nameCn",
        label: "nameCn",
        children: "childs"
      },

      // 表单  验证
      ruleForm: {
        imageUrl: "",
        imageType: 1, // 1上传图片 ， 2网络图片
        flag: 1
      },
      rules: {
        platformId: {
          required: true,
          message: "不能为空"
        },
        siteId: {
          required: true,
          message: "不能为空"
        },
        categoryIdArry: {
          required: true,
          message: "不能为空"
        },
        productName: {
          required: true,
          message: "不能为空"
        },
        imageUrl: [
          {
            required: true,
            message: "不能为空"
          }
        ],
        price: [
          {
            required: true,
            message: "不能为空"
          },
          {
            validator: checkFloat
          }
        ],
        priceRmb: [
          {
            required: true,
            message: "不能为空"
          },
          {
            validator: checkFloat
          }
        ],
        costPrice: [
          {
            required: true,
            message: "不能为空"
          },
          {
            validator: checkFloat
          }
        ],
        targetPrice: [
          {
            required: true,
            message: "不能为空"
          },
          {
            validator: checkFloat
          }
        ],
        dailyForecastSales: [
          {
            type: "integer",
            required: true,
            message: "必须为整数"
          }
        ],
        referenceLink: {
          type: "url",
          required: true,
          message: "请输入正确的url"
        }
      },

      labelCol: { span: 6 },
      wrapperCol: { span: 14 }
    };
  },
  async created() {
    // 编辑进入
    let { props } = this.$attrs;

    this.getPlatform();
    let cate = await this.getCategory();
    if (props) {
      this.getInfo(props.item.sourceId);
    }
    if (cate) {
      console.log(cate);
      function removeEmpty(lists) {
        if (lists.childs && lists.childs.length == 0) {
          delete lists.childs;
        } else {
          lists.childs.forEach(el => {
            removeEmpty(el);
          });
        }
      }
      removeEmpty(cate);
      this.options = [cate];
    }
  },
  methods: {
    getPlatform() {
      fetchData({ ...apis.PLATFORM_LIST, data: {} }).then(res => {
        console.log(res);
        res.data.map(el => {
          el.value = el.platformId;
          el.label = el.name;
        });
        this.platformList = res.data;
      });
    },

    getInfo(id) {
      fetchData({
        ...apis.PRODUCTSRCDEVELOP_INFO,
        data: { sourceId: id }
      }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          let images = [...res.data.rows.images];
          images.forEach(el => {
            el.name = el.imgName;
            el.url = el.imgUrl;
          });
          this.fileList = images;
          this.$nextTick(() => {
            this.ruleForm = {
              ...res.data.rows.object,
              imageUrl: res.data.rows.images[0].imgUrl,
              imageType: 2
            };
          });
        } else {
          showToast("error", "获取基本信息失败");
        }
      });
    },

    getSite(id) {
      fetchData({ ...apis.SITE_LIST, data: { platformId: id } }).then(res => {
        if (res.data.code === 0) {
          console.log(res);
          res.data.rows.map(el => {
            el.value = el.siteId;
            el.label = el.siteNameZh;
          });
          this.siteList = res.data.rows;
          if (res.data.rows.length == 0) {
            delete this.ruleForm.siteId;
          }
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = [];
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },

    // 传输多个文件
    handleExceed(files, fileList) {
      console.log(files, fileList);
    },

    handleChange(file, fileList) {
      this.ruleForm.imageType = 1;
      if (fileList.length === 0) {
        this.ruleForm.imageUrl = "";
      } else {
        let _file = fileList[fileList.length - 1];
        console.log(file, fileList);
        this.fileList = [_file];
      }
    },

    handleCascaderChange(e) {
      console.log(e);
      this.$nextTick(() => {
        let _label = document.querySelectorAll(".el-cascader__label")[0];
        console.log(_label.innerText);
        // this.ruleForm.categoryNameArry = _label.innerText;
        this.$set(this.ruleForm, "categoryNameArry", _label.innerText);
      });
    },

    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },

    ok(type) {
      if (type == 3) {
        // 审核
        this.$listeners.set();
        this.cancel();
        return;
      }
      this.$refs.form.validate(valid => {
        if (valid) {
          // 提交数据
          this.send(type);
        } else {
          return false;
        }
      });
    },

    send(type) {
      let vm = this;
      let data = new FormData();
      let url = apis.PRODUCTSRCDEVELOP_SAVE;

      if (type == 1) {
        this.ruleForm.flag = 1;
      } else {
        this.ruleForm.flag = 2;
      }

      this.ruleForm.categoryId = this.ruleForm.categoryIdArry[
        this.ruleForm.categoryIdArry.length - 1
      ];

      for (const key in this.ruleForm) {
        if (this.ruleForm.hasOwnProperty(key)) {
          const element = this.ruleForm[key];
          data.append(key, element);
        }
      }

      if (!this.$attrs.edit) {
        let file = this.fileList[0].raw;
        data.append("fileupload", file);
      } else {
        if (this.fileList[0] && this.fileList[0].raw) {
          let file = this.fileList[0].raw;
          data.append("fileupload", file);
        }
        url = apis.PRODUCTSRCDEVELOP_UPDATE;
      }

      fetchData({ ...url, data }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          showToast("success", res.data.msg);
          vm.cancel();
          vm.$listeners.set();
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    handleOpen() {
      if (isURL(this.ruleForm.referenceLink)) {
        if (
          this.ruleForm.referenceLink.indexOf("http://") == 0 ||
          this.ruleForm.referenceLink.indexOf("https://") == 0
        ) {
          window.open(this.ruleForm.referenceLink);
        } else {
          window.open("http://" + this.ruleForm.referenceLink);
        }
      } else {
        showToast("error", "请输入正确的url");
      }
    },

    // api
    // 获取类目树
    async getCategory() {
      return await fetchData({ ...apis.PRODUCT_CATEGORY_LIST, data: {} }).then(
        res => res.data
      );
    },

    // 保存
    save() {
      this.ok(1);
    },

    // 审核
    review() {
      this.ok(3);
    },

    // 提交
    submit() {
      this.ok(2);
    }
  },
  watch: {
    fileList(val) {
      this.ruleForm.imageUrl = val[0] ? val[0].name : "";
    },

    "ruleForm.platformId"(val) {
      this.getSite(val);
    }
  }
};
</script>

<style lang="less">
.________saleCreate {
  .el-upload-list {
    position: absolute;
    z-index: 9999;
    right: -170px;
    left: auto;
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
