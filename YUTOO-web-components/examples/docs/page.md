## 表格布局

用于上部有搜索栏，中部有按钮，下部有表格的布局

## 基础表格布局

基础表格布局展示用法。

:::demo

```html
<yt-page
  url="warehouse/wmInventoryList"
  reserve-selection="productId"
  :table-config="tableConfig"
  :search-config="searchConfig"
  :fixed-page-func="handleFixedPageFunc"
  :btn-config="btnConfig"
  :search-data="searchData"
  @select-change="selectChange"
  :dialog-events="dialogEvents"
  @on-click-btn="onClickBtn"
  :eval-func="evalFunc"
  ref="page"
>
  <template slot="tableLeft">
    <el-table-column label="操作" align="center">
      <template slot-scope="scope">
        <el-tooltip
          effect="dark"
          content="查看详情"
          placement="top"
          :open-delay="500"
        >
          <i class="el-icon-search iconBtn" />
        </el-tooltip>
      </template>
    </el-table-column>
  </template>
</yt-page>

<script>
  export default {
    data() {
      let vm = this
      return {
        selection:[],
        dialogEvents: {
          open() {
            vm.$nextTick(() => {
              // 弹窗里的组件
              let component = vm.$refs.page.$refs.component
              // 调用组件初始化函数
              component._initData && component._initData()
            })
          },
          close() {
            // 弹窗里的组件
            let component = vm.$refs.page.$refs.component
            // 调用组件关闭函数
            component._close && component._close()
          },
          handleOkClick() {
            let component = vm.$refs.page.$refs.component
            return (
              component.submit &&
              component.submit().then(res => {
                if (!res) {
                  vm.$refs.page.getList(true)
                }
              })
            )
          }
        },
        searchConfig: [
          {
            label: '库位编码',
            value: 'locationCode',
            type: 'input'
          }
        ],
        tableConfig: [
          {
            value: 'imgPath',
            label: '图片',
            img: true,
            style: {
              //图片宽高
              width: 45,
              height: 45
            }
          }
        ],
        btnConfig: [
          {
            name: '批量操作',
            children: [
              { name: '打印插头规格' },
              { name: '批量打印产品仓库条形码' }
            ]
          },
          {
            name: '批量导出',
            children: [
              { name: '当前条件导出' },
              { name: '导出入库记录' },
              { name: '导出所有仓库库存' }
            ]
          },
          {
            name: '全局产品预警库存设置',
            fn: () => {
              // this.$refs.page.$dialog({
              //   title: '全局产品预警库存设置',
              //   okBtnText: '保存',
              //   visible: true,
              //   width: '1100px',
              //   params: {},
              //   component: () => import('./components/GlobalProductWarning.vue')
              // })
            }
          },
          {
            name: '单个产品预警库存设置',
            disabled: () => {
              return this.selection.length !== 1
            },
            fn: () => {
              // this.$refs.page.$dialog({
              //   title: '单个产品预警库存设置',
              //   okBtnText: '保存',
              //   visible: true,
              //   width: '700px',
              //   params: {
              //     productId: vm.selection[0].productId
              //   },
              //   component: () => import('./components/SingleProductWarning.vue')
              // })
            }
          },
          {
            name: '导入产品质量问题',
            fn: () => {
              this.$refs.page.$dialog({
                title: '导入产品质量问题',
                okBtnText: '确认导入',
                cancelBtnText: '取消',
                visible: true,
                width: '600px',
                params: {
                  type: '导入产品质量问题'
                },
                component: () =>
                  import('./test/dialog.vue')
              })
            }
          }
        ]
      }
    },
    methods: {
      handleFixedPageFunc(data) {
        let {pageNo, pageSize, rows, total} = data.page
        return {pageNo, pageSize, rows, total}
      },
      // 树展开函数
      evalFunc(data, expandAll, parent = null, level = null) {
        let tmp = [],
          vm = this
        Array.from(data).forEach(function(record) {
          if (record._expanded === undefined) {
            Vue.set(record, '_expanded', expandAll)
          }
          let _level = 1
          if (level !== undefined && level !== null) {
            _level = level + 1
          }
          Vue.set(record, '_level', _level)
          // 如果有父元素
          if (parent) {
            Vue.set(record, 'parent', parent)
          }
          tmp.push(record)
          if (record.children && record.children.length > 0) {
            const children = vm.evalFunc(
              record.children,
              expandAll,
              record,
              _level
            )
            tmp = tmp.concat(children)
          }
        })
        return tmp
      },
      onClickBtn(name) {},
      searchData(val) {
        return val
      },
      selectChange(val) {
        console.log(val)
        this.selection = val
      }
    }
  }
</script>
```

:::
