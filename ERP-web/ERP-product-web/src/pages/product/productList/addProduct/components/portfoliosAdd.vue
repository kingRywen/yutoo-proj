<template>
  <div>
    <div class="box">
      <h3>选择产品</h3>
      <v-form class="form" ref="ruleform">
        <v-form-item label="母sku">
          <v-select size="lg" v-model="ruleform.parentSku" style="width:200px" :data="data"></v-select>
        </v-form-item>
        <v-form-item label="产品名称">
          <v-input placeholder="请输入产品名称" v-model="ruleform.name"></v-input>
        </v-form-item>
        <v-form-item>
          <v-button type='primary' @click="search">搜索</v-button>
        </v-form-item>
      </v-form>

      <el-table v-loading="loading" row-key="productId" :data="tableList" @selection-change="handleSelectionChange" size='mini' class="margin-top-20" :max-height="360">
        <el-table-column reserve-selection type="selection" width="55" :selectable="isSelectable">
        </el-table-column>
        <el-table-column label="图片" prop="imgPath" align="center">
          <template slot-scope="scope">
            <div class="subItems">
              <el-tooltip placement="right" effect="light" :open-delay="300">
                <div slot="content">
                  <img :src="scope.row.imgPath && scope.row.imgPath.replace(/,w_\d+/ig, ',w_240') || '/static/no-image.jpg'">
                </div>
                <div class="divContent" style="position:relative">
                  <img :src="scope.row.imgPath || '/static/no-image.jpg'" :alt="scope.row.title">
                  <div class="groupFlag" v-if="scope.row.groupFlag">组合</div>
                </div>
              </el-tooltip>

            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" prop="variantNameZh"></el-table-column>
        <el-table-column label="系统SKU" prop="variantSku"></el-table-column>
        <el-table-column label="自定义SKU" prop="variantSkuCustom"></el-table-column>
        <el-table-column label="变体属性" prop="productPropertyEntities">
          <template slot-scope="scope">
            <div v-if="scope.row.productPropertyEntities"><span class="__distance" v-for="item in scope.row.productPropertyEntities">{{item.propertyName}}:{{item.propertyValue}}</span></div>
            <div v-else>-</div>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination class="margin-top-10 text-right" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="tableListPag.pageNo" :page-sizes="[5,10, 30, 50, 100]" :page-size="tableListPag.pageSize" :pager-count="11" layout="total, sizes, prev, pager, next, jumper" :total="tableListPag.total">
      </el-pagination>

    </div>
    <div class="box">
      <h3>已选产品</h3>

      <el-table :data="checkedData" size='mini' class="margin-top-20" :max-height="200" ref="selected">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="图片" prop="imgPath" align="center">
          <template slot-scope="scope">
            <div class="subItems">
              <el-tooltip placement="right" effect="light" :open-delay="300">
                <div slot="content">
                  <img :src="scope.row.imgPath && scope.row.imgPath.replace(/,w_\d+/ig, ',w_240') || '/static/no-image.jpg'">
                </div>
                <div class="divContent" style="position:relative">
                  <img :src="scope.row.imgPath || '/static/no-image.jpg'" :alt="scope.row.title">
                  <div class="groupFlag" v-if="scope.row.groupFlag">组合</div>
                </div>
              </el-tooltip>

            </div>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" prop="variantNameZh"></el-table-column>
        <el-table-column label="系统SKU" prop="variantSku"></el-table-column>
        <el-table-column label="自定义SKU" prop="variantSkuCustom"></el-table-column>
        <el-table-column label="变体属性" prop="productPropertyEntities">
          <template slot-scope="scope">
            <div v-if="scope.row.productPropertyEntities"><span class="__distance" v-for="item in scope.row.productPropertyEntities">{{item.propertyName}}:{{item.propertyValue}}</span></div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="产品数量" :render-header="renderProductTitle">
          <template slot-scope="scope">
            <el-input-number size="mini" width="200px" :precision="0" controls-position="right" :min="1" v-model="scope.row.relNum" style="width:100px" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="box text-center">
      <v-button type='primary' @click="save">确认</v-button>
    </div>
  </div>
</template>

