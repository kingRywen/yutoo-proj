<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo,...curQuery, relatedId,categoryFlag}"
      :searchFields="searchFields"
      :columns="columns"
      edit-width="160px"
      :right-edit-btns="productId ? [] :editBtns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="keyword/keywordLibRelatedKeywordList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
import relatedMixin from '../mixin'
export default {
  mixins: [relatedMixin],
  props: ['categoryId', 'productId', 'curQuery'],
  data() {
    const negativeType = this.$const['KEYWORD/negativeType'],
      isAD = this.curQuery.pageType === 'ADVERT'
    let keywordType
    if (this.curQuery.pageType) {
      this.curQuery.pageType.replace(/_(CORE|LONG|OTHER)/, (a, b) => {
        keywordType = b
      })
    }

    let options = [
      {
        label: '加入否定词'
      },
      {
        label: '复制关键词'
      }
    ].concat(
      this.productId
        ? []
        : [
            {
              label: '删除'
            }
          ]
    )

    let searchFields = {
      // searchText: {
      //   placeholder: '请输入关键词'
      // },
      include: {
        widget: 'textarea',
        placeholder: '请输入关键词'
      },
      origin: {
        widget: 'select',
        options: this.$const['KEYWORD/relatedSource'],
        hidden: true,
        label: '添加来源'
      },
      wordCnt: {
        widget: 'select',
        options: this.$const['KEYWORD/wordCnt'],
        hidden: true,
        label: '单词数量'
      },

      exclude: {
        widget: 'textarea',
        hidden: true,
        labelWidth: '65px',
        label: '不包含'
      },
      barring: {
        widget: 'textarea',
        hidden: true,
        labelWidth: '53px',
        label: '排除'
      }
    }

    let columns = [
      {
        label: '关键词',
        value: 'keywordText',
        minWidth: 160,
        noTooltip: true
      },
      {
        label: '添加来源',
        value: 'origin',
        _enum: this.cfuns.arrayToObj(this.$const['KEYWORD/relatedSource'])
      },

      {
        label: '产品数',
        sortable: 'custom',
        value: 'productCnt',
        overPlus: 1000
      },
      {
        label: '搜索量',
        sortable: 'custom',
        value: 'searches'
      },
      {
        label: '订单量',
        sortable: 'custom',
        value: 'orders'
      },
      {
        label: '点击量',
        sortable: 'custom',
        value: 'clicks'
      },
      { sortable: 'custom', label: '加购量', value: 'carts' },
      {
        sortable: 'custom',
        label: '转化率',
        value: 'conversionRate',
        keepFew: 2,
        isPercent: true
      },
      {
        sortable: 'custom',
        label: '点击率',
        value: 'clickRate',
        keepFew: 2,
        isPercent: true
      }
    ]

    if (!isAD) {
      let adds = [
        {
          label: '移入长尾词'
        },
        {
          label: '移入核心词'
        },
        {
          label: '移入其他词'
        }
      ]
      if (keywordType == 'CORE') {
        adds.splice(1, 1)
      } else if (keywordType == 'LONG') {
        adds.splice(0, 1)
      } else if (keywordType == 'OTHER') {
        adds.splice(2, 1)
      }

      options.splice(2, 0, ...adds)
      columns.splice(2, 0, {
        label: '添加类型',
        value: 'handleType',
        _enum: this.cfuns.arrayToObj(this.$const['KEYWORD/relatedHandleType'])
      })
      searchFields['handleType'] = {
        widget: 'select',
        options: this.$const['KEYWORD/relatedHandleType'],
        hidden: true,
        label: '添加类型'
      }
    }

    return {
      keywordType,
      negativeType,
      topBatchBtn: {
        title: '相关词',
        options
      },
      searchFields,
      columns,
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.add()
          }
        },
        {
          name: '导入',
          perm: 'add',
          fn: () => {
            this._import()
          }
        }
      ]
    }
  },

  methods: {
    _import() {
      let vm = this
      this.$_dialog({
        fullscreen: false,
        size: 'medium',
        title: '导入数据',
        params: {
          query: {
            categoryId: this.categoryId,
            importType: 6
          },
          params: {
            fn() {
              vm.getLayoutList()
            }
          }
        },
        cancelBtnText: '关闭',
        component: () => import('./dialogs/import.vue')
      })
    },
    add() {
      let keywordType = this.keywordType

      this._openDialog({
        size: 'medium',
        title: '添加相关词',
        params: {
          categoryId: this.categoryId,
          productId: this.productId,
          keywordType
        },
        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./dialogs/add.vue')
      })
    },

    handleLeftBatchChange(val, select) {
      let keywordIds = select.map(el => el.keywordId)
      let keywordTexts = select.map(el => el.keywordText)
      switch (val[0]) {
        case '删除':
          this.delKeywords(keywordIds)
          break
        case '复制关键词':
          this.copyKeywords(keywordTexts.join('\n'))
          break
        case '加入否定词':
          this.$_dialog({
            size: 'medium',
            title: '加入否定词',
            params: {
              query: {
                ...this.storeInfo,
                relatedId: this.relatedId,
                categoryFlag: this.categoryFlag,
                keywordTexts
              }
            },
            cancelBtnText: '取消',
            okBtnText: '确认',
            component: () => import('./dialogs/addPrivative.vue')
          })
          break
        case '移入长尾词':
          this.moveKeywords(keywordTexts, 'LONG')
          break
        case '移入核心词':
          this.moveKeywords(keywordTexts, 'CORE')
          break
        case '移入其他词':
          this.moveKeywords(keywordTexts, 'OTHER')
          break

        default:
          break
      }
    }
  }
}
</script>