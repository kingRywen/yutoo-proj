<template>
  <div class="box">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="品牌词名称">
          <el-input v-model.trim="listQuery.brandName" placeholder="请输入关键字" size="mini" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="类型:">
          <el-select v-model="listQuery.negativeType" placeholder="请选择" size="mini">
            <el-option label="全部" value="all"></el-option>
            <el-option label="精准否定" value="1"></el-option>
            <el-option label="词组否定" value="2"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
            size="mini"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <!-- @click="onSubmit" -->
          <!-- <el-button size="mini" type="primary" plain @click="handleFilter">确认搜索</el-button> -->
           <el-button size="small" type="primary" @click="handleFilter" icon="el-icon-search" :loading="searchLoading">搜索</el-button>
          <el-button size="small" type="primary" plain @click="clear" :disabled='searchLoading'>重置搜索</el-button>
        </el-form-item>
      </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="box-update-btn">
      <el-button size="mini" type="primary" plain @click="showDialog">添加品牌词</el-button>
      <el-button size="mini" type="primary" plain @click="deleteRows(null)">删除</el-button>
      <el-button size="mini" type="primary" plain @click="updateBrandType(2)" :disabled="updateBrandTypeDisabled">设置可布局</el-button>
      <el-button size="mini" type="primary" plain @click="updateBrandType(1)" :disabled="updateBrandTypeDisabled">设置仅广告</el-button>
    </div>
    <div class="box-data">
      <el-table
        :data="list"
        v-loading="listLoading"
        :key="tableKey"
        style="width: 100%"
        @selection-change="handleSelectionChange"
        border
        stripe
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="brandName" label="品牌词名称" min-width="90"></el-table-column>

        <el-table-column prop="brandType" label="类型" min-width="70">
          <template slot-scope="scope">
            <div v-if="scope.row.brandType==1">仅广告</div>
            <div v-else-if="scope.row.brandType==2">可布局</div>
            <div v-else>其它</div>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="135"></el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteRows(scope.row.brandName,scope.row)"></el-button>
          </template>
        </el-table-column>
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

    <yt-dialog :options="options" :events="events" class="form-dialog">
      <el-form size="small" label-position="right" label-width="90px" :model="ruleForm" ref="ruleForm">
        <el-form-item
          label="关键词"
          prop="brandName"
          :rules="{
                  required: true, message: '关键词不能为空', trigger: 'blur'
                }"
        >
          <el-input v-model.trim="ruleForm.brandName" size="mini" type="textarea" :rows="5" placeholder='请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号'
          ></el-input>
        </el-form-item>
        <el-form-item
          label="选择类型"
          prop="brandType"
          :rules="{
                  required: true, message: '类型不能为空', trigger: 'blur'
                }"
        >
          <el-radio v-model="ruleForm.brandType" label="1">仅广告</el-radio>
          <el-radio v-model="ruleForm.brandType" label="2">可布局</el-radio>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import { pickerOptions, DataUtil } from "../../utils";
