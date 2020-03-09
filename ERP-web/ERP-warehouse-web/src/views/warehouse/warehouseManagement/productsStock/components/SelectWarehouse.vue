<template>
  <el-form :model="formData" size="small" label-width="80px">
    <ElFormItem label="选择仓库" prop="value" :rules="[{required: true, message: '请选择仓库'}]">
      <el-select v-model="formData.value" placeholder="请选择仓库" style="width:100%">
        <el-option v-for="item in warehouseList" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </ElFormItem>
  </el-form>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { loginRedirect } from 'Config'
import storage from 'Utils/saver';

export default {
  props: ['data'],
  data() {
    return {
      formData: {
        value: ''
      }
    }
  },
  created() {
    this.queryData(3)
  },
  computed: {
    ...mapState('vmWarehouse', ['warehouseList'])
  },
  methods: {
    ...mapActions('vmWarehouse', ['queryData']),
    submit() {
      let productIds = this.data.variantIds.map(el => ({...el, warehouseId: +this.formData.value}))
      storage.set('local', 'printProductData', productIds)
      window.open(
        `${loginRedirect}erp-order/#/print?title=打印产品条码`
      )
      return Promise.resolve(true)
    }
  }
}
</script>

<style>
</style>
