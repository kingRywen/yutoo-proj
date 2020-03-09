<template>
  <div>
    <v-form>

      <v-form-item>
        <v-input placeholder="请输入产品名称/供应商/SKU"></v-input>
      </v-form-item>

      <v-form-item>
        <v-select placeholder="开发" size="lg" style="width:100px" notfound="无法找到" :data="[{value: '1', label: '区域1'}, {value: '2', label: '区域2'}]"></v-select>
      </v-form-item>

      <v-form-item>
        <v-select placeholder="采购" size="lg" style="width:100px" notfound="无法找到" :data="[{value: '1', label: '区域1'}, {value: '2', label: '区域2'}]"></v-select>
      </v-form-item>

      <v-form-item>
        <v-select placeholder="状态" size="lg" style="width:100px" notfound="无法找到" :data="[{value: '1', label: '区域1'}, {value: '2', label: '区域2'}]"></v-select>
      </v-form-item>

      <v-form-item>
        <v-date-picker v-model="rangeDate2" range></v-date-picker>
      </v-form-item>

      <v-form-item>
        <v-button type="primary">搜索</v-button>
      </v-form-item>
      <v-form-item>
        <v-button type="primary">统计搜索</v-button>
      </v-form-item>
    </v-form>

    <div class="hr"></div>
    <div style="display:inline">
      <v-button type="primary">批量退回</v-button>
    </div>

    <v-row style="margin-top: 20px;">
      <v-button-group style="width:100%" class="ant-btn-group-tabs">
        <v-button v-for="(item, key) in allBtns" @click="getNewData(item.param)" :key="key">{{item.text}}</v-button>
      </v-button-group>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table stripe :tree-option='treeOption' ref="table" :data='lists' :page-size="pageSize" :page-no="pageNo" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" class="margin-top-25" :current-data.sync='tableData'>
          <template slot="th" slot-scope="props">
            <strong v-if="props.column.field=='album'">操作</strong>
            <strong max-leh v-else v-html="props.title"></strong>
          </template>
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='imgMUrl'">
              <img :src="props.content">
            </div>

            <div v-else-if="props.column.field=='edit'" class="edit-box">
              <div>
                <v-button size="small" type="default" v-if="props.item.productBaseStatus > 5" @click="showReason">查看理由</v-button>

                <v-button size="small" icon="edit" type="primary" v-if="props.item.productBaseStatus == 5 || props.item.productBaseStatus == 3" @click="editItem(props)">编辑</v-button>
                <v-button size="small" icon="edit" type="primary" v-if="props.item.productBaseStatus == 1" @click="editItemBase(props)">基础编辑</v-button>

                <v-button size="small" type="warning" icon="eye-o" v-if="props.item.productBaseStatus == 2" @click="reviewBase(props)">审核</v-button>
                <v-button size="small" type="warning" icon="eye-o" v-if="props.item.productBaseStatus == 4" @click="reviewPhchase(props)">审核</v-button>

                <v-button size="small" icon="plus" type="primary" v-if="props.item.productBaseStatus < 6" @click="copyAdd(props)">复制添加</v-button>

                <v-button size="small" type="error" icon="delete" v-if="props.item.productBaseStatus == 3" @click="delItem(props)">作废</v-button>
              </div>
            </div>
            <span v-else v-html="props.content"></span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import {
  fetchAllData,
  fetchData,
  toUrl,
  fixFrameHeight,
  showDialog
} from "common/common";
import { isArray, debounce, browserType } from "common/util";
import apis, { GET_PRODUCT_SKU_OPTIONS, GET_PRODUCT_ALL_LIST } from "apis";
import ytSimpleSearch from "components/base/simpleSearch";
import {
  YT_SEARCH,
  YT_PRODUCT_SHOW,
  YT_PRODUCT_SHOW_REASON,
  YT_PRODUCT_SHOW_PHCHASE
} from "../componentName";
import router from "common/router";

