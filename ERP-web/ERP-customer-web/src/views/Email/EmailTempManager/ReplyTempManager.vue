<template>
  <div class="email-template-classify-reply-template">
    <universal-layout
      :isAmazon="true"
      :pageNo="pageNo"
      :pageSize="pageSize"
      :total="total"
      @handleCurrentChange="handleCurrentChange"
      @handleSizeChange="handleSizeChange"
    >
      <header slot="search">
        <search :searchList="searchList" @search="handleSearch"></search>
      </header>
      <section slot="allbtn">
        <el-button type="primary" size="mini" class="search-submit" @click="handleAdd">添加</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleCopy">复制添加</el-button>
        <el-button type="primary" size="mini" class="search-submit" @click="handleDelete">删除</el-button>
      </section>
      <section slot="table">
        <yt-table
          :columns="columns"
          reserveSelection="emailTemplateId"
          :data="tableData"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <template slot="left">
            <el-table-column label="ID" width="40">
              <template slot-scope="scope">
                <span>{{scope.row.emailClassificationId}}</span>
              </template>
            </el-table-column>
          </template>
          <template>
            <el-table-column label="操作" width="60">
              <template slot-scope="scope">
                <el-tooltip content="编辑" offset="1" placement="bottom" effect="light">
                  <el-button
                    class="normal-table-icon"
                    size="mini"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </template>
          <template slot="right">
            <el-table-column label="状态" width="100px">
              <template slot-scope="scope">
                <i
                  class="normal-table-icon"
                  :class="scope.row.activateFlag?'el-icon-check':'el-icon-close'"
                  @click="handleFlagChange(scope.$index, scope.row)"
                ></i>
              </template>
            </el-table-column>
          </template>
        </yt-table>
      </section>
    </universal-layout>
    <menu-select
      :loadData="loadData"
      nodeKey="emailClassificationId"
      :defaultProps="{
        children: 'childs',
        label: 'classifyName',
        count: 'num',
        value: 'emailClassificationId'
      }"
      :title="'回复模板分类'"
      @nodeclick="nodeclick"
    ></menu-select>
    <reply-template
      :form="dialogForm"
      :classifyType="2"
      :templateType="1"
      :visible="visible"
      @formSubmit="formSubmit"
      :key="keyIndex"
    ></reply-template>
  </div>
</template>

