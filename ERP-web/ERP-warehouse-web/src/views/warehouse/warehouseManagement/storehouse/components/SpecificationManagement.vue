<template>
  <div>
    <YtTableSelect ref="table" :options="options" :params="params" url="warehouse/wmLocationNormList">
      <yt-dialog :options="addOpts" :events="addEvents" slot="add" name="添加">
        <el-form :model="addData" ref="form" size="small" label-width="80px" :rules="rules">
          <el-form-item label="规格名称" prop="normName">
            <el-input v-model="addData.normName"></el-input>
          </el-form-item>
          <el-form-item label="尺寸单位" prop="sizeUnitId">
            <el-select v-model="addData.sizeUnitId" class="per100">
              <ElOption v-for="item in unitList" :key="item.value" :label="item.label" :value="item.value"></ElOption>
            </el-select>
          </el-form-item>
          <el-form-item label="X" prop="valueX">
            <el-input-number
              :min="0.01"
              :max="99999999999"
              class="per100"
              controls-position="right"
              v-model="addData.valueX"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="Y" prop="valueY">
            <el-input-number
              :min="0.01"
              :max="99999999999"
              class="per100"
              controls-position="right"
              v-model="addData.valueY"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="Z" prop="valueZ">
            <el-input-number
              :min="0.01"
              :max="99999999999"
              class="per100"
              controls-position="right"
              v-model="addData.valueZ"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="备注" prop="normDesc">
            <el-input v-model="addData.normDesc" type="textarea" :rows="5"></el-input>
          </el-form-item>
          <el-form-item label="是否启用" prop="activatedFlag">
            <el-switch v-model="addData.activatedFlag" :active-value="1" :inactive-value="0"></el-switch>
          </el-form-item>
        </el-form>
        <div class="mt20 txc">
          <el-button type="primary" @click="handleAddSave">确认添加</el-button>
        </div>
      </yt-dialog>
      <div slot="del" uid="wmLocationNormId" uids="ids" url="warehouse/wmLocationNormDelete" name="删除"></div>
      <template slot="right" slot-scope="scope">
        <el-button type="text" @click="edit(scope.row)">编辑</el-button>
        <el-button type="text" @click="del(scope.row)">删除</el-button>
      </template>
    </YtTableSelect>
  </div>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    let vm = this
    return {
      rules: {
        normName: vm.getRules('规格名称'),
        valueX: vm.getRules('长'),
        valueY: vm.getRules('宽'),
        valueZ: vm.getRules('高'),
        sizeUnitId: vm.getRules('单位')
      },
      unitList: vm.$const['WAREHOUSE/locationUnit'],
      addOpts: {
        visible: false,
        title: '添加库位规格',
        width: '480px',
        appendToBody: true
      },
      addData: {
        normName: '',
        normDesc: '',
        activatedFlag: 0,
        valueX: undefined,
        valueY: undefined,
        valueZ: undefined,
        sizeUnitId: null
      },
      addEvents: {
        // 分区编辑新增
        close() {
          vm.addData = {
            normName: '',
            normDesc: '',
            activatedFlag: 0,
            valueX: undefined,
            valueY: undefined,
            valueZ: undefined,
            sizeUnitId: null
          }
          vm.$refs.form.resetFields()
          vm.showIcon = true
          vm.addOpts.title = '新增库位规格'
        },

        handleOpen() {}
      },

      options: {
        table: {
          columns: [
            {
              value: 'normName',
              label: '规格名称'
            },
            {
              value: 'valueX',
              label: '规格尺寸',
              minWidth: 200,
              render(h, scope) {
                let { valueX, valueY, valueZ, sizeUnitString } = scope.row
                return (
                  <span>
                    X:{valueX + sizeUnitString}; Y:{valueY + sizeUnitString}; Z:
                    {valueZ + sizeUnitString}
                  </span>
                )
              }
            },
            {
              value: 'normDesc',
              label: '备注',
              showOverflowTooltip: true
            },
            {
              value: 'activatedFlag',
              label: '状态',
              render: (h, scope) => {
                const { activatedFlag, sizeUnit } = scope.row
                return (
                  <el-button
                    type="text"
                    class="__table-btn"
                    icon={activatedFlag ? `el-icon-check` : `el-icon-close`}
                    on-click={() => {
                      let { locationStatus, ...info } = scope.row
                      let params = {
                        ...scope.row,
                        activatedFlag: activatedFlag ? 0 : 1,
                        sizeUnitId: sizeUnit
                      }
                      vm.$api[`warehouse/wmLocationNormUpdate`](params)
                        .then(() => {
                          vm.$refs.table.getData(false)
                        })
                        .catch(() => {})
                    }}
                  />
                )
              }
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
        rowKey: 'wmLocationNormId'
      },
      areaName: ''
    }
  },
  methods: {
    edit(row) {
      row = JSON.parse(JSON.stringify(row))
      let { sizeUnit } = row
      this.addOpts.visible = true
      this.addData = { ...row, sizeUnitId: sizeUnit }
      this.addOpts.title = '编辑库位规格'
      this.showIcon = false
    },
    del(row) {
      this.$confirm('是否删除区域？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$api[`warehouse/wmLocationNormDelete`]({
            ids: [row.wmLocationNormId]
          })
            .then(() => {
              this._initData()
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    handleAddSave() {
      this.$refs.form.validate(valid => {
        let isEdit = this.addOpts.title === '编辑库位规格'
        if (valid) {
          let api = isEdit ? `wmLocationNormUpdate` : `wmLocationNormCreate`
          this.$api[`warehouse/${api}`](this.addData)
            .then(() => {
              this.addOpts.visible = false
              this._initData(!isEdit)
            })
            .catch(() => {})
        }
      })
    },
    _initData(reset) {
      // debugger
      this.$refs.table.getData({}, reset)
    },
    getRules(name) {
      return [
        {
          required: true,
          message: `请输入${name}`
        }
      ]
    }
  }
}
</script>

<style>
</style>
