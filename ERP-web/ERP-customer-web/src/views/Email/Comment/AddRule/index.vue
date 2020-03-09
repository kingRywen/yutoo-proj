<template>
  <div class="add-strategy">
    <yt-dialog :options="options" :events="dialogEvents">
      <el-form class="search-top-form dialog-form" :model="form" ref="ruleForm" :key="indexKey">
        <div>规则信息</div>
        <el-table :data="tableData" style="width: 100%" border class="rule-top">
          <el-table-column label="对应账号" width="272" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item
                size="small"
                prop="emailAccountId"
                class="must-height"
                :rules="[
                  { required: true, message: '请选择账号'}
                ]"
              >
                <el-select v-model="form.emailAccountId" placeholder="来源渠道">
                  <el-option v-for="item in emailAccountList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="邮件规则名称" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item
                class="must-height"
                size="small"
                prop="ruleName"
                :rules="[
                  { required: true, message: '请输入规则名称'},
                  {min: 1, max: 40, message: '长度在 1 到 40 个字符'}
                ]"
              >
                <el-input class="rule-name" v-model="form.ruleName" style="width: 480px"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="优先级" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item
                class="must-height"
                size="small"
                prop="priority"
                :rules="[
                { required: true, message: '优先级不能为空'}
              ]"
              >
                <el-input class="rule-name" type="number" v-model="form.priority" style="width: 480px"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-top14s must-fill-sign-div">规则可选条件</div>
        <div>
          <!-- 选择规则 -->
          <rule-chose
            ref="ruleAdd"
            :isEdit="isEdit"
            @dataChange="el => ruleChoses = el"
            :emailAccountId="form.emailAccountId"
            :ruleForm="ruleChoses"
          ></rule-chose>
          <div class="table-top14s must-fill-sign-div">同时满足以上条件时，执行以下操作</div>
          <el-table :data="tableData1" style="width: 100%" border class="must-table">
            <el-table-column prop="name" label="操作类型" label-class-name="must-fill-sign">
              <template slot-scope="scope">
                <el-form-item
                  size="small"
                  class="channel-input input-wrap-layout"
                  v-if="scope.row.value == '分配自定义分类'"
                >分配自定义分类</el-form-item>
                <el-form-item
                  class="must-height"
                  v-if="scope.row.value == '选择分类'"
                  size="small"
                  prop="operateType"
                  :rules="[
                  { required: true, message: '请选择分类'}
                ]"
                >
                  <el-select class v-model="form.operateType">
                    <el-option label="分配客服" :value="1"></el-option>
                    <el-option label="自动回复" :value="2"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  size="small"
                  class="channel-input input-wrap-layout"
                  v-if="scope.row.value == '标记订单状态'"
                >标记订单状态</el-form-item>
              </template>
            </el-table-column>
            <el-table-column prop="ruleName" label="值" label-class-name="must-fill-sign">
              <template slot-scope="scope">
                <!-- 树形分类 -->
                <el-form-item
                  class="must-height"
                  size="small"
                  prop="emailClassificationId"
                  v-if="scope.row.value2 == '分配自定义分类'"
                  :rules="[
                  { required: true, message: '请选择自定义分类'}
                ]"
                >
                  <tree-btn
                    @close="handleEmailClassificationId"
                    :text="'分类'"
                    :value="emailClassificationData.value"
                    class="tree-btns"
                  ></tree-btn>

                  <el-input v-model="form.emailClassificationId" class="tree-input"></el-input>
                </el-form-item>
                <el-form-item size="small" v-if="form.operateType === 2 && scope.row.value2 == '选择分类'">
                  <div>自动回复</div>
                </el-form-item>
                <el-form-item
                  size="small"
                  v-if="form.operateType === 1 && scope.row.value2 == '选择分类'"
                  class="must-height"
                  prop="serviceId"
                  :rules="[
                  { required: true, message: '请选择客服'}
                ]"
                >
                  <el-select v-model="form.serviceId">
                    <el-option v-for="item in serviceList" :label="item.label" :value="item.value" :key="item.id"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item size="small" v-if="scope.row.value2 == '标记订单状态'">
                  <el-select v-model="form.statusType">
                    <el-option label="标记垃圾邮件" :value="1"></el-option>
                    <el-option label="标记不需要回复" :value="2"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-row class="form-row select-input">
            <el-col :span="2">
              <el-form-item prop="activateFlag">
                <el-checkbox :true-label="1" :false-label="0" class="isChecked" v-model="form.activateFlag">是否激活</el-checkbox>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item class="saveBtn mar10" label-width="0px">
            <el-button size="small" type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </yt-dialog>
  </div>
</template>

