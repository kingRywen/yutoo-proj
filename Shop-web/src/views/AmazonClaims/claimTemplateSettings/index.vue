<template>
  <div>
    <MainLayout
      :outerParams="outerParams"
      :edits="edits"
      :searchFields="searchFields"
      :searchData="searchData"
      :editBtns="editBtns"
      :columns="columns"
      :searchFunc="searchFunc"
      ref="layout"
      url="taskClaimTemplateList"
    >
      <!-- <div slot="left">123</div> -->
    </MainLayout>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      show: true,
      edits: [
        // {
        //   name: '查看',
        //   icon: 'el-icon-search',

        //   fn: (scope, item) => {
        //     this.$refs.layout.$dialog({
        //       title: '查看模板',
        //       size: 'large',
        //       params: { review: true },
        //       component: () => import('./dialogs/AddTemp.vue'),
        //       okBtnText: '保存'
        //     })
        //   }
        // },
        {
          name: '编辑',
          icon: 'el-icon-edit-outline',
          fn: (scope, item) => {
            this.$refs.layout.$dialog({
              title: '编辑模板',
              size: 'large',
              params: { edit: true, row: scope.row },
              component: () => import('./dialogs/AddTemp.vue'),
              okBtnText: '保存'
            })
          }
        }
      ],
      searchFields: [
        {
          noLabel: true,
          placeholder: '模板名称',
          name: 'templateName'
        },
        {
          label: '时间',
          name: 'createTime',
          type: 'dateRange'
        }
      ],
      searchData: {},
      editBtns: [
        {
          name: '添加模板',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '添加模板',
              size: 'large',
              component: () => import('./dialogs/AddTemp.vue'),
              okBtnText: '保存'
            })
          }
        },
        {
          name: '删除',
          disabled: selection => {
            return selection.length === 0
          },
          fn() {
            vm.del()
          }
        }
      ],
      columns: [
        {
          label: '模板名称',
          value: 'templateName'
        },
        {
          label: '模板类型',
          value: 'templateType',
          enum: {
            0: '亚马逊丢货未赔偿',
            1: '亚马逊损坏未赔偿',
            2: '客户退款未退货未赔偿',
            3:  "FBA配送费不对重测",
            4:  "佣金不对重测",
            5:  "仓储费不对重测",
            6:  "FBA配送费不对索赔",
            7:  "佣金不对索赔",
            8:  "仓储费不对索赔",
          }
        },
        // {
        //   label: '联系原因',
        //   value: 'contactReason'
        // },
        {
          label: '添加时间',
          value: 'createTime'
        },
        {
          label: '是否默认',
          value: 'defaultFlag',
          render(h, scope) {
            return (
              <i
                class={
                  scope.row.defaultFlag ? 'el-icon-check' : 'el-icon-close'
                }
                style={{
                  fontSize: '18px',
                  color: scope.row.defaultFlag ? '#67C23A' : '#F56C6C'
                }}
              />
            )
          }
        }
      ]
    }
  },
  computed: {
    outerParams() {
      const { sellerId, siteId, platformId } = this.sellerData
      const { parentName, name } = this.$route.query
      return { sellerId, siteId, parentName, name, platformId }
    }
  },
  methods: {
    searchFunc(data) {
      let { createTime, ...info } = data
      let [startTime, endTime] = createTime || []
      return { startTime, endTime, ...info }
    },
    del(row) {
      let vm = this
      vm.$.showWarning(`是否删除${!row ? '选择的' : ''}模板？`, () => {
        let ids = vm.getSelectionByKey('templateId')
        const params = {
          templateIds: row ? [row.attrId] : ids
        }
        vm.$api[`taskClaimTemplateRemove`](params)
          .then(() => {
            vm.getLayoutList()
          })
          .catch(() => {})
      })
    }
  }
}
</script>

<style>
</style>
