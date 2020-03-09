<template>
  <div class="box">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form :inline="true" size="small" :model="listQuery">
          <el-form-item label="关键词属性名称">
            <el-input v-model.trim="listQuery.fieldName" placeholder="请输入" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="添加类型">
            <el-select v-model="listQuery.fieldType" placeholder="请选择" size="mini">
              <el-option label="全部" value="all"></el-option>
              <el-option label="系统内置" value="1">
                <!--1 基础字段-->
              </el-option>
              <el-option label="自定义添加" value="2">
                <!--2 复合字段-->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据源">
            <el-select v-model="listQuery.fieldOrigin" placeholder="请选择" size="mini">
              <el-option label="AMAZON" value="AMAZON"></el-option>
              <el-option label="ARA" value="ARA">
                <!--1 基础字段-->
              </el-option>
              <el-option label="ADVERT" value="ADVERT">
                <!--2 复合字段-->
              </el-option>
              <el-option label="GOOGLE" value="GOOGLE">
                <!--2 复合字段-->
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="修改时间">
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
            <el-button
              size="small"
              type="primary"
              @click="handleFilter"
              icon="el-icon-search"
              :loading="searchLoading"
            >搜索</el-button>
            <el-button size="small" type="primary" plain @click="clear" :disabled="searchLoading">重置搜索</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <div class="box-update">
      <el-button size="mini" type="primary" plain @click="showAdOrAraDialog('ADVERT','add')">添加广告属性</el-button>
      <el-button size="mini" type="primary" plain @click="showAdOrAraDialog('ARA','add')">添加ARA属性</el-button>
      <el-button size="mini" type="primary" plain @click="deleteRows(null)">删除</el-button>
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
        ref="multipleTable"
      >
        <el-table-column type="selection" width="55" :selectable="checkSelecTableData"></el-table-column>
        <el-table-column label="关键词属性名称" min-width="110">
          <template slot-scope="scope">
            <div class="cell">{{scope.row.fieldName|formatNull}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="customName" label="自定义名称" min-width="90">
          <template slot-scope="scope">
            <div class="cell">{{scope.row.customName|formatNull}}</div>
          </template>
        </el-table-column>
        <el-table-column label="添加类型" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.fieldType==1">系统内置</div>
            <div v-else-if="scope.row.fieldType==2">自定义添加</div>
            <div v-else>其它</div>
          </template>
        </el-table-column>
        <el-table-column prop="fieldOrigin" label="数据源" min-width="70"></el-table-column>
        <el-table-column prop="updateTime" label="修改时间" min-width="135"></el-table-column>
        <el-table-column label="操作" width="75">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="showEditCustomNameDialog(scope.row)"></el-button>
            <el-button
              type="text"
              size="mini"
              icon="el-icon-delete"
              v-if="scope.row.fieldType==2"
              @click="deleteRows(scope.row.fieldKey)"
            ></el-button>
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
        style="margin-top: 5px;
    margin-bottom: 5px;"
      ></el-pagination>
    </div>

    <yt-dialog :options="adOrAraOptions" :events="adOrAraEvents" class="ad-ara-dialog ___common">
      <el-form
        size="small"
        :model="ruleFormAdOrAra"
        
        :rules="rulesAdOrAra"
        ref="ruleFormAdOrAra"
        label-width="85px"
        class="ad-ruleForm"
      >
        <el-form-item label="属性名称" prop="customName" label-width="70px">
          <el-input v-model="ruleFormAdOrAra.customName" placeholder="自定义名称" size="mini"></el-input>
        </el-form-item>
      </el-form>
      <div class="ad-ara-formula">
        <div class="column-1" style="font-size:12px">计算公式</div>
        <div class="column-2">
          <div class="symbol">
            <el-button type="text" class="plus" @click="addFormulaBtns('symbol','+')">+</el-button>
            <el-button type="text" class="minus" @click="addFormulaBtns('symbol','-')">-</el-button>
            <el-button type="text" class="multiply" @click="addFormulaBtns('symbol','*')">*</el-button>
            <el-button type="text" @click="addFormulaBtns('symbol','/')">/</el-button>
            <el-button type="text" @click="addFormulaBtns('symbol','(')">(</el-button>
            <el-button type="text" @click="addFormulaBtns('symbol',')')">)</el-button>
          </div>
          <div class="param-title">数据项</div>
          <div class="param">
            <el-button
              type="info"
              size="mini"
              v-for="item in formulaParamList"
              :key="item.fieldKey"
              @click="addFormulaBtns(item.fieldKey,item.displayName,item.input)"
            >{{item.displayName}}</el-button>
          </div>
        </div>
        <div class="column-3" ref="adOrAraFormula">
          <draggable v-model="formulaParamBtns" @start="drag=true" @end="drag=false" class="draggable">
            <div v-for="(item,index) in formulaParamBtns" :key="index" class="formula-btn">
              <div class="btn-txt" v-if="item.input">
                <el-input v-model="item.key" placeholder="数值" size="mini" style="width:60px;" :clearable="true"></el-input>
              </div>
              <div class="btn-txt" v-if="!item.input">{{item.label}}</div>
              <i class="el-icon-circle-close-outline" @click="btnClose(index)"></i>
            </div>
          </draggable>
          <div style="color:#f56c6c;font-size:12px;margin-left: 10px;" v-show="formulaMsg">请设置公式</div>
        </div>
        <!-- {{formulaParamBtns.length}} -->
      </div>
      <div class="param-clean">
        <el-button type="primary" size="mini" @click="saveAdOrAraFormula(0)">校 验</el-button>
        <el-button type="warning" size="mini" @click="clearParams" plain>清 空</el-button>
      </div>
    </yt-dialog>

    <yt-dialog :options="editCustomNameOptions" :events="editCustomNameEvents" class="edit-custom-name-dialog">
      <el-form
        size="small"
        :model="ruleFormEditCustomName"
        :rules="rulesEditCustomName"
        ref="ruleFormEditCustomName"
        label-width="85px"
        class="ad-ruleForm"
      >
        <el-form-item label="属性名称">
          <el-input v-model="ruleFormEditCustomName.fieldName" placeholder="属性名称" size="mini" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="自定义名称" prop="customName">
          <el-input v-model="ruleFormEditCustomName.customName" placeholder="自定义名称" size="mini"></el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import { pickerOptions } from '../utils'
import draggable from 'vuedraggable'
import _ from 'lodash'
export default {
  components: {
    draggable
  },
  data() {
    let vm = this
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
        fieldName: null,
        fieldOrigin: null,
        customName: null,
        fieldOrigin: null,
        fieldType: 'all',
        endTime: null,
        startTime: null
      },
      multipleSelection: [],
      formulaParamList: [],
      ruleFormAdOrAra: {
        customName: null
      },
      rulesAdOrAra: {
        customName: [
          { required: true, message: '请输入属性名称', trigger: 'blur' }
        ]
      },
      formulaParamBtns: [],
      fieldOrigin: 'ADVERT',
      adOrAraOptions: {
        visible: false,
        width: '710px',
        title: '添加',
        okBtnText: '确认',
        cancelBtnText: '取消',
        btnLoading: false
      },
      adOrAraEvents: {
        handleOkClick: () => {
          this.saveAdOrAraFormula(1)
        }
      },
      formulaMsg: false,

      editCustomNameOptions: {
        visible: false,
        width: '450px',
        title: '编辑',
        okBtnText: '确认',
        btnLoading: false
      },
      editCustomNameEvents: {
        handleOkClick: () => {
          this.submitEditCustomName()
        }
      },
      ruleFormEditCustomName: {
        fieldKey: null,
        fieldOrigin: null,
        fieldName: null,
        customName: null
      },
      rulesEditCustomName: {
        // fieldName:[
        //      { required: true, message: '属性名称不能为空', trigger: 'blur' }
        // ],
        // customName: [
        //   { required: true, message: "请输入自定义名称", trigger: "blur" }
        // ]
      },
      i: 0,

      searchLoading: false
    }
  },
  created() {
    this.getList()
  },
  filters: {
    formatNull(val) {
      return val == null ? '-' : val
    }
  },
  methods: {
    verify() {
      console.log(1)
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    checkSelecTableData(row) {
      return row.fieldType == 2
    },
    clear() {
      this.listQuery.fieldType = 'all'
      this.listQuery.fieldName = null
      this.listQuery.fieldOrigin = null
      this.daterange = []
      this.listQuery.pageNumber = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.searchLoading = true
      let listQuery = _.cloneDeep(this.listQuery)
      if (listQuery.fieldType === 'all') {
        listQuery.fieldType = null
      } else {
        listQuery.fieldType = new Number(listQuery.fieldType)
      }
      let daterange = this.daterange
      if (daterange === null || daterange.length === 0) {
        listQuery.endTime = null
        listQuery.startTime = null
      } else {
        listQuery.startTime = daterange[0]
        listQuery.endTime = daterange[1]
      }
      let fieldName = listQuery.fieldName
      if (fieldName !== null) {
        let flag = _.isEmpty(fieldName.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          listQuery.fieldName = null
        }
      }
      this.$api['keywordDataFieldList'](listQuery)
        .then(data => {
          let { rows, total } = data
          this.list = rows
          this.total = total
          //   this.list =data
          setTimeout(() => {
            this.listLoading = false
            this.searchLoading = false
          })
        })
        .catch(() => {
          this.listLoading = false
          this.searchLoading = false
        })
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
    setListQueryNull() {
      this.listQuery = {
        fieldName: null,
        fieldType: null,
        fieldOrigin: null,
        fieldType: null,
        endTime: null,
        startTime: null
      }
    },
    formatterRowClassName({ row, rowIndex }) {
      return tableRowClassName({ row, rowIndex })
    },
    showAdOrAraDialog(fieldOrigin, type, fieldKey) {
      if (type === 'add') {
        this.URL = 'keywordDataFieldSave'
        this.fieldKey = ''
      } else {
        this.URL = 'keywordDataFieldUpdate'
        this.fieldKey = fieldKey
      }
      if (!_.isUndefined(this.$refs['ruleFormAdOrAra'])) {
        this.$refs['ruleFormAdOrAra'].resetFields()
      }
      if (this.$refs.adOrAraFormula !== undefined) {
        this.setAdOrAraFormulaStyle()
      }

      this.fieldOrigin = fieldOrigin
      let params = {
        fieldOrigin
      }
      return this.$api['keywordDataFieldListAll'](params)
        .then(res => {
          this.formulaParamList = []
          this.formulaParamBtns = []
          this.ruleFormAdOrAra.customName = null
          let { data } = res
          data.unshift({
            fieldKey: '',
            displayName: '值',
            input: true
          })
          //   console.log(data, "data");
          _(data).forEach(val => {
            let item = {
              fieldKey: val.fieldKey,
              displayName: val.displayName,
              input: val.input
            }
            this.formulaParamList.push(item)
          })
          this.adOrAraOptions.visible = true
          this.adOrAraOptions.title = '添加'
          return this.formulaParamList
        })
        .catch(() => {
          this.$message.error('数据项加载失败!')
        })
    },
    saveAdOrAraFormula(type) {
      if (this.formulaParamBtns.length === 0) {
        let style = this.$refs.adOrAraFormula.style
        style.border = '1px solid #f56c6c'
        style.borderRadius = '4px'
        this.formulaMsg = true
      }
      //this.adOrAraOptions.btnLoading=true;
      this.$refs['ruleFormAdOrAra'].validate(valid => {
        if (valid) {
          if (this.formulaParamBtns.length === 0) {
            return
          }
          this.adOrAraOptions.btnLoading = true
          let reqParams = {
            customName: this.ruleFormAdOrAra.customName,
            fieldOrigin: this.fieldOrigin,
            expression: null,
            params: null
          }

          let str = ''
          let paramArr = []
          let bool
          _(this.formulaParamBtns).forEach(val => {
            if (val.key === 'symbol') {
              str += val.label
            } else {
              str += val.key
              if (!val.input) {
                paramArr.push(val.key)
              } else {
                // 是数值输入框要判断是否输入数字
                if (isNaN(val.key)) {
                  bool = true
                }
              }
            }
          })
          if (bool) {
            this.$message.warning('请确认输入框输入的值需是数字')
            return
          }
          reqParams.expression = str
          reqParams.params = _.uniq(paramArr)
          if (this.fieldKey) {
            reqParams.fieldKey = this.fieldKey
          }
          reqParams.op=type;//校验还是保存
          this.$api[this.URL](reqParams).then(data => {
            if(type!==0){
                this.adOrAraOptions.visible = false
            }
            this.adOrAraOptions.btnLoading = false
            this.getList()
          })
        } else {
          console.log('error submit!!')
          this.adOrAraOptions.btnLoading = false
          return false
        }
      })
    },
    addFormulaBtns(key, label, input) {
      this.setAdOrAraFormulaStyle()
      //   console.log(input);
      this.formulaParamBtns.push({ key, label, input })
    },
    btnClose(index) {
      this.formulaParamBtns.splice(index, 1)
    },
    clearParams() {
      this.formulaParamBtns = []
      this.setAdOrAraFormulaStyle()
    },
    setAdOrAraFormulaStyle() {
      let style = this.$refs.adOrAraFormula.style
      style.borderWidth = '0'
      this.formulaMsg = false
    },
    async showEditCustomNameDialog(row) {
      // console.log(row, "row_todo");
      if (row.fieldType === 1) {
        // 系统的单单修改名称
        if (!_.isUndefined(this.$refs['ruleFormEditCustomName'])) {
          this.$refs['ruleFormEditCustomName'].resetFields()
        }
        this.editCustomNameOptions.visible = true
        this.ruleFormEditCustomName.fieldKey = row.fieldKey
        this.ruleFormEditCustomName.fieldOrigin = row.fieldOrigin
        this.ruleFormEditCustomName.fieldName = row.fieldName
        this.ruleFormEditCustomName.customName = row.customName
      } else {
        // 不是系统的须回显公式
        this.URL = ''
        let result = await this.showAdOrAraDialog(
          row.fieldOrigin,
          'edit',
          row.fieldKey
        )
        if (result) {
          this.getRule(row.fieldKey)
        }
      }
    },
    // 获取回显公式 关键词属性的
    getRule(fieldKey) {
      let params = {
        fieldKey: fieldKey
      }
      this.$api['KeywordDataFieldInfo'](params).then(data => {
        let res = data.data
        this.ruleFormAdOrAra.customName = res.customName
        if (res.expression) {
          let str = res.expression
          //  将数组处理成回显
          let r = data.params
          //let strArr =str.match(/(\w+\_\w+)|(\d+)|([\+\-\*\/\(\)])/g)
          // let strArr =str.match(/((?=[^\b\+\-\*\/\)\(])\w+)|([\+\-\*\/\)\(])|(\d+)/g)
          let strArr = str.match(
            /((?=[^\b\+\-\*\/\)\(])\w+(\b))|([\+\-\*\/\)\(])|(\d+)/g
          )
          strArr.forEach(el => {
            if (
              el === '(' ||
              el === ')' ||
              el === '+' ||
              el === '-' ||
              el === '*' ||
              el === '/'
            ) {
              this.formulaParamBtns.push({
                key: 'symbol',
                label: el
              })
            } else {
              let item = this.formulaParamList.find(i => {
                return i.fieldKey === el
              })

              if (item && isNaN(el)) {
                this.formulaParamBtns.push({
                  key: el,
                  label: item.displayName
                })
              } else {
                this.formulaParamBtns.push({
                  key: el,
                  input: true
                })
              }
            }
          })

          // let reg0 = "";
          // r.forEach(el => {
          //   reg0 += "|" + el.paramKey;
          // });
          // let reg = new RegExp("\\+|-\\*|\\/|\\(|\\)" + reg0, "g");
          // let strArr = str.match(reg);
          // // console.log(strArr, "strArr");
          // this.formulaParamBtns = [];
          // strArr.forEach((el, index) => {
          //   if (
          //     el === "(" ||
          //     el === ")" ||
          //     el === "+" ||
          //     el === "-" ||
          //     el === "*" ||
          //     el === "/"
          //   ) {
          //     this.formulaParamBtns.push({
          //       key: "symbol",
          //       label: el
          //     });
          //   } else {
          //     // console.log(el, "el");
          //     let item = this.formulaParamList.find(i => {
          //       return i.fieldKey === el;
          //     });
          //     // console.log(item, "item");
          //     if (item) {
          //       this.formulaParamBtns.push({
          //         key: el,
          //         label: item.displayName
          //       });
          //     } else {
          //       this.formulaParamBtns.push({
          //         key: el,
          //         label: "",
          //         input: true
          //       });
          //     }
          //   }
          // });
          this.adOrAraOptions.title = '编辑'
          // console.log(this.formulaParamBtns, "回显formulaParamBtns");
        }
      })
    },
    // 增加切割符号
    insert(arr, arr_copy, str) {
      this.i = 0
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] !== str) {
          // console.log(i, "i");
          // console.log(arr[i], "arr[i]");
          arr_copy.splice(i + this.i, 0, str)
          this.i += 1
          // console.log(this.i, "this.i");
          // console.log(arr_copy, "arr_copy");
        }
      }
      return arr_copy
    },
    // 提交系统编辑
    submitEditCustomName() {
      // this.$refs["ruleFormEditCustomName"].validate(valid => {
      // if (valid) {
      let ruleFormEditCustomName = _.cloneDeep(this.ruleFormEditCustomName)
      delete ruleFormEditCustomName.fieldName
      if (ruleFormEditCustomName.customName !== null) {
        let flag = _.isEmpty(
          ruleFormEditCustomName.customName.replace(/(^\s+)|(\s+$)/g, '')
        )
        if (flag) {
          ruleFormEditCustomName.customName = null
        }
      }
      this.editCustomNameOptions.btnLoading = true
      this.$api['KeywordDataFieldUpdateForSystem'](ruleFormEditCustomName)
        .then(data => {
          this.getList()
          this.editCustomNameOptions.visible = false
          this.editCustomNameOptions.btnLoading = false
        })
        .catch(err => {
          this.editCustomNameOptions.btnLoading = false
        })
      // } else {
      //   console.log("error submit!!");
      //   return false;
      // }
      // });
    },
    deleteRows(fieldKey) {
      let ids = []
      if (fieldKey === null) {
        if (this.multipleSelection.length === 0) {
          this.$message.warning('至少选一项')
          return
        }
        _(this.multipleSelection).forEach(val => {
          ids.push(val.fieldKey)
        })
      } else {
        ids = [fieldKey]
      }

      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['keywordDataFieldRemove']({ ids }).then(data => {
            this.$refs.multipleTable.clearSelection()
            this.handleFilter()
          })
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="less" scoped>
@import './common';
.box-query {
  min-width: 920px;
}
.custom-collapse .el-form-item {
  margin-bottom: 10px;
}
.box-update {
  min-width: 290px;
}
.ad-ara-dialog {
  .ad-ara-formula {
    display: flex;
    .column-1 {
      width: 90px;
      padding-left: 10px;
      padding-top: 7px;
    }
    .column-2 {
      width: 185px;
      .symbol {
        //   background-color: @boxQueryBGColor;
        .el-button--text {
          padding: 7px;
          font-size: 16px;
          font-weight: bold;
        }
      }
      .param-title {
        text-align: center;
        padding: 5px;
        background-color: @boxQueryBGColor;
      }
      .param {
        display: flex;
        flex-wrap: wrap;
        border: 1px solid @borderColor;
        padding-left: 5px;
        padding-bottom: 5px;
        .el-button {
          padding: 7px;
          margin-left: 0;
          margin-right: 5px;
          margin-top: 5px;
        }
      }
    }
    .column-3 {
      width: 380px;
      margin-left: 10px;
      //   height: 30px;
      background-color: @boxQueryBGColor;
      .draggable {
        padding: 5px 0 5px 10px;
        display: flex;
        flex-wrap: wrap;
        .formula-btn {
          //   padding-left: 5px;
          margin-right: 10px;
          font-size: 12px;
          display: flex;
          height: 25px;
          line-height: 25px;
          .btn-txt {
            cursor: move;
            padding-top: 3px;
          }
          /deep/[class^='el-icon-'] {
            font-size: 10px;
            width: 10px;
            height: 10px;
            color: red;
            cursor: pointer;
          }
        }
      }
    }
  }
  .param-clean {
    margin-top: 5px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
