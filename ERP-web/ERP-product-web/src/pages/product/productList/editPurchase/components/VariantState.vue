<template>
  <div class="purchase_box __flex__column___">
    <v-data-table
      stripe
      :tree-option="treeOption"
      ref="table"
      :data="list"
      :columns="columns"
      class="margin-top-25"
      :current-data.sync="tableData"
    >
      <template slot="td" slot-scope="props">
        <div v-if="props.column.field=='sku'">{{props.item.variant.sku}}</div>
        <div v-else-if="props.column.field=='skuCustom'">{{props.item.variant.skuCustom}}</div>
        <div v-else-if="props.column.field=='remark'">{{props.item.variant.activateRemark || ''}}</div>
        <div v-else-if="props.column.field=='edit'">
          <v-button
            :disabled="$attrs.show"
            :type="props.item.variant.activateFlag?'':'primary'"
            @click="setStatu(props, false)"
          >无效</v-button>
          <v-button
            :disabled="$attrs.show"
            :type="props.item.variant.activateFlag?'primary':''"
            @click="setStatu(props, true)"
          >有效</v-button>
        </div>
        <div
          v-for="item in propCol"
          v-if="propCol.length && props.column.field==item.field"
        >{{props.item.variantPropertyList[item.field] && props.item.variantPropertyList[item.field].propertyValue || ''}}</div>

        <div v-else>{{props.content}}</div>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, showDialog, handlerCode } from 'common/common'
import { getQueryString } from 'common/util'
import { PRODUCT_VARIANT_STATUS } from '../../../componentName'
export default {
  data() {
    let vm = this
    vm.productId = +getQueryString('productId')
    return {
      list: data => {
        return fetchData({
          ...apis.PRODUCT_VARIANT_PURCHASE_TAB,
          data: { productId: vm.productId }
        }).then(res => {
          if (res.data.code !== 0) {
            showToast('error', res.data.msg)
            return {
              result: []
            }
          }
          let data = res.data
          delete data.code
          if (
            data.productVariantList.length > 0 &&
            data.productVariantList[0].variantPropertyList.length > 0
          ) {
            vm.propCol = []
            vm.columns = [
              {
                title: '操作',
                field: 'edit'
              },
              {
                title: '系统SKU',
                field: 'sku'
              },
              {
                title: '自定义SKU',
                field: 'skuCustom'
              },
              {
                title: '备注',
                field: 'remark'
              }
            ]
            data.productVariantList[0].variantPropertyList.forEach(
              (el, index) => {
                const e = {
                  title: el.propertyName,
                  field: index
                }
                vm.propCol.push(e)
                vm.columns.splice(3, 0, e)
              }
            )
          }

          let productVariantList = data.productVariantList
          this.$emit('update:data', data)
          let ret = {
            result: productVariantList
          }
          console.log(ret)
          return ret
        })
      },
      propCol: [],
      columns: [
        {
          title: '操作',
          field: 'edit'
        },
        {
          title: '系统SKU',
          field: 'sku'
        },
        {
          title: '自定义SKU',
          field: 'skuCustom'
        },
        {
          title: '备注',
          field: 'remark'
        }
      ],
      treeOption: {
        isAsync: true,
        idKey: 'productId',
        loadChildren: function(pramas) {
          return fetchData({ url: GET_PRODUCT_ALL_LIST, params }).then(res => {
            console.log(res)
            return res.data
          })
        }
      },
      tableData: [],
      isActive: true
    }
  },
  methods: {
    // 设置变体状态
    setStatu(props, status) {
      console.log(props)
      let variant = props.item.variant
      let vm = this
      showDialog(
        PRODUCT_VARIANT_STATUS,
        {
          title: '备注',
          width: 800,
          okText: '确认'
        },
        { ...props, status: status ? 1 : 0 },
        {
          set(val) {
            console.log(val)
            vm.$refs.table.refresh()
            // vm.
          }
        }
      )
    }
  }
}
</script>

<style>
</style>
