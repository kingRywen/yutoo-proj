<template>
  <NewMainLayout
    ref="layout"
    url="main/merchantConsumeRecordList"
    editWidth="90px"
    :searchFields="searchFields"
    :columns="columns"
  ></NewMainLayout>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          label: '消费编号',
          value: 'merchantConsumeRecordId',
          width: 80
        },
        {
          label: '商户邮箱',
          value: 'email'
        },
        {
          label: '金额$',
          value: 'money',
          width: 80
        },

        {
          // 0-发布任务 1-产品差价 2-商品仓储费 3-商品出库费 4-回收操作费
          label: '消费类型',
          value: 'type',
          _enum: [
            '发布任务',
            '产品差价',
            '商品仓储费',
            '商品出库费',
            '回收操作费'
          ],
          width: 80
        },
        {
          label: '消费源',
          value: 'sourceId',
          url: true,
          btnClick: scope => {
            const { href } = this.$router.resolve({
              path: '/task/source/view',
              query: {
                id: scope.row.sourceId
              }
            })
            window.open(href)
          },
          width: 80
        },
        {
          label: '消费时间',
          value: 'consumeTime'
        },
        {
          label: '消费明细',
          noTooltip: true,
          minWidth: 500,
          value: 'detail'
        }
      ],
      searchFields: {
        email: {
          label: '商户邮箱'
        },
        type: {
          label: '消费类型',
          widget: 'select',
          options: [
            // 0-发布任务 1-产品差价 2-商品仓储费 3-商品出库费 4-回收操作费
            {
              label: '发布任务',
              value: 0
            },
            {
              label: '产品差价',
              value: 1
            },
            {
              label: '商品仓储费',
              value: 2
            },
            {
              label: '商品出库费',
              value: 3
            },
            {
              label: '回收操作费',
              value: 4
            }
          ]
        },
        merchantConsumeRecordId: {
          label: '消费编号'
        }
      }
    }
  },
  methods: {}
}
</script>