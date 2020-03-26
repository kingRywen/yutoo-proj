<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo,merchantTaskId}"
      :searchFields="searchFields"
      :columns="columns"
      @searchTrueData="val => searchData = val"
      @requestSuccess="(_, list) => {isMount = true, isTenLenth = list.length >10}"
      edit-width="160px"
      showFilter
      :btnTip="true"
      tbRightFixed="right"
      :spanMethod="spanMethod"
      :right-edit-btns="editBtns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="proPick/categoryDepthTaskMerchantProductDetails"
      ref="layout"
      :scroll="true"
    >
      <span slot="btnTip">
        需要导入配置属性才可导入属性值，导入日志可以在常用工具-
        <span @click="goImport" style="color:#ff9966;margin-right:0;cursor:pointer;">导入日志</span>中查看，需要把产品移入分组才可做属性分析
      </span>
    </main-layout>
    <!-- <el-button class="anay" type="text" icon="el-icon-cpu"></el-button> -->

    <el-dropdown v-if="isMount" class="anay" @command="handleCommand">
      <span class="el-dropdown-link">
        <!-- <i class="iconfont">&#xe60e;</i> -->
        <el-button type="text" style="padding: 0" icon="iconfont icongongju"></el-button>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="a">卖家列表</el-dropdown-item>
        <el-dropdown-item command="b">统计分析</el-dropdown-item>
        <el-dropdown-item command="c">属性分析</el-dropdown-item>
        <el-dropdown-item command="d">分组管理</el-dropdown-item>
        <el-dropdown-item command="e">属性管理</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