<script>
import ReplyTemplate from './ReplyTemplate'
import { mapActions, mapState } from 'vuex'
import MenuSelect from '../../Amazon/Email/comment/MenuSelect'
export default {
  data() {
    return {
      visible: false,
      selectedOptions: [],

      keyIndex: null,

      dialogData: [{}],
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'platformIds',
          type: 'multiple',
          placeholder: '来源平台(多选)',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          value: 'languageId',
          type: 'select',
          placeholder: '选择语言',
          size: 'small',
          style: {
            width: '170px'
          },
          children: []
        },
        {
          value: 'templateName',
          type: 'input',
          placeholder: '模板名称',
          size: 'small',
          style: {
            width: '260px'
          }
        },
        {
          label: '添加时间',
          value: 'createTime',
          type: 'time',
          size: 'small'
        },
        {
          value: 'activateFlag',
          type: 'select',
          placeholder: '状态',
          size: 'small',
          style: {
            width: '120px'
          },
          children: [
            {
              value: 1,
              label: '激活'
            },
            {
              value: 0,
              label: '不激活'
            }
          ]
        }
      ],
      dialogForm: {},
      columns: [
        {
          value: 'emailClassificationName',
          label: '模板分类'
        },
        {
          value: 'templateName',
          label: '模板名'
        },
        {
          value: 'platformList',
          label: '订单来源平台'
        },
        {
          value: 'languageName',
          label: '模板语言'
        },
        {
          value: 'countDay',
          label: '今日使用次数'
        },
        {
          value: 'countMonth',
          label: '本月使用次数'
        },
        {
          value: 'countAll',
          label: '使用总次数'
        },
        {
          value: 'createTime',
          label: '添加时间'
        },
        {
          value: 'modifyTime',
          label: '修改时间'
        }
      ],
      tableData: [],

      selectData: [],
      listParams: {
        platformIds: [],
        templateType: 1,
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },

      isEdit: false,
      verificationFlag: true
    }
  },
  created() {
    let vm = this
    vm.getPlatformList()
    vm.getLanguageList()
    vm.getList()
  },
  computed: {
    ...mapState('product', ['platformList', 'languageList'])
  },
  watch: {
    platformList(val) {
      let vm = this
      vm.searchList[0].children = val
    },
    languageList(val) {
      let vm = this
      vm.searchList[1].children = val
    }
  },
  methods: {
    ...mapActions('product', ['getPlatformList', 'getLanguageList']),
    loadData() {
      let vm = this
      return vm.$api['email/classificationTemplateList']({
        classifyType: 2
      }).then(data => {
        if (!data || !data.rows) {
          return []
        }
        return [data.rows]
      })
    },
    nodeclick(data) {
      this.listParams.emailClassificationId = data.emailClassificationId
      this.getList()
    },
    formSubmit() {
      let vm = this
      vm.visible = false
      vm.extendObj(true)
      vm.getList()
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
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleDelete() {
      let vm = this
      if (!vm.selectData.length) {
        return
      }
      let emailTemplateIds = vm.selectData.map(data => {
        return data.emailTemplateId
      })
      vm.deleteList({
        emailTemplateIds,
        templateType: 1
      })
    },
    handleAdd() {
      let vm = this
      vm.keyIndex = Math.random()
      vm.visible = true
      vm.dialogForm = {}
    },
    handleCopy() {
      let vm = this
      if (!vm.selectData.length) {
        vm.$message({
          type: 'error',
          message: '请选择复制添加的数据'
        })
        return
      }
      let data = vm.selectData[0]
      let emailTemplateId = data.emailTemplateId
      vm.$api['email/templateDataGet']({
        emailTemplateId,
        templateType: 1
      })
        .then(data => {
          if (!data) return
          vm.keyIndex = Math.random()
          vm.visible = true
          vm.dialogForm = data.rows
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleEdit(index, row) {
      let vm = this
      vm.keyIndex = Math.random()
      vm.dialogForm = {}
      vm.selectedOptions = []
      let emailTemplateId = row.emailTemplateId
      vm.$api['email/templateGet']({
        emailTemplateId,
        templateType: 1
      }).then(data => {
        vm.visible = true
        vm.dialogForm = data.rows
      })
    },
    handleFlagChange(index, row) {
      let vm = this
      vm.$api['email/templateGet']({
        emailTemplateId: row.emailTemplateId,
        templateType: 1
      }).then(data => {
        let _data = data.rows
        _data.activateFlag = _data.activateFlag ? 0 : 1
        _data.superArray = null
        vm.$api['email/templateSave'](_data)
          .then(() => {
            vm.$message.success('操作成功')
            vm.extendObj(true)
            vm.getList()
          })
          .catch(err => {
            console.log(err)
          })
      })
    },
    handleSearch(val) {
      let vm = this
      let data = JSON.parse(JSON.stringify(val))
      if (data.createTime && data.createTime.length) {
        data.timeStart = data.createTime[0]
        data.timeEnd = data.createTime[1]
        delete data.createTime
      } else {
        delete data.timeStart
        delete data.timeEnd
      }
      if (data.platformIds && !data.platformIds.length) {
        delete data.platformIds
      }

      vm.extendObj(true, data)
      vm.getList()
    },

    deleteList(params = {}) {
      let vm = this
      vm.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          vm.$api['email/templateRemove'](params).then(data => {
            vm.$message({
              dangerouslyUseHTMLString: true,
              type: 'warning',
              message: `<strong>成功删除${
                data.successNum
              }数据</strong>，<strong>失败${data.failNum}数据</strong>
              <br/><strong>${data.errMsg}</strong>`
            })
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
      return vm.$api['email/templatePage'](vm.extendObj(vm.listParams))
        .catch(err => {
          console.log(err)
        })
        .then(data => {
          if (data) {
            vm.pageNo = data.pageNo
            vm.pageSize = data.pageSize
            vm.total = data.total
            vm.tableData = data.rows
            vm.tableData = vm.tableData.map(el => {
              if (el.platformList && el.platformList.length) {
                el.platformList = el.platformList.map(item => {
                  return item.name
                })
              } else {
                el.platformList = ''
              }
              return el
            })
          }
          return data
        })
    },
    extendObj(...obj) {
      let listParams = this.listParams
      if (typeof obj[0] === 'boolean') {
        obj.shift()
        listParams = {}
        listParams.platformIds = []
        listParams.templateType = 1
        listParams.pageNumber = 1
        listParams.pageSize = 10
        listParams.sortOrder = 'asc'
      }
      return (this.listParams = Object.assign(listParams, ...obj))
    }
  },
  components: {
    ReplyTemplate,
    MenuSelect
  }
}
</script>

<style lang="scss">
.email-template-classify-reply-template {
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-form-item__content {
    line-height: 33px;
  }
  .cell.must-fill-sign {
    @include must-fill-sign;
  }
  .checkbox {
    .el-form-item__content {
      vertical-align: bottom;
      input {
        margin-top: 15px;
      }
    }
  }
  .marginTop8 {
    margin-top: 8px;
  }
  .input-width {
    .el-input {
      width: 260px;
    }
  }
  .before-blank {
    padding-left: 10px;
  }
  .isChecked {
    margin-top: 14px;
    padding-left: 10px;
  }
  .saveBtn {
    margin-top: 14px;
  }
}
</style>
