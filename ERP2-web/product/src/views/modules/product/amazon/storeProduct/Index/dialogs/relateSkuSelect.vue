<template>
  <MainLayout
    :searchFields="searchFields"
    :columns="columns"
    :outerParams="outerParams"
    :treeTable="true"
    :treeTableOtions="treeTableOtions"
    :searchFunc="searchFunc"
    :radioMode="true"
    :simple="true"
    ref="layout"
    url="product/prProductRepoImport"
  ></MainLayout>
</template>
<script>
export default {
  props: ['platSiteId', 'productSellerIds'],
  data() {
    return {
      treeTableOtions: {
        childs: 'childList',
        // eslint-disable-next-line no-unused-vars
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },
      outerParams: {
        type: 0
      },
      searchFields: {
        search: {
          widget: 'input',
          placeholder: '请输入自定义sku、系统sku、中文名称、英文名称',
          label: ''
        },
        warehouseId: {
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
          label: '自定义SKU',
          value: 'repoSku',
          // url: 'imgUrl',
          numField: 'childList',
          expand: true
        },
        {
          label: '图片',
          img: true,
          value: 'imgUrl'
        },
        {
          label: '产品名称',
          value: 'nameCn'
        },
        {
          label: '系统SKU',
          value: 'sysSku'
        },
        {
          label: '产品英文名称',
          value: 'nameEn'
        },
        {
          label: '默认本地发货仓库',
          value: 'warehouseName'
        }
      ]
    }
  },
  methods: {
    searchFunc(data) {
      return data
    },
    _submit() {
      let select = this.$refs.layout.selection
      if (!select.length) {
        this.$message.warning('请选择要关联的产品')
        return
      }
      return this.$api[`product/prProductSellerAmzRelateSku`]({
        platSiteId: this.platSiteId,
        productRepoId: select[0].productRepoId,
        productSellerIds: this.productSellerIds
      })
    }
  }
}
</script>