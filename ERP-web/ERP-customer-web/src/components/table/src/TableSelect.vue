<template>
  <div v-loading="loading">
    <div class="content">
      <div class="mb10">
        <template v-for="(hand, key) in $slots">
          <el-button
            v-if="key === 'add'"
            type="primary"
            size="small"
            :key="hand.id"
            @click="handleClick(hand)"
          >{{hand[0].data.attrs.name}}</el-button>
          <el-button
            v-if="key === 'del'"
            type="primary"
            size="small"
            :key="hand.id"
            @click="delItem(hand)"
          >{{hand[0].data.attrs.name}}</el-button>
        </template>
      </div>
      <slot name="add"></slot>
      <search class="mb10" :searchList="options.search.list" @search="handleSearch" ref="search"></search>
      <YtTable
        :maxHeight="400"
        class="mb10"
        :reserveSelection="options.rowKey"
        :data="data"
        v-bind="options.table"
        ref="table"
        @handleSelectionChange="val => selection = val"
      >
        <el-table-column label="操作" width="100" align="center" slot="right" v-if="Object.keys($slots).length">
          <template slot-scope="scope">
            <slot name="right" v-bind="scope"></slot>
          </template>
        </el-table-column>
      </YtTable>
    </div>

    <el-pagination
      style="text-align:right"
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
  name: 'table-select',
  created() {
    this.getData()
    console.log(this.$slots)
  },
  props: {
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
          border: true
        }
      })
    },
    url: {
      type: String,
      required: true
    },
    params: {
      type: Object
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
      data: [{ label: 1, value: 1 }]
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
    reset() {
      this.$refs.table.clearSelection()
      this.initParams = {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      }
      this.$refs.search.reset()
    },

    // 发送搜索请求
    handleSearch(val) {
      this.searchParams = val

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
      this.$api[this.url](
        this.$.dealObjectValue({
          ...this.initParams,
          ...this.params,
          ...this.searchParams,
          ...params
        })
      )
        .then(data => {
          const { rows, total, pageNo, pageSize } = data
          this.loading = false
          this.data = rows
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
