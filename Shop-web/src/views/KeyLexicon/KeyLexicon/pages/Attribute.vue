<template>
  <div class="box">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="分类属性名称">
          <el-input v-model.trim="listQuery.classifyName" placeholder="请输入关键词" size="mini" clearable></el-input>
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
            size="mini"
            value-format="yyyy-MM-dd"
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
      <el-button size="mini" type="primary" plain @click="showDialog(null)">添加分类属性</el-button>
      <el-button size="mini" type="primary" plain @click="openImport">导入分类属性</el-button>
      <el-button size="mini" type="primary" plain @click="deleteRows(null)">删除</el-button>
      <a v-show="false" ref="exportExcel"></a>
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
        <el-table-column prop="classifyName" label="分类属性名称" min-width="100"></el-table-column>
        <el-table-column label="关联关键词数量" min-width="100" prop="count"></el-table-column>
        <el-table-column width="75" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="showTableDialog(scope.row)"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteRows(scope.row)"></el-button>
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
      <el-form size="small" label-position="right" label-width="80px" :rules="rules" :model="ruleForm" ref="ruleForm">
        <el-form-item
          label="分类名称"
          prop="classifyName"
          :rules="{
                  required: true, message: '分类名称不能为空', trigger: 'change'
                }"
        >
          <!-- <el-input v-model="ruleForm.classifyName" size="mini"></el-input> -->
          <el-autocomplete
            class="w100"
            v-model.trim="ruleForm.classifyName"
            :fetch-suggestions="querySearch"
            :hide-loading="true"
            placeholder="请输入内容"
            size="mini"
            @select="changeClassifyName"
            clearable
          ></el-autocomplete>

          <!-- <el-select v-model="ruleForm.classifyName" filterable placeholder="请输入内容或选择" size="mini">
                      <el-option
                        v-for="item in classifyNameList"
                        :key="item.id"
                        :label="item.value"
                        :value="item.id">
                      </el-option>
          </el-select>-->
        </el-form-item>
        <el-form-item
          label="关键词"
          v-if="pParams.type==='product'&&ruleForm.classifyName!==null&&ruleForm.classifyName!==''"
        >
          <el-select
            class="w100"
            v-model="selectClassifyText"
            multiple
            collapse-tags
            placeholder="请选择"
            size="mini"
            @change="changeSelectClassifyText"
          >
            <el-option v-for="item in classifyTextoptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <!-- v-if="selectClassifyText.length===0" -->
        <el-form-item label="关键词" prop="classifyText">
          <el-input v-model.trim="ruleForm.classifyText" size="mini" type="textarea" :rows="5"></el-input>
        </el-form-item>

        <!-- <el-form-item label="关键词:"
                prop="noRules"
                ref="classifyTextNoRules"
                v-else>
                    <el-input v-model="ruleForm.classifyText" size="mini"
                    type="textarea"
                    :rows="5"></el-input>
        </el-form-item>-->
      </el-form>
    </yt-dialog>
		
		<!-- 添加item关键词 -->
		<yt-dialog :options="addItemOptions" :events="addItemEvents">
			<div>
				<el-form size="small" label-position="right" label-width="80px" :rules="rules" :model="addRuleForm" ref="addRuleForm">
					<el-form-item label="关键词" prop="classifyText">
						<el-input class="w100" v-model.trim="addRuleForm.classifyText" size="mini" type="textarea" :rows="5"></el-input>
					</el-form-item>
				</el-form>
			</div>
		</yt-dialog>
		
    <yt-dialog :options="tableOptions" :events="tableEvents" class="table-dialog">
      <div class="dialog-query">
        <el-form size="small" :inline="true" :model="dialogListQuery">
          <el-form-item>
            <el-input v-model.trim="dialogListQuery.keywordText" placeholder="请输入关键词名称" size="mini"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button size="mini" type="primary" plain @click="handleFilterDialog" :disabled="handleFilterDialogLoading">确认搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="dialog-update-btn">
        	<el-button size="mini" type="primary" plain @click="addMethod()">添加</el-button>
        <el-button size="mini" type="primary" plain @click="deleteDialogRows(null)">删除</el-button>
			
      </div>
      <div class="dialog-data">
        <el-table
          :data="dialogList"
          v-loading="dialogListLoading"
          :key="dialogTableKey"
          style="width: 100%"
          @selection-change="handleSelectionChangeDialog"
          border
          stripe
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="keywordText" label="关键词" min-width="100">
            <template slot-scope="scope">
              <template v-if="scope.row.edit">
                <el-input v-model.trim="scope.row.keywordText" size="mini"/>
                <!-- <el-button type="text" size="mini" @click="scope.row.edit=false">取消</el-button> -->
              </template>
              <span v-else>{{ scope.row.keywordText }}</span>
            </template>
          </el-table-column>
          <el-table-column width="75" label="操作">
            <template slot-scope="scope">
              <div style="display:flex;">
                <div v-if="listQuery.productId===null">
                  <!-- <el-button v-if="scope.row.edit" type="text" size="mini" @click="confirmEdit(scope.row)">确认</el-button>
                  <el-button v-else type="text" size="mini" @click="scope.row.edit=!scope.row.edit">编辑</el-button> -->
                  <el-button v-if="scope.row.edit" type="text" icon="el-icon-tickets" @click="confirmEdit(scope.row)" :disabled="confirmEditDisabled"></el-button>
                  <el-button v-else type="text" icon="el-icon-edit-outline" @click="scope.row.edit=!scope.row.edit"></el-button>
                </div>
                <el-button
                  type="text"
                  size="mini"
                  icon="el-icon-delete"
                  @click="deleteDialogRows(scope.row.keywordTextId)"
                ></el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          background
          @size-change="handleSizeChangeDialog"
          @current-change="handleCurrentChangeDialog"
          :current-page="dialogListQuery.pageNumber"
          :page-sizes="[10,20,30, 50]"
          :page-size="dialogListQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dialogTotal"
        ></el-pagination>
      </div>
    </yt-dialog>
    <yt-dialog :options="uploadOptions" :events="uploadEvents">
      <ImportFile @success="handleSuccess" filename="分类属性模板" :data="downloadData" :downloadApi="downloadApi" :action="action" />
      <!-- <el-upload
        ref="upload"
        action="https://jsonplaceholder.typicode.com/posts/"
        :on-change="handleFileChange"
        :file-list="fileList"
        :on-remove="handleFileRemove"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="mini" type="primary" plain>选取文件</el-button>
        <div slot="tip" class="el-upload__tip">只支持xlsx,xls格式，文件不超过2M</div>
      </el-upload> -->
    </yt-dialog>
  </div>
