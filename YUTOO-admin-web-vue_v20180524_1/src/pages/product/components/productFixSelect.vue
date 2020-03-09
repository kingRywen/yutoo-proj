<template>
  <div>
    <v-form style="margin-bottom:20px" :model="ruleForm">
      <v-form-item label="sku">
        <v-input placeholder="" v-model="ruleForm.sku"></v-input>
      </v-form-item>
      <v-form-item label="产品名称">
        <v-input placeholder="" v-model="ruleForm.name"></v-input>
      </v-form-item>
      <v-form-item label="发货仓库">
        <v-select style="width:200px" placeholder="选择仓库" size="lg" :data="repOptions" v-model="ruleForm.rep"></v-select>
      </v-form-item>
    </v-form>
    <v-data-table stripe ref="tableFu" :data='loadData' :pageSize="10" rowClickChecked :height="600" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" :current-data.sync='tableData'>
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
import { fetchData, fixFrameHeight } from "common/common";
import { browserType, debounce } from "common/util";
import { GET_REP_OPTIONS, GET_PRODUCT_ACC_V } from "apis";

export default {
  inheritAttrs: false,
  created() {
    fetchData(GET_REP_OPTIONS).then(res => {
      this.repOptions = res.data.rows;
    });
    // 请求初始化数据
    if (!browserType()) {
      this.isIE11 = 20;
    }
  },
  data() {
    let self = this
    return {
      ruleForm: {},
      isIE11: 0,
      repOptions: [],
      selected: [],
      tableData: [],
      loadData(data) {
        let reqData = Object.assign({}, data, self.ruleForm);
        let opts = Object.assign({}, GET_PRODUCT_ACC_V, { data: reqData });
        return fetchData(opts).then(res => {
          return res.data;
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
    getData() {
      this.$refs.tableFu.refresh();
    },
    sendData: debounce(300, function() {
      this.getData();
    }),
    select(arr) {
      this.selected = arr;
    },
    // 确认按钮
    ok() {
      this.$root.$children[0].asyncModalVisible = false;
      let arr = this.$refs.tableFu.getCheckedData()
      this.$listeners.set(arr)
    },
    // 表格
    checkAll: function(value) {
      console.log(value);
      this.checkAllMsg = "当前全选状态是：" + value;
      if (value) {
        this.select(this.tableData)
      } else {
        this.select([])
      }
    },
    clickRow: function(obj) {
      console.log(obj);
      this.clickRowMsg = "当前点击第" + obj.index + "行";
      // this.selected.push(obj.row)
    }
  },
  watch: {
    ruleForm: {
      handler: function(v) {
        console.log(v);
        this.sendData();
      },
      deep: true
    }
  }
};
</script>

<style>
</style>
