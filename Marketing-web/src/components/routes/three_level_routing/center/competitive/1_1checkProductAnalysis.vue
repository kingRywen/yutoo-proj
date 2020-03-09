<!-- 查看单个竞品分析 -->
<template>
  <!-- 上线要改成v-show这个 -->
  <!-- <div class='checkProductAnalysis' v-show="this.productDetail"> -->
  <div class='checkProductAnalysis' v-loading="pageLoading">
    <none-page v-show="!this.productDetail" noBack>暂无数据</none-page>
    <section v-show="this.productDetail">
      <!-- {{this.taskStatus}} -->
      <!-- 添加监控弹窗 -->
      <el-dialog :close-on-click-modal="false" top="30vh" title="添加监控" :visible.sync="dialogMonitorVisible" width="600px">
        <div class='dialogContent' style="overflow:hidden;">
          <div style="margin-top:15px;">
            <div class="block" style='margin-top:15px;display:flex;justify-content:center'>
              <el-date-picker unlink-panels :picker-options="pickerOptions" v-model="monitorDateValue" value-format='yyyy-MM-dd' type="daterange" start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </div>
          </div>
          <div class='saveContainer' style='text-align:center;margin-top:40px;'>
            <el-button type="primary" size="large" style='width:50%' @click="addMonitoring">确认</el-button>
          </div>
        </div>
      </el-dialog>
      <!-- 面包屑 -->
      <!-- <el-breadcrumb separator="/" v-if="$route.path !== '/admin/dashboard'&&!this.$route.query.monitorTo">
      <el-breadcrumb-item :to="{ path: '/admin/competitive/productAnalysis' }">竞品分析</el-breadcrumb-item>
      <el-breadcrumb-item>查看</el-breadcrumb-item>
    </el-breadcrumb>
    <el-breadcrumb separator="/" v-if="$route.path !== '/admin/dashboard'&&this.$route.query.monitorTo">
      &nbsp; -->
      <!-- <el-breadcrumb-item :to="{ path: fullPath }">&lt;返回</el-breadcrumb-item>
      <el-breadcrumb-item>查看</el-breadcrumb-item> -->
      <!-- </el-breadcrumb> -->
      <!-- 主体 -->
      <!-- todoh -->
      <div class='main'>
        <!-- 更新时间，截止时间，取消监控 -->
        <!-- v-if中解释：如果url上面没有monitorTo，证明不是从店铺分析跳过来的。这时候就要显示更新时间和监控时间。如果有monitorTo，则表示是从店铺分析跳转过来的。就要隐藏时间 -->
        <ul class='tabRight font12' v-if="!this.$route.query.monitorTo?(this.taskStatus&&this.tabNumber!=2):false">
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
        </ul>
        <!-- tabs选项卡 -->
        <el-tabs type="border-card" v-model="tabNumber" @tab-click="ChangTABS">

          <!-- tab1详情 -->
          <el-tab-pane label="产品详情" name="0">
            <!-- 1.图片文字详情 -->
            <div class="detalisContainer">
              <!-- 1.1图片 -->
              <div class='imgContainer' v-if="this.productDetail">
                <!-- 1.1.2小图 -->
                <!-- 在外部套一个div，并设置overflow为hidden，则超出的部分就会被剪切不显示。并且设置内部div的宽/高，大于外部div的宽/高，则超出的部分就会被第一个div设置的hidden属性遮盖剪切不显示出来。并且给内部div设置scroller或auto，就会呈现鼠标可以滚动的效果 -->
                <div style="position:relative" v-if="this.productDetail.imageUrlList===null?false:true">
                  <!-- 遮住滚动条 -->
                  <div style="width:15px;height:360px;background:#fff;position:absolute;right:0;"></div>
                  <!-- 滚动条 -->
                  <div style="width:70px;height:360px;overflow-x: hidden; overflow-y: auto;">
                    <!-- 滚动内容 -->
                    <div class='smallImg'>
                      <li :class="item.className" v-for="(item,index) in this.productDetail.imageUrlList" @click.prevent="selcetImg(item,index)">
                        <img :src="item.medium">
                      </li>
                    </div>
                  </div>
                </div>
                <!-- 1.1.1大图 -->
                <div class='bigImg'>
                  <div v-if="this.bigImg===''&&this.productDetail.imageUrlList===null" style="border:1px solid #E4E7ED;width: 267px;height: 358px; margin-right: 10px;">
                    <div class="iconfont icon-tupian" style="color:#999;font-size:30px;width:60px;height:60px;margin:120px auto;position:relative;left:-15px;">

                    </div>
                  </div>
                  <img v-else :src="this.bigImg?this.bigImg:this.productDetail.imageUrlList!==null?this.productDetail.imageUrlList[0].medium:'-'">
                </div>
              </div>
              <!-- 1.2文字 -->
              <div class='textContainer' v-if="this.productDetail">
                <ul>
                  <li class="li">标题</li>
                  <li class="fix__row_2 lg" v-if="productDetail.title === '' || productDetail.title == null">{{productDetail.title | _formatData}}</li>
                  <el-tooltip v-else placement="top" :open-delay="50">
                    <div slot="content">{{productDetail.title | _formatData}}</div>
                    <li class="lg __row_1 color_blue">
                      <a rel="noopener noreferrer nofollow" class="aLink fix__row_2" target="_blank" :href="productDetail.productUrl?productDetail.productUrl:false" style="text-decoration:none;">{{ productDetail.title | _formatData}}
                      </a>
                    </li>
                  </el-tooltip>

                  <li class="li">ASIN</li>
                  <li class="lg"> {{this.productDetail.sku||"-"}}</li>
                  <li class="li">价格</li>
                  <li> {{this.productDetail.price||"-"}}</li>
                  <li class="li">Best seller</li>

                  <!-- <li class="fix__row_2" v-if="productDetail.bestSellerCate&&productDetail.bestSellerCate === 1">
                    <span style="line-height:1.5em" v-for="item in productDetail.bestSellerCate">{{'# '+item.rank_name}}</br>
                    </span>
                  </li> -->
                  <!-- <el-tooltip v-if="productDetail.bestSellerCate&&this.productDetail.bestSellerFlag!==0?true:false" placement="top-start" :open-delay="50">
                    <div slot="content">
                      <span style="line-height:1.5em" v-for="item in productDetail.bestSellerCate">{{'# '+item.rank_name}}</br>
                      </span>
                    </div>
                    <li class="color_blue"> {{this.productDetail.bestSellerFlag===1?"是":"否"}}</li>
                  </el-tooltip

                  <li v-if="this.productDetail.bestSellerFlag===''?true:false"> {{"-"}}</li> -->
                  <li v-if="productDetail.bestSellerFlag===0">否</li>
                  <li v-else-if="productDetail.bestSellerFlag===1">
                    <el-tooltip v-if="productDetail.bestSellerCate" placement="top-start" :open-delay="50">
                      <div slot="content">
                        <span style="line-height:1.5em;" v-for="item in productDetail.bestSellerCate">{{'# '+item.rank_name}}</br>
                        </span>
                      </div>
                      <span style="color:#00C0DE">是</span>
                    </el-tooltip>
                    <span v-else>是</span>
                  </li>
                  <li v-else>-</li>
                  <li class="li">总评价数</li>
                  <li> {{this.productDetail.reviewCnt||"-"}}</li>
                  <li class="li">Buy box所有者</li>
                  <li> {{this.productDetail.buybox||"-"}}</li>
                  <li class="li"> 评分</li>
                  <li> {{this.productDetail.starCnt||"-"}}</li>
                  <li class="li"> 支持Prime</li>
                  <li> {{this.productDetail.primeFlag===1?"是":this.productDetail.primeFlag===0?"否":"-"}}</li>
                  <li class="li"> QA数</li>
                  <li> {{this.productDetail.qaCnt||"-"}}</li>
                  <li class="li"> 卖家数量</li>
                  <li> {{this.productDetail.sellerCnt||"-"}}</li>
                  <li class="li"> 喜欢人数</li>
                  <li> {{this.productDetail.heartCnt||"-"}}</li>
                  <li class="li"> 发货方式</li>
                  <li> {{this.productDetail.fbpFlag==0?"自发货":this.productDetail.fbpFlag==1?"FBA":this.productDetail.fbpFlag==2?"自发货+FBA":"-"}}</li>
                  <li class="li"> 上架时间</li>
                  <li> {{this.productDetail.releaseDate||"-"}}</li>
                  <li class="li"> Amazon's Choice</li>
                  <li> {{this.productDetail.amazonChoiceFlag===1?"是":this.productDetail.amazonChoiceFlag===0?"否":"-"}}</li>
                  <li class="li"> 重量</li>
                  <li> {{this.productDetail.shippingWeight||"-"}}</li>
                  <li class="li"> 尺寸</li>
                  <li> {{this.productDetail.dimensions||"-"}}</li>
                </ul>
                <!-- <header class='header'>
                  {{this.productDetail.title}}
                </header>
                <div class='asinCon'>
                  <span class='asin'>ASIN:</span>
                  <span>{{this.productDetail.sku}}</span>
                </div>
                <div class='detaliCon'>
                  <li>
                    <span>价格：</span>
                    <span>{{this.productDetail.price?this.productDetail.price:'-'}}</span>
                  </li>
                  <li>
                    <span>总评价数：</span>
                    <span>{{this.productDetail.reviewCnt||"-"}}</span>
                  </li>
                  <li>
                    <span>评分：</span>
                    <span>{{this.productDetail.starCnt||"-"}}</span>
                  </li>
                  <li style="position:relative">
                    <span>buy box所有者：</span>
                    <span style="width:200px;">{{this.productDetail.buybox||"-"}}</span>
                  </li>
                  <li>
                    <span>AQ数：</span>
                    <span>{{this.productDetail.qaCnt||"-"}}</span>
                  </li>
                  <li>
                    <span>重量：</span>
                    <span>{{this.productDetail.shippingWeight ||"-"}}</span>
                  </li>
                  <li>
                    <span>上架时间：</span>
                    <span>{{this.productDetail.releaseDate||"-"}}</span>
                  </li>
                  <li>
                    <span>跟卖卖家数：</span>
                    <span>{{this.productDetail.sellerCnt||"0"}}</span>
                  </li>
                  <li>
                    <span>发货方式：</span>
                    <span>{{this.productDetail.fbpFlag==0?"自发货":this.productDetail.fbpFlag==1?"FBA":this.productDetail.fbpFlag==2?"自发货+FBA":"-"}}</span>
                  </li>
                  <li v-if="this.productDetail.skuAttr[0]?true:false">
                    <span>{{typeof this.productDetail.skuAttr[0].attrName !=='undefined'&&this.productDetail.skuAttr[0].attrName?this.productDetail.skuAttr[0].attrName:"-"}}：</span>
                    <span>{{typeof this.productDetail.skuAttr[0].attrValue !=='undefined'&&this.productDetail.skuAttr[0].attrValue?this.productDetail.skuAttr[0].attrValue:"-"}}</span>
                  </li>
                  <li v-if="this.productDetail.skuAttr[1]?true:false">
                    <span>{{typeof this.productDetail.skuAttr[1].attrName !=='undefined'&&this.productDetail.skuAttr[1].attrName?this.productDetail.skuAttr[1].attrName:"-"}}：</span>
                    <span>{{typeof this.productDetail.skuAttr[1].attrValue !=='undefined'&&this.productDetail.skuAttr[1].attrValue?this.productDetail.skuAttr[1].attrValue:"-"}}</span>
                  </li>
                </div> -->
              </div>
            </div>
            <!-- 2.产品详情折叠板 -->
            <div class="detalisExplainCon" v-show="this.productDetail">
              <el-collapse>
                <el-collapse-item title="产品详情" name="1">
                  <!-- 产品卖点 -->
                  <div class='productSellingPoint'>
                    <span class="title_icon"></span>
                    <span>产品卖点</span>
                    <el-button type="primary" plain class="btn fRight" ref="copy" data-clipboard-action="copy" data-clipboard-target="#text" @click="copy">
                      复制卖点
                    </el-button>
                  </div>
                  <div class='labels' id="text" v-show="this.productDetail" style="overflow:hidden">
                    <el-tag v-for="(item,index) in productDetail.feature" :key="index">{{item}}</el-tag>
                  </div>
                  <!-- 产品描述 -->
                  <div class='ProductDescription'>
                    <span class="title_icon"></span>
                    <span>产品描述</span>
                    <el-button v-if="productDetail.description" type="primary" plain class="btn2 fRight" ref="copy" data-clipboard-action="copy" data-clipboard-target="#text2" @click="copy2">
                      复制描述
                    </el-button>
                    <el-button v-else disabled type="primary" plain class="btn2 fRight" ref="copy" data-clipboard-action="copy" data-clipboard-target="#text2">
                      暂无数据
                    </el-button>
                  </div>
                  <div class='labels' id="text2" style="color:#777">
                    {{this.productDetail.description?this.productDetail.description:""}}
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
            <!-- 图表一日新增评价数 -->
            <section class="sku1Echart">
              <!-- <div class='NewDailyEvaluation'> -->
              <!-- 头部 -->
              <!-- <header class='header'>
                日新增评价数
              </header> -->
              <!-- 选项 -->
              <main class='main' style="margin-top:20px">
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
                <!-- 曲线图 -->
                <div class='commonChartCon'>
                  <header class="header">日新增评价数</header>
                  <!-- <div class="export" @click="downloadExl_1">
                    <i class="el-icon-download"></i>
                  </div> -->
                  <div class="export" @click="downloadExl_1">
                    <i class="el-icon-download echart_buttom_right" v-show="!this.echart.isScoreCountShow" type="text">
                    </i>
                  </div>
                  <el-tabs type="border-card" :value='tabs.datCountTabsValue' @tab-click="dayCountChange">
                    <el-tab-pane label="30天" name="30"></el-tab-pane>
                    <el-tab-pane label="7天" name='7'></el-tab-pane>
                    <!-- 曲线选择 -->
                    <div class='diagramCon'>
                      <span style='margin-left:1em;' class="commonColor">曲线：</span>
                      <el-button class='diagramBtn' :class="{'diagramBtnSelect' : item.isSelected2}" v-for="(item,i) in this.diagramList" :key="i" @click="changeDiagramBtnSelect(item,i)">{{item.name}}</el-button>
                    </div>
                    <!-- echart日增评分 -->
                    <div v-loading="echart.isScoreCountShowLoading" style="margin-top:20px">
                      <!-- <div v-show="this.echart.isScoreCountShow">该时间段暂无数据</div> -->
                      <none-page v-if="this.echart.isScoreCountShow" noBack>暂无数据</none-page>
                      <!-- chart1 -->
                      <echart auto-resize :options="echartsData.chart1" v-show="!this.echart.isScoreCountShow" id="ScoreChart" :style="{width: '100%', height: '400px'}"></echart>
                    </div>
                  </el-tabs>
                  <!-- 曲线图日期 -->
                  <div class="datePickerCon commonColor">
                    <el-date-picker :picker-options="onlyOneYear" unlink-panels prefix-icon="el-icon-date" :clearable="false" v-model="dateValue.value1" value-format='yyyy-M-d' type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                    <el-button type="primary" style='margin-left:5px;margin-right:10px;position: relative;top: -2px;' @click="datePickApi">确认</el-button>
                  </div>
                </div>
              </main>
              <!-- </div> -->
              <!-- 图标二评分变化 -->
              <!-- <div class='ScoreChange'> -->
              <!-- 头部 -->
              <!-- <header class='header'>
                评价变化
              </header> -->
              <!-- 选项 -->
              <main class='main' style="margin-top:20px">
                <!-- 曲线图 -->
                <div class='commonChartCon'>
                  <header class="header">评价变化</header>
                  <div class="export" @click="downloadExl_2">
                    <i class="el-icon-download echart_buttom_right" v-show="!this.echart.isScoreCountShow" type="text">
                    </i>
                  </div>
                  <!-- <el-button v-show="!this.echart.isStarDataShow" type="text" @click="downloadExl_2" class="echart_buttom_right">导出数据</el-button> -->
                  <el-tabs type="border-card" :value='tabs.datStarTabsValue' @tab-click="dayStarChange">
                    <el-tab-pane label="7天" name='7'></el-tab-pane>
                    <el-tab-pane label="30天" name=30></el-tab-pane>
                    <!-- echart评分数 -->
                    <div v-loading="echart.isStarShowLoading" style="margin-top:20px">
                      <!-- <div v-show="this.echart.isStarDataShow">该时间段暂无数据</div> -->
                      <none-page v-if="this.echart.isStarDataShow" noBack>暂无数据</none-page>
                      <!-- chart2 -->
                      <echart auto-resize :options="echartsData.chart2" v-show="!this.echart.isStarDataShow" id="starChangeChart" :style="{width: '100%', height: '400px'}"></echart>
                    </div>
                  </el-tabs>
                  <!-- 曲线图日期 -->
                  <div class="datePickerCon commonColor">
                    <el-date-picker :picker-options="onlyOneYear" unlink-panels prefix-icon="el-icon-date" :clearable="false" v-model="dateValue.value2" type="daterange" value-format='yyyy-M-d' range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                    <el-button type="primary" style='margin-left:5px;margin-right:10px;position: relative;top: -2px;' @click="starDatePickApi">确认</el-button>
                  </div>
                </div>
              </main>
              <!-- </div> -->
              <!-- 图标三评分/评价数 -->
              <div class='ScoreAndCount'>
                <!-- 头部 -->
                <header class='header'>
                  评分/评价数
                  <!-- 曲线图日期 -->
                  <div style="position:absolute;z-index:888;top:-2px;right:0px;">
                    <!-- 评价、评价数select -->
                    <el-select :popper-append-to-body="false" v-model="scoreAndCount.value" placeholder="请选择" style='width:100px;' @change="changeTwo">
                      <el-option v-for="item in scoreAndCount.options" :key="item.value" :label="item.label" :value="item.value">
                      </el-option>
                    </el-select>
                    <!-- 日期 -->
                    <el-date-picker unlink-panels :clearable="false" v-model="dateValue.value3" type="date" value-format='yyyy-M-d' placeholder="选择日期">
                    </el-date-picker>
                    <el-button type="primary" style='margin-left:5px;margin-right:10px;position: relative;top: 0px;' @click="twoDatePickApi">确认</el-button>
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

                    <div v-loading="echart.isStarAndScoreShowLoading" style="width:100%;overflow:hidden;">
                      <!-- <div v-show="this.echart.isStarAndScoreShow">暂无数据</div> -->
                      <none-page v-if="this.echart.isStarAndScoreShow" noBack>暂无数据</none-page>
                      <!-- chart3 -->
                      <!-- <el-button v-show="!this.echart.isStarAndScoreShow" type="text" @click="downloadExl_3" class="echart_buttom_right" style="top:15px;right:20px">导出数据</el-button> -->
                      <div class="export" @click="downloadExl_3">
                        <i class="el-icon-download echart_buttom_right" style="top:3px;right:12px" v-show="!this.echart.isScoreCountShow" type="text">
                        </i>
                      </div>
                      <echart auto-resize :options="echartsData.chart3" v-show="!this.echart.isStarAndScoreShow" id="scoreAndCountChart" :style="{width: '100%', height: '400px'}"></echart>
                    </div>

                  </div>
                </main>
              </div>
            </section>
          </el-tab-pane>

          <!-- sku tab2-->
          <el-tab-pane label="SKU" name="1" v-loading="tab2Loading">
            <!-- <div v-if='!this.skuDetail'>暂无sku数据</div> -->
            <none-page v-if="!this.skuDetail" noBack>暂无数据</none-page>
            <div class="tabSkuContainer" v-if="this.skuDetail">
              <!-- 左边类目 -->
              <div class='coContainer'>
                <ul class='leftul'>
                  <li>图片</li>
                  <li>ASIN</li>
                  <li>颜色</li>
                  <li>价格</li>
                  <li>Buy box所有者</li>
                  <li>评分</li>
                  <li>跟卖卖家数
                  </li>
                </ul>
              </div>
              <!-- 右边图片  -->
              <div class="imgRightContainer" v-if="this.skuDetail">
                <el-carousel indicator-position="none" :autoplay="false" :arrow="skuArr.length>6?'always':'never'" height="350px">
                  <el-carousel-item v-for="(item,index) in skuDetail" :key="index">
                    <ul class="imgRightxUl">
                      <!-- {{skuDetail}} -->
                      <li :class="value.className" v-for="(value,key) in item" @click="changeSku(value,key,item)" :key="key">
                        <div class="__img_wrapper_sku">
                          <img class="loadingImg" v-if="value.imageUrl" :key="value.imageUrl" v-lazy="value.imageUrl?value.imageUrl:'-'">
                        </div>
                        <span>{{value.sku?value.sku:"-"}}</span>
                        <span>{{value.skuAttr.color_name?value.skuAttr.color_name:"-"}}</span>
                        <span>{{value.price?value.price:"-"}}</span>
                        <span>{{value.buybox?value.buybox:"-"}}</span>
                        <span>{{value.starCnt?value.starCnt:"-"}}</span>
                        <!--  -->
                        <span v-if="value.sellerCnt!==null&&value.sellerCnt!==''" style="color:#0000FF;cursor:pointer" @click.stop="clickSellerCnt(value)">{{value.sellerCnt}}</span>
                        <span v-else>-</span>
                        <!-- 点击跟卖数量弹窗 -->
                      </li>
                    </ul>
                  </el-carousel-item>
                </el-carousel>
              </div>
            </div>
            <!-- sku图表1价格/评分/bsr排名走势 -->
            <!-- <div class='NewDailyEvaluation'> -->
            <!-- 头部 -->
            <section class="sku2Echart" v-if="this.skuDetail">
              <main class='main' style="margin-top:20px">
                <!-- 曲线图1 -->
                <div class='commonChartCon'>
                  <header class='header'>
                    BRS排名/评分价格走势
                  </header>
                  <div class="export" @click="downloadExl_4">
                    <i class="el-icon-download echart_buttom_right" v-show="!this.echart.isScoreCountShow" type="text">
                    </i>
                  </div>
                  <!-- <el-button v-show="!this.skuEchart.isScoreCountShow" type="text" @click="downloadExl_4" class="echart_buttom_right">导出数据</el-button> -->
                  <el-tabs type="border-card" :value='skuTabs.datCountTabsValue' @tab-click="skuDayCountChange">
                    <el-tab-pane label="7天" name='7'></el-tab-pane>
                    <el-tab-pane label="30天" name="30"></el-tab-pane>
                    <!-- echart -->
                    <div v-loading="skuEchart.isScoreCountShowLoading" style="margin-top:20px;">
                      <!-- <div v-show="this.skuEchart.isScoreCountShow">暂无数据</div> -->
                      <none-page v-if="this.skuEchart.isScoreCountShow" noBack>暂无数据</none-page>
                      <!-- chart4 -->
                      <echart auto-resize :options="echartsData.chart4" v-show="!this.skuEchart.isScoreCountShow" id="skuScoreChart" :style="{width: '98%', height: '400px'}"></echart>
                    </div>
                  </el-tabs>
                  <!-- 曲线图日期 -->
                  <div class="datePickerCon commonColor">
                    <el-date-picker :picker-options="onlyOneYear" unlink-panels prefix-icon="el-icon-date" :clearable="false" v-model="skuDateValue.value1" value-format='yyyy-M-d' type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                    <el-button type="primary" style='margin-left:5px;margin-right:10px;position: relative;top: -2px;' @click="skuDatePickApi">确认</el-button>
                  </div>
                </div>
              </main>
              <!-- </div> -->
              <!-- sku图表2价格/评分/bsr排名走势 -->
              <!-- <div class='NewDailyEvaluation'> -->
              <!-- 头部 -->
              <!-- <header class='header'>
                BSR排名变化
              </header> -->
              <main class='main' style="margin-top:20px">
                <!-- 曲线图1 -->
                <div class='commonChartCon'>
                  <header class='header'>
                    BSR排名变化
                  </header>
                  <div class="export" @click="downloadExl_5" v-if="!this.skuEchart.isChart5">
                    <i class="el-icon-download echart_buttom_right" v-show="!this.echart.isScoreCountShow" type="text">
                    </i>
                  </div>
                  <!-- <el-button v-show="!this.skuEchart.isChart5" type="text" @click="downloadExl_5" class="echart_buttom_right">导出数据</el-button> -->
                  <el-tabs type="border-card" :value='skuTabs.datStarTabsValue' @tab-click="skuRankChange">
                    <el-tab-pane label="7天" name='7'></el-tab-pane>
                    <el-tab-pane label="30天" name="30"></el-tab-pane>
                    <!-- echart -->
                    <div v-loading="skuEchart.isStarShowLoading">
                      <none-page v-if="this.skuEchart.isChart5" noBack>暂无数据</none-page>
                      <!-- chart5 todoh-->
                      <section class="chart5_com" v-show="!this.skuEchart.isChart5">
                        <div class="section section1">
                          <div v-show="echartsData.date" style="color:#47C2E1;font-size:14px;padding-left:24px;">
                            <span>排名日期：</span>
                            <span>
                              {{echartsData.date}}
                            </span>
                          </div>
                          <echart auto-resize :options="echartsData.chart6" style="width:100%;height:350px;" id="skuRankChart_2"></echart>
                        </div>
                        <div class="section section2">
                          <echart auto-resize :options="echartsData.chart5" style="width:100%;height:350px;" id="skuRankChart"></echart>
                        </div>
                      </section>
                    </div>
                  </el-tabs>
                  <!-- 曲线图日期-->
                  <div class="datePickerCon commonColor">
                    <el-date-picker :picker-options="onlyOneYear" unlink-panels prefix-icon="el-icon-date" :clearable="false" v-model="skuDateValue.value2" value-format='yyyy-M-d' type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" align="right">
                    </el-date-picker>
                    <el-button type="primary" style='margin-left:5px;margin-right:10px;position: relative;top: -2px;' @click="skuRankDatePickApi">确认</el-button>
                  </div>
                </div>
              </main>
            </section>
            <!-- </div> -->
          </el-tab-pane>

          <!--  -->
          <!-- 动态追踪-->
          <el-tab-pane label="动态追踪" name="2">
            <!-- 筛选项 -->
            <div style="margin:20px;" class="watchContainer">
              <!-- 如果不是等monitor才显示的话，拿到的数据是空的，因为会把空数据传到子组件 -->
              <none-page v-show="!taskStatus" noBack>暂无数据</none-page>
              <chart v-if="taskStatus" :taskStatus="taskStatus"></chart>
            </div>
          </el-tab-pane>

        </el-tabs>
      </div>
      <!-- 弹窗 此处引入的2_1tabs下的tab1下的chart789的弹窗,所以此处使用slot-->
      <sellerCntDialog :dialog="dialog" ref="sellerCntDialog">

      </sellerCntDialog>
    </section>
  </div>
