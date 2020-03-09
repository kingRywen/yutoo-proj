<!-- 查看单个竞品分析 -->
<template>
  <!-- 上线要改成v-show这个 -->
  <!-- <div class='checkProductAnalysis' v-show="this.productDetail"> -->
  <div class='checkProductAnalysis'>
    <!-- 添加监控弹窗 -->
    <el-dialog top="30vh" title="添加监控" :visible.sync="dialogMonitorVisible" width="24%">
      <div class='dialogContent' style="overflow:hidden;">
        <div style="margin-top:15px;">
          <div class="block" style='margin-top:15px;display:flex;justify-content:center'>
            <el-date-picker v-model="monitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
            </el-date-picker>
          </div>
        </div>
        <div class='saveContainer' style='text-align:center;margin-top:40px;'>
          <el-button type="primary" size="large" style='width:50%' @click="addMonitoring">确认</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 主体 -->

    <div class='main'>
      <!-- 更新时间，截止时间，取消监控 -->
      <!-- v-if中解释：如果url上面没有monitorTo，证明不是从店铺分析跳过来的。这时候就要显示更新时间和监控时间。如果有monitorTo，则表示是从店铺分析跳转过来的。就要隐藏时间 -->
      <!-- <ul class='tabRight' v-if="!this.$route.query.monitorTo?(this.taskStatus&&this.tabNumber!=2):false">
        <li>
          更新时间：
          <span class='timeColor'>{{this.taskStatus.updateTime}}</span>
        </li>

        <li>
          截止时间：
          <span class='timeColor' v-loading="load.moniLoading">{{this.taskStatus.monitorFlag==1?this.taskStatus.monitorTo:"未开启监控"}}</span>
        </li>

        <li>
          <el-button type="success" class='cancelBtn' @click="addOrCancel">
            {{this.taskStatus.monitorFlag==1?"取消监控":"开启监控"}}
          </el-button>
        </li>
      </ul> -->
      <!-- tabs选项卡 -->
      <el-tabs type="border-card" v-model="tabNumber" @tab-click="ChangTABS">

        <!-- tab1详情 -->
        <el-tab-pane label="商品详情" name="0">
          <!-- 1.图片文字详情 -->
          <div class="detalisContainer">
            <!-- 1.1图片 -->
            <div class='imgContainer' v-if="this.productDetail">
              <!-- 1.1.1大图 -->
              <div class='bigImg'>
                <img :src="this.bigImg===''?this.productDetail.imageUrlList[0].medium:this.bigImg">
              </div>
              <!-- 1.1.2小图 -->
              <div class='smallImg'>
                <li :class="item.className" v-for="(item,index) in this.productDetail.imageUrlList" @click.prevent="selcetImg(item,index)">
                  <img :src="item.small">
                </li>
              </div>
            </div>
            <!-- 1.2文字 -->
            <div class='textContainer' v-if="this.productDetail">
              <!-- 标题 -->
              <header class='header'>
                {{this.productDetail.title}}
              </header>
              <!-- ASIN -->
              <div class='asinCon'>
                <span class='asin'>ASIN:</span>
                <span>{{this.productDetail.sku}}</span>
              </div>
              <!-- 表格 -->
              <div class='detaliCon'>
                <li>
                  <span>价格：</span>
                  <span>{{this.productDetail.price||'-'}}</span>
                </li>
                <li v-if="this.productDetail.skuAttr[1]">
                  <span>{{this.productDetail.skuAttr[1].attrName||"-"}}：</span>
                  <span>{{this.productDetail.skuAttr[1].attrValue||"-"}}</span>
                </li>
                <li>
                  <span>总评论数：</span>
                  <span>{{this.productDetail.reviewCnt||"-"}}</span>
                </li>
                <li v-if="this.productDetail.skuAttr[0]">
                  <span>{{this.productDetail.skuAttr[0].attrName||"-"}}：</span>
                  <span>{{this.productDetail.skuAttr[0].attrValue||"-"}}</span>
                </li>
                <li>
                  <span>评分：</span>
                  <span>{{this.productDetail.starCnt||"-"}}</span>
                </li>
                <li>
                  <span>buy box所有者：</span>
                  <span>{{this.productDetail.buybox||"-"}}</span>
                </li>
                <li>
                  <span>AQ数：</span>
                  <span>{{this.productDetail.qaCnt||"-"}}</span>
                </li>
                <li>
                  <span>重量：</span>
                  <span>{{this.productDetail.weight||"-"}}</span>
                </li>
                <li>
                  <span>上架时间：</span>
                  <span>{{this.productDetail.releaseDate||"-"}}</span>
                </li>
                <li>
                  <span>跟卖数量：</span>
                  <span>{{this.productDetail.sellerCnt||"0"}}</span>
                </li>
                <li>
                  <span>发货方式：</span>
                  <span>{{this.productDetail.fbpFlag==0?"自动发货":this.productDetail.fbpFlag==1?"平台发货":"-"}}</span>
                </li>
              </div>
            </div>
          </div>
          <!-- 2.产品详情折叠板 -->
          <div class="detalisExplainCon" v-if="this.productDetail">
            <el-collapse>
              <el-collapse-item title="产品详情" name="1">
                <!-- 产品卖点 -->
                <div class='productSellingPoint'>
                  <span class='icon'></span>
                  <span>产品卖点</span>
                  <el-button type="success" plain class='fRight' @click="copySellPoint('1','text','input')">复制卖点</el-button>
                </div>
                <div class='labels' id="text" v-if="this.productDetail">
                  <el-tag v-if="this.productDetail.featureList" v-for="(item,index) in this.productDetail.featureList" :key="index">{{item}}</el-tag>
                  <span v-if="!this.productDetail.featureList">暂无数据</span>
                  <textarea id="input" style='position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;'>隐藏的放要复制的内容</textarea>
                </div>
                <!-- 产品描述 -->
                <div class='ProductDescription'>
                  <span class='icon'></span>
                  <span>产品描述</span>
                  <el-button type="success" plain class='fRight' @click="copySellPoint('2','text2','input2')">复制描述</el-button>
                </div>
                <div class='labels' id="text2">
                  {{this.productDetail.description?this.productDetail.description:"暂无相关描述"}}
                  <textarea id="input2" style='position: absolute;top: 0;left: 0;opacity: 0;z-index: -10;'>隐藏的放要复制的内容</textarea>
                </div>
              </el-collapse-item>
            </el-collapse>
          </div>
          <!-- 图表一日新增评价数 -->
          <div class='NewDailyEvaluation'>
            <!-- 头部 -->
            <header class='header'>
              日新增评价数
            </header>
            <!-- 选项 -->
            <main class='main'>
              <!-- 筛选项 -->
              <!-- <div class='optionCon'>
                <span>筛选项：</span>
                <span class='optionBtn' :class="{'optionBtnSelect' : isSelected}" @click="changeOptionSelect">所有产品</span>
                <span class='optionBtn' :class="{'optionBtnSelect' : !isSelected}" @click="addNew">新品</span>
                <div class='optionConInputDaysCon' v-show="!isSelected">
                  <el-input v-model="inputDays" style='width:80px'></el-input>
                  天以内
                  <el-button type="primary" style='margin-left:15px;'>确认</el-button>
                </div>
              </div> -->
              <!-- 曲线选择 -->
              <div class='diagramCon'>
                <span style='margin-left:1em;'>曲线：</span>
                <span class='diagramBtn' :class="{'diagramBtnSelect' : item.isSelected2}" v-for="(item,i) in this.diagramList" :key="i" @click="changeDiagramBtnSelect(item,i)">{{item.name}}</span>
              </div>
              <!-- 曲线图 -->
              <div class='commonChartCon'>
                <el-tabs type="border-card" :value='tabs.datCountTabsValue' @tab-click="dayCountChange">
                  <el-tab-pane label="7天" name='7'></el-tab-pane>
                  <el-tab-pane label="30天" name="30"></el-tab-pane>
                  <!-- echart日增评分 -->
                  <div v-loading="echart.isScoreCountShowLoading">
                    <none-page v-show="this.echart.isScoreCountShow" no-back>该时间段暂无数据</none-page>
                    <!-- <div v-show="this.echart.isScoreCountShow">该时间段暂无数据</div> -->
                    <div v-show="!this.echart.isScoreCountShow" id="ScoreChart" :style="{width: '1000px', height: '500px'}"></div>
                  </div>
                </el-tabs>
                <!-- 曲线图日期 -->
                <div class="datePickerCon">
                  选择日期：
                  <el-date-picker prefix-icon="el-icon-date" :clearable="false" v-model="dateValue.value1" value-format='yyyy-M-d' type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                  </el-date-picker>
                  <el-button type="primary" style='margin-left:15px;height:34px;line-height:10px;' @click="datePickApi">确认</el-button>
                </div>
              </div>
            </main>
          </div>
          <!-- 图标二评分变化 -->
          <div class='ScoreChange'>
            <!-- 头部 -->
            <header class='header'>
              评价变化
            </header>
            <!-- 选项 -->
            <main class='main'>
              <!-- 曲线图 -->
              <div class='commonChartCon'>
                <el-tabs type="border-card" :value='tabs.datStarTabsValue' @tab-click="dayStarChange">
                  <el-tab-pane label="7天" name='7'></el-tab-pane>
                  <el-tab-pane label="30天" name=30></el-tab-pane>
                  <!-- echart评分数 -->
                  <div v-loading="echart.isStarShowLoading">
                    <none-page v-show="this.echart.isStarDataShow" no-back>该时间段暂无数据</none-page>
                    <!-- <div v-show="this.echart.isStarDataShow">该时间段暂无数据</div> -->
                    <div v-show="!this.echart.isStarDataShow" id="starChangeChart" :style="{width: '1000px', height: '500px'}"></div>
                  </div>
                </el-tabs>
                <!-- 曲线图日期 -->
                <div class="datePickerCon">
                  选择日期：
                  <el-date-picker prefix-icon="el-icon-date" :clearable="false" v-model="dateValue.value2" type="daterange" value-format='yyyy-M-d' range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                  </el-date-picker>
                  <el-button type="primary" style='margin-left:15px;height:34px;line-height:10px;' @click="starDatePickApi">确认</el-button>
                </div>
              </div>
            </main>
          </div>
          <!-- 图标三评分/评价数 -->
          <div class='ScoreAndCount'>
            <!-- 头部 -->
            <header class='header'>
              评分/评价数
              <!-- 曲线图日期 -->
              <div style="position:absolute;z-index:888;top:0;left:140px;">
                <!-- 评价、评价数select -->
                <el-select v-model="scoreAndCount.value" placeholder="请选择" style='width:100px;' @change="changeTwo">
                  <el-option v-for="item in scoreAndCount.options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
                <!-- 日期 -->
                <span style="margin-left:10px">选择日期：</span>
                <el-date-picker :clearable="false" v-model="dateValue.value3" type="date" value-format='yyyy-M-d' placeholder="选择日期">
                </el-date-picker>
                <el-button type="primary" style='margin-left:15px;height:34px;line-height:10px;' @click="twoDatePickApi">确认</el-button>
              </div>
            </header>

            <!-- 选项 -->
            <main class='main' ref="main">
              <!-- 曲线图 -->
              <div class='commonChartCon'>
                <!-- <el-tabs type="border-card" :value='tabs.tabsValue'>
                  <el-tab-pane label="7天" name='一'></el-tab-pane>
                  <el-tab-pane label="30天" name="二"></el-tab-pane>
                </el-tabs> -->

                <div v-loading="echart.isStarAndScoreShowLoading" style="width:100%;overflow:hidden">
                  <none-page v-show="this.echart.isStarAndScoreShow" no-back>该时间段暂无数据</none-page>
                  <!-- <div v-show="this.echart.isStarAndScoreShow">暂无数据</div> -->
                  <div v-show="!this.echart.isStarAndScoreShow" id="scoreAndCountChart" :style="{width: '1200px', height: '700px'}"></div>
                </div>

              </div>
            </main>
          </div>
        </el-tab-pane>

        <!-- SKU-->
        <el-tab-pane label="SKU" name="1">
          <div v-if='!this.skuDetail'>暂无sku数据</div>
          <div class="tabSkuContainer" v-if="this.skuDetail">
            <!-- 左边类目 -->
            <div class='coContainer'>
              <ul class='leftul'>
                <li>图片</li>
                <li>ASIN</li>
                <li>颜色</li>
                <li>价格</li>
                <li>buy box所有者</li>
                <li>评分</li>
                <li>跟卖数量
                </li>
              </ul>
            </div>
            <!-- 右边图片  -->
            <div class="imgRightContainer" v-if="this.skuDetail">
              <el-carousel indicator-position="none" :autoplay="false" arrow="always" height="370px">
                <el-carousel-item v-for="(item,index) in skuDetail" :key="index">
                  <ul class="imgRightxUl">
                    <!-- {{skuDetail}} -->
                    <li :class="value.className" v-for="(value,key) in item" @click="changeSku(value,key,item)" :key="key">
                      <img :src="value.imageUrl">
                      <span>{{value.sku?value.sku:"-"}}</span>
                      <span v-if="value.skuAttr[1]">{{value.skuAttr[1].attrValue?value.skuAttr[1].attrValue:"-"}}</span>
                      <span>{{value.price?value.price:"-"}}</span>
                      <span>{{value.buybox?value.buybox:"-"}}</span>
                      <span>{{value.starCnt?value.starCnt:"-"}}</span>
                      <!--  -->
                      <span style="text-decoration:underline;color:#0000FF;cursor:pointer" @click.stop="clickSellerCnt(value)">{{value.sellerCnt}}</span>
                      <!-- 点击跟卖数量弹窗 -->
                    </li>
                  </ul>
                </el-carousel-item>
              </el-carousel>
            </div>
          </div>
          <!-- sku图表1价格/评分/bsr排名走势 -->
          <div class='NewDailyEvaluation'>
            <!-- 头部 -->
            <header class='header'>
              BRS排名/评分价格走势
            </header>
            <main class='main'>
              <!-- 曲线图1 -->
              <div class='commonChartCon'>
                <el-tabs type="border-card" :value='skuTabs.datCountTabsValue' @tab-click="skuDayCountChange">
                  <el-tab-pane label="7天" name='7'></el-tab-pane>
                  <el-tab-pane label="30天" name="30"></el-tab-pane>
                  <!-- echart -->
                  <div v-loading="skuEchart.isScoreCountShowLoading">

                    <none-page v-show="this.skuEchart.isScoreCountShow" no-back>该时间段暂无数据</none-page>
                    <div v-show="!this.skuEchart.isScoreCountShow" id="skuScoreChart" :style="{width: '1000px', height: '500px'}"></div>
                  </div>
                </el-tabs>
                <!-- 曲线图日期 -->
                <div class="datePickerCon">
                  选择日期：
                  <el-date-picker prefix-icon="el-icon-date" :clearable="false" v-model="skuDateValue.value1" value-format='yyyy-M-d' type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                  </el-date-picker>
                  <el-button type="primary" style='margin-left:15px;height:34px;line-height:10px;' @click="skuDatePickApi">确认</el-button>
                </div>
              </div>
            </main>
          </div>
          <!-- sku图表2价格/评分/bsr排名走势 -->
          <div v-if="false" class='NewDailyEvaluation'>
            <!-- 头部 -->
            <header class='header'>
              BSR排名变化
            </header>
            <main class='main'>
              <!-- 曲线图1 -->
              <div class='commonChartCon'>
                <el-tabs type="border-card" :value='skuTabs.datStarTabsValue' @tab-click="skuRankChange">
                  <el-tab-pane label="7天" name='7'></el-tab-pane>
                  <el-tab-pane label="30天" name="30"></el-tab-pane>
                  <!-- echart -->
                  <div v-loading="skuEchart.isStarShowLoading" style='position:relative'>
                    <div v-show="this.skuEchart.isStarDataShow">暂无数据</div>
                    <div id="skuRankChart" :style="{width: '1200px', height: '500px'}"></div>
                    <div v-show="!this.skuEchart.isStarDataShow" class="mychart">
                      <li v-for="(value,key) in this.skuRankData" @mouseover=""></li>
                    </div>
                  </div>
                </el-tabs>
                <!-- 曲线图日期-->
                <div class="datePickerCon">
                  选择日期：
                  <el-date-picker prefix-icon="el-icon-date" :clearable="false" v-model="skuDateValue.value2" value-format='yyyy-M-d' type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                  </el-date-picker>
                  <el-button type="primary" style='margin-left:15px;height:34px;line-height:10px;' @click="skuRankDatePickApi">确认</el-button>
                </div>
              </div>
            </main>
          </div>
        </el-tab-pane>

        <!--  -->
        <!-- 动态追踪-->
        <el-tab-pane label="动态追踪" name="2">
          <!-- 筛选项 -->
          <div style="margin:20px;" class="watchContainer">
            <!-- 如果不是等monitor才显示的话，拿到的数据是空的，因为会把空数据传到子组件 -->
            <chart :taskStatus="taskStatus"></chart>
          </div>
        </el-tab-pane>

      </el-tabs>
    </div>
    <!-- 弹窗 todoh此处引入的2_1tabs下的tab1下的chart789的弹窗,所以此处使用slot-->
    <sellerCntDialog :dialog="dialog">

    </sellerCntDialog>
  </div>
