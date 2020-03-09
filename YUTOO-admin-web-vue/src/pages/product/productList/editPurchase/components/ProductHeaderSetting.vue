<template>
  <div class="purchase_box">
    <v-button class="margin-bottom-20" :disabled="$attrs.show" type="primary" @click="add">添加头程</v-button>
    <v-button class="margin-bottom-20" :disabled="$attrs.show" type="primary" @click="select">选择头程</v-button>
    <!-- <v-button class="margin-bottom-20" :disabled="$attrs.show" type="primary" @click="toggle">切换运输方式</v-button> -->

    <el-tabs ref="tab" style="height:auto" type="card" v-model="name" class="info____tab">
      <el-tab-pane label="海运" name="海运" style="height:100%;overflow: auto" lazy>
        <v-data-table v-if="name === '海运'" stripe :tree-option='treeOption' ref="table" :data='list1' :columns='columns1' check-type="checkbox" :current-data.sync='tableData'>
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='priceType'">
              {{props.content === 1 ? '海运' : '空运'}}
            </div>
            <div v-else-if="props.column.field=='nw'">
              {{props.content}}(g)
            </div>
            <div v-else-if="props.column.field=='entryPrice'">
              {{props.content}}{{props.item.entryPriceUnit}}
            </div>
            <div v-else-if="props.column.field=='productVolume'">
              {{props.item.singleHigh * props.item.singleLong * props.item.singleWide}}(cm
              <sup>3</sup>)
            </div>
            <div v-else-if="props.column.field=='edit'">
              <v-button @click="edit(props)">编辑</v-button>
              <v-button @click="del(props)">删除</v-button>
            </div>
            <div v-else>{{props.content}}</div>
          </template>
        </v-data-table>
      </el-tab-pane>
      <el-tab-pane label="空运" name="空运" style="height:100%;overflow: auto" lazy>
        <v-data-table v-if="name === '空运'" stripe :tree-option='treeOption' ref="table" :data='list2' :columns='columns' check-type="checkbox" :current-data.sync='tableData'>
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='priceType'">
              {{props.content === 1 ? '海运' : '空运'}}
            </div>
            <div v-else-if="props.column.field=='productWeight'">
              {{props.content}}(g)
            </div>
            <div v-else-if="props.column.field=='entryPrice'">
              {{props.content}}{{props.item.entryPriceUnit}}
            </div>
            <div v-else-if="props.column.field=='productVolume'">
              {{props.item.singleHigh * props.item.singleLong * props.item.singleWide}}(cm
              <sup>3</sup>)
            </div>
            <div v-else-if="props.column.field=='edit'">
              <v-button @click="edit(props)">编辑</v-button>
              <v-button @click="del(props)">删除</v-button>
            </div>
            <div v-else>{{props.content}}</div>
          </template>
        </v-data-table>
      </el-tab-pane>
    </el-tabs>

    <div class="saveBtn" v-if="!$attrs.type">
      <div style="margin: 0 auto">
        <v-button type="primary" v-if="!$attrs.show" @click.prevent="submit" :loading="commitLoading">提交</v-button>
      </div>
    </div>

  </div>
</template>

