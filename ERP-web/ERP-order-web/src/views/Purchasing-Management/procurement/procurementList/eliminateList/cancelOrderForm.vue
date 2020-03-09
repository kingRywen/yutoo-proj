<template lang="html">
    <!-- 采购销单 -->
    <ul class="cancelOrderForm"
        v-loading="loading"
        element-loading-text="正在加载...">
        <li>
            <h3 class="title">下单信息</h3>
            <yt-table :data="listA" :columns="columnsA" :border="true" :selection="false"/>
        </li>
        <li>
            <h3 class="title">产品下单详情</h3>
            <yt-table :data="listB" :columns="columnsB" :border="true" :selection="false"/>
        </li>
        <li>
            <h3 class="title">采购单产品</h3>
            <el-form :model="form" ref="form" size="mini">
                <el-table :data="listC" :columns="columnsC" border>
                    <el-table-column  label="图片" width="100" align="center">
                        <template slot-scope="scope">
                            <img :src="scope.row.productImg" alt="" height="50">
                        </template>
                    </el-table-column>
                    <template v-for="item in columnsC">
  <el-table-column :label="item.label" align="center" :width="item.width" :key="item.id">
    <template slot-scope="scope">{{scope.row[item.value]}}</template>
  </el-table-column>
</template>

                    <el-table-column  label="属性" width="120" align="center">
                        <template slot-scope="scope">
  <p v-for="item in scope.row.variantPropertys" :key="item.id">{{item.propertyName}}:{{item.propertyValue}}</p>
</template>
                    </el-table-column>

                    <el-table-column  label="销单单价" width="80" align="center">
                        <template slot-scope="scope">
  <el-form-item
    :prop="'products.' + scope.$index + '.pinPrice'"
    :rules="[
        {required: true, message: '此项必填', trigger: 'blur'},
        { type: 'number', message: '须为数字'} 
    ]"
  >
    <el-input v-model.number="form.products[scope.$index].pinPrice"/>
  </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  label="优惠价" width="80" align="center">
                        <template slot-scope="scope">
  <el-form-item
    :prop="'products.' + scope.$index + '.discountPrice'"
    :rules="[
                                    {required: true, message: '此项必填', trigger: 'blur'},
                                    { type: 'number', message: '须为数字'} 
                                ]"
  >
    <el-input v-model.number="form.products[scope.$index].discountPrice"/>
  </el-form-item>
</template>
                    </el-table-column>
                    <el-table-column  label="销单数量" width="80" align="center">
                        <template slot-scope="scope">
  <el-form-item
    :prop="'products.' + scope.$index + '.pinQuantity'"
    :rules="[
                                    {required: true, message: '此项必填', trigger: 'blur'},
                                    { type: 'number', message: '须为数字'} 
                                    ]"
  >
    <el-input v-model.number="form.products[scope.$index].pinQuantity"/>
  </el-form-item>
</template>
                    </el-table-column>
                </el-table>
            </el-form>
        </li>

    </ul>
</template>

<script>
export default {
  data() {
    return {
      listA: [],
      columnsA: [
        { value: 'lowerSingleTime', label: '下单时间' },
        { value: 'lowerSingleNumber', label: '下单号' },
        { value: 'toatlDiscount', label: '优惠总金额' },
        { value: 'freightAmount', label: '运费总金额' },
        { value: 'orderAmount', label: '下单总金额' }
      ],
      listB: [],
      columnsB: [
        { value: 'customSku', label: '下单产品' },
        { value: 'productSingleQuantity', label: '下单产品数量' },
        { value: 'productSingleAmount', label: '产品下单单价' },
        { value: 'totalAmount', label: '下单总金额' }
      ],
      listC: [],
      columnsC: [
        { value: 'productSku', label: '自定义SKU' },
        { value: 'productBarCode', label: '条形码' },
        { value: 'productTypeName', label: '产品类型' },
        { value: 'purchaseRemark', label: '打包备注' },
        { value: 'productName', label: '产品名称' },
        { value: 'productStateName', label: '产品状态' },
        { value: 'supplierName', label: '供应商' },
        { value: 'requirement', label: '总需求量', width: 80 },
        { value: 'lowerSingleQuantity', label: '总下单量' }
      ],
      form: {
        products: []
      },
      loading: false
    }
  },
  watch: {
    listC(val) {
      this.form.products = val.map(item => {
        return {
          productId: item.productId,
          pinPrice: item.productSingleAmount,
          discountPrice: '',
          pinQuantity: item.lowerSingleQuantity
        }
      })
    }
  },
  methods: {
    submitForm(callback) {
      this.$refs.form.validate(valid => {
        if (valid) {
          callback && callback(this.form.products)
        } else {
          return false
        }
      })
    },
    getListData(pinOrderNumber) {
      this.loading = true
      this.$api['procurement/pinOrderDetail']({
        pinOrderNumber
      })
        .then(res => {
          this.loading = false
          this.listA = res.rows.list1
          this.listB = res.rows.lowerSingleProducts
          this.listC = res.rows.products
        })
        .catch(err => {
          this.$message.error(err.msg)
          this.loading = false
        })
    }
  }
}
</script>

<style lang="scss">
.cancelOrderForm {
  max-height: 550px;
  overflow-y: auto;
  li {
    margin-bottom: 25px;
    background: #eee;
    .title {
      font-weight: 800;
      font-size: 15px;
      padding: 10px 0 10px 10px;
      color: #67c23a;
      border: 1px solid #ebeef5;
      border-bottom: none;
    }
  }
}
</style>
