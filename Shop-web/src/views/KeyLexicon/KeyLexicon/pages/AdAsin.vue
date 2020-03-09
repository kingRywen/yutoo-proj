<template>
  <div class="box">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery" class="demo-form-inline">

          <el-form-item label="包含"  prop="include">
              <el-input
                  style='width:270px'
                  type="textarea"
                  :rows="4"
                  placeholder="请输入,一行一个"
                  v-model="listQuery.include">
              </el-input>
          </el-form-item>
          <el-form-item label="不包含"  prop="exclude">
              <el-input
                  style='width:270px'
                  type="textarea"
                  :rows="4"
                  placeholder="请输入,一行一个"
                  v-model="listQuery.exclude">
              </el-input>
          </el-form-item>
          <el-form-item label="排除"  prop="barring">
              <el-input
                  style='width:270px'
                  type="textarea"
                  :rows="4"
                  placeholder="请输入,一行一个"
                  v-model="listQuery.barring">
              </el-input>
          </el-form-item>
          <el-form-item label="等于">
             <el-input
                  style='width:270px'
                  type="textarea"
                  :rows="4"
                  placeholder="请输入,一行一个"
                  v-model="listQuery.negativeTexts">
              </el-input>
            <!-- <el-input v-model.trim="listQuery.negativeText" placeholder="请输入关键字" size="mini" clearable></el-input> -->
          </el-form-item>
          <el-form-item label="广告系列">
            <el-select
              v-model="listQuery.advertName"
              placeholder="请选择"
              size="mini"
              class="select-advert-name"
            >
              <el-option
                v-for="item in advertOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <!-- @click="onSubmit" -->
            <!-- /<el-button size="mini" type="primary" plain @click="handleFilter">确认搜索</el-button> -->
            <el-button size="small" type="primary" @click="handleFilter" icon="el-icon-search" :loading="searchLoading">搜索</el-button>
            <el-button size="small" type="primary" plain @click="clear" :disabled='searchLoading'>重置搜索</el-button>
          </el-form-item>
      </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="box-update-btn">
      <custom-table-column :custom-column="customColumnParams" v-on:setCustomColumn="setCustomColumn" ></custom-table-column>
    </div>
    <div class="box-data">
      <el-table
        :data="list"
        v-loading="listLoading"
        :key="tableKey"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
        @sort-change="handleSortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="productId" label="ASIN" min-width="90"></el-table-column>
        <el-table-column prop="advertName" label="广告系列"></el-table-column>
        <el-table-column prop="indicatorEntity.advertExposure" :sortable="'custom'" min-width="125" label="曝光量"
        v-if="columnList.indexOf('advertExposure')!==-1"></el-table-column>
        <el-table-column prop="indicatorEntity.advertHits" :sortable="'custom'" min-width="85" label="点击量"
        v-if="columnList.indexOf('advertHits')!==-1"></el-table-column>
        <el-table-column
          prop="indicatorEntity.advertClickRates"
          :sortable="'custom'"
          min-width="85"
          label="点击率"
          v-if="columnList.indexOf('advertClickRates')!==-1"
        ></el-table-column>
        <el-table-column prop="indicatorEntity.advertOrders" :sortable="'custom'" min-width="85" label="订单量"
        v-if="columnList.indexOf('advertOrders')!==-1"></el-table-column>
        <el-table-column
          prop="indicatorEntity.advertConversionRates"
          :sortable="'custom'"
          min-width="85"
          label="转换率"
          v-if="columnList.indexOf('advertConversionRates')!==-1"
        ></el-table-column>
        <el-table-column prop="indicatorEntity.advertCpc" :sortable="'custom'" label="CPC"
        v-if="columnList.indexOf('advertCpc')!==-1"></el-table-column>
        <el-table-column prop="indicatorEntity.advertCost" :sortable="'custom'" label="花费"
        v-if="columnList.indexOf('advertCost')!==-1"></el-table-column>
        <el-table-column prop="indicatorEntity.advertSales" :sortable="'custom'" min-width="120" label="广告销售总额"
        v-if="columnList.indexOf('advertSales')!==-1"></el-table-column>
        <el-table-column prop="indicatorEntity.advertAcos" :sortable="'custom'" label="ACOS"
        v-if="columnList.indexOf('advertAcos')!==-1"></el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import { pickerOptions } from "../../utils";
