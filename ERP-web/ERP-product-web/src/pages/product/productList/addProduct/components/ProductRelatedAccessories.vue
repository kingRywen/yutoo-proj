<template>
  <div ref="content" class="productVariant_wrapper product_accessories">
    <v-row>
      <v-col span="24">
        <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品配件">
          <v-card title=" " class="showCard" @mouseleave.native="changeShow" @mouseenter.native="changeShow">
            <div slot="extra">
              <v-button :disabled="$attrs.show" type="primary" v-if="!$attrs.show" @click="addParts">添加</v-button>
              <v-button :disabled="$attrs.show" type="danger" v-if="!$attrs.show" @click="delParts">删除</v-button>
            </div>
            <v-data-table :disabled="$attrs.show" stripe ref="tablePei" :data='loadData' :pagination="false" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" :current-data.sync='tableData'>
            </v-data-table>
          </v-card>
        </v-form-item>
      </v-col>
      <v-col span="24">
        <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品相关附件">
          <v-card title=" " class="showCard" @mouseleave.native="changeShow" @mouseenter.native="changeShow">
            <div slot="extra">
              <v-upload :disabled="$attrs.show" :data="uploadData" :accept="attachmentConfig.accept" :beforeUpload="onUploadRemarkChange" style="display:inline-block" class="noneFileList">
                <v-button :disabled="$attrs.show" type="primary" v-if="!$attrs.show" :loading="loadingFuAddBtn">添加</v-button>
              </v-upload>
              <v-button :disabled="$attrs.show" type="danger" @click="delFile" v-if="!$attrs.show">删除</v-button>
            </div>
            <v-data-table stripe ref="tableFu" :data='loadUploadData' :pagination="false" :columns='uploadColumns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" :current-data.sync='tableData1'>
              <template slot="td" slot-scope="props">
                <div v-if="props.column.field=='edit' && !$attrs.show">
                  <v-button :disabled="$attrs.show" size="small" @click="editPropName(props, $event)">编辑</v-button>
                  <v-button :disabled="$attrs.show" size="small" @click="open(props, $event)">下载附件</v-button>
                </div>
                <div v-else-if="props.column.field=='fileSize'">
                  {{props.content | fixNumber}}KB
                </div>
                <div v-else-if="props.column.field=='attachmentName'">
                  <dynamicInput :disabled="$attrs.show" :isInput="props.item.isInput" :item="props" :text="props.content" @edit="updateName(props, $event)" @cancel="cancel(props, $event)"></dynamicInput>
                </div>
                <span v-else v-html="props.content"></span>
              </template>
            </v-data-table>
          </v-card>
        </v-form-item>
      </v-col>
    </v-row>
  </div>
</template>

