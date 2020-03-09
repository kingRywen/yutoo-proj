<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>通用字典</span>
          </div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
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
            :data="type1"
            tooltip-effect="dark"
            fit
            @selection-change="handleSelectionChange">
            <el-table-column
              type="expand"
              >
            </el-table-column>
            <el-table-column
              label="编号"
              >
              <template slot-scope="scope">{{ scope.row.menuId }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="名称"
              >
            </el-table-column>
            <el-table-column
              label="上级菜单"
              prop="parentName"
              >
            </el-table-column>
            <el-table-column
              prop="orderNum"
              label="排序"
              width="120">
            </el-table-column>
            <el-table-column
              label="菜单URL"
              prop="url"
              width="120">
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
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
      this.$axios.get('/sys/menu/list').then(res => {
        console.log(res)
        this.data = res.data
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
</style>
