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
    <v-data-table stripe ref="tableFu" :data='loadData' rowClickChecked :page-size="params.pageSize" :page-no="params.pageNumber" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="100" :current-data.sync='tableData'>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='imgPath'">
          <img :src="props.content || '/static/no-image.jpg'" :alt="props.column.title" width="80" height="80">
        </div>
          <div v-else-if="props.column.field=='price'">
            {{props.item.price}}{{props.item.priceUnit}}
          </div>
          <div v-else-if="props.column.field=='spec'">
            <p>长{{props.item.singleLong}}{{props.item.lengthUnit}} x 宽{{props.item.singleWide}}{{props.item.widthUnit}} x 高{{props.item.singleHigh}}{{props.item.heightUnit}}</p>
            <p>体积{{props.item.volume}}{{props.item.lengthUnit}}
              <sup>3</sup>
            </p>
            <p>重量{{props.item.weight}}{{props.item.weightUnit}}</p>
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

    if (this.$attrs.tableType) {
      if (this.$attrs.type === 3) {
        this.columns = [
          {
            title: "类型",
            field: "typeDesc"
          },
          {
            title: "型号",
            field: "specification"
          },
          {
            title: "规格",
            field: "spec"
          },
          {
            title: "价格",
            field: "price"
          },
          {
            title: "备注",
            field: "packageRemark"
          }
        ];
        return;
      }
      this.columns = [
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
      ];
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
        let api = apis.PRODUCT_VARIANT_PAGE;
        // debugger
        const type = self.$attrs.type;
        // if (self.$attrs.type) {
        //   self.params.relType = 3; // type = 3  物流包材   type = 4 原材料
        // }
        self.params.relType = type;

        if (type === 3) {
          api = apis.LOGISTIC_PACKAGE_PAGE_LIST;
        }
        console.log(self.$attrs.type);
        let reqData = Object.assign({}, self.params, data, self.ruleForm);
        let opts = Object.assign({
          ...api,
          data: reqData
        });
        return fetchData(opts).then(res => {
          const data =
            type === 3 || type === 1 || type === 2 ? res.data.rows : res.data;
          return {
            result: data.rows,
            pageSize: data.pageSize,
            pageNo: data.pageNo,
            totalCount: data.total
          };
        });
      },
      columns: [
        {
          title: "图片",
          field: "imgPath"
        },
        {
          title: "产品名称",
          field: "variantNameZh"
        },
        {
          title: "系统SKU",
          field: "variantSku"
        },
        {
          title: "自定义SKU",
          field: "variantSkuCustom"
        },
        {
          title: "采购人员",
          field: "purchaseName"
        },
        {
          title: "默认发货仓库 / 默认供应商发货仓",
          field: "warehouseIdString"
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
