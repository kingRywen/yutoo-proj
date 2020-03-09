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
                  v-model="listQuery.rootTexts">
              </el-input>
            <!-- <el-input v-model.trim="listQuery.rootText" placeholder="请输入关键字" size="small" clearable></el-input> -->
          </el-form-item>
          <el-form-item label="无效类型">
            <el-select v-model="listQuery.rootType" placeholder="请选择" size="small">
              <el-option label="全部" value="0"></el-option>
              <el-option label="精准无效" value="1"></el-option>
              <el-option label="词组无效" value="2"></el-option>
              <el-option label="绝对无效" value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
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
      <el-button size="small" type="primary" plain @click="showDialog(null, '添加关键词')">添加词根</el-button>
      <el-button size="small" type="primary" plain @click="deleteRows(null)">删除</el-button>
      <!-- <el-button  size="small" type="primary" plain @click="showKeywordRootDialog">加入有效词根</el-button> -->
      <el-button size="small" type="primary" plain @click="submitKeywordRootForm" :disabled="submitKeywordRootFormDisabled">加入有效词根</el-button>
      <el-button size="small" type="primary" plain @click="showDialog(null, '设置词根类型')">设置词根类型</el-button>
      <el-button type="primary" plain size="mini" @click='copyKeyword'>复制关键词</el-button>
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
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="rootText" label="词根名称" min-width="90"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="135"></el-table-column>
        <el-table-column prop="rootType" label="类型" min-width="70">
          <template slot-scope="scope">
            <div v-if="scope.row.rootType===1">精准无效</div>
            <div v-else-if="scope.row.rootType===2">词组无效</div>
            <div v-else-if="scope.row.rootType===3">绝对无效</div>
            <div v-else>其它</div>
          </template>
        </el-table-column>
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

    <yt-dialog ref="child" :options="options" :events="events" class="form-dialog">
      <el-form size="small" label-position="right" label-width="80px" :rules="rules" :model="ruleForm" ref="ruleForm">
        <el-form-item label="关键词" prop="rootText" v-if="options.title === '添加关键词'">
          <el-input v-model.trim="ruleForm.rootText" size="small" type="textarea" :rows="5" placeholder='请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号'
            ></el-input>
        </el-form-item>
        <el-form-item
          label="类型"
          prop="rootType"
          :rules="{
                    required: true, message: '类型不能为空', trigger: 'blur'
                    }"
        >
          <el-select class="w100" v-model="ruleForm.rootType" placeholder="请选择" size="small">
            <el-option label="精准无效" value="1"></el-option>
            <el-option label="词组无效" value="2"></el-option>
            <el-option label="绝对无效" value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <!-- <yt-dialog  :options="keywordRootOptions" :events="keywordRootEvents" class="form-dialog">
            <el-form label-position="right" label-width="90px"  :model="keywordRootRuleForm" ref="keywordRootRuleForm" >
                <el-form-item label="否定类型:"
                    prop="rootType"
                    :rules="{
                    required: true, message: '否定类型不能为空', trigger: 'blur'
                    }">
                    <el-select v-model="keywordRootRuleForm.rootType" placeholder="请选择" size="small">
                        <el-option label="精准无效" value="1"></el-option>
                        <el-option label="词组无效" value="2"></el-option>
                        <el-option label="绝对无效" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
    </yt-dialog>-->
  </div>
