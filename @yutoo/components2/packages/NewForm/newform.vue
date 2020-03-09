<template>
  <el-form class="new-form" ref="ruleform" size="small" v-if="!isSchemaChange" :model="value">
    <!-- {{dataFormSchema}} -->
    <ElRow :gutter="20">
      <template v-for="(schema, key) in dataFormSchema">
        <ElCol v-if="!schema.hidden(value)" :key="key" :span="schema.span || 24">
          <form-item
            v-bind="$attrs"
            :key="key"
            :disabled="schema.disabled.bind(null, value)"
            v-model="value[key]"
            :field-name="key"
            :schema="schema"
            :model="value[key]"
          ></form-item>
        </ElCol>
      </template>
    </ElRow>

    <!-- <form-item v-model="model.value2" prop="value2"></form-item> -->
  </el-form>
</template>

<script>
import formItem from './form-item'
import _cloneDeep from 'lodash/cloneDeep'
import formUtils from './utils'
// eslint-disable-next-line no-console
console.log(_cloneDeep)

export default {
  name: 'NewForm',
  inheritAttrs: false,
  components: {
    'form-item': formItem
  },

  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    // 所有表单组成配置
    formSchema: {
      type: Object
    },

    // 表单的值
    value: {
      type: [Object, Array]
    },

    // 表单名
    formName: {
      type: String,
      default: 'ruleForm'
    },

    // 是否有外部输入
    isDirty: {
      type: Boolean,
      default: false
    }
  },

  watch: {
    formSchema: {
      immediate: true,
      handler(newVal, oldVal) {
        // 只有外部formSchema变化的时候才会触发
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          this.isSchemaChange = true
          this.$nextTick(() => {
            this.isSchemaChange = false
            this.handleSchema()
          })
        }
      }
    },
    value: {
      deep: true,
      handler(val) {
        if (!this.innerChange) {
          this.$emit('update:isDirty', true)
          this.$emit('change', val)
        }
      }
    }
  },

  data() {
    return {
      isSchemaChange: false,
      // 处理后的表单值，最终以此生成表单
      dataFormSchema: {},
      innerChange: false
    }
  },
  methods: {
    handleSchema() {
      // 补全表格配置
      let dataFormSchema = formUtils.generateForm(this.formSchema)
      // 生成默认值
      formUtils.setDefaultVal(this.value, dataFormSchema)
      this.$options.originVal = JSON.parse(JSON.stringify(this.value))
      this.dataFormSchema = dataFormSchema
      // 同步数据，否则会出现外部数据与内部数据更新不同步的情况
      this.$emit('change', JSON.parse(JSON.stringify(this.value)))
    },

    // 验证表单
    validate(cb) {
      if (cb) {
        return this.$refs.ruleform.validate(cb)
      }
      return this.$refs.ruleform.validate()
    },

    // 重置表单
    reset() {
      this.innerChange = true
      this.$emit('change', JSON.parse(JSON.stringify(this.$options.originVal)))
      setTimeout(() => {
        this.$emit('update:isDirty', false)
        this.$refs.ruleform.clearValidate()
        this.innerChange = false
      })
    }
  }
}
</script>

<style lang='scss'>
.new-form {
  overflow: hidden;
  .form-item-table {
    margin-bottom: 20px;
    &.el-table td,
    &.el-table th {
      vertical-align: baseline;
    }
    .el-form-item {
      margin-bottom: 0;
      &.is-required.is-error {
        margin-bottom: 18px;
      }
    }
  }
  .el-input-number .el-input__inner {
    text-align: left
  }
}
</style>
