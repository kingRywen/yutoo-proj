<template>
  <!-- 拣货机管理-->
  <div>
    <yt-page
      url="warehouse/WmPickingRobotList"
      reserveSelection="wmPickingRobotId"
      :tableConfig="tableConfig"
      :searchConfig="searchConfig"
      :btnConfig="btnConfig"
      :searchData="searchData"
      @submitForm="submitForm"
      @selectChange="selectChange"
      @closeDialog="closeDialog"
      ref="page"
    >
      <template slot="search">
        <!--  -->
        <el-form :inline="true" class="searchform">
          <el-form-item label="仓库（多选）">
            <el-select size="small" multiple collapse-tags v-model="selectInfo.warehouseIds">
              <el-option :label="i.label" :value="i.value" v-for="i in warehouseList" :key="i.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="负责库位">
            <table-select :wmWarehouseIds="selectInfo.warehouseIds" @handleselect="(val)=>selectInfo.locationIds=val"></table-select>
          </el-form-item>
          <el-form-item label="机型">
            <el-input size="small" v-model.trim="selectInfo.robotModel" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="small" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
        <!--  -->
      </template>
      <template slot="tableLeft">
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
              <i class="iconBtn el-icon-edit-outline" @click="edit(scope.row.wmPickingRobotId)"></i>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="刪除" placement="top">
              <i class="iconBtn el-icon-delete" @click="del(scope.row.wmPickingRobotId)"></i>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
    </yt-page>
  </div>
</template>
<script>
/* eslint-disable */
import { mapActions } from 'vuex'
import { mixins } from '@/views/warehouse/dailyOperation/mixins'
import TableSelect from '@/components/tableSelect/tableSelect'
export default {
  mixins: [mixins],
  data() {
    let vm = this
    return {
      tableConfig: [
        { value: 'wmName', label: '仓库' },
        { value: 'robotModel', label: '拣货机型号' },
        {
          value: 'locationCount',
          label: '负责库位',
          render(h, scope) {
            return (
              <el-button
                type="text"
                onClick={vm.lookStorehouse.bind(
                  vm,
                  scope.row.wmPickingRobotId,
                  scope.row.wmWarehouseId
                )}
              >
                {scope.row.locationCount}
              </el-button>
            )
          }
        },
        {
          value: 'activatedFlag',
          label: '状态',
          render(h, scope) {
            if (scope.row.activatedFlag) {
              return (
                <i
                  class="el-icon-check status_icon success"
                  onClick={() => {
                    vm.changeStatus(scope.row)
                  }}
                />
              )
            } else {
              return (
                <i
                  class="el-icon-close status_icon danger"
                  onClick={() => {
                    vm.changeStatus(scope.row)
                  }}
                />
              )
            }
          }
        },
        { value: 'createTime', label: '添加时间' },
        { value: 'userName', label: '添加人员' },
        { value: 'historyPickingCount', label: '拣货总数' }
      ],
      searchConfig: [
        {
          placeholder: '仓库（多选）',
          value: 'warehouseIds',
          type: 'multiple',
          children: []
        },
        {
          placeholder: '负责库位',
          value: 'locationIds',
          type: 'select',
          children: []
        },
        {
          placeholder: '机型',
          value: 'robotModel',
          type: 'input',
          clearable: true
        }
      ],
      btnConfig: [
        {
          name: '添 加',
          fn: () => {
            this.$refs.page.$dialog({
              visible: true,
              title: '添加拣货机',
              confirmButtonText: '确认添加',
              width: '650px',
              component: () => import('./addEdit')
            })
          }
        },
        {
          name: '批 量 刪 除',
          type: 'danger',
          disabled: () => {
            return this.wmPickingRobotIds.length ? false : true
          },
          fn: () => {
            // if (!this.wmPickingRobotIds.length) {
            //     return this.$message.warning(
            //         '请选择需要批量删除的拣货机'
            //     );
            // }
            this.checkedDel({
              wmPickingRobotIds: this.wmPickingRobotIds
            })
          }
        }
      ],
      wmPickingRobotIds: [],
      wmPickingRobotId: '',

      warehouseList: [],
      selectInfo: {
        warehouseIds: [],
        locationIds: [],
        robotModel: ''
      }
    }
  },
  methods: {
    changeStatus(scope) {
      this.$confirm('此操作将更改当前其状态, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      })
        .then(() => {
          const { wmPickingRobotId, activatedFlag } = scope

          this.$api['warehouse/WmPickingRobotActiveSet']({
            wmPickingRobotId,
            activatedFlag: activatedFlag ? 0 : 1
          }).then(res => {
            this.coincident(res.msg)
          })
        })
        .catch(() => {
          return false
        })
    },
    closeDialog(title) {
      if (title == '查看库位') {
        this.$refs.page.getList()
      }
    },
    lookStorehouse(wmPickingRobotId, wmWarehouseId) {
      this.$refs.page.$dialog({
        visible: true,
        title: '查看库位',
        display: false,
        width: '660px',
        component: () => import('./lookStorehouse'),
        fnName: 'getCurrentInfo',
        params: {
          wmPickingRobotId,
          wmWarehouseId
        }
      })
    },
    search() {
      this.$refs.page.searchInfo = { ...this.selectInfo }
      this.$refs.page.getList('search')
    },
    searchData(val) {
      return val
    },
    selectChange(val) {
      this.wmPickingRobotIds = val.map(item => item.wmPickingRobotId)
    },
    submitForm(val, title) {
      switch (title) {
        case '添加拣货机':
          this.add(val)
          break
        case '编辑拣货机':
          this.editSave(val)
          break
        default:
          break
      }
    },
    checkedDel(params) {
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api['warehouse/WmPickingRobotDelete'](params).then(res => {
            this.coincident(res.msg)
          })
        })
        .catch(() => {
          return false
        })
    },
    del(wmPickingRobotId) {
      this.checkedDel({
        wmPickingRobotIds: Array.of(wmPickingRobotId)
      })
    },
    //edit
    edit(wmPickingRobotId) {
      this.wmPickingRobotId = wmPickingRobotId
      this.$refs.page.$dialog({
        visible: true,
        title: '编辑拣货机',
        confirmButtonText: '确认编辑',
        width: '650px',
        component: () => import('./addEdit'),
        fnName: 'edit',
        params: wmPickingRobotId
      })
    },
    editSave(val) {
      this.$api['warehouse/WmPickingRobotUpdate']({
        ...val,
        wmPickingRobotId: this.wmPickingRobotId
      }).then(res => {
        this.coincident(res.msg)
      })
    },
    //添加
    add(val) {
      this.$api['warehouse/WmPickingRobotCreate'](val).then(res => {
        this.coincident(res.msg)
      })
    },
    ...mapActions(['getWarehouseList'])
  },
  components: {
    TableSelect
  },
  created() {
    this.getWarehouseList(1).then(data => {
      this.searchConfig[0].children = data
      this.warehouseList = data
    })
  }
}
</script>
<style lang="scss">
.status_icon {
  font-size: 24px;
  cursor: pointer;
  transition: all 0.5s;
  &:hover {
    transform: scale(1.5, 1.5);
  }
}
.success {
  color: #67c23a;
}
.danger {
  color: #f56c6c;
}
.searchform {
  .el-form-item {
    margin-bottom: 0;
  }
}
</style>