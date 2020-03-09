<template>
  <mainLayout
    :simple="true"
    :outerParams="$attrs"
    :columns="columns"
    :selection="false"
    :outerTableList="$attrs.problemList"
  ></mainLayout>
</template>
<script>
export default {
  data() {
    return {
      columns: [
        {
          label: '变动类型',
          value: 'changeType',
          _enum: {
            1: '父子关系',
            2: '标题',
            3: '品牌',
            4: '类目',
            5: '卖点'
          }
        },
        {
          label: '变动SKU数',
          value: 'num',
          render: (h, scope) => {
            return (
              <el-button
                type="text"
                on-click={() => {
                  this._openDialog({
                    width: '70%',
                    title: '问题明细',
                    params: {changeId: scope.row.changeId, ...this.$attrs, parent: true},
                    component: () => import('./quesInfo.vue')
                  })
                }}
              >
                {scope.row.changeSkuCnt}
              </el-button>
            )
          }
        }
      ]
    }
  }
}
</script>