<template>
  <el-row type="flex" class="main-layout">
    <el-col
      :span="showLeft ? 4 : 0"
      v-show="show"
      class="left-sidebar"
      v-if="sideBar && !dataList"
      v-loading="leftLoading"
    >
      <div v-show="showTree" class="tree-wrapper">
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
          placeholder="请输入名称"
          :highlight-first-item="true"
          @select="handleSelect"
        >
          <template slot-scope="{item}">
            <div v-html="getHighLightName(item[[treeProps.label]])"></div>
          </template>
        </el-autocomplete>
        <div v-if="selectedTreeNode" class="clear-btn-wrapper">
          <el-tooltip :content="selectedTreeNode.data[treeProps.label]" placement="top" :open-delay="600">
            <div class="box">
              <i class="el-icon-success"></i>
              <span class="span">{{selectedTreeNode.data[treeProps.label]}}</span>
            </div>
          </el-tooltip>
          <div>
            <el-button
              style="padding:6px 0;margin-left:10px"
              class="clear-btn"
              type="text"
              icon="el-icon-document"
              @click="handleCopy(selectedTreeNode.data[treeProps.label])"
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
        <slot name="treeTop" v-if="treeCrud">
          <el-button type="text" icon="el-icon-plus" @click="addItem()">新增分组</el-button>
        </slot>
        <el-tree
          @hook:mounted="treeMounted"
          v-if="refresh"
          highlight-current
          :props="treeProps"
          :load="load"
          :node-key="nodeKey"
          :expand-on-click-node="!treeCrud"
          :filter-node-method="filterNode"
          ref="tree"
          @current-change="handleTreeCurrentChange"
          :render-content="renderContent"
          :check-on-click-node="true"
          lazy
        ></el-tree>
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
          <el-dropdown v-else-if="item.childs" @command="handleCommand" :key="index">
            <el-button style="margin-left: 12px" size="small" type="primary">
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
            :key="index"
            :disabled="typeof item.disabled === 'function' ? item.disabled(selection) : false"
            :type="item.type || `primary`"
            size="small"
            :plain="item.type === 'danger' || item.plain"
            @click="item.fn"
          >{{item.name}}</el-button>
        </template>
        <slot name="ip"></slot>
      </div>

      <!-- search -->
      <!-- <el-card shadow="never" class="search-card" v-if="!dataList && searchFields.length">-->
      <CollapseWrapper v-if="Object.keys(searchFields).length" :expand="expand" class="mb10 search-card">
        <div class="search">
          <SimpleForm size="small" :fields="searchFields" ref="search" :outerFormData.sync="formData" search></SimpleForm>
          <div v-if="showSearchBtn" class="search-btn">
            <el-button
              type="primary"
              size="small"
              icon="el-icon-search"
              :disabled="tableLoading"
              @click="handleSearch"
            >搜索</el-button>
            <el-button size="small" icon="el-icon-reset" :disabled="tableLoading" @click="reset">重置</el-button>
          </div>
        </div>
      </CollapseWrapper>
      <!-- </el-card>-->

      <!-- table -->
      <slot name="table">
        <el-table
          :row-style="showRow"
          :cell-class-name="cellClassNameFunc"
          :data="listToArray"
          class="table"
          ref="table"
          border
          fit
          stripe
          @selection-change="handleSelectionChange"
        >
          <NoneData v-if="!tableLoading" slot="empty"></NoneData>

          <el-table-column type="selection"></el-table-column>
          <template v-for="(item, index) in tableCols">
            <el-table-column type="index" v-if="item.type === 'index'" :key="index"></el-table-column>
            <el-table-column
              v-else
              :width="item.width"
              :label="item.label"
              :prop="item.prop"
              :key="index"
              :min-width="item.minWidth"
              :show-overflow-tooltip="!item.wrap"
              v-bind="item.props"
            >
              <template slot-scope="scope">
                <div :style="item.expand ? { paddingLeft: (scope.row._level - 1) * 20 + 'px' } : null">
                  <el-button
                    v-if="item.expand"
                    type="text"
                    :icon="`el-icon-${
            scope.row.loading ? 'loading' : scope.row._expanded ? 'caret-bottom' : 'caret-right'
          }`"
                    @click.stop="handleExpand(scope, item)"
                    :style="{ visibility: !treeTableOtions.expandFunc(scope.row) ? `hidden` : null }"
                  ></el-button>
                  <table-colvalue :item="item" :scope="scope" />
                </div>
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
                  <el-button
                    :loading="scope.row._loading"
                    type="text"
                    v-if="!item.childs"
                    :key="index"
                    @click="handleClickBtn(item, scope)"
                  >{{item.name}}</el-button>

                  <el-button
                    :loading="scope.row._loading"
                    type="text"
                    v-else-if="(item.childs(scope)).length === 1"
                    :key="index"
                    @click="handleClickBtn(item, scope, 1)"
                  >{{(item.childs(scope))[0].name}}</el-button>

                  <el-dropdown
                    :key="index"
                    v-else-if="(item.childs(scope)).length !== 0"
                    split-button
                    type="text"
                    @click="item.fn(scope, item,item.name)"
                    @command="c => item.fn(scope, item,c)"
                  >
                    {{(item.childs(scope))[0].name}}
                    <el-dropdown-menu slot="dropdown">
                      <template v-for="(i, subIndex) in (item.childs(scope))">
                        <el-dropdown-item v-if="subIndex !==0" :command="i.name" :key="subIndex">{{i.name}}</el-dropdown-item>
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
          :current-page.sync="pageNo"
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
      <yt-dialog v-if="treeCrud" :options="dialog" :events="events">
        <SimpleForm :fields="addFields" ref="add"></SimpleForm>
      </yt-dialog>
    </el-col>
  </el-row>
</template>

<script>
import { debounce } from 'throttle-debounce'
import Clipboard from 'clipboard'
import Vue from 'vue'

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
    expand: {
      default: false
    },
    fixedH: {
      default: true
    },
    nodeKey: {
      default: 'categorySysId'
    },
    treeCrud: {
      default: false
    },
    searchFunc: {
      default: () => data => {
        return data
      }
    },
    treeTableOtions: {
      type: Object,
      default: () => ({
        childs: 'children',
        // 是否显示expand按钮
        expandFunc: row => {
          return row.hasChild
        }
      })
    },
    treeSearchApi: {
      default: `main/categorySysSearch`
    },
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
      default: () => Promise.resolve([])
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
      addFields: [
        {
          name: 'name',
          label: '分组名称',
          required: true
        },
        {
          type: 'cascader',
          name: 'categoryName',
          getEl: true,
          label: '上级分组',
          options: this.loadTree,
          bind: {
            label: 'categoryName',
            value: 'categoryId',
            children: 'childs',
            enabled: 'enabled'
          }
        }
      ],
      events: {
        handleOkClick: () => {
          this.addGroup()
        }
      },
      dialog: {
        visible: false,
        title: '新增分组',
        width: '400px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
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
        label: 'categoryName',
        children: 'childs',
        isLeaf: 'isLeaf'
      },
      filterText: '',
      total: 10,
      pageNo: 1,
      pageSize: 10
    }
  },
  created() {
    this.formData = { ...this.outerParams }
  },
  beforeDestroy() {
    window.onresize = null
  },
  computed: {
    listToArray() {
      if (!this.tree) {
        return this.tableData
      }
      let tmp = this.tableData || []
      const func = this.evalFunc
      const args = [tmp, false]
      return func.apply(null, args)
    }
  },
  methods: {
    addGroup() {
      let { name, categoryName1 = {} } = this.$refs.add.formData
      let { categoryId: parentCategoryId = 0, level = 0 } = categoryName1
      this.createNode({ name, parentCategoryId, level: ++level })
    },
    loadTree(id = [0], selEl) {
      if (!selEl) {
        selEl = {
          categoryId: 0,
          level: 0
        }
      }
      let { categoryId, level, childs } = selEl
      let params = {
        level: level + 1,
        parentCategoryId: categoryId
      }
      // console.log(params)
      return this.$api[`main/categoryVmShopList`](params)
        .then(data => {
          if (!data) {
            this.$message.error(data.msg)
            return
          }
          data = data.map(el => {
            return {
              ...el,
              childs: el.hasChild ? [] : null,
              isLeaf: !el.hasChild,
              enabled: true
            }
          })
          return data
        })
        .catch(() => {})
    },
    addItem() {
      this.dialog.visible = true
    },
    handleClickBtn(item, scope, multi) {
      let res
      if (multi) {
        res = item.fn(
          scope,
          item,
          item.childs(scope)[0].name,
          item.childs(scope)[0].value
        )
      } else {
        res = item.fn(scope, item)
      }
      if (!res) {
        return
      }
      this.$set(scope.row, '_loading', true)
      res.then &&
        res.then(res => {
          this.$set(scope.row, '_loading', false)
        })
    },
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    handleExpand(scope, item) {
      // debugger
      const { row } = scope
      const {
        value,
        render,
        formatter,
        expand,
        async,
        asyncFunc,
        type,
        expandAll
      } = item
      // const { expandFunc } = expandOptions;
      const { childs, expandFunc } = this.treeTableOtions
      const { loading, _expanded, _level } = row
      const _child = row[childs]

      // 点击下拉
      if (!_expanded) {
        if (async || asyncFunc) {
          if (!_child) {
            // 需要请求后台, 分两种，如果expandAll true ,则展示所有下级， 默认展示下一级

            this.$set(row, 'loading', true)
            asyncFunc(row).then(data => {
              // console.log(data);
              if (!expandAll) {
                row.loading = false
                this.$set(row, childs, data)
                this.$set(row, '_expanded', true)
              } else {
                row.loading = false
                this.$set(row, childs, data)
                this.$set(row, '_expanded', true)

                // this.setAllExpand(data, asyncFunc, row, childs, JSON.parse(JSON.stringify(data)))
              }
            })
          } else {
            this.$set(row, '_expanded', true)
          }
        } else {
          // 不需要请求后台
          this.$set(row, '_expanded', true)
        }
      } else {
        row._expanded = false
      }
    },
    excutePromise(data, asyncFunc) {
      return Promise.all(data.map(el => asyncFunc(el)))
    },
    async setAllExpand(data, asyncFunc, row, childs) {
      if (data && data.length) {
        let res = await this.excutePromise(data, asyncFunc)
        data.map(async (el, index, arr) => {
          el._expanded = true
          console.log(res[index])
          el[childs] = res[index].map(e => ({ ...e, _expanded: true }))
          await this.setAllExpand.apply(
            this,
            [res[index]].concat(asyncFunc, row, childs)
          )
        })
      } else {
        row.loading = false
        console.log(origin)
        this.$set(row, childs, [origin])
        this.$set(row, '_expanded', true)
      }
    },

    // 展开函数
    evalFunc(data, expandAll, parent = null, level = null) {
      let tmp = [],
        vm = this,
        children = this.treeTableOtions.childs
      Array.from(data).forEach(function(record) {
        if (record._expanded === undefined) {
          Vue.set(record, '_expanded', expandAll)
        }
        let _level = 1
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        Vue.set(record, '_level', _level)
        // 如果有父元素
        if (parent) {
          Vue.set(record, 'parent', parent)
        }
        tmp.push(record)
        if (record[children] && record[children].length > 0) {
          const _children = vm.evalFunc(
            record[children],
            expandAll,
            record,
            _level
          )
          tmp = tmp.concat(_children)
        }
      })
      return tmp
    },
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
      console.log(text)
      vm.passText = text
      vm.$nextTick(() => {
        vm.el.dispatchEvent(new Event('click'))
        vm.copyBtn.destroy()
      })
    },
    // 渲染函数
    renderContent(h, { node, data, store }) {
      let vm = this
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

                    this.remove(node, data)
                  }}
                />
              </span>
            </div>
          ) : (
            <div>
              <span title={data[this.treeProps.label]}>
                <span class="tree-title">
                  {data[this.treeProps.label].split(':').pop()}
                </span>
                <span class="count">
                  {data.dataCnt ? ` (${data.dataCnt})` : null}
                </span>
              </span>
              {this.treeCrud ? (
                <span class="btn-box">
                  <i
                    class="el-icon-plus"
                    on-click={event => {
                      if (event.target !== event.currentTarget) return
                      event.stopPropagation()
                      vm.add(data, node)
                    }}
                  />
                  <i
                    class="el-icon-edit"
                    on-click={event => {
                      if (event.target !== event.currentTarget) return
                      event.stopPropagation()
                      vm.edit(data, node)
                    }}
                  />
                  <i
                    class="el-icon-delete"
                    on-click={event => {
                      if (event.target !== event.currentTarget) return
                      event.stopPropagation()
                      vm.del(data, node)
                    }}
                  />
                </span>
              ) : (
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
              )}
            </div>
          )}
        </span>
      )
    },

    // 添加节点
    add(data, node) {
      // if (!node.expanded) {
      //   node.expanded = true

      // }
      // console.log(data);
      let el = {
        showInput: true,
        categoryName: '',
        categoryId: undefined,
        name: '',
        parentCategoryId: data.categoryId,
        parentCategoryName: data.categoryName,
        hasChild: false,
        isLeaf: true,
        level: data.level + 1
      }
      if (!data.hasChild) {
        node.isLeaf = false
        node.expanded = true
        node.isLeafByUser = false
      }

      this.$refs.tree.append(el, node)
      node.data.childs = null
    },

    treeMounted() {
      // console.log(222);
    },

    // 删除节点
    del(data, node) {
      let vm = this
      vm.$.showWarning('是否删除此类目？', () => {
        vm.$api[`main/categoryVmShopRemove`]([{ categoryId: data.categoryId }])
          .then(_data => {
            vm.remove(node, data)
            if (vm.selectedTreeNode.data.categoryId === data.categoryId) {
              // 如果删除 的是当前节点， 清除类目数据
              vm.selectedTreeNode = null
              vm.getList()
            }
          })
          .catch(err => {
            // console.log(data);
            // vm.$refs.tree.remove(data)
          })
      })
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.childNodes
      const index = children.findIndex(
        d => d.data.categoryId === data.categoryId
      )
      children.splice(index, 1)
      if (children.length === 0) {
        parent.isLeaf = true
        parent.expanded = false
        parent.isLeafByUser = true
      }
    },

    // 编辑子节点
    edit(data) {
      if (this.treeCrud) {
        this.$set(data, 'showInput', true)
        this.$set(data, 'name', data.categoryName)
        data._oldVal = data.categoryName
        data._edit = true
        return
      }
      let name = data[this.treeProps.label]
      // let { name } = data
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
      this.$api[this.treeSearchApi]({ search })
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
      let tree = this.$refs.tree
      let { categorySysId, categorySysMap, level } = data
      let selNode = tree.getNode(categorySysId)
      if (selNode) {
        // 如果存在node 直接设置选中
        tree.setCurrentKey(categorySysId)
        this.handleTreeCurrentChange(selNode.data, selNode)
      } else {
        // 如果不存在， 一个个加载出来
        let parentList = categorySysMap[categorySysId]
        console.log(parentList)

        Promise.all(
          parentList.map(async (parentId, index) => {
            let node = tree.getNode(parentId)
            if (node && node.loaded) {
              return Promise.resolve(false)
            } else {
              return await this.$api[`main/categorySysList`]({
                level: index + 2,
                parentCategoryId: +parentId
              }).then(data => data.map(el => ({ ...el, isLeaf: !el.hasChild })))
            }
          })
        ).then(res => {
          res.forEach((r, i) => {
            if (r) {
              tree.updateKeyChildren(parentList[i], r)
            }
            let all = tree.store._getAllNodes()
            all.forEach(el => {
              if (el.data.categorySysId === +parentList[i]) {
                el.expanded = true
              }
            })
          })
          tree.setCurrentKey(categorySysId)
          let selNode = tree.getNode(categorySysId)
          this.handleTreeCurrentChange(selNode.data, selNode)
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
      // debugger
      if (data._oldVal === data.name) {
        this.$set(data, 'showInput', false)
        return
      }
      // debugger
      this.createNode(data, 1)
    },
    // 提交子节点
    confirmNode(data) {
      // console.log(data.name)
      if (data.name === '' || data.name == null) {
        this.$message.warning('名字不能为空')
        return
      }
      this.createNode(data)
    },
    cancelEditNode(data) {
      data._edit = false
      this.$set(data, 'name', data._oldVal)
      this.$set(data, 'showInput', false)
    },
    createNode(data, type, cb) {
      let vm = this
      // console.log(data);
      let { name, parentCategoryId, level, categoryId } = data,
        api
      let params = {
        categoryName: name,
        parentCategoryId,
        level
      }
      if (type) {
        // 修改节点
        api = 'categoryVmShopUpdate'
        params.categoryId = categoryId
      } else {
        // 新增
        api = 'categoryVmShopSave'
      }
      this.$api[`main/${api}`](params)
        .then(_data => {
          console.log(vm.selectedTreeNode, params)
          if (
            type &&
            vm.selectedTreeNode.data &&
            vm.selectedTreeNode.data.categoryId === params.categoryId
          ) {
            vm.selectedTreeNode.data.categoryName = name
          }
          if (level !== 1) {
            vm.$api[`main/categoryVmShopInfo`]({
              categoryId: _data.categoryId
            })
              .then(d => {
                vm.$refs.tree.updateKeyChildren()
                Object.assign(data, d.rows, { showInput: false })
              })
              .catch(err => {})
          } else {
            // 根需要刷新所有
            this.refreshTree()
          }
        })
        .catch(err => {})
    },

    handlerResize() {
      // return
      this.fixedTableHeight()
    },
    // 修正表格的高度
    fixedTableHeight() {
      function getStyle(el, styleName) {
        if (el.nodeType !== 1) {
          return 0
        }
        let _el = window.getComputedStyle(el)
        if (!_el) return 0
        let n = parseInt(_el[styleName])
        if (isNaN(n)) {
          return 0
        } else {
          return n
        }
        // return _el[styleName]
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

      this.maxHeight = Math.max(outerHeight - otherHeight - 60, 300)
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
      this.$refs.tree && this.$refs.tree.setCurrentKey(null)
      this.selectedTreeNode = null
      this.$emit('clear')
    },
    // refreshTree() {
    //   this.refresh = false
    //   this.$nextTick(() => {
    //     this.refresh = true
    //   })
    // },
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
        searchData = this.searchFunc(searchData)
      }
      params = this.$.dealObjectValue({
        // pageSize: this.pageSize || 10,
        // pageNumber: this.pageNo || 1,
        // FIXME:换了下位置
        ...this.outerParams,
        ...searchData,

        ...params
      })

      if (categoryId && params.parentId == null) {
        params.categoryId = categoryId
      }
      if (!this.tree) {
        params.pageSize = this.pageSize || 10
        params.pageNumber = this.pageNo || 1
      }

      this.tableLoading = true
      this.loadData(params)
        .then(data => {
          this.tableLoading = false

          let { rows, total, pageSize, pageNo } = data
          if (this.tree) {
            rows = data
          }
          this.total = total
          this.pageSize = pageSize
          this.pageNo = pageNo
          this.tableData = rows
          // if (rows.length && this.fixedH) {
          //   setTimeout(() => {
          //     this.$nextTick(() => {
          //       this.handlerResize()
          //     })
          //   })
          // }
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
      this.$emit('update:outerParams', {})
      this.$refs.tree && this.$refs.tree.setCurrentKey(null)
      this.selectedTreeNode = null
      this.$nextTick(() => {
        this.getList()
      })
    },
    // 刷新树列表，并设置选中
    refreshTree() {
      const currentKey = this.$refs.tree.getCurrentKey()
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
        this.$nextTick(() => {
          setTimeout(() => {
            this.$refs.tree.setCurrentKey(currentKey)
          }, 100)
        })
      })
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList({
        pageNumber: val,
        pageSize: this.pageSize
      })
    },
    handleSizeChange(val) {
      this.pageNo = 1
      this.pageSize = val
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
      console.log(node)
      this.leftLoading = true
      this.loadNode(node)
        .then(data => {
          this.leftLoading = false
          let _data = data.map(el => ({ ...el, isLeaf: !el.hasChild }))
          resolve(_data)
        })
        .catch(err => {
          console.error(err)
          this.$message.error('加载出错')
        })
    },
    handleTreeCurrentChange(data, node) {
      if (data[this.nodeKey] == null && this.treeCrud) {
        return
      }
      if (data._edit) {
        return
      }
      this.selectedTreeNode = node
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
    // margin-right: 10px;
    // padding-right: 10px;
    border-right: 1px solid #eee;
    transition: all 0.25s ease-in-out;
    .tree-wrapper {
      margin-right: 10px;
    }
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
    margin-left: 10px;
    transition: all 0.25s ease-in-out;
    .search-card {
      margin-top: 12px;
      .search {
        display: flex;
        margin-bottom: 8px;
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
.custom-tree-node {
  .el-input--mini .el-input__inner {
    line-height: 26px;
    height: 26px;
  }
}
.search .el-form-item__label {
  font-size: 12px;
}
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
