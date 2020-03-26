<template>
  <div>
    <el-table
      v-bind="$attrs"
      :data="bigData ? [] :listToArray"
      :border="border"
      @row-contextmenu="rowContextmenu"
      style="width: 100%;"
      @selection-change="selectChange"
      :row-key="reserveSelection"
      :cell-style="cellStyle"
      :row-style="showRow"
      :class="[{'selection-radio-table':selection === 'radio' , 'empty-content-isempty': bigData }, 'custom-eltable']"
      ref="table"
      :stripe="stripe"
      @select="handleSelect"
      :height="height"
      @select-all="handleSelectAll"
      :max-height="maxHeight"
      :size="size"
      :span-method="spanMethod"
      @row-click="handleRowClick"
      @sort-change="sortChange"
      :row-class-name="rowClassName"
      :highlight-current-row="selection === 'radio'"
      tooltip-effect="dark"
    >
      <slot name="topleft"></slot>
      <el-table-column
        key="selection"
        type="selection"
        width="45"
        align="left"
        v-if="selection && selection !== 'radio'"
        :resizable="bigData ? false : true"
        :selectable="selectableFunc"
        :reserve-selection="!!reserveSelection"
      ></el-table-column>
      <el-table-column
        type="selection"
        :resizable="bigData ? false : true"
        width="40"
        align="left"
        v-if="selection === 'radio'"
        :selectable="selectableFunc"
        :reserve-selection="!!reserveSelection"
      >
        <template slot-scope="scope" v-if="selection === 'radio'">
          <el-radio class="custom-selection-radio" :label="scope.row" :value="radioVal">&nbsp;</el-radio>
        </template>
      </el-table-column>

      <slot name="left"></slot>
      <slot></slot>
      <!-- v-if="!item.isShow" -->
      <template v-for="item in currentCol">
        <el-table-column
          :resizable="bigData ? false : true"
          :sort-orders="['ascending', 'descending']"
          :fixed="item.fixed"
          :is-render="!!item.render"
          :show-overflow-tooltip="item.noTooltip"
          v-if="!item.isShow"
          :width="item.width"
          :render-header="renderHeader(item)"
          :min-width="item.minWidth"
          :key="item.label"
          :label="item.showLabel !== false ? item.label : ''"
          :align="item.align || 'left'"
          :sortable="item.sortable || false"
          :prop="item.value"
        >
          <template v-if="item.merge">
            <el-table-column
              :resizable="bigData ? false : true"
              :is-render="!!k.render"
              :show-overflow-tooltip="k.noTooltip"
              :render-header="renderHeader(k)"
              :fixed="item.fixed"
              v-for="k in item.merge"
              :width="k.width"
              :key="k.label"
              :prop="k.value"
              :label="k.label"
              :sort-orders="['ascending', 'descending']"
              :align="k.align || 'left'"
              :sortable="k.sortable || false"
            >
              <template slot-scope="scope">
                <table-colvalue
                  :item="k"
                  :scope="scope"
                  :style="k.style ||''"
                  :pageSize="$attrs.pageSize"
                  :pageNo="$attrs.pageNo"
                  :arr="data"
                  :fixedMinusOne="fixedMinusOne"
                  :treeTableOtions="treeTableOtions"
                />
              </template>
            </el-table-column>
          </template>
          <template slot-scope="scope">
            <div>
              <table-colvalue
                :arr="data"
                :item="item"
                :fixedMinusOne="fixedMinusOne"
                :pageSize="$attrs.pageSize"
                :pageNo="$attrs.pageNo"
                :scope="scope"
                :treeTableOtions="treeTableOtions"
                :style="item.style ||''"
              />
              <!-- {{getVal(item, scope)}} -->
            </div>
          </template>
        </el-table-column>
      </template>
      <!--  -->
      <slot name="right"></slot>
      <!-- <nonePage noBack slot="empty"></nonePage> -->
    </el-table>
    <big-table
      v-if="bigData"
      :fixedMinusOne="fixedMinusOne"
      :table-data="listToArray"
      @table-body-scroll="handleTableScroll"
      :columns="currentCol"
      @plselectChange="plselectChange"
      ref="bigTab"
      @expand="$emit('big-expand')"
      :span-method="spanMethod"
      :data="data"
      :treeTableOtions="treeTableOtions"
      :pageSize="$attrs.pageSize"
      :pageNo="$attrs.pageNo"
      @select="handleSelect"
    >
      <template slot="topleft">
        <slot name="topleft1"></slot>
      </template>
      <template slot="right">
        <slot name="right1"></slot>
      </template>
    </big-table>
  </div>
