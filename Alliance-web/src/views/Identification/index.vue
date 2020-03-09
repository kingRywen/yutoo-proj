
<template>
  <div>
    <!-- <main-layout
      :btns="btns"
      :search-fields="searchFields"
      :loadData="loadData"
      :edits="edits"
      :loadNode="_loadNode"
      ref="lay"
      :tableCols="tableCols"
      :defaultShowTree="false"
      labelWidth="120px"
      editWidth="180px"
      :cellClassNameFunc="cellClassNameFunc"
      @treeCurrentChange="handleTreeCurrentChange"
      @handleSelectionChange="handleSelectionChange"
      @clear="handleClear"
      :fixed="true"
      @command="handleCommand"
    ></main-layout>-->
    <NewMainLayout
      ref="lay"
      url="main/accountList"
      :edit-btns="edits"
      editWidth="120px"
      :btnFn="btnFn"
      :searchFields="searchFields"
      :columns="columns"
      :searchFunc="searchFunc"
      :topBatchBtn="topBatchBtn"
      :right-edit-btns="editBtns"
      :leftTree="true"
      :loadNode="_loadNode"
      @left-batch-change="handleLeftBatchChange"
    ></NewMainLayout>
    <yt-dialog :options="dialogOptions" :events="dialogEvents">
      <SimpleForm
        v-if="dialogOptions.visible"
        labelWidth="130px"
        :defaultData="{accountType: 0}"
        :fields="addFields"
        ref="add"
        @datachange="handleDataChange"
      ></SimpleForm>
    </yt-dialog>
    <yt-dialog :options="snapshotImageOptions">
      <div class="img">
        <img :src="snapshotImage" />
      </div>
    </yt-dialog>
    <yt-dialog :options="activateAccountOpts" :events="activateAccountEvents">
      <div v-loading="activateAccountLoading">
        <template v-if="showActive">
          <el-form ref="activateForm" :model="activateFormData" size="mini" label-width="140px">
            <el-row>
              <el-col :span="24" class="mb20">提示：未激活的账号需要先激活后才能正常使用，激活之后将生成订单（作废未成功支付过的订单之后可以再激活）</el-col>
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
                <el-form-item label="购买配额" prop="ipCount" :rules="[{required:true, message: '请选择账号进行计算'}]">
                  <el-select disabled v-model="activateFormData.ipCount" class="per100">
                    <ElOption
                      v-for="item in priceRangeList"
                      :key="item.buyQuantity"
                      :label="item.buyQuantity"
                      :value="item.buyQuantity"
                    ></ElOption>
                  </el-select>
                </el-form-item>
              </el-col>
              <template v-if="activateFormData.ipCount > 0">
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
                  <el-form-item for="none">
                    <div slot="label">
                      <span style="margin-right:6px">单价</span>
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
              </template>
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
                  <el-popover placement="right" width="200" trigger="hover" @show="handleShow(scope)">
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
        <PayMoney v-else ref="payMoney" :orderId="orderId" :data="originData" />
      </div>
    </yt-dialog>
    <yt-dialog :options="importDialogOptions" :events="importDialogEvents">
      <ElForm ref="importForm" :model="importData" size="small" label-width="80px">
        <ElRow v-for="(item, index) in importData.list" :key="index">
          <ElCol :span="6">
            <ElFormItem label label-width="0" :prop="`list.${index}.categoryId`" :rules="getCateRule(item, index)">
              <SyncCascader :last="true" :props="props" v-model="item.categoryId" :load="loadTreeHasLast"></SyncCascader>
            </ElFormItem>
          </ElCol>
          <ElCol :span="7">
            <ElFormItem
              label="占比"
              label-width="60px"
              :prop="`list.${index}.rate`"
              :rules="getRateRule(item, index, importData.list)"
            >
              <ElInputNumber :min="1" :controls="false" v-model="item.rate"></ElInputNumber>
            </ElFormItem>
          </ElCol>
          <ElCol :span="7">
            <ElFormItem label="账号复用" :prop="`list.${index}.reuseType`" :rules="[{required: true, message:'请选择账号复用'}]">
              <el-select v-model="item.reuseType" style="width:100%">
                <el-option v-for="item in reuseTypeList" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </ElFormItem>
          </ElCol>
          <ElCol :span="4" class="txc">
            <ElButton size="small" type="text" icon="el-icon-plus" @click="handlePlus(item, index)"></ElButton>
            <ElButton
              size="small"
              type="text"
              icon="el-icon-minus"
              @click="handleMinus(item, index)"
              v-if="importData.list.length > 1"
            ></ElButton>
          </ElCol>
        </ElRow>
      </ElForm>
      <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadTemp">下载模板</el-button>
      <el-upload
        :disabled="importWrapperLoading"
        class="custom-upload"
        :action="uploadConfig.url"
        :headers="uploadConfig.headers"
        :before-upload="handleBeforeUpload"
        :data="uploadConfig.data"
        :show-file-list="false"
        :on-success="handleOnSuccess"
        :on-error="handleOnError"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
      <el-progress class="mt10" v-if="showPercent" :percentage="percentage" :status="percentStats"></el-progress>
    </yt-dialog>
    <yt-dialog :options="importRecordDialogOptions" :events="importRecordDialogEvents">
      <el-button icon="el-icon-download" type="primary" class="mb20" size="small" @click="downloadRecordTemp">下载模板</el-button>
      <el-upload
        class="custom-upload"
        :action="uploadRecordConfig.url"
        :headers="uploadRecordConfig.headers"
        :data="uploadRecordConfig.data"
        :show-file-list="false"
        :on-success="handleRecordOnSuccess"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">
          将文件拖到此处，或
          <em>点击上传</em>
        </div>
      </el-upload>
    </yt-dialog>
    <el-dialog title="价格区间" width="600px" :visible.sync="PriceDialogVisible">
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
/* eslint-disable no-empty */
import { CONST_PORT_CONFIG } from 'Config'
import storage from 'Utils/saver'
import PayMoney from '../components/PayMoney'
import download from 'Utils/download'
const jsonp = require('jsonp')
import { mapState, mapActions } from 'vuex'
import Reactive from './components/reactive'
import Clipboard from 'clipboard'
import formUtils from 'Components/NewForm/utils.js'

