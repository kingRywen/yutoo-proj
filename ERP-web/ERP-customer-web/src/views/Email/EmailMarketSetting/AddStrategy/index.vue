<template>
  <div class="add-strategy">
    <yt-dialog :options="options" :events="events">
      <el-form class="search-top-form dialog-form" v-model="form" :key="indexKey">
        <div style="margin: 20px 0;">规则信息</div>
        <el-table :data="tableData" style="width: 100%" border class="table-top14">
          <el-table-column prop="name" label="规则名称" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small" class="channel-input1">
                <el-input class="rule-name" v-model="form.name"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column prop="templateType" label="模板类型" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-select size="small" v-model="form.templateType" placeholder="请选择">
                <el-option label="索取好评" value="1"></el-option>
                <el-option label="产品推广" value="2"></el-option>
                <el-option label="延迟发货" value="3"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="platformId" label="选择平台" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-select size="small" v-model="form.platformId" multiple placeholder="请选择" collapse-tags>
                <el-option v-for="item in platformList" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="account" label="选择账号" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-select size="small" v-model="form.account" multiple placeholder="请选择" collapse-tags>
                <el-option v-for="item in emailAccountList" :label="item.label" :value="item.value" :key="item.id"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="priority" label="优先级" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small">
                <!-- <el-input v-model="form.priority" type="number"></el-input> -->
                <el-input-number v-model="form.priority" :controls="false" :min="0" :max="10"></el-input-number>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-top14s must-fill-sign-div">规则可选条件</div>
        <!-- 選擇規則 -->
        <div v-for="(ruleForm, index) in ruleListForm" :key="ruleForm.id">
          <simple-form
            @clear="handleClear(index)"
            :forms="ruleForm"
            @dataChange="el => ruleListForm[index]=el"
            :ref="'simpleForm'+index"
          />
        </div>
        <div>
          <el-button icon="el-icon-plus" class="addbtn-big martop marleft10" @click="addRuleForm"></el-button>
        </div>
        <div>
          <div class="table-top14s send-email">满足以上条件，则发送一下邮件</div>
          <el-table :data="tableData1" style="width: 100%" border class="must-table">
            <el-table-column prop="name" label="发送模式">
              <template slot-scope="scope">
                <el-form-item size="small" class="channel-input">
                  <span>定期发送时间：每天</span>
                  <el-select class="mar10" v-model="form.hour" placeholder="请选择">
                    <el-option v-for="item in hour" :label="item" :value="item" :key="item.id"></el-option>
                  </el-select>
                  <span>点</span>
                  <el-select class="mar10" v-model="form.minute" placeholder="请选择">
                    <el-option v-for="item in minute" :label="item" :value="item" :key="item.id"></el-option>
                  </el-select>
                  <span>分</span>
                  <!-- <el-input v-model="form.intervalTime" type="number" class="date-space" placeholder="1-90天内"></el-input> -->
                  <el-input-number
                    v-model="form.intervalTime"
                    :controls="false"
                    :min="1"
                    :max="90"
                    class="date-space"
                    placeholder="1-90天内"
                  ></el-input-number>
                  <span>天内同一个买家只发送一封邮件</span>
                  <span style="color: red">*发送时间为订单所在当地时间</span>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="tableData1" style="width: 100%;border-top: none;" border class="must-table">
            <el-table-column prop="name" label="适用规则">
              <template slot-scope="scope">
                <el-form-item size="small" class="channel-input">
                  <span>此规则适用</span>
                  <el-select class="mar10" v-model="form.rangeTimeStart" placeholder="请选择">
                    <el-option label="过去3天" value="3"></el-option>
                    <el-option label="过去7天" value="7"></el-option>
                    <el-option label="过去10天" value="10"></el-option>
                    <el-option label="过去15天" value="15"></el-option>
                    <el-option label="过去30天" value="30"></el-option>
                  </el-select>
                  <span>前至</span>
                  <el-select class="mar10" v-model="form.rangeTimeEnd" placeholder="请选择">
                    <el-option label="30天内" value="30"></el-option>
                    <el-option label="60天内" value="60"></el-option>
                    <el-option label="90天内" value="90"></el-option>
                  </el-select>
                  <span>的订单</span>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="tableData1" style="width: 100%;border-top: none;" border class="must-table">
            <el-table-column prop="name" label="邮件主题" label-class-name="must-fill-sign">
              <template slot-scope="scope">
                <el-form-item size="small">
                  <el-input v-model="form.subject"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
          <el-table :data="tableData1" style="width: 100%;border-top: none;" border class="must-table">
            <el-table-column prop="name" label="模板内容" label-class-name="must-fill-sign">
              <template slot-scope="scope">
                <el-form-item size="small">
                  <!-- 选择模板 -->
                  <chose-template
                    @choseData="choseData"
                    :templateType="2"
                    :show-error="false"
                    :platformIds="form.platformId"
                    :classifyType="3"
                    :errMsg="'请选择平台'"
                  ></chose-template>
                  <div>
                    <UeEditor v-model="form.content" ref="editor" :config="editorConfig"/>
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
          <el-row class="form-row select-input">
            <el-col :span="2">
              <el-checkbox true-label="1" false-label="0" class="isChecked" v-model="form.activateFlag">是否激活</el-checkbox>
            </el-col>
          </el-row>
          <el-form-item class="saveBtn mar10" label-width="0px">
            <el-button size="small" type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
            <el-button size="small" type="primary" @click="options.visible=false">取消</el-button>
          </el-form-item>
        </div>
      </el-form>
    </yt-dialog>
  </div>
