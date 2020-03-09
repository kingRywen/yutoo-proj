<template>
  <div class="box">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery">
          <el-form-item label="筛选组名称">
            <el-input v-model.trim="listQuery.conditionName" placeholder="请输入" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="适用词库">
            <el-select v-model="listQuery.conditionScope" placeholder="请选择" size="mini">
              <el-option label="全部" value="all"></el-option>
              <el-option label="上架词" value="LAYOUT"></el-option>
              <el-option label="广告词" value="ADVERT"></el-option>
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
            <!-- <el-button size="mini" type="primary" plain @click="handleFilter">确认搜索</el-button> -->
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
      <el-button size="mini" type="primary" plain @click="showDialog('dialogForm',null)">添加</el-button>
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
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="conditionName" label="筛选组名称" min-width="90"></el-table-column>
        <el-table-column min-width="350" label="计算公式" :formatter="formatterFormula">
          <!-- <template slot-scope="scope">
                        <div class="calculation-formula-column">
                            <div v-if="scope.row.highValue!==null" class="item">
                                高:展现量 &gt;= {{scope.row.highValue}}
                            </div>
                            <div v-if="scope.row.midValue!==null" class="item">
                                中:展现量 &gt;= {{scope.row.midValue}}
                            </div>
                            <div v-if="scope.row.lowValue!==null" class="item">
                                低:展现量 &gt;= {{scope.row.lowValue}}
                            </div>
                        </div>
          </template>-->
        </el-table-column>
        <el-table-column min-width="80" label="适用词库">
          <template slot-scope="scope">
            <div v-if="scope.row.conditionScope==='LAYOUT'">上架词</div>
            <div v-else-if="scope.row.conditionScope==='ADVERT'">广告词</div>
            <div v-else>上架词,广告词</div>
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" min-width="140" label="修改时间"></el-table-column>
        <el-table-column label="操作" width="75">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="showDialog('dialogForm',scope.row)"></el-button>
            <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteRows(scope.row.conditionId)"></el-button>
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

    <yt-dialog :options="options" :events="events">
      <el-form size="small" label-width="90px" :model="dialogForm" :rules="rules" ref="dialogForm" class="dialog-form">
        <el-form-item label="筛选组名称" prop="conditionName">
          <el-input v-model.trim="dialogForm.conditionName" placeholder="请输入" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="适用词库" prop="conditionScope">
          <!-- <el-checkbox v-model="layout" @change="getFieldKey">上架词库</el-checkbox>
                <el-checkbox v-model="advert" @change="getFieldKey">广告词库</el-checkbox> 
          :min="1"-->
          <el-checkbox-group v-model="dialogForm.conditionScope">
            <el-checkbox v-for="item in conditionScopeOptions" :label="item.value" :key="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <ElFormItem label="筛选公式" required>
          <div class="flex">
            <el-form-item label-width="0" prop="fieldKey">
              <el-select v-model="dialogForm.fieldKey" placeholder="请选择" size="mini">
                <el-option v-for="item in fieldKeyOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="低" label-width="50px" class="form-row-inline" prop="low">
              <el-input class="customAppend" v-model.number="dialogForm.low" placeholder="请输入数值" size="mini">
                <template slot="append" v-if="addPerCent(dialogForm.fieldKey)">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="中" label-width="50px" class="form-row-inline" prop="middle">
              <el-input class="customAppend" v-model.number="dialogForm.middle" placeholder="请输入数值" size="mini">
                <template slot="append" v-if="addPerCent(dialogForm.fieldKey)">%</template>
              </el-input>
            </el-form-item>
            <el-form-item label="高" label-width="50px" class="form-row-inline" prop="high">
              <el-input class="customAppend" v-model.number="dialogForm.high" placeholder="请输入数值" size="mini">
                <template slot="append" v-if="addPerCent(dialogForm.fieldKey)">%</template>
              </el-input>
            </el-form-item>
          </div>
        </ElFormItem>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import { pickerOptions, DataUtil } from '../utils'
