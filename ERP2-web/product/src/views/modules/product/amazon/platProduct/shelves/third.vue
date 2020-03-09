<template>
  <div class="upshelf">
    <!-- 此步 只有店铺SKU生成规则有出现用变体属性的时候 才会出现-->
    <ElForm label-width="0" :show-message="false" ref="form" :model="formData">
      <ElTable class="form-item-table" border :data="formData.stores" default-expand-all>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <ElTable border :data="scope.row.platSkus">
              <ElTableColumn label="平台SKU" width="484px" prop="platSku" />
              <ElTableColumn label="变体SKU">
                <template slot-scope="scope1">
                  <ElFormItem :rules="rules" :prop="`stores.${scope.$index}.platSkus.${scope1.$index}.sellerSku`">
                    <ElInput size="mini" v-model="scope1.row.sellerSku"></ElInput>
                  </ElFormItem>
                </template>
              </ElTableColumn>
              <ElTableColumn label="变体Title">
                <template slot-scope="scope1">
                  <ElFormItem :rules="rules" :prop="`stores.${scope.$index}.platSkus.${scope1.$index}.sellerTitle`">
                    <ElInput size="mini" v-model="scope1.row.sellerTitle"></ElInput>
                  </ElFormItem>
                </template>
              </ElTableColumn>
            </ElTable>
          </template>
        </el-table-column>
        <ElTableColumn label="店铺名称" prop="storeName"></ElTableColumn>
        <ElTableColumn label="上架类型">
          <template>
            <div>{{params.saleType == 1 ? '自主上架': params.saleType == 0 ? "跟卖": ''}}</div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="父产品SKU" prop="sellerSku">
          <span slot="header">
            <span class="danger">*</span>
            父产品SKU
          </span>
          <template slot-scope="scope">
            <ElFormItem :rules="rules" :prop="`stores.${scope.$index}.sellerSku`">
              <ElInput size="small" v-model="scope.row.sellerSku"></ElInput>
            </ElFormItem>
          </template>
        </ElTableColumn>
        <ElTableColumn label="父产品标题">
          <span slot="header">
            <span class="danger">*</span>
            父产品标题
          </span>
          <template slot-scope="scope">
            <ElFormItem :rules="rules" :prop="`stores.${scope.$index}.sellerTitle`">
              <ElInput size="small" v-model="scope.row.sellerTitle"></ElInput>
            </ElFormItem>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElForm>
  </div>
</template>
<script>
export default {
  props: ['params', 'value', 'productPlatIds'],
  data() {
    return {
      formData: {"stores":[{"storeId":1,"storeName":"Lorem commodo Excepteur","platSkus":[{"productPlatId":1,"platSku":"dasd","skuPlaceholder":"dad","titlePlaceholder":"das","sellerSku":"12","sellerTitle":"12"},{"productPlatId":2,"platSku":"dasd1","skuPlaceholder":"dad","titlePlaceholder":"das","sellerSku":"2","sellerTitle":"3"}],"sellerSku":"dolor Lorem","sellerTitle":"elit ex non aliqua sed"},{"storeId":2,"storeName":"ullamco amet consequat","platSkus":[{"productPlatId":1,"platSku":"dasd","skuPlaceholder":"dad","titlePlaceholder":"das","sellerSku":"1","sellerTitle":"1"},{"productPlatId":2,"platSku":"dasd1","skuPlaceholder":"dad","titlePlaceholder":"das","sellerTitle":"2","sellerSku":"3"}],"sellerSku":"reprehenderit veniam anim","sellerTitle":"nisi aliqua laboris tempor anim"},{"storeId":3,"storeName":"laborum id laboris deserunt ipsum","platSkus":[{"productPlatId":1,"platSku":"dasd","skuPlaceholder":"dad","titlePlaceholder":"das","sellerSku":"1","sellerTitle":"1"},{"productPlatId":2,"platSku":"dasd1","skuPlaceholder":"dad","titlePlaceholder":"das","sellerSku":"2","sellerTitle":"3"}],"sellerSku":"in proident tempor pariatur","sellerTitle":"Excepteur amet aute Duis"}]},
      rules: [
        {
          required: true,
          message: '不能为空'
        }
      ]
    }
  },
  methods: {
    init(stores) {
      const { platSiteId, putawayType, saleType } = this.params
      const productPlatIds = this.productPlatIds
      const params = {
        productPlatIds,
        platSiteId,
        putawayType,
        stores,
        saleType
      }
      this.$api[`product/platProductCustomSku`](params).then(data => {
        this.formData.stores = data.stores
      })
    },
    valid() {
      function isEmpty(data) {
        if (data == null || data === '') {
          return true
        }
        return
      }
      let validSuccess = this.$refs.form.fields.every(field => {
        return !isEmpty(field.fieldValue) && field.validateState !== 'error'
      })
      this.$emit('update:validSuccess', validSuccess)
    }
  },
  computed: {
    currentVal: {
      get() {
        return this.value
      },
      set(val) {
        this.$emit('update:value', val)
      }
    }
  },
  watch: {
    formData: {
      deep: true,
      handler() {
        this.$nextTick(() => this.valid())
      }
    }
  }
}
</script>