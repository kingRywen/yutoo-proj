<template>
  <div style="padding:16px" v-if="$route.name == 'financeAccountBookProfitStatement'">
    <search class="search-form" :searchList="searchConfig" ref="search" @search="search" :defaultValue="defaultValue"></search>
    <div style="margin-top:8px">
      <el-button size="mini" type="primary" plain @click="exportMethod" :loading="exportLoading">导出</el-button>
    </div>
    <template>
      <section v-loading="loading">
        <div style="min-width:800px;display:flex;margin-top:8px" v-show="listData">
          <section style="width:45%" v-if="listData">
            <template v-for="(item, index) in allData">
              <div :class="index >1 ? 'item-header' : 'item-header header1'">
                {{item.name}}
                <span v-if="index < 2">{{item.amountStr}}</span>
              </div>
              <template v-if="item.fmProfitItemList">
                <div :class="index == 1 ? '': 'item2'" v-for="i in item.fmProfitItemList">
                  <span>
                    {{i.name}}
                    <span><img v-if="platImgs[n]" style="display: inline-block;margin-right:4px" width="16" v-for="n in i.platformList" :src="platImgs[n]" /></span>
                  </span>
                  <span
                    class="span2"
                    :id="i.type"
                    :class="{'common_color':!isChildSku,'__pointer':!isChildSku}"
                    @click="getDetails($event, i.name)"
                  >{{i.amountStr?i.amountStr:'-'}}</span>
                </div>
                <div :class="index == 1 ? '': 'item2'" v-if="index > 1">
                  <span>小计</span>
                  <span class="span2">{{item.amountStr?item.amountStr:'-'}}</span>
                </div>
              </template>
            </template>
          </section>

          <section style="width:55%" class="__relative">
            <header class="header">费用占比</header>
            <el-select
              class="to-right"
              v-model="optionValue"
              @change="getCurrentChartData"
              placeholder="费用占比"
              style="max-width:120px"
              size="mini"
            >
              <el-option v-for="item in Options" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <main style="padding:10px 20px;box-size:border-box;" v-loading="Loading2">
              <none-page v-show="chartShow" noBack>暂无数据</none-page>
              <div v-show="!chartShow">
                <v-chart
                  auto-resize
                  :options="currentChartData"
                  @click="handleChartClick"
                  id="eChart"
                  style="min-width:800px; height:600px;overflow:visible"
                ></v-chart>
              </div>
            </main>
          </section>
        </div>
      </section>
    </template>
  </div>
  <router-view v-else></router-view>
</template>

