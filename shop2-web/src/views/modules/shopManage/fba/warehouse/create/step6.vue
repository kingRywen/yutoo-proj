<template>
  <div class="w1200">
    <section>
      <header>
        <h5>{{planInfo.planName}}</h5>
      </header>
      <table v-if="curShipment.shipmentName" class="custom-table">
        <tr>
          <td class="table-header" style="width:80px">发货地址</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{addressGroupName}}</span>
            </div>
          </td>
          <td class="table-header" style="width:80px">配送地址</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{shippingToAdd}}</span>
            </div>
          </td>
          <td class="table-header" style="width:80px">总费用</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{curShipment.totalFee}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="table-header" style="width:80px">编号</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{curShipment.shipmentId}}</span>
            </div>
          </td>
          <td class="table-header" style="width:80px">货件内商品</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{curShipment.totalUnits}}</span>
            </div>
          </td>
          <td class="table-header" style="width:80px">日期</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{curShipment.shipmentName.split(' ')[1]}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="table-header" style="width:80px">创建日期</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{curShipment.shipmentName.split(' ')[1]}}</span>
            </div>
          </td>
          <td class="table-header" style="border-bottom-width:1px">贴标和预处理</td>
          <td style="border-bottom-width:1px">
            <div class="flex flex-t-b">
              <span>{{"-"}}</span>
            </div>
          </td>

          <td class="table-header" style="width:80px;border-bottom-width:1px">货件追踪编号</td>
          <td style="border-bottom-width:1px">
            <div class="flex flex-t-b">
              <span>{{"-"}}</span>
            </div>
          </td>
        </tr>
        <tr>
          <td class="table-header" style="width:80px">更新日期</td>
          <td>
            <div class="flex flex-t-b">
              <span>{{curShipment.updateTime}}</span>
            </div>
          </td>
        </tr>
      </table>
    </section>
    <div v-if="!submited">
      <section v-if="!shipmentId">
        <h2>检查货件内容</h2>
        <button @click="showPro = !showPro" class="amazon-btn amazon-btn-sec">
          <span>{{showPro ? '隐藏商品' : '检查并修改商品'}}</span>
        </button>
        <main-layout
          v-if="showPro"
          :showSelection="false"
          class="mt10"
          :columns="columns"
          :outerTableList="tableList"
          ref="layout"
        >
          <el-table-column slot="right" :width="45" label align="left">
            <template slot-scope="scope">
              <el-button
                :disabled="$attrs.unedit"
                type="text"
                icon="el-icon-close"
                @click="del(scope.row, scope.$index)"
              ></el-button>
            </template>
          </el-table-column>
        </main-layout>
      </section>
      <section class="section2">
        <h2>配送服务</h2>
        <el-row>
          <el-col :span="8">
            <h5>配送方式</h5>
            <p>
              <input type="radio" id="new" v-model="shipmentType" @change="saveTran" value="SP" />
              <label for="new">
                小包裹快递（SPD）
                <p>我正在配送多个箱子</p>
              </label>
            </p>
            <p>
              <input disabled type="radio" id="1" v-model="shipmentType" @change="saveTran" value="LTL" />
              <label for="1">
                汽运零担（LTL）
                <p>我要运送托拍，货件重量至少为150磅。</p>
              </label>
            </p>
          </el-col>
          <el-col :span="8">
            <h5>配送商</h5>
            <p>
              <input disabled type="radio" id="part1" v-model="partneredType" :value="1" />
              <label for="part1">
                亚马逊合作承运人（UPS）
                <p>折扣多、追踪便捷的陆运</p>
              </label>
            </p>
            <p>
              <input type="radio" id="part2" v-model="partneredType" :value="0" />
              <label for="part2">
                其他承运人
                <el-select @change="saveTran" v-model="carrierName" size="mini" placeholder>
                  <el-option v-for="item in curCarrier" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
              </label>
            </p>
          </el-col>
        </el-row>
        <!-- <section>
        <h5>与您的供应商共享货件</h5>
        <p>是否有供应链参与者为您将库存运送至亚马逊?请与他们分享此货件,以便他们可以轻松下载标签并更准确地处理您的货件。请先确认您的配送方式和承运人,然后再选择供应链参与者。当前仅能共享包含1到1,000个箱子的货件。</p>
        </section>-->
      </section>
      <section>
        <h2>货件包装</h2>
        <el-select :disabled="!!shipmentId || $attrs.unedit" v-model="boxType">
          <el-option label="所有产品装在一个箱子" :value="1"></el-option>
          <el-option label="多个箱子" :value="2"></el-option>
        </el-select>
        <main-layout v-if="boxType == 1" class="mt20 num-tb" :columns="columns1" :outerTableList="innerPros"></main-layout>
        <div v-else>
          <template v-if="!shipmentId">
            <div class="section2">
              <h5>您如何提供箱内物品信息?</h5>
              <p>
                <input type="radio" id="new" v-model="uploadType" :value="2" />
                <label for="new">
                  使用网页表格
                  <p>在网页表格中填写箱子信息</p>
                </label>
              </p>
              <p>
                <input type="radio" id="new" v-model="uploadType" :value="1" />
                <label for="new">
                  上传文件
                  <p>填写装箱单,并上传到卖家平台</p>
                </label>
              </p>
              <p>
                <input type="radio" id="new" v-model="uploadType" @change="handleNotProvide" :value="3" />
                <label for="new">
                  跳过箱子信息并收取人工处理费用
                  <p>亚马逊将手动处理您的箱内物品</p>
                </label>
              </p>
            </div>
            <div v-if="uploadType == 1">
              <section class="card">
                <div class="header">选择装箱单文件格式</div>
                <div class="content">
                  <div>请为您的箱子信息装箱单选择所需的文件格式,并输入货件中的箱子数量</div>
                  <el-table class="mt20" :data="boxTempData">
                    <el-table-column label="文件格式">
                      <template slot-scope="scope">
                        <div>
                          <el-select v-model="boxTempFileExt" size="mini" placeholder="请选择一个文件格式">
                            <el-option label="excel" :value="1"></el-option>
                          </el-select>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label="箱子总数">
                      <template slot-scope="scope">
                        <div>
                          <el-input-number
                            :disabled="$attrs.unedit"
                            @change="changeType1box"
                            size="mini"
                            :controls="false"
                            v-model="totalBoxNum"
                            :min="1"
                          ></el-input-number>
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column label>
                      <template slot-scope="scope">
                        <div>
                          <button @click="gen" class="amazon-btn amazon-btn-sec">
                            <span>生成装箱单模板</span>
                          </button>
                        </div>
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </section>
              <section class="card">
                <div class="header">上传完成的装箱单</div>
                <div class="content">
                  <div>为货件中的每个箱子输入SKU数量和有效期(如果存在)后,上传您的装箱单。如果您下载了Exce模板,则上传的文件必须为xsx格式。如果您下载了制表符分隔格式的模板,则文件必须为.csv或.txt格式。</div>
                  <el-upload
                    :disabled="$attrs.unedit"
                    :headers="headers"
                    class="upload-demo mt20"
                    drag
                    :on-success="disabedLabel = false"
                    :action="action"
                    :data="actionParams"
                    multiple
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">
                      将文件拖到此处，或
                      <em>点击上传</em>
                    </div>
                    <!-- <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div> -->
                  </el-upload>
                </div>
              </section>
            </div>
            <div v-if="uploadType == 2">
              <!-- 网页表格 -->
              <p>货件中有多少箱子？</p>
              <p>
                <el-input v-model="pageBoxNum" ref="pageInput" style="width: 100px"></el-input>
                <button type="amazon-btn" @click="setPage">确认</button>
              </p>
              <div v-if="showPageTable">
                <el-table :data="pageTableData">
                  <el-table-column label="箱内物品">
                    <template slot-scope="scope">
                      <div>
                        <p>{{scope.row.sellerSku}}</p>
                        <p>{{scope.row.title}}</p>
                        <p>{{scope.row.asin}}</p>
                        <p>{{scope.row.fnsku}}</p>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column label="货件数量">
                    <template slot-scope="scope">
                      <div>
                        <p>{{scope.row.quantity}}</p>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column v-for="item in pageSureBoxNum" :label="`货件数量${item}`" :key="item">
                    <template slot-scope="scope">
                      <el-input-number size="mini" v-model="scope.row['box_' + item]" :precision="0" :min="0"></el-input-number>
                    </template>
                  </el-table-column>
                  <el-table-column label="已装箱数量">
                    <template
                      slot-scope="scope"
                    >{{Object.keys(row).reduce((total,cur) => cur.indexOf('box_') > -1 ? total+=row[cur] : total, 0)}}</template>
                  </el-table-column>
                  <el-table-column label>
                    <template slot-scope="scope">
                      <el-button
                        type="text"
                        size="mini"
                        icon="el-icon-close"
                        @click="pageTableData.splice(scope.$index, 1)"
                      ></el-button>
                    </template>
                  </el-table-column>
                </el-table>
                <button type="amazon-btn" @click="savePageData">保存</button>
              </div>
            </div>
            <div class="fare-wrapper" v-if="uploadType == 3">
              <h3>亚马逊物流手动处理费用</h3>
              <span>我们将对亚马进运营中心接收的无种内物品信意的货件农取亚马逊物流人工处理费用。</span>
              <div class="flex">
                <div style="width:250px">该贷件内的商品总数:</div>
                <div>{{totalProNum}}</div>
              </div>
              <div class="flex">
                <div style="width:250px">每件商品的贵用:</div>
                <div>{{0.1}}</div>
              </div>
              <div class="flex">
                <div style="width:250px">亚马外物流人工处理费用总计:</div>
                <div>{{totalProNum * 0.1}}</div>
              </div>
              <p>
                <el-input v-model="pageBoxNum1" ref="pageInput" style="width: 100px"></el-input>
                <button type="amazon-btn" @click="setBoxNum">设置箱子数量</button>
              </p>
            </div>
          </template>
          <div v-else>
            <yt-table
              class="mt20"
              :selection="false"
              :columns="[{label: 'SKU', value: 'sellerSku'},{label: '计划发货数量', value: 'quantityPlanSend'}]"
              :data="$store.state.fba.cartonInfo"
            ></yt-table>
          </div>
        </div>
      </section>
      <section v-if="false">
        <h2>运费</h2>
        <p>您负责提供准确的货件信息和实际货件成本。如果提供的信息不准确,我们可能会阻止今后向运营中心发送货件,或针对违规行为收取额外的费用。</p>
        <table class="plain-tb">
          <tr>
            <th>配送商</th>
            <th>箱子数量</th>
            <th>货件重量</th>
            <th>计费重量</th>
            <th>预估的运费</th>
          </tr>
          <tr>
            <td></td>
            <td>1</td>
            <td></td>
            <td></td>
            <td>
              <button @click="showPro = !showPro" class="amazon-btn amazon-btn-sec">
                <span>计算</span>
              </button>
            </td>
          </tr>
        </table>
      </section>
      <section
        class="myloading"
        v-loading="disabedLabel && !shipmentId"
        element-loading-background="rgba(255, 255, 255, 0.6)"
        element-loading-spinner="el-"
        element-loading-text=" "
      >
        <h2>货件标签</h2>
        <p>选择与打印机格式兼容的纸张类型。由于每个箱子标签都是唯一的,请务必打印所有箱子标签。请不要影印、重复使用或修改标签并将其用于其他箱子。即使箱子内含单件可售商品,也需要提供箱子编号标签。</p>
        <table class="plain-tb">
          <tr>
            <th>箱子数量</th>
            <th>纸张类型</th>
            <th>Paper Size</th>
            <th></th>
          </tr>
          <tr>
            <td>{{totalBoxNum}}</td>
            <td>
              <el-select size="mini" v-model="pageType">
                <el-option v-for="item in pages" :label="item" :key="item" :value="item"></el-option>
              </el-select>
            </td>
            <td>210mm*297mm</td>
            <td>
              <button @click="downloadBoxLabel" class="amazon-btn amazon-btn-sec">
                <span>下载箱子标签</span>
              </button>
            </td>
          </tr>
        </table>
      </section>
      <section>
        <p>出于安全原因,内含多件商品的箱子重量不得超过50磅。内含一件商品且重量超过50磅的箱子必须在顶部和侧面标上“多人合搬”。</p>
        <img src="./img/amzinfo.png" alt />
      </section>
      <article v-if="!shipmentId" class="mt20">
        <el-button :disabled="$attrs.unedit" type="default" @click="$emit('cancel')">取消创建</el-button>
        <el-button :disabled="$attrs.unedit" type="primary" v-if="!isSuccess" @click="deleteShip">删除货件</el-button>
        <!-- <el-button type="primary" v-if="!isSuccess" @click="next">处理下一货件</el-button> -->
        <el-button :disabled="$attrs.unedit" type="primary" @click="submit">完成货件</el-button>
      </article>
    </div>
    <article v-else>
      <h3>追踪货件</h3>
      <el-table :data="packages">
        <el-table-column label="箱号">
          <template slot-scope="scope">
            {{scope.$index}}
          </template>
        </el-table-column>
        <el-table-column label="追踪编号">
          <template slot-scope="scope">
            <ElInput ref="trackInput" size="mini" v-model="scope.row.trackingId" placeholder="输入追踪编号"></ElInput>
          </template>
        </el-table-column>
      </el-table>
      <button class="amazon-btn amazon-btn-sec" @click="saveTracking">全部保存</button>
      <button class="amazon-btn amazon-btn-sec" @click="submited = false">返回</button>
    </article>
  </div>
