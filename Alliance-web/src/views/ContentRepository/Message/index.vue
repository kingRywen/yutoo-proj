<template>
  <div>
    <!-- <main-layout
      :btns="btns"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      :defaultShowTree="false"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
      @clear="handleClear"
    ></main-layout>-->
    <NewMainLayout
      ref="lay"
      url="main/libMessageContentList"
      :edit-btns="edits"
      editWidth="120px"
      :searchFields="searchFields"
      :columns="columns"
      :topBatchBtn="topBatchBtn"
      @left-batch-change="handleLeftBatchChange"
      :loadNode="_loadNode"
      :right-edit-btns="editBtns"
      :leftTree="true"
    ></NewMainLayout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <el-form ref="addForm" class="custom_from" label-width="60px" size="mini" :model="addForm">
        <el-form-item label="类目" prop="categoryId" :rules="validator(true, '类目')">
          <SyncCascader
            :last="true"
            size="mini"
            v-if="refresh"
            v-model="addForm.categoryId"
            :load="loadTreeHasLast"
            :props="treeProps"
          />
        </el-form-item>
        <el-table :data="addForm.tableData">
          <el-table-column header-align="center" label="内容1">
            <template slot-scope="scope">
              <el-form-item
                label-width="0"
                :prop="`tableData.${scope.$index}.firstContent`"
                :rules="validator(true, '内容1')"
                class="table-form-item"
              >
                <el-input
                  type="textarea"
                  :rows="scope.row._rows || 1"
                  @focus="handleFocus(scope)"
                  v-model="scope.row.firstContent"
                  placeholder
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="内容2">
            <template slot-scope="scope">
              <el-form-item
                label-width="0"
                :prop="`tableData.${scope.$index}.secondContent`"
                :rules="validator(true, '内容2')"
                class="table-form-item"
              >
                <el-input
                  type="textarea"
                  :rows="scope.row._rows || 1"
                  @focus="handleFocus(scope)"
                  @blur="handleFocus(scope, true)"
                  v-model="scope.row.secondContent"
                  placeholder
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="内容3">
            <template slot-scope="scope">
              <el-form-item
                label-width="0"
                :prop="`tableData.${scope.$index}.thirdContent`"
                :rules="validator(true, '内容3')"
                class="table-form-item"
              >
                <el-input
                  type="textarea"
                  :rows="scope.row._rows || 1"
                  @focus="handleFocus(scope)"
                  @blur="handleFocus(scope, true)"
                  v-model="scope.row.thirdContent"
                  placeholder
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column width="80px" v-if="dialogOptions.title==='新增站内信'">
            <template slot-scope="scope">
              <el-button type="text" icon="el-icon-plus" @click="handlePlus(scope)"></el-button>
              <el-button
                type="text"
                icon="el-icon-minus"
                @click="handleMinus(scope)"
                v-if="addForm.tableData.length !== 1"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </yt-dialog>
    <yt-dialog :options="importDialogOptions" :events="importDialogEvents" v-loading="importWrapperLoading">
      <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
      <el-upload
        class="custom-upload"
        :action="uploadConfig.url"
        :headers="uploadConfig.headers"
        :data="uploadConfig.data"
        :show-file-list="false"
        :on-success="handleOnSuccess"
        :before-upload="handleBeforeUpload"
        :on-error="handleOnError"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </yt-dialog>
  </div>
</template>

<script>
import SyncCascader from 'Components/SimpleForm/src/SyncCascader'
import validator from 'Utils/validator'
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
import download from 'Utils/download'

const token = storage.get('local', 'token')

