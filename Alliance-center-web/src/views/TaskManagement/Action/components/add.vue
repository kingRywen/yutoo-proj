<template>
  <div>
    <ElForm ref="form" :model="formData" label-width="100px" size="small">
      <ElRow :gutter="12">
        <ElCol :span="12">
          <ElFormItem label="动作编号" prop="actionId" :rules="[{ required: true, message: '动作编号必须是整数且不能为空' }]">
            <ElInputNumber
              class="per100"
              :min="1"
              :precision="0"
              :max="999999999"
              :controls="false"
              v-model="formData.actionId"
              :disabled="title !== '新增动作定义'"
            ></ElInputNumber>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="动作名称" prop="actionName" :rules="vali(true, '动作名称')">
            <ElInput v-model="formData.actionName"></ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="12">
        <ElCol :span="12">
          <ElFormItem label="处理类" prop="actionHandleClass" :rules="vali(true, '处理类')">
            <ElInput v-model="formData.actionHandleClass"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="习惯设置" prop="settingFlag" :rules="vali(true, '习惯设置')">
            <ElRadioGroup v-model="formData.settingFlag">
              <ElRadio :label="1">需要</ElRadio>
              <ElRadio :label="0">不需要</ElRadio>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
      </ElRow>
      <ElRow :gutter="12">
        <ElCol :span="24">
          <ElFormItem label="备注">
            <ElInput type="textarea" :rows="5" v-model="formData.remark"></ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <div class="params">
        <h4 class="flex-c">
          <span>参数</span>
          <ElButton type="text" icon="el-icon-plus" style="margin:0;padding: 4px" @click="handleAcpAdd">添加</ElButton>
        </h4>
        <template v-if="formData.actionParamArray.length">
          <div
            v-for="(item, index) in formData.actionParamArray"
            class="params-row flex"
            :style="index == 0 ? {marginTop:'20px'} : null"
          >
            <ElFormItem
              label-width="40px"
              label="key"
              :prop="`actionParamArray.${index}.paramKey`"
              :rules="vali(true, 'key')"
            >
              <ElInput v-model="item.paramKey"></ElInput>
            </ElFormItem>
            <ElFormItem
              label-width="90px"
              label="key描述"
              :prop="`actionParamArray.${index}.keyDescribe`"
              :rules="vali(true, 'key描述')"
            >
              <ElInput v-model="item.keyDescribe"></ElInput>
            </ElFormItem>
            <ElFormItem
              label-width="90px"
              label="value类型"
              :prop="`actionParamArray.${index}.valueType`"
              class="mr10"
              :rules="vali(true, 'value类型')"
            >
              <el-select v-model="item.valueType" style="width:100%">
                <el-option v-for="i in valueTypeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </ElFormItem>
            <ElFormItem label-width="0">
              <div class="flex-c" style="height:33px">
                <ElButton
                  type="text"
                  icon="el-icon-plus"
                  style="margin:0;padding: 4px"
                  @click="handlePrmsAdd(item, index)"
                ></ElButton>
                <ElButton
                  type="text"
                  icon="el-icon-minus"
                  style="margin:0;padding: 4px"
                  @click="handlePrmsMinus(item, index)"
                ></ElButton>
              </div>
            </ElFormItem>
          </div>
        </template>
      </div>
      <div class="params">
        <h4 class="flex-c">
          <span>动作选项</span>
          <ElButton type="text" icon="el-icon-plus" style="margin:0;padding: 4px" @click="handleOptAdd">添加</ElButton>
        </h4>
        <template v-if="formData.actionOptionArray.length">
          <div v-for="(item, index) in formData.actionOptionArray" class="params-row action-row">
            <ElRow :gutter="10">
              <ElCol :span="24">
                <ElFormItem
                  label-width="120px"
                  label="选项名称"
                  :prop="`actionOptionArray.${index}.actionOptionName`"
                  :rules="vali(true, '选项名称')"
                >
                  <div class="flex-c">
                    <ElInput class="mr10" v-model="item.actionOptionName"></ElInput>
                    <div class="flex-c">
                      <ElButton
                        type="text"
                        icon="el-icon-plus"
                        style="margin:0;padding: 4px"
                        @click="handleSubOptAdd(item, index)"
                      ></ElButton>
                      <ElButton
                        type="text"
                        icon="el-icon-minus"
                        style="margin:0;padding: 4px"
                        @click="handleSubOptMinus(item, index)"
                      ></ElButton>
                    </div>
                  </div>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem
                  label-width="120px"
                  label="选项值控件类型"
                  :prop="`actionOptionArray.${index}.controlType`"
                  :rules="vali(true, '选项名称')"
                >
                  <el-select
                    @change="handleSelectChange(item, index, $event)"
                    v-model="item.controlType"
                    style="width:100%"
                  >
                    <el-option v-for="i in controlTypeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </ElFormItem>
              </ElCol>
              <ElCol :span="8">
                <ElFormItem
                  label-width="120px"
                  label="选项值数据类型"
                  :prop="`actionOptionArray.${index}.dataType`"
                  :rules="vali(true, '选项值数据类型')"
                >
                  <el-select v-model="item.dataType" style="width:100%">
                    <el-option v-for="i in valueTypeList" :key="i.value" :label="i.label" :value="i.value"></el-option>
                  </el-select>
                </ElFormItem>
              </ElCol>
              <ElCol v-if="item.controlType == 0" :span="8">
                <ElFormItem label="自定义" prop="typeFlag">
                  <ElSwitch
                    @change="handleSwitchType(item, index, $event)"
                    v-model="item.typeFlag"
                    inactive-text="否"
                    active-text="是"
                    :active-value="1"
                    :inactive-value="0"
                  ></ElSwitch>
                </ElFormItem>
              </ElCol>
              <ElCol :span="24" v-if="item.actionOptionParamArray && item.actionOptionParamArray.length">
                <ElTable :data="item.actionOptionParamArray">
                  <ElTableColumn label="选项值名称">
                    <template slot-scope="scope">
                      <el-input v-if="item.typeFlag !== 1" size="small" v-model="scope.row.optionValue"></el-input>
                      <span style="line-height:32px" v-else>{{scope.row.optionValue}}</span>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn v-if="item.typeFlag !== 1" label="操作">
                    <template slot-scope="scope">
                      <ElButton type="text" icon="el-icon-plus" @click="handleOptionValueAdd(scope, item)"></ElButton>
                      <ElButton
                        type="text"
                        icon="el-icon-minus"
                        v-if="item.actionOptionParamArray.length >1"
                        @click="handleOptionValueMinus(scope, item)"
                      ></ElButton>
                    </template>
                  </ElTableColumn>
                </ElTable>
              </ElCol>
            </ElRow>
            <div
              class="double-hr"
              style="margin-top:30px"
              v-if="formData.actionOptionArray.length && index !== formData.actionOptionArray.length -1"
            ></div>
          </div>
          <!-- <div class="params-row flex">
            <ElTable :data="">
            <ElTableColumn label=""></ElTableColumn>
            </ElTable>
          </div>-->
        </template>
      </div>
    </ElForm>
  </div>
