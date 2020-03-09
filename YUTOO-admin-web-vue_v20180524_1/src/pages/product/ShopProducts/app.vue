<template>
  <div>
    <v-form :model="ruleForm">
      <v-form-item label="站点">
        <v-select style="width: 120px;" v-model="ruleForm.host" :data="hostSelectOptions"></v-select>
      </v-form-item>
      <v-form-item label="店铺名称">
        <v-select style="width: 120px;" v-model="ruleForm.lang" :data="shopSelectOptions"></v-select>
      </v-form-item>
      <v-form-item label="产品名称">
        <v-input type="text" v-model="ruleForm.name" placeholder="请输入产品名称"></v-input>
      </v-form-item>
      <v-form-item label="产品SKU">
        <v-input type="text" v-model="ruleForm.sku" placeholder="请输入产品SKU"></v-input>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" html-type="button" @click.prevent="$emit('search', ruleForm)">搜索</v-button>
      </v-form-item>
    </v-form>
    <div class="hr"></div>
    <div @click="editClickHander" style="display:inline">
      <v-button type="primary">批量下架</v-button>
      <v-button type="primary">批量上架</v-button>
      <v-button type="primary" @click.stop="set">批量审核</v-button>
      <v-button type="primary">导出上架信息</v-button>
      <v-button type="primary">自定义导出</v-button>
    </div>

    <v-row style="margin-top: 20px;">
      <v-button-group style="width:100%" class="ant-btn-group-tabs">
        <v-button v-for="(item, key) in allBtns" @click="getNewData(item.param)" :key="key">{{item.text}}{{item.number == 0 ? "" : ('(' + item.number + ')')}}</v-button>
      </v-button-group>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table stripe :tree-option='treeOption' ref="table" :data='lists' :page-size="pageSize" :page-no="pageNo" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" class="margin-top-25" :current-data.sync='tableData' :pagination="true">
          <template slot="th" slot-scope="props">
            <strong v-if="props.column.field=='album'">操作</strong>
            <strong max-leh v-else v-html="props.title"></strong>
          </template>
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='banner'">
              <div>
                <img src="/static/u308.jpg" :alt="props.column.title" width="80" height="80">
              </div>
            </div>
            <div v-else-if="props.column.field=='statusList'">
              {{props.content[0].statusDesc}}
            </div>
            <div v-else-if="props.column.field=='storeName'">
              <div>
                <img :src="props.item.banner" :alt="props.column.title" width="50"><br>
                <span>{{props.content}}</span>
              </div>
            </div>
            <div v-else-if="props.column.field=='edit'">
              <v-button type="primary" size="small" v-if="props.item.statusList[0].status == 6 || props.item.statusList[0].status == 2 || props.item.statusList[0].status == 1" @click="editListing(props)">编辑listing</v-button>
              <v-button type="primary" size="small" v-if="props.item.statusList[0].status == 4" @click="lookAtReason(props)">查看原因</v-button>
              <v-button type="primary" size="small" @click="review(props)" v-if="props.item.statusList[0].status == 6">审核</v-button>
              <v-button type="primary" size="small" v-if="props.item.statusList[0].status == 2 || props.item.statusList[0].status == 5">下架</v-button>
              <!-- <v-button size="small">复制上传</v-button> -->
              <v-button size="small" type="primary" v-if="props.item.statusList[0].status == 2">立即刊登</v-button>
              <v-button type="primary" size="small" v-if="props.item.statusList[0].status == 4" @click="editListing(props)">编辑重新刊登</v-button>
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
  toParamUrl
} from "common/common";
import { isArray, debounce, browserType } from "common/util";
import apis, { GET_PRODUCT_SKU_OPTIONS, GET_PRODUCT_ALL_LIST } from "apis";
import {
  SHOP_PRODUCT_REVIEW,
  SHOP_PRODUCT_REVIEW_REASON
} from "../componentName";
import ytSimpleSearch from "components/base/simpleSearch";
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
  },
  data() {
    return {
      searchComponent: "ytSimpleSearch",
      lists: data => {
        let reqData = Object.assign({}, data, this.params);
        let opts = Object.assign({
          ...apis.STORE_PRODUCT_LIST_BY_STATUS,
          data: reqData
        });
        return fetchData(opts).then(res => {
          if (res.data && res.data.rows && isArray(res.data.rows)) {
            res.data.rows.forEach((element, i) => {
              element.pid = 0;
            });
          }
          console.log(res.data);
          return {
            result: res.data.rows,
            totalCount: res.data.total,
            pageSize: res.data.pageSize,
            pageNo: res.data.pageNo
          };
        });
      },
      ruleForm: {
        host: ""
      },
      hostSelectOptions: [
        {
          label: "美国站",
          value: 1
        }
      ],
      shopSelectOptions: [],
      isIE11: null,
      params: {
        sortOrder: "asc",
        pageSize: 10,
        pageNumber: 1,
        platformId: 1,
        status: 0
      },
      allBtns: [
        {
          text: "全部",
          number: 0,
          param: 0
        },
        {
          text: "草稿箱",
          number: 0,
          param: 0
        },
        {
          text: "等待刊登",
          number: 0,
          param: 0
        },
        {
          text: "刊登中",
          number: 0,
          param: 0
        },
        {
          text: "刊登失败",
          number: 0,
          param: 0
        },
        {
          text: "在线",
          number: 0,
          param: 0
        },
        {
          text: "待审核",
          number: 0,
          param: 0
        },
        {
          text: "在线编辑审核",
          number: 0,
          param: 0
        }
      ],
      columns: [
        {
          title: "店铺",
          field: "storeName"
        },
        {
          title: "产品图片",
          field: "banner"
        },
        {
          title: "产品名称",
          field: "nameCn"
        },
        {
          title: "状态",
          field: "statusList"
        },
        {
          title: "商品标题/sku/ASIN/FNSK",
          field: "skuSys"
        },
        {
          title: "本地仓结余库存",
          field: "version"
        },
        {
          title: "今日销量",
          field: "version"
        },
        {
          title: "本周销量",
          field: "version"
        },
        {
          title: "售价",
          field: "price"
        },
        {
          title: "FBA状态",
          field: "version"
        },
        {
          title: "时间",
          field: "createTime"
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
    // 简单查询执行
    simpleSearch(data) {
      console.log(data);
    },

    // 审核流程
    review(props) {
      let vm = this;
      showDialog(
        SHOP_PRODUCT_REVIEW,
        { title: "亚马逊刊登信息审核", width: 1200 },
        {
          ...props.item
        },
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr) {
            console.log(arr);
            fetchData({
              ...apis.STORE_PRODUCT_AUDIT,
              data: {
                productId: props.item.storeProductId,
                productType: props.item.productType,
                auditType: arr.auditType,
                refuseReason: arr.refuseReason
              }
            }).then(res => {
              if (res.data.code === 0) {
                showModal("success", "审核成功");
                vm.$refs.table.refresh();
              } else {
                showModal("success", "审核失败");
              }
            });
          }
        }
      );
    },

    // 编辑listing
    editListing(props) {
      console.log(props);

      toParamUrl("/product/ShopProducts/editLists.html", {
        productId: props.item.storeProductId,
        productType: props.item.productType
      });
    },

    // 查看原因
    lookAtReason(props) {
      showDialog(
        SHOP_PRODUCT_REVIEW_REASON,
        { title: "查看原因", width: 800 },
        {
          ...props.item
        },
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr) {
            console.log(arr);
          }
        }
      );
    },

    // 筛选
    select() {
      console.log("sel");
    },

    getNewData(id) {
      this.params.id = id;
      this.$refs.table.refresh();
    },

    // 点击按钮
    editClickHander(e) {
      toUrl("/product/productList/addProduct.html");
    },

    set() {
      console.log(2);
    },

    // 表格
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
      // 重新设置table的高度
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
  // text-align: center;
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
</style>