</template>

<script>
// todoi
import chart from "@/components/product/productChart/tab3/chart"; // 竞品——查看——tab3中的表格
import sellerCntDialog from "@/components/product/productChart/sellCntDialog"; // 竞品——查看-tab2中的点击跟卖数量的弹窗
import { mapActions, mapGetters } from "vuex";
import {
  proChartDefaultDay, //默认拿数据的时间
  ProductDetailUrl,
  ProductMonitoringUrl,
  cancelMonitoringUrl,
  ProductReviewDayListUrl,
  ProductSellingList,
  ProductAnalysisInfoUrl,
  ProductReviewDaystarListUrl,
  ProductReviewStarListUrl,
  ProductListUrl,
  ProductDayListUrl,
  ProductRankListUrl
} from "../../../api/myApi";
import { getDay, oArrToTwoArr, clearArrTrim } from "../../../api/functions.js";
export default {
  components: { chart, sellerCntDialog },
  data() {
    return {
      tabNumber: "0",
      oldTabNumber: "0", //记录上一次tab
      taskStatus: {
        monitorTo: "",
        parentSku: ""
      },
      productDetail: null,
      bigImg: "",
      dialogMonitorVisible: false, // 时间dialog
      monitorDateValue: "", //添加监控时使用的时间
      // 日新增评价部分
      // 有没有拿到图标数据
      echart: {
        isScoreCountShowLoading: false,
        isScoreCountShow: false,
        isStarShowLoading: false,
        isStarDataShow: false,
        isStarAndScoreShowLoading: false,
        isStarAndScoreShow: false
      },
      isSelected: true,
      inputDays: "30",
      diagramList: [
        {
          isSelected2: true,
          name: "全部",
          type: -1
        },
        {
          isSelected2: false,
          name: "VP评",
          type: 0
        },
        {
          isSelected2: false,
          name: "好评",
          type: 1
        },
        {
          isSelected2: false,
          name: "差评",
          type: 2
        },
        {
          isSelected2: false,
          name: "直评",
          type: 3
        },
        {
          isSelected2: false,
          name: "好评带图",
          type: 4
        },
        {
          isSelected2: false,
          name: "好评带视频",
          type: 5
        }
      ],
      // tabs 详情value
      tabs: {
        datCountTabsValue: proChartDefaultDay + "", // 开发时默认30天，7天拿到的数据是空的
        datStarTabsValue: proChartDefaultDay + ""
      },
      dateValue: {
        value1: "",
        value2: "",
        value3: "" // 第三个时间弹窗
      },
      // 评价，评价数select
      scoreAndCount: {
        options: [
          {
            value: "0",
            label: "评分"
          },
          {
            value: "1",
            label: "评价"
          }
        ],
        value: "0"
      },
      getTwoData: null,
      // tab sku
      load: {
        moniLoading: false
      },
      skuDetail: null,
      data: [
        //假数据，可删
        {
          productId: 3,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B017UWLUQS",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        },
        {
          productId: 2,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B01B47CPSW",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        },
        {
          productId: 2,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B01B47CPSW",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        },
        {
          productId: 2,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B01B47CPSW",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        },
        {
          productId: 2,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B01B47CPSW",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        },
        {
          productId: 2,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B01B47CPSW",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        },
        {
          productId: 2,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B01B47CPSW",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        },
        {
          productId: 2,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B01B47CPSW",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        },
        {
          productId: 2,
          imageUrl:
            "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
          sku: "B01B47CPSW",
          title: "Champion Women's Freedom Seamless Racerback Sport Bra",
          productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
          skuAttr: [
            { attrValue: "X-Small", attrName: "size_name" },
            { attrValue: "Asphalt", attrName: "color_name" }
          ],
          price: "$12.68 - $52.37",
          buybox: null,
          starCnt: 4.3,
          sellerCnt: 0
        }
      ],
      // 弹窗组件todod
      dialog: {
        title: "查看跟卖",
        width: "50%",
        dialogShow: false,
        list: [], // 传给弹窗组件的数据，包括新品和非新品的数字
        page: {
          //page的也放这里了跟别的组件不太一样
          Size: this.vuexSize || 10,
          currentPage: this.vuexCurrentPage || 1,
          total: 0,
          pageNo: 1,
          totalPages: 1,
          sku: ""
        }
      },
      // 有没有拿到图标数据
      skuEchart: {
        isScoreCountShowLoading: false,
        isScoreCountShow: false,
        isStarShowLoading: false,
        isStarDataShow: false
      },
      // 当前的sku todod
      skuData: {
        sku: ""
      },
      skuRankData: "",
      // sku 图表的时间value
      skuTabs: {
        datCountTabsValue: proChartDefaultDay + "",
        datStarTabsValue: proChartDefaultDay + ""
      },
      // 用户选择时间
      skuDateValue: {
        value1: "",
        value2: ""
      },
      //////动态追踪 ////////
      watchList: [
        {
          isSelected2: true,
          name: "全选",
          type: -1
        },
        {
          isSelected2: false,
          name: "上下架",
          type: 0
        },
        {
          isSelected2: false,
          name: "标题",
          type: 1
        },
        {
          isSelected2: false,
          name: "图片",
          type: 2
        },
        {
          isSelected2: false,
          name: "价格",
          type: 3
        },
        {
          isSelected2: false,
          name: "行业",
          type: 4
        },
        {
          isSelected2: false,
          name: "best seller",
          type: 5
        },
        {
          isSelected2: false,
          name: "sku",
          type: 6
        },
        {
          isSelected2: false,
          name: "FBA",
          type: 7
        },
        {
          isSelected2: false,
          name: "BUY BOX",
          type: 8
        },
        {
          isSelected2: false,
          name: "跟卖卖家数量",
          type: 9
        },
        {
          isSelected2: false,
          name: "第一个评论",
          type: 10
        },
        {
          isSelected2: false,
          name: "促销活动",
          type: 11
        },
        {
          isSelected2: false,
          name: "合并与分离",
          type: 12
        }
      ],
      // 与店铺分析相关.从店铺分析的商品那里跳转过来的时候，要从vuex拿到一个fullpath给面包跳转使用
      fullPath: ""
    };
  },

  created() {
    console.log(this.$route, "路由");
  },
  async mounted() {
    //如果没有producuId或者 taskid和monitorTo同时没有，则跳转到首页。因为既不是从竞品分析跳转过来的。也不是从店铺分析中的商品那里跳转过来的，也不是一个合格的书签
    // if (
    //   !this.$route.query.sku ||
    //   (!this.$route.query.taskId && !this.$route.query.monitorTo)
    // ) {
    //   // this.$router.push("12");
    //   return;
    // }
    if (this.$route.query.taskId) {
      // 如果有taskid则表示是从竞品分析点击列表进来的。如果没有，则表是从店铺分析的商品那边跳转过来的
      let data = await this.getProductAnalysisInfo();
      let promise1 = this.getProductReviewDayList(proChartDefaultDay);
      let promise2 = this.getTwo(0);
      let res = await Promise.all([promise1, promise2]);
    }
    if (!this.$route.query.taskId) {
      this.fullPath = this.$store.state.competitive.fullPath;
      // alert(this.$store.state.competitive.fullPath);
      this.taskStatus.monitorTo = this.$route.query.monitorTo;
      this.getProductReviewDayList(proChartDefaultDay);
      this.getTwo(0);
    }

    // 获取产品信息
    this.getProductDetail();
    // 获取评分数
    this.getProductstar(proChartDefaultDay);
    // 处于查看左边菜单高亮
    // if (!this.$route.query.monitorTo) {
    //   this.$store.commit(
    //     "common/pathFromCheckProductAnalysis",
    //     "/admin/competitive/productAnalysis"
    //   );
    // }
    // if (this.$route.query.monitorTo) {
    //   this.$store.commit(
    //     "common/pathFromCheckProductAnalysis",
    //     "/admin/competitive/shopAnalysis"
    //   );
    // }
  },
  methods: {
    // 获取任务详情
    async getProductAnalysisInfo() {
      return this.$axios
        .get(ProductAnalysisInfoUrl, {
          params: {
            taskId: this.$route.query.taskId
          }
        })
        .then(res => {
          // this.taskStatus = res.data.data;
          this.taskStatus = Object.assign({}, res.data.data);
          // console.log("任务详情", res.data.data);
          return res;
        })
        .catch(err => {
          console.log("任务详情接口", err);
        });
    },
    // 获取产品信息
    getProductDetail() {
      // if (!this.$route.query.sku) {
      //   this.$router.push("/admin/competitive/productAnalysis");
      // }
      this.$axios
        .post(ProductDetailUrl, {
          sku: this.$route.query.sku
        })
        .then(res => {
          if (res.status == 200 && res.data.code == 0) {
            // console.log("单个产品查看返回", res.data.data);
            this.productDetail = res.data.data;
            // this.productDetail.taskId = this.$route.query.taskId;
            this.productDetail.imageUrlList.forEach((item, index) => {
              if (index == 0) {
                item.className = "active";
              } else {
              }
            });
          } else {
            // this.$alert("暂无数据");
            // this.$router.push("/admin/competitive/productAnalysis");
          }
        })
        .then()
        .catch(err => {
          console.log("单个产品接口", err);
        });
    },
    // 点击按钮是使用添加监控函数，还是使用取消监控函数
    addOrCancel() {
      if (this.taskStatus.monitorFlag == 0) {
        this.dialogMonitorVisible = true;
        return;
      }
      this.cancelMonitoring();
    },
    // 添加监控
    addMonitoring() {
      let params = {
        taskIds: [parseInt(this.productDetail.taskId)]
      };

      if (!this.monitorDateValue) {
        this.$alert("请选择监控起始时间");
        return;
      }
      params.monitorFrom = this.monitorDateValue[0];
      params.monitorTo = this.monitorDateValue[1];
      // loading
      this.load.moniLoading = true;
      this.$axios
        .post(ProductMonitoringUrl, params)
        .then(res => {
          // console.log("添加产品接口响应", res.data);
          if (res.data.code != 0) {
            this.$message.error(res.data.msg);
            // loading
            return;
          }
          this.$message({
            type: "success",
            message: "添加成功!"
          });
          this.dialogMonitorVisible = false;
          this.load.moniLoading = false;
          this.getProductAnalysisInfo();
        })
        .catch(err => {
          console.log("添加监控失败", err);
        });
    },
    //取消监控
    cancelMonitoring() {
      // this.$set(this.productDetail, this.productDetail.toTime, "未开启监控");
      let taskIdArr = [parseInt(this.productDetail.taskId)];
      // console.log(taskIdArr);
      let params = {
        taskIds: taskIdArr
      };
      // console.log(params);
      this.$confirm("是否取消本产品的监控?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios.post(cancelMonitoringUrl, params).then(res => {
            if (res.data.code != 0) {
              this.$message.error(res.data.msg);
              return;
            }
            this.$nextTick(function() {
              this.$message({
                type: "success",
                message: res.data.msg
              });
            });
            this.getProductAnalysisInfo();
            // console.log("取消监控失败响应", res.data);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "放弃了本次操作"
          });
        });
    },
    // 选择小图
    selcetImg(item, index) {
      this.productDetail.imageUrlList.forEach((v, i) => {
        if (i == index) {
          this.productDetail.imageUrlList[i].className = "active";
          this.productDetail.imageUrlList = Object.assign(
            [],
            this.productDetail.imageUrlList
          );
          // console.log(this.productDetail.imageUrlList);
        } else {
          this.productDetail.imageUrlList[i].className = "";
          this.productDetail.imageUrlList = Object.assign(
            [],
            this.productDetail.imageUrlList
          );
        }
        this.bigImg = this.productDetail.imageUrlList[index].medium;
      });
    },
    // todom
    // 点击跟卖数量
    clickSellerCnt(value) {
      this.dialog.dialogShow = true;
      this.dialog.page.sku = value.sku; //保存一下用户点击的跟卖弹窗的product用户分页切换的时候作为参数
      this.getSellerCnt(
        value.sku,
        this.dialog.page.currentPage,
        this.dialog.page.Size
      );
    },
    // todom
    getSellerCnt(sku, pageNumber, pageSize) {
      this.$axios
        .get(ProductSellingList, {
          params: {
            sku: sku,
            pageNumber: 1,
            pageSize: 10
          }
        })
        .then(res => {
          if (res.status == 200) {
            console.log(res, "跟卖数量");
            this.dialog.list = res.data.rows;
            this.dialog.page.total = res.data.total;
            this.dialog.page.pageNo = res.data.pageNo;
            this.dialog.page.totalPages = res.data.totalPages;
          }
        })
        .catch(error => {
          console.log("跟卖列表出错", error);
        });
    },
    // 复制
    copySellPoint(type, textArg, inputArg) {
      if (type == 1) {
        if (!this.productDetail.feature || this.productDetail.feature == "") {
          this.$message({
            type: "info",
            message: "暂无数据"
          });
        }
        return;
      }
      if (type == 2) {
        if (
          !this.productDetail.description ||
          this.productDetail.description == ""
        ) {
          this.$message({
            type: "info",
            message: "暂无相关数据"
          });
        }
        return;
      }
      let text = document.getElementById(textArg).innerText;
      let input = document.getElementById(inputArg);
      input.value = text; // 修改文本框的内容
      input.select(); // 选中文本
      document.execCommand("copy"); // 执行浏览器复制命令
      this.$message({
        type: "success",
        message: "复制成功"
      });
    },
    // 日新增评价数部分
    // 切换时间段的请求函数
    async getProductReviewDayList(days, startTime, endTime) {
      this.getIncrScoreCount(days, startTime, endTime);
    },
    // 获取日新增评价数接口
    getIncrScoreCount(days, startTime, endTime) {
      this.echart.isScoreCountShowLoading = true;
      this.$axios
        .post(ProductReviewDayListUrl, {
          sku: this.$route.query.sku,
          startTime: startTime || getDay(days).computedDay,
          endTime: endTime || getDay().today
          // monitorTo: this.taskStatus.monitorTo.slice(0, 10)
        })
        .then(res => {
          let list = res.data.data;
          this.contrIncrScoreCount(list);
        })
        .catch(err => {
          setTimeout(() => {
            this.echart.isScoreCountShowLoading = false;
          }, 500);
          this.$store.commit("competitive/saveIncrScoreCount", null); // 存
          console.log("获取日新增评价数失败返回", err);
        });
    },
    // 处理数据
    contrIncrScoreCount(list, arr) {
      this.$store.commit("competitive/saveIncrScoreCount", list); // 存
      let ScoreChange = echarts.init(document.getElementById("ScoreChart"));
      if (!arr) {
        this.diagramList[0].isSelected2 = true;
        this.diagramList.forEach((item, index) => {
          if (index > 0) {
            item.isSelected2 = false;
          }
        });
      }
      if (list == "") {
        this.echart.isScoreCountShow = true;
        ScoreChange.clear();
        this.$store.commit("competitive/saveIncrScoreCount", null); // 存
        setTimeout(() => {
          this.echart.isScoreCountShowLoading = false;
        }, 500);
        return;
      }
      if (arr) {
        let newList = [];
        list.forEach((item, index) => {
          arr.forEach((v, i) => {
            if (item.reviewType == i) {
              newList.push(item);
            }
          });
        });
        // console.log(newList);
        list = newList;
      }

      this.echart.isScoreCountShow = false;
      let ScoreData = {
        title: {
          text: "日新增评价数图表"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          selectedMode: false,
          data: ["VP评", "好评", "差评", "直评", "好评带图", "好评带视频"]
        },
        // dataZoom: [
        //   {
        //     show: true,
        //     realtime: true,
        //     startValue: 0,
        //     // 结束位置的数值
        //     endValue: 12
        //   },
        //   {
        //     type: "inside",
        //     show: true,
        //     xAxisIndex: [0],
        //     startValue: 0,
        //     // 结束位置的数值
        //     endValue: 12
        //   }
        // ],
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        toolbox: {
          feature: {
            // restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: []
          // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        axisTick: {
          interval: 0
        },
        series: []
      };
      let timeArr = []; // 横坐标
      for (let i = 0; i < list.length; i++) {
        // console.log(list[0]);
        let item = list[i];
        switch (item.reviewType) {
          case 0:
            let data0 = [];
            item.list.forEach((v, k) => {
              data0.push(v.cnt);
              timeArr.push(v.statTime.slice(5, 10));
            });
            // ScoreData.legend.data.push("VP评");
            ScoreData.series.push({
              name: "VP评",
              type: "line",
              symbolSize: 4,
              data: data0
            });
            break;
          case 1:
            let data1 = [];
            item.list.forEach((v, k) => {
              data1.push(v.cnt);
            });
            // ScoreData.legend.data.push("好评");
            ScoreData.series.push({
              name: "好评",
              type: "line",
              symbolSize: 4,
              data: data1
            });
            break;
          case 2:
            let data2 = [];
            item.list.forEach((v, k) => {
              data2.push(v.cnt);
            });
            // ScoreData.legend.data.push("差评");
            ScoreData.series.push({
              name: "差评",
              type: "line",
              symbolSize: 5,
              data: data2
            });
            break;
          case 3:
            let data3 = [];
            item.list.forEach((v, k) => {
              data3.push(v.cnt);
            });
            // ScoreData.legend.data.push("直评");
            ScoreData.series.push({
              name: "直评",
              type: "line",
              symbolSize: 5,
              data: data3
            });
            break;
          case 4:
            let data4 = [];
            item.list.forEach((v, k) => {
              data4.push(v.cnt);
            });
            // ScoreData.legend.data.push("好评带图");
            ScoreData.series.push({
              name: "好评带图",
              type: "line",
              symbolSize: 5,
              data: data4
            });
            break;
          case 5:
            let data5 = [];
            item.list.forEach((v, k) => {
              data5.push(v.cnt);
            });
            // ScoreData.legend.data.push("好评带视频");
            ScoreData.series.push({
              name: "好评带视频",
              type: "line",
              symbolSize: 5,
              data: data5
            });
            break;
          default:
        }
      }
      ScoreData.xAxis.data = timeArr;
      ScoreChange.clear();
      ScoreChange.setOption(ScoreData);
      setTimeout(() => {
        this.echart.isScoreCountShowLoading = false;
      }, 300);
    },
    // 日新增评价数切换7天30天
    dayCountChange(e) {
      // console.log(e.name);
      this.dateValue.value1 = "";
      this.tabs.datCountTabsValue = e.name;
      this.getProductReviewDayList(e.name);
    },
    // 点击切换评论选择
    changeDiagramBtnSelect(item, i) {
      if (i != 0) {
        // 点的不是全部
        this.diagramList[0].isSelected2 = false; // 点的不是全部，则去掉全部的背景色
        let usefulIndex = []; // 保存要展示的折线index
        if (this.diagramList[i].isSelected2 === true) {
          this.diagramList[i].isSelected2 = false;
          // 两处都要进行以下操作，因为有reture
          this.diagramList.forEach((item, index) => {
            if (item.isSelected2 === true) {
              usefulIndex.push(item.type);
            }
          });
          // console.log(usefulIndex);
          let stateList = this.$store.state.competitive.IncrScoreCount;
          if (stateList) {
            this.contrIncrScoreCount(stateList, usefulIndex);
          }
          return;
        }
        this.diagramList[i].isSelected2 = true;
        // 两处都要进行以下操作，因为有reture
        this.diagramList.forEach((item, index) => {
          if (item.isSelected2 === true) {
            usefulIndex.push(item.type);
          }
        });
        // console.log(usefulIndex);
        let stateList = this.$store.state.competitive.IncrScoreCount;
        if (stateList) {
          this.contrIncrScoreCount(stateList, usefulIndex);
        }
      }
      if (i == 0) {
        // 点的是全部
        this.diagramList.forEach((v, j) => {
          if (j == 0) {
            this.diagramList[j].isSelected2 = true;
          } else if (j != 0) {
            this.diagramList[j].isSelected2 = false;
          }
        });
        let stateList = this.$store.state.competitive.IncrScoreCount;
        if (stateList) {
          this.contrIncrScoreCount(stateList);
        }
        if (!stateList) {
          this.$message.error("暂无相关数据，请选择其他时间段");
          return;
        }
      }
    },
    // 点击选择日期，则7天  30天取消tabs的选择状态
    datePickApi(echartType) {
      // console.log(this.dateValue.value1);
      let date = this.dateValue.value1;
      if (date == "") {
        this.$message.error("请选择时间");
        return;
      }
      this.tabs.datCountTabsValue = "没选";
      this.getProductReviewDayList(null, date[0], date[1]);
      // this.dateValue.value1 = "";
    },
    // 二，评分部分
    // 评分
    getProductstar(days, startTime, endTime) {
      let starChangeChart = echarts.init(
        document.getElementById("starChangeChart")
      );
      this.echart.isStarShowLoading = true; // loading图
      this.$axios
        .post(ProductReviewDaystarListUrl, {
          sku: this.$route.query.sku,
          startTime: startTime || getDay(days).computedDay,
          endTime: endTime || getDay().today
          // monitorTo: this.taskStatus.monitorTo.slice(0, 10)
        })
        .then(res => {
          let list = res.data.data;
          // console.log("评分数", list);
          if (list == "") {
            this.echart.isStarDataShow = true; // 没数据
            starChangeChart.clear();
            setTimeout(() => {
              this.echart.isStarShowLoading = false; // loading图
            }, 500);
            return;
          }
          this.echart.isStarDataShow = false; // 没数据的提示文字隐藏掉
          let ScoreData = {
            title: {
              text: "折线图堆叠"
            },
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["评分"]
            },
            // dataZoom: [
            //   {
            //     show: true,
            //     realtime: true,
            //     startValue: 0,
            //     // 结束位置的数值
            //     endValue: 12
            //   },
            //   {
            //     type: "inside",
            //     show: true,
            //     xAxisIndex: [0],
            //     startValue: 0,
            //     // 结束位置的数值
            //     endValue: 12
            //   }
            // ],
            grid: {
              left: "3%",
              right: "4%",
              bottom: "10%",
              containLabel: true
            },
            toolbox: {
              feature: {
                // restore: {},
                saveAsImage: {}
              }
            },
            xAxis: {
              type: "category",
              boundaryGap: false,
              data: []
              // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
            },
            yAxis: {
              type: "value"
            },
            axisTick: {
              interval: 0
            },
            series: []
          };
          let data0 = []; // 评分
          let timeArr = []; // 横坐标值
          for (let i = 0; i < list.length; i++) {
            // console.log(list[0]);
            let item = list[i];
            timeArr.push(list[i].statTime.slice(5, 10));
            data0.push(list[i].starCnt);
          }
          ScoreData.series.push({
            name: "评分",
            type: "line",
            symbolSize: 4,
            data: data0
          });
          ScoreData.xAxis.data = timeArr;
          starChangeChart.clear();
          starChangeChart.setOption(ScoreData);
          setTimeout(() => {
            this.echart.isStarShowLoading = false;
          }, 300);
        });
    },
    // 评分切换7天30天
    dayStarChange(e) {
      this.dateValue.value2 = "";
      this.tabs.datStarTabsValue = e.name;
      this.getProductstar(e.name);
    },
    // 点击选择日期，则7天  30天取消tabs的选择状态
    starDatePickApi(echartType) {
      let date = this.dateValue.value2;
      if (date == "") {
        this.$message.error("请选择时间");
        return;
      }
      this.tabs.datStarTabsValue = "没选";
      this.getProductstar(null, date[0], date[1]);
    },
    // 获取评分和评价数
    async getTwo(type, statTime) {
      let myChart = echarts.init(document.getElementById("scoreAndCountChart"));
      this.echart.isStarAndScoreShowLoading = true; // loading图
      this.$axios
        .post(ProductReviewStarListUrl, {
          parentSku: this.$route.query.sku,
          type: type,
          statTime: statTime || getDay().today
        })
        .then(res => {
          // console.log("评分、评价数成功返回", res.data.data);
          this.getTwoData = res.data.data;
          // console.log(this.getTwoData);
          if (this.getTwoData == "") {
            myChart.clear();
            this.echart.isStarAndScoreShow = true;
            setTimeout(() => {
              this.echart.isStarAndScoreShowLoading = false;
            }, 500); // loading图
            return;
          }
          this.echart.isStarAndScoreShow = false;
          // let dataAxis = [
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB",
          //   "BBBBBBBBBBB"
          // ];
          // 横坐标
          let dataAxis = [];
          // let data = [
          //   "5.6",
          //   "5.6",
          //   "5.6",
          //   "5.6",
          //   "5.6",
          //   "5.6",
          //   "5.6",
          //   "5.6",
          //   "5.6",
          //   "5.6",
          //   "5.6"
          // ];
          // 纵坐标
          let data = [];
          this.getTwoData.forEach((item, index) => {
            // console.log(item);
            if (type == 0) {
              // 0评分1评论
              dataAxis.push(item.sku);
              data.push(item.starCnt);
            }
            if (type == 1) {
              // 0评分1评论
              dataAxis.push(item.sku);
              data.push(item.reviewCnt);
            }
          });
          let rotate;
          if (dataAxis.length < 13) {
            rotate = 0;
          }
          if (dataAxis.length >= 13) {
            rotate = 45;
          }
          let option = {
            title: {
              text: "提示：鼠标滑轮缩放,可左右滑动"
              // subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
            },
            xAxis: {
              data: dataAxis,
              position: "bottom",
              axisTick: {
                show: false
              },
              axisLine: {
                show: false
              },
              axisLabel: {
                show: true,
                interval: 0, //,    // {number}
                rotate: rotate
                // margin: 8
                // formatter: function(value) {
                //   if (dataAxis.length > 9) {
                //     return value.split("").join("\n");
                //   }
                //   return value;
                // }
              },
              z: 10
            },
            toolbox: {
              feature: {
                restore: {},
                saveAsImage: {}
              }
            },
            grid: {
              left: "3%",
              right: "4%",
              bottom: "6%",
              containLabel: true
            },
            yAxis: {
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                textStyle: {
                  color: "#999"
                }
              }
            },
            dataZoom: [
              {
                show: true,
                realtime: true,
                startValue: 0,
                // 结束位置的数值
                endValue: 12
              },
              {
                type: "inside",
                show: true,
                xAxisIndex: [0],
                startValue: 0,
                // 结束位置的数值
                endValue: 12
              }
            ],
            series: [
              {
                // For shadow
                type: "bar",
                barWidth: 30, //柱图宽度,
                itemStyle: {
                  normal: {
                    color: "rgba(0,0,0,0.05)"
                  }
                },
                barGap: "-100%",
                barCategoryGap: "40%",
                animation: false
              },
              {
                type: "bar",
                barWidth: 30, //柱图宽度,
                itemStyle: {
                  normal: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#83bff6" },
                      { offset: 0.5, color: "#188df0" },
                      { offset: 1, color: "#188df0" }
                    ]),
                    label: { show: true, position: "top" }
                  },
                  emphasis: {
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                      { offset: 0, color: "#2378f7" },
                      { offset: 0.7, color: "#2378f7" },
                      { offset: 1, color: "#83bff6" }
                    ])
                  }
                },
                data: data
              }
            ]
          };
          // Enable data zoom when user click bar.
          var zoomSize = 6;
          myChart.on("click", function(params) {
            // console.log(dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)]);
            myChart.dispatchAction({
              type: "dataZoom",
              startValue:
                dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
              endValue:
                dataAxis[
                  Math.min(params.dataIndex + zoomSize / 2, data.length - 1)
                ]
            });
          });
          myChart.setOption(option);
          setTimeout(() => {
            this.echart.isStarAndScoreShowLoading = false;
          }, 500); // loading图
        })
        .catch(err => {
          console.log("评分，评价数接口错误返回", err);
        });
    },
    // 切换评分和评价
    changeTwo(val) {
      if (this.dateValue.value3 == "") {
        this.getTwo(parseInt(val));
      }
      if (this.dateValue.value3) {
        this.getTwo(parseInt(val), this.dateValue.value3);
      }
    },
    //选择时间loading评分
    twoDatePickApi() {
      // console.log(this.scoreAndCount.value, this.dateValue.value3);
      if (this.dateValue.value3 == "") {
        this.$message("请选择时间");
        return;
      }
      this.getTwo(parseInt(this.scoreAndCount.value), this.dateValue.value3);
    },
    // 切换大todotab
    async ChangTABS(val) {
      if (val.index == 0) {
        this.oldTabNumber = "0";
        return;
      }
      // 如果点了tab的sku
      if (val.index == 1) {
        this.oldTabNumber = "1";
        let arr = await this.getSkusDetail();
        console.log("await的return值", arr);
        const sku = arr[0][0].sku; //默认发送第一个sku
        this.skuData.sku = sku; // 第一个丢到this里面，切换7天 时间会用到。后面的也要去改变这个值
        this.getSkusChartData(proChartDefaultDay, null, null, this.skuData.sku);
        //第二个表格
        // this.contrSkuRank(sku);
        // this.getSkusRank(proChartDefaultDay, null, null, sku);
      }
      if (val.index == 2) {
        console.log(this.tabNumber);
        console.log(this.taskStatus.monitorFlag);
        let moniStatus = this.taskStatus.monitorFlag;
        if (moniStatus == 0) {
          this.$confirm("尚未开启监控, 是否开启?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.addOrCancel();
            })
            .catch(() => {
              this.tabNumber = this.oldTabNumber;
            });
        }
      }
    },
    // 切换sku小图，请求下面两个表格的数据
    changeSku(value, key, arr) {
      // console.log(value);
      // 因为不是同一个数组，所以也要清理把this.skuDetail的其他数组中的itme的chassName改成空
      this.skuDetail.forEach((v, i) => {
        if (v !== arr) {
          v.forEach((vItem, vIndex) => {
            vItem.className = "";
          });
        }
      });
      // 切换sku的时候，加个框
      arr.forEach((item, index) => {
        if (key == index) {
          item.className = "active";
        } else {
          item.className = "";
        }
      });
      // this.skuDetail = Object.assign({}, this.skuDetail);
      this.skuData.sku = value.sku;
      this.getSkusChartData(proChartDefaultDay, null, null, value.sku);
      //第二个表格
      // this.getSkusRank(proChartDefaultDay, null, null, value.sku);
    },
    // 获取skus详情
    getSkusDetail() {
      // console.log("任务状态", this.taskStatus);
      // console.log("产品详情", this.productDetail);
      if (!this.skuDetail) {
        return this.$axios
          .post(ProductListUrl, {
            parentSku: this.$route.query.sku
          })
          .then(res => {
            console.log("sku列表返回", res.data.data);
            if (res.data.code == 0 && res.data.data.length > 0) {
              let arr = res.data.data;
              // let arr = this.data; // 模拟数据
              arr.forEach((item, index) => {
                if (index == 0) {
                  item.className = "active";
                }
              });
              arr = oArrToTwoArr(6, arr); // 以每个6项分割二维数组
              let lastItem = arr[arr.length - 1];
              arr[arr.length - 1] = clearArrTrim(lastItem); // 去除二维最后一个的空值
              this.skuDetail = arr;
              return arr;
            }
          })
          .catch(err => {
            console.log("sku列表出错", err);
          });
      }
      return this.skuDetail;
    },
    // 获取sku的表格数据/
    // 获取sku表格数据
    getSkusChartData(days, startTime, endTime, skuId) {
      this.skuEchart.isScoreCountShowLoading = true;
      this.$axios
        .post(ProductDayListUrl, {
          sku: skuId,
          startTime: startTime || getDay(days).computedDay,
          endTime: endTime || getDay().today
          // monitorTo: this.taskStatus.monitorTo.slice(0, 10)
        })
        .then(res => {
          let list = res.data.data;
          // console.log("价格/评分/bsr排名走势", list);
          this.contrSku(list); // 处理sku表格数据函数
        })
        .catch(err => {
          setTimeout(() => {
            this.skuEchart.isScoreCountShowLoading = false;
          }, 500);
          console.log("获取sku表格数据失败返回", err);
        });
    },
    // 处理sku表格数据
    contrSku(list, arr) {
      let skuScoreChart = echarts.init(
        document.getElementById("skuScoreChart")
      );
      if (!arr) {
        this.diagramList[0].isSelected2 = true;
        this.diagramList.forEach((item, index) => {
          if (index > 0) {
            item.isSelected2 = false;
          }
        });
      }
      if (list == "") {
        this.skuEchart.isScoreCountShow = true;
        skuScoreChart.clear();
        setTimeout(() => {
          this.skuEchart.isScoreCountShowLoading = false;
        }, 500);
        return;
      }
      if (arr) {
        let newList = [];
        list.forEach((item, index) => {
          arr.forEach((v, i) => {
            if (item.reviewType == i) {
              newList.push(item);
            }
          });
        });
        list = newList;
      }
      this.skuEchart.isScoreCountShow = false;
      let ScoreData = {
        title: {
          text: "价格/评分/bsr排名走势图"
        },
        tooltip: {
          trigger: "axis"
        },
        color: ["#61A0A8", "#C23531", "#3A8EE6"],
        legend: {
          data: [
            {
              name: "BSR排名",
              textStyle: { fontWeight: "bold", color: "#61A0A8" }
            },
            {
              name: "价格",
              textStyle: { fontWeight: "bold", color: "#C23531" }
            },
            {
              name: "评分",
              textStyle: { fontWeight: "bold", color: "#3A8EE6" }
            }
          ]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "10%",
          containLabel: true
        },
        toolbox: {
          feature: {
            restore: {},
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          splitLine: {
            show: false,
            lineStyle: {
              // 使用深浅的间隔色
              color: ["#aaa", "#ddd"]
            }
          },
          data: []
        },
        yAxis: [
          {
            type: "value",
            name: "BSR排名",
            min: 0,
            max: 222,
            position: "left",
            axisLine: {
              lineStyle: {
                color: "#61A0A8"
              }
            }
          },
          {
            type: "value",
            name: "价格",
            min: 0,
            max: 55,
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#C23531"
              }
            }
          },
          {
            type: "value",
            name: "评分",
            min: 0,
            max: 5,
            offset: 50,
            position: "right",
            axisLine: {
              lineStyle: {
                color: "#3A8EE6"
              }
            }
          }
        ],
        splitLine: {
          show: false,
          lineStyle: {
            // 使用深浅的间隔色
            color: ["#aaa", "#ddd"]
          }
        },
        axisTick: {
          interval: 0
        },
        series: []
      };

      let XtimeArr = []; // 横坐标
      // 纵坐标
      let Yprice = [],
        Yrank = [],
        YstarCnt = [];
      for (let i = 0; i < list.length; i++) {
        // console.log(list[0]);
        let item = list[i];
        // 纵坐标，横坐标遍历
        Yrank.push(item.rank);
        Yprice.push(item.price);
        YstarCnt.push(item.starCnt);
        // 横坐标
        XtimeArr.push(item.statTime.slice(5, 10));
        // ScoreData.legend.data.push("VP评");
      }
      let max_Yprice = Math.max(...Yprice),
        max_YstarCnt = Math.max(...YstarCnt),
        max_Yrank = Math.max(...Yrank);
      ScoreData.yAxis[0].max = Math.ceil(max_Yrank);
      ScoreData.yAxis[1].max = Math.ceil(max_Yprice);
      ScoreData.yAxis[2].max = Math.ceil(max_YstarCnt);
      ScoreData.series.push(
        {
          name: "BSR排名",
          type: "line",
          data: Yrank
        },
        {
          name: "价格",
          type: "line",
          data: Yprice
        },
        {
          name: "评分",
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                color: "#3A8EE6"
              }
            }
          },
          data: YstarCnt
        }
      );
      ScoreData.xAxis.data = XtimeArr;
      skuScoreChart.clear();
      skuScoreChart.setOption(ScoreData);
      setTimeout(() => {
        this.skuEchart.isScoreCountShowLoading = false;
      }, 300);
    },
    // sku第一个图切换7天30天
    skuDayCountChange(e) {
      console.log(e.name);
      this.skuDateValue.value1 = "";
      this.tabs.datCountTabsValue = e.name;
      this.getSkusChartData(parseInt(e.name), null, null, this.skuData.sku);
    },
    // sku改变日期
    skuDatePickApi() {
      // console.log(this.dateValue.value1);
      let date = this.skuDateValue.value1;
      if (date == "") {
        this.$message.error("请选择时间");
        return;
      }
      this.skuTabs.datCountTabsValue = "没选";
      this.getSkusChartData(null, date[0], date[1], this.skuData.sku);
    },
    //  获取BSR排名数据
    getSkusRank(days, startTime, endTime, skuId) {
      this.skuEchart.isStarShowLoading = true;
      this.$axios
        .post(ProductRankListUrl, {
          sku: skuId,
          startTime: startTime || getDay(days).computedDay,
          endTime: endTime || getDay().today
          // monitorTo: this.taskStatus.monitorTo.slice(0, 10)
        })
        .then(res => {
          let list = res.data.data;
          console.log("bsr排名变化返回", list);
          // 假数据
          list = [
            [
              {
                category:
                  "Clothing, Shoes & Jewelry > Women > Shops > Plus-Size > Active > Sports Bras",
                rank: 3,
                statTime: "2018-06-19 00:00:00"
              },
              {
                category:
                  "Clothing, Shoes & Jewelry > Women > Clothing > Active > Sports Bras",
                rank: 8,
                statTime: "2018-06-19 00:00:00"
              },
              {
                category:
                  "Clothing, Shoes & Jewelry > Women > Shops > Plus-Size > Intimates > Bras",
                rank: 101,
                statTime: "2018-06-19 00:00:00"
              },
              {
                category:
                  "Clothing, Shoes & Jewelry > Women > Shops > Plus-Size > Intimates > Bras",
                rank: 101,
                statTime: "2018-06-19 00:00:00"
              }
            ],
            [
              {
                category:
                  "Clothing, Shoes & Jewelry > Women > Shops > Plus-Size > Active > Sports Bras",
                rank: 2,
                statTime: "2018-06-20 00:00:00"
              },
              {
                category:
                  "Clothing, Shoes & Jewelry > Women > Clothing > Active > Sports Bras",
                rank: 7,
                statTime: "2018-06-20 00:00:00"
              },
              {
                category:
                  "Clothing, Shoes & Jewelry > Women > Shops > Plus-Size > Intimates > Bras",
                rank: 10,
                statTime: "2018-06-20 00:00:00"
              },
              {
                category:
                  "Clothing, Shoes & Jewelry > Women > Shops > Plus-Size > Intimates > Bras",
                rank: 101,
                statTime: "2018-06-19 00:00:00"
              }
            ]
          ];
          this.contrSkuRank(list, 0); // 处理sku排名数据todom
        })
        .catch(err => {
          setTimeout(() => {
            this.skuEchart.isStarShowLoading = false;
          }, 500);
          console.log("获取sku表格数据失败返回", err);
        });
    },
    // 处理BSR排名数据
    contrSkuRank(list, num) {
      let skuRankChart = echarts.init(document.getElementById("skuRankChart"));
      if (list == "") {
        this.skuEchart.isStarDataShow = true;
        skuRankChart.clear();
        setTimeout(() => {
          this.skuEchart.isStarShowLoading = false;
        }, 500);
        return;
      }
      this.skuEchart.isStarDataShow = false;
      // todomethods
      // 总的日期和所在list的 集合
      let daysArr = [];
      list.forEach((item, index) => {
        console.log(item);
        daysArr.push({ dayIndex: index, time: item[0].statTime.slice(5, 10) });
      });
      console.log(daysArr, "总的日期和所在list的index");
      this.skuRankData = daysArr;
      // 横坐标（yAxis和xAxis反过来了）
      let dataAxis = [];
      // 纵坐标（yAxis和xAxis反过来了）
      let data = [];
      list[num].forEach((item, index) => {
        console.log(item);
        dataAxis.push(item.category);
        data.push(item.rank);
      });
      let option = {
        title: {
          text: "提示：鼠标滑轮缩放,可左右滑动"
          // subtext: "Feature Sample: Gradient Color, Shadow, Click Zoom"
        },
        yAxis: {
          data: dataAxis,
          position: "bottom",
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          },
          axisLabel: {
            show: false,
            interval: 0, //,    // {number}
            rotate: 0
            // margin: 8
            // formatter: function(value) {
            //   return value.split("").join("\n");
            // }
          },
          z: 10
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "6%",
          containLabel: true
        },
        // todonow
        xAxis: {
          position: "top",
          show: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#ccc"
            }
          },
          splitLine: {
            show: false
          }
        },
        series: [
          {
            // For shadow
            type: "bar",
            barWidth: 30, //柱图宽度,
            itemStyle: {
              normal: {
                color: "rgba(0,0,0,0.05)"
              }
            },
            barGap: "-100%",
            barCategoryGap: "40%",
            animation: false
          },
          {
            type: "bar",
            barWidth: 40, //柱图宽度,
            itemStyle: {
              show: true,
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#83bff6" },
                  { offset: 0.5, color: "#188df0" },
                  { offset: 1, color: "#188df0" }
                ]),
                label: {
                  distance: 1,
                  show: true,
                  position: "center",
                  formatter: function(value) {
                    // 显示的文字
                    return value.name + "：" + value.data + "名";
                  }
                }
              },
              emphasis: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#2378f7" },
                  { offset: 0.7, color: "#2378f7" },
                  { offset: 1, color: "#83bff6" }
                ])
              }
            },
            label: {
              normal: {
                position: "inner",
                distance: 1,
                textStyle: {
                  fontSize: 16
                }
              },
              emphasis: {
                show: true
              }
            },
            data: data,
            connectNulls: true
          }
        ]
      };
      // Enable data zoom when user click bar.
      // var zoomSize = 6;
      // skuRankChart.on("click", function(params) {
      //   skuRankChart.dispatchAction({
      //     type: "dataZoom",
      //     startValue: dataAxis[Math.max(params.dataIndex - zoomSize / 2, 0)],
      //     endValue:
      //       dataAxis[Math.min(params.dataIndex + zoomSize / 2, data.length - 1)]
      //   });
      // });
      skuRankChart.setOption(option);
      //
      setTimeout(() => {
        this.skuEchart.isStarShowLoading = false;
      }, 300);
    },
    // sku第一个图切换7天30天
    skuRankChange(e) {
      console.log(e.name);
      this.skuDateValue.value2 = "";
      this.tabs.datStarTabsValue = e.name;
      // this.getSkusRank(parseInt(e.name), null, null, this.skuData.sku);
    },
    // sku改变日期
    skuRankDatePickApi() {
      // console.log(this.dateValue.value1);
      let date = this.skuDateValue.value2;
      if (date == "") {
        this.$message.error("请选择时间");
        return;
      }
      this.skuTabs.datStarTabsValue = "没选";
      // this.getSkusRank(null, date[0], date[1], this.skuData.sku);
    }
  },
  computed: {
    vuexSize() {
      return this.$store.state.competitive.sellingCntPage.Size;
    },
    vuexCurrentPage() {
      return this.$store.state.competitive.sellingCntPage.currentPage;
    }
  },
  watch: {
    // 监听页码大小
    vuexSize() {
      // 非搜索状态下请求全部
      this.getSellerCnt(
        this.dialog.page.sku,
        this.dialog.page.currentPage,
        this.dialog.page.Size
      );
    },
    // 监听页数
    vuexCurrentPage() {
      this.getSellerCnt(
        this.dialog.page.sku,
        this.dialog.page.currentPage,
        this.dialog.page.Size
      );
    }
  }
};
</script>

