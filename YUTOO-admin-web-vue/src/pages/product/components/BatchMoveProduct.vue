<template>
  <div class="box __batchMove">
    <div class="item-1">
      <el-form :inline="true" style="width:450px;" class="form-item-variant">
        <el-form-item label="产品类目" class="form-item-category">
          <el-input v-model="formCategoryName" placeholder="请选择类目" size="mini" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="selectCategory">选择类目</el-button>
        </el-form-item>
        <el-form-item label="选择站点" v-if="pageType ==='shopProducts'">
          <el-select v-model="siteId" placeholder="请选择" size="mini" @change="getStoreBySiteIdList(true)">
            <el-option v-for="item in siteList" :key="item.siteId" :label="item.siteNameZh" :value="item.siteId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="选择店铺" v-if="pageType ==='shopProducts'">
          <el-select v-model="storeVariantListQuery.storeId" placeholder="请选择" size="mini" @change="getProductVariantMoveList">
            <el-option v-for="item in storeList" :key="item.storeId" :label="item.name" :value="item.storeId">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>

      <div class="table-title margin-top-20">需要挪动的产品</div>
      <el-form class="search-form">
        <el-form-item>
          <el-input v-model="variantListQuery.parentSku" placeholder="输入母体SKU " size="mini"></el-input>
          <el-button type="warning" size="mini" @click="handleVariantFilter">搜索</el-button>
          <el-button type="warning" size="mini" @click="customSkuList('variant');" style="margin-left: 0;">自定义输入SKU</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="variantList" :key='variantTableKey' v-loading="variantListLoading" style="width: 100%" height="250" tooltip-effect="dark" :header-cell-style="{background:'#f5f7fa'}" @selection-change="handleVariantSelectionChange">
        <el-table-column type="selection" :width="55">
        </el-table-column>
        <el-table-column label="图片" :min-width="80">
          <template slot-scope="scope">
            <img :src="scope.row.imgPath || '/static/no-image.jpg'" height="49">
          </template>
        </el-table-column>
        <el-table-column label="产品名称" :min-width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.nameZh!==undefined&&scope.row.nameZh!==null">中文:{{scope.row.nameZh}}</div>
            <div v-else-if="scope.row.nameCn!==undefined&&scope.row.nameCn!==null">中文:{{scope.row.nameCn}}</div>
            <div v-if="scope.row.nameEn!==null">英文:{{scope.row.nameEn}}</div>
          </template>
        </el-table-column>
        <el-table-column label="系统SKU" :width="150" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.sku!==undefined">{{scope.row.sku}}</div>
            <div v-else-if="scope.row.skuSys!==undefined">{{scope.row.skuSys}}</div>
          </template>
        </el-table-column>
        <el-table-column label="自定义SKU" min-width="120" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.skuCustom!==undefined">{{scope.row.skuCustom}}</div>
            <div v-else-if="scope.row.skuCus!==undefined">{{scope.row.skuCus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="类目" min-width="200">
          <template slot-scope="scope">
            <div v-if="pageType==='productList'">
              {{scope.row.categoryDetail}}
            </div>
            <div v-else-if="pageType==='shopProducts'">
              <div v-for="item in scope.row.variantProperties" :key="item.productStorePropertyId">{{item.propertyName}}: {{item.propertyValue}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination v-if="pageType ==='productList'" background @size-change="handleVariantSizeChange" @current-change="handleVariantCurrentChange" :current-page="variantListQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="variantListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="variantTotal">
        </el-pagination>
        <el-pagination v-else-if="pageType ==='shopProducts'" background @size-change="handleVariantSizeChange" @current-change="handleVariantCurrentChange" :current-page="storeVariantListQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="storeVariantListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="variantTotal">
        </el-pagination>
      </div>

      <div class="table-title margin-top-20">已选产品：</div>
      <el-table :data="productMoveShowList" :key='showTableKey' v-loading="showListLoading" style="width: 100%;margin-top: 5px;" height="250" tooltip-effect="dark" :header-cell-style="{background:'#f5f7fa'}" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column label="图片" min-width="80">
          <template slot-scope="scope">
            <img :src="scope.row.imgPath || '/static/no-image.jpg'" height="49">
          </template>
        </el-table-column>
        <el-table-column label="产品名称" min-width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.nameZh!==undefined&&scope.row.nameZh!==null">中文:{{scope.row.nameZh}}</div>
            <div v-else-if="scope.row.nameCn!==undefined&&scope.row.nameCn!==null">中文:{{scope.row.nameCn}}</div>
            <div v-if="scope.row.nameEn!==null">英文:{{scope.row.nameEn}}</div>
          </template>
        </el-table-column>
        <el-table-column label="系统SKU" min-width="120" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.sku!==undefined">{{scope.row.sku}}</div>
            <div v-else-if="scope.row.skuSys!==undefined">{{scope.row.skuSys}}</div>
          </template>
        </el-table-column>
        <el-table-column label="自定义SKU" width="150" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.skuCustom!==undefined">{{scope.row.skuCustom}}</div>
            <div v-else-if="scope.row.skuCus!==undefined">{{scope.row.skuCus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="类目" min-width="200" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="pageType==='productList'">
              {{scope.row.categoryDetail}}
            </div>
            <div v-else-if="pageType==='shopProducts'">
              <div v-for="item in scope.row.variantProperties" :key="item.productStorePropertyId">{{item.propertyName}}: {{item.propertyValue}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="table-title margin-top-20">挪动到</div>
      <el-form class="search-form search-form-end">
        <el-form-item>
          <el-input v-model="parentListQuery.sku" placeholder="输入母体SKU" size="mini"></el-input>

          <el-button type="warning" size="mini" @click="handleParentFilter">搜索</el-button>
          <el-button type="warning" size="mini" @click="customSkuList('parent')" style="margin-left: 0;">自定义输入SKU</el-button>
        </el-form-item>

      </el-form>
      <el-table :data="parentList" :key='parentTableKey' v-loading="parentListLoading" style="width: 100%" height="250" tooltip-effect="dark" :header-cell-style="{background:'#f5f7fa'}">
        <el-table-column label="" width="55">
          <template scope="scope">
            <el-radio :label="scope.row.productId" v-model="productId" v-if="pageType ==='productList'">&nbsp</el-radio>
            <el-radio :label="scope.row.storeProductParentId" v-model="productId" v-else-if="pageType ==='shopProducts'">&nbsp</el-radio>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="图片" min-width="80">
          <template slot-scope="scope">
            <img :src="scope.row.imgPath || '/static/no-image.jpg'" height="49">
          </template>
        </el-table-column>
        <el-table-column label="产品名称" min-width="240">
          <template slot-scope="scope">
            <div v-if="scope.row.nameZh!==undefined&&scope.row.nameZh!==null">中文:{{scope.row.nameZh}}</div>
            <div v-else-if="scope.row.nameCn!==undefined&&scope.row.nameCn!==null">中文:{{scope.row.nameCn}}</div>
            <div v-if="scope.row.nameEn!==null">英文:{{scope.row.nameEn}}</div>
          </template>
        </el-table-column>
        <el-table-column label="系统SKU" min-width="120" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.sku!==undefined">{{scope.row.sku}}</div>
            <div v-else-if="scope.row.skuSys!==undefined">{{scope.row.skuSys}}</div>
          </template>
        </el-table-column>
        <el-table-column label="自定义SKU" min-width="150" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="scope.row.skuCustom!==undefined">{{scope.row.skuCustom}}</div>
            <div v-else-if="scope.row.skuCus!==undefined">{{scope.row.skuCus}}</div>
          </template>
        </el-table-column>
        <el-table-column label="类目" min-width="200" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <div v-if="pageType==='productList'">
              {{scope.row.categoryDetail}}
            </div>
            <div v-else-if="pageType==='shopProducts'">
              <div>{{scope.row.propertyId}}</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination v-if="pageType ==='productList'" background @size-change="handleParentSizeChange" @current-change="handleParentCurrentChange" :current-page="parentListQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="parentListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parentTotal">
        </el-pagination>
        <el-pagination v-else-if="pageType ==='shopProducts'" background @size-change="handleParentSizeChange" @current-change="handleParentCurrentChange" :current-page="storeParentListQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="storeParentListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="parentTotal">
        </el-pagination>
      </div>
    </div>

    <div class="item-2">
      <el-button type="primary" @click="check()">确认挪动</el-button>
    </div>

    <v-modal :visible="visibleCategory" @ok="getCategoryOk" @cancel="visibleCategory=false">
      <ProductColumns ref="columns" v-on="handlers"></ProductColumns>
    </v-modal>

    <v-modal title="选中确认" width="520" :visible="pltSelectModal" @ok="pltSelectModalOk" @cancel="pltSelectModal=false">
      <div class="tip-plt-store-title">
        <div class="tip-plt-store-sku-title">sku</div>
        <div class="tip-plt-store-plt-title">目标母体导入数据平台</div>
        <div class="tip-plt-store-store-title">添加挪动变体店铺数据平台</div>
      </div>
      <div ref="tipPlt" class="tip-plt-store-box">
        <div v-for="item in tipPltArr" class="tip-plt-store">
          <div v-if="item.skuCustom!==undefined" class="tip-sku">
            {{item.skuCustom}}<div style="display:none">{{item.id}}</div>
          </div>
          <div v-if="item.plt!==undefined" class="tip-plt">
            {{item.plt}}:<input type="checkbox" class="tip-plt-checkbox" />
          </div>
          <div v-else class="tip-plt">&nbsp</div>
          <div v-if="item.store!==undefined" class="tip-store">
            {{item.store}}:<input type="checkbox" class="tip-store-checkbox" />
          </div>
        </div>
      </div>
    </v-modal>

    <v-modal title="自定义输入SKU" width="400" :visible="textareaSkuModal" @ok="submitSkuList()" @cancel="textareaSkuModal=false">
      <el-form ref="variantForm">
        <el-form-item>
          <el-input type="textarea" v-model="textareaSku" placeholder="请输入系统或自定义SKU，多个换行输入" :rows="3"></el-input>
        </el-form-item>
      </el-form>
    </v-modal>
  </div>
</template>
<script>
import Vue from "vue";
import {
  Form,
  FormItem,
  Input,
  Button,
  Table,
  TableColumn,
  Loading,
  Pagination,
  Message,
  Radio,
  Select,
  Option
} from "element-ui";
import { fetchData } from "common/common";
import ProductColumns from "./productColumns.vue";
import apis, {
  PRODUCT_MOVE_SHOW,
  PRODUCT_MOVE_PAGE_LIST,
  PRODUCT_VARIANT_MOVE_PAGE_LIST,
  PRODUCT_VARIANT_LIST_SKU,
  PRODUCT_VARIANT_MOVE_CHECK,
  PRODUCT_VARIANT_BATCH_MOVE,
  STORE_PRODUCT_MOVE_BATCH,
  STORE_PRODUCT_MOVE_VARIANT_LIST,
  STORE_PRODUCT_MOVE_PARENT_LIST,
  SITE_LIST,
  STORE_LIST_BY_SITE,
  STORE_PRODUCT_MOVE_CONFIRM
} from "apis";
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Input);
Vue.use(Button);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Loading);
Vue.use(Pagination);
Vue.use(Radio);
Vue.use(Select);
Vue.use(Option);
Vue.component(Message.name, Message);

export default {
  components: {
    ProductColumns
  },
  data() {
    var vm = this;
    return {
      handlers: {
        set(selected, arrs, name) {
          vm.visibleCategory = false;
          vm.categoryIds = arrs;
          vm.formCategoryName = name.join(">");
        }
      },
      // 页面类型
      pageType: this.$attrs.type,
      //产品
      variant: this.$attrs.variant,
      parent: this.$attrs.parent,
      siteId: null,
      siteList: [],
      storeList: [],
      formCategoryName: null,
      formSku: null,
      visibleCategory: false,
      categoryIds: null,

      showTableKey: 0,
      showListLoading: true,
      productMoveShowList: null,
      initProductMoveShowList: null, // 只读

      variantTableKey: 1,
      variantList: null,
      variantTotal: null,
      variantListLoading: true,

      textareaSku: null,
      textareaSkuModalType: "variant",
      textareaSkuModal: false,
      variantListQuery: {
        pageSize: 10,
        pageNumber: 1,
        sortOrder: "asc",
        categoryId: null, // 必填
        parentSku: null
      },
      parentTableKey: 2,
      parentList: null,
      parentTotal: null,
      parentListLoading: true,
      textareSku: null,
      parentListQuery: {
        pageSize: 10,
        pageNumber: 1,
        sortOrder: "asc",
        categoryId: null, // 必填
        sku: null,
        skuList: null // 数组
      },
      pltSelectModal: false,
      tipPltArr: [],
      moveSelectMsg: null,
      productMoveShowListSelect: null,
      productId: null,

      storeProductIds: this.$attrs.storeProductIds,
      storeVariantListQuery: {
        pageSize: 10,
        pageNumber: 1,
        sortOrder: "asc",
        categoryId: null,
        platformId: this.$attrs.platformId, // 平台id 暂时写死
        siteId: null, //站点id 暂时写死
        storeId: null,
        skuList: null
      },
      storeParentListQuery: {
        pageSize: 10,
        pageNumber: 1,
        sortOrder: "asc",
        categoryId: null,
        platformId: this.$attrs.platformId,
        siteId: null,
        skuList: null
      }
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      let vm = this;
      let params = {
        parentIds: vm.parent,
        variantIds: vm.variant
      };

      if (vm.pageType === "productList") {
        // 已选产品查询数据库
        vm.showListLoading = true;
        fetchData({
          ...PRODUCT_MOVE_SHOW,
          data: params
        })
          .then(res => {
            let { categoryDetail, categoryId, code, list, msg } = res.data;
            let listTmp = [];
            let categoryIdTmp = null;
            if (code === 0) {
              listTmp = list;
              categoryIdTmp = categoryId;
              if (categoryDetail !== null) {
                vm.formCategoryName = categoryDetail.replace(/;/g, ">");
              }
            } else {
              Message.error(msg || "服务器请求异常，请联系管理员");
              // this.$root.$children[0].asyncModalVisible = false;
            }
            vm.productMoveShowList = listTmp;
            vm.initProductMoveShowList = listTmp;
            vm.variantListQuery.categoryId = categoryIdTmp;
            vm.parentListQuery.categoryId = categoryIdTmp;
            vm.getProductVariantMoveList();
            vm.getProductMoveList();

            setTimeout(() => {
              vm.showListLoading = false;
            }, 1.5 * 1000);
          })
          .catch(err => {
            vm.showListLoading = false;
          });
      } else if (vm.pageType === "shopProducts") {
        fetchData({
          ...SITE_LIST,
          data: { platformId: vm.$attrs.platformId }
        })
          .then(res => {
            let { code, rows, msg } = res.data;
            if (code === 0) {
              vm.siteList = rows;
            } else {
              Message.error(msg || "服务器请求异常，请联系管理员");
            }
          })
          .catch(err => {
            console.log(err);
          });

        if (vm.storeProductIds.length !== 0) {
          vm.showListLoading = true;
          fetchData({
            ...STORE_PRODUCT_MOVE_BATCH,
            data: {
              platformId: vm.$attrs.platformId,
              storeProductIds: vm.storeProductIds
            } // [2518] vm.storeProductIds
          })
            .then(res => {
              let { code, rows, msg } = res.data;
              let listTmp = [];
              let categoryIdTmp = null;
              if (code === 0) {
                if (rows instanceof Object) {
                  let { site, store, variants, category } = rows;
                  listTmp = variants;
                  categoryIdTmp = category.categoryId;
                  vm.siteId = site.siteId;
                  vm.getStoreBySiteIdList(false);
                  vm.storeVariantListQuery.storeId = store.storeId;
                  vm.formCategoryName = category.categoryName.replace(
                    /;/g,
                    ">"
                  );
                }
              } else {
                Message.error(msg || "服务器请求异常，请联系管理员");
              }
              vm.productMoveShowList = listTmp;
              vm.initProductMoveShowList = listTmp;
              vm.storeVariantListQuery.categoryId = categoryIdTmp;
              vm.storeParentListQuery.categoryId = categoryIdTmp;

              vm.getProductVariantMoveList(true);
              vm.getProductMoveList();

              setTimeout(() => {
                vm.showListLoading = false;
              }, 1.5 * 1000);
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          vm.showListLoading = false;
          vm.variantListLoading = false;
          vm.parentListLoading = false;
        }
      }
    },
    getStoreBySiteIdList(t) {
      // t false  页面初始化的
      // t true 用户选择
      fetchData({
        ...STORE_LIST_BY_SITE,
        data: { siteIds: [this.siteId] }
      })
        .then(res => {
          let { code, rows, msg } = res.data;
          if (code === 0) {
            this.storeList = rows;
          } else {
            Message.error(msg || "服务器请求异常，请联系管理员");
          }
        })
        .catch(err => {
          console.log(err);
        });
      if (t) {
        this.getProductMoveList();
      }
    },
    getProductVariantMoveList(init) {
      let vm = this;
      vm.variantListLoading = true;
      let url = PRODUCT_VARIANT_MOVE_PAGE_LIST;
      let params = vm.variantListQuery;
      if (this.pageType === "shopProducts") {
        url = STORE_PRODUCT_MOVE_VARIANT_LIST;
        if (vm.siteId !== null) {
          vm.storeVariantListQuery.siteId = vm.siteId;
        }

        if (vm.storeVariantListQuery.categoryId === null) {
          vm.variantListLoading = false;
          Message.warning("类目不能为空！"); ///
          return;
        }

        if (vm.storeParentListQuery.siteId === null) {
          vm.variantListLoading = false;
          if (!init) {
            Message.warning("站点不能为空！");
          }

          return;
        }
        params = vm.storeVariantListQuery;
      }

      fetchData({
        ...url,
        data: params
      })
        .then(res => {
          let { code, rows, msg } = res.data;
          if (code === 0) {
            vm.variantList = rows.rows;
            vm.variantTotal = rows.total;
          } else {
            Message.error(msg || "服务器请求异常，请联系管理员");
          }
          setTimeout(() => {
            vm.variantListLoading = false;
          }, 1.5 * 1000);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleVariantFilter() {
      this.variantListQuery.pageNumber = 1;
      this.storeVariantListQuery.pageNumber = 1;
      this.getProductVariantMoveList();
    },
    handleVariantSizeChange(val) {
      this.variantListQuery.pageSize = val;
      this.storeVariantListQuery.pageSize = val;
      this.getProductVariantMoveList();
    },
    handleVariantCurrentChange(val) {
      this.variantListQuery.pageNumber = val;
      this.storeVariantListQuery.pageNumber = val;
      this.getProductVariantMoveList();
    },
    getProductMoveList() {
      let vm = this;
      vm.parentListLoading = true;
      let url = PRODUCT_MOVE_PAGE_LIST;
      let params = vm.parentListQuery;
      if (this.pageType === "productList") {
        if (vm.textareaSku !== null) {
          vm.parentListQuery.skuList = vm.textareaSku.split("\n");
          params = vm.parentListQuery;
        }
      } else if (this.pageType === "shopProducts") {
        url = STORE_PRODUCT_MOVE_PARENT_LIST;
        if (vm.siteId !== null) {
          vm.storeParentListQuery.siteId = vm.siteId;
        }

        if (vm.storeParentListQuery.categoryId === null) {
          vm.parentListLoading = false;
          Message.warning("类目不能为空！");
          return;
        }

        params = vm.storeParentListQuery;
      }
      fetchData({
        ...url,
        data: params
      })
        .then(res => {
          let { code, rows, msg } = res.data;
          if (code === 0) {
            vm.parentList = rows.rows;
            vm.parentTotal = rows.total;
          } else {
            Message.error(msg || "服务器请求异常，请联系管理员");
          }
          setTimeout(() => {
            vm.parentListLoading = false;
          }, 1.5 * 1000);
        })
        .catch(err => {
          console.log(err);
        });
    },
    handleParentFilter() {
      this.parentListQuery.pageNumber = 1;
      this.storeParentListQuery.pageNumber = 1;
      this.getProductMoveList();
    },
    handleParentSizeChange(val) {
      this.parentListQuery.pageSize = val;
      this.storeParentListQuery.pageSize = val;
      this.getProductMoveList();
    },
    handleParentCurrentChange(val) {
      this.parentListQuery.pageNumber = val;
      this.storeParentListQuery.pageNumber = val;
      this.getProductMoveList();
    },
    selectCategory() {
      this.visibleCategory = true;
      this.variantListLoading = false;
      this.showListLoading = false;
      this.parentListLoading = false;
    },
    getCategoryOk() {
      this.$refs.columns.set();
      let categoryIds = this.categoryIds;
      if (categoryIds !== null && categoryIds.length > 0) {
        let categoryId = categoryIds[categoryIds.length - 1];

        if (this.pageType === "productList") {
          this.variantListQuery.categoryId = categoryId;
          this.parentListQuery.categoryId = categoryId;
          this.getProductVariantMoveList();
          this.getProductMoveList();
        } else if (this.pageType === "shopProducts") {
          this.storeVariantListQuery.categoryId = categoryId;
          this.storeParentListQuery.categoryId = categoryId;
        }
      }
    },
    handleVariantSelectionChange(val) {
      if (val.length > 0) {
        this.productMoveShowList = JSON.parse(
          JSON.stringify(this.initProductMoveShowList)
        );
        if (this.productMoveShowList === null) {
          this.productMoveShowList = [];
        }
        val.forEach(element => {
          this.productMoveShowList.push(element);
        });
      } else {
        this.productMoveShowList = JSON.parse(
          JSON.stringify(this.initProductMoveShowList)
        );
      }
    },
    customSkuList(type) {
      this.textareaSkuModalType = type;
      this.textareaSku = null;
      this.variantListLoading = false;
      this.showListLoading = false;
      this.parentListLoading = false;
      this.textareaSkuModal = true;
    },
    submitSkuList() {
      // debugger;
      let type = this.textareaSkuModalType;

      let params = null;
      let url = PRODUCT_VARIANT_LIST_SKU;
      if (type === "variant") {
        //    if(this.variantListQuery.categoryId===null){
        //        Message.warning('类目为必填项!')
        //        return
        //    }
        if (this.textareaSku === null) {
          Message.warning("请输入sku!");
          return;
        }
        let skuList = this.textareaSku.split("\n");
        skuList = skuList.filter(item => item);
        if (skuList.length === 0) {
          Message.warning("请输入sku!");
          return;
        }
        params = { skuList };

        if (this.pageType === "productList") {
          fetchData({
            ...url,
            data: params
          })
            .then(res => {
              let { code, rows, msg } = res.data;
              if (code === 0) {
                if (type === "variant") {
                  let {
                    failNum,
                    successNum,
                    errMsg,
                    productVariantList
                  } = rows;
                  if (productVariantList.length !== 0) {
                    productVariantList.forEach(element => {
                      this.productMoveShowList.push(element);
                    });
                  }
                }
                // else if(type==='parent'){

                // }
              } else {
                Message.error(msg || "服务器请求异常，请联系管理员");
              }
            })
            .catch(err => {
              console.log(err);
            });
        } else if (this.pageType === "shopProducts") {
          this.storeVariantListQuery.skuList = skuList;
          this.getProductVariantMoveList();
        }
      } else if (type === "parent") {
        if (this.pageType === "productList") {
          this.handleParentFilter();
        } else if (this.pageType === "shopProducts") {
          if (this.textareaSku === null) {
            Message.warning("请输入sku!");
            return;
          }
          let skuList = this.textareaSku.split("\n");
          skuList = skuList.filter(item => item);
          if (skuList.length === 0) {
            Message.warning("请输入sku!");
            return;
          }
          this.storeParentListQuery.skuList = skuList;
          this.getProductMoveList();
        }
      }

      setTimeout(() => {
        this.textareaSkuModal = false;
      }, 500);
    },
    handleSelectionChange(val) {
      this.productMoveShowListSelect = val;
    },
    getMoveParams() {
      let variantIds = [];
      if (this.productMoveShowListSelect === null) {
        return null;
      }
      this.productMoveShowListSelect.forEach(element => {
        variantIds.push(element.productId);
      });
      let params = {
        productId: this.productId,
        variantIds
      };
      return params;
    },

    check() {
      if (this.pageType === "productList") {
        let params = this.getMoveParams();
        if (params === null) {
          Message.warning("已选产品列表下的 变体不能为空或请选中!");
          return;
        }
        if (params.productId === null) {
          Message.warning("需要挪动的产品列表下的 母体不能为空!");
          return;
        }
        fetchData({
          ...PRODUCT_VARIANT_MOVE_CHECK,
          data: params
        })
          .then(res => {
            let {
              code,
              failNum,
              successNum,
              errMsg,
              selectMsg,
              msg
            } = res.data;
            if (code === 0) {
              // let {failNum,successNum,errMsg,selectMsg} =rows
              let tipErr = "";
              Object.keys(errMsg).forEach(key => {
                tipErr +=
                  '<div style="padding-bottom: 3px;">' +
                  key +
                  " : " +
                  errMsg[key] +
                  "</div>";
              });
              if (JSON.stringify(selectMsg) === "{}" && tipErr !== "") {
                Message.warning({
                  dangerouslyUseHTMLString: true,
                  message: tipErr
                });
                return;
              }
              this.moveSelectMsg = selectMsg;
              this.tipPltArr = [];
              for (let p in selectMsg) {
                if (
                  selectMsg[p].plt !== undefined &&
                  selectMsg[p].store !== undefined
                ) {
                  let tip = {
                    id: p,
                    plt: selectMsg[p].plt,
                    skuCustom: selectMsg[p].skuCustom,
                    store: selectMsg[p].store
                  };
                  this.tipPltArr.push(tip);
                } else if (
                  selectMsg[p].plt !== undefined &&
                  selectMsg[p].store === undefined
                ) {
                  let tip = {
                    id: p,
                    plt: selectMsg[p].plt,
                    skuCustom: selectMsg[p].skuCustom
                  };
                  this.tipPltArr.push(tip);
                } else if (
                  selectMsg[p].plt === undefined &&
                  selectMsg[p].store !== undefined
                ) {
                  let tip = {
                    id: p,
                    skuCustom: selectMsg[p].skuCustom,
                    store: selectMsg[p].store
                  };
                  this.tipPltArr.push(tip);
                }
              }

              // 有plt弹出确认提示
              if (this.tipPltArr.length !== 0) {
                this.pltSelectModal = true;
              } else {
                // 直接挪动
                this.productVariantBatchMove(null);
              }
            } else {
              Message.error(msg || "服务器请求异常，请联系管理员");
            }
          })
          .catch(err => {
            console.log(err);
          });
      } else if (this.pageType === "shopProducts") {
        let variantIds = [];
        if (
          this.productMoveShowListSelect !== null &&
          this.productMoveShowListSelect.length > 0
        ) {
          this.productMoveShowListSelect.forEach(element => {
            variantIds.push(element.storeProductId);
          });
        }
        if (variantIds.length === 0) {
          Message.warning("已选产品列表下的 变体不能为空或请选中!");
          return;
        }
        if (this.productId === null) {
          Message.warning("需要挪动的产品列表下的 母体不能为空!");
          return;
        }
        const params = {
          targetParentId: this.productId,
          variantIds
        };

        fetchData({
          ...STORE_PRODUCT_MOVE_CONFIRM,
          data: params
        })
          .then(res => {
            let { msg, code } = res.data;
            if (code === 0) {
              Message({
                message: msg,
                type: "success"
              });
              this.$root.$children[0].asyncModalVisible = false;
              this.$listeners.set();
            } else {
              Message.error(msg || "服务器请求异常，请联系管理员");
            }
          })
          .catch(err => {
            console.log(err);
          });
      }
    },
    pltSelectModalOk() {
      let array = this.$refs.tipPlt.children;

      // 这里只有 plt，如果是store 就有问题
      let selectMsg = {};
      for (let index = 0; index < array.length; index++) {
        let skuCustom = array[index].children[0].innerText;
        let key = array[index].children[0].children[0].innerText;
        let plt = null;
        let store = null;
        let pltSelect = null;
        let storeSelect = null;
        // 判断 是否有 plt checkbox
        if (array[index].children[1].children.length === 1) {
          plt = array[index].children[1].innerText;
          pltSelect = array[index].children[1].children[0].checked ? 1 : 0;
        }
        // 判断 是否有 store checkbox
        if (array[index].children[2].children.length === 1) {
          store = array[index].children[2].innerText;
          storeSelect = array[index].children[2].children[0].checked ? 1 : 0;
        }
        if (plt !== null && store === null) {
          selectMsg[key] = {
            plt,
            skuCustom,
            pltSelect
          };
        } else if (plt === null && store !== null) {
          selectMsg[key] = {
            store,
            skuCustom,
            storeSelect
          };
        } else if (plt !== null && store !== null) {
          selectMsg[key] = {
            plt,
            store,
            skuCustom,
            pltSelect,
            storeSelect
          };
        } else {
          console.log("选中plt或store有问题，在挪动检查里");
          return;
        }
      }
      this.pltSelectModal = false;
      this.productVariantBatchMove(selectMsg);
    },
    productVariantBatchMove(tip) {
      let param = this.getMoveParams();
      let variantIds = [];

      for (let key in this.moveSelectMsg) {
        variantIds.push(Number(key));
      }
      let params = {
        productId: param.productId,
        variantIds,
        selectMsg: null
      };
      if (tip === null) {
        params.selectMsg = this.moveSelectMsg;
      } else {
        params.selectMsg = tip;
      }

      fetchData({
        ...PRODUCT_VARIANT_BATCH_MOVE,
        data: params
      })
        .then(res => {
          let { code, failNum, successNum, errMsg, selectMsg, msg } = res.data;
          if (code === 0) {
            // let {failNum,successNum,errMsg} =rows
            if (failNum === 0) {
              Message({
                message: "挪动成功",
                type: "success"
              });
            } else {
              // let tipErr =''
              // Object.keys(errMsg).forEach((key)=>{
              //     tipErr+='<div style="padding-bottom: 3px;">'+key+' : '+errMsg[key]+'</div>'
              // })
              if (successNum === 0) {
                Message.error("挪动全部失败");
              } else {
                Message.error(
                  "挪动失败:" + failNum + " 条；挪动成功:" + successNum + " 条"
                );
              }
            }
            this.$root.$children[0].asyncModalVisible = false;
            this.$listeners.set();
          } else {
            Message.error(msg || "服务器请求异常，请联系管理员");
          }
        })
        .catch(err => {
          console.log(res);
        });
      this.moveSelectMsg = null;
    }
  }
};
</script>
<style lang="less" scoped>
.box {
  .pagination-container {
    margin-top: 10px;
    background-color: #f5f7fa;
  }
  .item-1 {
    height: 650px;
    overflow-y: auto;
    padding: 5px 10px 5px 10px;
    border: 1px solid #dcdfe6;
    .table-title {
      font-size: 14px;
      color: #606266;
    }
    .form-item-variant {
      .el-form-item {
        margin-bottom: 0;
      }
      /deep/ .el-input--mini {
        width: 250px;
      }
    }
    .form-item-category {
      /deep/ .el-form-item__content {
        width: 250px;
      }
    }
    .el-textarea {
      width: 400px;
    }

    .search-form {
      /deep/ .el-input--mini {
        width: 200px;
      }
    }
    .search-form-end {
      .el-textarea {
        width: 200px;
      }
    }
  }
  .item-2 {
    margin-top: 10px;
    display: flex;
    justify-content: center;
  }
  .tip-plt-store-title {
    display: flex;
    color: #909399;
    font-weight: bold;
    .tip-plt-store-sku-title {
      width: 175px;
    }
    .tip-plt-store-plt-title {
      width: 150px;
    }
  }
  .tip-plt-store-box {
    height: 450px;
    overflow-y: auto;
    border: 1px solid #dcdfe6;
    padding: 5px;
    .tip-plt-store {
      margin-top: 5px;
      display: flex;
      border-bottom: solid 1px #dcdfe6;
      color: #909399;
      .tip-sku {
        width: 170px;
      }
      .tip-plt {
        width: 150px;
      }
      .tip-plt-checkbox,
      .tip-store-checkbox {
        vertical-align: -2px;
        margin-left: 5px;
      }
    }
  }
}
</style>
<style lang="less">
.el-select-dropdown__list,
.el-select-dropdown__empty {
  width: 248px;
}
.__batchMove {
  height: 100%;
  display: flex;
  flex-direction: column;
  .item-1 {
    flex: 1;
  }
  .el-table td,
  .el-table th {
    padding: 6px 0;
  }
  .el-table {
    font-size: 12px;
    .cell {
      line-height: 18px;
    }
  }
}
</style>



