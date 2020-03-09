<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>系统日志</span>
          </div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <div>
              <el-form-item label="">
                <el-input v-model="formInline.search" placeholder="查询关键字"></el-input>
              </el-form-item>
              <el-form-item label="">
                <el-date-picker type="date" placeholder="选择日期" v-model="formInline.date1" style="width: 100%;"></el-date-picker>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="onAdd">查询</el-button>
              </el-form-item>
            </div>
            <el-form-item>
              <el-button type="default" @click="onAdd">刷新</el-button>
              <el-button type="success" @click="onAdd">新增</el-button>
              <el-button type="primary" @click="onAdd">编辑</el-button>
              <el-button type="danger" @click="onAdd">删除</el-button>
            </el-form-item>
          </el-form>
          <!-- 表格 -->
          <el-table
            ref="multipleTable"
            :data="data"
            tooltip-effect="dark"
            fit
            @selection-change="handleSelectionChange">
            <el-table-column
              type="expand"
              >
              <template slot-scope="props">
                <p>操作用户ID: {{ props.row.userId }}</p>
                <p>执行方法: {{ props.row.method }}</p>
                <p>请求参数: {{ props.row.params }}</p>
              </template>
            </el-table-column>
            <el-table-column
              label="编号"
              >
              <template slot-scope="scope">{{ scope.row.id }}</template>
            </el-table-column>
            <el-table-column
              prop="username"
              label="用户名"
              >
            </el-table-column>
            <el-table-column
              label="操作"
              prop="operation"
              >
            </el-table-column>
            <el-table-column
              prop="time"
              label="响应时间(ms)"
              width="120">
            </el-table-column>
            <el-table-column
              label="IP地址"
              prop="ip"
              width="120">
            </el-table-column>
            <el-table-column
              prop="gmtCreate"
              label="创建时间"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
    <ComDialog :dialogVisible='dialogVisible' title="新增区域" @cancelData='cancel'>
      <!-- 表单插入 -->
      <el-form ref="form" :model="sizeForm" label-width="80px" size="mini">
        <el-form-item label="区域代码">
          <el-input v-model="sizeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="区域名称">
          <el-input v-model="sizeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="上级区域">
          <el-input v-model="sizeForm.name"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-col :span="11">
            <el-date-picker type="date" placeholder="选择日期" v-model="sizeForm.date1" style="width: 100%;"></el-date-picker>
          </el-col>
          <el-col class="line" :span="2">-</el-col>
          <el-col :span="11">
            <el-time-picker type="fixed-time" placeholder="选择时间" v-model="sizeForm.date2" style="width: 100%;"></el-time-picker>
          </el-col>
        </el-form-item>
      </el-form>
    </ComDialog>
  </div>
</template>

<script>
import ComDialog from '../../common/ComDialog'
export default {
  name: 'Menu',
  components: {
    ComDialog
  },
  mounted () {
    this.getData()
  },
  data () {
    return {
      data: [],
      valueY: true,
      sizeForm: {},
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      formInline: {
        search: ''
      },
      tableData3: [],
      dialogVisible: false
    }
  },
  methods: {
    getData () {
      this.$axios.post('/sys/log/list', {
        endDate: '2018-04-10',
        pageNumber: 1,
        pageSize: 10,
        sortOrder: 'asc',
        startDate: '2018-04-09',
        username: 'admin'
      }).then(res => {
        if (res.data.code === 500) {
          this.open(res.data.msg)
          return
        }
        this.data = res.data.rows
      })
    },
    onAdd () {
      this.dialogVisible = true
    },
    cancel () {
      this.dialogVisible = false
    },
    toggleSelection (rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange (val) {
      this.multipleSelection = val
    },
    open (msg) {
      this.$message.error(msg)
    }
  },
  computed: {
    type1 () {
      return this.data.filter((el) => !el.parentName)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.demo-form-inline.el-form {
  display: flex;
  justify-content: space-between;
}
</style>
