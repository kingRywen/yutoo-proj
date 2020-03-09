<!--  -->
<template>
  <div>
    <div v-if="$route.name === 'SFM'" class="___common shopFinan">
    <!-- <el-search :search="search" :clearSearch.sync="clearSearch" :__picker="cfuns._pickerBefore"></el-search> -->
      <ElButton
        v-if='$route.query.sku'
        @click.stop="GObACK"
        type="text"
        icon="el-icon-back"
        style="position:absolute;right:22px;top:5px;"
      >返回</ElButton>
      
    <el-collapse class="custom-collapse" value="`1`" accordion>
        <el-collapse-item title="筛选条件" name="1" label-width="80px" style='text-align:left;'>
            <el-form :inline="true" ref="searchRuleForm"  >
                <el-form-item label="父产品">
                    <el-select
                      :popper-append-to-body="false"
                      collapse-tags
                      v-model="searchData.parentSkus"
                      @change="parentSelectChange"
                      placeholder="选择父sku"
                      style="min-width:300px"
                      clearable
                      size="small"
                      filterable
                      :multiple="true"
                    >
                      <el-option v-for="item in parentSkusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="子产品">
                  <el-select
                    :multiple="true"
                    :popper-append-to-body="false"
                    @change="childSkuSelectChange"
                    filterable
                    clearable
                    v-model="searchData.childSkus"
                    placeholder="选择子sku"
                    style="min-width:400px"
                    collapse-tags
                    size="small"
                  >
                    <el-option v-for="item in childSkusOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="统计时间">
                    <el-date-picker
                      v-model="searchData.date"
                      type="daterange"
                      align="right"
                      unlink-panels
                      range-separator="~"
                      start-placeholder="开始日期"
                      end-placeholder="结束日期"
                      style='width:260px;'
                      size="small"
                      :picker-options="pickerOptions"
                      value-format="yyyy-MM-dd"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" :loading='btnLoading' icon="el-icon-search"  @click="handleSearch">搜索</el-button>
                    <el-button size="small" type="primary" plain @click="resetSearch" :disabled="btnLoading">重置搜索</el-button>
                </el-form-item>
            </el-form>
        </el-collapse-item>
    </el-collapse>
    <a v-show="false" ref="exportExcel"></a>
    <template>
      <div style="margin-top:8px">
        <!-- <el-button size="mini" type="primary" plain @click="uploadTaskShow=true;buttonLoading.upload = false;">导入商品费用明细</el-button>
        <el-button size="mini" type="primary" plain @click="$router.push({name: 'SFMLog'})">导入日志</el-button> -->
        <el-button size="mini" type="primary" plain @click="$router.push({name: 'SFMProDetails'})">查看商品费用</el-button>
        <el-button size="mini" type="primary" plain @click="exportMethod" :disabled='$store.state.isloading || $store.state.loading'>导出</el-button>
      </div>
      <!-- 导入任务弹窗 -->
      <el-dialog
        class="customDialog"
        :close-on-click-modal="false"
        title="导入商品费用明细"
        :visible.sync="uploadTaskShow"
        style="padding-right:100px;"
        width="500px"
      >
        <ImportFile @success="handleSuccess" filename="商品费用明细模板" :data="storeIds" :downloadApi="downloadApi" :action="action" />
        <!-- <div style="position:relative;">
          <div style="position:relative;left:100px;top:-6px;width: 300px;">
            <el-upload
              style="margin-top:8px;"
              ref="upload"
              action="https://jsonplaceholder.typicode.com/posts/"
              :on-change="handleFileChange"
              :file-list="fileList"
              :on-remove="handleFileRemove"
              :auto-upload="false"
            >
              <el-button size="mini" type="primary" plain>导入数据</el-button>
            </el-upload>
          </div>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="downLoad"
            style="position:relative;left:0px;top:-6px;position:absolute;left: 270px;top:-6px;"
          >下载模板</el-button>
          <el-button
            style="margin:8px 0;width:40%;position:relative;top:-0px;left:29%"
            :disabled=" fileList.length>0?false:true"
            :loading="buttonLoading.upload"
            size="mini"
            type="primary"
            plain
            @click="upload"
          >确 定</el-button>
        </div> -->
      </el-dialog>
    </template>
    <template>
      <section v-loading="Loading1" style='min-height:300px;'>
        <!-- <none-page v-show="!listData" noBack>暂无数据</none-page> -->
        <div style="min-width:800px;display:flex;margin-top:8px" v-show="listData">
          <section style="width:45%" v-if="listData">
            <header class="header">费用收支情况</header>
            <div class="item1">
              <span>收款</span>
              <span class="span2" v-if="listData.amountReceived">{{listData.amountReceived | __formatFlagM}}</span>
            </div>
            <div class="item2">
              <span>利润</span>
              <span class="span2" v-if="listData.amountProfit">{{listData.amountProfit | __formatFlagM}}</span>
            </div>
            <div class="item-header">收入</div>
            <div class="item1">
              <span>销售总额</span>
              <span
                class="span2"
                :id="b1"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountSales?"$"+listData.amountSales:'$0'}}</span>
            </div>
            <div class="item2">
              <span>赔偿</span>
              <span
                class="span2"
                :id="b2"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountReimbursement | __formatFlagM}}</span>
            </div>
            <div class="item2" style="padding:10px ">
              <div class="span2">
                <span style="margin-right:10px;">小计</span>
                <span>{{listData.amountSales||listData.amountReimbursement?"$"+ Number((listData.amountSales+listData.amountReimbursement)).toFixed(2):'$0'}}</span>
              </div>
            </div>

            <div class="item-header">支出</div>
            <div class="item1">
              <span>正常FBA配送费</span>
              <span
                class="span2"
                :id="c1"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountFulfillment | __formatFlagM}}</span>
            </div>
            <div class="item2">
              <span>正常订单佣金</span>
              <span
                class="span2"
                :id="c2"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountCommission | __formatFlagM}}</span>
            </div>
            <div class="item2">
              <span>仓储费</span>
              <span
                class="span2"
                :id="c3"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountStorage | __formatFlagM}}</span>
            </div>
            <div class="item2">
              <span>退款金额</span>
              <span
                class="span2"
                :id="c4"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountRefund | __formatFlagM}}</span>
            </div>
            <div class="item2">
              <span>退款损失</span>
              <span
                class="span2"
                :id="c5"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountRefundLoss | __formatFlagM}}</span>
            </div>
            <div class="item2">
              <span>移除费用</span>
              <span
                class="span2"
                :id="c6"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountRemove | __formatFlagM}}</span>
            </div>
            <div class="item2">
              <span>销毁费用</span>
              <span
                class="span2"
                :id="c7"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountDisposal | __formatFlagM}}</span>
            </div>
            <div class="item2">
              <span>广告费用</span>
              <span
                class="span2"
                :id="c8"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountAdvert | __formatFlagM}}</span>
            </div>
            <div class="item2" v-if="!isChildSku && skuIsAllSelect">
              <span>店铺费用</span> 
              <span
                class="span2"
                :id="c9"
                @click="getDetails($event)"
                :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
              >{{listData.amountSubscription | __formatFlagM}}</span>
            </div>
            <div class="item2" v-if="!isChildSku">
              <div class="span2">
                <span style="margin-right:10px;">小计</span>
                <span>
                  {{listData.amountFulfillment||listData.amountCommission||listData.amountStorage||listData.amountRefund||listData.amountRefundLoss||listData.amountRemove||listData.amountDisposal||listData.amountAdvert||listData.amountSubscription?"$"+
                  Number((listData.amountFulfillment+listData.amountCommission+listData.amountStorage+listData.amountRefund+listData.amountRefundLoss+listData.amountRemove+listData.amountDisposal+listData.amountAdvert)).toFixed(2):'$0'}}
                </span>
              </div>
            </div>
            <div class="item2" v-else>
              <div class="span2">
                <span style="margin-right:10px;">小计</span>
                <span>
                  {{listData.amountFulfillment||listData.amountCommission||listData.amountStorage||listData.amountRefund||listData.amountRefundLoss||listData.amountRemove||listData.amountDisposal||listData.amountAdvert||listData.amountSubscription?"$"+
                  Number((listData.amountFulfillment+listData.amountCommission+listData.amountStorage+listData.amountRefund+listData.amountRefundLoss+listData.amountRemove+listData.amountDisposal+listData.amountAdvert)).toFixed(2):'$0'}}
                </span>
              </div>
            </div>
          </section>
          <section style="width:55%" class="__relative">
            <header class="header">费用占比</header>
            <el-select class="to-right" v-model="optionValue" placeholder="费用占比" style="max-width:120px" size="mini">
              <el-option v-for="item in Options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <main style="padding:10px 20px;box-size:border-box;">
              <none-page v-show="chartShow" noBack>暂无数据</none-page>
              <div v-show="!chartShow">
                <echart
                  auto-resize
                  :options="echartData"
                  id="eChart"
                  style="min-width:100px; height:300px;overflow:visible"
                ></echart>
              </div>
            </main>
          </section>
        </div>
      </section>
    </template>
    <!-- 底部问题列表 -->
    <template>
      <section v-loading="Loading2">
        <div style="min-width:800px;display:flex;margin-top:8px;margin-bottom:40px;" v-show="listData">
          <section style="width:45%;min-height:100px;" v-if="listData">
            <header class="header">
              金额情况
              <span
                v-show="plistData"
                class="span2 __pointer common_color"
                @click="getPlistDataDetails(null)"
              >查看所有商品费用情况</span>
            </header>
            <div class="q-item common_color" v-for="(v,k) in plistData" @click="getPlistDataDetails(v)">
              <span class="span2" :key="v.problemType">{{v.problemName+'（'+v.count+'）'}}</span>
            </div>
            <none-page v-show="!plistData" noBack>暂无数据</none-page>
          </section>
          <section style="width:55%;min-height:100px;" v-if="listData">
            <header class="header">
              库存情况
              <span
                v-show="plistData"
                class="span2 __pointer common_color"
                @click="getPlistDataDetails(null,1)"
              >查看所有库存</span>
            </header>
            <div
              class="q-item common_color"
              v-for="(v,k) in plistData"
              @click="getPlistDataDetails(v,1)"
              v-if="v.problemType>3"
            >
              <span class="span2" :key="v.problemType">{{v.problemName+'（'+v.count+'）'}}</span>
            </div>
            <none-page v-show="!plistData" noBack>暂无数据</none-page>
          </section>
        </div>
      </section>
    </template>
  </div>

  <router-view v-if="$route.name !== 'SFM'"></router-view>
  </div>
  
