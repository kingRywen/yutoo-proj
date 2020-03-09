<template>
  <div class="box">
    <search-criteria :p-params="pParams" p-page-type="ADVERT" v-on:search="search" :searchLoading='searchLoading' />
    <!-- {{pParams}} -->
    <el-button size="small" type="primary" plain @click="showDelete" style="float:left;margin-top:10px;margin-left:10px;">删除</el-button>
    <el-button size="small" type="primary" plain @click="showDialog" :disabled="!multipleSelection.length" style="float:left;margin-top:10px;margin-left:10px;">加入否定词</el-button>
    <!-- <div class="body"> -->
    <!-- <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item title="常用筛选条件" name="1">-->
    <!-- <div>把自定义筛选条件存放在cooke(数组) 上架词库-相关词</div> -->
    <!-- <div>未做</div>
                    </el-collapse-item>
                    <el-collapse-item title="自定义筛选条件" name="2">
                        <el-form :inline="true" :model="formInline" ref="formInline">
                            <el-form-item label="关键词名称:">
                                <el-input v-model="formInline.keywordText" placeholder="请输入" size="small" clearable></el-input>
                            </el-form-item>
                            <el-form-item label="广告系列:">
                                <el-select v-model="formInline.advertName" placeholder="请选择" size="small" class="select-advert-name">
                                    <el-option
                                    v-for="item in advertOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item
                                v-for="(condition, index) in formInline.conditions"
                                v-if="querySelectList[index].label!==null"
                                :key="'condition_'+index"
                                :prop="'conditions.' + index + '.value'"
                                :label="querySelectList[index].label"
    >-->
    <!--
                                :rules="{required: true, message: querySelectList[index].label+'不能为空', trigger: 'blur'}"

    -->
    <!-- <el-select v-model="condition.value" 
                                clearable
                                placeholder="请选择" 
                                size="small" class="select-condition">
                                    <el-option
                                    v-for="item in querySelectList[index].options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                    </el-option>
                                </el-select>
                                
                                    <el-button type="primary" plain icon="el-icon-edit-outline"  size="small"  @click="showConditionDialog(querySelectList[index].conditionId,querySelectList[index].fieldKey,querySelectList[index].options,index)"></el-button> 
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="small" plain @click="handleFilter">确认搜索</el-button>
                                <el-button type="primary" size="small" plain>重置搜索</el-button>
                            </el-form-item>
                        </el-form>
                    </el-collapse-item>
    </el-collapse>-->
    <div class="body-btn">
      <div class="left">
        <!-- <el-button type="primary" plain size="small" @click="showInvalidDialog">加入否定词</el-button> -->
      </div>
      <div class="right">
        <custom-table-column :custom-column="customColumnParams" v-on:setCustomColumnAndIndex="setCustomColumnAndIndex"></custom-table-column>
      </div>
    </div>
    <div class="box-data">
      <el-table :data="list" v-loading="listLoading" :key="tableKey" style="width: 100%" border stripe tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="关键词" min-width="130">
          <template slot-scope="scope">
            <el-tooltip placement="top" effect="light" style="width:100%">
              <div slot="content">{{scope.row.keywordText}}</div>
              <div style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:129px;">{{scope.row.keywordText}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column label="广告系列" min-width="100">
          <template slot-scope="scope">
            <el-tooltip placement="top" effect="light" style="width:100%">
              <div slot="content">{{scope.row.advertName}}</div>
              <div style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:99px;">{{scope.row.advertName}}</div>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column label="ARA数据" v-if="oneColumnGroupList.length>0">
          <el-table-column prop="indicatorEntity.araSearches" v-if="oneColumnGroupList.indexOf('araSearches')!==-1" :sortable="'custom'" min-width="90" label="搜索量"></el-table-column>
          <el-table-column prop="indicatorEntity.araOrders" v-if="oneColumnGroupList.indexOf('araOrders')!==-1" :sortable="'custom'" min-width="90" label="订单量"></el-table-column>
          <el-table-column prop="indicatorEntity.araHits" v-if="oneColumnGroupList.indexOf('araHits')!==-1" :sortable="'custom'" min-width="90" label="点击量"></el-table-column>
          <el-table-column prop="indicatorEntity.araCarts" v-if="oneColumnGroupList.indexOf('araCarts')!==-1" :sortable="'custom'" min-width="90" label="加购量"></el-table-column>
          <el-table-column prop="indicatorEntity.araConversionRates" v-if="oneColumnGroupList.indexOf('araConversionRates')!==-1" :sortable="'custom'" min-width="90" label="转化率" :formatter="formatterAraConversionRates"></el-table-column>
          <el-table-column prop="indicatorEntity.araClickRates" v-if="oneColumnGroupList.indexOf('araClickRates')!==-1" :sortable="'custom'" min-width="90" label="点击率" :formatter="formatterAraClickRates"></el-table-column>
          <template v-for="(item, index) in araCustomFields">
            <template v-if="oneColumnGroupList.indexOf(item.customName)!==-1">
              <el-table-column min-width="150" :label="item.customName" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>{{scope.row.customField[scope.row.customField.findIndex(el => el.fieldKey === item.fieldKey)].result || '-'}}</div>
                </template>
              </el-table-column>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="广告数据" v-if="twoColumnGroupList.length>0">
          <el-table-column prop="indicatorEntity.advertExposure" v-if="twoColumnGroupList.indexOf('advertExposure')!==-1" :sortable="'custom'" min-width="85" label="曝光量"></el-table-column>
          <el-table-column prop="indicatorEntity.advertHits" v-if="twoColumnGroupList.indexOf('advertHits')!==-1" :sortable="'custom'" min-width="85" label="点击量"></el-table-column>
          <el-table-column prop="indicatorEntity.advertClickRates" v-if="twoColumnGroupList.indexOf('advertClickRates')!==-1" :sortable="'custom'" min-width="85" label="点击率" :formatter="formatterAdvertClickRates"></el-table-column>
          <el-table-column prop="indicatorEntity.advertOrders" v-if="twoColumnGroupList.indexOf('advertOrders')!==-1" :sortable="'custom'" min-width="85" label="订单量"></el-table-column>
          <el-table-column prop="indicatorEntity.advertConversionRates" v-if="twoColumnGroupList.indexOf('advertConversionRates')!==-1" :sortable="'custom'" min-width="85" label="转换率" :formatter="formatterAdvertConversionRates"></el-table-column>
          <el-table-column prop="indicatorEntity.advertCpc" v-if="twoColumnGroupList.indexOf('advertCpc')!==-1" :sortable="'custom'" label="CPC"></el-table-column>
          <el-table-column prop="indicatorEntity.advertCost" v-if="twoColumnGroupList.indexOf('advertCost')!==-1" :sortable="'custom'" label="花费"></el-table-column>
          <el-table-column prop="indicatorEntity.advertSales" v-if="twoColumnGroupList.indexOf('advertSales')!==-1" :sortable="'custom'" min-width="120" label="广告销售总额"></el-table-column>
          <el-table-column prop="indicatorEntity.advertAcos" v-if="twoColumnGroupList.indexOf('advertAcos')!==-1" :sortable="'custom'" label="ACOS" :formatter="formatterAdvertAcos"></el-table-column>
          <template v-for="(item, index) in advertCustomFields">
            <template v-if="twoColumnGroupList.indexOf(item.customName)!==-1">
              <el-table-column min-width="150" :label="item.customName" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div>{{scope.row.customField[scope.row.customField.findIndex(el => el.fieldKey === item.fieldKey)].result || '-'}}</div>
                </template>
              </el-table-column>
            </template>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-search" @click="showLineStackDialog(scope.row.keywordId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- <yt-dialog  :options="conditionOptions" :events="conditionEvents">
                <el-form label-position="right" label-width="40px" :model="formCondition" :rules="conditionrules" ref="numberValidateForm">
                    <el-form-item label="高" prop="high">
                        <el-input v-model.number="formCondition.high" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="中"  prop="middle">
                        <el-input v-model.number="formCondition.middle" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="低"  prop="low">
                        <el-input v-model.number="formCondition.low" size="small"></el-input>
                    </el-form-item>
                </el-form>
    </yt-dialog>-->
    <yt-dialog :options="linestackOptions" :events="linestackEvents" class="linestack-dialog">
      <el-form size="small" label-position="right" :inline="true" :model="formLinestack">
        <el-form-item>
          <el-select v-model="formLinestack.period" placeholder="请选择" size="small" @change="changeOption">
            <el-option label="日" value="1"></el-option>
            <el-option label="周" value="7"></el-option>
            <el-option label="月" value="30"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="linestackDaterange" type="daterange" align="right" unlink-panels range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" size="small" value-format="yyyy-MM-dd" @change="changeOption"></el-date-picker>
        </el-form-item>

        <div id="container" style="height:400px;width:100%;" v-loading="echartsLoading" :key="echartsKey"></div>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="invalidOptions" :events="invalidEvents">
      <el-form label-position="right" label-width="80px" :model="formInvalid">
        <el-form-item label="否定类型">
          <el-select v-model="formInvalid.keywordStatus" placeholder="请选择" size="small">
            <el-option label="精准否定" value="INVALID_EXACT"></el-option>
            <el-option label="词组否定" value="INVALID"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="privativeOptions" :events="privativeEvents" class="form-dialog">
      <el-form label-position="right" label-width="105px" :model="privativeRuleForm" ref="ruleForm">
        <el-form-item label="否定类型" prop="negativeType" :rules="{
                    required: true, message: '否定类型不能为空', trigger: 'blur'
                    }">
          <el-select v-model="privativeRuleForm.negativeType" placeholder="请选择" size="small">
            <el-option label="精准否定" value="1"></el-option>
            <el-option label="词组否定" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import _ from "lodash";
