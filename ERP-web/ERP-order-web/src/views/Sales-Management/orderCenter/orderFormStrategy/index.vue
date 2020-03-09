<template>
  <!-- 订单策略 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick" class="tabs tabsWarp">
    <el-tab-pane label="审核策略" name="first">
      <checkStrategy ref="checkStrategy"/>
    </el-tab-pane>
    <el-tab-pane label="优先策略" name="second">
      <priorityStrategy :info="priorityStrategyInfo" @save="save"/>
    </el-tab-pane>
    <el-tab-pane label="非优先策略" name="third">
      <div class="radiobox">
        <el-radio-group v-model="nonPriorityStrategy">
          <el-radio :label="1">处理订单最多</el-radio>
          <el-radio :label="2">发货数最多</el-radio>
          <el-radio :label="3">系统推荐</el-radio>
        </el-radio-group>
        <el-button size="small" type="primary" class="btn" @click="save({nonPriorityStrategy})">保 存</el-button>
      </div>
    </el-tab-pane>
    <el-tab-pane label="礼品发货策略" name="fourth">
      <giftStrategy ref="giftStrategy"/>
    </el-tab-pane>
    <el-tab-pane label="发货策略" name="fifth">
      <shipmentsStrategy ref="shipmentsStrategy"/>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
/* eslint-disable */
import giftStrategy from './giftStrategy/giftStrategy'
import shipmentsStrategy from './shipmentsStrategy/shipmentsStrategy'
import priorityStrategy from './priorityStrategy/priorityStrategy'
import checkStrategy from './checkStrategy/checkStrategy'
import storage from 'Utils/saver'
export default {
  data() {
    return {
      activeName: 'first',
      nonPriorityStrategy: 1,
      priorityStrategyInfo: {}
    }
  },
  created() {
    this.activeName =
      this.$route.query.name ||
      storage.get('session', 'strategyTabName') ||
      'first'
  },
  mounted() {
    this.$nextTick(() => {
      this.handleClick({ name: this.activeName })
    })
  },
  methods: {
    save(form) {
      this.$api['order/strategyPrioritySave'](form)
        .then(res => {
          this.$message.success(res.msg)
        })
        .catch(err => {
          this.$message.success(err.msg)
        })
    },
    handleClick(tab, event) {
      // this.$route.query.name = tab.name
      storage.set('session', 'strategyTabName', tab.name)
      if (tab.name == 'second' || tab.name == 'third') {
        this.getInfo()
      } else if (tab.name == 'fourth') {
        this.$refs.giftStrategy.getList()
      } else if (tab.name == 'fifth') {
        this.$refs.shipmentsStrategy.getList()
      }
    },
    getInfo() {
      this.$api['order/strategyPriorityInfo']()
        .then(res => {
          this.nonPriorityStrategy = res.rows.nonPriorityStrategy
          this.priorityStrategyInfo = res.rows
        })
        .catch(err => {
          this.$message.success(err.msg)
        })
    }
  },
  components: {
    giftStrategy,
    shipmentsStrategy,
    priorityStrategy,
    checkStrategy
  }
}
</script>

<style lang="scss">
@import '@/assets/css/common.scss';
.radiobox {
  padding: 10px 200px 10px 50px;
  .btn {
    margin-left: 20px;
  }
}
.tabsWarp {
  height: 100%;
  .el-tabs__content {
    height: 95%;
    .el-tab-pane {
      height: 100%;
    }
  }
}
</style>
