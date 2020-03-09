<template>
  <div class="__checkall_no">
    <v-form style="margin-bottom:20px" :model="ruleForm">
      <v-form-item label="sku">
        <v-input placeholder="" v-model="ruleForm.sku"></v-input>
      </v-form-item>
      <v-form-item label="产品名称">
        <v-input placeholder="" v-model="ruleForm.nameZh"></v-input>
      </v-form-item>
      <v-form-item label="发货仓库">
        <v-select style="width:200px" placeholder="选择仓库" size="lg" :data="repOptions" v-model="ruleForm.warehouseId"></v-select>
      </v-form-item>
    </v-form>
    <v-data-table stripe ref="tableFu" :data='loadData' :pageSize="10" rowClickChecked :height="600" :columns='columns' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" :bottomGap="isIE11" :current-data.sync='tableData'>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='imgPath'">
          <img :src="props.content || '/static/no-image.jpg'" :alt="props.column.title" width="50" height="50">
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
    <div style="text-align: center" v-if="$listeners.commit">
      <v-button type="primary" @click="commit" :loading="loading">{{$attrs.btnText}}</v-button>
    </div>

  </div>
</template>

<script>
import { fetchData, fixFrameHeight, showToast } from "common/common";
import { browserType, debounce } from "common/util";
import apis, { GET_REP_OPTIONS, GET_PRODUCT_ACC_V } from "apis";

export default {
  inheritAttrs: false,
  created() {},
  data() {
    let self = this;
    return {
      ruleForm: {},
      isIE11: 0,
      loading: false,
      repOptions: [
        {
          label: "1",
          value: 1
        },
        {
          label: "2",
          value: 2
        }
      ],
      selected: [],
      tableData: [],
      loadData(data) {
        let { storeProductPlatId, productType } = self.$attrs;
        let reqData = Object.assign({}, data, self.ruleForm, {
          storeProductPlatId,
          productType
        });
        reqData.pageNumber = reqData.pageNo;
        delete reqData.pageNo;
        delete reqData.sortColumns;
        let opts = Object.assign(
          {},
          apis.STORE_PRODUCT_PLAT_LIST_BASE_PRODUCT,
          {
            data: reqData
          }
        );
        return fetchData(opts).then(res => {
          if (res.data.code !== 0) {
            showToast("error", res.data.msg);
            return;
          }
          let data = res.data.rows;
          return {
            result: data.rows,
            totalCount: data.total,
            pageSize: data.pageSize,
            pageNo: data.pageNo
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
          field: "nameZh"
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
          title: "产品英文名称",
          field: "nameEn"
        },
        {
          title: "采购人员",
          field: "purchaser"
        },
        {
          title: "默认本地发货仓库",
          field: "warehouseName"
        }
      ]
    };
  },
  methods: {
    commit() {
      this.loading = true;
      this.$listeners.commit(this);
    },
    cancel() {
      this.loading = false;
      this.$root.$children[0].asyncModalVisible = false;
    },
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
      let arr = this.$refs.tableFu.getCheckedData();
      this.$listeners.set(arr);
    },
    // 表格
    checkAll: function(value) {
      return false;
    },
    clickRow: function(obj) {
      console.log(obj);
      this.tableData.forEach((el, index) => {
        if (index === obj.index) {
          return false;
        }
        this.$refs.tableFu.setChecked(index, false);
      });
    },
    getChecked() {
      return this.$refs.tableFu.getCheckedData();
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

<style lang="scss">
.__checkall_no {
  th.ant-table-selection-column {
    display: none;
  }
}
</style>
