<template>
  <div>
    <v-form style="margin-bottom:20px" :model="ruleForm">
      <v-form-item label="型号">
        <v-input placeholder="" v-model="ruleForm.productSpeciation"></v-input>
      </v-form-item>
      <v-form-item label="价格">
        <PriceRange :range.sync="rangePrice"></PriceRange>
      </v-form-item>
      <v-form-item>
        <v-button type="primary" @click="getData">搜索</v-button>
      </v-form-item>
    </v-form>
    <v-data-table stripe ref="tableFu" :data='loadData' rowClickChecked :page-size="params.pageSize" :page-no="params.pageNumber" :height="600" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" :current-data.sync='tableData'>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='imgURL'">
          <img :src="props.content" :alt="props.column.title" width="80" height="80">
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import PriceRange from "components/base/priceRange.vue";
import { fetchData, fixFrameHeight } from "common/common";
import { browserType, debounce } from "common/util";
import apis, { GET_PRODUCT_PAC_LIST } from "apis";

export default {
  inheritAttrs: false,
  // props: ["type"],
  components: {
    PriceRange
  },
  created() {
    // 请求初始化数据
    if (!browserType()) {
      this.isIE11 = 20;
    }
  },
  data() {
    let self = this;
    return {
      ruleForm: {},
      rangePrice: [],
      isIE11: 0,
      params: {
        sortOrder: "asc",
        pageSize: 10,
        pageNumber: 1
      },
      selected: [],
      tableData: [],
      loadData(data) {
        if (self.$attrs.type) {
          self.params.relType = self.$attrs.type;
        }
        console.log(self.$attrs.type);
        let reqData = Object.assign({}, self.params, data, self.ruleForm);
        let opts = Object.assign({
          ...apis.PRODUCT_VARIANT_PAGE,
          data: reqData
        });
        return fetchData(opts).then(res => {
          return {
            result: res.data.rows,
            pageSize: res.data.pageSize,
            pageNo: res.data.pageNo,
            totalCount: res.data.total
          };
        });
      },
      columns: [
        {
          title: "类型",
          field: "sourceTypeString"
        },
        {
          title: "型号",
          field: "specification"
        },
        {
          title: "规格",
          field: "size"
        },
        {
          title: "价格",
          field: "salePrice"
        },
        {
          title: "备注",
          field: "remark"
        }
      ]
    };
  },
  methods: {
    getData() {
      this.$refs.tableFu.refresh();
    },
    select(arr) {
      this.selected = arr;
    },
    // 确认按钮
    ok() {
      this.$root.$children[0].asyncModalVisible = false;
      let arr = this.$refs.tableFu.getCheckedData();
      this.$listeners.set(arr);
    },
    // 表格
    checkAll: function(value) {
      console.log(value);
      this.checkAllMsg = "当前全选状态是：" + value;
      if (value) {
        this.select(this.tableData);
      } else {
        this.select([]);
      }
    },
    clickRow: function(obj) {
      console.log(obj);
      this.clickRowMsg = "当前点击第" + obj.index + "行";
      // this.selected.push(obj.row)
    }
  },
  watch: {
    rangePrice(val) {
      this.ruleForm.priceMin = val[0];
      this.ruleForm.priceMax = val[1];
    }
  }
};
</script>

<style>
</style>
