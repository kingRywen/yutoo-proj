<template>
  <main-layout
    :outerParams="{...storeInfo, fromData,transportId}"
    :searchFields="searchFields"
    :isExpandAll="true"
    :columns="columns"
    :checkStrictly="false"
    edit-width="160px"
    :dataMethod="dataMethod"
    :isShowPag="false"
    :spanMethod="spanMethod"
    tbRightFixed="right"
    :selectableFunc="selectableFunc"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    :treeTable="true"
    reserveSelection="_id"
    :treeTableOtions="treeTableOtions"
    url="fba/FbaReplenishList"
    ref="layout"
  >
    <div slot="batchRight">
      <div class="lock-icon" :class="{unlock: !lock}" @click="unlock"></div>
    </div>
  </main-layout>
</template>
<script>
import mixin from '../mixin'
export default {
  mixins: [mixin],
  data() {
    let data = this.$route.query.data
    if (!Array.isArray(data)) {
      data = [data]
    }
    data = data.map(el => {
      let [storeId, sellerSku] = el.split('_-_')
      return { storeId, sellerSku }
    })
    return {
      fromData: data,
      transportId:
        this.$route.query.transportId && +this.$route.query.transportId,
      lock: true,
      searchFields: {},
      treeTableOtions: {
        childs: 'childs',
        expandFunc: row => {
          return row.childsCount > 0
        }
      },
      columns: [
        {
          label: 'SKU',
          value: 'sku',
          numField: 'childsCount',
          fixed: 'left',
          expand: true,
          noTooltip: true,
          minWidth: 200
        },
        {
          label: 'ASIN',
          value: 'asin',
          minWidth: 140
        },
        {
          label: 'FNSKU',
          width: 130,
          value: 'fnsku'
        },
        {
          label: '主图',
          width: 65,
          value: 'productImage',
          img: true,
          link: row => {
            return this.storeUrls.asinUrl + row['asin']
          },
          title: 'title'
        },
        {
          label: '运输方式',
          width: 150,
          value: 'transportName',
          headerTooltip: '默认展示最紧急的，可以切换运输方式查看需要补货的产品',
          renderHeader: this.renderTrans.bind(this)
        },
        {
          label: '日均销量',
          sortable: true,
          value: 'avgSales',
          render: this.renderAva.bind(this)
        },
        {
          label: 'FBA总库存',
          sortable: true,
          minWidth: 100,
          value: 'fbaInventory'
        },
        {
          label: '预计日销量',
          value: 'expectedSale',
          minWidth: 150,
          render: this.renderEdit('expectedSale')
        },
        {
          label: '预计送达日期',
          minWidth: 100,
          value: 'expectedArriveDate'
        },
        {
          label: '补货数量',
          value: 'needReplenishNum',
          minWidth: 150,
          render: this.renderEdit('needReplenishNum')
        }
      ],
      topBatchBtn: {
        loading: false,
        title: '产品',
        options: [
          {
            label: '导出'
          }
        ]
      }
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {},
    renderEdit(str) {
      return (h, scope) => {
        // FIXME: 需要修改
        return (
          <el-input-number
            size="mini"
            min={0}
            value={scope.row[str]}
            max={99999999999}
            disabled={!scope.row._my_edit}
            controls={false}
          ></el-input-number>
        )
      }
    },
    dataMethod(list) {
      let ret = []
      list = [
        {
          sku: 'Sport bra-314',
          asin: 'B07W6YY9C8',
          fnsku: '634',
          productImage:
            'http://120.79.124.232/erp-replenish/files/upload/1/amz/mws/image/20191119/amz-mws-image-7FBE4C8C9061C1F8.jpg',
          avgSales: 138,
          fbaInventory: 20019,
          variantsFlag: true,
          storeId: 'AKSUELF',
          listSMP: [
            {
              id: 'A31E4C3286301D8E',
              transportId: 'DJFHFYNF',
              transportName: 'UPS空运',
              transportDays: 7,
              expectedSale: null,
              expectedArriveDate: '2020-1-1',
              needReplenishNum: 200,
              sqId: 'D80C4F81A134A4AD'
            },
            {
              id: 'A31E4C3286301D8E2',
              transportId: 'DJFHFYNF',
              transportName: 'UPS空运1',
              transportDays: 7,
              expectedSale: null,
              expectedArriveDate: '2020-1-1',
              needReplenishNum: 200,
              sqId: 'D80C4F81A134A4AD'
            }
          ],
          childs: [
            {
              sku: 'Sport bra-314-001',
              asin: 'B07W6YY9C8',
              fnsku: '634',
              productImage:
                'http://120.79.124.232/erp-replenish/files/upload/1/amz/mws/image/20191119/amz-mws-image-7FBE4C8C9061C1F8.jpg',
              avgSales: 138,
              fbaInventory: 20019,
              variantsFlag: true,
              storeId: 'AKSUELF',
              listSMP: [
                {
                  id: 'A31E4C3286301D8E',
                  transportId: 'DJFHFYNF',
                  transportName: 'UPS空运',
                  transportDays: 7,
                  expectedSale: null,
                  expectedArriveDate: '2020-1-1',
                  needReplenishNum: 200,
                  sqId: 'D80C4F81A134A4AD'
                },
                {
                  id: 'A31E4C3286301D8E3',
                  transportId: 'DJFHFYNF',
                  transportName: 'UPS空运1',
                  transportDays: 7,
                  expectedSale: null,
                  expectedArriveDate: '2020-1-1',
                  needReplenishNum: 200,
                  sqId: 'D80C4F81A134A4AD'
                }
              ]
            },
            {
              sku: 'Sport bra-314-0012',
              asin: 'B07W6YY9C8',
              fnsku: '634',
              productImage:
                'http://120.79.124.232/erp-replenish/files/upload/1/amz/mws/image/20191119/amz-mws-image-7FBE4C8C9061C1F8.jpg',
              avgSales: 138,
              fbaInventory: 20019,
              variantsFlag: true,
              storeId: 'AKSUELF',
              listSMP: [
                {
                  id: 'A31E4C3286301D8E5',
                  transportId: 'DJFHFYNF',
                  transportName: 'UPS空运',
                  transportDays: 7,
                  expectedSale: null,
                  expectedArriveDate: '2020-1-1',
                  needReplenishNum: 200,
                  sqId: 'D80C4F81A134A4AD'
                },
                {
                  id: 'A31E4C3286301D8E35',
                  transportId: 'DJFHFYNF',
                  transportName: 'UPS空运1',
                  transportDays: 7,
                  expectedSale: null,
                  expectedArriveDate: '2020-1-1',
                  needReplenishNum: 200,
                  sqId: 'D80C4F81A134A4AD'
                }
              ]
            }
          ]
        },
        {
          sku: 'Sport bra-31422',
          asin: 'B07W6YY9C8',
          fnsku: '634',
          productImage:
            'http://120.79.124.232/erp-replenish/files/upload/1/amz/mws/image/20191119/amz-mws-image-7FBE4C8C9061C1F8.jpg',
          avgSales: 138,
          fbaInventory: 20019,
          variantsFlag: true,
          storeId: 'AKSUELF',
          listSMP: [
            {
              id: 'A31E4C3286301D8E3',
              transportId: 'DJFHFYNF',
              transportName: 'UPS空运',
              transportDays: 7,
              expectedSale: null,
              expectedArriveDate: '2020-1-1',
              needReplenishNum: 200,
              sqId: 'D80C4F81A134A4AD'
            }
          ],
          childs: [
            {
              sku: 'Sport bra-314-0015',
              asin: 'B07W6YY9C8',
              fnsku: '634',
              productImage:
                'http://120.79.124.232/erp-replenish/files/upload/1/amz/mws/image/20191119/amz-mws-image-7FBE4C8C9061C1F8.jpg',
              avgSales: 138,
              fbaInventory: 20019,
              variantsFlag: true,
              storeId: 'AKSUELF',
              listSMP: [
                {
                  id: 'A31E4C3286301D8Ew',
                  transportId: 'DJFHFYNF',
                  transportName: 'UPS空运',
                  transportDays: 7,
                  expectedSale: null,
                  expectedArriveDate: '2020-1-1',
                  needReplenishNum: 200,
                  sqId: 'D80C4F81A134A4AD'
                },
                {
                  id: 'A31E4C3286301D8E3',
                  transportId: 'DJFHFYNF',
                  transportName: 'UPS空运1',
                  transportDays: 7,
                  expectedSale: null,
                  expectedArriveDate: '2020-1-1',
                  needReplenishNum: 200,
                  sqId: 'D80C4F81A134A4AD'
                }
              ]
            },
            {
              sku: 'Sport bra-314-0012',
              asin: 'B07W6YY9C8',
              fnsku: '634',
              productImage:
                'http://120.79.124.232/erp-replenish/files/upload/1/amz/mws/image/20191119/amz-mws-image-7FBE4C8C9061C1F8.jpg',
              avgSales: 138,
              fbaInventory: 20019,
              variantsFlag: true,
              storeId: 'AKSUELF',
              listSMP: [
                {
                  id: 'A31E4C3286301D8E5',
                  transportId: 'DJFHFYNF',
                  transportName: 'UPS空运',
                  transportDays: 7,
                  expectedSale: null,
                  expectedArriveDate: '2020-1-1',
                  needReplenishNum: 200,
                  sqId: 'D80C4F81A134A4AD'
                },
                {
                  id: 'A31E4C3286301D8E35',
                  transportId: 'DJFHFYNF',
                  transportName: 'UPS空运1',
                  transportDays: 7,
                  expectedSale: null,
                  expectedArriveDate: '2020-1-1',
                  needReplenishNum: 200,
                  sqId: 'D80C4F81A134A4AD'
                }
              ]
            }
          ]
        }
      ]

      list.forEach(_el => {
        let len
        if (_el.childs) {
          len = _el.childs.length
          let childRet = []
          _el.childs.forEach(el => {
            el.listSMP.forEach((e, index) => {
              childRet.push({
                ...el,
                ...e,
                _id: index == 0 ? el.sku : el.sku + e.id,
                _root: index == 0,
                _sameCount: index == 0 ? el.listSMP.length : null
              })
            })
          })
          _el.childs = childRet
        }
        _el.listSMP.forEach((e, index) => {
          ret.push({
            ..._el,
            ...e,
            _id: index == 0 ? _el.sku : _el.sku + e.id,
            _root: index == 0,
            sameCount: index == 0 ? _el.listSMP.length : null,
            childsCount: index == 0 ? len : null,
            childs: index == _el.listSMP.length - 1 ? _el.childs : null
          })
        })
      })
      return ret
    },
    unlock() {
      this.lock = !this.lock
      this.$refs.layout.tableList.forEach(e => {
        this.$set(e, '_my_edit', !this.lock)
        if (e.childs) {
          e.childs.forEach(c => {
            this.$set(c, '_my_edit', !this.lock)
          })
        }
      })
    },
    selectableFunc(row) {
      return row._root
    },
    spanMethod({ row, column, rowIndex, columnIndex }) {
      // console.log({ row, column, rowIndex, columnIndex })
      const { property } = column,
        arrs = [
          'sku',
          'asin',
          'fnsku',
          'productImage',
          'avgSales',
          'fbaInventory'
        ]
      if (columnIndex === 0 || arrs.indexOf(property) > -1) {
        if (row._level == 1) {
          if (row.sameCount) {
            return [row.sameCount, 1]
          } else {
            return [0, 0]
          }
        } else {
          if (row._sameCount) {
            return [row._sameCount, 1]
          } else {
            return [0, 0]
          }
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.lock-icon {
  background-image: url('./lock.png');
  width: 26px;
  height: 26px;
  cursor: pointer;
  background-position: 1px -4px;
  &.unlock {
    background-image: url('./unlock.png');
    background-position: 1px -1px;
  }
}
</style>