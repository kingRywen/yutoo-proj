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
import { resultData, validLegal } from './propAdd'
export default {
  props: ['params'],
  data() {
    let { today, computedDay } = this.cfuns.getDay(365)
    return {
      merchantTaskId: +this.$route.query.id,
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
      let formulaStr = this.formData.formula
        .map(e => (e !== '+' && e !== '-' && e !== '(' && e !== ')' ? 0 : e))
        .join('')
      const groupNames = [
        ...new Set(
          this.formData.formula.filter(
            e => e !== '+' && e !== '-' && e !== '(' && e !== ')'
          )
        )
      ]
      const groupIds = groupNames.map(
        e => this.ruleNameList.find(i => i.ruleName === e).ruleId
      )
      if (!validLegal(this.formData.formula.join(''), groupNames)) {
        this.$message.warning('计算公式格式错误')
        return Promise.reject()
      }

      return this.$refs.formData.validate().then(() => {
        let [startTime, endTime] = this.formData.rangeTime
        let params = {
          ...this.storeInfo,
          merchantTaskId: this.merchantTaskId,
          startTime,
          endTime,
          groupIds,
          formula: resultData(this.formData.formula, this.ruleNameList),
          formulaStr
        }
        return this.$api[
          'proPick/categoryDepthTaskMerchantProductAttrAnalysis'
        ](params).then(data => {
          const { href } = this.$router.resolve({
            path: '/proPick/deepCateAnalyze/detail/propsAnalysis',
            query: {
              data: JSON.stringify(data.data)
            }
          })
          window.open(href)
          return Promise.resolve(false)
        })
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
      this.mainLoading = false
      // debugger
      let params = {
        ...this.storeInfo,
        dataFlag: true,
        merchantTaskId: this.merchantTaskId
      }
      this.$api['proPick/categoryDepthTaskMerchantGroupList'](params)
        .then(res => {
          if (res.data) {
            for (let i in res.data) {
              if (i.indexOf('groupName') !== -1) {
                this.ruleNameList.push({
                  ruleName: res.data[i],
                  ruleId: parseInt(i.slice(9))
                })
              }
            }
          }
          this.mainLoading = false
        })
        .catch(e => {
          console.error(e)
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
.mainView {
  .title_content {
    > * {
      font-size: 12px;
    }
    > div:nth-child(1) {
      display: inline-block;
      background: rgb(0, 152, 152);
      font-size: 13px;
      padding: 3px 19px;
      border-radius: 4px;
      color: #fff;
      margin-right: 10px;
    }
  }
  .rule_content {
    width: 100%;
    height: auto;
    .form_item {
      .lebelBox {
        display: flex;
        flex-direction: row;
        .lebelBtn {
          min-height: 200px;
          width: 210px;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
          margin-right: 10px;
          > div {
            width: 100%;
            background: rgb(242, 242, 242);
            text-align: center;
            display: block;
            height: 30px;
            line-height: 30px;
          }
          .el-button {
            padding: 8px 10px;
          }
        }
        .lebel {
          min-height: 200px;
          width: 330px;
          padding: 10px;
          border: 1px solid #dcdfe6;
          border-radius: 5px;
          margin-right: 10px;
          .el-checkbox {
            &:first-child {
              margin-right: 10px;
            }
          }
          .el-checkbox.is-bordered + .el-checkbox.is-bordered {
            margin: 0 10px 0 0;
          }
          &:last-child {
            flex: 1;
            margin-right: 0;
            .tag {
              margin-right: 10px;
              margin-bottom: 15px;
              position: relative;
              .rulehint {
                position: absolute;
                left: 0;
                bottom: -26px;
                color: #f56c6c;
              }
            }
            .ruleinput {
              width: 30px;
              .el-input__inner {
                padding: 0;
                text-align: center;
              }
            }
          }
          .draggable {
            padding: 5px 0 5px 10px;
            display: flex;
            flex-wrap: wrap;
            .formula-btn {
              margin-right: 10px;
              margin-bottom: 10px;
              font-size: 12px;
              display: flex;
              height: 25px;
              line-height: 25px;
              margin-bottom: 30px;
              .btn-txt {
                cursor: move;
                padding-top: 0px;
                > div {
                  background: rgb(188, 188, 188);
                  color: #fff;
                  padding: 0 10px 0 10px;
                  margin-top: 8px;
                  border-radius: 4px;
                }
              }
              /deep/ [class^='el-icon-'] {
                font-size: 10px;
                width: 10px;
                height: 10px;
                color: red;
                cursor: pointer;
              }
            }
          }
        }
      }
      &:last-child {
        div {
          // margin-left: 80px;
        }
      }
    }
  }
}
</style>