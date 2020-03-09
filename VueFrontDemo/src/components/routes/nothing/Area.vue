<template>
  <div>
    <el-row :gutter="20">
      <el-col :xs="24" :sm="6" :md="6" :lg="4" :xl="4"><div class="grid-content bg-purple">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>区域目录</span>
          </div>
          <el-tree :data="data" :props="defaultProps" @node-click="handleNodeClick"></el-tree>
        </el-card>
      </div></el-col>
      <el-col :xs="24" :sm="18" :md="18" :lg="20" :xl="20"><div class="grid-content bg-purple-light">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>区域信息</span>
          </div>
          <el-form :inline="true" :model="formInline" class="demo-form-inline">
            <div>
              <el-form-item label="">
                <el-input v-model="formInline.search" placeholder="查询关键字"></el-input>
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

          <el-table
            ref="multipleTable"
            :data="data"
            tooltip-effect="dark"
            fit
            @selection-change="handleSelectionChange">
            <el-table-column
              type="selection"
              >
            </el-table-column>
            <el-table-column
              label="编号"
              >
              <template slot-scope="scope">{{ scope.row.areaId }}</template>
            </el-table-column>
            <el-table-column
              prop="areaCode"
              label="区域代码"
              >
            </el-table-column>
            <el-table-column
              prop="name"
              label="区域名称"
              >
            </el-table-column>
            <el-table-column
              label="层级"
              >
              <template slot-scope="scope">{{ scope.row.layer == 1 ? '省级' : '其它级' }}</template>
            </el-table-column>
            <el-table-column
              prop="orderNum"
              label="排序"
              width="120">
            </el-table-column>
            <el-table-column
              label="可用"
              width="120">
              <template slot-scope="scope">
                <el-switch v-model="valueY"
                  disabled>
                </el-switch>
              </template>
            </el-table-column>
            <el-table-column
              prop="remark"
              label="备注"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
        </el-card>
      </div></el-col>
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
// import ComDialog from './common/ComDialog'
export default {
  name: 'Area',
  components: {
    'ComDialog': () => import('../../common/ComDialog')
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
    handleNodeClick () {
      console.log('click')
    },
    onAdd () {
      this.dialogVisible = true
    },
    onSubmit () {
      console.log('submit!')
    },
    cancel () {
      this.dialogVisible = false
    },
    getData () {
      // function getData1() {
      //   return this.$axios.get('/sys/area/select', {
      //     params: {
      //       areaCode: 0
      //     }
      //   })
      // }
      // function getData2() {
      //   return this.$axios.get('/sys/area/select', {
      //     params: {
      //       areaCode: 0
      //     }
      //   })
      // }
      this.$axios.get('/sys/area/select', {
        params: {
          areaCode: 0
        }
      }).then(res => {
        console.log(res)
        this.data = res.data
      })
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
    cityData () {
      return this.data.map((el) => el.name)
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
