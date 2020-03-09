<template>
  <div class="main-layout">
    <div v-if="$slots.top" class="mb10">
      <slot name="top"></slot>
    </div>
    <ElRow :gutter="20">
      <ElCol class="left" v-if="leftTree" :span="!toggleLeft ? 0 : leftSpan">
        <slot name="left">
          <!-- <div style="margin-bottom:10px">
            <el-input size="small" v-model="leftTreeSearchVal" suffix-icon="el-icon-search"></el-input>
          </div>-->
          <el-autocomplete
            class="search-input"
            size="mini"
            style="margin-bottom:10px"
            v-model="filterText1"
            :disabled="autoDisabled"
            :debounce="500"
            :fetch-suggestions="querySearch"
            placeholder="请输入内容"
            :highlight-first-item="true"
            @select="handleSelectSearch"
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
          <!-- 完 -->
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
        </slot>
        <div v-if="leftTree" class="drawer-btn inner" @click="toggleLeft = !toggleLeft">
          <i :class="toggleLeft ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
        </div>
      </ElCol>
      <div
        v-if="leftTree"
        v-show="!toggleLeft"
        class="drawer-btn outer"
        :style="{'left': arrowLeft}"
        @click="toggleLeft = !toggleLeft"
      >
        <i :class="toggleLeft ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
      </div>

      <!-- 自定义展示内容 -->
      <ElCol :span="!toggleLeft ? 24 : leftTree ? (24-leftSpan) : 24" v-if="isShowCustomContent">
        <slot name="customContent"></slot>
      </ElCol>
      <!-- 完 -->
      <ElCol
        :class="['right', {'is-simple': simple}]"
        :span="!toggleLeft ? 24 : leftTree ? (24-leftSpan) : 24"
        v-if="!isShowCustomContent"
      >
        <template>
          <CollapseWrapper v-if="Object.keys(searchFields).length" :backBtn="backBtn" :expand="expand" class="mb10">
            <slot name="search" :data="searchData">
              <div class="table-search" ref="tableSearch">
                <new-form
                  search
                  :form-schema="currentSearchFields"
                  ref="search"
                  v-model="searchData"
                  @search="handleSearch"
                  @close="calcIsHidden"
                  label-width="80px"
                >
                  <!-- <div ref="searchWrapper" v-if="!simple">
                    <ElButton class="mr10 mb10" type="primary" size="small" @click="saveNormal">保存为常用筛选条件</ElButton>
                    <el-dropdown v-if="Object.keys(selSearchFields).length" trigger="click" @command="handleSearchCmd">
                      <ElButton plain type="primary" size="small">
                        其它筛选条件
                        <i class="el-icon-arrow-down el-icon--right"></i>
                      </ElButton>
                      <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item
                          :command="item"
                          v-for="(item, searchIdx) in selSearchFields"
                          :key="searchIdx"
                        >{{item.label}}</el-dropdown-item>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </div>
                  <ElButton v-else class="mr10 mb10" type="primary" size="small" @click="getList(searchData)">搜索</ElButton>-->
                </new-form>
                <el-button
                  class="showMoreBtn"
                  @click="setFormItemHidden"
                  type="text"
                  :icon="`el-icon-arrow-${hiddenMore ? 'up' : 'down'} el-icon--right`"
                  v-show="showSearchMoreBtn"
                ></el-button>
              </div>
            </slot>
          </CollapseWrapper>
        </template>

        <!-- 下方标签页 -->
        <div class="tabs mb10">
          <el-tabs v-if="tabs.length" @tab-click="handleTabClick" v-model="activeTab">
            <el-tab-pane
              v-for="item in tabs"
              :label="`${item.name} ( ${item.num} )`"
              :key="item.name"
              :item="item"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
          <!-- 最上面的按钮 -->
          <div v-else-if="!simple || hiddenTopBtn" class="top-btn">
            <!-- 左边批量 -->
            <div class="top-btn-left">
              <el-cascader
                v-if="topBatchData.options.length"
                :value="topBatchBtnVal"
                :props="topBatchData.props"
                :placeholder="topBatchBtnText"
                :options="topBatchData.options"
                @change="handleTopLeftBatchChange"
                popper-class="top-btn-cascader-wrapper"
              ></el-cascader>
              <slot name="topleft"></slot>
            </div>

            <!-- 右边批量操作按钮 -->
            <div class="btns" v-if="hasPermRightEditBtns">
              <template v-for="(item, index) in hasPermRightEditBtns">
                <el-dropdown
                  v-if="item.type === 'dropdown'"
                  :key="index"
                  split-button
                  type="primary"
                  plain
                  class="right-dropdown"
                  @click="item.btns[0].fn(selection)"
                  @command="handleCommand"
                >
                  {{item.btns[0].name}}
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="n in item.btns.slice(1)" :key="n.name" :command="n.fn">{{n.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <ElButton
                  class="ml10"
                  :loading="item.showLoading ? item.loading : false"
                  v-else-if="item.show === undefined ? true : typeof item.show === 'function' ? item.show() : item.show"
                  :key="index"
                  type="primary"
                  :icon="item.icon"
                  :disabled="typeof item.disabled === 'function' ? item.disabled(selection) : false"
                  @click="handleBtnClick(item)"
                >{{item.nameFn ? item.nameFn() : item.name}}</ElButton>
              </template>
            </div>

            <!-- 最上面的按钮 end -->
          </div>
        </div>

        <!-- 下方标签页 end -->
        <div class="table-wrapper">
          <slot name="table">
            <el-popover placement="bottom" trigger="click" class="custom-pop">
              <div class="rowCheckbox">
                <ElCheckboxGroup v-model="currentRow">
                  <ElCheckbox v-for="item in allRow" :key="item.label" :label="item.label"></ElCheckbox>
                </ElCheckboxGroup>
              </div>
              <div class="list-btn-wrapper" slot="reference">
                <el-button class="list-btn" type="text" icon="icon-caidan iconfont"></el-button>
                <div v-if="restRowNum" class="num-tags">{{restRowNum}}</div>
              </div>
            </el-popover>
            <yt-table
              v-bind="$attrs"
              :selection="showSelection === false ? false : radioMode !== false ? 'radio' : 'checkbox'"
              :checkStrictly="checkStrictly"
              @select="handleSelect"
              :treeTable="treeTable"
              :treeColor="treeTable"
              :stripe="!treeTable"
              :cellStyle="cellStyle"
              :treeStripe="treeTable"
              :treeTableOtions="treeTableOtions"
              v-loading="tableLoading"
              :tableLoading="tableLoading"
              @sortChange="sortChange"
              @selectChange="selectChange"
              :data="url?tableList:outerTableList"
              :tableRowClassName="tableRowClassName"
              :columns="columns"
              :reserve-selection="reserveSelection"
              ref="table"
              v-if="showTable"
            >
              <template slot="right">
                <el-table-column label="操作" align="left" fixed="right" :width="editWidth" v-if="edits.length">
                  <template slot-scope="scope">
                    <slot v-if="showError !== false && showError(scope)" :row="scope.row" name="errorMsg"></slot>
                    <template v-else>
                      <template v-if="scope.row.btns ? (scope.row.btns.length > 1) : (edits.length > 1)">
                        <el-dropdown
                          split-button
                          class="item-btn"
                          type="text"
                          @click="edits[scope.row.btns ?scope.row.btns[0] :0].fn(scope)"
                          @command="handleEditCommand"
                        >
                          {{edits[scope.row.btns ?scope.row.btns[0] :0].name}}
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              v-for="(item, index) in (scope.row.btns ? scope.row.btns.slice(1) : edits.slice(1))"
                              :command="{item:scope.row.btns ? edits[item]: item , scope}"
                              :key="index"
                            >{{scope.row.btns ? edits[item].name : item.name}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </template>

                      <el-button
                        class="item-btn"
                        v-else-if="scope.row.btns && edits[scope.row.btns[0]]"
                        size="small"
                        @click="edits[scope.row.btns ?scope.row.btns[0] :0].fn(scope)"
                        type="primary"
                        plain
                      >{{edits[scope.row.btns ?scope.row.btns[0] :0].name}}</el-button>
                    </template>
                    <!-- {{edits[scope.row.btns[0]]}} -->
                  </template>
                </el-table-column>
              </template>
            </yt-table>
          </slot>
        </div>

        <el-pagination
          class="pagination mt10 mb10"
          background
          v-if="isShowPag && total"
          :total="total"
          :current-page="pageNo"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          :page-sizes="[10, 20, 30, 40, 50]"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </ElCol>
    </ElRow>

    <Dialog
      :opts="innerDialogOpts"
      :copyText="dialogComponent.copyText"
      :events="events"
      @fullscreen="fullscreen"
      ref="Dialog"
      @close="innerDialogOpts.visible = false"
    >
      <transition-type v-if="innerDialogOpts.visible" name="fadeIn-fadeOut">
        <component
          :is="dialogComponent.component"
          @dialogSuccess="dialogSuccess"
          v-bind="dialogComponent.params"
          @toBottom="toBottom"
          ref="component"
        ></component>
      </transition-type>
      <template slot="footer">
        <slot name="footer"></slot>
      </template>
    </Dialog>
    <el-button ref="copyBtn" style="display:none" :data-clipboard-text="passText">复制</el-button>
  </div>
</template>

<script>
import Clipboard from 'clipboard'
import Dialog from './dialog'
import _merge from 'lodash/merge'
import { debounce } from 'throttle-debounce'
import _camelCase from 'lodash/camelCase'

const topBatchDefault = {
  // 应用于 里显示的标题
  title: '产品',
  //
  props: {
    label: 'label',
    value: 'label',
    expandTrigger: 'hover'
  },
  options: [],
  // 搜索
  search: {
    field: 'sku',
    placeholder: '请输入仓库SKU、系统SKU、中英文名称'
  }
}

export default {
  name: 'NewMainLayout',
  inheritAttrs: false,
  components: {
    Dialog
  },
  props: {
    showError: {
      default: false
    },
    btnFn: Function,
    // 左侧树加载函数，返回promise
    loadNode: {
      type: Function,
      // required: true,
      default: () => Promise.resolve([])
    },
    cellStyle: Function,
    tableRowClassName: Function,
    // 是否隐藏上方批量按钮
    hiddenTopBtn: {
      default: false,
      type: Boolean
    },
    // 单选表格模式
    radioMode: {
      default: false
    },
    // 表格有checkbox时是否遵循父子不关联，默认勾选父不勾选子，如果false则勾选父时会勾选子
    checkStrictly: {
      default: true,
      type: Boolean
    },
    leftTree: {
      type: [Object, Boolean]
      // {
      //   props: {
      //     label: 'name',
      //     children: 'zones',
      //     isLeaf: 'leaf'
      //   },
      //   // 要传给后端的搜索数据
      //   dataFn(data) {
      //     return { name: data.name }
      //   },
      //   // 懒加载
      //   loadNode(node, resolve) {
      //     if (node.level === 0) {
      //       return resolve([{ name: 'region' }])
      //     }
      //     if (node.level > 1) return resolve([])

      //     setTimeout(() => {
      //       const data = [
      //         {
      //           name: 'leaf',
      //           leaf: true
      //         },
      //         {
      //           name: 'zone'
      //         }
      //       ]

      //       resolve(data)
      //     }, 500)
      //   }
      // }
    },
    tabs: {
      type: Array,
      default: () => [
        // {
        //   name: "正常",
        //   num: 10,
        //   query: {
        //     status: 0
        //   }
        // },
        // {
        //   name: "基本信息待编辑",
        //   num: 2,
        //   query: {
        //     status: 1
        //   }
        // }
      ]
    },
    // 表格上层批量操作按钮
    topBatchBtn: {
      type: Object,
      default: () => ({})
    },
    isShowTableLoading: {
      default: true
    },
    showWdg: {
      default: true
    },
    //搜索条件是否展开
    expand: {
      default: false
    },
    isShowCustomContent: {
      default: false
    },
    simple: {
      default: false
    },
    showTable: {
      default: true
    },
    // tableSelection: {
    //   default: true
    // },
    leftSpan: {
      default: 3,
      type: Number
    },
    showSearch: {
      default: true
    },
    searchFunc: Function,
    backBtn: {
      default: false
    },
    // 排序参数处理函数
    sortableFunc: {
      type: Function,
      default: ({ prop, order }) => {
        //debugger
        // prop =
        //   prop &&
        //   prop.replace(/[A-Z]/g, function(match) {
        //     return '_' + match.toLowerCase()
        //   })
        return {
          sorted: order && (order === 'ascending' ? 'asc' : 'desc'),
          field: prop
        }
      }
    },
    // 是否为树型表格
    treeTable: {
      type: Boolean,
      default: false
    },
    // 树型表格选项
    treeTableOtions: {
      type: Object,
      default: () => ({
        // 后端放置子数据的位置
        childs: 'children',
        expandFunc: row => {
          return row.count <= 1
        }
      })
    },
    // 树型表格下级是否显示颜色
    treeColor: {
      type: [Boolean, String],
      default: true
    },
    // 外部请求参数
    outerParams: {
      default: () => ({
        __default: true
      })
    },
    //外部传入的表格数据
    outerTableList: {
      default: () => []
    },
    // 外部传入弹窗的事件
    outerEvents: {
      default: () => ({})
    },
    // 外部传入弹窗的属性
    outerDialogOtions: {
      default: () => ({})
    },
    // 右边编辑栏总宽度
    editWidth: {
      default: 140
    },
    // 修正表格数据函数
    fixedPageFunc: Function,
    // 表格请求api名称
    url: String,
    // 右侧编辑按钮
    editBtns: {
      // required: true,
      default: () => []
    },
    // 搜索栏表单
    searchFields: {
      required: false,
      default: () => ({})
    },

    // // 搜索栏默认数据
    searchDefaultData: {
      // required: true,
      default: () => ({})
    },
    // 右边的按钮
    rightEditBtns: {
      // required: true,
      default: () => []
    },
    // 表格列展示
    columns: {
      //required: true,
      default: () => []
    },
    isShowPag: {
      default: true
    },
    //是否自定义展示列表
    customDisplay: {
      type: Boolean,
      default: false
    },
    //操作栏是在左还是右
    handleLeft: {
      type: Boolean,
      default: false
    },
    //根据需求自定义的返回按钮
    customHandleBack: {
      type: Object,
      default: () => ({
        isShow: false,
        fn: null
      })
    },
    //表格数据更新反选的配置
    reserveSelection: {
      type: String,
      default: ''
    },
    showSelection: {
      type: Boolean,
      default: true
    },
    arrowLeft: {
      type: String,
      default: '-2px'
    },
    value: {
      type: Array,
      default: () => []
    }
  },
  data() {
    let vm = this
    return {
      selectedTreeNode: null,
      autoDisabled: false,
      filterText1: '',
      passText: '',
      refresh: true,
      treeProps: {
        label: 'name',
        children: 'childs',
        isLeaf: 'isLeaf'
      },
      currentQuery: {},
      leftTreeSearchVal: '',
      leftTreeData: [],
      topBatchSearchVal: null,
      activeTab: null,
      hiddenMore: false,
      showSearchMoreBtn: false,
      topBatchBtnVal: [],
      toggleLeft: false,
      sortData: {},
      ytTableShow: true,
      searchData: this.searchDefaultData,
      selection: [],
      innerDialogOpts: {
        visible: false,
        size: null,
        width: null,
        closeOnClickModal: false,
        title: null,
        okBtnText: '',
        fullscreen: false,
        cancelBtnText: '',
        showMaxBtn: false
      },
      check: [],
      dialogComponent: {},
      // dialogOpts:{
      //   visible: false
      // },
      innerEvents: {
        open() {
          setTimeout(() => {
            vm.$nextTick(() => {
              // 弹窗里的组件
              let component = vm.$refs.component
              if (!component) {
                return
              }
              // 调用组件初始化函数
              component && component._initData && component._initData()
            })
          })
        },
        close() {
          // 弹窗里的组件
          let component = vm.$refs.component
          // 调用组件关闭函数
          component && component._close && component._close()
        },
        handleOkClick() {
          let component = vm.$refs.component
          // if (!component) {
          //   return
          // }
          if (!component._submit) {
            throw new Error('确保弹窗组件内定义了_submit方法')
          }
          let res = component._submit()
          if (!res || !res.then) {
            return Promise.reject()
          }
          // _submit方法最好返回promise, 如果是reject，弹窗不会关闭，如果是resolve("close")，弹窗会关闭且不刷新列表，否则会刷新列表
          return res.then(res => {
            if (res && res !== 'close') {
              vm.clearSelection()
              vm.innerDialogOpts.visible = false
              vm.getList(undefined, res === 'reset')
            }
            if (res === 'close') {
              vm.innerDialogOpts.visible = false
            }
          })
        }
      },

      pageSize: 10,
      pageNo: 1,
      total: null,
      tableList: [],
      tableLoading: false,

      checkBoxOpt: [], //自定义展示列表选择器option,
      backShowData: []
    }
  },
  computed: {
    saveName() {
      let user = this.$store.state.auth
        ? this.$store.state.auth.userInfo
        : this.$store.state.userInfo
      return `${_camelCase(this.$route.path)}:${user.username}`
    },
    edits() {
      return this.editBtns
    },
    // 所有展示的列
    allRow() {
      let data = this.columns || []
      return data.reduce((total, cur) => {
        return total.concat(
          cur.type === 'array'
            ? cur.children.map(el => ({ label: el.label, show: el.show }))
            : [{ label: cur.label, show: cur.show }]
        )
      }, [])
    },
    currentRow: {
      get() {
        return this.allRow.filter(el => el.show !== false).map(el => el.label)
      },
      set(val) {
        const setShow = _el => {
          if (val.indexOf(_el.label) > -1) {
            this.$set(_el, 'show', true)
          } else {
            this.$set(_el, 'show', false)
          }
        }
        this.columns.forEach(el => {
          if (el.type === 'array') {
            el.children.forEach(_el => {
              setShow(_el)
            })
          } else {
            setShow(el)
          }
        })
      }
    },

    restRowNum() {
      return this.allRow.length - this.currentRow.length
    },

    // 当前展示的筛选条件
    currentSearchFields() {
      // let ret = {}
      // Object.keys(this.searchFields).forEach(key => {
      //   let el = this.searchFields[key]
      //   if (!el.hidden) {
      //     ret[key] = el
      //   }
      // })
      return this.searchFields
    },
    // 当前未展示的筛选条件
    selSearchFields() {
      if (this.simple) {
        return this.searchFields
      }
      let ret = {}
      Object.keys(this.searchFields).forEach(key => {
        let el = this.searchFields[key]
        if (el.hidden) {
          ret[key] = el
          this.$set(el, '_close', true)
        }
      })
      return ret
    },
    hasPermRightEditBtns() {
      //debugger
      let btns = this.rightEditBtns,
        ret = []
      btns.forEach(el => {
        if (el.type === 'dropdown') {
          let btns = el.btns.filter(
            e =>
              this.hasPerm(e.perm) &&
              (e.show === undefined
                ? true
                : typeof e.show === 'function'
                ? e.show()
                : e.show)
          )
          if (btns.length == 0) {
            return
          }
          if (btns.length == 1) {
            ret.push(btns[0])
            return
          }
          ret.push({ ...el, btns })
        } else {
          if (this.hasPerm(el.perm)) {
            ret.push(el)
          }
        }
      })

      return ret
    },
    topBatchData() {
      return _merge({}, topBatchDefault, this.topBatchBtn)
    },
    topBatchBtnText() {
      return `批量应用于选定的${this.selection.length}${this.topBatchData.title}`
    },
    searchTrueData() {
      if (!this.outerParams) {
        return {
          __default: true
        }
      }
      if (this.simple) {
        return Object.assign({}, this.outerParams)
      }
      return Object.assign({}, this.outerParams)
    },
    events() {
      return Object.assign(this.innerEvents, this.outerEvents)
    },
    selectData: {
      get() {
        return [...this.selection, ...this.backShowData]
      },
      set(val) {
        this.$emit('input', val)
      }
    }
  },
  created() {
    let vm = this
    // 在有左侧树的情况下， 获取dataPromise中的Promise值并设置到data中
    // if (this.leftTree) {
    //   if (this.leftTree.loadNode) {
    //     this.leftTreeData = []
    //   } else {
    //     this.getLeftTreeData()
    //   }
    // }
    // 如果存在保存的筛选条件，则设置筛选条件
    if (
      !this.simple &&
      this.searchFields &&
      Object.keys(this.searchFields).length
    ) {
      const saveData = this.$storage.get('local', this.saveName)
      if (saveData) {
        Object.assign(this.searchData, saveData || {})
        Object.keys(this.searchFields).forEach(key => {
          if (key in this.searchData) {
            if (this.searchFields[key].hidden === true) {
              this.searchFields[key]._close = true
            }
            this.searchFields[key].hidden = false
          }
        })
      }
    }

    // 保存初始搜索值 ，用于重置搜索
    this.$options.searchData = JSON.stringify(this.searchData)

    // 如果 有tabs页的话，会设置tabs中的参数到路由参数中，确保每次请求和刷新页面都会在当前标签页
    if (
      Object.keys(this.$route.query).length &&
      this.tabs &&
      this.tabs.length
    ) {
      const active = this.tabs.filter(el => {
        let q = el.query,
          flag = true
        for (const key in q) {
          if (q.hasOwnProperty(key)) {
            if (q[key] != vm.$route.query[key]) {
              flag = false
            }
          }
        }
        return flag
      })[0]

      this.activeTab = active
        ? active.name
        : this.tabs.length && this.tabs[0].name
      this.currentQuery = active
        ? active.query
        : this.tabs.length && this.tabs[0].query
    } else {
      this.activeTab = this.tabs.length && this.tabs[0].name
      this.currentQuery = this.tabs.length && this.tabs[0].query
    }

    this.$watch(
      'searchTrueData',
      function handler(newVal, oldVal) {
        function setTime() {
          vm.tableLoading = true
          if (vm.timer) {
            clearTimeout(vm.timer)
          }
          vm.timer = setTimeout(
            () => {
              vm.pageNo = 1
              vm.getList()
            },
            vm.timer ? 160 : 0
          )
        }
        if (
          newVal.__default ||
          Object.keys(this.$.dealObjectValue(newVal)).length
        ) {
          setTime()
          return
        }

        if (
          JSON.stringify(newVal) !== JSON.stringify(oldVal) &&
          oldVal != null
        ) {
          setTime()
        }
      },
      {
        deep: true,
        immediate: true
      }
    )

    this.bindEvent()
  },
  mounted() {
    if (!this.simple) {
      this.debounceResizeHandler = debounce(300, this.resizeHandler)
      this.$nextTick(() => {
        window.addEventListener('resize', this.debounceResizeHandler)
      })
    }
  },
  beforeDestroy() {
    if (!this.simple) {
      return
    }
    window.removeEventListener('resize', this.debounceResizeHandler)
    this.debounceResizeHandler = null
  },
  watch: {
    leftTreeSearchVal(val) {
      this.$refs.tree.filter(val)
    }
    // searchTrueData: {
    //   immediate: true,
    //   deep: true,
    //   handler(newVal, oldVal) {

    //     if ((newVal.__default || Object.keys(this.$.dealObjectValue(newVal)).length)) {
    //       this.getList()
    //     }

    //     if (
    //       JSON.stringify(newVal) !== JSON.stringify(oldVal) &&
    //       oldVal != null
    //     ) {
    //       this.getList()
    //     }
    //   }
    // }
  },
  methods: {
    getCheckedData() {
      return this.selection
    },
    // handleSearch() {
    //   this.pageNo = 1
    //   this.getList()
    // },
    refreshTree() {
      this.refresh = false
      this.$nextTick(() => {
        this.refresh = true
      })
    },
    clearAndGetlist() {
      this.pageNo = 1
      this.$refs.tree.setCurrentKey(null)
      this.selectedTreeNode = null
      this.$emit('clear')
      this.getList()
    },
    getHighLightName(name) {
      return name.replace(
        this.filterText1,
        '<b style="color:#67c23a">' + this.filterText1 + '</b>'
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
        .catch(() => {
          this.leftLoading = false
          // this.$message.error('加载出错')
        })
    },
    // 保存为常用筛选条件
    saveNormal() {
      this.$storage.set('local', this.saveName, this.searchData)
      this.$message.success('保存成功')
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
    handleTreeCurrentChange(data, node) {
      this.selectedTreeNode = node
      //
      this.pageNo = 1
      this.getList()
      this.$emit('treeCurrentChange', data, node)
    },
    // 渲染函数
    renderContent(h, { data }) {
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
        .catch(() => {
          cb([{ name: '暂无搜索结果.' }])
        })
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
    async handleSelectSearch(data) {
      let tree = this.$refs.tree
      let { categoryId, categoryMap } = data
      let selNode = tree.getNode(categoryId)
      if (!categoryMap) {
        // 如果存在node 直接设置选中
        tree.setCurrentKey(categoryId)
        this.handleTreeCurrentChange(selNode.data, selNode)
      } else {
        // 如果不存在， 一个个加载出来
        let parentList = categoryMap[categoryId]
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
    // 编辑子节点
    edit(data) {
      let { name } = data
      this.handleCopy(name)
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
    createNode() {},
    getLeftTreeData() {
      this.leftTree.dataPromise().then(data => {
        this.leftTreeData = data
      })
    },
    handleEditCommand({ item, scope }) {
      item.fn.apply(this, [scope])
    },
    handleTabClick(tab) {
      this.$nextTick(() => {
        this.$router.push({
          path: this.$route.path,
          query: tab.$attrs.item.query
        })
        this.$nextTick(() => {
          this.getList(tab.$attrs.item.query)
        })
      })
    },
    resizeHandler() {
      this.calcIsHidden()
    },
    handleSearchCmd(item) {
      this.$refs.search.setInnerChange(true)
      Object.keys(this.searchFields).forEach(key => {
        const el = this.searchFields[key]
        if (!item.hidden) {
          return
        }
        item.hidden = el !== item
      })
      this.$refs.search.setInnerChange(false)

      this.calcIsHidden(true)
    },
    setStyle(el, obj) {
      if (typeof obj === 'object') {
        for (var s in obj) {
          var cssArrt = s.split('-')
          for (var i = 1; i < cssArrt.length; i++) {
            cssArrt[i] = cssArrt[i].replace(
              cssArrt[i].charAt(0),
              cssArrt[i].charAt(0).toUpperCase()
            )
          }
          var cssArrtnew = cssArrt.join('')
          el.style[cssArrtnew] = obj[s]
        }
      } else if (typeof obj === 'string') {
        el.style.cssText = obj
      }
    },

    getWidth(el, isTable = false) {
      if (!el) return
      let width
      if (el.$el) {
        el = el.$el
      }
      if (this.getStyle(el, 'display') !== 'none' || isTable) {
        width = el.offsetWidth

        return (
          width +
          parseInt(this.getStyle(el, 'marginLeft')) +
          parseInt(this.getStyle(el, 'marginRight'))
        )
      } else {
        var _addCss = {
          display: '',
          position: 'absolute',
          visibility: 'hidden'
        }
        var _oldCss = {}
        for (var i in _addCss) {
          _oldCss[i] = this.getStyle(el, i)
        }
        this.setStyle(el, _addCss)
        width = el.clientWidth || el.offsetWidth
        for (i in _oldCss) {
          this.setStyle(el, _oldCss)
        }

        return width
      }
    },

    getStyle(obj, name) {
      if (!obj) return
      if (obj.currentStyle) {
        //IE
        return obj.currentStyle[name]
      } else {
        return getComputedStyle(obj, false)[name] //非IE
      }
    },

    getFormWidth(el) {
      if (el.$el) {
        el = el.$el
      }
      return [].reduce.call(
        el.children,
        (total, cur) => (total += this.getWidth(cur)),
        0
      )
    },

    getTableSearchElInnerWidth() {
      const { tableSearch } = this.$refs

      return (
        this.getWidth(tableSearch, true) -
        parseInt(this.getStyle(tableSearch, 'paddingLeft')) -
        parseInt(this.getStyle(tableSearch, 'paddingRight'))
      )
    },

    // 计算是否隐藏，出现下拉
    calcIsHidden(other = false) {
      const { searchText, search } = this.$refs
      let vm = this
      setTimeout(() => {
        // console.log(
        //   vm.getFormWidth(search),
        //   vm.getWidth(searchText),
        //   vm.getTableSearchElInnerWidth()
        // )

        if (
          search &&
          vm.getTableSearchElInnerWidth() <
            vm.getFormWidth(search) + vm.getWidth(searchText)
        ) {
          // console.log('换行了')
          vm.showSearchMoreBtn = true
          vm.hiddenMore = false
          vm.setFormItemHidden(other)
        } else {
          vm.showSearchMoreBtn = false
          vm.hiddenMore = false
          vm.setFormItemHidden()
        }
      })
    },

    // 设置多出的输入框隐藏
    setFormItemHidden() {
      let vm = this
      let tableInnerWidth = this.getTableSearchElInnerWidth()
      const { searchText, search, searchWrapper } = this.$refs
      search &&
        [].reduce.call(
          search.$el.children,
          (total, cur) => {
            total += vm.getWidth(cur)
            if (
              total + vm.getWidth(searchText) + vm.getWidth(searchWrapper) >
                tableInnerWidth &&
              cur.className.indexOf('inline-btn') === -1
            ) {
              // 加起来的长度大于总长，隐藏
              cur.style.display = 'none'
            }
            if (!this.hiddenMore) {
              // 如果是显示
              cur.style.display = 'block'
            }
            return total
          },
          0
        )
      if (!this.hiddenMore) {
        this.hiddenMore = true
        return
      }
      this.hiddenMore = false
    },
    hasPerm(name) {
      if (this.$route.meta.perms && Array.isArray(this.$route.meta.perms)) {
        return this.$route.meta.perms.indexOf(name) > -1
      }
      return true
    },
    handleTopLeftBatchChange(val) {
      this.topBatchBtnVal = []
      if (!this.selection.length) {
        return this.$message.warning('请选择一项进行操作')
      }
      this.$emit('left-batch-change', val, this.selection)
    },
    handleBtnClick(item) {
      if (item.showLoading) {
        this.$set(item, 'loading', true)
      }
      const done = () => {
        item.loading = false
      }
      let res = item.fn()
      if (res && res.then) {
        res
          .then(() => {
            done()
          })
          .catch(() => {
            done()
          })
      }
      return res
    },
    handleCommand(fn) {
      fn(this.selection)
    },
    //接受弹框里的组件的方法
    dialogSuccess() {
      //console.log(1);
      this.$emit('dialogSuccess')
    },
    toBottom() {
      this.$refs.Dialog.toBottom()
    },
    fullscreen(type) {
      //如果有echarts组件并且定义echratsResize方法就调用
      this.$refs.component.echratsResize &&
        this.$refs.component.echratsResize(type)
    },
    closeDialog() {
      this.innerDialogOpts.visible = false
    },
    resetSort() {
      this.$refs.table.$refs.table.clearSort()
    },
    handleToggleMainlayout(show) {
      this.innerDialogOpts.visible = show
    },
    handleMainlayoutloading(loading) {
      this.tableLoading = loading
    },
    bindEvent() {
      // eslint-disable-next-line no-undef
      GLOBAL.vbus.$on('toggle.mainlayoutDialog', this.handleToggleMainlayout)
      // eslint-disable-next-line no-undef
      GLOBAL.vbus.$on('mainlayout.loading', this.handleMainlayoutloading)
      // eslint-disable-next-line no-undef
      GLOBAL.vbus.$on('table.btn.loading', this.closeBtnloading)
    },
    closeBtnloading() {
      this.hasPermRightEditBtns.map(el => {
        el.loading = false
      })
    },
    handleBack() {
      const matched = this.$route.matched
      const len = matched.length
      const backRoute = matched[len - 2]
      this.$router.push({
        name: backRoute.name,
        query: backRoute.query,
        params: backRoute.params
      })
    },
    sortChange({ column, prop, order }) {
      let params = this.sortableFunc({ column, prop, order })
      this.sortData = params
      this.getList(params)
    },
    selectChange(val) {
      this.$emit('selectChange', val)
      this.selection = val
      this.initBackShow()
    },
    // 弹窗
    $dialog({
      title,
      width,
      size,
      component,
      okBtnText,
      copyText,
      cancelBtnText,
      params,
      showMaxBtn,
      appendToBody = false,
      ...args
    }) {
      let vm = this
      component().then(com => {
        // console.log(com);
        com.default.inheritAttrs = false
        vm.dialogComponent.component = com.default
        vm.dialogComponent.params = params
        vm.dialogComponent.copyText = copyText
        vm.innerDialogOpts.title = title
        vm.innerDialogOpts.visible = true
        vm.innerDialogOpts.width = width
        vm.innerDialogOpts.appendToBody = appendToBody

        vm.innerDialogOpts.size = size
        vm.innerDialogOpts.okBtnText = okBtnText
        vm.innerDialogOpts.cancelBtnText = cancelBtnText
        vm.innerDialogOpts.showMaxBtn = showMaxBtn
        Object.keys(args).forEach(key => {
          vm.innerDialogOpts[key] = args[key]
        })
      })
    },
    handleSelect(select, row) {
      this.$emit('select', select, row)
    },
    // 搜索按钮
    handleSearch() {
      this.pageNo = 1
      this.getList()
      this.$emit('handleSearch')
    },
    // 分页 pageNo变化
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList()
    },
    // 分页 pageSize变化
    handleSizeChange(val) {
      this.pageSize = val
      this.getList()
    },
    // 清除数据并且不请求数据
    clearSearchData() {
      this.searchData = Object.assign({}, this.searchDefaultData)
      this.resetSort()
    },
    isArrLength(params) {
      return !!(this.$.dataType(params) == 'Array' && params.length)
    },
    //请求列表数据
    getList(_params = {}, resetSearch = false) {
      console.log('获取数据')
      if (resetSearch) {
        this.pageNo = 1
        this.searchData = Object.assign(
          {},
          JSON.parse(this.$options.searchData)
        )
        // return
      }
      let vm = this
      let params = {
        sortOrder: this.pageSize
          ? this.sortData.sort
            ? 'asc'
            : 'desc'
          : undefined,
        pageSize: this.pageSize,
        pageNumber: this.pageNo
      }
      if (this.selectedTreeNode) {
        params.level = this.selectedTreeNode.data.level + 1
        params.parentId = params.categoryId = this.selectedTreeNode.data.categoryId
      } else if (this.leftTree) {
        params.level = 1
        params.parentId = params.categoryId = 0
      }

      params = Object.assign(
        {},
        this.currentQuery,
        params,
        this.outerParams,
        this.searchTrueData,
        this.searchData,
        this.sortData,
        this.$route.query,
        _params
      )

      delete params.__default

      if (this.searchFunc) {
        try {
          params = this.searchFunc(params)
        } catch (error) {
          console.error(error)
        }
      }

      params = this.$.dealObjectValue(params)

      //向父组件发送搜索的条件
      vm.$emit('searchTrueData', params)

      if (!this.url) return

      if (!this.__flag) {
        if (this.isShowTableLoading) vm.tableLoading = true
        vm.$emit('loading', true)
        this.__flag = true
        this.$api[this.url](params, {}, { singleLoading: true })
          .then(res => {
            this.__flag = false
            vm.$emit('loading', false)
            if (vm.isArrLength(vm.selectData)) {
              let { rows = [] } = res
              rows.forEach(item => {
                vm.selectData.forEach(i => {
                  if (item[vm.reserveSelection] == i[vm.reserveSelection]) {
                    if (
                      !vm.selection.find(
                        j => j[vm.reserveSelection] == i[vm.reserveSelection]
                      )
                    ) {
                      vm.$refs.table.$refs.table.toggleRowSelection(item)
                    }
                  }
                })
              })
            }
            if (vm.fixedPageFunc) {
              let page = vm.fixedPageFunc(res)
              let { btns } = res
              let { pageNo = 0, pageSize = 0, rows, total = 0 } = page
              if (btns) {
                rows.forEach((element, index) => {
                  element.btns = btns[index]
                })
              }

              vm.pageNo = pageNo
              vm.pageSize = pageSize
              vm.total = total
              vm.tableList = rows
              vm.tableLoading = false
              vm.$emit('loading', false)
            } else {
              let { pageNo, pageSize, rows, total } = res
              if (Array.isArray(res)) {
                rows = res
              }
              vm.pageNo = pageNo
              vm.pageSize = pageSize
              vm.total = total
              if (this.btnFn) {
                vm.tableList = rows.map(el => {
                  let btns = this.btnFn(el)
                  return {
                    ...el,
                    btns
                  }
                })
              } else {
                vm.tableList = rows
              }
              // vm.tableList = rows
              // vm.tableList = rows.map(el => {
              //   el.btns = null
              //   return el
              // })
              vm.tableLoading = false
              vm.$emit('loading', false)
            }
            //像父组件发送请求成功
            vm.$emit('requestSuccess', true, vm.tableList)
          })
          .catch(error => {
            if (error instanceof Error) {
              console.error(error)
            }
            vm.__flag = false
            vm.$emit('loading', false)
            vm.tableLoading = false
            vm.total = 0
            vm.tableList = []
            //像父组件发送请求成功
            vm.$emit('requestSuccess', true)
          })
      }
    },
    // 处理回显选中数据
    initBackShow() {
      let backShowData = this.backShowData
      let selection = this.selection
      let vm = this
      vm.backShowData = backShowData.filter(item => {
        return JSON.stringify(selection).indexOf(item[vm.reserveSelection]) < 0
      })
    },
    // 清除数据
    clearSelection() {
      return this.$refs.table && this.$refs.table.clearSelection()
    },

    //自定义展示类别选择改变
    handleCheckAllChange(v) {
      this.columns.forEach(i => {
        if (v.includes(i.label)) {
          this.$set(i, 'isShow', false)
        } else {
          this.$set(i, 'isShow', true)
        }
      })
    }
  },
  destroyed() {
    // eslint-disable-next-line no-undef
    GLOBAL.vbus.$off('toggle.mainlayoutDialog', this.handleToggleMainlayout)
    // eslint-disable-next-line no-undef
    GLOBAL.vbus.$off('mainlayout.loading', this.handleMainlayoutloading)
    // eslint-disable-next-line no-undef
    GLOBAL.vbus.$off('table.btn.loading', this.closeBtnloading)
  }
}
</script>

<style lang='scss'>
$leftBgColor: #f6f6f9;
.main-layout {
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
  // background: $leftBgColor;
  .table-wrapper {
    position: relative;
  }
  .custom-pop {
    justify-content: center;
    align-items: center;
    display: flex;
    position: absolute;
    right: 10px;
    top: 0;
    z-index: 10;
  }
  .right {
    min-height: 400px;
    background-color: #fff;
    .right-dropdown {
      margin-left: 10px;
    }
  }
  .left {
    // padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .left .el-tree {
    background-color: transparent;
    margin-top: 10px;
    .el-tree-node__expand-icon:not(.is-leaf) {
      color: #333;
    }
    .el-tree-node__label {
      font-size: 12px;
    }
    .el-tree-node__content {
      span {
        font-size: 12px;
      }
    }
    &.el-tree--highlight-current
      .el-tree-node.is-current
      > .el-tree-node__content {
      background-color: #ecf6fd;
    }
  }
  .list-btn {
    padding: 0;
    margin-top: 10px;
    background: #f5f5f5;
    color: #9e9e9e;
    &:hover {
      color: #666;
    }
    .iconcaidan {
      font-size: 16px;
    }
  }
  .tabs {
    position: relative;
    display: flex;
    align-content: center;
    justify-content: space-between;

    .el-tabs__nav-wrap::after {
      background-color: transparent;
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      height: 28px !important;
      line-height: 28px !important;
      & + .el-tabs__item {
        border-left: 1px solid #ddd;
      }
    }
  }
  .table-search {
    align-items: flex-start;
    color: #666666;
    position: relative;
    .el-checkbox__label {
      font-size: 12px;
    }
    & > span {
      font-size: 12px;
      line-height: 32px;
    }
    display: flex;
    // background: #f3f3f3;
    border-radius: 4px;
    // margin-bottom: 10px;
    // padding: 12px;
    padding-bottom: 0;
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 10px;
    }
    .el-form-item__label {
      font-size: 12px;
      color: #666666;
    }
    .new-form {
      flex: 1;
    }
    .showMoreBtn {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 20px;
      font-weight: bolder;
      padding: 15px;
    }
  }
  .top-btn {
    // margin-bottom: 10px;
    display: flex;
    // margin-right: 10px;
    width: 100%;
    justify-content: space-between;
    align-items: flex-start;
    .btns {
      margin-right: 10px;
      .el-dropdown {
        .el-dropdown__icon {
          font-size: 18px;
          line-height: 11px;
          font-weight: bolder;
        }
      }
    }
    .el-button--primary {
      font-size: 16px;
    }
    .top-btn-left {
      // flex: 0 0 600px;
      display: flex;
      & > * {
        margin-right: 10px;
      }
      .el-button--primary {
        background-color: $titleColor;
        border-color: $titleColor;
      }
      .el-cascader {
        flex: 0 0 200px;
        .el-icon-arrow-down {
          font-size: 18px;
          color: $btnColor;
          font-weight: bolder;
        }
        .el-input:hover {
          .el-icon-arrow-down {
            color: #fff;
          }
        }
        .el-input__inner {
          color: $btnColor;
          background: #f2faff;
          border-color: #d7d7d7;

          &::-moz-placeholder {
            color: #999;
          }
          &:-ms-input-placeholder {
            color: #999;
          }
          &::-webkit-input-placeholder {
            color: #999;
          }
          &:hover {
            background: $btnColor;
            &::-moz-placeholder {
              color: #fff;
            }
            &:-ms-input-placeholder {
              color: #fff;
            }
            &::-webkit-input-placeholder {
              color: #fff;
            }
          }
        }
      }
    }
  }
  .left {
    position: relative;
  }
  .drawer-btn {
    cursor: pointer;
    background-color: $leftBgColor;
    // border: 1px solid #dddddd;
    width: 12px;
    height: 100px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    // right: 0;
    position: absolute;
    top: 200px;
    z-index: 2;
    &.inner {
      right: -6px;
      &:hover {
        background-color: #ddd;
      }
    }
    &.outer {
      left: -2px;
      &:hover {
        background-color: #ddd;
      }
    }
  }

  .el-collapse-item__wrap {
    .el-collapse-item__content {
      margin-bottom: 0 !important;
    }
  }

  .custom_simple_form {
    margin: 0;
  }
  // .btns {
  //   margin: 10px 0;
  // }
  // .el-table--mini {
  //   margin-top: 10px;
  // }
  .el-table--mini th,
  .el-table--mini td {
    font-size: 12px;
    padding: 6px 0;
  }
  .el-table--mini th {
    vertical-align: baseline;
    background: #f5f5f5;
  }

  .pagination {
    margin-top: 8px;
  }
}
.top-btn-cascader-wrapper {
  .el-cascader-menu__wrap {
    // min-height: 400px;
  }
}
.item-btn {
  width: 100%;
  display: block;
  position: relative;
  overflow: hidden;
  border-radius: 3px !important;
  border-color: #adb1b8 #a2a6ac #8d9096 !important;
  color: #333 !important;
  border-style: solid;
  border-width: 1px;
  height: 30px;
  box-shadow: 0 1px 0 rgba(255, 255, 255, 0.6) inset;
  border-radius: 2px;
  background: linear-gradient(to bottom, #f7f8fa, #e7e9ec) !important;
  padding: 2px 15px;
  &.el-dropdown {
    padding: 0;
  }
  .el-button-group {
    height: 28px;
    display: flex;
  }
  .el-button--text {
    color: #333;
    margin-left: 10px;
    .el-dropdown__icon {
      margin-left: 6px;
    }
    &:first-child {
      // width: 100%;
      margin-left: 0;
      flex: auto;
    }
    &:last-child {
      // width: 100%;
      margin-left: 0;
      flex: none;
    }
  }
  // .el-button + .el-button {
  //   f
  // }
  &:active {
    border-color: #adb1b8 #a2a6ac #a2a6ac;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2) inset;
    background-color: #e7e9ec;
    background-image: none;
  }
}
</style>
