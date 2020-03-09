<template>
  <!-- 礼品发策略 -->
  <div class>
    <universal-layout
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :btnList="btnList"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
    >
      <template slot="search">
        <search :searchList="searchList" @search="search"></search>
      </template>
      <template slot="table">
        <yt-table :data="tableList" :columns="columns" :border="true" @handleSelectionChange="handleSelectionChange">
          <el-table-column label="操作" width="180" align="center" slot="right">
            <template slot-scope="scope">
              <el-button type="text" @click="edit(scope.row.orderStrategyGiftId)">编辑</el-button>
              <el-button type="text" @click="copy(scope.row.orderStrategyGiftId)">复制添加</el-button>
              <el-button type="text" @click="isDel(scope.row.orderStrategyGiftId)">删除</el-button>
            </template>
          </el-table-column>
        </yt-table>
      </template>
    </universal-layout>
    <!--  -->
    <el-dialog :title="dialog.title" :visible.sync="dialog.visible" @open="handleOpen" width="1200px" top="5vh" center>
      <div class="formcontent">
        <add-edit ref="add_edit"/>
      </div>

      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.visible = false">取 消</el-button>
        <el-button type="primary" @click="handleSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
/* eslint-disable */
import addEdit from './addEdit'
export default {
  data() {
    let vm = this
    return {
      editMode: false,
      searchList: [
        {
          placeholder: '计划名称',
          value: 'strategyName',
          type: 'input'
        },
        {
          label: '激活状态',
          value: 'state',
          type: 'select',
          style: {
            width: '100px'
          },
          children: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ]
        },
        {
          label: '添加时间',
          value: 'time',
          type: 'time'
        }
      ],

      tableList: [],
      columns: [
        {
          value: 'strategyName',
          label: '计划名称'
        },
        {
          value: 'startTime',
          label: '计划开始时间'
        },
        {
          value: 'endTime',
          label: '计划结束时间'
        },
        {
          value: 'stateName',
          label: '状态',
          render(h, scope) {
            return scope.row.state === 1 ? (
              <i
                style={{ color: '#67C23A', fontSize: '24px' }}
                class="el-icon-check"
              />
            ) : (
              <i
                style={{ color: '#F56C6C', fontSize: '24px' }}
                class="el-icon-close"
              />
            )
          }
        },
        {
          value: 'priority',
          label: '优先级'
        },
        {
          value: 'createTime',
          label: '添加时间'
        }
      ],
      pageSize: 10,
      pageNo: 1,
      total: 0,
      searchInfo: {},
      orderStrategyGiftIds: [],
      dialog: {
        title: null,
        visible: false
      },
      btnList: [
        {
          name: '添 加',
          fn() {
            vm.dialog.title = '添加礼品发货备注策略'
            vm.editMode = false
            setTimeout(() => {
              vm.$refs.add_edit.reset()
            })
            vm.dialog.visible = true
          }
        },
        {
          name: '批量删除',
          fn() {
            if (vm.orderStrategyGiftIds.length) {
              vm.del(vm.orderStrategyGiftIds)
            } else {
              vm.$message.warning('请选择需要删除的数据')
            }
          }
        }
      ]
    }
  },
  methods: {
    handleOpen() {
      // 弹窗激活后重置滚动条位置
      this.$nextTick(() => {
        this.$refs.add_edit.scrollToTop()
      })
    },
    handleSave() {
      if (!this.$refs.add_edit.isEdit() && !this.editMode) {
        this.$message.warning('您复制的策略没有修改参数，请修改后再尝试提交')
        return
      }
      let data = {},
        _data = JSON.parse(JSON.stringify(this.$refs.add_edit.formData.expand)),
        { baseInfoForm, giftRemark, state } = this.$refs.add_edit,
        { time, ...base } = baseInfoForm,
        [startTime, endTime] = time

      for (const key in _data) {
        if (_data.hasOwnProperty(key)) {
          const element = _data[key]
          if (Array.isArray(element)) {
            _data[key] = element.join(',')
          }
        }
      }
      let {
        storeSku,
        platformSku,
        warehouseSku,
        createOrderReason,
        // customSkuPrefix,
        // customSkuSuffix,
        // productNameContain,
        // storeSkuCharContain,
        ...orderStrategyExpandEntity
      } = _data

      data = {
        storeSku,
        platformSku,
        warehouseSku,
        createOrderReason,
        // customSkuPrefix,
        // customSkuSuffix,
        // productNameContain,
        // storeSkuCharContain,
        orderStrategyExpandEntity,
        ...base,
        startTime,
        endTime,
        giftRemark,
        state
      }

      this.$api[
        this.editMode ? 'order/strategyGiftUpdate' : 'order/strategyGiftSavey'
      ](data)
        .then(data => {
          this.dialog.visible = false
          this.getList()
        })
        .catch(err => {})
    },
    edit(orderStrategyGiftId) {
      this.dialog.title = '编辑礼品发货备注策略'
      this.editMode = true
      this.getEditData(orderStrategyGiftId)
      this.dialog.visible = true
    },
    copy(orderStrategyGiftId) {
      // this.http('strategyGiftCopy', { orderStrategyGiftId }, data => {
      //   this.getList()
      // })
      this.dialog.title = '复制礼品发货备注策略'
      this.editMode = false
      this.getEditData(orderStrategyGiftId)
      this.dialog.visible = true
    },
    isDel(orderStrategyGiftId) {
      this.$confirm('此操作将永久删除该策略, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let params = Array.of(orderStrategyGiftId)
          this.del(params)
        })
        .catch(() => {
          return false
        })
    },
    del(orderStrategyGiftIds) {
      this.http('strategyGiftRemove', { orderStrategyGiftIds }, res => {
        this.getList()
        this.$message.success(res.msg)
      })
    },
    getEditData(orderStrategyGiftId) {
      let arrs = ['createOrderReason']
      this.http('strategyGiftInfo', { orderStrategyGiftId }, data => {
        let { rows } = data
        for (const key in rows) {
          if (rows.hasOwnProperty(key)) {
            const element = rows[key]
            if (element == null) {
              delete rows[key]
              continue
            }
            if (arrs.indexOf(key) > -1 && element) {
              rows[key] = element.split(',').map(el => +el)
            }
          }
        }
        let {
            state,
            giftRemark,
            strategyName,
            priority,
            startTime,
            endTime,
            orderStrategyGiftId,
            ...orderStrategyExpandEntity
          } = rows,
          baseInfoForm = { orderStrategyGiftId }

        baseInfoForm.time = [startTime, endTime]
        baseInfoForm.strategyName = strategyName
        baseInfoForm.priority = priority

        this.$refs.add_edit.setEditData({
          baseInfoForm,
          expand: orderStrategyExpandEntity || {},
          state: state ? +state : 0,
          giftRemark
        })
      })
    },
    getList(val) {
      let params = {
        sortOrder: 'asc',
        pageSize: this.pageSize,
        pageNumber: this.pageNo
      }
      if (val == 'search') {
        let { time, ...info } = this.searchInfo
        let startTime, endTime
        if (time) {
          ;[startTime, endTime] = time
        }
        params = { ...params, ...info, startTime, endTime }
      }
      params = this.$.dealObjectValue(params)
      this.http('strategyGiftList', params, res => {
        this.tableList = res.rows
        this.pageSize = res.pageSize
        this.pageNo = res.pageNo
        this.total = res.total
      })
    },
    handleSelectionChange(val) {
      this.orderStrategyGiftIds = val.map(item => item.orderStrategyGiftId)
    },
    search(val) {
      this.searchInfo = val
      this.getList('search')
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList('search')
    },
    http(url, params, callback) {
      this.loading = true
      this.$api[`order/${url}`](params).then(res => {
        callback && callback(res)
      })
    }
  },
  components: {
    addEdit
  }
}
</script>

<style lang="scss">
.formcontent {
  height: 680px;
  overflow-y: auto;
  padding-right: 10px;
}
</style>
