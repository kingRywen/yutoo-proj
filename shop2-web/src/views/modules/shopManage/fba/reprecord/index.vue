<template>
  <div>
    <main-layout
      :outerParams="storeInfo"
      :searchFields="searchFields"
      @requestSuccess="_ => isMount = true"
      :columns="columns"
      edit-width="160px"
      tbRightFixed="right"
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      :tableRowClassName="tableRowClassName"
      @left-batch-change="handleLeftBatchChange"
      url="fba/FbaReplenishInfoList"
      ref="layout"
    ></main-layout>
    <el-dropdown v-if="isMount" class="anay" @command="handleCommand">
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
import { timeField } from 'Utils/table-render.js'
import { downloadCsv } from 'Utils'
import dropdownMixin from '../dropdown-mixin'
import { mapActions } from 'vuex'
export default {
  mixins: [dropdownMixin],
  data() {
    const tranType = this.$const['FBA/tranType']
    return {
      searchFields: {
        storeId: {
          widget: 'select',
          options: [],
          // hidden: true,
          labelWidth: '55px',
          label: '店铺'
        },
        status: {
          widget: 'select',
          placeholder: '发货状态',
          options: [
            {
              label: '未处理',
              value: 1
            },
            {
              label: '已处理（未发货）',
              value: 2
            },
            {
              label: '已处理（已发货）',
              value: 3
            },
            {
              label: '取消',
              value: 4
            },
            {
              label: '超时',
              value: 5
            }
          ]
        },
        confirmTime: timeField('确认时间', 'confirmTime'),
        bacthNumber: {
          label: '批次号',
          hidden: true,
          labelWidth: '70px'
        },
        transportId: {
          hidden: true,
          label: '运输方式',
          widget: 'select',
          options: tranType
        }
      },
      topBatchBtn: {
        title: '记录',
        options: [
          {
            label: '下载文件'
          },
          {
            label: '取消补货'
          }
        ]
      },

      edits: [
        {
          name: '下载文件',
          perm: 'addTask',
          fn: scope => {
            this.download([scope.row.replenishInfoId])
          }
        },
        {
          name: '查看',
          perm: 'addTask',
          fn: scope => {
            this.$_dialog({
              size: 'medium',
              title: '查看',
              params: {
                replenishInfoId: scope.row.replenishInfoId
              },
              cancelBtnText: '关闭',
              component: () => import('./view.vue')
            })
          }
        },
        {
          name: '创建发货计划',
          perm: 'addTask',
          fn: scope => {
            this.addProj(scope.row)
          }
        }
      ],
      columns: [
        {
          label: '批次号',
          value: 'batchNum'
        },
        {
          label: '店铺',
          value: 'storeName'
        },
        {
          label: '运输方式',
          value: 'transportName'
        },
        {
          label: '确认时间',
          sortable: 'custom',
          value: 'confirmTime'
        },
        {
          label: '剩余备货天数',
          value: 'lastDay',
          render(h, scope) {
            if (scope.row.lastDay >= 0) {
              return <span>{scope.row.lastDay}</span>
            }
            return <span class="danger">已过期（{Math.abs(scope.row.lastDay)}天）</span>
          },
        },
        {
          label: '状态',
          value: 'statusName'
        }
      ]
    }
  },
  created() {
    this.$store.dispatch('fba/getTransportList').then(() => {
      this.searchFields.transportId.options = this.$store.state.fba.transportList
    })
    this.$store.dispatch('storeInfo/getStoreList').then(data => {
      this.searchFields.storeId.options = data
    })
  },

  methods: {
    ...mapActions('fba', ['clearCacheProj']),
    tableRowClassName({ row }) {
      if (row.statusName == '超时') {
        return '_delay'
      }
    },
    handleLeftBatchChange(val, sel) {
      const ids = sel.map(el => el.replenishInfoId)
      switch (val[0]) {
        case '下载文件':
          this.download(ids)
          break
        case '取消补货':
          this.cancel(ids)
          break

        default:
          break
      }
    },
    async addProj(row) {
      this.clearCacheProj()
      const { storeId, storeName, replenishInfoId } = row
      this.$router.push({
        path: '/shopManage/fba/warehouse/create',
        query: {
          storeId,
          storeName,
          replenishInfoId
        }
      })
    },
    download(replenishInfoIds) {
      this.$api[`fba/FbaReplenishInfoDownload`]({ replenishInfoIds }).then(
        data => {
          downloadCsv(data)
        }
      )
    },
    cancel(replenishInfoIds) {
      this.showTips({ msg: '此操作将取消补货, 是否继续?' }, () => {
        return this.$api[`fba/FbaReplenishInfoCancel`]({ replenishInfoIds })
      })
    }
  }
}
</script>
<style lang="scss">
.el-table__row._delay .cell .over span {
  color: #c9c9c9;
}
</style>
<style lang="scss" scoped>
.anay {
  position: absolute;
  right: 23px;
  top: -20px;
  /deep/ i {
    font-size: 24px;
  }
}
</style>