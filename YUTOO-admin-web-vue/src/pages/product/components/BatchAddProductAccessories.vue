<template>
  <div>
    <v-form style="margin-bottom:20px">
      <v-form-item>
        <v-button type="primary" @click="add" v-if="!$attrs.del">添 加</v-button>
        <v-button type="primary" @click="delete1" v-else>删 除</v-button>
      </v-form-item>
    </v-form>
    <v-data-table stripe ref="tableFu" :data='loadData' :pageSize="10" :height="600" :columns='columns' check-type="checkbox" :current-data.sync='tableData'>
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='edit'">
          <a @click="deleteItem(props)">删除</a>
        </div>
        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
    <div style="text-align:center">
      <v-button type="primary" @click="submit" size="large" v-if="!$attrs.del">批量添加产品配件</v-button>
    </div>
    <keep-alive>
      <v-modal title="添加产品" :width='1000' :visible="visible" @ok="handleOk" @cancel="handleCancel">
        <v-data-table stripe ref="tableAdd" :data='loadData1' :pagination="true" :page-size="params.pageSize" :page-no="params.pageNo" rowClickChecked :height="600" :columns='columns1' check-type="checkbox" :current-data.sync='tableData1'>
          <template slot="td" slot-scope="props">
            <div v-if="props.column.field=='imgPath'">
              <img :src="props.content" width="80" height="80">
            </div>
            <div v-else>{{props.content}}</div>
          </template>
        </v-data-table>
      </v-modal>
    </keep-alive>

  </div>
</template>

<script>
import { fetchData, fixFrameHeight, showToast } from "common/common";
import { browserType, debounce } from "common/util";
import apis, { GET_REP_OPTIONS, GET_PRODUCT_ACC_V } from "apis";
import _isEqual from "lodash/isEqual";

export default {
  inheritAttrs: false,
  created() {
    if (this.$attrs.del) {
      this.columns = [
        {
          title: "SKU",
          field: "variantSku"
        },
        {
          title: "产品名称",
          field: "variantNameZh"
        }
      ];
    }
  },
  data() {
    let self = this;
    return {
      ruleForm: {},
      visible: false,
      params: {
        pageSize: 10,
        pageNo: 1
      },
      repOptions: [],
      selected: [],
      tableData: [],
      tableData1: [],
      loadData(data) {
        let { parentIds, variantIds, del } = self.$attrs;
        if (del) {
          return fetchData({
            ...apis.PRODUCT_VARIANT_REL_BATCH_REMOVE_LIST,
            data: {
              parentIds,
              variantIds
            }
          }).then(res => {
            if (res.data.code === 0) {
              return {
                result: res.data.rows
              };
            }
          });
        } else {
          return Promise.resolve({
            result: []
          });
        }
      },
      loadData1(pramas) {
        return fetchData({
          ...apis.PRODUCT_VARIANT_PAGE,
          data: {
            relType: 1,
            sortOrder: "asc",
            pageSize: 10,
            pageNumber: 1
          }
        }).then(res => {
          return {
            result: res.data.rows,
            totalCount: res.data.total,
            pageSize: res.data.pageSize,
            pageNo: res.data.pageNo
          };
        });
      },
      columns: [
        {
          title: "SKU",
          field: "variantSku"
        },
        {
          title: "产品名称",
          field: "variantNameZh"
        },
        {
          title: "操作",
          field: "edit"
        }
      ],
      columns1: [
        {
          title: "产品图片",
          field: "imgPath"
        },
        {
          title: "系统SKU",
          field: "variantSku"
        },
        // {
        //   title: "客户产品编码",
        //   field: "productname"
        // },
        {
          title: "产品中文名称",
          field: "variantNameZh"
        },
        {
          title: "产品英文名称",
          field: "variantNameEn"
        },
        // {
        //   title: "采购人员",
        //   field: "price"
        // },
        {
          title: "默认本地发货仓库",
          field: "warehouseIdString"
        }
      ]
    };
  },
  methods: {
    handleOk() {
      this.visible = false;
      let _data = this.$refs.tableAdd.getCheckedData();
      this.tableData = _data;
    },
    deleteItem(props) {
      this.tableData.splice(props.index, 1);
    },
    handleCancel() {
      this.visible = false;
    },
    // 确认按钮
    ok() {
      // this.$root.$children[0].asyncModalVisible = false;
      // let arr = this.$refs.tableFu.getCheckedData();
      this.$listeners.set(this);
    },
    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },

    delete1() {
      let { parentIds, variantIds } = this.$attrs;
      let arrs = this.$refs.tableFu.getCheckedData().map(el => el.variantRelId);
      // let arrs = this.tableData.map(el => el.variantRelId);
      let promises = [];
      if (parentIds.length > 0) {
        let promise = fetchData({
          ...apis.PRODUCT_VARIANT_REL_REMOVE,
          data: {
            parentFlag: 1,
            relIds: arrs,
            relType: 1
          }
        });
        promises.push(promise);
      }

      if (variantIds.length > 0) {
        let promise = fetchData({
          ...apis.PRODUCT_VARIANT_REL_REMOVE,
          data: {
            parentFlag: 0,
            relIds: arrs,
            relType: 1
          }
        });
        promises.push(promise);
      }

      Promise.all(promises).then(res => {
        if (res.every(el => el.data.code === 0)) {
          showToast("success", "删除成功");
          this.$refs.tableFu.refresh();
        } else {
          showToast("error", res.map(el => el.data.msg).join(","));
        }
      });
    },

    add() {
      this.visible = true;
    },
    download() {},
    submit() {
      let arr = this.$refs.tableFu.getCheckedData();
      let { variantIds, parentIds } = this.$attrs;
      fetchData({
        ...apis.PRODUCT_VARIANT_REL_BATCH_SAVE,
        data: {
          variantIds,
          parentIds,
          relType: 1,
          relVariant: arr
        }
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", res.data.msg);
          this.cancel();
        }
      });
    },
    upload() {}
  },
  watch: {
    tableData1(val) {
      let vm = this;
      if (val.length > 0) {
        console.log(val);
        this.$nextTick(() => {
          val.forEach((element, index) => {
            if (vm.tableData.find(el => el.productId === element.productId)) {
              vm.$refs.tableAdd.setChecked(index, true);
            }
          });
        });
      }
    }
  }
};
</script>

<style>
</style>