<script>
import { fetchData, showToast } from "common/common";
import apis from "apis";
export default {
  created() {
    this.getSkus();
    this.setTableData();
  },
  data() {
    let vm = this;
    return {
      isSelectable(row, index) {
        if (row.selectFlag) {
          return false;
        }
        return true;
      },
      loading: false,
      tableList: [],
      tableData: [],
      tableListPag: {
        total: null,
        pageSize: 5,
        pageNo: 1
      },
      allNum: 1,
      productId: vm.$attrs.productId,
      ruleform: {},
      checkedDataCache: {},
      checkedData: [],
      data: []
    };
  },

  watch: {
    allNum(val) {
      this.checkedData.forEach(el => {
        el.relNum = val;
      });
    }
  },

  methods: {
    renderProductTitle(h, { column, $index }) {
      return (
        <el-input-number
          class="header__input"
          value={this.allNum}
          size="mini"
          width="100px"
          precision={0}
          onChange={e => {
            this.allNum = e;
          }}
          controls={false}
        />
      );
    },
    handleSizeChange(val) {
      this.setTableData({ pageSize: val });
    },
    handleCurrentChange(val) {
      this.setTableData({ pageNo: val });
    },
    handleSelectionChange(selection) {
      this.checkedData = selection;
      this.$nextTick(() => {
        this.$refs.selected.toggleAllSelection();
      });
    },

    setTableData(params = {}) {
      this.getTable({ ...this.tableListPag, ...this.ruleform, ...params }).then(
        data => {
          if (data) {
            data.rows.forEach(el => {
              if (el.relNum == null) {
                el.relNum = "";
              }
            });
            this.tableList = data.rows;
            this.tableListPag.pageSize = data.pageSize;
            this.tableListPag.pageNo = data.pageNo;
            this.tableListPag.total = data.total;
            this.$nextTick(() => {
              this.setDisabledChecked();
            });
          }
        }
      );
    },
    setDisabledChecked() {
      this.$el
        .querySelectorAll("tr td .el-checkbox__input.is-disabled")
        .forEach(element => {
          element.classList.add("is-checked");
        });
    },
    handleDataloaded(data) {
      let selected = [];
      data.forEach((el, index) => {
        if (el.selectFlag) {
          this.$refs.table.setChecked(index, true);
          selected.push(el);
        }
      });
      this.$nextTick(() => {
        this.$set(
          this.checkedDataCache,
          this.$refs.table.pageNumber,
          this.$refs.table.getCheckedData()
        );
        this.checkedData = this.$refs.table.getCheckedData();
        this.$refs.table1.refresh();
      });

      if (this.checkedDataCache[this.$refs.table.pageNumber]) {
        const selected = this.checkedDataCache[this.$refs.table.pageNumber];
        data.forEach((el, index) => {
          if (selected.find(_el => _el.productId === el.productId)) {
            this.$refs.table.setChecked(index, true);
          }
        });
      }
    },
    save() {
      let vm = this;
      let relVariant = vm.checkedData;
      relVariant.forEach(el => {
        if (el.relNum === "") {
          el.relNum = null;
        }
      });
      fetchData({
        ...apis.PRODUCT_VARIANT_REL_BATCH_SAVE,
        data: {
          parentIds: [],
          relType: 5,
          relVariant,
          variantIds: [vm.productId]
        }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        showToast("success", res.data.msg);
        vm.$listeners.set();
        vm.cancel();
      });
    },
    handleClickRow() {
      this.$set(
        this.checkedDataCache,
        this.$refs.table.pageNumber,
        this.$refs.table.getCheckedData()
      );
      // this.checkedData = this.$refs.table.getCheckedData();
      this.$refs.table1.refresh();
    },
    getSkus() {
      fetchData({
        ...apis.PRODUCT_PARENT_SKU_LIST,
        data: { productId: this.productId, parentFlag: 0 }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        this.data = res.data.rows.map(el => ({
          label: el,
          value: el
        }));
      });
    },
    // 获取列表
    getTable(pramas) {
      const { pageNo, pageSize } = pramas;
      this.loading = true;
      return fetchData({
        ...apis.PRODUCT_VARIANT_PAGE,
        data: {
          relType: 5,
          mainProductId: this.productId,
          pageSize: pageSize || 10,
          pageNumber: pageNo || 1,
          ...this.ruleform
        }
      }).then(res => {
        this.loading = false;
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
        } else {
          return res.data.rows;
        }
      });
    },

    cancel() {
      this.$root.$children[0].asyncModalVisible = false;
    },

    // 搜索
    search() {
      this.tableListPag.pageNo = 1
      this.setTableData();
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  margin-bottom: 10px;
}
h3 {
  margin-bottom: 6px;
}
</style>
<style lang="scss">
.box {
  .ant-table-small .ant-table-thead > tr > th {
    background: #e9e9e9;
  }
  .ant-table-footer {
    padding: 6px;
  }
}
</style>

