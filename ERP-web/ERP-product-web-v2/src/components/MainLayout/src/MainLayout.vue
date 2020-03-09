<template>
  <div class="main-layout">
    <!-- 有返回按钮的插槽 -->
    <slot name="showRefresh" :style="{position:absolute,right:'26px',top:'6px'}">
      <!-- 完 -->
    </slot>
    <!-- 修改全局监控频率插槽 -->
    <slot name="showWarning" style="position:absolute;right:150px;top:6px;">
      <!-- 完 -->
    </slot>

    <ElRow :gutter="20">
      <ElCol class="left" v-if="$slots.left" :span="!toggleLeft ? 0 : leftSpan || 6">
        <slot name="left"></slot>
      </ElCol>
      <div v-if="$slots.left" class="drawer-btn" @click="toggleLeft = !toggleLeft">
        <i :class="toggleLeft ? 'el-icon-caret-left' : 'el-icon-caret-right'"></i>
      </div>

      <!-- 自定义展示内容 -->
      <ElCol :span="!toggleLeft ? 24 : $slots.left ? leftSpan ? (24-leftSpan) : 18 : 24" v-if="isShowCustomContent">
        <slot name="customContent"></slot>
      </ElCol>
      <!-- 完 -->
      <ElCol :span="!toggleLeft ? 24 : $slots.left ? leftSpan ? (24-leftSpan) : 18 : 24" v-if="!isShowCustomContent">
        <template v-if="!simple">
          <div class="btns" v-if="editBtns">
            <template v-for="item in editBtns">
              <ElButton
                class="mb10"
                :loading="item.showLoading ? item.loading : false"
                v-if="item.show === undefined ? true : typeof item.show === 'function' ? item.show() : item.show"
                :key="item.id"
                type="primary"
                size="small"
                :disabled="typeof item.disabled === 'function' ? item.disabled(selection) : false"
                @click="handleBtnClick(item)"
                plain
              >{{item.nameFn ? item.nameFn() : item.name}}</ElButton>
            </template>

            <el-popover v-if="customDisplay" placement="right" width="400" trigger="click">
              <el-checkbox-group v-model="check" @change="handleCheckAllChange">
                <el-checkbox
                  v-for="(item,index) in checkBoxOpt"
                  :label="item.label"
                  :key="item.label"
                  style="width:150px;"
                  :style="{marginLeft:index===0?'30px':''}"
                >{{item.label}}</el-checkbox>
              </el-checkbox-group>
              <el-button type="primary" plain size="small" slot="reference" style="float:right;">自定义列表展示</el-button>
            </el-popover>
          </div>
          <CollapseWrapper :backBtn="backBtn" v-if="showSearch" :expand="expand" class="mb10">
            <slot name="search" :data="searchData">
              <YtForm
                search
                :initialParmas="initialParmas"
                :tableLoading="tableLoading"
                :fields="searchFields"
                ref="search"
                :formData.sync="searchData"
                @search="handleSearch"
                label-width="80px"
              ></YtForm>
            </slot>
          </CollapseWrapper>
        </template>

        <yt-table
          @select="handleSelect"
          :treeTable="treeTable"
          :treeColor="treeTable"
          :stripe="!treeTable"
          :treeStripe="treeTable"
          :treeTableOtions="treeTableOtions"
          v-loading="tableLoading"
          @sortChange="sortChange"
          @selectChange="selectChange"
          border
          :data="url?tableList:outerTableList"
          :columns="columns"
          :selection="showSelection"
          :reserve-selection="reserveSelection"
          ref="table"
          v-if="showTable"
        >
          <template slot="left" v-if="handleLeft">
            <el-table-column label="操作" align="center" :width="editWidth" v-if="edits.length">
              <template slot-scope="scope">
                <template v-for="(item, index) in edits">
                  <template
                    v-if="item.show == null ? true : typeof item.show === 'boolean' ? item.show : item.show(scope)"
                  >
                    <template v-if="!item.childs">
                      <el-button
                        v-if="!item.icon"
                        class="right-btns"
                        type="text"
                        :key="index"
                        @click="item.fn(scope, item)"
                        :icon="item.icon"
                      >item.name</el-button>
                      <el-tooltip :key="index" v-else :content="item.name" placement="top" effect="light">
                        <el-button
                          class="right-btns"
                          type="text"
                          :key="index"
                          @click="item.fn(scope, item)"
                          :icon="item.icon"
                        ></el-button>
                      </el-tooltip>
                    </template>

                    <el-button
                      type="text"
                      v-else-if="(item.childs(scope)).length === 1"
                      :key="index"
                      @click="item.fn(scope, item, (item.childs(scope))[0].name,(item.childs(scope))[0].value)"
                    >{{(item.childs(scope))[0].name}}</el-button>

                    <el-dropdown
                      v-else-if="(item.childs(scope)).length !== 0"
                      :key="index"
                      split-button
                      type="text"
                      @click="item.fn(scope, item,item.name)"
                      @command="c => item.fn(scope, item,c)"
                    >
                      {{(item.childs(scope))[0].name}}
                      <el-dropdown-menu slot="dropdown">
                        <template v-for="(i, subIndex) in (item.childs(scope))">
                          <el-dropdown-item :key="subIndex" v-if="subIndex !==0" :command="i.name">{{i.name}}</el-dropdown-item>
                        </template>
                      </el-dropdown-menu>
                    </el-dropdown>
                  </template>
                </template>
              </template>
            </el-table-column>
          </template>
          <template slot="right" v-else>
            <el-table-column label="操作" :width="editWidth" v-if="edits.length">
              <template slot-scope="scope">
                <template v-for="(item, index) in edits">
                  <template
                    v-if="item.show == null ? true : typeof item.show === 'boolean' ? item.show : item.show(scope)"
                  >
                    <template v-if="!item.childs">
                      <el-button
                        v-if="!item.icon"
                        class="right-btns"
                        type="text"
                        :key="index"
                        @click="item.fn(scope, item)"
                        :icon="item.icon"
                      >item.name</el-button>
                      <el-tooltip :key="index" v-else :content="item.name" placement="top" effect="light">
                        <el-button
                          class="right-btns"
                          type="text"
                          :key="index"
                          @click="item.fn(scope, item)"
                          :icon="item.icon"
                        ></el-button>
                      </el-tooltip>
                    </template>

                    <el-button
                      type="text"
                      v-else-if="(item.childs(scope)).length === 1"
                      :key="index"
                      @click="item.fn(scope, item, (item.childs(scope))[0].name,(item.childs(scope))[0].value)"
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
          </template>
        </yt-table>

        <el-pagination
          background
          v-if="isShowPag"
          :total="total"
          :current-page="pageNo"
          :page-size="pageSize"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
          class="pagination"
          layout="total, sizes, prev, pager, next, jumper"
        ></el-pagination>
      </ElCol>
    </ElRow>

    <Dialog
      :options="innerDialogOpts"
      :copyText="dialogComponent.copyText"
      :events="events"
      @fullscreen="fullscreen"
      ref="Dialog"
      @close="innerDialogOpts.visible = false"
    >
      <transition-type name="fadeIn-fadeOut">
        <component
          v-if="innerDialogOpts.visible"
          :is="dialogComponent.component"
          @dialogSuccess="dialogSuccess"
          :params="dialogComponent.params"
          @toBottom="toBottom"
          ref="component"
        ></component>
      </transition-type>
      <template slot="footer">
        <slot name="footer"></slot>
      </template>
    </Dialog>
  </div>
