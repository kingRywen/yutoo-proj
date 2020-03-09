<template>
  <div>
    <!-- <ElButton type="text" @click="showMsgBox('123123')">123123</ElButton> -->
    <main-layout
      :btns="btns"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      :tableCols="tableCols"
      labelWidth="120px"
      editWidth="240px"
      :cellClassNameFunc="cellClassNameFunc"
      @treeCurrentChange="handleTreeCurrentChange"
      @handleSelectionChange="handleSelectionChange"
      @clear="handleClear"
      :fixed="true"
      @command="handleCommand"
    >
      <div slot="ip" class="ip">
        当前剩余可用账号配额：
        <b class="danger">{{ipCase.ipUsableTotal}}</b>
      </div>
    </main-layout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm labelWidth="130px" :fields="addFields" ref="add" @datachange="handleDataChange"></SimpleForm>
    </yt-dialog>
    <yt-dialog :options="snapshotImageOptions">
      <div class="img">
        <img :src="snapshotImage">
      </div>
    </yt-dialog>
    <yt-dialog :options="activateAccountOpts" :events="activateAccountEvents">
      <div v-loading="activateAccountLoading">
        <template v-if="showActive">
          <el-form ref="activateForm" :model="activateFormData" size="mini" label-width="140px">
            <el-row>
              <el-col :span="24" class="mb20">
                <span style="color:red">*</span>提示：未激活的账号需要先激活后才能正常使用，激活之后将生成订单（作废未成功支付过的订单之后可以再激活）
              </el-col>
              <el-col :span="12">
                <el-form-item label="总剩余配额">
                  <el-input-number
                    controls-position="right"
                    v-model="ipCase.ipAllTotal"
                    placeholder="输入整数"
                    class="per100"
                    disabled
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="剩余可用配额">
                  <el-input-number
                    disabled
                    controls-position="right"
                    v-model="ipCase.ipUsableTotal"
                    placeholder="输入整数"
                    class="per100"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购买时长（月）" prop="effectiveTime" :rules="[{required:true, message: '请输入时长'}]">
                  <el-input-number
                    controls-position="right"
                    v-model="activateFormData.effectiveTime"
                    placeholder="输入整数"
                    class="per100"
                    :min="1"
                    :precision="0"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="购买配额" prop="ipCount" :rules="[{required:true, message: '请选择账号进行计算'}]">
                  <el-select disabled v-model="activateFormData.ipCount" class="per100">
                    <ElOption
                      v-for="item in priceRangeList"
                      :key="item.buyQuantity"
                      :label="item.buyQuantity"
                      :value="item.buyQuantity"
                    ></ElOption>
                  </el-select>
                  <!-- <el-input-number class="per100" :controls="false" v-model="activateFormData.accountNum"></el-input-number> -->
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="需付金额" prop="needPay" :rules="[{required:true, message: '请选择账号进行计算'}]">
                  <el-input-number
                    class="per100"
                    :controls="false"
                    disabled
                    v-model="activateFormData.needPay"
                    :precision="2"
                  ></el-input-number>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item>
                  <div slot="label">单价
                    <el-button type="text" icon="el-icon-info" @click="handlePriceClick"></el-button>
                  </div>
                  <el-input-number
                    class="per100"
                    :controls="false"
                    disabled
                    v-model="activateFormData.price"
                    :precision="2"
                  ></el-input-number>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
          <el-table :data="activateFormDataList" @selection-change="handleTableSelectionChange" ref="accountForm">
            <NoneData slot="empty"></NoneData>
            <el-table-column type="selection"></el-table-column>
            <el-table-column label="账号" prop="account"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="类目" prop="categoryCount">
              <template slot-scope="scope">
                <div>
                  <el-popover placement="right" width="400" trigger="hover" @show="handleShow(scope)">
                    <el-table v-loading="!(scope.row._list && scope.row._list.length)" :data="scope.row._list || []">
                      <el-table-column label="类目" prop="name"></el-table-column>
                    </el-table>
                    <el-button slot="reference" type="text">
                      <b>{{scope.row.categoryCount}}</b>
                    </el-button>
                  </el-popover>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </template>
        <PayMoney v-else ref="payMoney" :orderId="orderId" :data="originData"/>
      </div>
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
    <el-dialog title="价格区间" :visible.sync="PriceDialogVisible">
      <el-table :data="priceRangeList">
        <NoneData slot="empty"></NoneData>
        <el-table-column label="序号">
          <template slot-scope="scope">
            <div>{{scope.$index + 1}}</div>
          </template>
        </el-table-column>
        <el-table-column label="购买数量" prop="buyQuantity"></el-table-column>
        <el-table-column label="单价">
          <template slot-scope="scope">
            <div>{{scope.row.unitPrice}} {{scope.row.currency}}</div>
          </template>
        </el-table-column>
        <el-table-column label="总价">
          <template slot-scope="scope">
            <div>{{scope.row.totalPrice}} {{scope.row.currency}}</div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="PriceDialogVisible = false" size="mini">确 定</el-button>
      </span>
    </el-dialog>
    <yt-dialog :options="commonOpts" :events="commonEvents">
      <component :is="commonOpts.name" ref="com" :outerData="commonOpts.data"></component>
    </yt-dialog>
    <el-button ref="copyBtn" style="display:none" :data-clipboard-text="passText">复制</el-button>
  </div>
