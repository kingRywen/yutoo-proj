<!--  -->
<template>
  <div class="___common shopFinan">
    <el-search
      :search="search"
      :clearSearch.sync="clearSearch"
      :__picker="cfuns._pickerBefore"
      :clearfield="clearfield"
      activeName="1"
    ></el-search>
    <a v-show="false" ref="exportExcel"></a>
    <!-- 弹框 -->
    <Dialog :options="innerDialogOpts" :events="events" @close="innerDialogOpts.visible = false">
      <transition-type name="fadeIn-fadeOut">
        <component
          v-if="innerDialogOpts.visible"
          :is="dialogComponent.component"
          :params="dialogComponent.params"
          ref="component"
        ></component>
      </transition-type>
    </Dialog>
    <template>
      <div style="margin-top:8px">
        <!-- <el-button size="mini" type="primary" plain @click="newUploadMethod">导入商品费用明细</el-button>
        <el-button size="mini" type="primary" plain @click="toLog">导入日志</el-button>-->
        <el-button size="mini" type="primary" plain @click="toDetails">查看商品费用</el-button>
        <!-- <el-button size="mini" type="primary" plain @click="setPercent">全局配置广告利润监控占比</el-button> -->
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
        <div slot="title">
          <span style="font-size:14px">导入商品费用明细</span>
        </div>
        <div style="position:relative;">
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
        </div>
      </el-dialog>
    </template>
    <template>
      <section v-loading="lineLoading" style="min-width:800px;margin-top:8px;" class="__relative">
        <header class="header">数据展示</header>
        <el-select class="to-right" v-model="dataShow" placeholder="数据展示" style="max-width:120px" size="mini">
          <el-option v-for="item in dataShowOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <main style="padding:10px 20px;box-size:border-box;" v-loading="Loading2">
          <none-page v-show="linechartShow" noBack>暂无数据</none-page>
          <div v-show="!linechartShow">
            <div id="eChart1" style="width:100%;height:300px;overflow:visible" ref="lineChart"></div>
          </div>
        </main>
      </section>
    </template>
    <template>
      <section v-loading="pineLoading" style="min-height:200px">
        <!-- <none-page v-show="!listData" noBack>暂无数据</none-page> -->
        <div style="min-width:800px;display:flex;margin-top:8px" v-show="listData">
          <ElRow :gutter="20">
            <ElCol :span="13">
              <ElRow :gutter="12">
                <ElCol :span="12">
                  <DataTable title="费用情况" :data="priceData" />
                  <DataTable title="退款情况" :data="refundData" />
                </ElCol>
                <ElCol :span="12">
                  <DataTable title="库存情况" :data="stockData" />
                  <DataTable title="订单情况" :data="orderData" />
                </ElCol>
              </ElRow>
            </ElCol>
            <ElCol :span="11">
              <section class="__relative">
                <header class="header">费用占比</header>
                <el-select
                  class="to-right"
                  v-model="optionValue"
                  placeholder="费用占比"
                  style="
                  max-width:120px"
                  size="mini"
                >
                  <el-option v-for="item in Options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <main
                  style="padding:10px 20px;box-size:border-box;border: 1px solid #dcdfe6;border-top: 0;"
                  v-loading="Loading2"
                >
                  <none-page v-show="chartShow" noBack>暂无数据</none-page>
                  <div v-show="!chartShow">
                    <echart
                      auto-resize
                      :options="echartData"
                      id="eChart"
                      style="min-width:100px; height:600px;overflow:visible"
                    ></echart>
                  </div>
                </main>
              </section>
            </ElCol>
          </ElRow>
          <!-- <section style="width:48%" class="__relative">
            
          </section>-->
        </div>
      </section>
    </template>
    <template>
      <section v-loading="Loading1" style="min-height:200px">
        <div style="min-width:800px;display:flex;margin-top:8px;margin-bottom:40px;" v-show="listData">
          <section style="width:100%;min-height:100px;" v-if="listData">
            <header class="header">
              金额情况
              <span
                v-show="plistData"
                class="span2 __pointer common_color"
                @click="getPlistDataDetails(null)"
              >查看所有商品费用情况</span>
            </header>
            <main>
              <div class="q-item common_color" v-for="(v,k) in plistData" @click="getPlistDataDetails(v)">
                <span class="span2" :key="v.problemType">{{v.problemName}}({{v.count}})</span>
              </div>
              <none-page v-show="!plistData" noBack>暂无数据</none-page>
            </main>
          </section>
        </div>
      </section>
    </template>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from 'Config'
