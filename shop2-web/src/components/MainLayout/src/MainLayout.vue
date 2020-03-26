<template>
  <div :class="['main-layout', {'has-scroll': scroll, 'show-right-btns': showRightBtns}]">
    <ElRow :gutter="20">
      <ElCol class="left" v-if="leftTree" :span="!toggleLeft ? 0 : leftSpan">
        <slot name="left">
          <div style="margin:10px">
            <el-input size="small" v-model="leftTreeSearchVal" suffix-icon="el-icon-search"></el-input>
          </div>
          <!-- 树形上面的操作按钮 -->
          <div v-if="leftTree.topHandle" style="margin-left:10px;">
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.content"
              placement="top-start"
              v-for="item in leftTree.topHandle"
              :key="item.id"
            >
              <el-button type="text" :icon="item.icon" @click="item.fn" style="font-size: 16px" size="mini"></el-button>
            </el-tooltip>
          </div>
          <!-- 完 -->
          <el-tree
            ref="tree"
            :filter-node-method="filterNode"
            :data="leftTreeData"
            :props="leftTree.props"
            :current-node-key="leftTree.currentKey"
            :node-key="leftTree.nodeKey"
            :show-checkbox="leftTree.showCheckbox"
            highlight-current
            :check-strictly="leftTree.checkStrictly"
            :expand-on-click-node="false"
            :load="leftTree.loadNode"
            @node-click=" leftTree.dataFn($event) ? getList(leftTree.dataFn($event)) : '' "
            :lazy="!!leftTree.loadNode"
          >
            <div slot-scope="{node, data}">
              <!-- treeNodeClass 影藏不能选择的的选择框  -->
              <span
                :style="{fontWeight: node.level < 3 ? 'bolder' : null}"
                :class="{treeNodeClass: leftTree.showClassName && !data.leaf}"
              >
                {{data[leftTree.props.label]}}
                <span v-if="leftTree.props.num">( {{data[leftTree.props.num]}} )</span>
              </span>
            </div>
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
        :class="['right', {'is-simple': simple}, {'no-table': !showTable}]"
        :span="!toggleLeft ? 24 : leftTree ? (24-leftSpan) : 24"
        v-if="!isShowCustomContent"
      >
        <template>
          <!-- <CollapseWrapper :backBtn="backBtn" v-if="showSearch" :expand="expand" class="mb10"> -->
          <slot name="search" v-if="Object.keys(searchFields).length" :data="searchData">
            <div class="table-search" ref="tableSearch">
              <!-- <span v-if="!simple" ref="searchText">筛选条件：</span> -->
              <new-form
                :search="true"
                inline
                :form-schema="currentSearchFields"
                ref="search"
                v-model="searchData"
                @clear="handleSearch"
                @close="handleScClose"
                label-width="80px"
              >
                <div ref="searchWrapper" v-if="!simple">
                  <ElButton class="ml10 mb10" type="primary" plain size="small" @click="saveNormal">保存</ElButton>
                  <el-dropdown v-if="Object.keys(selSearchFields).length" trigger="click" @command="handleSearchCmd">
                    <ElButton plain type="primary" class="ml10" size="small">
                      更多
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
                  <ElButton
                    class="ml10 mb10"
                    type="primary"
                    plain
                    icon="el-icon-search"
                    size="small"
                    :loading="tableLoading"
                    @click="handleSearch"
                  >搜索</ElButton>
                  <ElButton
                    class="ml10 mb10"
                    type="primary"
                    plain
                    icon="el-icon-refresh"
                    size="small"
                    :loading="tableLoading"
                    @click="resetMethod"
                  >重置</ElButton>
                  <div style="display:inline-block" class="tip ml10" v-if="tip && !topBatchData.options.length">
                    <el-tooltip :content="tip" placement="top">
                      <el-tag type="info">说明</el-tag>
                    </el-tooltip>
                  </div>
                </div>
                <ElButton v-else class="mr10 mb10" type="primary" size="small" @click="getList(searchData)">搜索</ElButton>
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
          <!-- </CollapseWrapper> -->
          <!-- 最上面的按钮 -->
          <div
            v-if="(!simple && !hiddenTopBtn)"
            :class="['top-btn']"
            :style="{marginBottom: (!hasPermRightEditBtns.length && !topBatchData.options.length) ? '0': null}"
          >
            <div class="flex" style="align-items: flex-end;">
              <!-- 左边批量 -->
              <div :class="['top-btn-left',{'is-loading': topBatchData.loading}]">
                <el-cascader
                  v-if="topBatchData.options.length"
                  ref="batchCas"
                  :disabled="!selection.length || topBatchData.loading"
                  :value="topBatchBtnVal"
                  :props="topBatchData.props"
                  :placeholder="topBatchBtnText"
                  :options="topBatchData.options"
                  @change="handleTopLeftBatchChange"
                  :popper-class="`top-btn-cascader-wrapper ${casHasChildren ? 'casHasChildren' : ''}`"
                ></el-cascader>
                <i v-if="topBatchData.loading" class="el-icon-loading"></i>
              </div>
              <slot name="batchRight"></slot>

              <div class="tip" v-if="tip && topBatchData.options.length">
                <el-tooltip :content="tip" placement="top">
                  <el-tag type="info">说明</el-tag>
                </el-tooltip>
              </div>
              <div class="tip" v-else-if="btnTip">
                <el-tooltip placement="top">
                  <div slot="content">
                    <slot name="btnTip"></slot>
                  </div>
                  <el-tag type="info">说明</el-tag>
                </el-tooltip>

                <!-- <el-tag type="info">说明</el-tag> -->
              </div>
            </div>

            <!-- 右边批量操作按钮 -->
            <div
              class="btns"
              :class="{'show-filter':showFilter !== false}"
              v-if="(showFilter!== false || hasTopPermsBtn)"
            >
              <div class="textDes" v-if="showAsinDes">
                <slot name="textDes"></slot>
              </div>
              <template v-for="(item, index) in hasPermRightEditBtns">
                <el-dropdown
                  v-if="item.type === 'dropdown'"
                  :key="index"
                  type="primary"
                  plain
                  class="right-dropdown bottom-btn"
                  @command="handleCommand"
                >
                  <!-- <i :class="item.icon"></i> -->
                  <ElButton v-if="!item.btn" type="text" :loading="item.showLoading" :icon="item.icon"></ElButton>
                  <ElButton :loading="item.showLoading" v-else :type="item.btn">
                    {{item.name}}
                    <i class="el-icon-arrow-down"></i>
                  </ElButton>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item v-for="n in item.btns" :key="n.name" :command="n.fn">{{n.name}}</el-dropdown-item>
                  </el-dropdown-menu>
                </el-dropdown>

                <ElButton
                  class="bottom-btn"
                  :class="{ml10:  !hasTopPermsBtn}"
                  v-permission="item.perm"
                  :icon="item.icon"
                  :loading="item.showLoading ? item.loading : false"
                  v-else-if="item.show === undefined ? true : typeof item.show === 'function' ? item.show() : item.show"
                  :key="index"
                  :title="item.type == 'plain' ? (item.nameFn ? item.nameFn() : item.name) : null"
                  :type="item.type !== 'plain'? 'primary': 'text'"
                  :disabled="typeof item.disabled === 'function' ? item.disabled(selection) : false"
                  @click="handleBtnClick(item)"
                >{{item.type !== 'plain' ? (item.nameFn ? item.nameFn() : item.name) : null}}</ElButton>
              </template>
              <el-popover v-if="showFilter !== false" placement="bottom" trigger="click">
                <div class="rowCheckbox">
                  <el-checkbox :indeterminate="isIndeterminate" :value="checkAll" @change="handleCheckAllSelect">全选</el-checkbox>
                  <ElCheckboxGroup v-model="currentRow">
                    <ElCheckbox v-for="item in allRow" :key="item.label" :label="item.label"></ElCheckbox>
                  </ElCheckboxGroup>
                </div>
                <div class="list-btn-wrapper" :class="{mb10: !hasTopPermsBtn}" slot="reference">
                  <el-button class="list-btn" type="text" icon="el-icon-set-up"></el-button>
                  <div v-if="restRowNum" class="num-tags">{{restRowNum}}</div>
                </div>
              </el-popover>
            </div>
          </div>
          <!-- 最上面的按钮 end -->
        </template>

        <!-- 下方标签页 -->
        <div v-if="tabs.length" class="tabs mb10">
          <el-tabs @tab-click="handleTabClick" v-model="activeTab">
            <el-tab-pane
              v-for="item in tabs"
              :label="`${item.name} ( ${item.num} )`"
              :key="item.name"
              :item="item"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <!-- 下方标签页 end -->
        <slot name="table">
          <div style="position:relative">
            <div
              v-if="arrowShowLeft && scroll && showArrowLeft"
              :class="[{fixed: showFixed}]"
              class="table-arrow-left"
              @click="getMore(-1)"
            >
              <!-- <el-button type="text" icon="el-icon-d-arrow-left" :class="[{fixed: showFixed}]" @click="getMore(-1)"></el-button> -->
            </div>
            <div
              v-if="arrowShowRight && scroll && showArrowRight"
              :class="[{fixed: showFixed}]"
              class="table-arrow-right"
              :style="{right: parseInt(editWidth) + 10 + 'px'}"
              @click="getMore()"
            >
              <!-- <el-button type="text" icon="el-icon-d-arrow-left" :class="[{fixed: showFixed}]" @click="getMore(-1)"></el-button> -->
            </div>
            <yt-table
              @big-expand="handleBigExpand"
              :fixedMinusOne="fixedMinusOne"
              :bigData="bigData"
              :cellStyle="cellStyle"
              :selection="showSelection === false ? false : radioMode !== false ? 'radio' : 'checkbox'"
              :checkStrictly="checkStrictly"
              @select="handleSelect"
              :treeTable="treeTable"
              :treeColor="treeTable"
              :stripe="!treeTable"
              :treeStripe="treeTable"
              :pageSize="pageSize"
              :pageNo="pageNo"
              :selectableFunc="selectableFunc"
              :treeTableOtions="treeTableOtions"
              v-loading="tableLoading"
              @sortChange="sortChange"
              @selectChange="selectChange"
              :span-method="spanMethod"
              :tableRowClassName="tableRowClassName"
              :data="dataList"
              :columns="columns"
              :reserve-selection="reserveSelection"
              :isExpandAll="isExpandAll"
              ref="table"
              v-if="showTable"
            >
              <!-- <template v-if="arrowShowLeft && scroll && showArrowLeft" slot="topleft">
              <el-table-column fixed="left" key="arrowLeft" :index="9999" width="40">
                <template slot-scope="scope">
                  <el-button type="text" icon="el-icon-d-arrow-left" :class="[{fixed: showFixed}]" @click="getMore(-1)"></el-button>
                </template>
              </el-table-column>
              </template>-->
              <!-- <template v-if="arrowShowLeft && scroll && showArrowLeft" slot="topleft1">
              <plx-table-column fixed="left" key="arrowLeft" label="left" :index="9999" width="40">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    icon="el-icon-d-arrow-left"
                    :class="[{fixed: showFixed}]"
                    @click="getMoreBig(-1)"
                  ></el-button>
                </template>
              </plx-table-column>
              </template>-->
              <template slot="right">
                <slot name="right">
                  <el-table-column
                    class-name="rightHandles"
                    :fixed="tbRightFixed"
                    label="操作"
                    align="left"
                    :width="editWidth"
                    v-if="edits.length"
                  >
                    <template slot-scope="scope">
                      <template v-if="scope.row.buttonList ? (scope.row.buttonList.length > 1) : (edits.length > 1)">
                        <el-dropdown
                          v-setplain.small
                          split-button
                          class="w100 item-btn"
                          type="primary"
                          @click="edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 :0].fn(scope)"
                          @command="handleEditCommand"
                        >
                          {{edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 :0].name}}
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              v-for="(item, index) in (scope.row.buttonList ? scope.row.buttonList.slice(1) : edits.slice(1))"
                              :command="{item:scope.row.buttonList ? edits[item-1]: item , scope}"
                              :key="index"
                            >{{scope.row.buttonList ? edits[item - 1].name : item.name}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </template>
                      <template v-else-if="edits[scope.row.buttonList ? scope.row.buttonList[0] - 1 : 0]">
                        <el-button
                          class="item-btn w100"
                          v-if="edits[scope.row.buttonList ? scope.row.buttonList[0] - 1 : 0].show == null ? true : typeof edits[scope.row.buttonList ? scope.row.buttonList[0] - 1 : 0].show === 'boolean' ? edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 : 0].show : edits[scope.row.buttonList ? scope.row.buttonList[0] - 1 : 0].show(scope)"
                          size="small"
                          @click="edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 :0].fn(scope)"
                          type="primary"
                          plain
                        >{{edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 :0].name}}</el-button>
                      </template>
                    </template>
                  </el-table-column>
                </slot>
                <!-- <el-table-column
                  v-if="scroll && arrowShowRight && showArrowRight"
                  key="arrowRight"
                  fixed="right"
                  :index="9999"
                  width="40"
                >
                  <template slot-scope="scope">
                    <el-button type="text" icon="el-icon-d-arrow-right" :class="[{fixed: showFixed}]" @click="getMore"></el-button>
                  </template>
                </el-table-column>-->
              </template>
              <template slot="right1">
                <slot name="right1">
                  <plx-table-column
                    class-name="rightHandles"
                    :fixed="tbRightFixed"
                    label="操作"
                    align="left"
                    :width="editWidth"
                    v-if="edits.length"
                  >
                    <template slot-scope="scope">
                      <template v-if="scope.row.buttonList ? (scope.row.buttonList.length > 1) : (edits.length > 1)">
                        <el-dropdown
                          v-setplain.small
                          split-button
                          class="w100 item-btn"
                          type="primary"
                          @click="edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 :0].fn(scope)"
                          @command="handleEditCommand"
                        >
                          {{edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 :0].name}}
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item
                              v-for="(item, index) in (scope.row.buttonList ? scope.row.buttonList.slice(1) : edits.slice(1))"
                              :command="{item:scope.row.buttonList ? edits[item-1]: item , scope}"
                              :key="index"
                            >{{scope.row.buttonList ? edits[item - 1].name : item.name}}</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown>
                      </template>
                      <template v-else-if="edits[scope.row.buttonList ? scope.row.buttonList[0] - 1 : 0]">
                        <el-button
                          class="item-btn w100"
                          v-if="edits[scope.row.buttonList ? scope.row.buttonList[0] - 1 : 0].show == null ? true : typeof edits[scope.row.buttonList ? scope.row.buttonList[0] - 1 : 0].show === 'boolean' ? edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 : 0].show : edits[scope.row.buttonList ? scope.row.buttonList[0] - 1 : 0].show(scope)"
                          size="small"
                          @click="edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 :0].fn(scope)"
                          type="primary"
                          plain
                        >{{edits[scope.row.buttonList ?scope.row.buttonList[0] - 1 :0].name}}</el-button>
                      </template>
                    </template>
                  </plx-table-column>
                </slot>
                <!-- <plx-table-column
                  v-if="scroll && arrowShowRight && showArrowRight"
                  key="arrowRight"
                  fixed="right"
                  :index="9999"
                  width="40"
                >
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      icon="el-icon-d-arrow-right"
                      :class="[{fixed: showFixed}]"
                      @click="getMoreBig"
                    ></el-button>
                  </template>
                </plx-table-column>-->
              </template>
            </yt-table>
          </div>
        </slot>
        <el-pagination
          background
          v-if="isShowPag && total"
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
      :opts="innerDialogOpts"
      :copyText="dialogComponent.copyText"
      :events="events"
      @fullscreen="fullscreen"
      ref="Dialog"
      @close="innerDialogOpts.visible = false"
    >
      <transition-type name="fadeIn-fadeOut">
        <component
          v-on="dialogLensteners"
          v-if="innerDialogOpts.visible"
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
  </div>