</template>

<script>
import { CONST_PORT_CONFIG, host } from 'Config'
import { downloadFile } from 'Utils/tools'
import storage from 'Utils/saver'
let echarts = require('echarts/lib/echarts')
export default {
  components: {},
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > (Date.now()-15*3600*1000);
        },
      },
      skuIsAllSelect:true, //sku是否全选
      allSkuLength:null,//全部sku的length
      btnLoading:false,
      searchTrueData:null,//真实搜索的数据
      searchData:{
          parentSkus:[],
          childSkus:[],
          date:[this.cfuns.getDay(365).computedDay,
          this.cfuns.getDay().today]
      },
      dateDefault: [
          this.cfuns.getDay(365).computedDay,
          this.cfuns.getDay().today
      ],
      parentSkusOptions:[],
      childSkusOptions:[],
      __picker: {
          
      },
      downloadApi: 'financeDownloadFile',
      action: `${host}finance/costImport`,
      b1: 'b1',
      b2: 'b2',
      c1: 'c1',
      c2: 'c2',
      c3: 'c3',
      c4: 'c4',
      c5: 'c5',
      c6: 'c6',
      c7: 'c7',
      c8: 'c8',
      c9: 'c9',
      optionValue: '1',
      Options: [
        {
          value: '1',
          label: '所有费用占比'
        },
        {
          value: '2',
          label: '支出占比'
        }
      ],
      Loading1: false,
      Loading2: false,
      chartShow: false,
      echartData: null,
      // // 搜索
      // search: {
      //   loading: false,
      //   date: true,
      //   default: [
      //     this.cfuns.getDay(365).computedDay,
      //     this.cfuns.getDay().today
      //   ],
      //   parent: true,
      //   timeText: '统计时间',
      //   child: true
      // },
      // clearSearch: null,
      date: null,
      parentSkus: [],
      // childSkus: [],
      // tableLoading: false,
      // chartLoading: false,
      uploadTaskShow: false,
      fileList: [],
      buttonLoading: {
        upload: false
      },
      listData: null,
      echartData: null,
      chartList: null,
      // isChildSku: false
      plistData: false,

      allChildSkus:null,//当前选择的父元素下面的所有子元素
    }
  },
  created() {
    if (this.sellerId && this.siteId) {
        let querySku = this.$route.query.sku
        if ( querySku) {
          this.searchData.childSkus = [querySku]
          this.getList({ skus: [querySku] }) ;
        } else {
          this.getList()
        }
        this.getParentSkus()
    }
  },
  mounted() {},
  methods: {
    GObACK(){
        this.$router.go(-1)
    },
    //确认搜索
    handleSearch(){
      this.getList()
    },
    //重置搜索
    resetSearch(){
        this.searchData.parentSkus = [] ;
        this.searchData.childSkus = [] ;
        this.childSkusOptions = [];
        this.searchData.date = [this.cfuns.getDay(365).computedDay,
        this.cfuns.getDay().today] ;
        this.getList()
    },
    //父sku选择改变
    parentSelectChange(){
      this.parentSkus = this.searchData.parentSkus ;
      if( this.searchData.parentSkus.length ){
          this.getChildSkus()
      }else{
        this.searchData.childSkus = [];
        this.childSkusOptions = [];
      }
    },
    //子sku选择改变
    childSkuSelectChange(){
        //this.searchData.parentSkus = [] ;
    },
    handleSuccess({ res, file, fileList }) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.uploadTaskShow = false
        this.$message.success(res.msg)
        this.getList()
      }
    },
    exportMethod() {
      let param = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        startTime: this.date[0],
        endTime: this.date[1],
        parentSkus: this.$store.state.common.selectParentSkus,
        skus: this.searchData.childSkus,
        pageNumber: 1,
        pageSize: 10
      }
      this.$api['financeIndexExport'](param).then(data => {
        downloadFile(
          data,
          '店铺财务统计' + this.$.formatDate(new Date(), '{y}{m}{d}{h}{i}{s}')
        )
      })
    },
    // 饼状图
    drawEchart2(dom, list, type) {
      let et = echarts.init(dom)
      // et.clear();
      let option = {
        title: {
          // text: "此处不展示占比接近0%的数据)",
          textStyle: {
            fontSize: '14px',
            color: '#909399'
          }
        },
        tooltip: {
          trigger: 'item',
          // formatter: "{a} <br/>{b}: {c} ({d}%)"
          // 1
          formatter: function(val) {
            // console.log(val);
            let percent = val.percent.toFixed(2) + '%'
            return `${val.seriesName}</br>${val.name}: ${
              val.data.value
            }(${percent})`
          }
        },
        // color: [],
        toolbox: {
          // feature: {
          // dataZoom: {
          // yAxisIndex: 'none'
          // },
          // restore: {},
          // saveAsImage: { title: "保存" }
          // }
        },
        legend: {
          type: 'scroll',
          // orient: "vertical",
          orient: 'horizontal',
          // x: "left",
          formatter: function(name) {
            // console.log(name);
            return name
            // return name.length > 8 ? name.slice(0, 8) + "..." : name;
          },
          //   data: ["直接访问", "邮件营销", "联盟广告", "视频广告", "搜索引擎"]
          data: []
        },
        grid: {
          top: '20%',
          left: '3%',
          right: '6%',
          bottom: '1%',
          containLabel: true
        },
        series: []
      }
      option.tooltip.formatter = function(val) {
        let percent = val.percent.toFixed(2) + '%'
        return `${val.seriesName}</br>${val.name}: ${
          val.data.value
        }(${percent})`
      }
      //legend
      option.legend.data = []
      option.legend.right = '0%'
      option.legend.top = '20'
      option.legend.bottom = '20'
      option.legend.orient = 'vertical'
      option.grid.top = '10%'
      if (!list) {
        this.chartShow = false
      }
      option.series = [
        {
          name: '占比',
          type: 'pie',
          radius: ['0%', '60%'],
          center: ['40%', '60%'],
          avoidLabelOverlap: true,
          labelLine: {
            normal: {
              lineStyle: {},
              smooth: 0.2,
              length: 10,
              length2: 20
            }
          },
          itemStyle: {},
          data: []
        }
      ]
      list.forEach((item, index) => {
        if (index == 0) {
          item.color = '#FB6D6B'
        }
        if (index == 1) {
          item.color = '#47C2E1'
        }
        if (index == 2) {
          item.color = '#FDC74E'
        }
        if (index == 3) {
          item.color = '#D48265'
        }
        if (index == 4) {
          item.color = '#28C432'
        }
        if (index == 5) {
          item.color = '#00c0de'
        }
        if (index == 6) {
          item.color = '#272b2c'
        }
      })
      // console.log(list, "list");
      list.forEach((item, index) => {
        let x = item.name
        if (item.value >= 0) {
          option.legend.data.push(x) // legend
          // option.color.push(item.color); // legend
          option.series[0].data.push({
            // 使用直接push改变原来的数组对象
            value: item.value,
            name: x,
            id: item.id
          }) // series 中的data
        }
      })
      if (option.series == '') {
        this.chartShow = false
      }
      this.echartData = option
      et.on('click', this.getDetails)
    },
    //点击table表格的跳转
    getDetails(e) {
      if (this.isChildSku) {
        return
      }
      let id
      if (typeof e.seriesId === 'undefined') {
        id = e.target.id
      } else {
        id = e.data.id
      }
      // console.log(e, "e");
      if (id) {
        let URL
        if (id == 'b1') {
          URL = 'totalSalesList'
        } else if (id == 'b2') {
          URL = 'reimbursementList'
        } else if (id == 'c1') {
          URL = 'fulfillmentFeeList'
        } else if (id == 'c2') {
          URL = 'commissionList'
        } else if (id == 'c3') {
          URL = 'storageFeeList'
        } else if (id == 'c4') {
          URL = 'refundAmountList'
        } else if (id == 'c5') {
          URL = 'refundLossList'
        } else if (id == 'c6') {
          URL = 'removeFeeList'
        } else if (id == 'c7') {
          URL = 'disposalFeeList'
        } else if (id == 'c8') {
          URL = 'adChargeList'
        } else if (id == 'c9') {
          URL = 'subscriptionList'
        }
        let query = { URL: URL }
        if (this.date) {
          query.startTime = this.date[0]
          query.endTime = this.date[1]
        }
        query.skus = this.searchTrueData.childSkus ;
        // 离开之前清空一下
        // this.$store.commit('common/childSkus_1', null)
        this.$nextTick(() => {
          this.$router.push({
            path: '/SFM/details',
            query: query
          })
        })
      } else {
        this.$message.warning('利润和收款无查看功能')
      }
    },
    // 下载模板
    downLoad() {
      const { BASE_URL } = CONST_PORT_CONFIG
      this.$ajax({
        method: 'post',
        url: BASE_URL + 'finance/downloadFile',
        data: '',
        responseType: 'blob'
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]))
          let y = this.$refs.exportExcel
          y.href = url
          y.setAttribute('download', '导入商品费用明细.xlsx')
          y.click()
          window.URL.revokeObjectURL(url)
        })
        .catch(function(error) {
          // console.log(error);
        })
    },
    // 上传模板
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleFileRemove(file, fileList) {
      this.fileList = []
    },
    // 确认上传
    upload() {
      const { BASE_URL } = CONST_PORT_CONFIG
      let params = new FormData()
      params.append('siteId', this.siteId)
      params.append('sellerId', this.sellerId)
      // params.append("platformId", this.platformId);
      params.append('file', this.fileList[0].raw)
      this.buttonLoading.upload = true
      let headers = { headers: { 'Content-Type': 'multipart/form-data' } }
      this.$ajax
        .post(BASE_URL + 'finance/costImport', params, headers)
        .then(res => {
          // console.log(res);
          this.buttonLoading.upload = false
          let code = res.code
          if (code == 0) {
            this.uploadTaskShow = false
            this.buttonLoading.upload = false
            this.$message.success(res.msg)
            this.getList()
          } else if (code === 500) {
            this.buttonLoading.upload = false
            this.$message.error(res.msg)
          }
        })
        .catch(err => {
          this.buttonLoading.upload = false
          this.$message.error(res.msg)
        })
    },
    getParentSkus() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      }
      this.$api['productListParentSku1'](params)
        .then(data => {
            this.parentSkusOptions = [];
            data.data.forEach(i=>{
                this.parentSkusOptions.push({
                  label:i,
                  value:i
                })
            })

            //获取所有的子sku的长度,只需获取一次
            if(this.allSkuLength === null){
              let parentSkus = data.data.map(i=>{return i})
              let params = {
                sellerId: this.sellerId,
                siteId: this.siteId,
                parentSkus
              }
              this.$api['ProductListSku'](params).then(daya=>{
                  this.allSkuLength = data.data.length ;
              }).catch(err=>{

              })
            }
            

        })
        .catch(err => {
          
        })
    },
    getChildSkus() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        parentSkus: this.parentSkus
      }
      this.$api['ProductListSku'](params)
        .then(data => {
          if (!data.data) {
          } else {
            // this.childSkus = data.data;
            //this.$store.commit('common/childSkus', data.data) ;
            this.childSkusOptions = [];
            data.data.forEach(i=>{
                this.childSkusOptions.push({
                  label:i,
                  value:i
                })
            })
          
            this.allChildSkus = data.data.map(i=>i);

            // console.log(this.searchData.childSkus);
            // console.log(this.allChildSkus);
            
            this.searchData.childSkus.forEach( (i,index)=>{
                if( !this.allChildSkus.includes(i)){
                    this.searchData.childSkus.splice(index,1)
                } 
            })
            // console.log(object);
            //console.log(this.allSkuLength);
            //let querySku = this.$route.query.sku
            // if ( querySku) {
            //   // 如果子页面跳过来的sku存在store ,并且url上面也存在，代表确实由子页面跳转过来的。
            //   // let sku = this.$store.state.common.childSkus.find(el=>{
            //   //   return el
            //   // })
            //   // this.$store.commit("common/childSkus", childSku);
            //   this.getList({ skus: [querySku] }) ;

            //   this.searchData.childSkus = [querySku]
            // } else {
            //     let skus = data.data.map(i=>{return i});
            //     this.getList({ skus })
            // }
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 问题列表 todo
    plist(arg) {
      this.Loading2 = true ;
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        ...arg
      }
      if (params.date) {
        params.startTime = params.date[0]
        params.endTime = params.date[1]
        
      } else {
        params.startTime = this.dateDefault[0]
        params.endTime = this.dateDefault[1]
      }
      if( !this.searchData.childSkus.length && this.searchData.parentSkus.length ){
          params.skus =this.allChildSkus;
      }else{
          params.skus =this.searchData.childSkus;
      }
      params = this.$.dealObjectValue(params)

      this.$api['problemList'](params)
        .then(data => {
           this.Loading2 = false ;
          if (data.data) {
            this.plistData = data.data
          } else {
            this.plistData = false
          }
        })
        .catch(err => {
          console.log(err)
          this.Loading2 = false ;
        })
    },
    //问题列表跳转
    getPlistDataDetails(v, type) {
      let query

      if (v) {
        query = { problemType: v.problemType }
      } else {
        query = { problemType: 'all' }
      }
      let name
      let val = query.problemType
      if (val == 1) {
        name = 'FBA配送费不对'
      } else if (val == 2) {
        name = '佣金不对'
      } else if (val == 3) {
        name = '仓储费不对'
      } else if (val == 4) {
        name = '客户退款为退货，亚马逊未赔偿'
      } else if (val == 5) {
        name = '入库丢件亚马逊未赔偿'
      } else if (val == 6) {
        name = '亚马逊损坏未赔偿'
      } else {
        if (type == 1) {
          name = '查看所有商品费用情况'
        } else {
          name = '查看所有库存情况'
        }
      }
      query.name = name
      if (this.date) {
        query.startTime = this.date[0]
        query.endTime = this.date[1]
      }
      if (type) {
        query.type = 1
      }
      if( !this.searchData.childSkus.length && this.searchData.parentSkus.length ){
          query.skus =this.allChildSkus;
      }else{
          query.skus =this.searchData.childSkus;
      }
     
      if (type == 1) {
          this.$router.push({
            path: '/SFM/pdetails1',
            query: query
          })
      } else {
        this.$router.push({
          path: '/SFM/pdetails',
          query: query
        })
      }
   
    },
    // 列表
    getList( arg) {
      let params = {
        sellerId: this.sellerId,
        siteId: 1,
        ...this.searchData
      } 
      this.searchTrueData = JSON.parse(JSON.stringify( this.searchData  )) ; //真实搜索的数据
      if(arg){
        params.skus = arg.skus ;
      }else{
        if( !this.searchData.childSkus.length && this.searchData.parentSkus.length ){
           params.skus =this.allChildSkus;
        }else{
          params.skus =this.searchData.childSkus;
        }
      }
      delete params.childSkus
      delete params.parentSkus

      // 如果与日期，要分开赋值
      if (params.date) {
          params.startTime = params.date[0]
          params.endTime = params.date[1]
          this.date = params.date
      } else {
          params.startTime = this.dateDefault[0];
          params.endTime = this.dateDefault[1];
          this.date = this.dateDefault;
      }
      delete params.date ;
      // params.params = this.$.dealObjectValue(params)
       params = this.$.dealObjectValue(params)
      // // console.log(params, "params");
      // delete params.select_country
      // delete params.select_stateList
      // delete params.value5
      // delete params.value6
     
      this.Loading1 = true
      if (this.date) {
        this.plist({
          endTime: this.date[1],
          startTime: this.date[0]
        })
      } else {
        this.plist()
      }
      this.$api['FinanceIndex'](params)
        .then(data => {
          this.listData = data.data
          this.chartList = this.ArrangeData(data.data);
          setTimeout(()=>{
              this.Loading1 = false
          })
          //控制店铺费用是否显示 , 子sku全选或不选要显示
          if( this.searchTrueData.childSkus.length === this.allSkuLength){
            this.skuIsAllSelect = true
          }else if( !this.searchTrueData.parentSkus.length  && !this.searchTrueData.childSkus.length ){
            this.skuIsAllSelect = true
          }else {
            this.skuIsAllSelect = false
          }
          // console.log(this.skuIsAllSelect);
          // console.log(this.searchTrueData);
        })
        .catch(err => {
          console.log(err)
          this.listData = null
          this.Loading1 = false
          this.chartList = this.ArrangeData(null)
    
        })
    },
    // 处理list数据用于echart
    ArrangeData(data) {
      if (!data) {
        return null
      } else {
        let newData = []
        let expenditure = []
        for (let k in data) {
          if (k === 'amountSales') {
            newData.push({
              name: '销售总额',
              value: data[k],
              id: 'b1'
            })
          }
          if (k === 'amountReimbursement') {
            newData.push({
              name: '赔偿',
              value: data[k],
              id: 'b2'
            })
          }
          if (k === 'amountProfit') {
            newData.push({
              name: '利润',
              value: data[k]
            })
          }
          if (k === 'amountReceived') {
            newData.push({
              name: '收款',
              value: data[k]
            })
          }
          if (k === 'amountFulfillment') {
            newData.push({
              name: '正常FBA配送费',
              value: data[k],
              id: 'c1'
            })
            expenditure.push({
              name: '正常FBA配送费',
              value: data[k],
              id: 'c1'
            })
          }
          if (k === 'amountCommission') {
            newData.push({
              name: '正常订单佣金',
              value: data[k],
              id: 'c2'
            })
            expenditure.push({
              name: '正常订单佣金',
              value: data[k],
              id: 'c2'
            })
          }
          if (k === 'amountStorage') {
            newData.push({
              name: '仓储费',
              value: data[k],
              id: 'c3'
            })
            expenditure.push({
              name: '仓储费',
              value: data[k],
              id: 'c3'
            })
          }
          if (k === 'amountRefund') {
            newData.push({
              name: '退款金额',
              value: data[k],
              id: 'c4'
            })
            expenditure.push({
              name: '退款金额',
              value: data[k],
              id: 'c4'
            })
          }
          if (k === 'amountRefundLoss') {
            newData.push({
              name: '退款损失',
              value: data[k],
              id: 'c5'
            })
            expenditure.push({
              name: '退款损失',
              value: data[k],
              id: 'c5'
            })
          }
          if (k === 'amountDisposal') {
            newData.push({
              name: '销毁费用',
              value: data[k],
              id: 'c7'
            })
            expenditure.push({
              name: '销毁费用',
              value: data[k],
              id: 'c7'
            })
          }
          if (k === 'amountAdvert') {
            newData.push({
              name: '广告费用',
              value: data[k],
              id: 'c8'
            })
            expenditure.push({
              name: '广告费用',
              value: data[k],
              id: 'c8'
            })
          }
          if (k === 'amountSubscription' && !this.isChildSku) {
            // 子sku的店铺费用不在饼状图上面展示
            newData.push({
              name: '店铺费用',
              value: data[k],
              id: 'c9'
            })
            expenditure.push({
              name: '店铺费用',
              value: data[k],
              id: 'c9'
            })
          }
          if (k === 'amountRemove') {
            newData.push({
              name: '移除费用',
              value: data[k],
              id: 'c6'
            })
            expenditure.push({
              name: '移除费用',
              value: data[k],
              id: 'c6'
            })
          }
        }
        let dom = document.getElementById('eChart')
        if (this.optionValue == 1) {
          this.drawEchart2(dom, newData)
        } else {
          this.drawEchart2(dom, expenditure)
        }
        return {
          newData: newData,
          expenditure: expenditure
        }
      }
    }
  },
  computed: {
    // selectChildSkus() {
    //   return this.$store.state.common.selectChildSkus
    // },

    isChildSku() {
      let querySku = this.$route.query.sku ;

      //单独选一个子sku不能跳转,并且不展示店铺费用
      if( this.searchTrueData.childSkus.length===1){
           return true
      } 
      else if (querySku ) { //从其他地方跳转过来也不不能跳转,并且不展示店铺费用
        
        this.$set(this.searchData, 'date', [
          this.$route.query.startTime,
          this.$route.query.endTime
        ])
        return true
      } else {
        this.$set(this.searchData, 'date', [
          this.cfuns.getDay(365).computedDay,
          this.cfuns.getDay().today
        ])
        return false
      }
    }
  },
  watch: {
    sellerData() {
        let querySku = this.$route.query.sku
        if ( querySku) {
          this.searchData.childSkus = [querySku]
          this.getList({ skus: [querySku] }) ;
        } else {
          this.getList()
        }
        this.getParentSkus()
    },
    optionValue: {
      handler(n, old) {
        let dom = document.getElementById('eChart')
        if (this.optionValue == 1) {
          this.drawEchart2(dom, this.chartList.newData)
        } else {
          this.drawEchart2(dom, this.chartList.expenditure)
        }
      },
      immediate: false
    },
    '$route.query'(to,from){
        // console.log(to);
        // console.log(from);
        if( !to.sku && from.sku){
              //console.log('object');
              this.searchData.childSkus = [] ;
              this.getList()
        };
        let querySku = this.$route.query.sku
        if ( querySku) {
          this.searchData.childSkus = [querySku]
          this.getList({ skus: [querySku] }) ;
        } else {
          this.getList()
        }
        this.getParentSkus()
    }
  }
}
</script>

<style lang='less' scoped>
.shopFinan {
  /deep/.el-collapse-item__wrap {
    overflow: visible;
  }
}
.header {
  background: #f5f5f5;
  padding: 3px 10px 0;
  height: 36px;
  line-height: 27px;
  border: 1px solid #e5e5e5;
  position: relative;
  .span2 {
    position: absolute;
    right: 10px;
    top: 4px;
  }
}
.item1 {
  padding: 10px 10px 6px 10px;
  position: relative;

  .span2 {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
.item2 {
  padding: 5px 10px 6px;
  border-top: 1px dashed rgb(228, 228, 228);
  position: relative;
  .span2 {
    position: absolute;
    right: 10px;
    top: 5px;
  }
}
.item-header {
  background: #f5f5f5;
  padding: 3px 10px 0;
  height: 28px;
  line-height: 24px;
  border: 1px solid #e5e5e5;
}
.to-right {
  position: absolute;
  right: 10px;
  top: 2px;
}
.q-item {
  padding: 10px 10px;
  cursor: pointer;
  &:hover {
    background: #fafafa;
  }
}
.custom-collapse .el-form-item {
    margin-bottom: 10px;
}
</style>
