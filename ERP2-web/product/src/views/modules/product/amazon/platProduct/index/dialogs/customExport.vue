<template>
  <ElRow :gutter="12" v-loading="loading">
    <ElCol :span="12">
      <main-layout
        :simple="true"
        ref="table"
        :columns="dataRow.slice(0, -1)"
        :isShowPag="false"
        @selectChange="selectChange"
        :outerTableList="originData"
      ></main-layout>
    </ElCol>
    <ElCol :span="12">
      <main-layout
        class="custom-export"
        :showSelection="false"
        :simple="true"
        :columns="dataRow"
        :isShowPag="false"
        :outerTableList="selectData"
      ></main-layout>
    </ElCol>
  </ElRow>
</template>
<script>
import storage from 'Utils/saver'
import camelCase from 'lodash/camelCase'
function getFields() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        {
          label: '仓库SKU',
          value: 'sku'
        },
        {
          label: '系统sku',
          value: 'sysSku'
        },
        {
          label: '产品中文名称',
          value: 'cnName'
        }
      ])
    }, 2000)
  })
}
export default {
  props: {
    // ['saveName', 'platSiteId']
    // 唯一标识，用来存储数据
    saveName: String,
    // 站点id,区分站点数据
    platSiteId: Number,
    // 获取数据的promise
    loadData: {
      type: Function,
      default: () => getFields()
    }
  },
  data() {
    let vm = this
    return {
      loading: false,
      dataRow: [
        {
          label: '序号',
          value: '$index',
          render(h, scope) {
            return <span>{scope.$index + 1}</span>
          }
        },
        {
          label: '名称',
          value: 'label'
        },
        {
          label: '操作',
          render(h, scope) {
            const { $index: i, row } = scope
            return (
              <div>
                <el-button
                  type="text"
                  on-click={() => {
                    let del = vm.selectData.splice(i, 1)
                    if (i == 0) {
                      vm.selectData.push(del[0])
                      return
                    }
                    vm.selectData.splice(i - 1, 0, del[0])
                  }}
                >
                  上移
                </el-button>
                <el-button
                  type="text"
                  on-click={() => {
                    let del = vm.selectData.splice(i, 1)
                    if (i == vm.selectData.length) {
                      return vm.selectData.unshift(del[0])
                    }
                    vm.selectData.splice(i + 1, 0, del[0])
                  }}
                >
                  下移
                </el-button>
                <el-button
                  type="text"
                  on-click={() => {
                    vm.selectData.splice(i, 1)
                    vm.setRowSelect(row)
                  }}
                >
                  删除
                </el-button>
              </div>
            )
          }
        }
      ],
      // 原始数据
      originData: [],
      // 选中的数据
      selectData: []
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      let vm = this
      this.loading = true
      this.loadData().then(data => {
        this.originData = data
        let selectData = []
        let sdata = storage.get('local', this.cacheName) || {}
        if (this.platSiteId != null) {
          selectData = sdata[this.platSiteId] || []
        } else {
          selectData = sdata.main || []
        }

        setTimeout(() => {
          vm.originData.forEach(el => {
            if (selectData.indexOf(el.value) > -1) {
              vm.setRowSelect(el, true)
            }
          })
          vm.loading = false
        })
      })
    },
    getFields,
    setRowSelect(row, isSelect = false) {
      this.$refs.table.$refs.table.$refs.table.toggleRowSelection(row, isSelect)
    },
    selectChange(val) {
      if (val.length < this.selectData.length) {
        this.selectData = this.selectData.filter(el => val.indexOf(el) > -1)
      }
      if (val.length > this.selectData.length) {
        val.forEach(element => {
          if (this.selectData.indexOf(element) === -1) {
            this.selectData.push(element)
          }
        })
      }
    },
    // 把数据保存到本地
    saveToLocal() {
      let saved = storage.get('local', this.cacheName) || {}
      if (this.platSiteId != null) {
        saved[this.platSiteId] = this.selectData.map(el => el.value)
      } else {
        saved.main = this.selectData.map(el => el.value)
      }

      storage.set('local', this.cacheName, saved)
    },
    _close() {
      this.saveToLocal()
    }
  },
  computed: {
    cacheName() {
      return camelCase(this.$route.path) + this.saveName
    }
  }
}
</script>
<style lang="scss">
.custom-export {
  .el-button--text {
    padding: 0px 0px;
  }
}
</style>