<script>
import apis from "apis";
import {
  fetchData,
  showToast,
  showDialog,
  toParamUrl,
  handlerCode,
  showConfirm
} from "common/common";
import {
  PRODUCTHEADEREDITING,
  PRODUCTHEADERTOGGLE
} from "../../../componentName";
import { getQueryString } from "common/util";
export default {
  created() {
    this.productId = +getQueryString("productId");
    this.isVariant = getQueryString("variant");
    this.parentId = getQueryString("parentId");
  },
  data() {
    let vm = this;
    return {
      commitLoading: false,
      name: "海运",
      list1: data => {
        return vm.getList(1);
      },
      list2: data => {
        return vm.getList(2);
      },

      headerLists: [],

      params: {
        sortOrder: "asc",
        pageSize: 10,
        pageNumber: 1
      },
      columns: [
        {
          title: "到达国家",
          field: "nation"
        },
        {
          title: "运输方式",
          field: "priceType"
        },
        {
          title: "产品重量",
          field: "productWeight"
        },
        {
          title: "产品体积",
          field: "productVolume"
        },
        {
          title: "报关价格",
          field: "entryPrice"
        },
        {
          title: "头程空运参考",
          field: "freightType"
        },
        {
          title: "进出口税费比率参考",
          field: "tariff"
        },
        {
          title: "单个运费（RMB）",
          field: "freightPriceSingle"
        },
        {
          title: "单个税费（RMB）",
          field: "taxesSingle"
        },
        {
          title: "操作",
          field: "edit"
        }
      ],
      columns1: [
        {
          title: "到达国家",
          field: "nation"
        },
        {
          title: "运输方式",
          field: "priceType"
        },
        {
          title: "产品净重",
          field: "nw"
        },
        {
          title: "产品体积",
          field: "productVolume"
        },
        {
          title: "报关价格",
          field: "entryPrice"
        },
        {
          title: "头程空运参考",
          field: "freightType"
        },
        {
          title: "进出口税费比率参考",
          field: "tariff"
        },
        {
          title: "单个运费（RMB）",
          field: "freightPriceSingle"
        },
        {
          title: "单个税费（RMB）",
          field: "taxesSingle"
        },
        {
          title: "操作",
          field: "edit"
        }
      ],
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
      tableData: []
    };
  },
  methods: {
    submit() {
      this.commitLoading = true;
      fetchData({
        ...apis.PRODUCT_PURCHASE_COMMIT,
        data: {
          productId: this.productId
        }
      }).then(res => {
        this.commitLoading = false;
        // 如果保存成功，则保存productId，并且设置url的hash,以免用户刷新丢失id

        if (res.data.code === 0) {
          showToast("success", res.data.msg);
          toParamUrl("/product/productList.html");
        } else {
          showToast("error", res.data.msg);
        }
      });
    },
    edit(props) {
      let vm = this;
      showDialog(
        "ProductPurchaseAddHeader",
        { title: "编辑头程", width: 600 },
        {
          props
        },
        {
          set() {
            vm.$refs.table.refresh();
          }
        }
      );
    },
    del(props) {
      let vm = this;
      showConfirm({
        title: "是否删除此头程？",
        onOk() {
          fetchData({
            ...apis.PRODUCT_TRANSPORT_REL_REMOVE,
            data: { deleteIds: [props.item.transportRelId] }
          }).then(res => {
            handlerCode(res);
            vm.$refs.table.refresh();
          });
        }
      });
    },
    getList(type) {
      debugger;
      return fetchData({
        ...apis.PRODUCT_TRANSPORT_REL_LIST,
        data: {
          priceType: type,
          productId: this.isVariant ? this.parentId : this.productId
        }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        return {
          result: res.data.rows
        };
      });
    },
    add() {
      showDialog(
        "ProductPurchaseAddHeader",
        { title: "添加头程", width: 600 },
        {},
        {
          set() {
            console.log(123);
          }
        }
      );
    },
    select() {
      let vm = this;
      showDialog(
        "ProductPurchaseSelectHeader",
        { title: "选择头程", width: 800 },
        {
          productId: vm.productId,
          parentId: vm.parentId
        },
        {
          set() {
            vm.$refs.table.refresh();
          }
        }
      );
    },
    toggle(props) {
      console.log(props);
      let vm = this;
      showDialog(
        PRODUCTHEADERTOGGLE,
        { title: "切换运输方式", width: 600 },
        {
          item: vm.headerLists
        },
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(data) {}
        }
      );
    },
    openHeaderUrl() {
      window.open("/WarehousingLogisticsManagement.html");
    },
    editItem(props) {
      let vm = this;
      showDialog(
        PRODUCTHEADEREDITING,
        { title: "设置产品头程", width: 1000 },
        {
          item: props.item
        },
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(data) {}
        }
      );
    }
  }
};
</script>

<style>
</style>
