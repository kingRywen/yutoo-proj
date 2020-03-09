<template>
  <div class="add">
    <el-form ref="form" :model="form" :rules="rules" :inline="true" label-width="230px">
      <el-form-item label="申报名称:" prop="declareName">
        <el-input v-model="form.declareName" size="small" class="normal-input"></el-input>
      </el-form-item>
      <el-form-item label="包裹包含多SKU时选择申报的货品信息:" prop="choiceDeclareType">
        <el-select size="small" v-model="form.choiceDeclareType" placeholder class="normal-input">
          <el-option label="按照货品成本单价由高到低顺序选择" :value="1"></el-option>
          <el-option label="按照货品成本单价*数量由高到低顺序选择" :value="2"></el-option>
          <el-option label="按照货品单品体积由大到小顺序选择" :value="3"></el-option>
          <el-option label="按照货品单品体积*数量由大到小顺序选择" :value="4"></el-option>
          <el-option label="按照货品单品重量由大到小顺序选择" :value="5"></el-option>
          <el-option label="按照货品单品重量*数量由大到小顺序选择" :value="6"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申报重量的比例:" prop="declareWeightExit">
        出口
        <el-input v-model="form.declareWeightExit" size="small" class="small-input"></el-input>%
      </el-form-item>
      <ElFormItem label="清关" label-width="36px" prop="declareWeightClearance">
        <el-input v-model="form.declareWeightClearance" size="small" class="small-input"></el-input>%
      </ElFormItem>
      <el-form-item label="申报价格比例:" prop="declarePriceExit">
        出口
        <el-input v-model="form.declarePriceExit" size="small" class="small-input"></el-input>%
      </el-form-item>
      <ElFormItem label="清关" label-width="36px" prop="declarePriceClearance">
        <el-input v-model="form.declarePriceClearance" size="small" class="small-input"></el-input>%
      </ElFormItem>
      <el-form-item prop="activateFlag" label-width="24px">
        <el-checkbox :true-label="1" :false-label="0" class="isChecked" v-model="form.activateFlag">是否激活</el-checkbox>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      form: {
        activateFlag: 0
      },
      rules: vm.$formValidate([
        {
          label: '申报名称',
          value: 'declareName'
        },
        {
          label: '申报的货品信息',
          value: 'choiceDeclareType'
        },
        {
          label: '申报重量出口',
          value: 'declareWeightExit',
          required: false,
          type: 'number'
        },
        {
          label: '申报重量清关',
          value: 'declareWeightClearance',
          required: false,
          type: 'number'
        },
        {
          label: '申报价格出口',
          value: 'declarePriceExit',
          required: false,
          type: 'number'
        },
        {
          label: '申报价格清关',
          value: 'declarePriceClearance',
          required: false,
          type: 'number'
        }
      ])
    }
  },
  methods: {
    edit(params) {
      let vm = this
      vm.$api['warehouse/declareInfo'](params)
        .then(({ rows }) => {
          vm.form = rows
          vm.$emit('loading')
        })
        .catch(() => {
          vm.$emit('loading')
        })
    },
    submitForm(cb) {
      let data = JSON.parse(JSON.stringify(this.form))
      this.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(data)
        } else {
          return false
        }
      })
    },
    resetForm() {}
  }
}
</script>

<style lang="scss">
.add {
  background: #fff;
  .el-form-item__label {
    text-align: left;
  }
  .small-input {
    width: 194px;
  }
  .normal-input {
    width: 500px;
  }
}
</style>
