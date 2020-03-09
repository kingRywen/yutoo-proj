<template>
  <div class="declare">
    <yt-page
      url="warehouse/declarePage"
      reserveSelection="logisticDeclareId"
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
          </template>
        </el-table-column>
      </template>
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
          value: 'declareName',
          label: '规则名称:',
          placeholder: '',
          type: 'input'
        },
        {
          value: 'time',
          type: 'time',
          label: '添加时间:'
        }
      ],
      btnConfig: [
        {
          name: '添加',
          fn: () => {
            this.$refs.page.$dialog({
              title: '添加申报规则',
              visible: true,
              width: '780px',
              component: () => import('./addDeclare.vue')
            })
          }
        },
        {
          name: '删除',
          fn: () => {
            this.handleDelete()
          }
        }
      ],
      tableConfig: [
        {
          label: '规则名称',
          value: 'declareName'
        },
        {
          label: '重量计算比例',
          merge: [
            {
              label: '出口',
              value: 'declareWeightExit'
            },
            {
              label: '清关',
              value: 'declareWeightClearance'
            }
          ]
        },
        {
          label: '价格计算比例',
          merge: [
            {
              label: '出口',
              value: 'declarePriceExit'
            },
            {
              label: '清关',
              value: 'declarePriceClearance'
            }
          ]
        },
        {
          label: '是否激活',
          render: vm.$.checkFlag((index, row) => {
            let logisticDeclareId = row.logisticDeclareId
            let activateFlag = row.activateFlag == 1 ? 0 : 1
            this.$api['warehouse/declareActiveSet']({
              logisticDeclareId,
              activateFlag
            }).then(() => {
              vm.$refs.page.getList('search')
            })
          })
        },
        {
          label: '添加人',
          value: 'creatorName'
        },
        {
          label: '添加时间',
          value: 'createTime'
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
        case '添加申报规则':
          this.handleSave(val)
          break
        case '编辑申报规则':
          this.handleSave(val)
          break
        default:
          break
      }
    },
    handleEdit(index, row) {
      let logisticDeclareId = row.logisticDeclareId
      let vm = this
      vm.$refs.page.$dialog({
        title: '编辑申报规则',
        visible: true,
        width: '780px',
        component: () => import('./addDeclare.vue'),
        childFn: [
          {
            name: 'edit',
            params: {
              logisticDeclareId
            }
          }
        ]
      })
    },
    handleSave(data) {
      let vm = this
      vm.$api['warehouse/declareSave'](data).then(() => {
        vm.$refs.page.closeForm()
      })
    },
    handleDelete() {
      let vm = this
      let logisticDeclareIds = vm.selectData.map(item => item.logisticDeclareId)
      if (vm.$editMsg(logisticDeclareIds, false)) return
      let _data = {
        logisticDeclareIds
      }
      vm.$api['warehouse/declareRemove'](_data)
        .then(data => {
          vm.$deleteMsg(data)
          vm.$refs.page.getList('search')
          vm.$refs.page.clearSelection()
        })
        .catch(() => {})
    }
  }
}
</script>
<style lang="scss">
.declare {
  background: #fff;
}
</style>