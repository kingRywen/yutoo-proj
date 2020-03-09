<template>
  <div class="simple-table">
    <ElRow>
      <ElCol class="table-head" :span="24/columns.length" v-for="item in columns" :key="item.id">{{ item.label }}</ElCol>
    </ElRow>
    <ElRow v-if="!dataType(data)">
      <ElCol class="table-body" :span="24/columns.length" v-for="item in columns" :key="item.id">
        <table-colvalue v-if="item.render" :item="item" :scope="data"></table-colvalue>
        <span v-else>{{data[item.value] || '-'}}</span>
      </ElCol>
    </ElRow>
    <ElRow v-else-if="dataType(data)" v-for="item in data" :key="item.id">
      <ElCol class="table-body" :span="24/columns.length" v-for="el in columns" :key="el.id">
        <table-colvalue v-if="el.render" :item="el" :scope="item"></table-colvalue>
        <span v-else>{{item[el.value] || '-'}}</span>
      </ElCol>
    </ElRow>
  </div>
</template>

<script>
import Vue from 'vue'

Vue.component('table-colvalue', {
  props: ['item', 'scope'],
  render(h) {
    if (this.item.render && typeof this.item.render === 'function') {
      return this.item.render(h, this.scope, this)
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
  name: 'twp-simple-table',
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: [Object, Array],
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  methods: {
    dataType(val) {
      return Array.isArray(val)
    }
  }
}
</script>

<style lang='scss'>
.simple-table {
  background: #fff;
  .table-head {
    border: 1px solid #ebeef5;
    padding: 10px;
    text-align: center;
    border-right: none;
    background: #f5f7fa;
    &:last-child {
      border-right: 1px solid #ebeef5;
    }
  }
  .table-body {
    height: 50px;
    border: 1px solid #ebeef5;
    padding: 10px;
    text-align: center;
    border-right: none;
    border-top: none;
    display: flex;
    justify-content: center;
    align-items: center;
    &:last-child {
      border-right: 1px solid #ebeef5;
    }
  }
}
</style>