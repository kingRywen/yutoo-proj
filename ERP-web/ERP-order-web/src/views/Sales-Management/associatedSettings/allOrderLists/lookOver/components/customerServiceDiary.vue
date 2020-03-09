<template lang="html">
    <el-form
        class="customerServiceDiary"
        :model="form"       
        ref="form"
        size="medium"
        label-width="100px">
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="订单号：" prop="customerIssueId">
                    {{ form.orderNumber }}
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="客户问题：" prop="customerIssueId">
                    <el-select v-model="form.customerIssueId" style="width:100%;" disabled>
                        <el-option :label="i.name" :value="i.customerIssueId" v-for="i in customerList"  :key="i.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="退货到仓库：" prop="returnWarehouseId">
                    <el-select v-model="form.returnWarehouseId" style="width:100%;" disabled>
                         <el-option :label="i.warehouseName" :value="i.warehouseId" v-for="i in warehouseList"  :key="i.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="退货代码：" prop="returnCode">
                    <el-input v-model="form.returnCode" disabled/>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="ODR：" prop="odr">
                    <el-select v-model="form.odr" style="width:100%;" disabled>
                        <el-option label="中评" value="1"></el-option>
                        <el-option label="差评" value="2"></el-option>
                        <el-option label="好评" value="3"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="处理方案：" prop="solution">
                    <el-select v-model="form.solution" style="width:100%" disabled>
                        <el-option :label="i.label" :value="i.value" v-for="i in solutionList" :key="i.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-col>
        </el-row>
        <el-row :gutter="20">
            <el-col :span="12">
                <el-form-item label="跟进时间：" prop="followUpTime">
                    <el-date-picker
                        disabled
                        style="width:100%"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        size="small"
                        v-model="form.followUpTime"
                        type="datetime">
                    </el-date-picker>
                </el-form-item>
            </el-col>
            <el-col :span="12">
                <el-form-item label="客户评价：" prop="customerEvalute">
                   {{commentInfo.length?'已评价':'未评价'}}
                </el-form-item>
            </el-col>
        </el-row>
        <el-form-item label="产品SKU：" prop="">
            <el-table :data="productSkuList"  border  style="width: 100%">
                <el-table-column prop="productSku"  label="SKU"  width="180" align="center"/>
                <el-table-column prop="nameZh"  label="产品名称"   align="center"/>
                <el-table-column prop="productPrice"  label="价格"  align="center"/>
                <el-table-column prop="orderAmount"  label="订购"   align="center"/>
                <el-table-column prop="issueAmount"  label="问题数量"  align="center"/>                
            </el-table>
        </el-form-item>
        <el-form-item label="跟进记录：" prop="">            
            <el-table :data="followUprecordList"  border  style="width: 100%">
                <el-table-column prop="name"  label="跟进人"  width="180" align="center"/>
                <el-table-column prop="content"   label="跟进内容" align="center"></el-table-column>
                <el-table-column prop="createTime"  label="跟进时间"  width="180" align="center"/>
                <el-table-column  label="附件" align="center">
                    <template slot-scope="scope">
                        <a :href="scope.row.followPath" target="_blank">{{scope.row.followName}}</a>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-form-item label="完整情况：" prop="performancen">
            <el-select v-model="form.performance" disabled>
                <el-option label="已完成" value="1"></el-option>
                <el-option label="未完成" value="0"></el-option>
            </el-select>
        </el-form-item>



    </el-form>
</template>

<script>
/* eslint-disable */
export default {
  data() {
    return {
      form: {
        orderNumber: '',
        customerIssueId: '',
        returnWarehouseId: '',
        returnCode: '',
        odr: '',
        solution: '',
        followUpTime: '',
        customerEvalute: '',
        performance: ''
      },
      customerList: [],
      commentInfo: [],
      warehouseList: [],
      productSkuList: [],
      followUprecordList: [],
      solutionList: [
        {
          label: '退货',
          value: 1
        },
        {
          label: '重寄',
          value: 2
        },
        {
          label: '退款',
          value: 3
        },
        {
          label: '部分退款+保留产品',
          value: 4
        },
        {
          label: '重寄+退款',
          value: 5
        },
        {
          label: '返修后重发',
          value: 6
        },
        {
          label: '缺货更换产品',
          value: 7
        },
        {
          label: '已过期',
          value: 8
        },
        {
          label: '和平解决',
          value: 9
        },
        {
          label: '授权退货',
          value: 10
        }
      ]
    }
  },
  methods: {
    getInfo(orderServiceId) {
      this.$api['email/logInfo']({ orderServiceId }).then(res => {
        let {
          orderNumSystem,
          orderId,
          products,
          follows,
          performance,
          returnCode,
          returnWarehouseId,
          followUpTime,
          solution,
          odr,
          customerIssueId
        } = res
        this.form.orderNumber = orderNumSystem
        this.form.customerIssueId = customerIssueId
        this.form.returnWarehouseId = returnWarehouseId
        this.form.returnCode = returnCode
        this.form.odr = odr ? odr + '' : ''
        this.form.solution = solution
        this.form.followUpTime = followUpTime
        this.productSkuList = products
        this.followUprecordList = follows
        this.form.performance = performance + ''
      })
    },
    getWarehouseList() {
      this.$api['product/warehouseList']({}).then(res => {
        this.warehouseList = res
      })
    },
    getCustomerList() {
      let params = {
        sortOrder: 'asc',
        pageSize: 50,
        pageNumber: 1
      }
      this.$api['order/issueList'](params).then(res => {
        this.customerList = res.rows
      })
    },
    submitForm(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          callback && callback(this.form)
        } else {
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs.form.resetFields()
    }
  },
  mounted() {
    this.getCustomerList()
    this.getWarehouseList()
  }
}
</script>

<style lang="css">
</style>
