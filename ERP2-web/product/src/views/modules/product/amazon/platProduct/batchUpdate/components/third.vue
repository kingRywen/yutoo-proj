<template>
  <div>
    <MainLayout
      :edit-btns="edits"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      :searchFields="searchFields"
      :searchDefaultData="searchData"
      :columns="columns"
      :searchFunc="searchFunc"
      ref="layout"
      url="product/prProductPlatAmzList"
    ></MainLayout>
  </div>
</template>

<script>
export default {
  data() {
    // let vm = this
    return {
      leftTree: {
        props: {
          label: 'catePlatName',
          children: 'childArray'
          // isLeaf: 'leaf'
        },
        // 要传给后端的搜索数据
        dataFn(data) {
          return { catePlatId: data.catePlatId }
        },
        // 懒加载
        dataPromise: () => {
          return this.$api[`product/catePlatTree`]({}).then(data => {
            return [
              {
                catePlatName: '全部',
                catePlatId: -1,
                childArray: data.rows
              }
            ]
          })
        }
      },

      topBatchBtn: {
        title: '记录',
        options: [
          {
            label: '下载'
          }
        ],
        // 搜索
        search: {
          field: 'search',
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
      tabs: [
        {
          name: '正常',
          num: 10,
          query: {
            tableStatus: 0
          }
        },
        {
          name: '基本信息待编辑',
          num: 2,
          query: {
            tableStatus: 1
          }
        }
      ],
      searchFields: {
        importTime: {
          widget: 'daterange',
          noLabel: true,
          time: true // 是否显示时间
        }
      },
      searchData: {},
      columns: [
        {
          label: '导入时间',
          value: 'platSku'
        },
        {
          label: '文件名称',
          value: 'imgUrl'
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
          value: 'salePrice'
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
  }
}
</script>

<style>
</style>