</template>
<script>
import { pickerOptions, DataUtil, checkWords } from '../../utils'
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
        sortOrder: 'asc',
        siteId: null,
        cusCateId: null,
        productId: null,
        rootTexts: null,
        repository: null,
        startTime: null,
        endTime: null,
        rootType: '0' //无效
      },
      multipleSelection: [],
      rules: {
        rootText: [{ validator: checkWords, trigger: 'blur' }]
      },
      options: {
        visible: false,
        width: '400px',
        title: '添加关键词',
        okBtnText: '确认'
      },
      events: {
        handleOkClick: () => {
          this.submitForm()
        }
      },
      ruleForm: {
        siteId: null,
        rootText: null,
        cusCateId: null,
        productId: null,
        repository: null,
        rootType: '1'
      },
      // keywordRootOptions: {
      //     visible: false,
      //     width: "350px",
      //     title: "加入无效词",
      //     okBtnText: "确认"
      // },
      // keywordRootEvents: {
      //     handleOkClick: () => {
      //      this.submitKeywordRootForm();
      //     }
      // },
      // keywordRootRuleForm: {
      //     siteId: null,
      //     rootType: 4,//加入有效词根
      //     repository:null,
      //     cusCateId:null,
      //     productId:null,
      //     list:null
      // }
      keywordRootRuleForm: {
        ids: null,
        rootType: 4 //加入有效词根
      },

      searchLoading:false,
      submitKeywordRootFormDisabled:false
    }
  },
  created() {
    this.listQuery.siteId = this.siteId
    this.ruleForm.siteId = this.siteId
    let cusCateId = this.pParams.cusCateId
    this.listQuery.cusCateId = cusCateId
    this.ruleForm.cusCateId = cusCateId

    if (this.pParams.type === 'category') {
      this.listQuery.productId = null
      this.ruleForm.productId = null
    } else {
      let productId = this.pParams.productId
      this.listQuery.productId = productId
      this.ruleForm.productId = productId
    }

    let treeId = this.pParams.treeId
    if (treeId == 17) {
      //上架词库
      this.listQuery.repository = 3
      this.ruleForm.repository = 3
    } else if (treeId == 39) {
      //广告词库
      this.listQuery.repository = 4
      this.ruleForm.repository = 4
    } else if (treeId == 45) {
      //1.-类目/产品词库
      this.listQuery.repository = 1
      this.ruleForm.repository = 1
    }
    this.getList()
  },
  watch: {
    'pParams.type'(newP, oldP) {
      this.listQuery.cusCateId = this.pParams.cusCateId
      if (newP === 'category') {
        this.listQuery.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
      }
      this.getList()
    },
    'pParams.treeId'(newP, oldP) {
      this.listQuery.cusCateId = this.pParams.cusCateId
      let type = this.pParams.type
      if (type === 'category') {
        this.listQuery.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
      }

      if (newP == 16) {
        //上架词库
        this.listQuery.repository = 3
        this.ruleForm.repository = 3
      } else if (newP == 39) {
        //广告词库
        this.listQuery.repository = 4
        this.ruleForm.repository = 4
      } else if (newP == 45) {
        //1.-类目/产品词库
        this.listQuery.repository = 1
        this.ruleForm.repository = 1
      }
      this.getList()
    },
    'pParams.cusCateId'(newP, oldP) {
      let type = this.pParams.type
      this.listQuery.cusCateId = newP
      if (type === 'category') {
        this.listQuery.productId = null
      } else {
        this.listQuery.productId = this.pParams.productId
      }
      this.getList()
    },
    'pParams.productId'(newP, oldP) {
      let type = this.pParams.type
      this.listQuery.cusCateId = this.pParams.cusCateId
      if (type === 'category') {
        this.listQuery.productId = null
      } else {
        this.listQuery.productId = newP
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
            this.listQuery.rootTexts=null;
            this.listQuery.rootType = '0';
            this.listQuery.include = '';
            this.listQuery.exclude = '';
            this.listQuery.barring = '';
            this.getList()
        },
    getList() {
      let daterange = this.daterange
      if (daterange === null || daterange.length === 0) {
        this.listQuery.endTime = null
        this.listQuery.startTime = null
      } else {
        this.listQuery.startTime = daterange[0]
        this.listQuery.endTime = daterange[1]
      }
      let listQuery = _.cloneDeep(this.listQuery)
      listQuery.rootType = parseInt(listQuery.rootType);

      let {include,exclude,barring,rootTexts} = JSON.parse(JSON.stringify(this.listQuery));
      listQuery.rootTexts = rootTexts ?
                            rootTexts.split(/[\n|\r\n|\,|\，]/)
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
      let params = {
        self: this,
        listQuery: listQuery,
        apiName: 'keywordRootList'
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
    showDialog(row, title) {
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields()
      }
      this.options.visible = true
      this.options.title = title
    },
    submitForm() {
      let ruleForm = _.cloneDeep(this.ruleForm)
      if(this.options.title === '设置词根类型' || ruleForm.rootText !== null){
        this.$refs.child.btnLoading = true
        if (ruleForm.rootText && ruleForm.rootText !== '') {
          ruleForm.rootText = _.compact(this.ruleForm.rootText.split('\n'))
				ruleForm.rootText = _.uniq(ruleForm.rootText)
				ruleForm.rootType = parseInt(ruleForm.rootType)
        } else {
          ruleForm.rootText = this.multipleSelection.map(el => el.rootId)
          if (!ruleForm.rootText.length) {
            this.$message.warning("请选择关键词进行操作")
            return
          }
        }
				
				let params = {
				  self: this,
				  formName: 'ruleForm',
				  formData: this.options.title === '设置词根类型' ? {rootType: ruleForm.rootType, ids: ruleForm.rootText} : ruleForm,
				  dialogProperty: 'options',
				  apiName: this.options.title === '添加关键词'?'keywordRootSave':'keywordRootUpdate'
				}
				DataUtil.submitForm(params)
				
			}else{
				this.$message.warning("请补全信息")
			}
      
    },
    //   showKeywordRootDialog(){
    //       if(this.$refs.keywordRootRuleForm!==undefined){
    //             this.$refs.keywordRootRuleForm.resetFields();
    //         }
    //         this.keywordRootOptions.visible = true;
    //   },
    submitKeywordRootForm() {
      //   debugger
      let multipleSelection = this.multipleSelection
      if (multipleSelection.length === 0) {
        this.$message.warning('至少选一项')
        return
      }
      //    let list =[]
      this.submitKeywordRootFormDisabled=true;
      let ids = []
      multipleSelection.forEach(element => {
        //    list.push({rootId:element.rootId,rootText:element.rootText})
        ids.push(element.rootId)
      })
      this.keywordRootRuleForm.ids = ids

      //    this.keywordRootRuleForm.siteId =this.siteId
      // //    this.keywordRootRuleForm.rootType =this.listQuery.rootType
      //    this.keywordRootRuleForm.repository =this.listQuery.repository
      //    this.keywordRootRuleForm.cusCateId =this.listQuery.cusCateId
      //    this.keywordRootRuleForm.productId =this.listQuery.productId
      //    this.keywordRootRuleForm.list =list

      let params = {
        self: this,
				
        formName: null,
        dialogProperty: null,
        formData: this.keywordRootRuleForm,
        apiName: 'keywordRootUpdate'
      }
      DataUtil.submitForm(params)
    },
    // 设置词根类型
    setRootType() {
      
    },
    deleteRows(row) {
      // let params ={
      //     self:this,
      //     id,
      //     idName:'rootId',
      //     apiName:'keywordRootRemove'
      // }
      // if(id===null){
      //     params.multipleSelection =this.multipleSelection
      // }
      // DataUtil.deleteRows(params)
      // let list =[]
      let ids = []
      if (row === null) {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('至少选一项')
          return
        }
        this.multipleSelection.forEach(element => {
          // list.push({rootId:element.rootId,rootText:element.rootText})
          ids.push(element.rootId)
        })
      } else {
        // list.push({rootId:row.rootId,rootText:row.rootText})
        ids.push(row.rootId)
      }

      // let params ={
      //     siteId:this.siteId,
      //     flag:0,
      //     repository:this.listQuery.repository,
      //     cusCateId:this.listQuery.cusCateId,
      //     list
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
        this.$api['keywordRootRemove']({ ids }).then(res => {
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
}
</style>
