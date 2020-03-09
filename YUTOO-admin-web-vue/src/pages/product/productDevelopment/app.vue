<template>
  <div>
    <v-form>

      <v-form-item>
        <v-input placeholder="请输入产品名称" v-model="params.productName"></v-input>
      </v-form-item>

      <v-form-item label="日估算">
        <v-input v-model.number="params.startDailyForecastSales"></v-input>
      </v-form-item>

      <v-form-item>
        ~
      </v-form-item>

      <v-form-item>
        <v-input v-model.number="params.endDailyForecastSales"></v-input>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select v-model="params.platformId" placeholder="销售平台" size="lg" style="width:100px" notfound="无法找到" :data="platformList"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select v-model="params.siteId" placeholder="选择站点" size="lg" style="width:100px" notfound="无法找到" :data="siteList"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select v-model="params.developerId" placeholder="开发人员" size="lg" style="width:100px" notfound="无法找到" :data="options1"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select v-model="params.creator" placeholder="提交人" size="lg" style="width:100px" notfound="无法找到" :data="options2"></v-select>
      </v-form-item>

      <v-form-item>
        <v-date-picker v-model="rangeDate2" style="width:240px" range></v-date-picker>
      </v-form-item>

      <v-form-item>
        <v-button type="primary" @click="search">搜索</v-button>
      </v-form-item>
    </v-form>

    <div class="hr"></div>
    <div style="display:inline">
      <v-button type="primary" @click="create(null)">创建</v-button>
      <el-dropdown @command="handleCommand">
        <v-button type="primary">批量操作
          <v-icon type="down" size="sm"></v-icon>
        </v-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">审核</el-dropdown-item>
          <el-dropdown-item command="b">打回</el-dropdown-item>
          <el-dropdown-item command="c">批量分配开发人员</el-dropdown-item>
          <el-dropdown-item command="d">需求作废</el-dropdown-item>
          <el-dropdown-item command="e">导出Excel</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>

    <v-row style="margin-top: 10px;" :gutter="16">
      <v-col span="20">
        <v-button-group style="width:100%" class="ant-btn-group-tabs">
          <v-button v-for="(item, key) in allBtns" @click="getNewData(item.param)" :key="key">{{item.text}}</v-button>
        </v-button-group>
      </v-col>
      <v-col span="4" style="text-align:right">
        <CustomList :data.sync="columns" save-field="productDevelopment_list"></CustomList>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table stripe :tree-option='treeOption' ref="table" :data='lists' :page-size="pageSize" :page-no="pageNo" :columns='columnsList' check-type="checkbox" :bottomGap="isIE11" class="margin-top-10" :current-data.sync='tableData'>
          <template slot="th" slot-scope="props">
            <div v-if="props.column.field=='edit'" class="text-center">
              <strong>操作</strong>
            </div>
            <div v-else-if="props.column.field=='imgUrl'" class="text-center">
              <strong>{{props.column.title}}</strong>
            </div>

            <strong max-leh v-else v-html="props.title"></strong>
          </template>
          <template slot="td" slot-scope="props">

            <div v-if="props.column.field=='edit'" class="btn_wrapper edit-box">
              <div v-if="props.item.status == 1">
                <tooltip-button content="编辑提交" icon="&#xe791;" @click="edit(props)" />
                <tooltip-button content="作废" icon="&#xe7b7;" @click="cancel(props)" />
                <tooltip-button content="操作日志" icon="&#xe61e;" @click="seeLog(props)" />
              </div>
              <div v-if="props.item.status == 2">
                <tooltip-button content="审核" icon="&#xe7b4;" @click="review(props)" />
                <tooltip-button content="打回待编辑" icon="&#xe7d4;" @click="callbackToEdit(props)" />
                <tooltip-button content="操作日志" icon="&#xe61e;" @click="seeLog(props)" />
              </div>
              <div v-if="props.item.status == 3">
                <tooltip-button content="分配开发" icon="&#xe7b5;" @click="assign(props)" />
                <tooltip-button content="打回待审核" icon="&#xe7fe;" @click="callbackToReview(props)" />
                <tooltip-button content="操作日志" icon="&#xe61e;" @click="seeLog(props)" />
              </div>
              <div v-if="props.item.status == 4">
                <tooltip-button content="打回待分配" icon="&#xe7b5;" @click="callbackToAssign(props)" />
                <tooltip-button content="开发完结" icon="&#xe77d;" @click="doneDev(props)" />
              </div>
              <div v-if="props.item.status == 5">
                <tooltip-button content="操作日志" icon="&#xe61e;" @click="seeLog(props)" />
              </div>
            </div>
            <div v-else-if="props.column.field === 'imgUrl'">
              <el-tooltip placement="right" effect="light" :open-delay="300">
                <div slot="content">
                  <img :src="props.content && props.content.replace(/,h_\d+,w_\d+/ig, ',h_240,w_240') || '/static/no-image.jpg'" :alt="props.column.productName" width="240">
                    </div>
                  <div class="divContent">
                    <img :src="props.content || '/static/no-image.jpg'" :alt="props.column.productName">
                    </div>
              </el-tooltip>
              <!-- <img :src="props.content" :alt="props.item.productName" width="100" height="100"> -->
            </div>
            <div v-else-if="props.column.field === 'creatorName'">
              <p>{{props.content}}</p>
              <!-- <p>{{props.item.createTime}}</p> -->
            </div>
            <div v-else-if="props.column.field=='status'">
              <div v-if="props.content == 1">待编辑</div>
              <div v-if="props.content == 2">待审核</div>
              <div v-if="props.content == 3">待分配</div>
              <div v-if="props.content == 4">开发中</div>
              <div v-if="props.content == 5">开发成功</div>
              <div v-if="props.content == 6">开发失败</div>
              <div v-if="props.content == 7">作废</div>
              <div v-if="props.content == 8">打回</div>
            </div>
            <span v-else v-html="props.content"></span>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

  </div>
