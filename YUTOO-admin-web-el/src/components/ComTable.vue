<template>
<div>
  <span>{{$attrs}}</span>
  <el-table
    ref="multipleTable"
    :class="{'tree': $attrs.tree}"
    :data="data"
    tooltip-effect="dark"
    style="width: 100%"
    v-on=$listeners
    @selection-change="handleSelectionChange">

     <el-table-column type="expand" v-if="$attrs.tree">
      <template slot-scope="props">
        <com-tree v-if="props.row.children" @selection-change="handleSelectionChange" :header="true" :data="props.row.children" :columns="columns" :selection="true">
          <div slot="layer" slot-scope="props">
            <el-tag v-if="props.scope === 1">省级</el-tag>
            <el-tag type="success" v-if="props.scope === 2">地市</el-tag>
            <el-tag type="info" v-if="props.scope === 3">区县</el-tag>
          </div>
          <div slot="status" slot-scope="props">
            <el-switch :value="props.scope == 1" disabled></el-switch>
          </div>
        </com-tree>
        <!-- <com-table v-if="props.row.children" :tree="props.row.children? true : false" @selection-change="handleSelectionChange" :show-header="false" :data="props.row.children" :columns="columns" :selection="true">
          <div slot="layer" slot-scope="props">
            <el-tag v-if="props.scope === 1">省级</el-tag>
            <el-tag type="success" v-if="props.scope === 2">地市</el-tag>
            <el-tag type="info" v-if="props.scope === 3">区县</el-tag>
          </div>
          <div slot="status" slot-scope="props">
            <el-switch :value="props.scope == 1" disabled></el-switch>
          </div>
        </com-table> -->
      </template>
    </el-table-column>
    <el-table-column
      v-if="selection"
      type="selection"
      width="55">
    </el-table-column>
    <el-table-column
      v-for="col in columns"
      :key="col.label"
      :label="col.label">
        <template slot-scope="scope">
          <div v-if="$attrs.tree">
            <tag v-if="col.tag" :slotContent="slotContent" :scope="scope.row[col.prop]" :col="col"></tag>
            <div v-else>{{ scope.row[col.prop] }}</div>
          </div>
          <div v-else>
            <slot v-if="col.tag" :name="col.prop" :scope="scope.row[col.prop]"></slot>
            <div v-else>{{ scope.row[col.prop] }}</div>
          </div>
          
        </template>
    </el-table-column>
  </el-table>
</div>
  

</template>
<script>
import Vue from 'vue'
Vue.component('tag', {
  render (h) {
    console.log(this.$props.col.prop, this.$props.scope);
    return h('div', [
      this.$props.slotContent[this.$props.col.prop]({
        scope: this.$props.scope
      })
    ])
  },
  props: {
    slotContent: {
      type: Object,
      default: {}
    },
    scope: {
      default: ''
    },
    col: {
      type: Object,
      default: {}
    },

    isHead: {
      type: Boolean,
      default: true
    }
  }
})


export default {
  name: 'com-table',
  // components: {
  //   ComTree
  // },

  beforeCreate: function () {
    this.$options.components.ComTree = require('./ComTree.vue').default
  },

  props: {
    data: {
      type: Array,
      default: function () {
        return new Array()
      }
    },
    columns: {
      type: Array,
      default: function () {
        return new Array()
      }
    },
    selection: {
      type: Boolean,
      default: false
    },
    slotContent: {
      type: Object,
      default: function () {
        return new Object()
      }
    }
  },
  inheritAttrs: false,

  methods: {
    handleSelectionChange(val) {
      const {$attrs: attrs} = this
      if (attrs.tree) {
        this.$listeners['selection-change'](val)
      } else {
        this.$emit('update:multipleSelection', val)
      }
    }
  }
};
</script>
<style>
.tree .el-table__expanded-cell[class*=cell] {
    padding: 0;
}
</style>
