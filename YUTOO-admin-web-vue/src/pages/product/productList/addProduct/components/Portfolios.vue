<template>
  <div>
    <v-data-table :data='data' :columns='columns' bordered :currentData.sync="tableData" ref="table" empty-text="暂无组合产品">
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='edit' && !$attrs.show">
          <a class="edit" v-if="!props.item.isEdit" @click.self="edit(props)">修改</a>
          <a class="edit" v-else @click.self="save(props)">保存</a>
        </div>
        <div v-else-if="props.column.field=='imgPath'">
          <img :src="props.content || '/static/no-image.jpg'" width="80" height="80">
        </div>
        <div v-else-if="props.column.field=='relNum'">
          <v-input v-if="props.item.isEdit" :value="props.content" @input="val => props.item._value= val"></v-input>
          <span v-else v-html="props.content"></span>
        </div>
        <span v-else v-html="props.content"></span>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import { fetchData, handlerCode, showToast } from "common/common";
import { getQueryString } from "common/util";
import apis from "apis";

export default {
  created() {
    this.productId = +getQueryString("productId");
  },
  data() {
    let vm = this;
    return {
      data(pramas) {
        let data = {
          productId: vm.productId,
          relType: 5
        };
        return fetchData({ ...apis.PRODUCT_VARIANT_REL_LIST, data }).then(
          res => {
            return {
              result: res.data.rows
            };
          }
        );
      },
      columns: [
        { title: "系统sku", field: "variantSku" },
        { title: "自定义sku", field: "variantSkuCustom" },
        { title: "图片", field: "imgPath" },
        { title: "数量", field: "relNum" },
        { title: "产品名称", field: "variantNameZh" },
        { title: "产品价格", field: "salePrice" },
        { title: "添加时间", field: "createTime" },
        { title: "操作", field: "edit" }
      ],
      tableData: []
    };
  },
  methods: {
    edit(props) {
      this.setTableData(props, "isEdit", true);
    },

    save(props) {
      console.log(12313123);
      if (isNaN(props.item._value)) {
        showToast("error", "请输入合法数字");
        return;
      }
      if (!Number.isInteger(+props.item._value)) {
        showToast("error", "请输入合法数字");
        return;
      }
      fetchData({
        ...apis.PRODUCT_VARIANT_REL_UPDATE,
        data: {
          relNum: +props.item._value,
          variantRelId: props.item.variantRelId,
          relType: 5
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.setTableData(props, "relNum", +props.item._value);
          this.setTableData(props, "isEdit", false);
        } else {
          this.setTableData(props, "isEdit", false);
          showToast("error", res.data.msg);
        }
      });
    },

    setTableData(props, key, val) {
      let el = this.tableData.splice(props.index, 1);
      this.tableData.splice(props.index, 0, {
        ...el[0],
        [key]: val
      });
    }
  }
};
</script>

<style>
</style>
