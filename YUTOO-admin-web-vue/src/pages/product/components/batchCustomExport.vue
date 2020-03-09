<template>
  <div class="__batchCustomExport__wrapper">
    <el-row :gutter="30">
      <el-col :span="10">
        <div class="grid-content bg-purple">
          <div class="title">
            <span>所有字段列表</span>
          </div>
          <v-data-table :data='allLists' check-type="checkbox" :columns='columns' bordered :currentData.sync="tableDataAll" ref="tableAll" @clickrow="handleClickrow" @checkall="handleCheckall">
          </v-data-table>
        </div>
      </el-col>
      <el-col :span="14">
        <div class="grid-content bg-purple">
          <div class="title _fixed_box">
            <span>已选中导出字段列表</span>
            <v-button type="primary" @click="exportExcel" :disabled="loading">导出</v-button>
          </div>
          <v-data-table :data='selectedList' :columns='columns1' bordered :currentData.sync="tableData" ref="tableSel" empty-text="请选择要导出的字段">
            <template slot="td" slot-scope="props">
              <div v-if="props.column.field=='edit'" class="edit">
                <span class="move" v-if="props.index !== 0" @click="up(props)">上移</span>
                <span v-else class="placeholder">上移</span>
                <span class="move" v-if="props.index !== tableData.length-1" @click="down(props)">下移</span>
                <span v-else class="placeholder">下移</span>
                <span class="move" @click="del(props)">删除</span>

              </div>
              <span v-else v-html="props.content"></span>
            </template>
          </v-data-table>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Vue from "vue";
import _isEqual from "lodash/isEqual";
import { Row, Col } from "element-ui";
import {
  fetchData,
  handlerCode,
  downloadFile,
  _storage,
  showToast
} from "common/common";
import apis from "apis";

Vue.use(Row);
Vue.use(Col);

export default {
  inheritAttrs: false,
  data: function() {
    let vm = this;
    return {
      loading: false,
      selectedData: [],
      allLists(pramas) {
        let api;
        let { type, productPlatformId, languageId, data } = vm.$attrs;
        console.log(productPlatformId, languageId);
        if (type === 1) {
          // 店铺导出
          return fetchData({
            ...apis.STORE_PRODUCT_LIST_DOWNLOAD_PROPERTIES,
            data: {
              productId: data.storeProductId,
              productType: data.productType
            }
          }).then(res => {
            if (res.data.code === 0) {
              return {
                result: res.data.rows.map((el, i) => ({
                  name: el.propertyHead,
                  id: el.sort,
                  ...el
                }))
              };
            } else {
              showToast("error", res.data.msg);
            }
          });
        } else if (type === 2) {
          // 平台产品导出
          return fetchData({
            ...apis.PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_LANGUAGE_FIELD_LIST,
            data: {
              productPlatformId,
              languageId
            }
          }).then(res => {
            if (res.data.code === 0) {
              let result = [];
              const fieldMap = res.data.rows.fieldMap;
              for (const key in fieldMap) {
                if (fieldMap.hasOwnProperty(key)) {
                  const element = fieldMap[key];
                  result.push({
                    name: key,
                    id: element
                  });
                }
              }
              return {
                result
              };
            } else {
              showToast("error", res.data.msg);
            }
          });
        } else {
          // 基础导出
          api = apis.CUSTOM_DOWNLOAD_FIELDST;

          return fetchData({ ...api }).then(res => {
            if (res.data.code === 0) {
              return {
                result: res.data.rows.map(el => ({
                  name: el.propertyName,
                  id: el.baseProPropId
                }))
              };
            } else {
              showToast("error", res.data.msg);
            }
          });
        }
      },
      selectedList(pramas) {
        return Promise.resolve({
          result: vm.selectedData
        });
      },
      columns: [
        { title: "序号", field: "propertySort" },
        { title: "名称", field: "name" }
      ],
      columns1: [
        { title: "序号", field: "propertySort" },
        { title: "名称", field: "name" },
        { title: "操作", field: "edit" }
      ],
      tableData: [],
      tableDataAll: []
    };
  },
  methods: {
    up(props) {
      let moved = this.tableData.splice(props.index, 1);
      this.tableData.splice(props.index - 1, 0, ...moved);
    },
    del(props) {
      let moved = this.tableData.splice(props.index, 1);
      this.tableDataAll.forEach((element, index) => {
        if (_isEqual(element, moved[0])) {
          console.log(index);
          this.$refs.tableAll.setChecked(index, false);
        }
      });
    },
    down(props) {
      let moved = this.tableData.splice(props.index, 1);
      this.tableData.splice(props.index + 1, 0, ...moved);
    },

    handleClickrow({ checked, row }) {
      if (!checked) {
        // 不选中
        this.tableData.forEach((el, index) => {
          if (el.name === row.name) {
            this.tableData.splice(index, 1);
          }
        });
      } else {
        // 选中,判断有没有，如果没有再添加，有的话不添加
        if (this.tableData.find(el => _isEqual(el, row))) {
          return;
        }
        this.tableData.push(row);
      }
    },

    handleCheckall(val) {
      if (val) {
        // 选中,判断有没有，如果没有再添加，有的话不添加
        this.tableDataAll.forEach(a => {
          if (this.tableData.find(el => _isEqual(el, a))) {
            return;
          }
          this.tableData.push(a);
        });
      } else {
        this.tableData.splice(0);
      }
    },

    exportExcel() {
      let {
        parentIds,
        variantIds,
        type,
        productPlatformId,
        languageId,
        data
      } = this.$attrs;
      let productType, productId;

      if (data) {
        productType = data.productType;
        productId = data.storeProductId;
      }

      if (type === 1) {
        // 店铺
        let properties = this.tableData;
        this.loading = true;
        fetchData({
          ...apis.STORE_PRODUCT_DOWNLOAD_CUSTOM_PUBLISH_INFO,
          data: {
            properties,
            productType,
            productId
          }
        }).then(res => {
          this.loading = false;
          handlerCode(res, () => {
            let path = res.data.rows.filePath;
            window.location.href = path;
          });
        });
      } else if (type === 2) {
        // 平台
        let fieldList = this.tableData.map(el => el.id);
        this.loading = true;
        fetchData({
          ...apis.PRODUCT_PLATFORM_DOWNLOAD_CUSTOM_FIELD,
          data: {
            fieldList,
            productPlatformId,
            languageId
          }
        }).then(res => {
          this.loading = false;
          handlerCode(res, () => {
            downloadFile(res.data.path);
          });
        });
      } else {
        // 基础
        this.loading = true;
        let list = this.tableData.map(el => el.id);
        fetchData({
          ...apis.PRODUCT_CUSTOM_DOWNLOAD,
          data: {
            list,
            parentIds,
            variantIds
          }
        }).then(res => {
          this.loading = false;
          handlerCode(res, () => {
            downloadFile(res.data.path);
          });
        });
      }
    }
  }
};
</script>

<style lang="less">
.__batchCustomExport__wrapper {
  * {
    font-size: 14px;
  }
  .el-card__header {
    background: #ebeef5;
  }
  .el-card__body {
    padding: 0;
  }
  .ant-table-tbody .ant-table-row:last-child {
    border-bottom: 0;
  }
  .ant-table-thead > tr > th {
    background: #fff;
  }
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td {
    padding: 8px;
  }
  .title {
    padding: 12px 10px;
    height: 57px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  ._fixed_box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .edit {
    span.move {
      cursor: pointer;
      margin: 0 6px;
    }
    .placeholder {
      visibility: hidden;
      margin: 0 6px;
    }
  }
}
</style>
