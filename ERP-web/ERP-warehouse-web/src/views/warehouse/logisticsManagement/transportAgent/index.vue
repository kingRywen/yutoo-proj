<template>
  <div class="transport-mode">
    <yt-page
      url="warehouse/forwarderPage"
      reserveSelection="logisticForwarderId"
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
            <el-button type="text" size="mini" @click="handleEdit(scope.$index,scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </template>
      <!-- <template slot="tableRight">
        <el-table-column label="是否激活" width="120px" align="center">
          <template slot-scope="scope">
            <i
              :class="scope.row.activateFlag?'el-icon-check':'el-icon-close'"
              @click="handleFlagChange(scope.$index, scope.row)"
            ></i>
          </template>
        </el-table-column>
      </template>-->
    </yt-page>
  </div>
</template>
<script>
export default {
  data() {
    let vm = this
    return {
      searchConfig: [
        {
          label: '运输商名称:',
          value: 'forwarderName',
          type: 'input',
          placeholder: ''
        },
        {
          label: '添加时间',
          value: 'time',
          type: 'time'
        }
      ],
      btnConfig: [
        {
          name: '添加',
          fn: () => {
            vm.$refs.page.$dialog({
              title: '添加',
              visible: true,
              width: '1000px',
              component: () => import('./addForwarder.vue')
            })
          }
        },
        {
          name: '删除',
          fn: () => {
            vm.handleDelete()
          }
        }
      ],
      tableConfig: [
        {
          label: '运输商名称',
          value: 'forwarderName'
        },
        {
          label: '运输商代码',
          value: 'forwarderCode'
        },
        {
          label: '取件联系人',
          value: 'accessName'
        },
        {
          label: '取件人电话',
          value: 'accessPhone'
        },
        {
          label: '取件人QQ',
          value: 'accessQq'
        },
        {
          label: '财务联系人',
          value: 'financialName'
        },
        {
          label: '财务电话',
          value: 'financialPhone'
        },
        {
          label: '财务QQ',
          value: 'financialQq'
        },
        {
          label: '客服联系人',
          value: 'serviceName'
        },
        {
          label: '客服电话',
          value: 'servicePhone'
        },
        {
          label: '客服QQ',
          value: 'serviceQq'
        },
        {
          label: '运输商公司地址',
          value: 'forwarderAddress'
        },
        {
          label: '添加时间',
          value: 'createTime'
        },
        {
          label: '是否激活',
          render: vm.$.checkFlag((index, row) => {
            let logisticForwarderId = row.logisticForwarderId
            let activateFlag = row.activateFlag == 1 ? 0 : 1
            vm.$api['warehouse/forwarderActiveSet']({
              logisticForwarderId,
              activateFlag
            }).then(() => {
              vm.$refs.page.getList('search')
            })
          })
        }
      ],
      selectData: []
    }
  },
  mounted() {},
  methods: {
    searchData(val) {
      if (val.time && val.time.length) {
        val.createTimeStart = val.time[0]
        val.createTimeEnd = val.time[1]
      }
      delete val.time
      return val
    },
    selectChange(val) {
      this.selectData = val
    },
    submitForm(val, title) {
      switch (title) {
        case '添加':
          this.addForwarder(val)
          break
        case '编辑':
          this.addForwarder(val)
          break

        default:
          break
      }
    },
    handleDelete() {
      let vm = this
      if (vm.$editMsg(vm.selectData, false)) return

      let logisticForwarderIdList = vm.selectData.map(
        item => item.logisticForwarderId
      )

      vm.$api['warehouse/forwarderRemove']({
        logisticForwarderIdList
      }).then(data => {
        vm.$deleteMsg(data)
        vm.$refs.page.getList('search')
        vm.$refs.page.clearSelection()
      })
    },
    handleEdit(index, row) {
      let logisticForwarderId = row.logisticForwarderId
      this.$refs.page.$dialog({
        title: '编辑',
        visible: true,
        width: '1000px',
        component: () => import('./addForwarder.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              logisticForwarderId
            }
          }
        ]
      })
    },
    addForwarder(val) {
      this.$api['warehouse/forwarderSave'](val).then(() => {
        this.$refs.page.closeForm()
      })
    }
  }
}
</script>
<style lang="scss">
.transport-mode {
  background: #fff;
}
</style>