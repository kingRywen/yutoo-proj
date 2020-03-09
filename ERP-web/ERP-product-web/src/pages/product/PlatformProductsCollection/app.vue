<template>
  <div>
    <v-form>

      <v-form-item label="关键字">
        <v-input v-model="searchParams.seoKeyword"></v-input>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select placeholder="来源平台" v-model="searchParams.platformId" size="lg" style="width:100px" notfound="无法找到" :data="options3"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select placeholder="采集人员" v-model="searchParams.collectorId" size="lg" style="width:100px" notfound="无法找到" :data="options2"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select placeholder="状态" v-model="searchParams.status" size="lg" style="width:100px" notfound="无法找到" :data="[{value: 1, label: '采集中'}, {value: 2, label: '未认领'}, {value: 3, label: '已认领'}]"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select placeholder="全部认领人" v-model="searchParams.assignClaimId" size="lg" style="width:100px" notfound="无法找到" :data="options2"></v-select>
      </v-form-item>

      <v-form-item>
        <v-button type="primary" @click="search">搜索</v-button>
      </v-form-item>
    </v-form>

    <div class="hr"></div>
    <div style="display:inline">
      <v-button type="primary" @click="add">添加采集</v-button>
      <v-button type="primary" @click="batchSure">批量认领</v-button>
      <v-button type="primary" @click="batchDel">批量删除</v-button>
    </div>

    <v-row style="margin-top: 10px;" :gutter="16">
      <v-col span="20">
        <v-button-group style="width:100%" class="ant-btn-group-tabs">
          <v-button v-for="(item, key) in allBtns" @click="getNewData(item.param)" :key="key">{{item.text}}</v-button>
        </v-button-group>
      </v-col>
      <v-col span="4" style="text-align:right">
        <CustomList :data.sync="columns" save-field="PlatformProductsCollection_list"></CustomList>
      </v-col>
    </v-row>

    <v-row>
      <v-col>
        <v-data-table stripe :tree-option='treeOption' ref="table" :data='lists' :page-size="pageSize" :page-no="pageNo" :columns='columnsList' check-type="checkbox" :bottomGap="10" class="margin-top-10" :current-data.sync='tableData'>
          <template slot="th" slot-scope="props">
            <div class="text-center" v-if="props.column.field=='edit' || props.column.field=='imgMUrl'">
              <strong>{{props.column.title}}</strong>

            </div>
            <strong max-leh v-else v-html="props.title"></strong>
          </template>
          <template slot="td" slot-scope="props">

            <div v-if="props.column.field=='imgMUrl'" class="edit-box">
              <el-tooltip placement="right" effect="light" :open-delay="300">
                <div slot="content">
                  <img :src="props.content && props.content.replace(/,h_\d+,w_\d+/ig, ',h_240,w_240') || '/static/no-image.jpg'">
                </div>
                <div class="divContent" style="position:relative">
                  <img :src="props.content || '/static/no-image.jpg'" :alt="props.column.title">
                </div>
              </el-tooltip>
            </div>
            <div v-else-if="props.column.field=='edit'" class="edit-box btn_wrapper">
              <div>
                <el-tooltip v-if="props.item.status === 2" class="item" effect="dark" content="认领到产品库" placement="top-start" :open-delay="500">
                  <span @click.stop="toProduct(props)">
                    <i class="iconfont __editBtns" v-html="'&#xe77d;'"></i>
                  </span>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="作废" placement="top-start" :open-delay="500">
                  <span @click.stop="cancel(props)">
                    <i class="iconfont __editBtns" v-html="'&#xe7b7;'"></i>
                  </span>
                </el-tooltip>

              </div>
            </div>
            <div v-else-if="props.column.field=='collectAddress'">
              <el-tooltip class="item" effect="dark" :content="props.content" placement="top-start" :open-delay="500">
                <div style="max-width:260px" class="__ellapase">
                  <span>{{props.content}}</span>
                </div>
              </el-tooltip>
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
  showConfirm,
  handlerCode,
  showDialog
} from "common/common";
import { isArray, debounce, browserType } from "common/util";
import CustomList from "components/base/customList";
import apis from "apis";
import { Tooltip } from "element-ui";
import Vue from "vue";

Vue.use(Tooltip);

