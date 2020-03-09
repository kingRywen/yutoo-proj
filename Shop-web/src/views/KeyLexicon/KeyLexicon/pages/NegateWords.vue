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
            <!-- <el-input v-model.trim="listQuery.negativeText" placeholder="请输入关键字" size="small" clearable></el-input> -->
          </el-form-item>
          <el-form-item label="否定类型">
            <el-select v-model="listQuery.negativeType" placeholder="请选择" size="small">
              <el-option label="精准否定" value="1"></el-option>
              <el-option label="词组否定" value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="更新时间">
            <el-date-picker
              v-model="daterange"
              type="daterange"
              align="right"
              unlink-panels
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :picker-options="pickerOptions"
              size="small"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>

          <el-form-item>
            <!-- @click="onSubmit" -->
            <!-- <el-button size="small" type="primary" plain @click="handleFilter">确认搜索</el-button> -->
            <el-button size="small" type="primary" @click="handleFilter" icon="el-icon-search" :loading="searchLoading">搜索</el-button>
            <el-button size="small" type="primary" plain @click="clear" :disabled='searchLoading'>重置搜索</el-button>
          </el-form-item>
      </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="box-update-btn">
      <el-button size="small" type="primary" plain @click="showDialog()">添加否定词</el-button>
      <el-button size="small" type="primary" plain @click="deleteRows(null)">删除</el-button>
      <el-button type="primary" plain size="mini" @click='copyKeyword'>复制关键词</el-button>
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
        <!-- <el-table-column
                v-if="listQuery.negativeType=='1'"
                prop="negativeText"
                label="否定词名称"
                min-width="90">
        </el-table-column>-->
        <el-table-column prop="negativeText" label="否定词名称" min-width="90"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="135"></el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-delete" @click="deleteRows(scope.row)"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50,1000]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>

    <yt-dialog :options="options" :events="events" class="form-dialog">
      <el-form size="small" label-position="right" label-width="75px" :rules="rules" :model="ruleForm" ref="ruleForm">
        <el-form-item
          label="否定类型"
          prop="negativeType"
          :rules="{
                    required: true, message: '否定类型不能为空', trigger: 'blur'
                    }"
        >
          <el-select v-model="ruleForm.negativeType" class="w100" placeholder="请选择" size="small">
            <el-option label="精准否定" value="1"></el-option>
            <el-option label="词组否定" value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="否定词文本" prop="negativeText">
          <el-input v-model.trim="ruleForm.negativeText" size="small" class="w100" type="textarea" :rows="5"></el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import {
  pickerOptions,
  DataUtil,
  setQueryTime,
  checkOtherWords
} from '../../utils'
import _ from 'lodash'
export default {
  props: ['pParams'],
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
        // sortOrder: 'asc',
        siteId: null,
        cusCateId: null,
        productId: null,
        // rootText:null,
        negativeTexts: null,
        repository: null,
        negativeType: '1',
        // rootType:null,
        startTime: null,
        endTime: null
      },
      multipleSelection: [],
      rules: {
        negativeText: [{ validator: checkOtherWords, trigger: 'blur' }]
      },
      options: {
        visible: false,
        width: '400px',
        title: '加入否定词',
        okBtnText: '确认'
      },
      events: {
        handleOkClick: () => {
          this.submitForm()
        }
      },
      isDialogAdd: true,
      ruleForm: {
        siteId: null,
        // rootText: null,
        negativeText: null,
        cusCateId: null,
        productId: null,
        repository: null,
        // rootType:null,
        negativeType: null
      },

      searchLoading:false,
    }
  },
  created() {
    this.listQuery.siteId = this.siteId
    this.ruleForm.siteId = this.siteId
    let cusCateId = this.pParams.cusCateId
    this.listQuery.cusCateId = cusCateId
    this.ruleForm.cusCateId = cusCateId
    let type = this.pParams.type
    if (type === 'category') {
      this.listQuery.productId = null
      this.ruleForm.productId = null
    } else {
      let productId = this.pParams.productId
      this.listQuery.productId = productId
      this.ruleForm.productId = productId
    }

    let treeId = this.pParams.treeId
    if (treeId == 13) {
      //精准否定
      this.listQuery.negativeType = '1'
      this.ruleForm.negativeType = '1'
    } else if (treeId == 14) {
      //词组否定
      this.listQuery.negativeType = '2'
      this.ruleForm.negativeType = '2'
    }
    if ('13,32,43'.indexOf(treeId) !== -1) {
      //精准否定
      this.listQuery.negativeType = '1'
      this.ruleForm.negativeType = '1'
      // this.listQuery.rootType ='1'
      // this.ruleForm.rootType ='1'
    } else if ('14,33,42'.indexOf(treeId) !== -1) {
      //词组否定
      this.listQuery.negativeType = '2'
      this.ruleForm.negativeType = '2'
      // this.listQuery.rootType ='2'
      // this.ruleForm.rootType ='2'
    }

    if ('42,43'.indexOf(treeId) !== -1) {
      this.listQuery.repository = 1
      this.ruleForm.repository = 1
      // 产品词库没有
      // if(type==='category'){
      //     this.listQuery.repository =1
      //     this.ruleForm.repository =1
      // }else{
      //     this.listQuery.repository =2
      //     this.ruleForm.repository =2
      // }
    } else if ('13,14'.indexOf(treeId) !== -1) {
      this.listQuery.repository = 3
      this.ruleForm.repository = 3
    } else if ('32,33'.indexOf(treeId) !== -1) {
      this.listQuery.repository = 4
      this.ruleForm.repository = 4
    }
    this.getList()
  },
  watch: {
    'pParams.type'(newP, oldP) {
      this.listQuery.cusCateId = this.pParams.cusCateId
      this.ruleForm.cusCateId = this.pParams.cusCateId
      if (newP === 'category') {
        this.listQuery.productId = null
        this.ruleForm.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
        this.ruleForm.productId = this.pParams.productId
      }
      this.getList()
    },
    'pParams.treeId'(newP, oldP) {
      this.listQuery.cusCateId = this.pParams.cusCateId
      this.ruleForm.cusCateId = this.pParams.cusCateId
      let type = this.pParams.type
      if (type === 'category') {
        this.listQuery.productId = null
        this.ruleForm.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
        this.ruleForm.productId = this.pParams.productId
      }
      if ('13,32,43'.indexOf(newP) !== -1) {
        //精准否定
        this.listQuery.negativeType = '1'
        this.ruleForm.negativeType = '1'
      } else if ('14,33,42'.indexOf(newP) !== -1) {
        //词组否定
        this.listQuery.negativeType = '2'
        this.ruleForm.negativeType = '2'
      }

      if ('42,43'.indexOf(newP) !== -1) {
        this.listQuery.repository = 1
        this.ruleForm.repository = 1
        // 产品词库没有
        // if(type==='category'){
        //     this.listQuery.repository =1
        //     this.ruleForm.repository =1
        // }else{
        //     this.listQuery.repository =2
        //     this.ruleForm.repository =2
        // }
      } else if ('13,14'.indexOf(newP) !== -1) {
        this.listQuery.repository = 3
        this.ruleForm.repository = 3
      } else if ('32,33'.indexOf(newP) !== -1) {
        this.listQuery.repository = 4
        this.ruleForm.repository = 4
      }
      this.getList()
    },
    'pParams.cusCateId'(newP, oldP) {
      let type = this.pParams.type
      this.listQuery.cusCateId = newP
      this.ruleForm.cusCateId = newP
      if (type === 'category') {
        this.listQuery.productId = null
        this.ruleForm.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
        this.ruleForm.productId = this.pParams.productId
      }
      this.getList()
    },
    'pParams.productId'(newP, oldP) {
      let type = this.pParams.type
      this.listQuery.cusCateId = this.pParams.cusCateId
      this.ruleForm.cusCateId = this.pParams.cusCateId
      if (type === 'category') {
        this.listQuery.productId = null
        this.ruleForm.productId = null
      } else {
        this.listQuery.productId = newP
        this.ruleForm.productId = newP
      }
      this.getList()
    }
  },
  methods: {
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
    clear(){
      this.listQuery.pageNumber = 1
      this.daterange=[]
      this.listQuery.negativeTexts=null;
      this.listQuery.include = '';
      this.listQuery.exclude = '';
      this.listQuery.barring = '';

      this.getList()
    },
    getList() {
      if (this.listQuery.cusCateId === null) {
        this.$message.warning('请选择类目')
        return
      }
      if (this.pParams.type === 'product') {
        if (this.listQuery.productId === null) {
          this.$message.warning('请选择商品')
          return
        }
      }
      this.searchLoading=true;
      let paramMap = {
        daterange: this.daterange
      }
      let timeArr = setQueryTime(paramMap)
      this.listQuery.startTime = timeArr[0]
      this.listQuery.endTime = timeArr[1]
      //   let daterange =this.daterange
      //   if(daterange===null||daterange.length===0){
      //     this.listQuery.endTime=null
      //     this.listQuery.startTime=null
      //   }else{
      //     this.listQuery.startTime=daterange[0]
      //     this.listQuery.endTime=daterange[1]
      //   }
      let listQuery = _.cloneDeep(this.listQuery)
      let { include,exclude,barring, negativeTexts} = JSON.parse(JSON.stringify(this.listQuery));
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

      listQuery.negativeType = parseInt(listQuery.negativeType)
      //   let apiName ='keywordNegativeList' // 精确否定
      //   if(listQuery.negativeType==2){
      //       apiName ='keywordRootListNegative' //词组否定列表
      //       listQuery.rootText =listQuery.negativeText
      //       delete listQuery.negativeText
      //   }


      let params = {
        self: this,
        listQuery,
        // apiName:'keywordRootList'
        apiName: 'keywordNegativeList'
      }
      DataUtil.getList(params)
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
      this.listQuery.pageNumber = 1
      this.getList()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.getList()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNumber = val
      this.getList()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showDialog() {
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields()
      }
      let treeId = this.pParams.treeId
      if ('13,32,43'.indexOf(treeId) !== -1) {
        //精准否定
        this.ruleForm.negativeType = '1'
      } else if ('14,33,42'.indexOf(treeId) !== -1) {
        //词组否定
        this.ruleForm.negativeType = '2'
      }
      this.options.visible = true
    },
    submitForm() {
      let ruleForm = _.cloneDeep(this.ruleForm)
      ruleForm.negativeType = parseInt(ruleForm.negativeType)
      ruleForm.negativeText && (ruleForm.negativeText = _.compact(ruleForm.negativeText.split('\n')))
      ruleForm.negativeText = _.uniq(ruleForm.negativeText)

      let params = {
        self: this,
        formName: 'ruleForm',
        formData: ruleForm,
        dialogProperty: 'options',
        apiName: 'keywordNegativeSave'
        // apiName:'keywordRootSave'
      }
      DataUtil.submitForm(params)
    },
    deleteRows(row) {
     
      let list = []
      // let rootType =this.listQuery.rootType
      if (row === null) {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('至少选一项')
          return
        }
        this.multipleSelection.forEach(element => {
          list.push({
            negativeId: element.negativeId,
            negativeText: element.negativeText
          })
          // if(rootType=='2'){
          //     list.push(element.rootId)
          // }else{
          //     list.push({negativeId:element.negativeId,rootText:element.rootText})
          // }
        })
      } else {
        list.push({
          negativeId: row.negativeId,
          negativeText: row.negativeText
        })
        //  if(rootType=='2'){
        //         list.push(row.rootId)
        //     }else{
        //         list.push({negativeId:row.negativeId,rootText:row.rootText})
        //     }
      }

      // let apiName ='keywordNegativeRemove'
      let productId =this.pParams.productId

      let params = {
        siteId: this.siteId,
        // flag:0,
        repository: this.listQuery.repository,
        cusCateId: this.listQuery.cusCateId,
        list,
        productId,
      }
      // if(rootType=='2'){
      //     // 词组否定用 词根删除
      // //    apiName = 'keywordRootRemove'
      // //    apiName = 'keywordRootRemove'
      //    params ={
      //        ids:list
      //    }
      // }

      this.$confirm(
        '此操作将删除类目词库和产品词库中对应的所有记录请慎重操作, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        this.$api['keywordNegativeRemove'](params).then(res => {
          let { code } = res
          if (code === 0) {
            this.getList()
          }
        })
      })
    }
  }
}
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

  .form-dialog {
    .el-textarea {
      width: 193px;
    }
  }
}
</style>


