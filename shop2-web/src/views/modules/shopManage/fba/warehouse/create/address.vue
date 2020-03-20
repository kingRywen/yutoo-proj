<template>
  <div>
    <main-layout
      :columns="columns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      :edit-btns="edits"
      ref="layout"
      :btnFn="btnFn"
      :right-edit-btns="editBtns"
      :outerTableList="addresses"
    ></main-layout>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  props: ['cb'],
  data() {
    return {
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.$_dialog({
              appendToBody: true,
              fullscreen: false,
              size: 'medium',
              title: '添加地址',
              params: { storeId: this.$route.query.storeId },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./addAddress.vue')
            })
          }
        }
      ],
      topBatchBtn: {
        title: '地址',
        options: [
          {
            label: '删除'
          }
        ]
      },
      columns: [
        {
          label: '发货地址',
          value: 'address',
          render(h, scope) {
            const addressInfo = scope.row
            return (
              <div>
                <p>
                  <b style="font-weight: 900;font-size: 18px;">
                    {addressInfo.addressName}
                  </b>
                </p>
                <p>{addressInfo.addressLine1}</p>
                <p>{addressInfo.addressLine2}</p>
                <p>
                  {addressInfo.addressCity} {addressInfo.addressState},{' '}
                  {addressInfo.addressCountryCode}{' '}
                  {addressInfo.addressPostalCode}
                </p>
                <p>{addressInfo.addressCountry}</p>
              </div>
            )
          }
        }
      ],
      edits: [
        {
          name: '选择',
          perm: 'addTask',
          fn: scope => {
            this.sel(scope.row)
          }
        },
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {
            this.del([scope.row.addressId])
          }
        },
        {
          name: '设为默认',
          perm: 'addTask',
          fn: scope => {
            this.setDef(scope.row.addressId)
          }
        }
      ]
    }
  },
  computed: {
    ...mapState('fba', ['addresses']),
    storeId() {
      return this.addresses[0].storeId
    }
  },
  methods: {
    ...mapActions('fba', ['getAddress']),
    sel(row) {
      this.cb(row)
      this.$emit('dialog.close')
    },
    setDef(addressId) {
      this.showTips({ msg: '此操作将设置为默认地址, 是否继续?' }, () => {
        return this.$api[`fba/fbaShipmentCreateAddressSet`]({
          storeId: this.storeId,
          addressId
        }).then(() => {
          return this.getAddress({ storeId: this.storeId })
        })
      })
    },
    del(addressIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`fba/fbaShipmentCreateAddressDelete`]({
          addressIds
        }).then(() => {
          return this.getAddress({ storeId: this.storeId })
        })
      })
    },
    btnFn(row) {
      if (row.addressType) {
        return [1, 2]
      } else {
        return [1, 2, 3]
      }
    },
    handleLeftBatchChange(val, sel) {
      if (val[0] == '删除') {
        this.del(sel.map(e => e.addressId))
      }
    }
  }
}
</script>