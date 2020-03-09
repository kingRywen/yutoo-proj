<template>
  <div style="overflow: hidden;" v-loading="loading || exportLoading">
    <el-row :gutter="20">
      <template v-if="!myTemp">
        <el-col :span="12">
          <div class="title">所有字段</div>
          <el-table
            :row-key="rowKey"
            ref="table"
            border
            height="520px"
            size="mini"
            :data="allFields"
            @selection-change="handleSelectionChange"
            @row-click="handleRowClick"
          >
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" label="序号" type="index"></el-table-column>
            <el-table-column align="center" label="名称" prop="name"></el-table-column>
          </el-table>
        </el-col>
        <el-col :span="12">
          <keep-alive>
            <div v-if="currentTab" key="1">
              <div class="title">
                <div>已选中导出字段列表</div>
                <el-button class="btn" type="text" @click="handleToggle(false)">切换我的模板</el-button>
              </div>
              <div class="save-wrapper">
                <div class="name-wrapper">
                  <div class="name">模板名称</div>
                  <el-popover placement="top" width="200" v-model="popoverModel" trigger="manual">
                    <el-alert title="请输入模板名称" type="error" :closable="false" show-icon></el-alert>
                    <el-input size="mini" v-model="tempName" placeholder="输入模板名称" slot="reference"></el-input>
                  </el-popover>
                </div>
                <div>
                  <el-button size="mini" type="primary" @click="save(1)" :loading="saveLoading" round>保存模板</el-button>
                  <el-button size="mini" type="success" @click="save(2)" :loading="exportLoading" round>导出Excel</el-button>
                </div>
              </div>
              <el-table
                border
                height="470px"
                size="mini"
                :data="selectFields"
                :row-key="rowKey"
                :class="{'is-error-tb': showError}"
              >
                <el-table-column align="center" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="名称" prop="name"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button class="btn edit" type="text" @click="handleEdit('up', scope)">上移</el-button>
                    <el-button class="btn edit" type="text" @click="handleEdit('down', scope)">下移</el-button>
                    <el-button class="btn edit" type="text" @click="handleEdit('del', scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div v-else key="2">
              <div class="title">
                <div>已选中导出字段列表</div>
                <el-button class="btn" type="text" @click="handleToggle(true)">切换到已选中字段</el-button>
              </div>
              <el-table
                border
                size="mini"
                :data="selectFields"
                :row-key="rowKey"
                :class="{'is-error-tb': showError}"
                height="520px"
              >
                <el-table-column align="center" label="序号" type="index"></el-table-column>
                <el-table-column align="center" label="名称" prop="name"></el-table-column>
                <el-table-column align="center" label="操作">
                  <template slot-scope="scope">
                    <el-button class="btn edit" type="text" @click="handleEdit('up', scope)">上移</el-button>
                    <el-button class="btn edit" type="text" @click="handleEdit('down', scope)">下移</el-button>
                    <el-button class="btn edit" type="text" @click="handleEdit('del', scope)">删除</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </keep-alive>
        </el-col>
      </template>
      <keep-alive v-else key="3">
        <el-col :span="24">
          <div class="title">
            <div>我的模板</div>
            <el-button class="btn" type="text" @click="handleToggle(true)">切换到已选中字段</el-button>
          </div>
          <el-table :data="myData">
            <el-table-column label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="mySelect(scope.row)">选择</el-button>
                <el-button type="text" @click="myDel(scope.row[this.fieldId])">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </keep-alive>
    </el-row>
  </div>
</template>

