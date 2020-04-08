<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo, fromData,transportId: selectTran.value}"
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
    <div class="__loading" v-if="showPercent">
      <el-progress type="circle" :percentage="percentage"></el-progress>
    </div>
  </div>
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
      showPercent: false,
      hasSetted: false,
      percentage: 0,
      fromData: data,
      transportId: this.$route.query.transportId,
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
          value: 'sellerSku',
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
          width: 180,
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
  beforeDestroy() {
    clearInterval(this._interval)
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      this._export(sel)
    },
    _export(sel) {
      const el = [].find.call(
        document.querySelectorAll('.over .el-input-number .el-input__inner'),
        e => e.value === '' || e.value == null
      )
      if (el) {
        this.showTips(
          { msg: '表格中的数据未填写完整，是否继续导出?' },
          () => {
            this.openExportDia(sel)
          },
          () => {
            el.focus()
          }
        )
      } else {
        this.openExportDia(sel)
      }
    },
    openExportDia(sel) {
      this.$_dialog({
        size: 'medium',
        title: '提示',
        fullscreen: false,
        params: { sel: sel, parent: this.$refs.layout.dataList },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./exportData.vue')
      })
    },
    renderEdit(str) {
      let vm = this
      const params = {
        expectedSale: {
          name: 'FbaReplenishSetAvgSale',
          val: 'expectedAvgSales',
          handler(data, scope, parentFlag, variationType) {
            const { listSmp, childs, expectedAvgSales } = data
            const { row } = scope
            vm.$set(row, 'needReplenishNum', listSmp[0].needReplenishNum)
            if (variationType == 3) {
              return
            }
            if (parentFlag) {
              vm.$set(row, 'expectedSale', expectedAvgSales)
              row.childs.forEach(e => {
                let cur = childs.find(c => c.sku == e.sellerSku)
                if (cur) {
                  vm.$set(e, 'expectedSale', cur.expectedAvgSales)
                  vm.$set(
                    e,
                    'needReplenishNum',
                    cur.listSmp[0].needReplenishNum
                  )
                }
              })
            } else {
              vm.$set(
                row.parent,
                'expectedSale',
                row.parent.childs.reduce(
                  (total, cur) => (total += cur.expectedSale || 0),
                  0
                )
              )
            }
          }
        },
        needReplenishNum: {
          name: 'FbaReplenishSetParentQty',
          val: 'num',
          handler(data, scope, parentFlag, variationType) {
            const { row } = scope

            if (variationType == 3) {
              return
            }
            if (!parentFlag) {
              vm.$set(
                row.parent,
                'needReplenishNum',
                row.parent.childs.reduce(
                  (total, cur) => (total += cur.needReplenishNum || 0),
                  0
                )
              )
              return
            }
            const { beans, num } = data
            vm.$set(row, 'needReplenishNum', num)
            row.childs.forEach(e => {
              let cur = beans.find(c => c.sku == e.sellerSku)
              vm.$set(e, 'needReplenishNum', cur.num)
            })
          }
        }
      }
      const cur = params[str]
      return (h, scope) => {
        // variationType 1是母体 2是变体 3是独立产品
        // str -> expectedSale 预计日销量 needReplenishNum 补货数量
        let {
          variationType,
          sellerSku,
          asin,
          fnsku,
          storeId,
          listSMP,
          childs
        } = scope.row

        childs &&
          (childs = childs.map(e => {
            const {
              sellerSku,
              asin,
              fnsku,
              productImage,
              avgSales,
              fbaInventory,
              storeId,
              listSMP
            } = e
            return {
              sellerSku,
              asin,
              fnsku,
              productImage,
              avgSales,
              fbaInventory,
              variantsFlag: 2,
              storeId,
              listSMP
            }
          }))

        return (
          <el-input-number
            size="mini"
            style="width: 100%"
            min={0}
            onChange={val => {
              const parentFlag = variationType == 1
              vm.$set(scope.row, str, val)
              // debugger
              if (str == 'needReplenishNum' && !parentFlag) {
                cur.handler([], scope, parentFlag, variationType)
                return
              }

              this.showPercent = true
              this.hasSetted = false
              this.percentage = 0
              this._interval = setInterval(() => {
                if (this.percentage >= 100) {
                  clearInterval(this._interval)
                  return
                }
                if (this.percentage >= 90 && !this.hasSetted) {
                  return
                }
                this.percentage = Math.min(
                  (this.percentage * 10000 + 40000) / 10000,
                  100
                )
              }, 200)

              vm.$api[`fba/${cur.name}`]({
                parentFlag,
                transportId: vm.selectTran.value,
                sellerSku,
                asin,
                fnsku,
                storeId,
                listSMP,
                childs,
                [cur.val]: val
              })
                .then(data => {
                  this.percentage = 100

                  setTimeout(() => {
                    this.hasSetted = true
                    this.showPercent = false
                  }, 600)

                  if (data.data.errorInfo && data.data.errorInfo.length) {
                    this.$message({
                      type: 'warning',
                      dangerouslyUseHTMLString: true,
                      message: data.data.errorInfo.join('<br>')
                    })
                  }
                  if (str == 'needReplenishNum' && data.msg) {
                    this.$message({
                      type: 'warning',
                      dangerouslyUseHTMLString: true,
                      message: data.msg
                    })
                  }
                  cur.handler(data.data, scope, parentFlag, variationType)
                })
                .catch(() => {
                  this.showPercent = false
                  this.hasSetted = false
                  this.percentage = 0
                  clearInterval(this._interval)
                })
            }}
            value={scope.row[str]}
            max={99999999999}
            disabled={this.lock}
            controls={false}
          ></el-input-number>
        )
      }
    },
    dataMethod(list) {
      let ret = []

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
      // this.$refs.layout.tableList.forEach(e => {
      //   this.$set(e, '_my_edit', !this.lock)
      //   if (e.childs) {
      //     e.childs.forEach(c => {
      //       this.$set(c, '_my_edit', !this.lock)
      //     })
      //   }
      // })
    },
    selectableFunc(row) {
      return row._root
    },
    spanMethod({ row, column, columnIndex }) {
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
.__loading {
  position: fixed;
  z-index: 222;
  left: 50%;
  top: 50%;
  &:before {
    content: '';
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: rgba($color: #fff, $alpha: 0.4);
  }
}
</style>