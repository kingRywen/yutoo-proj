<template>
  <div>
    <v-form style="margin-bottom:20px;width:100%" direction="horizontal">
      <v-form-item style="width:100%" :label-col="{span:8}" :wrapper-col="{span:12}" label="选择新的供应商">
        <v-input style="width:100%" v-model="searchInput"></v-input>
      </v-form-item>
    </v-form>
    <v-data-table stripe ref="tableFu" :data='loadData' :pageSize="10" rowClickChecked :height="600" :columns='columns' check-type="checkbox" :current-data.sync='tableData'>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='imgURL'">
          <img :src="props.content" :alt="props.column.title" width="80" height="80">
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
    <div style="text-align:center">
      <v-button type="primary" @click="submit" size="large">批量更换供应商</v-button>
    </div>
  </div>
</template>

<script>
import { fetchData, fixFrameHeight, showToast } from "common/common";
import { browserType, debounce } from "common/util";
import apis from "apis";

export default {
  inheritAttrs: false,
  data() {
    let self = this;
    let { variantIds, parentIds } = this.$attrs;
    return {
      searchInput: "",
      ruleForm: {},
      repOptions: [],
      selected: [],
      tableData: [],
      loadData() {
        if (self.searchInput !== "" && self.searchInput != null) {
          return {
            result: self.filterData
          };
        }
        return fetchData({
          ...apis.PRODUCT_SUPPLIER_REL_LIST,
          data: { variantIds, parentIds }
        }).then(res => {
          console.log(res);
          if (res.data.code !== 0) {
            showToast("error", res.data.msg);
            return {
              result: []
            };
          }

          return {
            result: res.data.rows
          };
        });
      },
      columns: [
        {
          title: "SKU",
          field: "sku"
        },
        {
          title: "产品图片",
          field: "imgURL"
        },
        {
          title: "产品名称",
          field: "productname"
        },
        {
          title: "产品价格",
          field: "price"
        }
      ]
    };
  },
  methods: {
    // 确认按钮
    ok() {
      // this.$root.$children[0].asyncModalVisible = false;
      // let arr = this.$refs.tableFu.getCheckedData();
      this.$listeners.set(this);
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },
    download() {},
    submit() {},
    upload() {}
  },
  computed: {
    filterData() {
      return this.tableData.filter(
        el => el.name.indexOf(this.searchInput) >= 0
      );
    }
  }
};
</script>

<style>
</style>
