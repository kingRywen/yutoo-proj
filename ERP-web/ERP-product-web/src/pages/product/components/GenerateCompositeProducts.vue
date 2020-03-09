<template>
  <div>
    <v-row class="margin-bottom-20" style="display: flex;align-items: center;">
      <v-col span="3">选择母体：</v-col>
      <v-col span="21">
        <el-select size="small" v-model="value" multiple placeholder="请选择" style="width:100%" filterable>
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </v-col>
    </v-row>

    <v-data-table stripe ref="table" :data='loadData' :pageSize="10" rowClickChecked :height="600" :columns='columns' check-type="checkbox" :current-data.sync='tableData'>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='imgPath'">
          <img :src="props.content || '/static/no-image.jpg'" :alt="props.column.title" width="80" height="80">
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>

    <v-form style="margin-top:20px" :model="ruleForm" direction="horizontal" :rules="rules" ref="ruleForm">
      <v-form-item label="组合产品中文名称" :label-col="{span:4}" :wrapper-col="{span:18}">
        <v-input v-model="ruleForm.nameZh"></v-input>
      </v-form-item>
      <v-form-item label="组合产品英文名称" :label-col="{span:4}" :wrapper-col="{span:18}">
        <v-input v-model="ruleForm.nameEn"></v-input>
      </v-form-item>
      <v-form-item label="组合产品自定义SKU" :label-col="{span:4}" :wrapper-col="{span:18}">
        <v-input v-model="ruleForm.skuCustom"></v-input>
      </v-form-item>
      <v-form-item label="组合产品包装清单" :label-col="{span:4}" :wrapper-col="{span:18}">
        <v-input v-model="ruleForm.packageList" type="textarea" :autosize="{minRows:6}"></v-input>
      </v-form-item>
      <v-form-item style="text-align:center">
        <v-button @click="save" type="primary">保存</v-button>
      </v-form-item>
    </v-form>
  </div>
</template>

<script>
import Vue from "vue";
import { Select, Option } from "element-ui";
import { fetchData, handlerCode, showToast } from "common/common";
import apis from "apis";
const _debounce = require("lodash/debounce");

Vue.use(Select);
Vue.use(Option);

export default {
  inheritAttrs: false,
  created() {
    this.refreshData = _debounce(this.refresh, 300);

    fetchData({
      ...apis.PRODUCT_PARENT_LIST,
      data: {
        sku: null
      }
    }).then(res => {
      if (res.data.code !== 0) {
        showToast("error", res.data.msg);
        return;
      }

      this.options = res.data.rows.map(el => ({
        label: `${el.sku}${el.nameZh ? ` - ${el.nameZh}` : ""}`,
        value: el.productId
      }));

      this.value = this.$attrs.data;
    });
  },
  methods: {
    ok() {
      this.$listeners.set(this);
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },

    refresh() {
      this.$refs.table.refresh();
    },

    save() {
      const { nameZh, nameEn, skuCustom, packageList } = this.ruleForm;
      let data = this.$refs.table.getCheckedData().map(el => el.productId);
      if (data.length <= 0) {
        showToast("info", "请选择要生成组合产品的变体");
        return;
      }
      fetchData({
        ...apis.PRODUCT_GROUP_ADD,
        data: {
          productId: data.shift(),
          productIds: data,
          nameZh,
          nameEn,
          skuCustom,
          packageList
        }
      }).then(res => {
        handlerCode(res, () => {
          this.cancel();
          this.$listeners.set();
        });
      });
    }
  },
  data() {
    let vm = this;
    return {
      loadData() {
        let params = {};
        if (vm.value.length > 0) {
          params.productIds = vm.value;
        }
        return fetchData({
          ...apis.PRODUCT_VARIANT_GROUP_LIST,
          data: { productIds: vm.$attrs.data, ...params }
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

      ruleForm: {},
      rules: {},

      value: null,
      options: [],
      tableData: [],
      columns: [
        {
          title: "图片",
          field: "imgPath"
        },
        {
          title: "产品名称",
          field: "prop"
        },
        {
          title: "系统SKU",
          field: "sku"
        },
        {
          title: "自定义SKU",
          field: "skuCustom"
        }
      ]
    };
  },
  watch: {
    value(val) {
      if (val.length == 0) {
        return;
      }
      this.refreshData();
    }
  }
};
</script>

<style>
</style>
