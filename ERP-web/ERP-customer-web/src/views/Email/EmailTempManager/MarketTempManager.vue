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
          :data="tableData"
          reserveSelection="emailTemplateId"
          @handleSelectionChange="handleSelectionChange"
          ref="table"
        >
          <template>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <el-tooltip content="编辑" offset="1" placement="bottom" effect="light">
                  <el-button
                    class="normal-table-icon"
                    size="mini"
                    icon="el-icon-edit-outline"
                    @click="handleEdit(scope.$index, scope.row)"
                  ></el-button>
                </el-tooltip>
                <el-tooltip content="删除" offset="1" placement="bottom" effect="light">
                  <el-button
                    class="normal-table-icon"
                    size="mini"
                    icon="el-icon-delete"
                    @click="handleDelete(scope.$index, scope.row)"
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
      :title="'营销模板分类'"
      @nodeclick="nodeclick"
    ></menu-select>
    <market-template
      :form="dialogForm"
      :templateType="2"
      :classifyType="3"
      :visible="visible"
      @formSubmit="formSubmit"
      :key="keyIndex"
    ></market-template>
  </div>
</template>

<script>
import MarketTemplate from './MarketTemplate'
import { mapActions, mapState } from 'vuex'
import MenuSelect from '../../Amazon/Email/comment/MenuSelect'
export default {
  data() {
    return {
      visible: false,
      selectedOptions: [],
      selectOptions: [
        {
          value: null,
          label: '所有分类'
        }
      ],
      vertical: true,
      dialogData: [{}],
      pageNo: 1,
      pageSize: 10,
      total: 10,
      searchList: [
        {
          value: 'saleType',
          type: 'select',
          placeholder: '模板类型',
          size: 'small',
          style: {
            width: '170px'
          },
          children: [
            {
              label: '索取好评',
              value: 1
            },
            {
              label: '产品推广',
              value: 2
            },
            {
              label: '延迟发货',
              value: 3
            }
          ]
        },
        {
          label: '主题：',
          value: 'subject',
          type: 'input',
          placeholder: '',
          size: 'small',
          style: {
            width: '260px'
          }
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
              label: '激活',
              value: 1
            },
            {
              label: '未激活',
              value: 0
            }
          ]
        }
      ],
      dialogForm: {},
      columns: [
        {
          value: 'subject',
          label: '主题'
        },
        {
          value: 'saleTypeStr',
          label: '模板类型'
        },
        {
          // value: 'context',
          label: '内容',
          render(h, scope) {
            let data = scope.row.context
            return <div domPropsInnerHTML={data} />
          }
        },
        {
          value: 'creatorName',
          label: '添加人'
        },
        {
          value: 'createTime',
          label: '添加时间'
        }
      ],
      tableData: [],
      selectData: [],
      listParams: {
        platformIds: [],
        templateType: 2,
        sortOrder: 'asc',
        pageSize: 10,
        pageNumber: 1
      },
      editorConfig: {
        initialFrameHeight: 160,
        initialFrameWidth: 692
      },
      keyIndex: null
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
  watch: {},
  methods: {
    ...mapActions('product', ['getPlatformList', 'getLanguageList']),
    loadData() {
      let vm = this
      return vm.$api['email/classificationTemplateList']({
        classifyType: 3
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
    handleSearch(data) {
      let vm = this
      vm.extendObj(true, data)
      vm.getList()
    },
    handleChange(val) {
      this.dialogForm.emailClassificationId = val[val.length - 1]
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
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择需要复制的数据</strong>`
        })
        return
      }
      let data = vm.selectData[0]
      let emailTemplateId = data.emailTemplateId
      vm.$api['email/templateDataGet']({
        emailTemplateId,
        templateType: 2
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
        templateType: 2
      }).then(data => {
        vm.visible = true
        vm.dialogForm = data.rows
      })
    },
    handleFlagChange(index, row) {
      let vm = this
      vm.$api['email/templateGet']({
        emailTemplateId: row.emailTemplateId,
        templateType: 2
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
    handleSelectionChange(val) {
      this.selectData = val
    },
    handleDelete(index, row) {
      let vm = this
      if (row) {
        vm.selectData = [row]
      }
      if (!vm.selectData.length) {
        vm.$message({
          dangerouslyUseHTMLString: true,
          type: 'error',
          message: `<strong>请选择需要删除的数据</strong>`
        })
        return
      }
      let emailTemplateIds = vm.selectData.map(data => {
        return data.emailTemplateId
      })
      vm.deleteList({
        emailTemplateIds,
        templateType: 2
      })
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
          }
          return data
        })
    },
    extendObj(...obj) {
      let listParams = this.listParams
      if (typeof obj[0] === 'boolean') {
        obj.shift()
        listParams.platformIds = []
        listParams.templateType = 2
        listParams.pageNumber = 1
        listParams.pageSize = 10
        listParams.sortOrder = 'asc'
      }
      return (this.listParams = Object.assign(listParams, ...obj))
    }
  },
  components: {
    MarketTemplate,
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
