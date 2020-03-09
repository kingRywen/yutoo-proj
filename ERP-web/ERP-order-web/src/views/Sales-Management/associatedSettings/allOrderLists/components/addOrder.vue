<template>
  <div v-loading="loading" style="margin-right:10px" ref="box">
    <h2 class="title">订单基本信息</h2>
    <div class="box_form">
      <el-form
        ref="baseform"
        :model="baseForm"
        label-width="120px"
        size="small"
        :rules="disabled ? null : baseRules"
        :disabled="disabled"
      >
        <!-- 客户订单 -->
        <div v-if="baseForm.orderType === 1" key="1">
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="baseForm.orderType" disabled style="width:100%">
                  <el-option
                    v-for="item in $const['ORDER/addType']"
                    :disabled="item.disabled"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单号" prop="orderNumberPlatform">
                <el-input v-model="baseForm.orderNumberPlatform"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="买家ID" prop="buyerIdPlatform">
                <el-input v-model="baseForm.buyerIdPlatform" @input="val => baseForm.cneeMemberId = val"></el-input>
                <el-input v-show="false" v-model="baseForm.cneeMemberId"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="来源店铺" prop="storeId">
                <el-cascader :options="storeAllList" :props="storeListProps" v-model="baseForm.storeId"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="新增订单原因" prop="createOrderReason">
                <div class="flex">
                  <el-select v-model="baseForm.createOrderReason" style="width:100%">
                    <el-option
                      v-for="item in reasonsForNewOrders"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-button style="margin-left:10px" type="primary" @click="openReasonDialog">原因管理</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 本地仓备货订单 -->
        <div v-else-if="baseForm.orderType === 2" key="2">
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="订单号" prop="orderNumSystem">
                <el-input disabled v-model="baseForm.orderNumSystem"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="baseForm.orderType" disabled style="width:100%">
                  <el-option
                    v-for="item in $const['ORDER/addType']"
                    :disabled="item.disabled"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <!-- <el-col :span="8">
              <el-form-item label="订单号" prop="orderNumberPlatform">
                <el-input disabled v-model="baseForm.orderNumberPlatform"></el-input>
              </el-form-item>
            </el-col>-->
            <el-col :span="8">
              <el-form-item label="备货仓库" prop="stockUpWarehouseId">
                <el-select v-model="baseForm.stockUpWarehouseId" placeholder style="width:100%">
                  <el-option v-for="item in localWhouse" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="新增订单原因" prop="createOrderReason">
                <div class="flex">
                  <el-select v-model="baseForm.createOrderReason" style="width:100%">
                    <el-option
                      v-for="item in reasonsForNewOrders"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-button style="margin-left:10px" type="primary" @click="openReasonDialog">原因管理</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- 海外仓备库订单 -->
        <div v-else-if="baseForm.orderType === 3" key="3">
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="baseForm.orderType" style="width:100%">
                  <el-option
                    v-for="item in $const['ORDER/addOverseeType']"
                    :disabled="item.disabled"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单来源店铺">
                <el-cascader :options="storeAllList" :props="storeListProps" v-model="baseForm.storeId"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="到达仓库" prop="takeWarehouseId">
                <el-select v-model="baseForm.takeWarehouseId" placeholder style="width:100%">
                  <el-option v-for="item in overseeWhouse" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="计划发货时间" prop="scheduledDeliveryTime">
                <el-date-picker
                  type="datetime"
                  style="width:100%"
                  v-model="baseForm.scheduledDeliveryTime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="计划发货时间"
                  :picker-options="pickerOptions1"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划入库时间" prop="regularWarehouseTime">
                <el-date-picker
                  v-if="showRegularWarehouseTime"
                  type="datetime"
                  style="width:100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="baseForm.regularWarehouseTime"
                  :picker-options="pickerOptions2"
                  placeholder="计划入库时间"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="新增订单原因" prop="createOrderReason">
                <div class="flex">
                  <el-select v-model="baseForm.createOrderReason" style="width:100%">
                    <el-option
                      v-for="item in reasonsForNewOrders"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-button style="margin-left:10px" type="primary" @click="openReasonDialog">原因管理</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <!-- FBA备库计划 -->
        <div v-else-if="baseForm.orderType === 5 ||baseForm.orderType === 4" key="5">
          <el-row type="flex">
            <el-col :span="8">
              <el-form-item label="订单类型" prop="orderType">
                <el-select v-model="baseForm.orderType" style="width:100%">
                  <el-option
                    v-for="item in $const['ORDER/addOverseeType']"
                    :disabled="item.disabled"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="订单来源店铺" prop="storeId">
                <el-cascader :options="storeAllList" :props="storeListProps" v-model="baseForm.storeId"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="计划发货时间" prop="scheduledDeliveryTime">
                <el-date-picker
                  type="datetime"
                  style="width:100%"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  v-model="baseForm.scheduledDeliveryTime"
                  placeholder="计划发货时间"
                  :picker-options="pickerOptions"
                ></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="新增订单原因" prop="createOrderReason">
                <div class="flex">
                  <el-select v-model="baseForm.createOrderReason" style="width:100%">
                    <el-option
                      v-for="item in reasonsForNewOrders"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                  <el-button style="margin-left:10px" type="primary" @click="openReasonDialog">原因管理</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
      </el-form>
    </div>

    <h2 class="title">产品信息</h2>

    <div class="box_form pb20">
      <div>
        <el-button :disabled="disabled" type="plain" icon="el-icon-plus" size="small" @click="addPro">添加产品</el-button>
        <el-popover
          placement="right"
          style="margin-left:10px"
          width="400px"
          trigger="manual"
          v-model="popoverVisible"
          v-clickoutside="handleClickoutsidePopover"
        >
          <el-button
            :disabled="disabled"
            type="plain"
            icon="el-icon-download"
            size="small"
            :loading="loading"
            @click="downloadTemp"
          >下载模板</el-button>
          <el-upload
            class="upload"
            action="/order/product/importConnection"
            :http-request="handleRequest"
            :file-list="fileList"
            :on-change="handleChange"
          >
            <el-button :disabled="disabled" type="primary" icon="el-icon-upload2" :loading="loading" size="small">导入</el-button>
          </el-upload>
          <el-button
            :disabled="disabled"
            type="plain"
            icon="el-icon-upload2"
            size="small"
            slot="reference"
            @click="handleOpenPopover"
          >导入产品</el-button>
        </el-popover>
      </div>
      <div class="martop" v-if="productInfoTbList.length">
        <el-form :model="productInfoTbListObj" ref="productInfoTbList">
          <yt-table
            :selection="false"
            :data="productInfoTbList"
            :columns="productInfoTbCol"
            :border="true"
            reserveSelection="storeProductId"
          >
            <template slot="right">
              <el-table-column
                label="发货仓库"
                width="120"
                align="center"
                v-if="baseForm.orderType !== 4 && baseForm.orderType !== 2"
              >
                <template slot-scope="scope">
                  <el-form-item :prop="`data.${scope.$index}.stock`" :rules="[{required: true, message: '不能为空'}]">
                    <el-select
                      size="small"
                      v-model="scope.row.stock"
                      :disabled="disabled"
                      placeholder="选择发货仓库"
                      style="width:100%"
                    >
                      <el-option
                        v-for="item in scope.row.stocks"
                        :label="item.warehouseName"
                        :value="item.warehouseId"
                        :key="item.warehouseId"
                      >
                        <span style="float: left">{{ item.warehouseName }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ item.warehouseStock }}</span>
                      </el-option>
                    </el-select>
                  </el-form-item>
                </template>
              </el-table-column>
              <el-table-column
                :label="baseForm.orderType >= 4 || baseForm.orderType === 2 ? '最终数量' :'订购数量'"
                align="center"
              >
                <template slot-scope="scope">
                  <el-form-item :prop="`data.${scope.$index}.num`" :rules="stockNumCheck(scope)">
                    <el-input-number
                      :disabled="resetNum ? false : disabled"
                      style="width:100%"
                      :min="1"
                      controls-position="right"
                      size="small"
                      v-model="scope.row.num"
                      @change="handleSinglePrice"
                      placeholder="请输入订购数量"
                    ></el-input-number>
                  </el-form-item>
                </template>
              </el-table-column>
            </template>
          </yt-table>
        </el-form>
      </div>
    </div>

    <template v-if="baseForm.orderType !== 2 && baseForm.orderType !== 4">
      <h2 class="flex">
        <div class="title1">收货人信息</div>
        <div>
          <el-checkbox class="btn" label="是否保存收货地址" v-model="baseForm.saveAddressFlag" :true-label="1" :false-label="0"></el-checkbox>
          <el-button type="text" @click="openStockAdds">常用收货地址</el-button>
        </div>
      </h2>

      <div class="box_form">
        <SimpleForm :fields="receiverFields" :form-data="receiverForm" ref="receiverForm"></SimpleForm>
      </div>
    </template>
    
    <h2 class="flex" :key="baseForm.orderType">
      <div class="title1">
        {{baseForm.orderType === 1 || baseForm.orderType === 3 || baseForm.orderType === 5 ||baseForm.orderType === 4? '寄件人' : '收货' }}信息
        <span
          v-if="baseForm.orderType ===4"
          style="color:red"
        >*温馨提示：寄件信息可能会影响亚马逊分仓，请谨慎填写</span>
      </div>
      <div>
        <el-button
          type="text"
          @click="openSenderInfo"
        >{{baseForm.orderType === 1 || baseForm.orderType === 3 || baseForm.orderType === 5 ||baseForm.orderType === 4? '寄件人' : '收货' }}信息管理</el-button>
        <yt-dialog :options="senderInfoOpts" :events="senderInfoEvents">
          <table-select
            :url="`order/senderList`"
            :initial="senderListInitial"
            :options="tableAddSendInfoOptions"
            ref="tableSenderInfo"
          >
            <!-- 添加新地址 -->
            <yt-dialog :options="senderInfoOptsAdd" :events="senderInfoEventsAdd" slot="add" name="添加新地址">
              <SimpleForm :fields="senderInfoFields" :form-data.sync="senderInfoForm" label-width="123px"></SimpleForm>
            </yt-dialog>

            <div slot="del" uid="senderId" uids="senderIds" url="order/senderRemove" name="删除选中地址"></div>
            <template slot="right" slot-scope="scope">
              <el-button type="text" @click="$refs.tableSenderInfo.handleEdit(scope)">编辑</el-button>
              <el-button type="text" @click="handleSenderInfoDel(scope.row)">删除</el-button>
              <el-button type="text" @click="handleSenderInfoSelect(scope.row)">选择</el-button>
            </template>
          </table-select>
        </yt-dialog>
      </div>
    </h2>
    <div class="box_form">
      <SimpleForm :fields="senderFields" :form-data="senderForm" ref="senderForm" :key="baseForm.orderType"></SimpleForm>
    </div>

    <template v-if="baseForm.orderType === 1">
      <h2 class="title">支付方式</h2>
      <div class="box_form">
        <SimpleForm :fields="payFields" :form-data="payForm" ref="payForm" :disabled="disabled"></SimpleForm>
      </div>
      <h2 class="title">订单备注</h2>
      <el-input class="pb20" :rows="6" type="textarea" v-model="receiverForm.orderRemark"></el-input>

      <div>
        <el-checkbox v-model="receiverForm.endFlag" label="是否已完结订单" :true-label="1" :false-label="0"></el-checkbox>
        <el-checkbox v-model="receiverForm.overseaPurchaseFlag" label="是否海外仓直采" :true-label="1" :false-label="0"></el-checkbox>
      </div>
    </template>

    <template v-if="baseForm.orderType === 2">
      <div>
        <el-checkbox v-model="receiverForm.generatePurchaseFlag" label="立即单独生成采购单" :true-label="1" :false-label="0"></el-checkbox>
        <el-checkbox v-model="receiverForm.rebateTaxFlag" label="是否出口退税" :true-label="1" :false-label="0"></el-checkbox>
      </div>
    </template>

    <template v-if="baseForm.orderType ===3 || baseForm.orderType === 5">
      <div>
        <!-- <el-checkbox v-model="receiverForm.saveAddressFlag" label="是否保存备货地址" :true-label="1" :false-label="0"></el-checkbox> -->
        <el-checkbox v-model="receiverForm.overseaPurchaseFlag" label="是否海外仓直采" :true-label="1" :false-label="0"></el-checkbox>
        <el-checkbox v-model="receiverForm.generatePurchaseFlag" label="立即生成采购单" :true-label="1" :false-label="0"></el-checkbox>
        <el-checkbox v-model="receiverForm.rebateTaxFlag" label="是否出口退税" :true-label="1" :false-label="0"></el-checkbox>
      </div>
    </template>


    <yt-dialog :options="stockAddsProOpts" :events="stockAddsProEvents">
      <table-select
        url="order/stockAddressList"
        :initial="initial"
        :options="tableStockAddsOptions"
        ref="tableStockAdds"
      >
        <!-- 添加新地址 -->
        <yt-dialog :options="stockAddsProOptsAdd" :events="stockAddsProEventsAdd" slot="add" name="添加新地址">
          <SimpleForm
            :fields="addressFields"
            :form-data.sync="addressForm"
            label-width="123px"
            ref="tableStockAddsSimpleForm"
          ></SimpleForm>
        </yt-dialog>

        <div slot="del" uid="stockUpAddressId" uids="stockUpAddressIds" url="order/stockAddressRemove" name="删除选中地址"></div>
        <template slot="right" slot-scope="scope">
          <el-button type="text" @click="$refs.tableStockAdds.handleEdit(scope)">编辑</el-button>
          <el-button type="text" @click="handleStockAddsDel(scope.row)">删除</el-button>
          <el-button type="text" @click="handleStockAddsSelect(scope.row)">选择</el-button>
        </template>
      </table-select>
    </yt-dialog>

    <yt-dialog :options="selectProOpts" :events="selectProEvents">
      <table-select
        url="order/getConnection"
        :getReset="false"
        v-if="tableSelRefresh"
        :params="{storeId: baseForm.storeId && baseForm.storeId.slice(0).pop(), selected: productInfoTbListSku, rowKey: 'storeProductId'}"
        :options="tableSelOptions"
        ref="tableSel"
      ></table-select>
    </yt-dialog>

    <yt-dialog :options="reasonOpts" :events="reasonEvents">
      <table-select
        url="order/createReasonList"
        :options="tableAddReasonOptions"
        :initial="{orderType:baseForm.orderType}"
        :params="{rowKey:'name'}"
        ref="tableReason"
      >
        <!-- 添加新地址 -->
        <yt-dialog :options="reasonOptsAdd" :events="reasonEventsAdd" slot="add" name="添加">
          <SimpleForm :fields="reasonFields" :form-data.sync="reasonForm" label-width="123px"></SimpleForm>
        </yt-dialog>

        <div slot="del" uid="orderCreateReasonId" uids="orderCreateReasonIds" url="order/createReasonRemove" name="删除"></div>
        <template slot="right" slot-scope="scope">
          <el-button type="text" @click="$refs.tableReason.handleEdit(scope)">编辑</el-button>
          <el-button type="text" @click="handleReasonDel(scope.row)">删除</el-button>
          <!-- <el-button type="text" @click="handleReasonSelect(scope.row)">选择</el-button> -->
        </template>
      </table-select>
    </yt-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState } from 'vuex'