</template>

<script>
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
import PayMoney from '../components/PayMoney'
import download from 'Utils/download'
const jsonp = require('jsonp')
import { mapState } from 'vuex'
import Reactive from './components/reactive'
import Clipboard from 'clipboard'

const token = storage.get('local', 'token')

export default {
  components: { PayMoney, Reactive },
  created() {
    this.getNum()
    this.getPriceRangeList()
  },
  data() {
    let vm = this
    return {
      formData: {},
      passText: '',
      orderId: null,
      priceRangeList: [],
      isSecond: false,
      ipCase: {},
      priceList: [],
      activateAccountLoading: false,
      originData: {},
      payFormData: {},
      showActive: true,
      activateFormDataList: [],
      activateFormData: {},
      snapshotImage:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547556800253&di=b567122b22df53110afb44f7f74b8dc6&imgtype=0&src=http%3A%2F%2Fimg.bimg.126.net%2Fphoto%2FZZ5EGyuUCp9hBPk6_s4Ehg%3D%3D%2F5727171351132208489.jpg',
      uploadConfig: {
        url: CONST_PORT_CONFIG.BASE_URL + 'Account/importData',
        headers: {
          token
        },
        data: {
          token
        }
      },
      PriceDialogVisible: false,
      dialogOptions: {
        visible: false,
        title: '新增账号',
        width: '800px',
        height: '560px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      activateAccountOpts: {
        noShowLoading: false,
        visible: false,
        title: '激活账号',
        width: '800px',
        okBtnText: '确定',
        cancelBtnText: '取消',
        beforeClose: done => {
          vm.activateAccountOpts.title = '激活账号'
          vm.orderId = null
          done()
        }
      },
      commonOpts: {
        name: '',
        data: {
          list: []
        },
        visible: false,
        title: '重新激活账号',
        width: '800px',
        height: '560px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      snapshotImageOptions: {
        visible: false,
        title: '任务截图',
        width: '80%'
      },
      importDialogOptions: {
        visible: false,
        title: '导入账号',
        width: '500px'
        // okBtnText: '确定',
        // cancelBtnText: '取消'
      },
      dialogEvents: {
        handleOkClick() {
          let {
            id: categoryIdArray,
            type = [],
            ...info
          } = vm.$refs.add.formData
          let registerFlag = 0,
            autoRegisterFlag = 0

          if (type.indexOf('2') > -1) {
            autoRegisterFlag = 1
          }
          if (type.indexOf('1') > -1) {
            registerFlag = 1
            autoRegisterFlag = 0
          }
          // let [primeStartTime, primeEndTime] = primeTime
          let apiName = `main/accountSave`
          categoryIdArray = JSON.parse(JSON.stringify(categoryIdArray))
          categoryIdArray = categoryIdArray
            .map(el => el && el.slice(0).pop())
            .filter(el => el != null)
          if (info.accountId != null) {
            apiName = `main/accountUpdate`
          }
          return vm.$api[apiName]({
            ...info,
            categoryIdArray,
            registerFlag,
            autoRegisterFlag
            // primeStartTime,
            // primeEndTime
          }).then(data => {
            vm.dialogOptions.visible = false
            vm.$refs.lay.handleSearch()
          })
        }
      },
      importDialogEvents: {
        close() {
          vm.notifyVm && vm.notifyVm.close()
        },
        handleOkClick() {
          return vm.$api[`main/accountSave`]({})
            .then(data => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(err => {})
        }
      },
      activateAccountEvents: {
        handleOpen() {
          if (!vm.showActive) {
            return
          }
          vm.showActive = true
          vm.activateAccountLoading = false
          vm.activateFormData = {}
          vm.$api[`main/accountListActive`]({})
            .then(data => {
              vm.activateFormDataList = data
            })
            .catch(err => {})
        },
        close() {
          if (!vm.showActive && vm.activateAccountOpts.title !== '续费') {
            vm.showNotify()
          }
        },
        handleCancelClick() {
          if (!vm.showActive && vm.activateAccountOpts.title !== '续费') {
            vm.showNotify()
          }
        },
        handleOkClick() {
          if (vm.showActive) {
            vm.activateAccountOpts.noShowLoading = true
            vm.activateAccountLoading = false
            // 选择激活账号
            return vm.$refs.activateForm
              .validate()
              .then(() => {
                return vm
                  .$confirm('确定要激活账号？', '提示', {
                    type: 'warning'
                  })
                  .then(() => {
                    vm.originData = JSON.parse(
                      JSON.stringify(vm.activateFormData)
                    )
                    let accountIdArray = vm.$refs.accountForm.selection.map(
                      el => el.accountId
                    )
                    let { price, ...info } = vm.activateFormData
                    vm.activateAccountLoading = true
                    vm.activateAccountOpts.noShowLoading = false
                    vm.$api[`main/accountActive`]({
                      ...info,
                      unitPrice: price,
                      accountIdArray
                    })
                      .then(data => {
                        vm.$api[`main/merchantOrderPayInfo`]({
                          orderId: data.rows
                        })
                          .then(data => {
                            vm.originData = data.rows
                            vm.originData.needPay = vm.activateFormData.needPay
                            vm.originData.accountIdArray = vm.$refs.accountForm.selection.map(
                              el => el.accountId
                            )
                            vm.activateAccountLoading = false
                            vm.showActive = false
                            vm.activateAccountOpts.title = '订单支付'
                          })
                          .catch(err => {
                            vm.activateAccountLoading = false
                          })
                      })
                      .catch(err => {
                        vm.activateAccountLoading = false
                      })
                  })
                  .catch(err => {
                    vm.activateAccountLoading = false
                    vm.activateAccountOpts.noShowLoading = false
                    return Promise.reject()
                  })
              })
              .catch(() => {
                vm.activateAccountOpts.noShowLoading = false
                return Promise.reject()
              })
          } else {
            vm.activateAccountOpts.noShowLoading = true
            // 提交订单
            let pay = vm.$refs.payMoney
            return pay.$refs.activate
              .validate()
              .then(() => {
                return vm
                  .$confirm('确认支付？', '提示', {
                    type: 'warning'
                  })
                  .then(() => {
                    vm.activateAccountOpts.noShowLoading = false
                    return vm.submitPay(pay.getData())
                  })
              })
              .catch(() => {
                vm.activateAccountOpts.noShowLoading = false
                return Promise.reject()
              })
          }
        }
      },
      commonEvents: {
        handleOpen() {},
        handleOkClick() {
          return vm.$refs.com.submit().then(close => {
            if (close) {
              // vm.$refs.lay.getList()
              vm.commonOpts.visible = false
              vm.$router.push({ name: 'payment_record' })
            }
          })
        },
        beforeClose() {}
      },
      btns: [
        {
          name: '新增',
          fn: () => {
            this.setAddDisabled(true)
            this.addFields[9].options = [
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
            this.dialogOptions.title = '新增账号'
            this.dialogOptions.visible = true

            this.$nextTick(() => {
              this.$refs.add.setData({ status: 0, id: [[]] })
            })
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

            vm.handleEdit(data[0].accountId)
          }
        },
        {
          name: '删除',
          fn: () => {
            let data = vm.checked()
            if (data) {
              data = data.map(el => ({ accountId: el.accountId }))
            } else {
              return
            }
            vm.handleDel(data)
          }
        },
        {
          spec: true
        },
        {
          name: '激活账号',
          fn: () => {
            vm.showActive = true
            vm.activateAccountOpts.visible = true
          }
        },
        {
          name: '重新激活账号',
          fn: () => {
            let data = vm.checked()
            if (!data) {
              return
            }

            data = data.filter(el => {
              if ((el.status === 1 || el.status === 2) && el.expireDay <= 0) {
                return true
              }
            })

            if (data.length) {
              vm.commonOpts.data.list = data
              vm.toggleDialog({
                visible: true,
                title: '重新激活账号',
                name: 'Reactive'
                // height: '560px'
              })
            } else {
              vm.$message.warning('请选择状态为正常或暂停且未过期的账号')
            }

            // vm.commonOpts.visible = true
            // vm.commonOpts.title = true
          }
        },
        {
          name: '修改状态',
          childs: ['正常', '暂停', '终止'],
          disabled: []
        }
      ],
      edits: [
        {
          childs: scope => {
            let { browserMode, browserFlag, accountType } = scope.row,
              childs = []
            if (browserMode === 0) {
              childs.push({ name: '普通登录' })
            }
            if (browserMode === 1) {
              childs.push({ name: '容器登录' })
            }
            if (browserMode === 2) {
              if (browserFlag === 0 && accountType === 1) {
                childs.push({ name: '打开浏览器' })
              }
            }

            return childs
          },

          show: scope => {
            return (
              scope.row.status === 1 &&
              (scope.row.expireDay == null || scope.row.expireDay <= 0)
            )
          },
          fn: (scope, item, name) => {
            let { accountId } = scope.row
            this.$confirm('是否执行登录操作？', '警告', {
              type: 'warning'
            })
              .then(() => {
                vm.$api[`main/accountLogin`]({ accountId })
                  .then(data => {
                    switch (name) {
                      case '普通登录':
                        vm.$message.success(data.msg)
                        let {
                          type,
                          ua,
                          host,
                          port,
                          proxyAccount,
                          proxyPassword,
                          url
                        } = data.rows
                        data.rows.url = data.rows.url
                        data.rows.port = port
                        data.rows.proxyAccount = proxyAccount
                        data.rows.proxyPassword = proxyPassword
                        data.rows.host = host
                        let params = ''
                        for (const key in data.rows) {
                          if (data.rows.hasOwnProperty(key)) {
                            const element = data.rows[key]
                            params += `${key}=${encodeURIComponent(element)}&`
                          }
                        }
                        let requestUrl =
                          'http://localhost:9008/client/openWeb?' + params
                        jsonp(requestUrl, null, (err, data) => {
                          if (err) {
                            vm.$message.error('获取验证码失败')
                          } else {
                          }
                        })
                        break
                      case '容器登录':
                        vm.$message.success(data.msg)
                        break
                      case '打开浏览器':
                        vm.$refs.lay.getList()
                        vm.showMsgBox(data.flag)

                        break

                      default:
                        break
                    }
                  })
                  .catch(err => {})
              })
              .catch(() => {})
          }
        },
        {
          name: '关闭浏览器',
          show: scope => {
            return (
              scope.row.status === 1 &&
              scope.row.browserFlag === 1 &&
              scope.row.accountType === 1 &&
              scope.row.browserMode !== 0 &&
              (scope.row.expireDay == null || scope.row.expireDay <= 0)
            )
          },
          fn(scope) {
            vm.$confirm('是否关闭浏览器？', '警告', {
              type: 'warning'
            })
              .then(() => {
                vm.$api[`main/accountLogout`]({
                  accountId: scope.row.accountId
                })
                  .then(data => {
                    vm.$refs.lay.getList()
                  })
                  .catch(() => {})
              })
              .catch(() => {})
          }
        },
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
          name: '自动注册',
          show: scope => {
            let {
              accountType,
              browserMode,
              status,
              registerStatus,
              autoRegisterFlag,
              expireDay
            } = scope.row
            /* 第一层筛选，账号类型为手动，浏览器打开方式是直接打开时，没有自动注册功能；其他的会有自动注册功能
              第二层筛选，账号状态是未激活或激活中或终止时不显示“自动注册”按钮
              第三层筛选，账号状态是正常或暂停时，注册状态是未注册和注册失败时显示“自动注册”按钮 */
            return (
              expireDay <= 0 &&
              autoRegisterFlag !== 1 &&
              !(!accountType && browserMode === 0) &&
              (status === 1 || status === 2) &&
              (registerStatus === 0 || registerStatus === 4)
            )
            // return (
            //   scope.row.status === 1 &&
            //   scope.row.accountType === 0 &&
            //   scope.row.registerFlag === 0 &&
            //   (scope.row.expireDay == null || scope.row.expireDay <= 0)
            // )
          },
          fn: (scope, item) => {
            let params = [{ accountId: scope.row.accountId }]
            vm.$confirm('是否确认自动注册账号？', '警告', {
              type: 'warning'
            })
              .then(() => {
                vm.$api[`main/accountAotuRegister`](params)
                  .then(data => {
                    vm.refreshData()
                  })
                  .catch(err => {})
              })
              .catch(() => {})
          }
        },
        {
          name: '续费',
          show: scope => {
            return scope.row.orderId !== null
          },
          fn: (scope, item) => {
            vm.activateAccountOpts.title = '续费'
            vm.orderId = scope.row.orderId
            vm.showActive = false
            vm.originData = {}
            vm.activateAccountOpts.visible = true
          }
        },
        {
          name: '复制密码',
          show: scope => {
            // return true
            return (
              scope.row.status === 1 &&
              (scope.row.expireDay == null || scope.row.expireDay <= 0)
            )
          },
          fn: (scope, item) => {
            this.$api[`main/accountCopyPassword`](scope.row.accountId)
              .then(data => {
                vm.handleCopy(data)
              })
              .catch(err => {})
          }
        },
        {
          name: '激活账号 (测试)',
          show: scope => {
            return scope.row.expireDay == null || scope.row.expireDay <= 0
          },
          fn(scope, item) {
            vm.$prompt('请输入IP', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消'
            })
              .then(({ value }) => {
                vm.$api[`main/accountCenterActive`]({
                  accountId: scope.row.accountId,
                  ip: value
                })
                  .then(data => {
                    vm.$refs.lay.getList()
                  })
                  .catch(err => {})
              })
              .catch(() => {})
          }
        }
      ],
      searchFields: [
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
        {
          name: 'accountType',
          label: '账号类型',
          type: 'select',
          options: [
            {
              label: '手动',
              value: '0'
            },
            {
              label: '自动',
              value: '1'
            }
          ]
        },
        {
          name: 'registerDate',
          query: ['queryStartRegisterDate', 'queryEndRegisterDate'],
          label: '注册时间',
          type: 'dateRange',
          format: 'yyyy-MM-dd',
          span: 12
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
              data.registerDate = null
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
              data.primeStartTime = null
              data.primeEndTime = null
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
              data.primeStartTime = null
              data.primeEndTime = null
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
          label: '账号',
          prop: 'account',
          width: 200
        },
        {
          label: '账号类型',
          width: 70,
          prop: 'accountType',
          render(h, scope) {
            return <span>{scope.row.accountType ? '自动' : '手动'}</span>
          }
        },
        {
          label: '姓名',
          prop: 'name',
          width: 140
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
            return (
              <el-popover
                placement="right"
                trigger="hover"
                onShow={() => {
                  vm.$set(scope.row, 'cateList', null)
                  vm.$api[`main/accountListCategory`]({ accountId })
                    .then(data => {
                      vm.$set(scope.row, 'cateList', data)
                    })
                    .catch(err => {})
                }}
              >
                <div>
                  {scope.row.cateList ? (
                    <el-table data={scope.row.cateList || []}>
                      <el-table-column label="类目" prop="name" />
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
          label: '状态',
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
          label: '异常信息',
          prop: 'remark',
          width: 158,
          render(h, scope) {
            return <span class="danger">{scope.row.remark}</span>
          }
        }
      ]
    }
  },
  computed: {
    ...mapState(['userInfo']),
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
  watch: {
    accountNum(val) {
      if (val == null) {
        return
      }
      this.getPrice()
    },
    userInfo: {
      immediate: true,
      handler(val) {
        if (Object.keys(val).length === 0) {
          return
        }
        let browsers = [
          {
            label: '直接打开',
            value: 0
          },
          {
            label: 'docker容器打开',
            value: 1
          },
          {
            label: '虚拟机打开',
            value: 2
          }
        ]

        let opts = []
        if (val.profileFlag) {
          opts.push(browsers[0])
        }
        if (val.dockerFlag) {
          opts.push(browsers[1])
        }
        if (val.vmFlag) {
          opts.push(browsers[2])
        }
        console.log(222)
        this.addFields[11].options = opts
        this.addFields.splice(11, 1, this.addFields[11])
      }
    }
    // 'formData.type'(val, oldVal) {
    //   if (!val || val !== oldVal) {
    //     // 是否已注册，
    //     // 如果未勾选平台注册 显示立即注册 并设置密码为非必填 去掉注册日期
    //     // 如果勾选平台注册 相反
    //     if (val.indexOf('1') === -1) {
    //       this.addFields[0].options = [
    //         {
    //           label: '已在平台注册',
    //           value: '1'
    //         },
    //         {
    //           label: '立即注册',
    //           value: '2',
    //           disabled: false
    //         }
    //       ]
    //       let el = JSON.parse(JSON.stringify(this.addFields[5]))
    //       el.required = false
    //       this.addFields.splice(5, 1, el)
    //       let registerDateEl = this.addFields[10]
    //       if (this.addFields.some(el => el.label === '注册日期')) {
    //         this.addFields.splice(10, 1)
    //         this.$refs.add.formData.registerDate = null
    //       }
    //     } else {
    //       let el = JSON.parse(JSON.stringify(this.addFields[5]))
    //       el.required = true
    //       this.addFields.splice(5, 1, el)
    //       let registerDateEl = this.addFields[10]
    //       if (!this.addFields.some(el => el.label === '注册日期')) {
    //         this.addFields.splice(10, 0, {
    //           label: '注册日期',
    //           required: true,
    //           name: 'registerDate',
    //           span: 12,
    //           type: 'date',
    //           pickerOptions: {
    //             disabledDate(time) {
    //               return time.getTime() > Date.now() - 24 * 3600 * 1000
    //             }
    //           }
    //         })
    //       }
    //       this.addFields[0].options = [
    //         {
    //           label: '已在平台注册',
    //           value: '1'
    //         }
    //       ]
    //     }
    //   }
    // }
  },
  methods: {
    showMsgBox(text) {
      const h = this.$createElement
      const vm = this
      this.$msgbox({
        title: '虚拟机登陆',
        message: h('p', null, [
          h('span', null, '浏览器标识为 '),
          h('i', { style: 'color: teal' }, text)
        ]),
        showCancelButton: true,
        confirmButtonText: '复制',
        cancelButtonText: '确认',
        beforeClose: (action, instance, done) => {
          done()
        }
      })
        .then(action => {
          vm.handleCopy(text)
        })
        .catch(err => {})
    },
    showNotify() {
      const h = this.$createElement
      this.$notify({
        title: '订单未支付',
        dangerouslyUseHTMLString: true,
        message: h('p', null, [
          h('span', null, '订单未完成支付，需到订单页面继续支付。'),
          h(
            'el-button',
            {
              props: {
                type: 'text'
              },
              on: {
                click: this.toUrl
              }
            },
            '点击跳转'
          )
        ]),
        duration: 3000,
        type: 'warning'
      })
    },
    getNum() {
      this.$api[`main/ipBindRecordGetIpCase`]({})
        .then(data => {
          this.ipCase = data
        })
        .catch(err => {})
    },
    getPriceRangeList() {
      this.$api[`main/ipPricePriceRange`]({})
        .then(data => {
          this.priceRangeList = data
        })
        .catch(err => {})
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
    toggleDialog({ visible, title, name, height }) {
      this.commonOpts.title = title
      this.commonOpts.name = name
      this.commonOpts.visible = visible
      this.commonOpts.height = height
    },
    handleShow(scope) {
      let { accountId } = scope.row
      this.$set(scope.row, '_list', [])
      this.$api[`main/accountListCategory`]({ accountId })
        .then(data => {
          this.$set(scope.row, '_list', data)
        })
        .catch(err => {})
    },
    // // 生成订单号
    // getOrder(data = {}) {
    //   this.activateAccountLoading = true
    //   this.$api[`main/merchantOrderGetOrderId`](data)
    //     .then(data => {
    //       this.activateAccountLoading = false
    //       this.originData = data
    //     })
    //     .catch(err => {
    //       this.activateAccountLoading = false
    //     })
    // },
    toUrl() {
      this.$router.push({ name: 'order' })
    },
    // 提交支付

    submitPay(data) {
      // this.activateAccountLoading = true
      return this.$api[
        this.$refs.payMoney.orderId
          ? `main/merchantOrderRenew`
          : `main/merchantOrderPay`
      ](data)
        .then(data => {
          // this.activateAccountLoading = false
          // this.$refs.lay.handleSearch()
          this.$router.push({ name: 'order' })
          return Promise.resolve(true)
        })
        .catch(err => {
          // this.activateAccountLoading = false
          return Promise.reject()
        })
    },
    getPrice() {
      this.activateAccountLoading = true
      this.$api[`main/ipPricePrice`]({
        count: this.activateFormData.ipCount,
        month: this.activateFormData.effectiveTime
      })
        .then(data => {
          this.activateAccountLoading = false
          if (this.showActive) {
            this.activateFormData.needPay = data.needPay
            this.activateFormData.totalPrice = data.totalPrice
            this.activateFormData.price = data.unitPrice
          } else {
            this.originData.needPay = data.needPay
            this.originData.totalPrice = data.totalPrice
            this.originData.realPay = data.unitPrice
          }
        })
        .catch(err => {
          this.activateAccountLoading = false
        })
    },
    handlePriceClick() {
      this.PriceDialogVisible = true
      this.getPriceRangeList()
    },
    handleTableSelectionChange(val) {
      // console.log(val);
      if (!val.length) {
        this.activateFormData.ipCount = undefined
        this.activateFormData.needPay = undefined
        this.activateFormData.price = undefined
        return
      }
      let num = val.length,
        _n
      this.priceRangeList.forEach(element => {
        if (
          element.buyQuantity + this.ipCase.ipUsableTotal > val.length &&
          !_n
        ) {
          _n = element.buyQuantity
        }
      })
      if (_n) {
        this.$set(this.activateFormData, 'ipCount', _n)
      }
      // this.activateFormData.accountNum = val.length
    },
    downloadTemp() {
      this.$api[`main/accountExportTemplate`]({})
        .then(data => {
          download(data, '账号导入模板.xls')
        })
        .catch(err => {})
    },
    handleCommand(name) {
      let params = this.checked(),
        status
      if (!params) {
        return
      }
      switch (name) {
        case '正常':
          status = 1
          break
        case '暂停':
          status = 2
          break
        case '终止':
          status = 3
          break

        default:
          break
      }

      params = params.map(el => ({ accountId: el.accountId, status }))

      if (name === '终止') {
        this.$confirm('终止后，释放IP，账号不可再用，是否继续？', '警告', {
          type: 'error'
        })
          .then(() => {
            this.$api[`main/accountUpdateStatus`](params)
              .then(data => {
                this.refreshData()
              })
              .catch(err => {})
          })
          .catch(() => {})
        return
      }

      this.$api[`main/accountUpdateStatus`](params)
        .then(data => {
          this.refreshData()
        })
        .catch(err => {})
    },
    setAddDisabled(disabled = false, index = 9) {
      let accountEl = this.addFields[index]
      accountEl.disabled = disabled
      this.addFields.splice(index, 1, accountEl)
    },

    handleOnSuccess(res, file, fileList) {
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
    handleDataChange(data) {
      this.formData = data
    },

    handleCopy(text) {
      let vm = this
      vm.el = vm.$refs.copyBtn.$el
      vm.copyBtn = new Clipboard(vm.el)
      vm.copyBtn.on('success', function() {
        vm.$message({
          message: '复制成功！',
          type: 'success'
        })
      })
      vm.passText = text
      vm.$nextTick(() => {
        vm.el.dispatchEvent(new Event('click'))
        vm.copyBtn.destroy()
      })
    },
    handleEdit(accountId) {
      let vm = this
      vm.dialogOptions.title = '编辑账号'
      vm.dialogOptions.visible = true

      vm.$nextTick(() => {
        this.$api[`main/accountInfo`]({ accountId })
          .then(data => {
            let rows = JSON.parse(JSON.stringify(data.rows))
            let {
              categoryIdArray,
              categoryMap,
              registerFlag,
              autoRegisterFlag
            } = rows

            rows.id = categoryIdArray.map(el => {
              let arr = [...categoryMap[el], el]
              return arr
            })

            rows.type = []
            if (registerFlag) {
              rows.type.push('1')
            }
            if (autoRegisterFlag) {
              rows.type.push('2')
            }

            // 如果待编辑的账号未激活或终止或激活中，则设置状态为不可编辑,否则设为可编辑
            if (rows.status === 0 || rows.status === 3 || rows.status === 4) {
              vm.setAddDisabled(true)
            } else {
              vm.setAddDisabled(false)
            }
            // 修改订单状态选项
            /* {
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
              label: '终止',
              value: '3'
            } */
            let statusSelect = vm.addFields[9]
            switch (rows.status) {
              case 0:
                statusSelect.options = [
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
                vm.addFields.splice(9, 1, statusSelect)
                break

              case 1:
                statusSelect.options = [
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
                vm.addFields.splice(9, 1, statusSelect)
                break

              case 2:
                statusSelect.options = [
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
                vm.addFields.splice(9, 1, statusSelect)
                break

              case 3:
                statusSelect.options = [
                  {
                    label: '终止',
                    value: 3
                  }
                ]
                vm.addFields.splice(9, 1, statusSelect)
                break

              case 4:
                statusSelect.options = [
                  {
                    label: '激活中',
                    value: 4
                  }
                ]
                vm.addFields.splice(9, 1, statusSelect)
                break

              default:
                break
            }

            vm.$refs.add.setData(rows)
          })
          .catch(err => {})
      })
    },
    refreshData() {
      this.$refs.lay.handleSearch()
    },
    handleDel(row) {
      let vm = this
      vm.$confirm('是否删除选中的账号？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/accountRemove`](row)
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
      return this.$api[`main/accountList`](data)
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
    },
    handleSelectionChange(val) {
      // console.log(val)
      let selected = val.map(el => ({ accountId: el.accountId }))
      if (!selected.length) {
        return
      }
      let disabled = [false, false, false]
      if (
        val.every(el => el.status === 0) ||
        val.every(el => el.status === 3)
      ) {
        // 6
        disabled = [true, true, true]
      }
      if (val.some(el => el.status === 1)) {
        // 6
        disabled = [true, false, false]
      }
      if (val.some(el => el.status === 2)) {
        // 6
        disabled = [false, true, false]
      }

      let btn = this.btns[6]
      btn.disabled = disabled
      this.btns.splice(6, 1, btn)
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
.ip {
  float: right;
  font-size: 14px;
}
</style>