import chartOption from '@/api/json'
import dayjs from 'dayjs';
let echarts = require('echarts')
import Dialog from '@/components/MainLayout/src/dialog.vue'
export default {
  components: { Dialog },
  props: ['type'],
  provide() {
    return {
      getList: this.getList,
      dataShowFunc: this.dataShowFunc
    }
  },
  //   beforeRouteUpdate(to, from, next) {
  //     if (from.name === "SFM") {
  //       next();
  //       return;
  //     }
  //     if (this.sellerId && this.siteId) {
  //       this.getParent();
  //     }
  //     next();
  //   },
  data() {
    let vm = this
    return {
      clearfield: ['startTime', 'endTime', 'value3', 'value4'],
      //弹框的配置
      innerDialogOpts: {
        visible: false,
        size: null,
        width: null,
        closeOnClickModal: true,
        title: null,
        okBtnText: '',
        cancelBtnText: ''
      },
      dialogComponent: {}, //弹框的组件
      //弹框的事件
      events: {
        open() {
          setTimeout(() => {
            vm.$nextTick(() => {
              // 弹窗里的组件
              let component = vm.$refs.component
              if (!component) {
                return
              }
              // 调用组件初始化函数
              component && component._initData && component._initData()
            })
          })
        },
        close() {
          // 弹窗里的组件
          let component = vm.$refs.component
          // 调用组件关闭函数
          component && component._close && component._close()
        },
        handleOkClick() {
          let component = vm.$refs.component
          // if (!component) {
          //   return
          // }
          if (!component._submit) {
            throw new Error('确保弹窗组件内定义了_submit方法')
          }
          return (
            component &&
            component._submit &&
            component._submit().then(res => {
              if (res) {
                vm.innerDialogOpts.visible = false
                // vm.getList(undefined, res === "reset");
              }
            })
          )
        }
      },
      // 线性图
      chartListLine: null,
      echartData2: null,
      dataShow: '1',
      dataShowOptions: [
        {
          value: '1',
          label: '合计数据'
        },
        {
          value: '2',
          label: '自然'
        },
        {
          value: '3',
          label: '广告'
        }
      ],
      optionValue: '1',
      Options: [
        {
          value: '1',
          label: '费用情况'
        },
        // {
        //   value: "2",
        //   label: "退款情况"
        // },
        {
          value: '3',
          label: '库存情况'
        },
        {
          value: '4',
          label: '订单情况'
        }
      ],
      Loading1: false,
      Loading2: false,
      chartShow: false,
      // 搜索
      search: {
        loading: false,
        pacDate: true,
        default: [
          this.cfuns.getDay(365).computedDay,
          dayjs().subtract(15,'hour').format('YYYY-MM-DD')
        ],
        otherDefault: {
          value5: this.$store.state.common.selectParentSkus,
          value6: this.$store.state.common.selectChildSkus
        },
        parent: true,
        timeText: '统计时间',
        child: true
      },
      clearSearch: null,
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

      lineLoading: false,
      pineLoading: false,

      lineChart: '', //折线图
      linechartShow: false ///是否显示
    }
  },
  created() {
    if (this.sellerId && this.siteId) {
      this.getParent()
    }
  },
  methods: {
    newUploadMethod() {
      this.$dialog({
        title: '导入商品费用明细',
        size: 'small',
        params: {
          success() {
            this.closeDialog()
          }
        },
        component: () => import('../dialogs/Upload.vue')
      })
    },
    closeDialog() {
      this.innerDialogOpts.visible = false
    },
    dataShowFunc() {
      this.dataShow = '1'
    },
    setPercent() {
      this.$dialog({
        title: '全局配置广告利润监控占比',
        size: 'small',
        params: {
          sellerId: this.sellerId,
          siteId: this.siteId
        },
        component: () => import('../dialogs/setPercent.vue'),
        okBtnText: '确认',
        cancelBtnText: '取消'
      })
    },
    //弹窗
    $dialog({
      title,
      width,
      size,
      component,
      okBtnText,
      cancelBtnText,
      params,
      appendToBody = false
    }) {
      component().then(com => {
        //console.log(com);
        com.default.inheritAttrs = false
        this.dialogComponent.component = com.default
        this.dialogComponent.params = params
        this.innerDialogOpts.title = title
        this.innerDialogOpts.visible = true
        this.innerDialogOpts.width = width
        this.innerDialogOpts.appendToBody = appendToBody
        this.innerDialogOpts.size = size
        this.innerDialogOpts.okBtnText = okBtnText
        this.innerDialogOpts.cancelBtnText = cancelBtnText
      })
    },
    // toLog
    toLog() {
      this.$router.push({
        name: 'Log'
      })
    },
    toDetails() {
      this.$router.push({
        name: 'ProDetails'
      })
    },
    // 线性图
    drawEchart1(list, times) {
      if (this.lineChart) {
        this.lineChart.dispose()
        this.lineChart = null
      }
      this.lineChart = echarts.init(this.$refs.lineChart)

      let legend = [] //标题
      list.forEach(i => {
        (i.type = 'line'), legend.push(i.name)
      })

      this.lineChart.setOption({
        xAxis: {
          type: 'category',
          data: times,
          triggerEvent: true,
          axisLabel: {
            rotate: 45
          }
          // axisLabel: {
          //   rotate: 45,
          // }
        },
        legend: {
          data: legend
        },
        tooltip: {
            trigger: 'axis',
            confine:true,
        	padding:[0,5,10,5],
        	formatter:(params, ticket, callback) =>{	
                let str=params[0].axisValue;
        		for(var i = 0;i<params.length;i++){
        			if(!params[i].value && params[i].value !== 0) delete params[i]
            }
            params = params.filter(
              el => !(el.data == 0 || el.data === '' || el.data == null || isNaN(el.data))
            )
            if (!params.length) {
              return
            }
                params.forEach(i=>{
                    if(i.seriesName.indexOf('率')!==-1 || i.seriesName.indexOf('占比')!==-1){
                        str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+Math.ceil(i.data*10000)/100+'%'+'</div>';
                    }else{
                        str+='<div>'+'<i style="background-color: ' + i.color + '; display:inline-block;width:12px;height:12px;border-radius:6px; "></i> '+i.seriesName+':'+i.data+'</div>';
                    }
                })
                return str;
            }
        },
        // 布局
        grid: {
          left: '6%',
          right: '8%',
          bottom: '11%', // 防止 dataZoom 重叠
          containLabel: true
        },

        toolbox: {
          top: '-50px',
          feature: {
            dataZoom: {
              yAxisIndex: 'none' //不启用y轴的选中
            }
          }
        },

        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100,
            zoomOnMouseWheel: false
          },
          {
            start: 0,
            end: 100,
            handleIcon:
              'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
              color: '#fff',
              shadowBlur: 3,
              shadowColor: 'rgba(0, 0, 0, 0.6)',
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        yAxis: {
          type: 'value'
        },
        series: list
      })

      setTimeout(() => {
        this.lineChart.dispatchAction({
          type: 'takeGlobalCursor',
          key: 'dataZoomSelect',
          // 启动或关闭
          dataZoomSelectActive: true
        })
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
            return `${val.seriesName}</br>${val.name}: ${val.data.value}(${percent})`
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
        return `${val.seriesName}</br>${val.name}: ${val.data.value}(${percent})`
      }
      //legend
      option.legend.data = []
      option.legend.right = '0%'
      option.legend.top = '20'
      option.legend.bottom = '20'
      //   option.legend.orient = "vertical";
      option.grid.top = '10%'
      if (!list) {
        //this.chartShow = false;
      }
      option.series = [
        {
          name: '占比',
          type: 'pie',
          radius: ['0%', '60%'],
          center: ['50%', '50%'],
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
        //this.chartShow = false;
      }
      this.echartData = option
      //   et.on("click", this.getDetails);
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
      params.append('platformId', this.platformId)
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
            this.getParent()
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
    async getParent() {
      // todo
      // let storeParent = this.$store.state.common.parentSkus;
      // if (storeParent) {
      //   return;
      // }
      let parent = await this.getParentSkus()
      if (parent.code === 0) {
        this.parentSkus = parent.data
        // this.$store.commit('common/parentSkus', this.parentSkus)
        if (this.parentSkus) {
          this.Loading1 = true
          this.getChildSkus()
        }
      } else {
      }
    },
    getParentSkus() {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      }
      return this.$api['productListParentSku1'](params)
        .then(data => {
          return data
        })
        .catch(err => {
          return false
          console.log(err)
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
            //this.$store.commit('common/childSkus', data.data)
            this.$nextTick(() => {
              let childSku = this.$store.state.common.childSkus_1

              let querySku =
                this.$store.state.common.selectParentSkus ||
                this.$store.state.common.selectChildSkus
              //console.log(querySku);
              if (querySku) {
                // 如果子页面跳过来的sku存在store ,并且url上面也存在，代表确实由子页面跳转过来的。
                // let sku = this.$store.state.common.childSkus.find(el=>{
                //   return el
                // })
                // this.$store.commit("common/childSkus", childSku);
                if (this.type) {
                  this.getList({ skus: querySku })
                } else {
                  this.getList({ parentSkus: querySku })
                }
              } else {
                this.getList()
              }
            })
          }
        })
        .catch(err => {
          console.log(err)
        })
    },
    // 问题列表 todo
    plist(arg) {
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId,
        ...arg
      }
      if (params.date) {
        params.startTime = params.date[0]
        params.endTime = params.date[1]
        this.date = params.date
      } else {
        params.startTime = this.search.default[0]
        params.endTime = this.search.default[1]
      }
      params.skus = this.selectChildSkus
      params = this.$.dealObjectValue(params)
      // console.log(params, "params");
      this.Loading1 = true
      return this.$api['productInfoProblemList'](params)
        .then(data => {
          if (data.data) {
            // let newArr = this.priceData.find(e => {
            //   return e.label === '广告费用'
            // })
            // let newStr = data.data.findIndex(e => {
            //   return e.problemName === '广告占比高'
            // })
            // if (!newArr.value) data.data.splice(newStr, 1)
            this.plistData = data.data
          } else {
            this.Loading1 = false
          }
          this.Loading1 = false
          // todo
          return true
        })
        .catch(err => {
          console.log(err)
          return true
        })
    },
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
        name = '客户退款未退货，亚马逊未赔偿'
      } else if (val == 7) {
        name = '利润低'
      } else if (val == 8) {
        name = '退款损失'
      } else if (val === 9) {
        name = '广告占比高'
      } else {
        name = '查看所有'
      }
      query.name = name
      if (this.date) {
        query.startTime = this.date[0]
        query.endTime = this.date[1]
      }
      this.$nextTick(() => {
        this.$router.push({
          name: 'Prolist',
          query: query
        })
      })
    },
    // 列表
    getList(arg) {
      let params = {
        sellerId: this.sellerId,
        siteId: 1,
        ...arg
      }
      if (arg && arg.parentSkus) {
        params.parentSkus = arg.parentSkus || []
      } else {
        params.skus = this.selectChildSkus || []
      }
      if (arg && !arg.parentSkus) {
        delete params.parentSkus
      }
      if (arg && !arg.skus) {
        delete params.skus
      }
      // 如果与日期，要分开赋值
      if (params.date) {
        params.startTime = params.date[0]
        params.endTime = params.date[1]
        this.date = params.date
      } else {
        params.startTime = this.search.default[0]
        params.endTime = this.search.default[1]
        this.date = [this.search.default[0], this.search.default[1]]
      }
      params.params = this.$.dealObjectValue(params)
	  if(params.value3 && params.value3.length) params.parentSkus = params.value3
	  if(params.value4 && params.value4.length) params.skus = params.value4
      // console.log(params, "params");
      delete params.select_country
      delete params.select_stateList
      delete params.value3
      delete params.value4
	  delete params.value5
	  delete params.value6
      delete params.date
      if (this.date) {
        this.plist({
          endTime: this.date[1],
          startTime: this.date[0]
        })
      } else {
        this.plist()
      }
      //   线性图
      this.getlineData(params)
      this.pineLoading = true
      return this.$api['productInfoOtherAnalysis'](params)
        .then(data => {
          this.listData = data.data
          //   console.log(this.listData, "this.listData");
          this.pineLoading = false
          // 饼状图
          this.chartList = this.ArrangeData(data.data)
          return true
        })
        .catch(err => {
          this.listData = null
          this.pineLoading = false
          this.chartList = this.ArrangeData(null)
          return true
        })
    },
    // 数据展示 线性图
    getlineData(arg) {
      this.lineLoading = true
      this.$api['productInfoTotalAnalysis'](arg)
        .then(data => {
          this.lineLoading = false
          if (!data.data.length) {
            this.linechartShow = true
          } else {
            this.linechartShow = false
          }
          //console.log(data, "数据展示，线性图");
          this.chartListLine = this.ArrangeDataLine(data.data)
          // console.log('6+66666')
          // console.log(this.chartListLine)
          if (this.dataShow == '1') {
            this.drawEchart1(this.chartListLine.total, this.chartListLine.times)
          } else if (this.dataShow == '2') {
            this.drawEchart1(
              this.chartListLine.normalSearch,
              this.chartListLine.times
            )
          } else {
            this.drawEchart1(this.chartListLine.ad, this.chartListLine.times)
          }
        })
        .catch(() => {
          this.lineLoading = false
        })
    },
    // 处理数据展示（线性图）
    ArrangeDataLine(data) {
      if (!data) return

      //自然搜索的数据
      let normalSearch = [
        { name: '自然访客数', data: [] },
        { name: '自然订单量', data: [] },
        { name: '自然转化率', data: [] },
        { name: '自然成交额', data: [] },
        { name: '自然客单价', data: [] }
      ]
      //广告数据
      let ad = [
        { name: '广告访客数', data: [] },
        { name: '广告订单量', data: [] },
        { name: '广告转化率', data: [] },
        { name: '广告成交额', data: [] },
        { name: '广告客单价', data: [] },

        { name: '广告曝光量', data: [] },
        { name: '广告点击量', data: [] },
        { name: '广告点击率', data: [] },
        { name: '广告CPC', data: [] },
        { name: '广告花费占比', data: [] },
        { name: '广告花费', data: [] }
      ]
      //合计数据
      let total = [
        { name: '访客总数', data: [] },
        { name: '订单量总数', data: [] },
        { name: '转化率总数', data: [] },
        { name: '成交额总数', data: [] },
        { name: '客单价总数', data: [] }
      ]

      let times = [] //时间

      data.forEach(el => {
        times.push(el.statTime)

        for (let k in el) {
          //自然的
          if (k === 'normalSessions') {
            normalSearch[0].data.push(el[k])
          }
          if (k === 'normalOrderCnt') {
            normalSearch[1].data.push(el[k])
          }
          if (k === 'normalConversionRate') {
            normalSearch[2].data.push(el[k])
          }
          if (k === 'normalSales') {
            normalSearch[3].data.push(el[k])
          }
          if (k === 'normalPricePerOrder') {
            normalSearch[4].data.push(el[k])
          }

          //广告的
          if (k === 'advertSessions') {
            ad[0].data.push(el[k])
          }
          if (k === 'advertOrderCnt') {
            ad[1].data.push(el[k])
          }
          if (k === 'advertConversionRate') {
            ad[2].data.push(el[k])
          }
          if (k === 'advertSales') {
            ad[3].data.push(el[k])
          }
          if (k === 'advertPricePerOrder') {
            ad[4].data.push(el[k])
          }

          if (k === 'advertExposure') {
            ad[5].data.push(el[k])
          }
          if (k === 'advertHits') {
            ad[6].data.push(el[k])
          }
          if (k === 'advertClickRates') {
            ad[7].data.push(el[k])
          }
          if (k === 'advertCpc') {
            ad[8].data.push(el[k])
          }
          if (k === 'advertAcos') {
            ad[9].data.push(el[k])
          }
          if (k === 'advertCost') {
            ad[10].data.push(el[k])
          }
          //合计
          if (k === 'sessions') {
            total[0].data.push(el[k])
          }
          if (k === 'orderCnt') {
            total[1].data.push(el[k])
          }
          if (k === 'conversionRate') {
            total[2].data.push(el[k])
          }
          if (k === 'sales') {
            total[3].data.push(el[k])
          }
          if (k === 'pricePerOrder') {
            total[4].data.push(el[k])
          }
        }
      })
      // console.log(normalSearch);
      // console.log(ad);
      // console.log(total);
      return {
        normalSearch,
        ad,
        total,
        times
      }
    },
    // 处理list数据用于echart（饼状图）
    ArrangeData(data) {
      if (!data) {
        return null
      } else {
        let type1 = []
        let type2 = []
        let type3 = []
        let type4 = []
        for (let k in data) {
          // if (k === "fulfillmentFee") {
          //   type1.push({
          //     name: "FBA总配送费",
          //     value: data[k]
          //   });
          // }
          if (k === 'avgFulfillmentFee') {
            type1.push({
              name: 'FBA平均配送费',
              value: data[k]
            })
          }
          if (k === 'fulfillmentFee') {
            type1.push({
              name: 'FBA总配送费',
              value: data[k]
            })
          }
          if (k === 'commission') {
            type1.push({
              name: '佣金总金额',
              value: data[k]
            })
          }
          // if (k === "avgCommissionRate") {
          //   type1.push({
          //     name: "平均佣金费率",
          //     value: data[k]
          //   });
          // }
          // if (k === 'storageFeeReceivable') {
          //   type1.push({
          //     name: '理论应收仓储费',
          //     value: data[k]
          //   })
          // }
          if (k === 'storageFeeActual') {
            type1.push({
              name: '实际收取仓储费',
              value: data[k]
            })
          }
          if (k === 'advertCost') {
            type1.push({
              name: '广告费用',
              value: data[k]
            })
          }
          if (k === 'refundCnt') {
            type2.push({
              name: '退款件数',
              value: data[k]
            })
          }
          if (k === 'refundSales') {
            type1.push({
              name: '退款销售额',
              value: data[k]
            })
          }
          if (k === 'refundRate') {
            type2.push({
              name: '退货率',
              value: data[k]
            })
          }
          if (k === 'refundLoss') {
            type1.push({
              name: '退款损失',
              value: data[k]
            })
          }
          if (k === 'refundLossProportion') {
            type2.push({
              name: '退款损失占销售额比率',
              value: data[k]
            })
          }
          if (k === 'advertProportion') {
            type2.push({
              name: '广告费占未退款销售额比例',
              value: data[k]
            })
          }
          if (k === 'quantityActive') {
            type3.push({
              name: '可售库存量',
              value: data[k]
            })
          }
          if (k === 'quantityInactive') {
            type3.push({
              name: '不可售库存量',
              value: data[k]
            })
          }
          if (k === 'invAge0To90Days') {
            type3.push({
              name: '库龄在0-90天内可售商品总数',
              value: data[k]
            })
          }
          if (k === 'invAge91To180Days') {
            type3.push({
              name: '库龄在91-180天内可售商品总数',
              value: data[k]
            })
          }
          if (k === 'invAge181To270Days') {
            type3.push({
              name: '库龄在181-270天内可售商品总数',
              value: data[k]
            })
          }
          if (k === 'invAge271To365Days') {
            type3.push({
              name: '库龄在271-365天内可售商品总数',
              value: data[k]
            })
          }
          if (k === 'invAge365PlusDays') {
            type3.push({
              name: '库龄超过365天可售商品总数',
              value: data[k]
            })
          }
          if (k === 'cubage') {
            type3.push({
              name: '仓库体积',
              value: data[k]
            })
          }
          if (k === 'sellableDays') {
            type3.push({
              name: '库存可售天数',
              value: data[k]
            })
          }
          if (k === 'shipped') {
            type4.push({
              name: '已配送订单数',
              value: data[k]
            })
          }
          if (k === 'unshipped') {
            type4.push({
              name: '未配送订单数',
              value: data[k]
            })
          }
          if (k === 'pending') {
            type4.push({
              name: 'Pending订单数',
              value: data[k]
            })
          }
          if (k === 'productCntPerOrder') {
            type4.push({
              name: '每个订单平均产品数',
              value: data[k]
            })
          }
        }
        //console.log(this.chartList);
        let dom = document.getElementById('eChart')
        if (this.optionValue == 1) {
          this.drawEchart2(dom, type1)
        } else if (this.optionValue == 2) {
          this.drawEchart2(dom, type2)
        } else if (this.optionValue == 3) {
          this.drawEchart2(dom, type3)
        } else if (this.optionValue == 4) {
          this.drawEchart2(dom, type4)
        }
        return {
          type1: type1,
          type2: type2,
          type3: type3,
          type4: type4
        }
      }
    }
  },
  computed: {
    priceData() {
      let arr = [],
        obj = this.chartList
      if (obj) {
        console.log(obj)
        obj.type1.forEach(el => {
          if (el.name.indexOf('率') !== -1) {
            let value = Math.ceil(el.value * 10000) / 100 + '%'
            arr.push({
              label: el.name,
              value
            })
          } else {
            arr.push({
              label: el.name,
              value: el.value ? '$' + el.value : el.value
            })
          }
        })
      }
      return arr
    },
    refundData() {
      let arr = [],
        obj = this.chartList
      if (obj) {
        obj.type2.forEach(el => {
          if (el.name.indexOf('率') !== -1) {
            let value = Math.ceil(el.value * 10000) / 100 + '%'
            arr.push({
              label: el.name,
              value
            })
          } else {
            arr.push({
              label: el.name,
              value: el.value
            })
          }
        })
      }
      return arr
    },
    stockData() {
      let arr = [],
        obj = this.chartList
      if (obj) {
        obj.type3.forEach(el => {
          arr.push({
            label: el.name,
            value: el.value
          })
        })
      }
      return arr
    },
    orderData() {
      let arr = [],
        obj = this.chartList
      if (obj) {
        obj.type4.forEach(el => {
          arr.push({
            label: el.name,
            value: el.value
          })
        })
      }
      return arr
    },
    selectChildSkus() {
      return this.$store.state.common.selectChildSkus
    },
    isChildSku() {
      let querySku = this.$route.query.sku
      let isChildSku = this.$store.state.common.isChildSku
      if (querySku && isChildSku) {
        this.$set(this.search, 'default', [
          this.$route.query.startTime,
          this.$route.query.endTime
        ])
        return true
      } else {
        this.$set(this.search, 'default', [
          this.cfuns.getDay(365).computedDay,
          this.cfuns.getDay().today
        ])
        return false
      }
    }
  },
  watch: {
    sellerData() {
      this.getParent()
    },
    dataShow(val) {
      console.log(val)
    },
    dataShow: {
      handler(n, old) {
        // console.log(this.chartList);
        if (n == 1) {
          //this.drawEchart1(this.chartListLine.normalSearch,this.chartListLine.times);
          //console.log(this.chartListLine.total);
          this.drawEchart1(this.chartListLine.total, this.chartListLine.times)
        } else if (n == 2) {
          //this.chartListLine.ad,this.chartListLine.times);
          //console.log(this.chartListLine.normalSearch);
          this.drawEchart1(
            this.chartListLine.normalSearch,
            this.chartListLine.times
          )
        } else if (n == 3) {
          // console.log(this.chartListLine.ad);
          this.drawEchart1(this.chartListLine.ad, this.chartListLine.times)
        }
      },
      immediate: false
    },
    optionValue: {
      handler(n, old) {
        console.log(this.chartList)
        let dom = document.getElementById('eChart')
        if (n == 1) {
          this.drawEchart2(dom, this.chartList.type1)
        } else if (n == 2) {
          this.drawEchart2(dom, this.chartList.type2)
        } else if (n == 3) {
          this.drawEchart2(dom, this.chartList.type3)
        } else if (n == 4) {
          this.drawEchart2(dom, this.chartList.type4)
        }
      },
      immediate: false
    }
  }
}
</script>

<style lang='less' scoped>
main {
  // background: #f5f7fa;
  border: 1px solid #dcdfe6;
  border-top: 0;
}
.shopFinan {
  /deep/.el-collapse-item__wrap {
    overflow: visible;
  }
}
.header {
  background: #f5f7fa;
  padding: 3px 10px 0;
  height: 36px;
  line-height: 27px;
  border: 1px solid #dcdfe6;
  position: relative;
  .span2 {
    position: absolute;
    right: 10px;
    top: 4px;
  }
}
.item1 {
  padding: 10px 10px;
  position: relative;
  .span2 {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}
.item2 {
  padding: 0px 10px 10px;
  position: relative;
  .span2 {
    position: absolute;
    right: 10px;
    top: 0px;
  }
}
.item-header {
  background: #f5f7fa;
  padding: 3px 10px 0;
  height: 28px;
  line-height: 24px;
  border: 1px solid #dcdfe6;
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
</style>
