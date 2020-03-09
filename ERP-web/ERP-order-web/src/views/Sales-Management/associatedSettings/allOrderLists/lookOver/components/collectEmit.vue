<template lang="html">
    <!-- 收发货记录 -->
    <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="发货单据列表" name="first">
            <yt-table :data="listA" :columns="columnsA" :border="true" :selection="false"></yt-table>
        </el-tab-pane>
        <el-tab-pane label="退货单据列表" name="second">
            <yt-table :data="listB" :columns="columnsB" :border="true" :selection="false"></yt-table>
        </el-tab-pane>
    </el-tabs>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      activeName: 'first',
      listA: [],
      listB: [],
      columnsA: [
        { value: 'orderDeliverId', label: '序号' },
        { value: 'destinationCountry', label: '目的国家' },
        { value: 'packageNumber', label: '包裹跟踪号' },
        { value: 'logisticsNumber', label: '发货单号' },
        { value: 'registerFlagName', label: '是否挂号' },
        { value: 'packageWeight', label: '包裹重' },
        { value: 'discountPrice', label: '折后总价' },
        { value: 'tariff', label: '关税' },
        { value: 'stockUp', label: '备货' },
        { value: 'deliverDays', label: '投递天数' }
      ],
      columnsB: [
        { value: 'createTime', label: '建立日期' },
        { value: 'orderReturnDeliverNum', label: '退货单号' },
        { value: 'trackingNumber', label: '物流单号' },
        { value: 'returnName', label: '退货人' },
        { value: 'dispatchTypeName', label: '配送方式' }
      ]
    }
  },
  methods: {
    handleClick(tab, event) {
      if (tab.name == 'second') {
        this.getList('returnRecord')
      }
    },
    getList(url = 'deliverRecord') {
      this.$api['order/' + url]({
        orderId: this.$route.query.orderServiceId
      })
        .then(res => {
          let list = res.rows
          if (url == 'deliverRecord') {
            this.listA = list
          } else {
            this.listB = list
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    }
  }
}
</script>

<style lang="css">
</style>