export default {
  components: { SyncCascader },
  data() {
    let vm = this
    return {
      editBtns: [
        {
          name: '新增',

          fn: () => {
            vm.dialogOptions.title = '新增站内信'
            this.dialogOptions.visible = true
          }
        },
        {
          name: '导入',

          fn: () => {
            this.importDialogOptions.visible = true
          }
        }
      ],
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '删除'
          }
        ]
      },
      refresh: true,
      importWrapperLoading: false,
      treeProps: {
        label: 'name',
        value: 'categoryId',
        children: 'childs',
        enabled: 'enabled'
      },
      addForm: { tableData: [{}] },
      uploadConfig: {
        url: CONST_PORT_CONFIG.BASE_URL + 'LibMessageContent/importData',
        headers: {
          token
        },
        data: {
          token
        }
      },
      dialogOptions: {
        visible: false,
        title: '新增站内信',
        // width: '80%',
        width: '1000px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      importDialogOptions: {
        visible: false,
        title: '导入站内信',
        width: '500px'
        // okBtnText: '确定',
        // cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOpen() {
          vm.addForm = { tableData: [{}] }
          vm.$nextTick(() => vm.$refs.addForm.clearValidate())
        },
        handleOkClick() {
          return vm.$refs.addForm.validate().then(() => {
            let { categoryId, tableData } = vm.addForm,
              api = `main/libMessageContentSave`
            tableData = JSON.parse(JSON.stringify(tableData))
            categoryId = categoryId.slice(0).pop()
            tableData.forEach(el => {
              el.categoryId = categoryId
            })
            if (vm.dialogOptions.title === '编辑站内信') {
              api = `main/libMessageContentUpdate`
              tableData = tableData[0]
            }
            return vm.$api[api](tableData)
              .then(data => {
                vm.dialogOptions.visible = false
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          })
        }
      },
      importDialogEvents: {
        close() {
          vm.notifyVm && vm.notifyVm.close()
        }
      },
      btns: [
        {
          name: '新增',
          fn: () => {
            vm.dialogOptions.title = '新增站内信'
            this.dialogOptions.visible = true
          }
        },
        {
          name: '导入',
          fn: () => {
            this.importDialogOptions.visible = true
          }
        },
        {
          name: '编辑',
          disabled: selection => {
            if (selection.length !== 1) {
              return true
            }
            return false
          },
          fn: () => {
            let data = vm.checked()
            vm.dialogOptions.title = '编辑站内信'
            vm.handleEdit(data[0].libMessageContentId)
          }
        },
        {
          name: '删除',
          fn: () => {
            let data = vm.checked()
            if (data) {
              vm.handleDel(
                data.map(el => ({
                  libMessageContentId: el.libMessageContentId
                }))
              )
            }
          }
        }
      ],
      edits: [
        {
          name: '编辑',
          show: scope => {
            return !scope.row.parentId
          },
          fn: (scope, item) => {
            vm.dialogOptions.title = '编辑站内信'
            vm.handleEdit(scope.row.libMessageContentId)
          }
        },
        {
          name: '删除',
          show: true,
          fn: (scope, item) => {
            //
            vm.handleDel([
              { libMessageContentId: scope.row.libMessageContentId }
            ])
          }
        }
      ],
      searchFields: {
        status: {
          label: '使用情况',
          widget: 'select',
          options: [
            {
              label: '未使用',
              value: 0
            },
            {
              label: '已使用',
              value: 1
            }
          ]
        }
      },
      columns: [
        {
          label: '内容1',
          value: 'firstContent'
        },
        {
          label: '内容2',
          value: 'secondContent'
        },
        {
          label: '内容3',
          value: 'thirdContent'
        },

        {
          label: '使用情况',
          value: 'status',
          render(h, scope) {
            return (
              <span class={!scope.row.status ? 'success' : 'danger'}>
                {!scope.row.status ? '未使用' : '已使用'}
              </span>
            )
          }
        },
        {
          label: '创建时间',
          value: 'createTime'
        }
      ]
    }
  },
  methods: {
    handleLeftBatchChange(val, sel) {
      val = val[0]
      if (val === '删除') {
        this.handleDel(
          sel.map(el => ({ libQuestionAnswerId: el.libQuestionAnswerId }))
        )
      }
    },
    handleFocus(scope, blur) {
      let i = scope.$index
      let tableData = this.addForm.tableData

      tableData.forEach((el, index) => {
        if (blur) {
          this.$set(el, '_rows', 1)
        } else {
          if (index !== i) {
            this.$set(el, '_rows', 1)
          } else {
            this.$set(el, '_rows', 5)
          }
        }
      })
    },
    downloadTemp() {
      this.$api[`main/libMessageContentExportTemplate`]({})
        .then(data => {
          download(data, '站内信导入模板.xls')
        })
        .catch(err => {})
    },
    handlePlus(scope) {
      this.addForm.tableData.splice(scope.$index + 1, 0, {})
    },
    handleMinus(scope) {
      this.addForm.tableData.splice(scope.$index, 1)
    },
    validator() {
      return validator.apply(null, arguments)
    },
    handleOnSuccess(res, file, fileList) {
      this.importWrapperLoading = false
      let { msg: message, code } = res
      if (code !== 0) {
        this.notifyVm = this.$notify({
          title: '上传失败',
          dangerouslyUseHTMLString: true,
          message,
          type: 'error',
          customClass: 'customErrorNotify',
          duration: 3000
        })
        return
      }
      this.$notify({
        title: '上传成功',
        dangerouslyUseHTMLString: true,
        message,
        duration: 3000,
        type: 'success'
      })
      this.importDialogOptions.visible = false
      this.$refs.lay.handleSearch()
    },
    handleOnError(err) {
      this.importWrapperLoading = false
      this.$message.error(err.message)
    },
    handleBeforeUpload(file) {
      this.importWrapperLoading = true
      return Promise.resolve()
    },
    handleEdit(libMessageContentId) {
      let vm = this
      vm.dialogOptions.visible = true
      vm.$nextTick(() => {
        this.$api[`main/libMessageContentInfo`]({ libMessageContentId })
          .then(data => {
            let { categoryMap } = data.rows
            vm.refresh = false
            vm.$nextTick(() => {
              vm.refresh = true
              vm.addForm = {
                categoryId: [
                  ...categoryMap[data.rows.categoryId],
                  data.rows.categoryId
                ],
                tableData: [data.rows]
              }
            })
          })
          .catch(err => {})
      })
    },
    handleDel(row) {
      let vm = this
      vm.$confirm('是否删除选中的站内信？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/libMessageContentRemove`](row)
            .then(data => {
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        })
        .catch(() => {})
    },
    checked(more = true) {
      let data = this.$refs.lay.getCheckedData()
      if (more && !data.length) {
        this.$message.warning('请选择数据进行操作')
        return
      }
      if (!more && data.length !== 1) {
        this.$message.warning('请选择一条数据进行操作')
        return
      }
      return this.$refs.lay.getCheckedData()
    },
    handleTreeCurrentChange(data, node) {
      this.$refs.lay.getList({ categoryId: data.categoryId })
    },
    handleClear() {
      this.$refs.lay.getList()
    }
  },
  beforeDestroy() {
    this.notifyVm = null
  }
}
</script>


<style lang='scss'>
.custom-upload {
  width: 100%;
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      width: 100%;
    }
  }
}
.img {
  width: 100%;
  max-height: 560px;
  img {
    width: 100%;
    max-height: 100%;
    max-width: 100%;
  }
}
.custom_from {
  .el-button--text {
    i {
      font-size: 18px;
    }
  }
  .btn {
    .el-button--text {
      padding: 2px 6px;
    }
    .el-button + .el-button {
      margin-left: 0;
    }
  }
}
</style>
<style lang="scss" scoped>
.table-form-item {
  margin-top: 18px;
  // margin-left: 18px;
  // margin-right: 18px;
}
</style>