<template>
  <div>
    <v-form style="margin-bottom:20px">
      <v-form-item>
        <v-button type="primary" @click="download">下载模板</v-button>
      </v-form-item>
      <v-form-item>

        <v-upload class="___upload__importPrice" :action="action" @change="upload" :header="header" :file-list="fileList" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel">
          <v-button type="primary">上传文件</v-button>
        </v-upload>
      </v-form-item>
    </v-form>
    <v-data-table stripe ref="tableFu" :data='loadData' :pageSize="10" rowClickChecked :height="600" :columns='columns' :current-data.sync='tableData'>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='imgURL'">
          <img :src="props.content" :alt="props.column.title" width="80" height="80">
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
    <div class="text-center margin-top-20">
      <v-button type="primary" @click="submit" size="large">提交新的报价</v-button>
    </div>
  </div>
</template>

<script>
import {
  fetchData,
  fixFrameHeight,
  handlerCode,
  downloadFile,
  _storage,
  showToast
} from "common/common";
import { browserType, debounce } from "common/util";
import apis, { GET_REP_OPTIONS, GET_PRODUCT_ACC_V } from "apis";
import { BASE_URL } from "common/config";

export default {
  inheritAttrs: false,
  data() {
    let self = this;
    return {
      action: BASE_URL + "/product/supplier/price/rel/batch/upload",
      header: {
        token: _storage._get('local', 'token')
      },
      upData: [],
      ruleForm: {},
      fileList: [],
      repOptions: [],
      selected: [],
      tableData: [],
      loadData(data) {
        let result = [];
        if (self.upData.length > 0) {
          self.upData.forEach(element => {
            result.push({
              ...element.product,
              ...element.supplierPrice
            });
          });
        }
        return Promise.resolve({
          result
        });
      },
      columns: [
        {
          title: "系统SKU",
          field: "sku"
        },
        {
          title: "自定义sku",
          field: "skuCustom"
        },
        {
          title: "英文名",
          field: "nameEn"
        },
        {
          title: "中文名",
          field: "nameZh"
        },
        {
          title: "供应商ID",
          field: "supplierId"
        },
        {
          title: "供应商SKU",
          field: "supplierSku"
        },
        {
          title: "供应商报价",
          field: "supplierPrice"
        },
        {
          title: "采购运费",
          field: "purchasePrice"
        },
        {
          title: "供应商名称",
          field: "supplierName"
        },
        {
          title: "批发数量",
          field: "wholesaleAmount"
        },
        {
          title: "网络采购地址",
          field: "purchaseLink"
        },
        {
          title: "批发价格",
          field: "wholesalePrice"
        },
        {
          title: "采购天数",
          field: "purchaseTime"
        },
        {
          title: "生产天数",
          field: "produceTime"
        },
        {
          title: "采购运输天数",
          field: "freightTime"
        },
        // {
        //   title: "入库天数",
        //   field: ""
        // },
        {
          title: "备注",
          field: "remark"
        }
        // {
        //   title: "产品停产状态更新",
        //   field: ""
        // },
      ]
    };
  },
  methods: {
    // 确认按钮
    ok() {
      this.$listeners.set(this);
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    download() {
      fetchData({
        ...apis.UPLOAD_TEMPLATE_GET,
        data: {
          // templateType: "supplierPrice",
          ...this.$attrs.data
        }
      }).then(res => {
        downloadFile(res.data.path);
      });
    },
    submit() {
      let vm = this;
      fetchData({
        ...apis.PRODUCT_SUPPLIER_PRICE_UPLOAD_SAVE,
        data: {
          uploadList: this.upData
        }
      }).then(res => {
        handlerCode(res, () => {
          vm.ok();
        });
      });
    },
    upload(info) {
      if (info.file.status !== "uploading") {
        console.log(info.file, info.fileList);
      }
      if (info.file.status === "done") {
        console.log(info.file.name + " 上传成功.");
        info.fileList = info.fileList.slice(info.fileList.length - 1);
        this.fileList = info.fileList;
        let res = {
          data: info.file.response
        };
        console.log(res);
        handlerCode(res, () => {
          this.upData = res.data.rows;
          this.$refs.tableFu.refresh();
        });
      } else if (info.file.status === "error") {
        showToast("error", "上传失败");
        console.log(info.file.name + " 上传失败.");
      }
    }
  }
};
</script>

<style lang="less">
.___upload__importPrice {
  display: flex;
}
</style>
