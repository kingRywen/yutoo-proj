<template>
  <main-layout
    :btns="btns"
    :sideBar="false"
    :search-fields="searchFields"
    :loadData="loadData"
    :edits="edits"
    ref="lay"
    :searchFunc="searchFunc"
    editWidth="160px"
    :tableCols="tableCols"
  ></main-layout>
</template>
<script>
import mixin from '@/mixin'
import mixin2 from '../Item/mixin'
export default {
  mixins: [mixin, mixin2],
  data() {
    let vm = this
    return {
      btns: [
        {
          name: '新增',
          fn() {
            vm._openDialog({
              size: 'small',
              title: '新增支出记录',
              params: {},
              okBtnText: '确认',
              cancelBtnText: '取消',
              component: () => import('./dialogs/add.vue')
            })
          }
        },
        {
          name: '删除',
          disabled: selection => {
            return !selection.length
          },
          fn() {
            vm.del()
          }
        }
      ],
      searchFields: [
        {
          label: '支出项',
          name: 'expendOptionId',
          type: 'select',
          options: []
        },
        {
          label: '支出日期',
          name: 'expendDate',
          type: 'dateRange'
        }
      ],
      listApi: 'expendRecordList',
      edits: [
        {
          name: '编辑',
          show: () => true,
          fn: (scope, item) => {
            vm._openDialog({
              size: 'small',
              title: '编辑支出记录',
              params: { id: scope.row.expendRecordId },
              okBtnText: '确认',
              cancelBtnText: '取消',
              component: () => import('./dialogs/add.vue')
            })
          }
        }
      ],
      tableCols: [
        {
          label: '流水号',
          prop: 'expendRecordId'
        },
        {
          label: '支出项',
          prop: 'expendOptionNam'
        },
        {
          label: '支出类型',
          prop: 'type',
          render(h, scope) {
            return <span>{scope.row.type == 0 ? '手动' : '自动'}</span>
          }
        },
        {
          label: '支出日期',
          prop: 'expendDate'
        },
        {
          label: '支出金额（单位）',
          prop: 'money',
          render(h, scope) {
            const { money, currency } = scope.row
            return (
              <span>
                {money == 'CNY' ? '￥' : '$'}&nbsp;
                {currency}
              </span>
            )
          }
        },
        {
          label: '备注',
          prop: 'remark'
        }
      ]
    }
  },
  methods: {
    searchFunc(data) {
      const { expendDate, ...info } = data
      const [queryExpendStartDate, queryExpendEndDate] = expendDate || []
      return { ...info, queryExpendStartDate, queryExpendEndDate }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除记录？',
          'expendRecordRemove',
          'expendRecordId',
          1
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除记录？',
            'expendRecordRemove',
            'expendRecordId',
            1
          )
        }
      }
    }
  }
}
</script>