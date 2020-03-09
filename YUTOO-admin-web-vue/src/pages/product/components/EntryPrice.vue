<template>
  <div>
    <!-- {{tableData}} -->
    <v-data-table :data='loadData' :columns='columns' :currentData.sync="tableData">
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='entryPricePercent'">
          供应商报价
          <v-input style="width: 100px" :value="props.content" @input="handlerInput(props, $event)"></v-input>
          %
        </div>
        <div v-else>
          {{props.content}}
        </div>
      </template>
    </v-data-table>
    <div style="text-align:center" class="margin-top-20">
      <v-button type="primary" @click="save">保存</v-button>
    </div>
  </div>
</template>

<script>
import { fetchData, showToast } from "common/common";
import apis from "apis";

export default {
  data() {
    return {
      loadData() {
        return fetchData({ ...apis.PRODUCT_ENTRY_PRICE_PERCENT_LIST }).then(
          res => {
            if (res.data.code !== 0) {
              showToast("error", res.data.msg);
            }
            return {
              result: res.data.rows
            };
          }
        );
      },
      tableData: [],
      columns: [
        { title: "国家", field: "nationName" },
        { title: "报关比例", field: "entryPricePercent" }
      ]
    };
  },
  methods: {
    handlerInput(props, val) {
      props.item.entryPricePercent = val;
    },
    save() {
      fetchData({
        ...apis.PRODUCT_ENTRY_PRICE_PERCENT_BATCH_UPDATE,
        data: { productEntryPricePercentList: this.tableData }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        } else {
          showToast("success", res.data.msg);
        }
      });
    }
  }
};
</script>

<style>
</style>
