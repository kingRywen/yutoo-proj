<template>
  <main-layout
    :searchFields="searchFields"
    ref="layout"
    url="agent/merchantConsumeRecordList"
    :columns="columns"
    edit-width="160px"
    :searchFunc="searchFunc"
    :treeTable="false"
  ></main-layout>
</template>
<script>
export default {
  data() {
    return {
      searchFields: {
        type: {
          // 消费类型：0-发布任务 1-产品差价 2-商品仓储费 3-商品出库费 4-回收操作费
          widget: 'select',
          options: [
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
          ],
          label: '消费类型',
          labelWidth: '70px'
        },
        merchantConsumeRecordId: {
          label: '消费编号',
          labelWidth: '70px'
        }
      },
      columns: [
        {
          label: '消费编号',
          value: 'merchantConsumeRecordId',
          width: 90
        },
        {
          label: '金额 $',
          value: 'money',
          width: 90
        },
        {
          label: '消费类型',
          value: 'type',
          _enum: {
            0: '发布任务',
            1: '产品差价',
            2: '商品仓储费',
            3: '商品出库费',
            4: '回收操作费'
          },
          width: 90
        },
        {
          label: '消费源',
          value: 'sourceId',
          // url: true,
          render: (h, scope) => {
            let vm = this
            // eslint-disable-next-line no-unused-vars
            const { type, sourceId } = scope.row
            // if (type == 0) {
            return (
              <el-button
                type="text"
                onClick={() => {
                  let { href } = vm.$router.resolve({
                    path: '/viewTask',
                    query: {
                      id: scope.row.sourceId
                    }
                  })
                  window.open(href)
                }}
              >
                {sourceId}
              </el-button>
            )
            // } else {
            //   return <span>-</span>
            // }
          },
          width: 90
        },
        {
          label: '消费时间',
          value: 'consumeTime',
          width: 140
        },
        {
          label: '消费明细',
          minWidth: 400,
          noTooltip: true,
          value: 'detail'
        }
      ]
    }
  },
  methods: {
    searchFunc(data) {
      return data
    }
  }
}
</script>