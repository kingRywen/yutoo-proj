<template>
  <div>
    <ElForm ref="form" :model="formData" label-width="120px" size="small">
      <ElRow>
        <ElCol :span="12" v-if="formData.habitId">
          <ElFormItem label="习惯编号" prop="habitId" :rules="vali(true, '习惯编号')">
            <ElInput disabled v-model="formData.habitId"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="12">
          <ElFormItem label="习惯名称" prop="habitName" :rules="vali(true, '习惯名称')">
            <ElInput v-model="formData.habitName"></ElInput>
          </ElFormItem>
        </ElCol>
        <ElCol :span="24">
          <ElFormItem label="备注">
            <ElInput type="textarea" :rows="5" v-model="formData.remark"></ElInput>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <div class="params">
        <h4 class="flex-c">
          <span>账号活跃时间约束</span>
          <!-- <ElButton type="text" icon="el-icon-plus" style="margin:0;padding: 0" @click="handleAcpAdd">添加</ElButton> -->
        </h4>
        <div class="params-row">
          <AccountActiveTime :list="list" ref="time" />
        </div>
      </div>
      <!-- <div class="params">
        <h4 class="flex-c">
          <span>动作选项约束</span>
        </h4>
        <template v-if="formData.habitConstActionArray.length">
          <div v-for="(item, index) in formData.habitConstActionArray" class="params-row _border">
            <ElFormItem
              label-width="85px"
              label="动作名称"
              :prop="`habitConstActionArray.${index}.actionId`"
              :rules="vali(true, '动作名称')"
            >
              <el-select v-model="item.actionId" disabled>
                <el-option v-for="i in actionList" :key="i.value" :label="i.label" :value="i.value"></el-option>
              </el-select>
            </ElFormItem>
            <el-collapse v-model="item.collapseVal">
              <el-collapse-item
                v-for="(option, habitIndex) in item.habitConstActionOptionArray"
                :key="option.actionOptionId"
                :name="option.actionOptionId"
              >
                <template slot="title">
                  <span style="font-size:14px">
                    <i class="el-icon el-icon-edit"></i>
                    选项名称:
                    <b class="danger">{{option.actionOptionName}}</b>
                  </span>
                </template>
                <ElTable size="mini" border stripe :row-style="showRow" :data="option.habitConstActionOptionParamArray">
                  <template slot="empty" v-if="option.typeFlag == 1">
                    <el-button type="text" icon="el-icon-plus" @click="addActionOptionParam(option)">添加自定义数据</el-button>
                  </template>

                  <ElTableColumn :render-header="renderRateAndHeader" label="占比 / 选项" width="110"></ElTableColumn>

                  <ElTableColumn
                    v-for="(i, sIndex) in option.habitConstActionOptionParamArray.length"
                    :label="option.habitConstActionOptionParamArray[sIndex].optionValue"
                    :render-header="renderColHeader.bind(null, index, habitIndex, sIndex, option)"
                    :key="sIndex"
                  >
                    <template slot-scope="scope">
                      <ElFormItem
                        label-width="0"
                        :key="`habitConstActionArray.${index}.habitConstActionOptionArray.${habitIndex}.habitConstActionOptionParamArray.${sIndex}.rate`"
                        :prop="`habitConstActionArray.${index}.habitConstActionOptionArray.${habitIndex}.habitConstActionOptionParamArray.${sIndex}.rate`"
                        :rules="getRateRule(scope, option.habitConstActionOptionParamArray, index, habitIndex)"
                      >
                        <div class="flex">
                          <ElInputNumber
                            size="mini"
                            :min="0"
                            class="mr10"
                            controls-position="right"
                            :precision="0"
                            :max="100"
                            v-model="option.habitConstActionOptionParamArray[sIndex].rate"
                            placeholder="请输入占比"
                          ></ElInputNumber>
                          <span>%</span>
                        </div>
                      </ElFormItem>
                    </template>
                  </ElTableColumn>
                  <ElTableColumn min-width="100px" v-if="option.typeFlag == 1">
                    <template slot-scope="scope">
                      <ElButton
                        type="text"
                        icon="el-icon-plus"
                        style="margin:0;padding: 4px"
                        @click="handleHabitConstActionOptionParamArray(scope, option.habitConstActionOptionParamArray,true)"
                      ></ElButton>
                      <ElButton
                        type="text"
                        icon="el-icon-minus"
                        style="margin:0;padding: 4px"
                        @click="handleHabitConstActionOptionParamArray(scope,option.habitConstActionOptionParamArray)"
                      ></ElButton>
                    </template>
                  </ElTableColumn>
                </ElTable>
              </el-collapse-item>
            </el-collapse>
          </div>
        </template>
      </div> -->
    </ElForm>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import vali from 'Utils/validator'
