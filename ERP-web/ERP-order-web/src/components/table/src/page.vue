<template>
  <div class="yt-page">
    <universal-layout
      :btnList="btnConfig"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @clickBtn="clickBtn"
    >
      <!--  -->
      <slot>
        <template slot="search">
          <slot name="search">
            <search :searchList="searchConfig" ref="search" @search="search"></search>
          </slot>
        </template>
        <!--  -->
        <template slot="btnRight">
          <user-defined
            v-if="leftCustom"
            :data="tableConfig"
            :defaultData="defaultData"
            :selectCheck="selectCheck"
          >自定义列表展示</user-defined>
        </template>
        <!--  -->
        <template slot="table">
          <yt-table
            :data="evalFunc ? tableTreeList : tableList"
            v-loading="tableLoading"
            ref="table"
            :columns="defaultData"
            :border="true"
            :reserveSelection="reserveSelection"
            @selectChange="$emit('selectChange',$event)"
          >
            <template name="left">
              <slot name="tableLeft"></slot>
            </template>
            <template>
              <slot name="table"></slot>
            </template>
            <template slot="right">
              <slot name="tableRight"></slot>
            </template>
          </yt-table>
        </template>
      </slot>
    </universal-layout>
    <!--  -->
    <yt-dialog :options="dialogOpts" :events="events" v-if="!dialogEvents.use" @close="dialog.visible = false">
      <component :is="dialog.component" :data="dialog.params" ref="component"></component>
    </yt-dialog>
    <el-dialog
      v-else
      :title="dialog.title"
      :visible.sync="dialog.visible"
      :width="dialog.width"
      @open="open"
      @close="closeDialog"
      :append-to-body="true"
    >
      <div v-loading="loading">
        <component :is="dialog.component" :key="indexKey" @loading="el=>loading = el" ref="component"></component>
        <span slot="footer" class="dialog-footer" v-if="dialog.display">
          <el-button size="small" @click="resetForm">{{dialog.cancelButtonText}}</el-button>
          <el-button size="small" type="primary" @click="submitForm">{{dialog.confirmButtonText}}</el-button>
        </span>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import userDefined from '@/components/userDefined/userDefined'
import { filterObj } from '@/utils/tools'

