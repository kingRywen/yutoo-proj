<template>
  <div>
    <new-main-layout
      :searchFields="searchFields"
      ref="layout"
      url="main/recycleList"
      :columns="columns"
      :edit-btns="edits"
      :right-edit-btns="editBtns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      edit-width="120px"
      :searchFunc="searchFunc"
      :treeTable="false"
    >
      <el-button type="text" slot="topleft" @click="view">费用说明</el-button>
    </new-main-layout>
    <iframe height="0" width="0" :src="src" frameborder="0" ref="frame"></iframe>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import { downloadFile1 } from 'Utils/tools'
export default {
  data() {
    return {
      showPrint: false,
      src: '/#/print',
      editBtns: [
        {
          perm: 'impt',
          name: '导入库位',
          fn: () => {
            this.importLoc()
          }
        }
      ],
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '下载库位'
          }
        ]
      },
      searchFields: {
        email: {
          label: '商户邮箱'
        },
        platformSiteId: {
          widget: 'cascader',
          label: '平台站点',
          clearable: true,
          width: '100%',
          options: '$store.platformList',
          props: {
            children: 'childs',
            label: 'cnName',
            value: 'platformSiteId'
          }
        },
        sellerName: {
          label: '店铺名称'
        },
        productId: {
          label: '产品ID'
        },
        parentProductId: {
          label: '父产品ID'
        },
        status: {
          widget: 'select',
          options: '$const.OTHER/recklstats',
          label: '回收状态'
        },
        transportNo: {
          label: '运单号'
        }
      },
      columns: [
        {
          label: '任务ID',
          value: 'taskSourceId',
          width: 60
        },
        {
          label: '主图',
          width: 70,
          img: true,
          value: 'imgUrl'
        },
        {
          type: 'array',
          width: 210,
          children: [
            {
              label: '商户邮箱',
              value: 'email'
            },
            {
              label: '店铺名称',
              showTooltip: true,
              value: 'sellerName'
            }
          ]
        },
        {
          type: 'array',
          width: 100,
          children: [
            {
              label: '产品ID',
              value: 'productId'
            },
            {
              label: '父产品ID',
              value: 'parentProductId'
            }
          ]
        },
        {
          type: 'array',
          width: 70,
          children: [
            {
              label: '平台',
              value: 'platform',
              render(h, scope) {
                return <span>{scope.row.site.split('-')[0]}</span>
              }
            },
            {
              label: '站点',
              value: 'site',
              render(h, scope) {
                return <span>{scope.row.site.split('-')[1]}</span>
              }
            }
          ]
        },
        {
          label: '商品数量',
          value: 'productNum',
          width: 70
        },
        {
          label: '回收状态',
          width: 110,
          value: 'status',
          render: (h, scope) => {
            const { status, noPassCause } = scope.row
            const list = this.$const['OTHER/recklstats']
            const el = list.find(el => el.value === status)
            return (
              <span class={status == 4 ? 'danger' : ''}>
                {status == 4 ? (
                  <el-tooltip
                    placement="top"
                    content={noPassCause}
                    effect="dark"
                  >
                    <div>
                      <el-button
                        class="el-icon-warning danger"
                        type="text"
                        style="margin-right:4px"
                      ></el-button>
                      {el.label}
                    </div>
                  </el-tooltip>
                ) : (
                  el.label
                )}
              </span>
            )
          }
        },
        {
          type: 'array',
          width: 90,
          children: [
            {
              label: '入库时间',
              value: 'inTime'
            },
            {
              label: '出库时间',
              value: 'outTime'
            }
          ]
        },
        {
          label: '总金额$',
          value: 'totalMoney',
          width: 70
        },
        {
          label: '佣金$',
          value: 'brokerage',
          width: 60
        },
        {
          label: '操作费$',
          value: 'handleMoney',
          width: 70
        },
        {
          label: '仓储费$',
          value: 'storageMoney',
          width: 70
        },
        {
          label: '贴标费$',
          value: 'decalsMoney',
          width: 70
        },
        {
          label: '打包费$',
          value: 'packMoney',
          width: 70
        },
        {
          label: '耗材费$',
          headerTooltip: '含纸箱、胶带等',
          value: 'consumableMoney',
          width: 90
        },
        {
          label: '纸箱贴标费$',
          value: 'cartonDecalsMoney',
          width: 100
        },
        {
          label: '运费$',
          value: 'freight',
          width: 55
        },
        {
          label: '库位',
          value: 'storageNum',
          url: true,
          btnClick: scope => {
            this.$dialog({
              size: 'medium',
              title: '库位详情',
              params: { productRecycleId: scope.row.productRecycleId },
              cancelBtnText: '关闭',
              component: () => import('./dialogs/stLo.vue')
            })
          }
        },
        {
          label: '运单号',
          value: 'transportNo'
        }
      ],
      edits: [
        {
          name: '入库审核',
          fn: scope => {
            this.$dialog({
              size: 'small',
              title: '入库审核',
              params: {
                productRecycleId: scope.row.productRecycleId,
                unit: scope.row.storageUnitPrice
              },
              cancelBtnText: '取消',
              okBtnText: '确认',
              component: () => import('./dialogs/inAudit.vue')
            })
          }
        },
        {
          name: '下载库位',
          fn: scope => {
            this.downloadLoc([{ productRecycleId: scope.row.productRecycleId }])
          }
        },
        {
          name: '导入库位',
          fn: scope => {
            this.importLoc([{ productRecycleId: scope.row.productRecycleId }])
          }
        },
        {
          name: '出库审核',
          fn: scope => {
            this.out(scope.row.productRecycleId)
          }
        },
        {
          name: '打包',
          fn: scope => {
            this.out(scope.row.productRecycleId, 'pack')
          }
        },
        {
          name: '打印仓库标签',
          fn: scope => {
            this.print(scope.row.productRecycleId, 0)
          }
        },
        {
          name: '打印纸箱贴标',
          fn: scope => {
            this.print(scope.row.cartonDecalsAffix, 1)
          }
        },
        {
          name: '打印产品贴标',
          fn: scope => {
            this.print(scope.row.decalsAffix, 2)
          }
        },
        {
          name: '发货',
          fn: scope => {
            this.deliver(scope.row.productRecycleId, scope.row.freightType)
          }
        }
      ]
    }
  },
  computed: {
    ...mapState(['cstInfo'])
  },
  created() {
    this.getCst()
  },
  methods: {
    ...mapActions(['getCst']),
    deliver(id, whois) {
      if (whois == 1) {
        this.$dialog({
          size: 'small',
          title: '发货',
          params: { productRecycleId: id },
          cancelBtnText: '取消',
          okBtnText: '确认',
          component: () => import('./dialogs/deliver.vue')
        })
      } else {
        this.showTips({ msg: '是否确认发货?' }, () => {
          return this.$api[`main/recycleDeliver`]({ productRecycleId: id })
        })
      }
    },
    // type   0-仓库标签  1-纸箱贴标   2-产品贴标
    encodeUrl(path, query) {
      let q = []
      Object.keys(query).forEach(key => {
        q.push(encodeURIComponent(key) + '=' + encodeURIComponent(query[key]))
        // q += encodeURIComponent(key) + '=' + encodeURIComponent(query[key])
      })
      return `${path}?${q.join('&')}`
    },
    print(id, type) {
      let vm = this
      switch (type) {
        case 0:
          vm.$api[`main/recyclePrintRepoLabel`]({
            productRecycleId: id
          }).then(data => {
            vm.src = this.encodeUrl('/#/print', {
              codes: data.rows.map(el => el.barCode).join('___')
              // url: 'http://192.168.0.98:7088/1.pdf'
            })

            setTimeout(() => {
              let w = vm.$refs.frame.contentDocument.defaultView
              w.print()
            }, 300)
          })
          break

        case 1:
        case 2:
          window.open(id)
          break

        default:
          break
      }
    },
    importLoc() {
      this.$dialog({
        size: 'small',
        title: '导入库位',
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/importLoc.vue')
      })
    },
    downloadLoc(ids) {
      this.$api[`main/recycleDownloadStorage`](ids).then(data => {
        downloadFile1(data, '库位')
      })
    },
    view() {
      this.$dialog({
        size: 'small',
        title: '费用说明',
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/refrceCst.vue')
      })
    },
    handleLeftBatchChange(val, selection) {
      val = val[0]
      const ids = selection.map(el => ({
        productRecycleId: el.productRecycleId
      }))
      switch (val) {
        case '下载库位':
          this.downloadLoc(ids)
          break

        default:
          break
      }
    },
    out(productRecycleId, type = 'audit') {
      this.$dialog({
        size: 'medium',
        title: type == 'audit' ? '出库审核' : '打包',
        params: {
          type,
          productRecycleId: productRecycleId
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/out.vue')
      })
    },
    // cancelOut(ids) {
    //   this.showTips({ msg: '是否取消出库？' }, () => {
    //     return this.$api[`main/merchantProductRecycleCancelOutWarehouse`](ids)
    //   })
    // },
    searchFunc(data) {
      let { platformSiteId, ...info } = data
      platformSiteId = platformSiteId || []
      return {
        ...info,
        platformSiteId: platformSiteId.slice().pop()
      }
    }
  }
}
</script>