<template>
  <CustomTransition>
    <div>
      <v-form :model="ruleForm">
        <v-form-item label="站点">
          <v-select size="lg" style="width: 120px;" v-model="ruleForm.siteId" :data="hostSelectOptions"></v-select>
        </v-form-item>
        <v-form-item v-if="ruleForm.siteId" label="店铺名称">
          <v-select size="lg" style="width: 120px;" v-model="ruleForm.storeId" :data="shopSelectOptions"></v-select>
        </v-form-item>
        <v-form-item label="产品名称">
          <v-input type="text" v-model="ruleForm.productName" placeholder="请输入产品名称"></v-input>
        </v-form-item>
        <v-form-item label="产品SKU">
          <v-input type="text" v-model="ruleForm.skuSys" placeholder="请输入产品SKU"></v-input>
        </v-form-item>
        <v-form-item>
          <v-button type="primary" html-type="button" @click.prevent="search">搜索</v-button>
        </v-form-item>
      </v-form>
      <div class="hr"></div>
      <!-- 亚马逊的批量操作 -->
      <div style="display:inline" v-if="platform === 1">
        <v-button type="primary" @click.stop="refresh" icon="reload" :class="{'_refresh_btn': refreshActive}"></v-button>
        <template v-if="!showOnline">
          <v-button type="primary" @click.stop="batches(1)">批量下架</v-button>
          <v-button type="primary" @click.stop="batches(2)">批量上架</v-button>
          <v-button type="primary" @click.stop="review(null, true)">批量审核</v-button>
          <v-button
            :loading="exportDownloadLoading"
            type="primary"
            @click.stop="exportDownload()"
            v-if="hasPerms('product:store:export')"
          >导出上架信息</v-button>
          <v-button type="primary" @click.stop="customExport">自定义导出</v-button>
          <v-button type="primary" @click.stop="batchMoveProduct">批量挪动产品</v-button>
          <v-button type="primary" @click.stop="moveLog">挪动日志</v-button>
        </template>
        <template v-else>
          <v-button type="primary" @click.stop="batchReverse">批量逆推</v-button>
          <v-button type="primary" @click.stop="batchAssociate">批量关联SKU</v-button>
        </template>

        <v-button type="primary" @click.stop="deleteItem()">批量删除</v-button>
        <v-button type="primary" @click.stop="revertDeleteItem()">批量还原删除</v-button>
      </div>
      <!-- SOUQ的批量操作 -->
      <div style="display:inline" v-if="platform === 3">
        <v-button type="primary" @click.stop="refresh" icon="reload" :class="{'_refresh_btn': refreshActive}"></v-button>
        <v-button type="primary" @click.stop="batchExport('souq')" :loading="batchExportLoading">批量导出</v-button>
      </div>

      <v-row style="margin-top: 10px;" :gutter="16">
        <v-col span="20">
          <v-button-group style="width:100%" class="ant-btn-group-tabs">
            <v-button
              v-if="allBtns.length"
              v-for="(item, key) in allBtns"
              @click="getNewData(item.status, key)"
              :class="activeBtn === key ? 'active' : ''"
              :key="key"
            >{{item.desc}}{{'(' + item.count + ')'}}</v-button>
          </v-button-group>
        </v-col>
        <v-col span="4" style="text-align:right" v-if="!showOnline">
          <CustomList :data.sync="columns" save-field="shopproduct_list"></CustomList>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-data-table
            :key="showOnline"
            showVar
            :bottomGap="20"
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
            class="margin-top-10"
            :current-data.sync="tableData"
            :pagination="true"
          >
            <template v-if="showOnline" slot="check" slot-scope="props">
              <div>
                <v-button
                  v-if="props.item.productType == 0 && !props.item.isVariant"
                  class="viewVariant"
                  :disabled="isLoading"
                  type="primary"
                  size="small"
                  @click.stop="viewVariant(props, $event, 1)"
                >查看变体({{props.item.variantCount}})</v-button>
              </div>
            </template>
            <template slot="th" slot-scope="props">
              <div v-if="props.column.field=='edit' || props.column.field=='edit1'" style="text-align:center">
                <strong>操作</strong>
              </div>
              <div v-else-if="props.column.field=='storeProductId'" style="text-align:center">
                <strong>ID</strong>
              </div>
              <div v-else-if="props.column.field=='basepro'" style="text-align:center">
                <strong>{{props.column.title}}</strong>
              </div>
              <div v-else-if="props.column.field=='productImg'" style="text-align:center">
                <strong>产品图片</strong>
              </div>
              <div v-else-if="props.column.field=='picOrigin'" style="text-align:center">
                <strong>图片</strong>
              </div>
              <div v-else-if="props.column.field=='express'">
                <strong>Express库存</strong>
              </div>
              <div v-else-if="props.column.field=='variant'" style="text-align:center"></div>

              <strong max-leh v-else v-html="props.title"></strong>
            </template>
            <template slot="td" slot-scope="props">
              <div @click="linkToView(props)" style="color:#333;height:100%;width:100%;cursor: pointer;">
                <div v-if="props.column.field=='productImg'">
                  <div v-if="!props.item.isVariant" class="flex">
                    <el-tooltip placement="right" effect="light" :open-delay="300">
                      <div slot="content">
                        <img
                          :key="props.item.imgM"
                          :src="props.item.imgM && props.item.imgM.replace(/,w_\d+/ig, ',w_240') || '/static/no-image.jpg'"
                        />
                      </div>
                      <div class="divContent" style="position:relative">
                        <!-- {{props.item}} -->
                        <img :src="props.item.imgM || '/static/no-image.jpg'" :alt="props.column.title" />
                      </div>
                    </el-tooltip>
                  </div>
                  <div v-else class="flex">
                    <el-tooltip placement="right" effect="light" :open-delay="300">
                      <div slot="content">
                        <img
                          :src="props.item.imgM && props.item.imgM.replace(/,w_\d+/ig, ',w_240') || '/static/no-image.jpg'"
                        />
                      </div>
                      <div class="divContent" style="position:relative;left:10px">
                        <!-- {{props.item}} -->
                        <img :src="props.item.imgM || '/static/no-image.jpg'" :alt="props.column.title" />
                      </div>
                    </el-tooltip>

                    <v-tag v-if="props.item.moveStatus === 1" color="yellow">移动中</v-tag>
                    <v-tag v-else-if="props.item.moveStatus === 2" color="green">成功</v-tag>
                    <v-tag v-else-if="props.item.moveStatus === 3" color="orange">失败</v-tag>
                  </div>
                </div>
                <div v-else-if="props.column.field=='statusList'">
                  <p v-for="item in props.content">{{item.statusDesc}}</p>
                  <p>{{props.item.publishTime}}</p>
                </div>
                <div v-else-if="props.column.field=='express'">
                  <v-button
                    v-if="props.item.wishWarehouseCount != null && props.item.wishWarehouseCount !== 0"
                    class="viewVariant"
                    :disabled="!props.item.wishWarehouseCount"
                    type="primary"
                    size="small"
                    @click.stop="showExpressStock(props)"
                  >{{props.item.wishWarehouseCount}}</v-button>
                  <span v-else-if="props.item.wishWarehouseCount === 0">0</span>
                  <span v-else>-</span>
                </div>

                <div v-else-if="props.column.field=='nameCn'" style="max-width:260px" class="__ellapase">
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="props.item.nameCn"
                    placement="top-start"
                    :open-delay="500"
                  >
                    <span>{{props.item.nameCn}}</span>
                  </el-tooltip>
                </div>
                <div
                  v-else-if="props.column.field=='nameEn' || props.column.field=='title'"
                  style="max-width:200px"
                  class="__ellapase"
                >
                  <el-tooltip
                    class="item"
                    effect="dark"
                    :content="props.content"
                    placement="top-start"
                    :open-delay="500"
                  >
                    <span>{{props.content}}</span>
                  </el-tooltip>
                </div>

                <div v-else-if="props.column.field=='banner'">
                  <div>
                    <img
                      :key="props.item.banner"
                      :src="props.item.banner || '/static/no-image.jpg'"
                      :alt="props.column.title"
                      width="30"
                    />
                    <br />
                  </div>
                </div>
                <div v-else-if="props.column.field=='storeNameOrigin' && props.item.storeEntity">
                  <p>{{props.item.storeEntity.name}}</p>
                </div>
                <div v-else-if="props.column.field=='storeProductId'" class="text-center">
                  <p>{{props.item.storeProductId}}</p>
                  <v-button
                    v-if="props.item.productType == 0 && !props.item.isVariant"
                    class="viewVariant"
                    :disabled="isLoading"
                    type="primary"
                    size="small"
                    @click.stop="viewVariant(props, $event)"
                  >查看变体({{props.item.variantCount}})</v-button>
                </div>
                <div v-else-if="props.column.field=='owner' && props.item.storeEntity">
                  <p>{{props.item.storeEntity.owner}}</p>
                </div>
                <div v-else-if="props.column.field=='picOrigin'">
                  <el-tooltip placement="right" effect="light" :open-delay="300">
                    <div slot="content">
                      <img
                        :key="props.item.imagePath"
                        :src="props.item.imagePath && props.item.imagePath.replace(/,w_\d+/ig, ',w_240') || '/static/no-image.jpg'"
                      />
                    </div>
                    <div class="divContent" style="position:relative;left:10px">
                      <!-- {{props.item}} -->
                      <img
                        :key="props.item.imagePath"
                        :src="props.item.imagePath || '/static/no-image.jpg'"
                        :alt="props.column.title"
                      />
                    </div>
                  </el-tooltip>
                  <!-- <img :src="props.item.imagePath || '/static/no-image.jpg'" :alt="props.column.title" width="50"> -->
                </div>
                <div v-else-if="props.column.field=='picNameEn'">
                  <a target="_blank" :href="props.item.productUrl" v-if="params.status == -1">{{props.item.nameEn}}</a>
                  <span v-else>{{props.item.nameEn}}</span>
                </div>
                <div v-else-if="props.column.field=='picSku'">
                  <span>{{props.item.skuStore}}</span>
                  <br />
                  <span>{{props.item.asin}}</span>
                </div>

                <div v-else-if="props.column.field=='picSpec'">
                  <div v-if="props.item.isVariant">{{props.item.propertyEntities}}</div>
                  <div v-else>-</div>
                </div>
                <div v-else-if="props.column.field=='picPrice'">{{props.item.price}}</div>
                <div v-else-if="props.column.field=='picStatus'">
                  <div v-if="props.item.statusDesc">
                    <p>{{props.item.statusDesc}}</p>
                  </div>
                </div>
                <div v-else-if="props.column.field=='basepro'" class="text-center">
                  <v-button
                    class="viewVariant"
                    style="padding: 0"
                    type="primary"
                    size="small"
                    @click.stop="toBaseProduct(props.item.baseProductEntity, props.item.productType)"
                  >{{props.item.baseProductEntity && props.item.baseProductEntity.skuCustom}}</v-button>
                </div>
                <div v-else-if="props.column.field=='edit'" class="edit-box">
                  <div>
                    <el-tooltip
                      v-if="props.item.productUrl"
                      class="item"
                      effect="dark"
                      content="打开链接"
                      placement="top-start"
                      :open-delay="500"
                    >
                      <a :href="props.item.productUrl" target="_blank" @click.stop class="_link">
                        <span>
                          <i class="iconfont __editBtns" v-html="`&#xe7e2;`"></i>
                        </span>
                      </a>
                    </el-tooltip>
                    <el-tooltip
                      class="item"
                      v-for="btn in props.item.buttonList"
                      effect="dark"
                      :content="btn.buttonDesc"
                      placement="top-start"
                      :open-delay="500"
                    >
                      <span @click.stop="buttonList[btn.buttonKey-1].func(props)">
                        <i class="iconfont __editBtns" v-html="buttonList[btn.buttonKey-1].icon"></i>
                      </span>
                    </el-tooltip>
                  </div>
                </div>
                <div v-else-if="props.column.field=='edit1'">
                  <div v-if="props.item.status == 1">
                    <div class="btn_wrapper edit-box">
                      <div>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="`关联系统SKU`"
                          placement="top-start"
                          :open-delay="500"
                        >
                          <span @click.stop="associate(props)">
                            <i class="iconfont __editBtns" v-html="`&#xe7e1;`"></i>
                          </span>
                        </el-tooltip>
                        <el-tooltip
                          class="item"
                          effect="dark"
                          :content="`逆推产品`"
                          placement="top-start"
                          :open-delay="500"
                        >
                          <span @click.stop="reverse(props)">
                            <i class="iconfont __editBtns" v-html="`&#xe7f2;`"></i>
                          </span>
                        </el-tooltip>
                      </div>
                    </div>
                  </div>
                </div>
                <span v-else v-html="props.content"></span>
              </div>
            </template>
          </v-data-table>
        </v-col>
      </v-row>
    </div>
  </CustomTransition>
