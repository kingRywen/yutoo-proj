<template>
  <div>
    <main-layout
      :outerParams="storeInfo"
      :searchFields="searchFields"
      :columns="columns"
      edit-width="160px"
      tbRightFixed="right"
      :right-edit-btns="editBtns"
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="fba/FbaReplenishTransportPage"
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
    const tranType = this.$const['FBA/tranType']
    return {
      searchFields: {
        transportName: {
          placeholder: '运输方式名称'
        },
        transportType: {
          placeholder: '运输类型',
          widget: 'select',
          options: tranType
        }
      },
      topBatchBtn: {
        title: '运输方式',
        options: [
          {
            label: '删除'
          }
        ]
      },
      editBtns: [
        {
          name: '添加',
          perm: 'addTask',
          fn: () => {
            this.add()
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          perm: 'addTask',
          fn: scope => {
            this.add(scope.row)
          }
        },
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {
            this.del([scope.row.transportId])
          }
        }
      ],
      columns: [
        {
          label: '名称',
          value: 'transportName'
        },
        {
          label: '运输类型',
          value: 'transportType',
          _enum: this.cfuns.arrayToObj(tranType)
        },
        {
          label: '运输天数',
          value: 'shippingDays'
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      if (val[0] == '删除') {
        //
        this.del(sel.map(e => e.transportId))
      }
    },
    del(transportIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`fba/FbaReplenishTransportDelete`]({ transportIds })
      })
    },
    add(edit) {
      this.$_dialog({
        size: 'medium',
        title: `${edit ? '编辑' : '添加'}运输方式`,
        params: { transportInfo: edit },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./add.vue')
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