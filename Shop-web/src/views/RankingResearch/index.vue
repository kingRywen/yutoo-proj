<template>
  <div class="box" v-if="$route.name === 'rankingResearchIndex'">
    <y-template>
      <!-- <div slot="ScreenTip">
                    <span>筛选条件</span>
                    <span></span>
      </div>-->
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <el-form-item prop="keyword">
          <el-input v-model.trim="listQuery.keyword" placeholder="关键词" size="small" clearable style='width:193px;'></el-input>
        </el-form-item>
        <el-form-item prop="monitorFlag">
          <el-select v-model="listQuery.monitorFlag" placeholder="监控状态" size="small" clearable style='width:193px;'>
            <el-option
              v-for="item in [{value:0,label:'关闭'},{value:1,label:'开启'}]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="listQuery.status" placeholder="抓取状态" size="small" clearable style='width:193px;'>
            <el-option
              v-for="item in [
                                    {value:1,label:'抓取中'},
                                    {value:2,label:'抓取成功'},
                                    {value:3,label:'抓取失败'},
                                ]"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="添加时间" prop="daterange">
          <el-date-picker
            v-model="listQuery.daterange"
            type="daterange"
            style='width:193px;'
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            size="small"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            :loading="item === '搜索' ? listLoading : false"
            :disabled="item !== '搜索' ? listLoading : false"
            :plain="item === '搜索' ? false : true"
            v-for="item in ['搜索', '重置搜索']"
            @click="distribute(item)"
          >{{item}}</el-button>
        </el-form-item>
      </el-form>
      <div slot="HandleBtn">
        <el-button
          type="primary"
          plain
          size="small"
          v-for="item in ['添加任务','停止监控','添加监控','修改监控周期','删除']"
          @click="distribute(item)"
        >{{item}}</el-button>
      </div>
      <el-table
        slot="table"
        :data="list"
        v-loading="listLoading"
        :key="tableKey"
        style="width: 100%"
        border
        stripe
        tooltip-effect="light"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="关键词" prop="keyword" min-width="120" show-overflow-tooltip></el-table-column>
        <el-table-column prop="searchPages" label="抓取页数" width="90"></el-table-column>
        <el-table-column prop="reviewCnt" label="监控状态" width="90">
          <template slot-scope="scope">
            <div v-if="scope.row.monitorFlag==0">关闭</div>
            <div v-else-if="scope.row.monitorFlag==1">开启</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="监控周期" min-width="160">
          <template slot-scope="scope">
            <div v-if="scope.row.monitorFrom&&scope.row.monitorTo">{{scope.row.monitorFrom}}~{{scope.row.monitorTo}}</div>
            <div v-else-if="scope.row.monitorTo&&!scope.row.monitorTo">{{scope.row.monitorFrom}}~</div>
            <div v-else-if="!scope.row.monitorTo&&scope.row.monitorTo">~{{scope.row.monitorTo}}</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="抓取频率" min-width="90">
          <template slot-scope="scope">
            <div v-if="scope.row.frequency">{{scope.row.frequency}}分</div>
            <div v-else>-</div>
          </template>
        </el-table-column>

        <el-table-column label="创建时间" prop="createTime" min-width="135"></el-table-column>
        <el-table-column label="抓取状态" width="110">
          <template slot-scope="scope">
            <div v-if="scope.row.status==0">待处理</div>
            <div v-else-if="scope.row.status==1">抓取中</div>
            <div v-else-if="scope.row.status==2">抓取成功</div>
            <div v-else-if="scope.row.status==3">抓取失败</div>
            <div v-else-if="scope.row.status==4">页面不存在</div>
            <div v-else-if="scope.row.status==5">大数据分析失败</div>
            <div v-else-if="scope.row.status==6">kafka连接异常</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="结果生成时间" prop="resultTime" min-width="135"></el-table-column>
        <el-table-column label="操作" width="90">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==2"
              type="text"
              size="small"
              icon="el-icon-search"
              @click="viewTabs(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        slot="pagination"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="listQuery.pageNumber"
        :page-sizes="[10,20,30, 50]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </y-template>

    <yt-dialog :options="options" :events="events" class="add-dialog">
      <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="70px">
        <el-form-item label="关键词" prop="keywords">
          <el-input type="textarea" v-model.trim="ruleForm.keywords" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" :rows="5" size="small"></el-input>
        </el-form-item>
        <el-form-item
          label="抓取页数"
          prop="searchPages"
          :rules="[
                    { required: true, message: '请选择抓取页数', trigger: ['blur', 'change'] }
                ]"
        >
          <el-select v-model="ruleForm.searchPages" placeholder="请选择" size="small">
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
            size="small"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="抓取频率" prop="frequency" class="form-item-frequency">
          <div class="flex">
            <el-input v-model.trim="ruleForm.frequency" placeholder="请输入正整数" size="small"></el-input>
            <span style="width:50px">分钟</span>
          </div>
        </el-form-item>
      </el-form>
    </yt-dialog>

    <yt-dialog :options="monitorOptions" :events="monitorEvents" class="monitor-dialog">
      <el-form
        size="small"
        :model="ruleMonitorForm"
        :rules="rules"
        ref="ruleMonitorForm"
        label-width="130px"
      >
        <el-form-item
          label="抓取页数"
          prop="searchPages"
          :rules="[
                    { required: true, message: '请选择抓取页数', trigger: ['blur', 'change'] }
                ]"
        >
          <el-select v-model="ruleMonitorForm.searchPages" placeholder="请选择" size="small">
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
            type="daterange"
            style='width:240px;'
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptions"
          ></el-date-picker>
        </el-form-item>

        <el-form-item label="抓取频率" prop="frequency" class="form-item-frequency">
          <div class="flex">
            <el-input v-model.trim="ruleMonitorForm.frequency" placeholder="请输入正整数" size="small"></el-input>
            <span style='display:inline-block;width:114px;'>分钟</span>
          </div>
        </el-form-item>
      </el-form>
    </yt-dialog>
  </div>
  <router-view v-else></router-view>
