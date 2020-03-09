<template lang="html">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="form">
      <!-- {{ruleForm.brandLogoImg}} -->
            <div class="flex">
                <el-form-item label="品牌英文名称：" prop="brandNameEn">
                     <el-input size="small" v-model="ruleForm.brandNameEn"/>
                </el-form-item>
                <el-form-item label="品牌中文名称：" prop="brandNameZh">
                     <el-input size="small" v-model="ruleForm.brandNameZh"/>
                </el-form-item>
            </div>

            <div class="flex border">
                <el-form-item label="品牌负责人：" prop="brandResponsible">
                    <el-select size="small" v-model="ruleForm.brandResponsible">
                      <el-option v-for="list in userList" :label="list.username" :value="list.userId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="品牌类型：" prop="brandType">
                    <el-select size="small" v-model="ruleForm.brandType">
                      <el-option label="第三方品牌" :value="1"></el-option>
                      <el-option label="自主品牌" :value="2"></el-option>
                    </el-select>
                </el-form-item>
            </div>

            <el-form-item label="品牌logo：" class="upload-form-item border" required>
              <!-- {{ruleForm.brandLogoImg}} -->
                <el-upload class="upload"
                  ref="upload"
                  accept=".jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.PBG,.GIF,.BMP"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :on-preview="handlePreview"
                  :auto-upload="false"
                  :on-change="handleChange"
                  :multiple="false"
                  :on-remove="handleRemove"
                  :file-list="ruleForm.brandLogoImg"
                  list-type="picture">
                  <el-button size="small" type="primary">选择图片</el-button>
                </el-upload>
            </el-form-item>

            <el-form-item label="类别链接地址：" class="border">
                <el-input size="small" v-model="ruleForm.categoryLinkAddress"/>
            </el-form-item>
            <el-form-item label="页面标题：" class="border">
                <el-input size="small" v-model="ruleForm.pageTitle"/>
            </el-form-item>
            <el-form-item label="页面mate关键词：" class="pageTextarea border">
                <el-input size="small"  type="textarea"  v-model="ruleForm.pageMateKeyword"/>
            </el-form-item>
            <el-form-item label="页面mate描述：" class="pageTextarea border">
                <el-input size="small"  type="textarea"  v-model="ruleForm.pageMateDesc"/>
            </el-form-item>
            <el-form-item label="类别使用的页面模板：" class="border">
                <el-input size="small" v-model="ruleForm.pageModel"/>
            </el-form-item>
            <el-form-item label="品牌详细描述：" class="formTextarea border">
                <el-input size="small"  type="textarea"  v-model="ruleForm.brandDetailDesc"/>
            </el-form-item>
            <el-form-item label="备注：" class="formTextarea border">
                <el-input size="small"  type="textarea"  v-model="ruleForm.remark"/>
            </el-form-item>
            <div class="flex border">
                <el-form-item label="排序：">
                    <el-input size="small" v-model="ruleForm.ranking"/>
                </el-form-item>
                <el-form-item>
                    <el-checkbox v-model="ruleForm.activationFlag" :true-label="1" :false-label="0">是否激活</el-checkbox>
                </el-form-item>
            </div>
        </el-form>
</template>

<script>
import { fetchData, handlerCode, showToast, showConfirm } from "common/common";
import { isObj } from "common/util";
import apis from "apis";