</template>

<script>
import Vue from 'vue'
import BigTable from './big-table'
// import tableMixin from './table-mixin'
// eslint-disable-next-line no-unused-vars
import { handleExpand } from './table-utils'

import { showRow } from './common-utils'

//123/
export default {
  // mixins: [tableMixin],
  inheritAttrs: false,
  name: 'YtTable',
  data() {
    return {
      currentBigDataCols: [],
      name: null,
      allChecked: false,
      radioVal: null,
      tableScrlLeft: 0
    }
  },

  directives: {
    tooltip: {
      inserted: (el, binding) => {
        let a = el.querySelectorAll('a')[0]
        if (a) {
          let height = a.offsetHeight
          let lineHeight = parseInt(window.getComputedStyle(a).lineHeight) * 2
          if (parseInt(height) > lineHeight) {
            Vue.set(binding.value, 'show', true)
          }
        }
      }
    }
  },

  props: {
    fixedMinusOne: Boolean,
    // 是否优化大数据表格
    bigData: Boolean,
    //是否展开所有
    isExpandAll: {
      default: false,
      type: Boolean
    },
    // 表格有checkbox时是否遵循父子不关联，默认勾选父不勾选子，如果false则勾选父时会勾选子
    checkStrictly: {
      default: true,
      type: Boolean
    },
    treeStripe: {
      // 是否显示树形斑马线
      default: true
    },
    // 是否显示树型表格下子选项颜色
    treeColor: {
      default: false,
      type: [Boolean, String]
    },
    stripe: {
      type: Boolean,
      default: true
    },
    // 是否为树型表格
    treeTable: {
      type: Boolean,
      default: false
    },
    treeTableOtions: {
      type: Object,
      default: () => ({
        childs: 'children',
        // 是否显示expand按钮
        expandFunc: row => {
          return row.count <= 1
        }
      })
    },
    // 合并行列的计算方法
    spanMethod: {
      type: Function
    },
    tableRowClassName: {
      type: Function
    },
    cellStyle: Function,
    size: {
      type: String,
      default: 'mini'
    },
    data: {
      required: true,
      type: Array,
      default: () => []
    },
    reserveSelection: {
      type: String
    },
    selectableFunc: {
      type: Function,
      default: () => {
        return true
      }
    },
    // 单多选模式， 'checkbox' 多选   'radio' 单选
    selection: {
      type: [Boolean, String],
      default: true
    },
    columns: {
      required: true,
      type: Array,
      default: () => []
    },

    border: {
      type: Boolean,
      default: true
    },
    height: [String, Number],
    maxHeight: [String, Number]
  },

  computed: {
    hasLeftFixedRow() {
      return this.columns && !!this.columns.find(el => el.fixed == 'left')
    },
    listToArray() {
      if (!this.treeTable) {
        return this.data
      }
      let tmp = this.data || []
      const func = this.evalFunc
      const args = [tmp, this.isExpandAll]
      return func.apply(null, args)
    },
    currentCol() {
      let data = this.columns.filter(e => !e.noDisplay) || [],
        ret = []
      data.forEach(el => {
        if (el.type === 'array') {
          const children = el.children.filter(el => el.show !== false)
          if (children.length == 2) {
            ret.push({
              ...el,
              children,
              sortable: children[0].sortable,
              value: children[0].value
            })
          } else if (children.length == 1) {
            ret.push(children[0])
          }
        } else {
          if (el.show !== false) {
            ret.push(el)
          }
        }
      })
      return ret
    }
  },
  beforeDestroy() {
    this.$Lazyload.TargetQueue.splice(0)
    let ul = document.querySelectorAll('.copy-ul')[0]
    if (ul) {
      document.removeEventListener('click', this._documentEventer)
      // let li = ul.querySelectorAll('li')[0]
      // li.removeEventListener('click', liEvent)
      document.body.removeChild(ul)
    }
  },
  mounted() {
    if (!this.bigData) {
      return
    }
    setTimeout(() => {
      // debugger
      let checkBoxCol = document.querySelectorAll(
        '.el-table-column--selection:not(.is-hidden)'
      )[0]
      checkBoxCol.classList.add('_enable')
      checkBoxCol
      // let label = checkBoxCol.querySelectorAll('label.is-disabled')[0]
      // let span = checkBoxCol.querySelectorAll('span.is-disabled')[0]
      // let input = checkBoxCol.querySelectorAll('input[type=checkbox]')[0]
      // label.classList.remove('is-disabled')
      // span.classList.remove('is-disabled')
      // input.removeAttribute('disabled')
    }, 50)
  },
  methods: {
    handleSelectAll() {
      if (!this.bigData) {
        return
      }
      // console.log(selection)
      let checkBoxCol = document.querySelectorAll(
        '.el-table-column--selection:not(.is-hidden)'
      )[0]
      let span = checkBoxCol.querySelectorAll('span.is-disabled')[0]
      this.allChecked = !this.allChecked

      this.$refs.bigTab.$refs.table.toggleAllSelection(this.allChecked)
      if (this.allChecked) {
        setTimeout(() => {
          span.classList.add('is-checked')
        }, 50)
      } else {
        setTimeout(() => {
          span.classList.remove('is-checked')
        }, 50)
      }
    },
    handleExpand,
    handleColClick(t, text, copy) {
      if (copy === false) {
        return
      }
      if (t) {
        this.$copyText(text).then(() => {
          this.$message.success('复制成功')
        })
      }
    },
    handleRowClick(row) {
      if (this.selection !== 'radio') {
        return
      }
      this.radioVal = row
    },
    handleSelect(select, row) {

      const table = this.bigData
        ? this.$refs.bigTab.$refs.table
        : this.$refs.table
      if (this.treeTable && !this.checkStrictly) {
        let first = this.listToArray.indexOf(row)
        let newChild = []
        let child =
          this.spanMethod && row._level == 1 && row.sameCount != null
            ? this.listToArray[first + row.sameCount - 1][
                this.treeTableOtions.childs
              ] // sameCount
            : row[this.treeTableOtions.childs]

        if (child && child.length && row._expanded) {
          let childNum = child.length

          for (let index = first; index <= first + childNum; index++) {
            // if (!this.listToArray[index]._root && this.spanMethod) {
            //   continue
            // }
            newChild.push(this.listToArray[index])
            if (!this.bigData) {
              table.toggleRowSelection(
                this.listToArray[index],
                !!~select.indexOf(row)
              )
            }
          }
        }
        if (this.bigData) {
          table.toggleRowSelection(
            newChild.map(el => ({
              row: el,
              selected: !!~select.indexOf(row)
            }))
          )
          this.$nextTick(() => {
            this.$emit(
              'selectChange',
              table.$refs.singleTable.$refs.xTable.selection
            )
          })
          return
        }
        this.$emit('select', select.concat(newChild), row)
      } else {
        if (this.bigData) {
          this.$nextTick(() => {
            this.$emit(
              'selectChange',
              table.$refs.singleTable.$refs.xTable.selection
            )
            this.$emit('select', select[0], row)
          })
          return
        }
        this.$emit('select', select, row)
      }
    },
    renderHeader(item) {
      let vm = this,
        label = item.label
      if (item.showLabel === false) {
        label = ''
      }
      return (h, { column, $index }) => {
        if (item.toggle) {
          let labelText = []
          if (item.showLabel) labelText = label.split('/')
          return (
            <div>
              <el-button
                onClick={() => {
                  this.$set(item, 'value', item.toggle[0])
                }}
                type="text"
                style={{
                  color: item.toggle[1] === item.value ? '#999' : '#108ee9',
                  marginRight: '4px',
                  fontSize: '12px',
                  fontWeight: 'bold'
                }}
              >
                {item.showLabel
                  ? labelText[0]
                  : item.toggle[0] === 'asin'
                  ? item.toggle[0].toUpperCase()
                  : item.toggle[0]}
              </el-button>
              /
              <el-button
                onClick={() => {
                  this.$set(item, 'value', item.toggle[1])
                }}
                type="text"
                style={{
                  color: item.toggle[0] === item.value ? '#999' : '#108ee9',
                  fontSize: '12px',
                  marginLeft: '4px',
                  fontWeight: 'bold'
                }}
              >
                {item.showLabel
                  ? labelText[1]
                  : item.toggle[1] === 'sku'
                  ? item.toggle[1].toUpperCase()
                  : item.toggle[1]}
              </el-button>
            </div>
          )
        } else {
          let headerTooltip
          if (item.headerTooltip) {
            headerTooltip = (
              <el-tooltip placement="top">
                <div slot="content">{item.headerTooltip}</div>
                <i style="margin-left:6px" class="el-icon-info" />
              </el-tooltip>
            )
            // return (
            //   <span>
            //     {label}
            //     {headerTooltip}
            //   </span>
            // )
          }
          return item.renderHeader ? (
            <div class="headerDiv flex">
              {item.renderHeader.call(this, h, { column, $index })}
              {headerTooltip}
            </div>
          ) : item.type === 'array' ? (
            <span class="double-title">
              <span class="__title">
                {vm.renderHeader(item.children[0])(h, { column, $index })}
                {headerTooltip}
              </span>
              <br />
              <span class="__subtitle">
                {item.children[1].showLabel === false
                  ? ''
                  : vm.renderHeader(item.children[1])(h, { column, $index })}
                {headerTooltip}
              </span>
            </span>
          ) : (
            <span>
              {item.label}
              {headerTooltip}
            </span>
          )
        }
      }
      //
    },

    showRow() {
      showRow.apply(this, arguments)
    },
    rowClassName(row) {
      let cls = []
      if (this.treeStripe) {
        cls.push(this.innerTableRowClassName.apply(this, arguments))
      }
      if (this.tableRowClassName) {
        cls.push(this.tableRowClassName.apply(this, arguments))
      }
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent.__show
        : true
      row.row.__show = show
      if (!show) {
        cls.push('__none')
      }
      return cls.join(' ')
    },
    innerTableRowClassName({ row, rowIndex }) {
      if (rowIndex === this.listToArray.length - 1) {
        this.innerTableRowClassName.count = null
      }
      if (this.innerTableRowClassName.count == null) {
        this.innerTableRowClassName.count = 0
      }

      const show = row.parent ? row.parent._expanded && row.parent.__show : true
      if (show) {
        this.innerTableRowClassName.count++
      }
      if (this.innerTableRowClassName.count % 2 == 0) {
        return ''
      } else {
        return 'tree-table__row--striped'
      }
    },
    // 展开函数
    evalFunc(data, expandAll, parent = null, level = null) {
      // console.log(data);
      
      let tmp = [],
        vm = this,
        children = this.treeTableOtions.childs
      Array.from(data).forEach(function(record) {
        // if (index === data.length - 1) {
        //   vm.rowCount = 0
        // }
        // if (record['_root']) {
        //   root = record
        // }
        if (record._expanded === undefined) {
          Vue.set(record, '_expanded', expandAll)
          if (expandAll) {
            Vue.set(record, '__show', true)
          }
        }
        let _level = 1
        if (level !== undefined && level !== null) {
          _level = level + 1
        }
        Vue.set(record, '_level', _level)
        if (parent) {
          // 如果有父元素 在大数据表格时会有循环引用的bug
          if (vm.bigData) {
            const p = { ...parent }
            delete p[children]
            Vue.set(record, 'parent', p)
          } else {
            Vue.set(record, 'parent', parent)
          }
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
    handleToggleMethod(item, scope) {
      item.toggleMethod(scope)
    },
    toggleRowSelection(row, selected) {
      return this.$refs.table.toggleRowSelection(row, selected)
    },
    sortChange(obj) {
      this.$emit('sortChange', obj)
    },
    selectChange() {
      this.$nextTick(() => {
        this.$emit('selectChange', this.$refs.table.selection)
      })
    },
    plselectChange(val) {
      if (val.length === this.listToArray.length) {
        this.allChecked = true
      } else {
        this.allChecked = false
      }
      let checkBoxCol = document.querySelectorAll(
        '.el-table-column--selection:not(.is-hidden)'
      )[0]
      let span = checkBoxCol.querySelectorAll('span.is-disabled')[0]

      setTimeout(() => {
        if (this.allChecked) {
          span.classList.add('is-checked')
        } else {
          span.classList.remove('is-checked')
        }
      }, 50)

      this.$nextTick(() => {
        this.$emit('selectChange', val)
      })
    },
    clearCopyWrapper(liEvent) {
      let ul = document.querySelectorAll('.copy-ul')[0]

      if (ul) {
        let li = ul.querySelectorAll('li')[0]
        li.removeEventListener('click', liEvent)
        document.removeEventListener('click', this._documentEventer)
        document.body.removeChild(ul)
      }
    },
    rowContextmenu(row, column, event) {
      console.log(row, column, event)
      function getCellDom(dom) {
        let cur = dom
        while (dom.className && dom.className.indexOf('cell') == -1) {
          dom = dom.parentElement
        }
        return cur
      }
      let vm = this,
        { columns } = this,
        { target } = event,
        cell = getCellDom(target),
        cellVal = cell ? cell.innerText : ''
      let { label, type, property } = column,
        curRowItem = columns.find(el => el.value == property),
        // eslint-disable-next-line no-unused-vars
        { _enum, copyProps } = curRowItem,
        value = copyProps ? row[copyProps] : cellVal
      // value = !property
      //   ? cellVal
      //   : _enum
      //   ? getEnum({ _enum, value: property }, { row })
      //   : row[property]

      function liEvent() {
        vm.$copyText(value + '').then(() => {
          // vm.$message.success('复制成功')
          li.removeEventListener('click', liEvent)
          document.removeEventListener('click', this._documentEventer)
        })
      }
      this.clearCopyWrapper(liEvent)
      if (label !== '操作' && type !== 'selection') {
        event.preventDefault()
      }
      let ul, li
      if (document.querySelectorAll('.copy-ul').length) {
        ul = document.querySelectorAll('.copy-ul')[0]
        li = ul.querySelectorAll('li')[0]
      } else {
        ul = document.createElement('ul')
        li = document.createElement('li')
        ul.appendChild(li)

        li.addEventListener('click', liEvent)
        li.innerHTML = '复制'
        ul.className = 'copy-ul'
        ul.style.zIndex = '3333'

        // 绑定document点击事件
        this._documentEventer = () => {
          li.removeEventListener('click', liEvent)
          document.removeEventListener('click', this._documentEventer)
          document.body.removeChild(ul)
        }
        document.addEventListener('click', this._documentEventer)

        ul.style.backgroundColor = '#fff'
        ul.style.boxShadow =
          '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14), 0px 3px 14px 2px rgba(0,0,0,0.12)'
        ul.style.borderRadius = '5px'
        ul.style.cursor = 'pointer'

        li.style.fontSize = '13px'
        li.style.padding = '12px 20px'
        document.body.appendChild(ul)
      }
      ul.style.position = 'fixed'
      ul.style.display = 'block'
      ul.style.left = event.clientX + 'px'
      ul.style.top = event.clientY + 'px'

      // debugger
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    handleTableScroll() {
      let table = this.$refs.bigTab.$el
      const plxTableBodyWrapper = table.querySelectorAll(
        '.plx-table--body-wrapper.body--wrapper'
      )[0]
      const scrlLeft = plxTableBodyWrapper.scrollLeft
      const headerTb = this.$refs.table.$el
      const headerWp = headerTb.querySelectorAll('.el-table__header-wrapper')[0]
      headerWp.scrollLeft = scrlLeft
      this.tableScrlLeft = scrlLeft
    }
  },
  watch: {
    listToArray(newVal, oldVal) {
      if (!this.bigData) {
        return
      }
      if (newVal !== oldVal) {
        let checkBoxCol = document.querySelectorAll(
          '.el-table-column--selection:not(.is-hidden)'
        )[0]
        let span = checkBoxCol.querySelectorAll('span.is-disabled')[0]
        span.classList.remove('is-checked')
        this.allChecked = false
        try {
          
          this.$emit('selectChange', this.$refs.bigTab.$refs.table.$refs.xTable.selection)
        } catch (e) {
          // 
        }
      }
    },
    radioVal(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('selectChange', [val])
      }
    }
  },
  components: {
    BigTable
  }
}
</script>

<style lang="scss" scoped>
// .mar-auto {
//   margin: 0 auto;
// }
.warning {
  background: oldlace;
}
.toggle-wrapper {
  position: relative;
  .custom-btn {
    position: absolute;
    top: 0;
    right: 15px;
    height: 69px;
  }
}
</style>
<style lang="scss">
$table-border-color: #bbb;
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
.toggle-wrapper {
  .custom-btn {
    i {
      font-size: 16px;
    }
  }
}
.custom-dropbtn {
  i {
    font-size: 16px;
  }
}
.custom-eltable {
  // .el-table
  &.el-table {
    & th.is-leaf:not(.el-table-column--selection) > .cell {
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      position: initial;
      // span {
      //   // width: 100%;
      // }
    }
    // &.el-table table:not(.el-table__header) .cell :not(.item-btn) *,
    // &.el-table table:not(.el-table__header) .cell :not(.over) *,
    .over {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      display: block !important;
    }
    .over {
      display: flex;
    }
    & .caret-wrapper {
      // position: absolute;
      right: 0;
      top: -5px;
    }
  }
  .el-button--text {
    padding: 6px 0px;
  }

  &.el-table td,
  &.el-table th.is-leaf {
    border-color: $table-border-color;
  }
  &.el-table--border::after,
  &.el-table--group::after,
  &.el-table::before {
    background-color: $table-border-color;
  }
  .double-title {
    i {
      opacity: 0.5;
    }
    .__title {
      font-size: 12px;
    }
    .__subtitle {
      font-size: 12px;
      color: #666666;
    }
    .___subtitle {
      & > span {
        font-size: 12px;
        color: #666666;
        // margin-top: 8px;
        display: inline-block;
      }
    }
  }
  .__none {
    display: none;
  }
}
// .tree-table__row--striped {
//   & > td {
//     background-color: #fafafa;
//   }
// }
.selection-radio-table {
  .el-table-column--selection {
    .el-checkbox {
      display: none;
    }
  }
  .custom-selection-radio {
    .el-radio__label {
      display: none;
    }
  }
}
.table-edit-form {
  .el-form-item {
    margin-bottom: 0;
  }
}
.empty-content-isempty {
  .el-table__empty-block {
    display: none;
  }
}
</style>
