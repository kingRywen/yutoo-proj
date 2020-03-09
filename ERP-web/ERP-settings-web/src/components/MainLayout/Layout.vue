<template>
  <el-row type="flex" class="main-layout">
    <el-col :span="24" class="table-wrapper">
      <!-- search -->
      <el-card shadow="never" class="search-card">
        <div class="search">
          <SimpleForm :fields="searchFields" :label-width="labelWidth" ref="search" :form-data.sync="formData" search></SimpleForm>
          <div class="search-btn">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button type="warning" size="mini" icon="el-icon-reset" @click="reset">重置</el-button>
          </div>
        </div>
      </el-card>

      <!-- button -->
      <div class="button">
        <template v-for="(item, index) in btns">
          <span v-if="item.spec" style="margin-left:30px"></span>
          <el-dropdown v-else-if="item.childs" @command="handleCommand">
            <el-button style="margin-left: 12px" size="mini" type="primary">
              {{item.name}}
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="(i, index) in item.childs"
                :key="i"
                :command="i"
                :disabled="item.disabled[index]"
              >{{i}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            v-else
            :disabled="item.disabled && item.disabled(selection)"
            type="primary"
            size="mini"
            @click="item.fn(selection)"
          >{{item.name}}</el-button>
        </template>
      </div>

      <!-- table -->
      <slot name="table">
        <el-table
          :row-style="rowStyle"
          :data="tableData"
          class="table"
          :row-key="rowKey"
          v-loading="tableLoading"
          ref="table"
          border
          stripe
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" reserve-selection></el-table-column>
          <template v-for="(item, index) in tableCols">
            <el-table-column
              :width="item.width"
              :label="item.label"
              :prop="item.prop"
              :show-overflow-tooltip="!item.wrap"
            >
              <template slot-scope="scope">
                <table-col :item="item" :scope="scope"/>
              </template>
            </el-table-column>
          </template>
          <!-- <el-table-column label="类目" prop="name"></el-table-column>
        <el-table-column label="上级类目" prop="parentName"></el-table-column>
          <el-table-column label="层级" prop="level"></el-table-column>-->
          <el-table-column label="操作" width="200px" v-if="edits.length">
            <template slot-scope="scope">
              <template v-for="(item, index) in edits">
                <template v-if="typeof item.show === 'boolean' ? item.show : item.show(scope)">
                  <el-button type="text" v-if="!item.childs" :key="index" @click="item.fn(scope, item)">{{item.name}}</el-button>
                  <el-button
                    type="text"
                    v-else-if="(item.childs(scope)).length === 1"
                    :key="index"
                    @click="item.fn(scope, item, (item.childs(scope))[0].name)"
                  >{{(item.childs(scope))[0].name}}</el-button>

                  <el-dropdown
                    v-else
                    split-button
                    type="text"
                    @click="item.fn(scope, item,item.name)"
                    @command="c => item.fn(scope, item,c)"
                  >
                    {{(item.childs(scope))[0].name}}
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="(i, subIndex) in (item.childs(scope))">
                        <el-dropdown-item v-if="subIndex !==0" :command="i.name">{{i.name}}</el-dropdown-item>
                      </template>
                    </el-dropdown-menu>
                  </el-dropdown>
                </template>
              </template>
            </template>
          </el-table-column>
        </el-table>
        <!-- pagination -->
        <el-pagination
          v-if="total"
          :total="total"
          :current-page="pageNo"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </slot>
    </el-col>
  </el-row>
</template>

<script>
Vue.component('table-col', {
  props: ['item', 'scope'],
  render(h) {
    if (this.item.formatter && typeof this.item.formatter === 'function') {
      return <span>{this.item.formatter(this.scope, this.item)}</span>
    } else if (this.item.render && typeof this.item.render === 'function') {
      return this.item.render(h, this.scope)
    } else {
      return (
        <span>
          {this.scope.row[this.item.prop] === null ||
          this.scope.row[this.item.prop] === '' ||
          this.scope.row[this.item.prop] === undefined
            ? '-'
            : this.scope.row[this.item.prop]}
        </span>
      )
    }
  }
})

export default {
  name: 'main-layout',
  props: {
    rowStyle: {
      type: Function,
      default: () => {}
    },
    outerParams: {
      type: Object,
      default: () => {}
    },
    rowKey: {
      type: String,
      default: 'index'
    },
    labelWidth: {
      type: String,
      default: '70px'
    },
    tableCols: {
      type: Array,
      required: true,
      default: () => []
    },
    btns: {
      type: Array,
      required: true,
      default: () => []
    },
    edits: {
      required: true,
      type: Array,
      default: () => []
    },
    searchFields: {
      type: Array,
      default: () => []
    },
    // 表格数据获取函数，返回promise
    loadData: {
      type: Function,
      required: true,
      default: () =>
        Promise.resolve({
          rows: [],
          total: 0,
          pageSize: 10,
          pageNo: 1
        })
    }
  },
  mounted() {
    this.getList()
  },
  data() {
    return {
      formData: {},
      selection: [],
      data: [],
      tableData: [],
      tableLoading: false,
      total: 10,
      pageNo: 1,
      pageSize: 10
    }
  },
  methods: {
    clearSelection() {
      return this.$refs.table.clearSelection()
    },
    handleCommand(command) {
      this.$emit('command', command)
    },
    getCheckedData() {
      return this.$refs.table.selection
    },
    getList(params, isSearch = true) {
      let searchData = {}
      let search = this.$refs.search
      if (search && isSearch) {
        searchData = search.getSearchData()
      }
      params = this.$.dealObjectValue({
        pageSize: this.pageSize || 10,
        pageNumber: this.pageNo || 1,
        ...searchData,
        ...this.outerParams,
        ...params
      })

      this.tableLoading = true
      this.loadData(params)
        .then(data => {
          this.tableLoading = false
          let { rows, total, pageSize, pageNo } = data
          this.total = total
          this.pageSize = pageSize
          this.pageNo = pageNo
          this.tableData = rows
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    handleSearch() {
      this.getList()
    },
    reset() {
      this.$refs.search.reset()
      this.getList()
    },
    handleCurrentChange(val) {
      this.getList({
        pageNumber: val,
        pageSize: this.pageSize
      })
    },
    handleSizeChange(val) {
      this.getList({
        pageNumber: this.pageNo,
        pageSize: val
      })
    },

    handleSelectionChange(val) {
      this.selection = val
      this.$emit('selectionChange', val)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  .table-wrapper {
    transition: all 0.25s ease-in-out;
    .search-card {
      .search {
        display: flex;
        align-items: center;
        form {
          flex: 1;
          margin-right: 20px;
          padding-right: 20px;
          border-right: 1px solid #ddd;
        }
      }
    }
    .button {
      margin-top: 12px;
    }
    .table {
      margin-top: 12px;
    }
    .pagination {
      margin-top: 12px;
      text-align: right;
    }
  }
}
</style>
<style lang="scss">
.hiddenIcon {
  i {
    display: none;
  }
}
</style>
<style rel="stylesheet/css">
@keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@-webkit-keyframes treeTableShow {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>