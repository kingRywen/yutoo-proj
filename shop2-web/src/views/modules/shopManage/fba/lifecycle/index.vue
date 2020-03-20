<template>
  <div>
    <main-layout
      :outerParams="storeInfo"
      :columns="columns"
      edit-width="120px"
      :isShowPag="false"
      :showSelection="false"
      tbRightFixed="right"
      :edit-btns="edits"
      url="fba/FbaReplenishInfoCalculateList"
      ref="layout"
    ></main-layout>
    <el-dropdown class="anay" @command="handleCommand">
      <span class="el-dropdown-link">
        <!-- <i class="iconfont">&#xe60e;</i> -->
        <el-button type="text" style="padding: 0" icon="iconfont icongongju"></el-button>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="f">FBA管理</el-dropdown-item>
        <el-dropdown-item command="c">补货记录</el-dropdown-item>
        <el-dropdown-item command="d">发货计划</el-dropdown-item>
        <el-dropdown-item command="a">生命周期管理</el-dropdown-item>
        <el-dropdown-item command="b">运输方式</el-dropdown-item>
        <el-dropdown-item command="e">设置滞销预警天数</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import dropdownMixin from '../dropdown-mixin'
export default {
  mixins: [dropdownMixin],
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
<style lang="scss" scoped>
.anay {
  position: absolute;
  right: 23px;
  top: -26px;
  /deep/ i {
    font-size: 24px;
  }
}
</style>