<template>
  <div v-if="$route.name === 'AccountManagementIndex'">
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      :tableCols="tableCols"
      labelWidth="120px"
      editWidth="120px"
      :searchFunc="searchFunc"
      :cellClassNameFunc="cellClassNameFunc"
      :fixed="true"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <component :is="componentName" ref="add"></component>
    </yt-dialog>
    <yt-dialog :options="importDialogOptions" :events="importDialogEvents">
      <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
      <el-upload
        v-loading="importLoading"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
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
  <router-view v-else></router-view>
</template>

<script>
import mixins from '@/mixin'
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
import download from 'Utils/download'
import { mapState, mapActions } from 'vuex'
import Clipboard from 'clipboard'
import AccountHabit from './components/AccountHabit'
import AccountActiveTime from './components/AccountActiveTime'

const token = storage.get('local', 'token')

export default {
  components: { AccountHabit, AccountActiveTime },
  mixins: [mixins],
  data() {
    let vm = this
    return {
      importLoading: false,
      uploadConfig: {
        url: CONST_PORT_CONFIG.BASE_URL + 'TaskStatisticsSupplement/importData',
        headers: {
          token
        },
        data: {
          token
        }
      },
      importDialogOptions: {
        visible: false,
        title: '导入账号操作记录',
        width: '500px'
      },
      importDialogEvents: {
        close() {
          vm.notifyVm.close()
        },
        handleOkClick() {}
      },
      componentName: '',
      dialogOptions: {
        visible: false,
        title: '账号习惯',
        width: '900px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api,
            data = vm.$refs.add.getFormData()
          switch (vm.dialogOptions.title) {
            case '账号习惯':
              api = `accountChangeHabit`

              break

            default:
              break
          }

          return vm.$api[`main/${api}`](data)
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          vm.$nextTick(() => {
            // debugger
            vm.$refs.add.init(vm.editId)
          })

          // vm.$api[`main/ipPoolInfo`]({ ipPoolId: vm.editId })
          //   .then(data => {
          //     vm.$refs.add.setData(data.rows, true, true, () => {
          //     })
          //   })
          //   .catch(err => {})
        }
      },
      btns: [
        {
          name: '导入账号操作记录',
          disabled: selection => {
            // if (selection.length !== 1) {
            //   return true
            // }
            return false
          },
          fn: () => {
            // this.uploadConfig.data.accountId = this.checked(false)[0].accountId
            this.importDialogOptions.visible = true
          }
        },
        {
          name: '同步平台订单',
          fn: () => {
            this.$router.push({ name: 'AccountManagementSync' })
          }
        }
      ],
      edits: [
        {
          name: '任务截图',
          show: scope => {
            return (
              !!scope.row.snapshotImage &&
              (scope.row.expireDay == null || scope.row.expireDay <= 0)
            )
          },
          fn: (scope, item) => {
            vm.snapshotImage = scope.row.snapshotImage
            vm.snapshotImageOptions.visible = true
          }
        },
        {
          name: '统计',
          show: scope => {
            return scope.row.status == 1
          },
          fn: (scope, item) => {
            vm.$router.push({
              name: 'AccountManagementStatistic',
              params: { accountId: scope.row.accountId }
            })
          }
        }
      ],
      searchFields: [
        {
          name: 'platformSiteId',
          label: '平台站点',
          type: 'cascader',
          options: this.$store.state.platformSite
        },
        {
          name: 'merchantEmail',
          label: '商户邮箱'
        },
        {
          name: 'account',
          label: '账号'
        },
        {
          name: 'cardNum',
          label: '信用卡号码'
        },
        {
          name: 'status',
          label: '状态',
          type: 'select',
          options: [
            {
              label: '未激活',
              value: '0'
            },
            {
              label: '正常',
              value: '1'
            },
            {
              label: '暂停',
              value: '2'
            },
            {
              label: '激活中',
              value: '4'
            },
            {
              label: '终止',
              value: '3'
            }
          ]
        },
        // {
        //   name: 'accountType',
        //   label: '账号类型',
        //   type: 'select',
        //   options: [
        //     {
        //       label: '手动',
        //       value: '0'
        //     },
        //     {
        //       label: '自动',
        //       value: '1'
        //     }
        //   ]
        // },
        {
          name: 'registerDate',
          query: ['queryStartRegisterDate', 'queryEndRegisterDate'],
          label: '注册时间',
          type: 'dateRange',
          format: 'yyyy-MM-dd',
          required: false,
          span: 6
        },
        {
          name: 'expireStatus',
          label: '是否过期',
          type: 'select',
          options: [
            {
              label: '未过期',
              value: '0'
            },
            {
              label: '即将过期',
              value: '1'
            },
            {
              label: '已过期',
              value: '2'
            }
          ]
        },
        {
          name: 'primeMember',
          label: 'Prime会员',
          type: 'select',
          options: [
            {
              label: '是',
              value: '1'
            },
            {
              label: '否',
              value: '0'
            }
          ]
        },
        {
          name: 'exception',
          label: '账号异常反馈',
          type: 'select',
          options: [
            {
              label: '不能登录',
              value: '0'
            },
            {
              label: '不能评价',
              value: '1'
            },
            {
              label: '其它',
              value: '-1'
            }
          ]
        },
        {
          name: 'terminalType',
          label: '终端类型',
          type: 'select',
          options: [
            {
              label: '手机',
              value: '1'
            },
            {
              label: 'PC',
              value: '2'
            },
            {
              label: '虚拟机',
              value: '3'
            }
          ]
        },

        {
          name: 'terminalCode',
          label: '终端编号',
          type: 'input'
        },
        {
          name: 'recycleFlag',
          label: '回收产品',
          type: 'select',
          options: [
            {
              label: '能',
              value: '1'
            },
            {
              label: '不能',
              value: '0'
            }
          ]
        }
      ],
      addFields: [
        {
          type: 'checkbox',
          name: 'type',
          label: '是否已注册',
          span: 12,
          optionsFun: data => {
            let type = data && data.type
            let disabled =
              vm.dialogOptions.title === '编辑账号' &&
              type &&
              type.indexOf('2') > -1 &&
              data.status !== 0
            let options = [
              {
                label: '已在平台注册',
                value: '1',
                disabled
              },
              {
                label: '立即注册',
                value: '2',
                disabled
              }
            ]
            if (type && type.indexOf('1') > -1) {
              options = [
                {
                  label: '已在平台注册',
                  value: '1',
                  disabled
                }
              ]
            }
            return options
          }
        },
        {
          type: 'radio',
          name: 'accountType',
          label: '账号类型',
          required: true,
          disabled(data) {
            return data.status !== 0
          },
          span: 12,
          options: [
            {
              label: '手动',
              value: 0
            },
            {
              label: '自动',
              value: 1
            }
          ]
        },
        {
          label: '邮箱账号',
          required: 'email',
          disabled(data) {
            return data.status !== 0
          },
          onChange(item, val) {
            vm.$refs.add.formData.account = val
          },
          name: 'email',
          span: 12
        },
        {
          label: '邮箱密码',
          name: 'emailPassword',
          required: true,
          span: 12
        },
        {
          label: '平台账号',
          placeholder: '自动带入邮箱账号',
          name: 'account',
          disabled(data) {
            return true
          },
          span: 12
        },
        {
          label: '密码',
          name: 'password',
          requiredFun: data => {
            let type = data && data.type
            if (type && type.indexOf('1') > -1) {
              return true
            } else {
              return false
            }
          },
          span: 12
        },

        {
          label: '姓名',
          name: 'name',
          required: true,

          span: 12
        },
        {
          type: 'radio',
          name: 'sex',
          label: '性别',
          required: true,
          span: 12,
          options: [
            {
              label: '男',
              value: 0
            },
            {
              label: '女',
              value: 1
            }
          ]
        },
        {
          label: '出生日期',
          required: true,
          type: 'date',
          name: 'birthday',
          span: 12,
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 24 * 3600 * 1000
            }
          }
        },
        {
          label: '账号状态',
          required: true,
          disabled: false,
          name: 'status',
          span: 12,
          type: 'select',
          options: [
            {
              label: '未激活',
              value: 0
            },
            {
              label: '正常',
              value: 1
            },
            {
              label: '暂停',
              value: 2
            },
            {
              label: '终止',
              value: 3
            }
          ]
        },
        {
          label: '注册日期',
          required: true,
          hidden: data => {
            let type = data && data.type
            let _h = type && type.indexOf('1') > -1
            if (!_h) {
              vm.$set(data, 'registerDate', null)
            }
            return _h
          },
          name: 'registerDate',
          span: 12,
          type: 'date',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() > Date.now() - 24 * 3600 * 1000
            }
          }
        },
        {
          type: 'select',
          name: 'browserMode',
          label: '浏览器打开方式',
          required: true,
          disabled(data) {
            return data.status !== 0
          },
          span: 12,
          options: []
        },
        {
          type: 'select',
          name: 'primeMember',
          label: 'Prime会员',
          required: true,
          span: 12,
          options: vm.$const['OTHER/yesno']
        },
        {
          type: 'date',
          name: 'primeStartTime',
          label: 'Prime开始时间',
          hidden: data => {
            let primeMember = data && data.primeMember
            if (!primeMember) {
              vm.$set(data, 'primeStartTime', null)
              vm.$set(data, 'primeEndTime', null)
              // data.primeStartTime = ''
              // data.primeEndTime = ''
            }
            return primeMember
          },
          required: true,
          span: 12,
          pickerOptions: {
            disabledDate: time => {
              return time.getTime() < Date.now() - 24 * 3600 * 1000
            }
          }
        },
        {
          type: 'date',
          name: 'primeEndTime',
          label: 'Prime结束时间',
          required: true,
          span: 12,
          hidden: data => {
            let primeMember = data && data.primeMember
            if (!primeMember) {
              // data.primeStartTime = ''
              // data.primeEndTime = ''
              vm.$set(data, 'primeStartTime', null)
              vm.$set(data, 'primeEndTime', null)
            }
            return primeMember
          },
          pickerOptions: {
            disabledDate: time => {
              return (
                time.getTime() <
                new Date(this.$refs.add.formData.primeStartTime).getTime()
              )
            }
          }
        },
        {
          title: '收货人信息'
        },
        {
          label: '收货人姓名',
          required: true,
          name: 'consigneeName',
          span: 12
        },
        {
          label: '收货人手机',
          required: 'mobile',
          name: 'consigneePhone',
          span: 12
        },
        {
          label: '收货人邮箱',
          required: 'email',
          name: 'consigneeEmail',
          span: 12
        },
        {
          label: '收货人邮编',
          required: 'post',
          name: 'consigneeZipcode',
          span: 12
        },
        {
          label: '收货人国家',
          required: true,
          name: 'consigneeAddressCountry',
          span: 12
        },
        {
          label: '收货人州',
          required: true,
          name: 'consigneeAddressState',
          span: 12
        },
        {
          required: true,
          label: '收货人市',
          name: 'consigneeAddressCity',
          span: 12
        },
        {
          label: '收货人地址1',
          required: true,
          name: 'consigneeAddressStreet',
          span: 12
        },
        {
          label: '收货人地址2',
          required: false,
          name: 'consigneeAddressOther',
          span: 12
        },
        {
          label: '收货人类型',
          required: true,
          name: 'consigneeLocationType',
          span: 12,
          type: 'select',
          options: [{ label: '个人', value: 0 }, { label: '商户', value: 1 }]
        },
        {
          title: '信用卡'
        },
        {
          label: '信用卡号码',
          required: true,
          span: 12,
          name: 'cardNum',
          type: 'number',
          placeholder: '需为数字',
          controls: false
        },
        {
          label: '持卡人姓名',
          required: true,
          span: 12,
          name: 'cardHolder'
        },
        {
          label: '信用卡安全码',
          required: true,
          span: 12,

          name: 'cardSecurityCode'
        },
        {
          label: '信用卡有效期',
          required: true,
          type: 'date',

          span: 12,
          name: 'cardValidDate',
          pickerOptions: {
            disabledDate(time) {
              return time.getTime() < Date.now()
            }
          }
        },
        {
          label: '信用卡账单日',
          required: true,
          type: 'number',
          min: 1,
          max: 31,
          span: 12,
          placeholder: '请输入1-31的数字',
          name: 'cardBillingDate'
        },
        {
          label: '信用卡还款日',
          required: true,
          type: 'number',
          min: 1,
          max: 31,
          span: 12,
          placeholder: '请输入1-31的数字',
          name: 'cardRepaymentDate'
        },
        {
          add: '1-3',
          type: 'cascader',
          name: 'id',
          getEl: true,
          label: '类目',
          fixedScroll: true,
          options: this.loadTree,
          bind: {
            label: 'name',
            value: 'categoryId',
            children: 'childs',
            enabled: 'enabled'
          },
          required: true
        }
      ],
      tableCols: [
        {
          label: '商户邮箱',
          prop: 'email',
          width: 160
        },
        {
          label: '账号',
          prop: 'account',
          width: 160
        },
        {
          label: '平台账号名称',
          prop: 'name'
        },
        {
          label: '终端类型',
          prop: 'terminalType',
          render(h, scope) {
            let { terminalType } = scope.row
            return (
              <span>
                {terminalType == 1
                  ? '手机'
                  : terminalType == 2
                  ? 'PC'
                  : '虚拟机'}
              </span>
            )
          }
        },
        {
          label: '终端编号',
          prop: 'terminalCode',
          width: 90
        },

        // {
        //   label: 'IP',
        //   prop: 'ip',
        //   width: 140
        // },
        {
          label: '回收产品',
          prop: 'recycleFlag',
          width: 70,
          render(h, scope) {
            return <span>{scope.row.recycleFlag ? '能' : '不能'}</span>
          }
        },
        {
          label: '性别',
          prop: 'sex',
          width: 50,
          render(h, scope) {
            return <span>{scope.row.sex ? '女' : '男'}</span>
          }
        },
        {
          label: 'Prime开始/结束时间',
          width: 170,
          render(h, scope) {
            return (
              <span>
                {scope.row.primeStartTime
                  ? `${scope.row.primeStartTime} ~ ${scope.row.primeEndTime}`
                  : '-'}
              </span>
            )
          }
        },
        {
          label: '类目数',
          prop: 'categoryCount',
          width: 60,
          render(h, scope) {
            let { accountId } = scope.row
            const scopedSlots = {
              default: scope => (
                <el-button
                  type="text"
                  on-click={() => {
                    vm.$router.push({
                      path: '/AccountManagement/Throng',
                      query: { crowdName: scope.row.crowdName }
                    })
                  }}
                >
                  {scope.row.crowdName}
                </el-button>
              )
            }
            return (
              <el-popover
                placement="right"
                trigger="hover"
                open-delay={500}
                onShow={() => {
                  if (scope.row.cateList) {
                    return
                  }
                  // vm.$set(scope.row, 'cateList', null)
                  vm.$api[`main/accountListCategory`]({ accountId })
                    .then(data => {
                      vm.$set(scope.row, 'cateList', data)
                    })
                    .catch(err => {})
                }}
              >
                <div>
                  {scope.row.cateList ? (
                    <el-table border data={scope.row.cateList || []}>
                      <el-table-column
                        show-overflow-tooltip
                        min-width="150"
                        label="类目"
                        prop="name"
                      />
                      <el-table-column
                        min-width="100"
                        prop="crowdName"
                        label="人群"
                        scopedSlots={scopedSlots}
                      ></el-table-column>
                      <el-table-column
                        min-width="100"
                        label="习惯"
                        prop="habitName"
                      />
                    </el-table>
                  ) : (
                    <p>加载中...</p>
                  )}
                </div>
                <el-button type="text" slot="reference">
                  <b>{scope.row.categoryCount}</b>
                </el-button>
              </el-popover>
            )
          }
        },
        {
          label: '注册时间',
          prop: 'registerDate'
          // width: 90
        },
        {
          label: '到期时间',
          prop: 'expireTime',
          width: 140
        },
        {
          label: '账号状态',
          prop: 'status',
          // width: 60,
          render(h, scope) {
            let { status } = scope.row
            let statusStr
            if (status === 0) {
              statusStr = '未激活'
            }
            if (status === 1) {
              statusStr = '正常'
            }
            if (status === 2) {
              statusStr = '暂停'
            }
            if (status === 3) {
              statusStr = '终止'
            }
            if (status === 4) {
              statusStr = '激活中'
            }
            return <span>{statusStr}</span>
          }
        },
        {
          label: '账号异常反馈',
          width: 95,
          prop: 'exception',
          render(h, scope) {
            let { exception } = scope.row
            return (
              <span class="danger">
                {exception == 0 ? '不能登陆' : exception == 1 ? '不能评价' : ''}
              </span>
            )
          }
        },
        {
          label: '异常信息',
          prop: 'remark',
          minWidth: 158,
          render(h, scope) {
            return <span class="danger">{scope.row.remark}</span>
          }
        }
      ]
    }
  },
  computed: {
    accountNum() {
      if (
        this.activateFormData.ipCount != null &&
        this.activateFormData.effectiveTime != null
      ) {
        return (
          this.activateFormData.ipCount * this.activateFormData.effectiveTime
        )
      } else {
        return null
      }
    }
  },
  created() {
    this.$store.dispatch('getPlatformSite')
  },
  watch: {
    '$store.state.platformSite'(val) {
      this.searchFields[0].options = val
    }
  },
  methods: {
    searchFunc(data) {
      let { platformSiteId, ...rest } = data
      return { ...rest, platformSiteId: (platformSiteId || []).slice().pop() }
    },
    handleError() {
      this.importLoading = false
    },
    handleBeforeUpload() {
      return (this.importLoading = true)
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
    downloadTemp() {
      this.$api[`main/taskStatisticsSupplementExportTemplate`]({})
        .then(data => {
          download(data, '操作记录统计模板.xls')
        })
        .catch(err => {})
    },
    handleOnSuccess(res, file, fileList) {
      this.importLoading = false
      let { msg: message, code } = res
      if (code === 0) {
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
    cellClassNameFunc({ row, column, rowIndex, columnIndex }) {
      if (column.label === '到期时间' && row.expireTime) {
        if (row.expireDay > 0) {
          return 'expired'
        }
        if (row.expireDay >= -30 && row.expireDay <= 0) {
          return 'willExpire'
        }
      }
    },
    loadData(data) {
      return this.$api[`main/accountList`](data)
        .then(data => {
          return Promise.resolve(data)
        })
        .catch(err => {})
    },
    openComponent(name, title, id) {
      this.componentName = name
      this.openAdd(title, id)
    }
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
.ip {
  float: right;
  font-size: 14px;
}
</style>
