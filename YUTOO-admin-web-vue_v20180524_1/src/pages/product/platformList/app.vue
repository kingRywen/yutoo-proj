<template>
  <div>
    <v-form :model="ruleForm">
      <v-form-item label="SKU">
        <v-select style="width: 120px;" v-model="ruleForm.skuType" :data="skuSelectOptions"></v-select>
      </v-form-item>
      <v-form-item>
        <v-input type="text" v-model="ruleForm.sku" placeholder="请输入SKU"></v-input>
      </v-form-item>
      <v-form-item label="产品名称">
        <v-input type="text" v-model="ruleForm.name" placeholder="请输入产品名称"></v-input>
      </v-form-item>
      <v-form-item label="语种">
        <v-select style="width: 120px;" v-model="ruleForm.lang" :data="langSelectOptions"></v-select>
      </v-form-item>
      <v-form-item label="编辑状态">
        <v-select style="width: 120px;" v-model="ruleForm.status" :data="statusSelectOptions"></v-select>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" html-type="button" @click.prevent="$emit('search', ruleForm)">搜索</v-button>
      </v-form-item>
    </v-form>
    <div class="hr"></div>
    <div style="display:inline">
      <v-button type="primary" @click="OneTouchImport">一键导入</v-button>
      <v-button type="primary">选择导入</v-button>
      <v-button type="primary">批量下架</v-button>
      <v-button type="primary">批量审核</v-button>
      <v-button type="primary">批量分配人员</v-button>
      <v-button type="primary">自定义导出</v-button>
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
            <div v-if="props.column.field=='photo'">
              <div v-if="!props.item.isBian">
                <img src="/static/u308.jpg" :alt="props.column.title" width="80" height="80">
              </div>
              <div v-else class="subItems">
                <img src="/static/u308.jpg" :alt="props.column.title" width="80" height="80">
                <v-button type="primary" size="small" @click="viewVariant(props, $event)">查看变体</v-button>
              </div>
            </div>
            <div v-else-if="props.column.field=='productSpecification'" class="sku">
              <span class="id">{{props.item.sku}}</span>
              <div>{{props.item.skuCustom}}</div>
              <div>{{props.item.warehouseName}}</div>
            </div>
            <div v-else-if="props.column.field=='nameZh'">
              <span>中文：{{props.content}}</span>
              <div>英文：{{props.item.nameEn}}</div>
            </div>
            <div v-else-if="props.column.field=='statusType'">
              <!-- <span v-if="props.content === 1">全部</span> -->
              <span v-if="getStatus(props) == 0">锁定</span>
              <span v-if="getStatus(props) == 1">草稿箱</span>
              <!-- 待编辑 显示状态 -->
              <v-popover trigger="hover" v-if="getStatus(props) == 2" :overlay-style="{zIndex: 99999}" placement="bottom">
                <div>待编辑({{getEditorMap(props, 1)}})</div>
                <div>待审核({{getEditorMap(props, 2)}})</div>
                <div>待上架({{getEditorMap(props, 3)}})</div>
                <div slot="content" class="platform_status">
                  <div class="platform_status_col">
                    <div class="platform_status_col_title">编辑状态:</div>
                    <div class="platform_status_col_item">
                      <div v-for="(val, key) in props.item.editorMap">
                        <b>{{key}} :</b>
                        <v-icon v-if="val == 1" type="check" style="color: #67c23a"></v-icon>
                      </div>
                    </div>
                  </div>
                  <div class="platform_status_col">
                    <div class="platform_status_col_title">审核状态:</div>
                    <div class="platform_status_col_item">
                      <div v-for="(val, key) in props.item.auditMap">
                        <b>{{key}} :</b>
                        <v-icon v-if="val == 2" type="check" style="color: #67c23a"></v-icon>
                        <v-icon v-else-if="val == 3" type="close" style="color: #f00"></v-icon>
                        <span v-else></span>
                      </div>
                    </div>
                  </div>
                  <div class="platform_status_col">
                    <div class="platform_status_col_title">待上架:</div>
                    <div class="platform_status_col_item">
                      <div v-for="item in props.item.storeList">
                        {{item}}
                      </div>
                    </div>
                  </div>

                </div>
              </v-popover>
              <span v-if="getStatus(props) == 3">待审核</span>
              <span v-if="getStatus(props) == 4">待上架</span>
              <span v-if="getStatus(props) == 5">已下架</span>
              <span v-if="getStatus(props) == 6">已上架</span>
            </div>
            <div v-else-if="props.column.field=='operatorName'">
              {{props.item.languageOperator.join('')}}
            </div>
            <div v-else-if="props.column.field=='edit'">
              <!-- {{ getStatus(props) }} -->
              <v-button size="small" type="primary" v-if="getStatus(props) == 4" @click="upload(props)">刊登上架</v-button>
              <v-button size="small" type="primary" v-if="getStatus(props) == 5" @click="upload(props)">重新上架</v-button>
              <v-button size="small" type="primary" v-if="getStatus(props) == 1" @click="CalBackToWaitForEditors(props)">打回待编辑</v-button>
              <v-button size="small" type="primary" v-if="getStatus(props) == 1 || getStatus(props) == 3 || getStatus(props) == 4 || getStatus(props) == 2" @click="ChooseShop(props)">选择店铺</v-button>
              <v-button size="small" type="primary" v-if="getStatus(props) == 2 || getStatus(props) == 4 || getStatus(props) == 3" @click="edit(props)">编辑</v-button>
              <v-button size="small" type="primary" v-if="getStatus(props) == 3" @click="review(props)">审核</v-button>
            </div>
            <span v-else v-html="props.content"></span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <el-dialog width="30%" title="选择店铺" :visible.sync="selectShopDialog" append-to-body>
      <el-input placeholder="请输入店铺名称" class="input-with-select">
        <el-button slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <div class="search_result">
        <!-- <el-button type="info" style="margin:10px 0 0 0;width:100%" v-for="item in shopList">{{item.storeName}}</el-button> -->
        <el-table :data="shopList" :show-header='false' style="width: 100%;margin-top:15px;" @selection-change="checkedShops" ref="elTable">
          <el-table-column type="selection"></el-table-column>
          <el-table-column label="storeName" prop="storeName" width="100%" />
        </el-table>

      </div>
      <div slot="footer" class="dialog-footer" style="text-align: center">
        <el-button type="primary" @click="selectShop">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  fetchAllData,
  fetchData,
  toUrl,
  fixFrameHeight,
  toParamUrl,
  showModal,
  showToast
} from "common/common";
import { isArray, debounce, browserType } from "common/util";
import apis, {
  GET_PRODUCT_SKU_OPTIONS,
  GET_PRODUCT_ALL_LIST,
  GET_ERP_PLATFORM_LISTS
} from "apis";
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
    this.skuSelectOptions = [
      {
        label: "产品SKU",
        value: 1
      },
      {
        label: "自定义SKU",
        value: 2
      }
    ];
  },
  data() {
    return {
      searchComponent: "ytSimpleSearch",
      lists: data => {
        let reqData = Object.assign({}, data, this.params);
        let opts = Object.assign({}, GET_ERP_PLATFORM_LISTS, { data: reqData });
        return fetchData(opts).then(res => {
          // if (res.data && res.data.result && isArray(res.data.result)) {
          //   res.data.result.forEach((element, i) => {
          //     element.pid = 0;
          //   });
          // }
          console.log(res.data);
          return {
            result: res.data.rows
          };
        });
      },

      selectShopDialog: false,
      shopList: [],
      selectShopListId: [],
      selectItem: {},

      ruleForm: {
        name: "",
        skuType: "",
        sku: ""
      },
      skuSelectOptions: [],
      statusSelectOptions: [
        {
          label: "待编辑",
          value: 1
        },
        {
          label: "待审核",
          value: 2
        },
        {
          label: "审核不通过",
          value: 2
        },
        {
          label: "待上架",
          value: 2
        }
      ],
      langSelectOptions: [
        {
          label: "全部",
          value: 1
        },
        {
          label: "英文",
          value: 2
        },
        {
          label: "法语",
          value: 2
        },
        {
          label: "德语",
          value: 2
        },
        {
          label: "意大利语",
          value: 2
        }
      ],
      isIE11: null,
      params: {
        productPlatformStatus: 1,
        platformId: 1,
        sortOrder: "asc",
        pageSize: 10,
        pageNumber: 1
      },
      allBtns: [
        {
          text: "全部",
          param: 1
        },
        {
          text: "草稿箱",
          param: 2
        },
        {
          text: "待编辑",
          param: 3
        },
        {
          text: "平台信息待审核",
          param: 4
        },
        {
          text: "图片待审核",
          param: 5
        },
        {
          text: "待上架",
          param: 6
        },
        {
          text: "已下架",
          param: 8
        },
        {
          text: "锁定",
          number: 0,
          param: 9
        },
        {
          text: "已上架",
          number: 0,
          param: 7
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
          title: "SKU",
          field: "productSpecification"
        },
        {
          title: "产品名称",
          field: "nameZh"
        },
        {
          title: "状态",
          field: "statusType"
        },
        {
          title: "编辑负责人员",
          field: "operatorName"
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
    // 一键导入
    OneTouchImport() {
      let vm = this;
      fetchData({
        ...apis.PRODUCT_PLATFORM_LEAD_ALL,
        data: {
          platformId: 1
        }
      }).then(res => {
        if (res.data.code === 0) {
          showModal("success", "导入成功");
          vm.$refs.table.refresh();
        } else {
          showModal("error", "导入失败");
        }
      });
    },

    // 判断按钮显示状态
    getStatus(props) {
      let languageStatusMap = props.item.languageStatusMap;
      if (props.item.lockFlag == 1) {
        // 锁定
        return 0;
      }
      if (props.item.statusType == 2) {
        // 草稿箱
        return 1;
      }
      if (props.item.statusType == 4) {
        // 已下架
        return 5;
      }
      if (props.item.statusType == 5) {
        // 已上架
        return 6;
      }
      for (const key in languageStatusMap) {
        if (languageStatusMap.hasOwnProperty(key)) {
          const el = languageStatusMap[key];
          if (el == 1) {
            // 待编辑
            return 2;
          }
          if (el == 2) {
            // 待审核
            return 3;
          }
          if (el == 3) {
            // 待上架
            return 4;
          }
        }
      }
    },

    // 判断待编辑状态的语种数目
    getEditorMap(props, type) {
      let num = 0;
      let dataMap = type == 1 ? props.item.editorMap : props.item.auditMap;
      if (type == 1) {
        for (const key in dataMap) {
          if (dataMap.hasOwnProperty(key)) {
            const element = dataMap[key];
            if (element == 1 && key != "IMG") {
              num++;
            }
          }
        }
      }
      if (type == 2) {
        for (const key in dataMap) {
          if (dataMap.hasOwnProperty(key)) {
            const element = dataMap[key];
            if (element == 2) {
              num++;
            }
          }
        }
      }
      if (type == 3) {
        let datas = props.item.storeList;
        return datas.length;
      }
      return num;
    },

    // 选择店铺
    ChooseShop(props) {
      console.log(props);
      this.selectShopDialog = true;
      fetchData({
        ...apis.PRODUCT_PREPARE_STORE_LIST,
        data: {
          productPlatformId: props.item.productPlatformId,
          platformId: 1,
          name: null
        }
      }).then(res => {
        console.log(res);
        this.shopList = res.data.rows;
        // 设置选中
        // this.$refs.elTable.toggleRowSelection(this.shopList[0]);
        this.selectItem = props;
      });
    },

    // 选中的店铺详情
    checkedShops(val) {
      console.log(val);
      this.selectShopListId = val;
    },

    // 选择店铺弹窗确认
    selectShop() {
      let { productPlatformId, productId } = this.selectItem.item;
      let prepareStoreIds = [];
      this.selectShopListId.map(el => {
        prepareStoreIds.push(el.storeId);
      });
      fetchData({
        ...apis.PRODUCT_PREPARE_STORE_SAVE,
        data: {
          platformId: 1,
          productPlatformId,
          productId,
          prepareStoreIds
        }
      }).then(res => {
        console.log(res);
        showToast("success", "选择成功");
        this.selectShopDialog = false;
        this.$refs.table.refresh();
      });
    },

    // 编辑操作
    edit(props) {
      toParamUrl("/product/platformList/editLists.html", {
        productPltDetailId: props.item.languageDetailMap[1],
        productPlatformId: props.item.productPlatformId,
        productId: props.item.productId
      });
    },

    // 审核操作
    review(props) {
      toParamUrl("/product/platformList/review.html", {
        productPltDetailId: props.item.languageDetailMap[1],
        productPlatformId: props.item.productPlatformId,
        productId: props.item.productId
      });
    },

    // 上传到店铺
    upload(props) {
      let { productId, productPlatformId, languageDetailMap } = props.item;
      toParamUrl("/product/platformList/uploadProduct.html", {
        platformId: 1,
        productId,
        detailId: languageDetailMap[1],
        platformProductId: productPlatformId,
        platformProductParentId: productPlatformId,
        productParentId: productId
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
      this.params.productPlatformStatus = id;
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
.platform_status {
  font-size: 14px;
  width: 400px;
  .platform_status_col {
    display: flex;
    .platform_status_col_title {
      margin: 10px;
    }
    .platform_status_col_item {
      display: flex;
      flex-wrap: wrap;

      div {
        margin: 10px;
      }
    }
  }
}
</style>
