<template>
  <div v-loading="loading">
    <div class="content">
      <div class="mb10">
        <template v-for="(hand, key, index) in $slots">
          <el-button
            v-if="key === 'add'"
            :key="index"
            type="primary"
            size="small"
            icon="el-icon-plus"
            @click="handleClick(hand)"
          >{{hand[0].data.attrs.name}}</el-button>
          <el-button
            v-if="key === 'add' && editFn"
            :key="index + key"
            type="primary"
            size="small"
            icon="el-icon-edit"
            @click="handleClick(hand, true)"
          >编辑</el-button>
          <el-button
            :key="index"
            v-if="key === 'del'"
            type="danger"
            size="small"
            @click="delItem(hand)"
            icon="el-icon-delete"
          >{{hand[0].data.attrs.name}}</el-button>
        </template>
      </div>
      <slot name="add"></slot>
      <search
        v-if="options.search && options.search.length"
        class="mb10"
        :searchList="options.search"
        @search="handleSearch"
        ref="search"
      ></search>
      <YtTable
        class="mb10"
        :data="evalFunc ? tableTreeList : data"
        v-bind="options.table"
        ref="table"
        :row-key="params.rowKey"
        @selectChange="val => selection = val"
      >
        <el-table-column label="操作" :width="editWidth" align="center" slot="right" v-if="Object.keys($slots).length">
          <template slot-scope="scope">
            <slot name="right" v-bind="scope"></slot>
          </template>
        </el-table-column>
      </YtTable>
    </div>

    <el-pagination
      v-if="showPag"
      style="text-align:right"
      :total="initParams.total"
      :current-page.sync="initParams.pageNumber"
      :page-size.sync="initParams.pageSize"
      :page-sizes="[5, 10, 30, 50, 100]"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </div>
</template>

