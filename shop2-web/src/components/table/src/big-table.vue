<template>
  <div :style="{height: height + 'px'}">
    <!-- <yt-table ref="tableHead" class="empty-content-isempty" @sortChange="sortChange" :columns="columns" :data="[]"></yt-table> -->
    <plx-table-grid
      :spanMethod="spanMethod"
      auto-resize
      @selection-change="handleSelectionChange"
      @select="handleSelect"
      class="custom-eltable"
      :show-header="showHeader"
      @table-body-scroll="handleTableScroll($event)"
      v-if="isRoot"
      stripe
      :row-class-name="rowClassName"
      :row-style="showRow"
      size="mini"
      :paginationShow="false"
      :datas="tableData"
      ref="table"
    >
      <slot name="topleft"></slot>
      <plx-table-column :show-overflow="false" type="selection" width="46" fixed="left" />
      <!-- <plx-table-column type="index" width="100" fixed="left" /> -->
      <template v-for="(item) in columns">
        <plx-table-column
          v-if="!item.merge"
          :show-overflow="item.noTooltip !== false"
          :key="item.value"
          :resizable="true"
          :prop="item.value"
          :label="item.label"
          :fixed="item.fixed"
          :width="item.width"
        >
          <template slot-scope="scope">
            <table-colvalue
              @expand="handleExpand"
              :item="item"
              :tableList="tableData"
              :fixedMinusOne="fixedMinusOne"
              :scope="{...scope, $index: scope.$rowIndex}"
              :style="item.style ||''"
              :pageSize="$attrs.pageSize"
              :pageNo="$attrs.pageNo"
              :arr="$attrs.data"
              :treeTableOtions="$attrs.treeTableOtions"
            />
          </template>
        </plx-table-column>
        <template v-if="item.merge">
          <plx-table-column
            :show-overflow="k.noTooltip !== false"
            v-for="k in item.merge"
            :key="k.value"
            :resizable="true"
            :prop="k.value"
            :fixed="k.fixed"
            :label="k.label"
            :width="k.width"
          >
            <template slot-scope="scope">
              <table-colvalue
                @expand="handleExpand"
                :item="k"
                :tableList="tableData"
                :fixedMinusOne="fixedMinusOne"
                :scope="{...scope, $index: scope.$rowIndex}"
                :style="k.style ||''"
                :pageSize="$attrs.pageSize"
                :pageNo="$attrs.pageNo"
                :arr="$attrs.data"
                :treeTableOtions="$attrs.treeTableOtions"
              />
            </template>
          </plx-table-column>
        </template>
      </template>
      <slot name="right"></slot>
    </plx-table-grid>
  </div>
</template>
<script>
import { PlxTableGrid, PlxTableColumn } from 'pl-table'
import { showRow, rowClassName } from './common-utils'
export default {
  name: 'big-table',
  components: {
    PlxTableGrid,
    PlxTableColumn
  },
  props: {
    fixedMinusOne: Boolean,
    spanMethod: Function,
    showHeader: {
      default: false
    },
    isRoot: {
      default: true
    },
    tableData: {
      default: () =>
        Array.from({ length: 2 }, (_, idx) => ({
          id: idx + 1,
          date: '2016-05-03',
          name: 1,
          ab: '欢迎',
          address: 1 + idx
        }))
    },
    columns: {
      default: () =>
        Array.from({ length: 500 }, (_, idx) => ({
          prop: 'address',
          label: '地址' + idx,
          width: 200,
          showOverflow: true,
          sortable: true,
          fixed: ''
        }))
    }
  },
  data() {
    return {
      treeStripe: true,
      height: 0,
      selection: []
    }
  },
  watch: {
    tableData() {
      this.height = 0
      this.$nextTick(() => {
        // debugger
        this.setHeight()
      })
    }
  },
  methods: {
    showRow,
    rowClassName,
    handleExpand() {
      this.$emit('expand')
      // setTimeout(() => {
      //   this.$refs.table.doLayout()
      //   this.$refs.table.setHeight()
      // }, 100);
    },
    innerTableRowClassName(data) {
      const { row, rowIndex } = data
      if (this.innerTableRowClassName.count == null) {
        this.innerTableRowClassName.count = 0
      }

      const show = row.parent ? row.parent._expanded && row.parent.__show : true
      if (show) {
        this.innerTableRowClassName.count++
      }
      if (rowIndex === this.tableData.length - 1) {
        // console.log(this.innerTableRowClassName.count);
        let count = this.innerTableRowClassName.count
        this.innerTableRowClassName.count = 0
        if (count % 2 !== 0) {
          return ''
        } else {
          return 'tree-table__row--striped'
        }
      }
      if (this.innerTableRowClassName.count % 2 !== 0) {
        return ''
      } else {
        return 'tree-table__row--striped'
      }
    },
    setHeight() {
      let grid = this.$refs.table.$el.querySelectorAll('.plx-grid')[0]
      this.height = grid.offsetHeight
    },
    handleTableScroll($event) {
      this.$emit('table-body-scroll', $event)
    },
    handleSelectionChange($event) {
      if (this.select) {
        return
      }
      this.$emit('plselectChange', $event)
    },
    handleSelect(selection, row) {
      this.select = true
      this.selection = selection
      this.$emit('select', selection, row)
      this.$nextTick(() => {
        this.select = false
      })
    }
  }
}
</script>
<style lang="scss">
$table-border-color: #dfdfdf;
$table-bg-color: #f2f2f2;
.has-scroll .plx-table--fixed-right-wrapper,
.has-scroll .el-table__fixed-right {
  transition: 0.1s;
  opacity: 1;
  right: -40px;
  z-index: 3;
}