</template>

<script>
import Dialog from './dialog'
import _merge from 'lodash/merge'
import { debounce } from 'throttle-debounce'
import _camelCase from 'lodash/camelCase'
import _isEmpty from 'lodash/isEmpty'
import { addResizeListener, removeResizeListener } from 'Utils/resize-event'

function addBtn(data) {
  let childStr = this.treeTable && this.treeTableOtions.childs,
    vm = this
  function handleData(data) {
    data.forEach(el => {
      if (childStr) {
        if (el[childStr]) {
          handleData(el[childStr])
        }
      }
      // TODO: 获取按钮的时候需要处理
      el.buttonList = vm.btnFn ? vm.btnFn(el) : undefined
    })
  }
  handleData(data)
  return data
}

export function handleData(
  {
    title,
    width,
    size,
    okDisabled,
    okBtnText,
    copyText,
    cancelBtnText,
    params,
    fullscreen = true,
    showMaxBtn,
    appendToBody = false,
    ...args
  },
  com,
  callback
) {
  callback && callback()
  com.default.inheritAttrs = false
  this.dialogComponent.component = com.default
  this.dialogComponent.params = params
  this.dialogComponent.copyText = copyText
  this.innerDialogOpts.title = title
  this.innerDialogOpts.okDisabled = okDisabled
  if (this.$refs.Dialog) {
    this.$refs.Dialog.hadnleSetBtnDisabled &&
      this.$refs.Dialog.hadnleSetBtnDisabled(!!okDisabled)
  }
  this.innerDialogOpts.visible = true
  this.innerDialogOpts.fullscreen = fullscreen
  this.innerDialogOpts.width = width
  this.innerDialogOpts.appendToBody = appendToBody
  this.innerDialogOpts.size = size
  this.innerDialogOpts.okBtnText = okBtnText
  this.innerDialogOpts.cancelBtnText = cancelBtnText
  this.innerDialogOpts.showMaxBtn = showMaxBtn
  Object.keys(args).forEach(key => {
    this.innerDialogOpts[key] = args[key]
  })
}

