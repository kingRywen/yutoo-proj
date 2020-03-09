<template>
  <div class="export-log">
    <t-page :config="config" ref="page"></t-page>
  </div>
</template>

<script>
export default {
  data() {
    // eslint-disable-next-line
    let vm = this
    return {
      config: {
        url: 'product/globalUploadRecordList',
        id: 'uploadRecordId',
        selectData: [],
        searchForm(val) {
          if (vm.utils.isArrLength(val.date)) {
            val.startDate = val.date[0]
            val.endDate = val.date[1]
            delete val.date
          }
          return val
        },
        moreParams: {},
        searchConfig: [
          {
            label: '导入时间',
            value: 'date',
            type: 'time'
          },
          {
            label: '导入人员',
            value: 'merchantName',
            type: 'input'
          }
        ],
        btnConfig: [
          {
            name: '批量下载',
            fn: val => {
              console.log(val)
              let ids = vm.config.selectData.map(item => item.uploadRecordId)
              return {
                url: 'product/globalUploadRecordBatchDownload',
                params: {
                  ids
                },
                selectOptions: {
                  ids
                },
                fn({ path = '' }) {
                  vm.$download(path)
                }
              }
            }
          }
        ],
        tableConfig: [
          {
            label: '导入时间',
            value: 'createTime',
            width: 130
          },
          {
            label: '上传状态',
            render(h, scope) {
              return (
                <div>
                  <p>上传完成 提交总数量：{scope.row.submitCount}</p>
                  <p>
                    成功：{scope.row.successCount} 失败：
                    {scope.row.failureCount}
                  </p>
                </div>
              )
            }
          },
          {
            label: '类型',
            value: 'recordTypeDesc'
          },
          {
            label: '导入人员',
            value: 'nickName'
          },
          {
            label: '下载处理报告',
            btns: [
              {
                name: '下载',
                type: 'text',
                fn(index, row) {
                  console.log(index, row)
                  return {
                    url: 'product/globalUploadRecordDownload',
                    params: {
                      globalUploadRecordId: row.uploadRecordId
                    },
                    fn({ path = '' }) {
                      vm.$download(path)
                    }
                  }
                }
              }
            ]
          }
        ],
        clickBtn(val) {
          console.log(val)
        }
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang='scss'>
.export-log {
  background: #fff;
}
</style>