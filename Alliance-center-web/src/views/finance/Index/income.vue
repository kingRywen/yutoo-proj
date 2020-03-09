<template>
  <div>
    <table class="cusTb">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>前日</th>
          <th>昨日</th>
          <th>上月</th>
          <th>本月</th>
          <th>累计</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in overviewArray" :class="{line: item.totalRowFlag, _child: item.childFlag}">
          <td>{{item.fieldName}}</td>
          <td>${{item.theDayBeforeYesterday}}</td>
          <td>${{item.yesterday}}</td>
          <td>${{item.lastMonth}}</td>
          <td>${{item.currentMonth}}</td>
          <td>${{item.total}}</td>
        </tr>
      </tbody>
    </table>
    <div class="hr4px"></div>
    <table class="cusTb">
      <thead>
        <tr>
          <th>&nbsp;</th>
          <th>前日</th>
          <th>昨日</th>
          <th>上月</th>
          <th>本月</th>
          <th>累计</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in otherArray" :class="{line: item.totalRowFlag, _child: item.childFlag}">
          <td>{{item.fieldName}}</td>
          <td>${{item.theDayBeforeYesterday}}</td>
          <td>${{item.yesterday}}</td>
          <td>${{item.lastMonth}}</td>
          <td>${{item.currentMonth}}</td>
          <td>${{item.total}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 概况集合
      overviewArray: [],
      // 其他集合
      otherArray: []
    }
  },
  created() {
    this.getData()
  },
  methods: {
    getChild(arr, a) {
      return arr.reduce((prev, cur) => {
        let childArr = cur.childArray
          ? cur.childArray.map(el => ({ ...el, childFlag: 1 }))
          : []
        a.push(...childArr.map(el => ({ name: el.fieldName, value: el.total })))
        return prev.concat(cur, childArr)
      }, [])
    },
    getData() {
      this.$api[`main/incomeStatistics`]({}).then(data => {
        const { overviewArray, otherArray } = data.rows
        let arr = []
        this.overviewArray = this.getChild(overviewArray, arr)
        this.otherArray = this.getChild(otherArray, arr)
        this.$emit('setData', arr)
      })
    }
  }
}
</script>