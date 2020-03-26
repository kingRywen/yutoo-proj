<template>
  <main-layout
    cusSaveName="planinfo"
    :columns="columns"
    :searchFields="searchFields"
    :edit-btns="edits"
    editWidth="200px"
    url="fba/fbaShipmentCreatePlanList"
    :fixedPageFunc="fixedPageFunc"
  ></main-layout>
</template>
<script>
export default {
  data() {
    return {
      searchFields: {
        planName: {
          placeholder: '计划名'
        },
        storeId: {
          widget: 'select',
          placeholder: '选择店铺',
          options: '$store.storeInfo.curStoreList',
          handler: {
            action: 'storeInfo/getStoreList'
          }
        }
      },
      columns: [
        {
          label: '计划名',
          value: 'planName'
        },
        {
          label: '店铺',
          value: 'storeName'
        },
        {
          label: '编号',
          value: 'planId'
        },
        {
          label: '创建时间',
          value: 'createTime'
        },
        // {
        //   label: '上次更新',
        //   value: ''
        // },
        // {
        //   label: 'MSKU',
        //   value: ''
        // },
        // {
        //   label: '数量',
        //   value: ''
        // },
        // {
        //   label: '已收到',
        //   value: ''
        // },
        {
          label: '目的地',
          value: 'targetCountryCode'
        },
        {
          label: '状态',
          value: 'planProcess',
          _enum: {
            '<=5': '处理中',
            '>=6': '已创建货件'
          }
        }
      ],
      edits: [
        {
          fn: scope => {
            this.$router.push({
              path: '/shopManage/fba/warehouse/create',
              query: {
                shipAddressId: scope.row.shipAddressId,
                storeId: scope.row.storeId,
                storeName: scope.row.storeName,
                planName: scope.row.planName,
                planId: scope.row.planId,
                targetCountryCode: scope.row.targetCountryCode,
                packageType: scope.row.packageType,
                labelPrepPreference: scope.row.labelPrepPreference,
                unedit: scope.row.planProcess == 6,

                planProcess: Math.min(Math.max(+scope.row.planProcess + 1, 1), 5),
                replenishInfoId: scope.row.replenishInfoId
              }
            })
          },
          name: '处理入库计划',
          perm: 'addTask'
        }
      ]
    }
  },
  methods: {
    fixedPageFunc(data) {
      return {
        page: data.plans
      }
    }
  }
}
</script>