<template>
  <!-- 普通输入控件 用于最普通的输入类型控件 -->
  <ElFormItem
    v-if="isNormal"
    :label-width="typeof currentLabelWidth == 'string' ? currentLabelWidth : currentLabelWidth + 'px'"
    :label="currentLabel"
    :key="required"
    :prop="required ? fieldName : ''"
    :rules="required ? schema.rules : undefined"
  >
    <template slot="label" v-if="schema.tip && !schema.noLabel">
      <template v-if="!schema.pend">
        {{currentLabel}}
        <ElTooltip v-if="schema.tip" placement="top" :effect="schema.tip.img ? 'light': 'dark'">
          <template slot="content">
            <span v-if="!schema.tip.img" v-html="schema.tip.content"></span>
            <img :src="schema.tip.img" width="450" v-else />
          </template>

          <i class="__info" :class="schema.tip.icon || 'el-icon-info'"></i>
        </ElTooltip>
      </template>
      <span v-else-if="!schema.pend.text">&nbsp;</span>
      <span v-else-if="schema.pend.text">{{currentLabel}}</span>
    </template>
    <div :class="{'form-flex': schema.widget !== 'radio'}">
      <div style="white-space: nowrap;" class="mr10" v-if="schema.prevText">{{schema.prevText}}</div>
      <FormInputs
        ref="formInput"
        :search="search"
        @blur="$emit('blur')"
        @change="$emit('el-change', schema, $attrs.formItem)"
        @clear="$emit('clear')"
        :item="schema"
        :disabled="disabled"
        :value="value"
        @input="$emit('input', $event)"
      >
        <template v-if="schema.pend" :slot="schema.pend.type">{{schema.pend.text || schema.label}}</template>
      </FormInputs>
      <div style="white-space: nowrap;" class="ml10" v-if="schema.nextText">{{schema.nextText}}</div>
      <template>
        <span
          v-if="schema.innerTips && schema.widget !== 'radio'"
          class="innerTips"
        >{{!schema.showInnerTipFunc || (schema.showInnerTipFunc(rootVal)) ? schema.innerTips : ' '}}</span>
      </template>

      <template v-if="schema.rightBtn">
        <template v-if="schema.rightBtn.alwaysUse">
          <ElForm>
            <ElButton :disabled="false" v-bind="rightBtnBind" @click="rightBtnFn">{{schema.rightBtn.name}}</ElButton>
          </ElForm>
        </template>
        <ElButton v-else :disabled="false" v-bind="rightBtnBind" @click="rightBtnFn">{{schema.rightBtn.name}}</ElButton>
      </template>
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
    <slot name="formItem" v-bind="schema"></slot>
    <div style="opacity: 0.4" v-if="schema.tipText">{{schema.tipText}}</div>
  </ElFormItem>

  <!-- object类型组件， 分组组件 -->
  <ElFormItem
    class="form-object"
    v-else-if="schema.type === 'object'"
    :label="currentLabel"
    :label-width="currentLabelWidth"
  >
    <ElRow v-if="!schema.array">
      <ElCol :span="schema.span || 24" v-for="(schema, key) in schema.properties" :key="key">
        <form-item
          :model="model"
          v-model="model[key]"
          @input="handleObjChange($event,key)"
          :disabled="schema.disabled"
          :label-width="labelWidth"
          :field-name="fieldName + '.' + key"
          :schema="schema"
        ></form-item>
      </ElCol>
    </ElRow>
    <template v-else>
      <div v-for="item in schema.arrayMax" class="flex">
        <template v-if="model[item-1]">
          <ElRow :key="item">
            <ElCol :span="schema.span || 24" v-for="(schema, key) in schema.properties" :key="key">
              <form-item
                :model="model"
                v-model="model[item-1][key]"
                @input="handleObjChange($event,key)"
                :disabled="schema.disabled"
                :label-width="labelWidth"
                :field-name="fieldName + '.' + (item-1) + '.' + key"
                :schema="schema"
              ></form-item>
            </ElCol>
          </ElRow>
          <div class="btn" v-if="schema.showBtns !== false && schema.arrayMax > 1">
            <ElButton type="text" icon="el-icon-plus" @click="handlePlus(item - 1, model, schema)"></ElButton>
            <ElButton
              v-if="model.length > 1"
              type="text"
              icon="el-icon-minus"
              @click="handleMinus(item - 1, model, schema)"
            ></ElButton>
          </div>
        </template>
      </div>
    </template>
  </ElFormItem>
  <!-- 表格类型的表单 -->
  <ElFormItem v-else-if="schema.type == 'table'">
    <slot name="btnLeft" v-bind:data="tableData"></slot>
    <ElButton class="mb20" v-if="schema.batch !== false" size="small" type="primary" @click="batchModify" plain>批量应用修改</ElButton>
    <ElTable
      ref="table"
      :row-key="schema.rowKey"
      class="form-item-table"
      border
      :span-method="schema.spanMethod"
      :data="tableData"
      :row-class-name="rowClassName"
    >
      <el-table-column
        align="left"
        v-if="schema.batch !== false"
        reserve-selection
        :selectable="selectable"
        type="selection"
        width="55"
      ></el-table-column>
      <ElTableColumn
        v-if="schema.rows"
        align="left"
        :label="schema.rows.label"
        :prop="schema.rows.value"
        :width="schema.width == 'auto' ? undefined : (schema.width || 150)"
      ></ElTableColumn>
      <template v-if="schema.rows && schema.rows.children">
        <ElTableColumn
          v-for="item in schema.rows.children"
          :key="item.value"
          align="left"
          :label="item.label"
          :prop="item.value"
          :width="schema.width == 'auto' ? undefined : (schema.width || 150)"
        ></ElTableColumn>
      </template>

      <ElTableColumn
        align="left"
        v-for="(val, key) in schema.head"
        :key="key"
        :label="val.label"
        :min-width="val.minWidth"
        :width="schema.width == 'auto' ? undefined : (val.width || 200)"
        :prop="key"
      >
        <template slot-scope="scope">
          <form-item
            v-if="!val.child"
            :ref="`form-${scope.$index}`"
            :disabled="val.disabled"
            :model="scope.row[key]"
            v-model="scope.row[key]"
            label-width="0"
            v-on="val.on"
            :formItem="$refs[`form-${scope.$index}`]"
            :required="scope.$index !== 0"
            :field-name="fieldName + '.' + (schema.batch !== false ? (scope.$index - 1) : scope.$index) + '.' + key"
            :schema="{...val, required: (scope.$index === 0 && schema.batch !== false) ? false : val.required}"
          ></form-item>
          <div class="flex" v-else>
            <form-item
              class="mr10"
              v-for="(val, key) in val.child"
              :key="key"
              :disabled="val.disabled"
              :model="scope.row[key]"
              v-model="scope.row[key]"
              label-width="0"
              :required="scope.$index !== 0"
              :field-name="fieldName + '.' + (schema.batch !== false ? (scope.$index - 1) : scope.$index) + '.' + key"
              :schema="{...val, required: (scope.$index === 0 && schema.batch !== false) ? false : val.required}"
            ></form-item>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </ElFormItem>
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

  <!-- 复杂的累加表单 -->
  <div v-else-if="schema.type == 'multiArray'">
    <div class="flex" v-for="(valItem, index) in value">
      <form-item
        @el-change="handleMultiChange"
        v-for="(item,key) in schema.children"
        :key="key"
        :disabled="item.disabled"
        :model="value"
        :class="`${key}-wrapper`"
        v-model="valItem[key]"
        :label-width="currentLabelWidth"
        :field-name="fieldName + '.' + (index) + '.' + key"
        :schema="{...item, type:  'normal', label: item.label, value:valItem, i: index, item, required: schema.lastNotReq.indexOf(key) > -1 && index == value.length -1 ? false: item.required  }"
      ></form-item>
      <el-form-item label-width="0" class="multi-array-item first">
        <el-button type="default" icon="el-icon-plus" @click="handlePlusMult(index, fieldName + '.' + (index) + '.')"></el-button>
      </el-form-item>
      <el-form-item label-width="0" class="multi-array-item" v-if="value && value.length > 1">
        <el-button type="default" icon="el-icon-minus" @click="hanldeMinusMult(index, fieldName + '.' + (index) + '.')"></el-button>
      </el-form-item>
    </div>
  </div>
