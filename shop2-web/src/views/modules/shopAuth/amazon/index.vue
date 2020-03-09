<template>
  <main-layout
    :outerParams="{platformId}"
    :columns="columns"
    :edit-btns="edits"
    edit-width="160px"
    :btnFn="btnFn"
    :span-method="spanMethod"
    :right-edit-btns="editBtns"
    :dataMethod="dataMethod"
    url="shopAuth/sellerAuthList"
    ref="layout"
  ></main-layout>
</template>
<script>
import mixin from '../mixin'
export default {
  mixins: [mixin],
  data() {
    return {
      columns: [
        {
          label: '店铺名称',
          value: 'sellerAlias',
          noTooltip: true,
          minWidth: 90
        },
        {
          label: '商户ID',
          value: 'sellerId',
          noTooltip: true,
          minWidth: 90
        },
        {
          label: '开户区域站点',
          width: 110,
          value: 'regionCode',
          render: (h, scope) => {
            let { regionCode } = scope.row
            let value = this.region.find(e => e.regionCode === regionCode)
            if (value) {
              value = value.regionName
            }
            return <span>{value || '-'}</span>
          }
        },
        {
          label: '授权类型',
          width: 80,
          value: 'type'
        },
        {
          label: '授权时间',
          minWidth: 140,
          value: 'authTime',
          render: (h, scope) => {
            let { authTime } = scope.row
            return (
              <div>
                {authTime ? (
                  authTime
                ) : (
                  <span>
                    未授权，无法使用广告功能，
                    <a
                      class="link"
                      href="javascript:void(0)"
                      onClick={() => {
                        // 广告授权
                        this.adAuth(scope)
                      }}
                    >
                      立即授权
                    </a>
                  </span>
                )}
              </div>
            )
          }
        },
        {
          label: '开通站点',
          value: 'siteIds',
          minWidth: 200,
          render: (h, scope) => {
            let {
              siteIds = [],
              adSiteIds = [],
              // type,
              adAuthStatus,
              regionCode,
              sellerAuthId
            } = scope.row
            let { $index, row } = scope,
              isAdSite = $index % 2 != 0,
              curRegion = this.region.find(e => e.regionCode == regionCode)
            let curSites = curRegion.sites
            // console.log(curRegion)

            // if (type === '基础API') {
            return (!isAdSite && curSites) || adAuthStatus ? (
              <div class="flex" style="flex-wrap: wrap;">
                {curSites.map(el => {
                  let { siteId, siteName } = el
                  let ids = !isAdSite ? siteIds : adSiteIds
                  let disabled = ids.indexOf(siteId) == -1
                  return (
                    <div style={{ marginRight: '10px' }}>
                      <span
                        style={{ marginRight: '3px', opacity: disabled && 0.5 }}
                      >
                        {siteName}
                      </span>
                      {disabled && (
                        <a
                          class="link"
                          href="javascript:void(0)"
                          onClick={() => {
                            this.openSite(
                              curSites,
                              el,
                              sellerAuthId,
                              row,
                              isAdSite
                            )
                          }}
                        >
                          开通
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <span>-</span>
            )
            // }
          }
        }
      ],
      edits: [
        {
          name: '重新授权',
          perm: 'addTask',
          fn: scope => {
            const { sellerAlias, regionCode, siteIds, sellerAuthId } = scope.row
            let info = { sellerAlias, regionCode, siteIds, sellerAuthId }
            this.reAuth(info)
          }
        },
        {
          name: '绑定邮箱',
          perm: 'addTask',
          fn: scope => {
            this.bindEmail(scope.row.sellerAuthId, scope.row.emailAccount)
          }
        },
        {
          name: '删除',
          perm: 'addTask',
          fn: scope => {
            this.delAuth([scope.row.sellerAuthId])
          }
        }
      ],
      editBtns: [
        {
          name: '添加授权',
          perm: 'add',
          fn: () => {
            this.shopAuth()
          }
        }
      ]
    }
  },
  methods: {
    btnFn(row) {
      let { emailAuthStatus } = row
      if (emailAuthStatus) {
        return [1, 3]
      } else {
        return [1, 2, 3]
      }
    },
    // 重新授权
    reAuth(info) {
      this.shopAuth(info, true)
    },
    delAuth(sellerAuthIds) {
      this.showTips({ msg: '是否删除店铺授权?' }, () => {
        return this.$api[`shopAuth/sellerAuthRemove`]({
          platformId: this.platformId,
          sellerAuthIds
        })
      })
    },
    // 绑定邮箱
    bindEmail(sellerAuthId, emailAccount) {
      this.$_dialog({
        size: 'medium',
        title: '绑定邮箱',
        params: {
          platformId: this.platformId,
          sellerAuthId,
          emailAccount
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/bindEmail.vue')
      })
    },
    // 添加授权
    shopAuth(info, reAuth) {
      this.$_dialog({
        size: 'medium',
        title: '添加授权',
        params: {
          platformId: this.platformId,
          region: this.region,
          info,
          reAuth
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/add.vue')
      })
    },
    // 开通站点
    openSite(allSites, selectSite, sellerAuthId, row, isAdSite) {
      let name = selectSite.siteName,
        api = isAdSite ? 'sellerAuthAdAddSite' : 'sellerAuthAddSite'
      this.showTips({ msg: `是否开通${name}?` }, () => {
        return this.$api[`shopAuth/${api}`]({
          platformId: this.platformId,
          siteId: selectSite.siteId,
          sellerAuthId
        })
      })
    },
    // 广告授权
    adAuth(scope) {
      let { sellerAuthId } = scope.row
      let sites = this.region.find(e => e.regionCode === scope.row.regionCode)
        .sites
      this.$_dialog({
        size: 'medium',
        title: '添加广告授权',
        okDisabled: true,
        params: {
          sites,
          platformId: this.platformId,
          sellerAuthId
        },
        cancelBtnText: '取消',
        okBtnText: '确认',
        component: () => import('./dialogs/adAuth.vue')
      })
    },
    // 合并单元格
    spanMethod({ column, rowIndex, columnIndex }) {
      // console.log(row, column, rowIndex, columnIndex)
      let merges = ['sellerId', 'sellerAlias', 'regionCode']
      if (
        merges.indexOf(column.property) > -1 ||
        column.label === '操作' ||
        columnIndex == 0
      ) {
        if (rowIndex % 2 === 0) {
          return {
            rowspan: 2,
            colspan: 1
          }
        } else {
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
    },
    // 处理后端数据
    dataMethod(data) {
      console.log(data)
      let ret = []
      // 把数据处理成基础api 广告api两行
      data.forEach(element => {
        let { adAuthTime } = element
        ret.push(
          { type: '基础API', ...element },
          { type: '广告API', ...element, authTime: adAuthTime }
        )
      })
      return ret
    }
  }
}
</script>