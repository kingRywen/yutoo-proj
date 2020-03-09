<template>
  <div>
    <v-form>

      <v-form-item label="关键字">
        <v-input></v-input>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select placeholder="来源平台" size="lg" style="width:100px" notfound="无法找到" :data="[{value: '1', label: '区域1'}, {value: '2', label: '区域2'}]"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select placeholder="采集人员" size="lg" style="width:100px" notfound="无法找到" :data="[{value: '1', label: '区域1'}, {value: '2', label: '区域2'}]"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select placeholder="状态" size="lg" style="width:100px" notfound="无法找到" :data="[{value: '1', label: '区域1'}, {value: '2', label: '区域2'}]"></v-select>
      </v-form-item>

      <v-form-item class="delLabel">
        <v-select placeholder="全部认领人" size="lg" style="width:100px" notfound="无法找到" :data="[{value: '1', label: '区域1'}, {value: '2', label: '区域2'}]"></v-select>
      </v-form-item>

      <v-form-item>
        <v-button type="primary">搜索</v-button>
      </v-form-item>
    </v-form>

    <div class="hr"></div>
    <div style="display:inline">
      <v-button type="primary" @click="add">添加采集</v-button>
      <v-button type="primary">批量认领</v-button>
      <v-button type="primary">批量删除</v-button>
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
            <strong v-if="props.column.field=='album'">操作</strong>
            <strong max-leh v-else v-html="props.title"></strong>
          </template>
          <template slot="td" slot-scope="props">

            <div v-if="props.column.field=='imgMUrl'" class="edit-box">
              <img :src="props.content" width="80" height="80">
            </div>
              <div v-else-if="props.column.field=='edit'" class="edit-box">
                <div>
                  <v-button size="small" type="primary">作废</v-button>
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
import CustomList from "components/base/customList";
import apis from "apis";

export default {
  name: "productList",
  components: {
    CustomList
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
          param: "3"
        },
        {
          text: "已认领",
          number: 3,
          param: "2"
        }
      ],
      columns: [
        {
          title: "图片",
          field: "imgMUrl",
          show: true
        },
        {
          title: "标题",
          field: "title",
          show: true
        },
        {
          title: "颜色/大小",
          field: "color",
          show: true
        },
        {
          title: "单价",
          field: "reference_price",
          show: true
        },
        {
          title: "来源信息",
          field: "collect_address",
          show: true
        },
        {
          title: "备注",
          field: "remark",
          show: true
        },
        {
          title: "认领信息",
          field: "assign_claim_id",
          show: true
        },
        {
          title: "状态",
          field: "status",
          show: true
        },
        {
          title: "操作",
          field: "edit",
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
    add() {
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
</style>
