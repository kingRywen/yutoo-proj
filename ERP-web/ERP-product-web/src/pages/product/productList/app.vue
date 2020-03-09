<template>
  <v-spin :tip="loadingTip" :spinning="loadingPage">
    <CustomTransition v-if="!simple">
      <div>
        <keep-alive>
          <component :is="searchComponent" :select="options" @search="simpleSearch"></component>
        </keep-alive>
        <div class="hr"></div>
        <div class="___btns">
          <v-button type="primary" @click.stop="editClickHander">新增产品</v-button>
          <v-button type="primary" @click.stop="addGroupClickHander">新增组合产品</v-button>
          <v-button type="primary" @click.stop="deleteProducts">删除产品</v-button>
          <!-- <el-dropdown @command="handleCommand">
        <v-button type="primary">批量设置
          <v-icon type="down" size="sm"></v-icon>
        </v-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="a">批量设置下架</el-dropdown-item>
          <el-dropdown-item command="b">批量设置售完自动下架</el-dropdown-item>
        </el-dropdown-menu>
          </el-dropdown>-->
          <el-dropdown @command="handleCommand1">
            <v-button type="primary">
              批量审核产品
              <v-icon type="down" size="sm"></v-icon>
            </v-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">批量审核基础信息通过</el-dropdown-item>
              <el-dropdown-item command="b">批量审核采购信息通过</el-dropdown-item>
              <el-dropdown-item command="c">批量审核基础信息不通过</el-dropdown-item>
              <el-dropdown-item command="d">批量审核采购信息不通过</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleCommand2">
            <v-button type="primary">
              批量分配
              <v-icon type="down" size="sm"></v-icon>
            </v-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">分配基础信息编辑人员</el-dropdown-item>
              <el-dropdown-item command="b">分配采购负责人员</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-dropdown @command="handleCommand3">
            <v-button type="primary">
              批量操作
              <v-icon type="down" size="sm"></v-icon>
            </v-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">批量作废</el-dropdown-item>
              <!-- <el-dropdown-item command="b">生成组合产品</el-dropdown-item> -->
              <el-dropdown-item command="c">导出供应商报价</el-dropdown-item>
              <!-- <el-dropdown-item command="d">导入供应商报价</el-dropdown-item> -->
              <el-dropdown-item command="e">批量修改产品备注</el-dropdown-item>
              <!-- <el-dropdown-item command="f">批量更换供应商</el-dropdown-item> -->
              <el-dropdown-item command="g">批量添加配件</el-dropdown-item>
              <el-dropdown-item command="h">批量删除配件</el-dropdown-item>
              <!-- <el-dropdown-item command="i">批量采集退税率</el-dropdown-item> -->
              <!-- <el-dropdown-item command="j">批量清除退税率（设为非出口退税产品）</el-dropdown-item> -->
              <el-dropdown-item command="k">批量提取自定义SKU</el-dropdown-item>
              <el-dropdown-item command="l">批量提取产品SKU</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <el-dropdown @command="handleCommand4">
            <v-button type="primary">
              批量导入
              <v-icon type="down" size="sm"></v-icon>
            </v-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="a">
                批量导入产品
                <input
                  type="file"
                  ref="file"
                  style="display:none"
                  @change="handleImportFile"
                  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                >
              </el-dropdown-item>
              <!-- <el-dropdown-item command="b">批量导入产品图片</el-dropdown-item> -->
              <el-dropdown-item command="c">批量导入产品原料</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <v-button type="primary" @click="CustomExport">自定义导出产品</v-button>
          <v-button type="primary" @click="lockOrUnlock('lock')">批量锁定产品</v-button>
          <v-button type="primary" @click="lockOrUnlock('unlock')">批量解锁产品</v-button>
          <v-button type="primary" @click="batchMoveProduct">批量挪动产品</v-button>

          <v-button type="primary" @click="openGenerateProductProcessingBarcode">生成产品加工条码</v-button>
        </div>
      </div>
    </CustomTransition>

    <CustomTransition v-if="!simple">
      <v-row style="margin-top: 10px;" :gutter="16">
        <v-col span="20">
          <v-button-group style="width:100%" class="ant-btn-group-tabs">
            <v-button
              v-for="(item, key) in allBtns"
              @click="getNewData(item.param, key)"
              :class="activeBtn === key ? 'active' : ''"
              :key="key"
            >{{item.text}} {{item.number}}</v-button>
          </v-button-group>
        </v-col>
        <v-col span="4" style="text-align:right">
          <CustomList :data.sync="columns" save-field="product_list"></CustomList>
        </v-col>
      </v-row>
    </CustomTransition>

    <v-row>
      <v-col>
        <CustomTransition v-if="tableData">
          <v-data-table
            showVar
            :bottomGap="10"
            stripe
            :tree-option="treeOption"
            ref="table"
            :data="lists"
            :page-size="pageSize"
            :page-no="pageNo"
            :columns="columnsList"
            check-type="checkbox"
            @checkall="checkAll"
            @clickrow="clickRow"
            class="margin-top-10 showInfoData"
            :current-data.sync="tableData"
          >
            <template slot="th" slot-scope="props">
              <div style="text-align:center" v-if="props.column.field=='photo'">
                <strong style="text-align:center">产品图片</strong>
              </div>
              <div style="text-align:center" v-else-if="props.column.field=='edit' && !simple">
                <strong style="text-align:center">操作</strong>
              </div>
              <div v-else-if="props.column.field=='skuCustom'">
                <strong>自定义SKU</strong>
              </div>
              <div v-else-if="props.column.field=='nameZh'">
                <strong>中文名</strong>
              </div>
              <div style="text-align:center" v-else-if="props.column.field=='productId'">
                <strong style="text-align:center">ID</strong>
              </div>
              <!-- <strong v-if="props.column.field=='album'">操作</strong> -->
              <strong max-leh v-else v-html="props.title"></strong>
            </template>
            <template slot="td" slot-scope="props">
              <div @click="linkToView(props)" style="color:#333">
                <div v-if="props.column.field=='photo'" style="padding:0 10px">
                  <div v-if="!props.item.variantNum && props.item._variant" style="text-align:center">
                    <el-tooltip placement="right" effect="light" :open-delay="300">
                      <div slot="content">
                        <img
                          :src="props.item.imgPath && props.item.imgPath.replace(/,w_\d+/ig, ',w_240') || '/static/no-image.jpg'"
                        >
                      </div>
                      <div class="divContent" style="position:relative;left:10px">
                        <img :src="props.item.imgPath || '/static/no-image.jpg'" :alt="props.column.title">
                      </div>
                    </el-tooltip>
                  </div>
                  <div v-else class="subItems">
                    <el-tooltip placement="right" effect="light" :open-delay="300">
                      <div slot="content">
                        <img
                          :src="props.item.imgPath && props.item.imgPath.replace(/,w_\d+/ig, ',w_240') || '/static/no-image.jpg'"
                        >
                      </div>
                      <div class="divContent" style="position:relative">
                        <!-- {{props.item}} -->
                        <img :src="props.item.imgPath || '/static/no-image.jpg'" :alt="props.column.title">
                        <div class="groupFlag" v-if="props.item.groupFlag">组合</div>
                      </div>
                    </el-tooltip>
                    <!-- <div class="divContent">
                    <img :src="props.item.imgPath || '/static/no-image.jpg'" :alt="props.column.title">
                    </div>-->
                  </div>
                </div>
                <div v-else-if="props.column.field=='productId'" style="text-align:center">
                  <p>{{props.content}}</p>
                  <v-button
                    v-if="props.item.variantNum"
                    class="viewVariant"
                    type="primary"
                    size="small"
                    style="line-height:24px;height:24px;margin-top:4px"
                    :disabled="isLoading"
                    @click.stop="viewVariant(props, $event)"
                  >查看变体({{props.item.variantNum}})</v-button>
                </div>
                <div v-else-if="props.column.field=='operatorName'">
                  <p>基础人员：{{props.item.baseOperator}}</p>
                  <p>采购人员：{{props.item.purchaseOperator}}</p>
                </div>
                <div v-else-if="props.column.field=='nameZh'" style="max-width:260px" class="__ellapase">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="props.item.nameZh || props.item.variantNameZh"
                    placement="top-start"
                    :open-delay="500"
                  >
                    <span>{{props.item.nameZh || props.item.variantNameZh}}</span>
                  </el-tooltip>
                </div>
                <div v-else-if="props.column.field=='nameEn'" style="max-width:260px" class="__ellapase">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="props.item.nameEn || props.item.variantNameEn"
                    placement="top-start"
                    :open-delay="500"
                  >
                    <span>{{props.item.nameEn || props.item.variantNameEn}}</span>
                  </el-tooltip>
                </div>
                <div v-else-if="props.column.field=='supplierPrice'">
                  <span>{{props.content}}{{props.item.supplierPriceUnit}}</span>
                </div>
                <div v-else-if="props.column.field=='salePriceNow'">
                  <span>{{props.content}}{{props.item.salePriceNowUnit}}</span>
                </div>
                <div v-else-if="props.column.field=='auditMap'">
                  <div v-if="props.item.variantNum || !props.item.variantSku">
                    <p>
                      开发:{{props.content['1'] == 1 ? '未审核': (props.content['1'] == 2 ? '通过' : '未通过')}}
                      <v-icon type="check" style="color: #67c23a;font-weight: bold;" v-if="props.content['1'] == 2"></v-icon>
                      <v-icon type="close" style="color: #f00;font-weight: bold;" v-if="props.content['1'] == 3"></v-icon>
                    </p>
                    <p>
                      采购:{{props.content['2'] == 1 ? '未审核': (props.content['2'] == 2 ? '通过' : '未通过')}}
                      <v-icon type="check" style="color: #67c23a;font-weight: bold;" v-if="props.content['2'] == 2"></v-icon>
                      <v-icon type="close" style="color: #f00;font-weight: bold;" v-if="props.content['2'] == 3"></v-icon>
                    </p>
                  </div>
                </div>
                <div v-else-if="props.column.field=='productBaseStatusString'">
                  <span>{{props.content}}</span>
                  <div>{{props.item.review2}}</div>
                </div>
                <div v-else-if="props.column.field=='recommendLevel'">
                  <v-rate disabled :value="props.content || 0"></v-rate>
                </div>
                <div v-else-if="props.column.field=='edit' && !simple" class="edit-box btn_wrapper">
                  <div>
                    <el-tooltip
                      class="item"
                      v-for="btn in props.item.buttonList"
                      effect="dark"
                      :content="editBtns[btn.buttonNum-1].name"
                      placement="top-start"
                      :open-delay="500"
                    >
                      <span @click.stop="editBtns[btn.buttonNum-1].func(props)">
                        <i class="iconfont __editBtns" v-html="editBtns[btn.buttonNum-1].icon"></i>
                      </span>
                    </el-tooltip>
                    <!-- <el-tooltip class="item" effect="dark" :content="日志" placement="top-start" :open-delay="500">
                      <span @click.stop="getLog(props)">
                        <i class="iconfont __editBtns" v-html="'&#xe791;'"></i>
                      </span>
                    </el-tooltip>-->
                    <!-- <v-button type="primary" size="small" style="margin:0 2px" v-for="btn in props.item.buttonList" @click.stop="editBtns[btn-1].func(props)">{{editBtns[btn-1].name}}</v-button> -->
                  </div>
                </div>
                <span v-else v-html="props.content"></span>
              </div>
            </template>
          </v-data-table>
        </CustomTransition>
      </v-col>
    </v-row>
  </v-spin>