import _ from "lodash";
export default {
  props: ["pParams"],
  data() {
    return {
      pickerOptions,
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      daterange: [],
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        siteId: null,
        cusCateId: null,
        productId: null,
        brandName: null,
        brandType:null
        
      },
      multipleSelection:[],
      options: {
        visible: false,
        width: "400px",
        title: "添加品牌词",
        okBtnText: "确认"
      },
      events: {
        handleOkClick: () => {
          this.submitForm();
        }
      },
      isDialogAdd: true,
      ruleForm: {
        brandName: null,
        cusCateId: null,
        productId:null,
        siteId: null,
        brandType: null
      },
      searchLoading:false,
      updateBrandTypeDisabled:false,
    };
  },
  watch: {
        "pParams.type"(newP, oldP) {
            this.listQuery.cusCateId = this.pParams.cusCateId;
            if(newP==='category'){
                this.listQuery.productId = null;
            }else{
                this.listQuery.productId = this.pParams.productId;
            }
            this.getList();
        },
        "pParams.treeId"(newP, oldP) {
            this.listQuery.cusCateId = this.pParams.cusCateId;
             let type = this.pParams.type;
            if(type==='category'){
                this.listQuery.productId = null;
            }else{
                this.listQuery.productId = this.pParams.productId;
            }

             if(newP==46){
              // 全部
              this.listQuery.brandType =null
            }else if(newP==47){
                //可布局
                this.listQuery.brandType =2
                this.ruleForm.brandType ='2'
                
            }else if(newP==48){
                //仅广告
                this.listQuery.brandType =1
                this.ruleForm.brandType ='1'
            }
            this.getList();
         },
        "pParams.cusCateId"(newP, oldP) {
            let type =this.pParams.type
            this.listQuery.cusCateId = newP;
            if(type==='category'){
                this.listQuery.productId = null;
            }else{
                this.listQuery.productId = this.pParams.productId;
            }
            this.getList();
        },
        "pParams.productId"(newP, oldP) {
            let type =this.pParams.type
            this.listQuery.cusCateId = this.pParams.cusCateId;
            if(type==='category'){
                this.listQuery.productId = null;
            }else{
                this.listQuery.productId = newP;
            }
            this.getList();
        }
        
    },
  created() {
        this.listQuery.siteId =this.siteId
        this.ruleForm.siteId =this.siteId
        this.listQuery.cusCateId= this.pParams.cusCateId;
        this.ruleForm.cusCateId =this.pParams.cusCateId
      if(this.pParams.type==='category'){
            this.listQuery.productId = null;
            this.ruleForm.productId =null;
        }else{
            let productId= this.pParams.productId;
            this.listQuery.productId = productId;
            this.ruleForm.productId =productId
        }
            
        let treeId= this.pParams.treeId;
        if(treeId==46){
          // 全部
          this.listQuery.brandType =null
        }else if(treeId==47){
            //可布局
            this.listQuery.brandType =2
        }else if(treeId==48){
            //仅广告
            this.listQuery.brandType =1
        }
    this.getList();
  },
  methods: {
    clear(){
      this.listQuery.pageNumber = 1;
      this.daterange = [];
      this.listQuery.brandName = null;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      this.searchLoading = true;
      let daterange = this.daterange;
      if (daterange === null || daterange.length === 0) {
        this.listQuery.endTime = null;
        this.listQuery.startTime = null;
      } else {
        this.listQuery.startTime = daterange[0];
        this.listQuery.endTime = daterange[1];
      }
      let params = {
        self: this,
        listQuery: this.listQuery,
        apiName: "brandList"
      };
      DataUtil.getList(params);
      //   this.$api["keywordNegativeList"](this.listQuery).then(res => {
      //       let {data} =res
      //       this.list =data
      //         setTimeout(() => {
      //             this.listLoading = false
      //         }, 1.5 * 1000)
      //   }).catch(() => {
      //       this.listLoading = false
      //   })
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
    handleSelectionChange(val) {
      console.log(val);
      this.multipleSelection = val;
    },
    showDialog() {
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields();
      }
      this.options.title = "添加品牌词";
      this.options.visible = true;
      let treeId= this.pParams.treeId;
        if(treeId==47){
            //可布局
            this.ruleForm.brandType ='2'
        }else if(treeId==46||treeId==48){
            //仅广告
            this.ruleForm.brandType ='1'
        }
    },
    submitForm() {
      let paramMap = _.cloneDeep(this.ruleForm);
      paramMap.brandType = parseInt(paramMap.brandType);
      paramMap.brandName =_.compact(paramMap.brandName.split('\n'))
      paramMap.brandNames = _.uniq(paramMap.brandName)
      let params = {
        self: this,
        formName: "ruleForm",
        formData: paramMap,
        dialogProperty: "options",
        apiName: "brandSave"
      };
      DataUtil.submitForm(params);
    },
    updateBrandType(brandType) {
        this.updateBrandTypeDisabled=true;
        let ids = []
        // console.log(this.multipleSelection);
        // return
        let cusCateId = '';
        this.multipleSelection.forEach(element => {
            ids.push(element.brandName)
            cusCateId = element.cusCateId
        });
        if (ids.length === 0) {
            this.$message.warning('至少选一项');
            this.updateBrandTypeDisabled=false;
            return
        }
        
        let paramMap ={
            brandNames:ids,
            cusCateId,
            brandType
        }
      this.$api['brandUpdate'](paramMap).then(res => {
        this.updateBrandTypeDisabled=false;
        this.getList()
      }).catch(err=>{
        this.updateBrandTypeDisabled=false;
      });
    },
    deleteRows(id , row){
      //console.log(row);
      let params ={
        self:this,
        id,
        idName:'brandName',
        apiName:'brandRemove',
        requestName:'Brand',
      }
      if(id===null){
        params.multipleSelection =this.multipleSelection
      }
      if(row){
        params.cusCateId = row.cusCateId ;
      }
      DataUtil.deleteRows(params)
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
      .el-select {
        width: 100px;
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
