<template>
  <!-- 所有订单列表 -->
  <div>
    <el-tabs type="card" v-if="$route.name === 'allOrderLists'" v-model="activeType" @tab-click="handleTabClick">
      <el-tab-pane label="客户订单" name="1"></el-tab-pane>
      <el-tab-pane label="本地仓备库订单" name="2"></el-tab-pane>
      <el-tab-pane label="海外仓备库订单" name="3"></el-tab-pane>
    </el-tabs>
    <universal-layout
      :style="{top: $route.name === 'allOrderLists' ? '40px' : 0}"
      v-loading="$store.state.isLoading"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
      :pageNo="page.pageNumber"
      :pageSize="page.pageSize"
      :total="page.total"
      @clickBtn="clickBtn"
    >
      <template slot="search">
        <SimpleForm
          :search="true"
          :fields="searchField"
          :form-data.sync="searchForm"
          label-width="100px"
          @search="handleSearch"
          @apply="handleApply"
          style="margin-bottom: 2px;"
          ref="searchForm"
        ></SimpleForm>
      </template>
      <template slot="btnRight">
        <el-button
          type="success"
          v-if="activeType == 1 || activeType == 3"
          slot="right"
          size="small"
          @click="executePriority"
        >重新计算</el-button>
        <el-button type="success" v-if="activeType == 1" slot="right" size="small" @click="synchronousOrder">手动同步订单</el-button>
      </template>
      <template slot="table">
        <div class="btnBox">
          <el-radio-group
            v-model="radio"
            size="medium"
            fill="#909399"
            @change="handlePlatChange"
            v-if="activeType != 2"
          >
            <el-radio-button
              :disabled="!platformList.length"
              v-for="plat in platformList"
              :label="plat.platformId"
              :key="plat.id"
            >{{`${plat.name} (${plat.count})`}}</el-radio-button>
          </el-radio-group>
          <div v-else></div>
          <userDefined :data="defaultDataCol" :selected.sync="selected">自定义列表展示</userDefined>
        </div>
        <yt-table
          v-loading="firstLoading"
          :data="list"
          :columns="showDataCol"
          :height="currentTableHeight"
          :border="true"
          ref="yttable"
          reserveSelection="_id"
          :tableRowClassName="tableRowClassName"
          :span-method="handleSpanMethod"
        >
          <el-table-column fixed label="操作" width="100" align="center" slot="left">
            <template slot-scope="scope">
              <el-tooltip effect="dark" content="查看" placement="top" :open-delay="500">
                <i class="el-icon-search iconBtn" @click="lookOver(scope.row)"/>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                content="编辑"
                v-if="activeType === '1' || (activeType !== '1' && scope.row.orderStatus==14)"
                placement="top"
                :open-delay="500"
              >
                <i class="el-icon-edit iconBtn" @click="editOrder(scope.row)"/>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                v-if="activeType != 1 && scope.row.orderStatus==2"
                content="审核"
                placement="top"
                :open-delay="500"
              >
                <i class="iconfont1 iconBtn" @click="review(scope.row)">&#xe7bf;</i>
              </el-tooltip>

              <el-tooltip
                effect="light"
                v-if="activeType != 1 && scope.row.orderStatus==12&&scope.row.examineRemark"
                :content="scope.row.examineRemark"
                placement="top"
                :open-delay="500"
              >
                <i class="iconfont1 iconBtn">&#xe78a;</i>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                v-if="activeType != 1 && scope.row.orderStatus==3"
                content="取消作废"
                placement="top"
                :open-delay="500"
              >
                <i class="iconfont1 iconBtn" @click="revertInvalid(scope.row)">&#xe78c;</i>
              </el-tooltip>

              <el-tooltip
                effect="dark"
                v-if="activeType == 3 && scope.row.orderStatus===10 && scope.row.orderType === 4"
                content="检测亚马逊分仓"
                placement="top"
                :open-delay="500"
              >
                <i class="iconfont1 iconBtn" @click="checkAmazon(scope.row)">&#xe7c6;</i>
              </el-tooltip>

              <el-tooltip v-if="activeType == 1" effect="dark" content="添加黑名单" placement="top" :open-delay="500">
                <!-- <i class="el-icon-sold-out iconBtn" @click="addBlackList(scope.row)"/> -->
                <i @click="addBlackList(scope.row)" class="iconfont1 iconBtn">&#xe7af;</i>
              </el-tooltip>

              <el-tooltip effect="dark" content="打印" v-if="activeType == 1" placement="top" :open-delay="500">
                <i class="el-icon-printer iconBtn" @click="print(scope.row)"/>
              </el-tooltip>

              <!-- 留言 -->
              <el-tooltip
                v-if="scope.row.leaveMessage"
                effect="light"
                :content="scope.row.leaveMessage"
                placement="top"
                :open-delay="500"
              >
                <i class="iconfont1 iconBtn">&#xe78a;</i>
              </el-tooltip>

              <!--  -->
              <!-- <el-tooltip
                effect="light"
                v-if="scope.row.issueFlag"
                :content="scope.row.issue"
                placement="top"
                :open-delay="500"
              >
                <i class="el-icon-question iconBtn" style="color: #f56c6c"></i>
              </el-tooltip>-->
              <!-- 查看理由 -->
              <el-tooltip
                effect="light"
                v-if="scope.row.orderStatus === 14"
                :content="scope.row.examineRemark ||'(没有填写理由)'"
                placement="top"
                :open-delay="500"
              >
                <i class="iconfont1 iconBtn">&#xe78a;</i>
              </el-tooltip>

              <!-- 无SKU关联的提示 -->
              <el-tooltip
                effect="light"
                v-if="scope.row.issueFlag"
                :content="scope.row.issue"
                placement="top"
                :open-delay="500"
              >
                <i class="iconfont1 iconBtn" style="color: #FF9800">&#xe785;</i>
              </el-tooltip>

              <!-- 异常信息的提示 -->
              <el-tooltip
                effect="light"
                v-if="scope.row.exceptionRemark"
                :content="'异常原因: ' +scope.row.exceptionRemark"
                placement="top"
                :open-delay="500"
              >
                <i class="iconfont1 iconBtn" style="color: #FF9800">&#xe658;</i>
              </el-tooltip>
            </template>
          </el-table-column>
        </yt-table>

        <!-- 添加订单 -->
        <yt-dialog :options="addOrderOpts" :events="addOrderEvents">
          <add-order ref="addOrder" :order-type="activeType" :data="orderEditData" :resetNum="reset"/>
        </yt-dialog>
        <!-- 添加黑名单 -->
        <yt-dialog :options="addBlackOpts" :events="addBlackEvents">
          <add-user ref="addBlack" :info="blackInfoData" :type="blackInfoData.type + ''"/>
        </yt-dialog>
        <!-- 手动同步订单 -->
        <yt-dialog :options="synchronousOrderOpts" :events="synchronousOrdeEvents">
          <SimpleForm
            :fields="synchronousFields"
            :form-data.sync="synchronousData"
            label-width="80px"
            ref="synchronousDataForm"
          ></SimpleForm>
        </yt-dialog>
        <!-- 批量 -->
        <yt-dialog :options="batchOpts" :events="batchEvents" :copy-text="batchData.copyText">
          <el-form :model="batchData" size="small" ref="batchForm">
            <template v-if="batchOpts.title === '转发货仓库'">
              <el-form-item
                label-width="80px"
                label="选择仓库"
                :rules="[{required: true, message: '请选择仓库'}]"
                prop="warehouseId"
              >
                <el-select v-model="batchData.warehouseId" style="width:100%">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>

            <template v-if="batchOpts.title === '中国仓订单转FBA发货'">
              <el-form-item
                label-width="80px"
                label="发货仓库"
                :rules="[{required: true, message: '请选择发货仓库'}]"
                prop="warehouseId"
              >
                <el-select v-model="batchData.warehouseId" style="width:100%">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label-width="80px"
                label="发货速度"
                :rules="[{required: true, message: '请选择发货速度'}]"
                prop="speed"
              >
                <el-select v-model="batchData.speed" style="width:100%">
                  <el-option
                    v-for="item in [{label:'慢', value:0},{label:'中', value:1},{label:'快', value:2}]"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label-width="80px"
                label="报关币种"
                :rules="[{required: true, message: '请选择报关币种'}]"
                prop="currency"
              >
                <el-select v-model="batchData.currency" style="width:100%">
                  <el-option v-for="item in currencyType" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
              <yt-table
                :data="$refs.yttable.$children[0].selection"
                :selection="false"
                :columns="columnsFba"
                :border="true"
              ></yt-table>
            </template>

            <template v-if="batchOpts.title === '修改运输方式'">
              <el-form-item
                label-width="80px"
                label="发货仓库"
                :rules="[{required: true, message: '请选择发货仓库'}]"
                prop="warehouseId"
              >
                <el-select v-model="batchData.warehouseId" style="width:100%">
                  <el-option
                    v-for="item in warehouseList"
                    :key="item.warehouseId"
                    :label="item.warehouseName"
                    :value="item.warehouseId"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label-width="80px"
                label="运输方式"
                :rules="[{required: true, message: '请选择运输方式'}]"
                prop="transportType"
              >
                <el-select v-model="batchData.transportType" style="width:100%">
                  <el-option
                    v-for="item in transportTypeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>

            <template v-if="batchOpts.title === '修改延迟发货原因'">
              <el-form-item
                label-width="80px"
                label="原因"
                :rules="[{required: true, message: '请输入修改延迟发货原因'}]"
                prop="delayDelivery"
              >
                <el-input v-model="batchData.delayDelivery" type="textarea" :rows="4" placeholder="修改延迟发货原因"></el-input>
              </el-form-item>
            </template>

            <template v-if="batchOpts.title === '修改订单备注'">
              <el-form-item
                label-width="80px"
                label="备注"
                :rules="[{required: true, message: '请输入修改订单备注'}]"
                prop="remark"
              >
                <el-input v-model="batchData.remark" type="textarea" :rows="4" placeholder="修改订单备注"></el-input>
              </el-form-item>
            </template>

            <template v-if="batchOpts.title === '修改订单发货备注'">
              <el-form-item
                label-width="80px"
                label="备注"
                :rules="[{required: true, message: '请输入修改订单发货备注'}]"
                prop="remark"
              >
                <el-input v-model="batchData.remark" type="textarea" :rows="4" placeholder="修改订单发货备注"></el-input>
              </el-form-item>
            </template>

            <template
              v-if="batchOpts.title === '提取订单产品SKU' ||batchOpts.title === '提取订单店铺SKU' ||batchOpts.title === '提取ASIN' ||batchOpts.title === '提取订单号'"
            >
              <el-form-item prop="copyTextVal">
                <el-input disabled v-model="copyTextVal" type="textarea" :rows="12"></el-input>
                <el-input style="display:none" disabled v-model="batchData.copyTextVal" type="textarea" :rows="12"></el-input>
              </el-form-item>
            </template>

            <template v-if="batchOpts.title === '自定义导出'">
              <custom-export
                :loadData="exportFieldData"
                :fetch="exportFetch"
                @exSuccess="handleExSuccess"
                @exError="handleExError"
                ref="exportCol"
              />
            </template>
          </el-form>
          <div slot="footer" v-if="batchOpts.title === '自定义导出'">
            <div class="txc" style="text-align:center;margin-top:10px">
              <el-button type="primary" @click="exportProductExcel(1)">导出已选中产品有图</el-button>
              <el-button type="primary" @click="exportProductExcel(0)">导出已选中产品无图</el-button>
            </div>
          </div>
        </yt-dialog>
      </template>
      <router-view/>
    </universal-layout>
    <el-dialog title="审核" width="600px" :visible.sync="reviewVisible" @open="handleReviewOpen">
      <el-form :model="reviewData" label-width="80px" ref="reviewDataForm">
        <el-form-item label="审核结果" prop="examineResult" :rules="[{required:true, message: '请选择审核结果'}]">
          <el-radio :label="1" v-model="reviewData.examineResult">通过</el-radio>
          <el-radio :label="0" v-model="reviewData.examineResult">不通过</el-radio>
        </el-form-item>
        <!-- <el-form-item label="原因" prop="examineReason" :rules="[{required:true, message: '请输入原因'}]">
          <el-input type="textarea" :rows="3" v-model="reviewData.examineReason" placeholder></el-input>
        </el-form-item>-->
        <el-form-item
          label="备注"
          prop="examineRemark"
          :rules="[{required:reviewData.examineResult ? false : true, message: '请输入备注'}]"
        >
          <el-input type="textarea" :rows="3" v-model="reviewData.examineRemark" placeholder></el-input>
        </el-form-item>
      </el-form>
      <template slot="footer">
        <div style="text-align:center">
          <el-button type="primary" size="small" :loading="reviewBtnLoading" @click="handleReviewOk">确认</el-button>
          <el-button size="small" @click="reviewVisible = false">取消</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="亚马逊分仓" width="80%" :visible.sync="storeVisible" @open="handleStoreOpen">
      <check-store :order-id="checkStorId" @close="handleStoreClose" @edit="handleStoreEdit"/>
    </el-dialog>
    <el-dialog :title="historyRecordOpts.title" width="80%" :visible.sync="historyRecordOpts.visible">
      <history-record ref="historyRecord"/>
    </el-dialog>
    <el-dialog :title="productsImgOpts.title" width="600px" :visible.sync="productsImgOpts.visible">
      <products-img type="order" :data="productsImgData" ref="productsImg"/>
    </el-dialog>
    <el-dialog title="申请全额退款" width="80%" :visible.sync="applyRefundVisible" @open="handleApplyRefundOpen">
      <refund-form :orderIds="orderIds" ref="applyRefund" :platformId="radio"/>
      <template slot="footer">
        <div style="text-align:center">
          <el-button type="primary" :loading="applyRefundBtnLoading" @click="handleApplyRefundSave">保存</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog title="物流信息" width="600px" :visible.sync="checkExpressVisible">
      <check-express :text="checkExpressText" ref="checkExpress"/>
    </el-dialog>
    <menu-select
      :loadData="handleLoadMenuData"
      nodeKey="name"
      :current="treeCurrentKey"
      :defaultProps="defaultMenuProps"
      :show-loading="showLoading"
      @nodeclick="handleNodeclick"
      @close="handleTreeClose"
    />
  </div>
