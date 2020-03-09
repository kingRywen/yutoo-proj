<template>
  <div class="transport-mode">
    <yt-page
      url="warehouse/regionPage"
      reserveSelection="logisticRegionId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="selectChange"
      ref="page"
    >
      <template slot="table">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button type="text" size="mini" @click="handleManage(scope.$index, scope.row)">国家区域管理</el-button>
          </template>
        </el-table-column>
      </template>
    </yt-page>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchConfig: [
        {
          value: 'logisticRegionName',
          placeholder: '区域名称',
          type: 'input'
        },
        {
          value: 'countryId',
          type: 'country',
          placeholder: '国家'
        },
        {
          value: 'provinceId',
          type: 'province',
          remote: false,
          placeholder: '省'
        }
      ],
      btnConfig: [
        {
          name: '添加区域',
          fn: () => {
            let vm = this
            vm.$refs.page.$dialog({
              title: '添加区域',
              visible: true,
              width: '530px',
              component: () => import('./addRegion.vue')
            })
          }
        },
        {
          name: '删除',
          fn: () => {
            this.handleDelete()
          }
        },
        {
          name: '导入国家到区域',
          fn: () => {
            this.$refs.page.$dialog({
              title: '导入国家到区域',
              visible: true,
              width: '360px',
              component: () => import('./importTemplate.vue'),
              childFn: [
                {
                  name: 'initFn',
                  params: {
                    title: '导入国家到区域',
                    downUrl: 'regionTemplateDownload',
                    upUrl: 'logistic/region/template/upload'
                  }
                }
              ]
            })
          }
        },
        {
          name: '导入省到国家',
          fn: () => {
            this.$refs.page.$dialog({
              title: '导入省到国家',
              visible: true,
              width: '360px',
              component: () => import('./importTemplate.vue'),
              childFn: [
                {
                  name: 'initFn',
                  params: {
                    title: '导入省到国家',
                    downUrl: 'countryTemplateDownload',
                    upUrl: 'logistic/country/template/upload'
                  }
                }
              ]
            })
          }
        }
      ],
      tableConfig: [
        {
          label: '区域名称',
          value: 'logisticRegionName'
        },
        {
          label: '区域描述',
          value: 'describe'
        }
      ],
      selectData: []
    }
  },
  mounted() {
    // let arr = [{ a: 1 }, { b: [{ c: null }] }]
    // console.log(this.$.deepClone(arr))

    if (this.$route.query.areaSkipType == 1) {
      this.$refs.page.$dialog({
        title: '添加区域',
        visible: true,
        width: '530px',
        component: () => import('./addRegion.vue')
      })
    }
  },
  methods: {
    searchData(val) {
      return val
    },
    selectChange(val) {
      this.selectData = val
    },
    submitForm(val, title) {
      switch (title) {
        case '添加区域':
          this.addRegion(val)
          break
        case '导入国家到区域':
          this.$refs.page.resetForm()
          break
        case '导入省到国家':
          this.$refs.page.resetForm()
          break
        default:
          break
      }
    },
    addRegion(val) {
      let _data = JSON.parse(JSON.stringify(val))
      this.$api['warehouse/regionSave'](_data).then(() => {
        this.$refs.page.closeForm()
      })
    },
    handleDelete(index, row) {
      let vm = this
      let logisticRegionIdList = []
      if (row) {
        logisticRegionIdList = [row.logisticRegionId]
      } else {
        logisticRegionIdList = vm.selectData.map(item => item.logisticRegionId)
      }
      if (vm.$editMsg(logisticRegionIdList, false)) return
      vm.$api['warehouse/regionRemove']({
        logisticRegionIdList
      }).then(data => {
        vm.$deleteMsg(data)
        vm.$refs.page.getList('search')
        vm.$refs.page.clearSelection()
      })
    },
    handleEdit(index, row) {
      let logisticRegionId = row.logisticRegionId
      let vm = this
      vm.$refs.page.$dialog({
        title: '添加区域',
        visible: true,
        width: '530px',
        component: () => import('./addRegion.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              logisticRegionId
            }
          }
        ]
      })
    },
    handleManage(index, row) {
      let logisticRegionId = row.logisticRegionId
      this.$refs.page.$dialog({
        title: '国家区域管理',
        visible: true,
        width: '800px',
        display: false,
        component: () => import('./nationalAreaManage'),
        childFn: [
          {
            name: 'getList',
            params: {
              logisticRegionId
            }
          }
        ]
      })
    },
    handleFlagChange() {}
  }
}
</script>
<style lang="scss">
.transport-mode {
  background: #fff;
}
</style>