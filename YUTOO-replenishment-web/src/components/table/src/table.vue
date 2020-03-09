<template>
  <el-table
    :data="listToArray"
    :border="border"
    style="width: 100%;"
    @selection-change="selectChange"
    :reserve-selection="true"
    :row-key="reserveSelection"
    :row-style="showRow"
    :class="[{'selection-radio-table':selection === 'radio' }, 'custom-eltable']"
    ref="table"
    :stripe="stripe"
    @select="handleSelect"
    :height="height"
    :max-height="maxHeight"
    :size="size"
    :span-method="spanMethod"
    @row-click="handleRowClick"
    @sort-change="sortChange"
    :row-class-name="rowClassName"
    :highlight-current-row="selection === 'radio'"
    tooltip-effect="light"
  >
    <el-table-column
      type="selection"
      width="55"
      align="left"
      v-if="selection && selection !== 'radio'"
      :selectable="selectableFunc"
      :reserve-selection="!!reserveSelection"
    ></el-table-column>
    <el-table-column
      type="selection"
      width="55"
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
        :show-overflow-tooltip="item.noTooltip"
        v-if="!item.isShow"
        :width="item.width"
        :render-header="renderHeader(item)"
        :min-width="item.minWidth"
        :key="item.label"
        :label="item.label"
        :align="item.align || 'left'"
        :sortable="item.sortable || false"
        :prop="item.value"
      >
        <template v-if="item.merge">
          <el-table-column
            v-for="k in item.merge"
            :width="k.width"
            :key="k.label"
            :prop="k.value"
            :label="k.label"
            :align="k.align || 'center'"
            :sortable="k.sortable || false"
          >
            <template slot-scope="scope">
              <table-colvalue :item="k" :scope="scope" :style="k.style ||''" />
            </template>
          </el-table-column>
        </template>
        <template slot-scope="scope">
          <!-- 图片 -->
          <div v-if="item['img']" class="toggle-wrapper">
            <el-tooltip effect="light" placement="right">
              <div
                slot="content"
                class="__img_wrapper mar-auto"
                :style="{width:(item.bulkyHeight || '200') + 'px', height: (item.bulkyHeight || '200') + 'px'}"
              >
                <img
                  class="loadingImg"
                  :key="scope.row[item.value]"
                  v-lazy="scope.row[item.value] && scope.row[item.value].replace('._SL75_.', `._SL${item.bulkyHeight || '200'}_.`)"
                />
              </div>
              <el-badge
                v-if="item.badge"
                :value="item.badge(scope)"
                :type="item.badgeType ? item.badgeType(scope) : 'primary'"
                style="z-index:999;margin:10px;"
              >
                <div>
                  <div
                    class="__img_wrapper mar-auto"
                    :style="{width:(item.style && item.style.width || '60') + 'px', height: (item.style && item.style.width || '60') + 'px'}"
                  >
                    <img
                      class="loadingImg"
                      :key="scope.row[item.value]"
                      v-lazy="scope.row[item.value] && scope.row[item.value].replace('._SL75_.', `._SL${item.bulkyHeight || '200'}_.`)"
                    />
                  </div>
                </div>
              </el-badge>
              <template v-else>
                <div
                  class="__img_wrapper mar-auto"
                  :style="{width:(item.style && item.style.width || '60') + 'px', height: (item.style && item.style.width || '60') + 'px'}"
                >
                  <a class="__img_wrapper mar-auto" v-if="item.link" target="_blank" :href="scope.row[item.link]">
                    <img
                      class="loadingImg"
                      :key="scope.row[item.value]"
                      v-lazy="scope.row[item.value] && scope.row[item.value].replace('._SL75_.', `._SL${item.bulkyHeight || '200'}_.`)"
                    />
                  </a>
                  <img
                    v-else
                    class="loadingImg"
                    :key="scope.row[item.value]"
                    v-lazy="scope.row[item.value] && scope.row[item.value].replace('._SL75_.', `._SL${item.bulkyHeight || '200'}_.`)"
                  />
                </div>
              </template>
            </el-tooltip>
            <template v-if="item.toggleMethod && scope.row.products && scope.row.products.length> 1">
              <el-button
                class="custom-btn"
                @click="handleToggleMethod(item, scope)"
                type="text"
                :icon="!scope.row._open ? 'el-icon-arrow-down' : 'el-icon-caret-top'"
              ></el-button>
            </template>
          </div>
          <!-- 普通 -->
          <div v-else>
            <table-colvalue
              :arr="data"
              :item="item"
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
  </el-table>