</template>
<script>
import { downloadFile } from 'Utils'
import { mapState, mapMutations, mapGetters, mapActions } from 'vuex'
import { CONST_PORT_CONFIG } from 'Config'
export default {
  data() {
    const spNoUpsUS = [
      { label: 'UPS', value: 'UNITED_PARCEL_SERVICE_INC' },
      { label: 'DHL', value: 'DHL_EXPRESS_USA_INC' },
      { label: 'USPS', value: 'UNITED_STATES_POSTAL_SERVICE' },
      { label: 'FEDERAL', value: 'FEDERAL_EXPRESS_CORP' },
      { label: '其他', value: 'OTHER' }
    ]
    const spNoUpsUK = [
      { label: 'UPS', value: 'UNITED_PARCEL_SERVICE_INC' },
      { label: 'DHL空运', value: 'DHL_AIRWAYS_INC' },
      { label: 'DHK UK', value: 'DHL_UK' },
      { label: 'TNT物流', value: 'TNT_LOGISTICS_CORPORATION' },
      { label: 'TNT', value: 'TNT' },
      { label: 'Business Post', value: 'BUSINESS_POST' },
      { label: 'Parcel Force', value: 'PARCELFORCE' },
      { label: 'DPD', value: 'DPD' },
      { label: 'YODEL', value: 'YODEL' },
      { label: '其他', value: 'OTHER' }
    ]
    const ltlNoUpsUS = [
      { label: 'UPS', value: 'UNITED_PARCEL_SERVICE_INC' },
      { label: 'DHL', value: 'DHL_EXPRESS_USA_INC' },
      { label: 'USPS', value: 'UNITED_STATES_POSTAL_SERVICE' },
      { label: 'FEDERAL', value: 'FEDERAL_EXPRESS_CORP' },
      { label: '其他', value: 'OTHER' }
    ]

    const ltlNoUpsUK = [
      { label: 'UPS', value: 'UNITED_PARCEL_SERVICE_INC' },
      { label: 'DHL空运', value: 'DHL_AIRWAYS_INC' },
      { label: 'DHK UK', value: 'DHL_UK' },
      { label: 'TNT物流', value: 'TNT_LOGISTICS_CORPORATION' },
      { label: 'TNT', value: 'TNT' },
      { label: 'Business Post', value: 'BUSINESS_POST' },
      { label: 'Parcel Force', value: 'PARCELFORCE' },
      { label: 'DPD', value: 'DPD' },
      { label: 'YODEL', value: 'YODEL' },
      { label: '其他', value: 'OTHER' }
    ]

    return {
      submited: false,
      packages: [],
      action: `${CONST_PORT_CONFIG.DEFAULT_URL}/fbaShipmentCreate/carton/upload`,
      spNoUpsUS,
      spNoUpsUK,
      ltlNoUpsUS,
      ltlNoUpsUK,
      boxCount: 1,
      disabedLabel: true,
      showPageTable: false,
      pageTableData: [],
      pageBoxNum: undefined,
      pageSureBoxNum: undefined,
      partneredType: 0,
      pageBoxNum1: undefined,
      carrierName: this.$storage.get('local', 'carrierName') || '',
      shipmentType: 'SP',
      shipmentId: this.$route.query.shipmentId,
      totalBoxNum: undefined,
      uploadType: 1,
      pageType: 'PackageLabel_A4_2',
      pages: [
        'PackageLabel_Letter_2',
        'PackageLabel_Letter_6',
        'PackageLabel_A4_2',
        'PackageLabel_A4_4',
        'PackageLabel_Plain_Paper'
      ],
      boxType: 2,
      boxTempFileExt: 1,
      tableList: JSON.parse(
        JSON.stringify(this.$store.state.fba.selectProjProduct)
      ),
      boxTempData: [{}],
      columns1: [
        {
          label: '货件内商品',
          value: 'sellerSku'
        },
        {
          label: '货件数量',
          value: 'quantity'
        },
        {
          label: '箱子重量',
          value: '',
          render(h, scope) {
            let str = 'weight'
            return (
              <el-input-number
                disabled={this.$attrs.unedit}
                key={scope.row._key}
                size="mini"
                style="width: 100%"
                min={1}
                onChange={val => {
                  let oldVal = scope.row[str]
                  // this.changeNum(scope.row, str, val, oldVal)
                }}
                value={scope.row[str]}
                // max={99999999999}
                controls={false}
              ></el-input-number>
            )
          }
        },
        {
          label: '箱子尺寸（in）',
          value: ''
        }
      ],
      innerPros: JSON.parse(
        JSON.stringify(this.$store.state.fba.selectProjProduct)
      ),
      showPro: false,
      columns: [
        {
          label: 'SKU',
          value: 'sellerSku',
          noTooltip: true
        },
        // {
        //   label: 'ASIN',
        //   value: 'asin',
        //   width: 110
        // },
        {
          label: '主图',
          img: true,
          width: 70,
          value: 'img'
        },
        {
          label: '标题',
          minWidth: 300,
          url: true,
          btnClick: scope => {
            window.open(this.storeUrls.asinUrl + scope.row['asin'])
          },
          value: 'title',
          noTooltip: true
        },
        {
          label: '数量',
          width: 120,
          value: 'quantity',
          render: this.renderEdit('quantity')
        }
      ]
    }
  },
  watch: {
    uploadType() {
      this.disabedLabel = true
    },
    totalBoxNum(val) {
      this.packages = Array.from({length: val}, () => ({}))
    }
  },
  computed: {
    ...mapState('fba', ['shipments', 'planInfo', 'addressInfo']),
    ...mapGetters('fba', ['addressGroupName']),
    totalProNum() {
      return this.tableList.reduce((total, cur) => (total += cur.quantity), 0)
    },
    headers() {
      return {
        token: this.$storage.get('local', 'token')
      }
    },
    storeId() {
      return this.planInfo.storeId || this.$route.query.storeId
    },

    actionParams() {
      return {
        shipmentId: this.shipmentId,
        storeId: this.storeId
      }
    },
    curCarrier() {
      const str = `${this.partneredType ? 'sp' : 'ltl'}NoUps${
        this.addressInfo.addressCountryCode == 'US' ? 'US' : 'UK'
      }`
      // ltlNoUpsUS
      return this[str]
    },
    isSuccess() {
      return this.shipments.every(el => !!el._success)
    },
    curShipment() {
      let el = this.shipments.find(
        e => e.shipmentId == this.$route.query.shipmentId
      )
      return el || {}
    },
    shippingToAdd() {
      const {
        shipToCity,
        shipToCountry,
        shipToLine1,
        shipToName,
        shipToPostal,
        shipToState
      } = this.curShipment
      return `${shipToName}, ${shipToLine1} ${shipToCity} ${shipToState},${' '}
                ${shipToPostal} ${shipToCountry}`
    }
  },
  methods: {
    ...mapMutations('fba', ['saveCreateInfo', 'setSelectedPro']),
    ...mapActions('fba', ['delShipments']),
    async changeType1box(val) {
      await this.saveTran({boxCount: val})
      this.pageSureBoxNum = val
    },
    saveTracking() {
      if (this.$refs.trackInput.some(e => !e.value)) {
        return this.$message.warning('请填写追踪编码')
      }
      const params = {
        shipmentId: this.shipmentId,
        storeId: this.storeId,
        packages: this.packages
      }
      this.$api[`fba/fbaShipmentCreateTransportPut`](params)
      .then(() => {
        this.$router.push('/shopManage/fba')
      })
    },
    async setBoxNum() {
      await this.saveTran({ boxCount: this.pageBoxNum1 })
      this.pageSureBoxNum = this.pageBoxNum1
      this.disabedLabel = false
    },
    async setPage() {
      if (!this.pageBoxNum) {
        this.$refs.pageInput.focus()
        return this.$message.warning('请输入箱子数量')
      }
      await this.saveTran({ boxCount: this.pageBoxNum })
      this.showPageTable = true
      this.pageSureBoxNum = this.pageBoxNum
      this.pageTableData = JSON.parse(JSON.stringify(this.tableList))
    },
    async savePageData() {
      const items = []
      this.pageTableData.map(e => {
        Object.keys(e).map(key => {
          if (key.indexOf('box_') > -1) {
            items.push({
              sellerSku: e.sellerSku,
              boxNumber: +key.replace('box_', ''),
              quantity: e[key]
            })
          }
        })
      })
      const params = {
        shipmentId: this.shipmentId,
        storeId: this.storeId,
        items
      }
      await this.$api[`fba/fbaShipmentCreateCartonPut`](params)
      this.disabedLabel = false
    },
    handleNotProvide() {
      const params = {
        shipmentId: this.shipmentId,
        storeId: this.storeId,
        provideCarton: 'NONE'
      }
      this.$api[`fba/fbaShipmentCreateShipmentEdit`](params)
    },
    downloadBoxLabel() {
      const params = {
        shipmentId: this.shipmentId,
        storeId: this.storeId,
        pageType: this.pageType
      }
      this.$api[`fba/fbaShipmentCreateLabelPackage`](params).then(data => {
        downloadFile(data, `${Date.now()}.zip`)
      })
    },
    gen() {
      const params = { shipmentId: this.shipmentId, debug: true }
      this.$api[`fba/fbaShipmentCreateCartonDownload`](params).then(data => {
        downloadFile(data)
        
      })
    },
    saveTran({ boxCount }) {
      const params = {
        shipmentId: this.shipmentId,
        shipmentType: this.shipmentType,
        partneredType: this.partneredType,
        // carrierName: this.carrierName,
        boxCount: boxCount || this.boxCount
      }
      this.$storage.set('local', 'carrierName', this.carrierName)
      if (this.partneredType == 0) {
        params.carrierName = this.carrierName
      }
      this.$api[`fba/fbaShipmentCreateTransportSave`](params).then(() => {})
    },
    next() {},
    async deleteShip() {
      const params = { shipmentId: this.shipmentId }
      await this.delShipments(params)
      this.saveCreateInfo(4)
    },
    // 确认发货
    async submit() {
      const params = {
        shipmentId: this.shipmentId,
        storeId: this.storeId,
        shippingStatus: 2
      }
      this.$api[`fba/fbaShipmentCreateShipmentEdit`](params).then(async () => {
        await this.clearCacheProj()
        this.submited = true
        // this.$router.push('/shopManage/fba')
      })
    },
    tableRowClassName({ rowIndex }) {
      if (rowIndex == 0) {
        return '___first'
      }
    },
    del(row, index) {
      this.tableList.splice(index, 1)
    },
    renderEdit(str) {
      return (h, scope) => (
        <el-input-number
          key={scope.row._key}
          size="mini"
          style="width: 100%"
          min={1}
          onChange={val => {
            let oldVal = scope.row[str]
            this.changeNum(scope.row, str, val, oldVal)
          }}
          value={scope.row[str]}
          // max={99999999999}
          controls={false}
        ></el-input-number>
      )
    },
    // 修改数量
    changeNum(row, str, val, oldVal) {
      // const params = {
      //   shipmentId: this.shipmentId,
      //   storeId: this.planInfo.storeId,
      //   items: this.tableList.map(e => ({
      //     sellerSku: e.sellerSku,
      //     quantity: e.quantity
      //   }))
      // }
      // this.$api[`fba/fbaShipmentCreateShipmentEdit`](params)
      //   .then(() => {
      //     this.setSelectedPro(JSON.parse(JSON.stringify(this.tableList)))
      //     this.$nextTick(() => {
      //       this.$set(row, str, val)
      //     })
      //   })
      //   .catch(() => {
      //     this.$nextTick(() => {
      //       this.$set(row, str, oldVal)
      //       this.$set(row, '_key', Math.random())
      //     })
      //   })

      let el = [].find.call(
        document.querySelectorAll(
          '.num-tb .over .el-input-number .el-input__inner'
        ),
        e => e.value == ''
      )
      if (el) {
        el.focus()
        return this.$message.warning('请填写数据')
      }
      const params = {
        planId: this.planInfo.planId,
        planProcess: 2,
        items: this.tableList.map(el => {
          const { sellerSku, quantity, fnsku } = el
          return {
            sellerSku,
            storeId: this.storeId,
            quantity,
            fnsku
          }
        })
      }
      this.$api[`fba/fbaShipmentCreateItemAdd`](params)
        .then(() => {
          this.setSelectedPro(this.tableList)
          this.saveCreateInfo()
          this.$nextTick(() => {
            this.$set(row, str, val)
          })
        })
        .catch(() => {
          this.$nextTick(() => {
            this.$set(row, str, oldVal)
            this.$set(row, '_key', Math.random())
          })
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.myloading {
  /deep/.el-loading-mask {
    background-color: hsla(0, 0%, 100%, 0.9);
  }

  /deep/ .el-loading-spinner {
    background-image: none !important;
  }
}
.w1200 {
  counter-reset: section;
  font-size: 13px;
  line-height: 1.4;
}
h2 {
  margin-bottom: 15px;
  color: #c60;
  border-bottom: 1px solid #ccc;
  padding: 0 10px 5px 10px;
  font-size: 18px;
  &:before {
    counter-increment: section;
    content: '' counter(section) '. ';
  }
}
section {
  margin: 40px 0;
}
.section2 {
  p {
    label {
      font-weight: bold;
      p {
        margin: 4px 0;
        opacity: 0.8;
        margin-left: 16px;
        font-weight: normal;
      }
    }
  }
}
.card {
  .header {
    border: 1px solid #ccc;
    background: linear-gradient(180deg, #f8f8f8, #e9e9ea, #f0f0f0);
    padding: 6px;
    font-weight: bold;
  }
  .content {
    background: #fafafa;
    padding: 6px;
  }
}
</style>