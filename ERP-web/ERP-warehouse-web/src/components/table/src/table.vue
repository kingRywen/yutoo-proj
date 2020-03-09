<template>
  <el-table
    :data="data"
    :border="border"
    style="width: 100%"
    @selection-change="selectChange"
    :reserve-selection="true"
    :row-key="reserveSelection"
    :row-style="showRow"
    ref="table"
    class="custom__table"
    :height="height"
    :max-height="maxHeight"
    :size="size"
    :span-method="spanMethod"
    :row-class-name="tableRowClassName"
  >
    <el-table-column
      fixed
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
      :show-overflow-tooltip="item.showOverflowTooltip || true"
      v-for="item in columns"
      :width="item.width"
      :min-width="item.minWidth"
      :key="item.label"
      :label="item.label"
      :align="item.align || 'center'"
    >
      <template v-if="item.merge">
        <el-table-column
          v-for="k in item.merge"
          :width="k.width"
          :key="k.label"
          :prop="k.value"
          :label="k.label"
          :align="k.align || 'center'"
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
              :style="{width:(item.bulkyHeight || '300') + 'px', height: (item.bulkyHeight || '300') + 'px'}"
            >
              <img class="loadingImg" :key="scope.row[item.value]" v-lazy="scope.row[item.value]" />
            </div>
            <el-badge v-if="item.badge" :value="item.badge(scope)" style="z-index:999;margin:10px;">
              <div>
                <div
                  class="__img_wrapper mar-auto"
                  :style="{width:(item.style.width || '80') + 'px', height: (item.style.width || '80') + 'px'}"
                >
                  <img class="loadingImg" :key="scope.row[item.value]" v-lazy="scope.row[item.value]" />
                </div>
              </div>
            </el-badge>
            <template v-else>
              <div
                class="__img_wrapper mar-auto"
                :style="{width:(item.style.width || '80') + 'px', height: (item.style.width || '80') + 'px'}"
              >
                <img class="loadingImg" :key="scope.row[item.value]" v-lazy="scope.row[item.value]" />
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
        <a
          v-else-if="item['url']"
          :href="scope.row[item.url]"
          target="_blank"
          :style="item.style ||''"
        >{{scope.row[item.value]}}</a>
        <!-- 多个 -->
        <template v-else-if="item['children']" v-for="(j, jIndex) in scope.row[item.children]">
          <p :style="item.style ||''" v-if="item.value" :key="jIndex">{{j[item.value]}}</p>
          <p :style="item.style ||''" :key="jIndex" v-else>
            <b>{{j[item.prop.key]}}:</b>
            {{j[item.prop.value]}}
          </p>
        </template>
        <!-- 多个属性合并显示 -->
        <template v-else-if="item['multi']">
          <p :style="item.style ||''" v-for="(i,_index) in item['multi']" :key="_index">
            <span
              v-if="typeof i === 'object'"
            >{{i.label}}: {{typeof i.value === 'function' ? i.value(scope) : scope.row[i.value]}}</span>
            <span v-else>{{scope.row[i]}}</span>
          </p>
        </template>
        <!--  -->
        <!-- 普通 -->
        <p v-else>
          <table-colvalue :arr="data" :item="item" :scope="scope" :style="item.style ||''" />
          <!-- {{getVal(item, scope)}} -->
        </p>
      </template>
    </el-table-column>
    <!--  -->
    <slot name="right"></slot>
  </el-table>
</template>

<script>
import Vue from 'vue'

Vue.component('table-colvalue', {
  props: ['item', 'scope', 'arr'],
  render(h) {
    if (this.item.formatter && typeof this.item.formatter === 'function') {
      return <span>{this.item.formatter(this.scope, this.item)}</span>
    } else if (this.item.render && typeof this.item.render === 'function') {
      return this.item.render(h, this.scope, this.arr)
    } else {
      return (
        <span>
          {this.scope.row[this.item.value] === null ||
          this.scope.row[this.item.value] === '' ||
          this.scope.row[this.item.value] === undefined
            ? '-'
            : this.scope.row[this.item.value]}
        </span>
      )
    }
  }
})

export default {
  inheritAttrs: false,
  name: 'YtTable',
  data() {
    return {
      name: null
    }
  },

  props: {
    // 合并行列的计算方法
    spanMethod: {
      type: Function,
      default: () => {}
    },
    // rowKey: {
    //   type: [Function, String],
    //   default: () => {
    //     return 'id'
    //   }
    // },
    tableRowClassName: {
      type: Function,
      default: () => {}
    },
    size: {
      type: String,
      default: 'mini'
    },
    data: {
      type: Array,
      default: () => []
    },
    reserveSelection: false,
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
  methods: {
    showRow: function(row) {
      const show = row.row.parent
        ? row.row.parent._expanded && row.row.parent._show
        : true
      row.row._show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    handleToggleMethod(item, scope) {
      item.toggleMethod(scope)
    },
    toggleRowSelection(row, selected) {
      return this.$refs.table.toggleRowSelection(row, selected)
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
  margin: 4px auto;
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
.custom__table {
  .el-button {
    padding: 8px 20px;
  }
  .el-button--text {
    padding: 8px 0px;
  }
}
</style>
