<template>
  <div style="padding: 0 10px;
    overflow-y: auto;
    max-height: 560px;">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small">
      <el-form-item label="仓库：" prop="wmWarehouseId">
        <el-select v-model.number="ruleForm.wmWarehouseId">
          <el-option :label="i.label" :value="i.value" :key="i.label" v-for="i in $store.state.daily.warehouseList"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="拣货机型号：" prop="robotModel">
        <el-input v-model.trim="ruleForm.robotModel"></el-input>
      </el-form-item>
      <el-form-item label="负责库位：" prop="wmLocationIds">
        <region
          :isWarehouse="isWarehouse"
          :wmWarehouseIds="wmWarehouseIds"
          :wmPickingRobotId="wmPickingRobotId"
          @change="changeRegion"
          :checkedList="locationEntities"
          @setData="setData"
          @del="delLocationEntities"
        />
      </el-form-item>
      <el-form-item label="是否启用：">
        <el-checkbox v-model="ruleForm.activatedFlag" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
/* eslint-disable */
import region from '@/views/warehouse/dailyOperation/Inventory/region'
export default {
  components: {
    region
  },
  data() {
    return {
      // wmWarehouseIds: [],
      wmPickingRobotId: undefined,
      ruleForm: {
        wmWarehouseId: '',
        robotModel: '',
        wmLocationIds: [],
        activatedFlag: 0
      },
      rules: {
        wmWarehouseId: [
          {
            required: true,
            message: '请选择仓库',
            trigger: 'change'
          }
        ],
        robotModel: [
          {
            required: true,
            message: '请输入型号,须为英文,数字,-,长度24以内',
            trigger: 'change',
            pattern: /^[A-Za-z0-9][A-Za-z0-9-]{0,24}$/
          }
        ],
        wmLocationIds: [
          {
            required: true,
            message: '请选择库位',
            trigger: 'blur'
          }
        ]
      },
      locationEntities: []
    }
  },
  computed: {
    wmWarehouseIds() {
      return [this.ruleForm.wmWarehouseId]
    }
  },
  methods: {
    edit(wmPickingRobotId) {
      this.wmPickingRobotId =wmPickingRobotId
      this.$api['warehouse/WmPickingRobotInfo']({
        wmPickingRobotId
      }).then(res => {
        let {
          wmWarehouseId,
          robotModel,
          wmLocationIds,
          locationEntities,
          activatedFlag
        } = res.rows
        this.ruleForm.wmWarehouseId = Number(wmWarehouseId)
        this.ruleForm.robotModel = robotModel
        this.ruleForm.wmLocationIds = wmLocationIds
        this.locationEntities = locationEntities
        this.ruleForm.activatedFlag = activatedFlag
        this.getLocation([Number(wmWarehouseId)], wmPickingRobotId)
      }).catch(() => {})
      
    },
    getLocation(wmWarehouseIds, wmPickingRobotId) {
      let params = {wmWarehouseIds, wmPickingRobotId, findType: 1, pageSize: 10000, pageNumber: 1}
      this.$api[`warehouse/WmLocationGlobalList`](params)
      .then(data => {
        this.locationEntities = data.page.rows
      }).catch(() => {})
    },
    delLocationEntities(arr) {
      let nArr = []
      this.locationEntities.forEach((i, index) => {
        let everp = arr.findIndex(j => i.wmLocationId == j)
        if (everp != -1) {
          return
        } else {
          nArr.push(i)
        }
      })
      this.locationEntities = nArr
    },
    setData(val, cb) {
      this.locationEntities = val
      cb()
    },
    changeRegion(val) {
      this.ruleForm.wmLocationIds = [...val]
    },
    isWarehouse() {
      this.$refs.ruleForm.validateField('wmWarehouseId')
      return new Promise((resolve, reject) => {
        if (this.ruleForm.wmWarehouseId) {
          resolve(this.ruleForm.wmWarehouseId)
        } else {
          reject()
        }
      })
    },
    submitForm(cb) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          cb && cb(this.ruleForm)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm() {
      this.$refs.ruleForm.resetFields()
    }
  }
}
</script>
