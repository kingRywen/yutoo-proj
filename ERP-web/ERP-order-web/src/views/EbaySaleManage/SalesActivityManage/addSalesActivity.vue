<template>
  <div class="add-sales-acitivity">
    <ElForm :model="form" ref="form" size="small" :rules="rules" label-width="100px">
      <ElFormItem label="规则名称:" prop="name">
        <el-input v-model="form.name" placeholder class="normal-input"></el-input>
      </ElFormItem>
      <ElFormItem label="来源店铺:" prop="storeId">
        <el-cascader :options="ebayStoreList" v-model="form.storeId" style="width: 460px;"></el-cascader>
      </ElFormItem>
      <ElFormItem label="活动规则:">
        <!-- <el-checkbox-group v-model="form.freeShippingFlag">
          <el-checkbox :label="0">免邮费</el-checkbox>
          <el-checkbox :label="1">价格折扣</el-checkbox>
        </el-checkbox-group>-->
        <el-checkbox v-model="form.freeShippingFlag" :true-label="1" :false-label="0">免邮费</el-checkbox>
        <el-checkbox v-model="form.priceDiscountFlag" :true-label="1" :false-label="0">价格折扣</el-checkbox>
        <div></div>
        <ElRow v-if="form.priceDiscountFlag">
          <ElCol :span="24">
            <el-radio-group v-model="form.subtractType">
              <el-radio :label="1">
                原价基础上减去
                <el-input-number
                  v-model="form.subtractValue"
                  :min="0"
                  :max="100"
                  style="width: 60px;"
                  :controls="false"
                ></el-input-number>%,（例如：填入10%，相当于现价为原价的90%，以此类推）
              </el-radio>
              <br>
              <el-radio :label="2">
                原价基础上减去金额
                <el-input-number
                  v-model="form.discardedCaseCount"
                  :min="0"
                  :max="100"
                  style="width: 60px;"
                  :controls="false"
                ></el-input-number>（例如：填入10%，相当于现价为原价的90%，以此类推）
              </el-radio>
            </el-radio-group>
          </ElCol>
        </ElRow>
      </ElFormItem>
      <ElFormItem label="活动起止时间:" prop="time">
        <el-date-picker
          v-model="form.time"
          value-format="yyyy-MM-dd HH:mm:ss"
          type="datetimerange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :default-time="['12:00:00']"
          class="normal-input"
        ></el-date-picker>
      </ElFormItem>
      <ElFormItem label="活动备注:" prop="remark">
        <el-input v-model="form.remark" type="textarea" placeholder class="normal-input"></el-input>
      </ElFormItem>
    </ElForm>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      rules: vm.$formValidate([
        {
          label: '规则名称',
          value: 'name'
        },
        {
          label: '来源店铺',
          value: 'storeId'
        },
        {
          label: '活动起止时间',
          value: 'time'
        },
        {
          label: '来源店铺',
          value: 'storeId'
        }
      ]),
      form: {
        time: [],
        priceDiscountFlag: 0,
        radio: 0,
        freeShippingFlag: 0,
        discardedCaseCount: 0,
        subtractValue: 0,
        subtractType: 0
      }
    }
  },
  watch: {
    'form.priceDiscountFlag'(val) {
      if (val == 0) {
        this.form.subtractType = 0
        this.form.subtractValue = 0
        this.form.discardedCaseCount = 0
      }
    }
  },
  computed: {
    ...mapState('common', ['ebayStoreList'])
  },
  methods: {
    ...mapActions('common', ['getAllShopList']),
    edit(params) {
      let vm = this
      return vm.$api[`order/salesPromotionInfo`](params).then(({ rows }) => {
        let _data = vm.$clone(rows)
        if (_data.startTime && _data.endTime) {
          _data.time = [_data.startTime, _data.endTime]
          delete _data.startTime
          delete _data.endTime
        }

        _data.storeId = this.getIdTree(vm.ebayStoreList, _data.storeId)
        _data.subtractValue || (_data.subtractValue = 0)
        _data.discardedCaseCount || (_data.discardedCaseCount = 0)
        vm.form = _data
        return Promise.resolve()
      })
    },
    getIdTree(treeArr, id) {
      let idTree = []
      let flag = false
      if (treeArr && Array.isArray(treeArr)) {
        if (id == null || id == undefined) {
          return treeArr[treeArr.length - 1]
        }
        treeArr.find(item => {
          idTree.push(item.value)
          if (item.children && Array.isArray(item.children)) {
            item.children.find(el => {
              if (el.value == id) {
                idTree.push(el.value)
                return (flag = true)
              }
            })
          }
          !flag && (idTree = [])
          return flag
        })
      }
      return idTree
    },
    submitForm(cb) {
      let vm = this
      let _data = vm.$clone(vm.form)
      vm.$refs['form'].validate(valid => {
        if (valid) {
          if (vm.$.dataType(_data.time) === 'Array' && _data.time.length) {
            _data.startTime = _data.time[0]
            _data.endTime = _data.time[1]
            delete _data.time
          }
          _data.storeId = vm.getIdTree(_data.storeId)
          cb && cb(_data)
        } else {
          console.log('error')
        }
      })
    },
    resetForm() {}
  }
}
</script>

<style lang='scss'>
.add-sales-acitivity {
  background: #fff;
  .normal-input {
    width: 460px;
  }
}
</style>