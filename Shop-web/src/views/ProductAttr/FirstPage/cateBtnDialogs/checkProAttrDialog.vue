
<template>
  <div v-if="$route.name==='ProductAttr'">
    <div>
      <MainLayout
        :showSearch="false"
        :edits="edits"
        :editBtns="editBtns"
        :outerParams="outerParams"
        :searchField="false"
        :columns="columns"
        :searchFunc="searchFunc"
        @selectChange="selectChange"
        ref="detail"
        url="sameAttrConfigDetailList"
      ></MainLayout>
    </div>
  </div>
  <router-view v-else></router-view>
</template>

<script>
export default {
  components: {},
  props: ['params'],
  data() {
    let vm = this
    return {
      parentSkus: null,
      editBtns: [
        {
          name: '添加',
          fn: () => {
            let params = this.outerParams
            this.$refs.detail.$dialog({
              title: '添加属性',
              size: 'small',
              component: () => import('./checkProAttr/add.vue'),
              params,
              appendToBody: true,
              okBtnText: '确认',
              cancelBtnText: '取消'
            })
          }
        },
        {
          name: '删除',
          fn: () => {
            this.delBtn()
          }
        }
      ],
      //columns表格
      columns: [
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
                      vm.$refs.detail.getList()
                    })
                    .catch(() => {})
                }}
              />
            )
          }
        }
      ],
      searchFields: [],
      //表格列表操作按钮
      edits: [
        {
          name: '设置关联亚马逊字段',
          icon: 'el-icon-setting',
          fn: (scope, item) => {
            this.$refs.detail.$dialog({
              title: '设置关联字段',
              size: 'small',
              params: { ...scope.row },
              component: () => import('./checkProAttr/Set.vue'),
              okBtnText: '确认',
              appendToBody: true,
              cancelBtnText: '取消'
            })
          }
        }
      ],
      //外部参数
      outerParams: {
        name: this.params.name,
        parentName: this.params.parentName,
        startTime: null,
        endTime: null,
        platformId: this.platformId,
        siteId: null,
        sellerId: null,
        newDate: null
      },
      slectIds: [] //选择的ID的数组
      //   tab2
    }
  },

  created() {
    if (this.sellerId && this.siteId) {
      this.outerParams.siteId = this.siteId
      this.outerParams.sellerId = this.sellerId
    }
  },
  mounted() {},
  methods: {
    _submit() {
      return Promise.resolve(true)
    },
    // 修正后端列表数据结构
    fixedPageFunc(data) {
      return { rows: data.data }
    },
    //参数处理
    searchFunc(data) {
      let { time, ...info } = data
      let [startTime, endTime] = time || []
      return { startTime, endTime, ...info }
    },
    selectChange(v) {
      //   console.log(v);
      this.slectIds = []
      v.forEach(i => {
        this.slectIds.push(i.attrId)
      })
      //console.log(this.slectIds);
    },
    //删除按钮
    delBtn() {
      if (this.slectIds.length === 0) {
        this.$message({
          message: '请至少选择一项',
          type: 'warning'
        })
        return
      }
      this.$confirm('是否删除选择的属性？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['sameAttrConfigDetailBatchRemove']({
            siteId: this.outerParams.siteId,
            sellerId: this.outerParams.sellerId,
            parentName: this.params.parentName,
            name: this.params.name,
            ids: this.slectIds
          })
            .then(data => {
              if (data.code === 0) {
                // 删除时重新请求数据
                this.$refs.detail.getList()
                // 重新请求父组件的列表数据
                this.$store.commit('common/afterDelGetList', new Date())
              }
            })
            .catch(() => {})
        })
        .catch(() => {})
    }
  },

  computed: {},
  watch: {}
}
</script>

<style lang='scss' scoped>
</style>
