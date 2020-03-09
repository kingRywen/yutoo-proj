<template>
  <!-- 销量统计 -->
  <el-tabs v-model="activeName" type="card" @tab-click="handleClick">
    <el-tab-pane label="订单利润报表" name="first" class="chart">
      <chart/>
    </el-tab-pane>
    <el-tab-pane label="产品销量报表" name="second">
      <div class="list">
        <yt-table :data="saleslist" :columns="salesColumns" :border="true" :selection="false">
          <el-table-column label="操作" width="100" align="center" slot="right">
            <template slot-scope="scope">
              <el-button type="text">分析</el-button>
            </template>
          </el-table-column>
        </yt-table>
      </div>
    </el-tab-pane>
    <el-tab-pane label="店铺销量报表" name="third">
      <div class="list">
        <yt-table :data="storelist" :columns="storeColumns" :border="true" :selection="false">
          <el-table-column label="操作" width="100" align="center" slot="right">
            <template slot-scope="scope">
              <el-button type="text">分析</el-button>
            </template>
          </el-table-column>
        </yt-table>
      </div>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
/* eslint-disable */
import chart from './chart'
export default {
  data() {
    let vm = this
    return {
      activeName: 'first',
      saleslist: [],
      storelist: [],
      salesColumns: [
        {
          value: '',
          label: '产品图片'
        },
        {
          value: '',
          label: 'SKU'
        },
        {
          value: '',
          label: '店铺'
        },

        {
          value: '',
          label: '仓库名称'
        },
        {
          value: '',
          label: '日销量'
        },
        {
          value: '',
          label: '周销量'
        }
      ],
      storeColumns: [
        {
          value: '',
          label: '店铺图片'
        },
        {
          value: '',
          label: '名称'
        },
        {
          value: '',
          label: '真实名称'
        },

        {
          value: '',
          label: '平台站点'
        },
        {
          value: '',
          label: '日销量'
        },
        {
          value: '',
          label: '周销量'
        },
        {
          value: '',
          label: '月销量'
        }
      ]
    }
  },
  methods: {
    handleClick(tab, event) {
      console.log(tab, event)
    }
  },
  components: {
    chart
  }
}
</script>

<style lang="scss">
.list {
  padding: 10px;
}
</style>