.has-scroll:not(.show-right-btns) .plx-table--fixed-right-wrapper:not(._modal),
.has-scroll:not(.show-right-btns) .el-table__fixed-right:not(._modal) {
  transform: translateX(78px) scaleX(0);
  opacity: 0;
  // transition: 0.1s;
}
.fixed--right .el-table__fixed-right,
.fixed--right .plx-table--fixed-right-wrapper {
  opacity: 1;
  transform: translateX(0) scaleX(1);
}
.plx-table:before {
  // border-top: 1px solid $table-border-color;
  border-top: none;
}
.plx-table:after {
  border-bottom: 1px solid $table-border-color;
}
.plx-table .plx-table--border-line:after {
  border-right: 1px solid $table-border-color;
}
.plx-table .plx-table--border-line:before {
  border-left: 1px solid $table-border-color;
}

.plx-table.t--border .plx-table--fixed-left-wrapper {
  border-right: 1px solid $table-border-color;
}
.plx-table .plx-body--row.tree-table__row--striped td,
.plx-table .plx-body--row.tree-table__row--striped .plx-tree--btn-wrapper td {
  background: #fff;
}
.plx-table .plx-body--row:not(.tree-table__row--striped),
.plx-table
  .plx-body--row:not(.tree-table__row--striped)
  .plx-tree--btn-wrapper {
  background: $table-bg-color;
}
// .plx-table .plx-body--row[style^="animation"] {
//   color: red;
// }
// .plx-table .plx-body--row[style^="animation"]:nth-of-type(odd) {
//   background: $table-bg-color;
// }
// .plx-table .plx-body--row[style^="animation"]:nth-of-type(even) {
//   background: #fff;
// }

.plx-table.t--border:not(.b--style-none) .plx-body--column,
.plx-table.t--border:not(.b--style-none) .plx-footer--column,
.plx-table.t--border:not(.b--style-none) .plx-header--column {
  background-image: linear-gradient(
      -90deg,
      $table-border-color,
      $table-border-color
    ),
    linear-gradient(-180deg, $table-border-color, $table-border-color);
}
.plx-table .plx-cell--checkbox:before,
.plx-table .plx-cell--radio:before {
  border: 1px solid #a9a9a9;
}
.plx-table.size--mini {
  font-size: 13px;
  font-family: PingFangSC, 'Open Sans', sans-serif, microsoft yahei ui,
    microsoft yahei, simsun, helvetica neue, hiragino sans gb, arial !important;
  .plx-body--column,
  .plx-footer--column,
  .plx-header--column {
    display: table-cell;
    vertical-align: middle;
  }
  .plx-body--column {
    padding: 6px 0;
    min-height: 42px;
    max-height: 50px;
    line-height: 42px;
  }
  .plx-cell {
    min-height: 42px;
    max-height: 50px;
  }
  .plx-table--body-wrapper.fixed-right--wrapper {
    bottom: 0;
    .plx-table--body {
      height: 100%;
    }
  }
}
.rightHandles {
  .plx-cell {
    display: flex;
    align-items: center;
  }
}
.plx-table .plx-body--row.row--hover,
.plx-table .plx-body--row.row--hover .plx-tree--btn-wrapper,
.plx-table .plx-body--row.row--hover.row--stripe,
.plx-table .plx-body--row.row--hover.row--stripe .plx-tree--btn-wrapper,
.plx-table .plx-body--row.tree-table__row--striped.row--hover td,
.plx-table
  .plx-body--row.tree-table__row--striped.row--hover
  .plx-tree--btn-wrapper
  td {
  background-color: #f5f7fa;
}
</style>