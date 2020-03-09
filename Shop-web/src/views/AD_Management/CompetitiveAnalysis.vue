<template>
  <div class="box" v-if="$route.name === 'CompetitiveAnalysis'">
    <y-template>
      <!-- <div slot="ScreenTip">
                <span>筛选条件</span>
                <span></span>
      </div>-->
      <el-form size="small" :inline="true" :model="listQuery" ref="listQueryForm" slot="ScreenInfo">
        <el-form-item label="关键词" prop="keyword">
          <el-input v-model.trim="listQuery.keyword" placeholder="请输入" size="small" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="listQuery.status" placeholder="请选择" size="small" class="select-status" clearable style='width:160px;'>
            <el-option
              :label="item[0]"
              :value="item[1]"
              v-for="item in [['抓取中','1'],['抓取成功','2'],['抓取失败','3']]"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <el-date-picker
            v-model="daterange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            :picker-options="pickerOptions"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button
            size="small"
            type="primary"
            :icon="item === '搜索' ? 'el-icon-search' : ''"
            :plain="item !== '搜索'"
            v-for="item in ['搜索','重置搜索']"
            :loading="listLoading"
            @click="distribute(item)"
          >{{item}}</el-button>
        </el-form-item>
      </el-form>

      <div slot="HandleBtn">
        <el-button
          type="primary"
          plain
          :loading="item.loading"
          size="small"
          v-for="(item,index) in  HandleBtns"
          @click="distribute(item.name,index)"
        >{{item.name}}</el-button>
      </div>
      <el-table
        slot="table"
        :data="list"
        v-loading="listLoading"
        :key="tableKey"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
        @sort-change="sortChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="keyword" label="关键词" min-width="120">
          <template slot-scope="scope">
              <el-tooltip :content="scope.row.keyword" placement="top" effect="light">
                <span  class="fix__row_1">{{scope.row.keyword}}</span>
              </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column prop="adProductCnt" label="广告产品数量" min-width="140" sortable="custom"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" min-width="160"></el-table-column>
        <el-table-column label="监控状态" min-width="100">
          <template slot-scope="scope">
            <div v-if="scope.row.monitorFlag==0">关闭</div>
            <div v-else-if="scope.row.monitorFlag==1">开启</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="监控周期" min-width="160">
          <template slot-scope="scope">
            <div
              v-if="scope.row.monitorFrom!==null&&scope.row.monitorTo!==null"
            >{{scope.row.monitorFrom}}~{{scope.row.monitorTo}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="frequency" label="监控频率" min-width="100">
          <template slot-scope="scope">
            <div class="frequency-min-h-d" v-if="scope.row.frequency!==null&&scope.row.unit!==null">
              <div>{{scope.row.frequency}}</div>
              <div v-if="scope.row.unit=='min'" class="min-h-d">分钟</div>
              <div v-else-if="scope.row.unit=='h'" class="min-h-d">小时</div>
              <div v-else-if="scope.row.unit=='d'" class="min-h-d">天</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" min-width="80">
          <template slot-scope="scope">
            <div v-if="scope.row.status==0">待处理</div>
            <div v-else-if="scope.row.status==1">抓取中</div>
            <div v-else-if="scope.row.status==2">抓取成功</div>
            <div v-else-if="scope.row.status==3">抓取失败</div>
            <div v-else>-</div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==2"
              type="text"
              size="small"
              icon="el-icon-search"
              @click="viewDetails(scope.row)"
            ></el-button>
             <el-button
              type="text"
              size="small"
              icon="el-icon-edit"
              @click="eidtTask(scope.row)"
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
        :page-sizes="[10,20,30,50,1000]"
        :page-size="listQuery.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </y-template>

    <!-- 添加关键词 -->
    <yt-dialog :options="options" :events="events" class="add-dialog">
      <el-form size="small" :model="ruleForm" :rules="rules" ref="ruleForm" label-width="80px">
        <el-form-item label="关键词" prop="keywords">
          <el-input type="textarea" v-model.trim="ruleForm.keywords" placeholder="请输入关键词,多个关键词换行输入,注意:只能输入字母、数字、单引号" :rows="5" size="small" @blur='getSkus'></el-input>
        </el-form-item>
        <el-form-item
            label="SKU"
            prop="parentAsins"
            :rules="[
                        { required: true, message: '请选择SKU', trigger: ['blur','change'] }
                    ]"
          >
            <el-select v-model="ruleForm.parentAsins" placeholder="请先填写关键词,再做选择" size="small" class="input-frequency" multiple clearable collapse-tags>
              <el-option
                v-for="item in skuOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
        </el-form-item>
        <div class="flex">
          <el-form-item
            class="mr10"
            label="监控频率"
            prop="frequency"
            :rules="[
                        { required: true, message: '请输入监控频率', trigger: ['blur'] },
                        { type:'number', message: '请输入数字', trigger: ['blur','change'] }
                    ]"
          >
            <el-input v-model.number="ruleForm.frequency" placeholder="请输入" size="small" class="input-frequency"></el-input>
          </el-form-item>
          <el-form-item
            label-width="0"
            prop="unit"
            :rules="[
                    { required: true, message: '请选择时间类型', trigger: ['blur', 'change'] }
                ]"
          >
            <el-select v-model="ruleForm.unit" placeholder="请选择" size="small" class="select-unit">
              <el-option label="分钟" value="min"></el-option>
              <el-option label="小时" value="h"></el-option>
              <el-option label="天" value="d"></el-option>
            </el-select>
          </el-form-item>
        </div>
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
            :picker-options="pickerdisabledDate"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </yt-dialog>
    <!-- 添加结束 -->
    <!-- 监控评率 -->
    <yt-dialog :options="monitorOptions" :events="monitorEvents" class="monitor-dialog">
      <el-form size="small" :model="ruleMonitorForm" :rules="rules" ref="ruleFormMonitor" label-width="85px">
        <div class="flex">
          <el-form-item
            class="mr10"
            label="监控频率"
            prop="frequency"
            :rules="[
                        { required: true, message: '请输入监控频率', trigger: ['blur'] }
                    ]"
          >
            <el-input v-model.trim="ruleMonitorForm.frequency" placeholder="请输入" size="small" class="input-frequency"></el-input>
          </el-form-item>

          <el-form-item
            label-width="0"
            prop="unit"
            :rules="[
                    { required: true, message: '请选择时间类型', trigger: ['blur', 'change'] }
                ]"
          >
            <el-select v-model="ruleMonitorForm.unit" placeholder="请选择" size="small" class="select-unit">
              <el-option label="分钟" value="min"></el-option>
              <el-option label="小时" value="h"></el-option>
              <el-option label="天" value="d"></el-option>
            </el-select>
          </el-form-item>
        </div>
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
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            size="small"
            value-format="yyyy-MM-dd"
            :picker-options="pickerdisabledDate"
          ></el-date-picker>
        </el-form-item>
      </el-form>
    </yt-dialog>
      <!-- 监控评率结束 -->
  </div>
  <router-view v-else></router-view>
