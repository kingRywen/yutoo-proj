<template>
  <div>
    <MainLayout
      :outerParams="outerParams"
      :edits="edits"
      :searchFields="searchFields"
      :searchData="searchData"
      :editBtns="editBtns"
      :columns="columns"
      :backBtn="true"
      ref="layout"
      url="sameAttrConfigDetailList"
    >
      <!-- <div slot="left">123</div> -->
    </MainLayout>
  </div>
</template>

<script>
export default {
  props: ['params'],
  data() {
    let vm = this
    return {
      show: true,
      edits: [
        {
          name: '设置关联亚马逊字段',
          icon: 'el-icon-setting',
          fn: (scope, item) => {
            this.$refs.layout.$dialog({
              title: '设置关联字段',
              size: 'small',
              params: { ...scope.row, ...this.params },
              component: () => import('./dialogs/SetAttr.vue'),
              appendToBody: true,
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '编辑',
          icon: 'el-icon-edit-outline',
          fn: (scope, item) => {
            this.$refs.layout.$dialog({
              title: '编辑属性',
              size: 'small',
              params: {edit: true, attrId: scope.row.attrId, ...this.params},
              component: () => import('./dialogs/AddAttrs.vue'),
              appendToBody: true,
              okBtnText: '保存修改',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '删除',
          icon: 'el-icon-delete',

          fn: (scope, item) => {
            vm.del(scope.row)
          }
        }
      ],
      searchFields: [
        {
          label: '属性名称',
          placeholder: '请输入关键字',
          labelWidth: '60px',
          name: 'cusAttrKey'
        }
      ],
      searchData: {},
      editBtns: [
        {
          name: '添加',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '添加属性',
              size: 'small',
              params: {
                ...this.params,
				add:true
              },
              component: () => import('./dialogs/AddAttrs.vue'),
              appendToBody: true,
              okBtnText: '确认添加',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '批量添加属性',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '批量添加属性',
              size: 'small',
              params: {
                ...this.params
              },
              component: () => import('./dialogs/BatchAddAttrs.vue'),
              appendToBody: true,
              okBtnText: '确认添加',
              cancelBtnText: '取消'
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
        },
				{
				  name: '导入类目属性',
				  fn: () => {
						let pcid = vm.params.pcid
				    this.$refs.layout.$dialog({
				      title: '导入类目属性',
				      size: 'small',
              component: () => import('../dialogs/Import.vue'),
              appendToBody: true,
				      params: {
                pcid:pcid,
                ...this.params,
				        close: () => {
				          vm.getLayoutList()
				        }
				      }
				      // okBtnText: "确认",
				      // cancelBtnText: "取消"
				    })
				  }
				}
      ],
      columns: [
        {
          label: '序号',
          value: 'pcid',
          render(h, scope) {
            return vm.renderIndex(scope)
          }
        },
        {
          label: '属性名称',
          value: 'cusAttrKey'
        },
        {
          label: '关联亚马逊字段',
          value: 'attrKey'
        },
        {
          label: '是否同款属性',
          value: 'sameAttrFlag',
          render(h, scope) {
            return (
              <el-switch
                active-value={1}
                inactive-value={0}
                value={scope.row.sameAttrFlag}
                onChange={() => {
                  const { name, parentName, attrId } = scope.row
                  let params = {
                    sellerId: vm.sellerId,
                    siteId: vm.siteId,
                    name,
                    parentName,
                    attrId,
                    sameAttrFlag: scope.row.sameAttrFlag ? 0 : 1
                  }
                  vm.$api[`sameAttrConfigDetailUpdate`](params)
                    .then(data => {
                      vm.getLayoutList()
                    })
                    .catch(() => {})
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
      const { sellerId, siteId } = this.sellerData
      const { parentName, name:name1,pcid } = this.params
      return { sellerId, siteId, parentName, name: name1,pcid }
    }
  },
  methods: {
    del(row) {
      let vm = this
      vm.$.showWarning(`是否删除${!row ? '选择的' : ''}属性？`, () => {
        let ids = vm.getSelectionByKey('attrId')
        const { name, parentName } = vm.params
        const params = {
          sellerId: vm.sellerId,
          siteId: vm.siteId,
          name,
          parentName,
          ids: row ? [row.attrId] : ids
        }
        vm.$api[`sameAttrConfigDetailBatchRemove`](params)
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