</template>

<script>
import Vue from 'vue'
import { Dropdown, DropdownMenu, DropdownItem, Message } from 'element-ui'
import {
  fetchAllData,
  fetchData,
  toUrl,
  fixFrameHeight,
  _storage,
  showDialog,
  showConfirm,
  showToast,
  handlerCode,
  downloadFile,
  toParamUrl
} from 'common/common'
import { isArray, debounce, browserType } from 'common/util'
import apis, {
  GET_PRODUCT_SKU_OPTIONS,
  GET_PRODUCT_ALL_LIST,
  PRODUCT_BATCH_LOCK,
  PRODUCT_BATCH_ULOCK
} from 'apis'
import ytSimpleSearch from 'components/base/simpleSearch'
import CustomList from 'components/base/customList'
import CustomTransition from 'components/base/customTransition'
import {
  YT_SEARCH,
  YT_PRODUCT_SHOW,
  YT_PRODUCT_SHOW_REASON,
  YT_PRODUCT_SHOW_PHCHASE
} from '../componentName'
import router from 'common/router'
import { BASE_URL } from 'common/config'

Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.component(Message.name, Message)

export default {
  name: 'productList',
  props: {
    simple: {
      default: false
    }
  },
  components: {
    ytSimpleSearch,
    CustomList,
    CustomTransition
  },
  created() {
    this.clear()
    console.log(browserType())
    // 请求初始化数据
    if (!browserType()) {
      this.isIE11 = 20
    }
    this.options = [
      {
        label: '系统SKU',
        value: 1
      },
      {
        label: '自定义SKU',
        value: 2
      }
    ]
  },
  data() {
    let vm = this
    return {
      loadingPage: false,
      loadingTip: '',
      searchComponent: 'ytSimpleSearch',
      lists: data => {
        data.pageNumber = data.pageNo
        delete data.pageNo
        let reqData = Object.assign({}, data, this.params, this.searchParams)
        delete reqData.sortColumns

        let opts = Object.assign({}, GET_PRODUCT_ALL_LIST, { data: reqData })

        return fetchData(opts).then(res => {
          let data = res.data
          if (data.code === 500) {
            showToast('error', data.msg)
            data.rows = []
          }
          if (data && data.rows && isArray(data.rows)) {
            let btns = data.productStatusNum
            let allBtns = vm.allBtns
            for (const key in btns) {
              if (btns.hasOwnProperty(key)) {
                const element = btns[key]
                if (key === 'allNum') {
                  allBtns[0].number = +element
                }
                if (key === 'auditAllNum') {
                  allBtns[5].number = +element
                }
                if (key === 'baseAuditNum') {
                  allBtns[3].number = +element
                }
                if (key === 'baseNum') {
                  allBtns[1].number = +element
                }
                if (key === 'baseRepulse') {
                  allBtns[7].number = +element
                }
                if (key === 'invalidNum') {
                  allBtns[6].number = +element
                }
                if (key === 'purchaseAuditNum') {
                  allBtns[4].number = +element
                }
                if (key === 'purchaseNum') {
                  allBtns[2].number = +element
                }
                if (key === 'purchaseRepulse') {
                  allBtns[8].number = +element
                }
                if (key === 'baseAuditFalseNum') {
                  allBtns[9].number = +element
                }
                if (key === 'purchaseAuditFalseNum') {
                  allBtns[10].number = +element
                }
                if (key === 'deduceNum') {
                  allBtns[11].number = +element
                }
                if (key === 'lockNum') {
                  allBtns[12].number = +element
                }
              }
            }
          }
          return {
            result: data.rows,
            totalCount: data.total,
            pageSize: data.pageSize,
            pageNo: data.pageNo
          }
        })
      },

      activeBtn: 0,

      isLoading: false,

      isIE11: null,
      params: {
        productBaseStatus: null,
        sortOrder: 'asc'
      },

      editBtns: [
        {
          name: '基础编辑',
          icon: '&#xe791;',
          func: this.editItemBase
        },
        {
          name: '编辑',
          icon: '&#xe791;',
          func: this.editItem
        },
        {
          name: '复制添加',
          icon: '&#xe7bc;',
          func: this.copyAdd
        },
        {
          name: '审核',
          icon: '&#xe7e3;',
          func: this.reviewBase
        },
        {
          name: '审核',
          icon: '&#xe7e3;',
          func: this.reviewPhchase
        },
        {
          name: '作废',
          icon: '&#xe7b7;',
          func: this.delItem
        },
        {
          name: '查看原因',
          icon: '&#xe78f;',
          func(props) {
            if (props.item.auditMap[1] == 3) {
              return vm.showReason(props, 1)
            } else if (props.item.auditMap[2] == 3) {
              return vm.showReason(props, 2)
            }
          }
        },
        {
          name: '查看打回原因',
          icon: '&#xe78f;',
          func(props) {
            return vm.showReason(props, 3)
          }
        },
        //  基本信息和采购信息都可以编辑
        {
          name: '编辑',
          icon: '&#xe791;',
          func: this.editItemAll
        },
        //  基本信息和采购信息都可以编辑
        {
          name: '查看日志',
          icon: '&#xe61e;',
          func: this.getLog
        },
        {
          name: '还原',
          icon: '&#xe787;',
          func: this.revert
        }
      ],

      allBtns: [
        {
          text: '正常',
          number: 3,
          param: null
        },
        {
          text: '基本资料编辑',
          number: 3,
          param: '1'
        },
        {
          text: '采购编辑',
          number: 3,
          param: '3'
        },
        {
          text: '基础信息待审核',
          number: 3,
          param: '2'
        },
        {
          text: '采购待审核',
          number: 3,
          param: '4'
        },
        {
          text: '审核通过',
          number: 3,
          param: '5'
        },
        {
          text: '作废产品',
          number: 0,
          param: '8'
        },

        {
          text: '基础信息打回',
          number: 0,
          param: '6'
        },
        {
          text: '采购编辑打回',
          number: 0,
          param: '7'
        },
        {
          text: '基础审核不通过',
          number: 0,
          param: '9'
        },
        {
          text: '采购审核不通过',
          number: 0,
          param: '10'
        },
        {
          text: '逆推',
          number: 0,
          param: '11'
        },
        {
          text: '锁定',
          number: 0,
          param: '12'
        }
      ],
      columns: [
        {
          title: 'ID',
          field: 'productId',
          width: '140px',
          show: true
        },
        {
          title: '操作',
          field: 'edit',
          width: '100px',
          show: true
        },
        {
          title: '产品图片',
          field: 'photo',
          show: true
        },
        {
          title: '系统SKU',
          field: 'sku',
          show: true
        },
        {
          title: '自定义SKU',
          field: 'skuCustom',
          show: true
        },
        {
          title: '中文名',
          field: 'nameZh',
          show: true
        },
        {
          title: '英文名',
          field: 'nameEn',
          show: true
        },
        {
          title: '产品类型',
          field: 'productType',
          show: true
        },
        {
          title: '发货仓库',
          field: 'warehouseIdString',
          show: true
        },
        {
          title: '来源',
          field: 'sourceTypeString',
          show: true
        },
        {
          title: '采购价',
          field: 'supplierPrice',
          show: true
        },
        {
          title: '售价',
          field: 'salePriceNow',
          show: true
        },
        {
          title: '开发人员',
          field: 'baseOperator',
          show: true
        },
        {
          title: '采购人员',
          field: 'purchaseOperator',
          show: true
        },
        {
          title: '审核状态',
          field: 'auditMap',
          show: true
        },
        {
          title: '产品状态',
          field: 'productBaseStatusString',
          show: true
        },
        {
          title: '库存',
          field: 'repertoryAll',
          show: true
        },
        {
          title: '推荐指数',
          field: 'recommendLevel',
          show: true
        },
        // {
        //   title: "销量",
        //   field: "dailyTargetAll",
        //   show: true
        // },
        {
          title: '供应商',
          field: 'supplierName',
          show: true
        },
        {
          title: '重量',
          field: 'weight',
          show: true
        }
      ],
      tableData: [],
      treeOption: {
        isAsync: true,
        idKey: 'productId',
        loadChildren: function(pramas) {
          return fetchData({ url: GET_PRODUCT_ALL_LIST, params }).then(res => {
            console.log(res)
            return res.data
          })
        }
      },
      options: [],
      searchData: '',
      searchParams: {},
      items: [],
      pageNo: 1,
      pageSize: 10,

      action: BASE_URL + apis.PRODUCT_BASE_BATCH_UPLOAD.url
    }
  },
  methods: {
    getLog(props) {
      let vm = this
      showDialog(
        'logProductDev',
        { title: '操作日志', width: 1200, modalnoBtn: true },
        { item: props.item, type: 'baseProduct' }
      )
    },
    // 还原作废的产品
    revert(props) {
      let { productId } = props.item,
        vm = this
      fetchData({
        ...apis.PRODUCT_INVALID_BACK,
        data: {
          productId
        }
      }).then(res => {
        handlerCode(res, () => {
          vm.$refs.table.refresh()
        })
      })
    },
    clear() {
      _storage.remove(
        'session',
        'purchase.productSupplierPriceEntityList.0.supplierPrice'
      )
    },
    hasVariant(props) {
      let auditMap = props.item.auditMap
      if (auditMap) {
        return Object.keys(auditMap).length
      }
      return null
    },
    // 显示审核不通过的原因
    showReason(props, type) {
      if (type == 3) {
        // 打回原因
        showDialog(
          YT_PRODUCT_SHOW_REASON,
          {
            title: `打回原因`,
            width: 800
          },
          { item: props.item, type }
        )
      } else if (type == 1 || type == 2) {
        // 审核不通过的原因
        showDialog(
          YT_PRODUCT_SHOW_REASON,
          {
            title: `${
              type == 1
                ? '基础信息审核'
                : type == 2
                ? '采购信息审核 '
                : '打回原因'
            }`,
            // width: 800
            modalnoBtn: true
          },
          { item: props.item, type },
          true
        )
      } else {
        // 作废原因
        showDialog(
          YT_PRODUCT_SHOW_REASON,
          {
            title: `作废原因`,
            width: 800
          },
          { item: props.item, type }
        )
      }
    },
    // 简单查询执行
    simpleSearch(data, type) {
      // let params = {};
      // if (data.skuType === 1) {
      //   params.sku = data.sku;
      // } else {
      //   params.skuCustom = data.sku == "" ? null : data.sku;
      // }
      // params.nameZh = data.nameZh == "" ? null : data.nameZh;
      this.pageNo = 1
      this.searchParams = data
      this.$refs.table.refresh()
    },

    // 筛选
    select() {
      console.log('sel')
    },

    // 搜索相应产品列表
    searchColumns(categoryId) {
      this.searchParams.categoryId = categoryId
      this.$refs.table.refresh()
    },

    getNewData(id, index) {
      this.activeBtn = index
      this.searchParams = {}
      this.params.productBaseStatus = id !== null ? +id : null
      this.$refs.table.refresh()
    },

    // 点击按钮
    editClickHander(e) {
      toUrl('/product/productList/addProduct.html')
    },

    // 生成组合产品
    addGroupClickHander(e) {
      toParamUrl('/product/productList/addProduct.html', {
        groupFlag: true
      })
      // toUrl("/product/productList/addProduct.html?type=group");
    },

    set() {
      showDialog(YT_SEARCH, {})
    },

    // 删除产品按钮
    deleteProducts() {
      let vm = this
      let arrs = vm.$refs.table.getCheckedData().map(el => el.productId)
      if (arrs.length == 0) {
        showToast('info', '请选择至少一个产品')
        return
      }

      showConfirm({
        title: '是否删除产品',
        onOk() {
          fetchData({
            ...apis.PRODUCT_REMOVE,
            data: {
              productIds: arrs
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast('success', '删除成功')
              vm.$refs.table.refresh()
            } else {
              showToast('error', res.data.msg)
            }
          })
        }
      })
    },

    batchSet() {},

    // 采购编辑
    setPurchase() {
      toUrl('/product/productList/editPurchase.html')
    },

    // 采购审核
    reviewPhchase(props) {
      console.log(props)
      let vm = this
      showDialog(
        YT_PRODUCT_SHOW_PHCHASE,
        {
          title: '采购信息审核',
          // width: 1200,
          okText: '确认审核'
        },
        { ...props, type: 2 },
        {
          set() {
            vm.$refs.table.refresh()
          }
        },
        true
      )
    },

    // 基础信息审核
    reviewBase(props) {
      let vm = this
      console.log(props)
      showDialog(
        YT_PRODUCT_SHOW,
        {
          title: '基础信息审核',
          width: 1200,
          okText: '确认审核'
        },
        { ...props, show: true },
        {
          set() {
            console.log('刷新')
            vm.$refs.table.refresh()
          }
        },
        true
      )
    },

    // 表格

    // 查看原因
    viewReason(props, type) {
      switch (type) {
        case 1:
          // 基础信息审核不通过
          fetchData({
            ...apis.PRODUCT_AUDIT_INFO,
            data: {
              productId: 1,
              auditType: type
            }
          }).then(res => {
            console.log(res)
          })
          break
        case 2:
          // 采购信息审核不通过
          break
        case 3:
          // 打回
          break

        default:
          break
      }
    },

    // 作废产品
    delItem: function(props) {
      let vm = this
      showConfirm({
        title: '是否作废此产品？',
        onOk() {
          fetchData({
            ...apis.PRODUCT_INVALID,
            data: {
              productIds: [props.item.productId]
            }
          }).then(res => {
            handlerCode(res, () => {
              vm.$refs.table.refresh()
            })
          })
        }
      })
      console.log(props)
    },

    // 查看产品
    linkToView: function(props) {
      let status =
        props.item.productBaseStatus <= 2 || props.item.productBaseStatus == 6
          ? 0 // 基础信息展示
          : 1 // 两个都展示
      console.log(status)
      if (props.item.status === 8) {
        return
      }
      // 变体浏览
      if ('variantSku' in props.item) {
        toUrl(
          `/product/productList/viewProductVariant.html?productId=${
            props.item.productId
          }&isshow=true&variant=true&${!status ? 'base=true' : ''}&${
            props.item.groupFlag ? `groupFlag=true` : ''
          }&parent=${props.item.parentId}&parentId=${props.item.parentId}`
        )
      } else {
        // 母体浏览
        toUrl(
          `/product/productList/viewProduct.html?productId=${
            props.item.productId
          }&isshow=true&${!status ? 'base=true' : ''}&${
            props.item.groupFlag ? `groupFlag=true` : ''
          }`
        )
      }

      // 母体浏览
      console.log(props)
    },

    // 编辑产品
    editItem: function(props) {
      if (this.hasVariant(props)) {
        toUrl(
          `/product/productList/editPurchase.html?productId=${
            props.item.productId
          }&${props.item.groupFlag ? `groupFlag=true` : ''}`
        )
      } else {
        toUrl(
          `/product/productList/editPurchase.html?productId=${
            props.item.productId
          }&variant=true&${
            props.item.groupFlag ? `groupFlag=true` : ''
          }&parentId=${props.item.parentId}&parentId=${props.item.parentId}`
        )
      }
    },

    // 基础信息编辑
    editItemBase: function(props) {
      if (this.hasVariant(props)) {
        toUrl(
          `/product/productList/addProduct.html?productId=${
            props.item.productId
          }&${props.item.groupFlag ? `groupFlag=true` : ''}`
        )
      } else {
        toUrl(
          `/product/productList/editVariant.html?productId=${
            props.item.productId
          }&variant=true&${
            props.item.groupFlag ? `groupFlag=true` : ''
          }&parentId=${props.item.parentId}`
        )
      }
    },

    // 所有信息可编辑
    editItemAll(props) {
      if (this.hasVariant(props)) {
        toUrl(
          `/product/productList/editAll.html?productId=${
            props.item.productId
          }&${props.item.groupFlag ? `groupFlag=true` : ''}`
        )
      } else {
        toUrl(
          `/product/productList/editAll.html?productId=${
            props.item.productId
          }&variant=true&${
            props.item.groupFlag ? `groupFlag=true` : ''
          }&parentId=${props.item.parentId}`
        )
      }
    },

    // 复制添加
    copyAdd: function(props) {
      let vm = this
      showConfirm({
        title: '是否复制添加此产品？',
        onOk() {
          vm.loadingTip = '复制中...'
          vm.loadingPage = true
          fetchData({
            ...apis.PRODUCT_COPY,
            data: {
              productId: props.item.productId
            }
          }).then(res => {
            vm.loadingTip = ''
            vm.loadingPage = false
            if (res.data.code === 0) {
              toUrl(
                `/product/productList/addProduct.html?productId=${
                  res.data.productId
                }&groupFlag=${!!props.item.groupFlag}`
              )
            } else {
              showToast('error', res.data.msg)
            }
          })
        }
      })
    },

    checkAll: function(value) {
      this.checkAllMsg = '当前全选状态是：' + value
    },

    clickRow: function({ row, checked, index }) {
      if (row.hasOpen) {
        // 如果变体是打开的，勾上所有变体
        for (let i = index; i <= index + row.count; i++) {
          this.$refs.table.setChecked(i, checked)
        }
      }
    },

    // 查看变体
    viewVariant(props) {
      if (this.tableData[props.index].hasOpen) {
        this.tableData.splice(
          props.index + 1,
          this.tableData[props.index].count
        )
        this.tableData[props.index].hasOpen = false
      } else {
        this.isLoading = true
        this.tableData[props.index].hasOpen = true
        fetchData({
          ...apis.PRODUCT_VARIANT_LIST,
          data: {
            productId: props.item.productId
          }
        }).then(res => {
          this.isLoading = false
          if (res.data.length !== 0) {
            this.tableData[props.index].count = res.data.length
            console.log(props)
            res.data.map((el, index) => {
              el.auditMap = {}
              el.productBaseStatus = props.item.productBaseStatus
              el.productBaseStatusString = props.item.productBaseStatusString
              el.review2 = props.item.review2
              el.nameEn = el.variantNameEn
              el.sku = el.variantSku
              el.skuCustom = el.variantSkuCustom
              el.nameZh = el.variantNameZh
              el._variant = true
            })
            this.tableData.splice(props.index + 1, 0, ...res.data)
            this.$nextTick(() => {
              for (
                let i = props.index;
                i <= props.index + res.data.length;
                i++
              ) {
                this.$refs.table.setChecked(i, props.item.vb_dt_checked)
              }
            })
          } else {
            showToast('error', res.data.msg)
          }
        })
      }
    },

    handleCommand(command) {},

    handleCommand1(command) {
      let data = this.getTableData()
      // const { parent: data } = dataAll;
      let auditType, auditStatus
      if (!data) {
        return
      }
      let vm = this

      if (command === 'a') {
        auditType = 1
        auditStatus = 2
      }

      if (command === 'b') {
        auditType = 2
        auditStatus = 2
      }

      if (command === 'c') {
        auditType = 1
        auditStatus = 3
      }

      if (command === 'd') {
        auditType = 2
        auditStatus = 3
      }
      // 批量基础信息审核
      showDialog(
        'batchProductReview',
        {
          title: '基础信息批量审核',
          width: 1200,
          okText: '确认审核'
        },
        {},
        {
          set(childVm) {
            showConfirm({
              title: '您是否提交审核结果',
              content: '',
              onOk: function() {
                // 提交审核
                fetchData({
                  ...apis.PRODUCT_AUDIT_UPDATE,
                  data: {
                    productIds: data,
                    auditType,
                    auditStatus,
                    auditReason: childVm.ruleForm.auditReason
                  }
                }).then(res => {
                  const { successNum, failNum, errorMsg } = res.data
                  if (failNum === 0) {
                    showToast('success', '审核成功')
                  } else {
                    showToast(
                      'warning',
                      `成功审核${successNum}条，失败${failNum}条.<br>${errorMsg}`
                    )
                  }
                  childVm.cancel()
                  vm.$refs.table.refresh()
                })
              }
            })
          }
        }
      )
    },

    handleCommand2(command) {
      let data = this.getTableData()
      let operationType
      if (!data) {
        return
      }
      let vm = this

      if (command === 'a') {
        operationType = 1
      }

      if (command === 'b') {
        operationType = 3
      }

      // 批量基础信息审核
      showDialog(
        'batchAssign',
        {
          title: '分配人员',
          width: 480,
          modalnoBtn: true
        },
        { type: operationType },
        {
          set(childVm) {
            fetchData({
              ...apis.PRODUCT_OPERATION_BATCH_UPDATE,
              data: {
                productIds: data,
                operationType,
                operatorId: childVm.ruleForm.operatorId
              }
            }).then(res => {
              handlerCode(
                res,
                () => {
                  childVm.cancel()
                  vm.$refs.table.refresh()
                },
                () => {}
              )
            })
          }
        }
      )
    },

    handleCommand3(command) {
      let data = this.getTableData(command)
      let operationType
      if (!data) {
        return
      }
      let vm = this

      if (command === 'a') {
        // 批量作废
        showConfirm({
          title: '是否批量作废选中的产品？',
          onOk() {
            fetchData({
              ...apis.PRODUCT_INVALID,
              data: {
                productIds: data
              }
            }).then(res => {
              if (res.data.code === 0) {
                showToast('success', '作废成功')
                vm.$refs.table.refresh()
              } else {
                showToast('error', res.data.msg)
              }
            })
          }
        })
      }

      if (command === 'b') {
        const data = this.getTableData()
        const vm = this
        // 组合产品
        showDialog(
          'GenerateCompositeProducts',
          {
            title: '生成组合产品',
            width: 1200,
            modalnoBtn: true
          },
          { data },
          {
            set(childVm) {
              vm.$refs.table.refresh()
            }
          }
        )
      }

      if (command === 'c') {
        let _data = this.getDiffTableData()
        // 导出报价
        showConfirm({
          title: '是否批量导出报价？',
          onOk() {
            fetchData({
              ...apis.PRODUCT_SUPPLIER_PRICE_REL_BATCH_DOWNLOAD,
              data: {
                parentIds: _data.parent,
                variantIds: _data.variant
              }
            }).then(res => {
              downloadFile(res.data.path)
            })
          }
        })
      }

      if (command === 'd') {
        let _data = this.getDiffTableData(true)
        // 导入供应商报价
        showDialog(
          'importPrice',
          {
            title: '导入供应商报价',
            width: 1200,
            modalnoBtn: true
          },
          {
            type: operationType,
            data: {
              parentIds: _data.parent,
              variantIds: _data.variant
            }
          },
          {
            set(childVm) {
              childVm.cancel()
              vm.$refs.table.refresh()
            }
          }
        )
      }

      if (command === 'e') {
        let _data = this.getDiffTableData()
        // 修改备注
        showDialog(
          'batchReviseNotes',
          {
            title: '批量修改产品备注',
            width: 600,
            modalnoBtn: true
          },
          {},
          {
            set(childVm) {
              childVm.loading = true
              fetchData({
                ...apis.PRODUCT_REMARK_BATCH_UPDATE,
                data: {
                  parentIds: _data.parent,
                  variantIds: _data.variant,
                  remarkType: childVm.ruleForm.remarkType,
                  remarkStr: childVm.ruleForm.remarkStr
                }
              }).then(res => {
                handlerCode(
                  res,
                  () => {
                    childVm.loading = false
                    childVm.cancel()
                    vm.$refs.table.refresh()
                  },
                  () => {}
                )
              })
            }
          }
        )
      }

      if (command === 'f') {
        let _data = this.getDiffTableData()
        // 更换供应商
        showDialog(
          'batchReplaceSuppliers',
          {
            title: '更换供应商',
            width: 600,
            modalnoBtn: true
          },
          { parentIds: _data.parent, variantIds: _data.variant },
          {
            set(childVm) {
              fetchData({
                ...apis.PRODUCT_OPERATION_BATCH_UPDATE,
                data: {
                  productIds: data,
                  operationType,
                  operatorId: childVm.ruleForm.operatorId
                }
              }).then(res => {
                handlerCode(
                  res,
                  () => {
                    childVm.cancel()
                    vm.$refs.table.refresh()
                  },
                  () => {}
                )
              })
            }
          }
        )
      }

      if (command === 'g') {
        let _data = this.getDiffTableData()
        // 添加配件
        showDialog(
          'BatchAddProductAccessories',
          {
            title: '批量添加产品配件',
            width: 600,
            modalnoBtn: true
          },
          { parentIds: _data.parent, variantIds: _data.variant },
          {
            set(childVm) {
              fetchData({
                ...apis.PRODUCT_OPERATION_BATCH_UPDATE,
                data: {
                  productIds: data,
                  operationType,
                  operatorId: childVm.ruleForm.operatorId
                }
              }).then(res => {
                handlerCode(
                  res,
                  () => {
                    childVm.cancel()
                    vm.$refs.table.refresh()
                  },
                  () => {}
                )
              })
            }
          }
        )
      }

      if (command === 'h') {
        let _data = this.getDiffTableData()
        // 批量删除产品配件
        showDialog(
          'BatchAddProductAccessories',
          {
            title: '批量删除产品配件',
            width: 600,
            modalnoBtn: true
          },
          { del: true, parentIds: _data.parent, variantIds: _data.variant },
          {
            set(childVm) {
              fetchData({
                ...apis.PRODUCT_OPERATION_BATCH_UPDATE,
                data: {
                  productIds: data,
                  operationType,
                  operatorId: childVm.ruleForm.operatorId
                }
              }).then(res => {
                handlerCode(
                  res,
                  () => {
                    childVm.cancel()
                    vm.$refs.table.refresh()
                  },
                  () => {}
                )
              })
            }
          }
        )
      }

      if (command === 'i') {
        // 采集退税率
        showDialog(
          'BatchCollectionTax',
          {
            title: '批量采集退税率',
            width: 600,
            modalnoBtn: true
          },
          {},
          {
            set(childVm) {
              fetchData({
                ...apis.PRODUCT_OPERATION_BATCH_UPDATE,
                data: {
                  productIds: data,
                  operationType,
                  operatorId: childVm.ruleForm.operatorId
                }
              }).then(res => {
                handlerCode(
                  res,
                  () => {
                    childVm.cancel()
                    vm.$refs.table.refresh()
                  },
                  () => {}
                )
              })
            }
          }
        )
      }

      if (command === 'j') {
        let _data = this.getDiffTableData()
        // 清除采集退税率
        showDialog(
          'BatchCollectionTax',
          {
            title: '批量清除退税率',
            width: 600,
            modalnoBtn: true
          },
          { parentIds: _data.parent, variantIds: _data.variant },
          {
            set(childVm) {
              fetchData({
                ...apis.PRODUCT_OPERATION_BATCH_UPDATE,
                data: {
                  productIds: data,
                  operationType,
                  operatorId: childVm.ruleForm.operatorId
                }
              }).then(res => {
                handlerCode(
                  res,
                  () => {
                    childVm.cancel()
                    vm.$refs.table.refresh()
                  },
                  () => {}
                )
              })
            }
          }
        )
      }

      if (command === 'k') {
        let _data = this.getDiffTableData()
        // 清除采集退税率
        showDialog(
          'ExtractCustomSku',
          {
            title: '提取自定义产品SKU',
            width: 600,
            modalnoBtn: true
          },
          { parentIds: _data.parent, variantIds: _data.variant },
          {
            set(childVm) {
              fetchData({
                ...apis.PRODUCT_OPERATION_BATCH_UPDATE,
                data: {
                  productIds: data,
                  operationType,
                  operatorId: childVm.ruleForm.operatorId
                }
              }).then(res => {
                handlerCode(
                  res,
                  () => {
                    childVm.cancel()
                    vm.$refs.table.refresh()
                  },
                  () => {}
                )
              })
            }
          }
        )
      }

      if (command === 'l') {
        let _data = this.getDiffTableData()
        //
        showDialog(
          'ExtractCustomSku',
          {
            title: '提取产品SKU',
            width: 600,
            modalnoBtn: true
          },
          { parentIds: _data.parent, variantIds: _data.variant, sku: true },
          {
            set(childVm) {
              fetchData({
                ...apis.PRODUCT_OPERATION_BATCH_UPDATE,
                data: {
                  productIds: data,
                  operationType,
                  operatorId: childVm.ruleForm.operatorId
                }
              }).then(res => {
                handlerCode(
                  res,
                  () => {
                    childVm.cancel()
                    vm.$refs.table.refresh()
                  },
                  () => {}
                )
              })
            }
          }
        )
      }

      return
    },

    handleCommand4(command) {
      let vm = this
      if (command === 'a') {
        // 批量导入产品
        showDialog(
          'DownloadTemp',
          {
            title: '导入产品',
            width: 600,
            modalnoBtn: true
          },
          {},
          {
            set(res) {
              let { code, failNum: errNum, successNum, errMsg, msg } = res.data
              // if (code === 0) {

              // } else {
              //   showToast('error', msg || '服务器请求异常，请联系管理员')
              // }
              if (errNum > 0 && successNum === 0) {
                showToast('error', errMsg)
              } else if (errNum > 0 && successNum > 0) {
                showToast(
                  'warning',
                  errNum + '行记录操作失败,' + successNum + '行记录操作成功'
                )
              } else if (code !== 0) {
                showToast('error', res.data.msg)
              } else if (code === 0) {
                showToast('success', res.data.msg)
              }
              if (code !== 0) {
                return
              }
              vm.$refs.table.refresh()
            }
          }
        )
        // this.$refs.file.click();
      }
      if (command === 'b') {
        // 批量导入产品图片
      }
      if (command === 'c') {
        // 批量导入产品原料
        toUrl('/product/productList/importMaterialProduct.html')
      }
    },

    // 自定义导出产品
    CustomExport() {
      let _data = this.getDiffTableData()
      let vm = this
      showDialog(
        'batchCustomExport',
        {
          title: '自定义导出',
          width: 1200,
          modalnoBtn: true
        },
        { parentIds: _data.parent, variantIds: _data.variant },
        {
          set(childVm) {
            vm.$refs.table.refresh()
          }
        }
      )
    },

    getTableData(command) {
      let data = this.$refs.table.getCheckedData()
      if (data.length == 0 && command !== 'd') {
        showToast('info', '请选择至少一条数据进行编辑')
        return
      }
      data = data.map(el => el.productId)

      return data
    },

    getDiffTableData(notValid, all = false) {
      let data = this.$refs.table.getCheckedData()
      let variant = [],
        parent = []
      if (data.length == 0 && !notValid) {
        showToast('info', '请选择至少一条数据进行编辑')
        return { variant, parent }
      }
      let _v = data.filter(el => el.variantSku != null),
        _p = data.filter(el => el.sku != null && el.variantSku == null)
      variant = all ? _v : _v.map(el => el.productId)
      parent = all ? _p : _p.map(el => el.productId)

      return {
        variant,
        parent
      }
    },

    // 导入产品时的操作
    handleImportFile(e) {
      let file = e.target.files[0]
      let vm = this
      if (!file) {
        return
      }
      let data = new FormData()
      data.append('file', file)
      fetchData({ ...apis.PRODUCT_BASE_BATCH_UPLOAD, data }).then(res => {
        // e.target.files.splice(0);
        this.$refs.file.value = ''
        handlerCode(res, () => {
          this.$refs.table.refresh()
        })
      })
    },
    // 批量锁定产品 或 批量解锁定产品
    lockOrUnlock(type) {
      let _data = this.getDiffTableData()
      let self = this
      if (_data !== undefined) {
        let url = {}
        let confirmTitle = ''
        if (type === 'lock') {
          confirmTitle = '此操作将批量锁定产品, 是否继续?'
          url = PRODUCT_BATCH_LOCK
        } else if (type === 'unlock') {
          confirmTitle = '此操作将批量解锁产品, 是否继续?'
          url = PRODUCT_BATCH_ULOCK
        } else {
          return false
        }

        if (_data.parent.length === 0) {
          showToast('warning', '请选择母体！')
          return
        }
        showConfirm({
          title: confirmTitle,
          onOk() {
            fetchData({
              ...url,
              data: {
                productIds: _data.parent
              }
            })
              .then(res => {
                let { code, errNum, successNum, errMsg, msg } = res.data
                if (code === 0) {
                  if (errNum > 0 && successNum === 0) {
                    showToast('error', '操作全部失败！')
                  } else if (errNum > 0 && successNum > 0) {
                    showToast(
                      'warning',
                      errNum + '行记录操作失败,' + successNum + '行记录操作成功'
                    )
                  } else {
                    showToast('success', '操作成功！')
                  }
                  self.$refs.table.refresh()
                } else {
                  showToast('error', msg || '服务器请求异常，请联系管理员')
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      }
    },
    batchMoveProduct() {
      let vm = this
      let _data = this.getDiffTableData(true)
      // if(_data.variant.length===0){
      //   Message.error('变体为空!');
      //   return
      // }
      if (_data.variant.length === 0 && _data.parent.length === 0) {
        _data.variant = null
        _data.parent = null
      }
      showDialog(
        'BatchMoveProduct',
        {
          title: '批量挪动产品',
          width: 1110,
          modalnoBtn: true
        },
        {
          type: 'productList',
          variant: _data.variant,
          parent: _data.parent
        },
        {
          set() {
            vm.$refs.table.refresh()
          }
        }
      )
    },
    openGenerateProductProcessingBarcode() {
      const { variant, parent } = this.getDiffTableData(null, true),
        vm = this
      if (!variant.length) {
        showToast('info', '请选择变体！')
        return
      }
      showDialog(
        'ProduceProcessingBarcode',
        { title: '生成产品加工条码', width: 1200, okText: '确认导出条码' },
        { variant },
        {
          set() {
            vm.$refs.table.refresh()
          }
        }
      )
    }
  },
  computed: {
    columnsList() {
      return this.columns.filter(el => el.show)
    }
  }
}
</script>

<style lang="less">
@import '~assets/style/variables.less';

body {
  padding: 16px;
}

.product_tab {
  margin-top: 20px;
}
.sku {
  .id {
    font-weight: bolder;
    font-size: 14px;
  }
}
.subItems {
  position: relative;
  img,
  button {
    display: block;
    margin: 0 auto;
  }
  image {
    margin: 0 auto;
  }
  button {
    margin: 0 auto;
    margin-top: 12px;
  }
  .groupFlag {
    position: absolute;
    background: #f00;
    color: #fff;
    border-radius: 100%;
    width: 30px;
    height: 30px;
    right: -15px;
    top: -8px;
    display: flex;
    line-height: 30px;
    font-weight: bold;
    text-align: center;
    justify-content: center;
    align-items: center;
    z-index: 222;
    border: 2px solid #f9f9f9;
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

.showInfoData {
  cursor: pointer;
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
</style>