// const token = storage.get('local', 'token')

export default {
  components: { PayMoney, Reactive },
  created() {
    // this.getNum()
    this.token = storage.get('local', 'token')
    this.getPriceRangeList()
  },
  // beforeRouteEnter(to, from, next) {
  //   next(vm => {
  //     vm.getIpCase()
  //   })
  // },
  data() {
    let vm = this
    return {
      showPercent: false,
      percentage: 0,
      percentStats: undefined,
      uploadLoading: false,
      editBtns: [
        {
          name: '新增',
          fn: () => {
            this.setAddDisabled(true)
            let stat = this.addFields.find(el => el.name === 'status')
            stat.options = [
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
              this.$refs.add.setData({ status: 0, id: [[]], type: ['1'],browserMode: 0 })
            })
          }
        },
        {
          name: '导入',
          fn: () => {
            this.importDialogOptions.visible = true
          }
        },
        // {
        //   name: '激活账号',
        //   fn: () => {
        //     vm.showActive = true
        //     vm.activateAccountOpts.visible = true
        //   }
        // },
        {
          name: '导入账号操作记录',
          fn: () => {
            vm.importRecordDialogOptions.visible = true
          }
        }
      ],
      topBatchBtn: {
        title: '项',
        options: [
          {
            label: '删除'
          },
          {
            label: '重新激活账号'
          },
          {
            label: '修改状态',
            children: [
              {
                label: '正常'
              },
              {
                label: '暂停'
              },
              {
                label: '终止'
              }
            ]
          }
        ]
      },
      selectRecordActId: null,
      token: null,
      importWrapperLoading: false,
      reuseTypeList: [
        {
          label: '单次最大化',
          value: 0
        },
        {
          label: '全局最大化',
          value: 1
        },
        {
          label: '不最大化',
          value: 2
        }
      ],
      importData: {
        list: [
          {
            categoryId: [],
            rate: undefined,
            reuseType: null
          }
        ]
      },
      props: {
        label: 'name',
        value: 'categoryId',
        children: 'childs',
        enabled: 'enabled'
      },
      recmendAds: [],
      formData: {},
      passText: '',
      orderId: null,
      priceRangeList: [],
      isSecond: false,
      priceList: [],
      activateAccountLoading: false,
      originData: {},
      payFormData: {},
      showActive: true,
      activateFormDataList: [],
      activateFormData: {},
      snapshotImage:
        'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1547556800253&di=b567122b22df53110afb44f7f74b8dc6&imgtype=0&src=http%3A%2F%2Fimg.bimg.126.net%2Fphoto%2FZZ5EGyuUCp9hBPk6_s4Ehg%3D%3D%2F5727171351132208489.jpg',

      PriceDialogVisible: false,
      dialogOptions: {
        visible: false,
        title: '新增账号',
        width: '1000px',
        height: '560px',
        okBtnText: '确定',
        cancelBtnText: '取消'
      },
      activateAccountOpts: {
        noShowLoading: false,
        visible: false,
        title: '激活账号',
        width: '1000px',
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
        width: '800px'
      },
      importRecordDialogOptions: {
        visible: false,
        title: '导入账号操作记录',
        width: '500px'
      },
      importRecordDialogEvents: {
        close() {
          vm.notifyVm && vm.notifyVm.close()
        }
      },
      dialogEvents: {
        close() {
          vm._tList = {}
          // console.log(vm._tList)
        },
        // handleOpen() {
        //   vm.$nextTick(() => {
        //     if (vm.dialogOptions.visible === '新增账号') {
        //       vm.$refs.add.setData({ accountType: 0, type: ['1'] })
        //     }
        //   })
        // },
        handleOkClick() {
          // console.log(2)

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
            // status: 0,
            ...info,
            categoryIdArray,
            registerFlag,
            autoRegisterFlag,
            recycleFlag: 1
            // primeStartTime,
            // primeEndTime
          }).then(() => {
            vm.dialogOptions.visible = false
            vm.$refs.lay.handleSearch()
          })
        }
      },
      importDialogEvents: {
        close() {
          clearInterval(vm.timer)
          vm.importData.list = [
            {
              categoryId: [],
              rate: undefined,
              reuseType: null
            }
          ]
          vm.importWrapperLoading = false
          vm.percentStats = undefined
          vm.showPercent = false
          vm.percentage = 0
          vm.notifyVm && vm.notifyVm.close()
        },
        handleOkClick() {
          return vm.$api[`main/accountSave`]({})
            .then(() => {
              vm.dialogOptions.visible = false
              vm.$refs.lay.handleSearch()
            })
            .catch(() => {})
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
            .catch(() => {})
        },
        close() {
          if (
            !vm.payed &&
            !vm.showActive &&
            vm.activateAccountOpts.title !== '续费'
          ) {
            vm.showNotify()
          } else {
            vm.payed = false
          }
        },
        // handleCancelClick() {
        //   if (!vm.showActive && vm.activateAccountOpts.title !== '续费') {
        //     vm.showNotify()
        //   }
        //   vm.payed = false
        // },
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
                    let params = {
                      ...info,
                      unitPrice: price,
                      accountIdArray
                    }
                    if (!vm.activateFormData.ipCount) {
                      // 如果配额足够， 多传这些参数给后台
                      Object.assign(params, {
                        ipCount: 0,
                        effectiveTime: 0,
                        needPay: 0,
                        totalPrice: 0
                      })
                    }
                    vm.$api[`main/accountActive`](params)
                      .then(data => {
                        // 获取剩余配额
                        // vm.getIpCase()
                        if (!vm.activateFormData.ipCount) {
                          // 配额足够不需要跳支付页面
                          vm.$message.success(data.msg)
                          vm.activateAccountOpts.visible = false
                          vm.payed = true
                          vm.activateAccountOpts.noShowLoading = false
                          vm.$refs.lay.handleSearch()
                          return Promise.resolve(true)
                        }
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
                          .catch(() => {
                            vm.activateAccountLoading = false
                          })
                      })
                      .catch(() => {
                        vm.activateAccountLoading = false
                      })
                  })
                  .catch(() => {
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
                  .$confirm(
                    '请确定已经通过支付宝或微信二维码支付了正确金额',
                    '提示',
                    {
                      type: 'warning'
                    }
                  )
                  .then(() => {
                    vm.payed = true
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
            let stat = this.addFields.find(el => el.name === 'status')
            stat.options = [
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
              this.$refs.add.setData({ status: 0, id: [[]], type: ['1'] })
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
        },
        {
          spec: true
        },
        {
          name: '导入账号操作记录',
          type: 'primary',
          plain: true,
          disabled: () => {
            // if (selection.length !== 1) {
            //   return true
            // }
            return false
          },
          fn: () => {
            // vm.selectRecordActId = vm.checked().map(el => el.accountId)
            vm.importRecordDialogOptions.visible = true
          }
        }
        // {
        //   name: '登录邮箱',
        //   type: 'primary',
        //   plain: true,
        //   fn: () => {
        //     this.$api[`main/accountLoginEmail`]()
        //       .then(data => {})
        //       .catch(err => {})
        //   }
        // }
      ],
      edits: [
        {
          // 普通登录
          name: '打开浏览器',
          fn: scope => {
            this.clickLogin(scope, '普通登录')
          }
        },
        {
          // 普通登录
          name: '打开浏览器',
          fn: scope => {
            this.clickLogin(scope, '容器登录')
          }
        },
        {
          // 普通登录
          name: '打开浏览器',
          fn: scope => {
            this.clickLogin(scope, '打开浏览器')
          }
        },
        {
          name: '关闭浏览器',
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
          fn: scope => {
            vm.snapshotImage = scope.row.snapshotImage
            vm.snapshotImageOptions.visible = true
          }
        },
        {
          name: '自动注册',

          fn: scope => {
            let params = [{ accountId: scope.row.accountId }]
            vm.$confirm('是否确认自动注册账号？', '警告', {
              type: 'warning'
            })
              .then(() => {
                vm.$api[`main/accountAotuRegister`](params)
                  .then(() => {
                    vm.refreshData()
                  })
                  .catch(() => {})
              })
              .catch(() => {})
          }
        },
        {
          name: '续费',

          fn: scope => {
            vm.activateAccountOpts.title = '续费'
            vm.orderId = scope.row.orderId
            vm.showActive = false
            vm.originData = {}
            vm.activateAccountOpts.visible = true
          }
        },
        {
          name: '复制密码',
          fn: scope => {
            this.$api[`main/accountCopyPassword`](scope.row.accountId)
              .then(data => {
                vm.handleCopy(data)
              })
              .catch(() => {})
          }
        },
        {
          name: '编辑',
          fn: scope => {
            this.handleEdit(scope.row.accountId)
          }
        }
      ],
      searchFields: {
        account: {
          label: '账号'
        },
        cardNum: {
          label: '信用卡号码'
        },
        status: {
          label: '状态',
          widget: 'select',
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
            },
            {
              label: '删除',
              value: '-1'
            }
          ]
        },
        registerDate: {
          label: '注册时间',
          widget: 'daterange'
        },
        expireStatus: {
          label: '是否过期',
          widget: 'select',
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
        primeMember: {
          label: 'Prime会员',
          widget: 'select',
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
        exception: {
          label: '账号异常',
          widget: 'select',
          options: [
            {
              label: '不能登录',
              value: '0'
            },
            {
              label: '不能评价',
              value: '1'
            }
          ]
        },
        terminalType: {
          label: '终端类型',
          widget: 'select',
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
        terminalCode: {
          label: '终端编号'
        }
        // recycleFlag: {
        //   label: '商品回收',
        //   widget: 'select',
        //   options: [
        //     {
        //       label: '能',
        //       value: '1'
        //     },
        //     {
        //       label: '不能',
        //       value: '0'
        //     }
        //   ]
        // }
      },
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
            if (data.status !== 0 && data.status !== 4) {
              options.pop()
            }
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
            }
            // {
            //   label: '自动',
            //   value: 1
            // }
          ]
        },
        // {
        //   type: 'radio',
        //   name: 'recycleFlag',
        //   label: '能否商品回收',
        //   required: true,
        //   disabled(data) {
        //     return data.status !== 0
        //   },
        //   span: 12,
        //   options: [
        //     {
        //       label: '不能',
        //       value: 0
        //     },
        //     {
        //       label: '能',
        //       value: 1
        //     }
        //   ]
        // },
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
          label: '尺码',
          name: 'size',
          maxlength: 20,
          span: 12
        },
        {
          type: 'radio',
          name: 'terminalType',
          label: '终端类型',
          required: true,
          span: 12,
          onChange: (item, val) => {
            console.log(item, val)
            vm.$set(vm.$refs.add.formData, 'terminalCode', '')
            // vm.$refs.add.formData.terminalCode = ''
            // let index = vm.addFields.findIndex(el => el.name === 'terminalCode')
            if (!vm.termCode) {
              vm.$nextTick(() => vm.getTermCode(val))
              if (!vm.termCode) {
                return
              }
              let i = vm.addFields.findIndex(el => el.name === 'terminalType')
              vm.addFields.splice(i + 1, 0, vm.termCode[0])
              vm.termCode = null
            }
          },
          options: [
            {
              label: '手机',
              value: 1
            },
            {
              label: 'PC',
              value: 2
            },
            {
              label: '虚拟机',
              value: 3
            }
          ]
        },
        {
          type: 'select',
          name: 'terminalCode',
          label: '终端编号',
          filterable: true,
          hidden: data => !!data.terminalType,
          required: true,
          span: 12,
          options: []
        },
        {
          type: 'select',
          name: 'timezoneId',
          label: '所在时区',
          required: true,
          span: 12,

          options: () =>
            this.$api[`main/timezoneSelectList`]({}).then(data =>
              data.rows.map(el => ({ label: el.label, value: el.timezoneId }))
            )
        },
        {
          label: '邮箱账号',
          tip: '部分邮箱需要设置开通IMAP授权，如Sina',
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
          required: 'length',
          reqLen: 6,
          span: 12
        },

        {
          label: '平台账号名称',
          name: 'name',
          required: true,
          span: 12
        },

        {
          label: '平台密码',
          name: 'password',
          required: 'length',
          reqLen: 6,
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
          hidden: data => {
            // console.log(data);
            return data.accountId != null
            // return vm.dialogOptions.title === '新增账号'
          },
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
          hidden: () => {
            if (vm.$store.state.currentSiteInfo.platformCode === 'amazon') {
              return true
            } else {
              return false
            }
          },
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
          span: 12
          // pickerOptions: {
          //   disabledDate: time => {
          //     return time.getTime() < Date.now() - 24 * 3600 * 1000
          //   }
          // }
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
          label: '邮箱注册手机号',
          name: 'emailRegisterPhone',
          maxlength: 20,
          span: 12
        },
        {
          label: '邮箱手机拥有人',
          name: 'emailPhoneOwner',
          maxlength: 50,
          span: 12
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
          options: [
            { label: '个人', value: 0 },
            { label: '商户', value: 1 }
          ]
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
          label: '信用卡开户行',
          required: true,
          maxlength: 50,
          span: 24,
          name: 'bankName'
        },
        {
          add: '1',
          type: 'cascader',
          name: 'id',
          getEl: true,
          label: '类目',
          last: true,
          fixedScroll: true,
          disabled(data) {
            return data.accountId != null
          },
          options: this.loadTreeHasLast,
          bind: {
            label: 'name',
            value: 'categoryId',
            children: 'childs',
            enabled: 'enabled'
          },
          required: true
        }
      ],
      columns: [
        {
          label: '账号',
          value: 'account',
          width: 200
        },
        {
          label: '平台账号名称',
          value: 'name',
          width: 200
        },
        {
          label: '终端类型',
          value: 'terminalType',
          width: 70,
          render(h, scope) {
            const { terminalType } = scope.row
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
          value: 'terminalCode',
          width: 90
        },
        // {
        //   label: '商品回收',
        //   value: 'recycleFlag',
        //   width: 70,
        //   render(h, scope) {
        //     return <span>{scope.row.recycleFlag ? '能' : '不能'}</span>
        //   }
        // },
        {
          label: '性别',
          value: 'sex',
          width: 50,
          render(h, scope) {
            return <span>{scope.row.sex ? '女' : '男'}</span>
          }
        },
        {
          label: 'Prime开始/结束时间',
          width: 180,
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
          value: 'categoryCount',
          width: 60,
          render(h, scope) {
            let { accountId } = scope.row
            return (
              <el-popover
                placement="right"
                trigger="hover"
                open-delay={400}
                onShow={() => {
                  if (scope.row.cateList) {
                    return
                  }
                  // vm.$set(scope.row, 'cateList', null)
                  vm.$api[`main/accountListCategory`]({ accountId })
                    .then(data => {
                      vm.$set(scope.row, 'cateList', data)
                    })
                    .catch(() => {})
                }}
              >
                <div>
                  {scope.row.cateList ? (
                    <el-table
                      border
                      show-header={false}
                      data={scope.row.cateList || []}
                    >
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
          value: 'registerDate',
          width: 100
        },
        // {
        //   label: '到期时间',
        //   value: 'expireTime',
        //   width: 100
        // },
        {
          label: '账号状态',
          value: 'status',
          width: 75,
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
            if (status === -1) {
              statusStr = '删除'
            }
            return <span>{statusStr}</span>
          }
        },
        // {
        //   label: '邮箱登录时间',
        //   value: 'emailLoginTime',
        //   width: 135
        // },
        {
          label: '账号异常反馈',
          minWidth: 95,

          value: 'exception',
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
          value: 'remark',
          noTooltip: true,
          minWidth: 178,
          render(h, scope) {
            let { addressVerifyStatus, remark } = scope.row
            if (addressVerifyStatus == 3) {
              return (
                <el-popover
                  placement="left"
                  title="地址推荐"
                  width="700"
                  open-delay={300}
                  onShow={() => {
                    vm.getAdds(scope.row)
                  }}
                  trigger="hover"
                >
                  <div vLoading={scope.row._loading}>
                    <el-row gutter={20}>
                      <el-col span={12}>
                        <el-form
                          size="small"
                          label-position="left"
                          label-width="70px"
                          style="padding: 0 16px"
                        >
                          <el-form-item style="margin-bottom:0" label-width="0">
                            <div class="title">原地址</div>
                          </el-form-item>
                          <el-form-item label="国家" style="margin-bottom:0">
                            {vm.recmendAds.oldAddressCountry}
                          </el-form-item>
                          <el-form-item label="州" style="margin-bottom:0">
                            {vm.recmendAds.oldAddressState}
                          </el-form-item>
                          <el-form-item label="市" style="margin-bottom:0">
                            {vm.recmendAds.oldAddressCity}
                          </el-form-item>
                          <el-form-item label="邮编" style="margin-bottom:0">
                            {vm.recmendAds.oldZipcode}
                          </el-form-item>
                          <el-form-item label="地址1" style="margin-bottom:0">
                            {vm.recmendAds.oldAddressStreet}
                          </el-form-item>
                          <el-form-item label="地址2" style="margin-bottom:0">
                            {vm.recmendAds.oldAddressOther}
                          </el-form-item>
                        </el-form>
                      </el-col>
                      <el-col span={12}>
                        <el-form
                          size="small"
                          label-position="left"
                          label-width="70px"
                          style="padding: 0 16px;font-weight:bold"
                        >
                          <el-form-item style="margin-bottom:0" label-width="0">
                            <div class="title flex-bt">
                              <span>推荐地址</span>
                              <el-button
                                type="text"
                                on-click={() => {
                                  vm.handleCopy(
                                    [
                                      vm.recmendAds.addressCountry,
                                      vm.recmendAds.addressState,
                                      vm.recmendAds.addressCity,
                                      vm.recmendAds.zipcode,
                                      vm.recmendAds.addressStreet,
                                      vm.recmendAds.addressOther
                                    ].join('\n')
                                  )
                                }}
                              >
                                复制
                              </el-button>
                            </div>
                          </el-form-item>
                          <el-form-item label="国家" style="margin-bottom:0">
                            {vm.recmendAds.addressCountry}
                          </el-form-item>
                          <el-form-item label="州" style="margin-bottom:0">
                            {vm.recmendAds.addressState}
                          </el-form-item>
                          <el-form-item label="市" style="margin-bottom:0">
                            {vm.recmendAds.addressCity}
                          </el-form-item>
                          <el-form-item label="邮编" style="margin-bottom:0">
                            {vm.recmendAds.zipcode}
                          </el-form-item>
                          <el-form-item label="地址1" style="margin-bottom:0">
                            {vm.recmendAds.addressStreet}
                          </el-form-item>
                          <el-form-item label="地址2" style="margin-bottom:0">
                            {vm.recmendAds.addressOther}
                          </el-form-item>
                        </el-form>
                      </el-col>
                    </el-row>
                  </div>
                  <el-button
                    slot="reference"
                    type="text"
                    icon="danger el-icon-warning"
                    class="danger"
                  >
                    {remark}
                  </el-button>
                </el-popover>
              )
            }
            return <span class="info">{remark}</span>
          }
        }
      ]
    }
  },
  computed: {
    ...mapState(['userInfo', 'ipCase']),
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
    },
    uploadConfig() {
      let param = this.importData.list.map(el => ({
        ...el,
        categoryId: el.categoryId ? el.categoryId.slice(0).pop() : null
      }))

      param = JSON.stringify(param)

      return {
        url: CONST_PORT_CONFIG.BASE_URL + 'Account/importData',
        headers: {
          token: this.token
        },
        data: {
          token: this.token,
          param
        }
      }
    },
    uploadRecordConfig() {
      return {
        url: CONST_PORT_CONFIG.BASE_URL + 'TaskStatisticsSupplement/importData',
        headers: {
          token: this.token
        },
        data: {
          token: this.token
          // accountId: this.selectRecordActId
        }
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
        // if (val.dockerFlag) {
        //   opts.push(browsers[1])
        // }
        // if (val.vmFlag) {
        //   opts.push(browsers[2])
        // }
        let broF = this.addFields.find(el => el.name === 'browserMode')
        let index = this.addFields.findIndex(el => el.name === 'browserMode')
        broF.options = opts
        this.addFields.splice(index, 1, broF)
      }
    }
  },
  methods: {
    // ...mapActions(['getIpCase']),
    clickLogin(scope, value) {
      let vm = this
      let { accountId } = scope.row
      this.$confirm('是否执行登录操作？', '警告', {
        type: 'warning'
      })
        .then(() => {
          vm.$api[`main/accountLogin`]({ accountId })
            .then(data => {
              let { host, port, proxyAccount, proxyPassword } = data.rows,
                params,
                requestUrl
              switch (value) {
                case '普通登录':
                  vm.$message.success(data.msg)

                  data.rows.url = data.rows.url
                  data.rows.port = port
                  data.rows.proxyAccount = proxyAccount
                  data.rows.proxyPassword = proxyPassword
                  data.rows.host = host
                  params = ''
                  for (const key in data.rows) {
                    if (data.rows.hasOwnProperty(key)) {
                      const element = data.rows[key]
                      params += `${key}=${encodeURIComponent(element)}&`
                    }
                  }
                  requestUrl = 'http://localhost:9008/client/openWeb?' + params
                  // eslint-disable-next-line no-unused-vars
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
    },
    btnFn(row) {
      let btns = [8]
      let {
        browserMode,
        browserFlag,
        accountType,

        status,
        registerStatus,
        registerFlag,
        autoRegisterFlag,
        expireDay
      } = row
      // if (
      //   this.$store.state.userInfo.superFlag &&
      //   (row.status === 1 &&
      //     row.terminalType == 3 &&
      //     (row.expireDay == null || row.expireDay <= 0))
      // ) {
      //   if (browserMode === 0) {
      //     btns.push(browserMode)
      //   }
      //   if (browserMode === 1) {
      //     btns.push(browserMode)
      //   }
      //   if (browserMode === 2) {
      //     if (browserFlag === 0) {
      //       btns.push(browserMode)
      //     }
      //   }
      // }

      if (
        row.status === 1 &&
        row.browserFlag === 1 &&
        // row.accountType === 1 &&
        row.browserMode !== 0 &&
        (row.expireDay == null || row.expireDay <= 0)
      ) {
        btns.push(3)
      }

      if (
        !!row.snapshotImage &&
        (row.expireDay == null || row.expireDay <= 0)
      ) {
        btns.push(4)
      }
      /* 第一层筛选，账号类型为手动，浏览器打开方式是直接打开时，没有自动注册功能；其他的会有自动注册功能
              第二层筛选，账号状态是未激活或激活中或终止时不显示“自动注册”按钮
              第三层筛选，账号状态是正常或暂停时，注册状态是未注册和注册失败时显示“自动注册”按钮 */
      if (
        ((expireDay <= 0 &&
          autoRegisterFlag === 1 &&
          (status === 1 || status === 2) &&
          (registerStatus === 0 || registerStatus === 3)) ||
          (status === 1 &&
            registerFlag === 0 &&
            (registerStatus === 0 || registerStatus === 3))) &&
        !(accountType == 0 && browserMode == 0)
      ) {
        btns.push(5)
      }

      if (row.orderId !== null) {
        btns.push(6)
      }
      if (row.status === 1 && (row.expireDay == null || row.expireDay <= 0)) {
        btns.push(7)
      }

      return btns
    },
    getTermCode(val) {
      let item = this.addFields.find(el => el.name === 'terminalCode')
      if (!this._tList) {
        this._tList = {}
      }
      if (!this._tList[val]) {
        this.$api[`main/accountTerminalList`]({ terminalType: val }).then(
          data => {
            item.options = this._tList[val] = data.rows.map(el => ({
              label: el.terminalCode,
              value: el.terminalCode
            }))
          }
        )
      } else {
        item.options = this._tList[val]
      }
    },
    getRateRule(item, index, list) {
      let validator = (rule, value, cb) => {
        let total = list.reduce((total, cur) => (total += cur.rate), 0)
        this.$refs.importForm.clearValidate(
          list.map((el, i) => {
            if (i == index) {
              return
            }
            return `list.${i}.rate`
          })
        )
        if (total !== 100) {
          cb(new Error(`占比总和必须是100`))
        }
      }
      return [
        {
          required: true,
          message: '请输入占比 '
        },
        {
          validator
        }
      ]
    },
    getAdds(row) {
      let params = { relateId: row.accountId }
      this.$set(row, '_loading', true)
      this.$api[`main/addressInfoAccount`](params)
        .then(data => {
          row._loading = false
          this.recmendAds = data.rows
        })
        .catch(() => {
          row._loading = false
        })
    },
    getCateRule() {
      let vm = this
      const validator = (rule, value, cb) => {
        if (
          vm.importData.list.find(
            el =>
              el.categoryId.slice(0).pop() === value.slice(0).pop() &&
              el.categoryId !== value
          )
        ) {
          cb(new Error('不能选择同一类目'))
        }
        cb()
      }
      return [{ required: true, message: '请选择类目' }, { validator }]
    },
    handlePlus(item, index) {
      this.importData.list.splice(index + 1, 0, {
        categoryId: [],
        rate: undefined,
        reuseType: null
      })
    },
    handleMinus(item, index) {
      this.importData.list.splice(index, 1)
    },
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
        .then(() => {
          vm.handleCopy(text)
        })
        .catch(() => {})
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
      // this.getIpCase()
    },
    getPriceRangeList() {
      this.$api[`main/ipPricePriceRange`]({})
        .then(data => {
          this.priceRangeList = data
        })
        .catch(() => {})
    },
    cellClassNameFunc({ row, column }) {
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
      if (scope.row._list) {
        return
      }
      let { accountId } = scope.row
      this.$set(scope.row, '_list', [])
      this.$api[`main/accountListCategory`]({ accountId })
        .then(data => {
          this.$set(scope.row, '_list', data)
        })
        .catch(() => {})
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
        .then(() => {
          // this.activateAccountLoading = false
          // this.$refs.lay.handleSearch()
          this.$router.push({ name: 'order' })
          return Promise.resolve(true)
        })
        .catch(() => {
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
        .catch(() => {
          this.activateAccountLoading = false
        })
    },
    handlePriceClick() {
      this.PriceDialogVisible = true
      this.getPriceRangeList()
    },
    handleTableSelectionChange(val) {
      let vm = this
      // console.log(val);
      if (!val.length) {
        this.activateFormData.ipCount = undefined
        this.activateFormData.needPay = undefined
        this.activateFormData.price = undefined
        return
      }
      let num = val.length,
        _n

      if (num <= this.ipCase.ipUsableTotal) {
        _n = 0
      } else {
        this.priceRangeList.forEach(element => {
          if (
            element.buyQuantity + vm.ipCase.ipUsableTotal > val.length - 1 &&
            !_n
          ) {
            _n = element.buyQuantity
          }
        })
      }

      console.log(_n)
      this.$set(this.activateFormData, 'ipCount', _n || 0)
    },
    downloadTemp() {
      this.$api[`main/accountExportTemplate`]({})
        .then(data => {
          download(data, '账号导入模板.xls')
        })
        .catch(() => {})
    },
    downloadRecordTemp() {
      this.$api[`main/taskStatisticsSupplementExportTemplate`]({})
        .then(data => {
          download(data, '账号操作记录导入模版.xls')
        })
        .catch(() => {})
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
        this.$confirm('终止后，账号不可再用，是否继续？', '警告', {
          type: 'error'
        })
          .then(() => {
            this.$api[`main/accountUpdateStatus`](params)
              .then(() => {
                this.refreshData()
              })
              .catch(() => {})
          })
          .catch(() => {})
        return
      }

      this.$api[`main/accountUpdateStatus`](params)
        .then(() => {
          this.refreshData()
        })
        .catch(() => {})
    },
    setAddDisabled(disabled = false, index) {
      let accountEl
      accountEl = this.addFields[index]
      if (!index) {
        accountEl = this.addFields.find(el => el.name === 'status')
        index = this.addFields.findIndex(el => el.name === 'status')
      }
      accountEl.disabled = disabled
      this.addFields.splice(index, 1, accountEl)
    },

    addPercent() {
      if (this.percentage === 100 || this.percentStats == 'exception') {
        // this.percentStats = 'success'
        clearInterval(this.timer)
        return
      }
      this.percentage += 1
    },

    startPercent() {
      if (this.percentage < 100) {
        this.timer = setInterval(() => {
          if (this.percentage === 95 && this.importWrapperLoading) {
            return
          }
          this.addPercent()
        }, 300)
      } else {
        this.percentStats = 'success'
        clearInterval(this.timer)
      }
    },

    handleBeforeUpload() {
      // return true
      if (this.isValidSuccess()) {
        this.showPercent = true
        this.percentage = 0
        this.percentStats = undefined
        this.importWrapperLoading = true
        this.startPercent()
        return true
      } else {
        this.$message.warning('请填写完整再上传')
        return false
      }
    },

    isValidSuccess() {
      let { importForm } = this.$refs
      if (!importForm) {
        return
      }
      importForm.validate()
      let validSuccess = importForm.fields.every(field => {
        return (
          !formUtils.isEmpty(field.fieldValue) &&
          field.validateState !== 'error'
        )
      })
      // this.$emit('update:validSuccess', validSuccess)
      return validSuccess
    },

    handleOnSuccess(res) {
      this.importWrapperLoading = false
      let { msg: message, code } = res
      if (code !== 0) {
        this.percentStats = 'exception'
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
      this.percentage = 100
      this.percentStats = 'success'
      this.$notify({
        title: '上传成功',
        dangerouslyUseHTMLString: true,
        message,
        duration: 3000,
        type: 'success'
      })
      setTimeout(() => {
        this.importDialogOptions.visible = false
        this.$refs.lay.handleSearch()
      }, 240)
    },
    handleLeftBatchChange(val) {
      if (val[0] === '删除') {
        let data = this.checked()
        if (data) {
          data = data.map(el => ({ accountId: el.accountId }))
        } else {
          return
        }
        this.handleDel(data)
      }
      if (val[0] === '重新激活账号') {
        this.reActive()
      }
      if (val[0] === '修改状态') {
        this.handleCommand(val[1])
      }
    },
    reActive() {
      let data = this.checked()
      if (!data) {
        return
      }

      data = data.filter(el => {
        if ((el.status === 1 || el.status === 2) && el.expireDay <= 0) {
          return true
        }
      })

      if (data.length) {
        this.commonOpts.data.list = data
        this.toggleDialog({
          visible: true,
          title: '重新激活账号',
          name: 'Reactive'
          // height: '560px'
        })
      } else {
        this.$message.warning('请选择状态为正常或暂停且未过期的账号')
      }
    },
    handleRecordOnSuccess(res) {
      this.importWrapperLoading = false
      let { msg: message, code } = res
      if (code !== 0) {
        this.notifyVm = this.$notify({
          title: '导入失败',
          dangerouslyUseHTMLString: true,
          message,
          type: 'error',
          customClass: 'customErrorNotify',
          duration: 3000
        })
        return
      }
      this.$notify({
        title: '导入成功',
        dangerouslyUseHTMLString: true,
        message,
        duration: 3000,
        type: 'success'
      })
      this.importDialogOptions.visible = false
      this.$refs.lay.handleSearch()
    },

    handleOnError(err) {
      this.percentStats = 'exception'
      this.importWrapperLoading = false
      this.$message.error(err.message)
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
            vm.getTermCode(data.rows.terminalType)
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
            let statusSelect = vm.addFields.find(el => el.name === 'status')
            let index = vm.addFields.findIndex(el => el.name === 'status')
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
                vm.addFields.splice(index, 1, statusSelect)
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
                vm.addFields.splice(index, 1, statusSelect)
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
                vm.addFields.splice(index, 1, statusSelect)
                break

              case 3:
                statusSelect.options = [
                  {
                    label: '终止',
                    value: 3
                  }
                ]
                vm.addFields.splice(index, 1, statusSelect)
                break

              case 4:
                statusSelect.options = [
                  {
                    label: '激活中',
                    value: 4
                  }
                ]
                vm.addFields.splice(index, 1, statusSelect)
                break

              default:
                break
            }

            vm.$refs.add.setData(rows)
          })
          .catch(() => {})
      })
    },
    searchFunc(data) {
      let { registerDate, ...info } = data
      let [queryStartRegisterDate, queryEndRegisterDate] = registerDate || []
      return {
        ...info,
        queryStartRegisterDate,
        queryEndRegisterDate
      }
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
            .then(() => {
              vm.$refs.lay.handleSearch()
            })
            .catch(() => {})
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

    handleTreeCurrentChange(data) {
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
    this._tList = null
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