</template>

<script>
// todoi
import Clipboard from "clipboard";
import chart from "./1_1tabs/tab3/chart"; // 竞品——查看——tab3中的表格
import sellerCntDialog from "./1_1tabs/tab2/sellCntDialog"; // 竞品——查看-tab2中的点击跟卖数量的弹窗
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
} from "@/api/myApi";
import {
  getDay,
  oArrToTwoArr,
  clearArrTrim,
  getBigNum,
  // chart5,6 BSR排名根据对象中的日期来获取某一项
  getItemFromArr
} from "@/api/functions.js";
// 引入基本模板
let echarts = require("echarts/lib/echarts");
export default {
  components: { chart, sellerCntDialog },
  data() {
    return {
      tab2Loading: false,
      json: [
        {
          //测试数据
          日期: "2018-10-26",
          排名: "500"
        },
        {
          //测试数据
          日期: "2018-10-26",
          排名: "500"
        },
        {
          //测试数据
          日期: "2018-10-26",
          排名: "500"
        }
      ],
      echartsData: {
        chart1_json: [],
        chart2_json: [],
        chart3_json: [],
        chart4_json: [],
        chart5_json: [],
        chart1: {},
        chart2: {},
        chart3: {},
        chart4: {},
        chart5: {},
        date: "",
        chart6: {}
      },
      pageLoading: true,
      tabNumber: "0",
      oldTabNumber: "0", //记录上一次tab
      taskStatus: {
        monitorTo: "",
        parentSku: ""
      },
      productDetail: "",
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
      // 记录轮播的sku集合
      skuArr: "",
      inputDays: "30",
      diagramList: [
        {
          isSelected2: true,
          name: "全部",
          type: -1
        },
        {
          isSelected2: true,
          name: "VP评",
          type: 0
        },
        {
          isSelected2: true,
          name: "好评",
          type: 1
        },
        {
          isSelected2: true,
          name: "差评",
          type: 2
        },
        {
          isSelected2: true,
          name: "直评",
          type: 3
        },
        {
          isSelected2: true,
          name: "好评带图",
          type: 4
        },
        {
          isSelected2: true,
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
        // {
        //   productId: 3,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B017UWLUQS",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // },
        // {
        //   productId: 2,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B01B47CPSW",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // },
        // {
        //   productId: 2,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B01B47CPSW",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // },
        // {
        //   productId: 2,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B01B47CPSW",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // },
        // {
        //   productId: 2,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B01B47CPSW",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // },
        // {
        //   productId: 2,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B01B47CPSW",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // },
        // {
        //   productId: 2,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B01B47CPSW",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // },
        // {
        //   productId: 2,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B01B47CPSW",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // },
        // {
        //   productId: 2,
        //   imageUrl:
        //     "https://images-na.ssl-images-amazon.com/images/I/41SPXtwv10L._SR38,50_.jpg",
        //   sku: "B01B47CPSW",
        //   title: "Champion Women's Freedom Seamless Racerback Sport Bra",
        //   productUrl: "https://www.amazon.com/dp/B01B47CPSW?th=1&psc=1",
        //   skuAttr: [
        //     { attrValue: "X-Small", attrName: "size_name" },
        //     { attrValue: "Asphalt", attrName: "color_name" }
        //   ],
        //   price: "$12.68 - $52.37",
        //   buybox: null,
        //   starCnt: 4.3,
        //   sellerCnt: 0
        // }
      ],
      // 弹窗组件
      dialog: {
        title: "查看跟卖-子ASIN",
        width: "900px",
        dialogShow: false,
        sellParentLoading: false,
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
        isStarDataShow: false,
        isChart5: false
      },
      // 当前的sku
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
          name: "第一个评价",
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
      // 与店铺分析相关.从店铺分析的产品那里跳转过来的时候，要从vuex拿到一个fullpath给面包跳转使用
      fullPath: "",
      // echart图tool工具的位置
      tool: {
        x: window.innerWidth - 350 - 100,
        x4: window.innerWidth - 350 - 200
      },
      clipboard: "",
      // 定义添加监控只能是今日之后
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      }
    };
  },

  created() {
    // console.log(this.$route, "路由");
  },
  beforeRouteLeave(to, from, next) {
    this.$store.commit("competitive/keepShopBreadcrumb", false);
    next();
  },
  async mounted() {
    this.dateValue.value1 = [getDay(30).computedDay, getDay().today];
    this.dateValue.value2 = [getDay(30).computedDay, getDay().today];
    this.dateValue.value3 = getDay().today;
    this.skuDateValue.value1 = [getDay(30).computedDay, getDay().today];
    this.skuDateValue.value2 = [getDay(30).computedDay, getDay().today];
    // 判断query
    if (this.$route.query.sku && this.$route.query.sku === "null") {
      this.productDetail = false;
      this.pageLoading = false;
      this.$router.push("/admin/competitive/productAnalysis");
      return;
    }
    //如果没有producuId或者 taskid和monitorTo同时没有，则跳转到首页。因为既不是从竞品分析跳转过来的。也不是从店铺分析中的产品那里跳转过来的，也不是一个合格的书签
    if (!this.$route.query.sku || !this.$route.query.taskId) {
      this.$router.push("/admin/competitive/productAnalysis");
      return;
    }
    if (this.$route.query.taskId && !this.$route.query.taskType) {
      // 如果有taskid没有taskType则表示是从竞品分析点击列表进来的。如果taskType并且是1，则表是从店铺分析的产品那边跳转过来的
      let data = await this.getProductAnalysisInfo();
      let promise1 = this.getProductReviewDayList(proChartDefaultDay);
      let promise2 = this.getTwo(0);
      let res = await Promise.all([promise1, promise2]);
    } else if (this.$route.query.taskType && this.$route.query.taskType == 1) {
      // 没有taskId表示从店铺跳转过来的。要保存店铺的面包屑，并往后面多加一级即可
      if (this.$store.state.competitive.goCrossShopCheck === true) {
        this.$store.commit("competitive/keepShopBreadcrumb", true);
      } else {
        this.$router.push("/admin/competitive/shopAnalysis");
      }
      this.fullPath = this.$store.state.competitive.fullPath;
      // alert(this.$store.state.competitive.fullPath);
      this.taskStatus.monitorTo = this.$route.query.monitorTo || getDay().today;
      this.getProductReviewDayList(proChartDefaultDay);
      this.getTwo(0);
    }

    // 获取产品信息
    this.getProductDetail();
    // 获取评分数
    this.getProductstar(proChartDefaultDay);
    // 处于查看左边菜单高亮
    // console.log(this.$route, "路由");
    if (!this.$route.query.taskType) {
      this.$store.commit(
        "common/pathFromCheckProductAnalysis",
        "/admin/competitive/productAnalysis"
      );
    }
    if (this.$route.query.taskType) {
      this.$store.commit(
        "common/pathFromCheckProductAnalysis",
        "/admin/competitive/shopAnalysis"
      );
    }
  },
  methods: {
    // 测试导出todon
    downloadExl_1() {
      if (this.echartsData.chart1_json.length > 0) {
        // console.log(this.echartsData.chart1_json);
        let data = JSON.parse(JSON.stringify(this.echartsData.chart1_json));
        let name = this.$route.query.sku + "的日新增评价数.xlsx";
        this.$store.commit("common/downName", name);
        this.$nextTick(() => {
          this.download(data, null, this.$route.query.sku);
        });
        return;
      } else {
        this.$message.warning("暂无数据导出");
      }
    },
    downloadExl_2() {
      if (this.echartsData.chart2_json.length > 0) {
        let name = this.$route.query.sku + "的评价变化.xlsx";
        let data = JSON.parse(JSON.stringify(this.echartsData.chart2_json));
        this.$store.commit("common/downName", name);
        this.$nextTick(() => {
          this.download(data, null, this.$route.query.sku);
        });
        return;
      } else {
        this.$message.warning("暂无数据导出");
      }
    },
    // todon
    downloadExl_3() {
      if (this.echartsData.chart3_json.length > 0) {
        // type = this.scoreAndCount.value, date = this.dateValue.value3
        let type = this.scoreAndCount.value;
        let date = this.dateValue.value3;
        // console.log(date);
        let name;
        let data = JSON.parse(JSON.stringify(this.echartsData.chart3_json));
        if (type == 0) {
          name = this.$route.query.sku + "的变体评分.xlsx";
          this.$store.commit("common/downName", name);
        } else if (type == 1) {
          name = this.$route.query.sku + "的变体评价数.xlsx";
          this.$store.commit("common/downName", name);
        }
        this.$nextTick(() => {
          this.download(data, null, "截止到" + date);
        });
        return;
      } else {
        this.$message.warning("暂无数据导出");
      }
    },
    downloadExl_4() {
      if (this.echartsData.chart4_json.length > 0) {
        let name = this.skuData.sku + "的BRS排名/评分价格走势.xlsx";
        let data = JSON.parse(JSON.stringify(this.echartsData.chart4_json));
        this.$store.commit("common/downName", name);
        this.$nextTick(() => {
          this.download(data, null, this.skuData.sku);
        });
        return;
      } else {
        this.$message.warning("暂无数据导出");
      }
    },
    downloadExl_5() {
      if (this.echartsData.chart5_json.length > 0) {
        let name = this.skuData.sku + "BSR排名变化.xlsx";
        let data = JSON.parse(JSON.stringify(this.echartsData.chart5_json));
        this.$store.commit("common/downName", name);
        this.$nextTick(() => {
          this.download(data, null, this.skuData.sku);
        });
        return;
      } else {
        this.$message.warning("暂无数据导出");
      }
    },
    // 获取任务详情
    async getProductAnalysisInfo() {
      return this.$axios
        .post(ProductAnalysisInfoUrl, {
          taskId: parseInt(this.$route.query.taskId)
        })
        .then(res => {
          // this.taskStatus = res.data.data;
          this.taskStatus = Object.assign({}, res.data.data);
          if (this.taskStatus.monitorTo == "") {
            this.taskStatus.monitorTo == getDay().today;
          }
          // console.log("任务详情", res.data.data);
          return res;
        })
        .catch(err => {
          // console.log("任务详情接口", err);
        });
    },
    // 获取产品信息
    getProductDetail() {
      // this.pageLoading = false;
      if (!this.$route.query.sku) {
        this.$router.push("/admin/competitive/productAnalysis");
      }
      this.$axios
        .post(ProductDetailUrl, {
          sku: this.$route.query.sku
        })
        .then(res => {
          // console.log(res, "11");
          this.pageLoading = false;
          if (res.status == 200 && res.data.code == 0) {
            let resData = res.data.data;
            // 处理卖点
            if (resData.feature && resData.feature != "") {
              resData.feature = resData.feature
                .slice(1, -1)
                .replace(/\"/g, "")
                .split(":::");
            }
            // resData.feature = ["1", "2"];
            this.productDetail = resData;
            // this.productDetail.bestSellerFlag = "";
            // for (let i in this.productDetail) {
            //   this.productDetail[i] = null;
            // }
            // console.log(resData);
            if (this.productDetail.bestSellerFlag === 1) {
              // console.log(this.productDetail.bestSellerCate);
              this.productDetail.bestSellerCate = JSON.parse(
                this.productDetail.bestSellerCate
              );
            }
            // console.log("单个产品查看返回", this.productDetail);
            this.productDetail.taskId = this.$route.query.taskId;
            if (this.productDetail.imageUrlList !== null) {
              this.productDetail.imageUrlList.forEach((item, index) => {
                if (index == 0) {
                  item.className = "active";
                } else {
                }
              });
            }
          } else if (res.data.code == 500) {
            // this.productDetail = false;
            // this.$alert("暂无数据");
            // this.$router.push("/admin/competitive/productAnalysis");
          }
        })
        .then()
        .catch(err => {
          console.log("detail", err);
          // this.pageLoading = false;
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
        this.$message({ type: "warning", message: "请选择监控起始时间" });
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
          if (res.data.code === 500) {
            this.$message.error(res.data.msg);
            // loading
            return;
          }
          this.$message({
            type: "success",
            message: res.data.msg
          });
          this.dialogMonitorVisible = false;
          this.load.moniLoading = false;
          this.getProductAnalysisInfo();
          this.reloadPointApi();
        })
        .catch(err => {
          // console.log("添加监控失败", err);
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
            if (res.data.code === 500) {
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
          // this.$message({
          //   type: "info",
          //   message: "放弃了本次操作"
          // });
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
    //
    // 点击跟卖数量todom
    clickSellerCnt(value) {
      this.dialog.dialogShow = true;
      this.dialog.sku = value.sku;
      this.dialog.title = "查看跟卖-子ASIN (" + value.sku + ")";
      this.$refs.sellerCntDialog.getProductSellingDetailList();
      //保存一下用户点击的跟卖弹窗的product用户分页切换的时候作为参数
      this.$refs.sellerCntDialog.getSellerCnt();
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
          endTime: endTime || getDay().today,
          taskType: parseInt(this.$route.query.taskType) || 0,
          taskId: parseInt(this.$route.query.taskId)
          // monitorTo: this.taskStatus.monitorTo
          //   ? this.taskStatus.monitorTo.slice(0, 10)
          //   : getDay().today
        })
        .then(res => {
          let code = res.data.code;
          if (code == 0) {
            let list = res.data.data;
            this.echart.isScoreCountShow = false;
            this.contrIncrScoreCount(list);
          } else if (code === 500) {
            // todon 1
            this.echart.isScoreCountShow = true;
            this.echart.isScoreCountShowLoading = false;
          }
        })
        .catch(err => {
          this.echart.isScoreCountShowLoading = false;
          this.$store.commit("competitive/saveIncrScoreCount", null); // 存
          // console.log("获取日新增评价数失败返回", err);
        });
    },
    // 处理数据
    contrIncrScoreCount(list, arr) {
      this.$store.commit("competitive/saveIncrScoreCount", list); // 存
      let ScoreChange = echarts.init(document.getElementById("ScoreChart"));
      // ScoreChange.clear();
      // window.onresize = function() {
      //   ScoreChange.resize({
      //     width: "auto",
      //     height: "auto"
      //   });
      // };
      // ScoreChange.resize();
      // if (!arr) {
      //   this.diagramList[0].isSelected2 = true;
      //   this.diagramList.forEach((item, index) => {
      //     if (index > 0) {
      //       item.isSelected2 = false;
      //     }
      //   });
      // }
      if (list == "") {
        this.echart.isScoreCountShow = true;
        this.$store.commit("competitive/saveIncrScoreCount", null); // 存
        this.echart.isScoreCountShowLoading = false;
        return;
      }
      if (arr) {
        let newList = [];
        list.forEach((item, index) => {
          // console.log(item);
          arr.forEach((v, i) => {
            // console.log(i, "i");
            let index = parseInt(v);
            if (item.reviewType == index) {
              newList.push(item);
            }
          });
        });
        list = newList;
      }
      // console.log(list, "list");
      // 导出日期 纵列 todo
      this.echartsData.chart1_json = [];
      if (list.length > 0) {
        list[0].list.forEach((v, k) => {
          this.echartsData.chart1_json.push({
            日期: v.reviewDate.slice(0, 10)
          });
        });
        // 导出的数据横列
        // console.log(list, "list");
        list.forEach((v, k) => {
          // this.echartsData.chart1_json.forEach((item, index) => {
          if (v.reviewType === 0) {
            this.echartsData.chart1_json.forEach((item, index) => {
              item.VP评 = v.list[index].cnt;
            });
          } else if (v.reviewType === 1) {
            this.echartsData.chart1_json.forEach((item, index) => {
              item.好评 = v.list[index].cnt;
            });
          } else if (v.reviewType === 2) {
            this.echartsData.chart1_json.forEach((item, index) => {
              item.差评 = v.list[index].cnt;
            });
          } else if (v.reviewType === 3) {
            this.echartsData.chart1_json.forEach((item, index) => {
              item.直评 = v.list[index].cnt;
            });
          } else if (v.reviewType === 4) {
            this.echartsData.chart1_json.forEach((item, index) => {
              item.好评带图 = v.list[index].cnt;
            });
          } else if (v.reviewType === 5) {
            this.echartsData.chart1_json.forEach((item, index) => {
              item.好评带视频 = v.list[index].cnt;
            });
          }
        });
        // console.log(this.echartsData.chart1_json, "chart1_json");
      }
      // this.echartsData.chart1_json = [
      //   {
      //     日期: "2018-10-27",
      //     好评: "10"
      //   },
      //   {
      //     日期: "2018-10-27",
      //     好评: "10"
      //   }
      // ];
      this.echart.isScoreCountShow = false;
      let ScoreData = {
        title: {
          // text: "日新增评价数图表"
        },
        tooltip: {
          trigger: "axis"
        },
        legend: {
          // legend 不可点击
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
          right: "3%",
          bottom: "12%",
          containLabel: true
        },
        toolbox: {
          // x: this.tool.x,
          feature: {
            // restore: {},
            // dataView: { show: true, readOnly: true },
            // saveAsImage: { title: "保存" }
          }
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: "category",
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          },
          data: []
          // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        axisTick: {
          interval: 0
        },
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: []
      };
      let timeArr = []; // 横坐标
      let time;
      for (let i = 0; i < list.length; i++) {
        // console.log(list[0]);
        let item = list[i];
        switch (item.reviewType) {
          case 0:
            let data0 = [];
            item.list.forEach((v, k) => {
              data0.push(v.cnt);
              time = v.reviewDate.slice(0, 10);
              if (timeArr.indexOf(time) === -1) {
                timeArr.push(time);
              }
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
              time = v.reviewDate.slice(0, 10);
              if (timeArr.indexOf(time) === -1) {
                timeArr.push(time);
              }
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
              time = v.reviewDate.slice(0, 10);
              if (timeArr.indexOf(time) === -1) {
                timeArr.push(time);
              }
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
              time = v.reviewDate.slice(0, 10);
              if (timeArr.indexOf(time) === -1) {
                timeArr.push(time);
              }
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
              time = v.reviewDate.slice(0, 10);
              if (timeArr.indexOf(time) === -1) {
                timeArr.push(time);
              }
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
              time = v.reviewDate.slice(0, 10);
              if (timeArr.indexOf(time) === -1) {
                timeArr.push(time);
              }
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
      if (timeArr.length < 10) {
        delete ScoreData.dataZoom;
        ScoreData.grid.bottom = "6%";
      }
      // ScoreChange.setOption(ScoreData);
      this.echartsData.chart1 = ScoreData;
      this.echart.isScoreCountShowLoading = false;
    },
    // 日新增评价数切换7天30天
    dayCountChange(e) {
      // console.log(e.name);
      // this.dateValue.value1 = "";
      let day = parseInt(e.name);
      this.dateValue.value1 = [getDay(day).computedDay, getDay().today];
      console.log(this.dateValue.value1);
      this.tabs.datCountTabsValue = e.name;
      this.getProductReviewDayList(e.name);
    },
    // 点击切换评价选择
    changeDiagramBtnSelect(item, i) {
      let stateList = this.$store.state.competitive.IncrScoreCount;
      this.usefulIndex = [];
      // 如果用户点击了
      if (i != 0) {
        if (this.diagramList[i].isSelected2 === true) {
          this.diagramList[i].isSelected2 = false;
          this.diagramList[0].isSelected2 = false; // 点的不是全部，则去掉全部的背景色
          // 两处都要进行以下操作，因为有reture
          // 点了哪个，就设置哪个的背景色，并且遍历第二行的按钮，把第二行选中的放进二维数组
          this.diagramList.forEach((v, k) => {
            if (v.isSelected2 == true) {
              this.usefulIndex.push(v.type);
            }
          });
          // console.log(this.usefulIndex, "usefulIndex");
          // 传入一个false表示不需要请求信的数据。所以其他参数随便传。
          if (stateList) {
            this.contrIncrScoreCount(stateList, this.usefulIndex);
          }
          return;
        }
        this.diagramList[i].isSelected2 = true;
        let isAllSelect = true; //用于判断未隐藏的选项是否全选中
        this.diagramList.forEach((v, k) => {
          if (v.isSelected2 == true) {
            this.usefulIndex.push(v.type);
          }
          if (k !== 0) {
            if (v.isSelected2 === false) {
              isAllSelect = false;
            }
          }
        });
        // console.log(this.diagramList);
        // 如果未隐藏的选项全选中，则让全部也选中
        if (isAllSelect === true) {
          this.diagramList[0].isSelected2 = true; // 全部的背景色
        }
        // 两处都要进行以下操作，因为有reture
        // console.log(this.usefulIndex, "usefulIndex");
        if (stateList) {
          this.contrIncrScoreCount(stateList, this.usefulIndex);
        }
      }
      // 点的是全部
      if (i == 0) {
        let isAll = this.diagramList[0].isSelected2;
        if (isAll == false) {
          //如果本身没选中，则执行以下代码
          this.diagramList[0].isSelected2 = true;
          this.diagramList.forEach((v, j) => {
            this.diagramList[j].isSelected2 = true;
          });
        }
        if (isAll == true) {
          //如果本身已经选中了全部，则执行以下代码
          this.diagramList.forEach((v, j) => {
            this.diagramList[j].isSelected2 = false;
          });
        }
        this.diagramList.forEach((v, k) => {
          if (v.isSelected2 == true && k != 0) {
            this.usefulIndex.push(v.type);
          }
        });
        // console.log(this.usefulIndex, "usefulIndex");
        if (stateList) {
          this.contrIncrScoreCount(stateList, this.usefulIndex);
        }
      }
    },
    // changeDiagramBtnSelect(item, i) {
    //   if (i != 0) {
    //     // 点的不是全部
    //     this.diagramList[0].isSelected2 = false; // 点的不是全部，则去掉全部的背景色
    //     let usefulIndex = []; // 保存要展示的折线index
    //     if (this.diagramList[i].isSelected2 === true) {
    //       this.diagramList[i].isSelected2 = false;
    //       // 两处都要进行以下操作，因为有reture
    //       this.diagramList.forEach((item, index) => {
    //         if (item.isSelected2 === true) {
    //           usefulIndex.push(item.type);
    //         }
    //       });
    //       // console.log(usefulIndex);
    //       let stateList = this.$store.state.competitive.IncrScoreCount;
    //       if (stateList) {
    //         this.contrIncrScoreCount(stateList, usefulIndex);
    //       }
    //       return;
    //     }
    //     this.diagramList[i].isSelected2 = true;
    //     // 两处都要进行以下操作，因为有reture
    //     this.diagramList.forEach((item, index) => {
    //       if (item.isSelected2 === true) {
    //         usefulIndex.push(item.type);
    //       }
    //     });
    //     // console.log(usefulIndex);
    //     let stateList = this.$store.state.competitive.IncrScoreCount;
    //     if (stateList) {
    //       this.contrIncrScoreCount(stateList, usefulIndex);
    //     }
    //   }
    //   if (i == 0) {
    //     // 点的是全部
    //     this.diagramList.forEach((v, j) => {
    //       if (j == 0) {
    //         this.diagramList[j].isSelected2 = true;
    //       } else if (j != 0) {
    //         this.diagramList[j].isSelected2 = false;
    //       }
    //     });
    //     let stateList = this.$store.state.competitive.IncrScoreCount;
    //     if (stateList) {
    //       this.contrIncrScoreCount(stateList);
    //     }
    //     if (!stateList) {
    //       this.$message.error("暂无相关数据，请选择其他时间段");
    //       return;
    //     }
    //   }
    // },
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
      // starChangeChart.clear();
      // window.onresize = function() {
      //   starChangeChart.resize({
      //     width: "auto",
      //     height: "auto"
      //   });
      // };
      this.echart.isStarShowLoading = true; // loading图
      this.$axios
        .post(ProductReviewDaystarListUrl, {
          sku: this.$route.query.sku,
          startTime: startTime || getDay(days).computedDay,
          endTime: endTime || getDay().today,
          taskType: parseInt(this.$route.query.taskType) || 0,
          taskId: parseInt(this.$route.query.taskId)
          // monitorTo: this.taskStatus.monitorTo
          //   ? this.taskStatus.monitorTo.slice(0, 10)
          //   : getDay().today
        })
        .then(res => {
          let code = res.data.code;
          let list;
          if (code == 0) {
            list = res.data.data;
            this.echart.isStarDataShow = false;
          } else if (code === 500) {
            list = [];
            this.echart.isStarDataShow = true; // 没数据
            this.echart.isStarShowLoading = false; // loading图
            return;
          }
          // console.log("评分数", list);
          if (list == "") {
            this.echart.isStarDataShow = true; // 没数据
            this.echart.isStarShowLoading = false; // loading图
            return;
          }
          // 导出
          this.echartsData.chart2_json = [];
          if (list.length > 0) {
            // console.log(list, "list2");
            // 日期 纵列
            list.forEach((v, k) => {
              this.echartsData.chart2_json.push({
                日期: v.reviewDate.slice(0, 10)
              });
            });
            // 导出的数据横列
            this.echartsData.chart2_json.forEach((item, index) => {
              list.forEach((v, k) => {
                this.echartsData.chart2_json[k].评分 = v.starCnt;
              });
            });
            // console.log(this.echartsData.chart2_json, "chart2_json");
          }
          this.echart.isStarDataShow = false; // 没数据的提示文字隐藏掉
          let ScoreData = {
            title: {
              // text: "评价变化图"
            },
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["评分"]
            },
            grid: {
              left: "3%",
              right: "3%",
              top: "13%",
              bottom: "12%",
              containLabel: true
            },
            toolbox: {
              // x: this.tool.x,
              feature: {
                // restore: {},
                // saveAsImage: { title: "保存" }
              }
            },
            xAxis: {
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              type: "category",
              boundaryGap: false,
              axisLabel: {
                textStyle: {
                  color: "#999"
                }
              },
              data: []
              // data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
            },
            yAxis: {
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
              type: "value",
              axisLabel: {
                textStyle: {
                  color: "#999"
                }
              }
            },
            axisTick: {
              interval: 0
            },
            dataZoom: [
              {
                type: "inside",
                start: 0,
                end: 100
              },
              {
                start: 0,
                end: 100,
                handleIcon:
                  "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                handleSize: "80%",
                handleStyle: {
                  color: "#fff",
                  shadowBlur: 3,
                  shadowColor: "rgba(0, 0, 0, 0.6)",
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                }
              }
            ],
            series: []
          };
          let data0 = []; // 评分
          let timeArr = []; // 横坐标值
          for (let i = 0; i < list.length; i++) {
            // console.log(list[0]);
            let item = list[i];
            timeArr.push(list[i].reviewDate.slice(0, 10));
            data0.push(list[i].starCnt);
          }
          ScoreData.series.push({
            name: "评分",
            type: "line",
            symbolSize: 4,
            data: data0
          });
          ScoreData.xAxis.data = timeArr;
          if (timeArr.length < 10) {
            delete ScoreData.dataZoom;
            ScoreData.grid.bottom = "6%";
          }
          // starChangeChart.setOption(ScoreData);
          this.echartsData.chart2 = ScoreData;
          this.echart.isStarShowLoading = false;
        });
    },
    // 评分切换7天30天
    dayStarChange(e) {
      // console.log(e);
      // this.dateValue.value2 = "";
      let day = parseInt(e.name);
      this.dateValue.value2 = [getDay(day).computedDay, getDay().today];
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
    // 获取评分/评价数
    async getTwo(type, statTime) {
      let myChart = echarts.init(document.getElementById("scoreAndCountChart"));
      // myChart.clear();
      // window.onresize = function() {
      //   myChart.resize({
      //     width: "auto",
      //     height: "auto"
      //   });
      // };
      this.echart.isStarAndScoreShowLoading = true; // loading图
      this.$axios
        .post(ProductReviewStarListUrl, {
          parentSku: this.$route.query.sku,
          type: type,
          statTime: statTime || getDay().today,
          taskType: parseInt(this.$route.query.taskType) || 0,
          taskId: parseInt(this.$route.query.taskId)
          // monitorTo: this.taskStatus.monitorTo
          //   ? this.taskStatus.monitorTo.slice(0, 10)
          //   : getDay().today
        })
        .then(res => {
          // console.log("评分/评价数成功返回", res);
          let code = res.data.code;
          if (code == 0) {
            this.echart.isStarAndScoreShow = false;
          } else if (code === 500) {
            this.echart.isStarAndScoreShow = true;
            this.echart.isStarAndScoreShowLoading = false; // loading图
            return;
          }
          this.getTwoData = res.data.data;
          // 导出chart3
          this.echartsData.chart3_json = [];
          if (this.getTwoData.length > 0) {
            // console.log(this.getTwoData, "this.getTwoData3");
            // 纵列横列一起处理，这里
            this.getTwoData.forEach((v, k) => {
              if (type == 0) {
                this.echartsData.chart3_json.push({
                  变体: v.sku,
                  评分: v.starCnt
                });
              } else if (type == 1) {
                this.echartsData.chart3_json.push({
                  变体: v.sku,
                  评价数: v.reviewCnt
                });
              }
            });
            // 导出的数据横列
            // this.echartsData.chart3_json.forEach((item, index) => {
            //   this.getTwoData.forEach((v, k) => {
            //     this.echartsData.chart3_json[k].评分 = v.starCnt;
            //   });
            // });
            // console.log(this.echartsData.chart3_json, "chart3_json");
          }
          if (this.getTwoData == "") {
            this.echart.isStarAndScoreShow = true;
            this.echart.isStarAndScoreShowLoading = false;
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
              // 0评分1评价
              dataAxis.push(item.sku);
              data.push(item.starCnt);
            }
            if (type == 1) {
              // 0评分1评价
              dataAxis.push(item.sku);
              data.push(item.reviewCnt);
            }
          });
          // 设置一下表格首次能看到几个数是
          let length = dataAxis.length;
          let start, end;
          if (length <= 15) {
            start = 0;
            end = 100;
          }
          if (length > 15 && length <= 30) {
            start = 0;
            end = 50;
          }
          if (length > 30 && length <= 50) {
            start = 0;
            end = 40;
          }
          if (length > 50) {
            start = 0;
            end = 30;
          }
          if (length > 100) {
            start = 0;
            end = 10;
          }
          let rotate;
          if (dataAxis.length < 13) {
            rotate = 0;
          }
          if (dataAxis.length >= 13) {
            rotate = 45;
          }
          let option = {
            title: {
              // text: "评分/评价数（提示：鼠标滑轮缩放,可左右拖拽）"
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
                textStyle: {
                  color: "#999"
                },
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
              // x: this.tool.x,
              feature: {
                // restore: {},
                // saveAsImage: { title: "保存" }
              }
            },
            grid: {
              left: "3%",
              right: "3%",
              bottom: "12%",
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
            dataZoom: [
              {
                type: "inside",
                start: 0,
                end: end,
                minValueSpan: 0,
                maxValueSpan: 31
              },
              {
                start: 0,
                end: end,
                minValueSpan: 0,
                maxValueSpan: 31,
                handleIcon:
                  "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
                handleSize: "80%",
                handleStyle: {
                  color: "#fff",
                  shadowBlur: 3,
                  shadowColor: "rgba(0, 0, 0, 0.6)",
                  shadowOffsetX: 2,
                  shadowOffsetY: 2
                }
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
                // itemStyle: {
                //   normal: {
                //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //       { offset: 0, color: "#83bff6" },
                //       { offset: 0.5, color: "#188df0" },
                //       { offset: 1, color: "#188df0" }
                //     ]),
                //     label: { show: true, position: "top" }
                //   },
                //   emphasis: {
                //     color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                //       { offset: 0, color: "#2378f7" },
                //       { offset: 0.7, color: "#2378f7" },
                //       { offset: 1, color: "#83bff6" }
                //     ])
                //   }
                // },
                itemStyle: {
                  normal: {
                    color: "#32CDD5",
                    label: { show: true, position: "top" }
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
          // myChart.setOption(option);
          if (length < 11) {
            delete option.dataZoom;
          }
          this.echartsData.chart3 = option;
          this.echart.isStarAndScoreShowLoading = false;
          s;
        })
        .catch(err => {
          // console.log("评分，评价数接口错误返回", err);
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
        if (arr && arr.length > 0) {
          this.skuDetail = arr;
          const sku = arr[0][0].sku; //默认发送第一个sku
          this.skuData.sku = sku; // 第一个丢到this里面，切换7天 时间会用到。后面的也要去改变这个值
          this.getSkusChartData(
            proChartDefaultDay,
            null,
            null,
            this.skuData.sku
          );
          //第二个表格
          this.getSkusRank(proChartDefaultDay, null, null, this.skuData.sku);
        } else {
        }
      }
      if (val.index == 2) {
        // console.log(this.tabNumber);
        // console.log(this.taskStatus.monitorFlag);
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
      this.getSkusRank(proChartDefaultDay, null, null, value.sku);
    },
    // 获取skus详情
    getSkusDetail() {
      // console.log("任务状态", this.taskStatus);
      // console.log("产品详情", this.productDetail);
      if (!this.skuDetail) {
        this.tab2Loading = true;
        return this.$axios
          .post(ProductListUrl, {
            parentSku: this.$route.query.sku
          })
          .then(res => {
            this.tab2Loading = false;
            if (res.data.code == 0 && res.data.data.length > 0) {
              // console.log("sku列表返回", res.data.data);
              let arr = res.data.data;
              // 处理颜色和大小
              arr.forEach((item, index) => {
                // value.skuAttr&&value.skuAttr[1]&&typeof value.skuAttr[1].attrValue!=='undefined'&&value.skuAttr[1].attrValue?value.skuAttr[1].attrValue:"-"
                if (
                  Array.isArray(item.skuAttr) === true &&
                  item.skuAttr.length > 0
                ) {
                  let arr = item.skuAttr;
                  let new_skuAttr = {};
                  arr.forEach((v, k) => {
                    // console.log(v);
                    if (v.attrName === "color_name") {
                      new_skuAttr.color_name = v.attrValue;
                    } else if (v.attrName === "size_name") {
                      new_skuAttr.size_name = v.attrValue;
                    }
                  });
                  item.skuAttr = new_skuAttr;
                  // console.log(new_skuAttr, "new");
                }
              });
              this.skuArr = arr;
              // let arr = this.data; // 模拟数据
              arr.forEach((item, index) => {
                if (index == 0) {
                  item.className = "active";
                }
              });
              arr = oArrToTwoArr(6, arr); // 以每个6项分割二维数组
              let lastItem = arr[arr.length - 1];
              arr[arr.length - 1] = clearArrTrim(lastItem); // 去除二维最后一个的空值
              return arr;
            }
          })
          .catch(err => {
            this.tab2Loading = false;
            // console.log("sku列表出错", err);
          });
      }
      return this.skuDetail;
    },
    // 价格/评分/bsr排名走势
    getSkusChartData(days, startTime, endTime, skuId) {
      this.skuEchart.isScoreCountShowLoading = true;
      this.$axios
        .post(ProductDayListUrl, {
          sku: skuId,
          startTime: startTime || getDay(days).computedDay,
          endTime: endTime || getDay().today,
          taskType: parseInt(this.$route.query.taskType) || 0,
          taskId: parseInt(this.$route.query.taskId)
          // monitorTo: this.taskStatus.monitorTo
          //   ? this.taskStatus.monitorTo.slice(0, 10)
          //   : getDay().today
        })
        .then(res => {
          let code = res.data.code;
          if (code == 0) {
            let list = res.data.data;
            this.skuEchart.isScoreCountShow = false;
            // list = [
            //   {
            //     statTime: "2018-19-01",
            //     rank: 2,
            //     starCnt: 4,
            //     price: "1"
            //   },
            //   {
            //     statTime: "2018-19-01",
            //     rank: 2,
            //     starCnt: 4,
            //     price: "1"
            //   }
            // ];
            // console.log("价格/评分/bsr排名走势", list);
            this.contrSku(list); // 处理sku表格数据函数
          } else if (code === 500) {
            this.skuEchart.isScoreCountShow = true;
            this.skuEchart.isScoreCountShowLoading = false;
          }
        })
        .catch(err => {
          this.skuEchart.isScoreCountShowLoading = false;
          // console.log("价格/评分/bsr排名走势", err);
        });
    },
    // 处理sku表格数据
    contrSku(list, arr) {
      let skuScoreChart = echarts.init(
        document.getElementById("skuScoreChart")
      );
      // skuScoreChart.clear();
      // window.onresize = function() {
      //   skuScoreChart.resize({
      //     width: "auto",
      //     height: "auto"
      //   });
      // };
      // if (!arr) {
      //   this.diagramList[0].isSelected2 = true;
      //   this.diagramList.forEach((item, index) => {
      //     if (index > 0) {
      //       item.isSelected2 = false;
      //     }
      //   });
      // }
      if (list == "") {
        this.skuEchart.isScoreCountShow = true;
        this.skuEchart.isScoreCountShowLoading = false;
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
      // 导出chart4
      this.echartsData.chart4_json = [];
      if (list.length > 0) {
        // console.log(list, "list4");
        // 纵列横列一起处理，这里
        list.forEach((v, k) => {
          var obj = {};
          if (v.statTime !== "" && v.statTime !== null) {
            obj.日期 = v.statTime.slice(0, 10);
          }
          if (v.price !== "" && v.price !== null) {
            obj.价格 = v.price;
          }
          if (v.rank !== "" && v.rank !== null) {
            obj.BSR排名 = v.rank;
          }
          if (v.starCnt !== "" && v.starCnt !== null) {
            obj.评分 = v.starCnt;
          }
          this.echartsData.chart4_json.push(obj);
        });
        // 导出的数据横列
        // this.echartsData.chart4_json.forEach((item, index) => {
        //   this.getTwoData.forEach((v, k) => {
        //     this.echartsData.chart4_json[k].评分 = v.starCnt;
        //   });
        // });
        // console.log(this.echartsData.chart4_json, "chart4_json");
      }
      this.skuEchart.isScoreCountShow = false;
      let ScoreData = {
        title: {
          // text: "价格/评分/bsr排名走势图"
        },
        tooltip: {
          trigger: "axis"
        },
        color: ["#61A0A8", "#C23531", "#00C0DE"],
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
              textStyle: { fontWeight: "bold", color: "#00C0DE" }
            }
          ]
        },
        grid: {
          top: "15%",
          left: "3%",
          right: "6%",
          bottom: "12%",
          containLabel: true
        },
        toolbox: {
          // x: this.tool.x4,
          feature: {
            // restore: {},
            // saveAsImage: { title: "保存" }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
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
          },
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
            nameLocation: "start",
            inverse: true,
            min: 1,

            max: 222,
            minInterval: 1,
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
            splitLine: {
              show: false
            },
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
            splitLine: {
              show: false
            },
            axisLine: {
              lineStyle: {
                color: "#00C0DE"
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
        dataZoom: [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ],
        series: []
      };

      let XtimeArr = []; // 横坐标
      // 纵坐标
      let Yrank = [],
        Yprice = [],
        YstarCnt = [];
      for (let i = 0; i < list.length; i++) {
        // console.log(list[0]);
        let item = list[i];
        // 纵坐标，横坐标遍历
        if (item.rank !== "" && item.rank !== null) {
          Yrank.push(item.rank);
        }
        if (item.price !== "" && item.price !== null) {
          Yprice.push(item.price.slice(1));
        }
        if (item.rank !== "" && item.rank !== null) {
          YstarCnt.push(item.starCnt);
        }
        // 横坐标
        XtimeArr.push(item.statTime.slice(0, 10));
        // ScoreData.legend.data.push("VP评");
      }
      //
      let max_Yrank = Math.max(...Yrank),
        max_Yprice = Math.max(...Yprice),
        max_YstarCnt = Math.max(...YstarCnt);
      //
      ScoreData.yAxis[0].max = getBigNum(max_Yrank);
      ScoreData.yAxis[1].max = getBigNum(max_Yprice);
      ScoreData.yAxis[2].max = 5;
      let array = [
        { y_data: Yrank, name: "BSR排名", index: 0 },
        { y_data: Yprice, name: "价格", index: 1 },
        { y_data: YstarCnt, name: "评分", index: 2 }
      ];
      // console.log(list);
      // console.log(array);
      array.forEach((v, k) => {
        if (k.index != 2 && v.y_data != "") {
          ScoreData.series.push({
            name: v.name,
            yAxisIndex: v.index,
            type: "line",
            data: v.y_data
          });
        } else if (v.y_data != "") {
          ScoreData.series.push({
            name: v.name,
            type: "line",
            yAxisIndex: v.index,
            itemStyle: {
              normal: {
                lineStyle: {
                  color: "#00C0DE"
                }
              }
            },
            data: v.y_data
          });
        }
      });
      array.forEach((v, k) => {
        if (v.y_data == "") {
          ScoreData.yAxis[k] = {};
          if (k == 0) {
            ScoreData.yAxis[1].position = "left";
            ScoreData.yAxis[2].offset = 0;
          }
          if (k == 1) {
            ScoreData.yAxis[2].offset = 0;
          }
        }
      });
      ScoreData.xAxis.data = XtimeArr;
      if (XtimeArr.length < 10) {
        delete ScoreData.dataZoom;
        ScoreData.grid.bottom = "6%";
      }
      // skuScoreChart.setOption(ScoreData);
      this.echartsData.chart4 = ScoreData;
      this.skuEchart.isScoreCountShowLoading = false;
    },
    // sku第一个图切换7天30天
    skuDayCountChange(e) {
      // console.log(e.name);
      let day = parseInt(e.name);
      this.skuDateValue.value1 = [getDay(day).computedDay, getDay().today];
      // this.skuDateValue.value1 = "";
      this.skuTabs.datCountTabsValue = e.name;
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
          endTime: endTime || getDay().today,
          taskType: parseInt(this.$route.query.taskType) || 0,
          taskId: parseInt(this.$route.query.taskId)
          // monitorTo: this.taskStatus.monitorTo
          //   ? this.taskStatus.monitorTo.slice(0, 10)
          //   : getDay().today
        })
        .then(res => {
          let code = res.data.code;
          // console.log(res, "sku排名数");
          if (code == 0) {
            let list = res.data.data;
            if (list.length != "") {
              // console.log(list);
              // let newList = [];
              // list.forEach((item, index) => {
              //   console.log(item);
              // });
              let firstDate = list[0].list[0].statTime;
              this.drawBarChart(list, firstDate);
              this.contrSkuRank(list); // 处理sku排名数据
              this.skuEchart.isChart5 = false;
            } else {
              this.skuEchart.isChart5 = true;
            }
            this.skuEchart.isStarShowLoading = false;
          } else if (code === 500) {
            this.skuEchart.isChart5 = true;
            this.skuEchart.isStarShowLoading = false;
          }
          // console.log("bsr排名变化返回", list);
          // 假数据
          // list = [
          //   [
          //     {
          //       category:
          //         "Clothing, Shoes & Jewelry > Women > Shops > Plus-Size > Active > Sports Bras",
          //       rank: 3,
          //       statTime: "2018-06-19 00:00:00"
          //     }
          //   ]
          // ];
        })
        .catch(err => {
          this.skuEchart.isStarShowLoading = false;
          console.log("获取sku表格数据失败返回", err);
        });
    },
    // 根据日期画左边柱状图，默认画第一天todonow
    drawBarChart(list, date) {
      let skuRankChart = echarts.init(
        document.getElementById("skuRankChart_2")
      );
      let option = {
        // title: {
        //   text: "BSR排名变化"
        // },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            // 坐标轴指示器，坐标轴触发有效
            type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
          },
          formatter: function(e) {
            // console.log(e);
          }
        },
        legend: {
          data: []
        },
        grid: {
          top: "5%",
          left: "3%",
          right: "4%",
          bottom: "7%",
          containLabel: true
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          // name: "数量",
          axisLabel: {
            show: false,
            textStyle: {
              color: "#999"
            }
          },
          axisTick: {
            show: false
          },
          data: []
        },
        xAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          },
          type: "value",
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        toolbox: {},
        series: [
          {
            data: [],
            type: "bar",
            barWidth: 50, //柱图宽度,
            itemStyle: {
              normal: {
                color: "#FB6D6B"
              }
            },
            label: {
              normal: {
                show: true,
                formatter: function(v) {
                  // console.log(v.name);
                  let name = v.name;
                  //出现的次数
                  let num = name.split(">").length - 1 + 1;
                  return v.name + " （" + num + "级）" + " ：" + v.data + "名";
                },
                position: "insideLeft"
              }
            }
          }
        ]
      };
      // 横坐标
      // console.log(list, 212121212121212112);
      // 横坐标
      let _list = list;
      _list.forEach((item, index) => {
        // console.log(item);
        item[item.list[0].statTime] = item.list;
      });
      // console.log(_list, "纵坐标一次处理");
      let currentDateList = [];
      _list.forEach((item, index) => {
        // 拿到当天的数据
        for (let k in item) {
          if (k === date) {
            currentDateList = item[k];
          }
        }
      });
      // console.log(currentDateList, "纵坐标二次处理");
      // 纵坐标
      let yAxisData = [];
      // 横坐标
      let seriesData = [];
      currentDateList.forEach(item => {
        if (item.rank !== 0 && item.rank !== null) {
          yAxisData.push(item.category);
          seriesData.push(item.rank);
        }
      });
      // 如果处理出来没有数据
      // if (seriesData == "") {
      //   this.skuEchart.isChart5 = true;
      //   this.skuEchart.isStarShowLoading = false;
      //   return;
      // }
      option.yAxis.data = yAxisData;
      // series
      option.series = [
        {
          data: seriesData,
          type: "bar",
          barWidth: 50, //柱图宽度,
          itemStyle: {
            normal: {
              color: "#FB6D6B"
            }
          },
          label: {
            normal: {
              show: true,
              formatter: function(v) {
                // console.log(v.name);
                let name = v.name;
                //出现的次数
                let num = name.split(">").length - 1 + 1;
                return v.name + " （" + num + "级）" + " ：" + v.data + "名";
              },
              position: "insideLeft"
            }
          }
        }
      ];
      this.echartsData.chart6 = option;
      // 完成画图之后改变保存的日期
      this.echartsData.date = date;
    },
    // 处理BSR排名数据todon
    contrSkuRank(list) {
      let skuRankChart = echarts.init(document.getElementById("skuRankChart"));

      let option = {
        // title: {
        //   text: "BSR排名变化"
        // },
        tooltip: {
          trigger: "axis",
          formatter: function(params) {
            // let str = `${params[0].name}<br />`;
            // params.forEach(item => {
            //   let name = item.seriesName;
            //   let num = name.split(">").length - 1 + 1;
            //   if (item.data !== undefined) {
            //     str += `${item.marker} ${item.seriesName} (${num}级) : ${
            //       item.data
            //     }名<br/>`;
            //   }
            // });
            // return str;
          }
        },
        grid: {
          top: "8%",
          left: "5%",
          right: "4%",
          bottom: "5%",
          containLabel: true
        },
        toolbox: {
          feature: {
            // saveAsImage: { title: "保存" }
            // restore: {}
          }
        },
        xAxis: {
          show: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true
          },
          type: "category",
          // name: "时间",
          boundaryGap: false,
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          },
          data: []
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            show: true
          },
          min: 1,
          type: "value",
          name: "排名",
          nameLocation: "start",
          inverse: true,
          axisLabel: {
            textStyle: {
              color: "#999"
            }
          }
        },
        legend: {
          selectedMode: false,
          data: []
        },
        splitLine: {
          show: true,
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
      // 处理list
      // 横坐标
      let xAxisData = [];
      // console.log(list, "sku排名数");
      // 假数据
      // list = [
      //   {
      //     list: [
      //       {
      //         category:
      //           "Clothing, Shoes & Jewelry > Women > Clothing > Dresses",
      //         rank: 180,
      //         statTime: "2018-11-01"
      //       },
      //       {
      //         category: "Clothing, Shoes & Jewelry > Women > Shops",
      //         rank: 2395,
      //         statTime: "2018-11-01"
      //       },
      //       {
      //         category:
      //           "Clothing, Shoes &amp; Jewelry(See Top 100 in Clothing, Shoes &amp; Jewelry)",
      //         rank: 4372,
      //         statTime: "2018-11-01"
      //       }
      //     ]
      //   },
      //   {
      //     list: [
      //       {
      //         category:
      //           "Clothing, Shoes & Jewelry > Women > Clothing > Dresses",
      //         rank: 111,
      //         statTime: "2018-11-02"
      //       },
      //       {
      //         category: "1  Shoes &amp",
      //         rank: 222,
      //         statTime: "2018-11-02"
      //       }
      //     ]
      //   },

      //   {
      //     list: [
      //       {
      //         category:
      //           "Clothing, Shoes & Jewelry > Women > Clothing > Dresses111111",
      //         rank: 111,
      //         statTime: "2018-11-03"
      //       },
      //       {
      //         category: "1  Shoes &amp",
      //         rank: 222,
      //         statTime: "2018-11-03"
      //       },
      //       {
      //         category: "2   Shoes &amp",
      //         rank: 333,
      //         statTime: "2018-11-03"
      //       }
      //     ]
      //   }
      // ];
      // [
      //   {
      //     category: "Clothing, Shoes & Jewelry > Women > Clothing > Dresses",
      //     rank: [180, 111]
      //   },
      //   {
      //     category: "Clothing, Shoes & Jewelry > Women > Shops",
      //     rank: [2395, undefined]
      //   },
      //   {
      //     category:
      //       "Clothing, Shoes &amp; Jewelry(See Top 100 in Clothing, Shoes &amp; Jewelry)",
      //     rank: [4372, undefined]
      //   },
      //   {
      //     category: "1  Shoes &amp",
      //     rank: [undefined, 222]
      //   },
      //   {
      //     category: "2   Shoes &amp",
      //     rank: [undefined, 333]
      //   }
      // ];

      // 假数据end
      let _list = JSON.parse(JSON.stringify(list));

      let cateList = [];
      let _time = [];
      let result = [];

      _list.forEach(el => {
        el.list.forEach((subEl, index) => {
          if (index === 0) {
            _time.push(subEl.statTime);
          }

          if (!cateList.find(cur => cur === subEl.category)) {
            cateList.push(subEl.category);
          }
        });
      });

      // console.log(cateList, _time);

      cateList.forEach(el => {
        let rank = [];
        _list.forEach(_el => {
          let item = _el.list.find(innerEl => innerEl.category === el);
          if (item) {
            rank.push(item.rank);
          } else {
            rank.push(undefined);
          }
        });
        result.push({
          category: el,
          rank
        });
      });
      // console.log(result);

      _list.forEach((item, index) => {
        let time = item.list[0].statTime;
        if (time !== "" && time !== null) {
          xAxisData.push(item.list[0].statTime);
        }
      });
      option.xAxis.data = xAxisData;
      // console.log(_list[0], "list1[0]");
      let maxData = [];
      result.forEach((item, index) => {
        option.series.push({
          type: "line",
          name: item.category,
          data: item.rank
        });
        item.rank.forEach(i => {
          if (i !== undefined) {
            maxData.push(i);
          }
        });
      });
      // 如果处理出来没有数据
      if (option.series == "") {
        this.skuEchart.isChart5 = true;
        this.skuEchart.isStarShowLoading = false;
        return;
      } else {
        // 导出chart5 todo5
        this.echartsData.chart5_json = [];
        if (result.length > 0) {
          // // console.log(list, "list5");
          // // 纵列横列一起处理，这里
          xAxisData.forEach((v, k) => {
            this.echartsData.chart5_json[k] = { 日期: v };
          });
          // console.log(this.echartsData.chart5_json, "横坐标处理过后");
          // // 导出的数据横列
          this.echartsData.chart5_json.forEach((item, index) => {
            // console.log(item, "item");
            // console.log(_list[index], "v");
            _list[index].list.forEach((i, j) => {
              let category = i.category;
              item[category + ""] = i.rank || "-";
            });
          });
          this.echartsData.chart5_json.forEach(item => {
            // console.log(item, "item");
            for (var key in item) {
              if (key.indexOf(";") === -1 && key !== "日期") {
                delete item[key];
              }
            }
          });
          // console.log(this.echartsData.chart5_json, "chart5_json");
        }
      }
      let max = Math.max(...maxData);
      option.yAxis.max = getBigNum(max);
      //鼠标移动到横坐标
      let _this = this;
      skuRankChart.on("updateAxisPointer", function(event) {
        var xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          // console.log(xAxisInfo);
          // console.log(xAxisData[xAxisInfo.value]);
          let date = xAxisData[xAxisInfo.value];
          if (date !== _this.echartsData.date) {
            _this.drawBarChart(list, date);
          }
        }
      });
      if (option.xAxis.data.length > 5) {
        option.grid.bottom = "13%";
        option.dataZoom = [
          {
            type: "inside",
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            handleIcon:
              "M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z",
            handleSize: "80%",
            handleStyle: {
              color: "#fff",
              shadowBlur: 3,
              shadowColor: "rgba(0, 0, 0, 0.6)",
              shadowOffsetX: 2,
              shadowOffsetY: 2
            }
          }
        ];
      } else {
        option.grid.bottom = "6%";
      }
      this.echartsData.chart5 = option;
      this.skuEchart.isStarShowLoading = false;
    },
    // sku第一个图切换7天30天
    skuRankChange(e) {
      // console.log(e.name);
      // this.skuDateValue.value2 = "";
      let day = parseInt(e.name);
      this.skuDateValue.value2 = [getDay(day).computedDay, getDay().today];
      this.skuTabs.datStarTabsValue = e.name;
      this.getSkusRank(parseInt(e.name), null, null, this.skuData.sku);
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
      this.getSkusRank(null, date[0], date[1], this.skuData.sku);
    },
    // todom
    copy() {
      this.clipboard = new Clipboard(".btn");
      let _this = this;
      this.clipboard.on("success", e => {
        this.$message({
          type: "success",
          message: "复制成功"
        });
        // 释放内存
        _this.clipboard.destroy();
      });
      this.clipboard.on("error", e => {
        // 不支持复制
        this.$message.error("浏览器不支持复制");
        // 释放内存
        _this.clipboard.destroy();
      });
    },
    copy2() {
      // this.text = document.getElementById("text").innerText;
      this.clipboard = new Clipboard(".btn2");
      let _this = this;
      // console.log(document.getElementById("text").innerText);
      this.clipboard.on("success", e => {
        this.$message({
          type: "success",
          message: "复制成功"
        });
        // 释放内存
        _this.clipboard.destroy();
      });
      this.clipboard.on("error", e => {
        // 不支持复制
        this.$message.error("浏览器不支持复制");
        // 释放内存
        _this.clipboard.destroy();
      });
    }
  },
  computed: {
    // vuexSize() {
    //   return this.$store.state.competitive.sellingCntPage.Size;
    // },
    // vuexCurrentPage() {
    //   return this.$store.state.competitive.sellingCntPage.currentPage;
    // }
  },
  watch: {
    // 监听页码大小
    // vuexSize() {
    //   // 非搜索状态下请求全部
    //   this.getSellerCnt(
    //     this.dialog.page.sku,
    //     this.dialog.page.currentPage,
    //     this.dialog.page.Size
    //   );
    // },
    // // 监听页数
    // vuexCurrentPage() {
    //   this.getSellerCnt(
    //     this.dialog.page.sku,
    //     this.dialog.page.currentPage,
    //     this.dialog.page.Size
    //   );
    // }
    // 监控日新增评价数的日期
    // "dateValue.value1"() {
    //   this.datePickApi();
    // },
    // // 监控评价变化的日期
    // "dateValue.value2"() {
    //   this.starDatePickApi();
    // },
    // // 监控评分/评价数的日期
    // "dateValue.value3"() {
    //   this.twoDatePickApi();
    // }
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
  color: #777;
  li {
    margin-left: 50px;
    font-weight: bold;
    .timeColor {
      color: #00c0de;
    }
    .cancelBtn {
      position: relative;
      top: -7px;
      right: 5px;
    }
  }
}
.main {
  // border-top: 2px solid #f0f3fa;
  position: relative;
}
// 产品详情
.detalisContainer {
  padding: 20px 20px;
  border: 1px solid #e4e7ed;
  display: flex;
  overflow: auto;
  // 图片
  .imgContainer {
    width: 360px;
    height: 360px;
    display: flex;
    justify-content: space-between;
    .bigImg {
      width: 270px;
      height: 360px;
      margin-right: 10px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
    .smallImg {
      width: 79px;
      overflow: auto;
      padding-right: 2px;
      li {
        padding: 2px 4px;
        box-sizing: border-box;
        border: 1px dashed #e4e7ed;
        height: 60px;
        width: 45px;
        list-style: none;
        margin-top: 5px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      li.active {
        border: 2px solid #008000;
      }
    }
  }
}
// 文字详情todoc
.textContainer {
  margin-left: 40px;
  margin-top: 10px;
  ul {
    width: 800px;
    box-sizing: border-box !important;
    border-top: 1px solid #e4e4e4;
    margin-top: 7px;
    &:after {
      display: table;
      content: " ";
      clear: both;
    }
    li {
      padding-left: 15px;
      float: left;
      width: 200px;
      text-align: center;
      list-style: none;
      border-right: 1px solid #e4e4e4;
      border-bottom: 1px solid #e4e4e4;
      box-sizing: border-box !important;
      height: 36px;
      line-height: 36px;
      text-align: left;
    }
    .lg {
      width: 600px;
      text-align: left;
    }
    .li {
      background: #f2f2f2;
    }
    .left {
      border-left: 1px solid #e4e4e4;
    }
  }
  // .header {
  //   font-size: 14px;
  //   font-weight: bold;
  //   color: #333;
  //   max-width: 520px;
  // }
  // .asinCon {
  //   margin-top: 10px;
  //   .asin {
  //     font-weight: bold;
  //     color: #606266;
  //     font-size: 14px;
  //   }
  // }
  // .detaliCon {
  //   margin-top: 10px;
  //   width: 800px;
  //   float: left;
  //   li:nth-of-type(odd) {
  //     border-right: 1px dashed #111;
  //     width: 280px;
  //     :first-child {
  //       width: 100px;
  //       text-align: right;
  //       color: #606266;
  //     }
  //   }
  //   li:nth-of-type(even) {
  //     padding-left: 40px;
  //     :first-child {
  //       width: 130px;
  //       text-align: right;
  //       color: #444;
  //     }
  //   }
  //   li {
  //     box-sizing: border-box;
  //     float: left;
  //     width: 400px;
  //     margin-top: 25px;
  //     span {
  //       display: inline-block;
  //     }

  //     :nth-child(2) {
  //       margin-left: 10px;
  //       color: #666;
  //     }
  //   }
  // }
}
// 产品详情折叠板
.detalisExplainCon {
  margin-top: 20px;
  padding: 5px 20px;
  background: #f5f7fa;
  .productSellingPoint,
  .ProductDescription {
    padding-left: 20px;
    padding-top: 20px;
  }
  .icon {
    display: inline-block;
    width: 2px;
    height: 15px;
    background: #00c0de;
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
    height: 32px;
    line-height: 32px;
    background: #f2f2f2;
    padding: 0 20px;
  }
  .main {
    background: #fff;
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
  padding: 5px 14px;
  border: 1px solid #00c0de;
  text-align: center;
  color: #00c0de;
  border-radius: 5px;
  margin-left: 5px !important;
  cursor: pointer;
}
.optionBtnSelect {
  background: #00c0de !important;
  color: #fafafa !important;
}
.diagramBtnSelect {
  background: #00c0de !important;
  color: #fafafa !important;
}
// 公共样式
.commonChartCon {
  width: 100%;
  // margin: 20px 0;
  position: relative;
  .header {
    position: absolute;
    left: 20px;
    top: 0px;
    height: 39px;
    line-height: 39px;
    color: #909399;
    z-index: 100;
  }
  .datePickerCon {
    position: absolute;
    right: 0px;
    top: 5px;
  }
}
// 评分变化
.ScoreChange {
  width: 100%;
  min-height: 50px;
  border: 1px solid #c9c9c9;
  margin-top: 20px;
  .header {
    height: 32px;
    line-height: 32px;
    background: #f2f2f2;
    padding: 0 20px;
  }
  .main {
    background: #fff;
    min-height: 30px;
    margin-top: 0;
    padding: 0 20px;
  }
}
// 评分/评价数
.ScoreAndCount {
  width: 100%;
  min-height: 50px;
  border: 1px solid #dcdfe6;
  margin-top: 20px;
  .header {
    height: 39px;
    line-height: 39px;
    background: #f5f7fa;
    padding: 0 20px;
    position: relative;
  }
  .main {
    background: #fff;
    min-height: 30px;
    margin-top: 0;
    padding: 0 20px;
  }
}
.tabSkuContainer {
  // margin: 10px;
  border: 1px solid #c9c9c9;
  display: flex;
  .coContainer {
    display: flex;
    .leftul {
      width: 120px;
      text-align: center;
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
  // tabs sku
  .imgRightContainer {
    width: 100%;
    .imgRightxUl {
      height: 350px;
      width: 100%;
      display: flex;
      background: #f8f8f8;
      li:hover {
        border: 1px solid #67c23a;
      }
      li.active {
        border: 1px solid #67c23a;
      }
      li {
        box-sizing: border-box;
        width: 16.6%;
        height: 100%;
        text-align: center;
        background: #fff;
        margin: 0px 1%;
        span {
          display: block;
          height: 31px;
          line-height: 31px;
          overflow: auto;
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
.NewDailyEvaluation .header,
.ScoreChange .header,
.ScoreAndCount .header {
  color: #909399;
}
.__img_wrapper_sku {
  width: 120px;
  height: 165px;
  overflow: hidden;
  margin: 0 auto;
  background-color: #e8e8e8;
  img {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  img[lazy="loaded"] {
    background: #fff;
  }
}
.chart5_com {
  margin-top: 20px;
  width: 100%;
  div.section {
    display: inline-block;
  }
  div.section1 {
    width: 45%;
  }
  div.section2 {
    width: 52%;
  }
}
.export {
  position: absolute;
  top: 16px;
  right: 40px;
  z-index: 2000;
  cursor: pointer;
  i {
    font-size: 20px;
  }
}
</style>