</template>

<script>
import Vue from "vue";
import { BASE_URL } from "common/config";

import {
  fetchAllData,
  fetchData,
  toUrl,
  fixFrameHeight,
  showDialog,
  showConfirm,
  showToast,
  downloadFile,
  getVue
} from "common/common";
import { isArray, debounce, browserType } from "common/util";
import apis, { GET_PRODUCT_SKU_OPTIONS, GET_PRODUCT_ALL_LIST } from "apis";
import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";
import {
  YT_SEARCH,
  YT_PRODUCT_SHOW,
  YT_PRODUCT_SHOW_REASON,
  YT_PRODUCT_SHOW_PHCHASE
} from "../componentName";
import router from "common/router";
import CustomList from "components/base/customList";
import TooltipButton from "components/base/tooltipButton";

Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(DropdownItem);

export default {
  name: "productList",
  components: {
    Dropdown,
    DropdownMenu,
    DropdownItem,
    CustomList,
    TooltipButton
  },
  created() {
    this.getPlatform();
    this.getUserList();
    this.getOptions2();

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
          { ...apis.PRODUCTSRCDEVELOP_LIST },
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

      platformList: [],
      siteList: [],

      isIE11: null,
      params: {
        sortOrder: "asc",
        productName: "",
        startDailyForecastSales: null,
        endDailyForecastSales: null,
        platformId: null,
        siteId: null,
        developerId: null,
        creator: null,
        startDate: null,
        endDate: null,
        status: null
      },
      allBtns: [
        {
          text: "全部",
          number: 3,
          param: null
        },
        {
          text: "待编辑",
          number: 3,
          param: "1"
        },
        {
          text: "待审核",
          number: 3,
          param: "2"
        },
        {
          text: "待分配",
          number: 3,
          param: "3"
        },

        {
          text: "开发中",
          number: 3,
          param: "4"
        },
        {
          text: "开发成功",
          number: 0,
          param: "5"
        },
        {
          text: "作废",
          number: 3,
          param: "7"
        }
      ],
      columns: [
        {
          title: "操作",
          field: "edit",
          show: true
        },
        {
          title: "缩略图",
          field: "imgUrl",
          show: true
        },
        {
          title: "产品名称",
          field: "productName",
          show: true
        },
        {
          title: "参考产品类别",
          field: "categoryNameArry",
          show: true
        },
        {
          title: "销售平台/站点",
          field: "siteId",
          show: true
        },
        {
          title: "日销量估算",
          field: "dailyForecastSales",
          show: true
        },
        {
          title: "目标采购价",
          field: "targetPrice",
          show: true
        },
        {
          title: "成本采购价",
          field: "costPrice",
          show: true
        },
        {
          title: "实际开发采购价",
          field: "developPrice",
          show: true
        },
        {
          title: "需求提交人",
          field: "creatorName",
          show: true
        },
        {
          title: "创建时间",
          field: "createTime",
          show: true
        },
        {
          title: "开发人员",
          field: "developerName",
          show: true
        },
        {
          title: "产品开发状态",
          field: "status",
          show: true
        }
      ],

      tableData: [],
      treeOption: {
        isAsync: true
      },
      options1: [],
      options2: [],
      options: [],
      searchData: "",
      items: [],
      pageNo: 1,
      pageSize: 10
    };
  },
  methods: {
    getNewData(params) {
      this.params = {
        platformId: 1
      };
      this.params.status = params;
      this.$refs.table.refresh();
    },
    getOptions2() {
      // fetchData({ ...apis.DEVELOP_USER_LIST }).then(res => {
      //   console.log(res);
      //   res.data.rows = res.data.rows.map(el => ({
      //     value: el.username,
      //     label: el.username
      //   }));
      //   this.options2 = res.data.rows;
      // });
    },

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
            delete this.params.siteId;
          }
        }
      });
    },
    getUserList() {
      fetchData({ ...apis.DEVELOP_USER_LIST }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          res.data.rows.map(el => {
            el.label = el.username;
            el.value = el.userId;
          });
        }
        this.options1 = res.data.rows;
        this.options2 = res.data.rows;
      });
    },

    create(edit, props) {
      let title = "创建",
        data = {};
      if (edit == 1) {
        title = "编辑";
        data.props = props;
      }
      if (edit == 2) {
        title = "审核";
        data.props = props;
      }
      let vm = this;
      showDialog(
        "productDevelopmentCreate",
        { title, width: 1000, modalnoBtn: true },
        edit ? { ...data, edit } : data,
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set() {
            if (edit == 2) {
              getVue().$modal.confirm({
                title: "通过审核？",
                content: "",
                onOk: function() {
                  console.log("确定");
                  fetchData({
                    ...apis.PRODUCTSRCDEVELOP_UPDATESTATUS,
                    data: {
                      sourceId: props.item.sourceId,
                      status: 3
                    }
                  }).then(res => {
                    if (res.data.code === 0) {
                      showToast("success", res.data.msg);
                      vm.$refs.table.refresh();
                    } else {
                      showToast("error", res.data.msg);
                    }
                  });
                },
                onCancel: function() {}
              });
            }
            vm.$refs.table.refresh();
          }
        }
      );
    },

    // 搜索
    search() {
      this.$refs.table.refresh();
    },

    // 编辑提交
    edit(props) {
      this.create(1, props);
    },

    // 作废
    cancel(props) {
      let vm = this;
      showConfirm({
        title: "是否作废？",
        onOk() {
          fetchData({
            ...apis.PRODUCTSRCDEVELOP_UPDATESTATUS,
            data: {
              sourceId: props.item.sourceId,
              status: 7
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", res.data.msg);
              vm.$refs.table.refresh();
            } else {
              showToast("error", res.data.msg);
            }
          });
        }
      });
    },

    // 查看日志
    seeLog(props) {
      let vm = this;
      showDialog(
        "logProductDev",
        { title: "操作日志", width: 1200 },
        { item: props.item }
      );
    },

    // 审核
    review(props) {
      this.create(2, props);
    },

    // 打回待编辑
    callbackToEdit(props) {
      let vm = this;
      showDialog(
        "calBackToWaitForEditorsDev",
        { title: "打回待编辑", width: 640 },
        { item: props.item },
        {
          // 绑定点击model确认事件
          set(childVm) {
            console.log(childVm.ruleForm);
            fetchData({
              ...apis.PRODUCTSRCDEVELOP_UPDATESTATUS,
              data: {
                sourceId: props.item.sourceId,
                status: 8,
                recoveryExplain: childVm.ruleForm.developDesc
              }
            }).then(res => {
              if (res.data.code === 0) {
                showToast("success", res.data.msg);
                vm.$refs.table.refresh();
                childVm.cancel();
              } else {
                showToast("error", res.data.msg);
              }
            });
          }
        }
      );
    },

    // 打回待审核
    callbackToReview(props) {
      let vm = this;
      getVue().$modal.confirm({
        title: "是否打回待审核？",
        content: "",
        onOk: function() {
          console.log("确定");
          fetchData({
            ...apis.PRODUCTSRCDEVELOP_UPDATESTATUS,
            data: {
              sourceId: props.item.sourceId,
              status: 8
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", res.data.msg);
              vm.$refs.table.refresh();
            } else {
              showToast("error", res.data.msg);
            }
          });
        },
        onCancel: function() {}
      });
    },

    // 打回待分配
    callbackToAssign(props) {
      let vm = this;
      getVue().$modal.confirm({
        title: "是否打回待分配？",
        content: "",
        onOk: function() {
          console.log("确定");
          fetchData({
            ...apis.PRODUCTSRCDEVELOP_UPDATESTATUS,
            data: {
              sourceId: props.item.sourceId,
              status: 8
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", res.data.msg);
              vm.$refs.table.refresh();
            } else {
              showToast("error", res.data.msg);
            }
          });
        },
        onCancel: function() {}
      });
    },

    // 开发完成
    doneDev(props) {
      let vm = this;

      showDialog(
        "productDevelopmentDoneDev",
        { title: "是否开发完成", width: 800, modalnoBtn: true },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set(childVm) {
            fetchData({
              ...apis.PRODUCTSRCDEVELOP_UPDATESTATUS,
              data: {
                sourceId: props.item.sourceId,
                status: 5,
                developDesc: childVm.ruleForm.developDesc,
                developPrice: childVm.ruleForm.developPrice
              }
            }).then(res => {
              if (res.data.code === 0) {
                showToast("success", res.data.msg);
                vm.$refs.table.refresh();
                childVm.cancel();
              } else {
                showToast("error", res.data.msg);
              }
            });
          }
        }
      );
    },

    // 分配
    assign(props) {
      let sourceId;
      let api = apis.PRODUCTSRCDEVELOP_UPDATESTATUS;
      if (!props) {
        sourceId = this.$refs.table.getCheckedData().map(el => el.userId);
        api = apis.PRODUCTSRCDEVELOP_BATCHUPDATESTATUS;
      } else {
        sourceId = props.item.sourceId;
      }
      let vm = this;
      showDialog(
        "assignManDev",
        { title: "分配开发人员", width: 640 },
        // { item: props.item },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set(childVm) {
            console.log(childVm.ruleForm);
            fetchData({
              ...api,
              data: props
                ? {
                    sourceId,
                    status: 4,
                    developerId: childVm.ruleForm.developerId
                  }
                : {
                    arrId: vm.$refs.table
                      .getCheckedData()
                      .map(el => el.sourceId),
                    status: 4,
                    developerId: childVm.ruleForm.developerId
                  }
            }).then(res => {
              if (res.data.code === 0) {
                showToast("success", res.data.msg);
                vm.$refs.table.refresh();
                childVm.cancel();
              } else {
                showToast("error", res.data.msg);
              }
            });
          }
        }
      );
    },

    handleCommand(command) {
      let vm = this;
      let data = this.$refs.table.getCheckedData();
      data = data.map(el => el.sourceId);
      if (!data.length) {
        showToast("error", "请选择至少一条数据进行操作");
        return;
      }

      // 批量审核 打回 作废
      if (command === "a" || command === "b" || command === "d") {
        let status;
        if (command === "a") {
          status = 3;
        }
        if (command === "b") {
          status = 8;
        }
        if (command === "d") {
          status = 7;
        }
        let vm = this;

        fetchData({
          ...apis.PRODUCTSRCDEVELOP_BATCHUPDATESTATUS,
          data: {
            arrId: data,
            status
          }
        }).then(res => {
          if (res.data.code === 0) {
            showToast("success", res.data.msg);
            vm.$refs.table.refresh();
          } else {
            showToast("error", res.data.msg);
          }
        });
      }

      // 分配 开发人员
      if (command === "c") {
        this.assign(null);
      }

      // 导出excel
      if (command === "e") {
        fetchData({
          ...apis.PRODUCTSRCDEVELOP_EXCELEXPORT,
          data: {
            sourceId: data
          }
          // responseType: "blob"
        }).then(res => {
          console.log(res);
          if (res.data.code === 0) {
            downloadFile(res.data.path);
          } else {
            showToast("error", res.data.msg);
          }

          vm.$refs.table.refresh();
        });
      }
    }
  },
  watch: {
    rangeDate2(val) {
      this.params.startDate = val[0];
      this.params.endDate = val[1];
    },
    "params.platformId"(val) {
      this.getSite(val);
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
