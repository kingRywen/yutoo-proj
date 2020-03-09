<template>
  <div>
    <!-- {{data}}} -->
    <div class="box">
      <div class="row" v-for="i in data">
        <div class="col" v-for="n in i">
          <div class="_title">
            <span>{{n.dateStr}}</span>
          </div>
          <div class="main">
            <span>{{ n.dailySales | _formatData}} /
              <span class="avgSales">{{ n.avgSales | _formatData}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatTime } from "@/common/util";
const _chunk = require("lodash/chunk");

export default {
  name: "daily-box",
  props: {
    tableData: {
      type: Array,
      default() {
        return new Array();
      }
    }
  },
  computed: {
    data() {
      if (this.tableData.length > 0) {
        // 上色
        let now = Date.now();
        // 七天前
        let beforeDate = new Date(now - 24 * 3600 * 7 * 1000);
        let afterDate = new Date(now + 24 * 3600 * 7 * 1000);
        let before = formatTime(beforeDate, "{y}-{m}-{d}");
        let after = formatTime(afterDate, "{y}-{m}-{d}");
        console.log(before, after);
        return _chunk(this.tableData, 10);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.box {
  min-width: 900px;
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
        padding: 4px 10px;
        width: 69px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        &._title {
          font-weight: bold;
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