import _ from "lodash";
import CustomTableColumn from "../components/custom-table-column";
export default {
  components: {
        CustomTableColumn
    },
  props: ["pParams"],
  data() {
    return {
      customColumnParams:{
        oneLevelHeader:true,
        checkboxList:[
          'advertExposure',
          'advertHits',
          'advertClickRates',
          'advertOrders',
          'advertConversionRates',
          'advertCpc',
          'advertCost',
          'advertSales',
          'advertAcos'
          ],
        checkboxOptions:[
            {label:'advertExposure',name:'曝光量' },
            {label:'advertHits',name:'点击量' },
            {label:'advertClickRates',name:'点击率' },
            {label:'advertOrders',name:'订单量' },
            {label:'advertConversionRates',name:'转换率' },
            {label:'advertCpc',name:'CPC' },
            {label:'advertCost',name:'花费' },
            {label:'advertSales',name:'广告销售总额' },
            {label:'advertAcos',name:'ACOS' }
        ]
      },
      columnList:null,
      pickerOptions,
      advertOptions: [],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      sortProp:null,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        sortField:null,
        sort: 0,
        siteId: null,
        dealFlag: null,
        advertName: null,
        cusCateId: null,
        productId: null
        // negativeText:null,
        // repository:null,
        // negativeType:'all',
        // startTime:null,
        // endTime:null
      },
      multipleSelection:[],

      searchLoading:false,
    };
  },
  watch: {
    "pParams.type"(newP, oldP) {
      this.listQuery.cusCateId = this.pParams.cusCateId;
      if (newP === "category") {
        this.listQuery.productId = null;
      } else {
        this.listQuery.productId = this.pParams.productId;
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

      if (newP == 35) {
        //成交词
        this.listQuery.dealFlag = 1;
      } else if (newP == 36) {
        //未成交词
        this.listQuery.dealFlag = 0;
      }
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
    }
  },
  created() {
    this.columnList =this.customColumnParams.checkboxList
    this.listQuery.siteId = this.siteId;
    this.listQuery.cusCateId = this.pParams.cusCateId;
    if (this.pParams.type === "category") {
      this.listQuery.productId = null;
    } else {
      let productId = this.pParams.productId;
      this.listQuery.productId = productId;
    }
    let treeId = this.pParams.treeId;
    if (treeId == 35) {
      //成交词
      this.listQuery.dealFlag = 1;
    } else if (treeId == 36) {
      //未成交词
      this.listQuery.dealFlag = 0;
    }
    this.getList();
    this.getQuerySelect();
  },
  methods: {
    getQuerySelect() {
      this.$api["categoryKeywordAdNameList"]({
        cusCateId: this.pParams.cusCateId,
        siteId: this.siteId,
        keywordType: "ADVERT"
      }).then(res => {
        let { code, data } = res;
        if (code === 0) {
          let advertOptions = [];
          data.forEach(element => {
            advertOptions.push({
              label: element.adName,
              value: element.adNameKey
            });
          });

          advertOptions.unshift({
            label: "全部",
            value: null
          });
          this.advertOptions = advertOptions;
        }
      });
    },
    clear(){
      this.listQuery.pageNumber = 1;
      this.listQuery.negativeTexts = null;
      this.listQuery.advertName = null;
      this.listQuery.include = '';
      this.listQuery.exclude = '';
      this.listQuery.barring = '';
      this.getList();
    },
    getList() {
      this.listLoading = true;
      this.searchLoading = true;
      let listQuery= _.cloneDeep(this.listQuery)
      if (this.sortProp) {
          let sortPropArr =this.sortProp.split(" ")
          if(sortPropArr.length===2){
              listQuery.sortField = sortPropArr[0];
              if(sortPropArr[1]==='desc'){
                  listQuery.sort = 0;
              }else{
                  listQuery.sort = 1;
              }
          }else{
              listQuery.sortField = null;
              listQuery.sort = 0;
          }
      } else {
          listQuery.sortField = null;
            listQuery.sort = 0;
      }
      let {include,exclude,barring ,negativeTexts} = JSON.parse(JSON.stringify(this.listQuery));
      listQuery.negativeTexts = negativeTexts ?
                          negativeTexts.split(/[\n|\r\n|\,|\，]/)
                          .map(el => el.trim())
                          .filter(el => el !== '') : null;
      listQuery.include = include ?
              include.split(/[\n|\r\n|\,|\，]/)
              .map(el => el.trim())
              .filter(el => el !== '') : [];
      listQuery.exclude = exclude ?
                      exclude.split(/[\n|\r\n|\,|\，]/)
                      .map(el => el.trim())
                      .filter(el => el !== '') : [];
      listQuery.barring = barring ?
                      barring.split(/[\n|\r\n|\,|\，]/)
                      .map(el => el.trim())
                      .filter(el => el !== '') : [];

      this.$api["adVocabularyAsinList"](listQuery)
        .then(res => {
          let { rows, total } = res;
          this.list = rows;
          this.total = total;
          this.listLoading = false;
          this.searchLoading = false;
        })
        .catch(() => {
          this.listLoading = false;
          this.searchLoading = false;
        });
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
    setCustomColumn(list){
      this.columnList =list
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    }
  }
};
</script>

<style lang="less" scoped>
.custom-collapse .el-form-item{
    margin-bottom:10px;
}
.box {
  // padding: 10px;
  // border: 1px solid @borderColor;
  // border-radius: 3px;
  // margin-left: 10px;
  // margin-right: 10px;
  .box-info {
    font-size: 14px;
    background-color: @boxQueryBGColor;
    padding: 15px;
    border: 1px solid @borderColor;
    span {
      &:first-of-type {
        margin-right: 20px;
      }
      &:last-of-type {
        color: @titleColor;
      }
    }
  }
  .box-query {
    min-width: 680px;
    padding: 15px;
    border-left: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
    border-bottom: 1px solid @borderColor;
    .el-form--inline {
      height: 40px;
    }
    .el-form-item__content {
      .el-input {
        width: 150px;
      }

      .el-range-editor {
        width: 240px;
        /deep/.el-range-separator {
          width: 20px;
        }
      }
    }
  }
  .box-update-btn {
    margin-top: 10px;
    display: flex;
    justify-content: flex-end;
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
}
</style>
