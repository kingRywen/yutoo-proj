<template>
  <div ref="content">
    <SimpleForm :fields="baseInfoFields" :form-data.sync="baseInfoForm" label-width="110px" ref="baseInfoForm"/>

    <ConditionsForm :form-data="formData" type="giftStragy" class="mb20" ref="conditionsForm"/>
    <el-button icon="el-icon-plus" class="add_condition mb20" @click="handleConditionAdd"></el-button>

    <div class="condition mb20">满足以上任意条件，订单则</div>
    <el-form>
      <el-form-item label="发送礼品备注" label-width="100px">
        <el-input v-model="giftRemark" placeholder="发送礼品备注" type="textarea" rows="6"></el-input>
      </el-form-item>
      <el-form-item label label-width="100px">
        <el-checkbox v-model="state" label="是否激活" :true-label="1" :false-label="0"></el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import ConditionsForm from '../shipmentsStrategy/components/ConditionsForm'
import _isEqual from 'lodash/isEqual'

export default {
  components: {
    ConditionsForm
  },
  data() {
    return {
      giftRemark: undefined,
      state: undefined,
      baseInfoForm: {},
      formData: {
        expand: {}
      },
      oldData: {}
    }
  },
  methods: {
    scrollToTop() {
      let parentWrapper = this.$refs.content.parentNode
      parentWrapper.scrollTop = 0
    },
    reset() {
      this.formData = {
        expand: {}
      }
    },
    setEditData({ baseInfoForm, expand, state, giftRemark }) {
      this.formData = {
        expand: {}
      }
      let arr = [
        'riskTypeNonContain',
        'riskTypeContain',
        'logisticTypeNonContain',
        'logisticTypeContain',
        'productPlugSpec'
      ]
      for (const key in expand) {
        if (expand.hasOwnProperty(key)) {
          const element = expand[key]
          if (arr.indexOf(key) > -1) {
            expand[key] = element.split(',').map(el => +el)
          }
        }
      }
      this.baseInfoForm = baseInfoForm
      if (!expand.createOrderReason) {
        expand.createOrderReason = []
      }
      this.formData = {
        expand
      }

      this.giftRemark = giftRemark
      this.state = state
      let oldData = JSON.parse(JSON.stringify(this.$data))
      delete oldData.oldData
      this.oldData = oldData
    },
    isEdit() {
      if (this.baseInfoForm.orderStrategyGiftId == null) {
        return true
      } else {
        let newData = {
          baseInfoForm: this.baseInfoForm,
          formData: this.formData,
          giftRemark: this.giftRemark,
          state: this.state
        }
        newData = JSON.parse(JSON.stringify(newData))
        if (_isEqual(this.oldData, newData)) {
          return false
        } else {
          return true
        }
      }
    },
    handleConditionAdd() {
      this.$refs.conditionsForm.setCondition()
      //   this.formData.push({
      //     expand: {}
      //   })
    },
    handleMinus(index) {
      this.formData.splice(index, 1)
    }
  },
  computed: {
    baseInfoFields() {
      // eslint-disable-next-line
      let vm = this
      return [
        {
          label: '策略名称',
          name: 'strategyName',
          required: true,
          span: 6
        },
        {
          label: '有效期',
          name: 'time',
          type: 'datetimerange',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now()
            }
          },
          required: true,
          // format: 'yyyy-MM-dd',
          span: 7
        },
        {
          label: '优先级',
          name: 'priority',
          type: 'select',
          required: true,
          span: 5,
          options: [
            { label: 1, value: 1 },
            { label: 2, value: 2 },
            { label: 3, value: 3 },
            { label: 4, value: 4 },
            { label: 5, value: 5 },
            { label: 6, value: 6 },
            { label: 7, value: 7 },
            { label: 8, value: 8 },
            { label: 9, value: 9 },
            { label: 10, value: 10 }
          ]
        }
      ]
    }
  }
}
</script>
<style lang="scss">
.add_condition.el-button {
  padding: 4px;
  border-radius: 0;
  border: 1px solid #0e80d2;
  color: #0e80d2;
  font-weight: bolder;
}
</style>
<style lang="scss" scoped>
.condition {
  background: #f5f7fa;
  color: blue;
  padding: 10px;
}
</style>

