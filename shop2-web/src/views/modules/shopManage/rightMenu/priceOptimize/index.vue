<template>
  <main-layout
    @searchTrueData="val => searchData = val"
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    :edit-btns="edits"
    editWidth="180px"
    :topBatchBtn="topBatchBtn"
    :treeTable="true"
    :treeTableOtions="treeTableOtions"
    :right-edit-btns="editBtns"
    :dataMethod="dataMethod"
    :checkStrictly="false"
    @left-batch-change="handleLeftBatchChange"
    url="shopManage/priceSeoStrategyList"
    ref="layout"
  ></main-layout>
</template>
<script>
export default {
  data() {
    let vm = this
    return {
      treeTableOtions: {
        childs: 'childList',
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },
      topBatchBtn: {
        options: [
          {
            label: '编辑定时调整价格策略'
          },
          {
            label: '关闭定时调整价格'
          },
          {
            label: '开启定时调整价格'
          },
          {
            label: '编辑产品默认售价'
          },
          {
            label: '删除'
          }
        ]
      },
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.$router.push({
              path: '/shopManage/priceOptimize/add'
            })
          }
        }
      ],
      edits: [
        {
          name: '查看调价曲线',
          perm: 'addTask',
          fn: scope => {
            let params = {
              ...this.storeInfo,
              strategyId: scope.row.strategyId
            }
            this.showDialogGlobal(
              '价格变化曲线',
              '100%',
              params,
              () => import('./dialogs/echarts.vue'),
              '',
              '关闭'
            )
          }
        },
        {
          name: '停止调价',
          perm: 'addTask',
          fn: scope => {}
        },
        {
          name: '添加/编辑调价',
          perm: 'addTask',
          fn: scope => {}
        },
        {
          name: '编辑原价',
          perm: 'addTask',
          fn: scope => {}
        }
      ],
      searchFields: {
        sellerId: {
          placeholder: '店铺',
          labelWidth: '70px',
          widget: 'select',
          options: []
        },
        isOpen: {
          hidden: true,
          label: '价格优化状态',
          labelWidth: '110px',
          widget: 'select',
          options: [
            { label: '是', value: 1 },
            { label: '否', value: 0 }
          ]
        },
        searchText: {
          hidden: true,
          label: 'ASIN,SKU'
        }
      },
      searchData: {},
      columns: [
        {
          label: 'SKU',
          value: 'sellerSku',
          numField: 'childList',
          expand: true,
          noTooltip: true
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: '店铺',
          value: 'sellerName'
        },
        {
          label: '主图',
          value: 'imagePath',
          img: true
        },
        {
          label: '所属类目',
          value: 'category'
        },
        {
          label: '默认售价',
          value: 'defaultPrice',
          sortable: 'custom'
        },
        {
          label: '当前售价',
          value: 'regularPrice',
          sortable: 'custom'
        },
        {
          label: '价格优化状态',
          value: 'status',
          _enum: {
            0: '关闭',
            1: '开启'
          }
        }
      ]
    }
  },
  methods: {
    dataMethod(row) {
      row.forEach((e, index, arr) => {
        arr[index].childList.push({
          strategyId: 'gtrr555',
          imagePath:
            'https://images-na.ssl-images-amazon.com/images/I/41d0D5S5rqL._SL750_.jpg',
          asin: 'B01FHAKVLA',
          title:
            'Aenlley Womens Boat Neck Dolman Top Short Sleeve Solid Shirring Drape Jersey Tops Color Black Size XL',
          category:
            'Clothing, Shoes & Jewelry:Women:Clothing:Tops, Tees & Blouses:T-Shirts',
          regularPrice: 2,
          defaultPrice: 1.5,
          status: '1/10',
          sellerSku: 'A-Tees-001-Black-XL',
          hashNew: true,
          sellerId: 'A1NEG3KQPSQ7H7',
          sellerName: 'Allen'
        })
      })
      return row
    },
    getStore() {
      // this.$api['shopAuth/sellerAuthListToSeller'](...this.storeInfo).then((res)=>{
      // 	this.searchFields.sellerId.options = res.data.map(e=>({
      // 		label:e.sellerAlias,
      // 		value:e.sellerId
      // 	}))
      // })
    },
    handleLeftBatchChange(val, selection) {
      let strategyIds = selection
        .filter(e => e._level === 2)
        .map(el => el.strategyId)
      if (strategyIds && strategyIds.length == 0)
        return this.$message.warning('不能单独勾选父产品')
      let params = {
        ...this.storeInfo,
        strategyIds
      }
      switch (val[0]) {
        case '编辑定时调整价格策略':
          this.showDialogGlobal('添加或编辑规则', '100%', { params }, () =>
            import('./dialogs/priceStrategy.vue')
          )
          break
        case '关闭定时调整价格':
          params.isOpen = false
          this.showConfirmGlobal(
            'shopManage/priceSeoUpdateStatus',
            params,
            '关闭定时调整价格'
          )
          break
        case '开启定时调整价格':
          params.isOpen = true
          this.showConfirmGlobal(
            'shopManage/priceSeoUpdateStatus',
            params,
            '开启定时调整价格'
          )
          break
        case '编辑产品默认售价':
          break
        case '删除':
          this.showConfirmGlobal('shopManage/priceSeoRemove', params, '删除')
          break
      }
    }
  },
  computed: {
    outerParams() {
      return {
        ...this.storeInfo
      }
    }
  },
  mounted() {
    this.getStore()
  }
}
</script>
