<template>
  <div>
    <main-layout
      :btns="btns"
      :sideBar="false"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      ref="lay"
      editWidth="200px"
      :tableCols="tableCols"
      @treeCurrentChange="handleTreeCurrentChange"
    ></main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm
        label-width="140px"
        :fields="addFields"
        @datachange="datachange"
        :defaultData="{safetyRangeFlag: [1]}"
        ref="add"
      />
    </yt-dialog>
    <yt-dialog :options="activeOpts" :events="activeEvents">
      <SimpleForm label-width="120px" :fields="activeFields" ref="add" />
    </yt-dialog>
  </div>
</template>

<script>
import mixin from '@/mixin'
import { mapActions, mapState } from 'vuex'

export default {
  mixins: [mixin],
  data() {
    let vm = this
    return {
      formData: {},
      listApi: 'merchantList',
      dialogOptions: {
        visible: false,
        title: '新增商户',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let api =
            vm.dialogOptions.title === '新增商户'
              ? `main/merchantSave`
              : `main/merchantUpdate`
          let data = vm.$refs.add.formData
          let { platformSiteArray, safetyRangeFlag, ...info } = data
          platformSiteArray = platformSiteArray.map(el => el[1])
          return vm.$api[api]({
            platformSiteArray,
            safetyRangeFlag: safetyRangeFlag[0],
            ...info
          }).then(data => {
            vm.dialogOptions.visible = false
            vm.$refs.lay.handleSearch()
          })
        },
        async handleOpen() {
          // debugger
          if (!vm.platformSite1.length) {
            vm.getPlatformSite()
          }
          if (vm.dialogOptions.title === '新增商户') {
            // 获取商户编码
            let code,
              timer = null
            try {
              code = await vm.getCode()
              clearInterval(timer)
            } catch (error) {
              clearInterval(timer)
              timer = setInterval(async () => {
                code = await vm.getCode()
              }, 3000)
            }
            console.log('获取商户编码', code)
            vm.$refs.add.setData({ merchantNo: code })
            return
          }
          vm.$api[`main/merchantInfo`]({ merchantId: vm.editId })
            .then(data => {
              let {
                platformSiteArray,
                platformSiteMap,
                safetyRangeFlag,
                ...info
              } = data.rows
              let _platformSiteArray = []
              for (const key in platformSiteMap) {
                if (platformSiteMap.hasOwnProperty(key)) {
                  const element = platformSiteMap[key]
                  _platformSiteArray.push(
                    Array.of(element[0].toLowerCase(), +key)
                  )
                }
              }

              console.log(_platformSiteArray)

              vm.$refs.add.setData({
                platformSiteArray: _platformSiteArray,
                safetyRangeFlag: safetyRangeFlag ? [1] : [],
                ...info
              })
            })
            .catch(err => {})
        }
      },
      activeOpts: {
        visible: false,
        title: '激活商户',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      activeEvents: {
        handleOkClick() {
          let api =
            vm.activeOpts.title === '激活商户'
              ? `merchantActivate`
              : `merchantRenew`
          let data = vm.$refs.add.formData
          let { platformSiteArray, ...info } = data
          platformSiteArray = platformSiteArray.map(el => el[1])
          vm.$api[`main/${api}`]({ platformSiteArray, ...info })
            .then(data => {
              vm.activeOpts.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        },
        handleOpen() {
          vm.$api[`main/merchantInfo`]({ merchantId: vm.merchantId })
            .then(data => {
              let {
                platformSiteArray,
                platformSiteMap,
                merchantNo,
                merchantName,
                username,
                email,
                merchantId
              } = data.rows
              let _platformSiteArray = []
              for (const key in platformSiteMap) {
                if (platformSiteMap.hasOwnProperty(key)) {
                  const element = platformSiteMap[key]
                  _platformSiteArray.push(
                    Array.of(vm.$.firstCase(element[0]), +key)
                  )
                }
              }

              // debugger

              vm.$refs.add.setData({
                platformSiteArray: _platformSiteArray,
                merchantNo,
                merchantName,
                username: email,
                merchantId
              })
            })
            .catch(err => {})
        }
      },
      activeFields: [
        {
          label: '商户编号',
          name: 'merchantNo',
          span: 24,
          disabled: true,
          required: true
        },
        {
          label: '登录账号',
          name: 'username',
          span: 24,
          disabled: true,
          required: true
        }
        // {
        //   label: '有效月份',
        //   name: 'effectiveTime',
        //   span: 24,
        //   type: 'number',
        //   precision: 0,
        //   min: 1,
        //   required: true
        // }
      ],
      btns: [
        {
          name: '新增',
          fn() {
            vm.openAdd('新增商户')
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
        {
          name: '激活',
          show: scope => {
            return scope.row.status === 0 || scope.row.status === 2
          },
          fn: (scope, item) => {
            vm.editItem(scope.row, 1)
          }
        },
        {
          name: '启用',
          show: scope => {
            return scope.row.status === 3
          },
          fn: (scope, item) => {
            // vm.editItem(scope.row, 1)
            this.$api[`main/merchantNo`]({ merchantId: scope.row.merchantId })
              .then(data => {
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          }
        },
        {
          name: '暂停',
          show: scope => {
            return scope.row.status === 1
          },
          fn: (scope, item) => {
            // vm.editItem(scope.row, 1)
            this.$api[`main/merchantOff`]({ merchantId: scope.row.merchantId })
              .then(data => {
                vm.$refs.lay.handleSearch()
              })
              .catch(err => {})
          }
        },
        {
          name: '终止',
          show: scope => {
            return scope.row.status === 1
          },
          fn: (scope, item) => {
            vm.editItem(scope.row, 2)
          }
        },
        {
          name: '续期',
          show: scope => {
            return scope.row.status === 1
          },
          fn: (scope, item) => {
            vm.editItem(scope.row, 3)
          }
        },
        {
          name: '重置密码',
          show: scope => {
            return scope.row.status === 1
          },
          fn: (scope, item) => {
            vm.editItem(scope.row, 4)
          }
        }
      ],
      searchFields: [
        {
          label: '商户编号',
          name: 'merchantNo'
        },
        {
          label: '商户邮箱',
          name: 'email'
        },
        {
          label: '手机号码',
          name: 'mobile'
        },
        {
          label: '商户状态',
          name: 'status',
          type: 'select',

          options: [
            // 0-待激活，1-正常，2-终止
            {
              label: '未激活',
              value: '0'
            },
            {
              label: '正常',
              value: '1'
            },
            {
              label: '终止',
              value: '2'
            },
            {
              label: '暂停',
              value: '3'
            }
          ]
        },
        {
          name: 'oweIpFlag',
          label: '是否缺少IP',
          type: 'select',
          options: [{ label: '是', value: '1' }, { label: '否', value: '0' }]
        },
        {
          name: 'type',
          label: '商户类型',
          type: 'select',
          options: [
            { label: '商户', value: '1' },
            { label: '商户代理', value: '0' }
          ]
        }
      ],
      tableCols: [
        {
          label: '商户编号',
          prop: 'merchantNo',
          width: 100
        },
        {
          label: '商户类型',
          prop: 'type',
          width: 90,
          render(h, scope) {
            const { type } = scope.row
            return <span>{type == 0 ? '商户代理' : '商户'}</span>
          }
        },
        // {
        //   label: '登录账号',
        //   prop: 'username',
        //   minWidth: 120
        // },
        {
          label: '商户邮箱',
          prop: 'email',
          minWidth: 140
        },
        {
          label: '手机号码',
          prop: 'mobile',
          width: 120
        },
        {
          label: '折扣',
          prop: 'discount',
          width: 55,
          render(h, scope) {
            const { discount } = scope.row
            return <span>{discount ? discount + '%' : '-'}</span>
          }
        },
        {
          label: 'PC账号优先级',
          prop: 'priorityFlag',
          width: 105,
          render(h, scope) {
            const { priorityFlag } = scope.row
            return <span>{priorityFlag ? 'PC优先' : '虚拟机优先'}</span>
          }
        },
        {
          label: '推荐人邮箱',
          prop: 'referrerEmail',
          minWidth: 140
        },
        {
          label: '开通站点',
          prop: 'platformSiteCount',
          render(h, scope) {
            let {
              merchantId,
              platformSiteCount,
              show,
              loading,
              list
            } = scope.row
            return platformSiteCount ? (
              <el-popover
                placement="right"
                trigger="hover"
                open-delay={400}
                onShow={() => {
                  if (!show) {
                    if (!list) {
                      vm.$set(scope.row, 'loading', true)
                      vm.$api[`main/merchantListPlatformSite`]({ merchantId })
                        .then(data => {
                          scope.row.loading = false
                          vm.$set(scope.row, 'show', !show)
                          vm.$set(scope.row, 'list', data)
                        })
                        .catch(err => {
                          scope.row.loading = false
                        })
                      return
                    }
                  }
                  vm.$set(scope.row, 'show', !show)
                }}
              >
                <div>
                  {list &&
                    list.map(el => (
                      <p style="margin:4px 0">
                        {el.platformSiteName} ({el.platformSiteCode})
                      </p>
                    ))}
                </div>
                <el-button slot="reference" loading={loading} type="text">
                  {platformSiteCount}
                </el-button>
              </el-popover>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '缺少IP总数',
          prop: 'ipCount',
          render(h, scope) {
            let { ipCount } = scope.row
            return ipCount != null ? (
              <span class="danger">{ipCount}</span>
            ) : (
              <span>-</span>
            )
          }
        },
        {
          label: '超级商户',
          prop: 'superFlag',
          render(h, scope) {
            let { superFlag } = scope.row
            if (superFlag == null) {
              return <span>-</span>
            }
            return (
              <span class={superFlag ? 'success' : 'danger'}>
                {superFlag ? '是' : '否'}
              </span>
            )
          }
        },
        {
          label: '商户状态',
          prop: 'status',
          render(h, scope) {
            let { status } = scope.row
            // if (!status) {
            //   return <span>-</span>
            // }
            if (status == 0) {
              return <span>未激活</span>
            }
            if (status == 1) {
              return <span class="success">正常</span>
            }
            if (status == 2) {
              return <span class="danger">终止</span>
            }
            if (status == 3) {
              return <span style="opacity: 0.5">暂停</span>
            }
          }
        },

        {
          prop: 'taskMaxNum',
          width: 120,
          label: '每周可发布任务数'
        },
        {
          prop: 'remark',
          minWidth: 100,

          label: '备注'
        },
        {
          label: '激活时间',
          prop: 'activateDate'
        },
        {
          label: '到期时间',
          prop: 'expiryDate'
        }
        // {
        //   label: '备注',
        //   prop: 'remark'
        // }
      ]
    }
  },
  computed: {
    ...mapState(['platformSite1']),
    addFields() {
      let vm = this
      return [
        {
          name: 'merchantNo',
          label: '商户编号',
          span: 24,
          width: '40%',
          disabled: true,
          required: true
        },
        {
          label: '商户类型',
          name: 'type',
          required: true,
          span: 12,
          type: 'radio',
          options: [
            {
              label: '代理商户',
              value: 0
            },
            {
              label: '商户',
              value: 1
            }
          ]
        },

        {
          name: 'superFlag',
          label: '超级商户',
          span: 12,
          disabled: vm.formData.type == 1,
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
        // {
        //   name: 'username',
        //   label: '登录账号',
        //   span: 12,
        //   hidden: data => {
        //     return data.merchantId
        //   },
        //   disabled: true
        //   // required: true
        // },
        {
          name: 'discount',
          type: 'currency',
          label: '折扣',
          span: 12,
          suffix: '%',
          min: 0,
          max: 100,
          required: true
        },
        {
          name: 'priorityFlag',
          label: 'PC账号优先级',
          span: 12,
          required: true,
          type: 'select',
          options: [
            {
              label: 'PC优先',
              value: 1
            },
            {
              label: '虚拟机优先',
              value: 0
            }
          ]
        },
        {
          name: 'email',
          label: '商户邮箱',
          span: 12,
          required: 'email'
        },
        {
          name: 'mobile',
          label: '手机号码',
          span: 12,
          required: true
        },
        {
          name: 'status',
          label: '商户状态',
          hidden: data => {
            return data.merchantId
          },
          span: 12,
          type: 'select',
          disabled: data => {
            return !!data.merchantId
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
          min: 1,
          max: 100,
          span: 12,
          hidden: data => {
            return data.merchantId
          },
          disabled: true
          // required: true
        },
        {
          name: 'activateDate',
          label: '激活时间',
          span: 12,
          hidden: data => {
            return data.merchantId
          },
          disabled: true
          // required: true
        },
        {
          name: 'expiryDate',
          label: '到期时间',
          span: 12,
          hidden: data => {
            return data.merchantId
          },
          disabled: data => {
            return true
          }
          // required: true
        },
        {
          name: 'taskMaxNum',
          label: '每周可发布任务数',
          span: 8,
          type: 'number',
          precision: 0,
          min: 0,
          requiredFun(data) {
            return !(data.safetyRangeFlag && !!data.safetyRangeFlag[0])
          },
          disabled: data => {
            return !!(data.safetyRangeFlag && !!data.safetyRangeFlag[0])
          }
          // required: true
        },
        {
          name: 'safetyRangeFlag',
          labelWidth: '15px',

          // onChange(item, val, data) {
          //   // console.log(item, val, data)
          //   if (val[0] == 1) {
          //     data.taskMaxNum = undefined
          //   }
          // },
          span: 4,
          type: 'checkbox',
          options: [
            {
              label: '同安全范围',
              value: 1
            }
          ]
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
          options: this.platformSite1,
          required: true
        }
      ]
    }
  },
  methods: {
    ...mapActions(['getPlatformSite']),
    datachange(val) {
      this.formData = val
      if (val.type == 1) {
        this.$set(val, 'superFlag', 0)
      } else {
        // this.$set(val, 'superFlag', null)
      }
    },
    handleTreeCurrentChange(data, node) {
      console.log(data, node)
    },
    editItem(row, type) {
      let vm = this
      switch (type) {
        // 激活 中止 续期 重置密码
        case 1:
          this.activeOpts.visible = true
          this.activeOpts.title = '激活商户'
          this.merchantId = row.merchantId
          break
        case 2:
          this.$.showWarning(
            `终止后，商户账号将不能再继续登录系统，请确认！`,
            () => {
              this.$api[`main/merchantTermination`]({
                merchantId: row.merchantId
              }).then(data => {
                vm.$refs.lay.handleSearch()
              })
            }
          )
          break
        case 3:
          this.activeOpts.visible = true
          this.activeOpts.title = '商户续期'
          this.merchantId = row.merchantId
          break
        case 4:
          this.$.showWarning(`重置后，新密码将发送到商户邮箱，请确认！`, () => {
            this.$api[`main/merchantResetPassword`]({
              merchantId: row.merchantId
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
        this.openAdd('编辑商户', row.merchantId)
      } else {
        let data = this.checked(false)
        if (data) {
          this.openAdd('编辑商户', data[0].merchantId)
        }
      }
    },
    del(row) {
      if (row) {
        this.handleDel(
          Array.of(row),
          '是否删除此商户？',
          'merchantRemove',
          'merchantId'
        )
      } else {
        let data = this.checked(true)
        if (data) {
          this.handleDel(
            data,
            '是否删除此商户？',
            'merchantRemove',
            'merchantId'
          )
        }
      }
    },
    getCode() {
      return this.$api[`main/merchantGetMerchantNo`]().then(
        data => data.rows.merchantNo
      )
    }
  }
}
</script>

<style>
</style>
