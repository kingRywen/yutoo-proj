<template>
  <el-table
    :data="listToArray"
    :border="border"
    style="width: 100%;"
    @selection-change="selectChange"
    :reserve-selection="true"
    :row-key="reserveSelection"
    :row-style="showRow"
    class="custom-eltable"
    ref="table"
    :stripe="stripe"
    @select="handleSelect"
    :height="height"
    :max-height="maxHeight"
    :size="size"
    :span-method="spanMethod"
    @sort-change="sortChange"
    :row-class-name="rowClassName"
	:show-summary = 'getSummaries ? true : false'
	:summary-method="getSummaries"
	:empty-text = 'customEmptyText'
    tooltip-effect="light"
  >
    <el-table-column
      type="selection"
      width="55"
      align="center"
      v-if="selection"
      :selectable="selectableFunc"
      :reserve-selection="!!reserveSelection"
    ></el-table-column>
    <slot name="left"></slot>
    <slot></slot>
    <el-table-column
      v-for="item in columns"
      v-if="!item.isShow"
      :width="item.width"
      :render-header="renderHeader(item)"
      :min-width="item.minWidth"
      :key="item.label"
      :label="item.label"
      :align="item.align || (item.expand ? 'left' : 'center')"
      :sortable="item.sortable || false"
      :show-overflow-tooltip="item.showTooltip"
      :prop="item.value"
    >
      <template v-if="item.merge">
        <el-table-column
          v-for="k in item.merge"
          :width="k.width"
          :key="k.label"
          :min-width="item.minWidth"
          :prop="k.value"
          :label="k.label"
          :show-overflow-tooltip="item.showTooltip"
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
                  :style="{width:(item.style && item.style.width || '30') + 'px', height: (item.style && item.style.width || '30') + 'px'}"
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
                :style="{width:(item.style && item.style.width || '30') + 'px', height: (item.style && item.style.width || '30') + 'px'}"
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
              :icon="!scope.row._open ? 'el-icon-caret-bottom' : 'el-icon-caret-top'"
            ></el-button>
          </template>
        </div>

        <!-- 链接 -->
        <div
          :style="item.expand ? { paddingLeft: (scope.row._level - 1) * 20 + 'px' } : null"
          v-tooltip="scope.row"
          class="link-wrapper"
          v-else-if="item['url']"
        >
          <template v-if="(!scope.row.show || item.noShowTooltip) && item.showTooltip">
            <el-button
              v-if="item.expand"
              type="text"
              :icon="`el-icon-${
            scope.row.loading ? 'loading' : scope.row._expanded ? 'caret-bottom' : 'caret-right'
          }`"
              @click.stop="handleExpand(scope, item)"
              :style="{ visibility: !treeTableOtions.expandFunc(scope.row) ? `hidden` : null }"
            ></el-button>
            <a
              class="url"
              v-if="scope.row[item.value] != null && scope.row[item.value] !== ''"
              :href="scope.row[item.url]"
              target="_blank"
              :style="item.style ||''"
            >{{scope.row[item.value]}}</a>
            <span v-else>-</span>
          </template>

          <ElTooltip v-else :content="scope.row[item.value]" placement="top" effect="light">
            <div>
              <el-button
                v-if="item.expand"
                @click.stop="handleExpand(scope, item)"
                type="text"
                :style="{ visibility: !treeTableOtions.expandFunc(scope.row) ? `hidden` : null }"
                :icon="`el-icon-${
            scope.row.loading ? 'loading' : scope.row._expanded ? 'caret-bottom' : 'caret-right'
          }`"
              ></el-button>
              <a
                v-if="scope.row[item.value] != null && scope.row[item.value] !== ''"
                class="url"
                :href="scope.row[item.url]"
                target="_blank"
                :style="item.style ||''"
              >{{scope.row[item.value]}}</a>
              <span v-else>-</span>
              </div>
          </ElTooltip>
        </div>
        <!-- 状态枚举 -->
        <template v-else-if="item['enum']">
          <span>{{getEnum(item, scope)}}</span>
        </template>

        <!-- 货币符号 -->
        <template v-else-if="item['money']">
          <span>{{getMoney(item,scope)}}</span>
        </template>

        <!-- 百分比 -->
        <template v-else-if="item['isPercent']">
          <span>{{getPercent(item,scope)}}</span>
        </template>

        <!-- 多个 -->
        <template v-else-if="item['children']" v-for="(j, jIndex) in scope.row[item.children]">
          <div :style="item.style ||''" v-if="item.value" :key="jIndex">{{j[item.value]}}</div>
          <div :style="item.style ||''" :key="jIndex" v-else>
            <b>{{j[item.prop.key]}}:</b>
            {{j[item.prop.value]}}
          </div>
        </template>
        <!-- 多个属性合并显示 -->
        <template v-else-if="item['multi']">
          <div :style="item.style ||''" v-for="(i,_index) in item['multi']" :key="_index">
            <span
              v-if="typeof i === 'object'"
            >{{i.label}}: {{typeof i.value === 'function' ? i.value(scope) : scope.row[i.value]}}</span>
            <span v-else>{{scope.row[i]}}</span>
          </div>
        </template>
        <!--  -->
        <!-- 普通 -->
        <div v-else>
          <table-colvalue
            :arr="data"
            :item="item"
            :scope="scope"
            :checkStrict="checkStrict"
            :treeTableOtions="treeTableOtions"
            :searchData="searchData"
            :style="item.style ||''"
          />
          <!-- {{getVal(item, scope)}} -->
        </div>
      </template>
    </el-table-column>
    <!--  -->
    <slot name="right"></slot>
  </el-table>
</template>

<script>
import Vue from 'vue'

Vue.component('table-colvalue', {
  props: ['item', 'scope', 'arr', 'treeTableOtions', 'searchData', 'checkStrict'],
  render(h) {
    // debugger
    const { row } = this.scope
    const {
      value,
      render,
      formatter,
      expand,
      noRetract,
      async,
      asyncFunc,
      line,
      type
    } = this.item
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
              // this.checkStrict(row)
            })
          } else {
            this.$set(row, '_expanded', true)
            // this.checkStrict(row)
          }
        } else {
          // 不需要请求后台
          this.$set(row, '_expanded', true)
          // this.checkStrict(row)
        }
      } else {
        row._expanded = false
        // this.checkStrict(row)
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
            loading ? 'loading' : _expanded ? 'caret-bottom' : 'caret-right'
          }`}
          disabled={loading}
          onClick={e => handleExpand(e)}
        />
      )
    }

    // 处理搜索高亮
    if (
      !render && 
      this.searchData &&
      this.searchData[value] != null &&
      row[value].indexOf(this.searchData[value]) > -1 
    ) {
      let replaceVal = this.searchData[value].trim()
      let spe = row[value].split(new RegExp(`${replaceVal}`))
      // jsx = jsx
      jsx = (
        <span>
          {spe.map((el, index) => (
            <span>
              {el}
              {spe.length - 1 === index ? null : (
                <span class="highlight-text">{replaceVal}</span>
              )}
            </span>
          ))}
        </span>
      )
    }

    let content = (
      <div style={expand ? { paddingLeft: (_level - 1) * 20 + 'px' } : null}>
        {expandJsx}
        {jsx}
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
      message: 'aa',
      name: null,
      rowCount: 0
    }
  },

  directives: {
    tooltip: {
      inserted: (el, binding, vnode) => {
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
	customEmptyText:{
		type:String,
		default:'暂无数据'
	},
    expandAll: {
      default: false
    },
    // 搜索数据
    searchData: Object,
	getSummaries:{
		default:()=>{}
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
    selection: {
      type: Boolean,
      default: true
    },
    columns: {
      required: true,
      type: Array,
      default: () => [
        //                     children:'arr', //如数组传入的table数据对应Arr
        //                     label: "多个数组",
        //                     value:"a", // 数组里面需要显示的值
        //                     style:{
        //                         color:"red"
        //                     }
        //                 },
        //                 {
        //                     value: "logo", //table需要渲染的值
        //                     label: "LOGO",//表头
        //                     width: "300",//当前行宽度
        //                     img:true,   //如图片传
        //                     style:{     //图片宽高
        //                         width:80,
        //                         height:80
        //                     },
        //                     bulkyHeight:180 //鼠标hover图片高，宽度自动
        //                 },
        //
        //
        //                 {
        //                     value: "name",  //a链接显示的值
        //                     label: "姓名",
        //                     width: "300",
        //                     url:'herf', //如a链接table数据的跳转url
        //                     style:{
        //                         color:'#fff',
        //                         background:'green',
        //                     }
        //                 },
        //                 {
        //                     value: "date",
        //                     label: "时间",
        //                     width: "300"
        //                 },
        //                 {
        //                     value: "address",
        //                     label: "地址",
        //                     width: "300"
        //                 },
        // {
        //   label: '地址',  //表头嵌套
        //   merge: [
        //     {
        //       label: '省份',
        //       value: 'province'
        //     },
        //     {
        //       label: '市区',
        //       value: 'city'
        //     }
        //   ]
        // }
      ]
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
    }
  },
  methods: {
    getPercent(item, scope) {
      let perField = item.value
      let showField = scope.row[perField]
      if (showField || showField == 0) {
        if (showField) {
          let num = item.keepFew || 0
          var percent = Number(showField * 100).toFixed(num) + '%'
          return percent
        } else {
          return showField + '%'
        }
      } else {
        return '-'
      }
    },
    getMoney(item, scope) {
      let moneyField = item.value
      let showField = scope.row[moneyField]
      if (showField || showField == 0) {
        if (showField) {
          return `${item['money'] === 'us' ? '$' : '¥'} ` + showField
        } else {
          // return showField
		  return `${item['money'] === 'us' ? '$' : '¥'} ` + showField
        }
      } else {
        return '-'
      }
    },
    handleSelect(select, row) {
      console.log(row._expanded,this.$refs.table.selection.indexOf(row) === -1);
      
      if (row._expanded || this.$refs.table.selection.indexOf(row) === -1) {
        this.checkStrict(row)
			}
      this.$emit('select', select, row)
    },
    checkStrict(row) {
	  if(!row[this.treeTableOtions.childs] || !row[this.treeTableOtions.childs].length) return
      // 如果没有展开时，判断父产品是否选中，选中的话子产品也要选中
      this.$nextTick(() => {
        let i = this.listToArray.indexOf(row)
        while (i < this.listToArray.indexOf(row) + row[this.treeTableOtions.childs].length) {
          i++
          this.$refs.table.toggleRowSelection(
            this.listToArray[i],
            this.$refs.table.selection.indexOf(row) > -1
          )
        }
      })
    },
    renderHeader(item) {
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

            // <el-select size="small" value={item.value} onChange={(e) => {
            //   this.$set(item, 'value', e)
            // }}>
            //   {item.toggle.map(el => (
            //     <el-option label={el} value={el} key={el} />
            //   ))}
            // </el-select>
          )
        } else {
          // console.log(arguments);
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
          ) : (
            <span>{item.label}</span>
          )
        }
      }
      //
    },
    handleExpand(scope, item) {
      const { row } = scope
      const { value, render, formatter, expand, async, asyncFunc, type } = item
      // const { expandFunc } = expandOptions;
      const { childs, expandFunc } = this.treeTableOtions || {}
      const { loading, _expanded, _level } = row
      const _child = row[childs]
      let jsx, expandJsx
      // 点击下拉

      if (!_expanded) {
        if (async) {
          if (!_child) {
            // 需要请求后台
            this.$set(row, 'loading', true)
            asyncFunc(row).then(data => {
              row.loading = false
              this.$set(row, childs, data)
              this.$set(row, '_expanded', true)
              // this.checkStrict(scope.row)
            })
          } else {
            this.$set(row, '_expanded', true)
            // this.checkStrict(scope.row)
          }
        } else {
          // 不需要请求后台
          this.$set(row, '_expanded', true)
          // this.checkStrict(scope.row)
        }
      } else {
        row._expanded = false
        // this.checkStrict(scope.row)
      }
    },
    getEnum(item, scope) {
      let key = scope.row[item.value] // 3
      let _k
      if (key == null) {
        return '-'
      }
      if (!item.enum.hasOwnProperty(key)) {
        Object.keys(item.enum)
          .filter(el => parseInt(el) != el)
          .forEach(k => {
            try {
              let fn = new Function('key', `return key ${k}`)
              if (fn(key)) {
                _k = k
                return false
              }
            } catch (error) {}
          })
        return item.enum[_k]
      } else {
        return item.enum[scope.row[item.value]]
      }
    },
    showRow: function(row) {
      let style =
          'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;',
        color = ''
      if (this.treeColor) {
        color =
          'background-color: ' +
          (typeof this.treeColor === 'string' ? this.treeColor : '#f2f6fc')
      }
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      return show
        ? row.row._level !== 1
          ? style + color
          : style
        : 'display:none;'
    },
    rowClassName() {
      let cls = []
      if (this.treeStripe) {
        cls.push(this.innerTableRowClassName.apply(this, arguments))
      }
      if (this.tableRowClassName) {
        cls.push(this.tableRowClassName.apply(this, arguments))
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

      const show = row.parent ? row.parent._expanded && row.parent._show : true
      if (show) {
        this.innerTableRowClassName.count++
      }
      if (this.innerTableRowClassName.count % 2 == 0) {
        if (row._level > 1) {
          return 'child'
        }
        return ''
      } else {
        if (row._level > 1) {
          return 'child tree-table__row--striped'
        }
        return 'tree-table__row--striped'
      }

      
    },
    // 展开函数
    evalFunc(data, expandAll, parent = null, level = null) {
      expandAll = expandAll || this.expandAll
      let tmp = [],
        vm = this,
        children = this.treeTableOtions.childs
      Array.from(data).forEach(function(record, index) {
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
    sortChange({ column, prop, order }) {
      this.$emit('sortChange', { column, prop, order })
    },
    selectChange(val) {
      this.$emit('selectChange', val)
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    }
  },
  components: {},
}
</script>

<style lang="scss" scoped>
.mar-auto {
  margin: 0 auto;
}
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
  .el-button {
    padding: 6px 0px;
  }
}
.tree-table__row--striped {
  & > td {
    background-color: #fafafa;
  }
}
.child {
  & > td {
    background-color: #f2f6fc !important;
  }
}
</style>
