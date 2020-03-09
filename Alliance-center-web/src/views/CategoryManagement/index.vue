<template>
  <div style="height:100%">
    <main-layout
      :btns="btns"
      :tree="true"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      editWidth="200px"
      :tableCols="tableCols"
      :outerParams="outerParams"
      @treeCurrentChange="handleTreeCurrentChange"
      @clear="handleClear"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <!-- <SimpleForm label-width="120px" :fields="addFields" ref="add"/> -->
      <component v-if="dialogOptions.visible" :is="componentId" :title="dialogOptions.title" ref="add"></component>
      <!-- <Add v-if="dialogOptions.visible" ref="add"/> -->
    </yt-dialog>
    <yt-dialog :options="importDialogOptions" :events="importDialogEvents">
      <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
      <el-upload
        v-loading="importLoading"
        :on-error="handleError"
        class="custom-upload"
        :before-upload="handleBeforeUpload"
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
import mixin from '@/mixin'
import storage from 'Utils/saver'
import { mapActions, mapState } from 'vuex'
import CategoryCrowd from './CategoryCrowd'
import { CONST_PORT_CONFIG } from 'Config'
import download from 'Utils/download'

const token = storage.get('local', 'token')

export default {
  mixins: [mixin],
  components: {
    Add: () => import('./add.vue'),
    CategoryCrowd
  },
  data() {
    let vm = this
    return {
      importLoading: false,
      componentId: 'Add',
      listApi: 'categorySysList',
      outerParams: {
        level: 1,
        parentCategoryId: 0
      },
      uploadConfig: {
        url: CONST_PORT_CONFIG.BASE_URL + 'CategorySys/importData',
        headers: {
          token
        },
        data: {
          token
        }
      },
      importDialogOptions: {
        visible: false,
        title: '导入类目',
        width: '500px'
      },
      importDialogEvents: {
        close() {
          vm.notifyVm && vm.notifyVm.close()
        },
        handleOkClick() {}
      },
      dialogOptions: {
        visible: false,
        title: '新增类目',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let add = vm.$refs.add
          let data = add.addData
          let editTitle = ['编辑类目', '人群设置']
          let api =
            editTitle.indexOf(vm.dialogOptions.title) > -1
              ? `categorySysUpdaye`
              : 'categorySysSave'
          let level, cateId
          let {
            parentCategoryId,
            categorySysSiteMappingArray,
            categoryName,
            lastLevel,
            categorySysId
          } = data
          return add.validate().then(() => {
            let hasCate = categorySysSiteMappingArray.filter(
              el => el.platformSiteId && el.platformSiteId.length > 0
            )
            if (!parentCategoryId || !parentCategoryId.length) {
              parentCategoryId = 0
              level = 1
            } else {
              level = parentCategoryId.length + 1
              parentCategoryId = parentCategoryId.slice(0).pop()
            }
            if (
              categorySysSiteMappingArray &&
              hasCate.length &&
              data.lastLevel == 1
            ) {
              categorySysSiteMappingArray = hasCate.map(el => ({
                categoryId: el.categoryId && el.categoryId.slice(0).pop(),
                platformSiteId:
                  el.platformSiteId && el.platformSiteId.slice(0).pop()
              }))
            } else {
              categorySysSiteMappingArray = null
            }

            return vm.$refs.add.validate().then(() => {
              let categorySysCrowdArray =
                vm.$refs.add.$refs.crowd.addData.categorySysCrowdArray
              let vali = true,
                flag = true,
                i = 0,
                total,
                t = true
              if (categorySysCrowdArray) {
                categorySysCrowdArray.forEach((el, index) => {
                  if (el.crowdId != null && el.rate == null) {
                    vali = false
                    return false
                  }
                  if (el.crowdId == null && el.rate != null) {
                    vali = false
                    return false
                  }
                  if (el.crowdId == null && el.rate == null) {
                    i++
                  }
                })
                // debugger
                if (i === categorySysCrowdArray.length) {
                  flag = false
                }
                if (categorySysCrowdArray.every(el => el.rate != null)) {
                  total = categorySysCrowdArray.reduce((total, cur) => {
                    return total + cur.rate
                  }, 0)
                  if (total !== 100) {
                    t = false
                  }
                }
              }
              if (!vali) {
                return Promise.reject('请填写完整的类目人群信息')
              }
              if (!t) {
                return Promise.reject('人群占比和必须为100%')
              }

              if (!flag) {
                categorySysCrowdArray = null
              }

              return vm.$api[`main/${api}`]({
                ...data,
                parentCategoryId,
                categorySysSiteMappingArray: lastLevel
                  ? categorySysSiteMappingArray
                  : [],
                categorySysCrowdArray: categorySysCrowdArray,
                categoryName,
                categorySysId: categorySysId
                  ? categorySysId.slice(0).pop()
                  : null,
                level
              })
                .then(data => {
                  vm.dialogOptions.visible = false
                  vm.$refs.lay.handleSearch()
                  // 重新获取类目
                  vm.$refs.lay.refreshTree()
                })
                .catch(err => {})
            })
          })
        },
        handleOpen() {
          if (vm.dialogOptions.title === '新增系统类目') {
            return
          }
          vm.$api[`main/categorySysInfo`]({ categorySysId: vm.editId })
            .then(data => {
              let {
                categorySysMap,
                categorySysId,
                categoryMap,
                parentCategoryId,
                ...info
              } = data.rows
              if (categorySysMap) {
                let arr = categorySysMap[categorySysId] || []
                categorySysId = arr.concat([categorySysId])
              } else {
                categorySysId = [categorySysId]
              }
              if (parentCategoryId) {
                let arr = categorySysMap[categorySysId] || []
                parentCategoryId = arr.concat([parentCategoryId])
              } else {
                parentCategoryId = [parentCategoryId]
              }
              setTimeout(() => {
                vm.$nextTick(() => {
                  vm.$refs.add.setData({
                    ...info,
                    categorySysId,
                    parentCategoryId
                  })
                })
              })
            })
            .catch(err => {})
        }
      },
      btns: [
        {
          name: '新增',
          fn() {
            vm.componentId = 'Add'
            vm.openAdd('新增系统类目')
          }
        },
        {
          name: '导入',
          fn() {
            vm.importDialogOptions.visible = true
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
          fn() {
            vm.componentId = 'Add'
            vm.edit()
          }
        },
        {
          name: '删除',
          type: 'danger',
          disabled: selection => {
            if (!selection.length) {
              return true
            }
            return false
          },
          fn() {
            vm.del()
          }
        }
      ],
      edits: [
        // {
        //   name: '人群设置',
        //   show: scope => {
        //     return true
        //   },
        //   fn: (scope, item) => {
        //     vm.componentId = 'CategoryCrowd'
        //     vm.openAdd('人群设置', scope.row.categorySysId)
        //   }
        // },
        {
          name: '编辑',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.componentId = 'Add'
            vm.edit(scope.row)
          }
        },
        {
          name: '删除',
          show: scope => {
            return true
          },
          fn: (scope, item) => {
            vm.del(scope.row)
          }
        }
      ],
      searchFields: [
        {
          label: '类目名称',
          name: 'categoryName'
        }
      ],
      tableCols: [
        {
          label: '类目',
          prop: 'categoryName',
          expand: true,
          expandAll: true,
          asyncFunc: row => {
            let { level, categorySysId } = row
            return this.$api[`main/categorySysList`]({
              level: ++level,
              parentCategoryId: categorySysId
            })
          }
        },
        {
          label: '上级类目',
          prop: 'parentCategoryName'
        },
        {
          label: '层级',
          prop: 'level',
          minWidth: 120
        },
        {
          label: '人群',
          prop: 'crowdName',
          minWidth: 140
        }
      ]
    }
  },
  computed: {
    ...mapState(['platformSite']),
    addFields() {
      return [
        {
          name: 'merchantNo',
          label: '类目编号',
          span: 12,
          disabled: true,
          required: true
        },
        {
          name: 'superFlag',
          label: '超级类目',
          span: 12,
          required: true,
          type: 'radio',
          options: [
            {
              label: '是',
              value: 1
            },
            {
              label: '否',
              value: 0
            }
          ]
        },
        {
          name: 'merchantName',
          label: '类目名称',
          span: 12,
          required: true
        },
        {
          name: 'username',
          label: '登录账号',
          span: 12,
          hidden: data => {
            return data.categorySysId
          },
          disabled: true
          // required: true
        },
        {
          name: 'email',
          label: '类目邮箱',
          span: 12,
          required: 'email'
        },
        {
          name: 'mobile',
          label: '手机号码',
          span: 12,
          required: 'mobile'
        },
        {
          name: 'status',
          label: '类目状态',
          hidden: data => {
            return data.categorySysId
          },
          span: 12,
          type: 'select',
          disabled: data => {
            return data.status === 0 && !!data.categorySysId
          },
          options: [
            {
              label: '待激活',
              value: 0
            },
            {
              label: '正常',
              value: 1
            },
            {
              label: '终止',
              value: 2
            }
          ],
          required: true
        },
        {
          name: 'effectiveTime',
          label: '有效天数',
          span: 12,
          hidden: data => {
            return data.categorySysId
          },
          disabled: true
          // required: true
        },
        {
          name: 'activateDate',
          label: '激活时间',
          span: 12,
          hidden: data => {
            return data.categorySysId
          },
          disabled: true
          // required: true
        },
        {
          name: 'expiryDate',
          label: '到期时间',
          span: 12,
          hidden: data => {
            return data.categorySysId
          },
          disabled: data => {
            return true
          }
          // required: true
        },
        {
          name: 'remark',
          label: '备注',
          type: 'textarea',
          span: 24,
          rows: 5
          // required: true
        },
        // {
        //   add: '1-',
        //   type: 'select',
        //   name: 'platformSiteArray',
        //   label: '开通站点',
        //   fixedScroll: true,
        //   options: this.platformSite,
        //   required: true
        // }
        {
          add: '1-',
          type: 'cascader',
          name: 'platformSiteArray',
          label: '开通站点',
          fixedScroll: true,
          options: this.platformSite,
          required: true
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getPlatformSite']),
    downloadTemp() {
      this.$api[`main/categorySysExportTemplate`]({})
        .then(data => {
          download(data, '类目导入模板.xls')
        })
        .catch(err => {})
    },
    handleError() {
      this.importLoading = false
    },
    handleBeforeUpload() {
      return (this.importLoading = true)
    },
    handleOnSuccess(res, file, fileList) {
      this.importLoading = false
      let { msg: message, code } = res
      if (code === 0) {
        this.$refs.lay.refreshTree()
        this.$notify({
          title: '上传成功',
          dangerouslyUseHTMLString: true,
          message,
          duration: 3000,
          type: 'success'
        })
        this.importDialogOptions.visible = false
        this.$refs.lay.reset()
      } else {
        this.notifyVm = this.$notify({
          title: '上传失败',
          dangerouslyUseHTMLString: true,
          message,
          type: 'error',
          customClass: 'customErrorNotify',
          duration: 3000
        })
      }
    },
    // 侧边栏类目树获取
    _loadNode(node) {
      let { data } = node,
        params

      if (data) {
        params = {
          level: data.level + 1,
          parentCategoryId: data.categorySysId
        }
      } else {
        params = {
          level: 1,
          parentCategoryId: 0
        }
      }

      return this.$api[`main/categorySysDropdownListHasParent`](params)
      // return Promise.resolve([
      //   {
      //     categoryId: 6,
      //     categoryMap: null,
      //     parentId: 5,
      //     name: '类目2:类目2.1:类目2.1.1',
      //     parentName: '类目2:类目2.1',
      //     hasChild: false,
      //     level: 3
      //   }
      // ])
    },
    handleClear() {
      this.outerParams = {
        level: 1,
        parentCategoryId: 0
      }
      this.$nextTick(() => {
        this.$refs.lay.handleSearch()
      })
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
      let { categorySysId, level } = data
      this.outerParams = {
        level: ++level,
        parentCategoryId: categorySysId
      }
      this.$nextTick(() => {
        this.$refs.lay.handleSearch()
      })
    },
    editItem(row, type) {
      let vm = this
      switch (type) {
        // 激活 中止 续期 重置密码
        case 1:
          this.activeOpts.visible = true
          this.activeOpts.title = '激活类目'
          this.categorySysId = row.categorySysId
          break
        case 2:
          this.$.showWarning(
            `终止后，类目账号将不能再继续登录系统，请确认！`,
            () => {
              this.$api[`main/merchantTermination`]({
                categorySysId: row.categorySysId
              }).then(data => {
                vm.$refs.lay.handleSearch()
              })
            }
          )
          break
        case 3:
          this.activeOpts.visible = true
          this.activeOpts.title = '类目续期'
          this.categorySysId = row.categorySysId
          break
        case 4:
          this.$.showWarning(`重置后，新密码将发送到类目邮箱，请确认！`, () => {
            this.$api[`main/merchantResetPassword`]({
              categorySysId: row.categorySysId
            })
              .then(data => {
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          })
          break

        default:
          break
      }
    },
    edit(row) {
      if (row) {
        // vm.componentId = 'Add'
        this.openAdd('编辑类目', row.categorySysId)
      } else {
        let data = this.checked(false)
        if (data) {
          // vm.componentId = 'Add'
          this.openAdd('编辑类目', data[0].categorySysId)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此类目？',
          'categorySysRemove',
          'categorySysId'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除此类目？',
            'categorySysRemove',
            'categorySysId'
          )
        }
      }
    }
  }
}
</script>

<style>
</style>
