<template>
  <div class="basic-form">
    <basic-container>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm" size="small">
        <el-form-item label="名称" prop="formuleName">
          <el-input style="width:50%" v-model="ruleForm.formuleName"></el-input>
        </el-form-item>
        <el-form-item label="选择生命周期" prop="cycleType" required>
          <el-select style="width:50%" v-model="ruleForm.cycleType" placeholder="请选择生命周期">
            <el-option v-for="item in $store.state.cycleType" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="周期监控参数" v-if="show">
          <!-- 周期监控参数 -->
          <div v-for="(cycle, cycleIndex) in ruleForm.cycleMonitorParm">
            <el-row :gutter="20" style="margin-bottom:8px;margin-left:10px">
              <!-- <el-col style="width:200px">
                <el-form-item
                  :label="cycleIndex === 0 ?'上架时间>=' :'上架时间<'"
                  label-width="100px"
                  :prop="'cycleMonitorParm[' + cycleIndex + '].up'"
                  required
                  :rules="[{required: true, message: '请选择'}]"
                >
                  <el-select v-model="cycle.up" style="width:100%">
                    <el-option label=">=" :key="1" :value="1"></el-option>
                    <el-option label="<" :key="2" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>-->
              <el-col style="width:240px">
                <el-form-item
                  :label="cycleIndex === 0 ?'上架时间 >=' :'上架时间 <'"
                  label-width="100px"
                  :prop="'cycleMonitorParm[' + cycleIndex + '].day'"
                  required
                  :rules="[{required: true, message: '必须是正整数',type:'integer'}]"
                >
                  <el-input-number
                    :min="0"
                    style="width:100%"
                    controls-position="right"
                    :value="cycle.day"
                    @change="handleNumInput(cycle, cycleIndex, $event)"
                  ></el-input-number>
                </el-form-item>
              </el-col>

              <el-col :span="1">天</el-col>
            </el-row>

            <!-- BSR排名 -->
            <el-row :gutter="20" style="margin-bottom:8px;margin-left:10px" v-for="(item,index) in cycle.bsrRanking">
              <el-col :span="5">
                <el-form-item
                  :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].largeRankingStart'"
                  :rules="numStart(item, index, cycle.bsrRanking)"
                  label="BSR排名"
                  label-width="80px"
                  :required="index !== 0"
                >
                  <el-input-number
                    :min="0"
                    :max="99999999999"
                    style="width:100%"
                    controls-position="right"
                    disabled
                    v-model.number="item.largeRankingStart"
                    @input="setStartEqualVal(item, index, $event, cycle.bsrRanking,cycleIndex)"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align:center">~</el-col>
              <el-col :span="5">
                <el-form-item
                  :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].largeRankingEnd'"
                  :rules="numEnd(item, index, cycle.bsrRanking)"
                >
                  <el-input-number
                    v-if="index !== cycle.bsrRanking.length - 1"
                    :min="0"
                    :max="99999999999"
                    style="width:100%"
                    controls-position="right"
                    :disabled="index === cycle.bsrRanking.length - 1 && cycle.bsrRanking.length > 1"
                    :value="index === cycle.bsrRanking.length - 1 ? undefined : item.largeRankingEnd"
                    @input="setEndEqualVal(item, index, $event, cycle.bsrRanking,cycleIndex)"
                  ></el-input-number>
                  <div v-else class="infinity">∞</div>
                </el-form-item>
              </el-col>
              <el-col :span="4">
                <el-form-item
                  label="计算周期"
                  label-width="80px"
                  :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].cycle'"
                  :rules="{required: true, message: '请输入正整数',type:'integer'}"
                  required
                >
                  <el-input-number :min="1" controls-position="right" v-model.number="item.cycle" style="width:100%"></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="text-align:center">天</el-col>
              <el-col :span="4">
                <el-form-item
                  :label="`${ruleForm.cycleType === 1 ? '上升' : ruleForm.cycleType === 3 ? '下降' : ''}幅度`"
                  label-width="80px"
                  :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].range'"
                  :rules="{required: true, message: '请选择一项', trigger: 'change'}"
                  required
                >
                  <el-select v-model.number="item.range" style="width:100%" required>
                    <el-option label="比例" :value="1"></el-option>
                    <el-option label="值" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item
                  :prop="'cycleMonitorParm['+ cycleIndex +'].bsrRanking[' + index + '].rangeValue'"
                  :rules="{required: true, message: '请输入数字',type:'number'}"
                  required
                >
                  <el-input style="width:100%" v-model.number="item.rangeValue">
                    <i slot="suffix" v-if="item.range === 1">%</i>
                  </el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1" v-if="index === cycle.bsrRanking.length - 1">
                <el-button plain icon="el-icon-plus" @click="addBsr(cycleIndex, index)"></el-button>
              </el-col>
              <el-col :span="1" v-else-if="index !== cycle.bsrRanking.length - 1 && index !== 0">
                <i class="el-icon-remove" @click="delBsr(cycleIndex, index)" style="cursor:pointer"></i>
              </el-col>
            </el-row>
          </div>
        </el-form-item>
        <el-form-item label="缺货监控参数" prop="delivery">
          <!-- 缺货监控参数 -->
          <el-row
            :gutter="20"
            v-for="(item,index) in ruleForm.shortageMonitorParm"
            style="margin-bottom:8px;margin-left:10px"
          >
            <el-col :span="6">
              <el-form-item
                label="运输方式"
                label-width="80px"
                :prop="'shortageMonitorParm[' + index + '].transportFirstId'"
                :rules="{required: true, message: '请选择运输方式'}"
                required
              >
                <div class="flex">
                  <el-select
                    v-model="item.transportFirstId"
                    filterable
                    allow-create
                    required
                    style="margin-right: 10px;width:100%"
                  >
                    <el-option v-for="tr in transportType" :label="tr.label" :value="tr.value"></el-option>
                  </el-select>
                  <el-button type="primary" @click="linkToAdd">添加</el-button>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="保底可售天数"
                label-width="110px"
                style="width:100%"
                :prop="'shortageMonitorParm[' + index + '].insuredDays'"
                :rules="{required: true, message: '请输入正整数',type:'integer'}"
                required
              >
                <el-input-number :min="0" controls-position="right" v-model.number="item.insuredDays"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="备货所需天数"
                label-width="110px"
                :prop="'shortageMonitorParm[' + index + '].stockDays'"
                :rules="{required: true, message: '请输入正整数',type:'integer'}"
                required
              >
                <el-input-number style="width:100%" :min="0" controls-position="right" v-model.number="item.stockDays"></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="4">
              <el-form-item
                label="运输天数"
                label-width="80px"
                :prop="'shortageMonitorParm[' + index + '].transportDays'"
                :rules="{required: true, message: '请输入正整数',type:'integer'}"
                required
              >
                <el-input-number
                  style="width:100%"
                  :min="0"
                  controls-position="right"
                  v-model.number="item.transportDays"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="index === 0">
              <el-form-item
                label="日均销量计算周期"
                label-width="160px"
                prop="avgDays"
                :rules="{required: true, message: '请输入正整数',type:'integer'}"
                required
              >
                <el-input-number
                  style="width:100%"
                  :min="0"
                  controls-position="right"
                  v-model.number="ruleForm.avgDays"
                ></el-input-number>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-else>
              <i class="el-icon-remove" @click="removeshortageMonitorParm(index)" style="cursor:pointer"></i>
            </el-col>
          </el-row>
          <el-row style="margin-left:30px">
            <el-col>
              <el-button plain icon="el-icon-plus" @click="addshortageMonitorParm"></el-button>
            </el-col>
          </el-row>
        </el-form-item>

        <el-form-item label="是否激活" prop="type">
          <el-switch v-model="ruleForm.activeFlag"></el-switch>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="openDialog">保存</el-button>
          <el-button type="primary" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </basic-container>
    <el-dialog title="提示" :visible.sync="dialogVisible" append-to-body>
      <span>是否立即使用该公式计算产品?</span>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="save">不计算只保存</el-button>
        <el-button type="primary" @click="calc">立即计算保存</el-button>
        <el-button @click="cancel1">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import BasicContainer from '@vue-materials/basic-container'