export default {
  name: "productList",
  components: {
    CustomList
  },
  created() {
    this.getUserList();
    this.getPlatformList();
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
      searchParams: {},
      options2: [],
      options3: [],
      searchComponent: "ytSimpleSearch",
      lists: data => {
        data.pageNumber = data.pageNo;
        delete data.pageNo;
        let reqData = Object.assign({}, data, this.params, this.searchParams);
        for (const key in reqData) {
          if (reqData.hasOwnProperty(key)) {
            const element = reqData[key];
            if (element === "") {
              delete reqData[key];
            }
          }
        }
        delete reqData.sortColumns;

        let opts = Object.assign(
          {},
          { ...apis.PRODUCTSRCCOLLECT_LIST },
          { data: reqData }
        );

        return fetchData(opts).then(res => {
          let data = res.data;
          if (data && data.rows && isArray(data.rows)) {
            data.rows.forEach((element, i) => {
              element.pid = 0;
            });
          }
          if (data && data.code === 500) {
            showToast("error", data.msg);
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
      allBtns: [
        {
          text: "全部",
          number: 3,
          param: null
        },
        {
          text: "采集中",
          number: 3,
          param: "1"
        },
        {
          text: "未认领",
          number: 3,
          param: "2"
        },
        {
          text: "已认领",
          number: 3,
          param: "3"
        }
      ],
      columns: [
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
          title: "标题",
          field: "seoTitle",
          show: true
        },
        {
          title: "颜色",
          field: "color",
          show: true
        },
        {
          title: "大小",
          field: "size",
          show: true
        },
        {
          title: "单价",
          field: "productPrice",
          show: true
        },
        {
          title: "平台",
          field: "platformName",
          show: true
        },
        // {
        //   title: "平台地址",
        //   field: "platformAddress",
        //   show: true
        // },
        {
          title: "地址",
          field: "collectAddress",
          show: true
        },
        {
          title: "被指派认领人",
          field: "assignClaimName",
          show: true
        },
        {
          title: "认领时间",
          field: "assignClaimTime",
          show: true
        },
        {
          title: "采集人",
          field: "collectorName",
          show: true
        },
        {
          title: "采集时间",
          field: "acquisitionTime",
          show: true
        },

        // {
        //   title: "认领产品SKU",
        //   field: "claimProductSku",
        //   show: true
        // },
        {
          title: "备注",
          field: "remark",
          show: true
        },
        {
          title: "状态",
          field: "statusName",
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
    search() {
      this.$refs.table.refresh();
    },
    toProduct(props) {
      let vm = this;
      showConfirm({
        content: "是否认领选定项？",
        onOk() {
          fetchData({
            ...apis.PRODUCTSRCCOLLECT_UPDATE,
            data: {
              sourceId: [props.item.sourceId]
            }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table.refresh();
            });
          });
        }
      });
    },
    cancel(props) {
      let vm = this;
      showConfirm({
        content: "是否作废选定项？",
        onOk() {
          fetchData({
            ...apis.PRODUCTSRCCOLLECT_REMOVE,
            data: {
              sourceId: [props.item.sourceId]
            }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table.refresh();
            });
          });
        }
      });
    },
    getNewData(id) {
      if (!id) {
        delete this.params.status;
      } else {
        this.params.status = +id;
      }

      this.$refs.table.refresh();
    },
    getUserList() {
      fetchData({ ...apis.DEVELOP_USER_LIST }).then(res => {
        console.log(res);
        if (res.data.code === 0) {
          res.data.rows.map(el => {
            el.label = el.nickName;
            el.value = el.userId;
          });
        }
        this.options2 = res.data.rows;
      });
    },
    getPlatformList() {
      fetchData({ ...apis.PLATFORM_LIST }).then(res => {
        console.log(res);
        if (res.data && res.data.length) {
          res.data.map(el => {
            el.label = el.name;
            el.value = el.platformId;
          });
        }
        this.options3 = res.data;
      });
    },
    batchSure() {
      let vm = this;
      let data = this.$refs.table.getCheckedData();
      if (!data.length) {
        showToast("warning", "请选择一条数据进行操作");
        return;
      }
      showConfirm({
        content: "是否批量认领选定项？",
        onOk() {
          fetchData({
            ...apis.PRODUCTSRCCOLLECT_UPDATE,
            data: {
              sourceId: data.map(el => el.sourceId)
            }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table.refresh();
            });
          });
        }
      });
    },
    batchDel() {
      let vm = this;
      let data = this.$refs.table.getCheckedData();
      if (!data.length) {
        showToast("warning", "请选择一条数据进行操作");
        return;
      }
      showConfirm({
        content: "是否批量删除选定项？",
        onOk() {
          fetchData({
            ...apis.PRODUCTSRCCOLLECT_REMOVE,
            data: {
              sourceId: data.map(el => el.sourceId)
            }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table.refresh();
            });
          });
        }
      });
    },
    add() {
      let vm = this;
      showDialog(
        "addProductDev",
        { title: "添加采集", width: 1000, modalnoBtn: true },
        {},
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set() {
            vm.$refs.table.refresh();
          }
        }
      );
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
.btn_wrapper {
  cursor: pointer;
}
</style>
