<template>
  <main-layout
    :outerParams="storeInfo"
    :columns="columns"
    edit-width="120px"
    :isShowPag="false"
    :showSelection="false"
    tbRightFixed="right"
    :fixedPageFunc="fixedPageFunc"
    :edit-btns="edits"
    url="fba/FbaReplenishInfoCalculateList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  data() {
    return {
      edits: [
        {
          name: '编辑',
          perm: 'addTask',
          fn: scope => {
            this.edit(scope.row.cycleType)
          }
        }
      ],
      columns: [
        {
          label: '周期类型',
          value: 'cycleType',
          width: 80,
          _enum: this.cfuns.arrayToObj(this.$const['FBA/lifecircles'])
        },
        {
          label: '周期监控参数',
          value: 'cycleMonitorParm',
          render(h, scope) {
            const { cycleMonitorParm, cycleType } = scope.row
            const getJsx = el => {
              const { autoFlag, avgSaleDays, weeks, jumpLv } = el
              return (
                <div>
                  {cycleType != 2 ? `${autoFlag ? '自动' : '手动'}，` : null}
                  平均销量=近{avgSaleDays}
                  天日均销量
                  {cycleType != 2
                    ? `；连续${weeks}周，订单${
                        cycleType == 1 ? '增长' : '衰退'
                      }率高于${jumpLv}%`
                    : null}
                </div>
              )
            }
            return getJsx(cycleMonitorParm)
          }
        },
        {
          label: '缺货监控参数',
          value: 'shortageMonitorParm',
          render: (h, scope) => {
            const { shortageMonitorParm, _showAll } = scope.row
            return (
              <div>
                {shortageMonitorParm.map((el, index) => (
                  <div
                    style={{
                      display:
                        index == 0 ? 'block' : _showAll ? 'block' : 'none'
                    }}
                  >
                    保底可售天数： {el.insuredDays || '-'} 备货所需天数:{' '}
                    {el.stockDays || '-'} 运输天数: {el.transportDays || '-'}{' '}
                    固定补货天数: {el.fixedDays || '-'}
                    {index == 0 ? (
                      <i
                        onClick={() => {
                          this.$set(scope.row, '_showAll', !scope.row._showAll)
                        }}
                        class={`el-icon-caret-${
                          _showAll ? 'top' : 'bottom'
                        } ml10`}
                      ></i>
                    ) : null}
                  </div>
                ))}
              </div>
            )
          }
        }
      ]
    }
  },
  methods: {
    // FIXME: moCK数据 要删除
    fixedPageFunc(data) {
      return {
        rows: [
          {
            cycleType: 3,
            cycleMonitorParm: {
              autoFlag: true,
              avgSaleDays: 14,
              weeks: 2,
              jumpLv: '10.98'
            },
            shortageMonitorParm: [
              {
                id: '699D457E8A8F5B6F',
                transportId: 'JEUFHFYKV',
                insuredDays: 3,
                stockDays: 5,
                transportDays: 7,
                fixedDays: 30
              },
              {
                id: '699D457E8A8F5B6F',
                transportId: 'JEUFHFYKVWEE3',
                insuredDays: 3,
                stockDays: 5,
                transportDays: 7,
                fixedDays: 30
              }
            ]
          },
          {
            cycleType: 1,
            cycleMonitorParm: {
              autoFlag: true,
              avgSaleDays: 14,
              weeks: 2,
              jumpLv: '10.98'
            },
            shortageMonitorParm: [
              {
                id: '699D457E8A8F5B6F',
                transportId: 'JEUFHFYKV',
                insuredDays: 3,
                stockDays: 5,
                transportDays: 7
              },
              {
                id: '699D457E8A8F5B6F',
                transportId: 'JEUFHFYKVWEE3',
                insuredDays: 3,
                stockDays: 5,
                transportDays: 7
              }
            ]
          }
        ]
      }
    },
    edit(cycleType) {
      this.$_dialog({
        size: 'medium',
        title: '编辑生命周期',
        params: { cycleType },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./edit.vue')
      })
    }
  }
}
</script>