import { timeField, getSearchNumField } from 'Utils/table-render.js'
import { downloadFile } from 'Utils'
export default {
  data() {
    let merchantTaskId = +this.$route.query.id
    return {
      isTenLenth: false,
      isMount: false,
      searchData: {},
      merchantTaskId: merchantTaskId,

      topBatchBtn: {
        loading: false,
        title: '产品',
        options: [
          {
            label: '设置同款'
          },
          {
            label: '移动分组'
          },
          {
            label: '导出',
            children: [
              {
                label: '导出属性值'
              },
              {
                label: '导出产品数据'
              }
            ]
          }
        ]
      },
      searchFields: {
        searchText: {
          placeholder: 'ASIN、标题'
        },
        fbaCnt: getSearchNumField.call(this, 'FBA区间', 'fbaCnt', '80px'),
        fbmCnt: getSearchNumField.call(this, 'FBM区间', 'fbmCnt', '80px'),
        releaseDate: timeField('上架时间', 'releaseDate'),
        salesRank: getSearchNumField.call(
          this,
          '销量排名区间',
          'salesRank',
          '110px'
        ),
        bsr: getSearchNumField.call(this, '大类BSR区间', 'bsr', '105px'),
        newReviewCnt: getSearchNumField.call(
          this,
          '新增评价数区间',
          'newReviewCnt',
          '120px'
        ),
        reviewCnt: getSearchNumField.call(
          this,
          '评价数区间',
          'reviewCnt',
          '92px'
        ),
        qaCnt: getSearchNumField.call(this, 'QA数区间', 'qaCnt', '88px'),
        starCnt: getSearchNumField.call(this, '评分区间', 'starCnt', '80px'),
        price: getSearchNumField.call(this, '价格区间', 'price', '80px'),
        badReviewCnt: getSearchNumField.call(
          this,
          '首页中差评数区间',
          'badReviewCnt',
          '133px'
        ),
        brandLike: {
          label: '品牌',
          hidden: true,
          labelWidth: '52px'
        },
        groupId: {
          label: '分组',
          hidden: true,

          labelWidth: '52px',
          widget: 'select',
          options: () =>
            this.$api[`proPick/categoryDepthTaskMerchantGroupList`]({
              ...this.storeInfo,
              merchantTaskId: merchantTaskId
            }).then(data => {
              data = data.data
              return Object.keys(data)
                .filter(key => key.indexOf('groupName') > -1)
                .map(key => ({
                  value: +key.replace('groupName', ''),
                  label: data[key]
                }))
            })
        },
        mergeFlag: {
          hidden: true,
          defaultVal: true,
          labelWidth: 108,
          widget: 'select',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ],
          label: '是否合并展示'
        },
        sameStyleCnt: getSearchNumField.call(
          this,
          '同款数量区间',
          'sameStyleCnt',
          '105px'
        ),
        styleNameLike: {
          label: '款式',
          widget: 'select',
          filterable: true,
          options: () =>
            this.$api[`proPick/categoryDepthTaskMerchantStyleList`]({
              ...this.storeInfo,
              merchantTaskId: this.merchantTaskId
            }).then(data => data.data.map(el => ({ label: el, value: el }))),
          hidden: true,
          labelWidth: '52px'
        },
        styleType: {
          hidden: true,
          widget: 'select',
          options: [
            {
              label: '是',
              value: true
            },
            {
              label: '否',
              value: false
            }
          ],
          label: '是否款式'
        }
      },
      columns: [
        {
          label: '序号',
          type: 'index',
          width: 50
        },
        {
          label: '款式',
          value: 'styleName',
          noTooltip: true,
          width: 100
        },
        {
          label: 'ASIN',
          width: 130,
          value: 'parentAsin',
          url: true,
          btnClick: scope => {
            window.open(this.currentSite.asinUrl + scope.row.parentAsin)
          }
        },
        {
          label: '主图',
          width: 65,
          value: 'imageUrl',
          img: true,
          link: row => {
            return this.storeUrls.asinUrl + row['parentAsin']
          },
          title: 'title'
        },
        {
          label: '同款数量',
          sortable: 'custom',
          value: 'sameStyleCnt',
          url: true,
          isClick: scope => {
            return scope.row.styleName != null && scope.row.styleName !== ''
          },
          btnClick: scope => {
            this.$_dialog({
              size: 'medium',
              title: '同款产品',
              params: {
                styleName: scope.row.styleName,
                close: () => {
                  this.getLayoutList()
                }
              },
              cancelBtnText: '关闭',
              component: () => import('../dialogs/same.vue')
            })
          }
        },
        {
          label: '销量排名',
          sortable: 'custom',
          value: 'salesRank'
        },
        {
          label: 'BSR',
          sortable: 'custom',
          value: 'bsr',
          url: true,
          minWidth: 90,
          isClick: scope => {
            // return true
            return scope.row.styleName == null || scope.row.styleName == ''
          },
          btnClick: scope => {
            this.$_dialog({
              size: 'medium',
              title: 'BSR',
              params: {
                merchantTaskId: this.merchantTaskId,
                parentAsin: scope.row.parentAsin,
                depth: true
              },
              cancelBtnText: '关闭',
              component: () =>
                import(
                  'Views/modules/proPick/cateAnalyze/detail/dialogs/bsr.vue'
                )
            })
          },
          headerTooltip: '大类SBR,单品单击查看小类排名'
        },
        {
          headerTooltip: '单个产品近30天新增评价数，款式是所有产品近30天累计',
          label: '新增评价数',
          sortable: 'custom',
          width: 120,
          value: 'newReviewCnt'
        },
        {
          label: '评价数',
          sortable: 'custom',
          value: 'reviewCnt',
          url: true,
          btnClick: scope => {
            this._openDialog({
              size: 'medium',
              title: '新增评价曲线',
              params: {
                merchantTaskId: this.merchantTaskId,
                name: scope.row.styleName || scope.row.parentAsin,
                defaultMonth: 6,
                type: 'depth',
                styleName: scope.row.styleName
              },
              cancelBtnText: '关闭',
              component: () =>
                import(
                  'Views/modules/proPick/cateAnalyze/detail/dialogs/reviewChart.vue'
                )
            })
          }
        },
        {
          label: 'QA数',
          sortable: 'custom',
          value: 'qaCnt'
        },
        {
          label: '评分',
          sortable: 'custom',
          value: 'starCnt'
        },
        {
          label: '价格',
          sortable: 'custom',
          width: 140,
          noTooltip: true,
          value: 'price'
        },
        {
          label: '变体数',
          sortable: 'custom',
          value: 'skuCnt'
        },
        {
          label: '上架时间',
          sortable: 'custom',
          width: 100,
          value: 'releaseDate'
        },
        {
          label: '品牌名',
          width: 160,
          value: 'brand',
          noTooltip: true
        },
        {
          label: 'FBA',
          headerTooltip: '1个父产品，不管子产品数量，有FBA，就是1',
          value: 'fbaCnt'
        },
        {
          label: 'FBM',
          headerTooltip: '1个父产品，不管子产品数量，有FBM，就是1',
          value: 'fbmCnt'
        },
        {
          label: '首页中差评数量',
          sortable: 'custom',
          width: 120,
          value: 'badReviewCnt'
        },
        {
          label: '跟卖卖家数',
          sortable: 'custom',
          width: 100,
          value: 'sellerCnt',
          url: true,
          isClick: scope => {
            // return true
            return scope.row.styleName == null || scope.row.styleName == ''
          },
          btnClick: scope => {
            this._openDialog({
              size: 'medium',
              title: '跟卖卖家数',
              params: {
                merchantTaskId: this.merchantTaskId,
                parentAsin: scope.row.parentAsin
              },
              cancelBtnText: '关闭',
              component: () => import('../dialogs/sellers.vue')
            })
          }
        },
        {
          label: '分组',
          value: 'groups',
          noTooltip: true,
          width: '130',
          // fixed: 'right',
          render(h, scope) {
            let { groups } = scope.row
            return (
              <span>{groups && groups.length ? groups.join('，') : '-'}</span>
            )
          }
        }
      ],
      editBtns: [
        {
          name: '导入',
          perm: 'add',
          icon: 'iconfont icondaoru',
          type: 'dropdown',
          btns: [
            {
              name: '导入属性',
              perm: 'add',
              fn: () => {
                this._import(true)
              }
            },
            {
              name: '导入属性值',
              perm: 'add',
              fn: () => {
                this._import(false)
              }
            }
          ]
        },
        {
          name: '导出',
          perm: 'add',
          icon: 'iconfont icondaochu',
          type: 'dropdown',
          showLoading: false,
          btns: [
            {
              name: '导出属性值',
              perm: 'add',
              fn: () => {
                return this._exportProps(this.searchData, true)
              }
            },
            {
              name: '导出产品数据',
              perm: 'add',
              fn: () => {
                return this._export(this.searchData, true)
              }
            }
          ]
        }
        // {
        //   name: '下载',
        //   perm: 'add',
        //   type: 'plain',
        //   icon: 'iconfont icondaochu',
        //   showLoading: true,
        //   fn: () => {
        //     return this._export(this.searchData)
        //   }
        // }
      ]
    }
  },
  computed: {
    searchString() {
      let ret = ''
      Object.keys(this.searchData).forEach(key => {
        if (key == 'pageSize' || key == 'pageNumber') {
          return
        }
        ret += key + ':' + this.searchData[key] + '--'
      })
      return ret
    }
  },
  methods: {
    spanMethod({ column, rowIndex }) {
      // console.log(columnIndex)

      if (column.index == 9999) {
        if (rowIndex == 0) {
          return [100, 1]
        } else {
          return [0, 0]
        }
      }
    },
    getMore() {
      let table = this.$refs.layout.$el.querySelectorAll(
        '.el-table__body-wrapper'
      )[0]
      table.scrollLeft += 430
    },
    handleLeftBatchChange(val, sel) {
      let text = sel.map(e => e.parentAsin),
        styleNames = sel
          .map(e => e.styleName)
          .filter(e => e != null && e !== ''),
        parentAsins = sel.map(e => e.parentAsin)
      switch (val[0]) {
        case '设置同款':
          this.setSame(styleNames, parentAsins)
          break
        case '移动分组':
          this.moveGroup(
            styleNames,
            parentAsins,
            sel.length == 1 ? sel[0].groups : undefined
          )
          break
        case '复制':
          this.cfuns.copyText(text.join('\n'))
          break
        case '导出':
          switch (val[1]) {
            case '导出产品数据':
              return this._export({
                parentAsins
              })
            case '导出属性值':
              return this._exportProps({
                parentAsins
              })

            default:
              break
          }
          break
        default:
          break
      }
    },
    // 导出属性值
    _exportProps(params, isRight) {
      params = {
        ...params,
        exportType: 0,
        ...this.storeInfo,
        merchantTaskId: this.merchantTaskId
      }
      !isRight
        ? (this.topBatchBtn.loading = true)
        : (this.editBtns[1].showLoading = true)
      return this.$api[`proPick/categoryDepthTaskMerchantProductAttrExport`](
        params
      )
        .then(data => {
          !isRight
            ? (this.topBatchBtn.loading = false)
            : (this.editBtns[1].showLoading = false)
          downloadFile(data, '产品属性值列表.xlsx')
        })
        .catch(() => {
          !isRight
            ? (this.topBatchBtn.loading = false)
            : (this.editBtns[1].showLoading = false)
        })
    },
    setSame(styleNames, parentAsins) {
      this.$_dialog({
        size: 'medium',
        title: '设置同款',
        params: {
          styleNames,
          parentAsins,
          merchantTaskId: this.merchantTaskId
        },
        cancelBtnText: '取消',
        okBtnText: '保存',
        component: () => import('../dialogs/setSame.vue')
      })
    },
    moveGroup(styleNames, parentAsins, groups) {
      this.$_dialog({
        size: 'medium',
        title: '移动分组',
        params: {
          styleNames,
          parentAsins,
          groups,
          merchantTaskId: this.merchantTaskId
        },
        cancelBtnText: '取消',
        okBtnText: '保存',
        component: () => import('../dialogs/moveGroup.vue')
      })
    },
    requestSuccess(suc, list) {
      this.isTenLenth = list.length > 10
    },
    goImport() {
      this.$router.push({
        path: '/common/importLogs',
        query: { importType: 3 }
      })
    },
    _import(isProp) {
      const title = isProp ? '导入属性' : '导入属性值'
      this.$_dialog({
        fullscreen: false,
        size: 'medium',
        title,
        params: {
          params: {
            importType: isProp ? 3 : 4,
            merchantTaskId: this.merchantTaskId,
            filename: title,
            isMainLayout: true,
            success: () => {
              this.$refs.layout.getList()
            }
          }
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('Views/common/dialog/import.vue')
      })
    },
    _export(params, isRight) {
      !isRight
        ? (this.topBatchBtn.loading = true)
        : (this.editBtns[1].showLoading = true)
      return this.$api[`proPick/categoryDepthTaskMerchantProductDetailsExport`](
        {
          ...params,
          exportType: 0,
          ...this.storeInfo,
          merchantTaskId: this.merchantTaskId
        }
      )
        .then(data => {
          !isRight
            ? (this.topBatchBtn.loading = false)
            : (this.editBtns[1].showLoading = false)
          downloadFile(data, '产品列表.xlsx')
        })
        .catch(() => {
          !isRight
            ? (this.topBatchBtn.loading = false)
            : (this.editBtns[1].showLoading = false)
        })
    },

    handleCommand(command) {
      let href,
        searchData = { ...this.searchData }
      delete searchData.pageSize
      delete searchData.pageNumber
      // delete searchData.platformId
      // delete searchData.siteId
      // delete searchData.merchantTaskId
      delete searchData.field
      delete searchData.sort
      switch (command) {
        case 'a':
          // 卖家列表
          href = this.$router.resolve({
            path: '/proPick/deepCateAnalyze/detail/sellers',
            query: {
              merchantTaskId: this.merchantTaskId,
              params: JSON.stringify(searchData)
            }
          }).href
          window.open(href)
          break
        case 'e':
          // 属性管理
          this.$_dialog({
            size: 'medium',
            title: '属性管理',
            params: { merchantTaskId: this.merchantTaskId },
            cancelBtnText: '关闭',
            component: () => import('../dialogs/propMng.vue')
          })
          break
        case 'd':
          // 分组管理
          this.$_dialog({
            size: 'medium',
            title: '分组管理',
            params: { merchantTaskId: this.merchantTaskId },
            cancelBtnText: '取消',
            okBtnText: '保存',
            component: () => import('../dialogs/groupMng.vue')
          })
          break
        case 'b':
          // 统计分析
          href = this.$router.resolve({
            path: '/proPick/deepCateAnalyze/detail/statisticAnalysis',
            query: {
              merchantTaskId: this.merchantTaskId,
              params: JSON.stringify(searchData)
            }
          }).href
          window.open(href)
          break

        case 'c':
          this.$_dialog({
            size: 'medium',
            title: '属性分析',
            params: {},
            cancelBtnText: '取消',
            okBtnText: '分析',
            component: () => import('../dialogs/propAna')
          })
          break

        default:
          break
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.anay {
  position: absolute;
  right: 23px;
  top: -20px;
  /deep/ i {
    font-size: 24px;
  }
}
</style>