<script>
// import storage from 'Utils/saver'
export default {
  name: 'YtCustomExport',
  props: {
    loadData: {
      type: Function,
      default: () => Promise.resolve([])
    },
    fieldColumns: {
      type: Array,
      default: () => []
    },
    rowKey: {
      type: String,
      // required: true,
      default: 'column'
    },
    fetch: {
      type: Object,
      default: () => {}
    },
    apiName: {
      type: Array,
      default: () => ['order/globalTemplateRemove', 'order/getMyTemplate']
    }, // 删除模板， 获取我的模板
    fieldId: {
      // 操作模板Id,用于传参
      type: String,
      default: 'globalTemplateId'
    }
  },
  data() {
    return {
      myTemp: false,
      myData: [],
      columns: this.fieldColumns,
      loading: false,
      currentTab: true,
      showError: false,
      saveLoading: false,
      exportLoading: false,
      popoverModel: false,
      tempName: null,
      selectFields: [],
      selectFieldsCache: [],
      myFields: []
    }
  },
  computed: {
    allFields() {
      if (!this.columns) {
        return []
      }
      return this.columns.map(el => el)
    }
  },
  watch: {
    tempName(val) {
      if (val != null && val !== '') {
        this.popoverModel = false
      }
    }
  },
  created() {
    this.initFields()
  },
  methods: {
    mySelect(row) {
      let { dataPromise } = this.fetch
      this.loading = true
      dataPromise(row)
        .then(data => {
          this.loading = false
          this.myTemp = false
          this.$nextTick(() => this.setFeild(data.rows))
        })
        .catch(() => {
          this.loading = false
          this.myTemp = false
          this.$nextTick(() => this.setFeild())
        })
    },
    myDel(globalTemplateId) {
      this.$confirm('此操作将永久删除该模板, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api[this.apiName[0]]({
            [this.fieldId + 's']: Array.of(globalTemplateId)
          })
            .then(data => {
              this.$message.success(data.msg)
              this.handleToggle()
            })
            .catch(err => {
              this.$message.error(err.msg)
            })
        })
        .catch(() => {
          return false
        })
    },

    initFields() {
      // let cached = storage.get('session', 'customeExport')
      // this.isFetch = true
      // if (cached) {
      //   this.columns = cached
      //   this.isFetch = false
      //   return
      // }
      if (this.$.dataType(this.loadData) === 'Function') {
        let result = this.loadData()
        if (result.then) {
          result.then(data => {
            this.isFetch = false
            this.columns = data
            // storage.set('session', 'customeExport', data)
          })
        }
      }
    },
    reset() {
      let oldCol
      if (this.columns.length) {
        oldCol = [...this.columns]
      }
      Object.assign(this.$data, this.$options.data())
      if (oldCol) {
        this.columns = oldCol
      } else if (!this.isFetch) {
        this.initFields()
      }
      this.$refs.table.clearSelection()
    },

    // 模板选择和模板切换
    // handleToggleMyTemp(val) {

    // },

    handleToggle(val) {
      // let { dataPromise } = this.fetch
      // this.currentTab = val
      if (!val) {
        // 切换到我的模板
        this.selectFieldsCache = [...this.selectFields]
        // 请求后端
        this.loading = true
        this.$api[this.apiName[1]]({})
          .then(data => {
            this.loading = false
            this.myTemp = true
            this.myData = data.rows
          })
          .catch(() => {
            this.loading = false
          })
      } else {
        this.myTemp = false
        // 切换已编辑的
        this.$nextTick(() => {
          this.setFeild(this.selectFieldsCache)
        })
      }
    },
    setFeild(arr = []) {
      this.$refs.table.clearSelection()
      this.allFields.forEach(element => {
        if (arr.find(el => el[this.rowKey] === element[this.rowKey])) {
          this.$refs.table.toggleRowSelection(element)
        }
      })
    },
    save(type, figureFlag) {
      if ((this.tempName == null || this.tempName === '') && type === 1) {
        this.popoverModel = true
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
          this.popoverModel = false
        }, 1000)
        return
      }

      if (!this.selectFields.length) {
        this.$message.warning('请选择要导出的字段')
        this.showError = true
        return
      }

      let { savePromise, excelPromise } = this.fetch

      if (type === 1) {
        this.saveLoading = true
        return savePromise()
          .then(data => {
            this.saveLoading = false
            // this.$emit('exSuccess', data)
          })
          .catch(() => {
            this.saveLoading = false
            // this.$emit('exError')
          })
      } else {
        this.exportLoading = true
        return excelPromise(figureFlag)
          .then(data => {
            this.$emit('exSuccess', data)
            this.exportLoading = false
          })
          .catch(() => {
            this.$emit('exError')
            this.exportLoading = false
          })
      }
    },
    handleEdit(name, scope) {
      let cur = this.selectFields.splice(scope.$index, 1)

      if (name === 'up') {
        if (scope.$index === 0) {
          this.selectFields.push(...cur)
          return
        }
        this.selectFields.splice(scope.$index - 1, 0, ...cur)
      }

      if (name === 'down') {
        if (scope.$index === this.selectFields.length) {
          this.selectFields.unshift(...cur)
          return
        }
        this.selectFields.splice(scope.$index + 1, 0, ...cur)
      }

      if (name === 'del') {
        this.$refs.table.toggleRowSelection(...cur, false)
      }
    },
    handleSelectionChange(val) {
      this.showError = false
      this.selectFields = val
    },
    handleRowClick(row, event, column) {
      this.$refs.table.toggleRowSelection(row)
    }
  }
}
</script>
<style lang="scss" scoped>
.title {
  display: flex;
  justify-content: space-between;
  background: #ebeef5;
  padding: 10px;
}
.btn {
  margin: 0;
  padding: 0;
}
.edit {
  padding: 0 3px;
}
.save-wrapper {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border: 1px solid #ebeef5;
  border-bottom: 0;
  .name-wrapper {
    margin-right: 10px;
    display: flex;
    flex: 1;
    line-height: 28px;
    .name {
      width: 60px;
    }
    span {
      flex: 1;
    }
  }
}

.is-error-tb.el-table--border {
  border-color: red;
  border-right: 1px solid red;
  border-bottom: 1px solid red;
}
</style>
