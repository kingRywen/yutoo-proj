<template>
  <MainLayout
    v-if="outerParams.platSiteId != null"
    :outerParams="outerParams"
    :edit-btns="edits"
    :tabs="tabs"
    :leftTree="leftTree"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    :searchFields="searchFields"
    :searchDefaultData="searchData"
    :right-edit-btns="editBtns"
    :columns="columns"
    :treeTable="treeTable"
    :editWidth="200"
    arrowLeft="-10px"
    :searchFunc="searchFunc"
    :treeTableOtions="treeTableOtions"
    ref="layout"
    url="product/prProductPlatAmzList"
  ></MainLayout>
</template>

<script>
import mixins from '../../mixins'
import { platProductAct } from 'Store/helper/platProduct'
export default {
  mixins: [mixins],
  data() {
    // let vm = this
    return {
      // 平台id
      platId: 1,
      treeTable: true,
      treeTableOtions: {
        childs: 'childList',
        // eslint-disable-next-line no-unused-vars
        expandFunc: row => {
          return row.childList && row.childList.length > 0
        }
      },

      leftTree: {
        nodeKey: 'catePlatId',
        currentKey: -1,
        props: {
          label: 'systemCategoryName',
          children: 'childArray'
          // isLeaf: 'leaf'
        },
        topHandle: [
          {
            icon: 'el-icon-refresh',
            content: '刷新',
            fn: () => {
              this.$refs.layout.getLeftTreeData()
            }
          }
        ],
        // 要传给后端的搜索数据
        dataFn(data) {
          if (data.catePlatId == -1) {
            return {}
          }
          return { catePlatId: data.catePlatId }
        },
        // 懒加载
        dataPromise: (row = {}) => {
          return this.$api[`product/catePlatTree`]({
            parentId: row.parentId || -1,
            platId: this.platId,
            platSiteId: this.outerParams.platSiteId
          }).then(data => {
            return [
              {
                systemCategoryName: '全部',
                catePlatId: -1,
                childArray: data.rows
              }
            ]
          })
        }
      },

      topBatchBtn: {
        options: [
          {
            label: '审核',
            children: [
              {
                label: '平台信息审核通过'
              },
              {
                label: '平台信息审核不通过'
              },
              {
                label: '图片信息审核通过'
              },
              {
                label: '图片信息审核不通过'
              }
            ]
          },
          {
            label: '作废'
          },
          {
            label: '取消作废'
          },
          {
            label: '分配编辑人员'
          },
          {
            label: '复制产品',
            children: [
              {
                label: '复制到新父产品'
              },
              {
                label: '复制到已有父产品'
              }
            ]
          },
          {
            label: '移动产品'
          },
          {
            label: '删除'
          },
          {
            label: '自定义导出'
          }
        ],
        // 搜索
        search: {
          field: 'search',
          placeholder: '请输入仓库SKU、平台SKU、中英文名称'
        }
      },

      edits: [
        /**
         * 平台信息待编辑状态
         */

        // 审核通过产品进入平台信息已完成状态，审核不通过必须输入原因并打回平台信息待编辑，
        // 编辑人员可以查看审核不通过的原因，进行编辑再次提交或者作废删除
        {
          name: '查看理由',
          fn: scope => {
            if (scope.row.tableStatus == 4) {
              // 查看锁定理由
              this.viewReason(scope.row.productPlatId, 3)
            } else {
              // 查看普通理由
              this.viewReason(scope.row.productPlatId, 3, 1)
            }
          }
        },
        {
          name: '上架',
          fn: scope => {
            this.$router.push({
              path: '/product/amazon/platProduct/shelves',
              query: this.addParams({
                productPlatId: scope.row.productPlatId
              })
            })
          }
        },
        {
          name: '编辑',
          fn: scope => {
            let { productPlatId, platSku } = scope.row
            this.$router.push({
              path: '/product/amazon/platProduct/edit',
              query: this.addParams({
                platId: this.platId,
                productPlatId,
                catePlatId: scope.row.catePlatId,
                platSku
              })
            })
          }
        },
        /**
         * 平台信息待审核
         */
        {
          name: '审核',
          fn: scope => {
            this.$router.push({
              path: '/product/amazon/platProduct/infoAudit',
              query: this.addParams({ productPlatId: scope.row.productPlatId })
            })
          }
        },

        /**
         * 图片待编辑
         */
        {
          name: '图片编辑',
          fn: scope => {
            this.$router.push({
              path: '/product/amazon/platProduct/imgEdit',
              query: this.addParams({
                productPlatId: scope.row.productPlatId
              })
            })
          }
        },

        /**
         * 图片待审核
         */

        {
          name: '图片审核',
          fn: scope => {
            this.$router.push({
              path: '/product/amazon/platProduct/imgAudit',
              query: this.addParams({
                productPlatId: scope.row.productPlatId
              })
            })
          }
        },
        {
          name: '打回仓库产品',
          fn: scope => {
            this.backToEdit(scope.row)
          }
        },
        {
          name: '废除',
          fn: scope => {
            this.abolish(
              { productPlatId: scope.row.productPlatId },
              1,
              !!scope.row.count
            )
          }
        },

        /**
         * 废除
         */

        {
          name: '取消废除',
          fn: scope => {
            this.abolish({ productPlatId: scope.row.productPlatId }, 0)
          }
        },

        /**
         * 平台信息已完成
         */
        {
          name: '选择预上架店铺',
          fn: scope => {
            this.$dialog({
              title: '选择预期上架的店铺',
              params: this.addParams({
                productPlatId: scope.row.productPlatId
              }),
              component: () => import('./dialogs/selectStore.vue'),
              okBtnText: '确认'
            })
          }
        },

        {
          name: '删除',
          fn: scope => {
            this.deletePro([scope.row.productPlatId], !!scope.row.count)
          }
        },

        /**
         * 店铺信息待编辑
         */

        {
          name: '撤销图片编辑',
          fn: scope => {
            this.undoImageEdit(scope.row.productPlatId)
          }
        },

        {
          name: '查看已上架的店铺',
          fn: scope => {
            this.checkoutStore(scope.row.productPlatId)
          }
        },

        // /**
        //  * 锁定
        //  */

        // {
        //   name: '查看锁定原因',
        //   fn: scope => {
        //     this.viewReason(scope.row.productPlatId, 3)
        //   }
        // },

        {
          name: '操作日志',
          fn: scope => {
            this.viewLog(scope.row)
          }
        }
      ],
      tabs: [
        {
          name: '正常',
          num: '-',
          query: {
            tableStatus: 0
          }
        },
        {
          name: '基本信息待编辑',
          num: '-',
          query: {
            tableStatus: 1
          }
        },
        {
          name: '基本信息待审核',
          num: '-',
          query: {
            tableStatus: 2
          }
        },
        {
          name: '基本信息已完成',
          num: '-',
          query: {
            tableStatus: 3
          }
        },
        {
          name: '锁定',
          num: '-',
          query: {
            tableStatus: 4
          }
        },
        {
          name: '废除',
          num: '-',
          query: {
            tableStatus: 5
          }
        },
        {
          name: '店铺信息待编辑',
          num: '-',
          query: {
            tableStatus: 6
          }
        },
        {
          name: '图片待编辑',
          num: '-',
          query: {
            tableStatus: 7
          }
        },
        {
          name: '图片待审核',
          num: '-',
          query: {
            tableStatus: 8
          }
        }
      ],
      searchFields: {
        productType: {
          labelWidth: '70px',
          widget: 'radio',
          label: '产品类型',
          options: this.$const['PRODUCT_PLAT/productType']
        },

        productSource: {
          hidden: true,
          labelWidth: '90px',
          widget: 'select',
          label: '产品来源',
          options: this.$const['PRODUCT_PLAT/productSource']
        },

        importTime: {
          hidden: true,
          widget: 'daterange',
          label: '导入时间',
          time: true // 是否显示时间
        },

        productType1: {
          hidden: true,
          labelWidth: '80px',
          widget: 'select',
          label: '发货仓库',
          options: '$store.platProduct.deliveryWarehouse'
        },

        platOperator: {
          hidden: true,
          labelWidth: '130px',
          widget: 'select',
          label: '平台信息编辑人员',
          options: '$store.platProduct.deliveryWarehouse'
        },

        imgOperator: {
          hidden: true,
          labelWidth: '100px',
          widget: 'select',
          label: '图片编辑人员',
          options: '$store.platProduct.deliveryWarehouse'
        },

        store: {
          hidden: true,
          labelWidth: '80px',
          widget: 'select',
          label: '上架店铺',
          options: '$store.platProduct.deliveryWarehouse'
        }
      },
      searchData: {},
      editBtns: [
        {
          type: 'dropdown',
          btns: [
            {
              name: '导入仓库产品',
              perm: 'addTask',
              fn: () => {
                this.importBasePro()
              }
            },
            {
              name: '一键导入',
              perm: 'addTask',
              fn: () => {
                this.keyToBasePro()
              }
            }
          ]
        },
        {
          name: '批量更新产品信息',
          perm: 'addTask',
          fn: () => {
            this.$router.push({
              path: '/product/amazon/platProduct/batchUpdate',
              query: this.addParams({})
            })
          }
        }
      ],
      columns: [
        {
          label: '平台SKU',
          value: 'platSku',
          // width: 150,
          url: true,
          routerTo: row => {
            return {
              path: '/product/amazon/platProduct/viewInfo',
              query: {
                platSiteId: this.outerParams.platSiteId,
                productPlatId: row.productPlatId,
                platSku: row.productPlatId
              }
            }
          },
          numField: 'childList',
          expand: true
        },
        {
          label: '图片',
          img: true,
          value: 'imgUrl'
        },
        // {
        //   sortable: true,
        //   label: '任务名称1',
        //   value: 'productStatus',
        //   _enum: {
        //     '0': '成功',
        //     '1': '失败'
        //   }
        //   // expand: true
        // },
        {
          type: 'array',
          children: [
            {
              label: '仓库SKU',
              value: 'repoSku'
            },
            {
              label: '系统SKU',
              value: 'sysSku'
            }
          ]
        },
        {
          type: 'array',
          children: [
            {
              label: '产品名称',
              value: 'productName'
            },
            {
              label: '标题',
              value: 'productTitle'
            }
          ]
        },

        {
          label: '导入日期',
          value: 'importTime',
          sortable: true
        },

        {
          type: 'array',
          children: [
            {
              label: '状态',
              value: 'productStatus',
              render: (h, scope) => {
                return this.renderStatus(h, scope, 0)
              }
            },
            {
              label: '',
              value: 'imgEditCnt',
              render: (h, scope) => {
                return this.renderStatus(h, scope, 1)
              }
            }
          ]
        },
        {
          type: 'array',
          children: [
            {
              label: '信息编辑人员',
              value: 'basicEditor'
            },
            {
              label: '图片人员',
              value: 'imgEditor'
            }
          ]
        },
        {
          label: '售价',
          money: 'us',
          sortable: true,
          value: 'salePrice'
        }
      ]
    }
  },
  computed: {
    outerParams() {
      return {
        platSiteId: this.$store.state.product.platProduct.selectedSite.value
      }
    }
  },
  created() {
    this.getButtedSiteList({ isSite: true, platId: this.platId })
  },
  watch: {
    'outerParams.platSiteId': {
      immediate: true,
      handler(val) {
        if (val) {
          this.getListCount()
        }
      }
    }
  },
  methods: {
    ...platProductAct,
    // 获取tab页产品数量
    getListCount() {
      let params = { platSiteId: this.outerParams.platSiteId }
      this.$api[`product/prProductPlatAmzListCount`](params).then(data => {
        const rows = data.rows
        this.tabs.forEach(el => {
          let e = rows.find(e => e.pageType === el.query.tableStatus)
          if (e) {
            el.num = e.total
          } else {
            el.num = 0
          }
        })
      })
    },

    // 查看原因 returnType  1平台信息编辑打回 0锁定
    /**
     *  1.基本信息审核
        2.图片信息审核
        3.打回锁定原因
     */
    viewReason(productPlatId, type, returnType = 0) {
      this.$dialog({
        title: '查看理由',
        params: this.addParams({ type, productPlatId }),
        okBtnText: returnType == 1 ? '编辑重新提交' : undefined,
        cancelBtnText: returnType == 1 ? '取消' : undefined,
        component: () => import('./dialogs/viewReason')
      })
    },
    // 撤销图片编辑
    undoImageEdit(productPlatId) {
      this.showTips({ msg: '是否撤销此产品的图片编辑？' }, () => {
        let params = this.addParams({ productPlatId })
        return this.$api[`product/prProductPlatAmzRemoveLogic`](params)
      })
    },

    // 查看已上架的店铺
    checkoutStore(productPlatId) {
      this.$router.push({
        path: '/product/amazon/platProduct/cstore',
        query: this.addParams({ productPlatId })
      })
    },

    // 查看操作日志
    viewLog({ productPlatId }) {
      this.$dialog({
        title: '产品操作日志',
        params: { productPlatId },
        component: () => import('./dialogs/log.vue')
      })
    },
    //  flag 0取消废除 1废除
    abolish({ productPlatId }, flag = 1, parent = true) {
      this.showTips({ msg: `是否${!flag ? '取消' : ''}作废此产品？` }, () => {
        let params = this.addParams({ productPlatIds: [productPlatId], flag })
        return this.$api[
          `product/${
            parent
              ? 'prProductPlatAmzRemoveLogic'
              : 'prProductPlatAmzRemoveChildLogic'
          }`
        ](params)
      })
    },
    // 打回到仓库产品
    backToEdit({ productRepoId }) {
      this.$dialog({
        title: '打回编辑',
        params: this.addParams({
          platSiteId: this.outerParams.platSiteId,
          productRepoId
        }),
        component: () => import('./dialogs/backToEdit.vue'),
        okBtnText: '确认'
      })
    },
    // 复制到已有产品
    copyToExist(productPlatIds) {
      this.$dialog({
        title: '选择产品',
        params: this.addParams({
          productPlatIds
        }),
        component: () => import('./dialogs/copyToExist.vue'),
        okBtnText: '确认关联'
      })
    },
    // 复制产品
    copyPro(productPlatIds) {
      this.$dialog({
        title: '输入父产品平台SKU',
        params: this.addParams({
          productPlatIds
        }),
        component: () => import('./dialogs/copyPro.vue'),
        okBtnText: '确认复制产品',
        cancelBtnText: '取消'
      })
    },
    // 一键导入仓库产品
    keyToBasePro() {
      this.$api[`product/prProductRepoNumber`]({}).then(data => {
        this.showTips(
          {
            msg: `一键导入是将所有未导入的正常状态的仓库产品导入进来，即将导入 <b style="color:red;font-size:18px">${data.number}</b> 条变体，是否确认导入?`
          },
          () => {
            return this.$api[`product/prProductPlatAmzImportAll`]({
              platSiteId: this.outerParams.platSiteId
            })
          },
          () => {}
        )
      })
    },
    // 导入仓库产品
    importBasePro() {
      this.$dialog({
        title: '选择导入产品',
        params: {
          platSiteId: this.outerParams.platSiteId
        },
        component: () => import('./dialogs/importBasePro.vue'),
        okBtnText: '导入'
      })
    },

    renderStatus(h, scope, type) {
      // type == 0 : 第一行渲染
      // type == 1 : 第二行渲染

      // 渲染逻辑：
      // 1. 如果有图片状态（待编辑、待审核），则展示图片状态
      // 2. 如果没有图片状态，显示产品状态: 1-平台信息待编辑 2-平台信息待审核 3-平台信息已完成  4-锁定 5-废除

      let { productStatus, imgEditCnt, imgAuditCnt } = scope.row,
        jsx

      function getImgJsx(name = 'imgEditCnt') {
        return (
          <span>
            图片信息待
            {name == 'imgEditCnt'
              ? `编辑 ( ${imgEditCnt} )`
              : `审核 ( ${imgAuditCnt} )`}
          </span>
        )
      }

      function getProStatus(status) {
        return (
          <span>
            {status == 1
              ? '平台信息待编辑'
              : status == 2
              ? '平台信息待审核'
              : status == 3
              ? '平台信息已完成'
              : status == 4
              ? '锁定'
              : status == 5
              ? '废除'
              : '-'}
          </span>
        )
      }
      if (type == 0) {
        if (imgEditCnt || imgAuditCnt) {
          jsx = getImgJsx(imgEditCnt ? 'imgEditCnt' : 'imgAuditCnt')
        } else {
          jsx = getProStatus(productStatus)
        }
      } else {
        if ((imgEditCnt && !imgAuditCnt) || (!imgEditCnt && imgAuditCnt)) {
          jsx = getProStatus(productStatus)
        } else if (imgEditCnt && imgAuditCnt) {
          jsx = getImgJsx('imgAuditCnt')
        } else {
          jsx = <span></span>
        }
      }

      return jsx
    },
    sortChange({ column, prop, order }) {
      console.log({ column, prop, order })
    },
    searchFunc(data) {
      const { importTime, ...info } = data
      const [importStartTime, importEndTime] = importTime || []
      return { importStartTime, importEndTime, ...info }
    },
    handleLeftBatchChange(val, selection) {
      let productPlatIds = selection.map(el => el.productPlatId)
      if (val[0] === '审核') {
        this.audit(val[1], selection)
      } else {
        switch (val[0]) {
          case '作废':
            this.removeLogic(1, productPlatIds)
            break
          case '取消作废':
            this.removeLogic(0, productPlatIds)
            break
          case '分配编辑人员':
            this.assignEditorialStaff(productPlatIds)
            break
          case '复制产品':
            if (val[1] === '复制到新父产品') {
              this.copyPro(productPlatIds)
            }
            if (val[1] === '复制到已有父产品') {
              this.copyToExist(productPlatIds)
            }

            break
          case '移动产品':
            if (
              selection.every(
                el => el.cateId === selection[0].cateId && el.count == null
              )
            ) {
              this.movePro(selection)
            } else {
              this.$message.warning('请选择具有相同底层类目的变体')
            }

            break
          case '删除':
            this.deletePro(productPlatIds)
            break
          case '自定义导出':
            this.customExport(productPlatIds)
            break

          default:
            break
        }
      }
    },
    customExport(productPlatIds) {
      this.$dialog({
        title: '自定义导出',
        // 可以传参到弹窗组件
        params: {
          saveName: 'amazonPlatPr',
          productPlatIds,
          platSiteId: this.outerParams.platSiteId
        },
        component: () => import('./dialogs/customEx.vue'),
        okBtnText: '导出'
      })
    },

    addParams(params) {
      return { ...this.outerParams, ...params }
    },

    // 删除产品
    deletePro(productPlatIds, parent = true) {
      let params = parent
        ? { productPlatIds }
        : { productPlatId: productPlatIds[0] }
      const _delete = () => {
        return this.$api[
          `product/${
            parent ? 'prProductPlatAmzRemove' : 'prProductPlatAmzRemoveChild'
          }`
        ](this.addParams(params))
      }

      this.showTips(
        { msg: `是否删除${productPlatIds.length ? '此' : '选中的'}产品？` },
        _delete
      )
    },

    // 移动产品
    movePro(selection) {
      this.$dialog({
        title: '移动产品',
        params: {
          platSiteId: this.outerParams.platSiteId,
          params: {
            data: selection
          }
        },
        component: () => import('./dialogs/movePro.vue'),
        okBtnText: '确认',
        cancelBtnText: '取消'
      })
    },

    // 分配编辑人员
    assignEditorialStaff(productPlatIds) {
      this.$dialog({
        title: '分配编辑人员',
        params: this.addParams({ productPlatIds }),
        component: () => import('./dialogs/assignEditorialStaff.vue'),
        okBtnText: '确认',
        cancelBtnText: '取消'
      })
    },

    // 审核
    audit(val, ids, auditReason) {
      this.showTips({ msg: `是否将选中产品的${val}？` }, () => {
        let api,
          params = {
            ...this.outerParams
          }
        switch (val) {
          case '平台信息审核通过':
            api = 'prProductPlatAmzAuditBasic'
            params.productPlatIds = ids.map(el => el.productPlatId)
            params.flag = 1
            break
          case '平台信息审核不通过':
            api = 'prProductPlatAmzAuditBasic'
            params.productPlatIds = ids.map(el => el.productPlatId)
            params.flag = 0
            params.auditReason = auditReason
            break
          case '图片信息审核通过':
            api = 'prProductPlatAmzAuditImg'
            params.taskIds = ids.map(el => el.taskId)
            params.flag = 1
            break
          case '图片信息审核不通过':
            api = 'prProductPlatAmzAuditImg'
            params.taskIds = ids.map(el => el.taskId)
            params.flag = 0
            params.auditReason = auditReason
            break

          default:
            break
        }
        return this.$api[`product/${api}`](params)
      })
    },

    // 作废 1 取消作废
    removeLogic(flag, productPlatIds) {
      this.$api[`product/prProductPlatAmzRemoveLogic`]({
        ...this.outerParams,
        flag,
        productPlatIds
      }).then(data => {
        this.showTips(data)
      })
    }
  }
}
</script>

<style>
</style>