import { mapActions, mapState } from 'vuex'
import { fetchData, showToast } from '@/common/common'
import apis from '@/apis'

export default {
  components: { BasicContainer },
  name: 'BasicForm',

  created() {
    this.getCycleType()
    this.getTransportType()
    if (this.$route.params.formulaId != null) {
      this.edit = true
      this.getEditData()
    }
  },

  data() {
    let vm = this
    const checkStart = (item, index, arr) => (rule, value, callback) => {
      callback()
      if (index === arr.length - 1) {
        callback()
      }
      if (value > item.largeRankingEnd) {
        callback(new Error(`输入值不能大于${item.largeRankingEnd}`))
      }
      callback()
    }
    const checkEnd = (item, index, arr) => (rule, value, callback) => {
      if (index === arr.length - 1) {
        callback()
      }
      if (value == null || value === '') {
        callback(new Error('不能为空'))
      }
      if (value < item.largeRankingStart) {
        callback(new Error(`输入值不能小于${item.largeRankingStart}`))
      }
      callback()
    }
    return {
      numStart(item, index, arr) {
        return [
          {
            required: true,
            message: '不能为空',
            trigger: ['blur', 'change']
          },
          {
            validator: checkStart(item, index, arr),
            trigger: ['blur', 'change']
          }
        ]
      },
      numEnd(item, index, arr) {
        return [
          // {
          //   required: true,
          //   message: '不能为空',
          //   trigger: ['blur', 'change']
          // },
          {
            validator: checkEnd(item, index, arr),
            trigger: ['blur', 'change']
          }
        ]
      },
      dialogVisible: false,
      show: false,

      ruleForm: {
        // 要提交的数据
        calculationFlag: false,
        formuleName: '',
        cycleType: undefined,
        cycleMonitorParm: [
          {
            judgementType: 1,
            day: undefined,
            bsrRanking: [
              {
                largeRankingStart: 1,
                largeRankingEnd: undefined,
                cycle: undefined,
                range: undefined,
                rangeValue: undefined
              },
              {
                largeRankingStart: undefined,
                largeRankingEnd: undefined,
                cycle: undefined,
                range: undefined,
                rangeValue: undefined
              }
            ]
          },
          {
            judgementType: 2,
            day: undefined,
            bsrRanking: [
              {
                largeRankingStart: 1,
                largeRankingEnd: undefined,
                cycle: undefined,
                range: undefined,
                rangeValue: undefined
              },
              {
                largeRankingStart: undefined,
                largeRankingEnd: undefined,
                cycle: undefined,
                range: undefined,
                rangeValue: undefined
              }
            ]
          }
        ],
        shortageMonitorParm: [
          {
            transportFirstId: null,
            insuredDays: undefined,
            stockDays: undefined,
            transportDays: undefined
          }
        ],
        avgDays: undefined,
        activeFlag: true
      },
      rules: {
        formuleName: [{ required: true, message: '请输入名称' }],
        cycleType: [{ required: true, message: '请选择生命周期' }]
      }
    }
  },
  methods: {
    linkToAdd() {
      location.href = '/WarehousingLogisticsManagement.html'
      // window.open('/WarehousingLogisticsManagement.html')
    },
    validateLeft(item, index, cycleIndex) {
      let start = 0
      if (index >= 1) {
        start = this.ruleForm.cycleMonitorParm[cycleIndex].bsrRanking[index - 1]
          .largeRankingEnd
      }
      return (rule, value, callback) => {
        if (index === 0) {
          callback()
          return
        }
        if (value > start) {
          callback(new Error('太大'))
        } else {
          callback(new Error('太小'))
        }
      }
    },

    handleNumInput(item, index, val) {
      // item.day = ~~val
      this.$set(item, 'day', ~~val)
      let next = this.ruleForm.cycleMonitorParm[index + 1]
      let prev = this.ruleForm.cycleMonitorParm[index - 1]
      if (next) {
        this.$set(next, 'day', val)
      }
      if (prev) {
        this.$set(prev, 'day', val)
      }
    },
    cancel() {
      this.$router.push('/IntelligentReplenishment/setCalculate')
    },
    // 编辑进入获取数据
    getEditData() {
      fetchData({
        ...apis.REPLENISHFORMULA_INFO,
        data: {
          formulaId: +this.$route.params.formulaId
        }
      }).then(res => {
        if (res.data.code === 0) {
          if (
            res.data.rows.cycleMonitorParm == '' ||
            res.data.rows.cycleMonitorParm == null
          ) {
            delete res.data.rows.cycleMonitorParm
          }
          this.ruleForm = {
            ...this.ruleForm,
            ...this.getTrueData(res.data.rows)
          }
        }
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    // 移除缺货
    removeshortageMonitorParm(index) {
      this.ruleForm.shortageMonitorParm.splice(index, 1)
    },
    // 增加缺货
    addshortageMonitorParm(index) {
      this.ruleForm.shortageMonitorParm.push({
        transportFirstId: null,
        insuredDays: undefined,
        stockDays: undefined,
        transportDays: undefined
      })
    },

    // 增加Bsr
    addBsr(i, index) {
      this.ruleForm.cycleMonitorParm[i].bsrRanking.push({
        largeRankingStart: this.ruleForm.cycleMonitorParm[i].bsrRanking[index]
          .largeRankingEnd,
        largeRankingEnd: undefined,
        cycle: undefined,
        range: undefined,
        rangeValue: undefined
      })
      if (
        this.ruleForm.cycleMonitorParm[i].bsrRanking[index].largeRankingEnd ===
        1
      ) {
        this.ruleForm.cycleMonitorParm[i].bsrRanking[
          index
        ].largeRankingEnd = undefined
        this.ruleForm.cycleMonitorParm[i].bsrRanking[
          index + 1
        ].largeRankingStart = undefined
      }
    },

    delBsr(i, index) {
      const bsrList = this.ruleForm.cycleMonitorParm[i].bsrRanking
      if (index !== 0) {
        bsrList.splice(index, 1)
        if (index === bsrList.length - 1) {
          bsrList[bsrList.length - 1].largeRankingEnd = undefined
        }
      } else {
        bsrList.splice(1, 1)
        if (bsrList[1]) {
          bsrList[0].largeRankingEnd = bsrList[1].largeRankingStart - 1
        }
      }
      bsrList[index].largeRankingStart = bsrList[index - 1].largeRankingEnd + 1
      // bsrList[index].largeRankingEnd = null;
    },

    setStartEqualVal(item, index, val, bsrRanking, cycleIndex) {
      try {
        this.$refs.ruleForm.validateField(
          'cycleMonitorParm[' +
            cycleIndex +
            '].bsrRanking[' +
            index +
            '].largeRankingEnd'
        )
      } catch (error) {}

      if (index < 1) {
        return
      }
      if (!val) {
        bsrRanking[index - 1].largeRankingEnd = undefined
        return
      }
      bsrRanking[index - 1].largeRankingEnd = +val - 1
    },

    setEndEqualVal(item, index, val, bsrRanking, cycleIndex) {
      this.$set(item, 'largeRankingEnd', val || undefined)
      // item.largeRankingEnd = val
      try {
        this.$refs.ruleForm.validateField(
          'cycleMonitorParm[' +
            cycleIndex +
            '].bsrRanking[' +
            index +
            '].largeRankingStart'
        )
      } catch (error) {}

      if (bsrRanking[index + 1]) {
        bsrRanking[index + 1].largeRankingStart = +val + 1
      }
    },

    openDialog() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          this.dialogVisible = true
        }
      })
    },

    save() {
      // this.dialogVisible = true;
      this.ruleForm.calculationFlag = false
      this.saveApi()
    },

    calc() {
      this.ruleForm.calculationFlag = true
      this.saveApi()
    },

    cancel1() {
      this.dialogVisible = false
      // this.$router.push("/IntelligentReplenishment/setCalculate");
    },

    getTrueData(ruleform) {
      let _data = JSON.parse(JSON.stringify(ruleform))
      let data = []
      if (_data.cycleMonitorParm) {
        _data.cycleMonitorParm.forEach(el => {
          let ranks = el.bsrRanking
          let _ranks = []
          for (let i = 0; i < ranks.length; i++) {
            const element = ranks[i]
            const largeRankingStart = element.largeRankingEnd
            const largeRankingEnd = element.largeRankingStart
            _ranks.push({
              ...element,
              largeRankingStart:
                largeRankingStart == null ? 0 : largeRankingStart,
              largeRankingEnd
            })
          }
          ranks = _ranks.reverse()
          el.bsrRanking = ranks
          data.push(el)
        })
      }

      _data.cycleMonitorParm = data
      return _data
    },

    saveApi() {
      let api = apis.REPLENISHFORMULA_SAVE
      if (this.edit) {
        api = apis.REPLENISHFORMULA_UPDATE
      }
      // let _data = JSON.parse(JSON.stringify(this.ruleForm))
      // let data = []
      // _data.cycleMonitorParm.forEach(el => {
      //   let ranks = el.bsrRanking
      //   let _ranks = []
      //   for (let i = 0; i < ranks.length; i++) {
      //     const element = ranks[i]
      //     const largeRankingStart = element.largeRankingEnd
      //     const largeRankingEnd = element.largeRankingStart
      //     _ranks.push({
      //       ...element,
      //       largeRankingStart:
      //         largeRankingStart == null ? 0 : largeRankingStart,
      //       largeRankingEnd
      //     })
      //   }
      //   ranks = _ranks.reverse()
      //   el.bsrRanking = ranks
      //   data.push(el)
      // })

      // _data.cycleMonitorParm = data

      let _data = this.getTrueData(this.ruleForm)

      fetchData({ ...api, data: _data }).then(res => {
        if (res.data.code === 0) {
          showToast('success', res.data.msg)
          this.$router.push('/IntelligentReplenishment/setCalculate')
        } else {
          showToast('error', res.data.msg)
        }
      })
    },

    ...mapActions(['getCycleType', 'getTransportType'])
  },
  computed: mapState(['transportType']),
  watch: {
    'ruleForm.cycleType'(val) {
      if (val === 2) {
        this.show = false
      } else {
        this.show = true
      }
    }
  }
}
</script>

<style lang='scss'>
.flex {
  display: flex;
}
</style>