</template>
<script>
const _ = require('lodash')
import { checkWords } from '../KeyLexicon/utils'
import YTemplate from '../Common/y-template/index'
import Navigation from '../Common/y-template/navigation'
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
        if (value < 10 || value > 14440) {
          return callback(new Error('请输入10至14440'))
        }
        callback()
      }
    }
    return {
      HandleBtns:[
        {name:'添加关键词',loading:false},
        {name:'添加监控',loading:false},
        {name:'关闭监控',loading:false},
        {name:'修改监控周期',loading:false},
        {name:'删除',loading:false}
      ],
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
      pickerdisabledDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24
        }
      },
      tableKey: 0,
      list: null,
      total: null,
      listLoading: false,
      daterange: [],
      listQuery: {
        pageSize: 10,
        pageNumber: 1,
        platformId: null,
        siteId: null,
        sellerId: null,
        keyword: null,
        status: null,
        startTime: null,
        endTime: null
      },
      options: {
        visible: false,
        width: '500px',
        title: '添加',
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
        sellerId: null,
        siteId: null,
        keywords: null,
        monitorFlag: 0,
        monitorFrom: 1,
        monitorTo: null,
        frequency: null,
        unit: null,
        parentAsins:[]
      },
      skuOptions:[],
      isAlter:false,//是否修改任务
      monitorOptions: {
        visible: false,
        width: '500px',
        title: '添加',
        okBtnText: '确认'
      },
      monitorEvents: {
        handleOkClick: () => {
          this.submitMonitorForm()
        }
      },
      isMonitorAdd: true,
      ruleMonitorForm: {
        daterange: [],
        taskIds: null,
        monitorFlag: 1,
        monitorFrom: null,
        monitorTo: null,
        frequency: null,
        unit: null
      },

      rules: {
        keywords: [{ required: true, validator: checkWords, trigger: 'blur' }],
        frequency: [
          { required: true, validator: checkFrequency, trigger: 'blur' }
        ]
      },
      multipleSelection: [] ,

      editTaskId:null,
    }
  },
  created() {
    this.ruleForm.platformId = this.platformId
    this.listQuery.platformId = this.platformId
    this.getInitParams()
  },

  watch: {
    // 刷新的时候执行
    sellerData() {
      this.getInitParams()
    }
  },
  methods: {
    eidtTask(row){
      console.log('object');
      console.log(row);
      this.editTaskId=row.taskId;
      this.isAlter=true;
      this.options.visible=true
      this.options.title='编辑'
      this.$nextTick(function(){
          this.$refs.ruleForm.resetFields()
          this.$refs.ruleForm.resetFields()
          this.ruleForm.keywords=row.keyword;
          this.ruleForm.frequency=row.frequency;
          this.ruleForm.unit=row.unit;
          //this.ruleForm.parentAsins=[row.parentAsins];
          // this.ruleForm.monitorFrom=row.monitorFrom;
          // this.ruleForm.monitorTo=row.monitorTo;
          this.ruleForm.daterange=[];
          this.pickerdisabledDate={
              disabledDate(time) {
                return time.getTime() < Date.now()- 3600 * 1000 * 24
              }
          }
          this.getSkus();
      })
    },
    getSkus(){
      let {sellerId,siteId}=this.sellerData;
      let keywords='';
      if( !this.ruleForm.keywords){
          return 
      }else{
          keywords = _.compact(this.ruleForm.keywords.split('\n'))
          keywords = _.uniq(keywords)
      }
      this.$api['taskAdCompetitionGetAdProductByKeyword'](
        {
          sellerId,
          siteId,
          keywords,
        }
      ) 
      .then(data => {
          //console.log(data);
          this.skuOptions=[];
          data.data.forEach(i=>[
            this.skuOptions.push({
              label:i.parentSku,
              value:i.parentAsin
            })
          ])
      }).catch(() => {})
    },
    //tabl表格排序改变
    sortChange(column, prop, order) {
      let tit = column.prop //排序的字段名
      let sort = column.order //排序顺序
      // console.log(tit);
      // console.log(sort);
      let v = this.sortableFunc(column, tit, sort)
      this.listQuery.sortField = v.sortField
      this.listQuery.sort = v.sort
      this.listQuery.pageNumber = 1
      this.getList()
    },
    //table排序参数处理
    sortableFunc(column, pro, order) {
      let prop = pro.replace(/[A-Z]/g, function(match) {
        return '_' + match.toLowerCase()
      })
      return {
        sort: order === 'ascending' ? 1 : 0,
        sortField: prop
      }
    },
    getInitParams() {
      if (this.sellerId && this.siteId) {
        this.listQuery.siteId = this.siteId
        this.listQuery.sellerId = this.sellerId
        this.ruleForm.siteId = this.siteId
        this.ruleForm.sellerId = this.sellerId
        this.getList()
      }
    },
    distribute(btn,index) {
      switch (btn) {
        case '搜索':
          this.handleFilter()
          break
        case '重置搜索':
          this.resetListQueryForm()
          break
        case '添加关键词':
          this.isAlter=false;
          this.showDialog(null)
          this.options.title='添加'
          this.pickerdisabledDate={
            disabledDate(time) {
              return time.getTime() < Date.now() - 3600 * 1000 * 24
            }
          }
          this.$nextTick(function(){
            this.$refs.ruleForm.resetFields();
            this.skuOptions=[];
          });
          break
        case '添加监控':
          this.showMonitorDialog(true)
          break
        case '关闭监控':
          this.cancelMonitor(index)
          break
        case '修改监控周期':
          this.showMonitorDialog(false)
          break
        case '删除':
          this.deleteRows(null,index)
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
      if (this.daterange !== null && this.daterange.length === 2) {
        this.listQuery.startTime = this.daterange[0]
        this.listQuery.endTime = this.daterange[1]
      } else {
        this.listQuery.startTime = null
        this.listQuery.endTime = null
      }
      let listQuery = _.cloneDeep(this.listQuery)

      this.$api['taskAdCompetitionList'](listQuery)
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
    resetListQueryForm() {
      this.daterange = []
      this.$refs.listQueryForm.resetFields()
      this.getList()
    },

    showDialog(row) {
      this.options.visible = true
      if (this.$refs['ruleForm'] !== undefined) {
        this.$refs['ruleForm'].resetFields()
      }
    },
    submitForm(type) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let daterange = this.ruleForm.daterange
          this.ruleForm.monitorFrom = daterange[0]
          this.ruleForm.monitorTo = daterange[1]
          let paramMap = _.cloneDeep(this.ruleForm)
          paramMap.frequency = parseInt(paramMap.frequency)
          paramMap.keywords = _.compact(this.ruleForm.keywords.split('\n'))
          paramMap.keywords = _.uniq(paramMap.keywords)
          delete paramMap.daterange;
          let url;
          if(this.isAlter){
              url='taskAdCompetitionUpdate'
              paramMap.taskId=this.editTaskId;
          }else{
              url='taskAdCompetitionSave'
          }
          this.$api[url](paramMap)
            .then(data => {
              this.options.visible = false
              this.getList()
            })
            .catch(() => {
              // this.options.visible = false;
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    showMonitorDialog(flag) {
      if (!this.checkRows()) {
        return
      }
      this.isMonitorAdd = flag
      this.monitorOptions.visible = true
      if (this.$refs['ruleFormMonitor'] !== undefined) {
        this.$refs['ruleFormMonitor'].resetFields()
        this.ruleMonitorForm.frequency = null
        this.ruleMonitorForm.unit = null
        this.ruleMonitorForm.daterange = []
      }
      if (flag) {
        this.monitorOptions.title = '添加'
        this.pickerdisabledDate={
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 1000 * 24
          }
        }
      } else {
        this.monitorOptions.title = '编辑'
        if (this.multipleSelection.length === 1) {
          let row = this.multipleSelection[0]
          this.ruleMonitorForm.frequency = row.frequency
          this.ruleMonitorForm.unit = row.unit
          // if (row.monitorFrom !== null && row.monitorTo !== null) {
            this.ruleMonitorForm.daterange = [];
            this.pickerdisabledDate={
              disabledDate(time) {
                return time.getTime() < Date.now()-24*3600*1000
              }
            }
          // }
        }
      }
    },
    submitMonitorForm() {
      this.$refs.ruleFormMonitor.validate(valid => {
        if (valid) {
          let apiName = 'taskAdCompetitionAddMonitor'
          if (!this.isMonitorAdd) {
            apiName = 'taskAdCompetitionUpdateMonitor'
          }
          let taskIds = []
          this.multipleSelection.forEach(element => {
            taskIds.push(element.taskId)
          })
          this.ruleMonitorForm.taskIds = taskIds
          let daterange = this.ruleMonitorForm.daterange
          this.ruleMonitorForm.monitorFrom = daterange[0]
          this.ruleMonitorForm.monitorTo = daterange[1]
          let paramMap = _.cloneDeep(this.ruleMonitorForm)
          delete paramMap.daterange
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
    deleteRows(id,index) {
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
        this.HandleBtns[index].loading = true;
        this.$api['taskAdCompetitionRemove']({ taskIds }).then(res => {
          let { code } = res
          if (code === 0) {
            this.HandleBtns[index].loading = false;
            this.handleFilter()
          }
        }).catch(err=>{
          this.HandleBtns[index].loading = false;
        })
      })
    },
    cancelMonitor(index) {
      if (!this.checkRows()) {
        return
      }
      this.$confirm('是否关闭选中项的监控？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let taskIds = []
          this.multipleSelection.forEach(element => {
            taskIds.push(element.taskId)
          })
          this.HandleBtns[index].loading = true;
          this.$api['taskAdCompetitionRemoveMonitor']({ taskIds }).then(
            data => {
              let { code } = data
              if (code === 0) {
                  this.HandleBtns[index].loading = false;
                this.getList()
              }
            }
          ).catch(err=>{
              this.HandleBtns[index].loading = false;
          })
        })
        .catch(() => {})
    },
    viewDetails(row) {
      if (row.taskId === null) {
        this.$message.warning('taskId为空')
        return
      }
      this.$router.push({
        name: 'ADManagementCA_details',
        query: {
          taskId: row.taskId
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  .template-box {
    .screen-info {
      .el-form-item__content {
        .el-input {
          width: 100%;
        }
        .select-status {
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
    //    .box-update-btn {

    //     }
    .box-data {
      .el-table__body-wrapper {
        .frequency-min-h-d {
          display: flex;
          .min-h-d {
            color: #fff;
            background-color: #cccccc;
            border: 1px solid #cccccc;
            border-radius: 3px;
            padding-left: 7px;
            padding-right: 7px;
            margin-left: 5px;
          }
        }
      }
    }
  }
  /deep/.el-dialog__body {
    padding-bottom: 0;
  }
  .add-dialog {
    .input-frequency,
    .select-unit {
      width: 100%;
    }
    .el-textarea {
      width: 100%;
    }
    .el-range-editor {
      width: 100%;
      /deep/.el-range-separator {
        width: 20px;
      }
    }
  }
  .monitor-dialog {
    .input-frequency,
    .select-unit {
      width: 100%;
    }
    .el-range-editor {
      width: 100%;
      /deep/.el-range-separator {
        width: 20px;
      }
    }
  }
  .cycle-dialog {
    .el-range-editor {
      width: 100%;
      /deep/.el-range-separator {
        width: 20px;
      }
    }
  }
}
</style>


