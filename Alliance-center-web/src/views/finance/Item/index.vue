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
export default {
  mixins: [mixin],
  data() {
    let vm = this
    return {
      btns: [
        {
          name: '新增',
          fn() {
            vm._openDialog({
              size: 'small',
              title: '新增支出项',
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
          name: 'name'
        },
        {
          label: '是否自定义',
          name: 'customizeFlag',
          type: 'select',
          options: this.$const['OTHER/yesno']
        },
        {
          label: '支出类型',
          name: 'type',
          type: 'select',
          options: this.$const['OTHER/outType']
        }
      ],
      listApi: 'expendOptionList',
      edits: [
        {
          name: '编辑',
          show: scope => scope.row.customizeFlag,
          fn: (scope, item) => {
            vm._openDialog({
              size: 'small',
              title: '编辑支出项',
              params: { id: scope.row.expendOptionId },
              okBtnText: '确认',
              cancelBtnText: '取消',
              component: () => import('./dialogs/add.vue')
            })
          }
        }
      ],
      tableCols: [
        {
          label: '支出项',
          prop: 'name'
        },
        {
          label: '是否自定义',
          prop: 'customizeFlag',
          render(h, scope) {
            return <span>{scope.row.customizeFlag ? '是' : '否'}</span>
          }
        },
        {
          label: '支出类型',
          prop: 'type',
          render(h, scope) {
            return <span>{scope.row.type == 0 ? '手动' : '自动'}</span>
          }
        },
        {
          label: '支出周期',
          prop: 'cycle',
          render(h, scope) {
            return (
              <span>
                {scope.row.cycle == 1
                  ? '按年'
                  : scope.row.cycle == 2
                  ? '按月'
                  : scope.row.cycle == 3
                  ? '按日'
                  : '-'}
              </span>
            )
          }
        },
        {
          label: '支出日',
          prop: 'expendDay',
          render(h, scope) {
            const { expendDay, cycle } = scope.row
            if (!expendDay) {
              return <span>-</span>
            }
            const [y, m, d, _h] = expendDay.split('-')
            if (cycle == 1) {
              return (
                <span>
                  每年{m.replace('M', '')}月{d.replace('D', '')}日
                  {_h.replace('H', '')}时
                </span>
              )
            } else if (cycle == 2) {
              return (
                <span>
                  每月{d.replace('D', '')}日{_h.replace('H', '')}时
                </span>
              )
            } else {
              return <span>每日{_h.replace('H', '')}时</span>
            }
          }
        },
        {
          label: '支出金额',
          prop: 'money',
          render(h, scope) {
            const { money, currency } = scope.row
            if (!currency) {
              return <span>-</span>
            }
            return (
              <span>
                {money}&nbsp;
                {currency}
              </span>
            )
          }
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
          '是否删除支出项？',
          'expendOptionRemove',
          'expendOptionId',
          1
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除支出项？',
            'expendOptionRemove',
            'expendOptionId',
            1
          )
        }
      }
    }
  }
}
</script>