import {
  pickerOptions,
  DataUtil,
  setQueryTime,
  checkOtherWords
} from "../../utils";
// import {RelatedWords} from "./utils";
import CustomTableColumn from "../components/custom-table-column";
import SearchCriteria from "../components/search-criteria";
import echarts from "echarts";
export default {
  components: {
    CustomTableColumn,
    SearchCriteria
  },
  props: ["pParams"],
  data() {
    // let validateHighValue = (rule, value, callback) => {
    //     if (!value) {
    //         return callback(new Error('请选输入高'));
    //     }
    //     setTimeout(() => {
    //     if (!Number.isInteger(value)) {
    //         callback(new Error('请输入数字值'));
    //     } else {
    //         if (value <= this.formCondition.middle) {
    //         callback(new Error('必须大于中'));
    //         } else {
    //         callback();
    //         }
    //     }
    //     }, 100);
    // };
    // let validateMidValue = (rule, value, callback) => {
    //     if (!value) {
    //         return callback(new Error('请选输入中'));
    //     }
    //     setTimeout(() => {
    //     if (!Number.isInteger(value)) {
    //         callback(new Error('请输入数字值'));
    //     } else {
    //         if (value <= this.formCondition.low) {
    //         callback(new Error('必须大于小'));
    //         } else {
    //         callback();
    //         }
    //     }
    //     }, 100);
    // };
    // let validateLowValue = (rule, value, callback) => {
    //     if (!value) {
    //         return callback(new Error('请选输入低'));
    //     }
    //     setTimeout(() => {
    //     if (!Number.isInteger(value)) {
    //         callback(new Error('请输入数字值'));
    //     } else {
    //         if (value <= 0) {
    //         callback(new Error('必须大于0'));
    //         } else {
    //         callback();
    //         }
    //     }
    //     }, 100);
    // };
    return {
      privativeRules: {
        negativeText: [{ validator: checkOtherWords, trigger: "blur" }]
      },
      privativeRuleForm: {
        siteId: null,
        // rootText: null,
        negativeText: null,
        cusCateId: null,
        productId: null,
        repository: null,
        // rootType:null,
        negativeType: null
      },
      privativeOptions: {
        visible: false,
        width: "400px",
        title: "加入否定词",
        okBtnText: "确认"
      },
      privativeEvents: {
        handleOkClick: () => {
          this.submitForm();
        }
      },
      customKey: [],
      customColumnParams: {
        oneLevelHeader: false,
        constList: [
          [
            "araSearches",
            "araOrders",
            "araHits",
            "araCarts",
            "araConversionRates",
            "araClickRates",
            "araCustomField"
          ],
          [
            "advertExposure",
            "advertHits",
            "advertClickRates",
            "advertOrders",
            "advertConversionRates",
            "advertCpc",
            "advertCost",
            "advertSales",
            "advertAcos",
            "adCustomField"
          ]
        ],
        oneLevelCheckbox: [
          { indeterminate: false, checkAll: true, name: "ARA数据" },
          { indeterminate: false, checkAll: true, name: "广告数据" }
        ],
        towLevelCheckbox: [
          {
            list: null,
            checkboxs: [
              { label: "araSearches", name: "ARA搜索量" },
              { label: "araOrders", name: "ARA订单量" },
              { label: "araHits", name: "ARA点击量" },
              { label: "araCarts", name: "ARA加购量" },
              { label: "araConversionRates", name: "ARA转化率" },
              { label: "araClickRates", name: "ARA点击率" },
              { label: "araCustomField", name: "属性" }
            ]
          },
          {
            list: null,
            checkboxs: [
              { label: "advertExposure", name: "曝光量" },
              { label: "advertHits", name: "点击量" },
              { label: "advertClickRates", name: "点击率" },
              { label: "advertOrders", name: "订单量" },
              { label: "advertConversionRates", name: "转化率" },
              { label: "advertCpc", name: "CPC" },
              { label: "advertCost", name: "花费" },
              { label: "advertSales", name: "广告销售额" },
              { label: "advertAcos", name: "ACOS" },
              { label: "adCustomField", name: "属性" }
            ]
          }
        ]
      },
      oneColumnGroupList: [],
      twoColumnGroupList: [],
      threeColumnGroupList: [],
      pickerOptions,
      customColumnPopover: false,
      // activeNames: ['1'],
      // querySelectArray:[],// 后台返回
      // querySelectList:[],//querySelectArray 处理后的
      // advertOptions:[],
      // formInline: {
      //     keywordText:null,
      //     advertName:null,
      //     conditions: [{
      //         value: ''
      //     }],
      // },

      // conditionOptions: {
      //     visible: false,
      //     width:'200px',
      //     okBtnText: '确认编辑'
      // },
      // conditionEvents: {
      //     handleOkClick: () =>{
      //         this.submitConditionOptions()
      //         // this.conditionOptions.visible = false
      //     }
      // },
      // formCondition:{
      //     // conditionId:null,
      //     // fieldKey:null,
      //     index:null,
      //     high:null,
      //     middle:null,
      //     low:null
      // },

      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      sortProp: null,
      listQuery: {
        // pageSize: 10,
        // pageNumber: 1,
        // sortOrder: 'asc',
        // ruleId:1, // 判断规则id(核心词等)
        // cusCateId:1,
        // productId:null,
        // brandType:0, //是否品牌词0-否1-是

        sortField: null,
        sort: 0,
        pageNumber: 1,
        pageSize: 10,
        // ruleId:null,
        cusCateId: null,
        siteId: null,
        brandFlag: null,
        brandType: null,
        dealFlag: null,
        keywordType: null,
        keywordText: null,
        advertName: null,
        conditions: null
      },
      echartsLoading: false,
      echartsKey: 1,
      chart: null, // formLinestack
      linestackOptions: {
        visible: false,
        width: "960px",
        title: "数据展示",
        okBtnText: "关闭"
      },
      linestackEvents: {
        handleOkClick: () => {
          this.linestackOptions.visible = false;
        }
      },
      linestackDaterange: [],
      formLinestack: {
        keywordId: null,
        siteId: null,
        sellerId: null,
        startTime: null,
        endTime: null,
        period: "1",
        flag: null // 0类目词库 1 产品词库
      },

      invalidOptions: {
        visible: false,
        width: "350px",
        title: "加入否定词",
        okBtnText: "确认"
      },
      invalidEvents: {
        handleOkClick: () => {
          // this.vieOptions.visible = false
          this.submitInvalidForm();
        }
      },
      formInvalid: {
        ids: null,
        keywordStatus: null
      },
      multipleSelection: [],

      searchLoading:false,
      // ruleIdList:[],
      // fieldKeyMap:new Map(),
      // conditionrules:{
      //     high:[
      //         { required: true, validator: validateHighValue, trigger: 'blur' }
      //     ],
      //     middle:[
      //         { required: true, validator: validateMidValue, trigger: 'blur' }
      //     ],
      //     low:[
      //         { required: true, validator: validateLowValue, trigger: 'blur' }
      //     ]
      // }
    };
  },
  computed: {
    araCustomFields() {
      if (!this.list || (this.list && !this.list[0])) {
        return [];
      }
      return this.list[0].customField.filter(el => el.fieldOrigin === "ARA");
    },
    advertCustomFields() {
      if (!this.list || (this.list && !this.list[0])) {
        return [];
      }
      return this.list[0].customField.filter(el => el.fieldOrigin === "ADVERT");
    }
  },
  watch: {
    "pParams.type"(newP, oldP) {
      this.listQuery.cusCateId = this.pParams.cusCateId;
      if (newP === "category") {
        this.listQuery.productId = null;
        this.listQuery.keywordType = "ADVERT";
        this.formLinestack.flag = 0;
      } else {
        this.listQuery.productId = this.pParams.productId;
        this.listQuery.keywordType = "PRODUCT";
        this.formLinestack.flag = 1;
      }
      this.getList();
    },
    "pParams.treeId"(newP, oldP) {
      this.listQuery.cusCateId = this.pParams.cusCateId;
      let type = this.pParams.type;
      if (type === "category") {
        this.listQuery.productId = null;
      } else {
        this.listQuery.productId = this.pParams.productId;
      }

      if ("23,26,29".indexOf(newP) !== -1) {
        // 成交词
        this.listQuery.dealFlag = 1;
      } else if ("24,27,30".indexOf(newP) !== -1) {
        //未成交词
        this.listQuery.dealFlag = 0;
      }

      if ("22,23,24".indexOf(newP) !== -1) {
        //品牌类型 可上架(可布局)
        this.listQuery.brandType = 2;
      } else if ("25,26,27".indexOf(newP) !== -1) {
        //可开广告(仅广告)
        this.listQuery.brandType = 1;
      }
      if ("21,22,23,24,25,26,27".indexOf(newP) !== -1) {
        //品牌词
        this.listQuery.brandFlag = 1;
      } else if ("28,29,30".indexOf(newP) !== -1) {
        //非品牌词
        this.listQuery.brandFlag = 0;
        this.listQuery.brandType = null;
      }
      // let ruleId =null
      // if(newP==5||newP==9){
      //     let ruleArr =this.ruleIdList.filter(element => {
      //         return element.ruleName === '核心词';
      //     });
      //     ruleId =ruleArr[0].ruleId
      // }else if(newP==6||newP==10){
      //     let ruleArr =this.ruleIdList.filter(element => {
      //         return element.ruleName === '长尾词';
      //     });
      //     ruleId =ruleArr[0].ruleId
      // }else if(newP==7||newP==11){
      //     let ruleArr =this.ruleIdList.filter(element => {
      //         return element.ruleName === '其他词';
      //     });
      //     ruleId =ruleArr[0].ruleId
      // }
      //     this.listQuery.ruleId =ruleId
      this.getList();
    },
    "pParams.cusCateId"(newP, oldP) {
      let type = this.pParams.type;
      this.listQuery.cusCateId = newP;
      if (type === "category") {
        this.listQuery.productId = null;
      } else {
        this.listQuery.productId = this.pParams.productId;
      }
      this.getList();
    },
    "pParams.productId"(newP, oldP) {
      let type = this.pParams.type;
      this.listQuery.cusCateId = this.pParams.cusCateId;
      if (type === "category") {
        this.listQuery.productId = null;
      } else {
        this.listQuery.productId = newP;
      }
      this.getList();
    },
    sellerData() {
      this.formLinestack.sellerId = this.sellerId;
      this.formLinestack.siteId = this.siteId;
    }
  },

  created() {
    if (this.sellerId && this.siteId) {
      this.formLinestack.sellerId = this.sellerId;
      this.formLinestack.siteId = this.siteId;
    }
    this.oneColumnGroupList = this.customColumnParams.constList[0];
    this.twoColumnGroupList = this.customColumnParams.constList[1];
    //   this.getRuleId(this.pParams.treeId)
    // 广告没有 核心词 长尾词 其他词
    let cusCateId = this.pParams.cusCateId;
    this.listQuery.cusCateId = cusCateId;
    this.listQuery.siteId = this.siteId;

    if (this.pParams.type === "category") {
      this.listQuery.productId = null;
      this.listQuery.keywordType = "ADVERT";
      this.formLinestack.flag = 0;
    } else {
      let productId = this.pParams.productId;
      this.listQuery.productId = productId;
      this.listQuery.keywordType = "PRODUCT";
      this.formLinestack.flag = 1;
    }

    let treeId = this.pParams.treeId;
    
    if ("23,26,29".indexOf(treeId) !== -1) {
      // 成交词
      this.listQuery.dealFlag = 1;
    } else if ("24,27,30".indexOf(treeId) !== -1) {
      //未成交词
      this.listQuery.dealFlag = 0;
    }

    if ("22,23,24".indexOf(treeId) !== -1) {
      //品牌类型 可上架(可布局)
      this.listQuery.brandType = 2;
    } else if ("25,26,27".indexOf(treeId) !== -1) {
      //可开广告(仅广告)
      this.listQuery.brandType = 1;
    }
    if ("21,22,23,24,26,25,27".indexOf(treeId) !== -1) {
      //品牌词
      this.listQuery.brandFlag = 1;
    } else if ("28,29,30".indexOf(treeId) !== -1) {
      //非品牌词
      this.listQuery.brandFlag = 0;
    }
    //   this.getQuerySelect()
    // this.getList()

    //   keywordDataFieldListAll
    // this.getfieldKeyOptions()

    // this.$api['categoryKeywordList']({
    //   'cusCateId':this.pParams.cusCateId,
    //   "siteId": this.siteId,
    //   "brandType": this.listQuery.brandType ,
    //   'fieldType':2
    // }).then(res=>{
    //   console.log('-----------------------00');
    //   console.log(res);
    // }).catch(err=>{

    // })

    GLOBAL.vbus.$on("setCustomKey", data => {
      this.customKey = data;
      let ARA = this.customKey
        .filter(el => el.customName && el.fieldOrigin === "ARA")
        .map(el => ({ label: el.customName, name: el.customName }));
      let ADVERT = this.customKey
        .filter(el => el.customName && el.fieldOrigin === "ADVERT")
        .map(el => ({ label: el.customName, name: el.customName }));
      this.customColumnParams.towLevelCheckbox[0].checkboxs.push(...ARA);
      this.customColumnParams.towLevelCheckbox[1].checkboxs.push(...ADVERT);
      let ARAname = ARA.map(el => el.name),
        ADVERTname = ADVERT.map(el => el.name);
      this.customColumnParams.towLevelCheckbox[0].list.push(...ARAname);
      this.customColumnParams.towLevelCheckbox[1].list.push(...ADVERTname);

      this.twoColumnGroupList.push(...ADVERTname);
      this.oneColumnGroupList.push(...ARAname);
    });
  },
  mounted() {
    this.handleFilter();
  },
  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  },
  methods: {
    submitForm() {
      let ruleForm = this.privativeRuleForm;
      this.$confirm("是否将选中的词加入否定词", "警告", {
        type: "warning"
      })
        .then(() => {
          this.$api[`categoryKeywordBatchUpdateStatus`]({
            ids: this.multipleSelection.map(el => el.keywordId),
            keywordStatus:
              ruleForm.negativeType == 1 ? "INVALID_EXACT" : "INVALID"
          })
            .then(data => {
              this.getList();
              this.privativeOptions.visible = false;
            })
            .catch(err => {});
        })
        .catch(() => {});
    },
    //删除表格的一项
    showDelete() {
      if (this.multipleSelection.length !== 1) {
        this.$message.warning("至少选一项");
        return;
      }
      let ids = [];
      this.multipleSelection.forEach(element => {
        ids.push(element.keywordId);
      });
      let params = { ids: ids };
      this.$api["categoryKeywordRemove"](params)
        .then(res => {
          //console.log(res);
          if (res.code === 0) {
            this.getList();
          }
        })
        .catch(err => {
          //console.log(err);
        });
    },
    addPrivative() {},
    showDialog() {
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields();
      }
      let treeId = this.pParams.treeId;
      if ("13,32,43".indexOf(treeId) !== -1) {
        //精准否定
        this.privativeRuleForm.negativeType = "1";
      } else if ("14,33,42".indexOf(treeId) !== -1) {
        //词组否定
        this.privativeRuleForm.negativeType = "2";
      }
      this.privativeOptions.visible = true;
    },
    search(params) {
      this.listQuery.conditions = params.conditions;
      this.listQuery.keywordTexts = params.keywordTexts;
      this.listQuery.advertName = params.advertName;

      this.listQuery.include = params.include;
      this.listQuery.exclude = params.exclude;
      this.listQuery.barring = params.barring;
      this.listQuery.wordCnt = params.wordCnt;

      this.handleFilter();
    },
    // getfieldKeyOptions(){
    //      this.$api["keywordDataFieldListAll"]({fieldOrigin:null}).then(res => {
    //        let {data} =res
    //         let fieldKeyMap =new Map()
    //        _(data).forEach(val=>{
    //             fieldKeyMap.set(val.fieldKey,val.displayName)
    //         })
    //         this.fieldKeyMap =fieldKeyMap
    //     }).catch(() => {
    //         this.$message.error('公式加载失败!');
    //     })
    // },
    // getRuleId(treeId){
    //     this.$api['keywordDecisionRuleListUp']().then(res => {
    //         let { code,data } = res
    //         if(code===0){
    //             this.ruleIdList =data
    //             let ruleId =null
    //             if(treeId==5||treeId==9){
    //                 let ruleArr =data.filter(element => {
    //                     return element.ruleName === '核心词';
    //                 });
    //                 ruleId =ruleArr[0].ruleId
    //             }else if(treeId==6||treeId==10){
    //                 let ruleArr =data.filter(element => {
    //                     return element.ruleName === '长尾词';
    //                 });
    //                 ruleId =ruleArr[0].ruleId
    //             }else if(treeId==7||treeId==11){
    //                 let ruleArr =data.filter(element => {
    //                     return element.ruleName === '其他词';
    //                 });
    //                 ruleId =ruleArr[0].ruleId
    //             }
    //             this.listQuery.ruleId =ruleId
    //         }
    //     })
    // },
    //   getQuerySelect(){
    //         this.$api['categoryKeywordAdNameList'](
    //                 {cusCateId:this.pParams.cusCateId,
    //                 siteId:this.siteId,
    //                 keywordType:'ADVERT'}
    //             ).then(res => {
    //             let { code,data } = res
    //             if (code === 0) {
    //                 let advertOptions =[]
    //                  data.forEach(element => {
    //                      advertOptions.push({
    //                          label:element.adName,
    //                          value:element.adNameKey
    //                      })
    //                  });

    //                  advertOptions.unshift({
    //                          label:'全部',
    //                          value:null
    //                  })
    //                  this.advertOptions =advertOptions
    //             }
    //         })

    //         this.$api['keywordFilterConditionSelect']({conditionScopeSingle:'ADVERT'}).then(res => {
    //             let { code,data } = res
    //             if (code === 0) {
    //                 this.querySelectArray =data
    //                 this.querySelectList =RelatedWords.handleQuerySelect(data)
    //                 let len =this.querySelectList.length
    //                 this.formInline.conditions =[]
    //                 for (let index = 0; index < len; index++) {
    //                     this.formInline.conditions.push({value:''})
    //                     // 设置默认值
    //                     // this.formInline.conditions[index].value =`${data[index].conditionId}:high:${data[index].high}`
    //                 }
    //                 setTimeout(() => {
    //                     this.handleFilter()
    //                 }, 50)
    //             }
    //         })
    //     },
    getList() {
      if (this.listQuery.cusCateId === null) {
        this.$message.warning("请选择类目");
        return;
      }
      if (this.pParams.type === "product") {
        if (this.listQuery.productId === null) {
          this.$message.warning("请选择商品");
          return;
        }
      }
      //   this.$refs.formInline.validate((valid) => {
      //     if (valid) {
      //         this.listQuery.keywordText =this.formInline.keywordText
      //         this.listQuery.advertName =this.formInline.advertName
      //         this.listQuery.conditions =RelatedWords.getConditions(this.querySelectArray,this.formInline.conditions)
      //         // this.listQuery.conditions =null
      let listQuery = _.cloneDeep(this.listQuery);
      if (this.sortProp) {
        let sortPropArr = this.sortProp.split(" ");
        if (sortPropArr.length === 2) {
          listQuery.sortField = sortPropArr[0];
          if (sortPropArr[1] === "desc") {
            listQuery.sort = 0;
          } else {
            listQuery.sort = 1;
          }
        } else {
          listQuery.sortField = null;
          listQuery.sort = 0;
        }
      } else {
        listQuery.sortField = null;
        listQuery.sort = 0;
      }
      //    let conditions =[]
      //     this.listQuery.conditions.forEach(element => {
      //         if(element.level!==null){
      //             conditions.push(element)
      //         }
      //     });
      //     if(conditions.length===0){
      //         conditions =null
      //     }
      //     listQuery.conditions =conditions
      let params = {
        self: this,
        listQuery: listQuery,
        apiName: "adVocabularyList"
      };
      DataUtil.getList(params);
      //     } else {
      //         console.log('error submit!!')
      //         return false
      //     }
      // })
    },
    handleFilter() {
      this.listQuery.pageNumber = 1;
      this.getList();
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val;
      this.getList();
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
      this.sortProp = sortOrder;
      this.handleFilter();
    },
    formatterAraConversionRates(row, column) {
      let val = row.indicatorEntity && row.indicatorEntity.araConversionRates || null;
      if (val === null) {
        return "-";
      }
      return this.toPercent(val);
    },
    formatterAraCustomField(row, column) {
      let customField = row.customField;
      let str = "";
      let blankSpace = "\r \r \r";
      customField.forEach(element => {
        if (element.fieldOrigin === "ARA") {
          str += `${element.customName}:${
            element.result === null ? "" : element.result
          }${blankSpace}`;
        }
      });
      return str;
    },
    formatterAraClickRates(row, column) {
      let val = row.indicatorEntity && row.indicatorEntity.araClickRates || null;
      if (val === null) {
        return "-";
      }
      return this.toPercent(val);
    },
    formatterAdvertClickRates(row, column) {
      let val = row.indicatorEntity && row.indicatorEntity.advertClickRates || null;
      if (val === null) {
        return "-";
      }
      return this.toPercent(val);
    },
    formatterAdvertConversionRates(row, column) {
      let val = row.indicatorEntity && row.indicatorEntity.advertConversionRates || null;
      if (val === null) {
        return "-";
      }
      return this.toPercent(val);
    },
    formatterAdvertAcos(row, column) {
      let val = row.indicatorEntity && row.indicatorEntity.advertAcos || null;
      if (val === null) {
        return "-";
      }
      return this.toPercent(val);
    },
    formatterAdCustomField(row, column) {
      let customField = row.customField;
      let str = "";
      let blankSpace = "\r \r \r";
      customField.forEach(element => {
        if (element.fieldOrigin === "ADVERT") {
          str += `${element.customName}:${
            element.result === null ? "" : element.result
          }${blankSpace}`;
        }
      });
      return str;
    },
    toPercent(point) {
      if (isNaN(point) || point == 0) {
        return "0%";
      }
      let str = Number(point * 100).toFixed();
      str += "%";
      return str;
    },
    setCustomColumnAndIndex(columns) {
      let { list, index } = columns;
      if (index === 0) {
        this.oneColumnGroupList = list;
      } else if (index === 1) {
        this.twoColumnGroupList = list;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      console.log(val);
    },
    showInvalidDialog() {
      let multipleSelection = this.multipleSelection;
      if (this.multipleSelection.length !== 1) {
        this.$message.warning("至少选一项");
        return;
      }
      let ids = [];
      multipleSelection.forEach(element => {
        ids.push(element.keywordId);
      });
      this.formInvalid.ids = ids;
      this.invalidOptions.visible = true;
      if (this.$refs["formInvalid"] !== undefined) {
        this.$refs["formInvalid"].resetFields();
      }
    },
    submitInvalidForm() {
      this.$api["categoryKeywordBatchUpdateStatus"](this.formInvalid).then(
        res => {
          let { code } = res;
          if (code === 0) {
            this.handleFilter();
            this.invalidOptions.visible = false;
          }
        }
      );
    },
    showConditionDialog(id, fieldKey, options, index) {
      if (this.$refs["numberValidateForm"] !== undefined) {
        this.$refs["numberValidateForm"].resetFields();
      }
      // this.formCondition.conditionId =id
      // this.formCondition.fieldKey =fieldKey
      this.formCondition.index = index;
      let displayName = this.fieldKeyMap.get(fieldKey);
      this.conditionOptions.title = displayName;
      this.conditionOptions.visible = true;
      options.forEach(element => {
        let str = element.value;
        let strArr = str.split(":");
        let name = strArr[1];
        if (name === "high") {
          this.formCondition.high = parseInt(strArr[2]);
        } else if (name === "middle") {
          this.formCondition.middle = parseInt(strArr[2]);
        } else if (name === "low") {
          this.formCondition.low = parseInt(strArr[2]);
        }
      });
    },
    showLineStackDialog(id) {
      const end = new Date();
      const start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
      this.linestackDaterange = [start, end];
      this.formLinestack.keywordId = id;
      this.linestackOptions.visible = true;
      this.getOption();
    },
    getOption() {
      this.echartsLoading = true;
      let formLinestack = _.cloneDeep(this.formLinestack);
      let timeArr = setQueryTime({ daterange: this.linestackDaterange });
      formLinestack.startTime = timeArr[0];
      formLinestack.endTime = timeArr[1];
      formLinestack.siteId = this.siteId;
      formLinestack.period = parseInt(formLinestack.period);
      this.$api["adVocabularyGetHistoryAdkeyword"](formLinestack).then(res => {
        let { code, data } = res;
        if (code === 0) {
          let { series, xAxisData } = data;
          if (series !== null && xAxisData !== null) {
            let seriesName = new Map();
            seriesName.set("advertExposure", "曝光量");
            seriesName.set("advertHits", "点击量");
            seriesName.set("advertOrders", "订单量");
            seriesName.set("advertClickRates", "点击率");
            seriesName.set("advertConversionRates", "转换率");
            seriesName.set("advertCost", "花费");
            seriesName.set("advertSales", "广告销售总额");
            seriesName.set("advertCpc", "CPC");
            seriesName.set("advertAcos", "ACOS");
            let nameArr = [];
            let seriesArr = [];

            series.forEach(element => {
              nameArr.push(seriesName.get(element.name));
              seriesArr.push({
                name: seriesName.get(element.name),
                type: "line",
                stack: "总量",
                data: element.data
              });
            });

            let tmp = this.getOptionTmp();
            tmp.legend.data = nameArr;
            tmp.xAxis.data = xAxisData;
            tmp.series = seriesArr;
            if (this.chart === null) {
              this.$nextTick(function() {
                let dom = document.getElementById("container");
                this.chart = echarts.init(dom);
                this.setOption(tmp);
              });
            } else {
              this.chart.clear();
              this.setOption(tmp);
            }
          } else {
            if (this.chart === null) {
              this.$nextTick(function() {
                let dom = document.getElementById("container");
                this.chart = echarts.init(dom);
                this.setOption(null);
              });
            } else {
              this.chart.clear();
              this.setOption(null);
            }
          }
          setTimeout(() => {
            this.echartsLoading = false;
          }, 1.5 * 1000);
        }
      });
    },
    getOptionTmp() {
      let vm = this
      return {
        // title: {
        //   text: "广告数据"
        // },
        tooltip: {
          trigger: "axis",
          formatter(params) {
              return vm.$.getChartTooltip(params, param => `$${param.data}`)
          }
        },
        legend: {
          data: []
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: { show: false }
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false
        },
        yAxis: {
          type: "value"
        }
      };
    },
    changeOption() {
      if (this.linestackDaterange !== null) {
        this.getOption();
      }
    },
    setOption(option) {
      if (option === null) {
        this.chart.setOption({
          backgroundColor: "#F2F6FC",
          title: {
            left: "center", // 水平居中
            top: "center", // 垂直居中
            text: "暂无数据",
            textStyle: {
              color: "#909399",
              fontStyle: "normal",
              fontWeight: "normal",
              fontSize: 14
            }
          }
        });
      } else {
        if (option && typeof option === "object") {
          this.chart.setOption(option, true);
        }
      }
    }
    // submitConditionOptions(){
    //     this.$refs.numberValidateForm.validate((valid) => {
    //         if (valid) {
    //             let id =this.querySelectList[this.formCondition.index].options[0].value.split(':')[0]
    //               let options=  [
    //                     {label:`高\r \r \r \r \r${this.formCondition.high}`,value:`${id}:high:${this.formCondition.high}`},
    //                     {label:`中\r \r \r \r \r${this.formCondition.middle}`,value:`${id}:middle:${this.formCondition.middle}`},
    //                     {label:`低\r \r \r \r \r${this.formCondition.low}`,value:`${id}:low:${this.formCondition.low}`}
    //                 ]
    //                this.querySelectList[this.formCondition.index].options = options
    //                this.conditionOptions.visible = false
    //                this.formInline.conditions[this.formCondition.index].value =''
    //         //    this.$api["keywordFilterConditionUpdate"](this.formCondition).then(res => {
    //         //        let {code} =res
    //         //        if(code===0){
    //         //            this.getQuerySelect()
    //         //             this.conditionOptions.visible = false
    //         //        }
    //         //     })
    //         } else {
    //             console.log('error submit!!');
    //             return false;
    //         }
    //     });
    // }
  }
};
</script>
<style lang="less" scoped>
.box {
  // padding: 0 10px 10px 10px;
  // .body{
  // border-left: 1px solid #DCDFE6;
  // border-right: 1px solid #DCDFE6;
  // border: 1px solid @borderColor;
  // border-radius: 3px;
  // padding: 10px;
  // margin-left: 10px;
  // margin-right: 10px;
  .el-form {
    .select-advert-name {
      width: 170px;
    }
    .select-vie,
    .select-condition {
      width: 120px;
      // margin-right: 5px;
    }
  }
  .body-btn {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .left {
      .el-dropdown {
        margin-left: 10px;
      }
    }
  }
  .box-data {
    .el-pagination {
      margin-top: 5px;
      padding-left: 0;
      /deep/.el-pagination__sizes {
        .el-input {
          margin-left: 0 !important;
        }
      }
    }
  }
  // }

  // /deep/.el-dialog__body{
  //     padding-bottom: 0;
  // }
  .linestack-dialog {
    .el-select {
      width: 90px;
    }
    .el-range-editor {
      width: 300px;
      margin-top: 7px;
      /deep/.el-range-separator {
        width: 25px;
      }
    }
  }
}
</style>



