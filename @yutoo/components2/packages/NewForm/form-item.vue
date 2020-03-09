<template>
  <!-- 普通输入控件 用于最普通的输入类型控件 -->
  <ElFormItem
    v-if="isNormal"
    :label-width="currentLabelWidth"
    :label="currentLabel"
    :prop="required ? fieldName : ''"
    :rules="schema.rules"
  >
    <template slot="label" v-if="schema.tip">
      <template v-if="!schema.pend">
        {{currentLabel}}
        <ElTooltip :content="schema.tip.content" placement="top">
          <i class="el-icon-warning-outline __info"></i>
        </ElTooltip>
      </template>
      <span v-else>&nbsp;</span>
    </template>
    <div class="form-flex">
      <FormInputs :item="schema" :disabled="disabled" :value="value" @input="$emit('input', $event)">
        <template v-if="schema.pend" :slot="schema.pend.type">{{schema.label}}</template>
      </FormInputs>
      <template v-if="schema.lenMax">
        <el-button style="margin-left: 10px" type="default" plain icon="el-icon-plus" @click="handleArrayAdd(schema.i)"></el-button>
        <el-button
          style="margin-left: 10px"
          :style="{visibility: schema.value.length !== 1 ? null : 'hidden'}"
          type="default"
          plain
          icon="el-icon-minus"
          @click="handleArrayMinus(schema.i)"
        ></el-button>
      </template>
    </div>
  </ElFormItem>

  <!-- object类型组件， 分组组件 -->
  <ElFormItem
    class="form-object"
    v-else-if="schema.type === 'object'"
    :label="currentLabel"
    :label-width="currentLabelWidth"
  >
    <ElRow>
      <ElCol :span="schema.span || 24" v-for="(schema, key) in schema.properties" :key="key">
        <form-item
          :model="model"
          v-model="model[key]"
          :disabled="schema.disabled"
          :label-width="currentLabelWidth"
          :field-name="fieldName + '.' + key"
          :schema="schema"
        ></form-item>
      </ElCol>
    </ElRow>
  </ElFormItem>
  <!-- 表格类型的表单 -->
  <div v-else-if="schema.type == 'table'">
    <ElButton size="small" type="primary" @click="batchModify" plain>批量应用修改</ElButton>
    <ElTable
      ref="table"
      :row-key="schema.rows.rowKey || schema.rows.value"
      class="form-item-table"
      border
      :data="tableData"
      :row-class-name="rowClassName"
    >
      <el-table-column align="center" reserve-selection :selectable="selectable" type="selection" width="55"></el-table-column>
      <ElTableColumn align="center" :label="schema.rows.label" prop="sku"></ElTableColumn>
      <ElTableColumn align="center" v-for="(val, key) in schema.head" :key="key" :label="val.label" :prop="key">
        <template slot-scope="scope">
          <form-item
            :disabled="val.disabled"
            :model="scope.row[key]"
            v-model="scope.row[key]"
            label-width="0"
            :required="scope.$index !== 0"
            :field-name="fieldName + '.' + (scope.$index - 1) + '.' + key"
            :schema="val"
          ></form-item>
        </template>
      </ElTableColumn>
    </ElTable>
  </div>
  <!-- 累加表单 -->
  <div v-else-if="schema.type == 'array'">
    <form-item
      v-for="(item, index) in value"
      :key="index"
      :disabled="schema.disabled"
      :model="value[index]"
      v-model="value[index]"
      :label-width="currentLabelWidth"
      :field-name="fieldName + '.' + (index)"
      :schema="{...schema, type: 'normal', label: schema.label + (index + 1), value, i: index }"
    ></form-item>
  </div>
</template>
<script>
import FormInputs from './form-inputs'
import formUtils from './utils'
export default {
  name: 'form-item',
  components: {
    FormInputs
  },
  props: {
    model: [Object, String, Array, Boolean, Number],
    labelWidth: String,
    value: [String, Array, Number, Object, Boolean],
    // 控件属性
    schema: Object,
    // 字段
    fieldName: String,
    // 是否必填
    required: {
      default: true,
      type: Boolean
    },
    // 禁用函数，通过这个判断控件是否禁用
    disabled: {
      type: [Function, Boolean],
      default: () => false
    }
  },
  model: {
    prop: 'value',
    event: 'input'
  },
  data() {
    return {
      apply: {}
    }
  },
  computed: {
    isNormal() {
      return (
        this.schema.type !== 'object' &&
        this.schema.type !== 'table' &&
        this.schema.type !== 'array'
      )
    },
    isVertical() {
      return this.schema.layout === 'v'
    },
    currentLabelWidth() {
      return this.schema.noLabel || this.schema.pend
        ? '0'
        : this.isVertical
        ? '0'
        : this.schema.labelWidth || this.labelWidth
    },
    currentLabel() {
      return this.schema.noLabel || this.schema.pend ? '' : this.schema.label
    },
    // table的表格数据
    tableData() {
      return [].concat(this.apply, this.value)
    }
  },
  methods: {
    // eslint-disable-next-line no-unused-vars
    rowClassName({ row, rowIndex }) {
      if (rowIndex == 0) {
        return 'first'
      }
    },
    selectable(row, index) {
      if (index == 0) {
        return false
      } else {
        return true
      }
    },
    batchModify() {
      let tableData = this.$refs.table.selection
      if (!tableData.length) {
        return
      }
      const firstRow = this.apply
      tableData.forEach(el => {
        Object.keys(firstRow).forEach(key => {
          let e = firstRow[key]
          if (e != null && e !== '') {
            this.$set(el, key, e)
          }
        })
      })
      this.apply = {}
    },
    handleArrayAdd(index) {
      if (this.schema.value.length === this.schema.lenMax) {
        this.$message.warning(`最多只能添加${this.schema.lenMax}个`)
        return
      }
      this.schema.value.splice(
        index + 1,
        0,
        formUtils.getInputDefault(this.schema)
      )
    },
    handleArrayMinus(index) {
      this.schema.value.splice(index, 1)
    }
  }
}
</script>
<style lang='scss' scoped>
.__info {
  font-size: 15px;
}
.form-item-table {
  border: 1px solid #bec6ce;
  margin-top: 20px;
  border-width: 1px 0 0 1px;

  &.el-table /deep/ th {
    background: #f2f2f2;
  }
  /deep/ .first {
    background: #d9d9ff;
  }
  &.el-table /deep/ td,
  &.el-table /deep/ th.is-leaf {
    border-right: 1px solid #bec6ce !important;
    border-bottom: 1px solid #bec6ce;
  }
  & /deep/ .el-checkbox__input.is-disabled {
    display: none;
  }
}
.form-flex {
  display: flex;
  width: 100%;
}

</style>