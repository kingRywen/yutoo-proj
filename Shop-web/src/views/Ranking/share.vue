<template>
  <div class="box" v-if="($route.name === 'ad') || ($route.name === 'normal')">
    <el-collapse class="custom-collapse" value="`1`" accordion>
      <el-collapse-item title="筛选条件" name="1">
        <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm">
          <el-form-item prop="keyword" label="关键词">
            <el-input v-model.trim="listQuery.keyword" placeholder="请输入关键词" size="mini" clearable></el-input>
          </el-form-item>
          <el-form-item label="监控状态" prop="monitorFlag">
            <el-select v-model="listQuery.monitorFlag" placeholder="请选择" size="mini" class="select-monitor-flag">
              <el-option :label="item[0]" :value="item[1]" v-for="item in [['所有','all'],['关闭','0'],['开启','1']]"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="创建时间">
            <el-date-picker
              v-model="listQuery.daterange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              size="mini"
              :picker-options="pickerOptions"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item>
            <!-- <el-button size="mini" type="primary" plain v-for="item in ['确认搜索','重置搜索']" @click="distribute(item)">{{item}}</el-button> -->

            <el-button
              size="small"
              type="primary"
              @click="distribute('确认搜索')"
              icon="el-icon-search"
              :loading="$store.state.isloading || $store.state.loading"
            >搜索</el-button>
            <el-button
              size="small"
              type="primary"
              plain
              @click="distribute('重置搜索')"
              :disabled="$store.state.isloading || $store.state.loading"
            >重置搜索</el-button>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <div class="box-update-btn">
      <el-button
        type="primary"
        plain
        size="mini"
        v-for="item in ['添加任务','删除','添加监控','修改监控周期','取消监控']"
        :disabled=" ($store.state.isloading || $store.state.loading) && (item==='删除' || item==='取消监控')"
        @click="distribute(item)"
      >{{item}}</el-button>
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
        <el-table-column
          v-for="item in tableList"
          :prop="item[0]"
          :label="item[1]"
          :min-width="item[2]"
          :key="'table-column_'+item[0]"
        ></el-table-column>
        <el-table-column label="操作" width="75">
          <template slot-scope="scope">
             <el-tooltip v-if="scope.row.status==='抓取成功'" effect="light" content="查看详情" placement="top-start">
              <el-button type="text" size="mini" icon="el-icon-search" @click="viewDetails(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip v-else-if="scope.row.status==='抓取失败'" effect="light" content="重新抓取" placement="top-start">
              <el-button type="text" size="mini" icon="el-icon-refresh" @click="reCrawl(scope.row)"></el-button>
            </el-tooltip>
            <el-button type="text" size="mini" icon="el-icon-edit-outline" @click="showMonitorDialog(scope.row)"></el-button>
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

    <yt-dialog :options="options" :events="events" class="add-dialog">
      <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
        <el-form-item label="关键词" prop="keywords">
          <el-input type="textarea" v-model.trim="ruleForm.keywords" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" :rows="5" size="mini"></el-input>
        </el-form-item>
        <el-form-item
          label="抓取页数"
          prop="searchPages"
          :rules="[
                    { required: true, message: '请选择抓取页数', trigger: ['blur', 'change'] }
                ]"
        >
          <el-select v-model="ruleForm.searchPages" placeholder="请选择" size="mini">
            <el-option v-for="index in 10" :key="index" :label="index" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="监控周期"
          prop="daterange"
          :rules="[
                    { required: true, message: '请输入监控周期', trigger: ['blur', 'change'] }
                ]"
        >
          <el-date-picker
            v-model="ruleForm.daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions1"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="监控频率" prop="frequency" class="form-item-frequency">
          <div class="flex">
            <el-input v-model.trim="ruleForm.frequency" placeholder="请输入正整数" size="mini"></el-input>
            <div style="width: 50px">分钟</div>
          </div>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="monitorOptions" :events="monitorEvents" class="monitor-dialog">
      <el-form size="small" :model="ruleMonitorForm" :rules="rules" ref="ruleMonitorForm" label-width="72px">
        <el-form-item
          label="抓取页数"
          prop="searchPages"
          :rules="[
                    { required: true, message: '请选择抓取页数', trigger: ['blur', 'change'] }
                ]"
        >
          <el-select v-model="ruleMonitorForm.searchPages" placeholder="请选择" size="mini">
            <el-option v-for="index in 10" :key="index" :label="index" :value="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="监控周期"
          prop="daterange"
          :rules="[
                    { required: true, message: '请输入监控周期', trigger: ['blur', 'change'] }
                ]"
        >
          <el-date-picker
            v-model="ruleMonitorForm.daterange"
            :picker-options="rangepickerOptions"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="mini"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="监控频率" prop="frequency" class="form-item-frequency">
          <div class="flex">
            <el-input v-model.trim="ruleMonitorForm.frequency" placeholder="请输入正整数" size="mini"></el-input>
            <span style="font-size:12px;width:50px">分钟</span>
          </div>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
  <router-view v-else></router-view>