export default {
  inheritAttrs: false,
  name: 'YtPage',
  props: {
    evalFunc: Function,
    // 初始请求数据时带的参数
    outerParams: {
      type: Object,
      default: () => {}
    },
    dialogEvents: {
      type: Object,
      default: () => ({
        use: true
      })
    },
    leftCustom: {
      //右侧自定义列
      type: Boolean,
      default: false
    },
    fixedPage: {
      type: Boolean,
      default: false
    },
    reserveSelection: String,
    url: String,
    tableConfig: {
      //表格配置项
      type: Array,
      default: () => [
        // { value: 'purchaseNumber', label: '订单号' },
      ]
    },
    searchConfig: {
      //搜索配置项
      type: Array,
      default: () => [
        {
          // label: '供应商',
          // name: 'supplierId',
          // type: 'input'
        }
      ]
    },
    btnConfig: {
      //按钮配置项
      type: Array,
      default: () => [
        // {
        //     name: '打回采购清单'
        // }
      ]
    },
    searchData: {
      type: Function,
      default: () => {}
    },
    btnNumArray: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    let vm = this
    return {
      loading: false,
      tableLoading: true,
      pageNo: 1,
      pageSize: 10,
      total: 0,
      tableList: [
        {
          declareName: '23'
        }
      ],
      defaultData: [],
      searchInfo: {},
      dialog: {
        title: '',
        visible: false,
        width: '',
        component: '',
        confirmButtonText: '',
        fnName: '',
        params: '',
        // cancelButtonText: '',
        display: true
      },
      innerDialogEvents: {
        close() {
          vm.dialog.visible = false
        }
      },
      indexKey: null,
      buttonNumList: []
    }
  },
  computed: {
    dialogOpts() {
      let _default = {
        visible: false,
        title: '标题',
        okBtnText: '确认',
        is_edit: false // 编辑模式
      }
      // eslint-disable-next-line
      let {
        // eslint-disable-next-line
        confirmButtonText,
        // eslint-disable-next-line
        cancelButtonText,
        dialogOpts,
        ...info
      } = this.dialog
      return {
        ..._default,
        ...info,
        ...dialogOpts
      }
    },
    events() {
      return { ...this.innerDialogEvents, ...this.dialogEvents }
    },
    tableTreeList() {
      let tmp
      if (!Array.isArray(this.tableList)) {
        tmp = [this.tableList]
      } else {
        tmp = this.tableList
      }
      const func = this.evalFunc
      const args = [tmp, false]
      return func.apply(null, args)
    }
  },

  watch: {
    // tableConfig: {
    //     handler(val) {
    //         this.defaultData = val.map(i => i.label)
    //     },
    //     immediate: true
    // }
  },
  methods: {
    $dialog({
      title,
      visible,
      width,
      component,
      confirmButtonText,
      cancelButtonText,
      fnName,
      params,
      okBtnText,
      cancelBtnText,
      display,
      editId,
      childFn,
      dialogOpts
    }) {
      this.indexKey = Math.random()
      component().then(com => {
        com.default.inheritAttrs = false
        this.dialog.component = com.default || ''
        this.dialog.title = title
        this.dialog.visible = visible
        this.dialog.width = width || '800px'
        this.dialog.confirmButtonText = confirmButtonText || '确 定'
        this.dialog.cancelButtonText = cancelButtonText || '取消'
        this.dialog.okBtnText = okBtnText
        this.dialog.cancelBtnText = cancelBtnText
        this.dialog.display = display == undefined ? true : display
        this.dialog.editId = editId
        this.dialog.childFn = childFn
        this.dialog.fnName = fnName
        this.dialog.params = params
        if (dialogOpts) {
          this.dialog.dialogOpts = dialogOpts
        }
      })
    },
    open() {
      if (this.dialog.visible) {
        this.$nextTick(() => {
          try {
            this.$refs.component.resetForm && this.$refs.component.resetForm()
            if (this.dialog.childFn && this.dialog.childFn.length) {
              this.dialog.childFn.map(item => {
                try {
                  if (item.name == 'getList') {
                    this.$refs.component[item.name](null, item.params)
                  } else if (item.name == 'edit') {
                    this.loading = true
                    this.$refs.component[item.name](item.params)
                      .then(() => {
                        this.loading = false
                      })
                      .catch(() => {
                        this.loading = false
                      })
                  } else {
                    this.$refs.component[item.name](item.params)
                  }
                } catch (error) {
                  console.log(error)
                }
              })
              return
            }
            if (this.dialog.fnName) {
              this.$refs.component[this.dialog.fnName](this.dialog.params)
            }
          } catch (err) {
            console.error(err)
          }
        })
      }
    },
    closeDialog() {
      this.$emit('closeDialog', this.dialog.title)
    },
    resetForm() {
      this.dialog.visible = false
    },
    closeForm() {
      this.dialog.visible = false
      this.getList()
    },
    submitForm() {
      try {
        this.$refs.component.submitForm(val => {
          this.$emit('submitForm', val, this.dialog.title)
        })
      } catch (error) {
        console.error(error)
        // this.$emit('submitForm')
      }
    },
    //设置自定义列表选中
    setDefaultData() {
      let key = 'order' + this.$route.name

      if (localStorage.getItem(key)) {
        let arr = localStorage.getItem(key)
        this.defaultData = this.tableConfig.filter(
          item => arr.indexOf(item.label) >= 0
        )
      } else {
        this.defaultData = this.tableConfig
      }
    },
    //自定义改变时更新列表展示数据
    selectCheck(val) {
      this.defaultData = this.tableConfig.filter(
        item => val.indexOf(item.label) >= 0
      )
      let storage = this.defaultData.map(i => i.label)
      let key = 'order' + this.$route.name
      localStorage.setItem(key, JSON.stringify(storage))
    },
    clickBtn(val) {
      // console.log(val)
      this.$emit('onClickBtn', val)
    },
    //搜索
    search(val) {
      this.pageNo = 1
      this.searchInfo = { ...val }
      this.$refs.table.clearSelection()
      this.getList('search')
    },
    //分页
    handleSizeChange(val) {
      this.pageSize = val
      this.getList('search')
    },
    //分页
    handleCurrentChange(val) {
      this.pageNo = val
      this.getList('search')
    },
    //请求列表数据
    getList(type) {
      let params = {
        sortOrder: 'asc',
        pageSize: this.pageSize,
        pageNumber: this.pageNo
      }
      if (type) {
        let search =
          this.searchData(JSON.parse(JSON.stringify(this.searchInfo))) || {}
        this.$refs.table.clearSelection()
        params = Object.assign({}, params, filterObj(search))
      }
      Object.assign(params, this.outerParams)
      if (!this.url) {
        this.tableLoading = false
        return
      }
      this.$api[this.url](params).then(res => {
        if (this.fixedPage) {
          // 修正page数据不同
          let { buttonList, page } = res
          let { pageNo, pageSize, rows, total } = page
          rows.forEach((element, index) => {
            element.buttonList = buttonList[index]
          })
          this.pageNo = pageNo
          this.pageSize = pageSize
          this.total = total
          this.tableList = rows
          this.tableLoading = false
        } else {
          let { pageNo, pageSize, rows, total } = res
          pageNo && (this.pageNo = pageNo)
          pageSize && (this.pageSize = pageSize)
          total && (this.total = total)
          this.tableList = rows
          this.tableLoading = false
        }
      })
      // .catch(err => {
      //   this.$message.error(err.msg)
      // })
    },
    clearSelection() {
      this.$refs.table.clearSelection()
    },
    resetSearchAndGetData() {
      this.clearSelection()
      this.$refs.search.resetSearch()
    }
  },
  mounted() {
    this.getList()
    this.setDefaultData()
  },
  components: {
    userDefined
  }
}
</script>
<style lang="scss">
.yt-page {
  background: #fff;
}
.dialog-footer {
  display: inline-block;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>

