<template>
  <div class="add-sku">
    <el-button type="primary" size="small" @click="handleAddSku">添加包含SKU</el-button>
    <yt-dialog :options="options" :events="events">
      <div class="dialog-wrap">
        <el-row>
          <search :searchList="searchList" @search="handleSearch"></search>
        </el-row>
        <el-row class="martop">
          <yt-table
            :columns="tableColumns"
            :data="tableData"
            @handleSelectionChange="handleSelectionChange"
            row-key="skuStore"
            :selected="selected"
          ></yt-table>
        </el-row>
        <el-row class="pagination">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="pageNo"
            :page-sizes="[10,20,30,60,80]"
            :page-size="pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
          ></el-pagination>
        </el-row>
        <el-row>
          <el-form-item class="saveBtn martop" label-width="0px">
            <el-button size="small" type="primary" @click="handleSure">确认选择</el-button>
          </el-form-item>
        </el-row>
      </div>
    </yt-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    skuDate: {
      type: Array,
      default: () => {
        return []
      }
    },
    storeId: {
      default: () => {
        return 0
      }
    },
    emailAccountId: {
      default: () => {
        return 0
      }
    }
  },
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 1,
      tableColumns: [
        {
          value: 'imgPath',
          label: '图片',
          img: true,
          style: {
            width: 36,
            height: 36
          },
          bulkyHeight: 36
        },
        {
          value: 'nameCn',
          label: '产品名称'
        },
        {
          value: 'skuCus',
          label: '自定义SKU'
        },
        {
          value: 'skuStore',
          label: '店铺SKU'
        },
        {
          value: 'nameEn',
          label: '产品英文名称'
        },
        {
          value: 'purchaseName',
          label: '采购人员'
        },
        {
          value: 'warehouseName',
          label: '默认本地发货仓库',
          width: '170'
        }
      ],
      selected: [],
      tableData: [],
      searchList: [
        {
          value: 'sku',
          label: 'SKU：',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '170px'
          }
        },
        {
          value: 'name',
          label: '产品名称：',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '170px'
          }
        },
        {
          value: 'warehouseId',
          label: '发货仓库：',
          type: 'select',
          placeholder: '',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        }
      ],
      options: {
        visible: false,
        title: '选择SKU',
        width: '1000px',
        fullscreen: false,
        top: '20vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: true,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      selectList: [],
      events: {
        close: () => {
          this.$emit('close', null)
        }
      },
      selectValue: [],
      listParams: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      allDataList: [],
      url: ''
    }
  },
  created() {},
  computed: {
    ...mapState('product', ['warehouseList'])
  },
  watch: {
    warehouseList(val) {
      let vm = this
      vm.searchList[2].children = val
    }
  },
  methods: {
    ...mapActions('product', ['getWarehouseList']),
    handleAddSku() {
      let vm = this

      if (vm.storeId) {
        vm.url = 'email/storeSkuPage'
        vm.extendObj({
          storeId: vm.storeId
        })
      } else if (vm.emailAccountId) {
        vm.url = 'email/skuAccountPage'
        vm.extendObj({
          emailAccountId: vm.emailAccountId
        })
      } else {
        if (vm.storeId === 0) {
          vm.$message({
            dangerouslyUseHTMLString: true,
            type: 'error',
            message: `<strong>请选择对应账号</strong>`
          })
          return
        }
        if (vm.emailAccountId === 0) {
          vm.$message({
            dangerouslyUseHTMLString: true,
            type: 'error',
            message: `<strong>请选择订单来源</strong>`
          })
          return
        }
      }
      this.options.visible = true
      vm.getWarehouseList()
      vm.getList().then(() => {
        let vm = this
        let skuDate = vm.skuDate
        if (skuDate && skuDate.length) {
          vm.selected = skuDate.map(item => {
            return vm.tableData.find(el => el.skuStore == item.value)
          })
        }
      })
    },
    handleCurrentChange(val) {
      let vm = this
      vm.extendObj({
        pageNumber: val
      })
      vm.getList()
    },
    handleSizeChange(val) {
      let vm = this
      vm.extendObj({
        pageSize: val
      })
      vm.getList()
    },
    handleSearch(data) {
      let vm = this
      let obj = JSON.parse(JSON.stringify(data))
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (!obj[key].toString()) {
            obj[key] = null
          }
        }
      }
      vm.extendObj(true, obj)
      vm.getList()
    },
    handleSelectionChange(val) {
      let vm = this
      vm.selectValue = val.map(item => {
        return {
          label: item.nameEn,
          value: item.skuStore
        }
      })
    },
    handleSure() {
      let vm = this
      if (vm.selectValue.length) {
        vm.options.visible = false
        vm.$emit('close', vm.selectValue)
      }
    },
    getList() {
      let vm = this
      return vm.$api[vm.url](vm.extendObj(vm.listParams))
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (data) {
            vm.pageNo = data.pageNo
            vm.pageSize = data.pageSize
            vm.total = data.total
            vm.tableData = data.rows
          }
          return data
        })
    },
    extendObj(...obj) {
      let listParams = this.listParams
      if (typeof obj[0] === 'boolean') {
        obj.shift()
        listParams.pageNumber = 1
        listParams.pageSize = 10
      }
      return (this.listParams = Object.assign(listParams, ...obj))
    }
  }
}
</script>

<style lang="scss">
.add-sku {
  .dialog-wrap {
    width: 100%;
    border-top: 1px solid #bbbbbb;
    padding-top: 20px;
  }
  .pagination {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
