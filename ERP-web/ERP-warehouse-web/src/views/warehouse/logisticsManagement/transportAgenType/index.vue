<template>
  <div class="transport-agen-type">
    <yt-page
      url="warehouse/forwarderTransportTypePage"
      reserveSelection="logisticForwarderTransportTypeId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="selectChange"
      ref="page"
    >
      <template slot="tableLeft">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="text" size="mini" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </template>
    </yt-page>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      searchConfig: [
        {
          value: 'logisticTransportTypeIdList',
          type: 'multiple',
          placeholder: '运输方式(多选)',
          children: []
        },
        {
          value: 'forwarderName',
          placeholder: '运输商名称',
          type: 'input'
        },
        {
          value: 'logisticRegionIdList',
          type: 'multiple',
          placeholder: '区域',
          children: []
        }
      ],
      btnConfig: [
        {
          name: '添加',
          fn: () => {
            this.$refs.page.$dialog({
              title: '添加',
              visible: true,
              width: '460px',
              component: () => import('./addTransportAgenType.vue')
            })
          }
        },
        {
          name: '添加区域运费',
          fn: () => {
            this.addRegionFreight()
          }
        },
        {
          name: '删除',
          fn: () => {
            this.handleDelete()
          }
        }
      ],
      arrowFlagList: [],
      tableConfig: [
        {
          label: '运输商名称',
          render(h, scope) {
            if (scope.row.flag == 1) {
              vm.arrowFlagList[scope.$index] ||
                (vm.arrowFlagList[scope.$index] = {})
              return (
                <div>
                  <i
                    class={
                      vm.arrowFlagList[scope.$index].arrowFlag
                        ? 'el-icon-caret-bottom'
                        : 'el-icon-caret-right'
                    }
                    onClick={() => {
                      vm.handleArrowChange(scope.$index, scope.row)
                    }}
                  />
                  <i>{scope.row.logisticForwarderName || '-'}</i>
                </div>
              )
            } else {
              return <i>{scope.row.logisticForwarderName || '-'}</i>
            }
          }
        },
        {
          label: '运输方式',
          value: 'logisticTransportTypeStr'
        },
        {
          label: '挂号费',
          value: 'registrationFee'
        },
        {
          label: '处理费',
          value: 'handlingFee'
        },
        {
          label: '运输商折扣',
          value: 'discount'
        },
        {
          label: '区域运费',
          // value: 'count',
          render: (h, scope) => {
            return (
              <i
                onClick={() => {
                  vm.addRegionFreight(scope.$index, scope.row)
                }}
                class="link-color"
              >
                {scope.row.count}
              </i>
            )
          }
        },
        {
          label: '备注',
          value: 'remark'
        }
      ],
      selectData: []
    }
  },
  created() {
    this.getForwarderTypeList()
    this.getAreaList()
  },
  computed: {
    ...mapState('logistics', ['forwarderTypeList', 'areaList'])
  },
  watch: {
    forwarderTypeList(val) {
      this.searchConfig[0].children = val
    },
    areaList(val) {
      this.searchConfig[2].children = val
    }
  },
  methods: {
    ...mapActions('logistics', ['getForwarderTypeList', 'getAreaList']),
    searchData(val) {
      return val
    },
    handleArrowChange(index, row) {
      let logisticForwarderTransportTypeId =
        row.logisticForwarderTransportTypeId
      let vm = this
      if (vm.arrowFlagList[index] && vm.arrowFlagList[index].arrowFlag) {
        vm.$refs.page.tableList.splice(
          vm.arrowFlagList[index].startIndex,
          vm.arrowFlagList[index].length
        )
        vm.arrowFlagList[index].arrowFlag = false
        return
      }
      // let tableList = JSON.parse(JSON.stringify(vm.$refs.page.tableList))

      vm.$api[`warehouse/forwarderTransportTypeAllList`]({
        logisticForwarderTransportTypeId
      }).then(data => {
        let { rows } = data
        console.log(rows)

        vm.arrowFlagList[index].arrowFlag = true
        vm.arrowFlagList[index].length = rows.length
        vm.arrowFlagList[index].startIndex = index + 1
        vm.$refs.page.tableList.splice(
          vm.arrowFlagList[index].startIndex,
          0,
          ...rows
        )
        console.log(vm.arrowFlagList)
      })
    },
    selectChange(val) {
      this.selectData = val
    },
    submitForm(val, title) {
      switch (title) {
        case '添加':
          this.addTransportAginType(val)
          break
        case '编辑':
          this.addTransportAginType(val)
          break
        case '添加区域运费':
          this.$refs.page.closeForm()
          this.$refs.page.clearSelection()
          break

        default:
          break
      }
    },
    addTransportAginType(val) {
      let vm = this
      vm.$api['warehouse/forwarderTransportTypeSave'](val).then(() => {
        vm.$refs.page.closeForm()
      })
    },
    addRegionFreight(index, row) {
      let logisticForwarderTransportTypeIds = null
      if (row) {
        logisticForwarderTransportTypeIds = [
          row.logisticForwarderTransportTypeId
        ]
      } else {
        logisticForwarderTransportTypeIds = this.selectData.map(
          item => item.logisticForwarderTransportTypeId
        )
      }

      if (this.$editMsg(logisticForwarderTransportTypeIds)) return
      this.$refs.page.$dialog({
        title: '添加区域运费',
        visible: true,
        width: '1100px',
        component: () => import('./addRegionFreight/index.vue'),
        childFn: [
          {
            name: 'getList',
            params: {
              logisticForwarderTransportTypeId:
                logisticForwarderTransportTypeIds[0]
            }
          }
        ]
      })
    },
    handleEdit(index, row) {
      let logisticForwarderTransportTypeId =
        row.logisticForwarderTransportTypeId
      let vm = this
      vm.$refs.page.$dialog({
        title: '编辑',
        visible: true,
        width: '460px',
        component: () => import('./addTransportAgenType.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              logisticForwarderTransportTypeId
            }
          }
        ]
      })
    },
    handleDelete(index, row) {
      let vm = this
      let logisticForwarderTransportTypeIdList = []
      if (row) {
        logisticForwarderTransportTypeIdList = [
          row.logisticForwarderTransportTypeId
        ]
      } else {
        logisticForwarderTransportTypeIdList = vm.selectData.map(item => {
          return item.logisticForwarderTransportTypeId
        })
      }
      if (vm.$editMsg(logisticForwarderTransportTypeIdList, false)) return
      vm.$api['warehouse/forwarderTransportTypeRemove']({
        logisticForwarderTransportTypeIdList
      }).then(data => {
        vm.$deleteMsg(data)
        vm.$refs.page.getList('search')
        vm.$refs.page.clearSelection()
      })
    },
    handleFlagChange() {}
  }
}
</script>
<style lang="scss">
.transport-agen-type {
  background: #fff;
}
</style>