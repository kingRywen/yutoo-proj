<template>
  <div class="purchase_box">
    <v-data-table stripe :tree-option='treeOption' ref="table" :data='list' :columns='columns' class="margin-top-25" :current-data.sync='tableData'>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='sku'">
          {{props.item.variant.sku}}
        </div>
        <div v-if="props.column.field=='skuCustom'">
          {{props.item.variant.skuCustom}}
        </div>
        <div v-if="props.column.field=='remark'">
          {{props.item.variant.activateRemark || ''}}
        </div>
        <div v-if="props.column.field=='edit'">
          <v-button :type="props.item.variant.activateFlag?'':'primary'" @click="setStatu(props, false)">无效</v-button>
          <v-button :type="props.item.variant.activateFlag?'primary':''" @click="setStatu(props, true)">有效</v-button>
        </div>
        <div v-else>
          {{props.content}}
        </div>

      </template>
    </v-data-table>
  </div>
</template>

<script>
import apis from "apis";
import { fetchData, showDialog } from "common/common";
import { getQueryString } from "common/util";
import { PRODUCT_VARIANT_STATUS } from "../../../componentName";
export default {
  data() {
    let vm = this;
    return {
      list: data => {
        return fetchData({
          ...apis.PRODUCT_VARIANT_PURCHASE_TAB,
          data: { productId: +getQueryString("productId") }
        }).then(res => {
          let data = res.data;
          delete data.code;
          let productVariantList = data.productVariantList;
          this.$emit("update:data", data);
          if (productVariantList) {
            productVariantList.forEach((element, i) => {
              element.pid = 0;
            });
          }
          let ret = {
            result: productVariantList
          };
          console.log(ret);
          return ret;
        });
      },
      columns: [
        {
          title: "操作",
          field: "edit"
        },
        {
          title: "系统SKU",
          field: "sku"
        },
        {
          title: "自定义SKU",
          field: "skuCustom"
        },
        {
          title: "备注",
          field: "remark"
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
      tableData: [],
      isActive: true
    };
  },
  methods: {
    // 设置变体状态
    setStatu(props, status) {
      console.log(props);
      let variant = props.item.variant;
      let vm = this;
      showDialog(
        PRODUCT_VARIANT_STATUS,
        {
          title: "备注",
          width: 800,
          okText: "确认"
        },
        { ...props, status: status ? 1 : 0 },
        {
          set(val) {
            console.log(val);
            vm.$refs.table.refresh();
            // vm.
          }
        }
      );
      // fetchData({
      //   ...apis.PRODUCT_VARIANT_UPDATE,
      //   data: {
      //     productId: variant.productId,
      //     activateFlag: status ? 1: 0,
      //     activateRemark: "11"
      //   }
      // }).then(res => {
      //   console.log(res);
      // });
    }
  }
};
</script>

<style>
</style>
