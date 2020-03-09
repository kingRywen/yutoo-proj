<template>
  <div class="w1100 mainView" v-loading="mainLoading">
    <el-form :model="formData" ref="formData">
      <div class="title_content">
        <div>说明</div>
        <p>选着时间断（默认近1年），配置需要计算的的公式，点击分析，会根据公式计算出结果</p>
      </div>
      <div class="time_content">
        <el-form-item prop="rangeTime" :rules="{required:true,message:'请选择时间'}">
          <el-date-picker v-model="formData.rangeTime" type="daterange" size="small" value-format="yyyy-MM-dd"></el-date-picker>
        </el-form-item>
      </div>
      <div class="rule_content">
        <el-form-item class="form_item" prop="expression" :rules="strategyRule(formData)">
          <div class="lebelBox">
            <div class="lebelBtn">
              <div>链接符号</div>
              <el-button
                type="info"
                size="small"
                v-for="(itemBtn,indexBtn) in ruleList"
                :key="itemBtn"
                :style="{marginLeft: indexBtn == 0 ? '10px' : null,width: '40px'}"
                @click="addBtnMethod(itemBtn)"
              >{{itemBtn}}</el-button>
              <div>条件</div>
              <el-button
                type="info"
                size="small"
                v-for="(itemBtn,indexBtn) in ruleNames"
                :key="itemBtn"
                :style="{marginLeft: indexBtn == 0 ? '10px' : null}"
                @click="addBtnMethod(itemBtn)"
              >{{itemBtn}}</el-button>
            </div>
            <div class="lebel">
              <draggable v-model="formData.formula" @start="drag=true" @end="drag=false" class="draggable">
                <div v-for="(itemChild,indexChild) in formData.formula" :key="indexChild" class="formula-btn">
                  <div class="btn-txt">
                    <div>{{itemChild}}</div>
                  </div>
                  <i class="el-icon-circle-close" @click="btnClose(indexChild)"></i>
                </div>
              </draggable>
            </div>
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { resultData } from '../js/add.js'
export default {
  props: ['params'],
  data() {
    let { today, computedDay } = this.cfuns.getDay(365)
    return {
      formData: {
        rangeTime: [computedDay, today],
        formula: []
      },
      mainLoading: false,
      ruleNameList: [],
      ruleList: ['+', '-', '(', ')']
    }
  },
  methods: {
    _submit() {
      return this.$refs.formData.validate().then(() => {
        let [startTime, endTime] = this.formData.rangeTime
        let params = {
          ...this.storeInfo,
          merchantTaskId: 1,
          startTime,
          endTime,
          groupIds: [
            ...new Set(
              this.formData.formula
                .filter(e => e !== '+' && e !== '-' && e !== '(' && e !== ')')
                .map(e => this.ruleNameList.find(i => i.ruleName === e).ruleId)
            )
          ],
          formula: resultData(this.formData.formula, this.ruleNameList)
        }
        return this.$api[
          'proPick/categoryDepthTaskMerchantProductAttrAnalysis'
        ](params)
      })
    },
    strategyRule(e) {
      let checkStrategy = (rule, value, cb) => {
        if (e.formula && e.formula.length === 0) cb(new Error('请选择条件配置'))
        if (
          e.formula.every(e => {
            return e === '+' || e === '-' || e === '(' || e === ')'
          })
        )
          cb(new Error('请至少选择一个条件'))
        cb()
      }
      return [{ validator: checkStrategy }]
    },
    addBtnMethod(item) {
      this.formData.formula.push(item)
    },
    btnClose(indexChild) {
      this.formData.formula.splice(indexChild, 1)
    },
    getRuleData() {
      this.mainLoading = true
      let params = {
        ...this.storeInfo,
        merchantTaskId: 1
      }
      this.$api['proPick/categoryDepthTaskMerchantGroupList'](params)
        .then(res => {
          if (res.data) {
            for (let i in res.data) {
              if (i.indexOf('groupName') == -1) {
                return
              }
              this.ruleNameList.push({
                ruleName: res.data[i],
                ruleId: parseInt(i.slice(9))
              })
            }
          }
          this.mainLoading = false
        })
        .catch(() => {
          this.mainLoading = false
        })
    }
  },
  computed: {
    ruleNames() {
      let list = this.ruleNameList.map(e => e.ruleName)
      return list
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getRuleData()
    })
  },
  components: {
    draggable
  }
}
</script>

<style lang="scss" scoped>
@import '../css/add.scss';
</style>