</template>
<script>
const _ = require('lodash')
import { checkWords } from '../KeyLexicon/utils'
export default {
  props: ['page'],
  data() {
    let numReg = /^[1-9]\d*$/
    let checkFrequency = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入监控周期'))
      } else {
        if (!numReg.test(value)) {
          return callback(new Error('请输入正整数'))
        }
        if (value < 10 || value > 1440) {
          return callback(new Error('请输入10至1440'))
        }
        callback()
      }
    }
    return {
      rangepickerOptions: {
        disabledDate(time) {
          return time.getTime() < (Date.now() - 24 * 3600 * 1000)
        }
      },
      pickerOptions: {
        shortcuts: [
          {
            text: '今日',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '7天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '30天',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      tableList: [
        ['keyword', '关键词', 120],
        ['status', '抓取状态', 80],
        ['monitorFlag', '监控状态', 80],
        ['frequency', '监控频率', 80],
        ['searchPages', '抓取页数', 80],
        ['createTime', '创建时间', 135],
        ['monitorFrom', '监控开始时间', 100],
        ['monitorTo', '监控结束时间', 100]
      ],
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,

      listQuery: {
        daterange: [],
        pageSize: 10,
        pageNumber: 1,
        platformId: null,
        siteId: null,
        sellerId: null,
        keyword: null,
        taskFlag: null,
        monitorFlag: 'all',
        startTime: null,
        endTime: null
      },
      options: {
        visible: false,
        width: '500px',
        title: '添加任务',
        okBtnText: '确认'
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 24 * 3600 * 1000
        }
      },
      events: {
        handleOkClick: () => {
          this.submitForm('ruleForm')
        }
      },
      ruleForm: {
        daterange: [],
        platformId: null,
        siteId: null,
        keywords: null,
        searchPages: null,
        taskFlag: null,
        monitorFlag: 1,
        frequency: null,
        monitorFrom: null,
        monitorTo: null
      },
      rules: {
        keywords: [{ required: true, validator: checkWords, trigger: 'blur' }],
        frequency: [
          { required: true, validator: checkFrequency, trigger: 'blur' }
        ]
      },
      monitorOptions: {
        visible: false,
        width: '500px',
        title: '添加监控',
        okBtnText: '确认'
      },
      monitorEvents: {
        handleOkClick: () => {
          this.submitMonitorForm('ruleMonitorForm')
        }
      },
      ruleMonitorForm: {
        daterange: [],
        taskIds: null,
        searchPages: null,
        frequency: null,
        monitorFrom: null,
        monitorTo: null,
        taskFlag: null
      },
      multipleSelection: []
    }
  },
  created() {
    this.ruleForm.platformId = this.platformId
    this.listQuery.platformId = this.platformId
    this.getInitParams()
  },
  // updated(){
  //   this.ruleForm.platformId=this.platformId;
  //   this.listQuery.platformId=this.platformId;
  // },
  watch: {
    // 刷新的时候执行
    sellerData() {
      this.getInitParams()
    }
  },
  methods: {
    getInitParams() {
      if (this.sellerId && this.siteId) {
        this.listQuery.siteId = this.siteId
        this.listQuery.sellerId = this.sellerId
        this.ruleForm.siteId = this.siteId
        this.ruleForm.sellerId = this.sellerId
        if (this.page === 'ad') {
          this.listQuery.taskFlag = 0
        } else {
          this.listQuery.taskFlag = 1
        }
        this.getList()
      }
    },
    distribute(btn) {
      switch (btn) {
        case '确认搜索':
          this.handleFilter()
          break
        case '重置搜索':
          this.resetListQueryForm()
          break
        case '添加任务':
          this.showDialog(null)
          break
        case '删除':
          this.deleteRows(null)
          break
        case '添加监控':
          this.showMonitorDialog('add')
          break
        case '修改监控周期':
          this.showMonitorDialog('edit')
          break
        case '取消监控':
          this.cancelMonitor()
          break
      }
      // '添加监控','修改监控周期'
    },
    getList() {
      this.listLoading = true
      let keyword = this.listQuery.keyword
      if (keyword !== null) {
        let flag = _.isEmpty(keyword.replace(/(^\s+)|(\s+$)/g, ''))
        if (flag) {
          this.listQuery.keyword = null
        }
      }
      let daterange = this.listQuery.daterange
      if (daterange !== null && daterange.length === 2) {
        this.listQuery.startTime = daterange[0]
        this.listQuery.endTime = daterange[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      let listQuery = _.cloneDeep(this.listQuery)
      if (listQuery.monitorFlag === 'all') {
        listQuery.monitorFlag = null
      }
      delete listQuery.daterange
      this.$api['keywordRankFqList'](listQuery)
        .then(res => {
          let { rows, total } = res
          this.handleData(rows)
          this.total = total
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
        .catch(() => {
          this.listLoading = false
        })
    },
    handleData(rows) {
      console.log('6+66666rerrrrrrrrrrrrr')
      console.log(this.listQuery.monitorFlag)
      rows.forEach(element => {
        let monitorFlag = element.monitorFlag
        element.monitorFlagNum = monitorFlag
        switch (monitorFlag) {
          case 0:
            element.monitorFlag = '关闭'
            break
          case 1:
            element.monitorFlag = '开启'
            break
          default:
            element.monitorFlag = '其它'
        }
        let status = element.status
        element.statusNum = status
        switch (status) {
          case 0:
            element.status = '待处理'
            break
          case 1:
            element.status = '抓取中'
            break
          case 2:
            element.status = '抓取成功'
            break
          case 3:
            element.status = '抓取失败'
            break
          default:
            element.status = '抓取失败'
        }
        if (monitorFlag === 0) {
          element.frequency = '-'
        }
        if (element.monitorFrom === null) {
          element.monitorFrom = '-'
        }
        if (element.monitorTo === null) {
          element.monitorTo = '-'
        }
      })
      this.list = rows
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
    resetListQueryForm() {
      this.listQuery.keyword = null
      this.listQuery.monitorFlag = 'all'
      this.listQuery.daterange = []
      this.$refs.listQueryForm.resetFields()
      this.getList()
    },

    showDialog(row) {
      // 只有新增
      this.options.title = '添加任务'
      this.options.visible = true
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      }
      this.ruleForm.taskFlag = this.listQuery.taskFlag
    },
    submitForm() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let daterange = this.ruleForm.daterange
          this.ruleForm.monitorFrom = daterange[0]
          this.ruleForm.monitorTo = daterange[1]
          let paramMap = _.cloneDeep(this.ruleForm)
          paramMap.frequency = parseInt(paramMap.frequency)
          paramMap.keywords = _.compact(this.ruleForm.keywords.split('\n'))
          paramMap.keywords = _.uniq(paramMap.keywords)
          delete paramMap.daterange
          this.$api['keywordRankFqSave'](paramMap)
            .then(data => {
              this.options.visible = false
              this.getList()
            })
            .catch(() => {
              //   this.options.visible = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    checkRows() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('至少选一项')
        return false
      }
      return true
    },
    deleteRows(id) {
      let params = {
        taskFlag: this.listQuery.taskFlag
      }
      if (id === null) {
        let multipleSelection = this.multipleSelection
        let ids = []
        if (!this.checkRows()) {
          return
        }
        multipleSelection.forEach(element => {
          ids.push(element.taskId)
        })
        params.taskIds = ids
      } else {
        params.taskIds = [id]
      }

      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api['keywordRankFqRemove'](params).then(res => {
          let { code } = res
          if (code === 0) {
            this.handleFilter()
          }
        })
      })
    },
    showMonitorDialog(flag) {
      if (flag === 'add' || flag === 'edit') {
        if (!this.checkRows()) {
          return
        }
      }

      this.monitorOptions.visible = true
      if (this.$refs['ruleMonitorForm'] !== undefined) {
        this.$refs['ruleMonitorForm'].resetFields()
        this.ruleMonitorForm = {
          daterange: [],
          taskIds: null,
          frequency: null,
          monitorFrom: null,
          monitorTo: null,
          taskFlag: null
        }
      }

      if (flag === 'add' || flag === 'edit') {
        let taskIds = []
        this.multipleSelection.forEach(element => {
          taskIds.push(element.taskId)
        })
        this.ruleMonitorForm.taskIds = taskIds
      }

      this.ruleMonitorForm.taskFlag = this.listQuery.taskFlag

      if (flag === 'add') {
        //新增
        this.monitorOptions.title = '添加监控'
      } else if (flag === 'edit') {
        this.monitorOptions.title = '修改监控' // 批量
      } else {
        let row = flag
        console.log(flag);
        this.monitorOptions.title = '修改监控'
        this.ruleMonitorForm.taskIds = [row.taskId]
        if (  (row.monitorFrom === null && row.monitorTo === null) || (row.monitorFrom === '-' && row.monitorTo === '-')) {
          this.ruleMonitorForm.daterange = []
          console.log(this.ruleMonitorForm.daterange );
        } else {
          this.ruleMonitorForm.daterange = [row.monitorFrom, row.monitorTo]
        }
        this.ruleMonitorForm.searchPages = row.searchPages
        this.ruleMonitorForm.frequency = row.frequency
      }
    },
    submitMonitorForm(form) {
      this.$refs[form].validate(valid => {
        if (valid) {
          let paramMap = _.cloneDeep(this.ruleMonitorForm)
          let daterange = paramMap.daterange
          paramMap.monitorFrom = daterange[0]
          paramMap.monitorTo = daterange[1]
          paramMap.frequency = parseInt(paramMap.frequency)
          delete paramMap.daterange
          let apiName = 'keywordRankFqUpdateMonitor'
          if (this.monitorOptions.title === '添加监控') {
            apiName = 'keywordRankFqAddMonitor'
          } else {
            paramMap.searchPages = 1
          }
          this.$api[apiName](paramMap)
            .then(data => {
              this.monitorOptions.visible = false
              this.getList()
            })
            .catch(() => {
              this.monitorOptions.visible = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancelMonitor() {
      if (!this.checkRows()) {
        return
      }
      let taskIds = []
      this.multipleSelection.forEach(element => {
        taskIds.push(element.taskId)
      })
      let params = {
        taskIds,
        taskFlag: this.listQuery.taskFlag
      }
      this.$api['keywordRankFqRemoveMonitor'](params).then(data => {
        let { code } = data
        if (code === 0) {
          this.getList()
        }
      })
    },
    reCrawl(row) {
      this.$api['keywordRankFqReCrawl']({
        taskId: row.taskId,
        taskFlag: parseInt(this.listQuery.taskFlag)
      }).then(data => {
        let { code } = data
        if (code === 0) {
          this.getList()
        }
      })
    },
    viewDetails(row) {
      this.$router.push({
        name: this.page === 'ad' ? 'adChart' : 'normalChart',
        query: {
          taskFlag: this.listQuery.taskFlag,
          taskId: row.taskId,
          createTime: row.createTime.substring(0, 10)
          // createTime:row.createTime
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
  // border: 1px solid @borderColor;
  // padding: 10px;
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
    //    min-width: 680px;
    padding: 15px 15px 0 15px;
    border-left: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
    border-bottom: 1px solid @borderColor;
    //    display: flex;
    // //    justify-content: center;
    //    align-items: center;
    // //    align-self: center;
    // .el-form--inline{
    //     height: 40px;
    // }
    .el-form-item__content {
      .el-input {
        width: 150px;
      }

      //联调时修改
      .select-monitor-flag {
        width: 100px;
      }
      .data-type {
        width: 70px;
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
    // .el-button-group {
    //     &:first-of-type {
    //         margin-right: 10px;
    //     }
    // }
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
  /deep/.el-dialog__body {
    padding-bottom: 0;
  }
  .add-dialog {
    .el-textarea,
    .el-select {
      width: 100%;
    }
    .el-range-editor {
      width: 100%;
      /deep/.el-range-separator {
        width: 20px;
      }
    }
    .form-item-frequency {
      .el-input {
        width: 100%;
        margin-right: 5px;
      }
    }
  }
  .monitor-dialog {
    .el-range-editor {
      width: 100%;
      /deep/.el-range-separator {
        width: 20px;
      }
    }
    .el-select {
      width: 100%;
    }
    .form-item-frequency {
      .el-input {
        width: 100%;
        margin-right: 5px;
      }
    }
  }
}
</style>