</template>

<script>
import Dialog from './dialog'
export default {
  name: 'MainLayout',
  inheritAttrs: false,
  components: {
    Dialog
  },
  props: {
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
    leftSpan: Number,
    // 初始化参数
    initialParmas: Object,
    showSearch: {
      default: true
    },
    searchFunc: Function,
    backBtn: false,
    // 排序参数处理函数
    sortableFunc: {
      type: Function,
      default: ({ prop, order }) => {
        //debugger
        prop =
          prop &&
          prop.replace(/[A-Z]/g, function(match) {
            return '_' + match.toLowerCase()
          })
        return {
          sort: order && (order === 'ascending' ? 1 : 0),
          sortField: prop
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
      default: () => ({})
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
      default: 120
    },
    // 修正表格数据函数
    fixedPageFunc: Function,
    // 表格请求api名称
    url: String,
    // 右侧编辑按钮
    edits: {
      // required: true,
      default: () => []
    },
    // 搜索栏表单
    searchFields: {
      required: false,
      default: () => []
    },

    // // 搜索栏默认数据
    outSearchData: {
      // required: true,
      default: () => ({})
    },
    // 上方编辑按钮
    editBtns: {
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
    }
  },
  data() {
    let vm = this
    return {
      toggleLeft: true,
      sortData: {},
      ytTableShow: true,
      searchData: this.outSearchData,
      selection: [],
      innerDialogOpts: {
        visible: false,
        size: null,
        width: null,
        closeOnClickModal: false,
        title: null,
        okBtnText: '',
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
          return (
            component &&
            component._submit &&
            component._submit().then(res => {
              if (res && res !== 'close') {
                vm.clearSelection()
                vm.innerDialogOpts.visible = false
                vm.getList(undefined, res === 'reset')
              }
              if (res === 'close') {
                vm.innerDialogOpts.visible = false
              }
            })
          )
        }
      },

      pageSize: 10,
      pageNo: 1,
      total: 0,
      tableList: [],
      tableLoading: false,

      checkBoxOpt: [] //自定义展示列表选择器option
    }
  },
  activated() {
    // console.log(222);
  },
  computed: {
    searchTrueData() {
      if (!this.searchFunc) {
        return this.searchData
      } else {
        return this.searchFunc(this.searchData)
      }
    },
    events() {
      return Object.assign(this.innerEvents, this.outerEvents)
    }
    // dialogOpts() {
    //   return Object.assign(this.innerDialogOpts, this.outerDialogOtions)
    // }
  },
  created() {
    //debugger
    this.bindEvent()
    if (!this.outerParams && this.siteId) {
      this.getList()
    }
    this.columns.forEach(i => {
      this.check.push(i.label)
      this.checkBoxOpt.push({ label: i.label })
    })
  },
  watch: {
    outerParams: {
      deep: true,
      immediate: true,
      handler(val) {
        if (!Object.keys(val).length) {
          return
        }
        // debugger
        if (this.siteId) {
          this.getList()
        }
      }
    },
    searchTrueData: {
      deep: true,
      handler(val) {
        this.$emit('update:outSearchData', val)
      }
    }
  },
  methods: {
    handleBtnClick(item) {
      if (item.showLoading) {
        this.$set(item, 'loading', true)
      }
      this.$store.state.btnLoading = true
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
      GLOBAL.vbus.$on('toggle.mainlayoutDialog', this.handleToggleMainlayout)
      GLOBAL.vbus.$on('mainlayout.loading', this.handleMainlayoutloading)
      GLOBAL.vbus.$on('table.btn.loading', this.closeBtnloading)
    },
    closeBtnloading() {
      this.editBtns.map(el => {
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
      //console.log({ column, prop, order });
      let params = this.sortableFunc({ column, prop, order })
      this.sortData = params
      this.getList(params)
    },
    selectChange(val) {
      this.selection = val
      this.$emit('selectChange', val)
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
      appendToBody = false
    }) {
      component().then(com => {
        // console.log(com);
        com.default.inheritAttrs = false
        this.dialogComponent.component = com.default
        this.dialogComponent.params = params
        this.dialogComponent.copyText = copyText
        this.innerDialogOpts.title = title
        this.innerDialogOpts.visible = true
        this.innerDialogOpts.width = width
        this.innerDialogOpts.appendToBody = appendToBody
        this.innerDialogOpts.size = size
        this.innerDialogOpts.okBtnText = okBtnText
        this.innerDialogOpts.cancelBtnText = cancelBtnText
        this.innerDialogOpts.showMaxBtn = showMaxBtn
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
      this.searchData = Object.assign({}, this.initialParmas)
      this.resetSort()
    },
    //请求列表数据
    getList(_params = {}, resetSearch = false) {
      let vm = this
      let params = {
        sortOrder: this.sortData.sort ? 'asc' : 'desc',
        pageSize: this.pageSize,
        pageNumber: this.pageNo
      }
      if (resetSearch) {
        this.pageNo = 1
        this.searchData = Object.assign({}, this.initialParmas)
      }
      params = Object.assign(
        {},
        params,
        this.outerParams,
        this.$.dealObjectValue(this.searchTrueData),
        this.sortData,
        _params
      )

      //向父组件发送搜索的条件
      vm.$emit('searchTrueData', params)

      if (!this.url) return
      if (this.isShowTableLoading) vm.tableLoading = true
      vm.$emit('loading', true)
      this.$api[this.url](params, {}, { singleLoading: true })
        .then(res => {
          vm.$emit('loading', false)
          if (vm.fixedPageFunc) {
            let page = vm.fixedPageFunc(res)
            let { buttonList } = res
            let { pageNo = 0, pageSize = 0, rows, total = 0 } = page
            if (buttonList) {
              rows.forEach((element, index) => {
                element.buttonList = buttonList[index]
              })
            }

            vm.pageNo = pageNo
            vm.pageSize = pageSize
            vm.total = total
            vm.tableList = rows
            vm.tableLoading = false
          } else {
            let { pageNo, pageSize, rows, total } = res
            vm.pageNo = pageNo
            vm.pageSize = pageSize
            vm.total = total
            vm.tableList = rows
            vm.tableLoading = false
          }
          //像父组件发送请求成功
          vm.$emit('requestSuccess', true)
        })
        .catch(() => {
          vm.$emit('loading', false)
          vm.tableLoading = false
          vm.total = 0
          vm.tableList = []
          //像父组件发送请求成功
          vm.$emit('requestSuccess', true)
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
    GLOBAL.vbus.$off('toggle.mainlayoutDialog', this.handleToggleMainlayout)
    GLOBAL.vbus.$off('mainlayout.loading', this.handleMainlayoutloading)
    GLOBAL.vbus.$off('table.btn.loading', this.closeBtnloading)
  }
}
</script>

<style lang='scss'>
.main-layout {
  .left {
    position: relative;
  }
  .drawer-btn {
    background-color: #fff;
    border: 1px solid #dddddd;
    width: 15px;
    height: 100px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    // right: 0;
    position: absolute;
    top: 200px;
    z-index: 2000;
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
  //   margin-top: 10px;
  // }
  // .el-table--mini {
  //   margin-top: 10px;
  // }
  .el-table--mini th,
  .el-table--mini td {
    padding: 8px 0;
  }
  .el-table--mini th {
    background: #f5f5f5;
  }
  .right-btns {
    i {
      font-size: 16px;
    }
  }
  .pagination {
    margin-top: 8px;
  }
}
</style>