<script>
export default {
  name: 'YtTableSelect',
  inheritAttrs: false,
  props: {
    editWidth: {
      default: 100
    },
    evalFunc: {
      type: Function
    },
    // 是否显示分页
    showPag: {
      default: true
    },
    editFn: {
      default: null
    },
    options: {
      type: Object,
      default: () => ({
        // 搜索项
        // {
        //     label:'SKU',               //输入款名称    ==>可不传
        //     value:'skuname',           //需要绑定的值  ==>必传
        //     type:'input',              //输入款类型   input、select，multiple，time，textarea  ==>必传
        //     prefixIcon:"el-icon-search",  //type为input 出现的右边icon
        //     suffixIcon:'el-icon-date',    //type为input 出现的左边icon
        //     placeholder:'',            //输入款提示文字 默认为null
        //     size:'small',              //输入款大小，默认small
        //     clearable:true,            //默认可清除
        //     style:{                    //输入款样式
        //         width:"120px",
        //     },
        //     autosize:{                  //type为textarea 控制高度
        //         minRows: 2,
        //         maxRows: 4
        //     },
        //     children:[                  //当type类型为:select(单选) 或者 multiple(多选) 时候传,
        //         {
        //             label:'是',  //下拉款显示的内容
        //             value:'1',         //下拉款绑定的内容
        //         },
        //     ]
        // }
        search: [],
        // 表格项
        table: {
          columns: [
            {
              value: 'label',
              label: '产品图片'
            }
          ],
          maxHeight: 500,
          border: true,
          // 选择函数，返回true则设置当前项选中
          // eslint-disable-next-line
          selectableFunc: (row, index) => {
            return true
          },
          reserveSelection: null
        }
      })
    },
    // 请求api名字
    url: {
      type: String,
      required: true
    },
    queryParams: {
      type: Object,
      default: () => {}
    },
    // 回显时需要传参数
    params: {
      type: Object,
      default: () => ({
        rowKey: 'id' // rowkey
        // selected: []  已选
      })
    }
  },
  data() {
    return {
      searchData: {},
      selection: [],
      initParams: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      pag: {
        total: null
      },
      searchParams: {},
      loading: false,
      data: []
    }
  },
  computed: {
    tableTreeList() {
      let tmp
      if (!Array.isArray(this.data)) {
        tmp = [this.data]
      } else {
        tmp = this.data
      }
      const func = this.evalFunc
      const args = [tmp, false]
      return func.apply(null, args)
    }
  },

  methods: {
    // 打开编辑弹窗，初始化数据
    handleEdit() {
      let addComponent = this.$slots.add[0]
      addComponent.child.open()
      console.log(addComponent)
      addComponent.child.events.edit()
      // // 编辑弹窗的表单
      // this.$nextTick(() => {
      //   let formComponent = addComponent.componentOptions.children[0].child
      //   formComponent.addFormData(scope.row)
      // })
    },

    // 打开新增窗口
    handleClick(slot, edit) {
      if (edit) {
        if (!this.selection.length) {
          this.$message.warning('请选择一条数据进行操作')
          return
        }
        return this.editFn(JSON.parse(JSON.stringify(this.selection)))
      }
      let addComponent = this.$slots.add[0]

      slot[0].child.options.visible = true

      let formComponent = addComponent.componentOptions.children[0].child
      if (formComponent) {
        formComponent.is_edit = false
        formComponent.clearFormData && formComponent.clearFormData()
      }
    },

    // 删除选中项（上方批量按钮）
    delItem(slot) {
      if (this.selection.length === 0) {
        this.$message.warning('请选择一条数据进行操作')
        return
      }
      this.$confirm('是否删除选中项？', '警告', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          let { uid: idStr, uids: idsStr, url } = slot[0].data.attrs

          let ids = this.selection.map(el => el[idStr])
          this.$api[url]({
            [idsStr]: ids,
            ...this.queryParams
          })
            .then(() => {
              this.$emit('delsuccess')
              this.reset()
              slot[0].child.options.visible = false
            })
            .catch(() => {
              this.$emit('errsuccess')
            })
        })
        .catch(() => {})
    },

    // 重置搜索
    reset(clearTable, params = {}) {
      this.initParams = {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1,
        ...params
      }

      if (this.params.selected && this.params.selected.length) {
        this.setSelected(this.params.selected)
      }
      if (clearTable) {
        this.$refs.table.clearSelection()
      }
      if (this.$refs.search) {
        this.$refs.search.resetSearch()
      } else {
        this.getData(params)
      }
    },

    // 勾选选中项
    setSelected(arr, keep = false) {
      console.log('设置已选 ', arr)
      let vm = this
      let data = vm.evalFunc ? vm.tableTreeList : vm.data
      setTimeout(() => {
        vm.$nextTick(() => {
          data.forEach(el => {
            if (
              arr.some(_el => _el[vm.params.rowKey] === el[vm.params.rowKey])
            ) {
              vm.$refs.table && vm.$refs.table.toggleRowSelection(el, true)
            } else {
              if (keep) {
                return
              }
              vm.$refs.table && vm.$refs.table.toggleRowSelection(el, false)
            }
          })
        })
      })
    },

    // 发送搜索请求
    handleSearch(val) {
      this.searchParams = val
      this.initParams.pageNumber = 1

      this.getData()
    },
    handleSizeChange(val) {
      this.initParams.pageNumber = 1
      this.getData({ pageSize: val })
    },
    handleCurrentChange(val) {
      this.getData({ pageNumber: val })
    },
    getData(params, resetSearch = false) {
      this.loading = true
      let searchData = this.searchParams,
        searchDataFn = this.options.table.searchDataFn
      if (!this.$api[this.url]) {
        console.error('还没有在service中定义api,先定义')
        return
      }

      if (resetSearch) {
        return this.reset(true, params)
      }
      if (searchDataFn) {
        searchData = searchDataFn(this.searchParams)
      }
      if (!this.showPag) {
        this.initParams = {}
      }
      this.initParams.total = null

      this.$api[this.url](
        this.$.dealObjectValue({
          // ...this.params,
          ...this.initParams,
          ...searchData,
          ...this.queryParams,
          ...params
        })
      )
        .then(data => {
          const table = this.$refs.table
          const tableWp = table.$el.querySelectorAll(
            '.el-table__body-wrapper'
          )[0]
          tableWp.scrollTop = 0
          const { rows, total, pageNo, pageSize } = !this.showPag
            ? { rows: data.list }
            : data.page
            ? data.page
            : data

          const { selected } = this.params
          this.loading = false
          this.data = rows

          // 如果传入的params中包含selected 则需要设置选择
          if (selected && selected.length && !this.selection.length) {
            this.setSelected(selected)
          } else if (this.selection.length) {
            this.setSelected(this.selection)
          } else {
            this.$refs.table.clearSelection()
          }

          this.initParams.total = total
          this.initParams.pageNumber = pageNo
          this.initParams.pageSize = pageSize
        })
        .catch(err => {
          this.loading = false
          if (err.message) {
            this.$message.error(err.message)
          }
        })
    }
  }
}
</script>

<style lang='scss' scoped>
.pag {
  position: absolute;
  bottom: 0;
  right: 18px;
}
</style>
