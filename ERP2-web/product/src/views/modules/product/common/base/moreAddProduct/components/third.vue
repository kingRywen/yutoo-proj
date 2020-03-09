<template>
  <div>
    <MainLayout
		  :outerParams = 'outerParams'
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      :searchFields="searchFields"
      :searchDefaultData="searchData"
      :columns="columns"
      :searchFunc="searchFunc"
      ref="layout"
      url="product/GlReportUploadList"
    ></MainLayout>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {

      topBatchBtn: {
        title: '记录',
        options: [
          {
            label: '下载'
          }
        ],
        // 搜索
        search: {
          field: 'fileName',
          placeholder: '请输入文件名称'
        }
      },

      edits: [
        {
          name: '下载错误报告',
          icon: 'el-icon-edit-outline',
          fn: () => {
            console.log('下载错误报告')
          }
        }
      ],
      searchFields: {
        importTime: {
          widget: 'daterange',
          noLabel: true,
          time: true 
        }
      },
      searchData: {},
      columns: [
        {
          label: '导入时间',
          value: 'importTime'
        },
        {
          label: '文件名称',
          value: 'fildName'
        },

        {
          type: 'array',
          children: [
            {
              label: '上传状态',
              value: 'importTime'
            },
            {
              label: '',
              value: 'importTime'
            }
          ]
        },

        {
          label: '导入人员',
          value: 'userName'
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, selection) {
      console.log(val, selection)
    },
    searchFunc(data) {
      return data
    }
  },
	computed:{
		outerParams(){
			return {
				reportType:1
			}
		}
	}
}
</script>

<style>
</style>
