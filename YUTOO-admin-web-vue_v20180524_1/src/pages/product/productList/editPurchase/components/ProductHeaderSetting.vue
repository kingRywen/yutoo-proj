<template>
  <div class="purchase_box">
    <v-data-table stripe :tree-option='treeOption' ref="table" :data='list' :columns='columns' check-type="checkbox" class="margin-top-25" :current-data.sync='tableData'>
      <template slot="th" slot-scope="props">
        <strong v-if="props.column.field=='freightType'">头程空运参考
          <a @click="toggle(props)"> (切换)</a>
        </strong>
        <strong max-leh v-else v-html="props.title"></strong>
      </template>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='nationName'">
          {{props.item.transportItem.nationName}}
        </div>
        <div v-else-if="props.column.field=='productWeight'">
          {{props.item.transportItem.productWeight}}(g)
        </div>
        <div v-else-if="props.column.field=='productVolume'">
          {{props.item.transportItem.productVolume}}(cm³)
        </div>
        <div v-else-if="props.column.field=='entryPrice'">
          {{props.item.transportItem.entryPrice}}
        </div>
        <!-- 运输参考 -->
        <div v-else-if="props.column.field=='freightType'">
          {{props.item.transportFistList["0"].freightType}}
        </div>
        <div v-else-if="props.column.field=='tariff'">
          {{props.item.transportItem.tariff}}
        </div>
        <div v-else-if="props.column.field=='freightPriceSingle'">
          {{props.item.transportItem.freightPriceSingle}}
        </div>
        <div v-else-if="props.column.field=='taxesSingle'">
          {{props.item.transportItem.taxesSingle}}
        </div>
        <div v-else-if="props.column.field=='edit'">
          <v-button type="primary" @click="editItem(props)">编辑</v-button>
          <v-button type="primary" @click="openHeaderUrl">头程管理</v-button>
        </div>
        <div v-else>{{props.content}}</div>

      </template>
    </v-data-table>
  </div>
</template>

<script>
import apis from "apis";
import { fetchData, showToast, showDialog } from "common/common";
import {
  PRODUCTHEADEREDITING,
  PRODUCTHEADERTOGGLE
} from "../../../componentName";
import { getQueryString } from "common/util";
export default {
  data() {
    let vm = this;
    return {
      list: data => {
        return fetchData({
          ...apis.PRODUCT_TRANSPORT_REL_LIST,
          data: { productId: +getQueryString("productId"), ...this.params }
        }).then(res => {
          let data = res.data;
          if (data.code === 500) {
            showToast("error", data.msg);
          }
          let ret = {
            result: data
          };
          let transportFistList = data[0].transportFistList;
          this.headerLists = transportFistList.map(el => el.freightType);

          console.log(ret);
          return ret;
        });
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
          field: "nationName"
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
