<template>
  <main-layout
    :searchFields="searchFields"
    ref="layout"
    url="agent/merchantStoreList"
    :columns="columns"
    :right-edit-btns="editBtns"
    :edit-btns="edits"
    :btnFn="btnFn"
    :topBatchBtn="topBatchBtn"
    @left-batch-change="handleLeftBatchChange"
    edit-width="100px"
    :searchFunc="searchFunc"
    :treeTable="false"
  ></main-layout>
</template>
<script>
export default {
  name: 'stores',
  data() {
    return {
      editBtns: [
        {
          name: '新增店铺',
          icon: 'el-icon-plus',
          perm: 'add',
          fn: () => {
            this.$router.push({
              path: '/addStore'
            })
          }
        }
      ],
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '暂停'
          },
          {
            label: '激活'
          },
          {
            label: '删除'
          }
        ]
      },
      searchFields: {
        platformSiteId: {
          labelWidth: '70px',
          widget: 'cascader',
          label: '平台站点',
          clearable: true,
          options: '$store.common.platSite',
          props: {
            label: 'cnName',
            value: 'platformSiteId',
            children: 'childs'
          },
          handler: {
            action: 'common/getPlatSite'
          }
        },
        keyword: {
          // widget: 'select',
          // options: '$store.common.storeList',
          // handler: {
          //   action: 'common/getStore'
          // },
          label: '店铺名称',
          labelWidth: '70px'
        },
        status: {
          widget: 'select',
          options: [
            {
              label: '激活',
              value: 1
            },
            {
              label: '暂停',
              value: 0
            }
          ],
          label: '店铺状态',
          labelWidth: '70px'
        }
      },
      columns: [
        {
          label: '店铺名称',
          value: 'sellerName'
        },
        {
          type: 'array',
          children: [
            {
              label: '平台',
              value: 'platform'
            },
            {
              label: '站点',
              value: 'site'
            }
          ]
        },
        {
          label: '店铺状态',
          value: 'status',
          _enum: ['暂停', '激活']
        }
      ],
      edits: [
        {
          name: '激活',
          fn: scope => {
            this.active([scope.row.storeId], 1)
          }
        },
        {
          name: '暂停',
          fn: scope => {
            this.active([scope.row.storeId], 0)
          }
        },
        {
          name: '编辑',
          fn: scope => {
            this.$router.push({
              path: '/editStore',
              query: {
                id: scope.row.storeId
              }
            })
          }
        }
      ]
    }
  },
  methods: {
    btnFn(item) {
      if (item.status == 1) {
        return [2, 3]
      } else {
        return [1, 3]
      }
    },
    handleLeftBatchChange(val, selection) {
      val = val[0]
      const ids = selection.map(el => el.storeId)
      switch (val) {
        case '暂停':
          this.active(ids, 0)
          break
        case '激活':
          this.active(ids, 1)
          break
        case '删除':
          this.del(ids)
          break

        default:
          break
      }
    },
    active(idArray, flag = 1) {
      this.showTips({ msg: `是否${flag ? '激活' : '暂停'}店铺？` }, () => {
        return this.$api[
          `agent/${flag ? 'merchantStoreActivating' : 'merchantStoreSuspend'}`
        ]({ idArray })
      })
    },
    del(idArray) {
      this.showTips({ msg: `是否删除店铺？` }, () => {
        return this.$api[`agent/merchantStoreRemove`]({ idArray })
      })
    },
    searchFunc(data) {
      let { platformSiteId, ...info } = data

      return {
        ...info,
        platformSiteId: platformSiteId && platformSiteId.slice().pop()
      }
    }
  }
}
</script>