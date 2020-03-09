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
    :height="height"
    :max-height="maxHeight"
    :size="size"
    :span-method="spanMethod"
    @sort-change="sortChange"
    :row-class-name="tableRowClassName"
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
            <table-colvalue :item="k" :scope="scope" :style="k.style ||''"/>
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
              <img class="loadingImg" :key="scope.row[item.value]" v-lazy="scope.row[item.value]">
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
                  <img class="loadingImg" :key="scope.row[item.value]" v-lazy="scope.row[item.value]">
                </div>
              </div>
            </el-badge>
            <template v-else>
              <div
                class="__img_wrapper mar-auto"
                :style="{width:(item.style && item.style.width || '30') + 'px', height: (item.style && item.style.width || '30') + 'px'}"
              >
                <img class="loadingImg" :key="scope.row[item.value]" v-lazy="scope.row[item.value]">
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
          :style="item.expand && !item.noRetract ? { paddingLeft: (scope.row._level - 1) * 20 + 'px' } : null"
          v-tooltip="scope.row"
          class="link-wrapper"
          v-else-if="item['url']"
        >
          <template v-if="!scope.row.show || item.noShowTooltip">
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

          <ElTooltip v-else :content="scope.row[item.value]" placement="top">
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
        <template v-else-if="item['enum']">
          <span>{{getEnum(item, scope)}}</span>
        </template>

        <!-- 多个 -->
        <template v-else-if="item['children']" v-for="(j, jIndex) in scope.row[item.children]">
          11
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
            :treeTableOtions="treeTableOtions"
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
  props: ['item', 'scope', 'arr', 'treeTableOtions'],
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
      jsx = render(h, this.scope, this.arr)
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
    return (
      <div
        style={
          expand && !noRetract
            ? { paddingLeft: (_level - 1) * 20 + 'px' }
            : null
        }
      >
        {expandJsx}
        {jsx}
      </div>
    )
  }
})

export default {
  inheritAttrs: false,
  name: 'ShopYtTable',
  data() {
    return {
      message: 'aa',
      name: null
    }
  },

  directives: {
    tooltip: {
      inserted: (el, binding, vnode) => {
        let a = el.querySelectorAll('a')[0]
        if (a) {
          let height = a.offsetHeight
          if (parseInt(height) > 50) {
            Vue.set(binding.value, 'show', true)
          }
        }
      }
    }
  },

  props: {
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
      type: Function,
      default: () => {}
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
      type:String,
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
    renderHeader(item) {
      return (h, { column, $index }) => {
        if (item.toggle) {
          return (
            <div>
              <el-button
                onClick={() => {
                  this.$set(item, 'value', item.toggle[0])
                }}
                type="text"
                style={{ color: item.toggle[1] === item.value ? '#999' : null, marginRight:'10px', fontSize: '12px' }}
              >
                {item.toggle[0]}
              </el-button>
              /
              <el-button
                style={{ marginLeft: '4px' }}
                onClick={() => {
                  this.$set(item, 'value', item.toggle[1])
                }}
                type="text"
                style={{ color: item.toggle[0] === item.value ? '#999' : null, fontSize: '12px' }}
              >
                {item.toggle[1]}
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
          return <span>{item.label}</span>
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
    handleToggleMethod(item, scope) {
      item.toggleMethod(scope)
    },
    toggleRowSelection(row, selected) {
      return this.$refs.table.toggleRowSelection(row, selected)
    },
    sortChange({ column, prop, order }) {
      //console.log({ column, prop, order });
      this.$emit('sortChange', { column, prop, order })
    },
    selectChange(val) {
      this.$emit('selectChange', val)
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    }
  },
  components: {}
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
</style>