export default {
  name: "productList",
  components: {
    ytSimpleSearch
  },
  created() {
    console.log(browserType());
    // 请求初始化数据
    if (!browserType()) {
      this.isIE11 = 20;
    }
    this.options = [
      {
        label: "产品SKU",
        value: 1
      },
      {
        label: "自定义SKU",
        value: 2
      }
    ];
    setTimeout(() => {
      fixFrameHeight();
    });
  },
  data() {
    return {
      searchComponent: "ytSimpleSearch",
      lists: data => {
        data.pageNumber = data.pageNo;
        delete data.pageNo;
        let reqData = Object.assign({}, data, this.params);
        delete reqData.sortColumns;

        let opts = Object.assign(
          {},
          { ...apis.PRODSRCSUPPLIER_LIST },
          { data: reqData }
        );

        return fetchData(opts).then(res => {
          let data = res.data;
          if (data && data.rows && isArray(data.rows)) {
            data.rows.forEach((element, i) => {
              element.pid = 0;
            });
          }
          // console.log(data);
          return {
            result: data.rows,
            totalCount: data.total,
            pageSize: data.pageSize,
            pageNo: data.pageNo
          };
        });
      },

      rangeDate2: ["", ""],

      isIE11: null,
      params: {
        // status: 1,
        sortOrder: "asc"
      },
      allBtns: [],
      columns: [
        {
          title: "编号",
          field: "prodSrcSupplierId"
        },
        {
          title: "添加时间",
          field: "createTime"
        },
        {
          title: "产品SKU",
          field: "productSku"
        },
        {
          title: "开发人员",
          field: ""
        },
        {
          title: "采购人员",
          field: ""
        },
        {
          title: "图片",
          field: "imgMUrl"
        },
        {
          title: "产品名称",
          field: "productNameCn"
        },
        {
          title: "供应商名称",
          field: ""
        },
        {
          title: "类目",
          field: "categoryId"
        },
        {
          title: "采购价格",
          field: "spurchasePrice"
        },
        {
          title: "审核状态",
          field: "status"
        },
        {
          title: "操作",
          field: "edit"
        }
      ],
      tableData: [],
      treeOption: {
        isAsync: true,
        idKey: "productId",
        loadChildren: function(pramas) {
          return fetchData({ url: GET_PRODUCT_ALL_LIST, params }).then(res => {
            console.log(res);
            return res.data;
          });
        }
      },
      options: [],
      searchData: "",
      items: [],
      pageNo: 1,
      pageSize: 10
    };
  },
  methods: {
    // 显示审核不通过的原因
    showReason() {
      showDialog(YT_PRODUCT_SHOW_REASON, {
        title: "基础信息审核",
        width: 800
      });
    },
    // 简单查询执行
    simpleSearch(data) {
      console.log(data);
    },

    // 筛选
    select() {
      console.log("sel");
    },

    getNewData(id) {
      this.params.productBaseStatus = id;
      this.$refs.table.refresh();
    },

    // 点击按钮
    editClickHander(e) {
      toUrl("/product/productList/addProduct.html");
    },

    set() {
      showDialog(YT_SEARCH, {});
    },

    // 删除产品按钮
    deleteProducts() {
      console.log("删除产品按钮");
    },

    // 采购编辑
    setPurchase() {
      toUrl("/product/productList/editPurchase.html");
    },

    // 采购审核
    reviewPhchase(props) {
      console.log(props);
      let vm = this;
      showDialog(
        YT_PRODUCT_SHOW_PHCHASE,
        {
          title: "采购信息审核",
          width: 1200,
          okText: "确认审核"
        },
        props,
        {
          set() {
            vm.$refs.table.refresh();
          }
        }
      );
    },

    // 基础信息审核
    reviewBase(props) {
      console.log(props);
      showDialog(
        YT_PRODUCT_SHOW,
        {
          title: "基础信息审核",
          width: 1200,
          okText: "确认审核"
        },
        props,
        {
          set() {
            vm.$refs.table.refresh();
          }
        }
      );
    },

    // 表格

    // 删除
    delItem: function(props) {
      console.log(props);
    },

    // 编辑产品
    editItem: function(props) {
      console.log(props);
      toUrl(
        `/product/productList/editPurchase.html?productId=${
          props.item.productId
        }`
      );
    },

    // 基础信息编辑
    editItemBase: function(props) {
      console.log(props);
      toUrl(
        `/product/productList/addProduct.html?productId=${props.item.productId}`
      );
    },

    // 复制添加
    copyAdd: function(props) {
      console.log(props);
      toUrl("/product/productList/editProduct.html");
    },

    checkAll: function(value) {
      this.checkAllMsg = "当前全选状态是：" + value;
    },

    clickRow: function(obj) {
      console.log(obj);
      this.clickRowMsg = "当前点击第" + obj.index + "行";
    },

    // 查看变体
    viewVariant(e) {
      console.log("object", e);

      // 请求变体数据
      this.tableData.splice(e.index + 1, 0, {
        productId: 2,
        id: 2222,
        version: 1,
        merchantId: 2,
        sku: "12",
        skuCustom: "12",
        warehouseId: 1,
        warehouseIdString: "深圳仓库",
        sourceType: 1,
        sourceTypeString: "新样品",
        photoFlag: 1,
        recommendLevel: 1,
        nameEn: "er",
        nameZh: "er",
        productSpecification: null,
        productBaseStatus: 5,
        price: 160,
        salePrice: 160,
        productBaseStatusString: "基础信息编辑",
        dailyTargetAll: null,
        repertoryAll: null,
        auditMap: {
          "1": 1,
          "2": 1
        }
      });
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";

body {
  padding: 20px;
}
.product_tab {
  margin-top: 20px;
}
.sku {
  .id {
    font-weight: bolder;
    font-size: 14px;
  }
}
.subItems {
  img,
  button {
    display: block;
  }
}
.tabs {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  border-bottom-style: 1px solid @title-color;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.edit-box {
  div {
    margin-top: 6px;
  }
}
</style>
