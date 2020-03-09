<template>
  <div class="print" v-loading="loading" :element-loading-text="loadingText">
    <div class="printBtnBox noprint" v-if="$route.query.title!=='打印合同'">
      <template v-if="needCodePage.indexOf($route.query.title)>-1">
        <el-button type="primary" @click="print('a4')">打印A4</el-button>
        <el-button type="primary" @click="print('bar')">打印条码</el-button>
      </template>
      <template v-else>
        <el-button type="primary" @click="print('table')">确认打印</el-button>
      </template>
    </div>
    <template v-if="needCodePage.indexOf($route.query.title)>-1">
      <!-- 条形码打印区 -->
      <div id="print-div" :class="[type, prefixClass]">
        <div class="code" v-for="code in printCodes" :key="code.id">
          <section v-if="type === 'bar'">
            <VueBarcode
              ref="bar"
              :value="$route.query.title==='打印采购清单产品条码' ? code.purchaseProductBarCode :  code.code ||code.productBarCode"
              :options="{ displayValue: false }"
              tag="svg"
            />
            <div class="sku">{{code.productSku}}</div>
            <div class="skuCustom">{{code.customSku}}</div>
            <div class="made">Made In China</div>
          </section>
          <div v-if="type === 'a4'">
            <VueBarcode
              ref="bar"
              :value="$route.query.title==='打印采购清单产品条码' ? code.purchaseProductBarCode : code.code ||code.productBarCode"
              :options="{ displayValue: false }"
              tag="svg"
            />
            <div class="sku">{{code.productSku}}</div>
            <div class="skuCustom">{{code.customSku}}</div>
            <div class="made">Made In China</div>
          </div>
        </div>
      </div>
      <!-- 条形码控制区 -->
      <div class="noprint">
        <yt-table
          :selection="false"
          :data="$route.query.title==='打印产品条码' ? warehouseList || data :data"
          :columns="productInfoTbCol"
          :border="true"
        >
          <template slot="left">
            <el-table-column type="index" :index="indexMethod" align="center"></el-table-column>
          </template>
        </yt-table>
      </div>
    </template>

    <!-- table表格打印区 -->
    <div v-if="$route.query.title==='打印入库单'">
      <div class="page-break-after" v-for="(item, index) in data" :key="index">
        <h2>采购入库单</h2>
        <table :class="tableClass">
          <tr>
            <td colspan="5">供应商:{{item.supplierName}}</td>
            <td colspan="4" align="right">
              <div style="text-align:right">入库仓库:{{item.warehouse}}</div>
            </td>
          </tr>
          <tr>
            <td colspan="5">采购人员:{{item.purchasersName}}</td>
            <td colspan="4" align="right">
              <div style="text-align:right">日期:{{item.currentDate}}</div>
            </td>
          </tr>

          <tr>
            <td style="word-break: break-all;" width="40">No</td>
            <td style="word-break: break-all;">采购单号</td>
            <td style="word-break: break-all;">入库单号</td>
            <td style="word-break: break-all;">产品SKU/自定义SKU</td>
            <td style="word-break: break-all;" width="100">产品名称/规格</td>
            <td style="word-break: break-all;">数量</td>
            <td style="word-break: break-all;">单价</td>
            <td style="word-break: break-all;">金额</td>
            <td style="word-break: break-all;">备注</td>
          </tr>
          <tr v-for="(col, i) in item.products" :key="i">
            <td style="word-break: break-all;" width="40">{{col.ranking}}</td>
            <td style="word-break: break-all;">{{col.purchaseNumber}}</td>
            <td style="word-break: break-all;">{{col.warehouseNumber}}</td>
            <td style="word-break: break-all;">
              {{col.productSku}}
              <br>
              {{col.customSku}}
            </td>
            <td style="word-break: break-all;" width="100">
              {{col.productName}}
              <br>
              <span
                v-for="(spec, spindex) in col.variantPropertys"
                :key="spindex"
              >{{spec.propertyName}}:{{spec.propertyValue}}；</span>
            </td>
            <td style="word-break: break-all;">{{col.quantity}}</td>
            <td style="word-break: break-all;">{{col.price}}</td>
            <td style="word-break: break-all;">{{col.quantity*col.price}}</td>
            <td style="word-break: break-all;">{{col.remark}}</td>
          </tr>
          <!-- <tr>
            <td colspan="3" align="left">仓库签字:{{item.supplierName}}</td>
            <td colspan="3" align="left">
              <div style="text-align:left">仓库主管签字:{{item.warehouse}}</div>
            </td>
            <td colspan="3" align="left">
              <div style="text-align:left">合计入库数量:{{item.warehouse}}</div>
            </td>
          </tr>-->
        </table>
        <div class="print-nodisplay">
          <el-row type="flex">
            <el-col :span="8">仓库签字:</el-col>
            <el-col :span="8">仓库主管签字:</el-col>
            <el-col :span="8">合计入库数量:</el-col>
          </el-row>
          <br>
          <el-row type="flex">
            <el-col :span="8">采购员签字:</el-col>
            <el-col :span="8">财务签字:</el-col>
            <el-col :span="8">合计入库金额:</el-col>
          </el-row>
        </div>
      </div>
    </div>
    <div v-if="$route.query.title==='打印采购清单'">
      <!-- <h2>采购单信息</h2> -->
      <table :class="tableClass" v-for="(item, index) in data" :key="index">
        <tbody>
          <tr>
            <td colspan="9" valign="top" style="word-break: break-all;">
              {{item.purchaseTime}} &nbsp;&nbsp;
              采购单号：{{item.purchaseNumber}} &nbsp;&nbsp;
              {{item.purchasersName}} &nbsp;&nbsp;
              <!-- {{`发货情况`}} &nbsp;&nbsp; -->
              实际总金额：{{item.actualPrice}} &nbsp;&nbsp;
              运费：{{item.freightAmount}}
            </td>
          </tr>
          <tr>
            <th style="word-break: break-all;" width="40">No</th>
            <th style="word-break: break-all;">图片</th>
            <th style="word-break: break-all;">
              系统SKU
              <br>自定义SKU
            </th>
            <th style="word-break: break-all;">库位</th>
            <th style="word-break: break-all;" width="100">
              产品中文名
              <br>供应商SKU
            </th>
            <th style="word-break: break-all;">系统采购价</th>
            <th style="word-break: break-all;">
              需求数量
              <br>实际采购
            </th>
            <th style="word-break: break-all;">实际总金额</th>
            <th style="word-break: break-all;">备注</th>
          </tr>
          <tr v-for="(col, i) in item.products" :key="i">
            <td>{{col.ranking}}</td>
            <td>
              <img :src="col.productImg" width="60">
            </td>
            <td>
              <div>{{col.productSku}}</div>
              <div>{{col.customSku}}</div>
              <div>
                <VueBarcode :value="col.productSku" :options="{ displayValue: false }" tag="svg" class="svg"/>
              </div>
            </td>
            <td>{{col.productStock}}</td>
            <td>{{col.productName}}</td>
            <td>{{col.systemPrice}}</td>
            <td>
              <div>需求：{{col.requirement}}</div>
              <div>实际：{{col.lowerSingleQuantity}}</div>
            </td>
            <td>{{col.totalProductPrice}}</td>
            <td>{{col.purchaseRemark}}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="$route.query.title==='打印采购单'">
      <!-- <h2>采购单信息</h2> -->
      <table :class="tableClass" v-for="(item, index) in data" :key="index" class="line1">
        <tbody>
          <tr>
            <td valign="top" style="word-break: break-all;" width="130">
              <p>
                质检：________
                <br>入库：________
                <br>财务：________
              </p>
            </td>
            <td valign="top" style="word-break: break-all;font-weight:bold" width="130">
              <p class="bolder">
                采购单日期：
                <br>
                <span class="bolder" style="font-size:16px">{{item.purchaseTime.split(' ')[0]}}</span>
                <br>
                <span class="bolder">{{item.purchasersName}}</span>
                <br>
                采购点：{{item.warehouseName}}
              </p>
            </td>
            <td valign="top" style="word-break: break-all;" width="130">
              <p>
                供应商：{{item.supplierName}}
                <br>
                联系人：{{item.contact}}
                <br>
                电话：{{item.contactPhone}}
                <br>
                地址：{{item.supplierAddress}}
              </p>
            </td>
            <td colspan="3" valign="top" style="word-break: break-all;">
              <div style="text-align:right">
                <VueBarcode
                  ref="svg"
                  class="w100-svg"
                  :value="item.purchaseNumber"
                  :options="{ displayValue: false }"
                  tag="svg"
                />
              </div>
            </td>
          </tr>
          <tr>
            <td colspan="6">
              <el-row :gutter="12" class="purchaseList-wrapper">
                <el-col :span="12" class="box" v-for="i in item.products" :key="i.id">
                  <div class="product">{{i.productBarCode}}-{{i.productName}}</div>
                  <img v-lazy="i.productImg" width="120">
                  <div class="footer">
                    <span class="index">{{i.ranking}}</span>
                    - {{i.customSku}} 总:
                    <span class="success">{{i.totalProductPrice}}</span>
                    下单:
                    <span class="success">{{i.systemPrice}}</span>
                    需购:
                    <span class="danger">{{i.requirement}}</span>
                    <!-- <span style="color:blue">欠货4天</span> -->
                    <span>库位: {{i.productStock}}</span>
                  </div>
                </el-col>
              </el-row>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="$route.query.title==='打印成品加工单'">
      <!-- <h2>采购单信息</h2> -->
      <table :class="tableClass" v-for="(item, index) in data" :key="index">
        <tbody>
          <tr>
            <td colspan="9" valign="top" style="word-break: break-all;">
              <b>成品加工单：</b>
              {{item.machiningTime}} &nbsp;&nbsp;
            </td>
          </tr>
          <tr>
            <th style="word-break: break-all;" width="40">成品采购单号</th>
            <th style="word-break: break-all;">成品SKU</th>
            <th style="word-break: break-all;">成品数量</th>
            <th style="word-break: break-all;">原料SKU</th>
            <th style="word-break: break-all;" width="100">原料名称</th>
            <th style="word-break: break-all;">原料数量</th>
            <th style="word-break: break-all;">原料库位</th>
          </tr>

          <template v-if="item.materials.length">
            <tr v-for="(mate, i) in item.materials" :key="i">
              <td v-if="i === 0" :rowspan="item.materials.length">{{item.purchaseNumber}}</td>
              <td v-if="i === 0" :rowspan="item.materials.length">
                <div>{{item.productSku}}</div>
              </td>
              <td v-if="i === 0" :rowspan="item.materials.length">{{item.productQuantity}}</td>
              <td>{{mate.materialSku}}</td>
              <td>{{mate.materialName}}</td>
              <td>{{mate.materialQuantity}}</td>
              <td>{{mate.materialStock}}</td>
            </tr>
          </template>
          <template v-else>
            <tr>
              <td>{{item.purchaseNumber}}</td>
              <td>
                <div>{{item.productSku}}</div>
              </td>
              <td>{{item.productQuantity}}</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
              <td>-</td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div v-if="$route.query.title==='打印进货单'">
      <div v-for="(item, index) in data" :key="index" :class="{'page-break-after': data.length !== 1 || index !== 1}">
        <h4>地址：{{item.supplierAddress}}</h4>
        <h4>电话：{{item.supplierPhone}}</h4>
        <h2>进货单</h2>
        <table :class="tableClass">
          <tbody>
            <tr>
              <td colspan="3">销单日期:{{item.pinOrderTime}}</td>
              <td colspan="2" align="right">
                <div style="text-align:right">销单号:{{item.pinNumber}}</div>
              </td>
            </tr>
            <tr>
              <td colspan="3">供应商名称:{{item.supplierName}}</td>
              <td colspan="2" align="right">
                <div style="text-align:right">采购单号:{{item.puchaseNumber}}</div>
              </td>
            </tr>
            <tr>
              <th style="word-break: break-all;" width="40">序号</th>
              <th style="word-break: break-all;">商品名称</th>
              <th style="word-break: break-all;">单位</th>
              <th style="word-break: break-all;">数量</th>
              <th style="word-break: break-all;">备注</th>
            </tr>
            <tr v-for="(col, i) in item.products" :key="i">
              <td>{{col.ranking}}</td>
              <td>{{col.productName}}</td>
              <td>{{col.company}}</td>
              <td>{{col.quantity}}</td>
              <td>{{col.remark}}</td>
            </tr>

            <tr>
              <td colspan="3">制单人:{{item.making}}</td>
              <td colspan="2" align="right">
                <div style="text-align:right">合计数量:{{item.totalQuantity}}</div>
              </td>
            </tr>
            <tr>
              <td colspan="2" align="left">仓库收货人:_________</td>
              <td colspan="1" align="left">
                <div style="text-align:left">复核人:_________</div>
              </td>
              <td colspan="2" align="left">
                <div style="text-align:left">供应商送货人:_________</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="$route.query.title==='打印发票'">
      <table :class="tableClass" class="invoice" v-for="(item, index) in data" :key="index">
        <tbody>
          <tr>
            <td colspan="4">
              <h2>Commercial Invoice</h2>
            </td>
          </tr>
          <tr>
            <td colspan="4">
              <el-row>
                <p>
                  <span class="title">Shipper/Exportation:</span>
                  <br>
                  {{item.cneeCompanyName || '-'}}
                </p>
                <!-- 收货人信息 -->
                <p>
                  <span class="title">Consignee:</span>
                  <br>
                  <!-- 名字 -->
                  {{item.cneeFirstName}} {{item.cneeLastName}}
                  <br>
                  <!-- 地址 -->
                  {{item.cneeAddressDetailFirst}}
                  <br>
                  <!-- 国家， 邮编 -->
                  {{item.to}},{{item.cneePostcode}}
                  <br>
                </p>
                <p>
                  <span class="title">TEL:</span>
                  {{item.tel}}
                  <br>
                  <span class="title">Invoice NO:</span>
                  {{item.invoiceNo}}
                  <br>
                  <span class="title">From:</span>
                  {{item.from}}
                  <br>
                  <span class="title">To:</span>
                  {{item.to}}
                  <br>
                  <span class="title">Date:</span>
                  {{item.date}}
                </p>
              </el-row>
            </td>
          </tr>

          <tr>
            <td>Product Name</td>
            <td>Qty</td>
            <td>Price({{item.currencyTypeName}}/pcs)</td>
            <td>Shipping</td>
          </tr>
          <tr v-for="(col, i) in item.products" :key="i">
            <td>{{col.nameEn}}</td>
            <td>{{col.qty}}</td>
            <td>{{col.price != null ? col.price.toFixed(2) : '-'}}</td>
            <td>{{col.shipping != null ? col.shipping.toFixed(2) : '-'}}</td>
          </tr>
          <tr>
            <td colspan="2">
              <span class="title">Shipping</span>
            </td>

            <td colspan="2">{{item.currencyTypeName}} {{getTotalShipping(item.products).toFixed(2)}}</td>
          </tr>
          <tr>
            <td colspan="2">
              <span class="title">Total amount</span>
            </td>
            <td colspan="2">{{item.currencyTypeName}} {{item.totalAmount.toFixed(2)}}</td>
          </tr>
          <tr>
            <td colspan="4">
              <span
                class="title"
              >The total declare value is {{getTotal(item).toFixed(2)}} {{item.currencyTypeName}} ONLY</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-if="$route.query.title==='打印合同'">
      <div class="noprint" style="text-align:right">
        <el-button type="text" icon="el-icon-printer" @click="printPage">打印合同</el-button>
        <!-- <el-button type="text" icon="el-icon-download">下载合同</el-button> -->
      </div>

      <table class="compact" :class="tableClass" v-if="data.firstParty">
        <tbody>
          <tr>
            <td colspan="3">
              <h2 style="margin-top:20px">采购合同</h2>
            </td>
          </tr>
          <tr>
            <td colspan="3">合同编号: {{data.contractNumber}}</td>
          </tr>
          <tr>
            <td>甲方: {{data.firstParty.supplierName}}</td>
            <td>电话: {{data.firstParty.contactPhone}}</td>
            <td>QQ: {{data.firstParty.contactQq}}</td>
          </tr>
          <tr>
            <td colspan="3">地址: {{data.firstParty.supplierAddress}}</td>
          </tr>
          <tr>
            <td>乙方: {{data.partyB.name}}</td>
            <td>电话: {{data.partyB.contactPhone}}</td>
            <td>QQ: {{data.partyB.contactQq}}</td>
          </tr>
          <tr>
            <td colspan="3">地址: {{data.partyB.address}}</td>
          </tr>
          <tr>
            <td colspan="3">
              <p>甲、乙双方本着平等、自愿、协商一至的原则，经过充分协商，根据下列条款订立合同：</p>
              <p class="bolder">(一) 、 采购明细及交货方式如下： 下单号({{data.lowerSingleNumber}})</p>
              <table class="showBorder">
                <tr>
                  <td>产品编号</td>
                  <td>报送英文名(中文名)</td>
                  <td>名称</td>
                  <td>图片</td>
                  <td>自定义SKU</td>
                  <td>数量(PCS)</td>
                  <td>单价(RMB)</td>
                  <td>金额(RMB)</td>
                </tr>
                <tr v-for="item in data.products" :key="item.id">
                  <!--  { "customSku": "bra-0093-B+C-M", "quantity": 4, "productId": "8912", "totalPrice": 12, "nameZh": "sbsdb", "price": 3, "productImg": "https://yutoo-admin-erp.oss-cn-shenzhen.aliyuncs.com/upload/1/product/img/20190117/1547688821404/1547688819868.jpg", "nameEn": "dddd" } -->
                  <td>{{item.productId}}</td>
                  <td>{{item.nameEn}}({{item.nameZh}})</td>
                  <td>{{item.nameZh}}</td>
                  <td>
                    <img :src="item.productImg" width="50">
                  </td>
                  <td>{{item.customSku}}</td>
                  <td>{{item.quantity}}</td>
                  <td>{{item.price.toFixed(2)}}</td>
                  <td>{{item.totalPrice.toFixed(2)}}</td>
                </tr>
                <tr>
                  <td rowspan="2" colspan="6">备注：</td>
                  <td>运费</td>
                  <td>{{data.freightAmount.toFixed(2)}}</td>
                </tr>
                <tr>
                  <td>合计</td>
                  <td>{{compactTotalPrice.toFixed(2)}}</td>
                </tr>
              </table>
              <p>合计金额(RMB)： {{compactTotalPrice | numToBig}}</p>
              <p>交货日期： {{data.time}}</p>
              <p>交货地点： {{1}}</p>
              <p>价格条款： {{1}}</p>
              <p>付款方式： {{data.paymentMethodName}}</p>
              <p class="bolder">(二) 、 合同条款：</p>
              <p>
                <br>
              </p>
              <p>
                <br>
              </p>
              <p>
                <br>
              </p>

              <el-row>
                <el-col :span="6" style="text-align:right">
                  <p>甲方签名(盖公章)：</p>
                  <p>日期：</p>
                </el-col>
                <el-col :offset="6" :span="6" style="text-align:right">
                  <p>乙方签名(盖公章)：</p>
                  <p>日期：</p>
                </el-col>
              </el-row>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