export default {
  props: {
    brandList: {
      type: Array,
      default: () => []
    },
    brandTypeList: {
      type: Array,
      default: () => []
    },
    openDialog: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.getUserList();
  },
  computed: {
    _openDialog: {
      get() {
        this.$nextTick(() => {
          if (this.$refs.ruleForm.hasOwnProperty("resetFields")) {
            this.$refs.ruleForm.resetFields();
          }
        });
        return this.openDialog;
      },
      set(val) {
        this.$emit("dialogCallback", val);
      }
    }
  },
  data() {
    return {
      userList: [],
      keywords: [],
      fileList2: [
        {
          name: "food.jpeg",
          url:
            "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
        }
      ],
      ruleForm: {
        brandLogoImg: [],
        activationFlag: 1
      },
      rules: {
        brandNameEn: [
          {
            required: true,
            message: "请输入英文名称",
            trigger: "blur"
          }
        ],
        brandNameZh: [
          {
            required: true,
            message: "请输入中文名称",
            trigger: "blur"
          }
        ],
        brandResponsible: [
          {
            required: true,
            message: "请输入品牌负责人",
            trigger: "blur"
          }
        ],
        brandType: [
          {
            required: true,
            message: "请输入品牌类型",
            trigger: "blur"
          }
        ],
        logo: [
          {
            type: "array",
            required: true,
            message: "请上传logo",
            trigger: "change"
          }
        ]
      }
    };
  },
  methods: {
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
            if (
              key === "brandNameEn" ||
              key === "brandNameZh" ||
              key === "pageMateKeyword" ||
              key === "pageMateDesc" ||
              key === "brandDetailDesc" ||
              key === "remark" ||
              key === "pageTitle"
            ) {
              vm.keywords.push(element);
            }
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

    async ok() {
      let vm = this;

      if (this.$refs.upload.fileList.length == 0) {
        showToast("error", "请上传品牌logo");
        return;
      }

      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          let res = await vm.validKeyword(vm.ruleForm);
          if (res) {
            showConfirm({
              content: `您提交的表单信息中包含 <div class="text-error">${res}</div>是否继续？`,
              title: "警告",
              onOk() {
                vm.save();
              }
            });
            return;
          }

          this.save();
        }
      });
    },
    save() {
      let vm = this;
      vm.$root.$children[0].asyncConfirmLoading = true;
      let data = new FormData();
      const {
        brandNameEn,
        brandNameZh,
        brandResponsible,
        brandType,
        brandLogoImg,
        categoryLinkAddress,
        pageTitle,
        pageMateKeyword,
        pageMateDesc,
        pageModel,
        brandDetailDesc,
        remark,
        ranking,
        activationFlag
      } = this.ruleForm;

      data.append("brandNameEn", brandNameEn || null);
      data.append("brandNameZh", brandNameZh || null);

      if (brandResponsible) {
        data.append("brandResponsible", brandResponsible);
      }
      if (brandType) {
        data.append("brandType", brandType);
      }

      try {
        data.append("brandLogoImg", vm.$refs.upload.fileList[0].raw);
      } catch (error) {
        data.append("brandLogoImg", null);
      }
      data.append("categoryLinkAddress", categoryLinkAddress || null);
      data.append("pageTitle", pageTitle || null);
      data.append("pageMateKeyword", pageMateKeyword || null);
      data.append("pageMateDesc", pageMateDesc || null);
      data.append("pageModel", pageModel || null);
      data.append("brandDetailDesc", brandDetailDesc || null);
      data.append("remark", remark || null);
      data.append("ranking", ranking || 0);
      data.append("activationFlag", activationFlag);

      fetchData({ ...apis.PRODUCT_BRAND_SAVE, data }).then(res => {
        vm.$root.$children[0].asyncConfirmLoading = false;
        handlerCode(res, () => {
          vm.cancel();
          vm.$listeners.set();
        });
      });
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    getUserList() {
      fetchData({ ...apis.DEVELOP_USER_LIST }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          res.data.rows.map(el => {
            el.label = el.userName || el.username;
            el.value = el.userId;
          });
        }
        this.userList = res.data.rows;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm);
          this.$emit("submitDialogForm", this.ruleForm);
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handleChange(file, fileList) {
      this.$refs.upload.clearFiles();
      this.$refs.upload.fileList = this.ruleForm.brandLogoImg = [file];
    },
    handlePreview(file) {
      console.log(file);
    }
  }
};
</script>

<style lang="scss">
.form {
  height: 500px;
  overflow-y: auto;
  padding: 15px 10px 0 0;
}
.flex {
  display: flex;
  flex-direction: row;
  .el-form-item {
    flex: 1;
    .el-select {
      width: 100%;
    }
  }
}
.pageTextarea {
  .el-textarea__inner {
    height: 60px;
    resize: none;
    overflow-y: auto;
  }
}
.formTextarea {
  .el-textarea__inner {
    height: 130px;
    resize: none;
    overflow-y: auto;
  }
}
.upload-form-item {
  display: flex;
  align-items: center;
  .el-form-item__content {
    margin-left: 0 !important;
    line-height: 100px;
  }
}
.upload {
  display: flex;
  .el-upload {
    margin-right: 10px;
  }
  .el-upload__input {
    display: none;
  }
}
.border {
  border-top: 1px dashed #ccc;
  padding-top: 22px;
}
</style>
