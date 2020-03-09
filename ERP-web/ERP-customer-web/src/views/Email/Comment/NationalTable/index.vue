<template>
  <div>
    <el-button type="primary" size="small" @click="nationalVisible">选择国家</el-button>
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
            reserveSelection="nationId"
            ref="table"
          >
            <template slot="right">
              <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                  <div>
                    <el-button
                      class="normal-table-icon"
                      size="mini"
                      @click="handleChose(scope.$index, scope.row)"
                    >{{scope.row.choseMessage}}</el-button>
                  </div>
                </template>
              </el-table-column>
            </template>
          </yt-table>
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
            <el-button size="small" type="primary" @click="handleSure">选择</el-button>
          </el-form-item>
        </el-row>
      </div>
    </yt-dialog>
  </div>
</template>

<script>
export default {
  props: {
    nationalData: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    let vm = this
    return {
      pageNo: 1,
      pageSize: 10,
      total: 1,
      choseFlag: true,
      indexKey: null,
      tableColumns: [
        {
          label: '国家ID',
          value: 'nationId',
          width: '80'
        },
        {
          label: '国家缩写',
          value: 'threeWordCode',
          width: '80'
        },
        {
          label: '国家中文',
          value: 'nameZh'
        },
        {
          label: '国家英文',
          value: 'nameEn'
        }
      ],
      tableData: [],
      searchList: [
        {
          value: 'nationName',
          label: '',
          type: 'input',
          placeholder: '请输入国家名称',
          size: 'small',
          style: {
            width: '500px'
          }
        }
      ],
      options: {
        visible: false,
        title: '选择国家',
        width: '800px',
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
      events: {
        close: () => {
          vm.$emit('close', null)
          vm.$refs.table.clearSelection()
        }
      },
      selectValue: [],
      selectedValue: [],
      listParams: {
        pageNumber: 1,
        pageSize: 10,
        sortOrder: 'asc'
      },
      selected: []
    }
  },
  created() {},
  watch: {},
  methods: {
    nationalVisible() {
      let vm = this
      vm.options.visible = true
      // vm.indexKey = Math.random()
      this.selectValue = JSON.parse(JSON.stringify(this.nationalData))
      this.selectedValue = JSON.parse(JSON.stringify(this.nationalData))
      vm.getList()
    },
    handleCurrentChange(val) {
      let vm = this
      vm.extendObj({
        pageNumber: val
      })
      vm.getList()
    },
    formatRepet(val) {
      let arr = JSON.parse(JSON.stringify(val))
      let obj = {}
      arr.forEach(item => {
        if (!obj[item.nationId]) {
          obj[item.nationId] = item
        }
      })
      return Object.values(obj)
    },
    handleSelectValue(select, origin) {
      let orig = JSON.parse(JSON.stringify(origin))
      this.selectedValue = orig.filter(item => {
        return !select.find(el => el.nationId == item.nationId)
      })
    },
    handleSizeChange(val) {
      let vm = this
      vm.extendObj({
        pageSize: val
      })
      vm.getList()
    },
    handleSelectionChange(val) {
      val = this.formatRepet(val)
      this.handleSelectValue(val, this.selectedValue)
      this.selectValue = [...val, ...this.selectedValue]
    },
    handleSure() {
      let vm = this
      vm.$emit('close', vm.selectValue)
      vm.$refs.table.clearSelection()
      vm.options.visible = false
    },
    handleSearch(data) {
      let vm = this
      vm.extendObj(data)
      vm.getList()
    },

    handleChose(index, row) {
      let vm = this
      if (vm.tableData[index].choseMessage == '取消') {
        vm.tableData[index].choseMessage = '选择'
        vm.$refs.table.toggleRowSelection(row)
      } else if (vm.tableData[index].choseMessage == '选择') {
        vm.tableData[index].choseMessage = '取消'
        vm.$refs.table.toggleRowSelection(row)
      }
    },
    handleCancle() {
      this.choseFlag = true
    },
    getList() {
      let vm = this
      return vm.$api['product/nationalPage'](vm.extendObj(vm.listParams))
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (data) {
            vm.pageNo = data.pageNo
            vm.pageSize = data.pageSize
            vm.total = data.total
            vm.tableData = data.rows
            vm.tableData = vm.tableData.map(item => {
              return {
                ...item,
                choseMessage: '选择'
              }
            })
            JSON.parse(JSON.stringify(vm.tableData)).forEach(item => {
              vm.selectValue.forEach(element => {
                if (element.nationId == item.nationId) {
                  vm.$refs.table.toggleRowSelection(item)
                }
              })
            })
          }
          return Promise.resolve(vm.tableData)
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
.pagination {
  text-align: center;
  margin-top: 10px;
}
</style>