<script>
import RuleChose from '../RuleChose/index'
import { mapActions, mapState } from 'vuex'
let defaultData = {
  senderFlag: true,
  senderList: true,
  senderSuffixFlag: true,
  senderSuffixList: true,
  receiverFlag: true,
  receiver: true,
  subjectFlag: true,
  subjectList: true,
  orderNumSystemFlag: true,
  orderNumSystemList: true,
  orderNumPlatformFlag: true,
  orderNumPlatformList: true,
  customerIdFlag: true,
  customerIdList: true,
  receiveTimeStart: true,
  receiveTimeEnd: true,
  productSkuFlag: true,
  productSkuList: true,
  productCategoryFlag: true,
  productCategoryList: true,
  blackListFlag: true,
  contentFlag: true,
  content: true,
  paymentTime: true,
  serviceFlag: true,
  serviceList: true,
  nationFlag: true,
  nationList: true,
  checkList: true
}
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    isEditTitle: {
      type: String,
      default: '添加'
    },
    isEdit: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    ruleForm: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      ruleChoses: {},
      indexKey: null,
      dialogEvents: {
        open: () => {
          this.indexKey = Math.random()
        },
        close: () => {
          this.$emit('formSubmit')
        }
      },
      loading: false,
      form: {},
      tableData1: [
        {
          value: '分配自定义分类',
          value2: '分配自定义分类'
        },
        {
          value: '选择分类',
          value2: '选择分类'
        },
        {
          value: '标记订单状态',
          value2: '标记订单状态'
        }
      ],
      tableData: [{}],
      emailAccountList: [],
      emailClassificationData: {},
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
    let vm = this
    vm.getservice()
    vm.$api['email/emailAccountList']()
      .then(data => {
        if (!data || !data.rows) {
          return
        }
        this.emailAccountList = data.rows.map(item => {
          return {
            label: item.nick_name,
            value: item.email_account_id
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  computed: {
    ...mapState('email', ['serviceList'])
  },
  watch: {
    visible: {
      immediate: true,
      deep: true,
      handler(val) {
        this.options.visible = val
        this.options.title = this.isEditTitle
      }
    },
    ruleForm: {
      immediate: true,
      deep: true,
      handler(val) {
        let vm = this
        val = vm.$.deepClone(val)
        vm.form = vm.formChange(val)
        vm.ruleChoses = JSON.parse(JSON.stringify(vm.form))
        for (const key in vm.ruleChoses) {
          if (vm.ruleChoses.hasOwnProperty(key)) {
            if (!defaultData[key]) {
              delete vm.ruleChoses[key]
            }
          }
        }
        vm.emailClassificationData = {
          value: vm.form.emailClassificationId,
          label: vm.form.emailClassificationName
        }
      }
    }
  },
  methods: {
    ...mapActions('email', ['getservice']),
    handleSubmit() {
      let vm = this
      vm.loading = true
      vm.$refs['ruleForm'].validate(valid => {
        if (valid) {
          vm.form.priority = Number(vm.form.priority)
          let ruleData = vm.$refs.ruleAdd.getFromData()
          if (!ruleData) {
            this.$message.error('请选择规则可选条件')
            vm.loading = false
            return
          }
          vm.form = Object.assign({}, vm.form, ruleData)
          let _data = vm.$.deepClone(vm.form)
          if (!_data.activateFlag) {
            _data.activateFlag = 0
          }
          vm.$api['email/emailRuleSave'](_data)
            .then(() => {
              this.options.visible = false
              vm.loading = false
            })
            .catch(() => {
              vm.loading = false
            })
        } else {
          vm.loading = false
          return false
        }
      })
    },
    handleEmailClassificationId(data) {
      this.$set(this.form, 'emailClassificationId', null)
      this.$set(this.form, 'emailClassificationName', null)
      if (data && data.length) {
        this.emailClassificationData = data[0]
        this.$set(this.form, 'emailClassificationId', data[0].value)
        this.$set(this.form, 'emailClassificationName', data[0].label)
      }
      this.$refs.ruleForm.validateField('emailClassificationId', error => {
        if (error) {
          console.log(error)
        }
      })
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
    formChange(forms) {
      let vm = this
      let form = vm.$.deepClone(forms)
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
      } else {
        form.productSkuList = []
      }
      if (form.productCategoryList) {
        form.productCategoryList = vm.getArr(form.productCategoryList)
        vm.categoryList = form.productCategoryList
          .map(item => {
            return item.label
          })
          .join()
      } else {
        form.productCategoryList = []
      }
      if (form.nationList) {
        form.nationList = vm.getArr(form.nationList)
        vm.nationalList = form.nationList
          .map(item => {
            return item.label
          })
          .join()
      } else {
        form.nationList = []
      }
      if (form.serviceList) {
        form.serviceList = vm.getArr(form.serviceList)
      } else {
        form.serviceList = []
      }
      if (typeof form.checkList == 'string') {
        form.checkList = vm.getArr(form.checkList)
      } else {
        form.checkList = []
      }
      if (form.paymentTimeStart && form.paymentTimeEnd) {
        vm.$set(form, 'paymentTime', [
          form.paymentTimeStart,
          form.paymentTimeEnd
        ])
      }
      return form
    }
  },
  components: {
    RuleChose
  }
}
</script>

<style lang="scss">
.add-strategy {
  .rule-top {
    td {
      padding: 0 !important;
    }
  }
  .tree-btns {
    position: absolute;
    z-index: 2;
  }
  .tree-input {
    width: 20px;
    opacity: 0;
  }
  .must-height {
    height: 48px;
    margin-top: 10px;
    padding: 0;
  }
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
    line-height: 33px;
    border: 1px solid #a3edff;
    border-radius: 4px;
    width: 53%;
    display: inline-block;
    position: absolute;
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

  .table-top14s {
    margin: 30px 0 20px 0;
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
  .rule-name {
    width: 566px;
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
}
</style>
