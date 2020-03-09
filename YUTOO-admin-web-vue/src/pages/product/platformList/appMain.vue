<template>
  <CustomTransition>
    <div>
      <v-form :model="ruleForm">
        <v-form-item label="SKU">
          <v-select style="width: 120px;" size="lg" v-model="ruleForm.skuType" :data="skuSelectOptions" :allowClear="false"></v-select>
        </v-form-item>
        <v-form-item>
          <v-input type="text" v-if="ruleForm.skuType == 1" v-model="ruleForm.sku" placeholder="请输入SKU"></v-input>
          <v-input type="text" v-else v-model="ruleForm.skuCustom" placeholder="请输入SKU"></v-input>
        </v-form-item>
        <v-form-item label="产品名称">
          <v-input type="text" v-model="ruleForm.nameZh" placeholder="请输入产品名称"></v-input>
        </v-form-item>
        <v-form-item label="语种">
          <v-select style="width: 120px;" size="lg" v-model="ruleForm.languageId" :data="langSelectOptions"></v-select>
        </v-form-item>
        <v-form-item label="编辑状态">
          <v-select style="width: 120px;" size="lg" v-model="ruleForm.productPlatformStatus" :data="statusSelectOptions"></v-select>
        </v-form-item>
        <v-form-item>
          <v-button type="primary" html-type="button" @click.prevent="searchLists">搜索</v-button>
        </v-form-item>
      </v-form>
      <div class="hr"></div>
      <div style="display:inline">
        <v-button type="primary" @click="OneTouchImport">一键导入</v-button>
        <v-button type="primary" @click="selectImport">选择导入</v-button>
        <v-button type="primary" @click="batchReview">批量下架</v-button>
        <!-- <v-button type="primary" @click="batchReview">批量审核</v-button> -->
        <el-dropdown @command="batchAssign">
          <v-button type="primary">批量分配人员
            <v-icon type="down" size="sm"></v-icon>
          </v-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="btn.key" v-for="btn in editorList">{{btn.value}}</el-dropdown-item>
            <!-- <el-dropdown-item command="b">分配中文编辑人员</el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
        <v-button type="primary" @click="customExport">自定义导出</v-button>
      </div>

      <v-row style="margin-top: 10px;" :gutter="16">
        <v-col span="20">
          <v-button-group style="width:100%" class="ant-btn-group-tabs">
            <v-button v-for="(item, key) in allBtns" @click="getNewData(item.param, key)" :class="activeBtn === key ? 'active' : ''" :key="key">{{item.text}} {{item.number}}</v-button>
          </v-button-group>
        </v-col>
        <v-col span="4" style="text-align:right">
          <CustomList :data.sync="columns" save-field="platform_list"></CustomList>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-data-table showVar :bottomGap="20" stripe :tree-option='treeOption' :pagination="true" ref="table" :data='lists' :page-size="params.pageSize" :page-no="params.pageNo" :columns='columnsList' check-type="checkbox" @checkall="checkAll" @clickrow="clickRow" class="margin-top-10" :current-data.sync='tableData'>
            <template slot="th" slot-scope="props">
              <div style="text-align:center;width:100px" v-if="props.column.field=='edit'">
                <strong>操作</strong>
              </div>
              <div style="text-align:center" v-else-if="props.column.field=='photo'">
                <strong>图片</strong>
              </div>
              <div style="text-align:center" v-else-if="props.column.field=='productId'">
                <strong>ID</strong>
              </div>

              <strong max-leh v-else v-html="props.title"></strong>
            </template>
            <template slot="td" slot-scope="props">
              <div @click="linkToView(props)" style="color:#333;height:100%;width:100%;cursor: pointer;">
                <div v-if="props.column.field=='photo'">
                  <div v-if="!props.item.variantNum && props.item._variant" class="subItems">
                    <el-tooltip placement="right" effect="light" :open-delay="300">
                      <div slot="content">
                        <img :src="props.item.imgPath && props.item.imgPath.replace(/,h_\d+,w_\d+/ig, ',h_240,w_240') || '/static/no-image.jpg'" :alt="props.column.title">
                      </div>
                      <div class="divContent" style="position:relative;left:10px">
                        <img :src="props.item.imgPath || '/static/no-image.jpg'" :alt="props.column.title">
                      </div>
                    </el-tooltip>

                  </div>
                  <div v-else class="subItems">
                    <el-tooltip placement="right" effect="light" :open-delay="300">
                      <div slot="content">
                        <img :src="props.item.imgPath && props.item.imgPath.replace(/,h_\d+,w_\d+/ig, ',h_240,w_240') || '/static/no-image.jpg'" :alt="props.column.title">
                      </div>
                      <div class="divContent" style="position:relative">
                        <img :src="props.item.imgPath || '/static/no-image.jpg'" :alt="props.column.title">
                      </div>
                    </el-tooltip>

                  </div>
                </div>
                <div v-else-if="props.column.field=='productSpecification'" class="sku">
                  <span class="id">{{props.item.sku}}</span>
                  <div>{{props.item.skuCustom}}</div>
                  <div>{{props.item.warehouseName}}</div>
                </div>
                <div v-else-if="props.column.field=='nameCn'" style="max-width:260px" class="__ellapase">
                  <el-tooltip class="item" effect="dark" :content="props.item.nameZh" placement="top-start" :open-delay="500">
                    <span>{{props.item.nameZh}}</span>
                  </el-tooltip>
                </div>
                <div v-else-if="props.column.field=='nameEn'" style="max-width:260px" class="__ellapase">
                  <el-tooltip class="item" effect="dark" :content="props.item.nameEn" placement="top-start" :open-delay="500">
                    <span>{{props.item.nameEn}}</span>
                  </el-tooltip>
                </div>
                <div v-else-if="props.column.field=='productId'" style="text-align:center">
                  <div>{{props.content}}</div>
                  <v-button v-if="props.item.variantNum" type="primary" size="small" class="viewVariant" @click.stop="viewVariant(props, $event)" :disabled="isLoading">查看变体({{props.item.variantNum}})</v-button>
                </div>
                <div v-else-if="props.column.field=='statusType'">
                  <!-- <span v-if="props.content === 1">全部</span> -->
                  <span v-if="getStatus(props) == 0">锁定</span>
                  <span v-if="getStatus(props) == 1">草稿箱</span>
                  <!-- 待编辑 显示状态 -->
                  <v-popover trigger="hover" v-if="getStatus(props) == 2 || getStatus(props) == 3 || getStatus(props) == 4 || getStatus(props) == 7" :overlay-style="{zIndex: 99999}" placement="bottom">
                    <div v-if="getEditorMap(props, 1)">待编辑({{getEditorMap(props, 1)}})</div>
                    <div v-if="getEditorMap(props, 2)">待审核({{getEditorMap(props, 2)}})</div>
                    <div v-if="props.item.storeList && props.item.storeList.length > 0">待上架({{props.item.storeList.length}})</div>
                    <div slot="content" class="platform_status">
                      <div class="platform_status_col">
                        <div class="platform_status_col_title">编辑状态:</div>
                        <div class="platform_status_col_item">
                          <div v-for="(val, key) in props.item.languageStatusMap">
                            <b>{{key}} :</b>
                            <span v-if="val == 1" style="color: #f00">待</span>
                            <v-icon v-else-if="val == 2 || val ==3 || val == null" type="check" style="color: #67c23a"></v-icon>
                          </div>
                        </div>
                      </div>
                      <div class="platform_status_col">
                        <div class="platform_status_col_title">审核状态:</div>
                        <div class="platform_status_col_item">
                          <div v-for="(val, key) in props.item.auditMap">
                            <b>{{key}} :</b>
                            <v-icon v-if="val == 1" style="color: #67c23a"></v-icon>
                            <v-icon v-else-if="val == 3" type="close" style="color: #f00"></v-icon>
                            <span v-else-if="val == 2" style="color: #f00">
                              待
                            </span>
                            <v-icon v-else type="check" style="color: #67c23a"></v-icon>
                          </div>
                        </div>
                      </div>
                      <div class="platform_status_col">
                        <div class="platform_status_col_title">待上架:</div>
                        <div class="platform_status_col_item">
                          <div v-for="item in props.item.storeList">
                            {{item}}
                          </div>
                        </div>
                      </div>

                    </div>
                  </v-popover>
                  <!-- <span v-if="getStatus(props) == 3">待审核</span> -->
                  <!-- <span v-if="getStatus(props) == 4">待上架</span> -->
                  <span v-if="getStatus(props) == 5">已下架</span>
                  <span v-if="getStatus(props) == 6">已上架</span>
                </div>
                <div v-else-if="props.column.field=='operatorName'">
                  <div v-if="hasEditor(props.item.languageOperator)">
                    <template v-if="props.item.languageOperator.lenght <= 2">
                      <div v-for="item in props.item.languageOperator" :key="item">
                        {{ item }}
                      </div>
                    </template>
                    <template v-else>
                      <el-tooltip placement="left">
                        <div>
                          <div v-for="(item, index) in props.item.languageOperator.slice(0,2)" :key="item">
                            <template v-if="index === props.item.languageOperator.length-1">
                              {{ item }} ...
                            </template>
                            <template v-else>
                              {{ item }}
                            </template>
                          </div>
                        </div>
                        <div slot="content">
                          <div v-for="(item, index) in props.item.languageOperator" :key="item">
                            <template>
                              {{ item }}
                            </template>
                          </div>
                        </div>

                      </el-tooltip>
                    </template>

                  </div>
                  <div v-else>暂未分配人员</div>
                  <!-- {{hasEditor(props.item.languageOperator) ? props.item.languageOperator.join('') : '暂未分配人员'}} -->
                </div>
                <div v-else-if="props.column.field=='edit'" class="btn_wrapper edit-box">
                  <div>
                    <el-tooltip class="item" v-for="btn in props.item.buttonList" effect="dark" :content="editBtns[btn.buttonNum-1].name" placement="top-start" :open-delay="500">
                      <span v-if="btn.buttonNum !== 4" @click.stop="editBtns[btn.buttonNum-1].func(props)">
                        <i class="iconfont __editBtns" v-html="editBtns[btn.buttonNum-1].icon"></i>
                      </span>
                      <span v-else-if="btn.buttonNum === 4" @click.stop="editBtns[btn.buttonNum-1].func(btn, props)">
                        <i class="iconfont __editBtns" v-html="editBtns[btn.buttonNum-1].icon"></i>
                      </span>
                    </el-tooltip>
                  </div>

                </div>
                <span v-else v-html="props.content"></span>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>

      <el-dialog width="40%" title="选择店铺" :visible.sync="selectShopDialog" append-to-body class="____platform__app">
        <v-row :gutter="16">
          <v-col span="8">
            <el-select v-model="searchStore.siteId" clearable placeholder="请选择">
              <el-option v-for="item in options" :key="item.siteId" :label="item.siteNameZh" :value="item.siteId">
              </el-option>
            </el-select>
          </v-col>
          <v-col span="16">
            <el-input placeholder="请输入店铺名称" class="input-with-select" v-model='searchStore.name' clearable @clear="selectShopName">
              <el-button slot="append" icon="el-icon-search" @click='selectShopName'>搜索</el-button>
            </el-input>
          </v-col>
        </v-row>

        <div class="Lists_result">
          <!-- <el-button type="info" style="margin:10px 0 0 0;width:100%" v-for="item in shopList">{{item.storeName}}</el-button> -->
          <el-table :data="shopList" :show-header='false' style="width: 100% !important;margin-top:15px;" @selection-change="checkedShops" ref="elTable" v-if="shopList.length > 0">
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="storeName" prop="storeName" width="100%" />
          </el-table>
          <div class="margin-top-20 text-center" v-else>没有满足条件的数据</div>
        </div>
        <div slot="footer" class="dialog-footer" style="text-align: center">
          <el-button type="primary" @click="selectShop">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </CustomTransition>