import { downloadFile } from 'Utils/tools'
export default {
  props: {
    resetNum: {
      type: Boolean,
      default: false
    },
    data: {
      type: Object,
      default: () => {}
    },
    orderType: {
      type: String,
      default: undefined
    }
  },
  created() {
    this.initTransportTypeList()
    this.initCommonList(2)
    this.initCommonList(3)
    this.initCountryList()
  },
  data() {
    let vm = this

    let _stockNumCheck = scope => (rule, value, cb) => {
      if (scope.row.num < value) {
        cb(new Error('不能大于当前仓库的库存'))
      }
      cb()
    }
    return {
      tableSelRefresh: true,
      initial: {},
      senderListInitial: {},
      showRegularWarehouseTime: true,
      pickerOptions: {
        disabledDate(time) {
          if (vm.baseForm.orderType === 4) {
            return (
              time.getTime() < Date.now() - 24 * 3600 * 1000 ||
              time.getTime() > Date.now() + 24 * 30 * 3600 * 1000
            )
          } else {
            return time.getTime() < Date.now() - 24 * 3600 * 1000
          }
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now()
        }
      },
      pickerOptions2: {
        disabledDate(time) {
          let _now = vm.baseForm.scheduledDeliveryTime
            ? new Date(vm.baseForm.scheduledDeliveryTime).getTime()
            : Date.now()
          return time.getTime() < _now
        }
      },
      popoverVisible: false,
      stockNumCheck(scope) {
        return [
          { required: true, message: '不能为空' },
          {
            validator: _stockNumCheck(scope)
          }
        ]
      },
      flag: true,
      disabled: false,
      addressForm: {},
      senderInfoForm: {},
      reasonForm: {},
      fileList: [],
      tableSelOptions: {
        search: {
          list: [
            {
              label: 'sku',
              value: 'sku',
              type: 'input'
            },
            {
              label: '产品名称',
              value: 'name',
              type: 'input'
            }
          ]
        },
        table: {
          columns: [
            {
              value: 'customSku',
              label: 'SKU'
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
              multi: ['nameZh', 'nameEn'],
              label: '商品名称'
            },
            {
              value: 'storeSku',
              label: '店铺SKU'
            },
            {
              value: 'purchaser',
              label: '供应商'
            }
          ],
          // selectableFunc(row, index) {
          //   if (
          //     vm.productInfoTbList.find(
          //       el => el.productId == row.storeProductId
          //     )
          //   ) {
          //     return false
          //   }

          //   return true
          // },
          reserveSelection: 'storeProductId'
        }
      },

      // 选择订单包含产品弹窗
      selectProEvents: {
        close() {
          // 关闭时的回调
          // vm.productInfoTbList = []
        },
        handleOkClick() {
          let selection = vm.$refs.tableSel.selection
          if (!selection.length) {
            vm.productInfoTbList.splice(0)
            return
          }
          // 确认事件
          return vm.$api['order/addConnection']({
            storeProductIds: selection.map(el => el.storeProductId)
          })
            .then(data => {
              vm.$message.success('添加成功')
              vm.selectProOpts.visible = false
              vm.addProList(data.rows)
            })
            .catch(() => {})
        }
      },
      selectProOpts: {
        visible: false,
        title: '选择订单包含产品',
        width: '70%',
        okBtnText: '确认关联',
        appendToBody: true
      },

      // 添加收货人地址弹窗
      stockAddsProEvents: {
        close() {
          // 关闭时的回调
        },

        handleOkClick() {
          // 确认事件
          return vm.$api['order/addConnection']({
            storeProductIds: vm.$refs.tableSel.selection.map(
              el => el.storeProductId
            )
          }).then(data => {
            vm.$message.success('添加成功')
            vm.selectProOpts.visible = false
            vm.productInfoTbList = data.rows.map(el => ({
              ...el,
              storeProductId: el.storeProductId || el.productId
            }))
          })
        }
      },
      stockAddsProOpts: {
        visible: false,
        title: '备货地址管理',
        width: '70%',
        // okBtnText: '确认关联',
        appendToBody: true
      },

      // 添加收货人地址弹窗 - 添加
      stockAddsProEventsAdd: {
        handleOkClick() {
          let params = {}
          if (vm.orderType == 1) {
            Object.assign(params, vm.addressForm, {
              storeId: vm.baseForm.storeId.slice(0).pop()
            })
          }
          if (vm.orderType == 2) {
            Object.assign(params, vm.addressForm, {
              deliveryWarehouseId: vm.baseForm.stockUpWarehouseId
            })
          }

          // 新增
          return vm.$api['order/stockAddressSave'](params).then(() => {
            // vm.stockAddsProOptsAdd.visible = false
            // 重置搜索
            vm.$refs.tableStockAdds.reset()
          })
        },
        handleEditOkClick() {
          // 编辑
          return vm.$api['order/stockAddressUpdate'](vm.addressForm).then(
            () => {
              // vm.stockAddsProOptsAdd.visible = false
              // 重置搜索
              vm.$refs.tableStockAdds.reset()
            }
          )
        }
      },
      stockAddsProOptsAdd: {
        visible: false,
        title: '备货地址管理',
        width: '60%',
        okBtnText: '保存',
        cancelBtnText: '取消',
        appendToBody: true
      },

      tableStockAddsOptions: {
        search: {
          list: [
            {
              label: 'name',
              value: 'name',
              type: 'input'
            },
            {
              label: '邮编',
              value: 'postcode',
              type: 'input'
            },
            {
              label: 'FBA地址邮编',
              value: 'fbaAddressPostcode',
              type: 'input'
            }
          ]
        },
        table: {
          columns: [
            {
              value: 'fbaAddressPostcode',
              label: 'FBA地址邮编'
            },
            {
              multi: ['cneeFirstName', 'cneeLastName'],
              label: '收件人'
            },
            {
              multi: ['phone', 'email'],
              label: '联系方式'
            },
            {
              value: 'addressDetailFirst',
              label: '收货地址'
            },
            {
              value: 'postcode',
              label: '邮编'
            },
            {
              value: 'deliveryTypeName',
              label: '发货方式'
            }
          ]
        }
      },

      // 寄件人信息管理
      senderInfoEvents: {
        close() {
          // 关闭时的回调
        },

        handleOkClick() {
          // 确认事件
          return vm.$api['order/addConnection']({
            storeProductIds: vm.$refs.tableSel.selection.map(
              el => el.storeProductId
            )
          }).then(data => {
            vm.$message.success('添加成功')
            vm.selectProOpts.visible = false
            vm.productInfoTbList = data.rows
          })
        }
      },
      senderInfoOpts: {
        visible: false,
        title: '寄件地址管理',
        width: '70%',
        // okBtnText: '确认关联',
        appendToBody: true
      },

      // 寄件人信息管理 - 添加
      senderInfoEventsAdd: {
        handleOkClick() {
          // 确认事件
          return vm.$api['order/senderSave'](vm.senderInfoForm).then(() => {
            vm.$refs.tableSenderInfo.reset()
          })
        },
        handleEditOkClick() {
          // 编辑
          return vm.$api['order/senderUpdate'](vm.senderInfoForm).then(() => {
            // 重置搜索
            vm.$refs.tableSenderInfo.reset()
          })
        }
      },
      senderInfoOptsAdd: {
        visible: false,
        title: '新增地址',
        width: '60%',
        okBtnText: '保存',
        cancelBtnText: '取消',
        appendToBody: true
      },

      // 原因管理列表
      tableAddReasonOptions: {
        search: {
          list: [
            {
              label: '关键词',
              value: 'keyword',
              type: 'input'
            }
          ]
        },
        table: {
          columns: [
            {
              value: 'name',
              label: '名称'
            },
            {
              value: 'name',
              label: '添加人员'
            },
            {
              value: 'createTime',
              label: '添加时间'
            }
          ]
        }
      },

      // 原因管理
      reasonEvents: {
        handleOpen() {
          vm.$nextTick(() => {
            // vm.$refs.tableReason.reset()
          })
        }
      },
      reasonOpts: {
        visible: false,
        title: '原因管理',
        width: '70%',
        // okBtnText: '确认关联',
        appendToBody: true
      },

      // 原因管理 - 添加
      reasonEventsAdd: {
        handleOkClick() {
          // 确认事件
          return vm.$api['order/createReasonSave']({
            ...vm.reasonForm,
            orderType: +vm.orderType
          }).then(() => {
            vm.$refs.tableReason.reset()
            vm.initReasonList(vm.baseForm.orderType)
          })
        },
        handleEditOkClick() {
          // 编辑
          return vm.$api['order/createReasonUpdate']({
            ...vm.reasonForm,
            orderType: +vm.orderType
          }).then(() => {
            // 重置搜索
            // debugger
            vm.initReasonList(vm.baseForm.orderType)
            vm.$refs.tableReason.reset()
          })
        }
      },
      reasonOptsAdd: {
        visible: false,
        title: '新增原因',
        width: '60%',
        okBtnText: '保存',
        cancelBtnText: '取消',
        appendToBody: true
      },

      tableAddSendInfoOptions: {
        search: {
          list: [
            {
              label: '订单来源渠道',
              value: 'storeId',
              type: 'select',
              children: [],
              props: {
                label: 'name',
                value: 'storeId'
              }
            }
          ]
        },
        table: {
          columns: [
            {
              multi: [
                { label: '寄件人', value: 'contacter' },
                { label: '始发地', value: 'originAddress' },
                { label: '联系电话', value: 'phone' },
                {
                  label: '寄件区域',
                  value(scope) {
                    return `${scope.row.province} ${scope.row.city} ${
                      scope.row.area
                    }`
                  }
                },
                { label: '寄件地址', value: 'addressDetail' }
              ],
              label: '寄件信息'
            },
            {
              value: 'defaultFlag',
              label: '是否默认',
              formatter(scope) {
                return scope.row.defaultFlag === 1 ? '是' : '否'
              }
            }
          ]
        }
      },

      // 产品信息
      productInfoTbList: [],
      productInfoTbCol: [
        {
          value: 'customSku',
          label: 'SKU'
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
          multi: ['nameZh', 'nameEn'],
          label: '商品名称'
        },
        {
          value: 'storeSku',
          label: '店铺SKU'
        },
        {
          value: 'price',
          label: '商品单价',
          render(h, scope) {
            return (
              <span>
                {scope.row.price != null ? scope.row.price.toFixed(2) : '-'}
              </span>
            )
          }
        },
        {
          value: 'supplierName',
          label: '供应商'
        }
      ],

      // 收货人信息数据
      receiverForm: {},

      // 寄件人信息数据
      senderForm: {},

      // 支付方式数据
      payForm: {},

      // 基本信息表单数据
      baseForm: {
        orderType: 1,
        orderNumSystem: undefined
      },

      baseRules: {
        orderType: [{ required: true, message: '请选择订单类型' }],
        orderNumberPlatform: [{ required: true, message: '请输入订单号' }],
        buyerIdPlatform: [{ required: true, message: '请输入买家ID' }],
        storeId: [{ required: true, message: '请选择来源店铺' }],
        stockUpWarehouseId: [{ required: true, message: '请选择备货仓库' }],
        createOrderReason: [{ required: true, message: '请选择新增订单原因' }],
        scheduledDeliveryTime: [
          { required: true, message: '请选择计划发货时间' }
        ],
        regularWarehouseTime: [
          { required: true, message: '请选择计划入库时间' }
        ],
        takeWarehouseId: [{ required: true, message: '请选择到货仓库' }]
      },

      storeListProps: {
        value: 'storeId',
        label: 'name',
        children: 'stores'
      }
    }
  },
  watch: {
    'baseForm.scheduledDeliveryTime'(val) {
      console.log(val)
      this.showRegularWarehouseTime = false
      this.$nextTick(() => {
        this.showRegularWarehouseTime = true
      })
    },
    orderType: {
      immediate: true,
      handler(val) {
        this.productInfoTbList.splice(0)
        this.initReasonList(val || this.$route.query.orderType)
      }
    },
    'baseForm.orderType': {
      handler(val) {
        if (this.flag) {
          this.reset(true)
        }

        let lists = [
          [
            {
              value: 'customSku',
              label: 'SKU'
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
              multi: ['nameZh', 'nameEn'],
              label: '商品名称'
            },
            {
              value: 'storeSku',
              label: '店铺SKU'
            },
            {
              value: 'price',
              label: '商品单价',
              render(h, scope) {
                return (
                  <span>
                    {scope.row.price != null ? scope.row.price.toFixed(2) : '-'}
                  </span>
                )
              }
            },
            {
              value: 'supplierName',
              label: '供应商'
            }
          ],
          [
            {
              value: 'customSku',
              label: 'SKU'
            },
            {
              multi: ['nameZh', 'nameEn'],
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
            }
          ],
          [
            {
              value: 'customSku',
              label: 'SKU'
            },
            {
              multi: ['nameZh', 'nameEn'],
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
            }
          ]
        ]

        this.initReasonList(val)

        if (val === 1) {
          this.productInfoTbCol = lists[0]
          this.initStoreAllList()
        }
        if (val === 2) {
          this.productInfoTbCol = lists[2]
          this.initWhouse(1)
        }
        if (val === 3) {
          this.productInfoTbCol = lists[1]
          this.initWhouse(2)
        }
        if (val === 4) {
          this.productInfoTbCol = lists[2]
        }
        if (val === 5) {
          this.productInfoTbCol = lists[1]
        }
      }
    },

    // 初始化数据
    data: {
      deep: true,
      handler(val) {
        if (Object.keys(val).length) {
          this.flag = false
          this.disabled = true
          val = JSON.parse(JSON.stringify(val))
          let {
            essentialInfo,
            buyerInfo,
            products,
            senderInfo,
            orderPrice
          } = val
          let { discountCouponPrice } = orderPrice
          let {
            orderNumSystem,
            orderNumPlatform,
            orderType,
            overseaPurchaseFlag,
            // orderStatus,
            // generatePurchaseFlag,
            platformId,
            cneeAddressDetailSecond,
            orderRemark,
            storeId,
            orderId,
            scheduledDeliveryTime,
            regularWarehouseTime,
            takeWarehouseId,
            stockUpWarehouseId,
            createOrderReason
          } = essentialInfo
          let {
            cneeCountryId,
            cneeFirstName,
            cneeAddressDetailFirst,
            cneeLastName,
            postcode,
            cneeArea,
            cneeAddressDetailThird,
            cneeProvince,
            cneeMemberId,
            transportTypeName,
            cneeEmail,
            cneeCompanyName,
            transportType,
            cneePhone,
            cneeCity,
            region,
            cneeAddressDetailSecon
          } = buyerInfo

          // "senderContacts": "寄件联系人",
          //   "senderOriginating": "寄件始发地",
          //   "senderAddress": "寄件地址",
          //   "senderContactPhone": "寄件联系电话",
          //   "senderCompany": "寄件公司",
          //   "senderProvince": "省",
          //   "senderAddressId": 1,
          //   "senderCity": "市",
          //   "senderCountryId": 10,
          //   "senderArea": "区"

          // 订单基本信息
          this.baseForm = {
            orderId,
            stockUpWarehouseId,
            orderNumberPlatform: orderNumPlatform,
            // orderNumPlatform, // 平台订单号

            orderNumSystem,
            cneeMemberId,
            buyerIdPlatform: cneeMemberId,
            scheduledDeliveryTime,
            regularWarehouseTime,
            takeWarehouseId,
            orderType,
            createOrderReason,
            storeId: [platformId, storeId]
          }

          this.$nextTick(() => (this.flag = true))

          // 产品信息
          this.productInfoTbList = products.map(el => ({
            ...el,
            num: el.orderAmount,
            stock:
              el.deliveryWarehouseId != null
                ? el.deliveryWarehouseId + ''
                : undefined,
            storeProductId: el.storeProductId || el.productId,
            price: el.productPrice
          }))

          // 收货人信息
          this.receiverForm = {
            cneeCountryId,
            cneeFirstName,
            cneeAddressDetailFirst,
            cneeLastName,
            orderRemark,

            cneeArea,
            cneeAddressDetailThird,
            cneeProvince,
            transportTypeName,
            cneeEmail,
            cneeCompanyName,
            cneePostcode: postcode,
            transportTypeSystem: transportType,
            cneePhone,
            cneeCity,
            region,
            cneeAddressDetailSecond,
            overseaPurchaseFlag
          }

          // this.senderInfoForm = {
          //   senderAddress: cneeAddressDetailFirst,
          //   senderArea: cneeArea,
          //   senderCity: cneeCity,
          //   senderCompany: cneeCompanyName,
          //   senderContactPhone: cneePhone,
          //   senderContacts: null,
          //   senderCountryId: cneeCountryId,
          //   senderOriginating: null,
          //   senderPostcode: postcode,
          //   senderProvince: cneeProvince
          // }
          // 寄件人信息
          this.senderForm = this.orderType == 2 ? buyerInfo : senderInfo

          // 支付方式

          this.payForm = orderPrice
          this.payForm.paymentMoney = orderPrice.paymentMoney || 0
          this.payForm.discountPrice = discountCouponPrice
          // if (orderPrice.orderPrice != null) {
          //   this.payForm.paymentMoney = orderPrice.paymentMoney
          // }
        }
      }
    }
  },
  computed: {
    ...mapState('warehouse', [
      'localWhouse',
      'overseeWhouse',
      'deliveryModeList'
    ]),
    ...mapState('store', ['storeAllList']),
    ...mapState('common', [
      'reasonsForNewOrders',
      'currencyType',
      'warehouseList', // 所有仓库
      'paymentMethod',
      'transportTypeList',
      'countryList',
      'allShopList', //所有店铺
      'platformList'
    ]),

    // 选择的产品SKu
    productInfoTbListSku() {
      return this.productInfoTbList.map(el => el.storeProductId || el.productId)
    },

    // 验证表格数据
    productInfoTbListObj() {
      return {
        data: this.productInfoTbList
      }
    },
    loading() {
      return this.$store.state.isloading || this.$store.state.loading
    },
    senderFields() {
      let vm = this
      let senderPostCodeRequired = true
      if (this.orderType == 3) {
        senderPostCodeRequired = true
      } else {
        senderPostCodeRequired = false
      }
      if (this.orderType == 2) {
        return [
          {
            label: 'First Name',
            name: 'cneeFirstName',
            required: true,
            span: 12
          },
          {
            label: 'Last Name',
            name: 'cneeLastName',
            required: true,
            span: 12
          },
          {
            label: '联系电话',
            name: 'cneePhone',
            required: 'mobile',
            span: 24
          },
          {
            type: 'select',
            label: '收货国家',
            name: 'cneeCountryId',
            options: vm.countryList,
            required: true,
            span: 6
          },
          {
            label: '省',
            name: 'cneeProvince',
            labelWidth: '50px',
            required: true,
            span: 6
          },
          {
            label: '市',
            name: 'cneeCity',
            labelWidth: '50px',
            required: true,
            span: 6
          },
          {
            label: '区',
            name: 'cneeArea',
            labelWidth: '50px',
            required: true,
            span: 6
          },

          {
            label: '收货地址',
            name: 'cneeAddressDetailFirst',
            required: true,
            span: 24
          }
        ]
      }
      return [
        {
          label: '联系人',
          name: 'senderContacts',
          required: true,
          span: 12
        },
        {
          label: '联系电话',
          name: 'senderContactPhone',
          type: 'mobile',
          required: true,
          span: 12
        },
        {
          type: 'multi',
          label: '寄件人地址',
          opts: [
            {
              type: 'select',
              name: 'senderCountryId',
              label: '国家',
              required: true,
              options: vm.countryList
            },
            {
              name: 'senderProvince',
              label: '省',
              required: true
            },
            {
              name: 'senderCity',
              label: '市',
              required: true
            },
            {
              name: 'senderArea',
              label: '区',
              required: true
            }
          ]
        },
        {
          label: '寄件地址',
          name: 'senderAddress',
          required: true,
          span: 12
        },

        {
          label: '寄件单位',
          name: 'senderCompany',
          required: true,
          span: 12
        },
        {
          label: '寄件邮编',
          name: 'senderPostcode',
          required: senderPostCodeRequired,
          span: 12
        }
      ]
    },

    addressFields() {
      let vm = this
      return [
        { title: '收件人信息' },
        {
          label: 'First Name',
          name: 'cneeFirstName',
          required: true,
          span: 12
        },
        {
          label: 'Last Name',
          name: 'cneeLastName',
          required: true,
          span: 12
        },
        {
          label: '电子邮件',
          name: 'email',
          required: 'email',
          isNotRequired: true
        },
        {
          label: '联系电话',
          name: 'phone',
          required: 'mobile'
        },
        { title: '配送信息' },
        {
          label: 'FBA地址邮编',
          name: 'fbaAddressPostcode',
          required: true
        },
        {
          type: 'multi',
          label: '收货人地址',
          opts: [
            {
              type: 'select',
              name: 'countryId',
              label: '国家',
              required: true,
              options: vm.countryList
            },
            {
              name: 'province',
              label: '省',
              required: true
            },
            {
              name: 'city',
              label: '市',
              required: true
            },
            {
              name: 'area',
              label: '区',
              required: true
            }
          ]
        },
        {
          label: '地址1',
          name: 'addressDetailFirst',
          required: true
        },
        {
          label: '地址2',
          name: 'addressDetailSecond'
        },
        {
          label: '地址3',
          name: 'addressDetailThird'
        },
        {
          label: '邮编',
          name: 'postcode',
          required: 'post'
        },
        {
          type: 'multi',
          label: '发货',
          opts: [
            {
              type: 'select',
              name: 'deliveryWarehouseId',
              label: '发货仓库',
              required: true,
              bind: {
                label: 'warehouseName',
                value: 'warehouseId'
              },
              options: vm.warehouseList
            },
            {
              type: 'select',
              name: 'deliveryType',
              label: '发货方式',
              required: true,
              options: vm.deliveryModeList
            }
          ]
        }
      ]
    },

    senderInfoFields() {
      let vm = this
      return [
        {
          type: 'select',
          name: 'storeId',
          label: '订单来源店铺',
          required: true,
          bind: {
            label: 'name',
            value: 'storeId'
          },
          options: vm.allShopList
        },
        {
          label: '联系人',
          name: 'contacter',
          required: true
        },

        {
          label: '始发地',
          name: 'originAddress'
        },
        {
          label: '联系电话',
          name: 'phone',
          required: 'mobile'
        },
        {
          type: 'multi',
          label: '寄件区域',
          opts: [
            {
              type: 'select',
              name: 'countryId',
              label: '国家',
              required: true,
              options: vm.countryList
            },
            {
              name: 'province',
              label: '省',
              required: true
            },
            {
              name: 'city',
              label: '市',
              required: true
            },
            {
              name: 'area',
              label: '区',
              required: true
            }
          ]
        },
        {
          label: '寄件地址',
          name: 'addressDetail',
          required: true
        },
        {
          label: '寄件单位',
          name: 'senderCompany'
        },
        {
          label: '寄件邮编',
          name: 'senderPostcode',
          required: true
        }
      ]
    },

    reasonFields() {
      let vm = this
      return [
        {
          label: '新原因名',
          name: 'name',
          required: true
        }
      ]
    },

    receiverFields() {
      let vm = this
      return [
        {
          label: 'First Name',
          name: 'cneeFirstName',
          required: true,
          span: 12
        },
        {
          label: 'Last Name',
          name: 'cneeLastName',
          required: true,
          span: 12
        },
        {
          label: '电子邮件',
          name: 'cneeEmail',
          required: 'email',
          span: 12
        },
        {
          label: '联系电话',
          name: 'cneePhone',
          required: 'mobile',
          span: 12
        },
        {
          label: '公司名称',
          name: 'cneeCompanyName',
          // required: true,
          span: 12
        },
        {
          label: '邮编',
          name: 'cneePostcode',
          required: 'post',
          span: 12
        },
        {
          type: 'select',
          label: '运输方式',
          name: 'transportTypeSystem',
          required: true,
          options: vm.transportTypeList,
          span: 24
        },
        {
          type: 'select',
          label: '收货国家',
          name: 'cneeCountryId',
          options: vm.countryList,
          required: true,
          span: 6
        },
        {
          label: '省',
          name: 'cneeProvince',
          labelWidth: '50px',
          required: true,
          span: 6
        },
        {
          label: '市',
          name: 'cneeCity',
          labelWidth: '50px',
          required: true,
          span: 6
        },
        {
          label: '区',
          name: 'cneeArea',
          labelWidth: '50px',
          required: true,
          span: 6
        },
        {
          label: '地址1',
          name: 'cneeAddressDetailFirst',
          required: true,
          span: 8
        },
        {
          label: '地址2',
          labelWidth: '60px',
          name: 'cneeAddressDetailSecond',
          // required: true,
          span: 8
        },
        {
          label: '地址3',
          labelWidth: '60px',
          name: 'cneeAddressDetailThird',
          // required: true,
          span: 8
        }
      ]
    },
    payFields() {
      let vm = this
      return [
        {
          label: '货币类型',
          name: 'currencyType',
          required: true,
          span: 12,
          type: 'select',
          options: vm.currencyType
        },
        {
          label: '支付方式',
          name: 'payType',
          required: true,
          span: 12,
          type: 'select',
          options: vm.paymentMethod
        },
        {
          label: '支付金额',
          name: 'paymentMoney',
          type: 'currency',
          span: 12,
          required: true,
          noShow: true
        },
        {
          label: '产品总额',
          name: 'productPriceSum',
          type: 'currency',
          span: 12,
          required: true,
          noShow: true
        },
        {
          label: '支付运费',
          name: 'freight',
          type: 'currency',
          span: 12,
          required: true,
          noShow: true
        },
        {
          label: '优惠价格',
          type: 'currency',
          span: 12,
          name: 'discountPrice',
          noShow: true
        }
      ]
    }
  },
  methods: {
    ...mapActions('warehouse', ['initWhouse', 'initDeliveryModeList']),
    ...mapActions('store', ['initStoreAllList']),
    ...mapActions('common', [
      'initReasonList',
      'initCommonList',
      'initTransportTypeList',
      'initCountryList',
      'getWarehouseList',
      'getAllShopList'
    ]),

    getOrderNum() {
      this.$api[`order/getOrderSystemNumber`]({})
        .then(data => {
          this.$set(this.baseForm, 'orderNumSystem', data.orderNumSystem)
        })
        .catch(err => {})
    },

    openReasonDialog() {
      this.reasonOpts.visible = true
    },

    handleReasonDel(row) {
      this.$confirm('是否删除原因？', '警告', {
        type: 'danger'
      })
        .then(() => {
          this.$api['order/createReasonRemove']({
            orderCreateReasonIds: [row.orderCreateReasonId]
          }).then(() => {
            this.initReasonList(this.baseForm.orderType)
            this.$refs.tableReason.reset()
          })
        })
        .catch(() => {})
    },

    handleSinglePrice() {
      let list = this.productInfoTbList
      if (list.length === 0) {
        return
      }
      if (list.every(el => el.num !== undefined)) {
        this.getProductPriceSum(list)
      }
    },

    getProductPriceSum(list) {
      if (this.baseForm.orderId == null) {
        let all = list.reduce((pre, cur) => {
          return pre + cur.num * cur.price
        }, 0)
        if (isNaN(all)) {
          this.$message.error('商品数据异常，无法计算总金额')
          return
        }
        this.$set(this.payForm, 'productPriceSum', all)
        return
      }
      let products = list.map(el => ({
        quantity: el.num,
        productId: el.storeProductId
      }))
      let params = { products, orderId: this.baseForm.orderId }
      this.$api[`order/productGetOrderPrice`](params)
        .then(data => {
          this.$set(this.payForm, 'productPriceSum', data.totelAmount)
        })
        .catch(err => {})
    },

    handleChange(file) {
      //
      this.fileList = [file]
    },

    handleBeforeUpload() {
      this.$refs.baseform.validateField('storeId', error => {
        if (!error) {
          return true
        } else {
          return false
        }
      })
    },

    handleRequest({ file }) {
      this.importTemp(file)
    },

    handleClickoutsidePopover() {
      this.popoverVisible = false
    },

    handleOpenPopover() {
      if (this.popoverVisible) {
        this.popoverVisible = false
      } else {
        try {
          this.$refs.baseform.validateField('storeId')
        } catch (error) {}

        if (this.baseForm.storeId != null) {
          this.popoverVisible = true
        } else {
          this.popoverVisible = false
        }
        if (this.baseForm.orderType === 2 || this.baseForm.orderType === 3) {
          this.popoverVisible = true
        }
      }
    },

    // 下载产品导入模板
    downloadTemp() {
      this.$api[`order/productDownloadTemplate`]()
        .then(data => {
          downloadFile(data.path)
        })
        .catch(() => {})
    },

    // 导入关联产品
    importTemp(file) {
      let data = {
        // storeId: this.baseForm.storeId.slice(0).pop(),
        file
      }
      if (this.baseForm.storeId != null) {
        data.storeId = this.baseForm.storeId.slice(0).pop()
      }
      // debugger
      this.$api[`order/productImportConnection`](data)
        .then(data => {
          this.fileList.splice(0)
          this.addProList(data.rows)
          this.handleSinglePrice()
        })
        .catch(() => {})
    },

    // clearFormData() {
    //   this.reset()
    // },

    /**
     * 重置表单
     * @param {Boolean} notToOne 是否不重置订单类型，如果是否，则不重置到客户订单
     */
    reset(notToOne) {
      this.tableSelRefresh = false
      this.$nextTick(() => {
        this.tableSelRefresh = true
      })
      // 重置滚动条
      let box = this.$refs.box
      box.parentNode.scrollTop = 0

      // 重置数据
      let { baseform, receiverForm, senderForm, payForm } = this.$refs
      let orderType = this.baseForm.orderType
      if (this.orderType != 3) {
        this.baseForm = {
          orderType: this.orderType
            ? +this.orderType
            : notToOne
            ? this.baseForm.orderType
            : 1,
          saveAddressFlag: 0
        }
        // if (this.orderType === '2' && !notToOne) {
        //   // 如果是本地备库订单，生成订单号
        //   setTimeout(() => {
        //     this.getOrderNum()
        //   })
        // }
      } else {
        this.baseForm = {
          orderType: orderType < 3 ? 3 : orderType,
          saveAddressFlag: 0
        }
      }

      this.receiverForm = {
        generatePurchaseFlag: 0,
        rebateTaxFlag: 0,
        endFlag: 0,
        generatePurchaseFlag: 0,
        rebateTaxFlag: 0,
        overseaPurchaseFlag: 0
      }
      this.senderForm = {}
      this.payForm = {}
      this.productInfoTbList = []
      let form = [baseform, receiverForm, senderForm, payForm]
      form.forEach(el => {
        if (el && el.clearValidate) {
          el.clearValidate()
        }
        if (el && el.clearFormData) {
          el.clearFormData()
        }
      })

      this.disabled = false
    },

    // 弹窗表单验证
    validForm() {
      let {
        baseform,
        receiverForm,
        senderForm,
        payForm,
        productInfoTbList
      } = this.$refs
      let forms = [
        baseform,
        receiverForm,
        senderForm,
        payForm,
        productInfoTbList
      ].filter(el => el != null)

      let promises = forms.map(el => {
        return el.validate()
      })
      return Promise.all(promises)
    },

    resetForm() {
      return this.reset()
    },

    submitForm() {
      return this.validForm()
    },
    importPro() {},
    // 添加产品按钮
    addPro() {
      let { fields } = this.$refs.baseform
      if (fields.some(el => el.prop === 'storeId')) {
        this.$refs.baseform.validateField('storeId', error => {
          if (!error) {
            this.openAddPro()
          } else {
            this.$message.warning('请选择来源店铺')
          }
        })
      } else {
        this.openAddPro()
      }
    },

    // 打开添加产品的弹窗
    openAddPro(clearTable = false) {
      this.selectProOpts.visible = true
      if (this.localWhouse.length) {
        this.tableSelOptions.search.list.splice(2, 1, {
          label: '发货仓库',
          value: 'warehouseId',
          type: 'select',
          style: {
            width: '110px'
          },
          children: this.localWhouse
        })
        return
      }
      this.initWhouse(this.baseForm.orderType).then(data => {
        this.tableSelOptions.search.list.splice(2, 1, {
          label: '发货仓库',
          value: 'warehouseId',
          type: 'select',
          style: {
            width: '110px'
          },
          children: data
        })
      })
    },

    addProList(data) {
      let ret = []
      data.forEach(el => {
        let _old = this.productInfoTbList.find(
          _el => _el.productSku === el.productSku
        )
        if (_old) {
          ret.push({
            ..._old,
            num: _old.num
              ? _old.num
              : el.quantity == null
              ? undefined
              : Number(el.quantity)
          })
        } else {
          ret.push({
            ...el,
            num: el.quantity == null ? undefined : Number(el.quantity)
          })
        }
      })
      this.productInfoTbList = ret
    },

    // 打开备货地址弹窗
    openStockAdds() {
      if (
        this.orderType === '1' &&
        (!this.baseForm.storeId || !this.baseForm.storeId.length)
      ) {
        this.$message.warning('请先选择来源店铺')
        this.$refs.baseform.validateField('storeId')
        return
      }
      this.getWarehouseList()
      this.initDeliveryModeList()
      if (this.orderType != '3') {
        this.initial = {
          storeId: this.baseForm.storeId[1]
        }
      }

      this.stockAddsProOpts.visible = true
      this.initWhouse(1)
    },
    // 打开寄件人信息
    openSenderInfo() {
      if (this.orderType == 2) {
        // orderType 2 打开 备货地址
        if (this.baseForm.stockUpWarehouseId == null) {
          this.$message.warning('请先选择备货仓库')
          this.$refs.baseform.validateField('stockUpWarehouseId')
          return
        }
        this.getWarehouseList()
        this.initDeliveryModeList()
        this.initial = {
          deliveryWarehouseId: this.baseForm.stockUpWarehouseId
        }
        this.stockAddsProOpts.visible = true
        this.initWhouse(1)
      } else {
        // orderType 1 打开 寄件地址
        this.getAllShopList().then(() => {
          this.tableAddSendInfoOptions.search.list[0].children = this.allShopList
        })
        this.senderInfoOpts.visible = true
      }

      // this.getAllShopList().then(() => {
      //   this.tableAddSendInfoOptions.search.list[0].children = this.allShopList
      // })
      // this.senderListInitial.deliveryWarehouseId = this.baseForm.stockUpWarehouseId
      // this.senderInfoOpts.visible = true
    },
    // 删除地址(备货)
    handleStockAddsDel(row) {
      this.$confirm('是否删除地址？', '警告', {
        type: 'danger'
      })
        .then(() => {
          this.$api['order/stockAddressRemove']({
            stockUpAddressIds: [row.stockUpAddressId]
          }).then(() => {
            this.$refs.tableStockAdds.reset()
          })
        })
        .catch(() => {})
    },
    //选择地址（备货）
    handleStockAddsSelect(row) {
      this.stockAddsProOpts.visible = false
      this.receiverForm = JSON.parse(JSON.stringify(row))

      let {
        cneeFirstName,
        cneeLastName,
        email: cneeEmail,
        phone: cneePhone,
        countryId: cneeCountryId,
        stockUpAddressId: cneeAddressId,
        province: cneeProvince,
        city: cneeCity,
        area: cneeArea,
        deliveryType: transportTypeSystem,
        addressDetailFirst: cneeAddressDetailFirst,
        addressDetailSecond: cneeAddressDetailSecond,
        addressDetailThird: cneeAddressDetailThird,
        postcode: cneePostcode
      } = row
      if (this.orderType == 1 || this.orderType == 3) {
        this.receiverForm = {
          // ...this.receiverForm,
          cneeFirstName,
          cneeAddressId,
          cneeLastName,
          cneeEmail,
          cneePostcode,
          cneePhone,
          transportTypeSystem,
          cneeCountryId,
          cneeProvince,
          cneeCity,
          cneeArea,
          cneeAddressDetailFirst,
          cneeAddressDetailSecond,
          cneeAddressDetailThird
        }
      }
      if (this.orderType == 2) {
        this.senderForm = {
          cneeFirstName,
          cneeAddressId,
          cneeLastName,
          cneePhone,
          cneeCountryId,
          cneeProvince,
          cneeCity,
          cneeArea,
          cneeAddressDetailFirst
        }
      }

      //
    },

    // 删除地址(寄件人)
    handleSenderInfoDel(row) {
      this.$confirm('是否删除地址？', '警告', {
        type: 'danger'
      })
        .then(() => {
          this.$api['order/senderRemove']({
            senderIds: [row.senderId]
          }).then(() => {
            this.$refs.tableSenderInfo.reset()
          })
        })
        .catch(() => {})
    },
    //选择地址(寄件人)
    handleSenderInfoSelect(row) {
      this.senderInfoOpts.visible = false

      let {
        contacter: senderContacts,
        phone: senderContactPhone,
        senderId: senderAddressId,
        countryId: senderCountryId,
        province: senderProvince,
        city: senderCity,
        area: senderArea,
        originAddress: senderOriginating,
        senderCompany: senderCompany,
        addressDetail: senderAddress,
        senderPostcode
      } = row
      this.senderForm = {
        // ...this.senderForm,
        senderContacts,
        senderContactPhone,
        senderAddressId,
        senderCountryId,
        senderProvince,
        senderCity,
        senderArea,
        senderOriginating,
        senderCompany,
        senderPostcode,
        senderAddress
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.box_form {
  border: 1px solid $boxBorderColor;
  padding: 16px 16px 0;
  margin-bottom: 20px;
  background: $boxBgColor;
}
.title {
  font-size: 14px;
  margin: 3px 0 16px;
  font-weight: bold;
  color: #333;
}
.upload {
  margin-left: 10px;
  display: inline-block;
  // width: 260px;
  // display: flex;
}
.flex {
  @include flex-wrapper(space-between);
  .title1 {
    font-weight: bold;
    color: #333;
  }
  .btn {
    margin-right: 12px;
  }
}
</style>
<style lang="scss">
.upload {
  .el-upload-list--text {
    display: none;
    position: absolute;
    background: #fff;
    border-radius: 5px;
    top: 54px;
    box-shadow: 0 0 10px #ddd;
    .el-upload-list__item {
      margin: 10px 0;
      position: relative;
      z-index: 1;
      &:after {
        content: '';
        display: block;
        width: 20px;
        height: 20px;
        background: #fff;
        position: absolute;
        top: -12px;
        left: 10%;
        transform: rotate(45deg);
        z-index: -1;
      }
    }
  }
}
</style>
