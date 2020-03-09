<template>
  <div class="complaint-manage">
    <universal-layout
      :isAmazon="true"
      :total="total"
      :pageSize="pageSize"
      :pageNo="pageNo"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <section slot="search">
        <search :searchList="searchList" @search="handleSearch"></search>
      </section>
      <section slot="allbtn">
        <el-button type="primary" size="small" class="search-btn" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="small" class="search-btn" @click="handleSet(1)">设置已处理</el-button>
        <el-button type="primary" size="small" class="search-btn" @click="handleSet(0)">设置未处理</el-button>
        <el-button type="primary" size="small" class="search-btn" @click="handleDelete">删除</el-button>
        <span style="display: inline-block;right:0;position: absolute;height: 32px;text-align: center;">
          <el-popover placement="bottom" width="180" trigger="click">
            <el-row class="customBtn">
              <el-checkbox-group v-model="checkList">
                <el-checkbox class="elCheckBox" label="处理状态"></el-checkbox>
                <el-checkbox class="elCheckBox" label="产品图片"></el-checkbox>
                <el-checkbox class="elCheckBox" label="店铺SKU"></el-checkbox>
                <el-checkbox class="elCheckBox" label="站点"></el-checkbox>
                <el-checkbox class="elCheckBox" label="ASIN"></el-checkbox>
                <el-checkbox class="elCheckBox" label="投诉类型"></el-checkbox>
                <el-checkbox class="elCheckBox" label="投诉品牌"></el-checkbox>
                <el-checkbox class="elCheckBox" label="卖家ID"></el-checkbox>
                <el-checkbox class="elCheckBox" label="店铺"></el-checkbox>
                <el-checkbox class="elCheckBox" label="投诉时间"></el-checkbox>
                <el-checkbox class="elCheckBox" label="处理时间"></el-checkbox>
                <el-checkbox class="elCheckBox" label="添加人员"></el-checkbox>
                <el-checkbox class="elCheckBox" label="是否下架"></el-checkbox>
                <el-checkbox class="elCheckBox" label="备注"></el-checkbox>
              </el-checkbox-group>
            </el-row>
            <el-button slot="reference">自定义列表展示</el-button>
          </el-popover>
        </span>
      </section>
      <section slot="table">
        <yt-table
          reserveSelection="serviceSellingComplaintsId"
          :columns="tableColumns"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <el-table-column label="操作" width="50">
            <template slot-scope="scope">
              <el-tooltip content="向亚马逊投诉" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-service"
                  @click="handleComplaint(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>
              <!-- <el-tooltip content="发站内信" offset="1" placement="bottom" effect="light">
                <el-button
                  class="normal-table-icon"
                  size="mini"
                  icon="el-icon-document"
                  @click="handleWrite(scope.$index, scope.row)"
                ></el-button>
              </el-tooltip>-->
            </template>
          </el-table-column>
        </yt-table>
      </section>
    </universal-layout>
    <yt-dialog :options="complainOption">
      <complain-email
        :serviceSellingComplaintsId="serviceSellingComplaintsId"
        @sendFlag="complainOption.visible = false"
        :key="indexKey"
      ></complain-email>
    </yt-dialog>
    <yt-dialog :options="inMailOption">
      <in-mail></in-mail>
    </yt-dialog>
    <yt-dialog :options="addOptions">
      <div class="dialog-wrap">
        <el-form v-model="addForm" label-width="110px">
          <el-form-item size="small" label="来源店铺：" prop="storeId" class="martop">
            <el-select placeholder="渠道来源" v-model="addForm.storeId" class="marleft10">
              <!-- <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>-->
              <el-option v-for="item in platformStoreList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="投诉类型：" prop="complaintType" class="martop">
            <el-select placeholder="投诉类型" v-model="addForm.complaintType" class="marleft10">
              <el-option label="侵权" :value="1"></el-option>
              <el-option label="跟卖" :value="2"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="跟卖品牌：" prop="sellingBrand" class="martop">
            <el-select placeholder="跟卖品牌" v-model="addForm.sellingBrand" class="marleft10">
              <!-- <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>-->
              <el-option v-for="item in brandNameList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="销售人员：" prop="salesman" class="martop">
            <el-select placeholder="销售人员" v-model="addForm.salesman" class="marleft10">
              <!-- <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>-->
              <el-option v-for="item in salemanList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="ASIN：" prop="asin" class="martop">
            <el-input v-model="addForm.asin" class="marleft10"></el-input>
          </el-form-item>
          <el-form-item size="small" label="跟卖卖家ID：" prop="sellingSellerId" class="martop">
            <el-input v-model="addForm.sellingSellerId" type="number" class="marleft10"></el-input>
          </el-form-item>
          <el-form-item size="small" label="店铺名称：" prop="storeName" class="martop">
            <el-input v-model="addForm.storeName" class="marleft10"></el-input>
          </el-form-item>
          <el-form-item size="small" label="跟卖备注：" prop="remark" class="martop">
            <el-input v-model="addForm.remark" class="marleft10"></el-input>
          </el-form-item>
          <el-row class="saveBtn" style="margin-top:20px;">
            <el-button size="small" type="primary" :loading="loading" @click="handlerSubmit">保存</el-button>
          </el-row>
        </el-form>
      </div>
    </yt-dialog>

    <!-- 其他弹窗 -->
    <yt-dialog :options="siteOptions">
      <div class="dialog-wrap">
        <el-form :model="siteData" label-width="90px">
          <el-form-item size="small" label="通知类型：" prop="asin" class="martop">
            <el-select class="marleft10" v-model="siteData.remark">
              <el-option label="自定义通知" :value="1"></el-option>
              <el-option label="缺货通知" :value="2"></el-option>
              <el-option label="下架通知" :value="3"></el-option>
              <el-option label="产品涨价通知" :value="4"></el-option>
              <el-option label="产品降价通知" :value="5"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="收件人：" prop="asin" class="martop">
            <el-select class="marleft10" multiple collapse-tags v-model="siteData.recipient">
              <el-option label="区域一" value="shanghai"></el-option>
              <el-option label="区域二" value="beijing"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item size="small" label="标题：" prop="asin" class="martop">
            <el-input v-model="siteData.remark" class="marleft10"></el-input>
          </el-form-item>
          <el-form-item size="small" label="内容：" prop="asin" class="martop">
            <UeEditor v-model="siteData.content" ref="editor" :config="editorConfig"/>
          </el-form-item>
          <el-row class="saveBtn" style="margin-top:20px;">
            <el-button size="small" type="primary" @click="handlerSiteSubmit">发送</el-button>
          </el-row>
        </el-form>
      </div>
    </yt-dialog>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import ComplainEmail from './ComplainEmail'
