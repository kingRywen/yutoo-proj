<template>
  <el-row type="flex" class="main-layout">
    <el-col
      :span="showLeft ? 4 : 0"
      v-show="show"
      class="left-sidebar"
      v-if="sideBar && !dataList"
      v-loading="leftLoading"
    >
      <div v-show="showTree">
        <!-- <el-input
          class="search-input"
          prefix-icon="el-icon-search"
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          clearable
          size="mini"
        ></el-input>-->
        <el-autocomplete
          class="search-input"
          size="mini"
          v-model="filterText1"
          :disabled="autoDisabled"
          :debounce="500"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          :highlight-first-item="true"
          @select="handleSelect"
        >
          <template slot-scope="{item}">
            <div v-html="getHighLightName(item.name)"></div>
          </template>
        </el-autocomplete>
        <div v-if="selectedTreeNode" class="clear-btn-wrapper">
          <el-tooltip :content="selectedTreeNode.data.name" placement="top" :open-delay="600">
            <div class="box">
              <i class="el-icon-success"></i>
              <span class="span">{{selectedTreeNode.data.name}}</span>
            </div>
          </el-tooltip>
          <div>
            <el-button
              style="padding:6px 0;margin-left:10px"
              class="clear-btn"
              type="text"
              icon="el-icon-document"
              @click="handleCopy(selectedTreeNode.data.name)"
            >复制</el-button>
            <el-button
              style="padding:6px 0;margin-left:10px"
              class="clear-btn"
              type="text"
              @click="clearAndGetlist"
              icon="el-icon-close"
            >清除</el-button>
          </div>
        </div>

        <el-tree
          v-if="refresh"
          highlight-current
          :props="treeProps"
          :load="load"
          node-key="categoryId"
          :filter-node-method="filterNode"
          ref="tree"
          @current-change="handleTreeCurrentChange"
          :render-content="renderContent"
          :check-on-click-node="true"
          lazy
        >
          <span class="custom-tree-node" slot-scope="{node, data}">
            <span>{{data[treeProps.label].split(':').pop()}}</span>
          </span>
        </el-tree>
      </div>

      <div class="collapse-wrapper">
        <el-button type="text" icon="el-icon-caret-left" @click="collapseLeft"></el-button>
      </div>
    </el-col>
    <el-col :span="sideBar && !dataList && showLeft ? 20 : 24" class="right-sidebar">
      <slot name="top"></slot>
      <!-- button -->
      <div class="button" v-if="!dataList">
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
            :disabled="typeof item.disabled === 'function' ? item.disabled(selection) : false"
            type="primary"
            size="mini"
            @click="item.fn"
          >{{item.name}}</el-button>
        </template>
        <slot name="ip"></slot>
      </div>

      <!-- search -->
      <el-card shadow="never" class="search-card" v-if="!dataList">
        <div class="search">
          <SimpleForm :fields="searchFields" ref="search" :form-data.sync="formData" search></SimpleForm>
          <div v-if="showSearchBtn" class="search-btn">
            <el-button type="primary" size="mini" icon="el-icon-search" @click="handleSearch">搜索</el-button>
            <el-button type="warning" size="mini" icon="el-icon-reset" @click="reset">重置</el-button>
          </div>
        </div>
      </el-card>

      <!-- table -->
      <slot name="table">
        <el-table
          :cell-class-name="cellClassNameFunc"
          :data="tableData"
          class="table"
          v-loading="tableLoading"
          ref="table"
          :max-height="maxHeight"
          border
          fit
          stripe
          @selection-change="handleSelectionChange"
        >
          <transition-type v-if="!tableLoading" slot="empty" name="fadeIn-fadeOut">
            <NoneData></NoneData>
          </transition-type>

          <el-table-column type="selection"></el-table-column>
          <template v-for="(item, index) in tableCols">
            <el-table-column
              :width="item.width"
              :label="item.label"
              :prop="item.prop"
              :min-width="item.minWidth"
              :show-overflow-tooltip="!item.wrap"
              v-bind="item.props"
            >
              <template slot-scope="scope">
                <table-colvalue :item="item" :scope="scope"/>
              </template>
            </el-table-column>
          </template>
          <!-- <el-table-column label="类目" prop="name"></el-table-column>
        <el-table-column label="上级类目" prop="parentName"></el-table-column>
          <el-table-column label="层级" prop="level"></el-table-column>-->
          <el-table-column label="操作" :width="editWidth" v-if="edits.length" fixed="right">
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
                    v-else-if="(item.childs(scope)).length !== 0"
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
      <div class="collapse-wrapper-open">
        <el-button type="text" icon="el-icon-caret-right" v-show="!showLeft" @click="collapseLeft"></el-button>
      </div>
      <el-button ref="copyBtn" style="display:none" :data-clipboard-text="passText">复制</el-button>
    </el-col>
  </el-row>