</template>

<script>
/* eslint-disable */
import userDefined from '@/components/userDefined/LabelDefined.vue'
import CheckStore from './components/checkStore'
import { mapActions, mapState } from 'vuex'
import { downloadFile } from 'Utils/tools'
import storage from 'Utils/saver'
import { debounce } from 'throttle-debounce'
// import jsonp from 'jsonp'

export default {
  components: {
    userDefined,
    'check-express': () => import('./components/checkExpress.vue'),
    'add-user': () => import('../../orderCenter/userList/addEditUser/index'),
    'add-order': () => import('./components/addOrder.vue'),
    'check-store': () => import('./components/checkStore'),
    'history-record': () =>
      import('Views/Purchasing-Management/procurement/procurementList/orderformList/components/historyRecord.vue'),
    'products-img': () =>
      import('Views/Purchasing-Management/procurement/procurementList/detailedList/productsImg.vue'),
    'refund-form': () => import('./components/refundForm')
  },
  computed: {
    ...mapState('store', ['storeAllList']),
    ...mapState('common', [
      'handleUser',
      'reasonsForNewOrders',
      'reasonsForNewListOrders',
      'warehouseList',
      'currencyType',
      'transportTypeList',
      'supplierList'
    ]),

    showDataCol() {
      return this.defaultData.filter(el => this.selected.indexOf(el.label) > -1)
    },
    synchronousFields() {
      let vm = this
      return [
        {
          type: 'cascader',
          name: 'storeId',
          label: '选择店铺',
          required: true,
          bind: {
            label: 'name',
            value: 'storeId',
            children: 'stores'
          },
          options: vm.storeAllList
        },
        {
          label: '选择时间',
          name: 'time',
          type: 'datetimerange',
          required: true
        }
      ]
    },
    searchField() {
      let vm = this
      let res = [
        {
          type: 'select',
          name: 'orderStatus',
          label: '订单状态',
          default: true,
          options: vm.$const['ORDER/orderStatus']
          // span: 6
        },
        {
          type: 'select',
          name: 'createOrderReason',
          label: '新增订单原因',
          options:
            vm.activeType == 3
              ? vm.reasonsForNewListOrders
              : vm.reasonsForNewOrders
          // span: 6
        },
        {
          type: 'select',
          name: 'orderType1',
          label: '订单类型',
          options: vm.$const['ORDER/addOverseeType']
          // span: 6
        },
        {
          type: 'select',
          name: 'paymentStatus',
          label: '支付状态',
          default: true,
          options: vm.$const['ORDER/paymentStatus']
          // span: 6
        },
        {
          type: 'select',
          // stockUpWarehouseId
          name: 'deliveryWarehouseId',
          label: '发货仓库',
          options: vm.warehouseList
          // span: 6
        },
        {
          type: 'datetimerange',
          name: 'time',
          label: '下单时间',
          default: true
          // span: 6
        },

        {
          name: 'delayDelivery',
          label: '延迟发货原因'
          // span: 6
        },

        {
          type: 'select',
          name: 'takeWarehouseId',
          label: '到达仓库',
          options: vm.warehouseList
          // span: 6
        },
        {
          type: 'select',
          name: 'transportTypeSystem',
          label: '系统运输方式',
          options: vm.transportTypeList
          // span: 6
        },

        {
          type: 'select',
          name: 'transportTypePlatform',
          label: '平台运输方式',
          options: vm.transportTypeList
          // span: 6
        },

        {
          type: 'select',
          name: 'isOrderRemark',
          label: '是否有订单备注',
          options: vm.$const['OTHER/yesno']
          // span: 6
        },
        {
          label: '追踪号',
          name: 'logisticsNumber'
          // span: 6
        },
        {
          type: 'select',
          label: '销售人员',
          name: 'salesmanId',
          options: vm.handleUser.saleman
          // span: 6
        },
        {
          type: 'select',
          label: '供应商',
          name: 'supplierId',
          options: vm.supplierList
          // span: 6
        },
        {
          type: 'select',
          label: '采购人员',
          name: 'purchaseId',
          options: vm.handleUser.procurement
          // span: 6
        },
        {
          // TODO:换
          type: 'select',
          label: '退款类型',
          name: 'refundType',
          options: vm.$const['ORDER/refundType']
          // span: 6
        },
        {
          type: 'select',
          label: '是否停产',
          name: 'productStop',
          options: vm.$const['OTHER/yesno']
          // span: 6
        },
        {
          type: 'select',
          label: '是否组合产品',
          name: 'isCombination',
          options: vm.$const['OTHER/yesno']
          // span: 6
        },

        {
          type: 'select',
          label: '是否生成包裹单',
          name: 'boxPackage',
          // span: 6,
          options: vm.$const['ORDER/packageState']
        },
        {
          type: 'price',
          label: '订单价格',
          name: 'orderPrice'
          // span: 6
        },
        {
          type: 'price',
          name: 'productCount',
          label: '产品总数',
          integer: true
          // span: 6
        },
        {
          type: 'price',
          name: 'rebateTaxFlag',
          label: '税率'
          // span: 6
        },
        {
          type: 'weight',
          label: '包裹重量',
          name: 'packageWeight'
          // span: 6
        },
        {
          type: 'price',
          label: '订单利润',
          name: 'orderProfit'
          // span: 6
        }
      ]
      if (this.activeType !== '3') {
        res.splice(2, 1)
      }

      if (this.activeType === '2') {
        res[3].label = '备货仓库'
        res[3].name = 'stockUpWarehouseId'
      } else {
        if (this.activeType === '1') {
          res[3].label = '发货仓库'
          res[3].name = 'deliveryWarehouseId'
        }
      }

      return res
    }
  },
  data() {
    let vm = this
    return {
      reset: false,
      checkExpressText: undefined,
      currentTableHeight: 502,
      treeCurrentKey: null,
      productsImgData: [],
      historyRecordOpts: {
        title: '',
        visible: false
      },
      productsImgOpts: {
        title: 'SKU图片',
        visible: false
      },
      applyRefundBtnLoading: false,
      orderIds: [],
      firstLoading: false,
      applyRefundVisible: false,
      checkExpressVisible: false,
      dialog: {
        title: '',
        visible: false,
        component: null,
        width: '300px',
        btnshow: true
      },
      selected: [],
      defaultDataCol: [],
      checkStorId: null,

      reviewBtnLoading: false,
      reviewData: {},
      reviewVisible: false,

      storeVisible: false,
      storeData: {},

      activeType: '1',
      showLoading: false,
      defaultMenuProps: {
        children: 'child',
        label: 'name',
        count: 'count'
      },
      flag: true,

      searchForm: {},
      exportFieldData() {
        return vm.$api[`order/globalTemplateGetSystemList`]({})
          .then(data => {
            return data.rows
          })
          .catch(err => {
            vm.$message.error(err.msg)
          })
      },
      copyTextVal: '123123123',
      copyBtn: null,
      batchData: {},
      batchOpts: {
        visible: false,
        title: null,
        width: '500px',
        okBtnText: '确认'
      },
      batchEvents: {
        handleOkClick() {
          let tableData = vm.$refs.yttable.$children[0].selection
          let orderIds = tableData.map(el => el.orderId)
          let api, params

          switch (vm.batchOpts.title) {
            case '转发货仓库':
              params = {
                orderIds,
                warehouseId: vm.batchData.warehouseId
              }
              api = 'updateDeliveryWarehouse'
              break

            case '中国仓订单转FBA发货':
              params = {
                orderIds,
                warehouseId: vm.batchData.warehouseId
              }
              api = 'turnFbaDelivery'
              break

            case '修改运输方式':
              params = {
                orderIds,
                transportType: vm.batchData.transportType,
                deliveryWarehouseId: vm.batchData.warehouseId
              }
              api = 'updateTransport'
              break

            case '修改延迟发货原因':
              params = {
                orderIds,
                delayDelivery: vm.batchData.delayDelivery
              }
              api = 'updateDelayDelivery'
              break

            case '修改订单备注':
              params = {
                orderIds,
                type: 1,
                remark: vm.batchData.remark
              }
              api = 'updateRemark'
              break

            case '修改订单发货备注':
              params = {
                orderIds,
                type: 2,
                remark: vm.batchData.remark
              }
              api = 'updateRemark'
              break

            default:
              break
          }

          return vm.$refs.batchForm
            .validate()
            .then(res => {
              return vm.$api[`order/${api}`](params).then(data => {
                vm.$message.success(data.msg)
                vm.batchOpts.visible = false
                vm.getOrderList()
              })
            })
            .catch(err => {
              return false
            })
        }
      },
      // 手动同步订单
      synchronousOrderOpts: {
        visible: false,
        title: '手动同步订单',
        width: '500px',
        okBtnText: '确认',
        cancelBtnText: '取消'
      },
      synchronousOrdeEvents: {
        handleOkClick() {
          let { storeId, time } = vm.synchronousData
          let [startTime, endTime] = time
          storeId = storeId.slice(0).pop()
          let params = { storeId, startTime, endTime }
          params = vm.$.dealObjectValue(params)
          return vm.$api['order/synchronousOrder'](params)
            .then(data => {
              vm.getOrderList()
            })
            .catch(err => {})
        }
      },
      synchronousData: {},

      orderEditData: {},
      addOrderEvents: {
        close() {
          // 关闭时的回调
          vm.reset = false
          vm.$refs.addOrder.reset()
        },
        opened() {
          if (!vm.editOrderId && vm.activeType === '2') {
            vm.$refs.addOrder.getOrderNum()
          }
        },
        open() {
          if (vm.editOrderId) {
            vm.$api['order/orderInfo']({
              orderId: vm.editOrderId
            }).then(data => {
              vm.orderEditData = data.rows
            })
          }
        },
        handleOkClick() {
          // 保存新增
          const {
            baseForm,
            receiverForm,
            senderForm,
            payForm,
            productInfoTbList
          } = vm.$refs.addOrder
          let params = {
              ...baseForm,
              ...receiverForm,
              ...senderForm,
              ...payForm
            },
            api = 'order/create'
          if (params.storeId && params.storeId.length) {
            params.storeId = params.storeId.slice(0).pop()
          }
          if (vm.addOrderOpts.title === '编辑订单') {
            api = 'order/update'
          }

          if (!productInfoTbList.length) {
            vm.$message.warning('请添加产品')
            vm.$refs.addOrder.$el.parentNode.scrollTop = 0
            return Promise.reject()
          }

          params.orderProductInfo = productInfoTbList.map(el => ({
            deliveryWarehouseId: el.stock,
            storeProductId: el.storeProductId || el.productId,
            amount: el.num,
            price: el.price
          }))
          return vm.$refs.addOrder
            .validForm()
            .then(() => {
              return vm.$api[api](params)
                .then(data => {
                  vm.addOrderOpts.visible = false
                  // 刷新列表
                  vm.searchParams = {}
                  vm.getOrderList()
                })
                .catch(err => {
                  // vm.$message.warning(err)
                  return Promise.reject(err)
                })
            })
            .catch(err => {
              if (err) {
                vm.$message.error(err.msg)
              } else {
                vm.$message.warning('请填写必填项')
              }

              return Promise.reject()
            })
        }
      },
      addOrderOpts: {
        visible: false,
        title: '新增订单',
        width: '70%',
        okBtnText: '保存'
      },

      addBlackOpts: {
        visible: false,
        title: '添加黑名单',
        width: '70%',
        okBtnText: '保存'
      },
      addBlackEvents: {
        close() {
          // 关闭时的回调
          vm.$refs.addBlack.resetForm()
        },
        handleOkClick() {
          const { form } = vm.$refs.addBlack
          return vm.$api['order/blacklistSave']({
            ...form,
            type: 0
          }).then(data => {
            vm.$message.success(data.msg)
            vm.addBlackOpts.visible = false
          })
        }
      },
      blackInfoData: {},
      editOrderId: null,
      // 平台种类
      platformList: [],
      radio: '',
      page: {
        pageNumber: 1,
        pageSize: 10,
        total: 0
      },
      searchParams: {},
      searchList: [
        {
          placeholder: '搜索范围',
          value: 'range',
          type: 'select',
          style: {
            width: '110px'
          },
          children: [
            {
              label: '订单ID',
              value: '1'
            }
          ]
        },
        {
          value: 'rangeVal',
          type: 'input'
        },
        {
          placeholder: '订单状态(可多选)',
          value: 'orderStatus',
          type: 'multiple',
          style: {
            width: '150px'
          },
          children: [
            {
              label: '是',
              value: '1'
            }
          ]
        },
        {
          placeholder: '生单状态',
          value: 'orderType',
          type: 'select',
          style: {
            width: '120px'
          },
          children: [
            {
              label: '是',
              value: '1'
            }
          ]
        },
        {
          placeholder: '发货状态',
          value: 'paymentStatus',
          type: 'select',
          style: {
            width: '120px'
          },
          children: [
            {
              label: '是',
              value: '1'
            }
          ]
        },
        {
          placeholder: '下单时间',
          value: 'a',
          type: 'time'
        }
      ],
      btnList: [
        {
          name: '新增订单',
          fn: () => {
            this.editOrderId = null
            this.addOrderOpts.title = '新增订单'
            this.addOrderOpts.visible = true
          }
        },
        {
          name: '审核',
          fn: () => {
            let tableData = this.$refs.yttable.$children[0].selection
            let orderIds = tableData.map(el => el.orderId)
            if (!orderIds.length) {
              this.$message.warning('请先选择一项进行操作')
              return
            }
            this.reviewData.orderIds = orderIds
            this.reviewVisible = true
          }
        },
        {
          name: '优先级设置',
          children: [
            {
              name: '设置优先'
            },
            { name: '取消优先' }
          ]
        },
        {
          name: '转发货仓库',
          children: [{ name: '转发货仓库' }, { name: '中国仓订单转FBA发货' }]
        },
        {
          name: '批量修改',
          children: [
            { name: '修改运输方式' },
            { name: '修改延迟发货原因' },
            { name: '申请全额退款' },
            { name: '修改订单备注' },
            { name: '修改订单发货备注' }
          ]
        },
        {
          name: '批量提取',
          children: [
            { name: '提取订单产品SKU' },
            { name: '提取订单店铺SKU' },
            { name: '提取ASIN' },
            { name: '提取订单号' }
          ]
        },
        {
          name: '批量设置状态',
          children: [
            { name: '设置订单状态为正常' },
            { name: '设置订单状态为作废' },
            { name: '设置订单状态为锁定' }
          ]
        },
        {
          name: '批量导出',
          children: [
            { name: '自定义导出' },
            { name: '当前条件导出订单' },
            { name: '选中订单导出包裹追踪号' },
            { name: '当前条件导出订单产品' },
            { name: '导出未关联店铺sku' },
            { name: 'sku采购延迟导出统计' },
            { name: '导出订单利润' },
            { name: '导出订单产品利率' }
          ]
        },
        {
          name: '批量导出',
          children: [
            { name: '自定义导出' },
            { name: '当前条件导出订单' },
            { name: '选中订单导出包裹追踪号' },
            { name: '当前条件导出订单产品' },
            { name: '导出未关联店铺sku' },
            { name: 'sku采购延迟导出统计' }
          ],
          hidden: true
        },
        {
          name: '批量导出',
          children: [
            { name: '自定义导出' },
            { name: '当前条件导出订单' },
            { name: '选中订单导出包裹追踪号' },
            { name: '当前条件导出订单产品' },
            { name: 'sku采购延迟导出统计' }
          ],
          hidden: true
        },
        {
          name: '立即发货',
          fn: () => {
            let tableData = vm.$refs.yttable.$children[0].selection
            let orderIds = tableData.map(el => el.orderId)
            if (!orderIds.length) {
              this.$message.warning('请先选择一项进行操作')
              return
            }
            vm.$confirm('是否立即发货？', '警告', {
              confirmButtonText: '确认',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then(() => {
                vm.$api['order/tuneUp']({
                  orderIds
                })
                  .then(data => {
                    vm.getOrderList()
                  })
                  .catch(err => {})
              })
              .catch(() => {})
          }
          // disabled: true
        }
      ],

      list: [],

      copyActions: ['提取订单产品SKU'],

      columnsFba: [
        {
          value: 'storeSku',
          label: '店铺SKU'
        },
        {
          value: 'productName',
          label: '商品名称'
        },
        {
          value: 'productImg',
          label: '产品图片',
          img: true,
          style: {
            width: 49,
            height: 49
          },
          bulkyHeight: 180
        },
        {
          value: 'productQuantity',
          label: '数量'
        }
      ],

      exportFetch: {
        // 保存
        savePromise() {
          let {
            selectFields: templates,
            tempName: templateName
          } = vm.$refs.exportCol
          templates = templates.map((el, index) => ({
            ...el,
            ranking: index
          }))
          let data = {
            templateName,
            templates
          }
          return vm.$api[`order/globalTemplateSave`](data)
        },
        // 导出
        excelPromise(figureFlag = 0) {
          let columns = vm.$refs.exportCol.selectFields
          let tableData = vm.$refs.yttable.$children[0].selection
          let orderIds = tableData.map(el => el.orderId)
          let data = {
            type: 2, // 导出
            columns,
            orderIds,
            figureFlag
          }
          return vm.$api[`order/exportOrder`](data)
        },
        // 获取模板
        dataPromise({ globalTemplateId }) {
          let columns = vm.$refs.exportCol.selectFields
          let data = {
            globalTemplateId
          }
          return vm.$api[`order/globalTemplateInfo`](data)
        }
      },

      exportColumns: [
        {
          name: 'name',
          colum: 'colum'
        },
        {
          name: '2',
          colum: '2'
        },
        {
          name: '3',
          colum: '3'
        },
        {
          name: '4',
          colum: '4'
        },
        {
          name: '5',
          colum: '5'
        }
      ],

      columns: [],

      columns0: [
        {
          value: 'productImg',
          label: '产品图片',
          toggleMethod(scope) {
            return vm.toggleMethod(scope)
          },
          width: '140px',
          badge(scope) {
            return scope.row.priorityFlag === 1 ? '优先' : null
          },
          img: true,
          style: {
            width: 49,
            height: 49
          },
          bulkyHeight: 180
        },
        {
          value: 'storeSku',
          label: '店铺SKU',
          width: 240
        },
        {
          value: 'asin',
          label: 'ASIN',
          width: 240,
          render(h, scope) {
            return scope.row.asin != null && scope.row.asin !== '' ? (
              <a
                target="_blank"
                href={`https://www.amazon.com/dp/${scope.row.asin}`}
              >
                <el-button type="text">{scope.row.asin}</el-button>
              </a>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          value: 'price',
          label: '单价',
          render(h, scope) {
            let { products } = scope.row,
              str
            if (products) {
              str = products[0].price
            } else {
              str = scope.row.price
            }
            return <span>{str || '-'}</span>
          }
        },
        {
          children: 'properties',
          object: true,
          width: 180,
          label: '属性',
          prop: {
            key: 'propertyName',
            value: 'propertyValue'
          }
        },
        {
          value: 'storeName',
          label: '来源店铺'
        },
        {
          value: 'deliveryWarehouseName',
          label: '发货仓库'
        },
        {
          value: 'inventory',
          label: '可用库存',
          render(h, scope) {
            return vm.renderInventory.apply(vm, arguments)
          }
        },
        {
          value: 'purchaseCount',
          label: '采购中',
          render(h, scope) {
            return vm.renderPurchaseCount.apply(vm, arguments)
          }
        },
        {
          value: 'productQuantity',
          label: 'SKU数',
          render(h, scope) {
            let { productQuantity, products } = scope.row
            return (
              <el-button
                type="text"
                onClick={() => {
                  vm.productsImgData = products
                  vm.productsImgOpts.visible = true
                }}
              >
                {productQuantity}
              </el-button>
            )
          }
        },

        {
          value: 'orderNumSystem',
          label: '订单号',
          width: 200,
          render(h, scope) {
            let {
              orderType,
              orderId,
              orderNumSystem,
              orderNumPlatform,
              deliveryStatus
            } = scope.row
            return (
              <el-button
                type="text"
                onClick={() => {
                  vm.$router.push({
                    name: 'lookOver',
                    query: {
                      deliveryStatus: deliveryStatus,
                      orderServiceId: orderId,
                      platformId: vm.radio,
                      orderType: vm.activeType
                    }
                  })
                }}
              >
                {vm.activeType == 1 ? orderNumPlatform : orderNumSystem}
              </el-button>
            )
          }
        },
        {
          value: 'orderNumSystem',
          width: 200,
          label: '系统订单号',
          defaultHidden: true
        },
        {
          value: 'orderTypeName',
          label: '订单类型'
        },

        {
          value: 'orderStatusName',
          label: '订单状态',
          width: '94px'
        },
        {
          value: 'paymentStatusName',
          label: '付款状态'
        },
        {
          value: 'deliveryStatusName',
          label: '发货状态'
        },
        {
          value: 'payTypeName',
          label: '支付方式'
        },
        {
          value: 'orderPrice',
          label: '订单金额'
        },
        {
          value: 'buyerName',
          label: '客户名称',
          width: 180
        },
        {
          value: 'cneeAddressDetailFirst',
          label: '客户地址',
          width: 200
        },
        {
          value: 'createOrderTime',
          label: '下单时间',
          width: 150
        },
        {
          value: 'createTime',
          label: '添加时间',
          width: 150
        },
        {
          value: 'deliveryTime',
          label: '发货时间'
        },
        {
          value: 'packageNumber',
          label: '包裹单号',
          width: 150
        },
        {
          value: 'transportTypePlatformName',
          label: '运输方式'
        },
        {
          value: 'volume',
          label: '体积'
        },
        {
          value: 'weight',
          label: '重量'
        },
        {
          value: 'logisticsNumber',
          label: '追踪号',
          render(h, scope) {
            return vm.renderLogisticsNumber.apply(vm, arguments)
          }
        }
      ],

      columns1: [
        {
          value: 'productImg',
          label: '产品图片',
          width: '140px',
          badge(scope) {
            return scope.row.priorityFlag === 1 ? '优先' : null
          },
          toggleMethod(scope) {
            return vm.toggleMethod(scope)
          },
          img: true,
          style: {
            width: 49,
            height: 49
          },
          bulkyHeight: 180
        },
        {
          value: 'customSku',
          label: '自定义SKU',
          width: 240
          // render(h, scope) {
          //   let { _index, products } = scope.row
          //   if (_index == null) {
          //     _index = 0
          //   }
          //   return <span>{products[_index].customSku || '-'}</span>
          // }
        },
        {
          value: 'asin',
          width: 240,
          label: 'ASIN',
          render(h, scope) {
            return scope.row.asin != null && scope.row.asin !== '' ? (
              <a
                target="_blank"
                href={`https://www.amazon.com/dp/${scope.row.asin}`}
              >
                <el-button type="text">{scope.row.asin}</el-button>
              </a>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          value: 'price',
          label: '单价'
        },
        {
          children: 'properties',
          object: true,
          width: 180,
          label: '属性',
          prop: {
            key: 'propertyName',
            value: 'propertyValue'
          }
        },
        {
          label: '备货数量',
          value: 'orderAmount'
        },
        {
          value: 'arrivalQuantity',
          label: '到货数量',
          render(h, scope, type = 'arrivalQuantity') {
            return vm.renderInventory.apply(vm, [h, scope, type])
          }
        },
        {
          value: 'inventory',
          label: '在库库存',
          render(h, scope) {
            return vm.renderInventory.apply(vm, arguments)
          }
        },
        {
          value: 'orderNumSystem',
          label: '订单号',
          width: 200,
          render(h, scope) {
            let {
              orderType,
              orderId,
              orderNumSystem,
              orderNumPlatform,
              deliveryStatus
            } = scope.row
            return (
              <el-button
                type="text"
                onClick={() => {
                  vm.$router.push({
                    name: 'lookOver',
                    query: {
                      deliveryStatus: deliveryStatus,
                      orderServiceId: orderId,
                      platformId: vm.radio,
                      orderType: vm.activeType
                    }
                  })
                }}
              >
                {vm.activeType == 1 ? orderNumPlatform : orderNumSystem}
              </el-button>
            )
          }
        },
        {
          value: 'stockUpWarehouseName',
          width: 200,
          label: '备货仓库'
          // render(h, scope) {
          //   let { _index, products } = scope.row
          //   if (_index == null) {
          //     _index = 0
          //   }
          //   return <span>{products[_index].warehouse || '-'}</span>
          // }
        },

        {
          value: 'purchaseCount',
          label: '采购中',
          render(h, scope) {
            return vm.renderPurchaseCount.apply(vm, arguments)
          }
        },
        {
          value: 'orderStatusName',
          label: '订单状态',
          width: '94px'
        },
        {
          value: 'createTime',
          label: '添加时间',
          width: 150
        },
        {
          value: 'logisticsNumber',
          label: '追踪号',
          render(h, scope) {
            return vm.renderLogisticsNumber.apply(vm, arguments)
          },
          width: 200
        },
        {
          value: 'deliveryTime',
          label: '发货时间',
          defaultHidden: true,
          width: 150
        },
        {
          value: 'packageNumber',
          label: '包裹单号',
          width: 150,
          defaultHidden: true
        },
        {
          value: 'transportTypePlatformName',
          label: '运输方式',
          defaultHidden: true
        },
        {
          value: 'volume',
          label: '体积',
          defaultHidden: true
        },
        {
          value: 'weight',
          label: '重量',
          defaultHidden: true
        }
      ],

      columns2: [
        {
          value: 'productImg',
          label: '产品图片',
          width: '140px',
          badge(scope) {
            return scope.row.priorityFlag === 1 ? '优先' : null
          },
          toggleMethod(scope) {
            return vm.toggleMethod(scope)
          },
          img: true,
          style: {
            width: 49,
            height: 49
          },
          bulkyHeight: 180
        },
        {
          value: 'customSku',
          label: '自定义SKU',
          width: 240,
          defaultHidden: true
        },
        {
          value: 'storeSku',
          label: '店铺SKU',
          width: 240
        },
        {
          value: 'cneeAddressDetailFirst',
          label: '收货地址',
          defaultHidden: true,
          width: 240
        },
        {
          value: 'asin',
          label: 'ASIN',
          width: 220,
          render(h, scope) {
            return scope.row.asin != null && scope.row.asin !== '' ? (
              <a
                target="_blank"
                href={`https://www.amazon.com/dp/${scope.row.asin}`}
              >
                <el-button type="text">{scope.row.asin}</el-button>
              </a>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          value: 'price',
          label: '单价'
        },
        {
          children: 'properties',
          object: true,
          width: 180,
          label: '属性',
          prop: {
            key: 'propertyName',
            value: 'propertyValue'
          }
        },
        {
          value: 'orderAmount',
          label: '备货数量'
        },
        {
          value: 'arrivalQuantity',
          label: '到货数量',
          render(h, scope, type = 'arrivalQuantity') {
            return vm.renderInventory.apply(vm, [h, scope, type])
          }
        },
        {
          value: 'inventory',
          label: '在库库存',
          render(h, scope) {
            return vm.renderInventory.apply(vm, arguments)
          }
        },
        {
          value: 'orderNumSystem',
          label: '订单号',
          width: 200,
          render(h, scope) {
            let {
              orderType,
              orderId,
              orderNumSystem,
              orderNumPlatform,
              deliveryStatus
            } = scope.row
            return (
              <el-button
                type="text"
                onClick={() => {
                  vm.$router.push({
                    name: 'lookOver',
                    query: {
                      deliveryStatus: deliveryStatus,
                      orderServiceId: orderId,
                      platformId: vm.radio,
                      orderType: vm.activeType
                    }
                  })
                }}
              >
                {vm.activeType == 1 ? orderNumPlatform : orderNumSystem}
              </el-button>
            )
          }
        },
        {
          value: 'deliveryWarehouseName',
          label: '发货仓库'
        },
        {
          value: 'takeWarehouseName',
          label: '备货仓库'
        },
        {
          value: 'storeName',
          label: '来源店铺',
          defaultHidden: true
        },

        {
          value: 'purchaseCount',
          label: '采购中',

          render(h, scope) {
            return vm.renderPurchaseCount.apply(vm, arguments)
          }
        },
        {
          value: 'orderStatusName',
          label: '订单状态',
          width: '94px'
        },
        {
          value: 'orderTypeName',
          label: '订单类型',
          width: 120
        },
        {
          value: 'createTime',
          label: '添加时间',
          width: 150
        },
        {
          value: 'logisticsNumber',
          label: '追踪号',
          width: 200,
          render(h, scope) {
            return vm.renderLogisticsNumber.apply(vm, arguments)
          }
        },

        {
          value: 'deliveryTime',
          label: '发货时间',
          defaultHidden: true,
          width: 150
        },
        {
          value: 'packageNumber',
          label: '包裹单号',
          defaultHidden: true,
          width: 150
        },
        {
          value: 'transportTypePlatformName',
          label: '运输方式',
          defaultHidden: true
        },
        {
          value: 'volume',
          label: '体积',
          defaultHidden: true
        },
        {
          value: 'weight',
          label: '重量',
          defaultHidden: true
        }
      ],
      defaultData: []
    }
  },

  created() {
    this.init()
    this.getSupplierList()
    this.getWarehouseList()
    this.initStoreAllList()
    this.initCommonList(2)
    this.initCommonList(1)
    this.initTransportTypeList()
    this.getHandleUser()
    this.defaultDataCol = this.columns0.map(el => el.label)
    this.selected = this.columns0
      .filter(el => !el.defaultHidden)
      .map(el => el.label)
    this.defaultData = [...this.columns0]
  },

  mounted() {
    this.$nextTick(() => this.handlerResize())
    let handlerResize = debounce(100, this.handlerResize)
    window.onresize = handlerResize
  },
  beforeDestroy() {
    window.onresize = null
  },

  methods: {
    ...mapActions('store', ['initStoreAllList']),
    ...mapActions('common', [
      'initReasonList',
      'getWarehouseList',
      'getSupplierList',
      'initCommonList',
      'initTransportTypeList',
      'getHandleUser'
    ]),

    handlerResize() {
      if (this.$route.name !== 'allOrderLists') {
        return
      }
      this.fixedTableHeight()
    },
    // 修正表格的高度
    fixedTableHeight() {
      // console.log('object');
      let $UniversalLayout = document.querySelectorAll('.UniversalLayout')[0]
      let outerHeight = $UniversalLayout.offsetHeight
      let childs = Array.from($UniversalLayout.childNodes)
      let otherHeight = childs.reduce((prev, cur, index) => {
        if (index === 2) {
          return prev
        }
        return cur.offsetHeight + prev
      }, 0)

      this.currentTableHeight = outerHeight - otherHeight - 110
    },

    renderInventory(h, scope, type) {
      let { products, inventory, arrivalInfo } = scope.row,
        _data = {}

      _data = [arrivalInfo]

      let val =
        scope.row.arrivalInfo &&
        (type !== 'arrivalQuantity'
          ? scope.row.arrivalInfo.currStock
          : scope.row.arrivalInfo.arrivalQuantity)

      return (
        <el-popover
          width={type !== 'arrivalQuantity' ? 180 : 320}
          placement="top-start"
          trigger="hover"
        >
          <el-table data={_data}>
            {type !== 'arrivalQuantity' ? (
              <template>
                <el-table-column
                  prop="currWarehouseName"
                  label="仓库名称"
                  key="currWarehouseName"
                  formatter={this._format}
                />
                <el-table-column
                  prop="currStock"
                  key="currStock"
                  label="库存数量"
                />
              </template>
            ) : (
              <template>
                <el-table-column
                  prop="regularWarehouseTime"
                  width="140px"
                  key="regularWarehouseTime"
                  label="入库时间"
                />
                <el-table-column
                  prop="arrivalQuantity"
                  key="arrivalQuantity"
                  label="数量"
                />
                <el-table-column
                  prop="warehouseName"
                  key="warehouseName"
                  label="仓库"
                  formatter={this._format}
                />
              </template>
            )}
          </el-table>
          <el-button type="text" slot="reference">
            {val == null ? '-' : val}
          </el-button>
        </el-popover>
      )
    },

    _format(row, column, cellValue, index) {
      return cellValue != null && cellValue !== '' ? cellValue : '-'
    },

    renderPurchaseCount(h, scope) {
      let vm = this
      return (
        <div>
          {scope.row.purchaseCount ? (
            <el-button
              type="text"
              onClick={() => {
                // 查看历史采购
                vm.historyRecordOpts.visible = true
                vm.historyRecordOpts.title = `SKU: ${scope.row.storeSku ||
                  scope.row.customSku}历史采购记录`
                vm.$nextTick(() => {
                  vm.$refs.historyRecord.getHistoryInfo(
                    2,
                    scope.row.orderProductId
                  )
                })
              }}
            >
              {scope.row.purchaseCount}
            </el-button>
          ) : (
            scope.row.purchaseCount
          )}
        </div>
      )
    },

    renderLogisticsNumber(h, scope) {
      return scope.row.logisticsNumber != null &&
        scope.row.logisticsNumber !== '' ? (
        <el-button
          type="text"
          onClick={() => {
            window.open('https://www.kuaidi100.com')
            // this.checkExpressText = scope.row.packageNumber
            // this.checkExpressVisible = true
            // jsonp(
            //   'https://www.kuaidi100.com/autonumber/autoComNum?resultv2=1&text=123123',
            //   null,
            //   (err, data) => {
            //     if (err) {
            //       return
            //     } else {
            //       console.log(data)
            //     }
            //   }
            // )
          }}
        >
          {scope.row.logisticsNumber}
        </el-button>
      ) : (
        <span>-</span>
      )
    },

    toggleMethod(scope) {
      let vm = this
      scope.row._open = !scope.row._open
      let curIndex = scope.$index
      let i = scope.row.products.length
      let n = 0
      vm.list.forEach((el, index) => {
        if (index <= curIndex) {
          return
        } else if (n < i - 1) {
          el._show = scope.row._open
          n++
        }
      })

      return scope.row._open
    },

    // 重置搜索
    resetAndGetlist() {
      this.page.pageNumber = 1
      this.$refs.searchForm.clear()
      this.$refs.yttable.clearSelection()
    },

    handlePlatChange(platformId) {
      this.radio = platformId
      this.resetAndGetlist()
    },

    handleSpanMethod({ row, column, rowIndex, columnIndex }) {
      const multis = [
        '产品图片',
        '备货数量',
        '到货数量',
        '在库库存',
        '备货仓库',
        '店铺SKU',
        'ASIN',
        '单价',
        '属性',
        '自定义SKU',
        // '来源店铺',
        '发货仓库',
        '可用库存',
        '采购中'
      ]
      if (row.products) {
        // 母产品
        if (multis.indexOf(column.label) > -1) {
          return [1, 1]
        } else {
          return [row.products.length, 1]
        }
      } else {
        // 展开产品
        // 如果_show为false,不展示，show为true展示
        if (row._show) {
          if (multis.indexOf(column.label) > -1) {
            return [1, 1]
          } else {
            return [0, 0]
          }
        } else {
          return [0, 0]
        }
      }
    },

    exportProductExcel(figureFlag) {
      this.$refs.exportCol.save(2, figureFlag)
    },

    tableRowClassName({ row, rowIndex }) {
      if (row.issueFlag || row.unrelatedFlag) {
        return 'warning'
      }
      return ''
    },

    async handleTabClick(tab) {
      // await this.getPlatOrderCount(this.activeType)
      this.radio =
        (this.platformList[0] && this.platformList[0].platformId)
      this.page.pageNumber = 1
      this.$refs.searchForm.clear()
      this.setCustomColumns(tab.name)
      this.initReasonList(this.activeType == 3 ? 10 : +this.activeType)
      this.$refs.yttable.clearSelection()
      // 清除产品状态选择项
      this.treeCurrentKey = null

      // if (!this.radio) {
      //   this._get = false
      // }
      let wrapper = document.querySelectorAll('.UniversalLayout')[0]
      wrapper.scrollTop = 0
    },

    setCustomColumns(name) {
      let cols
      if (name === '1') {
        cols = [...this.columns0]
      }
      if (name === '2') {
        cols = [...this.columns1]
      }
      if (name === '3') {
        cols = [...this.columns2]
      }
      let wrapper = document.querySelectorAll('.el-table__body-wrapper')[0]
      wrapper.scrollTo(0, 0)

      this.defaultDataCol = cols.map(el => el.label)
      this.selected = cols.filter(el => !el.defaultHidden).map(el => el.label)
      this.defaultData = [...cols]
    },

    getParentNode(node) {
      let parent
      if (node.level === 1) {
        return node
      } else {
        if (node.parent) {
          if (node.parent.level !== 1) {
            return this.getParentNode(node.parent)
          } else {
            return node.parent
          }
        }
      }
    },

    handleTreeClose(key) {
      this.treeCurrentKey = key
    },

    handleNodeclick(data, node) {
      if (data.childSearchType == null) {
        return
      }
      let searchType
      let parent = this.getParentNode(node)
      searchType = parent.data.searchType
      this.showLoading = true
      this.searchParams = {
        ...this.searchParams,
        childSearchType: data.childSearchType,
        searchType
      }
      this.getOrderList()
        .then(() => {
          this.showLoading = false
        })
        .catch(() => {
          this.showLoading = false
        })
    },

    handleLoadMenuData() {
      let params = {
        orderType: +this.activeType,
        platformId: this.radio,
        reserveFlag: this.activeType === '3' ? 1 : 0
      }
      if (this.activeType === '2') {
        delete params.platformId
      }
      return this.$api['order/getListCount'](params).then(data => {
        let { rows } = data
        let ret = []
        for (const key in rows) {
          if (rows.hasOwnProperty(key)) {
            const element = rows[key]
            ret.push(element)
          }
        }
        return ret
      })
    },

    // 导出成功
    handleExSuccess(data) {
      downloadFile(data.path)
      // this.batchOpts.visible = false
    },

    // 导出失败
    handleExError() {
      // this.batchOpts.visible = false
    },

    // 重新计算
    executePriority() {
      this.$confirm(
        '重新计算将把所有打印包裹面单的产品重新计算，分配库存，是否执行',
        '提示',
        {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.$api['order/strategyPriorityExecutePriority']({})
            .then(data => {})
            .catch(err => {})
        })
        .catch(() => {})
    },
    // 手动同步订单
    synchronousOrder() {
      this.synchronousOrderOpts.visible = true
    },
    revertInvalid(row) {
      this.$api[`order/abolish`]({ orderIds: [row.orderId] })
        .then(data => {
          this.getOrderList()
        })
        .catch(err => {})
    },

    checkAmazon(row) {
      this.checkStorId = row.orderId
      this.storeVisible = true
    },

    review(row) {
      this.reviewData.orderIds = [row.orderId]
      this.reviewVisible = true
    },

    handleStoreOpen() {
      // this.checkStorId =
    },

    // 打开申请全额退款
    handleApplyRefundOpen() {
      // let tableData = this.$refs.yttable.$children[0].selection
      // let orderIds = tableData.map(el => el.orderId)
      // if (!tableData.length) {
      //   this.$message.warning('请先选择一项进行操作')
      //   return
      // }
      // this.orderIds = orderIds
    },
    handleApplyRefundSave() {
      this.applyRefundBtnLoading = true
      this.$refs.applyRefund
        .submitForm()
        .then(() => {
          this.applyRefundBtnLoading = false
          this.applyRefundVisible = false
          this.getOrderList()
        })
        .catch(() => {
          this.applyRefundBtnLoading = false
        })
    },

    handleReviewOpen() {
      if (this.$refs.reviewDataForm) {
        this.reviewData = {
          orderIds: this.reviewData.orderIds
        }
        this.$refs.reviewDataForm.resetFields()
      }
    },

    handleReviewOk() {
      this.$refs.reviewDataForm.validate(valid => {
        if (valid) {
          this.reviewBtnLoading = true
          this.$api[`order/inventoryExamine`](this.reviewData)
            .then(data => {
              this.reviewBtnLoading = false
              this.getOrderList()
              this.reviewVisible = false
            })
            .catch(err => {
              this.reviewBtnLoading = false
            })
        }
      })
    },
    editOrder(row) {
      this.editOrderId = row.orderId
      this.addOrderOpts.title = '编辑订单'
      this.addOrderOpts.visible = true
    },
    // 添加黑名单
    addBlackList(row) {
      // debugger
      let {
        orderNumSystem: orderNumber,
        cneeMemberId: memberId,
        cneeEmail: email,
        cneeAddressDetailFirst: address,
        cneePhone: phone
      } = row
      this.blackInfoData = {
        orderNumber,
        memberId,
        email,
        address,
        phone,
        type: 0
      }
      this.addBlackOpts.visible = true
    },
    init() {
      if (this.flag) {
        this.flag = false
        this.firstLoading = true
        this.getOrderList()
          .then(() => {
            this.flag = true
            this.firstLoading = false
          })
          .catch(() => {
            this.firstLoading = false
            this.flag = true
          })
      }
    },
    // 搜索事件
    handleSearch() {
      // let { time, ...info } = this.searchForm
      // if (!time) time = []
      // this.searchParams = { ...info, startTime: time[0], endTime: time[1] }
      this.page.pageNumber = 1
      this.$nextTick(() => this.getOrderList())
    },

    handleApply() {
      this.handlerResize()
    },

    // 获取每个平台的订单数量
    getPlatOrderCount(orderType, reset = true) {
      let params = {
        orderType: +orderType,
        reserveFlag: this.activeType == 3 ? 1 : null
      }
      // if (this.activeType !== '2') {
      //   params.platformId = this.radio
      // }
      return this.$api['order/getPlatOrderCount'](params).then(data => {
        this.platformList = data.rows
        if (reset) {
          this.radio = data.rows[0].platformId
        }
      })
    },

    handleStoreEdit(orderId) {
      this.storeVisible = false
      this.editOrderId = orderId
      this.addOrderOpts.visible = true
      this.reset = true
      this.addOrderOpts.title = '编辑订单'
    },

    handleStoreClose() {
      this.addOrderOpts.title = '新增订单'
      this.storeVisible = false
      this.getOrderList()
    },

    // 请求所有列表
    async getOrderList(params) {
      await this.getPlatOrderCount(this.activeType, false)
      this.radio = this.radio || (this.platformList[0] && this.platformList[0].platformId)
      let _params = {},
        reserveFlag
      if (this.activeType == 3) {
        reserveFlag = 1
        _params = {
          orderType: +this.activeType,
          platformId: this.radio,
          ...this.page,
          ...this.searchParams,
          reserveFlag,
          ...params
        }
      } else {
        _params = {
          platformId: this.radio,
          ...this.page,
          ...this.searchParams,
          orderType: +this.activeType,
          ...params
        }
      }
      _params = this.$.dealObjectValue(_params)
      // if (_params.orderType >=3) {
      //   delete _params.reserveFlag
      // }
      if (_params.orderType1) {
        _params.orderType = _params.orderType1
        delete _params.orderType1
        delete _params.reserveFlag
      }
      if (this.activeType == 2) {
        delete _params.platformId
      }
      delete _params.total
      this.firstLoading = true
      return this.$api['order/list'](_params).then(data => {
        let result = []
        let _id = 0
        if (data.rows) {
          data.rows.forEach(element => {
            let { products } = element
            result.push({
              ...element,
              ...products[0],
              _open: false,
              _id: element.orderId
            })
            _id++
            if (products.length > 1) {
              products.forEach((el, index) => {
                if (index === 0) {
                  return
                }
                result.push({
                  ...el,
                  _show: false,
                  _id: el.orderId + '-' + index
                })
                _id++
              })
            }
          })
          this.firstLoading = false
          this.list = result

          this.page.pageNumber = data.pageNo
          this.page.pageSize = data.pageSize
          this.page.total = data.total
        } else {
          this.firstLoading = false
          this.list = result
          this.page.total = 0
        }
        // this.fixedTableHeight()
      })
    },
    selectCheck(val) {
      let el = this.defaultData.filter(el => el.defaultHidden)
      if (el.length) {
        el.forEach(el => {
          delete el.defaultHidden
        })
      }
      let arr = this.defaultData.filter(
        (item, index) => val.indexOf(item.label) >= 0
      )

      this.defaultData = [...arr]
    },

    handleSizeChange(val) {
      this.getOrderList({ pageSize: val })
    },
    handleCurrentChange(val) {
      this.getOrderList({ pageNumber: val })
    },
    print(row) {
      let { orderId } = row
      window.open(`#/print?title=打印发票&purchaseIds=${orderId}`)
    },
    //查看
    lookOver(item) {
      this.$router.push({
        name: 'lookOver',
        query: {
          deliveryStatus: item.deliveryStatus,
          orderServiceId: item.orderId,
          platformId: this.radio,
          orderType: this.activeType
        }
      })
    },
    clickBtn(val) {
      let vm = this
      let tableData = this.$refs.yttable.$children[0].selection
      let orderIds = tableData.map(el => el.orderId)
      let api, params
      let notMustSelects = ['当前条件导出订单', '当前条件导出订单产品']
      // let batchExports = ['自定义导出','当前条件导出订单','选中订单导出包裹追踪号', '当前条件导出订单产品','导出未关联店铺sku', 'sku采购延迟导出统计', '导出订单利润', '导出订单产品利率']
      if (!tableData.length && notMustSelects.indexOf(val) === -1) {
        this.$message.warning('请先选择一项进行操作')
        return
      }

      this.batchOpts.title = val
      this.batchOpts.width = '500px'
      this.batchData.copyText = null
      this.batchOpts.noFooter = false

      switch (val) {
        case '设置优先':
          api = 'setPriority'
          params = { orderIds, type: 1 }
          break

        case '取消优先':
          api = 'setPriority'
          params = { orderIds, type: 2 }
          break

        case '转发货仓库':
          this.batchOpts.visible = true
          this.$nextTick(() => {
            this.batchData = {}
            this.$refs.batchForm.resetFields()
          })
          return
          break

        case '中国仓订单转FBA发货':
          this.batchOpts.visible = true
          this.$nextTick(() => {
            this.batchData = {}
            this.$refs.batchForm.resetFields()
          })
          return
          break

        case '修改运输方式':
          this.batchOpts.visible = true
          this.$nextTick(() => {
            this.batchData = {}
            this.$refs.batchForm.resetFields()
          })
          return
          break

        case '修改延迟发货原因':
          this.batchOpts.visible = true
          this.$nextTick(() => {
            this.batchData = {}
            this.$refs.batchForm.resetFields()
          })
          return
          break

        case '申请全额退款':
          this.orderIds = orderIds
          this.applyRefundVisible = true
          return
          break

        case '修改订单备注':
          this.batchOpts.visible = true
          this.$nextTick(() => {
            this.batchData = {}
            this.$refs.batchForm.resetFields()
          })
          return
          break

        case '修改订单发货备注':
          this.batchOpts.visible = true
          this.$nextTick(() => {
            this.batchData = {}
            this.$refs.batchForm.resetFields()
          })
          return
          break

        case '提取订单产品SKU':
          params = {
            orderIds,
            type: 1
          }
          api = 'getSku'
          this.$api[`order/${api}`](params)
            .then(data => {
              this.copyTextVal = data.rows.join('\n')
              this.batchOpts.visible = true

              this.$nextTick(() => {
                this.batchData = {
                  copyText: this.copyTextVal
                }
                this.$refs.batchForm.resetFields()
              })
            })
            .catch(err => {})
          return
          break

        case '提取订单店铺SKU':
          params = {
            orderIds,
            type: 2
          }
          api = 'getSku'
          this.$api[`order/${api}`](params)
            .then(data => {
              this.copyTextVal = data.rows.join('\n')
              this.batchOpts.visible = true

              this.$nextTick(() => {
                this.batchData = {
                  copyText: this.copyTextVal
                }
                this.$refs.batchForm.resetFields()
              })
            })
            .catch(err => {})
          return
          break

        case '提取ASIN':
          params = {
            orderIds,
            type: 3
          }
          api = 'getSku'
          this.$api[`order/${api}`](params)
            .then(data => {
              this.copyTextVal = data.rows.join('\n')
              this.batchOpts.visible = true

              this.$nextTick(() => {
                this.batchData = {
                  copyText: this.copyTextVal
                }
                this.$refs.batchForm.resetFields()
              })
            })
            .catch(err => {})
          return
          break

        case '提取订单号':
          params = {
            orderIds
          }
          api = 'getOrderNumber'
          this.$api[`order/${api}`](params)
            .then(data => {
              this.copyTextVal = data.rows.join('\n')
              this.batchOpts.visible = true

              this.$nextTick(() => {
                this.batchData = {
                  copyText: this.copyTextVal
                }
                this.$refs.batchForm.resetFields()
              })
            })
            .catch(err => {})
          return
          break

        case '设置订单状态为正常':
          params = {
            orderIds,
            state: 1
          }
          api = 'setOrderState'
          break

        case '设置订单状态为作废':
          params = {
            orderIds,
            state: 2
          }
          api = 'setOrderState'
          break

        case '取消作废':
          params = {
            orderIds
          }
          api = 'abolish'
          break

        case '设置订单状态为锁定':
          params = {
            orderIds,
            state: 3
          }
          api = 'setOrderState'
          break

        case '自定义导出':
          this.batchOpts.noFooter = true
          this.batchOpts.visible = true
          this.batchOpts.width = '70%'
          this.$nextTick(() => this.$refs.exportCol.reset())
          return
          break

        case '当前条件导出订单':
          api = 'exportOrder'
          let columns = storage.get('session', 'customeExport')
          if (!columns) {
            this.exportFieldData().then(data => {
              columns = data
              params = {
                type: 1,
                columns,
                orderType: +this.activeType,
                ...this.searchParams
              }
              this._export('是否当前条件导出所有订单?', api, params)
            })
          } else {
            params = {
              type: 1,
              columns,
              orderType: +this.activeType,
              ...this.searchParams
            }
            this._export('是否当前条件导出所有订单?', api, params)
          }

          return
          break

        case '选中订单导出包裹追踪号':
          api = 'exportPackageTrackNumber'
          params = {
            orderIds
          }
          this.fetchAPI(api, params, data => {
            downloadFile(data.path)
          })
          return
          break

        case '当前条件导出订单产品':
          api = 'exportOrderProduct'
          params = {
            ...this.searchParams
          }
          this._export('是否当前条件导出所有订单产品?', api, params)
          return
          break

        case '导出未关联店铺sku':
          api = 'exportUnrelatedStore'
          params = {
            orderIds
          }
          this._export('是否导出未关联店铺sku?', api, params, false)
          return
          break

        case 'sku采购延迟导出统计':
          api = 'exportPurchaseDelay'
          params = {
            orderIds
          }
          this._export('是否导出sku采购延迟导出统计?', api, params, false)
          return
          break

        case '导出订单利润':
          api = 'exportProfit'
          params = {
            orderIds
          }
          this._export('是否导出订单利润?', api, params, false)
          return
          break

        case '导出订单产品利率':
          api = 'exportOrderProductProfit'
          params = {
            orderIds
          }
          this._export('是否导出订单产品利率?', api, params, false)
          return
          break
        default:
          return
          break
      }

      let confirms = ['设置订单状态为作废', '设置订单状态为锁定']
      if (confirms.indexOf(val) > -1) {
        this.$confirm(`是否${val}`, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.fetchAPI(api, params)
          })
          .catch(() => {})
      } else {
        this.fetchAPI(api, params)
      }
    },
    fetchAPI(api, params, cb) {
      this.$api[`order/${api}`](params)
        .then(data => {
          vm.$message.success(data.msg || '操作成功')
          if (cb) {
            cb(data)
            return
          }
          if (!data.msg) {
            return
          }
          this.getOrderList()
        })
        .catch(err => {})
    },
    update(val) {},
    _export(
      str = '是否当前条件导出所有订单?',
      api,
      params,
      showWarning = false
    ) {
      params.orderType = +this.activeType
      if (this.activeType !== '2') {
        params.platformId = +this.radio
      }
      if (this.activeType === '3') {
        params.reserveFlag = 1
      }
      if (!showWarning) {
        this.fetchAPI(api, params, data => {
          downloadFile(data.path)
        })
      } else {
        this.$confirm(str, '警告', {
          confirmButtonText: '确认',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            this.fetchAPI(api, params, data => {
              downloadFile(data.path)
            })
          })
          .catch(() => {})
      }
    }
  },
  watch: {
    searchForm: {
      deep: true,
      handler(val) {
        if (!val) {
          return
        }

        let { time, ...info } = val
        if (!time) time = []
        this.searchParams = {
          ...info,
          startTime: time[0],
          endTime: time[1]
        }
      }
    },
    activeType: {
      immediate: true,
      handler(val) {
        let shows, hiddens
        // 转发货仓库按钮
        let btn1 = this.btnList[3]
        // 批量修改
        let btn2 = this.btnList[4]
        // 批量提取
        let btn3 = this.btnList[5]
        // 批量设置状态
        let btn4 = this.btnList[6]
        if (val == '1') {
          // 客户订单
          hiddens = [1, 8, 9]
          shows = [2, 3, 4, 7, 10]
          btn1.children = [
            { name: '转发货仓库' },
            { name: '中国仓订单转FBA发货' }
          ]
          btn2.children = [
            { name: '修改运输方式' },
            { name: '修改延迟发货原因' },
            { name: '申请全额退款' },
            { name: '修改订单备注' },
            { name: '修改订单发货备注' }
          ]
          btn3.children = [
            { name: '提取订单产品SKU' },
            { name: '提取订单店铺SKU' },
            { name: '提取ASIN' },
            { name: '提取订单号' }
          ]
          btn4.children = [
            { name: '设置订单状态为正常' },
            { name: '设置订单状态为作废' },
            { name: '设置订单状态为锁定' }
          ]
        } else if (val == '2') {
          // 本地仓
          hiddens = [2, 3, 4, 7, 8, 10]
          shows = [1, 9]
          btn1.children = [
            { name: '转发货仓库' },
            { name: '中国仓订单转FBA发货' }
          ]
          btn2.children = [
            { name: '修改运输方式' },
            { name: '修改延迟发货原因' },
            { name: '申请全额退款' },
            { name: '修改订单备注' },
            { name: '修改订单发货备注' }
          ]
          btn3.children = [{ name: '提取订单产品SKU' }, { name: '提取订单号' }]
          btn4.children = [{ name: '设置订单状态为作废' }, { name: '取消作废' }]
        } else {
          // 海外仓
          shows = [1, 2, 3, 4, 9, 10]
          hiddens = [7, 8]
          btn1.children = [{ name: '转发货仓库' }]
          btn2.children = [
            { name: '修改运输方式' },
            { name: '修改订单备注' },
            { name: '修改订单发货备注' }
          ]
          btn3.children = [
            { name: '提取订单产品SKU' },
            { name: '提取订单店铺SKU' },
            { name: '提取ASIN' },
            { name: '提取订单号' }
          ]
          btn4.children = [{ name: '设置订单状态为作废' }, { name: '取消作废' }]
        }

        let btns = []

        this.btnList.forEach((element, index) => {
          let hidden
          if (shows.indexOf(index) > -1) {
            hidden = false
          }
          if (hiddens.indexOf(index) > -1) {
            hidden = true
          }
          btns.push({ ...element, hidden })
        })
        this.btnList = btns
      }
    },
    $route(to, from) {
      if (to.name === 'allOrderLists') {
        this.getOrderList()
      }
    }
  }
}
</script>

<style lang="scss">
.btnBox {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
}
</style>