</template>

<script>
import SimpleItem from './SimpleItem'
import SimpleForm from './SimpleForm'
import CopyBtn from '../../Comment/CopyBtn'
import { mapActions, mapState } from 'vuex'
import { isEqual } from 'Utils/tools'
export default {
  props: {
    visible: {
      type: Boolean,
      default: () => {
        return false
      }
    },
    forms: {
      type: Object,
      default: () => {
        return {}
      }
    },
    isEdit: {
      type: Boolean,
      default: () => {
        return false
      }
    }
  },
  data() {
    return {
      oldData: {},
      indexKey: null,
      loading: false,
      context: '',
      editorConfig: {
        initialFrameHeight: 200,
        initialFrameWidth: 1030
      },
      ruleListForm: [{ checkList: [] }],
      form: {
        platformId: [],
        account: []
      },
      deleteFlag: false,
      dialogVisible: false,
      optionsFlag: false,
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
      },
      tableData1: [
        {
          value: '分配自定义分类',
          value2: '分配自定义分类'
        }
      ],
      verificationFlag: true,
      tableData: [{}],
      events: {
        open: () => {
          this.indexKey = Math.random()
        },
        close: () => {
          this.$emit('formSubmit')
        }
      }
    }
  },
  created() {
    let vm = this
    vm.getPlatformList()
    vm.getEmailAccountList()
  },
  watch: {
    visible: {
      immediate: true,
      handler(val) {
        this.options.visible = val
      }
    },
    forms: {
      deep: true,
      immediate: true,
      handler(val) {
        let vm = this
        val = JSON.parse(JSON.stringify(val)) || {}
        let ruleListForm = val.emailMarketConditionsEntities
          ? val.emailMarketConditionsEntities
          : [{}]
        ruleListForm = JSON.parse(JSON.stringify(ruleListForm))
        vm.ruleListForm = ruleListForm.map(item => {
          if (typeof item.checkList === 'string') {
            item.checkList = item.checkList.split(',')
          }
          if (!Array.isArray(item.checkList)) {
            item.checkList = []
          }
          if (typeof item.transports === 'string') {
            item.transports = item.transports.split(',')
          }
          if (typeof item.asin === 'string') {
            item.asin = item.asin.split(',')
          }
          return item
        })
        vm.form = val
        if (typeof vm.form.platformId === 'string') {
          if (!vm.form.platformId.length) {
            vm.form.platformId = []
          } else {
            vm.form.platformId = vm.form.platformId
              .split(',')
              .map(item => Number(item))
          }
        }
        if (typeof vm.form.account === 'string') {
          if (!vm.form.account.length) {
            vm.form.account = []
          } else {
            vm.form.account = vm.form.account
              .split(',')
              .map(item => Number(item))
          }
        }
        vm.oldData = JSON.parse(JSON.stringify(vm.form))
      }
    }
  },
  computed: {
    ...mapState('product', ['platformList']),
    ...mapState('email', ['emailAccountList']),
    hour() {
      let arr = []
      for (let i = 1; i < 25; i++) {
        arr[arr.length] = i + ''
      }
      return arr
    },
    minute() {
      let arr = []
      for (let i = 0; i < 60; i++) {
        arr[arr.length] = i + ''
      }
      return arr
    }
  },
  methods: {
    ...mapActions('product', ['getPlatformList']),
    ...mapActions('email', ['getEmailAccountList']),
    handleClear(index) {
      if (this.ruleListForm.length === 1) {
        return
      }
      this.ruleListForm.splice(index, 1)
    },
    handleSure() {
      this.dialogVisible = true
      this.options.visible = false
      this.deleteFlag = true
    },
    getForm() {
      let vm = this
      let ruleListForm = vm.$.deepClone(vm.ruleListForm).map((item, index) => {
        return vm.$refs['simpleForm' + index][0].getItemFormData()
      })
      return ruleListForm
    },
    handleSubmit() {
      let vm = this
      vm.loading = true
      let form = JSON.parse(JSON.stringify(vm.form))
      form.emailMarketConditionsEntities = vm.getForm()
      if (form.time) {
        let timeArr = /([^:]+):([^:]+)/gi.exec(form.time)
        form.hour = timeArr[1]
        form.minute = timeArr[2]
        delete form.time
      }
      if (form.platformId) {
        form.platformId = form.platformId.join()
      }
      if (form.account) {
        form.account = form.account.join()
      }
      if (!form.activateFlag) {
        form.activateFlag = '0'
      }

      vm.getVerification(form)
      if (!vm.verificationFlag) {
        vm.loading = false
        return
      }
      // 提交表單
      if (vm.isEdit) {
        vm.$api['email/marketPolicyUpdate'](form)
          .then(() => {
            vm.loading = false
            vm.options.visible = false
          })
          .catch(() => {
            vm.loading = false
          })
      } else {
        if (isEqual(vm.oldData, vm.form)) {
          vm.$message.warning('请编辑后再保存')
          vm.loading = false
          return
        }
        delete form.emailMarketPolicyId
        vm.$api['email/marketPolicySave'](form)
          .then(() => {
            vm.loading = false
            vm.options.visible = false
          })
          .catch(() => {
            vm.loading = false
          })
      }
    },
    getVerification(form) {
      let vm = this
      vm.verificationFlag = false
      if (!form.name) {
        this.verification('请输入规则名称')
        return
      }
      if (!form.templateType) {
        this.verification('请选择模板类型')
        return
      }
      if (!form.platformId || !form.platformId.length) {
        this.verification('请选择平台')
        return
      }
      if (!form.account || !form.account.length) {
        this.verification('请选择账号')
        return
      }
      if (!form.priority) {
        this.verification('请输入优先级')
        return
      }
      if (form.priority > 10 || form.priority < 0) {
        this.verification('请输入0-10以内的优先级')
        return
      }
      if (
        !this.ruleListForm[0] ||
        !this.ruleListForm[0].checkList ||
        !this.ruleListForm[0].checkList.length
      ) {
        this.verification('请选择规则可选条件')
        return
      }
      if (!form.subject) {
        this.verification('请输入邮件主题')
        return
      }
      if (!form.content) {
        this.verification('模板内容')
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
    deleteRule() {
      this.deleteFlag = false
      this.dialogVisible = false
      this.optionsFlag = false
    },
    addRuleForm() {
      let vm = this
      let index = vm.ruleListForm.length - 1
      if (
        !vm.ruleListForm[index].checkList ||
        !vm.ruleListForm[index].checkList.length
      ) {
        return
      }
      vm.ruleListForm.push({ checkList: [] })
    },
    btnInput(item) {
      let vm = this
      vm.$refs.editor.setStr(item)
    },
    choseData(data) {
      this.$set(this.form, 'emailTemplateId', data.emailTemplateId)
      this.$set(this.form, 'content', data.content)
      this.$set(this.form, 'subject', data.subject)
    },
    getArr(form) {
      form = JSON.parse(JSON.stringify(form))
      if (typeof form.platformId === 'string') {
        form.platformId = form.platformId.split(',')
      }
      if (typeof form.account === 'string') {
        form.account = form.account.split(',')
      }

      if (form.hour && form.minute) {
        form.minute = form.minute ? form.minute : '00'
        form.hour = form.hour ? form.hour : '00'
        form.time = form.hour + ':' + form.minute
      }
    }
  },
  components: {
    SimpleItem,
    SimpleForm,
    CopyBtn
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
  .channel-input1 {
    .el-input {
      width: 238px;
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
    width: 156px;
  }
  .chose-rule {
    margin-top: 10px;
    border: 1px solid #ebeef5;
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
