<template>
  <div class="add-strategy">
    <yt-dialog :options="options" :events="events">
      <el-form class="search-top-form dialog-form" :key="indexKey">
        <template v-if="!defaultType">
          <div style="margin: 20px 0;">规则信息</div>
          <el-table :data="tableData" style="width: 100%" border class="table-top14">
            <el-table-column prop="storeId" label="订单来源" label-class-name="must-fill-sign" width="180">
              <template slot-scope="scope">
                <el-form-item size="small" class="channel-input">
                  <el-select v-model="autoForm.storeId" placeholder="来源渠道">
                    <el-option v-for="item in storeIdList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="policyName" label="邮件规则名称" label-class-name="must-fill-sign" width="350">
              <template slot-scope="scope">
                <el-form-item size="small">
                  <el-input class="rule-name" v-model="autoForm.policyName"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="effectiveTime" label="有效期" label-class-name="must-fill-sign">
              <template slot-scope="scope">
                <el-form-item label>
                  <el-date-picker
                    v-model="autoForm.effectiveTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    size="small"
                    type="datetimerange"
                    :picker-options="pickerOptions2"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    align="right"
                  ></el-date-picker>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="priority" label="优先级" width="340" label-class-name="must-fill-sign">
              <template slot-scope="scope">
                <el-form-item size="small">
                  <el-input type="number" v-model="autoForm.priority"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-top14s must-fill-sign-div">规则可选条件</div>
          <div class="chose-rule" v-for="(ruleForm, index) in replyConditionsEntityList" :key="ruleForm.id">
            <!-- 規則添加 -->
            <simple-form
              :ref="'ruleAdd'+index"
              :ruleform="ruleForm"
              @ruleClose="ruleClose(index)"
              :storeId="autoForm.storeId"
              @dataChange="el=>replyConditionsEntityList[index]=el"
            ></simple-form>
            <!--  -->
          </div>
          <div>
            <el-button icon="el-icon-plus" class="addbtn-big martop marleft10" @click.stop="addRuleForm"></el-button>
          </div>
        </template>
        <div>
          <div v-if="!defaultType" class="table-top14s send-email">满足以上条件，自动回复</div>
          <el-table :data="tableData1" style="width: 100%;border-top: none;" border class="must-table">
            <el-table-column prop="name" label="模板内容" label-class-name="must-fill-sign">
              <template slot-scope="scope">
                <el-form-item size="small">
                  <!-- 选择模板 -->
                  <chose-template
                    :show-error="!defaultType"
                    @choseData="choseData"
                    :platformIds="[platformId]"
                    :classifyType="2"
                  ></chose-template>
                  <div>
                    <UeEditor v-model="autoForm.content" ref="editor" :config="editorConfig"/>
                  </div>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="替换标签" width="240">
              <template slot-scope="scope">
                <el-form-item size="small">
                  <copy-btn :vertical="true" @btnInput="btnInput"></copy-btn>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="form-row select-input" v-if="!defaultType">
            <el-col :span="2">
              <el-checkbox :true-label="1" :false-label="0" class="isChecked" v-model="autoForm.activateFlag">是否激活</el-checkbox>
            </el-col>
          </el-row>
          <el-form-item class="saveBtn mar10" label-width="0px">
            <el-button size="small" type="primary" @click="handleSubmit">保存</el-button>
            <el-button size="small" type="primary" @click.stop="$emit('formSubmit')">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </yt-dialog>
  </div>
</template>

