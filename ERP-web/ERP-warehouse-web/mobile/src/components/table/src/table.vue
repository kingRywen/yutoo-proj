<template>
  <div class="table-layout">
    <x-table>
      <div>
        <flexbox :gutter="0" style="border-bottom:none">
          <flexbox-item v-if="Boolean(select)" :span="1/11">
            <span @click="handleSelectAll">
              <icon :type="selectAll ? 'success' : 'circle'" is-msg v-if="!radio"></icon>
            </span>
          </flexbox-item>
          <flexbox-item
            align="center"
            v-for="(item, index) in columns"
            :key="item.id"
            :span="Number(item.width)/num || 0"
          >
            <div class="t-head">{{ item.label }}</div>
          </flexbox-item>
        </flexbox>
      </div>
      <div>
        <flexbox :gutter="0" v-for="(item, index) in data" :key="item.id">
          <flexbox-item :span="1/11" v-if="Boolean(select)">
            <span @click="handleSelect(index, item)">
              <icon :type="selet[index] ? 'success' : 'circle'" is-msg></icon>
            </span>
          </flexbox-item>
          <flexbox-item v-for="i in columns" align="center" :key="i.id" :span="Number(i.width)/num || 0">
            <div v-if="i.type == 'img'">
              <img :src="item[i.value]" style="width: 100%;height: auto">
            </div>
            <div v-else-if="i.render && (typeof i.render == 'function')">
              <table-colvalue :item="i" :scope="item" :index="index"></table-colvalue>
            </div>
            <div style="word-wrap:break-word;word-break : break-all;" v-else>{{ item[i.value] }}</div>
          </flexbox-item>
        </flexbox>
        <flexbox v-if="dataFlag">
          <flexbox-item>
            <div style="color:#888">暂无数据</div>
          </flexbox-item>
        </flexbox>
      </div>
    </x-table>
  </div>
</template>

<script>
import Vue from 'vue'
Vue.component('table-colvalue', {
  props: ['item', 'scope', 'index'],
  render(h) {
    if (this.item.formatter && typeof this.item.formatter === 'function') {
      return <span>{this.item.formatter(this.scope, this.item)}</span>
    } else if (this.item.render && typeof this.item.render === 'function') {
      return this.item.render(h, this.scope, this.index)
    } else {
      return (
        <span>
          {this.scope[this.item.value] === null ||
          this.scope[this.item.value] === '' ||
          this.scope[this.item.value] === undefined
            ? '-'
            : this.scope[this.item.value]}
        </span>
      )
    }
  }
})

export default {
  name: 'YtTable',
  props: {
    columns: {
      type: Array,
      default: () => {
        return []
      }
    },
    data: {
      type: Array,
      default: () => {
        return []
      }
    },
    select: {
      type: [Boolean, String],
      default: false
    },
    nums: {
      type: Number,
      default: 10
    },
    radio: {
      type: Boolean,
      default: false
    }
  },
  data() {
    let vm = this
    return {
      selet: [],
      selectAll: false,
      selectValues: [],
      dataLen: 0,
      dataFlag: false
    }
  },
  created() {
    let len = this.data.length
    this.dataLen = this.columns.length
    for (let index = 0; index < len; index++) {
      this.selet[index] = false
    }
    this.data.map((item, index) => {
      item.idx = index
      return item
    })
    if (this.select) {
      this.num = 11
    }
  },
  computed: {
    num: {
      get() {
        return this.nums
      },
      set() {}
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(val) {
        if (!val.length) {
          this.dataFlag = true
        } else {
          this.dataFlag = false
        }
      }
    }
  },
  methods: {
    handleSelectAll() {
      let _data = this.data
      this.selectAll = !this.selectAll
      if (this.selectAll) {
        this.selet = this.selet.map(item => true)
        _data = JSON.parse(JSON.stringify(this.data))
      } else {
        this.selet = this.selet.map(item => false)
        _data = []
      }
      this.selectValues = _data
      this.$emit('selectChange', _data)
    },
    handleSelect(index, row) {
      let vm = this
      vm.$set(vm.selet, index, !vm.selet[index])
      if (!vm.radio) {
        if (vm.selet[index] && vm.selectValues.length < vm.data.length) {
          vm.selectValues.push(row)
          // this.$set(vm.selectValues, index, row)
        } else if (!vm.selet[index]) {
          vm.$set(
            vm,
            'selectValues',
            vm.selectValues.filter(item => item.idx !== index)
          )
        }
      } else {
        vm.selet.map((item, indx) => {
          if (indx == index) {
            this.$set(vm.selet, indx, true)
            return true
          } else {
            this.$set(vm.selet, indx, false)
            return false
          }
        })
        vm.selectValues[0] = row
      }
      let _data = JSON.parse(JSON.stringify(vm.selectValues)).map(item => {
        delete item.idx
        return item
      })
      if (_data.length != vm.data.length) {
        vm.selectAll = false
      } else if (_data.length == vm.data.length) {
        vm.selectAll = true
      }
      this.$emit('selectChange', _data)
    }
  }
}
</script>

<style lang="scss">
.table-layout {
  .vux-table {
    line-height: 17px;
    // border: 1px solid #bdbdbd;
    .vux-flexbox {
      box-sizing: border-box;
      align-items: stretch;
      &:last-child {
        border-bottom: 1px solid #bdbdbd;
      }
      .vux-flexbox-item {
        border: 1px solid #bdbdbd;
        border-right: none;
        border-bottom: none;
        padding: 6px 0;
        display: flex;
        justify-content: center;
        align-items: center;
        &:last-child {
          border-right: 1px solid #bdbdbd;
        }
      }
    }
  }

  .table-td {
    line-height: 17px;
    word-wrap: break-word;
  }
}
</style>