</template>
<script>
import { pickerOptions, DataUtil, setQueryTime } from '../../utils'
import _ from 'lodash'
import { CONST_PORT_CONFIG, host } from 'Config'
const { BASE_URL } = CONST_PORT_CONFIG
export default {
  props: ['pParams'],
  data() {
    let checkWords = (rule, value, callback) => {
      if (
        this.pParams.type === 'product' &&
        this.selectClassifyText.length !== 0
      ) {
        return callback()
      }
      if (!value) {
        return callback(new Error('词不能为空'))
      }
      setTimeout(() => {
        let words = _.compact(value.split('\n'))
        words = _.uniq(words)
        words.forEach(element => {
          if (element.length > 500) {
            //500
            return callback(new Error('每个词长度不能为超过500'))
          }
        })
        callback()
      }, 500)
    }
    return {
      downloadApi: 'keywordClassifyDownloadFile',
      action: `${host}keywordClassify/importData`,
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
        cusCateId: null,
        classifyName: null,
        startTime: null,
        endTime: null,
        productId: null
      },
      multipleSelection: [],
      rules: {
        classifyText: [
          { required: true, validator: checkWords, trigger: 'blur' }
        ]
      },
      options: {
        visible: false,
        width: '500px',
        title: '添加分类属性',
        okBtnText: '确认',
        btnLoading:false
      },
      events: {
        handleOkClick: () => {
          this.submitForm()
        }
      },
			addItemOptions:{
				visible:false,
				width:'500px',
				title:'添加关键词',
        okBtnText:'确认',
        btnLoading:false
			},
      tableOptions: {
        visible: false,
        width: '800px',
        title: '分类属性名称',
        // okBtnText: '关闭',
        showFooter:false,
        showCancel: false
      },
			addItemEvents:{
				handleOkClick: () => {
				  this.addSubmitForm()
				}
			},
      tableEvents: {
        handleOkClick: () => {
          this.tableOptions.visible = false
        }
      },
      isDialogAdd: true,
      ruleForm: {
        siteId: null,
        cusCateId: null,
        productId: null,
        classifyId: null,
        classifyName: null,
        classifyText: null
      },
			addRuleForm:{
				classifyName:null,
				classifyText: null
			},
      visiblePopover: false,

      dialogTableKey: 1,
      dialogList: null,
      dialogTotal: null,
      dialogListLoading: false,
      dialogListQuery: {
        pageSize: 10,
        pageNumber: 1,
        classifyId: null,
        productClassifyId: null,
        keywordText: null
      },
      dialogMultipleSelection: [],
      uploadOptions: {
        visible: false,
        width: '500px',
        title: '导入分类属性',
        showFooter: false
      },
      uploadEvents: {
        handleOkClick: () => {
          this.submitUploadForm()
        }
      },
      fileList: [],
      restaurants: [],
      classifyNameList: [],
      selectClassifyText: [],
      classifyTextoptions: [],
      classifyNameMap: null,

      searchLoading:false,
      handleFilterDialogLoading:false,

      confirmEditDisabled:false,
    }
  },
  computed: {
    downloadData() {
      return {cusCateId:this.pParams.cusCateId, ...this.storeIds}
    }
  },
  created() {
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
    handleSuccess({ res, file, fileList }) {
      if (res.code !== 0) {
        this.$message.error(res.msg)
      } else {
        this.$message.success(res.msg)
        this.uploadOptions.visible = false
        this.handleFilter()
      }
    },
    openImport() {
      this.uploadOptions.visible = true
    },
		addMethod(){
			this.addItemOptions.visible = true
		},
		addSubmitForm(){
      this.addItemOptions.btnLoading=true;
			this.$refs['addRuleForm'].validate(valid => {
			  if (valid) {
					let addRuleForm = _.cloneDeep(this.addRuleForm)
			    if (this.addRuleForm.classifyText !== null) {
			      addRuleForm.classifyText = _.compact(
			        this.addRuleForm.classifyText.split('\n')
			      )
			    } else {
			      addRuleForm.classifyText = []
			    }
			    addRuleForm.classifyText = _.uniq(addRuleForm.classifyText)
			    let classifyText =[]
			    addRuleForm.classifyText.forEach(element => {
			      classifyText.push(element.replace(/(^\s*)|(\s*$)/g, ""))
			    });
          this.addRuleForm.classifyText =classifyText
        
			    let params = {
			    	classifyId:this.dialogListQuery.classifyId,
			    	classifyName:this.addRuleForm.classifyName,
			    	classifyText:this.addRuleForm.classifyText,
			    	cusCateId:this.listQuery.cusCateId,
			    	productId:this.listQuery.productId,
			    	siteId:this.siteId,
          }
          let apiName;
          if (this.listQuery.productId !== null) {
            apiName = 'productKeywordClassifySave'
          }else{
             apiName = 'keywordClassifySaveItem'
          }
			    this.$api[apiName](params).then(res => {
			    	let { code } = res
			    	if (code === 0) {
			    		this.getList()
			    		this.getDialogList()
              this.addItemOptions.visible = false
              this.addItemOptions.btnLoading=false;
							this.addRuleForm.classifyText = ''
			    	}
			    })
			  } else {
          console.log('error submit!!')
          this.addItemOptions.btnLoading=false;
			    return false
			  }
			})
			
    },
    clear(){
      this.listQuery.pageNumber = 1
      this.daterange=[]
      this.listQuery.classifyName=null
      this.getList()
    },
    getList() {
      // let daterange = this.daterange;
      
      let paramMap = {
        daterange: this.daterange
        // listQuery:this.listQuery
      }
      let timeArr = setQueryTime(paramMap)
      this.listQuery.startTime = timeArr[0]
      this.listQuery.endTime = timeArr[1]
      let apiName = 'keywordClassifyList'
      if (this.listQuery.cusCateId === null) {
        this.$message.warning('请选择类目')
        return
      }
      if (this.pParams.type === 'product') {
        apiName = 'productKeywordClassifyList'
        if (this.listQuery.productId === null) {
          this.$message.warning('请选择商品')
          return
        }
      }

      let params = {
        self: this,
        listQuery: this.listQuery,
        apiName
      }
      DataUtil.getList(params)
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
    showDialog(row) {
      this.getClassifyListAll()
      if (this.$refs.ruleForm !== undefined) {
        this.$refs.ruleForm.resetFields()
      }
      if (row !== null) {
        this.options.title = '编辑分类属性'
        this.isDialogAdd = false
        this.ruleForm.classifyId = row.classifyId
        this.ruleForm.classifyName = row.classifyName
        this.ruleForm.classifyText = row.classifyText
      } else {
        this.options.title = '添加分类属性'
        this.isDialogAdd = true
      }
      this.options.visible = true
      this.selectClassifyText = []
    },
    changeSelectClassifyText() {
      if (this.selectClassifyText.length === 0) {
        //有问题 不能恢复错误红
        // this.$refs.classifyTextNoRules.$children[0].$refs.textarea.style.borderColor='#dcdfe6'
      }
    },
    submitForm() {
      console.log(1);
      this.options.btnLoading=true;
      this.$refs['ruleForm'].validate(valid => {
        if (valid) {
          let apiName = 'keywordClassifySave'
          if (this.isDialogAdd) {
            this.ruleForm.classifyId = null
            //商品分类属性没有修改
            if (this.ruleForm.productId !== null) {
              apiName = 'productKeywordClassifySave'
            }
          } else {
            apiName = 'keywordClassifyUpdate'
          }

          if (this.ruleForm.cusCateId === null) {
            this.$message.warning('请选择类目')
            this.options.btnLoading=false;
            return
          }
          
          let ruleForm = _.cloneDeep(this.ruleForm)
          if (this.ruleForm.classifyText !== null) {
            ruleForm.classifyText = _.compact(
              this.ruleForm.classifyText.split('\n')
            )
          } else {
            ruleForm.classifyText = []
          }

          if (this.isDialogAdd) {
            //商品分类属性没有修改
            if (this.ruleForm.productId !== null) {
              // ruleForm.classifyText.push(this.selectClassifyText)
              ruleForm.classifyText = _.concat(
                ruleForm.classifyText,
                this.selectClassifyText
              )

              apiName = 'productKeywordClassifySave'
            }
          }
          
          ruleForm.classifyText = _.uniq(ruleForm.classifyText)
          let classifyText =[]
          ruleForm.classifyText.forEach(element => {
            classifyText.push(element.replace(/(^\s*)|(\s*$)/g, ""))
          });
          ruleForm.classifyText =classifyText
          
          let params = {
            self: this,
            formName: 'ruleForm',
            formData: ruleForm,
            dialogProperty: 'options',
            apiName
          }
          DataUtil.submitForm(params)
        } else {
            console.log('error submit!!')
            this.options.btnLoading=false;
          return false
        }
      })
    },
    deleteRows(row) {
      let idName = 'classifyId'
      let apiName = 'keywordClassifyRemove'
      let id = null
      if (this.listQuery.productId === null) {
        //.classifyId
        if (row !== null) {
          id = row.classifyId
        }
      } else {
        //productClassifyId
        idName = 'productClassifyId'
        apiName = 'productKeywordClassifyRemove'
        if (row !== null) {
          id = row.productClassifyId
        }
      }
      let params = {
        self: this,
        id,
        idName,
        apiName
      }
      if (id === null) {
        params.multipleSelection = this.multipleSelection
      }
      DataUtil.deleteRows(params)
    },
    showTableDialog(row) {
			this.addRuleForm.classifyName = row.classifyName
      // 区分类目或商品
      if (this.listQuery.productId === null) {
        //.classifyId
        this.dialogListQuery.classifyId = row.classifyId
        this.dialogListQuery.productClassifyId = null
      } else {
        //productClassifyId
        this.dialogListQuery.classifyId = null
        this.dialogListQuery.productClassifyId = row.productClassifyId
      }
      this.getDialogList()
      this.tableOptions.visible = true
    },
    getDialogList() {
      if (this.dialogListQuery.keywordText !== null) {
        let flag = _.isEmpty(
          this.dialogListQuery.keywordText.replace(/(^\s+)|(\s+$)/g, '')
        )
        if (flag) {
          this.dialogListQuery.keywordText = null
        }
      }
      this.dialogListLoading = true
      this.handleFilterDialogLoading=true;
      this.$api['classifyKeywordTextList'](this.dialogListQuery)
        .then(res => {
          let { rows, total } = res
          let list = rows

          list.forEach(element => {
            element.edit = false
          })
          this.dialogList = list
          this.dialogTotal = total
          setTimeout(() => {
            this.dialogListLoading = false
            this.handleFilterDialogLoading=false;
          })
        })
        .catch(() => {
          this.dialogListLoading = false
          this.handleFilterDialogLoading=false;
        })
    },
    handleFilterDialog() {
      this.dialogListQuery.pageNumber = 1
      this.getDialogList()
    },
    handleSizeChangeDialog(val) {
      this.dialogListQuery.pageSize = val
      this.getDialogList()
    },
    handleCurrentChangeDialog(val) {
      this.dialogListQuery.pageNumber = val
      this.getDialogList()
    },
    handleSelectionChangeDialog(val) {
      this.dialogMultipleSelection = val
    },
    deleteDialogRows(id) {
      let ids = []
      if (id === null) {
        this.dialogMultipleSelection.forEach(element => {
          ids.push(element.keywordTextId)
        })
      } else {
        ids = [id]
      }
      if (ids.length === 0) {
        this.$message.warning('至少选一项')
        return
      }
      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api['classifyKeywordTextRemoveForCategory']({ ids }).then(res => {
          let { code } = res
          if (code === 0) {
            this.getList()
            this.getDialogList()
          }
        })
      })
    },
    confirmEdit(row) {
      row.edit = false
      // 类目和商品通用
      this.confirmEditDisabled=true;
      this.$api['classifyKeywordTextUpdate']({
        keywordTextId: row.keywordTextId,
        keywordText: row.keywordText
      }).then(res => {
        let { code } = res
        if (code === 0) {
          this.getDialogList()
           this.confirmEditDisabled=false
        }
      }).catch(err=>{
          this.confirmEditDisabled=false
      })
    },
    downloadTemplate() {
      this.visiblePopover = false
      this.$ajax({
        method: 'post',
        url: BASE_URL + 'keywordClassify/downloadFile',
        responseType: 'blob'
      })
        .then(data => {
          let url = window.URL.createObjectURL(new Blob([data]))
          let a = this.$refs.exportExcel
          a.href = url
          a.setAttribute('download', '分类属性模板.xlsx')
          a.click()
          window.URL.revokeObjectURL(url)
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList.slice(-1)
    },
    handleFileRemove(file, fileList) {
      this.fileList = []
    },
    submitUploadForm() {
      //
      if (this.fileList.length === 0) {
        this.$message.warning('请选择文件')
        return
      }
      // const isCSV = this.fileList[0].raw.type === "application/vnd.ms-excel";
      // const isZIP =
      //   this.fileList[0].raw.type === "application/x-zip-compressed";

      // if (!isCSV && !isZIP) {
      //   this.$message.warning("上传文件只能是 csv 或 zip 格式!");
      //   return;
      // }
      const isLt2M = this.fileList[0].raw.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.warning('上传文件大小不能超过 2MB!')
        return
      }
      // 后端的 @RestController 要改成 @Controller

      let params = {
        siteId: this.siteId,
        cusCateId: this.listQuery.cusCateId,
        // productId:this.listQuery.productId,
        file: this.fileList[0]
      }

      let productId = this.listQuery.productId
      if (productId !== null) {
        params.productId = productId
      }

      this.$api['keywordClassifyImportData'](params).then(res => {
        let { code } = res
        if (code === 0) {
          this.uploadOptions.visible = false
          this.fileList = []
          this.handleFilter()
        }
      })
    },
    createStateFilter(queryString) {
      return state => {
        return (
          state.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
        )
      }
    },
    querySearch(queryString, cb) {
      let restaurants = this.classifyNameList
      let results = queryString
        ? restaurants.filter(this.createStateFilter(queryString))
        : restaurants
      cb(results)
      // clearTimeout(this.timeout);
      // this.timeout = setTimeout(() => {
      //   cb(results);
      // }, 3000 * Math.random());
    },
    getClassifyListAll() {
      this.$api['keywordClassifyListAll']({
        cusCateId: this.pParams.cusCateId
      }).then(res => {
        let { code, data } = res
        if (code === 0) {
          let classifyNameList = []
          let classifyNameMap = new Map()
          data.forEach(element => {
            classifyNameList.push({
              id: element.classifyId,
              value: element.classifyName
            })
            classifyNameMap.set(element.classifyName, element.classifyId)
          })
          this.classifyNameList = classifyNameList
          this.classifyNameMap = classifyNameMap
        }
      })
    },
    changeClassifyName() {
      // 确保 this.ruleForm.classifyName 为唯一
      let classifyId = this.classifyNameMap.get(this.ruleForm.classifyName)
      if (classifyId === null) {
        this.$message.warning('分类名称ID为空')
        return
      }
      this.$api['classifyKeywordTextListAll']({ classifyId }).then(res => {
        let { code, data } = res
        if (code === 0) {
          let classifyTextoptions = []
          data.forEach(element => {
            classifyTextoptions.push({
              label: element.keywordText,
              value: element.keywordText
            })
          })
          this.classifyTextoptions = classifyTextoptions
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
// @import "~@/assets/style/base/variables.less";
.custom-collapse .el-form-item {
    margin-bottom: 10px;
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
    min-width: 710px;
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
    .el-popover__reference {
      margin-left: 10px;
      margin-right: 10px;
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
  .table-dialog {
    /deep/.el-dialog__header {
      border-bottom: 1px solid @borderColor;
    }
    /deep/.el-dialog__body {
      padding-top: 5px;
    }
    .el-table {
      margin-top: 10px;
      margin-bottom: 5px;
    }
  }
  .form-dialog {
    .el-autocomplete {
      width: 235px;
    }
    .el-select {
      width: 235px;
    }
  }
}
</style>