<script>
import SimpleItem from './SimpleItem'
import CopyBtn from '../../Comment/CopyBtn'
import SimpleForm from './SimpleForm'
import { mapActions, mapState } from 'vuex'
let defaultValue = [
  '发件域',
  '平台订单号',
  '黑名单',
  '订单付款时间',
  '主题',
  '客服人员',
  '订购产品包含SKU',
  '收件时间',
  '系统订单号',
  '发件人',
  '收件人',
  '客户ID',
  '订购产品包含类别',
  '内容',
  '国家缩写'
]
export default {
  props: {
    // 是否默认回复模板
    defaultType: {
      type: Boolean,
      default: false
    },
    forms: {
      type: Object,
      default: () => {
        return {}
      }
    },
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    // let vm = this
    return {
      indexKey: null,
      events: {
        open: () => {
          this.indexKey = Math.random()
        },
        close: () => {
          this.$emit('formSubmit')
          this.$emit('update:defaultType', false)
        }
      },
      loading: false,
      selectValue: [],
      pickerOptions2: {
        disabledDate(time) {
          return time.getTime() + 24 * 3600 * 1000 < Date.now()
        },
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
              picker.$emit('pick', [start, end])
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date()
              const start = new Date()
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
              picker.$emit('pick', [start, end])
            }
          }
        ]
      },
      autoForm: {
        storeId: null,
        content: ''
      },
      context: '',
      editorConfig: {
        initialFrameHeight: 200,
        initialFrameWidth: 1030
      },
      selectClassify: '',
      tableData1: [
        {
          value: '分配自定义分类',
          value2: '分配自定义分类'
        }
      ],
      tableData: [{}],
      emailAccountList: [],
      replyConditionsEntityList: [{}],
      platformId: 0,
      verificationFlag: true,
      options: {
        visible: false,
        title: '添加',
        width: '1350px',
        fullscreen: false,
        top: '20vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: false,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      }
    }
  },
  created() {
    this.getStoreId()
  },
  mounted() {},
  computed: {
    ...mapState('product', ['storeIdList'])
  },
  watch: {
    defaultType(val) {
      if (val) {
        this.options.title = '默认模板设置'
      } else {
        this.options.title = '添加'
      }
    },
    visible: {
      immediate: true,
      handler(val) {
        this.options.visible = val
      }
    },
    'autoForm.storeId'(val) {
      let vm = this
      if (val && vm.storeIdList && vm.storeIdList.length) {
        vm.platformId =
          vm.storeIdList.find(el => el.value == val).platformId || 0
      }
    },
    forms: {
      immediate: true,
      deep: true,
      handler(val) {
        let vm = this
        val = JSON.parse(JSON.stringify(val))
        vm.autoForm = val

        if (
          !vm.autoForm.replyConditionsEntityList ||
          !vm.autoForm.replyConditionsEntityList.length
        ) {
          vm.$set(vm.replyConditionsEntityList, 0, {})
        } else {
          console.log(vm.autoForm)

          let autoForm = JSON.parse(JSON.stringify(vm.autoForm))
          vm.replyConditionsEntityList = autoForm.replyConditionsEntityList.map(
            item => {
              return vm.formChange(item)
            }
          )
        }
        if (vm.autoForm.effectiveTimeStart && vm.autoForm.effectiveTimeEnd) {
          vm.$set(vm.autoForm, 'effectiveTime', [
            vm.autoForm.effectiveTimeStart,
            vm.autoForm.effectiveTimeEnd
          ])
        }
        if (!vm.autoForm.storeId) {
          vm.$set(vm.autoForm, 'storeId', null)
        }
      }
    }
  },
  methods: {
    ...mapActions('product', ['getStoreId']),
    handleSubmit() {
      let vm = this
      this.loading = true
      let autoForm = JSON.parse(JSON.stringify(vm.autoForm))
      autoForm.replyConditionsEntityList = JSON.parse(
        JSON.stringify(vm.replyConditionsEntityList)
      ).map(item => {
        let data = item
        let checkList = item.checkList
        defaultValue.map(el => {
          if (checkList.indexOf(el) < 0) {
            vm.selected(el, data)
          }
        })
        return vm.formTurn(data)
      })
      if (autoForm.effectiveTime && autoForm.effectiveTime) {
        autoForm.effectiveTimeStart = autoForm.effectiveTime[0]
        autoForm.effectiveTimeEnd = autoForm.effectiveTime[1]
        delete autoForm.effectiveTime
      }
      if (autoForm.priority) {
        autoForm.priority = Number(autoForm.priority)
      }
      if (!autoForm.activateFlag) {
        autoForm.activateFlag = 0
      }
      vm.getVerification(autoForm)
      if (!vm.verificationFlag) {
        vm.loading = false
        return
      }
      vm.$api[
        !vm.defaultType
          ? 'email/replySave'
          : 'email/emailReplyPolicyDefaultSave'
      ](
        !vm.defaultType
          ? autoForm
          : { content: vm.autoForm.content, templateId: vm.autoForm.templateId }
      )
        .then(() => {
          vm.options.visible = false
          // vm.loading = false
        })
        .catch(() => {
          // vm.loading = false
        })
    },
    getVerification(form) {
      let vm = this
      vm.verificationFlag = false
      if (!this.defaultType) {
        if (!form.storeId) {
          this.verification('请选择订单来源')
          return
        }
        if (!form.policyName) {
          this.verification('请输入邮件规则名称')
          return
        }
        if (!form.effectiveTimeStart || !form.effectiveTimeEnd) {
          this.verification('请选择有效期')
          return
        }
        if (!form.priority) {
          this.verification('请选择优先级')
          return
        }
        if (form.priority > 10 || form.priority < 0) {
          this.verification('请输入0-10以内的优先级')
          return
        }
        if (
          !vm.replyConditionsEntityList[0] ||
          !vm.replyConditionsEntityList[0].checkList ||
          !vm.replyConditionsEntityList[0].checkList.length
        ) {
          this.verification('请选择规则可选条件')
          return
        }
      }

      if (!form.content) {
        this.verification('请输入模板内容')
        return
      }
      vm.verificationFlag = true
    },
    verification(msg) {
      let vm = this
      vm.$message({
        dangerouslyUseHTMLString: true,
        type: 'error',
        message: `<strong>${msg}</strong>`
      })
    },
    addRuleForm() {
      let vm = this
      let index = vm.replyConditionsEntityList.length - 1
      if (
        !vm.replyConditionsEntityList[index].checkList ||
        !vm.replyConditionsEntityList[index].checkList.length
      ) {
        return
      }
      vm.replyConditionsEntityList.push({
        checkList: []
      })
    },
    selected(val, form) {
      val = JSON.parse(JSON.stringify(val))
      switch (val) {
        case '发件人':
          form.senderFlag = null
          form.senderList = null
          break
        case '发件域':
          form.senderSuffixFlag = null
          form.senderSuffixList = null
          break
        case '收件人':
          form.receiverFlag = null
          form.receiver = null
          break
        case '主题':
          form.subjectFlag = null
          form.subjectList = null
          break
        case '系统订单号':
          form.orderNumSystemFlag = null
          form.orderNumSystemList = null
          break
        case '平台订单号':
          form.orderNumPlatformFlag = null
          form.orderNumPlatformList = null
          break
        case '客户ID':
          form.customerIdFlag = null
          form.customerIdList = null
          break
        case '收件时间':
          form.receiveTimeStart = null
          form.receiveTimeEnd = null
          break
        case '黑名单':
          form.blackListFlag = null
          break
        case '订购产品包含类别':
          form.productCategoryFlag = null
          form.productCategoryList = null
          break
        case '订购产品包含SKU':
          form.productSkuFlag = null
          form.productSkuList = null
          break
        case '内容':
          form.contentFlag = null
          form.content = null
          break
        case '客服人员':
          form.serviceFlag = null
          form.serviceList = null
          break
        case '订单付款时间':
          form.paymentTime = null
          form.paymentTimeStart = null
          form.paymentTimeEnd = null
          break
        case '国家缩写':
          form.nationFlag = null
          form.nationList = null
          break
      }
    },
    getForm() {
      let vm = this
      let replyConditionsEntityList = JSON.parse(
        JSON.stringify(vm.replyConditionsEntityList)
      ).map((item, index) => {
        return vm.$refs['ruleAdd' + index][0].getForm()
      })
      return replyConditionsEntityList
    },
    ruleClose(index) {
      let vm = this
      if (vm.replyConditionsEntityList.length === 1) {
        return
      }
      vm.replyConditionsEntityList.splice(index, 1)
    },
    btnInput(item) {
      let vm = this
      vm.$refs.editor.setStr(item)
    },
    formChange(form) {
      let vm = this
      if (form.senderList) {
        form.senderList = vm.getArr(form.senderList).join()
      }
      if (form.senderSuffixList) {
        form.senderSuffixList = vm.getArr(form.senderSuffixList).join()
      }
      if (form.orderNumSystemList) {
        form.orderNumSystemList = vm.getArr(form.orderNumSystemList).join()
      }
      if (form.orderNumPlatformList) {
        form.orderNumPlatformList = vm.getArr(form.orderNumPlatformList).join()
      }
      if (form.subjectList) {
        form.subjectList = vm.getArr(form.subjectList).join()
      }
      if (form.customerIdList) {
        form.customerIdList = vm.getArr(form.customerIdList).join()
      }

      if (form.productSkuList) {
        form.productSkuList = vm.getArr(form.productSkuList)
        vm.skuList = form.productSkuList
          .map(item => {
            return item.label
          })
          .join()
      }
      if (form.productCategoryList) {
        form.productCategoryList = vm.getArr(form.productCategoryList)
        vm.categoryList = form.productCategoryList
          .map(item => {
            return item.label
          })
          .join()
      }

      if (form.nationList) {
        form.nationList = vm.getArr(form.nationList)
        vm.nationalList = form.nationList
          .map(item => {
            return item.label
          })
          .join()
      }
      if (form.serviceList) {
        form.serviceList = vm.getArr(form.serviceList)
      }
      if (form.checkList) {
        form.checkList = vm.getArr(form.checkList)
      }
      if (form.paymentTimeStart && form.paymentTimeEnd) {
        vm.$set(form, 'paymentTime', [
          form.paymentTimeStart,
          form.paymentTimeEnd
        ])
      }

      return form
    },
    formTurn(form) {
      if (form.checkList) {
        form.checkList = this.getArrString(form.checkList)
      } else {
        delete form.checkList
      }
      if (form.senderList) {
        form.senderList = this.getArrString(form.senderList)
      } else {
        form.senderList
      }
      if (form.senderSuffixList) {
        form.senderSuffixList = this.getArrString(form.senderSuffixList)
      } else {
        delete form.senderSuffixList
      }
      if (form.orderNumSystemList) {
        form.orderNumSystemList = this.getArrString(form.orderNumSystemList)
      } else {
        delete form.orderNumSystemList
      }
      if (form.subjectList) {
        form.subjectList = this.getArrString(form.subjectList)
      } else {
        delete form.subjectList
      }
      if (form.orderNumPlatformList) {
        form.orderNumPlatformList = this.getArrString(form.orderNumPlatformList)
      } else {
        delete form.orderNumPlatformList
      }
      if (form.customerIdList) {
        form.customerIdList = this.getArrString(form.customerIdList)
      } else {
        delete form.customerIdList
      }
      if (form.productSkuList) {
        form.productSkuList = this.getArrString(form.productSkuList)
      } else {
        delete form.productSkuList
      }
      if (form.productCategoryList) {
        form.productCategoryList = this.getArrString(form.productCategoryList)
      } else {
        delete form.productCategoryList
      }
      if (form.nationList) {
        form.nationList = this.getArrString(form.nationList)
      } else {
        delete form.nationList
      }
      if (form.serviceList) {
        form.serviceList = this.getArrString(form.serviceList)
      } else {
        delete form.serviceList
      }
      if (Array.isArray(form.paymentTime) && form.paymentTime.length) {
        form.paymentTimeStart = form.paymentTime[0]
        form.paymentTimeEnd = form.paymentTime[1]
        delete form.paymentTime
      }
      return form
    },
    getArr(data) {
      let vm = this
      if (data && typeof data === 'string' && /\[*\]/g.test(data)) {
        return vm.getArr(JSON.parse(data))
      } else if (Array.isArray(data)) {
        return data
      } else if (data && typeof data === 'string' && !/\[*\]/g.test(data)) {
        return vm.getArr(data.split(','))
      }
    },
    getArrString(data) {
      let vm = this
      if (data) {
        if (data && typeof data === 'string') {
          if (/\[*\]/g.test(data)) {
            return data
          } else {
            return vm.getArrString(data.split(','))
          }
        } else if (Array.isArray(data) && data.length) {
          return JSON.stringify(data)
        }
      }
    },
    choseData(data) {
      this.$set(this.autoForm, 'templateId', data.emailTemplateId)
      this.$set(this.autoForm, 'content', data.content)
    }
  },
  components: {
    SimpleItem,
    CopyBtn,
    SimpleForm
  }
}
</script>