/* eslint-disable */
import VueBarcode from '@chenfengyuan/vue-barcode'
import _chunk from 'lodash/chunk'
import { smalltoBIG } from 'Utils/tools'
import storage from 'Utils/saver'

export default {
  comments: true,
  components: {
    VueBarcode
  },
  data() {
    let vm = this
    return {
      warehouseList: [],
      codeCreatePercent: 0,
      creatCode: false,
      type: 'bar',
      prefixClass: '',
      tableClass: 'gridtable',
      data: [],
      needCodePage: ['打印采购清单产品条码', '打印产品条码'],
      justTablePage: ['打印入库单', '打印采购清单'],
      printCodes: [],
      loading: false,
      productInfoTbCol: [
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
          value: 'productSku',
          label: '系统SKU'
        },
        {
          value: 'customSku',
          label: '自定义SKU'
        },
        {
          value: 'productName',
          label: '产品中文名'
        },
        {
          multi: ['requirement', 'productStock'],
          label: '需求数量/实际采购数量'
        },
        {
          label: '打印数量',
          render(h, scope) {
            return (
              <el-input-number
                size="small"
                controls={false}
                value={scope.row.num}
                onInput={e => {
                  vm.$set(scope.row, 'num', +e)
                  // scope.row.num = +e
                }}
              />
            )
          }
        }
      ]
    }
  },

  created() {
    this.warehouseList = storage.get('local', 'printProductData')
    this.getData()
    this.bindPrintListener()
  },

  filters: {
    numToBig(val) {
      return smalltoBIG(val)
    }
  },
  methods: {
    printPage() {
      window.print()
    },
    beforePrint() {
      console.log('Functionality to run before printing.')
    },
    afterPrint() {
      this.tableClass = 'gridtable'
      console.log('Functionality to run after printing')
    },
    bindPrintListener() {
      let vm = this
      if (window.matchMedia) {
        var mediaQueryList = window.matchMedia('print')
        mediaQueryList.addListener(function(mql) {
          if (mql.matches) {
            vm.beforePrint()
          } else {
            vm.afterPrint()
          }
        })
      }

      window.onbeforeprint = this.beforePrint
      window.onafterprint = this.afterPrint
    },
    getData() {
      let api, params
      let {
        title,
        purchaseIds,
        purchaseOrderPinIds,
        productIds,
        warehouseId
      } = this.$route.query
      if (purchaseIds) {
        purchaseIds = purchaseIds.split(',')
      }

      if (purchaseOrderPinIds) {
        purchaseOrderPinIds = purchaseOrderPinIds.split(',')
      }

      switch (title) {
        case '打印采购清单产品条码':
          api = 'procurement/printPurchaseProd'
          params = { purchaseIds }
          break
        case '打印产品条码':
          let list = []
          if (purchaseIds) {
            api = 'procurement/printSingleProd'
            params = { purchaseIds }
          } else {
            // 仓储打印
            let list = [],
              arr
            if (!productIds) {
              if (list) {
                list = this.warehouseList.map(el => ({
                  wmWarehouseId: el.warehouseId,
                  productId: el.productId,
                  count: 1,
                  num: 1
                }))
              }
            } else {
              productIds.split('-').forEach(productId => {
                list.push({
                  wmWarehouseId: +warehouseId,
                  productId: +productId,
                  count: 1,
                  num: 1
                })
              })
            }
            // this.data = list

            api = 'warehouse/wmInventoryProductCodeList'
            params = { list }
          }

          break
        case '打印采购清单':
          api = 'procurement/printPurchase'
          params = { purchaseIds }
          break
        case '打印采购单':
          api = 'procurement/printPurchase'
          params = { purchaseIds }
          break
        case '打印入库单':
          api = 'procurement/printStorage'
          params = { purchaseIds }
          break
        case '打印进货单':
          api = 'procurement/pinOrderPrintPurchase'
          params = { purchaseOrderPinIds }
          break
        case '打印成品加工单':
          api = 'procurement/finishedPrintFinidhed'
          params = { purchaseFinishedWorksheetIds: purchaseIds, type: 1 }
          break
        case '打印发票':
          api = 'order/getPrintData'
          params = { orderId: purchaseIds[0] }
          break
        case '打印合同':
          api = 'procurement/purchasePrintContract'
          params = { purchaseOrderManageId: +purchaseIds[0] }
          break

        default:
          break
      }
      this.loading = true
      this.$api[api](params)
        .then(data => {
          this.loading = false
          switch (title) {
            case '打印采购清单产品条码':
              this.data = data.rows
              break

            case '打印产品条码':
              this.data = purchaseIds
                ? data.rows
                : data.list.map(el => ({ ...el, productBarCode: el.code }))
              break

            case '打印采购清单':
              this.data = data.rows
              break

            case '打印采购单':
              this.data = data.rows

              break

            case '打印入库单':
              this.data = data.rows
              break

            case '打印进货单':
              this.data = data.rows
              break

            case '打印成品加工单':
              this.data = data.rows
              break

            case '打印发票':
              this.data = data.rows
              break

            case '打印合同':
              let { code, ...info } = data
              this.data = info
              break

            default:
              break
          }
        })
        .catch(err => {})
    },

    getWarehouseCode() {
      let list = this.warehouseList.map(el => ({
        wmWarehouseId: el.warehouseId,
        productId: el.productId,
        count: el.num
      }))
      return vm.$api[`warehouse/wmInventoryProductCodeList`]({
        list
      }).then(data => {
        return data.list
      })
    },

    async setCodes(arr) {
      if (this.needCodePage.indexOf(this.$route.query.title) > -1) {
        if (this.$route.query.title === '打印产品条码') {
          arr = this.warehouseList ? await this.getWarehouseCode() : arr
        }
        arr = _chunk(arr, 20)
        let total = arr.length
        this.loading = true
        let timer = setInterval(() => {
          if (arr.length) {
            let el = arr.shift()
            this.printCodes.push(...el)
            this.codeCreatePercent = (
              ((total - arr.length) / total) *
              100
            ).toFixed(0)
            console.log('处理中', arr.length)
          } else {
            clearInterval(timer)
            timer = null
            this.$nextTick(() => {
              this.creatCode = true
              this.codeCreatePercent = 100
              this.loading = false
              this.$refs.bar.forEach(el => {
                el.$el.setAttribute('viewBox', '0 20 310 60')
              })
              setTimeout(() => {
                window.print()
              })
            })
          }
        }, 60)
      } else {
        this.$nextTick(() => {
          window.print()
        })
      }
    },
    getTotalShipping(item) {
      return item.reduce((prev, cur) => {
        return prev + cur.shipping
      }, 0)
    },
    getTotal(el) {
      return this.getTotalShipping(el.products) + el.totalAmount
    },
    print(type) {
      this.type = type

      this.tableClass = ''

      if (this.$route.query.title === '打印采购单') {
        this.$nextTick(() => {
          let svgEl = this.$refs.svg[0].$el
          svgEl.setAttribute('viewBox', '0 20 280 60')
          window.print()
        })
        return
      }

      this.printCodes = []
      this.creatCode = false
      this.codeCreatePercent = 0

      let _all = []

      this.data.forEach(el => {
        let num = el.num || 1
        for (let index = 0; index < num; index++) {
          _all.push(el)
        }
      })

      this.setCodes(_all)

      // this.printCodes = _all
    },
    indexMethod(index) {
      return index + 1
    }
  },
  mounted() {
    document.title = this.$route.query.title
  },
  computed: {
    compactTotalPrice() {
      if (this.$route.query.title === '打印合同') {
        if (this.data.products) {
          let total = this.data.products.reduce((prev, cur) => {
            return prev + cur.totalPrice
          }, 0)
          return total + this.data.freightAmount
        } else {
          return 0
        }
      } else {
        return 0
      }
    },
    loadingText() {
      if (this.needCodePage.indexOf(this.$route.query.title) > -1) {
        if (!this.creatCode) {
          return '生成中... (' + this.codeCreatePercent + '%)'
        } else {
          return '加载中...'
        }
      } else {
        return '加载中...'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.print {
  width: 70%;
  margin: 0 auto;
  .printBtnBox {
    padding: 20px 0;
  }
}
.bolder {
  font-weight: bolder;
}
.code {
  width: 189px;
  height: 113px;
  background: #fff;
  margin: 0 auto;
}
#print-div {
  display: none;
  width: 100%;
  &.a4 {
    flex-wrap: wrap;
    width: 100% !important;
  }
}

.print-nodisplay {
  display: none;
}
table {
  margin-top: 30px;
  width: 100%;
}

h2 {
  margin-top: 30px;
  text-align: center;
  margin-bottom: 30px;
}
h4 {
  margin-top: 20px;
  text-align: center;
  margin-bottom: 20px;
}

.purchaseList-wrapper {
  .box {
    border: 1px solid #000;

    .index {
      border: 1px solid #000;
    }
    .product {
      font-weight: bold;
    }
    .footer {
      white-space: normal;
    }
    .success {
      color: green;
      font-weight: bold;
    }
    .danger {
      color: red;
      font-weight: bold;
    }
    span {
      margin-left: 4px;
    }
  }
}

// 单独打印条码
svg {
  width: 100% !important;
  height: 60px !important;
  z-index: 0;
  // transform: scaleY(0.8) !important;
  // margin-top: -8px;
}

.svg {
  width: 60% !important;
  height: auto;
  z-index: 0;
  transform: scaleY(0.6) !important;
  margin-top: -10px;
}

.w100-svg {
  width: 100% !important;
}

// 发票表格
table.invoice {
  border: 1px solid #000 !important;
  h2 {
    font-size: 32px;
    margin: 0;
  }
  .title {
    font-weight: bolder;
    font-size: 16px;
  }
  td {
    border: 1px solid #000 !important;
    font-size: 16px;
    p {
      font-size: 16px !important;
      margin: 20px 0;
      line-height: 1.5;
    }
  }
}

//  合同表格
table.compact {
  td {
    border-color: transparent;
  }
  .showBorder {
    margin-top: 0;
    td {
      border-color: #333;
    }
  }
  line-height: 1.8;
  margin-top: 0;
  border: none;
  h2 {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
  }
}

@media print {
  .el-loading-mask {
    display: none;
  }
  .print-nodisplay {
    display: block;
  }
  table.invoice {
    td {
      p {
        line-height: 1;
      }
    }
  }
  #print-div {
    display: block;
    &.a4 {
      display: flex !important;
      width: 100vw;
      .code {
        width: 25%;
      }
    }
    .sku {
      z-index: 11;
      margin-left: 6px;
      // margin-top: -15px;
      line-height: 1;
      font-size: 6pt;
      text-align: center;
      font-weight: bold;
    }
    .skuCustom {
      z-index: 11;
      line-height: 1;
      margin-top: 3px;
      margin-left: 6px;
      font-size: 8pt;
      font-weight: bold;
    }
    .made {
      z-index: 11;
      // margin-top: -4px;
      text-align: center;
      font-size: 4pt;
      transform: scale(0.6) !important;
    }
  }
  .noprint {
    display: none !important;
  }
  table {
    margin-top: 60px;
  }
  .line1 {
    font-size: 12px !important;
    p {
      line-height: 1 !important;
    }
  }
}

@page {
  margin: 0mm 2mm 0mm -6mm;
}
</style>
<style lang="scss">
body {
  background: #fff;
}

@media print {
  body,
  #app {
    height: auto !important;
  }
}
</style>
