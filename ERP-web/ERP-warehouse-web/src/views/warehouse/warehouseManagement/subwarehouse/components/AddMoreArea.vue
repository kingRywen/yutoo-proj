<template>
  <div>
    <el-form :model="addList" ref="form" size="small">
      <el-table :data="addData">
        <ElTableColumn label="区域名称">
          <template slot-scope="scope">
            <ElFormItem label-width="0" :prop="`data.${scope.$index}.divisionName`" :rules="getRules('区域名称')">
              <el-input v-model="addData[scope.$index].divisionName"></el-input>
            </ElFormItem>
          </template>
        </ElTableColumn>
        <ElTableColumn label="长 (米)">
          <template slot-scope="scope">
            <ElFormItem label-width="0" :prop="`data.${scope.$index}.divisionLength`" :rules="getRules('长')">
              <el-input-number controls-position="right" :min="0.01" v-model="addData[scope.$index].divisionLength"></el-input-number>
            </ElFormItem>
          </template>
        </ElTableColumn>
        <ElTableColumn label="宽 (米)">
          <template slot-scope="scope">
            <ElFormItem label-width="0" :prop="`data.${scope.$index}.divisionWidth`" :rules="getRules('宽')">
              <el-input-number controls-position="right" :min="0.01" v-model="addData[scope.$index].divisionWidth"></el-input-number>
            </ElFormItem>
          </template>
        </ElTableColumn>
        <ElTableColumn label="高 (米)">
          <template slot-scope="scope">
            <ElFormItem label-width="0" :prop="`data.${scope.$index}.divisionHigh`" :rules="getRules('高')">
              <el-input-number controls-position="right" :min="0.01" v-model="addData[scope.$index].divisionHigh"></el-input-number>
            </ElFormItem>
          </template>
        </ElTableColumn>
        <ElTableColumn width="65" v-if="showIcon">
          <template slot-scope="scope">
            <el-button type="text" @click="handleAdd(scope)" icon="el-icon-plus" style="margin-bottom:18px"></el-button>
            <el-button
              type="text"
              @click="handleMinus(scope)"
              v-if="addData.length !==1"
              icon="el-icon-minus"
              style="margin-bottom:18px"
            ></el-button>
          </template>
        </ElTableColumn>
      </el-table>
    </el-form>
    <div class="flex mt20">
      <span>是否按照系统推荐布局库位： </span>
      <ElSwitch
        v-model="recommond"
        active-text="是"
        inactive-text="否"
        :active-value="1"
        :inactive-value="0"
      ></ElSwitch>
    </div>

    <div class="mt20 txc">
      <el-button type="primary" @click="handleAddSave">确认</el-button>
      <el-button @click="$emit('close')">取消</el-button>
    </div>
    <!-- <div class="txc mt20">
      <el-button type="primary" size="small">确认添加</el-button>
    </div>-->
  </div>
</template>

<script>
/* eslint-disable */
export default {
  props: ['warehouseId'],
  data() {
    let vm = this
    return {
      recommond: 0,
      wmWarehouseId: null,
      showIcon: true,
      addOpts: {
        visible: false,
        title: '添加分区',
        width: '800px',
        appendToBody: true
      },
      addData: [
        {
          divisionName: '',
          divisionLength: undefined,
          divisionWidth: undefined,
          divisionHigh: undefined
        }
      ],
      addEvents: {
        // 分区编辑新增
        close() {
          vm.addData = [
            {
              divisionName: '',
              divisionLength: undefined,
              divisionWidth: undefined,
              divisionHigh: undefined
            }
          ]
          vm.$refs.form.resetFields()
          vm.showIcon = true
          vm.addOpts.title = '新增分区'
        }
      },

      options: {
        search: [
          {
            label: '区域名称',
            type: 'input',
            value: 'name'
          }
        ],
        table: {
          columns: [
            {
              value: 'divisionName',
              label: '区域名称'
            },
            {
              value: 'divisionLength',
              label: '长'
            },
            {
              value: 'divisionWidth',
              label: '宽'
            },
            {
              value: 'divisionHigh',
              label: '高'
            }
          ],
          maxHeight: 500,
          border: true,
          // 选择函数，返回true则设置当前项选中
          // eslint-disable-next-line
          selectableFunc: (row, index) => {
            return true
          },
          reserveSelection: null
        }
      },
      params: {
        rowKey: 'wmWarehouseDivisionId'
      },
      areaName: ''
    }
  },

  methods: {
    edit(row) {
      row = JSON.parse(JSON.stringify(row))
      this.addOpts.visible = true
      this.addData = Array.isArray(row)
        ? row.map(el => ({ ...el, id: el.wmWarehouseDivisionId }))
        : [{ ...row, id: row.wmWarehouseDivisionId }]
      this.addOpts.title = '编辑分区'
      this.showIcon = false
    },
    del(row) {
      this.$confirm('是否删除区域？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api[`warehouse/wmWarehouseDivisionDelete`]({
            wmWarehouseId: this.wmWarehouseId,
            ids: [row.wmWarehouseDivisionId]
          })
            .then(data => {
              this._initData()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    handleAddSave() {
      this.$refs.form.validate(valid => {
        let isEdit = this.addOpts.title === '编辑分区'
        if (valid) {
          let api = isEdit
            ? `wmWarehouseDivisionUpdate`
            : `wmWarehouseDivisionCreate`
          this.$api[`warehouse/${api}`]({
            wmWarehouseId: this.wmWarehouseId || this.warehouseId,
            list: this.addData
          })
            .then(() => {
              // this.addOpts.visible = false
              this.$emit('close')
              this._initData(!isEdit)
            })
            .catch(() => {})
        }
      })
    },
    _initData(reset) {
      this.$refs.table.getData({ wmWarehouseId: this.wmWarehouseId }, reset)
    },
    getRules(name) {
      return [
        {
          required: true,
          message: `请输入${name}`
        }
      ]
    },

    handleAdd(scope) {
      this.addData.splice(scope.$index + 1, 0, {
        divisionName: '',
        divisionLength: undefined,
        divisionWidth: undefined,
        divisionHigh: undefined
      })
    },
    handleMinus(scope) {
      this.addData.splice(scope.$index, 1)
    }
  },
  computed: {
    addList() {
      return {
        data: this.addData
      }
    },
    id() {
      return this.warehouseId || this.wmWarehouseId
    }
  }
}
</script>

<style>
</style>
