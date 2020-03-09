<template>
  <div>
    <div class="main-layout">
      <div class="header">
        评分区间评价者统计
        <el-tooltip placement="top" content="计算每个评分区间对应的评价者数量，如对100个评价者进行统计，当评价者5星评分占比达100%的有多少个账号">
          <i class="el-icon-info"></i>
        </el-tooltip>
      </div>
      <yt-table :selection="false" :data="curData" :columns="columns"></yt-table>
    </div>
  </div>
</template>
<script>
import _chunk from 'lodash/chunk'

export default {
  props: ['data', 'searchData', 'originSearchVal'],
  data() {
    let vm = this
    let starMap = {
      1: {
        name: '100%',
        range: [1, null]
      },
      2: {
        name: '90%',
        range: [0.9, 1]
      },
      3: {
        name: '80%',
        range: [0.8, 0.9]
      },
      4: {
        name: '70%',
        range: [0.7, 0.8]
      },
      5: {
        name: '60%',
        range: [0.6, 0.7]
      },
      6: {
        name: '50%',
        range: [0.5, 0.6]
      },
      7: {
        name: '50%以下',
        range: [null, 0.5]
      }
    }
    function getLabel(type) {
      return {
        label: starMap[type].name,
        numZero: true,
        sortable: true,
        url: true,
        btnClick: scope => {
          vm.openDia.call(vm, type, parseInt(scope.row.range))
        },
        value: type + ''
      }
    }
    return {
      starMap,
      columns: [
        {
          label: '区间',
          value: 'range'
        },
        getLabel(1),
        getLabel(2),
        getLabel(3),
        getLabel(4),
        getLabel(5),
        getLabel(6),
        getLabel(7)
      ]
    }
  },
  computed: {
    curData() {
      let data = _chunk(this.data, 7),
        ret = []
      // console.log(data)

      data.map((el, index) => {
        let r = { range: index + 1 + '星' }
        el.forEach(e => {
          r[e.range.split('-').pop()] = e.cnt
            ? `${e.cnt}（${(e.rate * 100).toFixed(0)}%）`
            : 0
        })
        ret.push(r)
      })
      return ret
    }
  },
  methods: {
    openDia(type, starFlag) {
      let range = this.starMap[type].range
      this._openDialog({
        size: 'medium',
        title: '评价者',
        params: {
          showHearder: false,
          defaultSearchData: this.originSearchVal,
          queries: {
            starFlag,
            starRateMin: range[0],
            starRateMax: range[1]
          }
        },
        cancelBtnText: '关闭',
        component: () => import('../list')
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.header {
  font-size: 14px;
  padding: 14px;
  border-color: #e4e4e4;
  border-width: 1px 1px 0;
  border-style: solid;
  // background-color: #f5f5f5;
}
</style>