</template>
<script>
// import FormInputs from './form-inputs'
import formUtils from './utils'
export default {
  name: 'form-item',
  // components: {
  //   FormInputs
  // },
  props: {
    validateForm: Function,
    search: {
      default: false
    },
    // 根表单的值
    rootVal: {
      type: Object
    },
    model: [Object, String, Array, Boolean, Number],
    labelWidth: String,
    value: [String, Array, Number, Object, Boolean],
    // 控件属性
    schema: Object,
    // 字段
    fieldName: String,
    // // 是否必填
    // required: {
    //   default: true,
    //   type: Boolean
    // },
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
      apply: this.getTableDefaultVal()
    }
  },
  watch: {
    'schema.required': {
      deep: true,
      handler(val, oldVal) {
        if (val !== oldVal) {
          this.schema.rules = formUtils.getvalidRules(this.schema)
        }
      }
    }
  },
  computed: {
    rightBtnBind() {
      let btn = this.schema.rightBtn
      if (btn) {
        // eslint-disable-next-line no-unused-vars
        const { fn, ...info } = btn
        return info
      }
      return {}
    },
    rightBtnFn() {
      let btn = this.schema.rightBtn
      if (btn) {
        // eslint-disable-next-line no-unused-vars
        const fn = btn.fn
        return fn
      }
      return () => {}
    },
    required() {
      return !!this.schema.required
    },
    isNormal() {
      return (
        this.schema.type !== 'object' &&
        this.schema.type !== 'table' &&
        this.schema.type !== 'array' &&
        this.schema.type !== 'multiArray'
      )
    },
    isVertical() {
      return this.schema.layout === 'v'
    },
    currentLabelWidth() {
      return this.schema.noLabel ||
        !this.schema.label ||
        (this.schema.pend && !this.schema.pend.text)
        ? '0'
        : this.isVertical
        ? '0'
        : this.schema.labelWidth || this.labelWidth
    },
    currentLabel() {
      return this.schema.noLabel ||
        !this.schema.label ||
        (this.schema.pend && !this.schema.pend.text)
        ? ''
        : this.schema.label
    },
    // table的表格数据
    tableData() {
      if (this.schema.batch === false) {
        return this.value
      }
      return [].concat(this.apply, this.value)
    }
  },
  methods: {
    hanldeMinusMult(index) {
      this.value.splice(index, 1)
    },
    handlePlusMult(index, fieldPrefix) {
      let fields = ['minCnt', 'maxCnt'],
        added = false,
        errorMsg
      this.validateForm(
        fields.map(e => fieldPrefix + e),
        msg => {
          if (msg !== '') {
            errorMsg = msg
          }
        }
      )

      if (!errorMsg && !added) {
        added = true
        let ret = {}
        if (this.schema.leftUnEdit) {
          if (
            this.value[index][this.schema.leftUnEdit[1]] == null ||
            this.value[index][this.schema.leftUnEdit[1]] === ''
          ) {
            let el = [].find.call(
              document.querySelectorAll(
                `.${this.schema.leftUnEdit[1]}-wrapper input.el-input__inner`
              ),
              e => {
                return e.value === ''
              }
            )
            el && el.focus()
            return this.$message.warning('请填写数据')
          }
          ret = {
            [this.schema.leftUnEdit[0]]:
              this.value[index][this.schema.leftUnEdit[1]] + 1
          }
        }
        this.value.splice(index + 1, 0, ret)
      }
    },
    handleMultiChange(schema) {
      if (schema.change) {
        schema.change(schema)
      }
    },
    handlePlus(index, array, schema) {
      if (schema.arrayMax && array.length >= schema.arrayMax) {
        return this.$message.warning(`最多只能增加${schema.arrayMax}个`)
      }
      let def = schema.__default,
        ret = {}
      Object.keys(def).forEach(key => {
        ret[key] = def[key]
      })
      array.splice(index + 1, 0, ret)
    },
    handleMinus(index, array) {
      array.splice(index, 1)
    },
    handleObjChange(val, key) {
      if (val != null && val !== '') {
        this.$emit('objChange', key)
      }
    },
    getTableDefaultVal() {
      if (!this.schema.head) {
        return
      }
      let ret = {}

      Object.keys(this.schema.head).forEach(key => {
        ret[key] = formUtils.getInputDefault(this.schema.head[key])
      })
      return ret
    },
    // eslint-disable-next-line no-unused-vars
    rowClassName({ row, rowIndex }) {
      if (rowIndex == 0 && this.schema.batch !== false) {
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
      this.apply = this.getTableDefaultVal()
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
.btn {
  margin-bottom: 18px;
  width: 100px;
  margin-left: 18px;
  /deep/ .el-button.el-button--text {
    padding: 0;
  }
}
.__info {
  font-size: 15px;
}
.form-item-table {
  border: 1px solid rgb(228, 228, 228);
  // margin-top: 20px;
  border-width: 1px 0 0 1px;

  &.el-table /deep/ th {
    background: #f2f2f2;
  }
  &.el-table /deep/ th {
    padding: 2px 0;
  }
  &.el-table /deep/ td {
    padding: 8px 0;
  }
  /deep/ .first {
    background: #e8e8e8;
  }
  &.el-table /deep/ td,
  &.el-table /deep/ th.is-leaf {
    border-right: 1px solid rgb(228, 228, 228) !important;
    border-bottom: 1px solid rgb(228, 228, 228);
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