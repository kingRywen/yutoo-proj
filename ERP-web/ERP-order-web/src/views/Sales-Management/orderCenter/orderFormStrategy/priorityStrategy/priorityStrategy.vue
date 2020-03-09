<template lang="html">
    <!-- 优先策略 -->
    <el-form :model="form" ref="form" label-width="180px" class="priorityStrategy">
        <div class="btnbox">
            <el-button type="primary" @click="submitForm('form')" size="small">
               <i class="el-icon-edit"></i> {{disabled ?'编 辑':'保 存'}}
            </el-button>
            <!-- <el-button @click="resetForm('form')" size="small">重 置</el-button> -->
        </div>

        <el-form-item label="订购产品包含店铺SKU：" prop="storeSku" :rules="!isOne ? [{message: '请填写店铺SKU', trigger: 'blur', required:true}] : null">
            <el-input type="textarea" v-model="form.storeSku" class="textarea" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="订购产品包含平台SKU：" prop="platformSku" :rules="!isOne ? [{message: '请填写平台SKU', trigger: 'blur', required:true}] : null">
            <el-input type="textarea" v-model="form.platformSku" class="textarea" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="订购产品包含仓库SKU：" prop="warehouseSku" :rules="!isOne ? [{message: '请填写仓库SKU', trigger: 'blur', required:true}] : null">
            <el-input type="textarea" v-model="form.warehouseSku" class="textarea" :disabled="disabled"></el-input>
        </el-form-item>
        <el-form-item label="订购产品包含客户ID：" prop="customerId" :rules="!isOne ? [{message: '请填写客户ID', trigger: 'blur', required:true}] : null">
            <el-input type="textarea" v-model="form.customerId" class="textarea" :disabled="disabled"></el-input>
        </el-form-item>


        <el-form-item style="color: #409EFF;">满足以上任意条件，订单优先发货</el-form-item>
    </el-form>
</template>

<script>
/* eslint-disable */
export default {
  props: {
    info: Object
  },
  data() {
    return {
      form: {
        storeSku: null,
        platformSku: null,
        warehouseSku: null,
        customerId: null
      },
      rules: {
        storeSku: [{ message: '请填写店铺SKU', trigger: 'blur' }],
        platformSku: [{ message: '请填写平台SKU', trigger: 'blur' }],
        warehouseSku: [{ message: '请填写仓库SKU', trigger: 'blur' }],
        merchantId: [{ message: '请填写客户ID', trigger: 'blur' }]
      },
      disabled: true
    }
  },
  watch: {
    info: {
      handler(val) {
        for (let k in this.form) {
          for (let j in val) {
            if (k == j) {
              this.form[k] = val[j]
            }
          }
        }
      },
      immediate: true,
      deep: true
    },
    isOne() {
      if (this.$refs.form) {
        this.$refs.form.clearValidate()
      }
    }
  },
  computed: {
    isOne() {
      let {
        storeSku,
        platformSku,
        warehouseSku,
        merchantId,
        customerId
      } = this.form
      let isNotNull = str => str != null && str !== ''
      return (
        isNotNull(storeSku) ||
        isNotNull(platformSku) ||
        isNotNull(warehouseSku) ||
        isNotNull(customerId)
      )
    }
  },
  methods: {
    submitForm(formName) {
      this.disabled = !this.disabled
      this.$refs[formName].validate(valid => {
        if (valid && this.disabled) {
          this.$emit('save', this.form)
        } else {
          this.disabled = false
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>

<style lang="scss">
.priorityStrategy {
  padding: 10px 200px 10px 50px;
  .btnbox {
    text-align: right;
    margin-bottom: 10px;
  }
  .textarea {
    textarea {
      height: 128px;
      resize: none;
    }
  }
}
</style>
