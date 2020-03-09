<template>
  <div v-if="fetch">
    <el-row :gutter="20">
      <el-col :span="12">
        <!-- 价格区间占比 -->
        <pieChart :chartData="chartData.list1" class="mb20" name="价格区间占比">
          <a slot="edit" class="link" @click="openArea" href="javascript:void(0)" type="text">编辑区间</a>
        </pieChart>
      </el-col>
      <el-col :span="12">
        <!-- 上架时间占比 -->
        <pieChart :chartData="chartData.list2" class="mb20" name="上架时间占比"></pieChart>
      </el-col>
      <el-col :span="12">
        <!-- 评分区间及占比 -->
        <pieChart :chartData="chartData.list3" class="mb20" name="评分区间及占比"></pieChart>
      </el-col>
      <el-col :span="12">
        <!-- 总评价数区间占比 -->
        <pieChart :chartData="chartData.list4" class="mb20" name="总评价数区间占比"></pieChart>
      </el-col>
      <el-col :span="12">
        <!-- TOP10品牌占比 -->
        <pieChart :chartData="chartData.list5" class="mb20" name="TOP10品牌占比"></pieChart>
      </el-col>
      <el-col :span="12">
        <!-- 变体数区间占比 -->
        <pieChart :chartData="chartData.list6" class="mb20" name="变体数区间占比"></pieChart>
      </el-col>
    </el-row>
  </div>
  <div v-else v-loading="true" style="min-height: 200px"></div>
</template>
<script>
import pieChart from './pieChart'
export default {
  props: ['startTime', 'endTime'],
  components: {
    pieChart
  },
  data() {
    let vm = this
    return {
      fetch: false,
      query: JSON.parse(vm.$route.query.params),
      // 数据
      chartData: {
        // 价格区间占比
        list1: [],
        // 上架时间占比
        list2: [],
        // 评分区间及占比
        list3: [],
        // 总评价数区间占比
        list4: [],
        // TOP10品牌占比
        list5: [],
        // 变体数区间占比
        list6: []
      }
    }
  },
  created() {
    this.getData()
  },
  methods: {
    openArea() {
      this._openDialog({
        size: 'medium',
        title: '统计区间设置',
        params: {
          success: () => {
            this.getData()
          }
        },
        cancelBtnText: '取消',
        okBtnText: '保存',
        component: () => import('./dialogs/area.vue')
      })
    },
    getData() {
      let params = {
        ...this.query,
        startTime: this.startTime,
        endTime: this.endTime
      }
      this.$api[`proPick/categoryDepthTaskMerchantProductStat`](params).then(
        data => {
          let ret = {
            // 价格区间占比
            list1: [],
            // 上架时间占比
            list2: [],
            // 评分区间及占比
            list3: [],
            // 总评价数区间占比
            list4: [],
            // TOP10品牌占比
            list5: [],
            // 变体数区间占比
            list6: []
          }
          data = data.data

          if (!data) {
            this.fetch = true
            return
          }
          Object.keys(data).forEach(key => {
            ret[key] = data[key].map(el => ({
              name: el.range,
              value: el.cnt,
              rate: el.rate
            }))
          })
          this.chartData = ret
          setTimeout(() => {
            this.fetch = true
          })
        }
      )
    }
  }
}
</script>