</template>

<script>
import vali from 'Utils/validator'
export default {
  props: ['title'],
  data() {
    return {
      controlTypeList: [
        {
          label: '下拉框',
          value: 0
        },
        {
          label: '输入框',
          value: 1
        },
        {
          label: '日期选择',
          value: 2
        }
      ],
      valueTypeList: [
        {
          label: '字符',
          value: 0
        },
        {
          label: '整数',
          value: 1
        },
        {
          label: '日期',
          value: 2
        },
        {
          label: '小数',
          value: 3
        }
      ],
      formData: {
        actionId: undefined,
        actionName: null,
        actionHandleClass: null,
        settingFlag: 0,
        remark: null,
        actionParamArray: [],
        actionOptionArray: []
      }
    }
  },
  methods: {
    validate() {
      return this.$refs.form.validate()
    },
    vali(type, str) {
      return vali(type, str)
    },
    setData(data) {
      Object.assign(this.formData, data)
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    close() {
      Object.assign(this.$data, this.$options.data())
    },
    handleOptionValueAdd(scope, item) {
      let { $index: i, row } = scope
      let { actionOptionParamArray } = item
      actionOptionParamArray.splice(i + 1, 0, {
        optionValue: null
      })
    },
    handleOptionValueMinus(scope, item) {
      let { $index: i, row } = scope
      let { actionOptionParamArray } = item
      actionOptionParamArray.splice(i, 1)
    },
    handleOptAdd() {
      this.formData.actionOptionArray.push({
        dataType: null,
        controlType: null,
        typeFlag: 0,
        actionOptionName: null,
        actionOptionParamArray: []
      })
    },
    handleSubOptAdd(item, index) {
      this.formData.actionOptionArray.splice(index + 1, 0, {
        dataType: null,
        controlType: null,
        typeFlag: 0,
        actionOptionName: null,
        actionOptionParamArray: []
      })
    },
    handleSubOptMinus(item, index) {
      this.formData.actionOptionArray.splice(index, 1)
    },
    handleAcpAdd() {
      this.formData.actionParamArray.push({
        paramKey: null,
        keyDescribe: null,
        valueType: null
      })
    },
    handlePrmsAdd(item, index) {
      this.formData.actionParamArray.splice(index + 1, 0, {
        paramKey: null,
        keyDescribe: null,
        valueType: null
      })
    },
    handlePrmsMinus(item, index) {
      this.formData.actionParamArray.splice(index, 1)
    },
    handleSwitchType(item, index, val) {
      let { actionOptionParamArray, controlType } = item
      let isEdit =
        actionOptionParamArray &&
        actionOptionParamArray.length &&
        actionOptionParamArray[0].actionOptionId
      if (val !== 0 || controlType !== 0) {
        if (this.oldData) {
          item.actionOptionParamArray =
            this.oldData && JSON.parse(JSON.stringify(this.oldData))
        } else {
          item.actionOptionParamArray.splice(0)
        }
      } else {
        if (isEdit && actionOptionParamArray.length) {
          this.oldData = actionOptionParamArray.map(el => ({
            optionValue: el.optionValue
          }))
          item.actionOptionParamArray =
            this.oldData && JSON.parse(JSON.stringify(this.oldData))
        } else {
          item.actionOptionParamArray = this.oldData
            ? JSON.parse(JSON.stringify(this.oldData))
            : [
                {
                  optionValue: null
                }
              ]
        }
      }
    },
    handleSelectChange(item, index, val) {
      if (val === 0 && item.typeFlag === 0) {
        item.actionOptionParamArray = [
          {
            optionValue: null
          }
        ]
      } else {
        item.actionOptionParamArray.splice(0)
      }
    }
  }
}
</script>

<style lang='scss' scoped>
.params {
  border: 1px solid #ddd;
  // padding: 20px;
  margin-bottom: 20px;
  h4 {
    padding: 10px;
    background: #f2f2f4;
    margin: 0;
  }
  .params-row {
    padding: 12px;
  }
  .action-row {
    margin: 30px 0;
  }
}
</style>
