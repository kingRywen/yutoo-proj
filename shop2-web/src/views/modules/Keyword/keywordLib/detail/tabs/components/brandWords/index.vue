<template>
  <div>
    <main-layout
      :outerParams="{...storeInfo,...curQuery, categoryId}"
      :searchFields="searchFields"
      :columns="columns"
      edit-width="160px"
      :right-edit-btns="editBtns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      url="keyword/keywordLibBrandList"
      ref="layout"
    ></main-layout>
  </div>
</template>
<script>
export default {
  props: ['categoryId', 'curQuery'],
  data() {
    // {
    //         label: '设置可布局'
    //       },
    //       {
    //         label: '设置仅广告'
    //       },
    let brandTypeMap = this.$const['KEYWORD/brandTypeMap'],
      brandType = this.curQuery.brandType
    let options = [
      {
        label: '复制关键词'
      },
      {
        label: '删除'
      }
    ]
    if (!brandType) {
      options.unshift(
        {
          label: '设置可布局'
        },
        {
          label: '设置仅广告'
        }
      )
    } else if (brandType == brandTypeMap['AD']) {
      options.unshift({
        label: '设置可布局'
      })
    } else if (brandType == brandTypeMap['LAYOUT']) {
      options.unshift({
        label: '设置仅广告'
      })
    }

    return {
      brandTypeMap,
      topBatchBtn: {
        title: '品牌词',
        options
      },
      searchFields: {
        include: {
          widget: 'textarea',
          placeholder: '请输入品牌名'
        },
        time: {
          widget: 'daterange',
          hidden: true,
          label: '添加时间',
          fields: ['startTime', 'endTime'],
          timeDisabled: 'after'
        },
        brandType: {
          widget: 'select',
          label: '类型',
          hidden: true,
          options: this.$const['KEYWORD/brandType']
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
      },
      columns: [
        {
          label: '品牌名称',
          value: 'brandName'
        },
        {
          label: '类型',
          value: 'brandType',
          _enum: this.cfuns.arrayToObj(this.$const['KEYWORD/brandType'])
        },
        {
          label: '添加时间',
          value: 'createTime'
        }
      ],
      editBtns: [
        {
          name: '添加',
          perm: 'add',
          fn: () => {
            this.add()
          }
        }
      ]
    }
  },

  methods: {
    add() {
      this.$_dialog({
        size: 'medium',
        title: '添加品牌词',
        params: {
          categoryId: this.categoryId,
          brandType: this.curQuery.brandType
        },
        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./dialogs/add.vue')
      })
    },
    del(brandIds) {
      this.showTips({ msg: '此操作将删除数据, 是否继续?' }, () => {
        return this.$api[`keyword/keywordLibBrandRemove`]({
          ...this.storeInfo,
          categoryId: this.categoryId,
          brandIds
        })
      })
    },
    handleLeftBatchChange(val, select) {
      let ids = select.map(el => el.brandId)
      switch (val[0]) {
        case '删除':
          this.del(ids)
          break
        case '设置可布局':
          this.setType(ids, this.brandTypeMap['LAYOUT'])
          break
        case '设置仅广告':
          this.setType(ids, this.brandTypeMap['AD'])
          break
        case '复制关键词':
          this.copy(select.map(el => el.brandName).join('\n'))
          break

        default:
          break
      }
    },
    copy(text) {
      this.$copyText(text)
        .then(() => {
          this.$message.success('复制成功')
        })
        .catch(err => {
          this.$message.error('复制失败，请重试')
        })
    },
    setType(brandIds, brandType) {
      this.showTips(
        {
          msg: `此操作将词类型更改为<b style="color:red">${
            this.$const['KEYWORD/brandType'].find(e => e.value == brandType)
              .label
          }</b>, 是否继续?`
        },
        () => {
          return this.$api[`keyword/keywordLibBrandUpdate`]({
            brandIds,
            brandType,
            categoryId: this.categoryId,
            ...this.storeInfo
          })
        }
      )
    }
  }
}
</script>