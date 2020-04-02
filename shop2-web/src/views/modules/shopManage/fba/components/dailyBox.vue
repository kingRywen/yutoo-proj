<template>
  <div>
    <!-- {{data}}} -->
    <div class="box">
      <div class="row" v-for="i in data">
        <div class="col" v-for="n in i">
          <div class="_title">
            <span>{{n.dateStr.replace(/\d{4,5}-/, '')}}</span>
          </div>
          <div class="main">
            <span style="font-size:12px;text-wrap">
              <span v-if="type == 'salesDay'">{{ n.dailySales | _formatData}}</span>
              <span v-else>{{ n.avgSales | _formatData}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate as formatTime } from 'Utils'
import _chunk from 'lodash/chunk'

export default {
  name: 'daily-box',
  props: {
    type: String,
    tableData: {
      type: Array,
      default() {
        return new Array()
      }
    }
  },
  filters: {
    _formatData(val) {
      return val == null || val === -1 || val === '' ? '-' : val
    }
  },
  computed: {
    data() {
      if (this.tableData.length > 0) {
        // 上色
        let now = Date.now()
        // 七天前
        let beforeDate = new Date(now - 24 * 3600 * 7 * 1000)
        let afterDate = new Date(now + 24 * 3600 * 7 * 1000)
        let before = formatTime(beforeDate, '{y}-{m}-{d}')
        let after = formatTime(afterDate, '{y}-{m}-{d}')
        // console.log(before, after)
        return _chunk(this.tableData, 10)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  font-size: 12px;
  min-width: 800px;
  min-height: 100px;
  border: 1px solid #ddd;
  padding: 4px;
  background: #fff;
  display: flex;
  flex-direction: column;
  .row {
    display: flex;
    .col {
      padding: 1px;
      display: flex;
      flex-direction: column;
      div {
        padding: 0;
        width: 80px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        &._title {
          // font-weight: bold;
          color: #000;
          background: #eaebf1;
        }
        &.main {
          .avgSales {
            color: #0000ff;
          }
        }
      }
    }
  }
}
</style>
