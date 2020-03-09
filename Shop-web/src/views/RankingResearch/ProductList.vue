<template>
  <div class="products-box">
    <y-template>
      <!-- <div slot="ScreenBack" class="screen-back">
                    <div>筛选条件</div>
                    <div class="back" @click="backPage"><i class="el-icon-back"></i>返回</div>
                </div> -->
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo" >
        <el-form-item prop="parentAsin" label='ASIN'>
          <el-input v-model.trim="listQuery.parentAsin" placeholder="ASIN" size="mini" clearable style='width:150px;'></el-input>
        </el-form-item>

        <!-- <el-form-item label="自然搜索排名:" prop="parentAsin" class="input-section">
                        <el-input v-model="listQuery.parentAsin" size="mini" clearable></el-input>
                    </el-form-item>
                    
                    <el-form-item label="~" prop="parentAsin" class="input-section">
                        <el-input v-model="listQuery.parentAsin" size="mini" clearable></el-input>
                    </el-form-item> -->
        <el-form-item v-for="(input, index) in listQuery.inputs" :label="input.label" :key="input.key" :prop="'inputs.' + index + '.value'" :rules="{trigger: ['blur', 'change'] ,validator:customValidate}" class="input-section">
          <el-input v-model.trim="input.value" size="mini" clearable></el-input>
        </el-form-item>

        <el-form-item prop="matchInTitle" label="搜索词在标题中匹配方式" v-show="selectQueryShow">
          <el-select v-model="listQuery.matchInTitle" placeholder="请选择" size="mini" clearable>
            <el-option v-for="item in [{value:0,label:'全部出现(紧密相连)'},
                                            {value:1,label:'全部出现(非紧密相连)'},
                                            {value:2,label:'部分出现'},
                                            {value:3,label:'未出现'},]" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="matchInFeature" label="搜索词在卖点中匹配方式" v-show="selectQueryShow">
          <el-select v-model="listQuery.matchInFeature" placeholder="请选择" size="mini" clearable>
            <el-option v-for="item in [{value:0,label:'全部出现(紧密相连)'},
                                            {value:1,label:'全部出现(非紧密相连)'},
                                            {value:2,label:'部分出现'},
                                            {value:3,label:'未出现'},]" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="fbpFlag" label="发货方式" v-show="selectQueryShow">
          <el-select v-model="listQuery.fbpFlag" placeholder="请选择" size="mini" clearable>
            <el-option v-for="item in [{value:0,label:'自发货'},
                                            {value:1,label:'FBA'},
                                            {value:2,label:'自发货+FBA'},]" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="sellYourselfFlag" label="跟卖情况" v-show="selectQueryShow">
          <el-select v-model="listQuery.sellYourselfFlag" placeholder="请选择" size="mini" clearable>
            <el-option v-for="item in [{value:0,label:'被人跟卖'},
                                            {value:1,label:'自跟卖'},
                                            {value:2,label:'无跟卖'},]" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button size="mini" type="primary" plain  @click="distribute('自定义筛选条件')">自定义筛选条件</el-button>
          <el-button size="mini" type="primary" @click="distribute('确认搜索')" icon="el-icon-search" :loading='$store.state.isloading || $store.state.loading'>搜索</el-button>
          <el-button size="mini" type="primary" plain @click="distribute('重置搜索')" :disabled='$store.state.isloading || $store.state.loading'>重置搜索</el-button>
        </el-form-item>
      </el-form>

      <div slot="HandleBtn">
        <el-button type="primary" plain size="mini" v-for="item in ['查看数据']" @click="distribute(item)">{{item}}</el-button>
				<div class="rightBtn">
				  <custom-table-column :custom-column="customColumnParams" v-on:setCustomColumn="setCustomColumn"></custom-table-column>
				</div>
      </div>
			
      <el-table slot="table" :data="list" v-loading="listLoading" :key='tableKey' style="width: 100%" border stripe :row-key="'parentAsin'" @sort-change="handleSortChange" @selection-change="handleSelectionChange">
        <el-table-column type="selection" :reserve-selection="true" width="55">
        </el-table-column>
        <el-table-column label="主图" width="80"  v-if="columnList.indexOf('imageUrl')!==-1">
          <template slot-scope="scope">
            <el-popover placement="right" trigger="hover">
              <div style="width:300px;height:150px;">
                <!-- <img :src="scope.row.imageUrl" style='display:block;width:100%;height:auto' /> -->
                <div style='width:100%;height:100%;background-repeat:no-repeat;background-size:contain;background-position:center;' :style="{backgroundImage: 'url('+ scope.row.imageUrl +')' }" ></div>
              </div>
              <img slot="reference" :src="scope.row.imageUrl" height="30" v-lazy="scope.row.imageUrl?scope.row.imageUrl:'-'" />
            </el-popover>
          </template>
        </el-table-column>

        <el-table-column prop="parentAsin" label="ASIN" min-width="120"   v-if="columnList.indexOf('parentAsin')!==-1">
          <template slot-scope="scope">
            <a @click="openWebsite(scope.row.productUrl)" class="url">{{scope.row.parentAsin}}</a>
          </template>
        </el-table-column>
        <el-table-column prop="imageCnt" label="图片数" :sortable="'custom'" width="85"  v-if="columnList.indexOf('imageCnt')!==-1">
        </el-table-column>
        <el-table-column label="自然搜索排名" prop="webRank" :sortable="'custom'" width="120"  v-if="columnList.indexOf('webRank')!==-1">

        </el-table-column>
        <el-table-column label="大类BSR" :sortable="'custom'" prop="rank" width="95"  v-if="columnList.indexOf('rank')!==-1">
          <template slot-scope="scope">
            <div v-if="scope.row.rank!==null">
              {{scope.row.rank}}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>

        <el-table-column label="大类BSR在结果中排名" prop="rankInResult" :sortable="'custom'" width="170"  v-if="columnList.indexOf('rankInResult')!==-1">
        </el-table-column>
        <el-table-column label="类目数" :sortable="'custom'" prop='bsrCategoryCnt' width="90"  v-if="columnList.indexOf('bsrCategoryCnt')!==-1">
          <template slot-scope="scope">
            <div v-if="scope.row.bsrCategoryCnt || scope.row.bsrCategoryCnt ===0">
              <el-button type="text" @click="showBsrCategoryCntDialog(scope.row)">{{scope.row.bsrCategoryCnt}}</el-button>
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>

        <el-table-column label="评分" :sortable="'custom'" prop='star_cnt' width="90"  v-if="columnList.indexOf('star_cnt')!==-1">
          <template slot-scope="scope">
            <div v-if="scope.row.starCnt!==null">
              {{scope.row.starCnt}}
            </div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="starRankRt" label="评分排名" :sortable="'custom'" width="100"  v-if="columnList.indexOf('starRankRt')!==-1">
        </el-table-column>
        <el-table-column prop="reviewCnt" label="总评价数" :sortable="'custom'" width="100"  v-if="columnList.indexOf('reviewCnt')!==-1">
        </el-table-column>
        <el-table-column prop="reviewRankRt" label="总评价数排名" :sortable="'custom'" width="120" v-if="columnList.indexOf('reviewRankRt')!==-1">
        </el-table-column>
        <el-table-column :render-header="renderNewReviewCnt" prop="newReviewCnt" label="新增评价数" :sortable="'custom'" min-width="170" v-if="columnList.indexOf('newReviewCnt')!==-1">
        </el-table-column>
        <el-table-column :render-header="renderNewReviewRankRt" prop="newReviewRankRt" label="新增评价数排名" :sortable="'custom'" min-width="200" v-if="columnList.indexOf('newReviewRankRt')!==-1">
        </el-table-column>
        <el-table-column prop="aqCnt" label="AQ数" :sortable="'custom'" width="90" v-if="columnList.indexOf('aqCnt')!==-1">
        </el-table-column>
        <el-table-column prop="aqRankRt" label="AQ数排名" :sortable="'custom'" width="100" v-if="columnList.indexOf('aqRankRt')!==-1">
        </el-table-column>

        <el-table-column prop="newAqCntAvgD30" label="AQ日新增数" :sortable="'custom'" width="115" v-if="columnList.indexOf('newAqCntAvgD30')!==-1">
        </el-table-column>
        <el-table-column prop="newNegativeCntAvgD30" label="日新增差评数" :sortable="'custom'" width="120" v-if="columnList.indexOf('newNegativeCntAvgD30')!==-1">
        </el-table-column>
        <el-table-column prop="rankPrice" label="霸占排名子SKU价格" :sortable="'custom'" width="160" v-if="columnList.indexOf('rankPrice')!==-1">
        </el-table-column>
        <el-table-column prop="rankPriceRankRt" label="价格排名" :sortable="'custom'" width="100" v-if="columnList.indexOf('rankPriceRankRt')!==-1">
        </el-table-column>
        <el-table-column prop="skuCnt" label="子SKU数量" :sortable="'custom'" width="110" v-if="columnList.indexOf('skuCnt')!==-1">
        </el-table-column>
        <el-table-column prop="fitRate" label="FIT率" :sortable="'custom'" width="90" :formatter="formatterFitRate" v-if="columnList.indexOf('fitRate')!==-1">
        </el-table-column>
        <el-table-column prop="releaseDay" label="已上架天数" :sortable="'custom'" width="110" v-if="columnList.indexOf('releaseDay')!==-1">
        </el-table-column>
        <el-table-column prop="matchInTitle" label="搜索词在标题中匹配方式" width="160" v-if="columnList.indexOf('matchInTitle')!==-1">
          <template slot-scope="scope">
            <div v-if="scope.row.matchInTitle==0">全部出现(紧密相连)</div>
            <div v-else-if="scope.row.matchInTitle==1">全部出现(非紧密相连)</div>
            <div v-else-if="scope.row.matchInTitle==2">部分出现</div>
            <div v-else-if="scope.row.matchInTitle==3">未出现</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="matchInFeature" label="搜索词在卖点中匹配方式" width="160" v-if="columnList.indexOf('matchInFeature')!==-1">
          <template slot-scope="scope">
            <div v-if="scope.row.matchInFeature==0">全部出现(紧密相连)</div>
            <div v-else-if="scope.row.matchInFeature==1">全部出现(非紧密相连)</div>
            <div v-else-if="scope.row.matchInFeature==2">部分出现</div>
            <div v-else-if="scope.row.matchInFeature==3">未出现</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column prop="fbpFlag" label="发货方式" width="90" v-if="columnList.indexOf('fbpFlag')!==-1">
          <template slot-scope="scope">
            <div v-if="scope.row.fbpFlag==0">自发货</div>
            <div v-else-if="scope.row.fbpFlag==1">FBA</div>
            <div v-else-if="scope.row.fbpFlag==2">自发货+FBA</div>
            <div v-else>-</div>

          </template>
        </el-table-column>
        <!-- prop="sellYourselfFlag" -->
        <el-table-column label="跟卖情况" width="160" :formatter="formatterSellYourselfFlag" v-if="columnList.indexOf('sellYourselfFlag')!==-1">
          <!-- <template slot-scope="scope">
                                <div v-if="scope.row.sellYourselfFlag==1">自跟卖【发货方式】</div>
                                <div v-else-if="scope.row.sellYourselfFlag==2">被人跟卖【跟卖卖家数】</div>
                                <div v-else>-</div>
                            </template> -->
        </el-table-column>

        <el-table-column prop="newPositiveHelpfulCntAvgD30" label="好评每日新增helpful数" :sortable="'custom'" width="170" v-if="columnList.indexOf('newPositiveHelpfulCntAvgD30')!==-1">
        </el-table-column>
        <el-table-column prop="newOtherHelpfulCntAvgD30" label="中差评每日新增helpful数" :sortable="'custom'" width="190" v-if="columnList.indexOf('newOtherHelpfulCntAvgD30')!==-1">
        </el-table-column>
        <el-table-column prop="asinPriceChange" label="价格变化" width="100" v-if="columnList.indexOf('asinPriceChange')!==-1">
        </el-table-column>

      </el-table>
      <el-pagination slot="pagination" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </y-template>

    <yt-dialog :options="columnDateOptions" :events="columnDateEvents" class="column-date-dialog">
      <el-date-picker v-model="columnDate" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" style="margin-bottom:10px" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd" size="mini">
        <!-- value-format="yyyy-MM-dd" 加上报错 后面通过dayjs 转成字符串 -->
      </el-date-picker>
    </yt-dialog>

    <yt-dialog title="填写误差" :visible.sync="outerVisible" width="500px" :options='outerVisibleOpt' :events='outerVisibleOptEvents'>
      <el-form size="small" :model="rankCompareListQuery" ref="rankCompareListQueryForm" label-width="70px" class="demo-ruleForm">
        <el-form-item label="误差范围" prop="toleranceScope" :rules="[
                        { required: true, message: '误差范围不能为空'},
                        { type: 'number', message: '误差范围必须为数字值'}
                        ]">
          <el-input type="age" v-model.number="rankCompareListQuery.toleranceScope" size="mini" clearable></el-input>
        </el-form-item>
      </el-form>

      <el-dialog width="1220px" title="数据比较" :visible.sync="innerVisible" class="inner-visible-dialog" append-to-body>
        <el-table :data="rankCompareList" v-loading="rankCompareListLoading" :key='rankCompareTableKey' style="width: 100%" border stripe>
          <el-table-column prop="parentAsin" label="ASIN" width="110">
          </el-table-column>
          <el-table-column prop="webRank" label="自然搜索排名" width="100">
          </el-table-column>
          <el-table-column label="大类BSR在所有结果的排名" width="170" align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.rankInResultFlag==0" class="el-icon-error" style="font-size:18px;color:#d81e06;">
              </i>
              <i v-else-if="scope.row.rankInResultFlag==1" class="el-icon-check" style="font-size:18px;color:#5fd699;">
              </i>
              <i v-else>-</i>
            </template>
          </el-table-column>
          <el-table-column label="评分在结果的排名" width="120" align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.starRankRtFlag==0" class="el-icon-error" style="font-size:18px;color:#d81e06;">
              </i>
              <i v-else-if="scope.row.starRankRtFlag==1" class="el-icon-check" style="font-size:18px;color:#5fd699;">
              </i>
              <i v-else>-</i>
            </template>
          </el-table-column>
          <el-table-column label="总评价在结果的排名" width="130" align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.reviewRankRtFlag==0" class="el-icon-error" style="font-size:18px;color:#d81e06;">
              </i>
              <i v-else-if="scope.row.reviewRankRtFlag==1" class="el-icon-check" style="font-size:18px;color:#5fd699;">
              </i>
              <i v-else>-</i>
            </template>
          </el-table-column>
          <el-table-column :render-header="renderNewReviewRankRtFlag" min-width="250" align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.newReviewRankRtFlag==0" class="el-icon-error" style="font-size:18px;color:#d81e06;">
              </i>
              <i v-else-if="scope.row.newReviewRankRtFlag==1" class="el-icon-check" style="font-size:18px;color:#5fd699;">
              </i>
              <i v-else>-</i>
            </template>
          </el-table-column>
          <el-table-column label="AQ数在当前结果的排名" width="150" align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.aqRankRtFlag==0" class="el-icon-error" style="font-size:18px;color:#d81e06;">
              </i>
              <i v-else-if="scope.row.aqRankRtFlag==1" class="el-icon-check" style="font-size:18px;color:#5fd699;">
              </i>
              <i v-else>-</i>
            </template>
          </el-table-column>
          <el-table-column label="价格当前结果的排名" width="135" align="center">
            <template slot-scope="scope">
              <i v-if="scope.row.rankPriceRankRtFlag==0" class="el-icon-error" style="font-size:18px;color:#d81e06;">
              </i>
              <i v-else-if="scope.row.rankPriceRankRtFlag==1" class="el-icon-check" style="font-size:18px;color:#5fd699;">
              </i>
              <i v-else>-</i>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination background @size-change="handleRcSizeChange" @current-change="handleRcCurrentChange" :current-page="rankCompareListQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="rankCompareListQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="rankCompareTotal">
        </el-pagination>
      </el-dialog>

      <!-- <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showRankCompareDialog()">确 认</el-button>
        <el-button type="primary" @click="outerVisibleOpt.visible = false">取 消</el-button>
      </div> -->
    </yt-dialog>

    <yt-dialog :options="bsrCategoryCntOptions" :events="bsrCategoryCntEvents" class="column-date-dialog">
      <el-table :data="krBsrCategoryList" style="width: 100%" border stripe>
        <el-table-column prop="bsrCategory" label="类目" min-width="220">
          <template slot-scope="scope">
            <a v-if="scope.row.categoryUrl" @click="openWebsite(scope.row.categoryUrl)" class="url">{{scope.row.bsrCategory}}</a>
            <div v-else>{{scope.row.bsrCategory}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="rank" label="排名" width="85">
        </el-table-column>
      </el-table>
    </yt-dialog>
  </div>
</template>
<script>
import YTemplate from "../Common/y-template/index";
import CustomTableColumn from "../KeyLexicon/KeyLexicon/components/custom-table-column";
const _ = require("lodash");
const dayjs = require("dayjs");
const inputs = [
  
  { label: "评分:", value: null },
  { label: "~", value: null },
  { label: "AQ数:", value: null },
  { label: "~", value: null },
  { label: "大类BSR:", value: null },
  { label: "~", value: null },
  { label: "FIT率:", value: null },
  { label: "~", value: null },
  { label: "图片数:", value: null },
  { label: "~", value: null },
  { label: "总评价数:", value: null },
  { label: "~", value: null },
  { label: "AQ日新增数:", value: null },
  { label: "~", value: null },
  { label: "bsr类目数:", value: null },
  { label: "~", value: null },
];
export default {
  components: {
    YTemplate,
		CustomTableColumn
  },
  props: ["pTaskId"],
  data() {
    return {
			customColumnParams: {
			  oneLevelHeader: true,
			  checkboxList: [
			    "imageUrl",
			    "parentAsin",
					"imageCnt",
					"webRank",
					"rank",
					"rankInResult",
					"bsrCategoryCnt",
					"star_cnt",
					"starRankRt",
					"reviewCnt",
					"reviewRankRt",
					"newReviewCnt",
					"newReviewRankRt",
					"aqCnt",
					"aqRankRt",
					"newAqCntAvgD30",
					"newNegativeCntAvgD30",
					"rankPrice",
					"rankPriceRankRt",
					"skuCnt",
					"fitRate",
					"releaseDay",
					"matchInTitle",
					"matchInFeature",
					"fbpFlag",
					"sellYourselfFlag",
					"newPositiveHelpfulCntAvgD30",
					"newOtherHelpfulCntAvgD30",
					"asinPriceChange"
			  ],
			  checkboxOptions: [
			    { label: "imageUrl", name: "主图" },
			    { label: "parentAsin", name: "ASIN" },
					{ label: "imageCnt", name: "图片数" },
					{ label: "webRank" , name: "自然搜索排名"},
					{ label: "rank", name: "大类BSR" },
					{ label: "rankInResult", name: "大类BSR在结果中排名" },
					{ label: "bsrCategoryCnt", name: "类目数" },
					{ label: "star_cnt" , name: "评分"},
					{ label: "starRankRt", name: "评分排名" },
					{ label: "reviewCnt", name: "总评价数" },
					{ label: "reviewRankRt", name: "总评价数排名" },
					{ label: "newReviewCnt" , name: "新增评价数"},
					{ label: "newReviewRankRt", name: "新增评价数排名" },
					{ label: "aqCnt", name: "AQ数" },
					{ label: "aqRankRt", name: "AQ数排名" },
					{ label: "newAqCntAvgD30" , name: "AQ日新增数"},
					{ label: "newNegativeCntAvgD30", name: "日新增差评数" },
					{ label: "rankPrice", name: "霸占排名子SKU价格" },
					{ label: "rankPriceRankRt", name: "价格排名" },
					{ label: "skuCnt", name: "子SKU数量"},
					{ label: "fitRate", name: "FIT率" },
					{ label: "releaseDay", name: "已上架天数" },
					{ label: "matchInTitle", name: "搜索词在标题匹配方式" },
					{ label: "matchInFeature", name: "搜索词在卖点匹配方式"},
					{ label: "fbpFlag", name: "发货方式" },
					{ label: "sellYourselfFlag", name: "跟卖情况" },
					{ label: "newPositiveHelpfulCntAvgD30", name: "好评每日新增helpful数" },
					{ label: "newOtherHelpfulCntAvgD30", name: "中差评每日新增helpful数"},
					{ label: "asinPriceChange", name: "价格变化"},
			  ]
			},
      customValidate: (rule, value, callback) => {
        // 评分 4，5 / 1.0~5.0
        // FIT率 14，15/0~1.00
        // 其它 正整数
        console.log(rule);
        if (value) {
          let coordinate = rule.field.split(".")[1];

          console.log(coordinate + "--------");
          console.log(Number(value) % 1 === 0);
          if (coordinate == 4 || coordinate == 5) {
            if (!/^(\-)*(\d+)\.(\d).*$/.test(value)) {
              return callback(new Error("一位小数"));
            }
            if (value < 1.0 || value > 5.0) {
              return callback(new Error("1.0至5.0"));
            }
          } else if (coordinate == 12 || coordinate == 13) {
            //日新增差评数
            if (isNaN(Number(value))) {
              return callback(new Error("正确输入数字"));
            } else if (Number(value) < 0) {
              return callback(new Error("大于0"));
            } else if (
              !(Number(value) % 1 === 0) ||
              value.indexOf(".") !== -1
            ) {
              return callback(new Error("正整数"));
            }
          } else if (coordinate == 14 || coordinate == 15) {
            //FIT率
            if (
              !/^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/.test(value) &&
              value.indexOf(".") !== -1
            ) {
              return callback(new Error("两位小数"));
            } else if (value.indexOf("%") !== -1) {
              if (value.length > 3 && value !== "100%") {
                return callback(new Error("0%至100%"));
              }
            } else if (Number(value) < 0 || Number(value) > 1.0) {
              return callback(new Error("0至1.00"));
            } else if (value.indexOf(".") === -1 && value.indexOf("%") === -1) {
              //限制输入01,02等等
              let num = value.split("0");
              //console.log(num);
              if (num.length >= 2 && num[0] === "") {
                return callback(new Error("正确输入数字"));
              }
            } else if (isNaN(Number(value))) {
              return callback(new Error("正确输入数字"));
            }
          } else {
            if (coordinate == 32 || coordinate == 33) {
              return callback();
            } else if (!/^\d+$/.test(value)) {
              return callback(new Error("正整数"));
            }
          }

          if (parseInt(coordinate) % 2 == 0) {
            let nexVal = this.listQuery.inputs[parseInt(coordinate) + 1].value;
            console.log(value, nexVal);
            console.log("小值");
            if (nexVal && nexVal < Number(value)) {
              return callback(new Error("小于最大值"));
            }
          } else {
            let preVal = this.listQuery.inputs[parseInt(coordinate) - 1].value;
            console.log(preVal, value);
            console.log("大值");
            if (preVal && preVal > Number(value)) {
              return callback(new Error("大于最小值"));
            }
          }
        }
        // setTimeout(() => {
        //     callback();
        // }, 1000);
        callback();
      },
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近两周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 14);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          }
        ]
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,

      inputSurplus: [
        { label: "价格变化:", value: null },
        { label: "~", value: null },
        { label: "近14天新增评价数在结果中的排名:", value: null },
        { label: "~", value: null },
        { label: "已上架天数:", value: null },
        { label: "~", value: null },
        { label: "自然搜索排名:", value: "" },
        { label: "~", value: null },
        { label: "评分在结果中的排名:", value: null },
        { label: "~", value: null },
        { label: "总评价数在结果中排名:", value: null },
        { label: "~", value: null },
        { label: "近14天新增评价数:", value: null },
        { label: "~", value: null },
        { label: "日新增差评数:", value: null },
        { label: "~", value: null },
        { label: "AQ数在结果中的排名:", value: null },
        { label: "~", value: null },
        { label: "霸占排名子SKU价格:", value: null },
        { label: "~", value: null },
        { label: "霸占排名子SKU价格排名:", value: null },
        { label: "~", value: null },
       
        { label: "好评每日新增helpful数:", value: null },
        { label: "~", value: null },
        { label: "中差评每日新增helpful数:", value: null },
        { label: "~", value: null },
        
        { label: "大类BSR在结果中排名:", value: null },
        { label: "~", value: null },
      ],
      selectQueryShow: false,
      sortProp: null,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        field: null,
        sort: 0,
        taskId: null,
        parentAsin: null,

        inputs,
        matchInTitle: null,
        matchInFeature: null,
        fbpFlag: null,
        sellYourselfFlag: null
      },
      newReviewCntDateTitle: "近14天",
      newReviewRankRtDateTitle: "近14天",

      columnDate: [],
      columnDateType: "newReviewCnt",
      newReviewCntDate: [],
      newReviewRankRtDate: null,

      columnDateOptions: {
        visible: false,
        width: "280px",
        title: "设置时间",
        okBtnText: "确认"
      },
      columnDateEvents: {
        handleOkClick: () => {
          let columnDate = this.columnDate;
          //console.log(columnDate);
          if (columnDate !== null) {
            let startDate = dayjs(columnDate[0]);
            let endDate = dayjs(columnDate[1]);
            let days = endDate.diff(startDate, "day");
            if (this.columnDateType === "newReviewCnt") {
              this.newReviewCntDate = columnDate;
              if (days == 0) {
                this.newReviewCntDateTitle = `今天`;
              } else {
                this.newReviewCntDateTitle = `近${days}天`;
              }
              this.listQuery.startTime = columnDate[0];
              this.listQuery.endTime = columnDate[1];
              this.getList();
            } else if (this.columnDateType === "newReviewRankRt") {
              this.newReviewRankRtDate = columnDate;
              this.newReviewRankRtDateTitle = `近${days}天`;
              this.listQuery.startTime = columnDate[0];
              this.listQuery.endTime = columnDate[1];
              this.getList();
            } else if (this.columnDateType === "newReviewRankRtFlag") {
              this.rankCompareDate = columnDate;
              this.rankCompareDateTitle = `近${days}`;
              this.rankCompareListQuery.startTime = columnDate[0];
              this.rankCompareListQuery.endTime = columnDate[1];
              this.getRcList();
            }
          }

          this.columnDateOptions.visible = false;
        }
      },
      outerVisibleOpt:{
        title:'填写误差',
        width:"500px",
        visible:false
      },
      outerVisibleOptEvents:{
        handleOkClick:()=>{
            return this.showRankCompareDialog()
        }
      },
      outerVisible: false,
      innerVisible: false,
			columnList: null,
      rankCompareTableKey: 1,
      rankCompareList: null,
      rankCompareTotal: null,
      rankCompareListLoading: false,
      rankCompareListQuery: {
        pageSize: 10,
        pageNumber: 1,
        taskId: null,
        parentAsins: null,
        toleranceScope: null,
        startTime: null,
        endTime: null,
        daterange: []
      },
      rankCompareDateTitle: "近14",
      rankCompareDate: null,
      bsrCategoryCntOptions: {
        visible: false,
        width: "800px",
        title: "查看类目",
        okBtnText: "关闭",
        showCancel: false
      },
      bsrCategoryCntEvents: {
        handleOkClick: () => {
          this.bsrCategoryCntOptions.visible = false;
        }
      },
      krBsrCategoryList: null,
      multipleSelection: []
    };
  },

  created() {
    this.listQuery.taskId = this.pTaskId;
    this.rankCompareListQuery.taskId = this.pTaskId;
		this.columnList = this.customColumnParams.checkboxList;
    this.getList(true);

    //默认的给近14天赋值
    var myDate = new Date().getTime(); //今天
    var oldDate = new Date().getTime() - 1000 * 14 * 24 * 60 * 60; //14天前时间戳

    //时间戳转日期格式
    function add0(m) {
      return m < 10 ? "0" + m : m;
    }
    function timeFormat(timestamp) {
      //timestamp是整数，否则要parseInt转换,不会出现少个0的情况
      var time = new Date(timestamp);
      var year = time.getFullYear();
      var month = time.getMonth() + 1;
      var date = time.getDate();
      var hours = time.getHours();
      var minutes = time.getMinutes();
      var seconds = time.getSeconds();
      return (
        year +
        "-" +
        add0(month) +
        "-" +
        add0(date) +
        " " +
        add0(hours) +
        ":" +
        add0(minutes) +
        ":" +
        add0(seconds)
      );
    }
    var newTime = timeFormat(myDate).split(" ")[0]; //当前时间日期格式
    var oldTime = timeFormat(oldDate).split(" ")[0]; //14前时间日期格式
    this.newReviewCntDate = [oldTime, newTime];
  },
  methods: {
		setCustomColumn(list) {
		  this.columnList = list;
		},
    distribute(btn) {
      switch (btn) {
        case "确认搜索":
          this.handleFilter();
          break;
        case "自定义筛选条件":
          this.changeQueryParams();
          break;
        case "查看数据":
          this.showDataDialog();
          break;
        case "重置搜索":
          this.resetListQueryForm();
          break;
      }
    },
    getColumnDate(type) {
      this.columnDateType = type;
      if (type === "newReviewCnt") {
        this.columnDate = this.newReviewCntDate;
      } else if (type === "newReviewRankRt") {
        this.columnDate = this.newReviewRankRtDate;
      } else if (type === "newReviewRankRtFlag") {
        this.columnDate = this.rankCompareDate;
      }
      this.columnDateOptions.visible = true;
    },
    renderNewReviewCnt(h, { column, $index }) {
      return (
        <span>
          <span
            style={{ color: "#409EFF" }}
            onClick={event => {
              this.getColumnDate("newReviewCnt");
              event.stopPropagation();
            }}
          >
            {this.newReviewCntDateTitle}
          </span>{" "}
          新增评价数
        </span>
      );
    },
    renderNewReviewRankRt(h, { column, $index }) {
      // return (
      //     <span><span style={{color:'#409EFF'}} onClick={(event)=>{
      //         this.getColumnDate('newReviewRankRt')
      //         event.stopPropagation();
      //     }}>{this.newReviewRankRtDateTitle}</span> 新增评价数排名</span>
      // );

      return (
        <span>
          <span
            style={{ color: "#409EFF" }}
            onClick={event => {
              this.getColumnDate("newReviewCnt");
              event.stopPropagation();
            }}
          >
            {this.newReviewCntDateTitle}
          </span>{" "}
          新增评价数排名
        </span>
      );
    },
    changeQueryParams() {
      if (this.listQuery.inputs.length == 16) {
        // 数组叠加
        let concatArr = _.concat(inputs, this.inputSurplus);
        this.listQuery.inputs = concatArr;
        this.selectQueryShow = true;
      } else {
        this.listQuery.inputs = inputs;
        this.selectQueryShow = false;
      }
      let listQueryForm = this.$refs.listQueryForm;
      if (listQueryForm !== undefined) {
        this.listQuery.inputs.forEach(element => {
          element.value = null;
        });
        listQueryForm.resetFields();
      }
    },
    formatterFitRate(row, column) {
      let val = row.fitRate;
      if (!val) {
        return "-";
      }
      return this.toPercent(val);
    },
    toPercent(point) {
      if (isNaN(point) || point == 0) {
        return "0%";
      }

      let str = Number(point * 100).toFixed(); //保留两位小数
      str += "%";
      return str;
    },
    formatterSellYourselfFlag(row, column) {
      let sellYourselfFlag = row.sellYourselfFlag;
      let fbpFlag = row.fbpFlag;
      // if(!sellYourselfFlag && !fbpFlag){
      //     return '-'
      // }
      let fbp = null;
      if (fbpFlag == 1) {
        fbp = "【自发货】";
      } else if (fbpFlag == 2) {
        fbp = "【FBA】";
      } else if (fbpFlag == 3) {
        fbp = "【自发货+FBA】";
      }

      let sellYourself = "";
      if (sellYourselfFlag == 0) {
        sellYourself = `被人跟卖【${row.sellerCnt}人】`;
      } else if (sellYourselfFlag == 1) {
        sellYourself = "自跟卖" + fbp;
      } else if (sellYourselfFlag == 2) {
        sellYourself = `无跟卖`;
      }
      return sellYourself;
    },
    getList(init) {
      if (init) {
        this.loadData();
      } else {
        this.$refs["listQueryForm"].validate(valid => {
          if (valid) {
            this.loadData();
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      }
    },
    loadData() {
      this.listLoading = true;
      console.log("object");
      let listQuery = _.cloneDeep(this.listQuery);

      //console.log(this.listQuery);

      this.getQueryParams(listQuery, this.listQuery.inputs);
      delete listQuery.inputs;

      if (listQuery.brandType == 2) {
        listQuery.ruleId = null;
      }
      //console.log(this.sortProp);
      if (this.sortProp) {
        let sortPropArr = this.sortProp.split(" ");
        console.log(sortPropArr);
        if (sortPropArr.length === 2) {
          listQuery.field = sortPropArr[0];
          console.log(sortPropArr[0]);
          if (sortPropArr[1] === "desc") {
            listQuery.sort = 0;
          } else {
            listQuery.sort = 1;
          }
        } else {
          listQuery.field = null;
          listQuery.sort = 0;
        }
      } else {
        listQuery.field = null;
        listQuery.sort = 0;
      }

      Object.keys(listQuery).forEach(element => {
        if (listQuery[element] === "") {
          listQuery[element] = null;
        }
        if (listQuery[element] !== null) {
          let str = element.substring(0, 3);
          if (str === "min" || str === "max") {
            if (element !== "maxFitRate" && element !== "minFitRate") {
              listQuery[element] = Number(listQuery[element]);
            } else {
              //去除FIT的%
              console.log(listQuery["minFitRate"]);
              console.log(listQuery["maxFitRate"]);
              let min = String(listQuery["minFitRate"]);
              let max = String(listQuery["maxFitRate"]);
              if (min.indexOf("%") !== -1 || max.indexOf("%") !== -1) {
                if (element === "minFitRate") {
                  let str = min.substring(0, min.indexOf("%"));
                  let minFitRate = Number(str) / 100;
                  listQuery[element] = minFitRate;
                } else {
                  let str = max.substring(0, max.indexOf("%"));
                  let maxFitRate = Number(str) / 100;
                  listQuery[element] = maxFitRate;
                }
              }
            }
          }
        }
      });

      this.$api["krResearchProductList"](listQuery)
        .then(res => {
          let { rows, total } = res;
          this.list = rows;
          this.total = total;
          setTimeout(() => {
            this.listLoading = false;
          }, 500);
        })
        .catch(() => {
          this.listLoading = false;
        });
    },
    getQueryParams(listQuery, inputs) {
      let label = null;
      inputs.forEach((element, index) => {
        label = element.label;
        switch (label) {
          case "图片数:":
            listQuery.minImageCnt = element.value;
            listQuery.maxImageCnt = inputs[index + 1].value;
            break;
          case "自然搜索排名:":
            listQuery.minWebRank = element.value;
            listQuery.maxWebRank = inputs[index + 1].value;
            break;
          case "大类BSR:":
            listQuery.minRank = element.value;
            listQuery.maxRank = inputs[index + 1].value;
            break;
          case "大类BSR在结果中排名:":
            listQuery.minRankInResult = element.value;
            listQuery.maxRankInResult = inputs[index + 1].value;
            break;
          case "bsr类目数:":
            listQuery.minBsrCategoryCnt = element.value;
            listQuery.maxBsrCategoryCnt = inputs[index + 1].value;
            break;
          case "评分:":
            listQuery.minStarCnt = element.value;
            listQuery.maxStarCnt = inputs[index + 1].value;
            break;
          case "评分在结果中的排名:":
            listQuery.minStarRankRt = element.value;
            listQuery.maxStarRankRt = inputs[index + 1].value;
            break;
          case "总评价数:":
            listQuery.minReviewCnt = element.value;
            listQuery.maxReviewCnt = inputs[index + 1].value;
            break;
          case "总评价数在结果中排名:":
            listQuery.minReviewRankRt = element.value;
            listQuery.maxReviewRankRt = inputs[index + 1].value;
            break;
          case "新增评价数:":
            listQuery.minNewReviewCnt = element.value;
            listQuery.maxNewReviewCnt = inputs[index + 1].value;
            break;
          case "新增评价数在结果中的排名:":
            listQuery.minNewReviewRankRt = element.value;
            listQuery.maxNewReviewRankRt = inputs[index + 1].value;
            break;
          case "AQ数:":
            listQuery.minAqCnt = element.value;
            listQuery.maxAqCnt = inputs[index + 1].value;
            break;
          case "AQ数在结果中的排名:":
            listQuery.minAqRankRt = element.value;
            listQuery.maxAqRankRt = inputs[index + 1].value;
            break;
          case "AQ日新增数:":
            listQuery.minNewAqCntAvgD30 = element.value;
            listQuery.maxNewAqCntAvgD30 = inputs[index + 1].value;
            break;
          case "日新增差评数:":
            listQuery.minNewNegativeCntAvgD30 = element.value;
            listQuery.maxNewNegativeCntAvgD30 = inputs[index + 1].value;
            break;
          case "霸占排名子SKU价格:":
            listQuery.minRankPrice = element.value;
            listQuery.maxRankPrice = inputs[index + 1].value;
            break;
          case "霸占排名子SKU价格排名:":
            listQuery.minRankPriceRankRt = element.value;
            listQuery.maxRankPriceRankRt = inputs[index + 1].value;
            break;
          case "子sku数量:":
            listQuery.minSkuCnt = element.value;
            listQuery.maxSkuCnt = inputs[index + 1].value;
            break;
          case "FIT率:":
            listQuery.minFitRate = element.value;
            listQuery.maxFitRate = inputs[index + 1].value;
            break;
          case "已上架天数:":
            listQuery.minReleaseDay = element.value;
            listQuery.maxReleaseDay = inputs[index + 1].value;
            break;
          case "好评每日新增helpful数:":
            listQuery.minNewPositiveHelpfulCntAvgD30 = element.value;
            listQuery.maxNewPositiveHelpfulCntAvgD30 = inputs[index + 1].value;
            break;
          case "中评每日新增helpful数:":
            listQuery.minNewOtherHelpfulCntAvgD30 = element.value;
            listQuery.maxNewOtherHelpfulCntAvgD30 = inputs[index + 1].value;
            break;
          case "价格:":
            listQuery.minAsinPriceChange = element.value;
            listQuery.maxAsinPriceChange = inputs[index + 1].value;
            break;
        }
      });
    },
    handleFilter() {
      this.listQuery.pageNumber = 1;
      this.getList(false);
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList(false);
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getList(false);
    },
    handleSortChange({ column, prop, order }) {
      if (!prop) {
        this.sortProp = null;
        this.handleFilter();
        return;
      }
      console.log(column, prop, order);
      const sortOrder = `${prop.replace(/[A-Z]{1}/g, function(str) {
        return "_" + str.toLowerCase();
      })} ${order === "ascending" ? "asc" : "desc"}`;
      console.log(sortOrder);
      this.sortProp = sortOrder;
      this.handleFilter();
    },
    showBsrCategoryCntDialog(row) {
      let params = {
        taskId: this.pTaskId,
        parentAsin: row.parentAsin
      };
      this.$api["krBsrCategoryList"](params).then(res => {
        let { code, data } = res;
        if (code == 0) {
          data.forEach(element => {
            if (element.bsrCategory) {
              element.bsrCategory = element.bsrCategory.replace(/:/g, ">");
            }
          });
          this.krBsrCategoryList = data;
        } else {
          this.krBsrCategoryList = null;
        }
        this.bsrCategoryCntOptions.visible = true;
      });
    },
    openWebsite(url) {
      window.open(url);
    },
    backPage() {
      this.$router.push({
        path: "/RankingResearch"
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    showDataDialog() {
      let ms = this.multipleSelection;
      if (ms.length == 0) {
        this.$message.warning("至少选一项");
        return;
      }
      let parentAsins = [];
      ms.forEach(element => {
        parentAsins.push(element.parentAsin);
      });
      this.rankCompareListQuery.parentAsins = parentAsins;

      let startTime = dayjs()
        .subtract(14, "day")
        .format("YYYY-MM-DD");
      let endTime = dayjs().format("YYYY-MM-DD"); // 今天
      this.rankCompareListQuery.startTime = startTime;
      this.rankCompareListQuery.endTime = endTime;
      this.rankCompareDate = [startTime, endTime];

      let rankCompareListQueryForm = this.$refs.rankCompareListQueryForm;
      if (rankCompareListQueryForm !== undefined) {
        rankCompareListQueryForm.resetFields();
      }
      this.outerVisibleOpt.visible = true;
    },
    showRankCompareDialog() {
      this.$refs.rankCompareListQueryForm.validate(valid => {
        if (valid) {
          this.innerVisible = true;
          this.getRcList();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getRcList() {
      let listQuery = _.cloneDeep(this.rankCompareListQuery);
      delete listQuery.daterange;
      this.rankCompareListLoading = true;
      this.$api["krResearchProductRankCompareList"](listQuery)
        .then(res => {
          let { rows, total } = res;
          this.rankCompareList = rows;
          this.rankCompareTotal = total;
          setTimeout(() => {
            this.rankCompareListLoading = false;
          }, 500);
        })
        .catch(() => {
          this.rankCompareListLoading = false;
        });
    },

    handleRcFilter() {
      this.rankCompareListQuery.pageNumber = 1;
      this.getRcList();
    },
    handleRcSizeChange(val) {
      this.rankCompareListQuery.pageSize = val;
      this.getRcList();
    },
    handleRcCurrentChange(val) {
      this.rankCompareListQuery.pageNumber = val;
      this.getRcList();
    },

    renderNewReviewRankRtFlag(h, { column, $index }) {
      return (
        <span>
          <span
            style={{ color: "#409EFF", cursor: "pointer" }}
            onClick={event => {
              this.getColumnDate("newReviewRankRtFlag");
              event.stopPropagation();
            }}
          >
            {this.rankCompareDateTitle}
          </span>{" "}
          天新增评价数在当前结果的排名
        </span>
      );
    },
    resetListQueryForm() {
      let listQueryForm = this.$refs.listQueryForm;
      if (listQueryForm !== undefined) {
        this.listQuery.inputs.forEach(element => {
          element.value = null;
        });
        listQueryForm.resetFields();
        this.handleFilter()

      }
    }
    // cancelRankCompareDialog(){
    //     this.outerVisible = false
    // }
  }
};
</script>
<style lang="less" scoped>
.products-box {
  .template-box {
    border: none;
    padding: 0;
    /deep/.screen-info,
    /deep/.el-table {
      border-left: none;
      border-right: none;
    }
    .screen-info {
      .el-input {
        width: 120px;
      }
      .el-select {
        width: 175px;
      }
      .input-section {
        .el-input {
          width: 80px;
        }
      }
    }
    // /deep/.box-update-btn {
    //   padding-left: 10px;
    // }
    .el-table__row {
      .a-title {
        color: #2f00cc;
        text-decoration: underline;
      }
    }
    .el-pagination {
      margin-left: 10px;
    }
  }
  .column-date-dialog {
    .el-range-editor {
      width: 220px;
      /deep/.el-range-separator {
        width: 20px;
      }
    }
    .el-table__row {
      .a-title {
        color: #2f00cc;
        text-decoration: underline;
      }
    }
  }
  .el-dialog__wrapper {
    /deep/.el-dialog__header {
      border-bottom: 1px solid @borderColor;
    }
    .dialog-footer {
      display: flex;
      justify-content: center;
    }
  }
}
.inner-visible-dialog {
  /deep/.el-dialog__header {
    border-bottom: 1px solid @borderColor;
  }
  .el-dialog__body {
    .el-pagination {
      margin-top: 5px;
    }
  }
  /deep/.el-dialog__body {
    padding-bottom: 20px;
  }
}
.rightBtn{
	float: right;
	// margin-right: 10px
}
</style>