import InMail from './InMail'

export default {
  data() {
    return {
      indexKey: null,
      complainOption: {
        visible: false,
        title: '申诉',
        width: '1330px'
      },
      inMailOption: {
        visible: false,
        title: '站内信',
        width: '1000px'
      },
      loading: false,
      siteData: {},
      editorConfig: {
        initialFrameHeight: 196,
        initialFrameWidth: 718
      },
      total: 10,
      pageSize: 10,
      pageNo: 1,
      otherData: {
        msg: ''
      },
      dialogFlag: '',
      addForm: {},
      searchList: [
        {
          value: 'siteIds',
          type: 'multiple',
          placeholder: '站点选择(多选)',
          size: 'small',
          style: {
            width: '180px'
          },
          children: [
            {
              label: '1',
              value: '1'
            }
          ]
        },
        {
          label: 'ASIN：',
          value: 'asin',
          type: 'input',
          size: 'small',
          style: {
            width: '150px'
          }
        },
        {
          label: '卖家ID/卖家店铺：',
          value: 'sellingSellerInfo',
          type: 'input',
          size: 'small',
          style: {
            width: '150px'
          }
        },
        {
          value: 'sellingBrand',
          type: 'select',
          label: '品牌：',
          size: 'small',
          style: {
            width: '150px'
          },
          children: []
        },
        {
          label: '侵权类型',
          value: 'complaintType',
          type: 'select',
          placeholder: '侵权',
          size: 'small',
          style: {
            width: '150px'
          },
          children: [
            {
              label: '侵权',
              value: 1
            },
            {
              label: '跟卖',
              value: 2
            }
          ]
        },
        {
          value: 'salesman',
          type: 'multiple',
          placeholder: '销售人员(多选)',
          size: 'small',
          style: {
            width: '150px'
          },
          children: [
            {
              label: '1',
              value: '1'
            }
          ]
        },
        {
          label: '投诉时间',
          value: 'time',
          type: 'time',
          size: 'small'
        },
        {
          value: 'handleState',
          type: 'select',
          placeholder: '处理状态',
          size: 'small',
          style: {
            width: '150px'
          },
          children: [
            {
              label: '已处理',
              value: 1
            },
            {
              label: '未处理',
              value: 0
            }
          ]
        },
        {
          value: 'lowerFrameFlag',
          type: 'select',
          placeholder: '是否下架',
          size: 'small',
          style: {
            width: '150px'
          },
          children: [
            {
              label: '未下架',
              value: 0
            },
            {
              label: '已下架',
              value: 1
            }
          ]
        }
      ],
      checkList: [
        '处理状态',
        '产品图片',
        'ASIN',
        '店铺SKU',
        '站点',
        '投诉类型',
        '投诉品牌',
        '卖家ID',
        '店铺',
        '投诉时间',
        '处理时间',
        '添加人员',
        '是否下架',
        '备注'
      ],
      tableColumns: [
        {
          label: '处理状态',
          value: 'handleStateName'
        },
        {
          label: '产品图片',
          value: 'productImg',
          img: true,
          style: {
            width: 36,
            height: 36
          },
          bulkyHeight: 36,
          width: '70'
        },
        {
          label: 'ASIN',
          value: 'asin',
          width: '70'
        },
        {
          label: '店铺SKU',
          value: 'storeSku'
        },
        {
          label: '站点',
          value: 'siteName'
        },
        {
          label: '投诉类型',
          value: 'complaintTypeName'
        },
        {
          label: '投诉品牌',
          value: 'sellingBrandName'
        },
        {
          label: '卖家ID',
          value: 'sellingSellerId'
        },
        {
          label: '店铺',
          value: 'storeName'
        },
        {
          label: '投诉时间',
          value: 'complaintTime',
          width: '140'
        },
        {
          label: '处理时间',
          value: 'handleTime',
          width: '140'
        },
        {
          label: '添加人员',
          value: 'creatorName'
        },
        {
          label: '是否下架',
          value: 'lowerFrameFlagName'
        },
        {
          label: '备注',
          value: 'remark'
        }
      ],
      tableData: [],
      addOptions: {
        visible: false,
        title: '添加',
        width: '470px',
        fullscreen: false,
        top: '30vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      siteOptions: {
        visible: false,
        title: '发站内信',
        width: '900px',
        fullscreen: false,
        top: '30vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      listParams: {
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      selectData: [],
      serviceSellingComplaintsIds: [],
      serviceSellingComplaintsId: null,
      defaultColumns: []
    }
  },
  created() {
    let vm = this
    vm.getPlatformStoreList()
    vm.getBrandNameList()
    vm.getSalemanList()
    vm.getSiteList()
    vm.getList()
    this.setDefaultColumns()
  },
  computed: {
    ...mapState('order', ['salemanList']),
    ...mapState('product', ['platformStoreList', 'brandNameList', 'siteList'])
  },
  watch: {
    salemanList(val) {
      this.searchList[5].children = val
    },
    siteList(val) {
      this.searchList[0].children = val
    },
    brandNameList(val) {
      this.searchList[3].children = val
    },
    checkList: {
      immediate: true,
      deep: true,
      handler(val) {
        let vm = this
        if (val) {
          if (this.defaultColumns.length) {
            vm.tableColumns = vm.defaultColumns.filter(
              item => val.indexOf(item.label) >= 0
            )
          }
        }
      }
    }
  },
  methods: {
    ...mapActions('product', [
      'getPlatformStoreList',
      'getBrandNameList',
      'getSiteList'
    ]),
    ...mapActions('order', ['getSalemanList']),
    setDefaultColumns() {
      let key = 'customer' + this.$route.name
      if (
        !localStorage.getItem(key) ||
        !JSON.parse(localStorage.getItem(key)).length
      ) {
        this.defaultColumns = [...this.tableColumns]
        localStorage.setItem(key, JSON.stringify(this.tableColumns))
      } else {
        this.defaultColumns = [...JSON.parse(localStorage.getItem(key))]
      }
      console.log(this.defaultColumns)
    },
    handleCurrentChange(val) {
      this.extendObj({
        pageNumber: val
      })
      this.getList()
    },
    handleSizeChange(val) {
      this.extendObj({
        pageSize: val
      })
      this.getList()
    },
    handleSelectionChange(val) {
      this.serviceSellingComplaintsIds = val.map(item => {
        return item.serviceSellingComplaintsId
      })
    },
    handleSearch(data) {
      let vm = this
      if (Array.isArray(data.time) && data.time.length) {
        data.startTime = data.time[0]
        data.endTime = data.time[1]
        delete data.time
      } else {
        delete data.startTime
        delete data.endTime
      }
      vm.extendObj(true, data)
      vm.getList()
    },
    handleDelete() {
      let vm = this
      let serviceSellingComplaintsIds = vm.serviceSellingComplaintsIds
      vm.deleteList({
        serviceSellingComplaintsIds
      })
    },
    handleSet(val) {
      let vm = this
      let serviceSellingComplaintsIds = vm.serviceSellingComplaintsIds
      let params = {
        serviceSellingComplaintsIds,
        handleState: val
      }
      if (!params.serviceSellingComplaintsIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择需要处理的数据</strong>`
        })
        return
      }
      vm.$api['email/complaintsSetHandle'](params)
        .then(() => {
          vm.getList()
        })
        .catch(err => {
          console.log(err)
        })
    },
    filter(index) {
      this.activeShow = index
    },

    handleCommand(val) {
      this.dialogFlag = val
      if (val === '客服') {
        this.otherOptions.title = '批量设置客服'
      } else if (val === '渠道') {
        this.otherOptions.title = '批量设置渠道来源'
      } else if (val === '标记') {
        this.otherOptions.title = '批量标记'
      }
      this.otherOptions.visible = true
    },
    handleAdd() {
      this.addForm = {}
      this.addOptions.visible = true
    },
    handleComplaint(index, row) {
      this.indexKey = Math.random()
      this.serviceSellingComplaintsId = row.serviceSellingComplaintsId
      this.complainOption.visible = true
    },
    handleWrite() {
      this.inMailOption.visible = true
    },
    handlerSubmit() {
      let vm = this
      vm.loading = true
      let params = vm.addForm
      vm.$api['email/complaintsSave'](params)
        .then(() => {
          vm.addOptions.visible = false
          vm.loading = false
          vm.extendObj(true)
          vm.getList()
        })
        .catch(() => {
          vm.loading = false
        })
    },
    handlerSiteSubmit() {
      let vm = this
      vm.siteOptions.visible = false
    },
    signSubmit() {},
    serviceSubmit() {},
    deleteList(params = {}) {
      let vm = this
      if (!params.serviceSellingComplaintsIds.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择删除的数据</strong>`
        })
        return
      }
      vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/complaintsRemove'](params).then(() => {
            vm.getList()
            vm.$refs.table.clearSelection()
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    getList() {
      let vm = this
      return vm.$api['email/complaintsList'](vm.extendObj(vm.listParams))
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
      let vm = this
      let listParams = vm.listParams
      if (typeof obj[0] == 'boolean') {
        obj.shift()
        listParams = {
          sortOrder: 'asc',
          pageSize: 10,
          pageNumber: 1
        }
      }
      vm.listParams = Object.assign({}, listParams, ...obj)
      return vm.listParams
    }
  },
  components: {
    ComplainEmail,
    InMail
  }
}
</script>

<style lang="scss">
.elCheckBox {
  margin: 0 10px !important;
  width: 66px;
}
.complaint-manage {
  .search-btn {
    margin-right: 10px;
  }
  .customBtn {
    .el-checkbox {
      margin: 0 10px;
    }
  }

  .normal-icon {
    border: none;
    padding: 6px 6px;
    margin-left: 6px;
    background: rgba(255, 255, 255, 0);
    i {
      font-size: 16px;
    }
  }
  .dialog-wrap {
    border-top: 1px solid #bbb;
    .marleft10 {
      margin-left: 10px;
      width: 260px;
    }
    .el-form-item--small.el-form-item,
    .el-form-item {
      margin-bottom: 0px;
    }
  }
}
.none {
  display: none;
}
.show {
  display: block;
}
</style>