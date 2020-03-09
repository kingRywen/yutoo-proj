<template>
  <div class="box">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery">
          <el-form-item label="关键词名称">
            <el-input v-model.trim="listQuery.prepositionText" placeholder="请输入" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="添加时间">
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
            <el-button size="small" type="primary" @click="handleFilter" icon="el-icon-search" :loading="searchLoading">搜索</el-button>
            <el-button size="small" type="primary" plain @click="clear" :disabled='searchLoading'>重置搜索</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <div class="box-update">
      <el-button size="mini" type="primary" plain @click="showDialog">添加</el-button>
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
        <el-table-column prop="prepositionText" label="关键词名称" min-width="70"></el-table-column>
        <el-table-column prop="createTime" label="添加时间" min-width="135"></el-table-column>
        <el-table-column label="操作" width="55">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-delete" @click="deleteRows(scope.row.prepositionText)"></el-button>
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
    <!-- :rules="[{ required: true, message: '请输入关键词', trigger: 'blur' }]" -->

    <yt-dialog :options="options" :events="events">
      <el-form size="small" ref="dialogForm" :rules="rules" :model="dialogForm" label-width="65px">
        <el-form-item required label="关键词" prop="prepositionText">
          <el-input type="textarea" v-model.trim="dialogForm.prepositionText" :rows="5" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号"></el-input>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
</template>
<script>
import { pickerOptions, checkOtherWords } from '../utils'
import _ from 'lodash'
export default {
  // this.siteId 全局引用
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
        // siteId:null,
        prepositionText: null,
        startTime: null,
        endTime: null
      },
      rules: {
        prepositionText: [{ validator: checkOtherWords, trigger: 'blur' }]
      },
      options: {
        visible: false,
        width: '400px',
        title: '添加关键词',
        okBtnText: '确认',
        btnLoading:false,
      },
      events: {
        handleOkClick: () => {
          this.submitForm()
        }
      },
      dialogForm: {
        prepositionText: null,
        siteId: null
      },
      multipleSelection: [],

      searchLoading:false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    clear(){
      this.listQuery.prepositionText=null;
      this.daterange=[];
      this.listQuery.pageNumber = 1;
      this.getList();
    },
    getList() {
      this.listLoading = true;
      this.searchLoading=true;
      let listQuery = _.cloneDeep(this.listQuery)
      listQuery.siteId = this.siteId
      let daterange = this.daterange
      if (daterange === null || daterange.length === 0) {
        listQuery.endTime = null
        listQuery.startTime = null
      } else {
        listQuery.startTime = daterange[0]
        listQuery.endTime = daterange[1]
      }
      let prepositionText = listQuery.prepositionText
      if (prepositionText !== null) {
        let flag = _.isEmpty(prepositionText.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          listQuery.prepositionText = null
        }
      }
      this.$api['prepositionRepositoryList'](listQuery)
        .then(data => {
          let { rows, total } = data
          this.list = rows
          this.total = total
          setTimeout(() => {
            this.listLoading = false
          })
           this.searchLoading=false;
        })
        .catch(() => {
          this.listLoading = false
          this.searchLoading=false;
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
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showDialog() {
      this.options.visible = true
      if (this.$refs['dialogForm'] !== undefined) {
        this.$refs['dialogForm'].resetFields()
      }
    },
    submitForm() {
      this.$refs['dialogForm'].validate(valid => {
        if (valid) {
          this.options.btnLoading=true;
          let dialogForm = _.cloneDeep(this.dialogForm)
          dialogForm.prepositionText = _.compact(
            dialogForm.prepositionText.split('\n')
          )
          dialogForm.prepositionText = _.uniq(dialogForm.prepositionText)
          dialogForm.siteId = this.siteId
          this.$api['prepositionRepositorySave'](dialogForm).then(res => {
            this.options.visible = false
              this.options.btnLoading=false;
            this.getList()
          })
        } else {
          console.log('error submit!!')
           this.options.btnLoading=false;
          return false
        }
      })
    },
    deleteRows(id) {
      let ids = []
      if (id === null) {
        _(this.multipleSelection).forEach(element => {
          ids.push(element.prepositionText)
        })
        if (ids.length === 0) {
          this.$message.warning('至少选一项')
          return
        }
      } else {
        ids = [id]
      }

      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = { ids }
          this.$api['prepositionRepositoryRemove'](params).then(res => {
            // this.options.visible = false
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
  min-width: 690px;
}
.box-update {
  min-width: 130px;
}
.custom-collapse .el-form-item {
    margin-bottom: 10px;
}
</style>