</template>

<script>
import Vue from 'vue'
// eslint-disable-next-line no-unused-vars
import {
  getEnum,
  getMoney,
  getPercent,
  getLink,
  handleExpand
} from './table-utils'

Vue.component('table-colvalue', {
  name: 'table-colvalue',
  props: ['item', 'scope', 'arr', 'treeTableOtions'],
  render(h) {
    // debugger
    const { scope, item } = this
    const { row } = scope
    const {
      value,
      render,
      formatter,
      expand,
      async,
      _enum,
      money,
      numField,
      asyncFunc,
      isPercent,
      showTooltip,
      urlItem,
      url,
      line,
      type
    } = item
    let numJsx
    if (numField) {
      let el = row[numField]
      if (Array.isArray(el)) {
        el = el.length
      }
      numJsx = el ? <span> ( {el} )</span> : null
    }

    if (type === 'array') {
      return (
        <div class={['double-title', { 'is-expand': item.children[0].expand }]}>
          <div>
            <table-colvalue
              item={item.children[0]}
              scope={scope}
              treeTableOtions={this.treeTableOtions}
              arr={this.arr}
            />
          </div>
          <table-colvalue
            item={item.children[1]}
            scope={scope}
            treeTableOtions={this.treeTableOtions}
            arr={this.arr}
            class="___subtitle"
            style={
              item.children[0].expand
                ? { paddingLeft: 19 * row._level + 'px' }
                : null
            }
          />
        </div>
      )
    }

    if (_enum || money || isPercent || showTooltip || url) {
      if (url) {
        return (
          <div>{getLink(h, item, scope, this.treeTableOtions, numJsx)}</div>
        )
      }
      if (_enum) {
        return <span>{getEnum(item, scope)}</span>
      }
      if (money) {
        return <span>{getMoney(item, scope)}</span>
      }
      if (isPercent) {
        return <span>{getPercent(item, scope)}</span>
      }
      if (showTooltip) {
        return row[value] ? (
          <el-tooltip placement="top" effect="light">
            <span slot="content">{row[value]}</span>
            {urlItem ? (
              <a
                style="color: rgb(16, 142, 233);"
                href={urlItem}
                target="_blank"
                class="fix__row_2"
              >
                {row[value]}
                {numJsx}
              </a>
            ) : (
              <span class="fix__row_2">
                {row[value]}
                {numJsx}
              </span>
            )}
          </el-tooltip>
        ) : (
          <span>-</span>
        )
      }
    }

    let childs, expandFunc, jsx, expandJsx, _child
    // const { expandFunc } = expandOptions;
    if (expand) {
      childs = this.treeTableOtions.childs
      expandFunc = this.treeTableOtions.expandFunc
      _child = row[childs]
    }

    const { loading, _expanded, _level } = row
    // const _child = row[childs]
    // 点击下拉
    const handleExpand = () => {
      if (!_expanded) {
        if (async) {
          if (!_child) {
            // 需要请求后台
            this.$set(row, 'loading', true)
            asyncFunc(row).then(data => {
              row.loading = false
              this.$set(row, childs, data)
              this.$set(row, '_expanded', true)
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
    }
    if (formatter && typeof formatter === 'function') {
      jsx = <span>{formatter(this.scope, this.item)}</span>
    } else if (render && typeof render === 'function') {
      // 如果是切换效果的列，需要处理一下值
      let val = row[value]
      val = val === null || val === '' || val === undefined ? '-' : val
      jsx = render(h, this.scope, this.arr, val)
    } else {
      const _value = row[value]
      jsx = (
        <span>
          {_value === null || _value === '' || _value === undefined
            ? '-'
            : _value}
        </span>
      )
    }
    // debugger
    if (expand) {
      expandJsx = (
        <el-button
          type="text"
          style={{ visibility: !expandFunc(row) ? `hidden` : null }}
          icon={`el-icon-${
            loading ? 'loading' : _expanded ? 'arrow-down' : 'arrow-right'
          }`}
          disabled={loading}
          onClick={e => handleExpand(e)}
        />
      )
    }

    let content = (
      <div style={expand ? { paddingLeft: (_level - 1) * 20 + 'px' } : null}>
        {expandJsx}
        {jsx}
        {numJsx}
      </div>
    )
    return line && row[value] != null && row[value] !== '' ? (
      <el-tooltip effect="light" placement="top" open-delay={300}>
        <div slot="content">{jsx}</div>
        <div class="wrap-overflow-2" style={{ '-webkit-line-clamp': line }}>
          {content}
        </div>
      </el-tooltip>
    ) : (
      content
    )
  }
})

export default {
  inheritAttrs: false,
  name: 'YtTable',
  data() {
    return {
      name: null,
      radioVal: null
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
      type: Function,
      default: () => {}
    },
    tableRowClassName: {
      type: Function
    },
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
      default: false
    },
    height: [String, Number],
    maxHeight: [String, Number]
  },
  computed: {
    listToArray() {
      if (!this.treeTable) {
        return this.data
      }
      let tmp = this.data || []
      const func = this.evalFunc
      const args = [tmp, false]
      return func.apply(null, args)
    },
    currentCol() {
      let data = this.columns || [],
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
  methods: {
    handleExpand,
    handleRowClick(row) {
      if (this.selection !== 'radio') {
        return
      }
      this.radioVal = row
    },
    handleSelect(select, row) {
      // this.$emit('select', select, row)
      if (this.treeTable && !this.checkStrictly) {
        let newChild = []
        let child = row[this.treeTableOtions.childs]
        if (child && child.length) {
          let childNum =
            child.length +
            child.reduce((total, cur) => {
              return total + cur[this.treeTableOtions.childs]
                ? cur[this.treeTableOtions.childs].length
                : 0
            }, 0)
          let first = this.listToArray.indexOf(row)

          for (let index = first; index <= childNum; index++) {
            newChild.push(this.listToArray[index])
            this.$refs.table.toggleRowSelection(
              this.listToArray[index],
              !!~select.indexOf(row)
            )
          }
        }
        this.$emit('select', select.concat(newChild), row)
      } else {
        this.$emit('select', select, row)
      }
    },
    renderHeader(item) {
      let vm = this
      return (h, { column, $index }) => {
        if (item.toggle) {
          let labelText = []
          if (item.showLabel) labelText = item.label.split('/')
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
          if (item.headerTooltip) {
            return (
              <span>
                {item.label}
                <el-tooltip effect="light" placement="top">
                  <div slot="content">{item.headerTooltip}</div>
                  <i
                    style="color: #108ee9;margin-left:6px"
                    class="el-icon-question"
                  />
                </el-tooltip>
              </span>
            )
          }
          return item.renderHeader ? (
            item.renderHeader.call(this, h, { column, $index })
          ) : item.type === 'array' ? (
            <span class="double-title">
              <span class="__title">
                {vm.renderHeader(item.children[0])(h, { column, $index })}
              </span>
              <br />
              <span class="__subtitle">
                {vm.renderHeader(item.children[1])(h, { column, $index })}
              </span>
            </span>
          ) : (
            <span>{item.label}</span>
          )
        }
      }
      //
    },

    showRow(row) {
      let style =
          'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;',
        color = ''
      if (this.treeColor) {
        color =
          'background-color: ' +
          (typeof this.treeColor === 'string' ? this.treeColor : '#f2f6fc')
      }
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent.__show
        : true
      row.row.__show = show
      return show
        ? row.row._level !== 1
          ? style + color
          : style
        : { display: 'none' }
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
      let tmp = [],
        vm = this,
        children = this.treeTableOtions.childs
      Array.from(data).forEach(function(record) {
        // if (index === data.length - 1) {
        //   vm.rowCount = 0
        // }
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
    handleToggleMethod(item, scope) {
      item.toggleMethod(scope)
    },
    toggleRowSelection(row, selected) {
      return this.$refs.table.toggleRowSelection(row, selected)
    },
    sortChange(obj) {
      this.$emit('sortChange', obj)
    },
    selectChange(val) {
      this.$emit('selectChange', val)
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    }
  },
  watch: {
    radioVal(val, oldVal) {
      if (val !== oldVal) {
        this.$emit('selectChange', [val])
      }
    }
  },
  components: {}
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
    border-color: #e4e4e4;
  }
  &.el-table--border::after,
  &.el-table--group::after,
  &.el-table::before {
    background-color: #e4e4e4;
  }
  .double-title {
    .__title {
      font-size: 14px;
    }
    .__subtitle {
      font-size: 12px;
      color: #666666;
    }
    .___subtitle {
      & > span {
        font-size: 12px;
        color: #666666;
        margin-top: 8px;
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
</style>
