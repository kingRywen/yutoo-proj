<template>
  <div>
    <h3>已上传店铺</h3>
    <MainLayout
      :tabs="tabs"
      :columns="columns"
      :treeTable="true"
      :hiddenTopBtn="true"
      :treeTableOtions="treeTableOtions"
      ref="layout"
      url="product/prProductPlatAmzList"
    ></MainLayout>
  </div>
</template>
<script>
export default {
  data() {
    return {
      treeTableOtions: {
        childs: 'childList',
        // eslint-disable-next-line no-unused-vars
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },
      columns: [
        {
          type: 'array',
          children: [
            {
              label: 'Seller SKU',
              value: 'platSku',
              url: 'imgUrl',
              numField: 'childList',
              expand: true,
              noTooltip: true
            },
            {
              label: '状态',
              value: 'platSku',
              noTooltip: true,
              render(h, scope) {
                return (
                  <div>
                    <span>{scope.row.platSku}</span>
                    <el-popover placement="top" width="200" trigger="click">
                      <div>产品下架失败，是否重新下架？</div>
                      <el-button type="text">
                        重新下架
                      </el-button>
                      <el-button type="text" style="color: #999">
                        暂不处理
                      </el-button>
                      <el-button
                        type="text"
                        class="__danger"
                        icon="el-icon-question"
                        slot="reference"
                      ></el-button>
                    </el-popover>
                  </div>
                )
              }
            }
          ]
        },
        {
          type: 'array',
          children: [
            {
              label: '店铺',
              value: 'platSku'
            },
            {
              label: '销售类型',
              value: 'platSku'
            }
          ]
        },

        {
          label: '图片',
          value: 'imgUrl',
          img: true
        },
        {
          type: 'array',
          children: [
            {
              label: '标题',
              value: 'platSku',
              url: 'imgUrl'
            },
            {
              label: 'ASIN',
              value: 'platSku'
            }
          ]
        },
        {
          type: 'array',
          children: [
            {
              label: '平台SKU',
              value: 'platSku'
            },
            {
              label: '仓库自定义SKU',
              value: 'platSku'
            }
          ]
        },
        {
          type: 'array',
          children: [
            {
              label: '导入日期',
              value: 'platSku',
              sortable: 'custom'
            },
            {
              label: '上架时间',
              value: 'platSku'
            }
          ]
        },
        {
          label: '可售',
          value: 'platSku',
          sortable: 'custom'
        },
        {
          label: '不可售',
          value: 'platSku',
          sortable: 'custom'
        },
        {
          label: '入库数量',
          value: 'platSku',
          sortable: 'custom'
        },
        {
          label: '预留数量',
          value: 'platSku',
          sortable: 'custom'
        },
        {
          label: '费用预览',
          value: 'platSku',
          sortable: 'custom'
        },
        {
          type: 'array',
          children: [
            {
              label: '价格',
              value: 'platSku',
              sortable: 'custom'
            },
            {
              label: '+配送费',
              value: 'platSku',
              sortable: 'custom'
            }
          ]
        },
        {
          label: '发货方式',
          value: 'platSku',
          sortable: 'custom'
        }
      ],
      tabs: [
        {
          name: '在售',
          num: 10,
          query: {
            tableStatus: 0
          }
        },
        {
          name: '不可售',
          num: 2,
          query: {
            tableStatus: 1
          }
        },
        {
          name: '待审核',
          num: 2,
          query: {
            tableStatus: 1
          }
        },
        {
          name: '等待上架',
          num: 2,
          query: {
            tableStatus: 1
          }
        },
        {
          name: '上架中',
          num: 2,
          query: {
            tableStatus: 1
          }
        },
        {
          name: '上架失败',
          num: 2,
          query: {
            tableStatus: 1
          }
        },
        {
          name: '所有',
          num: 2,
          query: {
            tableStatus: 1
          }
        }
      ]
    }
  }
}
</script>