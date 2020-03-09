<template>
  <table class="custom-table data-table el-table" :class="{fixCenter: center}">
    <tr>
      <td colspan="2" class="table-header _title">{{title}}</td>
    </tr>
    <tr v-if="columns.length">
      <td class="table-header _title" style="padding: 4px">{{columns[0]}}</td>
      <td class="table-header _title" @click="handleTdClick" :style="sortable ? style : null">
        {{columns[1]}}
        <span v-if="sortable" class="caret-wrapper">
          <i
            @click.self.stop="handleArrowClick('ascending')"
            :class="{active: sort === 'ascending'}"
            class="sort-caret ascending"
          ></i>
          <i
            @click.self.stop="handleArrowClick('descending')"
            :class="{active: sort === 'descending'}"
            class="sort-caret descending"
          ></i>
        </span>
      </td>
    </tr>
    <tr v-for="(item, index) in handledData">
      <td class="table-header" style="width:50%">{{item.label}}</td>
      <td>
        <slot name="td" v-bind="{item, index}">
          <template v-if="showBtn">
            <el-button @click="handleBtnClick(item, index, $event)" style="padding:0;margin:0" v-if="item.value != null && item.value > 0" type="text"><b>{{item.value}}</b></el-button>
            <span v-else-if="item.value != null && item.value == 0">{{item.value}}</span>
            <span v-else>-</span>
          </template>
          <span
            v-else
            class="content"
            :title="(item.value != null && item.value !== '') ? item.value : '-'"
          >{{(item.value != null && item.value !== '') ? item.value : '-'}}</span>
          
        </slot>
      </td>
    </tr>
  </table>
</template>

<script>
export default {
  name: 'DataTable',
  props: {
    prop: {
      type:String
    },
    showBtn: {
      default: false
    },
    sortable: {
      type: Boolean,
      default: true
    },
    center: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array,
      default: () => []
    },
    data: {
      type: Array,
      default: () => [
        {
          label: '-',
          value: '-'
        }
      ]
    },
    title: {
      type: String,
      default: '-'
    }
  },
  data() {
    return {
      sort: '',
      style: {
        padding: '4px',
        cursor: 'pointer',
        userSelect: 'none'
      }
    }
  },
  methods: {
    handleBtnClick(item, index, val) {
      this.$emit('tdClick', item, index, this.prop, this.columns, this.title, val)
    },
    handleTdClick() {
      // debugger
      if (this.sort === '') {
        this.sort = 'ascending'
      } else if (this.sort === 'ascending') {
        this.sort = 'descending'
      } else {
        this.sort = ''
      }
    },
    handleArrowClick(sortName) {
      this.sort = sortName
    }
  },
  computed: {
    handledData() {
      if (!this.sortable) {
        return this.data
      }
      if (this.sort === '') {
        return this.data
      }
      if (this.sort === 'ascending') {
        return this.data.slice(0).sort((a, b) => a.value - b.value)
      }
      if (this.sort === 'descending') {
        return this.data.slice(0).sort((a, b) => b.value - a.value)
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.content {
  @include wrap-overflow();
}
</style>
<style lang="scss">
.active.descending {
  border-top-color: #108ee9 !important;
}
.active.ascending {
  border-bottom-color: #108ee9 !important;
}
</style>