<style lang="scss">
.add-strategy {
  .dialog-wrap {
    width: 100%;
    border-top: 1px solid #bbbbbb;
    padding-top: 20px;
  }
  .table2 {
    height: 40px;
    line-height: 40px;
    border: 1px solid #ebeef5;
    box-sizing: border-box;
    padding-left: 10px;
    .el-table .cell {
      padding-left: 0;
    }
  }
  .sign-title {
    border: 1px solid rgb(163, 237, 255);
    border-radius: 4px;
    width: 100px;
    position: absolute;
    display: inline-block;
    top: 11px;
    right: 15px;
    & > span {
      display: block;
      height: 33px;
    }
    .close {
      border: none;
      padding: 5px;
      position: absolute;
      right: 0px;
      top: 10px;
      i {
        font-size: 18px;
      }
    }
  }
  .addbtn {
    padding: 6px;
    i {
      font-size: 20px;
    }
  }
  .addbtn-big {
    padding: 12px;
    i {
      font-size: 22px;
    }
  }

  .must-fill-sign-div {
    @include must-fill-sign;
  }
  .cell.must-fill-sign {
    @include must-fill-sign;
  }
  .el-form-item {
    margin-bottom: 0px;
  }

  .el-form-item__content {
    line-height: 33px;
  }
  .channel-input {
    .el-input {
      width: 160px;
    }
  }
  .filtrate-input {
    padding-left: 18px;
    .el-input {
      width: 130px;
    }
  }
  .warp-input {
    .el-input {
      width: 250px;
    }
  }
  .search-wrap-right {
    padding-left: 18px;
  }
  .table-top14 {
    .rule-name {
      width: 330px;
    }
  }
  .table-top14s {
    margin: 30px 0 20px 0;
  }
  .send-email {
    text-align: center;
    border: 1px solid #f2f2f2;
    color: rgb(0, 202, 67);
    padding: 10px;
    background: #f2f2f2;
  }
  .filtrate-input-time {
    padding-left: 0 !important;
    input {
      width: 120px;
    }
  }

  .condition-table {
    .input-width {
      .el-input {
        width: 426px;
      }
    }
  }
  .isChecked {
    margin-top: 14px;
    padding-left: 0px;
  }
  .must-table {
    .el-table th,
    .el-table td {
      padding: 6px 0 !important;
    }
  }
  .date-space {
    margin: 0 10px;
    width: 80px;
  }
  .chose-rule {
    margin-top: 10px;
    border: 1px solid #ebeef5;
    border-bottom: none;
    .simple-wrap {
      border-top: 1px solid #ebeef5;
      .simple-item {
        border: 1px solid #ebeef5;
        border-top: none;
        border-left: none;
      }
    }
  }
}
</style>