</template>
<script>
import YTemplate from '../Common/y-template/index'
import Navigation from '../Common/y-template/navigation'
const _ = require('lodash')
import { checkWords } from '../KeyLexicon/utils'
export default {
  components: {
    YTemplate,
    Navigation
  },
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
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7
        }
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        platformId: null,
        siteId: null,
        sellerId: null,
        keyword: null,
        monitorFlag: null,
        status: null,
        startTime: null,
        endTime: null,
        daterange: null
      },
      options: {
        visible: false,
        width: '500px',
        title: '添加任务',
        okBtnText: '确认'
      },
      events: {
        handleOkClick: () => {
          this.submitForm()
        }
      },
      ruleForm: {
        daterange: [],
        platformId: null,
        siteId: null,
        sellerId: null,
        keywords: null,
        searchPages: null,
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
    this.listQuery.platformId = this.platformId
    this.ruleForm.platformId = this.platformId
    this.initPage()
  },
  watch: {
    sellerData() {
      this.initPage()
    }
  },
  methods: {
    distribute(btn) {
      switch (btn) {
        case '搜索':
          this.handleFilter()
          break
        case '重置搜索':
          this.resetListQueryForm()
          break
        case '添加任务':
          this.showDialog()
          break
        case '停止监控':
          this.cancelMonitor()
          break
        case '添加监控':
          this.showMonitorDialog('add')
          break
        case '修改监控周期':
          this.showMonitorDialog('edit')
          break
        case '删除':
          this.deleteRows(null)
          break
      }
    },

    resetListQueryForm() {
      this.listQuery.keyword = null
      this.listQuery.monitorFlag = ''
      this.listQuery.status = null
      this.listQuery.daterange = []
      this.$refs.listQueryForm.resetFields()
      this.getList()
    },
    initPage() {
      if (this.sellerId && this.siteId) {
        this.listQuery.siteId = this.siteId
        this.listQuery.sellerId = this.sellerId

        this.ruleForm.siteId = this.siteId
        this.ruleForm.sellerId = this.sellerId

        this.getList()
      }
    },
    getList() {
      this.listLoading = true
      let daterange = this.listQuery.daterange
      if (daterange !== null && daterange.length === 2) {
        this.listQuery.startTime = daterange[0]
        this.listQuery.endTime = daterange[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      let listQuery = _.cloneDeep(this.listQuery)
      delete listQuery.daterange
      this.$api['taskKrResearchList'](listQuery)
        .then(res => {
          let { rows, total } = res
          this.list = rows
          this.total = total
          setTimeout(() => {
            this.listLoading = false
          }, 500)
        })
        .catch(() => {
          this.listLoading = false
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
    checkRows() {
      if (this.multipleSelection.length === 0) {
        this.$message.warning('至少选一项')
        return false
      }
      return true
    },
    showDialog() {
      this.options.visible = true
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      }
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
          this.$api['taskKrResearchSave'](paramMap)
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
    cancelMonitor() {
      if (!this.checkRows()) {
        return
      }
      let taskIds = []
      this.multipleSelection.forEach(element => {
        taskIds.push(element.taskId)
      })

      this.$api['taskKrResearchRemoveMonitor']({ taskIds }).then(data => {
        let { code } = data
        if (code === 0) {
          this.getList()
        }
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
          let apiName = 'taskKrResearchUpdateMonitor'
          if (this.monitorOptions.title === '添加监控') {
            apiName = 'taskKrResearchAddMonitor'
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
    deleteRows(id) {
      let taskIds = []
      if (id === null) {
        let multipleSelection = this.multipleSelection
        if (!this.checkRows()) {
          return
        }
        multipleSelection.forEach(element => {
          taskIds.push(element.taskId)
        })
      } else {
        taskIds = [id]
      }

      this.$confirm('此操作将删除数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$api['taskKrResearchRemove']({ taskIds }).then(res => {
          let { code } = res
          if (code === 0) {
            this.handleFilter()
          }
        })
      })
    },
    viewTabs(row) {
      if (!row.taskId) {
        this.$message.warning('taskId为空')
        return
      }
      this.$router.push({
        name: 'rankingResearchTabs',
        query: {
          taskId: row.taskId,
          createTime: row.createTime, // 设置时间置灰
          updateTime: row.updateTime
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  .el-form-item__content {
    .el-input {
      width: 150px;
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
        width: 116%;
        margin-right: 5px;
      }
    }
  }
  .monitor-dialog {
    .el-range-editor {
      //width: 100%;
      /deep/.el-range-separator {
        width: 20px;
      }
    }
    .el-select {
      width: 76%;
    }
    .form-item-frequency {
      .el-input {
        width: 116%;
        margin-right: 5px;
      }
    }
  }
}
</style>
