<template>
  <MainLayout
    :searchFields="searchFields"
    :columns="columns"
    radioMode
    :outerParams="outerParams"
    :searchFunc="searchFunc"
    :simple="true"
    ref="layout"
    url="product/platProductParentProductList"
  ></MainLayout>
</template>
<script>
export default {
  props: ['platSiteId', 'productPlatIds'],
  data() {
    return {
      
      searchFields: {
        sku: {
          widget: 'input',
          placeholder: '请输入sku',
          noLabel: true
        },
        productName: {
          label: '产品名称'
        },
        deliverRepo: {
          widget: 'select',
          label: '发货仓库',
          options: '$store.common.warehouseList',
          handler: {
            action: 'common/getWarehouseList'
          }
        }
      },
      columns: [
        {
          label: '图片',
          img: true,
          value: 'imgUrl'
        },
        {
          label: '产品名称',
          value: 'productName'
        },
        {
          label: '系统SKU',
          value: 'sysSku'
        },
        {
          label: '仓库SKU',
          value: 'repoSku'
        },
        {
          label: '产品英文名称',
          value: 'productTitle'
        },
        {
          label: '采购人员',
          value: 'purchaseUser'
        },
        {
          label: '默认本地发货仓库',
          value: 'defaultRepo'
        }
      ]
    }
  },
  computed: {
    outerParams(){
      return {
        platSiteId: this.platSiteId,
        productPlatIds: this.productPlatIds
      }
    }
  },
  methods: {
    searchFunc(data) {
      // eslint-disable-next-line no-unused-vars
      let {pageNumber, pageSize, sortOrder, tableStatus, ...info} = data
      return info
    },
    _submit() {
      let select = this.$refs.layout.selection
      if (!select.length) {
        this.$message.warning('请选择要关联的产品')
        return
      }
      return this.$api[`product/platProductAffirmRel`]({
        platSiteId: this.platSiteId,
        productPlatIds: this.productPlatIds,
        productPlatId: this.$refs.layout.selection[0].productPlatId
      })
    }
  }
}
</script>