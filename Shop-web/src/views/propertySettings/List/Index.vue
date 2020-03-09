<template>
  <div>
    <MainLayout
      v-if="$route.name === 'propertySettings'"
      :outerParams="outerParams"
      :edits="edits"
      :searchFields="searchFields"
      :searchData="searchData"
      :editBtns="editBtns"
      :columns="columns"
      :treeTable="treeTable"
      :treeTableOtions="treeTableOtions"
      :fixedPageFunc="fixedPageFunc"
	  :isShowPag = 'false'
      ref="layout"
      url="sameAttrConfigList"
    >
      <!-- <div slot="left">123</div> -->
    </MainLayout>
    <router-view v-else></router-view>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      show: true,
      treeTable: true,
      treeTableOtions: {
        childs: 'childList',
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },

      edits: [
        {
          name: '类目属性管理',
          icon: 'el-icon-more',
          fn: (scope, item) => {
            let row = scope.row
            this.$refs.layout.$dialog({
              title: '类目属性管理',
              size: 'large',
              params: { ...row },
              component: () => import('../Details/Index.vue'),
            })
            // vm.$router.push({
            //   name: 'propertySettingsDetails',
            //   query: {
            //     name: scope.row.name,
				    //     pcid: scope.row.pcid,
            //     parentName: scope.row.parentName
            //   }
            // })
          }
        },
        {
          name: '新增下级',
          icon: 'el-icon-circle-plus-outline',
          show(scope) {
            return !!scope.row.haveChildren
          },
          fn: (scope, item) => {
            this.$refs.layout.$dialog({
              title: '新增下级',
              size: 'small',
              params: { ...scope.row },
              component: () => import('../dialogs/AddNext.vue'),
              okBtnText: '确认',
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
          label: '分类名称',
          placeholder: '请输入关键字',
          labelWidth: '60px',
          name: 'name'
        }
        // {
        //   label: '创建时间',
        //   name: 'createTime',
        //   type: 'dateRange',
        //   // width: 240,
        //   pickerOptions: {
        //     disabledDate(time) {
        //       return time.getTime() > Date.now()
        //     }
        //   }
        // }
      ],
      searchData: {},
      editBtns: [
        {
          name: '添加类目',
          fn: () => {
            this.$refs.layout.$dialog({
              title: '添加类目',
              size: 'small',
              params: { edit: true },
              component: () => import('../dialogs/AddCategory.vue'),
              okBtnText: '确认',
			  cancelBtnText: '取消'
            })
          }
        },
        {
          name: '删除',
          disabled: selection => {
            return selection.length === 0
          },
          fn: () => {
            vm.del()
          }
        },
        // {
        //   name: '导入类目属性',
        //   disabled: selection => {
        //     return selection.length !== 1
        //   },
        //   fn: () => {
        //     this.$refs.layout.$dialog({
        //       title: '导入类目属性',
        //       size: 'small',
        //       component: () => import('../dialogs/Import.vue'),
        //       params: {
        //         pcid: vm.$refs.layout.selection[0].pcid,
        //         close: () => {
        //           vm.getLayoutList()
        //         }
        //       }
        //       // okBtnText: "确认",
        //       // cancelBtnText: "取消"
        //     })
        //   }
        // }
      ],
      columns: [
        {
          label: '序号',
          value: 'pcid',
          width: 160,
          render(h, scope) {
            return <span>{scope.$index + 1}</span>
          },
          // expand: true
        },
        {
          label: '亚马逊类目名称',
          value: 'name',
          expand: true,
          async: false
        },
        {
          label: '创建时间',
          value: 'createTime',
          align: 'left'
        }
      ]
    }
  },
  computed: {
    outerParams() {
      const { platformId, sellerId, siteId } = this.sellerData
      return { platformId, sellerId, siteId }
    }
  },
  methods: {
    del(row) {
      let vm = this
      vm.$.showWarning('是否删除选中的类目？', () => {
        const { sellerId, siteId } = vm.sellerData
        const params = {
          sellerId,
          siteId,
          ids: row ? [row.pcid] : vm.$refs.layout.selection.map(el => el.pcid)
        }
        vm.$api[`sameAttrConfigBatchRemove`](params)
          .then(data => {
            vm.getLayoutList()
          })
          .catch(() => {})
      })
    },
    // sortChange({ column, prop, order }) {
    //   console.log({ column, prop, order })
    // }
    fixedPageFunc(data) {
      return { rows: data.data }
    }
  }
}
</script>

<style>
</style>