</template>

<script>
import Vue from "vue";
import {
  fetchAllData,
  fetchData,
  toUrl,
  fixFrameHeight,
  toParamUrl,
  showToast,
  handlerCode,
  showConfirm,
  showDialog
} from "common/common";
import { isArray, debounce, browserType } from "common/util";
import {
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Select,
  Option
} from "element-ui";
import apis, {
  GET_PRODUCT_SKU_OPTIONS,
  GET_PRODUCT_ALL_LIST,
  GET_ERP_PLATFORM_LISTS
} from "apis";
import {
  CALBACK_TO_WAIT_FOR_EDITORS,
  PRODUCT_PLT_LANGUAGE_AUDIT_INFO
} from "../componentName";
import CustomList from "components/base/customList";
import CustomTransition from "components/base/customTransition";
import router from "common/router";

Vue.use(Dropdown);
Vue.use(DropdownMenu);
Vue.use(Select);
Vue.use(Option);
Vue.use(DropdownItem);

export default {
  name: "productList",
  props: ["platform"],
  components: {
    CustomList,
    CustomTransition
  },
  created() {
    this.getSiteList();
    fetchData({
      ...apis.PRODUCT_PLATFORM_OPERATION_TYPE_LIST
    }).then(res => {
      if (res.data.code === 0) {
        this.editorList = res.data.list;
      }
    });

    this.skuSelectOptions = [
      {
        label: "产品SKU",
        value: 1
      },
      {
        label: "自定义SKU",
        value: 2
      }
    ];
  },
  data() {
    let vm = this;
    return {
      platformId: this.platform,

      activeBtn: 0,
      shopNameKeyword: "",

      editorList: [],

      ListsComponent: "ytSimpleSearch",
      lists: data => {
        let reqData = Object.assign({}, data, this.ruleForm, this.params, {
          productPlatformStatus:
            this.ruleForm.productPlatformStatus != "" &&
            this.ruleForm.productPlatformStatus != null
              ? this.ruleForm.productPlatformStatus
              : this.params.productPlatformStatus
        });
        reqData.pageNumber = reqData.pageNo;
        let opts = Object.assign({}, GET_ERP_PLATFORM_LISTS, { data: reqData });
        return fetchData(opts).then(res => {
          if (res.data.code !== 0) {
            showToast("error", res.data.msg);
            return {
              result: []
            };
          }
          console.log(res.data);
          let data = res.data.rows;
          const { page, numMap } = data;
          vm.allBtns[0].number = numMap.allNum;
          vm.allBtns[1].number = numMap.draftNum;
          vm.allBtns[2].number = numMap.editNum;
          vm.allBtns[3].number = numMap.pltInfoAuditNum;
          vm.allBtns[4].number = numMap.pltImgAuditNum;
          vm.allBtns[5].number = numMap.preparePutAwayNum;
          vm.allBtns[6].number = numMap.soldOutNum;
          vm.allBtns[7].number = numMap.lockNum;
          vm.allBtns[8].number = numMap.putAwayNUm;
          return {
            result: page.rows,
            totalCount: page.total,
            pageSize: page.pageSize,
            pageNo: page.pageNo
          };
        });
      },

      isLoading: false,

      selectShopDialog: false,
      searchStore: {
        platformId: 1
      },
      shopList: [],
      selectShopListId: [],
      selectItem: {},

      searchParams: {},

      ruleForm: {
        // name: "",
        skuType: 1,
        productPlatformStatus: 1
        // sku: ""
      },
      options: [],
      skuSelectOptions: [],
      statusSelectOptions: [
        {
          label: "待编辑",
          value: 3
        },
        {
          label: "平台信息待审核",
          value: 4
        },
        {
          label: "图片待审核",
          value: 5
        },
        {
          label: "待上架",
          value: 6
        }
      ],
      langSelectOptions: [
        {
          label: "全部",
          value: null
        },
        {
          label: "英文",
          value: 1
        }
      ],
      isIE11: null,
      params: {
        productPlatformStatus: 1,
        platformId: this.platform,
        sortOrder: "asc",
        pageSize: 10,
        pageNumber: 1
      },

      editBtns: [
        {
          name: "打回待编辑",
          func: this.CalBackToWaitForEditors,
          icon: "&#xe7fe;"
        },
        {
          name: "选择店铺",
          func: this.ChooseShop,
          icon: "&#xe7ce;"
        },
        {
          name: "分配编辑人员",
          func: this.assign,
          icon: "&#xe7ae;"
        },
        {
          name: "编辑",
          func(btn, props) {
            let img = btn.img;
            let info = [];
            if (btn.info && btn.info.menuList) {
              info = btn.info.menuList.map(el => ({
                name: el.name,
                menuId: el.menuId
              }));
            }
            return vm.edit(props, 1, { img, info });
          },
          icon: "&#xe791;"
        },
        {
          name: "审核",
          func(props) {
            return vm.review(props, 1);
          },
          icon: "&#xe7e3;"
        },
        // {
        //   name: "审核",
        //   func(props) {
        //     return vm.review(props, 2);
        //   }
        // },
        {
          name: "查看原因",
          func(props) {
            return vm.lookAtReason(props);
          },
          icon: "&#xe78f;"
        },
        {
          name: "刊登上架",
          func: this.upload,
          icon: "&#xe63a;"
        },
        {
          name: "下架",
          func: this.undercarriage,
          icon: "&#xe60e;"
        },
        {
          name: "重新上架",
          func: this.reUpload,
          icon: "&#xeb57;"
        },
        {
          name: "查看原因",
          func(props) {
            return vm.lookAtReason(props, true);
          },
          icon: "&#xe78f;"
        },
        {
          name: "编辑",
          func(props) {
            return vm.edit(props, 2);
          },
          icon: "&#xe791;"
        }
      ],

      allBtns: [
        {
          text: "全部",
          param: 1
        },
        {
          text: "草稿箱",
          param: 2
        },
        {
          text: "待编辑",
          param: 3
        },
        {
          text: "平台信息待审核",
          param: 4
        },
        {
          text: "图片待审核",
          param: 5
        },
        {
          text: "待上架",
          param: 6
        },
        {
          text: "已下架",
          param: 8
        },
        {
          text: "锁定",
          number: 0,
          param: 9
        },
        {
          text: "已上架",
          number: 0,
          param: 7
        }
      ],
      columns: [
        {
          title: "ID",
          field: "productId",
          width: "100px",
          show: true
        },
        {
          title: "操作",
          field: "edit",
          width: "100px",
          show: true
        },
        {
          title: "产品图片",
          field: "photo",
          show: true
        },
        {
          title: "平台SKU",
          field: "sku",
          show: true
        },
        {
          title: "自定义SKU",
          field: "skuCustom",
          width: "15%",
          show: true
        },
        {
          title: "中文名",
          field: "nameZh",
          show: true
        },
        {
          title: "英文名",
          field: "nameEn",
          show: true
        },
        {
          title: "仓库",
          field: "warehouseName",
          show: true
        },
        {
          title: "状态",
          field: "statusType",
          show: true
        },
        {
          title: "编辑负责人员",
          field: "operatorName",
          show: true
        }
      ],
      tableData: [],
      treeOption: {
        isAsync: true
      },
      options: [],
      searchData: "",
      items: [],
      pageNo: 1,
      pageSize: 10
    };
  },
  methods: {
    // 获取平台站点
    getSiteList() {
      fetchData({
        ...apis.SITE_LIST,
        data: { platformId: this.platformId }
      }).then(res => {
        if (res.data.code === 0) {
          this.options = res.data.rows;
        }
      });
    },
    //选择店铺搜索
    selectShopName() {
      if (this.searchStore.siteId === "") {
        delete this.searchStore.siteId;
      }
      if (this.searchStore.name === "") {
        delete this.searchStore.name;
      }

      fetchData({
        ...apis.PRODUCT_PREPARE_STORE_LIST,
        data: this.searchStore
      }).then(res => {
        if (res.data.code === 0) {
          this.shopList = res.data.rows;
          this.$nextTick(() => {
            this.shopList.map((el, index) => {
              if (el.prepareFlag) {
                this.$refs.elTable.toggleRowSelection(this.shopList[index]);
              }
            });
          });
        }
      });
    },
    // 搜索关键词
    searchLists() {
      // this.searchParams = {};
      // if (this.ruleForm.skuType == 1) {
      // }
      this.$refs.table.refresh();
    },

    // 一键导入
    OneTouchImport() {
      let vm = this;
      fetchData({
        ...apis.PRODUCT_PLATFORM_LEAD_ALL,
        data: {
          platformId: this.platformId
        }
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", res.data.msg);
          vm.$refs.table.refresh();
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    // 选择导入
    selectImport() {
      let vm = this;
      showDialog(
        "platformSelectImport",
        { width: 1200, title: "选择导入" },
        {},
        {
          set(arr) {
            let productIds = arr.map(el => el.productId);
            fetchData({
              ...apis.PRODUCT_PLATFORM_LEAD_SELECT,
              data: {
                productIds,
                platformId: vm.platformId
              }
            }).then(res => {
              if (res.data.code === 0) {
                showToast("success", "导入成功");
                vm.$refs.table.refresh();
              } else {
                showToast("error", res.data.msg);
              }
            });
          }
        }
      );
    },

    // 批量下架
    batchReview() {
      let vm = this;
      let productPlatformIds = this.$refs.table.getCheckedData();
      productPlatformIds = productPlatformIds.map(el => el.productPlatformId);
      if (!productPlatformIds.length) {
        showToast("info", "请选择至少一项进行操作");
        return;
      }
      showConfirm({
        title: "是否批量下架这些产品？",
        onOk() {
          fetchData({
            ...apis.PRODUCT_PLATFORM_BATCH_UNSHELVE,
            data: {
              productPlatformIds
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast(
                "success",
                `成功： ${res.data.success} 个, 失败： ${res.data.fail} 个` +
                  res.data.msg && res.data.msg.length > 0
                  ? ". <br>错误信息： " + res.data.msg.join(", ")
                  : ""
              );
              vm.$refs.table.refresh();
            } else {
              showToast("error", res.data.msg);
            }
          });
        }
      });
    },

    // 批量分配
    batchAssign(command) {
      let vm = this;
      let data = this.$refs.table
        .getCheckedData()
        .map(el => el.productPlatformId);
      if (data.length <= 0) {
        showToast("info", "请选择至少一项进行操作");
        return;
      }
      console.log(command);
      showDialog(
        "batchAssignPlatform",
        {
          title: "批量分配编辑人员",
          width: 320,
          modalnoBtn: true
        },
        { type: command },
        {
          set(childVm) {
            fetchData({
              ...apis.PRODUCT_PLATFORM_OPERATION_UPDATE,
              data: {
                productPlatformIds: data,
                operationType: command,
                operatorId: childVm.ruleForm.operatorId,
                platformId: vm.$refs.table.getCheckedData()[0].platformId
              }
            }).then(res => {
              console.log(res);
              handlerCode(res, () => {
                vm.$refs.table.refresh();
                childVm.cancel();
              });
            });
          }
        }
      );
    },

    // 批量自定义导出
    customExport() {
      let data = this.$refs.table.getCheckedData();
      if (data.length !== 1) {
        showToast("info", "请选择且只能选择一条数据进行操作");
        return;
      }
      showDialog(
        "batchCustomExportPlatform",
        {
          title: "自定义导出",
          width: 600,
          modalnoBtn: true
        },
        { data: data[0] },
        {
          set(childVm) {}
        }
      );
    },

    // 批量审核
    // batchReview() {
    //   let vm = this;
    //   let productPlatformIds = this.$refs.table.getCheckedData();
    //   productPlatformIds = productPlatformIds.map(el => el.productPlatformId);
    //   if (!productPlatformIds.length) {
    //     showToast("info", "请选择至少一项进行操作");
    //     return;
    //   }
    //   showConfirm({
    //     title: "是否批量审核这些产品？",
    //     onOk() {
    //       fetchData({
    //         ...apis.PRODUCT_PLATFORM_BATCH_UNSHELVE,
    //         data: {
    //           productPlatformIds
    //         }
    //       }).then(res => {
    //         if (res.data.code === 0) {
    //           showToast("success", res.data.msg);
    //           vm.$refs.table.refresh();
    //         } else {
    //           showToast("error", res.data.msg);
    //         }
    //       });
    //     }
    //   });
    // },

    linkToView(props) {
      toParamUrl("/product/platformList/viewProduct.html", {
        productId: props.item.productId,
        parentId: props.item.parentId,
        productPltDetailId: props.item.languageDetailMap[1],
        productPlatformId: props.item.productPlatformId,
        tab: 1,
        variant: props.item.variantNum ? "false" : "true",
        isshow: true
      });
    },

    // 判断按钮显示状态
    getStatus(props) {
      let languageStatusMap = props.item.languageStatusMap;
      let auditMap = props.item.auditMap;
      if (props.item.lockFlag == 1) {
        // 锁定
        return 0;
      }
      if (props.item.statusType == 2) {
        // 草稿箱
        return 1;
      }
      if (props.item.statusType == 4) {
        // 已下架
        return 5;
      }
      if (props.item.statusType == 5) {
        // 已上架
        return 6;
      }

      for (const key in auditMap) {
        if (auditMap.hasOwnProperty(key)) {
          const element = auditMap[key];
          if (element === 3) {
            // 审核不通过
            return 7;
          }
        }
      }

      for (const key in languageStatusMap) {
        if (languageStatusMap.hasOwnProperty(key)) {
          const el = languageStatusMap[key];
          if (el == 1) {
            // 待编辑
            return 2;
          }
          if (el == 2) {
            // 待审核
            return 3;
          }
          if (el == 3) {
            // 待上架
            return 4;
          }
        }
      }
    },

    // 判断是否有编辑人员
    hasEditor(lan) {
      let ret = false;
      for (const key in lan) {
        if (lan.hasOwnProperty(key)) {
          const element = lan[key];
          if (element) {
            ret = true;
          }
        }
      }

      return ret;
    },

    // 判断待编辑状态的语种数目
    getEditorMap(props, type) {
      let num = 0;
      let languageStatusMap = props.item.languageStatusMap;
      for (const key in languageStatusMap) {
        if (languageStatusMap.hasOwnProperty(key)) {
          const element = languageStatusMap[key];
          if (element == type) {
            num++;
          }
        }
      }
      return num;
    },

    // 选择店铺
    ChooseShop(props) {
      console.log(props);
      this.searchStore.productPlatformId = props.item.productPlatformId;
      this.selectShopDialog = true;
      fetchData({
        ...apis.PRODUCT_PREPARE_STORE_LIST,
        data: {
          productPlatformId: props.item.productPlatformId,
          platformId: this.platformId,
          name: null
        }
      }).then(res => {
        console.log(res);
        if (res.data.code !== 0) {
          showToast("error", res.data.msg);
          return;
        }
        this.shopList = res.data.rows;
        // 设置选中

        this.selectItem = props;
        this.$nextTick(() => {
          this.shopList.map((el, index) => {
            if (el.prepareFlag) {
              this.$refs.elTable.toggleRowSelection(this.shopList[index]);
            }
          });
        });
      });
    },

    // 下架
    undercarriage(props) {
      let vm = this;
      showConfirm({
        title: "是否下架选中的产品",
        onOk() {
          let productPlatformIds = [props.item.productPlatformId];

          fetchData({
            ...apis.PRODUCT_PLATFORM_BATCH_UNSHELVE,
            data: { productPlatformIds }
          }).then(res => {
            if (res.data.code === 0) {
              showToast("success", res.data.msg);
              vm.$refs.table.refresh();
            } else {
              showToast("error", res.data.msg);
            }
          });
        }
      });
    },

    // 分配人员
    assign(props) {
      let vm = this;
      showDialog(
        "platformAssign",
        { width: 360, title: "分配编辑人员" },
        {},
        {
          set(childVm) {
            fetchData({
              ...apis.PRODUCT_PLATFORM_OPERATION_UPDATE,
              data: {
                operationType: childVm.ruleForm.operationType,
                operatorId: childVm.ruleForm.operatorId,
                productPlatformIds: [props.item.productPlatformId]
              }
            }).then(res => {
              if (res.data.code === 0) {
                showToast("success", "分配成功");
                childVm.cancel();
                vm.$refs.table.refresh();
              } else {
                showToast("error", res.data.msg);
              }
            });
          }
        }
      );
    },

    // 切换选择项
    // toggleRowSelection(row) {
    //   if (row) {

    //   }
    // },

    // 选中的店铺详情
    checkedShops(val) {
      console.log(val);
      this.selectShopListId = val;
    },

    // 选择店铺弹窗确认
    selectShop() {
      let { productPlatformId, productId } = this.selectItem.item;
      let prepareStoreIds = [];
      this.selectShopListId.map(el => {
        prepareStoreIds.push(el.storeId);
      });
      fetchData({
        ...apis.PRODUCT_PREPARE_STORE_SAVE,
        data: {
          platformId: this.platformId,
          productPlatformId,
          productId,
          prepareStoreIds
        }
      }).then(res => {
        console.log(res);
        handlerCode(res);
        // showToast("success", "选择成功");
        this.selectShopDialog = false;
        this.$refs.table.refresh();
      });
    },

    // 编辑操作
    edit(props, type, params) {
      toParamUrl("/product/platformList/editLists.html", {
        productPltDetailId: props.item.languageDetailMap[1],
        productPlatformId: props.item.productPlatformId,
        productId: props.item.productId,
        tab: type,
        variant: props.item.variantNum != null ? false : true,
        parentProductPltDetailId: props.item.parentLanguageDetailMap
          ? props.item.parentLanguageDetailMap[1]
          : null,
        ...params
      });
    },

    // 审核操作
    review(props, type) {
      let tab;
      if (type == 1) {
        // 平台信息审核
        tab = 1;
      } else if (type === 2) {
        // 图片审核
        tab = 2;
      }
      toParamUrl("/product/platformList/review.html", {
        productPltDetailId: props.item.languageDetailMap[1],
        productPlatformId: props.item.productPlatformId,
        productId: props.item.productId,
        tab
      });
    },

    // 打回待编辑
    CalBackToWaitForEditors(props) {
      let vm = this;
      let i = props.item;
      showDialog(
        CALBACK_TO_WAIT_FOR_EDITORS,
        { title: "打回待编辑", width: 1000 },
        {
          item: props.item
        },
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(dialogVm) {
            let data = {
              auditType: 1,
              productId: i.productId,
              productPlatformId: i.productPlatformId,
              ...dialogVm.ruleForm
            };
            console.log(data);
            fetchData({
              ...apis.PRODUCT_PLT_AUDIT_UPDATE,
              data
            }).then(res => {
              if (res.data.code === 0) {
                showToast("success", res.data.msg);
                vm.$refs.table.refresh();
                dialogVm.cancel();
              } else {
                showToast("error", res.data.msg);
              }
            });
          }
        }
      );
    },

    // 查看审核未通过的原因
    lookAtReason(props, img) {
      showDialog(
        PRODUCT_PLT_LANGUAGE_AUDIT_INFO,
        { title: "审核不通过的原因", width: 1000 },
        {
          props,
          img
        },
        {
          // 绑定点击model确认事件,参数是选择的配件详情
          set: function(dialogVm) {}
        }
      );
    },

    // 上传到店铺
    upload(props) {
      let { productId, productPlatformId, languageDetailMap } = props.item;
      toParamUrl("/product/platformList/uploadProduct.html", {
        platformId: this.platformId,
        productId,
        detailId: languageDetailMap[1],
        platformProductId: productPlatformId
        // platformProductParentId: productPlatformId,
        // productParentId: productId
      });
    },

    // 重新上架到店铺
    reUpload(props) {
      let { productPlatformId } = props.item,
        vm = this;
      fetchData({
        ...apis.PRODUCT_PLATFORM_PUT_AWAY_AGAIN,
        data: {
          productPlatformIds: [productPlatformId]
        }
      }).then(res => {
        if (res.data.code === 0) {
          showToast("success", res.data.msg);
          vm.$refs.table.refresh();
        } else {
          showToast("error", res.data.msg);
        }
      });
    },

    // 简单查询执行
    simpleSearch(data) {
      console.log(data);
    },

    // 筛选
    select() {
      console.log("sel");
    },

    getNewData(id, index) {
      this.activeBtn = index;
      this.ruleForm = {};
      this.params.productPlatformStatus = id;
      this.$refs.table.refresh();
    },

    // 搜索相应产品列表
    searchColumns(categoryId) {
      this.searchParams.categoryId = categoryId;
      this.$refs.table.refresh();
    },

    // 点击按钮
    editClickHander(e) {
      toUrl("/product/productList/addProduct.html");
    },

    set() {
      console.log(2);
    },

    // 表格
    checkAll: function(value) {
      this.checkAllMsg = "当前全选状态是：" + value;
    },
    clickRow: function(obj) {
      console.log(obj);
      this.clickRowMsg = "当前点击第" + obj.index + "行";
    },

    // 查看变体
    viewVariant(props) {
      if (this.tableData[props.index].hasOpen) {
        this.tableData.splice(
          props.index + 1,
          this.tableData[props.index].count
        );
        this.tableData[props.index].hasOpen = false;
      } else {
        this.isLoading = true;
        this.tableData[props.index].hasOpen = true;
        fetchData({
          ...apis.PRODUCT_PLATFORM_VARIANT_LIST,
          data: {
            productPlatformId: props.item.productPlatformId,
            productId: props.item.productId
          }
        }).then(res => {
          console.log(res);
          this.isLoading = false;
          if (res.data.length !== 0) {
            this.tableData[props.index].count = res.data.length;
            console.log(res.data);
            res.data.map(el => {
              (el.isBian = true),
                (el.auditMap = {}),
                (el.parentId = props.item.productId),
                (el._variant = true),
                (el.languageOperator = props.item.languageOperator),
                (el.parentLanguageDetailMap = props.item.languageDetailMap);
            });
            this.tableData.splice(props.index + 1, 0, ...res.data);
          } else {
            showToast("error", res.data.msg);
          }
        });
      }
    }
  },
  computed: {
    columnsList() {
      return this.columns.filter(el => el.show);
    }
  }
};
</script>

<style lang="less">
@import "~assets/style/variables.less";

.product_tab {
  margin-top: 20px;
}
.sku {
  // text-align: center;
  .id {
    font-weight: bolder;
    font-size: 14px;
  }
}
.subItems {
  text-align: center;
  img,
  button {
    display: block;
    margin: 0 auto;
  }
}
.tabs {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  border-bottom-style: 1px solid @title-color;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.platform_status {
  font-size: 14px;
  width: 400px;
  .platform_status_col {
    display: flex;
    .platform_status_col_title {
      margin: 10px;
    }
    .platform_status_col_item {
      display: flex;
      flex-wrap: wrap;

      div {
        margin: 10px;
      }
    }
  }
}
.btn_wrapper {
  // max-width: 200px;
  display: flex;
  flex: auto;
  flex-wrap: wrap;
  button {
    margin: 4px !important;
  }
}
.____platform__app {
  .el-table__body {
    width: 100% !important;
  }
}
</style>