<script>
/* eslint-disable */
import { mapActions, mapState } from 'vuex'
import { downloadFile } from 'Utils/tools.js'
export default {
  /* 

    收款             amountReceived 
    利润             amountProfit
    销售总额          amountSales
    赔偿             amountReimbursement
    收入小计          totalInAmount
    正常FBA配送费     amountFulfillment
    正常订单佣金       amountCommission
    仓储费            amountStorage
    退款金额          amountRefund
    退款损失          amountRefundLoss
    移除费用          amountRemove
    销毁费用          amountDisposal
    广告费用          amountAdvert
    称重成本          amountWeigh
    采购成本          amountPurchase
    贴标成本          amountLabel
    包装成本          amountPackage
    店铺费用          amountSubscription
    运输成本          amountTransport
    支出小计          totalOutAmount 

  */
  props: ['sku'],
  data() {
    return {
      // 对应平台
      platImgs: [
        null,
        require('Assets/images/plat_icon/amazon.png'),
        require('Assets/images/plat_icon/ebay.png'),
        null,
        require('Assets/images/plat_icon/express.jpg'),
        require('Assets/images/plat_icon/wish.png')
      ],
      allData: [],
      currentChartData: {},
      exportLoading: false,
      allChartData: true,
      dataMap: new Map(),
      // 平台列表
      // platformList: [],
      // // 站点列表
      // siteList: [],
      // // 店铺列表
      // storeList: [],
      // 所有父产品SKU
      parentSkus: [],
      // 所有子产品SKU
      variantSkus: [],
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now() - 15 * 3600 * 1000
        }
      },
      skuIsAllSelect: true, //sku是否全选
      allSkuLength: null, //全部sku的length
      btnLoading: false,
      searchTrueData: null, //真实搜索的数据
      // searchData: {
      //   parentSkus: null,
      //   childSkus: null
      // },
      dateDefault: [],
      parentSkusOptions: [],
      childSkusOptions: [],
      __picker: {},
      downloadApi: 'financeDownloadFile',
      // action: `${host}finance/costImport`,
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
      c10: 'c10',
      c11: 'c11',
      c12: 'c12',
      c13: 'c13',
      c14: 'c14',
      optionValue: '1',
      regionalList: [],
      loading: false,
      Loading1: false,
      Loading2: false,
      chartShow: false,
      isChildSku: false,
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
      plistData: [
        { problemType: 5, problemName: '入库丢件亚马逊未赔偿', count: 28 },
        { problemType: 6, problemName: '亚马逊损坏未赔偿', count: 73 },
        { problemType: 1, problemName: 'FBA配送费不对', count: 2 },
        { problemType: 2, problemName: '佣金不对', count: 2 },
        { problemType: 3, problemName: '仓储费不对', count: 2 },
        {
          problemType: 4,
          problemName: '客户退款未退货，亚马逊未赔偿',
          count: 36
        }
      ],
      echartData: {
        title: { textStyle: { fontSize: '14px', color: '#909399' } },
        tooltip: {
          trigger: 'item',
          formatter: '{b}: {c} ({d}%)'
        },
        toolbox: {},
        legend: {
          type: 'scroll',
          orient: 'vertical',
          formatter: {
            _custom: {
              type: 'function',
              display: '<span>ƒ</span> formatter(name)'
            }
          },
          data: [
            '收款',
            '利润',
            '销售总额',
            '赔偿',
            '正常FBA配送费',
            '正常订单佣金',
            '仓储费',
            '退款金额',
            '退款损失',
            '销毁费用',
            '移除费用',
            '广告费用',
            '运输成本',
            '采购成本',
            '贴标成本',
            '包装成本',
            '称重成本',
            '店铺费用'
          ],
          right: '0%',
          top: '20',
          bottom: '20'
        },
        grid: {
          top: '3%',
          left: '3%',
          right: '6%',
          bottom: '1%',
          containLabel: true
        },
        series: [
          {
            name: '占比',
            type: 'pie',
            radius: ['0%', '65%'],
            center: ['45%', '50%'],
            avoidLabelOverlap: true,
            labelLine: {
              normal: { lineStyle: {}, smooth: 0.2, length: 10, length2: 20 }
            },
            itemStyle: {},
            data: [
              {
                value: 180985.95,
                name: '收款'
              },
              {
                value: 178205.95,
                name: '利润'
              },
              { value: 429489.25, name: '销售总额', id: 'b1' },
              { value: 5061.64, name: '赔偿', id: 'b2' },
              { value: 90182.81, name: '正常FBA配送费', id: 'c1' },
              { value: 71397.04, name: '正常订单佣金', id: 'c2' },
              { value: 11860.99, name: '仓储费', id: 'c3' },
              { value: 32185.74, name: '退款金额', id: 'c4' },
              { value: 14631.15, name: '退款损失', id: 'c5' },
              { value: 1428.15, name: '销毁费用', id: 'c7' },
              { value: 0.5, name: '移除费用', id: 'c6' },
              { value: 31398.68, name: '广告费用', id: 'c8' },
              { value: 479.88, name: '店铺费用', id: 'c9' },
              { value: 479.88, name: '运输成本', id: 'c10' },
              { value: 479.88, name: '采购成本', id: 'c11' },
              { value: 479.88, name: '贴标成本', id: 'c12' },
              { value: 479.88, name: '包装成本', id: 'c13' },
              { value: 479.88, name: '称重成本', id: 'c14' }
            ]
          }
        ]
      },
      listData: {
        first: {},
        second: {},
        third: {}
        // amountReceived: 180985.95,
        // amountProfit: 178205.95,
        // amountSales: 429489.25,
        // amountReimbursement: 5061.64,
        // amountFulfillment: 90182.81,
        // amountCommission: 71397.04,
        // amountStorage: 11860.99,
        // amountRefund: 32185.74,
        // amountRefundLoss: 14631.15,
        // amountDisposal: 1428.15,
        // amountRemove: 0.5,
        // amountAdvert: 31398.68,
        // amountSubscription: 479.88
      }
    }
  },
  filters: {
    __formatFlagM(val) {
      return val == null || val === -1 || val === '' ? '-' : val
    }
  },
  computed: {
    ...mapState('finance', ['platformList', 'siteList', 'storeList']),
    defaultValue() {
      return {
        variantIds: this.sku ? [this.sku] : [],
        storeIds: []
      }
    },
    searchConfig() {
      let vm = this
      return [
        {
          placeholder: '平台',
          value: 'platformIds',
          type: 'multiple',
          style: {
            width: '130px'
          },
          children: vm.platformList,
          change(val, data) {
            vm.changeItem('platform', val, data)
          }
        },
        {
          placeholder: '站点',
          value: 'siteIds',
          type: 'multiple',
          style: {
            width: '130px'
          },
          children: vm.siteList,
          show(data) {
            return data.platformIds && data.platformIds[0] != null
          },
          change(val, data) {
            vm.changeItem('siteId', val, data)
          }
        },
        {
          placeholder: '店铺',
          style: {
            width: '130px'
          },
          value: 'storeIds',
          type: 'multiple',
          children: vm.storeList,
          show(data) {
            return data.siteIds && data.siteIds[0] != null
          },
          change(val, data) {
            vm.changeItem('storeId', val, data)
          }
        },
        {
          placeholder: '父产品',
          value: 'parentIds',
          type: 'multiple',
          style: {
            width: '300px'
          },
          children: vm.parentSkus,
          change(val, data) {
            data.variantIds = []
          }
        },
        {
          placeholder: '子产品',
          value: 'variantIds',
          type: 'multiple',
          style: {
            width: '300px'
          },
          children: vm.variantSkus,
          change(val, data) {
            data.parentIds = []
          }
        },
        {
          style: {
            width: '300px'
          },
          placeholder: '统计时间',
          value: 'time',
          type: 'time'
        }
      ]
    }
  },
  created() {
    this.getData()
    this.getMerchantList({ type: 0 })
    // this.getMerchantList(1)
    // this.getMerchantList(2)
    this.getAllParentSku()
    this.getAllVariantSku()
  },
  methods: {
    ...mapActions('finance', ['getMerchantList']),
    handleChartClick(e) {
      // console.log(e);
      if (e.data && e.data.type != null) {
        let { name, type } = e.data
        let query = { title: name, type }
        if (this.date) {
          query.startTime = this.date[0]
          query.endTime = this.date[1]
        }
        this.$router.push({
          name: 'financeAccountBookProfitStatementDetails',
          query: query
        })
      }
    },
    getCurrentChartData() {
      let res = {},
        remove = ['收入', '支出']
      let legend = {
        ...this.echartData.legend,
        data: [...this.dataMap.keys()]
      }
      // optionValue 1 所有费用 2 支出
      if (this.optionValue != '1') {
        remove = ['销售总额', '赔偿', '收款', '利润', '收入', '支出']
      }
      let series = JSON.parse(JSON.stringify(this.echartData.series))
      // legend.data = legend.data.filter(el => remove.indexOf(el) == -1)
      let data = series[0].data.filter(el => {
        return remove.indexOf(el.name) === -1
      })
      series[0].data = data.sort((a,b) => a.value-b.value).filter(el => el.value != null && el.value !== 0)
      console.log(series[0].data);
      
      legend.data = series[0].data.map(el => el.name)
      res = Object.assign({}, this.echartData, {
        legend,
        series
      })
      this.currentChartData = res
    },
    // 获取所有父产品
    getAllParentSku() {
      this.$api[`finance/financeBooksParentSkuList`]({}).then(data => {
        this.parentSkus = data.rows.map(el => ({
          label: el.skuCus,
          value: el.productId
        }))
      })
    },
    // 获取所有子产品
    getAllVariantSku() {
      this.$api[`finance/financeBooksVariantSkuList`]({}).then(data => {
        this.variantSkus = data.rows.map(el => ({
          label: el.skuCus,
          value: el.variantId
        }))
      })
    },

    changeItem(type, val, data) {
      // console.log(type);

      if (type == 'platform') {
        if (!val || !val.length) {
          this.$store.commit('finance/setMerchantList', { rows: [], type: 1 })
          return
        }
        data.siteIds = []
        data.storeIds = []
        this.getMerchantList({ type: 1, params: { platformIds: val } })
      }
      if (type == 'siteId') {
        if (!val || !val.length) {
          this.$store.commit('finance/setMerchantList', { rows: [], type: 2 })
          return
        }
        data.storeIds = []
        this.getMerchantList({ type: 2, params: { siteIds: val } })
      }
    },
    // 搜索
    search(data) {
      let { time, ...info } = data
      let [startTime, endTime] = time || []
      this.getData({ startTime, endTime, ...info })
    },

    getData(params) {
      // this.loading = true
      this.$api[`finance/financeBooksProfitData`](params)
        .then(data => {
          // this.loading = false
          this.allData = data.rows
          this.handlerShowData(data.rows)
          this.setChartData()
        })
        .catch(() => {})
    },
    // 处理成map数据
    handlerShowData(data) {
      this.dataMap.clear()
      let map = this.dataMap
      data.forEach(el => {
        this.dataMap.set(el.name, el)
        if (el.fmProfitItemList) {
          el.fmProfitItemList.forEach(_el => {
            this.dataMap.set(_el.name, _el)
          })
        }
      })
    },
    // 处理表格数据
    setChartData() {
      let data = []
      this.dataMap.forEach(el => {
        data.push({ name: el.name, value: Math.abs(el.amount), type: el.type })
      })
      this.echartData.series[0].data = data

      this.getCurrentChartData()
    },
    handlerForm(params) {
      let { time, ...info } = params
      let { startTime, endTime } = time || []
      return { startTime, endTime, ...info }
    },
    exportMethod() {
      this.exportLoading = true
      this.$api[`finance/financeBooksProfitDataExport`](
        this.handlerForm(this.$refs.search.searchForm)
      )
        .then(data => {
          this.exportLoading = false
          downloadFile(data.path)
        })
        .catch(() => {
          this.exportLoading = false
        })
    },
    //点击table表格的跳转
    getDetails(e, name) {
      let id
      if (typeof e.seriesId === 'undefined') {
        id = e.target.id
      } else {
        id = e.data.id
      }
      // console.log(e, "e");
      if (id) {
        let URL,
          title,
          dataMap = this.dataMap,
          type
        title = name
        type = dataMap.get(name).type
        let query = { title, type }
        if (this.date) {
          query.startTime = this.date[0]
          query.endTime = this.date[1]
        }
        this.$nextTick(() => {
          this.$router.push({
            name: 'financeAccountBookProfitStatementDetails',
            query: query
          })
        })
      } else {
        this.$message.warning('利润和收款无查看功能')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.appMain > div {
  padding: 0 !important;
}
.search-form {
  background: #f2f2f2;
  border-radius: 5px;
  padding: 10px;
}
.header {
  background: #f5f5f5;
  padding: 0 10px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #e5e5e5;
  position: relative;
  .span2 {
    position: absolute;
    right: 10px;
    top: 0;
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
  &.header1 {
    font-weight: bold;
    span {
      float: right;
    }
    &:first-child {
      border-bottom: 1px dashed rgb(228, 228, 228);
    }
    background: #fff;
    border: none;
  }
}
.to-right {
  position: absolute;
  right: 5px;
  top: 5px;
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
.common_color {
  color: #108ee9;
}
.__pointer {
  cursor: pointer;
}
.__relative {
  position: relative;
}
</style>