<template>
  <div>
    <keep-alive>
      <component :is="searchComponent" :select="options" @search="simpleSearch"></component>
    </keep-alive>
    <div class="hr"></div>
    <div @click="editClickHander" style="display:inline">
      <v-button type="primary">新增产品</v-button>
      <v-button type="primary" @click.stop="deleteProducts">删除产品</v-button>
      <v-button type="primary" @click.stop="set">规则设置</v-button>
      <v-button type="primary">批量设置</v-button>
      <v-button type="primary">批量审核产品</v-button>
      <v-button type="primary">批量分配人员</v-button>
      <v-button type="primary">批量操作</v-button>
      <v-button type="primary">批量导入</v-button>
      <v-button type="primary">自定义导出产品</v-button>
      <!-- <v-button type="primary" @click.stop="setPurchase">采购编辑测试</v-button> -->
    </div>

    <v-row style="margin-top: 20px;">
      <v-button-group style="width:100%" class="ant-btn-group-tabs">
        <v-button v-for="(item, key) in allBtns" @click="getNewData(item.param)" :key="key">{{item.text}}</v-button>
      </v-button-group>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table stripe :tree-option='treeOption' ref="table" :data='lists' :page-size="pageSize" :page-no="pageNo" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="10" class="margin-top-25" :current-data.sync='tableData'>
          <template slot="th" slot-scope="props">
            <strong v-if="props.column.field=='album'">操作</strong>
            <strong max-leh v-else v-html="props.title"></strong>
          </template>
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='photo'">
              <div v-if="!props.item.isBian">
                <img src="/static/u3081.jpg" :alt="props.column.title" width="80" height="80">
              </div>
              <div v-else class="subItems">
                <img src="/static/u3081.jpg" :alt="props.column.title" width="80" height="80">
                <v-button type="primary" size="small" @click="viewVariant(props, $event)">查看变体</v-button>
              </div>
            </div>
            <div v-else-if="props.column.field=='productSpecification'" class="sku">
              <span class="id">{{props.item.sku}}</span>
              <div>{{props.item.skuCustom}}</div>
              <div>{{props.item.warehouseIdString}}</div>
            </div>
            <div v-else-if="props.column.field=='nameZh'">
              <span>中文：{{props.content}}</span>
              <div>英文：{{props.item.nameEn}}</div>
              <div>来源：{{props.item.sourceTypeString}}</div>
              <div>{{props.item.photoFlag == 1 ? '需要': '不需要' }}拍照</div>
            </div>
            <div v-else-if="props.column.field=='auditMap'">
              <p>开发:{{props.content['1'] == 1 ? '未审核': (props.content['1'] == 2 ? '通过' : '未通过')}}
                <v-icon type="check" style="color: #67c23a;font-weight: bold;" v-if="props.content['1'] == 2"></v-icon>
                <v-icon type="close" style="color: #f00;font-weight: bold;" v-if="props.content['1'] == 3"></v-icon>
              </p>
              <p>采购:{{props.content['2'] == 1 ? '未审核': (props.content['2'] == 2 ? '通过' : '未通过')}}
                <v-icon type="check" style="color: #67c23a;font-weight: bold;" v-if="props.content['2'] == 2"></v-icon>
                <v-icon type="close" style="color: #f00;font-weight: bold;" v-if="props.content['2'] == 3"></v-icon>
              </p>
            </div>
            <div v-else-if="props.column.field=='productBaseStatusString'">
              <span>{{props.content}}</span>
              <div>{{props.item.review2}}</div>
            </div>
            <div v-else-if="props.column.field=='recommendLevel'">
              <v-rate disabled :value='props.content'></v-rate>
            </div>
            <div v-else-if="props.column.field=='edit'" class="edit-box">
              <div>
                <!-- 打回 -->
                <v-button size="small" type="primary" v-if="props.item.productBaseStatus > 5" @click="showReason(props, 3)">查看理由</v-button>

                <v-button size="small" type="primary" v-if="props.item.productBaseStatus == 5 || props.item.productBaseStatus == 3" @click="editItem(props)">编辑</v-button>
                <v-button size="small" type="primary" v-if="props.item.productBaseStatus == 1" @click="editItemBase(props)">基础编辑</v-button>

                <v-button size="small" type="warning" v-if="props.item.productBaseStatus == 2" @click="reviewBase(props)">审核</v-button>
                <v-button size="small" type="warning" v-if="props.item.productBaseStatus == 4" @click="reviewPhchase(props)">审核</v-button>

                <v-button size="small" type="primary" v-if="props.item.productBaseStatus < 6" @click="copyAdd(props)">复制添加</v-button>

                <!-- 审核不通过原因 -->
                <v-button size="small" type="primary" v-if="props.item.auditMap[1] == 3" @click="showReason(props, 1)">查看原因</v-button>
                <v-button size="small" type="primary" v-if="props.item.auditMap[2] == 3" @click="showReason(props, 2)">查看原因</v-button>
                <!-- 作废 -->
                <v-button size="small" type="error" icon="delete" v-if="props.item.productBaseStatus != 8 && (props.item.auditMap[1] == 3 || props.item.auditMap[2] == 3)" @click="delItem(props)">作废</v-button>
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
  showDialog,
  showConfirm,
  showToast
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

        let opts = Object.assign({}, GET_PRODUCT_ALL_LIST, { data: reqData });

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

      isIE11: null,
      params: {
        productBaseStatus: null,
        sortOrder: "asc"
      },
      allBtns: [
        {
          text: "全部",
          number: 3,
          param: null
        },
        {
          text: "基本资料编辑",
          number: 3,
          param: "1"
        },
        {
          text: "采购编辑",
          number: 3,
          param: "3"
        },
        {
          text: "基础信息待审核",
          number: 3,
          param: "2"
        },
        {
          text: "采购待审核",
          number: 3,
          param: "4"
        },
        {
          text: "审核通过",
          number: 3,
          param: "5"
        },
        {
          text: "作废产品",
          number: 0,
          param: "8"
        },
        {
          text: "基础信息打回",
          number: 0,
          param: "6"
        },
        {
          text: "采购编辑打回",
          number: 0,
          param: "7"
        }
      ],
      columns: [
        {
          title: "ID",
          field: "merchantId"
        },
        {
          title: "产品图片",
          field: "photo"
        },
        {
          title: "自定义SKU",
          field: "productSpecification"
        },
        {
          title: "产品名称",
          field: "nameZh"
        },
        {
          title: "采购价",
          field: "price"
        },
        {
          title: "售价",
          field: "salePrice"
        },
        {
          title: "操作人员",
          field: "operatorName"
        },
        {
          title: "产品审核状态",
          field: "auditMap"
        },
        {
          title: "上架状态",
          field: "productBaseStatusString"
        },
        {
          title: "指数",
          field: "recommendLevel"
        },
        {
          title: "本仓估算日销量",
          field: "dailyTargetAll"
        },
        {
          title: "库存",
          field: "repertoryAll"
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
    showReason(props, type) {
      showDialog(
        YT_PRODUCT_SHOW_REASON,
        {
          title: `${
            type == 1 ? "基础信息审核" : type == 2 ? "采购信息审核" : "打回原因"
          }`,
          width: 800
        },
        { item: props.item, type }
      );
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
      let vm = this;
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
            console.log("刷新");
            vm.$refs.table.refresh();
          }
        }
      );
    },

    // 表格

    // 查看原因
    viewReason(props, type) {
      switch (type) {
        case 1:
          // 基础信息审核不通过
          fetchData({
            ...apis.PRODUCT_AUDIT_INFO,
            data: {
              productId: 1,
              auditType: type
            }
          }).then(res => {
            console.log(res);
          });
          break;
        case 2:
          // 采购信息审核不通过
          break;
        case 3:
          // 打回
          break;

        default:
          break;
      }
    },

    // 作废产品
    delItem: function(props) {
      let vm = this;
      showConfirm({
        title: "是否作废此产品？",
        onOk() {
          fetchData({
            ...apis.PRODUCT_INVALID,
            data: {
              productId: props.item.productId
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", "作废成功");
              vm.$refs.table.refresh();
            }
          });
        }
      });
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