<script>
import {
  fetchData,
  fixFrameHeight,
  showDialog,
  showConfirm,
  setData,
  handlerCode,
  uploadFileToOss,
  showToast
} from "common/common";
import { YT_PRODUCT_PACKAGE } from "../../../componentName";
import dynamicInput from "../../../components/dynamicInput.vue";
import { browserType, fixNumber, getQueryString } from "common/util";
import { attachmentConfig } from "common/config";
import apis from "apis";
export default {
  inheritAttrs: false,
  props: ["productId", "upIndex"],
  mounted() {
    if (this.$attrs.show) {
      let input = this.$refs.content.querySelectorAll("input,select,textarea");
      input.forEach(el => (el.disabled = true));
    }
  },
  components: {
    dynamicInput
  },
  created() {
    this.uploadData.productId = this.productId;
    this.uploadData.parentFlag = this.$attrs.parent ? 1 : 0;
    this.isVariant = getQueryString("variant");
  },
  filters: {
    fixNumber(val) {
      return fixNumber(val / 1024, 2);
    }
  },
  data() {
    let vm = this;
    return {
      isVariant: false,
      loadingFuAddBtn: false,
      attachmentConfig: attachmentConfig,
      uploadData: {
        parentFlag: null,
        productId: null
      },

      labelCol: {
        span: 3
      },
      wrapperCol: {
        span: 18
      },

      isShow: false,
      isIE11: 0,

      tableData: [],
      tableData1: [],
      treeOption: {},
      params: {},
      treeOption: {
        isAsync: true,
        idKey: "sku"
      },
      loadData(pramas) {
        let data = {
          productId: vm.productId,
          relType: 1
        };
        return fetchData({ ...apis.PRODUCT_VARIANT_REL_LIST, data }).then(
          res => {
            return {
              result: res.data.rows
            };
          }
        );
      },
      loadUploadData(pramas) {
        return fetchData({
          ...apis.GET_PRODUCT_UPLOAD,
          data: {
            productId: vm.productId
          }
        }).then(res => {
          return {
            result: res.data.rows
          };
        });
      },
      columns: [
        {
          title: "SKU",
          field: "variantSku"
        },
        {
          title: "产品名称",
          field: "variantNameEn"
        },
        {
          title: "产品价格",
          field: "salePrice"
        }
      ],
      uploadColumns: [
        {
          title: "附件名称",
          field: "attachmentName"
        },
        {
          title: "文件大小",
          field: "fileSize"
        },
        {
          title: "操作",
          field: "edit"
        }
      ]
    };
  },
  methods: {
    // 重新请求数据接口
    refresh() {
      console.log("刷新");
      this.$refs.tablePei.reload();
      this.$refs.tableFu.reload();
    },

    changeShow() {
      this.isShow = !this.isShow;
    },
    // 表格
    checkAll: function(value) {
      this.checkAllMsg = "当前全选状态是：" + value;
    },
    clickRow: function(obj) {
      console.log(obj);
      this.clickRowMsg = "当前点击第" + obj.index + "行";
    },
    // 配件操作
    addParts() {
      let vm = this;
      showDialog(
        YT_PRODUCT_PACKAGE,
        { title: "请选择产品配件", width: 1000 },
        { type: 1 },
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(arr) {
            console.log(arr);
            fetchData({
              ...apis.PRODUCT_VARIANT_REL_BATCH_SAVE,
              data: {
                variantIds: [],
                parentIds: [
                  ~~vm.$attrs.parent
                    ? +getQueryString("productId")
                    : vm.productId
                ],
                relType: 1,
                relVariant: arr
              }
            }).then(res => {
              console.log(res);
              if (res.data.code === 0) {
                showToast("success", "添加成功");
                vm.$refs.tablePei.refresh();
                setTimeout(() => {
                  fixFrameHeight(1);
                });
              } else {
                showToast("error", "添加失败");
              }
            });
          }
        },
        true
      );
    },
    // 删除配件
    delParts() {
      console.log(this.$refs.tablePei.getCheckedData());
      let arrs = this.$refs.tablePei.getCheckedData();
      let vm = this;
      console.log(vm.$attrs.parent);
      if (!arrs.length) {
        showToast("info", "请选择一项进行操作");
        return;
      }
      arrs = arrs.map(el => el.productPackageRelId || el.variantRelId);
      showConfirm({
        content: "是否删除？",
        onOk() {
          fetchData({
            ...apis.PRODUCT_VARIANT_REL_REMOVE,
            data: {
              parentFlag: vm.$attrs.parent ? 1 : 0,
              relIds: arrs,
              relType: 1
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", "删除成功");
              vm.$refs.tablePei.refresh();
            } else {
              showToast("error", "删除失败");
            }
          });
        }
      });
    },

    delFile() {
      let vm = this;
      let arrs = this.$refs.tableFu.getCheckedData();
      if (!arrs.length) {
        showToast("info", "请选择一项进行操作");
        return;
      }
      arrs = arrs.map(el => el.productAttachmentId);
      showConfirm({
        content: "是否确认删除？",
        onOk() {
          fetchData({
            ...apis.PRODUCT_ATTACHMENT_REMOVE,
            data: {
              parentFlag: !vm.isVariant ? 1 : 0,
              productAttachmentIds: arrs
            }
          }).then(res => {
            handlerCode(res);
            if (res.data.code === 0) {
              // showToast("success", "删除成功");
              vm.$refs.tableFu.refresh();
            }
          });
        }
      });
    },
    editPropName(v, e) {
      console.log(v, e);
      let updateItem = this.tableData1[v.index];
      updateItem.isInput = true;
      this.tableData1.splice(v.index, 1, updateItem);
    },
    // 操作表格数据
    handleTbData(v, newVal) {
      let updateItem = this.tableData1[v.index];
      updateItem.isInput = false;
      updateItem.attachmentName = newVal;
      this.tableData1.splice(v.index, 1, updateItem);
    },
    updateName(v, vm) {
      console.log(vm);
      // 请求修改
      let data = {
        ...vm.item.item,
        attachmentName: vm.value
      };
      fetchData(setData(apis.GET_PRODUCT_AT_UP, data)).then(res => {
        if (!res) {
          return;
        }
        handlerCode(res, () => {
          this.handleTbData(v, vm.value);
          vm.loading = false;
        });
      });
    },
    cancel(v, newVal) {
      this.handleTbData(v, newVal);
    },
    open(v) {
      top.open(v.item.attachmentPath);
    },
    // 上传文件
    // onChange(info) {
    //   let file = info.file,
    //     newFile;
    //   if (info.file.status !== "uploading") {
    //     console.log(info.file, info.fileList);
    //     newFile = {
    //       attachmentName: file.name,
    //       attachmentPath: "2421",
    //       fileSize: fixNumber(file.size / 1024, 2),
    //       vb_dt_checked: true
    //     };
    //   }
    //   if (info.file.status === "done") {
    //     // this.addTableItem(this.tableData1, newFile);
    //     this.$refs.tableFu.refresh();
    //     console.log(info.file.name + " 上传成功.");
    //   } else if (info.file.status === "error") {
    //     console.log(info.file.name + " 上传失败.");
    //   }
    // },
    // 上传文件前
    onUploadRemarkChange(file) {
      this.loadingFuAddBtn = true;
      let { productId } = this;
      let vm = this;
      let { name, size } = file;
      this.fileToOss(file, (path, dir) => {
        // parentFlag: vm.$attrs.parent ? 1 : 0,
        fetchData({
          ...apis.PRODUCT_ATTACHMENT_SAVE,
          data: {
            productId,
            parentFlag: !vm.isVariant ? 1 : 0,
            attachment: {
              attachmentName: name,
              attachmentPath: dir,
              fileSize: size
            }
          }
        }).then(res => {
          vm.loadingFuAddBtn = false;
          handlerCode(res, () => {
            vm.$refs.tableFu.refresh();
            return false;
          });
        });
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
            cb(res.data.msg, dir);
          } else {
            showToast("error", res.data.msg);
          }
        });
      });
    },

    // 从服务器获取上传的文件夹
    async getUrl() {
      return fetchData({
        ...apis.UPLOAD_REALPATH_GET,
        data: { uploadType: "attachment" }
      }).then(res => {
        if (res.data.code === 0) {
          return res.data.msg;
        }
      });
    },

    // 增加列表项
    addTableItem(target, list) {
      target.push(list);
      setTimeout(() => {
        fixFrameHeight(1);
      });
    }
  },
  watch: {
    upIndex() {
      this.refresh();
    }
  }
};
</script>

<style lang="less">
.product_accessories {
  .showCard {
    .ant-card-body {
      padding: 1px 0;
    }
    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
      padding: 0;
    }
  }
}
.noneFileList {
  .ant-upload-list {
    display: none;
  }
}
</style>
