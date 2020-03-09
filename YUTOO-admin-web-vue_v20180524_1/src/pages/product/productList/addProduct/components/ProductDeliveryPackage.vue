<template>
  <div class="productVariant_wrapper product_accessories" ref="content">
    <v-row>
      <v-col span="24">
        <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="产品发货包材">
          <v-card title=" " class="showCard" @mouseleave.native="changeShow" @mouseenter.native="changeShow">
            <div slot="extra">
              <v-button type="primary" v-if="!$attrs.show" @click="addParts('tableData', 1)">添加</v-button>
              <v-button type="danger" v-if="!$attrs.show" @click="delParts('tableSend', 1)">删除</v-button>
            </div>
            <v-data-table stripe ref="tableSend" :data='sendTableData' :pagination="false" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" :current-data.sync='tableData'>
              <template slot="td" slot-scope="props">
                <div v-if="props.column.field=='edit' && !$attrs.show">
                  <v-button size="small" @click="editNum(props, $event, 'tableData')">修改</v-button>
                </div>
                <div v-else-if="props.column.field=='count'">
                  <dynamicInput type="num" :isInput="props.item.isInput" :text="props.content || 1" @edit="updateNum(props, $event, 'tableData')" @cancel="cancel(props, $event, 'tableData')"></dynamicInput>
                </div>
                <span v-else v-html="props.content"></span>
              </template>
            </v-data-table>
          </v-card>
        </v-form-item>
      </v-col>
      <v-col span="24">
        <v-form-item :label-col="labelCol" :wrapper-col="wrapperCol" label="采购产品包材">
          <v-card title=" " class="showCard" @mouseleave.native="changeShow" @mouseenter.native="changeShow">
            <div slot="extra">
              <v-button type="primary" @click="addParts('tableData1', 2)" v-if="!$attrs.show">添加</v-button>
              <v-button type="danger" @click="delParts('tableBuy', 2)" v-if="!$attrs.show">删除</v-button>
            </div>
            <v-data-table stripe ref="tableBuy" :data='buyTableData' :pagination="false" :columns='buyColumns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" :current-data.sync='tableData1'>
              <template slot="td" slot-scope="props">
                <div v-if="props.column.field=='edit' && !$attrs.show">
                  <v-button size="small" @click="editNum(props, $event, 'tableData1')">修改</v-button>
                </div>
                <div v-else-if="props.column.field=='count'">
                  <dynamicInput type="num" :isInput="props.item.isInput" :text="props.content || 1" @edit="updateNum(props, $event, 'tableData1')" @cancel="cancel(props, $event, 'tableData1')"></dynamicInput>
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
  setData,
  handlerCode,
  showToast
} from "common/common";
import { YT_PRODUCT_FIX, YT_PRODUCT_PACKAGE } from "../../../componentName";
import dynamicInput from "../../../components/dynamicInput.vue";
import { browserType, fixNumber, getQueryString } from "common/util";
import apis from "apis";
export default {
  inheritAttrs: false,
  props: ["productid", "upIndex"],
  created() {
    // 请求初始化数据
    if (!browserType()) {
      this.isIE11 = 20;
    }
  },
  mounted() {
    if (this.$attrs.show) {
      let input = this.$refs.content.querySelectorAll("input,select,textarea");
      input.forEach(el => (el.disabled = true));
    }
  },
  components: {
    dynamicInput
  },
  data() {
    let vm = this;
    return {
      action: "/",

      labelCol: {
        span: 4
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
      sendTableData(pramas) {
        let data = {
          productId: +vm.productid,
          relType: 3
        };
        console.log(vm);
        return fetchData({ ...apis.PRODUCT_VARIANT_REL_LIST, data }).then(
          res => {
            return {
              result: res.data
            };
          }
        );
      },
      buyTableData(pramas) {
        let data = {
          productId: +vm.productid,
          relType: 4
        };
        return fetchData({ ...apis.PRODUCT_VARIANT_REL_LIST, data }).then(
          res => {
            // setTimeout(() => {
            //   fixFrameHeight(0);
            // });
            return {
              result: res.data
            };
          }
        );
      },
      columns: [
        {
          title: "SKU",
          field: "variantSku"
        },
        {
          title: "类型",
          field: "sourceTypeString"
        },
        {
          title: "型号",
          field: "specification"
        },
        {
          title: "规格",
          field: "size"
        },
        {
          title: "价格",
          field: "salePrice"
        },
        {
          title: "备注",
          field: "remark"
        }
      ],
      buyColumns: [
        {
          title: "SKU",
          field: "variantSku"
        },
        {
          title: "类型",
          field: "sourceTypeString"
        },
        {
          title: "型号",
          field: "specification"
        },
        {
          title: "规格",
          field: "size"
        },
        {
          title: "价格",
          field: "salePrice"
        },
        {
          title: "备注",
          field: "remark"
        }
      ]
    };
  },
  methods: {
    changeShow() {
      this.isShow = !this.isShow;
    },

    // 重新请求数据接口
    refresh() {
      this.$refs.tableSend.reload();
      this.$refs.tableBuy.reload();
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
    addParts(name, type) {
      let vm = this;
      showDialog(
        YT_PRODUCT_PACKAGE,
        {
          title: type === 1 ? "选择产品发货包材" : "选择采购产品包材",
          width: 1000
        },
        { selected: false, type: type === 1 ? 3 : 4 },
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(arr) {
            console.log(arr);
            fetchData({
              ...apis.PRODUCT_VARIANT_REL_BATCH_SAVE,
              data: {
                variantIds: [],
                parentIds: [vm.productid], // type发货包材1, 采购包材2
                relType: type === 1 ? 3 : 4,
                relVariant: arr
              }
            }).then(res => {
              console.log(res);
              if (res.data.code === 0) {
                showToast("success", "添加成功");
                vm.$refs[
                  name === "tableData" ? "tableSend" : "tableBuy"
                ].refresh();
              } else {
                showToast("error", "添加失败");
              }
            });
            setTimeout(() => {
              fixFrameHeight(1);
            });
          }
        }
      );
    },

    delParts(ref, type) {
      let vm = this;
      console.log(this.$refs[ref].getCheckedData());
      let data = this.$refs[ref].getCheckedData().map(el => el.variantRelId);
      fetchData({
        ...apis.PRODUCT_VARIANT_REL_REMOVE,
        data: {
          parentFlag: this.$parent.$attrs.parent ? 1 : 0,
          relIds: data,
          relType: type === 1 ? 3 : 4
        }
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", "删除成功");
          this.$refs[ref].refresh();
        }
      });
    },

    delFile() {
      console.log(this.$refs.tableBuy.getCheckedData());
      this.$refs.tableBuy.refresh();
      // 删除配件
    },

    setInput(name, v, e) {
      let updateItem = this[name][v.index];
      updateItem.isInput = true;
      this[name].splice(v.index, 1, updateItem);
    },

    editPropName(v, e) {
      this.setInput("tableData1", v, e);
    },

    editNum(v, e, name) {
      this.setInput(name, v, e);
    },

    // 操作表格数据
    handleTbData(v, props, name) {
      if (!name) {
        name = "tableData1";
      }
      let updateItem = this[name][v.index];
      updateItem.isInput = false;
      for (const key in props) {
        if (props.hasOwnProperty(key)) {
          updateItem[key] = props[key];
        }
      }
      this[name].splice(v.index, 1, updateItem);
    },

    updateName(v, vm) {
      console.log(vm);
      // 请求修改名称
      let data = {};
      fetchData(setData(apis.GET_PRODUCT_AT_UP, data)).then(res => {
        if (!res) {
          return;
        }
        handlerCode(res, () => {
          this.handleTbData(v, { attachmentName: vm.value });
          vm.loading = false;
        });
      });
    },

    updateNum(v, vm, name) {
      console.log(vm);
      // 请求修改数量
      let data = {};
      fetchData(setData(apis.GET_PRODUCT_AT_UP, data)).then(res => {
        if (!res) {
          return;
        }
        handlerCode(res, () => {
          this.handleTbData(v, { num: vm.value }, name);
          vm.loading = false;
        });
      });
    },

    cancel(v, newVal, name) {
      this.handleTbData(v, { attachmentName: newVal }, name);
    },

    open(v) {
      top.open(v.item.attachmentPath);
    },

    // 上传文件
    onChange(info) {
      let file = info.file,
        newFile;
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
        newFile = {
          attachmentName: file.name,
          attachmentPath: "2421",
          fileSize: fixNumber(file.size / 1024, 2),
          vb_dt_checked: true
        };
      }
      if (info.file.status === "done") {
        this.addTableItem(this.tableData1, newFile);
        console.log(info.file.name + " 上传成功.");
      } else if (info.file.status === "error") {
        this.addTableItem(this.tableData1, newFile); //
        console.log(info.file.name + " 上传失败.");
      }
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
      console.log(12312);
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
