<template>
  <div>
    <main-layout
      :btns="btns"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      :tableCols="tableCols"
      @clear="handleClear"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <el-form ref="addForm" class="custom_from" label-width="100px" size="mini" :model="addForm">
        <el-form-item label="类目" prop="categoryId" :rules="validator(true, '类目')">
          <SyncCascader v-if="refresh" v-model="addForm.categoryId" :load="loadTree" :props="treeProps"/>
        </el-form-item>
        <el-table :data="addForm.tableData">
          <el-table-column header-align="center" label="标题" min-width="200px">
            <template slot-scope="scope">
              <el-form-item
                label-width="0"
                :prop="`tableData.${scope.$index}.title`"
                :rules="validator(true, '标题')"
                class="table-form-item"
              >
                <el-input
                  type="textarea"
                  v-model="scope.row.title"
                  @focus="handleFocus(scope)"
                  @blur="handleFocus(scope, true)"
                  :rows="scope.row._rows || 1"
                  placeholder
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="内容" min-width="200px">
            <template slot-scope="scope">
              <el-form-item
                label-width="0"
                :prop="`tableData.${scope.$index}.content`"
                :rules="validator(true, '内容')"
                class="table-form-item"
              >
                <el-input
                  @focus="handleFocus(scope)"
                  @blur="handleFocus(scope, true)"
                  :rows="scope.row._rows || 1"
                  v-model="scope.row.content"
                  type="textarea"
                  placeholder
                ></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="舒适度">
            <template slot-scope="scope">
              <el-form-item label-width="0" class="table-form-item">
                <el-select v-model="scope.row.fit" clearable placeholder>
                  <el-option
                    v-for="item in $const['OTHER/productFit']"
                    :label="item.label"
                    :value="item.value"
                    :key="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column header-align="center" label="评分">
            <template slot-scope="scope">
              <el-form-item
                label-width="0"
                :prop="`tableData.${scope.$index}.evaluateScope`"
                :rules="validator(true, '评分')"
                class="table-form-item"
              >
                <el-select v-model="scope.row.evaluateScope">
                  <el-option
                    v-for="item in $const['OTHER/star']"
                    :label="item.label"
                    :value="item.label"
                    :key="item.label"
                  >
                    <el-rate :value="item.label" disabled></el-rate>
                  </el-option>
                </el-select>
                <!-- <el-input v-model="scope.row.evaluateScope" placeholder></el-input> -->
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-if="dialogOptions.title==='新增评价'" width="80">
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
    <yt-dialog :options="importDialogOptions" :events="importDialogEvents">
      <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
      <el-upload
        class="custom-upload"
        :action="uploadConfig.url"
        :headers="uploadConfig.headers"
        :data="uploadConfig.data"
        :show-file-list="false"
        :on-success="handleOnSuccess"
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
      refresh: true,
      treeProps: {
        label: 'name',
        value: 'categoryId',
        children: 'childs',
        enabled: 'enabled'
      },
      addForm: { tableData: [{}] },
      uploadConfig: {
        url: CONST_PORT_CONFIG.BASE_URL + 'LibEvaluate/importData',
        headers: {
          token
        },
        data: {
          token
        }
      },
      dialogOptions: {
        visible: false,
        title: '新增评价',
        width: '1100px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      importDialogOptions: {
        visible: false,
        title: '导入评价',
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
              api = `main/libEvaluateSave`
            tableData = JSON.parse(JSON.stringify(tableData))
            categoryId = categoryId.slice(0).pop()
            tableData.forEach(el => {
              el.categoryId = categoryId
            })
            if (vm.dialogOptions.title === '编辑评价') {
              api = `main/libEvaluateUpdate`
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
        },
        handleOkClick() {
          // // TODO:
          // return vm.$api[`main/categorySave`]({})
          //   .then(data => {
          //     vm.dialogOptions.visible = false
          //     vm.$refs.lay.handleSearch()
          //   })
          //   .catch(err => {})
        }
      },
      btns: [
        {
          name: '新增',
          fn: () => {
            vm.dialogOptions.title = '新增评价'
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
            vm.dialogOptions.title = '编辑评价'
            vm.handleEdit(data[0].libEvaluateId)
          }
        },
        {
          name: '删除',
          fn: () => {
            let data = vm.checked()
            if (data) {
              vm.handleDel(
                data.map(el => ({ libEvaluateId: el.libEvaluateId }))
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
            vm.dialogOptions.title = '编辑评价'
            vm.handleEdit(scope.row.libEvaluateId)
          }
        },
        {
          name: '删除',
          show: true,
          fn: (scope, item) => {
            //
            vm.handleDel([{ libEvaluateId: scope.row.libEvaluateId }])
          }
        }
      ],
      searchFields: [
        {
          name: 'evaluateScope',
          label: '评分',
          type: 'select',
          options: [
            {
              label: 1,
              value: 1
            },
            {
              label: 2,
              value: 2
            },
            {
              label: 3,
              value: 3
            },
            {
              label: 4,
              value: 4
            },
            {
              label: 5,
              value: 5
            }
          ]
        },
        {
          name: 'status',
          label: '使用情况',
          type: 'select',
          options: [
            {
              label: '未使用',
              value: '0'
            },
            {
              label: '已使用',
              value: '1'
            }
          ]
        }
      ],

      tableCols: [
        {
          label: '标题',
          prop: 'title'
        },
        {
          label: '内容',
          prop: 'content',
          wrap: true,
          width: 300
        },
        {
          label: '评分',
          prop: 'evaluateScope',
          render(h, scope) {
            return (
              <el-rate
                disabled
                show-score
                value={scope.row.evaluateScope}
                colors={['#99A9BF', '#F7BA2A', '#FF9900']}
              />
            )
          }
        },
        {
          label: '舒适度',
          prop: 'fit',
          render(h, scope) {
            let { fit } = scope.row
            let list = vm.$const[`OTHER/productFit`]
            let el = list.find(el => el.value === fit + '')
            return <span>{el ? el.label : '-'}</span>
          }
        },
        {
          label: '使用情况',
          prop: 'status',
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
          prop: 'createTime'
        }
      ]
    }
  },
  methods: {
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
      this.$api[`main/libEvaluateExportTemplate`]({})
        .then(data => {
          download(data, '评价导入模板.xls')
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
      let { msg: message, code } = res
      if (code !== 0) {
        // this.$message.error(message)
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
    handleEdit(libEvaluateId) {
      let vm = this
      vm.dialogOptions.visible = true
      vm.$nextTick(() => {
        this.$api[`main/libEvaluateInfo`]({ libEvaluateId })
          .then(data => {
            let { categoryMap, fit } = data.rows
            vm.refresh = false
            vm.$nextTick(() => {
              vm.refresh = true
              vm.addForm = {
                categoryId: [
                  ...categoryMap[data.rows.categoryId],
                  data.rows.categoryId
                ],
                tableData: [{ ...data.rows, fit: fit ? fit + '' : null }]
              }
            })
          })
          .catch(err => {})
      })
    },
    handleDel(row) {
      let vm = this
      vm.$confirm('是否删除选中的评价？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/libEvaluateRemove`](row)
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
    loadData(data) {
      return this.$api[`main/libEvaluateList`](data)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
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
</style>
<style lang="scss">
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