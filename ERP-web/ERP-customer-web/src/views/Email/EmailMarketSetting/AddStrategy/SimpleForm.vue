<template>
  <div>
    <div class="chose-rule">
      <el-button icon="el-icon-plus" class="addbtn martop marleft10" @click="addRule"></el-button>
      <el-button icon="el-icon-delete" v-if="deleteFlag" class="addbtn martop" @click="deleteRule"></el-button>
      <el-row class="mar10"></el-row>
      <el-form style="overflow:hidden;border-top: 1px solid #ebeef5;">
        <simple-item :label="'订单发货方式'" :selectValue="ruleForm.checkList" @change="change" class="simple-item">
          <el-select class="mar10" style="width: 120px" v-model="ruleForm.orderType">
            <el-option label="FBA订单" value="1"></el-option>
            <el-option label="FBM订单" value="2"></el-option>
          </el-select>
          <el-select class="mar10" style="width: 120px" v-model="ruleForm.dateType">
            <el-option label="订单发货后" value="1"></el-option>
            <el-option label="订单生产后" value="2"></el-option>
            <el-option label="订单到货后" value="3"></el-option>
          </el-select>
          <el-input v-model="ruleForm.laterTime" class="date-space" type="number"></el-input>
          <span>天</span>
        </simple-item>
        <simple-item :label="'卖家'" :selectValue="ruleForm.checkList" @change="change">
          <el-checkbox true-label="1" false-label="0" label="排除留下过差评的买家" v-model="ruleForm.excludeDifferenceBuyerFlag"></el-checkbox>
          <el-checkbox true-label="1" false-label="0" label="排除留下过中评的买家" v-model="ruleForm.excludeMediumBuyerFlag"></el-checkbox>
          <el-checkbox true-label="1" false-label="0" label="排除已有差评或中评的订单" v-model="ruleForm.excludeOrBuyerFlag"></el-checkbox>
        </simple-item>
        <simple-item :label="'订单'" :selectValue="ruleForm.checkList" @change="change">
          <el-checkbox true-label="1" false-label="0" label="排除已退款的订单" v-model="ruleForm.excludeRefundOrderFlag"></el-checkbox>
          <el-checkbox true-label="1" false-label="0" label="排除已被取消的订单" v-model="ruleForm.excludeCancelOrderFlag"></el-checkbox>
          <el-checkbox
            true-label="1"
            false-label="0"
            label="排除有往来邮件(Buyer message)的订单"
            v-model="ruleForm.excludeEmailOrderFlag"
          ></el-checkbox>
        </simple-item>
        <simple-item :label="'品牌'" :selectValue="ruleForm.checkList" @change="change">
          <el-checkbox true-label="1" false-label="0" class="pad8" v-model="ruleForm.brandTypeChecked">排除</el-checkbox>
          <el-select class="pad8" v-model="ruleForm.brandType" placeholder="请选择">
            <el-option label="自主品牌" value="1"></el-option>
            <el-option label="非自主品牌" value="0"></el-option>
          </el-select>
          <span>的产品</span>
        </simple-item>
        <simple-item :label="'发货期限'" :selectValue="ruleForm.checkList" @change="change">
          <el-checkbox true-label="1" false-label="0" class="pad8" v-model="ruleForm.delayTimeChecked">从下订单日起算，排除</el-checkbox>
          <el-input v-model="ruleForm.delayTime" class="date-space" type="number"></el-input>
          <span>天后才出货的订单</span>
        </simple-item>
        <simple-item :label="'产品'" :selectValue="ruleForm.checkList" @change="change">
          <el-select class="mar10" v-model="ruleForm.asinFlag" placeholder="请选择">
            <el-option label="排除" value="1"></el-option>
            <el-option label="包含" value="2"></el-option>
          </el-select>
          <!-- asin -->
          <add-asin :asin="ruleForm.asin" @close="asinClose"></add-asin>
        </simple-item>
        <simple-item :label="'黑名单'" :selectValue="ruleForm.checkList" @change="change">
          <el-select class="mar10" v-model="ruleForm.blackListFlag" placeholder="请选择">
            <el-option label="排除" value="1"></el-option>
            <el-option label="不排除" value="0"></el-option>
          </el-select>
          <span class="marleft10">黑名单</span>
        </simple-item>
        <simple-item :label="'运输方式'" :selectValue="ruleForm.checkList" @change="change">
          <!-- 运输方式 -->
          <add-transports class="marleft10" :transports="ruleForm.transports" @close="transportsClose"></add-transports>
          <div class="sign-titles ellipsis-abbreviation">
            <span>{{ transports }}</span>
          </div>
        </simple-item>
        <simple-item :label="'发货时间'" :selectValue="ruleForm.checkList" @change="change">
          <span class="marleft10">发货</span>
          <el-input v-model="ruleForm.alertTime" class="date-space" type="number"></el-input>
          <span>天后，发送电邮通知买家</span>
        </simple-item>
      </el-form>
    </div>
    <yt-dialog :options="options">
      <div class="dialog-wrap">
        <el-form class="search-top-form dialog-form">
          <el-form-item>
            <el-row style="padding-left: 50px;">
              <el-col :span="24">
                <el-checkbox v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
              </el-col>
            </el-row>
            <el-checkbox-group style="padding-left: 50px;" v-model="ruleForm.checkList">
              <el-row>
                <el-col :span="8">
                  <el-checkbox label="订单发货方式"></el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="订单">排除订单</el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="发货期限"></el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="黑名单"></el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="发货时间"></el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="卖家">排除卖家</el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="品牌"></el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="产品"></el-checkbox>
                </el-col>
                <el-col :span="8">
                  <el-checkbox label="运输方式"></el-checkbox>
                </el-col>
              </el-row>
            </el-checkbox-group>
            <el-form-item class="saveBtn" label-width="0px">
              <el-button size="small" type="primary" @click="handleSure">确认</el-button>
            </el-form-item>
          </el-form-item>
        </el-form>
      </div>
    </yt-dialog>
  </div>
