<template>
  <main-layout
    @searchTrueData="val => searchData = val"
    :outerParams="outerParams"
    :searchFields="searchFields"
    :columns="columns"
    :topBatchBtn="topBatchBtn"
    :right-edit-btns="editBtns"
    @left-batch-change="handleLeftBatchChange"
    :treeTable="true"
    :btnFn="btnFn"
    :treeTableOtions="treeTableOtions"
    :edit-btns="edits"
	:selectableFunc = 'selectableFunc'
    tip="父产品数据每日更新，子产品数据需要选择更新才会更新"
    url="shopManage/productReviewList"
    ref="layout"
  ></main-layout>
</template>
<script>
import { downloadFile } from 'Utils'
export default {
  data() {
    let vm = this
    return {
      treeTableOtions: {
        childs: 'childArray',
        expandFunc: row => {
          return row.childArray && row.childArray.length > 0
        }
      },
      topBatchBtn: {
        options: [
          {
            label: '更新子产品数据'
          },
          {
            label: '导出Excel'
          }
        ]
      },
      edits: [
        {
          name: '处理',
          fn: scope => {
            let routeData = vm.$router.resolve({
              path: '/shopManage/productEvaluateManage/detail',
              query: {
                productId: scope.row.productId
              }
            })
            window.open(routeData.href, '_blank')
          }
        }
      ],
      editBtns: [
        {
          name: '导出Excel',
          perm: 'add',
          showLoading: true,
          fn: () => {
            return this.expReview(undefined, null, this.searchData)
          }
        }
      ],
      searchFields: {
        asinOrSku: {
          placeholder: 'ASIN 、SKU'
        },
        unReplyFlag: {
          hidden: true,
          label: '是否有未回复',
          labelWidth: '110px',
          widget: 'select',
          options: [
            { label: '否', value: false },
            { label: '是', value: true }
          ]
        }
      },
      searchData: {},
      columns: [
        {
          label: 'SKU',
          value: 'sku',
          numField: 'childArray',
          expand: true,
          noTooltip: true
        },
        {
          label: 'ASIN',
          value: 'asin'
        },
        {
          label: '主图',
          value: 'imageUrl',
          img: true,
		  link: row => {
		    return this.storeUrls.asinUrl + row['asin']
		  },
		  title: 'title',
		  width:'70px',
        },
        {
          label: '评分',
          value: 'starCnt',
          sortable: 'custom',
		  width:'100px',
        },
        {
          label: '总评价数',
          value: 'reviewCnt',
          sortable: 'custom',
		  width:'100px',
        },
        {
          label: '差评数',
          value: 'negativeCnt',
          sortable: 'custom',
		  width:'100px',
        },
        {
          label: '中评数',
          value: 'neutralCnt',
          sortable: 'custom',
		  width:'100px',
        },
        {
          label: '好评数',
          value: 'positiveCnt',
          sortable: 'custom',
		  width:'100px',
        },
        {
          label: '近7天新增评价数',
          value: 'last7DayAddCnt',
          sortable: 'custom',
		  width:'200px',
        },
        {
          label: '是否有未回复',
          value: 'unReplyFlag',
          _enum: {
            false: '否',
            true: '是'
          },
		  width:'200px',
        },
        {
          label: '子产品数据更新时间',
          value: 'dataTime',
		  render(h,scope){
			  let {dataTime,status} = scope.row
			  return dataTime ? status === 1 ? (
				<span>{dataTime}(更新中)</span>
			  ) : (
				<span>{dataTime}</span>
			  ) : (
				<span>-</span>
			  )
		  }
        }
		//123/
      ]
    }
  },
  methods: {
	selectableFunc(row){
		return !row.childFlag
	},
    btnFn({ childFlag }) {
      if (!childFlag) {
        return [1]
      } else {
        return []
      }
    },
    handleLeftBatchChange(val, selection) {
      let idArray = selection.map(el => el.productId)
      let params = {
        idArray,
        ...this.storeInfo
      }
      switch (val[0]) {
        case '更新子产品数据':
          this.showConfirmGlobal(
            'shopManage/productReviewUpdateChild',
            params,
            '更新子产品数据'
          )
          break
        case '导出Excel':
          this.expReview(idArray, true)
          break
      }
    },
    expReview(idArray, setLoading, searchData) {
      setLoading && (this.topBatchBtn.loading = true)
      return this.$api[
        `${
          setLoading
            ? 'shopManage/productReviewExport'
            : 'shopManage/productReviewExportQuery'
        }`
      ]({
        idArray,
        ...this.outerParams,
        ...searchData
      })
        .then(data => {
          setLoading && (this.topBatchBtn.loading = false)
          let ext = 'xlsx'
          downloadFile(data, `产品评价管理.${ext}`)
        })
        .catch(err => {
          setLoading && (this.topBatchBtn.loading = false)
          return Promise.reject(err)
        })
    }
  },
  computed: {
    outerParams() {
      return {
        ...this.storeInfo
      }
    }
  }
}
</script>
