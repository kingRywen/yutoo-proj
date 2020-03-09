<template>
  <MainLayout
    :searchFields="searchFields"
    :columns="columns"
    :treeTable="true"
    :searchFunc="searchFunc"
    :simple="true"
    :treeTableOtions="treeTableOtions"
    ref="layout"
    :outerParams="outerParams"
    :checkStrictly="false"
    url="product/prProductRepoImport"
  ></MainLayout>
</template>
<script>
export default {
  props: ['platSiteId'],
  data() {
    return {
      outerParams: {
        type: 0
      },
      treeTableOtions: {
        childs: 'childList',
        // eslint-disable-next-line no-unused-vars
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },
      searchFields: {
        search: {
          widget: 'input',
          placeholder: '请输入自定义/系统SKU/产品名称...',
          noLabel: true
        },
        sourceType: {
          widget: 'select',
          label: '产品来源',
          options: '$const.PRODUCT_PLAT/productSource'
          // options: '$store.platProduct.buttedSiteList'
        },
        activeStatus: {
          widget: 'select',
          label: '活跃度',
          options: '$const.PRODUCT_PLAT/liveness'
        },
        categoryId: {
          widget: 'cascader',
          label: '选择类目',
          props: {
            label: 'systemCategoryName',
            value: 'systemCategoryId',
            children: 'childArray',
            emitPath: false
          },
          options: (row = {}) =>{
            return this.$api[`product/CateSystemCategoryTree`]({parentId: row.parentId || -1})
            .then((data) => {
              return data.rows
            })
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
          label: '发货仓库',
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
        this.$message.warning('请选择要导入的产品')
        return
      }
      return this.$api[`product/prProductPlatAmzImport`]({
        platSiteId: this.platSiteId,
        productRepoIds: select.map(el => el.productRepoId)
      })
    }
  }
}
</script>