</template>

<script>
import { debounce } from 'throttle-debounce'
import Clipboard from 'clipboard'

Vue.component('table-colvalue', {
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
    showSearchBtn: {
      default: true
    },
    fixed: {
      default: false
    },
    cellClassNameFunc: {
      type: Function,
      default: () => {}
    },
    editWidth: {
      type: [String, Number],
      default: '200px'
    },
    tree: {
      type: Boolean,
      default: false
    },
    outerParams: {
      type: Object,
      default: () => {}
    },
    // 是否只展示数据
    dataList: {
      type: Boolean,
      default: false
    },
    sideBar: {
      type: Boolean,
      default: true
    },
    tableCols: {
      type: Array,
      default: () => []
    },
    btns: {
      type: Array,
      default: () => []
    },
    edits: {
      type: Array,
      default: () => []
    },
    searchFields: {
      type: Array,
      default: () => []
    },
    // 右侧表格数据获取函数，返回promise
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
    },
    // 左侧树加载函数，返回promise
    loadNode: {
      type: Function,
      // required: true,
      default: () => resolve([])
    }
  },
  mounted() {
    let handlerResize = debounce(100, this.handlerResize)
    window.onresize = handlerResize
    if (this.$route.query.orderId && this.$refs.search) {
      this.$nextTick(() => {
        this.$refs.search.setData({
          orderId: this.$route.query.orderId + '',
          ipCount: this.$route.query.ipCount
        })
        this.getList({ orderId: this.$route.query.orderId + '' })
      })
    } else {
      this.getList()
    }
  },
  data() {
    return {
      autoDisabled: false,
      filterText1: '',
      passText: '',
      maxHeight: 570,
      selectedTreeNode: null,
      showTree: true,
      show: true,
      showLeft: true,
      refresh: true,
      formData: {},
      leftLoading: true,
      selection: [],
      data: [],
      tableData: [],
      tableLoading: true,
      treeProps: {
        label: 'name',
        children: 'childs',
        isLeaf: 'isLeaf'
      },
      filterText: '',
      total: 10,
      pageNo: 1,
      pageSize: 10
    }
  },
  beforeDestroy() {
    window.onresize = null
  },
  methods: {
    getHighLightName(name) {
      return name.replace(
        this.filterText1,
        '<b style="color:#67c23a">' + this.filterText1 + '</b>'
      )
    },
    handleCopy(text) {
      let vm = this
      vm.el = vm.$refs.copyBtn.$el
      vm.copyBtn = new Clipboard(vm.el)
      vm.copyBtn.on('success', function() {
        vm.$message({
          message: '复制成功！',
          type: 'success'
        })
      })
      vm.passText = text
      vm.$nextTick(() => {
        vm.el.dispatchEvent(new Event('click'))
        vm.copyBtn.destroy()
      })
    },
    // 渲染函数
    renderContent(h, { node, data, store }) {
      return (
        <span
          class="custom-tree-node"
          on-mouseenter={event => {
            if (data.groupId === -1) {
              return
            }
            if (event.target !== event.currentTarget) return
            let subEl = event.target.lastChild.lastChild
            if (subEl.className === 'btn-box') {
              subEl.style.display = 'block'
            }
          }}
          on-mouseleave={event => {
            if (data.groupId === -1) {
              return
            }
            if (event.target !== event.currentTarget) return
            let subEl = event.target.lastChild.lastChild
            if (subEl.className === 'btn-box') {
              subEl.style.display = 'none'
            }
          }}
        >
          {data.showInput ? (
            <div class="add-input">
              <el-input
                size="mini"
                value={data.name}
                on-input={e => {
                  data.name = e
                }}
                on-click={event => {
                  event.stopPropagation()
                  if (event.target !== event.currentTarget) return
                }}
              />
              <span class="btn-box-1">
                <i
                  class="el-icon-check"
                  on-click={e => {
                    e.stopPropagation()

                    if (data._edit) {
                      this.editNode(data)
                      return
                    }
                    this.confirmNode(data)
                  }}
                />
                <i
                  class="el-icon-close"
                  on-click={e => {
                    e.stopPropagation()
                    const key = this.getCurrentKey()
                    this.$nextTick(() => {
                      this.setCurrentKey(key)
                    })
                    if (data._edit) {
                      this.cancelEditNode(data)
                      return
                    }

                    // this.remove(node, data)
                  }}
                />
              </span>
            </div>
          ) : (
            <div>
              <span title={data.name}>
                <span class="tree-title">{data.name.split(':').pop()}</span>
                <span class="count">
                  {data.dataCnt ? ` (${data.dataCnt})` : null}
                </span>
              </span>
              <span class="btn-box">
                <i
                  class="el-icon-document"
                  on-click={event => {
                    if (event.target !== event.currentTarget) return
                    event.stopPropagation()
                    this.edit(data)
                  }}
                />
              </span>
            </div>
          )}
        </span>
      )
    },

    // 编辑子节点
    edit(data) {
      let { name } = data
      this.handleCopy(name)
      // this.$confirm(
      //   `是否复制 <b style='color:#108ee9'><i>${data.name}</i></b>`,
      //   '提示',
      //   {
      //     confirmButtonText: '确认',
      //     cancelButtonText: '取消',
      //     dangerouslyUseHTMLString: true,
      //     type: 'warning'
      //   }
      // )
      //   .then(() => {
      //     this.$api[`main/categorySave`]({
      //       level,
      //       parentId,
      //       name
      //     })
      //       .then(data => {})
      //       .catch(err => {})
      //   })
      //   .catch(() => {})
    },
    querySearch(search, cb) {
      if (search == null) {
        return
      }
      search = search.trim()
      if (!search || search === '') {
        cb([])
        return
      }
      this.$api[`main/categorySearch`]({ search })
        .then(data => {
          if (data && data.length) {
            cb(data)
          } else {
            cb([{ name: '暂无搜索结果.' }])
          }
        })
        .catch(err => {
          cb([{ name: '暂无搜索结果.' }])
        })
    },
    async handleSelect(data) {
      console.log(data)
      let tree = this.$refs.tree
      let { categoryId, categoryMap, level } = data
      let selNode = tree.getNode(categoryId)
      if (false) {
        // 如果存在node 直接设置选中
        tree.setCurrentKey(categoryId)
        this.handleTreeCurrentChange(selNode.data, selNode)
      } else {
        // 如果不存在， 一个个加载出来
        let parentList = categoryMap[categoryId]
        console.log(parentList)
        // parentList.map(async (parentId, index) => {
        //   let i = index + 2
        //   this.$api[`main/categoryDropdownListHasParent`]({
        //     level: i,
        //     parentId: +parentId
        //   })
        //     .then(data => {
        //       // data.map(d => tree.append())
        //       let all = tree.store._getAllNodes()
        //       all.forEach(el => {
        //         el.expanded = true
        //       })
        //       tree.updateKeyChildren(parentId, data)
        //     })
        //     .catch(err => {})
        // })
        Promise.all(
          parentList.map(async (parentId, index) => {
            let node = tree.getNode(parentId)
            if (node && node.loaded) {
              return Promise.resolve(false)
            } else {
              return await this.$api[`main/categoryDropdownListHasParent`]({
                level: index + 2,
                parentId: +parentId
              }).then(data => data.map(el => ({ ...el, isLeaf: !el.hasChild })))
            }
          })
        ).then(res => {
          console.log(res)
          res.forEach((r, i) => {
            if (r) {
              tree.updateKeyChildren(parentList[i], r)
            }
            let all = tree.store._getAllNodes()
            all.forEach(el => {
              if (el.data.categoryId === +parentList[i]) {
                el.expanded = true
              }
            })
          })
          tree.setCurrentKey(categoryId)
          let selNode = tree.getNode(categoryId)
          this.handleTreeCurrentChange(selNode.data, selNode)
          // tree.append()
        })
      }
    },
    // 获取选中的 key
    getCurrentKey() {
      return this.$refs.tree && this.$refs.tree.getCurrentKey()
    },
    // 设置选中特定的 key
    setCurrentKey(key) {
      return this.$refs.tree && this.$refs.tree.setCurrentKey(key)
    },
    // 编辑子节点
    editNode(data) {
      if (data._oldVal === data.name) {
        this.$set(data, 'showInput', false)
        return
      }
      this.createNode(data, 1, () => {
        this.$set(data, 'showInput', false)
        this.nodeClick(data)
      })
    },
    // 提交子节点
    confirmNode(data) {
      if (data.name === '' || data.name == null) {
        this.$message.warning('类目名不能为空')
        return
      }
      this.createNode(data)
    },
    cancelEditNode(data) {
      this.$set(data, 'name', data._oldVal)
      this.$set(data, 'showInput', false)
    },
    createNode() {
      console.log('create')
    },

    handlerResize() {
      this.fixedTableHeight()
    },
    // 修正表格的高度
    fixedTableHeight() {
      function getStyle(el, styleName) {
        if (el.nodeType !== 1) {
          return 0
        }
        let _el = window.getComputedStyle(el)
        return _el && parseInt(_el[styleName])
      }
      let rightEl = document.querySelectorAll('.right-sidebar')[0]
      let outerHeight = getStyle(rightEl, 'height')

      let childs = Array.from(rightEl.childNodes)
      let otherHeight = childs.reduce((prev, cur, index) => {
        if (
          this.$.dataType(cur) === 'HTMLDivElement' &&
          cur.className.indexOf('el-table') > -1
        ) {
          return prev
        } else {
          return getStyle(cur, 'height') + prev
        }
      }, 0)

      this.maxHeight = outerHeight - otherHeight - 30
    },
    collapseLeft() {
      this.showLeft = !this.showLeft
      if (this.showLeft) {
        this.show = true
        this.showTree = false
        setTimeout(() => {
          this.showTree = true
        }, 250)
      } else {
        this.showTree = false
        setTimeout(() => {
          this.show = false
        }, 230)
      }
    },
    clearAndGetlist() {
      this.pageNo = 1
      this.$refs.tree.setCurrentKey(null)
      this.selectedTreeNode = null
      this.$emit('clear')
    },
    refreshTree() {
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
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
      let categoryId = this.$refs.tree && this.$refs.tree.getCurrentKey()

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

      if (categoryId && params.parentId == null) {
        params.categoryId = categoryId
      }

      this.tableLoading = true
      this.loadData(params)
        .then(data => {
          this.tableLoading = false
          let { rows, total, pageSize, pageNo } = data
          this.total = total
          this.pageSize = pageSize
          this.pageNo = pageNo
          this.tableData = rows
          if (rows.length) {
            this.$nextTick(() => this.handlerResize())
          }
        })
        .catch(err => {
          this.tableLoading = false
        })
    },
    handleSearch() {
      this.pageNo = 1
      this.getList()
    },
    reset() {
      this.pageNo = 1
      this.$refs.search.reset()
      this.$refs.tree && this.$refs.tree.setCurrentKey(null)
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
      this.$emit('handleSelectionChange', val)
    },

    filterNode(value, data) {
      value = value.trim()
      if (value === '') return true

      return (
        data[this.treeProps.label]
          .toLowerCase()
          .indexOf(value.toLowerCase()) !== -1
      )
    },
    load(node, resolve) {
      if (this.dataList) {
        return
      }
      this.leftLoading = true
      this.loadNode(node)
        .then(data => {
          this.leftLoading = false
          resolve(data.map(el => ({ ...el, isLeaf: !el.hasChild })))
        })
        .catch(err => {
          this.$message.error('加载出错')
        })
    },
    handleTreeCurrentChange(data, node) {
      this.selectedTreeNode = node
      //
      this.pageNo = 1
      this.$emit('treeCurrentChange', data, node)
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>

<style lang="scss" scoped>
.main-layout {
  .custom-tree-node {
    font-size: 12px;
  }

  .collapse-wrapper .el-button--text,
  .collapse-wrapper-open .el-button--text {
    font-size: 16px !important;
  }

  .left-sidebar {
    position: relative;
    margin-right: 10px;
    padding-right: 10px;
    border-right: 1px solid #eee;
    transition: all 0.25s ease-in-out;
    .search-input {
      width: 100%;
      margin-bottom: 10px;
    }
    .clear-btn-wrapper {
      position: relative;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border: 1px solid #87cdff;
      padding: 0 6px;
      margin-bottom: 10px;
      border-radius: 3px;
      .box {
        display: flex;
        flex: 1;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        i {
          color: #108ee9;
          line-height: 32px;
          font-size: 12px;
          margin-right: 4px;
        }
        .span {
          font-weight: bolder;
          color: #333;
          font-size: 12px;
          padding: 10px 0;
          line-height: 12px;
          flex: 1;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
        }
      }

      // right: 18px;
      // top: 31px;
      // z-index: 2;
    }
    .collapse-wrapper {
      position: absolute;
      right: 0;
      top: 50%;
      margin-top: -19px;
      .el-button--text {
        color: #909399;
      }
    }
  }
  .collapse-wrapper-open {
    position: absolute;
    left: -18px;
    top: 50%;
    margin-top: -19px;
    .el-button--text {
      color: #909399;
    }
  }

  .el-col-0 {
    display: block;
    height: 0;
    & > * {
      display: none;
    }
  }

  .right-sidebar {
    transition: all 0.25s ease-in-out;
    .search-card {
      margin-top: 12px;
      .search {
        display: flex;
        align-items: center;
        form {
          flex: 1;
          margin-right: 20px;
          padding-right: 20px;
          // border-right: 1px solid #ddd;
        }
      }
    }
    .table {
      margin-top: 12px;
    }
    .pagination {
      margin: 12px 0;
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
.el-table .expired {
  background: #ff858a !important;
}
.el-table .willExpire {
  background: #ffc107 !important;
}
</style>
