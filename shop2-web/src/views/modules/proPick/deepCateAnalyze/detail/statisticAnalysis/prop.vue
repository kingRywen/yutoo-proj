<template>
  <div>
    <new-form v-if="originData" ref="form" label-width="120px" :form-schema="formSchema1" :value="value1"></new-form>
    <main-layout
      :outerParams="outerParams"
      :columns="columns"
      edit-width="160px"
      :isShowPag="false"
      :right-edit-btns="editBtns"
      @requestSuccess="(val, val1) => oldData = [...val1]"
      :topBatchBtn="topBatchBtn"
      :outerTableList="curData"
      @left-batch-change="handleLeftBatchChange"
      :url="originData ? undefined : `proPick/categoryDepthTaskMerchantProductAttrStat`"
      ref="layout"
      tip="只展示每个属性中排名前3名的属性值"
    ></main-layout>
  </div>
</template>
<script>
import { exportEXCEL } from 'Utils/xlsx'
export default {
  props: ['startTime', 'endTime', 'rank'],
  data() {
    let originData = this.$route.query.data
      ? JSON.parse(this.$route.query.data)
      : null
    return {
      formSchema1: {
        rank: {
          span: 4,
          widget: 'select',
          placeholder: '选择占比',
          options: [
            {
              label: '占比第一',
              value: 1
            },
            {
              label: '占比前二',
              value: 2
            }
          ]
        }
      },
      value1: { rank: null },
      originData,
      curData: originData,
      oldData: [],
      columns: [
        {
          label: '序号',
          type: 'index',
          width: 50
        },
        {
          label: '属性名称',
          value: 'attrKey'
        },
        {
          label: '属性值',
          value: 'attrValue'
        },
        {
          label: '新增评价数',
          sortable: true,
          value: 'newReviewCnt'
        },
        {
          label: '占比',
          sortable: true,
          isPercent: true,
          keepFew: 2,
          value: 'rate'
        }
      ],
      topBatchBtn: {
        title: '属性',
        options: [
          {
            label: '导出'
          }
        ]
      },
      editBtns: [
        {
          name: '导出',
          perm: 'add',
          type: 'plain',
          icon: 'iconfont icondaochu',
          fn: () => {
            this._export()
          }
        }
      ]
    }
  },
  watch: {
    'value1.rank'(val) {
      if (!val) {
        this.curData = this.originData
      } else if (val == 1) {
        this.curData = this.originData.filter(el => el.rank == 1)
      } else {
        this.curData = this.originData.filter(el => el.rank < 3)
      }
    },
    rank(val) {
      this.handleRank(val)
    }
  },
  computed: {
    outerParams() {
      return {
        ...(this.$route.query.params
          ? JSON.parse(this.$route.query.params)
          : {}),
        startTime: this.startTime,
        endTime: this.endTime
      }
    }
  },
  methods: {
    handleRank(val) {
      if (!val) {
        this.$refs.layout.tableList = this.oldData
      } else if (val == 1) {
        this.$refs.layout.tableList = this.oldData.filter(el => el.rank == 1)
      } else {
        this.$refs.layout.tableList = this.oldData.filter(el => el.rank < 3)
      }
    },
    _export(sel) {
      let data = sel || this.$refs.layout.tableList
      let ret = []
      ret.push(this.columns.slice(1).map(e => e.label))
      data.forEach(e => {
        ret.push(this.columns.slice(1).map(k => e[k.value]))
      })
      console.log(ret)

      // this.columns.slice(1).forEach(e =>{

      // })
      exportEXCEL(ret, null, '属性统计')
    },
    handleLeftBatchChange(val, sel) {
      if (val[0] == '导出') {
        this._export(sel)
      }
    }
  }
}
</script>