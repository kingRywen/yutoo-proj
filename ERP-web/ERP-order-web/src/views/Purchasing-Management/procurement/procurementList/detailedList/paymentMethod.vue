<template>
  <!--
        typeShow  
        1.批量設置付款方式  
        2.批量设置采购人员
        
      
  -->
  <div class="paymentMethod">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-form-item label="付款方式：" prop="paymentMethod" v-if="typeShow==1">
        <el-select v-model="ruleForm.paymentMethod" placeholder="请选择付款方式 " style="width:100%;">
          <el-option :label="i.label" :value="i.value" v-for="i in paymentMethod" :key="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="采购人员：" prop="purchasersId" v-if="typeShow==2">
        <el-select v-model="ruleForm.purchasersId" placeholder="请选择采购人员" style="width:100%;">
          <el-option :label="i.nickName" :value="i.userId" v-for="i in allHandleUser.procurement" :key="i.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item
        label="选择时间："
        prop="time"
        v-if="typeShow==3 || typeShow==4 ||typeShow==5||typeShow==6 || typeShow==7"
      >
        <el-date-picker
          v-model="ruleForm.time"
          type="datetimerange"
          value-format="yyyy-MM-dd HH:mm:ss"
          :picker-options="pickerOptions2"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
          style="width:100%;"
        ></el-date-picker>
      </el-form-item>

      <el-form-item style="color:#f56c6c">
        <template v-if="typeShow==3">说明：根据生单时间导出SKU的销单</template>
        <template v-if="typeShow==4 || typeShow==5 || typeShow==6 || typeShow==7">说明：根据生单时间导出SKU的销单金额数据</template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable */
import { mapActions, mapGetters } from 'vuex'
export default {
  props: {
    purchaseIds: {
      type: Array,
      default: () => []
    },
    typeShow: [String, Number]
  },
  data() {
    return {
      pickerOptions2: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      ruleForm: {
        paymentMethod: null,
        purchasersId: null,
        time: []
      },
      rules: {
        paymentMethod: [
          {
            required: true,
            message: '请选择付款方式',
            trigger: 'change'
          }
        ],
        purchasersId: [
          {
            required: true,
            message: '请选择采购人员',
            trigger: 'change'
          }
        ],
        time: [
          {
            required: true,
            message: '请选择导出时间',
            trigger: 'change'
          }
        ]
      },
      paymentMethod: [
        { label: '现金付款', value: 1 },
        { label: '网络在线付款', value: 2 },
        { label: '转账付款', value: 3 },
        { label: '阿里账期付款', value: 4 }
      ]
    }
  },
  computed: {
    ...mapGetters('common', ['allHandleUser'])
  },
  methods: {
    //1.批量設置付款方式   //2.批量设置采购人员
    setPMAndpurchasers(url, params, callback) {
      let _this = this
      _this.$api['procurement/' + url](params)
        .then(res => {
          callback && callback(true)
          _this.$message.success(res.msg)
        })
        .catch(err => {
          callback && callback(false)
        })
    },
    //3.sku采购总额报表
    exportExcel(url, callback) {
      let params = {
        startTime: this.ruleForm.time[0],
        endTime: this.ruleForm.time[1]
      }
      this.$api['procurement/' + url](params)
        .then(res => {
          callback && callback(true)
          window.location.href = res.path
        })
        .catch(err => {
          this.$message.error(err.msg)
        })
    },
    submitForm(callback) {
      let _this = this
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let url
          let params
          switch (_this.typeShow) {
            case 1:
              url = 'setPaymentMethod'
              params = {
                purchaseIds: _this.purchaseIds,
                paymentMethod: _this.ruleForm.paymentMethod
              }
              this.setPMAndpurchasers(url, params, callback)
              break
            case 2:
              url = 'updatePurchasers'
              params = {
                purchaseIds: _this.purchaseIds,
                purchasersId: _this.ruleForm.purchasersId
              }
              this.setPMAndpurchasers(url, params, callback)
              break
            case 3:
              url = 'purchaseTotal'
              this.exportExcel(url, callback)
              break
            case 4:
              url = 'purchaseQuantity'
              this.exportExcel(url, callback)
              break
            case 5:
              url = 'purchaseSchedule'
              this.exportExcel(url, callback)
              break
            case 7:
              url = 'purchaseTotalBySupp'
              this.exportExcel(url, callback)
              break
            default:
              break
          }
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs.ruleForm.resetFields()
    },
    ...mapActions('common', ['initCommonList', 'getHandleUser'])
  },
  mounted() {
    // this.initCommonList(3)
    this.getHandleUser()
  }
}
</script>
