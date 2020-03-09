<template>
  <div class="box">
    <!-- <div class="body"> -->
    <a v-show="false" ref="exportExcel"></a>
    <search-criteria :p-params="pParams" p-page-type="LAYOUT" v-on:search="search" v-on:setRuleId="getRuleId" v-on:setSourceList="getSourceList" :searchLoading='searchLoading' />

    <div class="body-btn">
      <div class="left">
        <!-- <el-button type="primary" plain size="mini" @click="showAddDialog">添加关键词</el-button> -->
        <el-dropdown @command="showAddDialog" class="dropdown-add-keywords">
          <el-button type="primary" plain size="mini">
            添加关键词
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item v-for="item in sourceList" :command="item">{{item}}</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button type="primary" plain size="mini" @click="deleteRows(null)">删除</el-button>
        <!-- <el-button type="primary" plain size="mini" @click="showInvalidDialog">加入否定词</el-button> -->
        <!-- <el-select
                            v-model="updateOneKeyItems"
                            multiple
                            collapse-tags
                            style="margin-left: 15px;margin-right: 5px;"
                            placeholder="请选择"
                            size="mini">
                            <el-option label="ARA数据" value="1"></el-option>
                            <el-option label="广告数据" value="2"></el-option>
                            <el-option label="Google搜索量" value="3"></el-option>
                            <el-option label="产品数量" value="4"></el-option>
        </el-select>-->
        <!-- <el-button type="primary" plain size="mini" @click="updateOneKeyForItems" :disabled="updateOneKeyForItemsDisabled">一键更新广告数据</el-button> -->
        <el-button type="primary" plain size="mini" @click="showDialog" v-if="pParams.treeId !== 49" :disabled="!multipleSelection.length">加入否定词</el-button>
        <!-- todo -->
        <!-- 导入任务弹窗 -->
        <el-button type="primary" plain size="mini" @click="uploadTaskShow=true;buttonLoading.upload = false;">导入ARA数据</el-button>
        
        <el-button type="primary" plain size="mini" @click='copyKeyword'>复制关键词</el-button>

        <el-dropdown @command="handleAdClick">
          <el-button type="primary" size='mini' style='margin-left:10px;' plain>
            加入广告<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="a">加入现有广告</el-dropdown-item>
            <el-dropdown-item command="b">创建新广告</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        
        <el-dialog class="customDialog" :close-on-click-modal="false" title="导入ARA数据" :visible.sync="uploadTaskShow" width="500px">
          <ImportFile @success="handleAraImportSuccess" filename="ARA数据模板" :data="araData" :downloadApi="araDownloadApi" :action="araAction"/>
          <!-- <div slot="title">
            <span style="font-size:14px">导入ARA数据</span>
          </div>
          <div style="position:relative;">
            <div style="position:relative;left:100px;top:-6px;width: 300px;">
              <el-upload style="margin-top:8px;" ref="upload" action="https://jsonplaceholder.typicode.com/posts/" :on-change="handleFileChange" :file-list="fileList" :on-remove="handleFileRemove" :auto-upload="false">
                <el-button size="mini" type="primary" plain>导入数据</el-button>
              </el-upload>
            </div>
            <el-button size="mini" type="primary" plain @click="downLoad" style="position:relative;left:0px;top:-6px;position:absolute;left: 270px;top:-6px;">下载模板</el-button>
            <el-button style="margin:8px 0;width:40%;position:relative;top:-0px;left:29%" :disabled=" fileList.length>0?false:true" :loading="buttonLoading.upload" size="mini" type="primary" plain @click="upload">确 定</el-button>
          </div> -->
        </el-dialog>
      </div>
      <div class="right">
        <custom-table-column :custom-column="customColumnParams" v-on:setCustomColumnAndIndex="setCustomColumnAndIndex"></custom-table-column>
      </div>
    </div>
    <div class="box-data">
      <el-table :data="list" v-loading="listLoading" :key="tableKey" style="width: 100%" border stripe tooltip-effect="light" @selection-change="handleSelectionChange" @sort-change="handleSortChange">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="关键词" min-width="210">
          <template slot-scope="scope">
            <el-tooltip placement="top" effect="light" style="width:100%">
              <div slot="content">{{scope.row.keywordText}}</div>
              <div style="overflow:hidden;text-overflow:ellipsis; white-space:nowrap;width:129px;">{{scope.row.keywordText}}</div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column v-if="checkOtherList.indexOf('googleSearches')!==-1" prop="indicatorEntity.googleSearches" :sortable="'custom'" min-width="125" label="Google搜索量"></el-table-column>
        <el-table-column v-if="checkOtherList.indexOf('amazonProducts')!==-1" prop="indicatorEntity.amazonProducts" :sortable="'custom'" min-width="85" label="产品数"></el-table-column>
        <el-table-column label="ARA数据" v-if="checkAraList.length>0">
          <el-table-column v-if="checkAraList.indexOf('araSearches')!==-1" prop="indicatorEntity.araSearches" :sortable="'custom'" min-width="90" label="搜索量" :formatter="formatterAraSearches"></el-table-column>
          <el-table-column v-if="checkAraList.indexOf('araOrders')!==-1" prop="indicatorEntity.araOrders" :sortable="'custom'" min-width="90" label="订单量" :formatter="formatterAraOrders"></el-table-column>
          <el-table-column v-if="checkAraList.indexOf('araHits')!==-1" prop="indicatorEntity.araHits" :sortable="'custom'" min-width="90" label="点击量" :formatter="formatterAraHits"></el-table-column>
          <el-table-column v-if="checkAraList.indexOf('araCarts')!==-1" prop="indicatorEntity.araCarts" :sortable="'custom'" min-width="90" label="加购量" :formatter="formatterAraCarts"></el-table-column>
          <el-table-column v-if="checkAraList.indexOf('araConversionRates')!==-1" prop="indicatorEntity.araConversionRates" :sortable="'custom'" min-width="90" label="转化率" :formatter="formatterAraConversionRates"></el-table-column>
          <el-table-column v-if="checkAraList.indexOf('araClickRates')!==-1" prop="indicatorEntity.araClickRates" :sortable="'custom'" min-width="90" label="点击率" :formatter="formatterAraClickRates"></el-table-column>
          <template>
            <template v-for="(item, index) in araCustomFields">
              <el-table-column v-if="checkAraList.indexOf(item.customName)!==-1" min-width="120" :label="item.customName" :prop="`customField.${index}.result`" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.customField[scope.row.customField.findIndex(el => el.fieldKey === item.fieldKey)].result===null">-</div>
                  <div v-else>{{scope.row.customField[scope.row.customField.findIndex(el => el.fieldKey === item.fieldKey)].result}}</div>
                  <!-- <div>{{scope.row.customField[scope.row.customField.findIndex(el => el.fieldKey === item.fieldKey)].result || '-'}}</div> -->
                </template>
              </el-table-column>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="广告数据" v-if="checkAdList.length>0">
          <el-table-column v-if="checkAdList.indexOf('advertExposure')!==-1" :sortable="'custom'" min-width="85" label="曝光量">
            <template slot-scope="scope">
              <div v-if="scope.row.indicatorEntity.advertExposure!==null">{{scope.row.indicatorEntity.advertExposure}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column v-if="checkAdList.indexOf('advertHits')!==-1" :sortable="'custom'" min-width="85" label="点击量">
            <template slot-scope="scope">
              <div v-if="scope.row.indicatorEntity.advertHits!==null">{{scope.row.indicatorEntity.advertHits}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column v-if="checkAdList.indexOf('advertClickRates')!==-1" prop="indicatorEntity.advertClickRates" :sortable="'custom'" min-width="85" label="点击率" :formatter="formatterAdvertClickRates"></el-table-column>
          <el-table-column v-if="checkAdList.indexOf('advertOrders')!==-1" :sortable="'custom'" min-width="85" label="订单量">
            <template slot-scope="scope">
              <div v-if="scope.row.indicatorEntity.advertOrders!==null">{{scope.row.indicatorEntity.advertOrders}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column v-if="checkAdList.indexOf('advertConversionRates')!==-1" prop="indicatorEntity.advertConversionRates" :sortable="'custom'" min-width="85" label="转换率" :formatter="formatterAdvertConversionRates"></el-table-column>
          <el-table-column v-if="checkAdList.indexOf('advertCpc')!==-1" :sortable="'custom'" label="CPC">
            <template slot-scope="scope">
              <div v-if="scope.row.indicatorEntity.advertCpc!==null">{{scope.row.indicatorEntity.advertCpc}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column v-if="checkAdList.indexOf('advertCost')!==-1" :sortable="'custom'" label="花费">
            <template slot-scope="scope">
              <div v-if="scope.row.indicatorEntity.advertCost!==null">{{scope.row.indicatorEntity.advertCost}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column v-if="checkAdList.indexOf('advertSales')!==-1" :sortable="'custom'" min-width="120" label="广告销售总额">
            <template slot-scope="scope">
              <div v-if="scope.row.indicatorEntity.advertSales!==null">{{scope.row.indicatorEntity.advertSales}}</div>
              <div v-else>-</div>
            </template>
          </el-table-column>
          <el-table-column v-if="checkAdList.indexOf('advertAcos')!==-1" prop="indicatorEntity.advertAcos" :sortable="'custom'" label="ACOS" :formatter="formatterACOS"></el-table-column>
          <template>
            <template v-for="(item, index) in advertCustomFields">
              <el-table-column v-if="checkAdList.indexOf(item.customName)!==-1" min-width="120" :label="item.customName" :prop="`customField.${index}.result`" show-overflow-tooltip>
                <template slot-scope="scope">
                  <div v-if="scope.row.customField[scope.row.customField.findIndex(el => el.fieldKey === item.fieldKey)].result===null">-</div>
                  <div v-else>{{scope.row.customField[scope.row.customField.findIndex(el => el.fieldKey === item.fieldKey)].result}}</div>
                  <!-- <div>{{scope.row.customField[scope.row.customField.findIndex(el => el.fieldKey === item.fieldKey)].result || '-'}}</div> -->
                </template>
              </el-table-column>
            </template>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteRows(scope.row.keywordId)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNumber" :page-sizes="[10,20,30,50,1000]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <!-- </div> -->
    <!-- <yt-dialog  :options="conditionOptions" :events="conditionEvents">
                <el-form label-position="right" label-width="40px" :model="formCondition"  :rules="conditionrules" ref="numberValidateForm">
                    <el-form-item label="高" prop="high">
                        <el-input v-model.number="formCondition.high" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="中"  prop="middle">
                        <el-input v-model.number="formCondition.middle" size="mini"></el-input>
                    </el-form-item>
                    <el-form-item label="低"  prop="low">
                        <el-input v-model.number="formCondition.low" size="mini"></el-input>
                    </el-form-item>
                </el-form>
    </yt-dialog>-->
    <yt-dialog :options="addOptions" :events="addEvents">
      <el-form label-position="right" label-width="80px" :model="formAdd" :rules="rules" ref="formAdd">
        <el-form-item label="关键词:" prop="keywords">
          <el-input v-model.trim="formAdd.keywords" size="mini" type="textarea" :rows="5" placeholder='请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号'></el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="invalidOptions" :events="invalidEvents">
      <el-form label-position="right" label-width="85px" :model="formInvalid" ref="formInvalid">
        <el-form-item label="否定类型:" prop="keywordStatus" :rules="[
                            { required: true, message: '否定类型不能为空', trigger: 'blur'},
                        ]">
          <el-select v-model="formInvalid.keywordStatus" placeholder="请选择" size="mini">
            <el-option label="精准否定" value="INVALID_EXACT"></el-option>
            <el-option label="词组否定" value="INVALID"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="privativeOptions" :events="privativeEvents" class="form-dialog">
      <el-form label-position="right" label-width="105px" :model="privativeRuleForm" ref="ruleForm">
        <el-form-item label="否定类型:" prop="negativeType" :rules="{
                    required: true, message: '否定类型不能为空', trigger: 'blur'
                    }">
          <el-select v-model="privativeRuleForm.negativeType" placeholder="请选择" size="mini">
            <el-option label="精准否定" value="1"></el-option>
            <el-option label="词组否定" value="2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <!-- 加入现有广告 -->
    <yt-dialog :options="AddExistingAdsOptions" :events="AddExistingAdsEvents" class="form-dialog">
        <AddExistingAds  v-if='AddExistingAdsOptions.visible' ref='AddExistingAdsCompont' @AddExistingAdSuccess='AddExistingAdSuccess' :keywords='keywords'/>
    </yt-dialog>


  </div>
</template>
<script>
import _ from "lodash";
import { CONST_PORT_CONFIG, host } from "Config";
import { DataUtil, checkWords } from "../../utils";
// import {RelatedWords} from "./utils";
import CustomTableColumn from "../components/custom-table-column";
import SearchCriteria from "../components/search-criteria";
import AddExistingAds from "../components/AddExistingAds";
export default {
  components: {
    CustomTableColumn,
    SearchCriteria,
    AddExistingAds
  },
  props: ["pParams"],
  data() {
    return {
      araDownloadApi: 'categoryKeywordDownloadFileAra',
      araAction: `${host}categoryKeyword/importAraData`,
      uploadTaskShow: false,
      buttonLoading: {
        upload: false
      },
      fileList: [],
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
        width: "500px",
        title: "加入否定词",
        okBtnText: "确认"
      },
      privativeEvents: {
        handleOkClick: () => {
          this.submitForm();
        }
      },
      AddExistingAdsOptions:{
          visible: false,
          width: "1000px",
          title: "加入广告",
          okBtnText: "确认",
          top:'10vh'
      },
      AddExistingAdsEvents:{
        handleOkClick:()=>{
          this.$refs.AddExistingAdsCompont.submitBtn()
        }
      },
      sourceList: [],
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
          ],
          ["googleSearches", "amazonProducts"]
        ],
        oneLevelCheckbox: [
          { indeterminate: false, checkAll: true, name: "ARA数据" },
          { indeterminate: false, checkAll: true, name: "广告数据" },
          { indeterminate: false, checkAll: true, name: "其他" }
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
              { label: "araClickRates", name: "ARA点击率" }
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
              { label: "advertAcos", name: "ACOS" }
            ]
          },
          {
            list: null,
            checkboxs: [
              { label: "googleSearches", name: "Google搜索量" },
              { label: "amazonProducts", name: "产品数" }
            ]
          }
        ]
      },
      updateOneKeyItems: [],
      // customColumnPopover:false,
      // activeNames: ['1'],
      querySelectArray: [], // 后台返回
      querySelectList: [], //querySelectArray 处理后的
      rules: {
        keywords: [{ validator: checkWords, trigger: "blur" }]
      },

      invalidOptions: {
        visible: false,
        width: "500px",
        title: "加入否定词",
        okBtnText: "确认"
      },
      invalidEvents: {
        handleOkClick: () => {
          // this.conditionOptions.visible = false
          this.submitInvalidForm();
        }
      },
      formInvalid: {
        ids: null,
        keywordStatus: null
      },

      addOptions: {
        visible: false,
        width: "500px",
        title: "添加关键词",
        okBtnText: "确认"
      },
      addEvents: {
        handleOkClick: () => {
          this.submitAddForm();
        }
      },
      // 商品的接口不一样
      formAdd: {
        siteId: null,
        cusCateId: null,
        productId: null,
        source: null,
        keywords: null
      },
      customKey: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      sortProp: null,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        // sortOrder: 'asc',
        sortField: null,
        sort: 0,

        ruleId: null, // 判断规则id(核心词等)
        cusCateId: null,
        brandType: null, //是否品牌词0-否1-是
        siteId: null
        // productId:1,

        // keywordText:null,
        // conditions:null // 数组
      },
      // checkSectionList:[],
      checkAraList: null,
      checkAdList: null,
      checkOtherList: null,

      multipleSelection: [],

      searchLoading:false,

      updateOneKeyForItemsDisabled:false,

      conditionQuery:{pageType:null} ,

      keywords:'',
    };
  },
  computed: {
    araData() {
      return this.storeIds
    },
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
      // this.ruleForm.cusCateId = this.pParams.cusCateId;
      if (newP === "category") {
        this.listQuery.productId = null;
        // this.ruleForm.productId = null;
      } else {
        this.listQuery.productId = this.pParams.productId;
        // this.ruleForm.productId = this.pParams.productId;
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
      if ("4,5,6,7".indexOf(newP) !== -1) {
        // 非品牌词
        this.listQuery.brandType = 0;
      } else if ("8,9,10,11".indexOf(newP) !== -1) {
        //可布局品牌词
        this.listQuery.brandType = 1;
      } else if (
        (newP == "49" && type === "category") ||
        (newP == "41" && type === "product")
      ) {
        // 仅广告
        this.listQuery.brandType = 2;
      }

      // 错误是先执行了 getList() 而后执行 getRuleId
      // this.getList();

      // let ruleId =null
      // if(newP==5||newP==9){
      //     ruleId =this.ruleIdMap.get('coreWords')
      // }else if(newP==6||newP==10){
      //     ruleId =this.ruleIdMap.get('longWords')
      // }else if(newP==7||newP==11){
      //     ruleId =this.ruleIdMap.get('otherWords')
      // }
      //     this.listQuery.ruleId =ruleId
      //     alert(2)
      //     this.getList();
    },
    //  "listQuery.ruleId"(newP, oldP){
    //     this.getList();
    //  },
    "pParams.cusCateId"(newP, oldP) {
      let type = this.pParams.type;
      this.listQuery.cusCateId = newP;
      // this.ruleForm.cusCateId = newP;
      if (type === "category") {
        this.listQuery.productId = null;
        // this.ruleForm.productId = null;
      } else {
        this.listQuery.productId = this.pParams.productId;
        // this.ruleForm.productId = this.pParams.productId;
      }
      this.getList();
    },
    "pParams.productId"(newP, oldP) {
      let type = this.pParams.type;
      this.listQuery.cusCateId = this.pParams.cusCateId;
      // this.ruleForm.cusCateId = this.pParams.cusCateId;
      if (type === "category") {
        this.listQuery.productId = null;
        // this.ruleForm.productId = null;
      } else {
        this.listQuery.productId = newP;
        // this.ruleForm.productId = newP;
      }
      this.getList();
    }
  },
  created() {

    this.checkAraList = this.customColumnParams.constList[0];
    this.checkAdList = this.customColumnParams.constList[1];
    this.checkOtherList = this.customColumnParams.constList[2];

    let cusCateId = this.pParams.cusCateId;
    this.listQuery.cusCateId = cusCateId;
    this.listQuery.siteId = this.siteId;
    this.formAdd.siteId = this.siteId;
    this.formAdd.cusCateId = cusCateId;
    let type = this.pParams.type;
    if (type === "category") {
      this.listQuery.productId = null;
      this.formAdd.productId = null;
    } else {
      let productId = this.pParams.productId;
      this.listQuery.productId = productId;
      this.formAdd.productId = productId;
    }
    // this.conditionQuery.siteId =this.listQuery.siteId
    // this.conditionQuery.cusCateId =this.listQuery.cusCateId
    // this.conditionQuery.productId =this.listQuery.productId

    let treeId = this.pParams.treeId;
    if ("4,5,6,7".indexOf(treeId) !== -1) {
      // 非品牌词
      this.listQuery.brandType = 0;
    } else if ("8,9,10,11".indexOf(treeId) !== -1) {
      //可布局品牌词
      this.listQuery.brandType = 1;
    } else if (
      (treeId == "49" && type === "category") ||
      (treeId == "41" && type === "product")
    ) {
      // 仅广告
      this.listQuery.brandType = 2;
      this.listQuery.ruleId = null;
    }
    // this.getfieldKeyOptions()
    // this.getQuerySelect();
    // this.getSource();
    // setTimeout(() => {
    //     this.getList()
    // }, 500)
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

      this.checkAdList.push(...ADVERTname);
      this.checkAraList.push(...ARAname);
    });


    if (treeId == 5 || treeId == 9) {

        if (treeId == 5) {
          this.conditionQuery.pageType = 'UP_CORE'
        } else {
          this.conditionQuery.pageType = 'UP_BRAND_CORE'
        }
      } else if (treeId == 6 || treeId == 10) {
    
        if (treeId == 6) {
          this.conditionQuery.pageType = 'UP_LONG'
        } else {
          this.conditionQuery.pageType = 'UP_BRAND_LONG'
        }
      } else if (treeId == 7 || treeId == 11) {
  
        if (treeId == 7) {
          this.conditionQuery.pageType = 'UP_OTHER'
        } else {
          this.conditionQuery.pageType = 'UP_BRAND_OTHER'
        }
      } else if (
        (treeId == '49' && type === 'category') ||
        (treeId == '41' && type === 'product')
      ) {
        // 仅广告
        this.conditionQuery.pageType = 'UP_ADVERT'
      } else if (treeId == 23) {
        // 以下广告词库
        this.conditionQuery.pageType = 'AD_BRAND_UP_DEAL'
      } else if (treeId == 24) {
        this.conditionQuery.pageType = 'AD_BRAND_UP_NO_DEAL'
      } else if (treeId == 26) {
        this.conditionQuery.pageType = 'AD_BRAND_DEAL'
      } else if (treeId == 27) {
        this.conditionQuery.pageType = 'AD_BRAND_NO_DEAL'
      } else if (treeId == 29) {
        this.conditionQuery.pageType = 'AD_DEAL'
      } else if (treeId == 30) {
        this.conditionQuery.pageType = 'AD_NO_DEAL'
      }else if( treeId == 3){
        this.conditionQuery.pageType = 'UP'
      }else if(treeId == 4){
        this.conditionQuery.pageType = 'UP_NO_BRAND'
      }else if(treeId == 8){
        this.conditionQuery.pageType = 'UP_BRAND'
      }
      this.listQuery.pageType=this.conditionQuery.pageType
      // console.log('object');
      // // console.log();
  },
  methods: {
    handleAdClick(command){
        let keywordTextArr = this.multipleSelection.map(el => el.keywordText);
        this.keywords = keywordTextArr.join('\n');
        if( command === 'a' ){ //加入现有广告
            this.AddExistingAdsOptions.visible = true;
        }else{ //创建新广告
            this.$router.push({name:'keyLexiconKeyCreateNewAds',query:{ keywords : this.keywords,keyType:true}})
        }
    },
    //加入现有广告成功
    AddExistingAdSuccess(){
      this.AddExistingAdsOptions.visible = false;
    },
    //复制关键词
    copyKeyword(){
        //console.log(this.multipleSelection);
        if(!this.multipleSelection.length){
          this.$message.warning('请至少选择一项')
          return
        };
        let keywordTextArr = this.multipleSelection.map(el => el.keywordText);
        var oInput = document.createElement('textarea');
        oInput.value = keywordTextArr.join('\n');
        //console.log(oInput.value);
        document.body.appendChild(oInput);
        oInput.select(); // 选择对象
        document.execCommand("Copy"); // 执行浏览器复制命令
        //oInput.style.display='none';
        document.body.removeChild(oInput);
        this.$message.success('复制成功')
    },
    handleAraImportSuccess({ res, file, fileList }) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.uploadTaskShow = false
        this.getList()
        // fileList.splice(0)
       //this.getParent();
      }
    },
    // 下载模板
    downLoad() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      this.$ajax({
        method: "post",
        url: BASE_URL + "categoryKeyword/downloadFileAra",
        data: "",
        responseType: "blob"
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]));
          let y = this.$refs.exportExcel;
          y.href = url;
          y.setAttribute("download", "导入ARA数据.xlsx");
          y.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(function(error) {
          // console.log(error);
        });
    },
    // 上传模板
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handleFileRemove(file, fileList) {
      this.fileList = [];
    },
    // 确认上传
    upload() {
      const { BASE_URL } = CONST_PORT_CONFIG;
      let params = new FormData();
      params.append("siteId", this.siteId);
      params.append("sellerId", this.sellerId);
      params.append("platformId", this.platformId);
      // params.append("platformId", this.platformId);
      params.append("file", this.fileList[0].raw);
      this.buttonLoading.upload = true;
      let headers = { headers: { "Content-Type": "multipart/form-data" } };
      this.$ajax
        .post(BASE_URL + "categoryKeyword/importAraData", params, headers)
        .then(res => {
          // console.log(res);
          this.buttonLoading.upload = false;
          let code = res.code;
          if (code == 0) {
            this.uploadTaskShow = false;
            this.buttonLoading.upload = false;
            this.$message.success(res.msg);
            //this.getParent();
          } else if (code === 500) {
            this.buttonLoading.upload = false;
            this.$message.error(res.msg);
          }
        })
        .catch(err => {
          this.buttonLoading.upload = false;
          this.$message.error(res.msg);
        });
    },
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
    getRuleId(params) {
      // let ruleId =params.ruleId
      // if(ruleId===null){
      //     // 仅广告第一次加载
      //     this.handleFilter()
      // }else{
      //     this.listQuery.ruleId =params.ruleId
      // }
      // 没有 执行listLoading，是因为执行了两次
      //console.log(params);
      this.listQuery.ruleId = params.ruleId;
      this.getList();
    },
    search(params) {
      this.listQuery.conditions = params.conditions;
      this.listQuery.keywordTexts = params.keywordTexts;
      this.listQuery.source = params.source;
      this.listQuery.include = params.include;
      this.listQuery.exclude = params.exclude;
      this.listQuery.barring = params.barring;
      this.listQuery.wordCnt = params.wordCnt;
      //console.log(params.manualFlag);

      if(params.manualFlag || params.manualFlag===0){
          this.listQuery.manualFlag = params.manualFlag;
      }else{
            this.listQuery.manualFlag=null
      };
      this.handleFilter();
    },
    getSourceList(sourceList) {
      this.sourceList = sourceList;
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
    // getSource(){
    //     this.$api['categoryKeywordGetSource']().then(res => {
    //         let {code,data} =res
    //         if(code ===0){
    //             this.sourceList =data
    //         }
    //     })
    // },
    // getRuleId2(treeId){
    //     this.$api['keywordDecisionRuleListUp']().then(res => {
    //         let { code,data } = res
    //         if(code===0){
    //             // this.ruleIdList =data
    //             let ruleArr =data.filter(element => {
    //                     return element.ruleName === '核心词';
    //                 });
    //                 if(ruleArr.length>0){
    //                     ruleId =ruleArr[0].ruleId
    //                     this.ruleIdMap.set('coreWords',ruleId)
    //                 }
    //                 ruleArr =data.filter(element => {
    //                     return element.ruleName === '长尾词';
    //                 });
    //                 if(ruleArr.length>0){
    //                     ruleId =ruleArr[0].ruleId
    //                     this.ruleIdMap.set('longWords',ruleId)
    //                 }
    //                 ruleArr =data.filter(element => {
    //                     return element.ruleName === '其他词';
    //                 });
    //                 if(ruleArr.length>0){
    //                     ruleId =ruleArr[0].ruleId
    //                     this.ruleIdMap.set('otherWords',ruleId)
    //                 }

    //             let ruleId =null
    //             if(treeId==5||treeId==9){
    //                 ruleId =this.ruleIdMap.get('coreWords')
    //                 if(treeId==5){
    //                     this.conditionQuery.pageType='UP_CORE'
    //                 }else{
    //                     this.conditionQuery.pageType='UP_BRAND_CORE'
    //                 }
    //             }else if(treeId==6||treeId==10){
    //                 ruleId =this.ruleIdMap.get('longWords')
    //                 if(treeId==6){
    //                     this.conditionQuery.pageType='UP_LONG'
    //                 }else{
    //                     this.conditionQuery.pageType='UP_BRAND_LONG'
    //                 }
    //             }else if(treeId==7||treeId==11){
    //                 ruleId =this.ruleIdMap.get('otherWords')
    //                 if(treeId==7){
    //                     this.conditionQuery.pageType='UP_OTHER'
    //                 }else{
    //                     this.conditionQuery.pageType='UP_BRAND_OTHER'
    //                 }
    //             }
    //             this.listQuery.ruleId =ruleId

    //         }
    //     })
    // },
    showColumn(arr, column) {
      let flag = _.indexOf(arr, column);
      if (flag !== -1) {
        return true;
      } else {
        return false;
      }
    },
    // getQuerySelect(){
    //     this.$api['keywordFilterConditionSelect']({conditionScopeSingle:'LAYOUT'}).then(res => {
    //         let { code,data } = res
    //         if (code === 0) {
    //             this.querySelectArray =data
    //             this.querySelectList =RelatedWords.handleQuerySelect(data)
    //             let len =this.querySelectList.length
    //             this.formInline.conditions =[]

    //             for (let index = 0; index < len; index++) {
    //                 this.formInline.conditions.push({value:''})
    //                 // 设置默认值
    //                 // this.formInline.conditions[index].value =`${data[index].conditionId}:high:${data[index].high}`
    //             }
    //             setTimeout(() => {
    //                 this.getList()
    //             }, 50)

    //         }
    //     })
    // },
    getList() {
      //console.log('getList');
      //debugger
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

      if (this.listQuery.ruleId === null) {
        let type = this.pParams.type;
        let treeId = this.pParams.treeId;
        // 除了仅广告，其他的规则不能为空
        if (
          !(
            (type === "category" && treeId == "49") || //类目仅广告
            (type === "category" && treeId == "3") || //类目相关词
            (type === "category" && treeId == "4") || //类目非品牌词
            (type === "category" && treeId == "8") || //类目可布局品牌词
            (type === "product" && treeId == "41")|| //产品仅广告
            (type === "product" && treeId == "3") ||//产品相关词
            (type === "product" && treeId == "4") ||//产品非品牌词
            (type === "product" && treeId == "8") //产品可布局品牌词
          )
        ) {
          this.$message.warning("规则为空");
          return;
        }
      }
      //  this.$refs.formInline.validate((valid) => {
      //     if (valid) {
      // this.listQuery.keywordText=this.formInline.keywordText
      // this.listQuery.conditions =RelatedWords.getConditions(this.querySelectArray,this.formInline.conditions)
      let listQuery = _.cloneDeep(this.listQuery);
      // 仅广告
      if (listQuery.brandType == 2) {
        listQuery.ruleId = null;
      }
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
      // let conditions =[]

      // this.listQuery.conditions.forEach(element => {
      //     if(element.level!==null){
      //         conditions.push(element)
      //     }
      // });
      // if(conditions.length===0){
      //     conditions =null
      // }
      // listQuery.conditions =conditions
      let params = {
        self: this,
        listQuery: listQuery,
        apiName: "categoryKeywordList"
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
    setCustomColumnAndIndex(columns) {
      let { list, index } = columns;
      if (index === 0) {
        this.checkAraList = list;
      } else if (index === 1) {
        this.checkAdList = list;
      } else if (index === 2) {
        this.checkOtherList = list;
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // showConditionDialog(id,fieldKey,options,index){
    //     if(this.$refs['numberValidateForm']!==undefined){
    //         this.$refs['numberValidateForm'].resetFields();
    //     }
    //     // this.formCondition.conditionId =id
    //     // this.formCondition.fieldKey =fieldKey
    //     this.formCondition.index =index
    //     let displayName =this.fieldKeyMap.get(fieldKey)
    //     this.conditionOptions.title =displayName
    //     this.conditionOptions.visible = true
    //     options.forEach(element => {
    //         let str =element.value
    //         let strArr =str.split(":")
    //         let name =strArr[1]
    //         if(name==='high'){
    //            this.formCondition.high =parseInt(strArr[2])
    //         }else if(name==='middle'){
    //             this.formCondition.middle =parseInt(strArr[2])
    //         }else if(name==='low'){
    //             this.formCondition.low =parseInt(strArr[2])
    //         }
    //     });
    // },
    showAddDialog(source) {
      if (this.$refs.formAdd !== undefined) {
        this.$refs.formAdd.resetFields();
      }

      this.addOptions.visible = true;
      this.formAdd.source = source;
    },
    submitAddForm() {
      //keywords
      // this.formAdd.source='OTHER'
      let paramMap = _.cloneDeep(this.formAdd);
      paramMap.keywords = _.compact(this.formAdd.keywords.split("\n"));
      paramMap.keywords = _.uniq(paramMap.keywords);
      paramMap.publishType=this.conditionQuery.pageType
      let params = {
        self: this,
        formName: "formAdd",
        formData: paramMap,
        dialogProperty: "addOptions",
        apiName: "categoryKeywordSave",
      };
      // console.log('object6+5+6');
      // console.log(params);
      DataUtil.submitForm(params);
    },
    // handleCheckAraAllChange(val){
    //     this.checkAraList = val ? checkAraOptions : [];
    //     this.isAraIndeterminate = false;
    // },
    // setTableAraColumn(value){
    //     let checkedCount = value.length;
    //     this.checkAraAll = checkedCount === this.checkAras.length;
    //     this.isAraIndeterminate = checkedCount > 0 && checkedCount < this.checkAras.length;
    // },

    // handleCheckAdAllChange(val){
    //     this.checkAdList = val ? checkAdOptions : [];
    //     this.isAdIndeterminate = false;
    // },
    // setTableAdColumn(value){
    //    let checkedCount = value.length;
    //     this.checkAdAll = checkedCount === this.checkAds.length;
    //     this.isAdIndeterminate = checkedCount > 0 && checkedCount < this.checkAds.length;
    // },
    // handleCheckOtherAllChange(val){
    //     this.checkOtherList = val ? checkOtherOptions : [];
    //     this.isOtherIndeterminate = false;
    // },

    // setTableOtherColumn(value){
    //    let checkedCount = value.length;
    //     this.checkOtherAll = checkedCount === this.checkOthers.length;
    //     this.isOtherIndeterminate = checkedCount > 0 && checkedCount < this.checkOthers.length;
    // },
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
      this.$refs["formInvalid"].validate(valid => {
        if (valid) {
          this.$api["categoryKeywordBatchUpdateStatus"](this.formInvalid).then(
            res => {
              let { code } = res;
              if (code === 0) {
                this.handleFilter();
                this.invalidOptions.visible = false;
              }
            }
          );
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
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

    updateOneKeyForItems() {
      this.updateOneKeyForItemsDisabled=true;
      let params = {
        sellerId: this.sellerId,
        siteId: this.siteId
      };
      console.log(params);
      this.$api["adSaveNewAdKeywordRpt"](params).then(res => {
           this.updateOneKeyForItemsDisabled=false;
      }).catch(err=>{
          this.updateOneKeyForItemsDisabled=false;
      });
    },
    // updateOneKeyForItems(){
    //     let updateOneKeyItems =_.cloneDeep(this.updateOneKeyItems)
    //     let items =[]
    //     if(updateOneKeyItems.length>0){
    //         if(updateOneKeyItems.indexOf('2')===-1){
    //             items =updateOneKeyItems.map(Number)
    //         }else{
    //             if(updateOneKeyItems.length===1){
    //                 adSaveNewAdKeywordRpt(this)
    //                 return
    //             }else{
    //                 adSaveNewAdKeywordRpt(this)
    //                items= _.pull(updateOneKeyItems, '2')
    //                items =items.map(Number)
    //             }
    //         }
    //         let keywords =[]
    //         this.multipleSelection.forEach(element => {
    //             keywords.push(element.keywordText)
    //         });
    //         if(keywords.length===0){
    //             keywords =null
    //         }
    //         this.$api["taskKeywordDataUpdateOneKey"](
    //             {
    //                 keywords,
    //                 siteId:this.siteId,
    //                 sellerId:this.sellerId,
    //                 items
    //             }
    //         ).then(res => {})
    //     }
    //     function adSaveNewAdKeywordRpt(self){
    //         self.$api["adSaveNewAdKeywordRpt"]({sellerId:self.sellerId,siteId:self.siteId}).then(res => {})
    //     }
    // },
    // submitConditionOptions(){
    //     this.$refs.numberValidateForm.validate((valid) => {
    //         if (valid) {
    //               let id =this.querySelectList[this.formCondition.index].options[0].value.split(':')[0]
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
    // },
    deleteRows(id) {
      let params = {
        self: this,
        id,
        idName: "keywordId",
        apiName: "categoryKeywordRemove"
      };
      if (id === null) {
        params.multipleSelection = this.multipleSelection;
      }
      DataUtil.deleteRows(params);
    },
    formatterAraSearches(row, column) {
      return this.formatterIsNull(row.indicatorEntity.araSearches);
    },
    formatterAraOrders(row, column) {
      return this.formatterIsNull(row.indicatorEntity.araOrders);
    },
    formatterAraHits(row, column) {
      return this.formatterIsNull(row.indicatorEntity.araHits);
    },
    formatterAraCarts(row, column) {
      return this.formatterIsNull(row.indicatorEntity.araCarts);
    },
    formatterIsNull(obj) {
      if (obj === null) {
        return "-";
      }
      return obj;
    },
    formatterAraConversionRates(row, column) {
      if (row.indicatorEntity.araConversionRates === null) {
        return "-";
      }
      return this.toPercent(row.indicatorEntity.araConversionRates);
    },
    formatterAraClickRates(row, column) {
      if (row.indicatorEntity.araClickRates === null) {
        return "-";
      }
      return this.toPercent(row.indicatorEntity.araClickRates);
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
    formatterAdvertClickRates(row, column) {
      let val = row.indicatorEntity.advertClickRates;
      if (val === null) {
        return "-";
      }
      return this.toPercent(val);
    },
    formatterAdvertConversionRates(row, column) {
      let val = row.indicatorEntity.advertConversionRates;
      if (val === null) {
        return "-";
      }
      return this.toPercent(val);
    },
    formatterACOS(row, column) {
      let val = row.indicatorEntity.advertAcos;
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
    }
    // handleCommand(command){

    // if(this.multipleSelection.length===0){
    //     return
    // }
    // let keywords =[]
    // this.multipleSelection.forEach(element => {
    //     keywords.push(element.keywordText)
    // });
    // this.$api["taskKeywordDataUpdateOneKey"](
    //     {
    //     keywords,
    //     siteId:1,
    //     items:[parseInt(command)]}
    // ).then(res => {
    //     // let {code} =res
    //     // if(code===0){

    //     // }
    // })
    // }

    // setTableSectionColumn(){
    //     // this.checkSectionList
    //     // let val =this.checkSectionList

    //        let tmp= _.indexOf(val,'ara_all')
    //        if(tmp!==-1){
    //            this.checkList.push(
    //                'araOrders',
    //                'araHits',
    //                'araCarts',
    //                'araConversionRates',
    //                'araClickRates'
    //                )
    //        }else{
    //            this.checkList= _.pull(this.checkList,
    //                'araOrders',
    //                'araHits',
    //                'araCarts',
    //                'araConversionRates',
    //                'araClickRates'
    //            )
    //        }
    //        tmp= _.indexOf(val,'ad_all')
    //        if(tmp!==-1){
    //             this.checkList.push(
    //                'advertExposure',
    //                'advertHits',
    //                'advertClickRates',
    //                'advertOrders',
    //                'advertConversionRates',
    //                'advertCpc',
    //                'advertCost',
    //                'advertSales',
    //                'advertAcos'
    //                )
    //        }else{
    //           this.checkList= _.pull(this.checkList,
    //                'advertExposure',
    //                'advertHits',
    //                'advertClickRates',
    //                'advertOrders',
    //                'advertConversionRates',
    //                'advertCpc',
    //                'advertCost',
    //                'advertSales',
    //                'advertAcos'
    //            )
    //        }
    //        tmp= _.indexOf(val,'other_all')
    //        if(tmp!==-1){
    //           this.checkList.push('googleSearches','amazonProducts')
    //        }else{
    //            this.checkList= _.pull(this.checkList,
    //                'googleSearches','amazonProducts'
    //            )
    //        }
    //        this.checkList =_.uniq(this.checkList)// 排重
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
  // .el-form{
  //     .select-rource{
  //         width: 170px;
  //     }
  //     .select-condition{
  //         width: 120px;
  //         // margin-left: 10px;
  //         // margin-right: 5px;
  //     }
  // }
  .body-btn {
    margin-top: 10px;
    display: flex;
    justify-content: space-between;
    .left {
      .dropdown-add-keywords {
        margin-right: 10px;
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

  /deep/.el-dialog__body {
    padding-bottom: 0;
  }
}
</style>



