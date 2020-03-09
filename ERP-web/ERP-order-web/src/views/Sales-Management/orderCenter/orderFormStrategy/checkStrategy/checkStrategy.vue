<template lang="html">
    <!-- 审核策略 -->
    <el-form :model="form"  ref="form" label-width="150px" class="checkStrategy" size="small">
        <div class="btnbox">
            <el-button type="primary" @click="submitForm('form')" size="small">
                <i class="el-icon-edit"></i>
                {{ disabled?'编辑':'保存' }}
            </el-button>
        </div>
        <!--  -->
        <div class="numBox">
            <p>订购产品数量：</p>
            <div class="numContent">
                <div class="item" v-for='(item,index) in form.productNum' :key="index">
                    <el-form-item label="同一客户在：">
                        <el-input-number v-model="item.days" controls-position="right" :min="1"  :disabled="disabled"/>
                    </el-form-item>
                    <span class="day">天内，</span>
                    <el-form-item label="订购产品数量超过：">
                        <el-input-number v-model="item.quantity" controls-position="right" :min="1"  :disabled="disabled"/>
                    </el-form-item>
                    <span class="day">个</span>
                    <div class="el-icon-circle-plus-outline push"
                        @click="increase(1,index,item)" v-if="index==form.productNum.length-1 && !disabled"></div>
                    <div class="el-icon-remove-outline push"
                        @click="reduce(1,index,item)" v-if="index>0 && index==form.productNum.length-1 && !disabled"></div>
                </div>
            </div>
        </div>
        <!--  -->
        <div class="numBox">
            <p>退款数量：</p>
            <div class="numContent">
                <div class="item" v-for='(item,index) in form.refundNum' :key="index">
                    <el-form-item label="同一客户在：">
                        <el-input-number v-model="item.days" controls-position="right" :min="1"  :disabled="disabled"/>
                    </el-form-item>
                    <span class="day">天内，</span>
                    <el-form-item label="退款数量超过：">
                        <el-input-number v-model="item.quantity" controls-position="right" :min="1"  :disabled="disabled"/>
                    </el-form-item>
                    <span class="day">个</span>
                    <div class="el-icon-circle-plus-outline push"
                        @click="increase(2,index,item)" v-if="index==form.refundNum.length-1 && !disabled"></div>
                    <div class="el-icon-remove-outline push"
                        @click="reduce(2,index,item)" v-if="index>0 && index==form.refundNum.length-1 && !disabled"></div>
                </div>
            </div>
        </div>
        <!--  -->
        <div class="numBox">
            <p>差评数量：</p>
            <div class="numContent">
                <div class="item" v-for='(item,index) in form.NegativeNum' :key="index">
                    <el-form-item label="同一客户在：">
                        <el-input-number v-model="item.days" controls-position="right" :min="1"  :disabled="disabled"/>
                    </el-form-item>
                    <span class="day">天内，</span>
                    <el-form-item label="差评数量超过：">
                        <el-input-number v-model="item.quantity" controls-position="right" :min="1" :disabled="disabled"/>
                    </el-form-item>
                    <span class="day">个</span>
                    <div class="el-icon-circle-plus-outline push"
                        @click="increase(3,index,item)" v-if="index==form.NegativeNum.length-1 && !disabled"></div>
                    <div class="el-icon-remove-outline push"
                        @click="reduce(3,index,item)" v-if="index>0 && index==form.NegativeNum.length-1 && !disabled"></div>
                </div>
            </div>
        </div>
        <p style="color: #409EFF;font-size:14px;">满足以上任意条件，订单转换为待审核状态</p>
        <ul class="switchList">
            <li>
               <el-switch inactive-text="黑名单订单自动进入审核" v-model="form.blacklistAutoFlag" :disabled='disabled'></el-switch>
            </li>
            <li>
                <el-switch inactive-text="订单金额低于最低产品销售总额自动进入审核" v-model="form.orderAmountFlag" :disabled='disabled'></el-switch>
            </li>
            <li>
                <el-switch inactive-text="白名单订单全部正常" v-model="form.whitelistAutoFlag" :disabled='disabled'></el-switch>
            </li>
        </ul>


    </el-form>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      form: {
        blacklistAutoFlag: false,
        orderAmountFlag: false,
        whitelistAutoFlag: false,
        productNum: [
          {
            quantity: '',
            days: '',
            type: 1
          }
        ],
        refundNum: [
          {
            quantity: '',
            days: '',
            type: 2
          }
        ],
        NegativeNum: [
          {
            quantity: '',
            days: '',
            type: 3
          }
        ]
      },
      disabled: true
    }
  },
  methods: {
    reduce(type, index) {
      if (type == 1) {
        this.form.productNum.splice(index, 1)
      } else if (type == 2) {
        this.form.refundNum.splice(index, 1)
      } else {
        this.form.NegativeNum.splice(index, 1)
      }
    },
    //增加
    increase(type, index, item) {
      if (type == 1) {
        this.add(type, index, item, 'productNum')
      } else if (type == 2) {
        this.add(type, index, item, 'refundNum')
      } else {
        this.add(type, index, item, 'NegativeNum')
      }
    },
    add(type, index, item, arrName) {
      let obj = {
        quantity: '',
        days: '',
        type: item.type
      }
      if (index == 0) {
        this.form[arrName].push(obj)
      } else {
        let lastq = this.form[arrName][index - 1].quantity
        let lastd = this.form[arrName][index - 1].days
        let isQuantity = item.quantity > lastq
        let isDays = item.days > lastd
        if (!isDays) {
          this.$message.warning('当前天数需大于上一条数据天数')
          return
        }
        if (!isQuantity) {
          this.$message.warning('当前添加数量需大于上一条数据数量')
          return
        }
        if (isQuantity && isDays) {
          this.form[arrName].push(obj)
        }
      }
    },
    getInfo() {
      this.$api['order/strategyExamineInfo']()
        .then(res => {
          let data = res.rows
          this.form.blacklistAutoFlag = data.blacklistAutoFlag ? true : false
          this.form.orderAmountFlag = data.orderAmountFlag ? true : false
          this.form.whitelistAutoFlag = data.whitelistAutoFlag ? true : false

          if (data.details.length) {
            let arr = data.details
            this.form.productNum = arr.filter(i => i.type == 1)
            this.form.refundNum = arr.filter(i => i.type == 2)
            this.form.NegativeNum = arr.filter(i => i.type == 3)
          }
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    isAccordWith() {
      let productNum = this.form.productNum
      let productlen = productNum.length
      let refundNum = this.form.refundNum
      let refundlen = refundNum.length
      let NegativeNum = this.form.NegativeNum
      let Negativelen = NegativeNum.length
      let arr = []
      if (productlen > 1) {
        let a = productNum[productlen - 1].quantity
        let b = productNum[productlen - 1].days
        let c = productNum[productlen - 2].quantity
        let d = productNum[productlen - 2].days
        if (a > c) {
          arr.push(true)
        } else {
          this.$message.warning('订购产品数量最后项需大于前一项')
          return false
        }
        if (b > d) {
          arr.push(true)
        } else {
          this.$message.warning('订购产品数量天数最后项需大于前一项')
          return false
        }
      } else {
        arr.push(true)
      }
      if (refundlen > 1) {
        let a = refundNum[refundlen - 1].quantity
        let b = refundNum[refundlen - 1].days

        let c = refundNum[refundlen - 2].quantity
        let d = refundNum[refundlen - 2].days
        if (a > c) {
          arr.push(true)
        } else {
          this.$message.warning('退款数量最后项需大于前一项')
          return false
        }
        if (b > d) {
          arr.push(true)
        } else {
          this.$message.warning('退款数量天数最后项需大于前一项')
          return false
        }
      } else {
        arr.push(true)
      }
      if (Negativelen > 1) {
        let a = NegativeNum[Negativelen - 1].quantity
        let b = NegativeNum[Negativelen - 1].days

        let c = NegativeNum[Negativelen - 2].quantity
        let d = NegativeNum[Negativelen - 2].days
        if (a > c) {
          arr.push(true)
        } else {
          this.$message.warning('差评数量最后项需大于前一项')
          return false
        }
        if (b > d) {
          arr.push(true)
        } else {
          this.$message.warning('差评数量天数最后项需大于前一项')
          return false
        }
      } else {
        arr.push(true)
      }
      let result = arr.every(item => item == true)
      return result
    },
    submitForm(formName) {
      this.disabled = !this.disabled
      if (this.disabled && this.isAccordWith()) {
        let params = {
          blacklistAutoFlag: this.form.blacklistAutoFlag ? 1 : 0,
          orderAmountFlag: this.form.orderAmountFlag ? 1 : 0,
          whitelistAutoFlag: this.form.whitelistAutoFlag ? 1 : 0,
          details: [].concat(
            [],
            this.form.productNum,
            this.form.refundNum,
            this.form.NegativeNum
          )
        }
        this.$api['order/strategyExamineSave'](params)
          .then(res => {
            this.$message.success(res.msg)
          })
          .catch(err => {
            this.$message.error(err.msg)
          })
      } else {
        this.disabled = false
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  },
  mounted() {
    this.getInfo()
  }
}
</script>

<style lang="scss">
.checkStrategy {
  padding: 10px 200px 10px 50px;
  box-sizing: border-box;
  height: 100%;
  overflow-y: auto;
  .btnbox {
    text-align: right;
    margin-bottom: 10px;
  }
}
.numBox {
  margin-bottom: 20px;
  p {
    margin-bottom: 10px;
  }
  .numContent {
    padding: 18px 10px 0 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    .item {
      display: flex;
      .selectDay {
        width: 100px;
      }
      .day {
        margin-left: 10px;
        line-height: 32px;
        width: 80px;
        font-size: 14px;
      }
      .push {
        line-height: 32px;
        font-size: 25px;
        cursor: pointer;
        color: #409eff;
        margin-right: 10px;
        &:hover {
          color: #409eff;
        }
      }
    }
  }
}
.switchList {
  margin-top: 10px;
  li {
    margin-bottom: 10px;
    .el-switch__label {
      color: #333;
    }
  }
}
</style>