const topBatchDefault = {
  // 应用于 里显示的标题
  title: '项',
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
  name: 'MainLayout',
  inheritAttrs: false,
  components: {
    Dialog
  },
  provide: function() {
    return {
      addTotal: this.addTotal,
      addBtn: this.addBtn
    }
  },
  props: {
    // 修正-1显示为 -
    fixedMinusOne: false,
    cellStyle: Function,
    // 是否显示左右滚动箭头
    scroll: {
      default: false
    },
    // 搜索中的 对象|区间 参数合并方式 false -> parentkey在前 subKey在后  true -> 与前逻辑相反
    objectMerge: {
      default: false
    },
    // 是否大数据 展示
    bigData: Boolean,
    // 排序处理方式
    sortType: {
      default: 0
    },
    // 行className
    tableRowClassName: Function,
    //是否展开所有
    isExpandAll: {
      default: false,
      type: Boolean
    },
    // 是否显示过滤列
    // showFilter: {
    //   default: false
    // },
    // 处理表格数据
    dataMethod: {
      type: Function,
      default: data => data
    },
    // 合并行列的计算方法
    spanMethod: {
      type: Function
    },
    // 表格操作按钮是否固定在右边
    tbRightFixed: {
      default: false
    },
    addQuery: {
      default: false
    },
    // 按钮组设置函数
    btnFn: Function,
    // 自定义保存搜索条件的名称
    cusSaveName: String,
    // 说明
    tip: String,
    btnTip: {
      default: false,
      type: Boolean
    },
    showAsinDes: {
      default: false,
      type: Boolean
    },
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
      /* {
      // 应用于 里显示的标题
      title: '产品',
      //
      props: {
        label: 'label',
        value: 'label',
        expandTrigger: 'hover'
      },
      options: [
        {
          label: '审核',
          children: [
            {
              label: '基础信息审核通过'
            },
            {
              label: '基础信息审核不通过'
            }
          ]
        },
        {
          label: '作废'
        }
      ],
      // 搜索
      search: {
        field: 'sku',
        placeholder: '请输入仓库SKU、系统SKU、中英文名称'
      }
    } */
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
    // 自定义排序
    customSortFunc: Function,
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
          field: order != null ? prop : undefined
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
    selectableFunc: {
      type: Function,
      default: () => {
        return true
      }
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
      default: '10px'
    },
    value: {
      type: Array,
      default: () => []
    },
    defaultSortData: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    let vm = this
    return {
      showRightBtns: false,
      showFixedBtn: false,
      showArrowLeft: false,
      showArrowRight: false,
      // isIndeterminate: false,
      // checkAll:false,
      // 显示箭头
      arrowShowLeft: false,
      arrowShowRight: true,
      showSaveBtn: false,
      dialogLensteners: {
        'dialog.close': refresh => {
          if (refresh) {
            this.getList()
          }
          this.closeDialog()
        }
      },
      currentQuery: {},
      leftTreeSearchVal: '',
      leftTreeData: [],
      topBatchSearchVal: null,
      activeTab: null,
      hiddenMore: false,
      showSearchMoreBtn: false,
      topBatchBtnVal: [],
      toggleLeft: true,
      sortData: this.defaultSortData,
      ytTableShow: true,
      searchData: JSON.parse(JSON.stringify(this.searchDefaultData)),
      selection: [],
      innerDialogOpts: {
        visible: false,
        size: null,
        width: null,
        closeOnClickModal: false,
        title: null,
        okBtnText: '',
        fullscreen: true,
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
          return res
            .then(res => {
              if (typeof res === 'object' && res && res !== 'close') {
                vm.clearSelection()

                vm.innerDialogOpts.visible = false
                vm.getList(undefined, res === 'reset')
              }
              if (res === 'close') {
                vm.innerDialogOpts.visible = false
              }
            })
            .catch(e => {
              // console.log(e)
              if (e instanceof Error) {
                console.error(e)
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
    showFixed() {
      return this.showFixedBtn || this.dataList.length > 6
    },
    dataList() {
      return this.url ? this.tableList : this.outerTableList
    },
    showFilter() {
      return this.allRow.length > 14
    },
    casHasChildren() {
      let ret = false
      this.topBatchBtn.options.forEach(e => {
        if (e.children && e.children.length) {
          ret = true
        }
      })
      return ret
    },
    hasTopPermsBtn() {
      return this.hasPermRightEditBtns && this.hasPermRightEditBtns.length
    },
    saveName() {
      let user = this.$store.state.auth.userInfo
      if (this.cusSaveName) {
        return `${_camelCase(this.$route.path)}:${user.username}:${
          this.cusSaveName
        }`
      }
      return `${_camelCase(this.$route.path)}:${user.username}`
    },
    edits() {
      return this.editBtns
    },
    isIndeterminate() {
      return (
        this.currentRow.length != 0 &&
        this.allRow.length != this.currentRow.length
      )
    },
    checkAll() {
      return this.allRow.length == this.currentRow.length
    },
    // 所有展示的列
    allRow() {
      let data = this.columns.filter(e => !e.noDisplay) || []
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
        this.$storage.set(
          'local',
          this.savedColName,
          this.allRow.filter(el => el.show !== false).map(el => el.label)
        )
      }
    },

    savedColName() {
      return _camelCase(this.$route.path) + '.' + _camelCase(this.url)
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
      // console.log(ret)
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
          // 如果批量按钮只有一个的时候，需要展平，则取消下面的注释
          // if (btns.length == 1) {
          //   ret.push(btns[0])
          //   return
          // }
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
      return `应用于${this.selection.length}个选定的${this.topBatchData.title ||
        '项'}`
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

      return Object.assign(
        {},
        // this.handleScDat(this.searchData),
        this.outerParams
      )
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
    let cachedColumns = this.$storage.get('local', this.savedColName)
    if (cachedColumns) {
      this.currentRow = cachedColumns
    }
    // 在有左侧树的情况下， 获取dataPromise中的Promise值并设置到data中
    if (this.leftTree) {
      if (this.leftTree.loadNode) {
        this.leftTreeData = []
      } else {
        this.getLeftTreeData()
      }
    }
    // 如果存在保存的筛选条件，则设置筛选条件
    if (
      !this.simple &&
      this.searchFields &&
      Object.keys(this.searchFields).length
    ) {
      const saveData =
        this.$storage.get('local', 'NORMAL_SEARCH') &&
        this.$storage.get('local', 'NORMAL_SEARCH')[this.saveName]
      // console.log(this.searchDefaultData)

      if (!Object.keys(this.searchDefaultData).length) {
        Object.assign(this.searchData, saveData || {})
      }
      if (Object.keys(this.searchData).length) {
        Object.keys(this.searchFields).forEach(key => {
          let el = this.searchFields[key],
            val = this.searchData[key]

          if (
            val != null &&
            val !== '' &&
            (!Array.isArray(val) ||
              (typeof val === 'object' &&
                val !== null &&
                Object.values(val).filter(el => !!el).length) ||
              val.length)
          ) {
            if (el.hidden === true) {
              el._close = true
            }
            el.hidden = false
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
      let vm = this
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
        : this.tabs.length
        ? this.tabs[0].query
        : {}
    } else {
      this.activeTab = this.tabs.length && this.tabs[0].name
      this.currentQuery = this.tabs.length ? this.tabs[0].query : {}
    }

    this.$watch(
      'searchTrueData',
      function handler(newVal, oldVal) {
        // console.log(newVal, oldVal)

        let vm = this
        function setTime() {
          if (vm.timer) {
            clearTimeout(vm.timer)
          }
          vm.timer = setTimeout(
            () => {
              vm.getList()
            },
            vm.timer ? 250 : 0
          )
        }
        if (
          newVal.__default ||
          Object.keys(this.$.dealObjectValue(newVal)).length
        ) {
          if (JSON.stringify(newVal) === JSON.stringify(oldVal)) {
            return
          }
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
    this.$nextTick(() => {
      this.bindEnter()
    })
    if (!this.simple) {
      this.debounceResizeHandler = debounce(300, this.resizeHandler)
      this.$nextTick(() => {
        window.addEventListener('resize', this.debounceResizeHandler)
        if (this.$refs.batchCas && !this.casHasChildren) {
          addResizeListener(this.$refs.batchCas.$el, this.setCasWidth)
        }
      })
    }
    if (this.scroll) {
      this.bindMouseEnter()
    }
  },
  beforeDestroy() {
    if (this.scroll) {
      this.bindMouseEnter(false)
    }
    this.bindEnter(false)
    window.removeEventListener('resize', this.debounceResizeHandler)
    this.debounceResizeHandler = null

    if (this.$refs.batchCas) {
      removeResizeListener(this.$refs.batchCas, this.setCasWidth)
    }

    if (!this.simple) {
      return
    }
  },
  watch: {
    leftTreeSearchVal(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    bindMouseEnter(bind = true) {
      const vm = this
      const handle =
        this.__mouseenterHandle ||
        (this.__mouseenterHandle = e => {
          const right = this.$el.querySelectorAll('.plx-table--body-wrapper')[0].offsetWidth - parseInt(this.editWidth)
          // console.log(e)
          if (
            e.clientX + 100 > right && e.clientX < right
          ) {
            this.showArrowRight = true
            // this.showRightBtns = false
          } else if(e.clientX >= right) {
            this.showRightBtns = true
            this.showArrowRight = false
            } else {
            this.showArrowRight = false
            this.showRightBtns = false
            if (!vm.$refs.table.$el.querySelectorAll('.plx-table--fixed-right-wrapper.scrolling--middle').length) {
              this.showRightBtns = true
            }

          }
          if (e.clientX < 160) {
            this.showArrowLeft = true
          } else {
            this.showArrowLeft = false
          }
        })
      let tableEl = this.$refs.table.$el
      if (bind) {
        tableEl.addEventListener('mousemove', handle)
        // tableEl.addEventListener('mouseleave', handle1)
      } else {
        tableEl.removeEventListener('mousemove', handle)
        // tableEl.removeEventListener('mouseleave', handle1)
      }
    },

    handleBigExpand() {
      setTimeout(() => {
        if (this.$refs.table.$el.offsetHeight > 400) {
          this.showFixedBtn = true
        } else {
          this.showFixedBtn = false
        }
      }, 20)
    },

    handleCheckAllSelect(val) {
      if (val) {
        this.currentRow = this.allRow.map(el => el.label)
      } else {
        this.currentRow = this.allRow.slice(0, 10).map(el => el.label)
      }
    },
    bindEnter(bind = true) {
      const handle =
        this.__handle ||
        (this.__handle = e => {
          if (e.keyCode == 13) {
            e.preventDefault()
          }
          if (e.keyCode == 13 && !this.innerDialogOpts.visible) {
            this.getList()
          }
        })
      if (bind) {
        // console.log('bind');
        document.addEventListener('keydown', handle)
      } else {
        // console.log('bind');
        document.removeEventListener('keydown', handle)
      }
      // console.log('绑定');
    },
    addTotal(num) {
      this.total += num
    },
    getMore(type) {
      if (this.bigData) {
        return this.getMoreBig(type)
      }
      let table = this.$el.querySelectorAll('.el-table__body-wrapper')[0]
      let body = table.querySelectorAll('table.el-table__body')[0]
      if (type == -1) {
        table.scrollLeft -= 430
      } else {
        table.scrollLeft += 430
      }
      this.arrowShowLeft = table.scrollLeft > 0
      this.arrowShowRight =
        table.scrollLeft < body.offsetWidth - table.offsetWidth
    },
    getMoreBig(type) {
      let table = this.$el.querySelectorAll('.plx-table--body-wrapper')[0]
      let innerTb = table.querySelectorAll('table.plx-table--body')[0]
      let space = table.querySelectorAll('.plx-body--x-space')[0]
      let move = type == -1 ? -430 : 430

      let table1 = this.$refs.table.$refs.bigTab.$refs.table
      table1.pagingScrollTopLeft(0, this.$refs.table.tableScrlLeft + move)
      // console.log(table.scrollLeft > 0, table.scrollLeft < body.offsetWidth - table.offsetWidth);
      this.$nextTick(() => {
        if (!this.$refs.table.$el.querySelectorAll('.plx-table--fixed-right-wrapper.scrolling--middle').length) {
          this.showRightBtns = true
        }
        // debugger
        this.arrowShowLeft = table.scrollLeft > 0
        this.arrowShowRight =
          table.scrollLeft <
          Math.max(innerTb.clientWidth, space.clientWidth) - table.offsetWidth
      })
    },
    // 展示隐藏的列
    showRestRows(num = 1) {
      if (this.restRowNum == 0) {
        return true
      }
      this.currentRow = this.allRow
        .slice(0, this.currentRow.length + num)
        .map(el => el.label)
    },
    toggleRowEdit(row, val, bool, __showBtn = true, __isNumber = 2) {
      this.tableList.forEach(el => {
        if (el.__isedit) {
          // el.__isedit = {}
          // this.$set(el, '__isedit', {})
          for (const key in el.__isedit) {
            if (el.__isedit.hasOwnProperty(key)) {
              el.__isedit[key] = null
            }
          }
        }
      })
      // this.$set(row, `__isedit__${val}`, bool)
      let __isedit = row.__isedit || {}
      __isedit[val] = bool ? { editVal: row[val], __loading: false } : null
      this.$set(row, '__isedit', __isedit)
      this.$set(row, '__showBtn', __showBtn)
      this.$set(row, '__isNumber', __isNumber)
    },
    handleScClose() {
      this.calcIsHidden()
      setTimeout(() => {
        this.handleSearch()
      })
    },
    handleScDat(data) {
      let ret = {}
      Object.keys(data).forEach(key => {
        const element = data[key]
        const sf = this.searchFields[key]
        if (!sf) {
          return
        }
        if (sf.widget === 'daterange' || sf.widget == 'datetimerange') {
          if (sf.fields && element) {
            ret[sf.fields[0]] = element[0]
            ret[sf.fields[1]] = element[1]
          }
        } else if (sf.widget === 'textarea') {
          if (!element) {
            return
          }
          ret[key] = element.split(/\r\n|[\r\n]/)
        } else if (sf.type == 'object' && sf.range) {
          Object.keys(element).forEach(key => {
            let e = element[key],
              str
            if (this.objectMerge) {
              str = `${key}${sf.field.charAt().toUpperCase() +
                sf.field.slice(1)}`
            } else {
              str = `${sf.field}${key.charAt().toUpperCase() + key.slice(1)}`
            }
            ret[str] = e
          })
        } else if (element != null) {
          ret[key] = element
        }
      })
      // for (const key in data) {
      //   console.log(key)

      //   if (data.hasOwnProperty(key)) {
      //     const element = data[key]
      //     const sf = this.searchFields[key]
      //     if (!sf) {
      //       continue
      //     }
      //     if (sf.widget === 'daterange' || sf.widget == 'datetimerange') {
      //       if (sf.fields && element) {
      //         ret[sf.fields[0]] = element[0]
      //         ret[sf.fields[1]] = element[1]
      //       }
      //     } else if (sf.widget === 'textarea') {
      //       if (!element) {
      //         return
      //       }
      //       ret[key] = element.split(/\r\n|[\r\n]/)
      //     } else if (sf.type == 'object' && sf.range) {
      //       for (const key in element) {
      //         if (element.hasOwnProperty(key)) {
      //           const e = element[key]
      //           ret[
      //             `${sf.field}${key.charAt().toUpperCase() + key.slice(1)}`
      //           ] = e
      //         }
      //       }
      //     } else if (element != null) {
      //       ret[key] = element
      //     }
      //   }
      // }
      return ret
    },
    setCasWidth() {
      if (!this.$refs.batchCas) {
        return
      }
      let topBtnWrapper = this.$refs.batchCas.$refs.popper

      this.$refs.batchCas &&
        this.$refs.batchCas.$el.offsetWidth &&
        (topBtnWrapper.style.width = this.$refs.batchCas.$el.offsetWidth + 'px')
    },
    // 保存为常用筛选条件
    saveNormal() {
      // this.$storage.set('local', this.saveName, this.searchData)
      let res = {}
      Object.keys(this.searchData).forEach(key => {
        let val = this.searchData[key]
        if (Object.prototype.toString.call(val) === '[object Object]') {
          !_isEmpty(val) && (res[key] = val)
        } else {
          res[key] = val
        }
      })
      let saved = this.$storage.get('local', 'NORMAL_SEARCH') || {}
      this.$storage.set('local', 'NORMAL_SEARCH', {
        ...saved,
        [this.saveName]: res
      })
      this.$message.success('保存成功')
    },
    filterNode(value, data) {
      value = value.trim()
      if (!value) return true
      return data[this.leftTree.props.label].indexOf(value) !== -1
    },
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
      this.showSaveBtn = true
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
      return false
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
      if (column.sortable === true) {
        return
      }

      let params =
        this.sortType == 0
          ? this.sortableFunc({ column, prop, order })
          : {
              sortData: {
                sort: order && (order === 'ascending' ? 'asc' : 'desc'),
                field: order != null ? prop : undefined
              }
            }
      this.sortData = params
      if (this.customSortFunc) {
        return this.customSortFunc(params)
      }
      this.getList(params)
    },
    selectChange(val) {
      this.$emit('selectChange', val)
      this.selection = val
      this.initBackShow()
    },
    // 弹窗
    _dialog({ component }) {
      let vm = this
      let _arg = arguments
      component().then(com => {
        handleData.apply(vm, [].concat.apply([..._arg], [com]))
      })
    },
    handleSelect(select, row) {
      this.$emit('select', select, row)
    },
    // 搜索按钮
    handleSearch() {
      this.pageNo = 1
      // console.log(22)
      this.$nextTick(() => {
        this.getList(null, null, true)
        this.$emit('handleSearch')
      })
    },
    //重置搜素
    resetMethod() {
      this.pageNo = 1
      // this.$refs.search.reset()
      this.searchData = Object.assign(
        {},
        this.searchDefaultData
        // JSON.parse(this.$options.searchData)
      )
      this.getList(null, null, true)
    },
    // 分页 pageNumber变化
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList()
    },
    // 分页 pageSize变化
    handleSizeChange(val) {
      this.pageNo = 1
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
      // if (JSON.stringify(this.outerTableList) !== '[]') {
      //   this.tableLoading = false
      //   this.$emit('requestSuccess', true, this.outerTableList)
      //   return
      // }
      console.log('获取数据')
      let vm = this
      let params
      if (this.isShowPag) {
        params = {
          // sortOrder: this.pageSize
          //   ? this.sortData.sort
          //     ? 'asc'
          //     : 'desc'
          //   : undefined,
          pageSize: this.pageSize,
          pageNumber: this.pageNo
        }
      } else {
        params = {}
      }
      if (resetSearch) {
        this.pageNo = 1
        this.searchData = Object.assign(
          {},
          this.searchDefaultData,
          JSON.parse(this.$options.searchData)
        )
      }
      params = Object.assign(
        {},
        this.currentQuery,
        this.addQuery ? this.$route.query : {},
        params,
        this.outerParams,
        this.searchTrueData,
        this.handleScDat(this.searchData),
        this.sortData,

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

      // params = this.$.dealObjectValue(params)

      //向父组件发送搜索的条件
      vm.$emit('searchTrueData', params, this.searchData)

      if (!this.url || !this.showTable) return

      // if (
      //   !refresh &&
      //   this.lastSearchVal &&
      //   this.lastSearchVal === JSON.stringify(params)
      // ) {
      //   return
      // }

      if (!this.__flag) {
        if (this.isShowTableLoading) vm.tableLoading = true
        vm.$emit('loading', true)
        this.__flag = true
        return this.$api[this.url](params, {}, { singleLoading: true })
          .then(res => {
            this.__flag = false
            vm.$emit('loading', false)
            // this.lastSearchVal = JSON.stringify(params)
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
              res = vm.fixedPageFunc(res)
              // let { buttonList } = res
              // let { pageNo = 0, pageSize = 0, rows, total = 0 } = page
              // if (buttonList) {
              //   rows.forEach((element, index) => {
              //     element.buttonList = buttonList[index]
              //   })
              // }

              // vm.pageNo = pageNo || vm.pageNo
              // vm.pageSize = pageSize || vm.pageSize
              // vm.total = total
              // vm.tableList = rows
              // vm.tableLoading = false
              // vm.$emit('loading', false)
            }
            if (res.page) {
              res = res.page
            }
            let { pageNo, pageSize, rows, total, data, list, items } = res || {}

            vm.pageNo = pageNo || vm.pageNo
            vm.pageSize = pageSize || vm.pageSize
            vm.total = total
            let _rows =
              (!this.isShowPag ? data || list || rows || items : rows) || []
            _rows = this.dataMethod(_rows)
            if (this.btnFn && this.addBtn) {
              vm.tableList = this.addBtn(_rows)
            } else {
              vm.tableList = _rows
            }
            // vm.tableList = !this.isShowPag ? data : rows
            // vm.tableList = rows.map(el => {
            //   el.buttonList = null
            //   return el
            // })
            vm.tableLoading = false
            vm.$emit('loading', false)
            //像父组件发送请求成功
            vm.$emit('requestSuccess', true, vm.tableList, res)
          })
          .catch(error => {
            if (error instanceof Error) {
              console.error(error)
            }

            vm.__flag = false
            vm.$emit('loading', false)
            vm.tableLoading = false
            //像父组件发送请求成功
            vm.$emit('requestSuccess', true)
            if (error.code == 20002) {
              return
            }
            vm.total = 0
            vm.tableList = []
          })
      }
    },
    // 处理按钮
    addBtn,
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
      if (this.bigData) {
        let table = this.$refs.table.$refs.bigTab.$refs.table
        table.clearSelection()
      }
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
$leftBgColor: #f6f6f9;
.main-layout {
  background: $leftBgColor;
  .table-arrow-left,
  .table-arrow-right {
    transition: 0.4s;
    width: 45px;
    height: 45px;
    top: 50%;
    position: absolute;
    z-index: 3;
  }
  .table-arrow-left {
    left: 73px;
    background-image: url('./浅左.png');
    &:hover {
      background-image: url('./深左.png');
    }
  }
  .table-arrow-right {
    right: 180px;
    background-image: url('./浅右.png');
    &:hover {
      background-image: url('./深右.png');
    }
  }
  .tip {
    cursor: pointer;
    font-size: 12px;
    // opacity: 0.5;
    color: #666;
    .el-tag.el-tag--info {
      background-color: #009999;
      color: #fff;
      border-color: #009999;
      padding: 0 20px;
      height: 20px;
      line-height: 19px;
    }
    span {
      margin-right: 6px;
    }
  }

  .list-btn-wrapper {
    position: relative;
    display: inline-block;

    .num-tags {
      z-index: 0;
      position: absolute;
      right: 0;
      top: 0;
      cursor: pointer;
      color: #fff;
      padding: 1px 5px 0 0;
      font-size: 12px;
      &::after {
        cursor: pointer;
        z-index: -1;
        content: '';
        display: block;
        border: 10px solid #ddd;
        border-color: $subColor $subColor transparent transparent;
        position: absolute;
        right: 3px;
        top: 0;
      }
    }
  }
  .rightHandles {
    .cell {
      padding: 2px 20px;
    }
    .item-btn {
      display: block;
      & > .el-button-group {
        display: flex;
        & > button:first-child {
          flex: 1;
        }
      }
    }
  }
  .right {
    // min-height: 400px;
    &.no-table {
      min-height: 0;
    }
    background-color: #fff;
    // .right-dropdown {
    //   margin-left: 10px;
    // }
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
      background-color: #d7d7d7;
    }
  }
  .tabs {
    display: flex;
    align-content: center;
    justify-content: space-between;
    .list-btn {
      padding: 0;
      .iconcaidan {
        font-size: 24px;
      }
    }
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
    & > span {
      font-size: 14px;
      line-height: 32px;
    }
    display: flex;
    border-bottom: 1px solid #eee;
    border-radius: 4px;
    // padding: 12px 0;
    padding-bottom: 0;
    margin-bottom: 12px;
    .el-form-item--mini.el-form-item,
    .el-form-item--small.el-form-item {
      margin-bottom: 0;
    }

    .el-form-item__label {
      font-size: 14px;
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
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    .textDes {
      // position: absolute;
      display: inline-block;
      // right: 10px;
      margin-right: 20px;
      font-size: 14px;

      color: #666;
    }
    .btns {
      .bottom-btn:first-child {
        margin-left: 0 !important;
      }
      &.show-filter .el-button--primary:last-of-type {
        margin-right: 20px;
        position: relative;
        &:after {
          position: absolute;
          content: '';
          display: block;
          width: 1px;
          top: 0;
          right: -15px;
          height: 100%;
          background: #e4e4e4;
        }
      }
      .el-button--text {
        padding: 0 4px;
        height: 32px;
        line-height: 32px;
        // vertical-align: middle;
        text-align: center;
        i {
          display: inline-block;
          height: 32px;
          vertical-align: middle;
          font-size: 22px;
          line-height: 32px;
          width: 100%;
        }
      }
      .el-dropdown {
        .el-dropdown__icon {
          font-size: 18px;
          line-height: 11px;
          font-weight: bolder;
        }
      }
    }
    .top-btn-left {
      // flex: 0 0 600px;
      display: flex;
      position: relative;
      & > * {
        margin-right: 10px;
      }
      .el-icon-loading {
        line-height: 40px;
        position: absolute;
        right: 27px;
      }
      .el-button--primary {
        background-color: $titleColor;
        border-color: $titleColor;
      }

      .el-cascader {
        // flex: 0 0 200px;
        .el-icon-arrow-down {
          font-size: 18px;
          color: #aaa;
          font-weight: bolder;
        }
        .el-input__suffix-inner {
          pointer-events: none;
        }

        // .el-input:not(.is-disabled):hover {
        //   .el-icon-arrow-down {
        //     // color: #fff;
        //   }
        // }
        .el-input__inner {
          color: $titleColor;
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
          // &:hover {
          //   // background: $titleColor;
          //   // &::-moz-placeholder {
          //   //   color: #fff;
          //   // }
          //   // &:-ms-input-placeholder {
          //   //   color: #fff;
          //   // }
          //   // &::-webkit-input-placeholder {
          //   //   color: #fff;
          //   // }
          // }
        }
        &.is-disabled .el-input__inner {
          opacity: 0.5;

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
            background: none !important;
            &::-moz-placeholder {
              color: #999;
            }
            &:-ms-input-placeholder {
              color: #999;
            }
            &::-webkit-input-placeholder {
              color: #999;
            }
          }
        }
      }
      &.is-loading .el-input__suffix-inner {
        display: none;
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
    width: 15px;
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
    }
    &.outer {
      left: 10px;
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
    padding: 5px 0;
  }
  .el-table--mini th {
    background: #f5f5f5;
  }

  .pagination {
    margin-top: 8px;
  }
}
.rowCheckbox {
  max-width: 260px;
  .el-checkbox-group {
    display: flex;
    flex-wrap: wrap;
  }
  .el-checkbox {
    width: 50%;
    margin: 6px 0;
  }
}
.top-btn-cascader-wrapper:not(.casHasChildren) {
  .el-cascader-menu__wrap {
    height: auto;
  }
  .el-scrollbar.el-cascader-menu {
    width: 100%;
  }
  .el-cascader-node__label {
    padding: 0;
  }
}
</style>
