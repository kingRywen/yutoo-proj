<template>
  <div style="height:100%">
    <v-form>

      <v-form-item>
        <v-input placeholder="请输入产品名称/供应商/SKU" v-model="ruleForm.nameOrSku"></v-input>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select v-model="ruleForm.responsibleDeveloper" placeholder="开发" size="lg" style="width:100px" notfound="无法找到" :data="options1"></v-select>
      </v-form-item>

      <!-- <v-form-item>
        <v-select  v-model="ruleForm.nameOrSku" placeholder="采购" size="lg" style="width:100px" notfound="无法找到" :data="[{value: '1', label: '区域1'}, {value: '2', label: '区域2'}]"></v-select>
      </v-form-item> -->

      <v-form-item class="delLabel">
        <v-select v-model="ruleForm.status" placeholder="状态" size="lg" style="width:100px" notfound="无法找到" :data="[{value: 1, label: '审核中'}, {value: 2, label: '审核通过'}, {value: 3, label: '审核不通过'}]"></v-select>
      </v-form-item>

      <v-form-item>
        <!-- <v-date-picker clearable v-model="rangeDate2" range></v-date-picker> -->
        <el-date-picker style="width:100%;max-width:300px" type="daterange" size="small" start-placeholder="开始日期" end-placeholder="结束日期" v-model="rangeDate2">
        </el-date-picker>
      </v-form-item>

      <v-form-item>
        <v-button type="primary" @click="search">搜索</v-button>
      </v-form-item>
      <!-- <v-form-item>
        <v-button type="primary">统计搜索</v-button>
      </v-form-item> -->
    </v-form>

    <div class="hr"></div>
    <div style="display:inline">
      <v-button type="primary" @click="batchBack">批量退回</v-button>
    </div>

    <!-- <v-row style="margin-top: 20px;" :gutter="16">
      <v-col span="20">
        <v-button-group style="width:100%" class="ant-btn-group-tabs">
          <v-button v-for="(item, key) in allBtns" @click="getNewData(item.param)" :key="key">{{item.text}}</v-button>
        </v-button-group>
      </v-col>
      <v-col span="4" style="text-align:right">
        <CustomList :data.sync="columns" save-field="SupplierProductReview_list"></CustomList>
      </v-col>
    </v-row> -->

    <v-row>
      <v-col>
        <v-data-table stripe :tree-option='treeOption' ref="table" :data='lists' :page-size="pageSize" :page-no="pageNo" :columns='columnsList' check-type="checkbox" class="margin-top-10" :current-data.sync='tableData'>
          <template slot="th" slot-scope="props">
            <div v-if="props.column.field=='edit'" class="text-center">
              操作
            </div>
            <div v-else-if="props.column.field=='imgMUrl'" class="text-center">
              图片
            </div>
            <strong max-leh v-else v-html="props.title"></strong>
          </template>
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='imgMUrl'">
              <el-tooltip placement="right" effect="light" :open-delay="300">
                <div slot="content">
                  <img :src="props.content && props.content.replace(/,h_\d+,w_\d+/ig, ',h_240,w_240') || '/static/no-image.jpg'" width="240">
                </div>
                <div class="divContent">
                  <img :src="props.content || '/static/no-image.jpg'" :alt="props.column.title">
                </div>
              </el-tooltip>
            </div>
            <div v-else-if="props.column.field=='status'">
              <!-- <span v-if="props.content === 1">未提交审核</span> -->
              <span v-if="props.content === 1">审核中</span>
              <span v-if="props.content === 2">审核通过</span>
              <span v-if="props.content === 3">审核不通过</span>
            </div>

            <div v-else-if="props.column.field=='edit'" class="edit-box">
              <div>
                <tooltip-button content="审核" v-if="props.item.status !== 2 && props.item.status !== 3" icon="&#xe7b4;" @click="review(props)" />
                <tooltip-button content="查看" icon="&#xe7e3;" @click="query(props)" />
                <tooltip-button content="删除" icon="&#xe7b7;" @click="del(props)" />
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
  handlerCode,
  fixFrameHeight,
  showDialog,
  showToast,
  showConfirm
} from "common/common";
import { isArray, debounce, browserType } from "common/util";
import apis, { GET_PRODUCT_SKU_OPTIONS, GET_PRODUCT_ALL_LIST } from "apis";
import ytSimpleSearch from "components/base/simpleSearch";
import CustomList from "components/base/customList";
import TooltipButton from "components/base/tooltipButton";
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
    ytSimpleSearch,
    CustomList,
    TooltipButton
  },
  created() {
    this.getUserList();
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
        let reqData = Object.assign({}, data, this.params, this.ruleForm);
        delete reqData.sortColumns;

        let opts = Object.assign(
          {},
          { ...apis.PRODSUPPLIERAUDIT_LIST },
          { data: reqData }
        );

        return fetchData(opts).then(res => {
          let data = res.data;
          if (data && data.rows && isArray(data.rows)) {
            data.rows.forEach((element, i) => {
              element.pid = 0;
            });
          } else {
            showToast("error", res.data.msg);
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
      ruleForm: {},

      options1: [],

      rangeDate2: "",

      isIE11: null,
      params: {
        // status: 1,
        sortOrder: "asc"
      },
      allBtns: [],
      columns: [
        {
          title: "编号",
          field: "prodSrcSupplierId",
          show: true
        },
        {
          title: "操作",
          field: "edit",
          show: true
        },
        {
          title: "图片",
          field: "imgMUrl",
          show: true
        },
        {
          title: "添加时间",
          field: "createTime",
          show: true
        },
        {
          title: "产品SKU",
          field: "productSku",
          show: true
        },
        {
          title: "开发人员",
          field: "responsibleDeveloperName",
          show: true
        },
        {
          title: "采购人员",
          field: "purchaseName",
          show: true
        },

        {
          title: "产品名称",
          field: "productNameCn",
          show: true
        },
        {
          title: "供应商名称",
          field: "",
          show: true
        },
        {
          title: "类目",
          field: "categoryNameArry",
          show: true
        },
        {
          title: "采购价格",
          field: "spurchasePrice",
          show: true
        },
        {
          title: "审核状态",
          field: "status",
          show: true
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
    getUserList() {
      fetchData({ ...apis.DEVELOP_USER_LIST }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          res.data.rows.map(el => {
            el.label = el.nickName;
            el.value = el.userId;
          });
        }
        this.options1 = res.data.rows;
      });
    },
    search() {
      this.$refs.table.refresh();
    },
    // 审核
    review(props) {
      let vm = this;
      showDialog(
        "SupplierProductReviewBtn",
        {
          title: "审核",
          width: 640,
          okText: "确认"
        },
        props,
        {
          set(childVm) {
            let { status, auditReasons } = childVm.ruleForm;
            fetchData({
              ...apis.PRODSUPPLIERAUDIT_UPDATESTATUS,
              data: {
                prodSupplierAuditIds: [props.item.prodSrcSupplierId],
                status,
                auditReasons
              }
            }).then(res => {
              handlerCode(res, () => {
                childVm.cancel();
                vm.$refs.table.refresh();
              });
            });
          }
        }
      );
    },

    // 查看
    query(props) {
      let vm = this;
      showDialog(
        "SupplierProductQueryBtn",
        {
          title: "查看",
          width: 1200,
          modalnoBtn: true
        },
        props,
        {
          set(childVm) {
            let { status, auditReasons } = childVm.ruleForm;
            fetchData({
              ...apis.PRODSUPPLIERAUDIT_UPDATESTATUS,
              data: {
                prodSupplierAuditIds: [props.item.prodSrcSupplierId],
                status,
                auditReasons
              }
            }).then(res => {
              handlerCode(res, () => {
                vm.$refs.table.refresh();
              });
            });
          }
        },
        true,
        true
      );
    },

    // 删除
    del(props) {
      let vm = this;
      showConfirm({
        title: "是否删除？",
        onOk() {
          fetchData({
            ...apis.PRODSUPPLIERAUDIT_REMOVE,
            data: {
              prodSrcSupplierId: [props.item.prodSrcSupplierId]
            }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table.refresh();
            });
          });
        }
      });
    },

    // 批量退回
    batchBack() {
      let vm = this;
      let prodSupplierAuditIds = this.$refs.table
        .getCheckedData()
        .map(el => el.prodSrcSupplierId);
      if (!prodSupplierAuditIds.length) {
        showToast("info", "请选择一条数据进行操作");
        return;
      }

      showDialog(
        "SupplierProductBack",
        {
          title: "是否批量退回？",
          width: 800
          // modalnoBtn: true
        },
        {},
        {
          set(childVm) {
            let { auditReasons } = childVm.ruleForm;
            fetchData({
              ...apis.PRODSUPPLIERAUDIT_UPDATESTATUS,
              data: {
                prodSupplierAuditIds,
                status: 3,
                auditReasons
              }
            }).then(res => {
              handlerCode(res, () => {
                vm.$refs.table.refresh();
              });
            });
          }
        }
      );
    }
  },
  watch: {
    rangeDate2(val) {
      this.ruleForm.startDate = val[0];
      this.ruleForm.endDate = val[1];
    }
  },
  computed: {
    columnsList() {
      return this.columns.filter(el => el.show);
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
.delLabel label {
  visibility: hidden !important;
}
</style>