import _ from 'lodash'
export default {
  data() {
    let validateHighValue = (rule, value, callback) => {
      this.$refs.dialogForm.clearValidate()
      if (!value) {
        return callback(new Error('请选输入高'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= this.dialogForm.middle) {
            callback(new Error('必须大于中'))
          } else {
            callback()
          }
        }
      }, 100)
    }
    let validateMidValue = (rule, value, callback) => {
      this.$refs.dialogForm.clearValidate()
      if (!value) {
        return callback(new Error('请选输入中'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= this.dialogForm.low) {
            callback(new Error('必须大于低'))
          } else {
            callback()
          }
        }
      }, 100)
    }
    let validateLowValue = (rule, value, callback) => {
      this.$refs.dialogForm.clearValidate()
      if (!value) {
        return callback(new Error('请选输入低'))
      }
      setTimeout(() => {
        if (!Number.isInteger(value)) {
          callback(new Error('请输入数字值'))
        } else {
          if (value <= 0) {
            callback(new Error('必须大于0'))
          } else {
            if (this.dialogForm.middle) {
              if (value >= this.dialogForm.middle) {
                callback(new Error('必须小于中'))
              } else {
                callback()
              }
            } else {
              callback()
            }
          }
        }
      }, 100)
    }
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
        conditionName: null,
        conditionScope: 'all',
        startTime: null,
        endTime: null
      },
      fieldKeyOptions: [],
      options: {
        visible: false,
        width: '800px',
        title: '添加',
        okBtnText: '确认',
        btnLoading: false
      },
      events: {
        handleOkClick: () => {
          this.submitForm()
        }
      },
      // conditionScope: ['LAYOUT'],
      conditionScopeOptions: [
        { value: 'LAYOUT', label: '上架词' },
        { value: 'ADVERT', label: '广告词' }
      ],
      dialogForm: {
        conditionId: null,
        conditionName: null,
        conditionScope: [],
        fieldKey: null,
        high: null,
        middle: null,
        low: null
      },
      rules: {
        conditionName: [
          { required: true, message: '请选输入筛选组名称', trigger: ['blur','change'] }
        ],
        conditionScope: [
          { required: true, message: '请选输入适用词库', trigger: ['blur','change'] }
        ],
        fieldKey: [
          { required: true, message: '请选择筛选公式', trigger: ['blur','change'] }
        ],
        high: [
          { required: true, validator: validateHighValue, trigger: ['blur','change'] }
        ],
        middle: [
          { required: true, validator: validateMidValue, trigger: ['blur','change'] }
        ],
        low: [{ required: true, validator: validateLowValue, trigger: ['blur','change'] }]
      },
      isDialogAdd: false,
      multipleSelection: [],

      searchLoading: false
    }
  },
  created() {
    this.getfieldKeyOptions(true)
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    formatterRowClassName({ row, rowIndex }) {
      return tableRowClassName({ row, rowIndex })
    },
    clear() {
      this.listQuery.conditionScope = 'all'
      this.listQuery.conditionName = null
      this.daterange = []
      this.listQuery.pageNumber = 1
      this.getList()
    },
    getList() {
      this.listLoading = true
      this.searchLoading = true
      let listQuery = _.cloneDeep(this.listQuery)
      if (listQuery.conditionScope === 'all') {
        listQuery.conditionScope = null
      }
      let daterange = this.daterange
      if (daterange === null || daterange.length === 0) {
        listQuery.endTime = null
        listQuery.startTime = null
      } else {
        listQuery.startTime = daterange[0]
        listQuery.endTime = daterange[1]
      }

      let conditionName = listQuery.conditionName
      if (conditionName !== null) {
        let flag = _.isEmpty(conditionName.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          listQuery.conditionName = null
        }
      }

      this.$api['keywordFilterConditionList'](listQuery)
        .then(data => {
          let { rows, total } = data
          this.list = rows
          this.total = total
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
    formatterFormula(row, column) {
      console.log(row)
      let formulaNameArr = this.fieldKeyOptions.filter(element => {
        return element.value === row.fieldKey
      })
      let formulaName = '上架词,广告词'
      if (formulaNameArr.length !== 0) {
        formulaName = formulaNameArr[0].label
      }
      let str = ''
      if (row.high !== null) {
        if (this.addPerCent(row.fieldKey)) {
          str = `高:${formulaName} >=${row.high * 100}% `
        } else {
          str = `高:${formulaName} >=${row.high} `
        }
      }
      if (row.middle !== null) {
        if (this.addPerCent(row.fieldKey)) {
          str += `中:${formulaName} >=${row.middle * 100}% `
        } else {
          str += `中:${formulaName} >=${row.middle} `
        }
      }
      if (row.low !== null) {
        if (this.addPerCent(row.fieldKey)) {
          str += `低:${formulaName} >=${row.low * 100}%`
        } else {
          str += `低:${formulaName} >=${row.low}`
        }
      }
      return str
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
    getfieldKeyOptions(init) {
      this.$api['keywordDataFieldListAll']({ fieldOrigin: null })
        .then(res => {
          let { data } = res
          let fieldKeyOptions = []
          _(data).forEach(val => {
            let item = { value: val.fieldKey, label: val.displayName }
            fieldKeyOptions.push(item)
          })

          this.fieldKeyOptions = fieldKeyOptions
          if (init) {
            this.handleFilter()
          }
        })
        .catch(() => {
          // this.$message.error('筛选公式加载失败!')
          console.log('筛选公式加载失败!')
        })
    },
    addPerCent(fieldKey) {
      if (fieldKey === null) {
        return false
      }
      /**
       * 加百分号
       *
       * 广告ACOS
       * 广告点击率
       * 广告转化率
       *
       * ARA点击率
       * ARA转化率
       */
      // return [
      //   'advert_acos',
      //   'advert_click_rates',
      //   'advert_conversion_rates',
      //   'ara_click_rates',
      //   'ara_conversion_rates'].indexOf(fieldKey) > -1

      // 检查前缀
      let tmpList = [
        'advert_acos',
        'advert_click_rates',
        'advert_conversion_rates',
        'ara_click_rates',
        'ara_conversion_rates'
      ]

      let flag = false
      tmpList.forEach(element => {
        if (fieldKey.indexOf(element) !== -1) {
          flag = true
        }
      })
      return flag
    },
    showDialog(formName, row) {
      this.options.visible = true
      if (this.$refs[formName] !== undefined) {
        this.restDialogFormData()
        this.$refs[formName].clearValidate()
        // this.$refs[formName].resetFields();
        // 如果第一次点编辑，而不是新增；resetFields恢复的是第一次点编辑的数据，而不是重置
      }
      this.dialogForm.fieldKey = null
      this.getfieldKeyOptions(false)
      if (row === null) {
        this.options.title = '添加'
        this.isDialogAdd = true
      } else {
        this.options.title = '编辑'
        this.isDialogAdd = false

        if (this.addPerCent(row.fieldKey)) {
          this.dialogForm = {
            conditionId: row.conditionId,
            conditionName: row.conditionName,
            conditionScope: row.conditionScope.split(','),
            fieldKey: row.fieldKey,
            high: row.high * 100,
            middle: row.middle * 100,
            low: row.low * 100
          }
        } else {
          this.dialogForm = {
            conditionId: row.conditionId,
            conditionName: row.conditionName,
            conditionScope: row.conditionScope.split(','),
            fieldKey: row.fieldKey,
            high: row.high,
            middle: row.middle,
            low: row.low
          }
        }
      }
    },
    restDialogFormData() {
      this.dialogForm = {
        conditionId: null,
        conditionName: null,
        conditionScope: [],
        fieldKey: null,
        high: null,
        middle: null,
        low: null
      }
    },
    submitForm() {
      this.options.btnLoading = true
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          let dialogForm = _.cloneDeep(this.dialogForm)
          dialogForm.conditionScope = dialogForm.conditionScope.toString()
          if (this.addPerCent(dialogForm.fieldKey)) {
            dialogForm.high = dialogForm.high / 100
            dialogForm.low = dialogForm.low / 100
            dialogForm.middle = dialogForm.middle / 100
          }

          if (this.isDialogAdd) {
            delete dialogForm.conditionId
            this.$api['keywordFilterConditionSave'](dialogForm).then(res => {
              this.options.visible = false
              this.options.btnLoading = false
              this.getList()
            })
          } else {
            this.$api['keywordFilterConditionUpdate'](dialogForm).then(res => {
              this.options.btnLoading = false
              this.options.visible = false
              this.getList()
            })
          }
        } else {
          console.log('error submit!!')
          this.options.btnLoading = false
          return false
        }
      })
    },
    deleteRows(id) {
      let params = {
        self: this,
        id,
        idName: 'conditionId',
        apiName: 'keywordFilterConditionRemove'
      }
      if (id === null) {
        params.multipleSelection = this.multipleSelection
      }
      DataUtil.deleteRows(params)
    }
    //
  }
}
</script>
<style lang="less" scoped>
@import './common';
.box-query {
  min-width: 890px;
}
.dialog-form {
  .form-row-1,
  .form-row-2,
  .form-row-3 {
    width: 640px;
  }
  .form-row-2 {
    /deep/.el-form-item__label {
      width: 95px;
    }
  }
  //  .form-row-3{
  //      padding-left: 86px;
  //  }
  .form-row-4 {
    /deep/.el-form-item__label {
      width: 95px;
    }
    .el-select {
      width: 180px;
    }
  }
  .form-row-inline {
    .el-input {
      width: 120px;
    }
  }
}
.el-table {
  .calculation-formula-column {
    display: flex;
    .item {
      margin-right: 10px;
    }
  }
}
</style>
<style lang="scss">
.customAppend {
  .el-input-group__append {
    padding: 0 6px;
  }
}
.custom-collapse .el-form-item {
  margin-bottom: 10px;
}
</style>