</template>

<script>
import {
  fetchAllData,
  fetchData,
  toUrl,
  fixFrameHeight,
  showDialog,
  toParamUrl,
  showConfirm,
  showToast,
  getPerms,
  downloadFile,
  openLink,
  handlerCode
} from 'common/common'
import { isArray, debounce, browserType } from 'common/util'
import { YT_PRODUCT_FIX } from '../componentName'
import apis, { GET_PRODUCT_SKU_OPTIONS, GET_PRODUCT_ALL_LIST } from 'apis'
import {
  SHOP_PRODUCT_REVIEW,
  SHOP_PRODUCT_REVIEW_REASON
} from '../componentName'
import ytSimpleSearch from 'components/base/simpleSearch'
import CustomList from 'components/base/customList'
import CustomTransition from 'components/base/customTransition'
import router from 'common/router'

export default {
  name: 'productList',
  components: {
    ytSimpleSearch,
    CustomTransition,
    CustomList
  },
  props: ['platform'],
  created() {
    // 请求初始化数据
    if (!browserType()) {
      this.isIE11 = 20
    }

    // 获取状态列表
    this.getStatus()

    // 初始化下拉
    this.initDataDrop()

    // 如果是wish 列表数据要加入 express库存数据
    if (this.platform === 5) {
      if (!this.columns.find(el => el.title === 'Express库存')) {
        this.columns.splice(14, 0, {
          title: 'Express库存',
          field: 'express',
          show: true
        })
      }
    } else {
      this.columns = this.columns.filter(el => el.title !== 'Express库存')
    }
  },
  data() {
    let vm = this
    return {
      exportDownloadLoading: false,
      batchExportLoading: false,
      showOnline: false,
      searchComponent: 'ytSimpleSearch',
      lists: data => {
        let url = apis.STORE_PRODUCT_LIST_PARENT.url
        data.pageNumber = data.pageNo
        delete data.pageNo
        if (vm.params.url) {
          url = vm.params.url
        }
        let reqData = Object.assign({}, vm.params, data, vm.ruleForm)
        delete reqData.url
        let opts = Object.assign({
          url,
          method: 'post',
          data: reqData
        })
        return fetchData(opts).then(res => {
          let rows = res.data.rows
          let data = rows.rows
          vm.refreshActive = false
          console.log(res.data)
          return {
            result: data,
            totalCount: rows.total,
            pageSize: rows.pageSize,
            pageNo: rows.pageNo
          }
        })
      },
      ruleForm: {
        host: ''
      },
      refreshActive: false,
      hostSelectOptions: [
        {
          label: '美国站',
          value: 1
        }
      ],
      isLoading: false,
      shopSelectOptions: [],
      isIE11: null,
      activeBtn: 0,
      params: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1,
        platformId: this.platform,
        status: 0
      },
      allBtns: [],
      // 亚马逊
      columns: [
        {
          title: 'ID',
          field: 'storeProductId',
          show: true
        },
        {
          title: '查看变体',
          field: 'variant',
          show: true
        },
        {
          title: '操作',
          field: 'edit',
          show: true
        },
        {
          title: '站点',
          field: 'banner',
          show: true
        },
        {
          title: '店铺',
          field: 'storeName',
          show: true
        },

        {
          title: '产品图片',
          field: 'productImg',
          show: true
        },
        {
          title: '中文名',
          field: 'nameCn',
          show: true
        },
        {
          title: '英文名',
          field: 'nameEn',
          show: true
        },
        {
          title: '状态',
          field: 'statusList',
          show: true
        },
        {
          title: '商品标题',
          field: 'title',
          show: true
        },
        {
          title: 'sku',
          field: 'skuStore',
          show: true
        },
        {
          title: 'ASIN',
          field: 'asin',
          show: true
        },
        {
          title: 'FNSKU',
          field: 'skuFn',
          show: true
        },
        {
          title: 'UPC/EAN',
          field: 'productId',
          show: true
        },
        {
          title: '本地仓结余库存',
          field: 'localInventory',
          show: true
        },
        {
          title: '今日销量',
          field: 'version1',
          show: true
        },
        {
          title: '本周销量',
          field: 'version2',
          show: true
        },
        {
          title: '售价',
          field: 'price',
          show: true
        },
        {
          title: 'FBA状态',
          field: 'version3',
          show: true
        },
        {
          title: '时间',
          field: 'createTime',
          show: true
        }
      ],

      // 在线产品列表
      columns1: [
        {
          title: '操作',
          field: 'edit1',
          show: true
        },
        {
          title: '图片',
          field: 'picOrigin',
          show: true
        },
        {
          title: '来源店铺',
          field: 'storeNameOrigin',
          show: true,
          width: '100px'
        },
        {
          title: '店铺业务员',
          field: 'owner',
          show: true
        },

        {
          title: '英文名称',
          field: 'picNameEn',
          show: true
        },
        {
          title: '店铺SKU/ASIN',
          field: 'picSku',
          show: true
        },
        {
          title: '规格参数',
          field: 'picSpec',
          show: true
        },
        {
          title: '销售价',
          field: 'picPrice',
          show: true
        },
        {
          title: '状态',
          field: 'picStatus',
          show: true
        },
        {
          title: '关联产品',
          field: 'basepro',
          show: true
        }
      ],

      buttonList: [
        {
          buttonDesc: '编辑',
          buttonKey: 1,
          func: this.editListing,
          icon: '&#xe791;'
        },
        {
          buttonDesc: '审核',
          buttonKey: 2,
          func: this.review,
          icon: '&#xe7e3;'
        },
        {
          buttonDesc: '立即刊登',
          buttonKey: 3,
          func: this.publish,
          icon: '&#xe628;'
        },
        {
          buttonDesc: '下架',
          buttonKey: 4,
          func: this.downProduct,
          icon: '&#xe60e;'
        },
        {
          buttonDesc: '查看审核不通过原因',
          buttonKey: 5,
          func: this.lookAtReasonNot,
          icon: '&#xe78f;'
        },
        {
          buttonDesc: '查看刊登失败原因',
          buttonKey: 6,
          func: this.lookAtReason,
          icon: '&#xe78f;'
        },
        {
          buttonDesc: '编辑重新刊登',
          buttonKey: 7,
          func: this.editListing,
          icon: '&#xe786;'
        },
        {
          buttonDesc: '复制上传',
          buttonKey: 8,
          func: this.copy,
          icon: '&#xe7bc;'
        },
        {
          // buttonDesc: '删除',
          // buttonKey: 9,
          // func: this.delete,
          // icon: '&#xe7bc;'
        },
        {
          buttonDesc: '删除',
          buttonKey: 10,
          func: this.deleteItem,
          icon: '&#xe7c3;'
        },
        {
          buttonDesc: '还原删除',
          buttonKey: 11,
          func: this.revertDeleteItem,
          icon: '&#xe787;'
        },
        {
          buttonDesc: '打开产品链接',
          buttonKey: 12,
          func: this.openLink,
          icon: '&#xe7e2;'
        },
        {
          buttonDesc: '导出',
          buttonKey: 13,
          func: this.exportSouq,
          icon: '&#xe792;'
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
      items: [],
      pageNo: 1,
      pageSize: 10
    }
  },
  watch: {
    'ruleForm.siteId'(val) {
      if (val) {
        this.getStoreName(val).then(data => {
          this.ruleForm.storeId = null
          this.shopSelectOptions = data
        })
      }
    }
  },
  methods: {
    // 显示库存数量
    showExpressStock(props) {
      let { storeProductId, productType } = props.item
      showDialog(
        'wishExpressInventory',
        {
          title: 'Express库存',
          width: 1200,
          modalnoBtn: true
        },
        {
          storeProductId,
          productType
        },
        {
          set(childVm) {}
        }
      )
    },
    refresh() {
      this.refreshActive = true
      this.getStatus()
      this.$refs.table.refresh()
    },
    batchAssociate() {
      let arr = this.$refs.table.getCheckedData()
      let vm = this
      if (arr.length) {
        if (
          !arr.every(el => el.productType === 0) &&
          !arr.every(el => el.productType === 1)
        ) {
          showToast('warning', '只能全部选择母体或者全部选择变体')
          return
        }
        let storeProductPlatIds = arr.map(item => {
          let {
            storeProductPlatId,
            storeProductPlatParentId,
            productType,
            productId
          } = item
          let params = { productType }
          if (productType === 0) {
            params.storeProductPlatId = storeProductPlatParentId
          } else {
            params.storeProductPlatId = storeProductPlatId
          }

          return params
        })

        showDialog(
          YT_PRODUCT_FIX,
          { title: '批量关联sku', width: 1000, modalnoBtn: true },
          {
            ...storeProductPlatIds[0],
            btnText: '确认关联'
          },
          {
            set: function() {},
            commit(childVm) {
              fetchData({
                ...apis.STORE_PRODUCT_PLAT_REL_BATCH,
                data: {
                  storeProductPlatIds,
                  baseProductId: childVm.getChecked()[0].productId
                }
              }).then(res => {
                const { code, msg, rows } = res.data

                if (res.data.code !== 0) {
                  showToast('error', res.data.msg)
                } else {
                  vm.refresh()
                  childVm.cancel()
                  if (rows.fail) {
                    showToast(
                      'warning',
                      `成功 ${rows.success} 个, 失败 ${rows.fail} 个.`
                    )
                  } else {
                    showToast('success', '批量关联成功')
                  }
                }
              })
            }
          }
        )
      } else {
        showToast('error', '请选择数据进行操作')
      }
    },
    // 关联
    associate(props) {
      let vm = this
      let {
        storeProductPlatId,
        storeProductPlatParentId,
        productType,
        productId
      } = props.item

      let params = { productType }
      if (productType === 0) {
        params.storeProductPlatId = storeProductPlatParentId
      } else {
        params.storeProductPlatId = storeProductPlatId
      }
      showDialog(
        YT_PRODUCT_FIX,
        { title: '关联sku', width: 1000, modalnoBtn: true },
        {
          ...params,
          btnText: '确认关联'
        },
        {
          set: function() {},
          commit(childVm) {
            fetchData({
              ...apis.STORE_PRODUCT_PLAT_REL,
              data: {
                storeProductPlatId: params.storeProductPlatId,
                productType,
                baseProductId: childVm.getChecked()[0].productId
              }
            }).then(res => {
              handlerCode(res, () => {
                vm.refresh()
                childVm.cancel()
              })
            })
          }
        }
      )
    },
    // 逆推
    reverse(props) {
      let vm = this
      // 0母体  1变体 2 独立产品
      let {
        storeProductPlatId,
        storeProductPlatParentId,
        productType,
        isVariant
      } = props.item

      showDialog(
        'ReverseShopProduct',
        { title: '逆推产品', width: 600, modalnoBtn: true },
        {
          storeProductPlatId:
            productType === 0 ? storeProductPlatParentId : storeProductPlatId,
          type: 'single',
          productType
        },
        {
          set: function() {
            vm.refresh()
          }
        }
      )
    },

    // 打开产品链接
    openLink(props) {
      let { storeProductParentId, storeProductId, productType } = props.item
      fetchData({
        ...apis.STORE_PRODUCT_URL,
        data: { productType, productId: storeProductId || storeProductParentId }
      }).then(res => {
        if (res.data.code !== 0) {
          showToast('error', res.data.msg)
          return
        } else {
          openLink(res.data.rows.url)
        }
      })
    },

    // 批量逆推
    batchReverse() {
      let arr = this.$refs.table.getCheckedData()
      let vm = this
      if (arr.length) {
        let storeProductPlatIds = arr.map(item => {
          return {
            //item.productType=0 表示母体
            storeProductPlatId: item.productType
              ? item.storeProductPlatId
              : item.storeProductPlatParentId,
            productType: item.productType,
            platformId: item.platformId,
            siteId: item.siteId
          }
        })

        showDialog(
          'ReverseShopProduct',
          { title: '逆推产品', width: 600, modalnoBtn: true },
          { batch: true, storeProductPlatIds },
          {
            set: function() {
              vm.refresh()
            }
          }
        )
      } else {
        showToast('error', '请选择需要逆推数据进行操作')
      }
    },

    hasPerms(perms) {
      // debugger
      let isPerm
      try {
        isPerm = this.perms.some(el => el.perms === perms)
      } catch (error) {
        // top.location.href = '/login.html'
      }

      return isPerm
    },
    search() {
      this.$refs.table.refresh()
    },

    initDataDrop() {
      let promises = [this.getSiteData(), this.getStoreName()]
      Promise.all(promises).then(res => {
        console.log(res)
        this.hostSelectOptions = res[0]
        this.shopSelectOptions = res[1]
      })
    },

    getSiteData() {
      return fetchData({
        ...apis.SITE_LIST,
        data: {
          platformId: this.platform
        }
      }).then(res => {
        return res.data.rows.map(el => ({
          label: el.siteNameZh,
          value: el.siteId
        }))
      })
    },

    getStoreName(siteId) {
      return fetchData({
        ...apis.STORE_LIST,
        data: {
          siteId,
          pageSize: 10000,
          platformId: this.platform,
          pageNumber: 1
        }
      }).then(res => {
        console.log(res)
        return res.data.rows.rows.map(el => ({
          label: el.name,
          value: el.storeId
        }))
      })
    },

    // 链接到基础产品库
    toBaseProduct(base, productType) {
      const { productId, parentProductId } = base,
      // FIXME: 判断条件是否改成productType !== 0
        variant = productType === 2
      const url = variant
        ? '#/product/productList/viewProductVariant.html'
        : '#/product/productList/viewProduct.html'
      toParamUrl(url, {
        productId,
        parent: parentProductId,
        parentId: parentProductId,
        variant,
        isshow: true,
        base: true
      })
    },

    //
    getStatus() {
      fetchData({
        ...apis.STORE_PRODUCT_GROUP_BY_STATUS,
        data: {
          platformId: this.platform
        }
      }).then(res => {
        if (res.data.code === 0) {
          this.allBtns = res.data.rows
        }
      })
    },
    // 简单查询执行
    simpleSearch(data) {
      console.log(data)
    },

    // 查看变体
    viewVariant(props, val, type) {
      let api = apis.STORE_PRODUCT_LIST_CHILD
      let vm = this

      console.log(props)
      if (this.tableData[props.index].hasOpen) {
        this.tableData.splice(
          props.index + 1,
          this.tableData[props.index].count
        )
        this.tableData[props.index].hasOpen = false
      } else {
        this.isLoading = true
        this.tableData[props.index].hasOpen = true
        if (type) {
          // 在线列表查看变体
          api = apis.STORE_PRODUCT_PLAT_VARIANT_LIST
        }
        fetchData({
          ...api,
          data: type
            ? {
                parentId: props.item.storeProductPlatParentId
              }
            : {
                deleteFlag: vm.params.status == -2 ? 1 : 0,
                storeProductParentId: props.item.storeProductId
              }
        }).then(res => {
          this.isLoading = false
          if (res.data.code !== 0) {
            showToast('error', res.data.msg)
            return
          }

          this.tableData[props.index].count = res.data.rows.length
          console.log(res.data.rows)
          res.data.rows.map(el => ((el.isVariant = true), (el._variant = true)))
          this.tableData.splice(props.index + 1, 0, ...res.data.rows)
          this.$nextTick(() => {
            for (
              let i = props.index;
              i <= props.index + res.data.rows.length;
              i++
            ) {
              this.$refs.table.setChecked(i, props.item.vb_dt_checked)
            }
          })
        })
      }
    },

    clickRow({ row, checked, index }) {
      if (row.hasOpen) {
        // 如果变体是打开的，勾上所有变体
        for (let i = index; i <= index + row.count; i++) {
          this.$refs.table.setChecked(i, checked)
        }
      }
    },

    // 审核流程
    review(props, multi) {
      let arrs
      if (multi) {
        // 批量审核流程
        arrs = this.$refs.table.getCheckedData()
        if (arrs.length == 0) {
          showToast('error', '请选择一条数据进行操作')
          return
        }
      }
      if (!props) {
        props = {}
      }
      let vm = this
      if (multi) {
        showDialog(
          SHOP_PRODUCT_REVIEW,
          { title: '审核' },
          {
            arrs: multi ? arrs : null
          },
          {
            // 绑定点击model确认事件,参数是选择的类目数组详情
            set: function(arr, childVm) {
              console.log(arr)
              fetchData({
                ...apis.STORE_PRODUCT_AUDIT_BATCH,
                data: { data: arr }
              }).then(res => {
                if (res.data.code === 0) {
                  showToast(
                    'success',
                    `成功：${res.data.auditResult.success}<br>失败：${res.data.auditResult.error}`,
                    '审核成功'
                  )
                  vm.refresh()
                  childVm.cancel()
                } else {
                  showToast('error', res.data.msg)
                }
              })
            }
          },
          true
        )
      } else {
        toParamUrl('/product/ShopProducts/reviewEditLists.html', {
          storeProductId: props.item.storeProductId,
          platformId: this.platform,
          productId: props.item.productParentId || props.item.baseProductId,
          baseProductParentId: props.item.baseProductParentId,
          variant: props.item.productType === 0 ? false : true,
          productType: props.item.productType,
          categoryId: props.item.categorySysId
        })
      }
    },

    // 编辑listing
    editListing(props) {
      console.log(props)

      toParamUrl('/product/ShopProducts/editLists.html', {
        storeProductId: props.item.storeProductId,
        productId: props.item.baseProductParentId || props.item.baseProductId,
        productType: props.item.productType,
        categoryId: props.item.categorySysId,
        platformId: this.platform,
        deleteFlag: this.params.status == -2 ? 1 : 0
      })
    },

    // 删除
    deleteItem(props) {
      let vm = this,
        data = {}

      let api = props
        ? apis.STORE_PRODUCT_DELETE
        : apis.STORE_PRODUCT_DELETE_BATCH
      if (!props) {
        data = this.getTableData(null, true).map(el => ({
          productId: el.storeProductId,
          productType: el.productType
        }))

        data = { data }
      } else {
        let { storeProductId, productType } = props.item
        data = { productId: storeProductId, productType }
      }
      showConfirm({
        title: '是否删除该产品?',
        onOk() {
          fetchData({
            ...api,
            data
          }).then(res => {
            if (res.data.code === 0) {
              showToast('success', res.data.msg)
              vm.refresh()
            } else {
              showToast('error', res.data.msg)
            }
          })
        }
      })
    },

    // 取消删除
    revertDeleteItem(props) {
      let vm = this,
        data = {}

      let api = props
        ? apis.STORE_PRODUCT_UNDELETE
        : apis.STORE_PRODUCT_UNDELETE_BATCH
      if (!props) {
        data = this.getTableData(null, true).map(el => ({
          productId: el.storeProductId,
          productType: el.productType
        }))
        data = { data }
      } else {
        let { storeProductId, productType } = props.item
        data = { productId: storeProductId, productType }
      }
      showConfirm({
        title: '是否还原删除该产品?',
        onOk() {
          fetchData({
            ...api,
            data
          }).then(res => {
            if (res.data.code === 0) {
              showToast('success', res.data.msg)
              vm.refresh()
            } else {
              showToast('error', res.data.msg)
            }
          })
        }
      })
    },

    // 下架
    downProduct(props) {
      let vm = this
      showConfirm({
        title: '是否下架该产品?',
        onOk() {
          fetchData({
            ...apis.STORE_PRODUCT_UNPUBLISH,
            data: {
              productId: props.item.storeProductId,
              productType: props.item.productType
            }
          }).then(res => {
            if (res.data.code === 0) {
              showToast('success', res.data.msg)
              vm.refresh()
            } else {
              showToast('error', res.data.msg)
            }
          })
        }
      })
    },

    // 查看刊登失败原因
    lookAtReason(props) {
      let data = {}
      data.productId = props.item.storeProductId
      data.productType = props.item.productType
      // fetchData({
      //   ...apis.STORE_PRODUCT_PUBLISH_FAIL_REASON,
      //   data: data
      // }).then(res => {
      //   if (res.data.code !== 0) {
      //     showToast("error", res.data.msg);
      //     return;
      //   }
      //   const info = res.data.rows;
      //   if (info && info[0] && info[0].downUrl) {
      //     window.open(info[0].downUrl);
      //     // downloadFile(info[0].downUrl, null, true);
      //   } else {
      //     showToast("warning", "获取信息失败");
      //   }
      // });
      showDialog(
        SHOP_PRODUCT_REVIEW_REASON,
        { title: '查看原因', width: 1200 },
        {
          ...props.item
        },
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr) {
            console.log(arr)
          }
        }
      )
    },

    // 立即刊登
    publish(props) {
      let vm = this
      showConfirm({
        title: '是否立即刊登上架产品？',
        onOk() {
          fetchData({
            ...apis.STORE_PRODUCT_PUBLISH,
            data: {
              productId: props.item.storeProductId,
              productType: props.item.productType
            }
          }).then(res => {
            showToast(res.data.code === 0 ? 'success' : 'error', res.data.msg)
            vm.refresh()
          })
        }
      })
    },

    // 复制上传
    copy(props) {
      let vm = this
      showConfirm({
        title: '是否复制上传该产品？',
        onOk() {
          fetchData({
            ...apis.STORE_PRODUCT_COPY,
            data: {
              productId: props.item.storeProductId,
              productType: props.item.productType
            }
          }).then(res => {
            showToast(res.data.code === 0 ? 'success' : 'error', res.data.msg)
            if (res.data.code === 0) {
              vm.refresh()
            }
          })
        }
      })
    },

    // 查看审核不通过的原因
    lookAtReasonNot(props) {
      console.log(props)
      showDialog(
        SHOP_PRODUCT_REVIEW_REASON,
        { title: '查看原因', width: 800 },
        {
          ...props.item,
          type: 'not'
        },
        {
          // 绑定点击model确认事件,参数是选择的类目数组详情
          set: function(arr) {
            console.log(arr)
          }
        }
      )
    },

    // 筛选
    select() {
      console.log('sel')
    },

    getNewData(id, index) {
      this.activeBtn = index
      this.ruleForm = {}
      this.params.status = id
      this.params.url =
        id === 0
          ? apis.STORE_PRODUCT_LIST_PARENT.url
          : +id === -2
          ? apis.STORE_PRODUCT_LIST_DELETE.url // 删除产品列表
          : apis.STORE_PRODUCT_LIST_BY_STATUS.url // 普通产品列表
      if (+id !== -1) {
        if (this.col) {
          this.columns = this.col
        }

        this.showOnline = false
      } else if (+id === -1) {
        // 在线列表产品
        this.showOnline = true
        this.col = JSON.parse(JSON.stringify(this.columns))
        this.columns = this.columns1
        this.params.url = apis.STORE_PRODUCT_PLAT_LIST.url
      }

      this.$refs.table.refresh()
    },

    // 点击按钮
    editClickHander(e) {
      toUrl('/product/productList/addProduct.html')
    },

    set() {
      console.log(2)
    },

    // 批量上下架操作
    batches(type) {
      let url = {}
      let title
      switch (type) {
        case 1:
          // 批量下架
          url = apis.STORE_PRODUCT_UNPUBLISH_BATCH
          title = '是否批量下架这些产品？'
          break
        case 2:
          // 批量上架
          url = apis.STORE_PRODUCT_PUBLISH_BATCH
          title = '是否批量上架这些产品？'
          break

        default:
          break
      }
      let vm = this,
        data = this.$refs.table.getCheckedData()
      if (data.length) {
        data = data.map(el => ({
          productId: el.storeProductId,
          productType: el.productType
        }))

        showConfirm({
          title: title,
          content: '',
          onOk() {
            fetchData({
              ...url,
              data: {
                data
              }
            }).then(res => {
              if (res.data.code === 0) {
                vm.refresh()
                let data = res.data
                let result = data.unPublishResult || data.publishResult
                if (!result) {
                  showToast('success', res.data.msg)
                  return
                }
                showToast(
                  'success',
                  `成功： ${result.success} 条 <br> 失败: ${result.error} 条 `,
                  data.msg
                )
              } else {
                showToast('error', res.data.msg)
              }
            })
          }
        })
      } else {
        showToast('info', '请选择一条数据进行编辑')
      }
    },

    // souq单个产品导出上架信息
    exportSouq(props) {
      this.exportDownload(false, 'souq', props)
    },

    // 导出上架信息
    exportDownload(multi = false, type, props) {
      let data = this.$refs.table.getCheckedData()
      if (!data.length && props == null) {
        showToast('info', '请选择数据进行编辑')
      } else {
        // if (storeProductId != null) {
        //   data = [{ productIds: [storeProductId] }]
        // }

        if (type === 'souq') {
          if (multi) {
            data = { productIds: data.map(el => el.storeProductId) }
          } else {
            let { storeProductId, productType } = props.item
            data = { productIds: [storeProductId] }
          }

          this.batchExportLoading = true
        } else {
          data = {
            productIds: props
              ? [props.item.storeProductId]
              : data.map(el => el.storeProductId)
          }
          this.exportDownloadLoading = true
        }

        fetchData({
          ...apis.STORE_PRODUCT_DOWNLOAD_PUBLISH_INFO,
          data
        }).then(res => {
          if (type === 'souq') {
            this.batchExportLoading = false
          } else {
            this.exportDownloadLoading = false
          }
          if (res.data.code === 0) {
            top.location.href = res.data.rows.filePath
          } else {
            showToast('error', res.data.msg)
          }
        })
      }
    },

    // 自定义导出
    customExport() {
      let _data = this.$refs.table.getCheckedData()
      if (_data.length !== 1) {
        showToast('info', '只能选择一条数据进行操作')
        return
      }
      showDialog(
        'batchCustomExport',
        {
          title: '自定义导出',
          width: 1200,
          modalnoBtn: true
        },
        { type: 1, data: _data[0] },
        {
          set(childVm) {}
        }
      )
    },

    // 跳转到预览页
    linkToView(props) {
      if (this.showOnline) {
        return
      }
      toParamUrl('/product/ShopProducts/editLists.html', {
        storeProductId: props.item.storeProductId,
        productId: props.item.productParentId || props.item.baseProductId,
        baseProductParentId: props.item.baseProductParentId,
        variant: props.item.productType === 0 ? false : true,
        productType: props.item.productType,
        categoryId: props.item.categorySysId,
        platformId: this.platform,
        isshow: true,
        deleteFlag: this.params.status == -2 ? 1 : 0
      })
    },

    getTableData(command, isAll) {
      let data = this.$refs.table.getCheckedData()
      if (data.length == 0 && command !== 'd') {
        showToast('info', '请选择至少一条数据进行编辑')
        return
      }
      if (isAll) {
        return data
      }
      data = data.map(el => el.productId)

      return data
    },

    // 表格
    checkAll: function(value) {
      this.checkAllMsg = '当前全选状态是：' + value
      console.log(value)
    },
    // clickRow: function(obj) {
    //   console.log(obj)
    //   this.clickRowMsg = '当前点击第' + obj.index + '行'
    // },
    batchMoveProduct() {
      let _data = this.$refs.table.getCheckedData()
      let storeProductIds = []
      _data.forEach(element => {
        // 变体行没有 variantCount 栏位
        if (element.variantCount === undefined) {
          storeProductIds.push(element.storeProductId)
        }
      })
      if (_data.length > 0 && storeProductIds.length === 0) {
        showToast('info', '你选择的是母体，请选择变体！')
        return
      }
      let platformId = this.platform
      // let siteId =1
      showDialog(
        'BatchMoveProduct',
        {
          title: '批量挪动产品',
          width: 900,
          modalnoBtn: true
        },
        {
          type: 'shopProducts',
          platformId,
          // siteId,
          storeProductIds
        }
      )
    },
    moveLog() {
      toParamUrl('#/product/ShopProducts/moveLog.html')
      // top.location.href = '/product.html#/product/ShopProducts/moveLog.html'
    },

    /**
     *
     * 导出产品上传的数据
     * 如果是souq的话就增加此功能
     *
     */
    batchExport(type) {
      if (type === 'souq') {
        this.exportDownload(true, type)
      }
    },
    isCheckedTb() {
      let _data = this.$refs.table.getCheckedData()
      if (!_data.length) {
        showToast('warning', '请选择数据后进行操作')
        return
      } else {
        return _data
      }
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
  padding: 0;
}
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
  img,
  button {
    display: block;
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
.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  button {
    margin-top: 10px;
  }
}
._refresh_btn {
  i.anticon {
    animation: spinner linear 1000ms infinite;
  }
}

@keyframes spinner {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
a._link:link {
  color: #333333 !important;
}
</style>
