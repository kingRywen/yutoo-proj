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
            @click="handleClick(hand)"
          >{{hand[0].data.attrs.name}}</el-button>
          <el-button
            :key="index"
            v-if="key === 'del'"
            type="primary"
            size="small"
            @click="delItem(hand)"
          >{{hand[0].data.attrs.name}}</el-button>
        </template>
      </div>
      <slot name="add"></slot>
      <YtForm class="mb10" @search="handleSearch" ref="search" ></YtForm>
      <!-- <search class="mb10" :searchList="options.search.list" @search="handleSearch" ref="search"></search> -->
      <slot name="search"></slot>
      <YtTable
        :maxHeight="400"
        class="mb20"
        :data="data"
        v-bind="options.table"
        ref="table"
        :selection='IsSelection'
        :row-key="params.rowKey"
        @handleSelectionChange="val => selection = val"
      >
        <el-table-column label="操作" width="100" align="center" slot="right" v-if="Object.keys($slots).length && isShowOperation">
          <template slot-scope="scope">
            <slot name="right" v-bind="scope"></slot>
          </template>
        </el-table-column>
      </YtTable>
    </div>

    <el-pagination
      style="text-align:right"
      class="mb20"
      :total="pag.total"
      :current-page.sync="initParams.pageNo"
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
  props: {
    searchData:{
      type: Object,
      default: () => {}
    },
    isShowOperation:{
      type:Boolean,
      default:true,
    },
    initial: {
      type: Object,
      default: () => {}
    },
    IsSelection:{
      default:true,
    },
    options: {
      type: Object,
      default: () => ({
        search: {
          list: []
        },
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
          selectableFunc: (row, index) => {
            return true
          },
          reserveSelection: null
        }
      })
    },
    url: {
      type: String,
      required: true
    },
    params: {
      type: Object,
      default: () => ({
        rowKey: 'id'
      })
    },
    edit: {
      type: String
    }
  },
  computed: {
    editBtns() {
      if (!this.edit) {
        return []
      }
      return this.edit.split('')
    }
  },
  watch: {
    params: {
      immediate: true,
      deep: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          this.getData()
        }
      }
    }
  },
  data() {
    return {
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
  methods: {
    // 打开编辑弹窗，初始化数据
    handleEdit(scope) {
      let addComponent = this.$slots.add[0]
      addComponent.child.open()
      // 编辑弹窗的表单
      this.$nextTick(() => {
        let formComponent = addComponent.componentOptions.children[0].child
        formComponent.addFormData(scope.row)
      })
    },

    // 打开新增窗口
    handleClick(slot) {
      let addComponent = this.$slots.add[0]

      slot[0].child.options.visible = true
      let formComponent = addComponent.componentOptions.children[0].child
      if (formComponent) {
        formComponent.is_edit = false
        formComponent.clearFormData()
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
            [idsStr]: ids
          })
            .then(data => {
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
    reset(clearTable) {
      this.initParams = {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      }

      if (this.params.selected && this.params.selected.length) {
        this.setSelected(this.params.selected)
      }
      if (clearTable) {
        this.$refs.table.clearSelection()
      }
      this.$refs.search.resetSearch()
    },

    // 勾选选中项
    setSelected(arr) {
      console.log('设置已选 ')
      let vm = this
      setTimeout(() => {
        vm.$nextTick(() => {
          vm.data.forEach(el => {
            if (arr.find(_el => _el === el[this.params.rowKey])) {
              vm.$refs.table && vm.$refs.table.toggleRowSelection(el, true)
            }
          })
        })
      })
    },

    // 发送搜索请求
    handleSearch(val) {
      this.searchParams = this.$refs.search.innerFormData
      this.getData()
    },
    handleSizeChange(val) {
      this.getData({ pageSize: val })
    },
    handleCurrentChange(val) {
      this.getData({ pageNumber: val })
    },
    getData(params) {
      this.loading = true
      if (!this.$api[this.url]) {
        console.error('还没有在service中定义api,先定义')
        return
      }
      this.data = []
      this.$api[this.url](
        this.$.dealObjectValue({
          ...this.params,
          ...this.initParams,
          ...this.initial,
          ...this.searchParams,
          ...this.searchData,
          ...params
        })
      )
        .then(data => {
          const { rows, total, pageNo, pageSize } = data
          const { selected } = this.params
          this.loading = false
          this.data = rows

          // 如果传入的params中包含selected 则需要设置选择
          if (selected && selected.length) {
            this.setSelected(selected)
          } else {
            this.$refs.table.clearSelection()
          }

          this.pag = {
            total,
            pageNo,
            pageSize
          }
        })
        .catch(err => {
          this.loading = false
          this.$message.error(err.msg)
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