<style lang='scss' scoped>
// tabs
.tabRight {
  list-style: none;
  position: absolute;
  right: 30px;
  top: 12px;
  z-index: 9;
  display: flex;
  li {
    margin-left: 50px;
    font-weight: bold;
    font-size: 14px;
    .timeColor {
      color: #3a8ee6;
    }
    .cancelBtn {
      height: 32px;
      line-height: 8px;
      position: relative;
      top: -8px;
      right: 5px;
    }
  }
}
.main {
  border-top: 2px solid #f0f3fa;
  margin-top: 15px;
  position: relative;
}
// 商品详情
.detalisContainer {
  padding: 20px 20px;
  border: 1px solid #c9c9c9;
  display: flex;
  // 图片
  .imgContainer {
    width: 550px;
    height: 360px;
    display: flex;
    justify-content: space-between;
    .bigImg {
      width: 360px;
      height: 360px;
      img {
        width: 100%;
        height: 100%;
        background-size: 100%;
      }
    }
    .smallImg {
      width: 60px;
      li {
        box-sizing: border-box;
        height: 60px;
        list-style: none;
        img {
          width: 100%;
          height: 100%;
          background-size: 100%;
        }
      }
      li.active {
        border: 2px solid #008000;
      }
    }
  }
}
// 文字详情
.textContainer {
  margin-left: 40px;
  .header {
    font-size: 16px;
    font-weight: bold;
  }
  .asinCon {
    margin-top: 10px;
    .asin {
      font-weight: bold;
      font-size: 16px;
    }
  }
  .detaliCon {
    margin-top: 10px;
    width: 700px;
    float: left;
    li:nth-of-type(odd) {
      border-right: 1px dashed #111;
    }
    li:nth-of-type(even) {
      padding-left: 40px;
    }
    li {
      box-sizing: border-box;
      float: left;
      width: 350px;
      margin-top: 25px;
      span {
        display: inline-block;
      }
      :first-child {
        width: 150px;
        text-align: right;
      }
      :nth-child(2) {
        margin-left: 10px;
      }
    }
  }
}
// 产品详情折叠板
.detalisExplainCon {
  margin-top: 20px;
  padding: 5px 20px;
  background: #f2f2f2;
  .productSellingPoint,
  .ProductDescription {
    padding-left: 20px;
    font-size: 15px;
    padding-top: 20px;
  }
  .icon {
    display: inline-block;
    width: 2px;
    height: 15px;
    background: #3a8ee6;
    position: relative;
    top: 2px;
    margin-right: 7px;
  }
  .fRight {
    float: right;
    margin-right: 50px;
    position: relative;
    top: -10px;
  }
  // 标签
  .labels {
    background: #f2f2f2;
    min-height: 60px;
    border: 1px solid #c9c9c9;
    margin: 10px 19px;
    padding: 10px 20px;
    span {
      margin: 5px 5px;
    }
  }
}
// 日新增评价数
.NewDailyEvaluation {
  width: 100%;
  min-height: 50px;
  border: 1px solid #c9c9c9;
  margin-top: 20px;
  .header {
    height: 40px;
    line-height: 40px;
    background: #f2f2f2;
    padding: 0 20px;
  }
  .main {
    font-size: 14px;
    background: #fafafa;
    min-height: 30px;
    padding: 20px;
    .optionCon {
      .optionConInputDaysCon {
        display: inline-block;
        width: 300px;
      }
    }
    .diagramCon {
      margin-top: 20px;
      box-sizing: border-box;
    }
  }
}
// 按钮公共样式
.main .optionCon .optionBtn,
.main .diagramCon .diagramBtn {
  display: inline-block;
  width: 100px;
  height: 36px;
  line-height: 36px;
  border: 1px solid #3a8ee6;
  text-align: center;
  color: #3a8ee6;
  border-radius: 5px;
  margin-left: 3px;
  cursor: pointer;
}
.optionBtnSelect {
  background: #3a8ee6 !important;
  color: #fafafa !important;
}
.diagramBtnSelect {
  background: #3a8ee6 !important;
  color: #fafafa !important;
}
// 公共样式
.commonChartCon {
  width: 100%;
  margin: 20px 0;
  position: relative;
  .datePickerCon {
    position: absolute;
    left: 220px;
    top: 0px;
  }
}
// 评分变化
.ScoreChange {
  width: 100%;
  min-height: 50px;
  border: 1px solid #c9c9c9;
  margin-top: 20px;
  .header {
    height: 40px;
    line-height: 40px;
    background: #f2f2f2;
    padding: 0 20px;
  }
  .main {
    font-size: 14px;
    background: #fafafa;
    min-height: 30px;
    margin-top: 0;
    padding: 0 20px;
  }
}
// 评分/评价数
.ScoreAndCount {
  width: 100%;
  min-height: 50px;
  border: 1px solid #c9c9c9;
  margin-top: 20px;
  .header {
    height: 40px;
    line-height: 40px;
    background: #f2f2f2;
    padding: 0 20px;
    position: relative;
  }
  .main {
    font-size: 14px;
    background: #fafafa;
    min-height: 30px;
    margin-top: 0;
    padding: 0 20px;
  }
}
.tabSkuContainer {
  margin: 10px;
  border: 1px solid #c9c9c9;
  display: flex;
  .coContainer {
    display: flex;
    .leftul {
      width: 120px;
      text-align: center;
      font-size: 14px;
      li {
        padding: 7px;
        border-right: 1px solid #c9c9c9;
        border-bottom: 1px solid #c9c9c9;
      }
      li:first-child {
        height: 150px;
        line-height: 150px;
      }
      li:last-child {
        border-bottom: 0;
      }
    }
  }
  // tabs sku todocss
  .imgRightContainer {
    width: 100%;
    .imgRightxUl {
      height: 370px;
      width: 100%;
      display: flex;
      background: #f8f8f8;
      li:hover {
        border: 1px solid #008000;
      }
      li.active {
        border: 1px solid #008000;
      }
      li {
        box-sizing: border-box;
        width: 14%;
        height: 100%;
        text-align: center;
        background: #fff;
        margin: 0 1%;
        span {
          display: block;
          padding: 7px;
          font-size: 14px;
        }
        img {
          width: 80%;
          height: 42%;
          margin-top: 8px;
        }
      }
    }
  }
}
// 遮罩在sku排名表格上面的隐形div
.mychart {
  position: absolute;
  z-index: 999;
  top: 79px;
  left: 35px;
  border: 1px solid rgb(204, 204, 204);
  width: 1115px;
  height: 392px;
  display: flex;
  box-sizing: border-box;
  li {
    // background: #fafafa;
    width: 50%;
    position: relative;
    opacity: 0;
    border-right: 1px dashed #dcdfe6;
  }
}
// 走马灯 要去掉
// .el-carousel__item:nth-child(2n) {
//   background-color: #99a9bf;
// }

// .el-carousel__item:nth-child(2n + 1) {
//   background-color: #d3dce6;
// }

// 动态追踪
.watchContainer {
  font-size: 14px;
  .common {
    display: flex;
    .cleft {
      text-align: right;
      width: 137px;
      line-height: 40px;
    }
  }
  .optionCon {
  }
  .diagramCon {
    .diagramBtn {
      margin-right: 10px;
      margin-top: 10px;
    }
  }
}
</style>