</template>

<script>
let defalutValue = [
  '订单发货方式',
  '订单',
  '发货期限',
  '黑名单',
  '发货时间',
  '卖家',
  '品牌',
  '产品',
  '运输方式'
]
import SimpleItem from './SimpleItem'
import AddAsin from '../../Comment/AddAsin'
import AddTransports from '../../Comment/AddTransports'
export default {
  props: ['forms'],
  components: {
    SimpleItem,
    AddAsin,
    AddTransports
  },
  data() {
    return {
      checkAll: false,
      deleteFlag: false,
      transports: '',
      exepte: [],
      options: {
        visible: false,
        title: '选择条件',
        width: '500px',
        fullscreen: false,
        top: '30vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: true,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      ruleForm: {
        checkList: []
      }
    }
  },
  computed: {},
  created() {},
  watch: {
    ruleForm: {
      immediate: true,
      deep: true,
      handler(val) {
        this.$emit('dataChange', JSON.parse(JSON.stringify(val)))
      }
    },
    forms: {
      immediate: true,
      deep: true,
      handler(val) {
        let vm = this
        val = vm.$.deepClone(val)
        val.brandTypeChecked = val.brandType ? '1' : '0'
        val.delayTimeChecked = val.delayTime ? '1' : '0'
        vm.ruleForm = Object.assign(
          {},
          {
            checkList: []
          },
          val
        )

        vm.deleteFlag = vm.ruleForm.checkList.length ? true : false

        if (!vm.ruleForm.transports) {
          return
        }
        vm.$api['order/getTransportTypeList']({
          type: 3
        })
          .then(data => {
            if (!data && !data.rows) {
              return
            }
            let arr = data.rows.map(item => {
              return {
                label: item.transportTypeName,
                value: item.transportTypeId
              }
            })
            vm.transports = vm.ruleForm.transports
              .map(item => {
                return arr.find(el => el.value == item).label
              })
              .join()
          })
          .catch(err => {
            console.log(err)
          })
      }
    }
  },
  methods: {
    handleCheckAllChange(val) {
      this.ruleForm.checkList = val ? defalutValue : []
    },
    change(label) {
      this.selected(label, this.ruleForm)
      let index = this.ruleForm.checkList.indexOf(label)
      this.ruleForm.checkList.splice(index, 1)
      if (!this.ruleForm.checkList.length) {
        this.deleteFlag = false
        this.$emit('clear')
      }
    },
    addRule() {
      this.deleteFlag = true
      this.options.visible = true
    },
    handleSure() {
      this.options.visible = false
    },
    deleteRule() {
      this.ruleForm = { checkList: [] }
      this.transports = ''
      this.deleteFlag = false
      this.$emit('clear')
    },
    getItemFormData() {
      let form = JSON.parse(JSON.stringify(this.ruleForm))
      if (form.brandTypeChecked != '1') {
        delete form.brandType
      }
      if (form.delayTimeChecked != '1') {
        delete form.delayTime
      }
      if (Array.isArray(form.checkList)) {
        form.checkList = form.checkList.join()
      }
      if (Array.isArray(form.transports)) {
        form.transports = form.transports.join()
      }
      if (Array.isArray(form.asin)) {
        form.asin = form.asin.join()
      }
      return form
    },
    selected(val, form) {
      let vm = this
      switch (val) {
        case '订单':
          delete form.excludeRefundOrderFlag
          delete form.excludeCancelOrderFlag
          delete form.excludeEmailOrderFlag
          break
        case '品牌':
          delete form.brandType
          break
        case '运输方式':
          delete form.transports
          vm.transports = ''
          break
        case '产品':
          delete form.asin
          delete form.asinFlag
          break
        case '发货期限':
          delete form.delayTimeChecked
          delete form.delayTime
          break
        case '卖家':
          delete form.excludeDifferenceBuyerFlag
          delete form.excludeMediumBuyerFlag
          delete form.excludeOrBuyerFlag
          break
        case '发货时间':
          delete form.alertTime
          break
        case '黑名单':
          delete form.blackListFlag
          break
        case '订单发货方式':
          delete form.orderType
          delete form.dateType
          delete form.laterTime
          break
      }
    },
    transportsClose(data) {
      this.transports = data
        .map(item => {
          return item.label
        })
        .join()
      let val = data.map(item => {
        return item.value
      })
      // this.ruleForm.transports = val
      this.$set(this.ruleForm, 'transports', val)
    },
    asinClose(data) {
      // this.ruleForm.asin = data
      this.$set(this.ruleForm, 'asin', data)
    }
  }
}
</script>
<style lang="scss">
.add-strategy {
  .dialog-wrap {
    width: 100%;
    border-top: 1px solid #bbbbbb;
    padding-top: 20px;
  }
  .table2 {
    height: 40px;
    line-height: 40px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    padding-left: 10px;
    .el-table .cell {
      padding-left: 0;
    }
  }
  .sign-titles {
    border: 1px solid rgb(163, 237, 255);
    border-radius: 4px;
    width: 340px;
    height: 33px;
    position: absolute;
    display: inline-block;
    top: 11px;
    left: 120px;
    & > span {
      display: block;
      height: 33px;
    }
    .close {
      border: none;
      padding: 5px;
      position: absolute;
      right: 0px;
      top: 10px;
      i {
        font-size: 18px;
      }
    }
  }
  .addbtn {
    padding: 6px;
    i {
      font-size: 20px;
    }
  }

  .must-fill-sign-div {
    @include must-fill-sign;
  }
  .cell.must-fill-sign {
    @include must-fill-sign;
  }
  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__content {
    line-height: 33px;
  }
  .channel-input {
    .el-input {
      width: 160px;
    }
  }
  .filtrate-input {
    padding-left: 18px;
    .el-input {
      width: 130px;
    }
  }
  .warp-input {
    .el-input {
      width: 250px;
    }
  }
  .search-wrap-right {
    padding-left: 18px;
  }

  .table-top14s {
    margin: 30px 0 20px 0;
  }
  .send-email {
    text-align: center;
    border: 1px solid #f2f2f2;
    color: rgb(0, 202, 67);
    padding: 10px;
    background: #f2f2f2;
  }
  .filtrate-input-time {
    padding-left: 0 !important;
    input {
      width: 120px;
    }
  }

  .condition-table {
    .input-width {
      .el-input {
        width: 426px;
      }
    }
  }
  .isChecked {
    margin-top: 14px;
    padding-left: 0px;
  }
  .must-table {
    .el-table th,
    .el-table td {
      padding: 6px 0 !important;
    }
  }
  .date-space {
    margin: 0 10px;
    width: 120px;
  }
  .chose-rule {
    margin-top: 10px;
    border: 1px solid #ebeef5;
    .simple-wrap {
      border-top: 1px solid #ebeef5;
      .simple-item {
        border: 1px solid #ebeef5;
        border-top: none;
        border-left: none;
      }
    }
  }
}
</style>