import AccountActiveTime from 'Views/AccountManagement/components/AccountActiveTime.vue'

export default {
  components: {
    AccountActiveTime
  },
  data() {
    return {
      habitConstTaskTypeParamList: [
        {
          label: '注册天数',
          value: 0,
          disabled: false
        },
        {
          label: '下单次数',
          value: 1,
          disabled: false
        },
        {
          label: '评价次数',
          value: 2,
          disabled: false
        }
      ],
      orderSymbolList: [
        {
          label: '<=',
          value: 0
        },
        {
          label: '<',
          value: 1
        },
        {
          label: '>=',
          value: 2
        },
        {
          label: '>',
          value: 3
        }
      ],
      constraintCycleList: [
        // {
        //   label: '周',
        //   value: 1
        // },
        {
          label: '月',
          value: 2
        }
      ],
      formData: {
        habitName: null,
        constraintCycle: null,
        remark: null,
        habitConstTaskTypeArray: [],
        habitConstActionArray: []
      },
      list: []
    }
  },
  created() {
    this.getTaskTypeList()
    this.getActionList()
  },
  computed: {
    ...mapState(['taskTypeList', 'actionList'])
  },
  methods: {
    ...mapActions(['getTaskTypeList', 'getActionList']),
    showRow({ row, rowIndex }) {
      if (rowIndex >= 1) {
        return 'display:none'
      } else {
        return ''
      }
    },
    renderRateAndHeader(h, { column }) {
      // return '占比 / 选项'
      return (
        <div class="bias-wrapper">
          <span>占比</span>
          <span>选项</span>
        </div>
      )
    },
    renderColHeader(index, habitIndex, sIndex, row, _h, { column }) {
      // console.log(index, habitIndex, row)
      let outerRow = row
      row = row.habitConstActionOptionParamArray[sIndex]

      if (column.label && !outerRow.typeFlag) {
        return column.label
      } else {
        return (
          <ElFormItem
            label-width="0"
            class="th_itemHeader"
            prop={`habitConstActionArray.${index}.habitConstActionOptionArray.${habitIndex}.habitConstActionOptionParamArray.${sIndex}.optionValue`}
            style={{ lineHeight: 0, marginBottom: 0, position: 'relative' }}
            rules={this.vali(true, '选项值')}
          >
            <ElInput
              value={row.optionValue}
              style={{ width: '100px' }}
              on-input={e => {
                row.optionValue = e
              }}
              placeholder="请输入选项值"
            />
          </ElFormItem>
        )
      }
    },
    getRateRule(scope, arr, index, habitIndex) {
      let vm = this
      const validator = (rule, value, cb) => {
        // let strs = arr.map((el, i) => i !== index && `habitConstActionArray.${index}.habitConstActionOptionArray.${habitIndex}.habitConstActionOptionParamArray.${i}.rate`).filter(el => !!el)
        // console.log(strs);
        // vm.$refs.form.validateField(strs)
        if (value == null) {
          cb(new Error('占比不能为空'))
        }
        const total = arr.reduce((total, cur) => total + cur.rate, 0)
        const all = arr.every(el => el.rate != null)
        if (total !== 100 && all) {
          vm.$refs.form.clearValidate()
          cb(new Error(`占比和必须为100% (目前总和 ${total}%)`))
        }
        if (total === 100 && all) {
          let strs = arr
            .map(
              (el, i) =>
                i !== index &&
                `habitConstActionArray.${index}.habitConstActionOptionArray.${habitIndex}.habitConstActionOptionParamArray.${i}.rate`
            )
            .filter(el => el != null)
          vm.$refs.form.clearValidate(strs)
        }
        cb()
      }
      return [{ validator }]
    },
    vali(type, str) {
      return vali(type, str)
    },
    validate() {
      let forms = ['form', 'time']
      return Promise.all(forms.map(form => this.$refs[form].validate()))
    },
    setData(data) {
      Object.assign(this.formData, data)
      this.list = data.habitConstActiveTimeArray
      this.$refs.time.init()
    },
    getAddData() {
      this.$refs.time.init()
      this.getActionData()
    },
    reset() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.time.clearData()
    },
    clearValidate() {
      this.$refs.form.clearValidate()
    },
    close() {
      Object.assign(this.$data, this.$options.data())
      this.$refs.time.clearData()
    },
    getActionData() {
      this.$api[`main/actionListHabit`]()
        .then(data => {
          let { habitConstActionArray } = data
          habitConstActionArray.forEach(el => {
            el.collapseVal = el.habitConstActionOptionArray.map(
              e => e.actionOptionId
            )
            let arr = el.habitConstActionOptionArray
            if (arr && Array.isArray(arr)) {
              arr.forEach(_el => {
                let _arr = _el.habitConstActionOptionParamArray
                if (_arr && Array.isArray(_arr)) {
                  _arr.forEach(__el => {
                    if (__el.rate === null) {
                      __el.rate = undefined
                    }
                  })
                }
              })
            }
          })
          Object.assign(this.formData, { habitConstActionArray })
          // this.formData.habitConstActionArray = habitConstActionArray
          this.$nextTick(() => {
            this.$refs.form.clearValidate()
          })
        })
        .catch(() => {})
    },
    /**
     * 任务类型操作
     */
    handleVisibleChange(val, arr) {
      if (val) {
        this.habitConstTaskTypeParamList.forEach(el => {
          if (arr.indexOf(el.value) > -1) {
            el.disabled = true
          } else {
            el.disabled = false
          }
        })
      }
    },
    handleTaskTypeArr(param, index, arr, add) {
      if (add) {
        arr.splice(index + 1, 0, {
          constraitParam: {
            registerDay: undefined,
            registerDaySymbol: null,
            orderSymbol: null,
            orderNumber: undefined,
            evaluateSymbol: null,
            evaluateNumber: undefined
          },
          index: [null],
          minTimes: undefined,
          maxTimes: undefined
        })
      } else {
        arr.splice(index, 1)
      }
    },
    // 增删注册天数 对应 2
    handleTypeParam(param, index, arr, i, add) {
      let len = this.habitConstTaskTypeParamList.length
      if (add) {
        if (param.index.length >= len) {
          this.$message.warning(`最多只能增加${len}个`)
          return
        } else {
          param.index.splice(index + 1, 0, null)
        }
      } else {
        param.index.splice(index, 1)
        switch (i) {
          case 0:
            delete param.constraitParam.registerDay
            delete param.constraitParam.registerDaySymbol
            break
          case 1:
            delete param.constraitParam.orderSymbol
            delete param.constraitParam.orderNumber
            break

          case 2:
            delete param.constraitParam.evaluateSymbol
            delete param.constraitParam.evaluateNumber
            break

          default:
            break
        }
      }
    },
    handleOptionValueAdd(scope, item) {
      let { $index: i, row } = scope
      let { habitConstActionOptionParamArray } = item
      habitConstActionOptionParamArray.splice(i + 1, 0, {
        optionValue: null
      })
    },
    handleOptionValueMinus(scope, item) {
      let { $index: i, row } = scope
      let { habitConstActionOptionParamArray } = item
      habitConstActionOptionParamArray.splice(i, 1)
    },

    hasParamData(param) {
      let flag = false
      for (const key in param.constraitParam) {
        if (param.constraitParam.hasOwnProperty(key)) {
          const element = param.constraitParam[key]
          if (element != null) {
            flag = true
          }
        }
      }
      return flag
    },

    getSymbol(i) {
      return i === 0
        ? 'registerDaySymbol'
        : i === 1
        ? 'orderSymbol'
        : 'evaluateSymbol'
    },
    getParamVal(i) {
      return i === 0
        ? 'registerDay'
        : i === 1
        ? 'orderNumber'
        : 'evaluateNumber'
    },
    handleAcpAdd() {
      this.formData.habitConstTaskTypeArray.push({
        taskTypeId: null,
        habitConstTaskTypeParamArray: [
          {
            constraitParam: {
              registerDay: undefined,
              registerDaySymbol: null,
              orderSymbol: null,
              orderNumber: undefined,
              evaluateSymbol: null,
              evaluateNumber: undefined
            },
            index: [null],
            minTimes: undefined,
            maxTimes: undefined
          }
        ]
      })
    },
    handlePrmsAdd(item, index) {
      this.formData.habitConstTaskTypeArray.splice(index + 1, 0, {
        taskTypeId: null,
        habitConstTaskTypeParamArray: [
          {
            constraitParam: {
              registerDay: undefined,
              registerDaySymbol: null,
              orderSymbol: null,
              orderNumber: undefined,
              evaluateSymbol: null,
              evaluateNumber: undefined
            },
            index: [null],
            minTimes: undefined,
            maxTimes: undefined
          }
        ]
      })
    },
    handlePrmsMinus(item, index) {
      this.formData.habitConstTaskTypeArray.splice(index, 1)
    },
    handleSwitchType(item, index, val) {
      if (val === 0 || item.controlType !== 0) {
        item.habitConstActionOptionParamArray.splice(0)
      } else {
        item.habitConstActionOptionParamArray = [
          {
            optionValue: null
          }
        ]
      }
    },
    handleSelectChange(item, index, val) {
      if (val === 0 && item.typeFlag !== 0) {
        item.habitConstActionOptionParamArray = [
          {
            optionValue: null
          }
        ]
      } else {
        item.habitConstActionOptionParamArray.splice(0)
      }
    },

    /**
     * 动作选项约束
     */
    addActionOptionParam(option) {
      option.habitConstActionOptionParamArray.push({
        optionValue: null,
        rate: undefined
      })
    },
    handleHabitConstActionOptionParamArray(scope, arr, add) {
      let { $index: i, row } = scope
      if (add) {
        arr.push({
          optionValue: null,
          rate: undefined
        })
      } else {
        arr.pop()
      }
    }
  }
}
</script>

<style lang='scss' scoped>
/deep/.el-table--mini th {
  padding: 0;
}
/deep/.bias-wrapper {
  width: 100%;
  height: 40px;
  // position: relative;
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 1px;
    background: #ddd;
    transform: rotate(23deg) scaleX(1.4);
    top: 24px;
    right: 0;
  }
  & > span {
    position: absolute;
    &:first-child {
      left: 13px;
      bottom: -2px;
    }
    &:nth-child(2) {
      top: -3px;
      left: 69px;
    }
  }
}
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
    &._border {
      padding: 12px;
      box-sizing: content-box;
      border: 1px dotted #ddd;
      margin: 12px;
      border-radius: 5px;
      margin-bottom: 40px;
    }
  }
}
/deep/.th_itemHeader {
  padding: 0;
  .el-form-item__content {
    padding: 0;
    .el-input--small {
      padding: 0;
    }
  }
  .el-form-item__error {
    position: absolute;
    top: 22px;
    left: -8px;
  }
}
</style>
<style lang="scss">
.constraintCycle {
  .el-form-item__label:before {
    position: absolute;
    left: -9px;
  }
}
</style>
