<template>
  <div class="add-strategy">
    <el-form class="search-top-form dialog-form" v-model="form">
      <div style="margin: 20px 0;">规则信息</div>
      <el-table :data="tableData" style="width: 100%" border class="table-top14">
        <el-table-column prop="name" label="规则名称" label-class-name="must-fill-sign">
          <template slot-scope="scope">
            <el-form-item size="small" class="channel-input">
              <el-form-item size="small">
                <el-input class="rule-name" v-model="form.ruleName"></el-input>
              </el-form-item>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="模板类型" label-class-name="must-fill-sign">
          <template slot-scope="scope">
            <el-select v-model="form.emailAccountId" placeholder="来源渠道">
              <el-option v-for="item in emailAccountList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="选择平台">
          <template slot-scope="scope">
            <el-select v-model="form.emailAccountId" placeholder="来源渠道" multiple collapse-tags>
              <el-option v-for="item in emailAccountList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="选择账号">
          <template slot-scope="scope">
            <el-select v-model="form.emailAccountId" placeholder="来源渠道" multiple collapse-tags>
              <el-option v-for="item in emailAccountList" :label="item.label" :value="item.value" :key="item.id"></el-option>
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="ruleName" label="优先级">
          <template slot-scope="scope">
            <el-form-item size="small">
              <el-input v-model="form.priority"></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
      <div class="table-top14s must-fill-sign-div">规则可选条件</div>

      <div>
        <yt-dialog :options="options">
          <div class="dialog-wrap">
            <el-form class="search-top-form dialog-form" v-model="form">
              <el-form-item>
                <el-checkbox-group v-model="selectValue">
                  <el-row>
                    <el-col :span="8">
                      <el-checkbox label="订单发货方式"></el-checkbox>
                    </el-col>
                    <el-col :span="8">
                      <el-checkbox label="订单">排除订单</el-checkbox>
                    </el-col>
                    <el-col :span="8">
                      <el-checkbox label="发货期限"></el-checkbox>
                    </el-col>
                    <el-col :span="8">
                      <el-checkbox label="黑名单"></el-checkbox>
                    </el-col>
                    <el-col :span="8">
                      <el-checkbox label="发货时间"></el-checkbox>
                    </el-col>
                    <el-col :span="8">
                      <el-checkbox label="卖家">排除卖家</el-checkbox>
                    </el-col>
                    <el-col :span="8">
                      <el-checkbox label="品牌"></el-checkbox>
                    </el-col>
                    <el-col :span="8">
                      <el-checkbox label="产品"></el-checkbox>
                    </el-col>
                    <el-col :span="8">
                      <el-checkbox label="运输方式"></el-checkbox>
                    </el-col>
                  </el-row>
                </el-checkbox-group>
                <el-form-item class="saveBtn" label-width="0px">
                  <el-button size="small" type="primary" @click="handleSure">确认</el-button>
                </el-form-item>
              </el-form-item>
            </el-form>
          </div>
        </yt-dialog>
      </div>
      <div class="chose-rule" v-for="ruleForm in ruleListForm" :key="ruleForm.id">
        <el-button icon="el-icon-plus" class="addbtn martop marleft10" @click="addRule"></el-button>
        <el-button v-if="deleteFlag" icon="el-icon-delete" class="addbtn martop" @click="deleteRule"></el-button>
        <el-row class="mar10"></el-row>
        <el-row class="simple-wrap" v-if="dialogVisible">
          <el-form>
            <simple-item :label="'订单发货方式'" :selectValue="selectValue" @change="change" class="simple-item">
              <el-select class="mar10" v-model="ruleForm.senderFlag">
                <el-option label="包含" value="true"></el-option>
                <el-option label="不包含" value="false"></el-option>
              </el-select>
              <el-select class="mar10" v-model="ruleForm.senderFlag">
                <el-option label="包含" value="true"></el-option>
                <el-option label="不包含" value="false"></el-option>
              </el-select>
              <el-input v-model="form.senderList" class="date-space"></el-input>
              <span>天</span>
            </simple-item>
            <simple-item :label="'卖家'" :selectValue="selectValue" @change="change">
              <el-checkbox-group class="pad8" v-model="ruleForm.select">
                <el-checkbox label="排除留下过差评的买家"></el-checkbox>
                <el-checkbox label="排除留下过中评的买家"></el-checkbox>
                <el-checkbox label="排除已有差评或中评的订单"></el-checkbox>
              </el-checkbox-group>
            </simple-item>
            <simple-item :label="'订单'" :selectValue="selectValue" @change="change">
              <el-checkbox-group class="pad8" v-model="ruleForm.select">
                <el-checkbox label="排除已退款的订单"></el-checkbox>
                <el-checkbox label="排除已被取消的订单"></el-checkbox>
                <el-checkbox label="排除有往来邮件(Buyer message)的订单"></el-checkbox>
              </el-checkbox-group>
            </simple-item>
            <simple-item :label="'品牌'" :selectValue="selectValue" @change="change">
              <el-checkbox class="pad8" v-model="ruleForm.checked">排除</el-checkbox>
              <el-select class="pad8" v-model="ruleForm.senderFlag" placeholder="请选择">
                <el-option label="包含" value="true"></el-option>
                <el-option label="不包含" value="false"></el-option>
              </el-select>
              <span>的产品</span>
            </simple-item>
            <simple-item :label="'发货期限'" :selectValue="selectValue" @change="change">
              <el-checkbox class="pad8" v-model="ruleForm.checked">从下订单日起算，排除</el-checkbox>
              <el-input v-model="ruleForm.senderList" class="date-space"></el-input>
              <span>天后才出货的订单</span>
            </simple-item>
            <simple-item :label="'产品'" :selectValue="selectValue" @change="change">
              <el-select class="mar10" v-model="ruleForm.senderFlag" placeholder="请选择">
                <el-option label="包含" value="true"></el-option>
                <el-option label="不包含" value="false"></el-option>
              </el-select>
              <el-button type="primary" class="marleft10">添加ASIN</el-button>
            </simple-item>
            <simple-item :label="'黑名单'" :selectValue="selectValue" @change="change">
              <el-select class="mar10" v-model="ruleForm.senderFlag" placeholder="请选择">
                <el-option label="包含" value="true"></el-option>
                <el-option label="不包含" value="false"></el-option>
              </el-select>
              <span class="marleft10">黑名单</span>
            </simple-item>
            <simple-item :label="'运输方式'" :selectValue="selectValue" @change="change">
              <el-button type="primary" class="marleft10 marright10">选择运输方式</el-button>
              <div class="sign-title">
                <span>{{ ruleForm.productSkuList }}</span>
                <el-button icon="el-icon-close" class="close" circle style="margin-top:-10px;"></el-button>
              </div>
            </simple-item>
            <simple-item :label="'发货时间'" :selectValue="selectValue" @change="change">
              <span class="marleft10">发货</span>
              <el-input v-model="ruleForm.senderList" class="date-space"></el-input>
              <span>天后，发送电邮通知买家</span>
            </simple-item>
          </el-form>
        </el-row>
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
                <el-time-picker
                  class="marleft10 marright10"
                  :picker-options="{
                    selectableRange: '18:30:00 - 20:30:00'
                    }"
                  placeholder="任意时间点"
                ></el-time-picker>
                <el-input v-model="form.senderList" class="date-space"></el-input>
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
                <el-select class="mar10" v-model="form.senderFlag" placeholder="请选择">
                  <el-option label="包含" value="true"></el-option>
                  <el-option label="不包含" value="false"></el-option>
                </el-select>
                <span>前至</span>
                <el-select class="mar10" v-model="form.senderFlag" placeholder="请选择">
                  <el-option label="包含" value="true"></el-option>
                  <el-option label="不包含" value="false"></el-option>
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
                <el-input v-model="form.senderList"></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="tableData1" style="width: 100%;border-top: none;" border class="must-table">
          <el-table-column prop="name" label="模板内容" label-class-name="must-fill-sign">
            <template slot-scope="scope">
              <el-form-item size="small">
                <el-button class="marbottom10" type="primary">选择模板</el-button>
                <div>
                  <UeEditor v-model="context" ref="editor" init-id="editor1" :config="editorConfig"/>
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
            <el-checkbox class="isChecked" v-model="form.activateFlag">是否激活</el-checkbox>
          </el-col>
        </el-row>
        <el-form-item class="saveBtn mar10" label-width="0px">
          <el-button size="small" type="primary" @click="handleSubmit">保存</el-button>
          <el-button size="small" type="primary" @click="handleSubmit">取消</el-button>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>

<script>
import SimpleItem from './SimpleItem'
import CopyBtn from '../CopyBtn'
export default {
  props: ['isEdit', 'form'],
  data() {
    return {
      context: '',
      editorConfig: {
        initialFrameHeight: 200,
        initialFrameWidth: 1030
      },
      ruleListForm: [{}],
      deleteFlag: false,
      selectValue: [],
      dialogVisible: false,
      optionsFlag: false,
      options: {
        visible: false,
        title: '选择条件',
        width: '500px',
        fullscreen: false,
        top: '30vh',
        modal: true,
        modalAppendToBody: true,
        appendToBody: true,
        lockScroll: true,
        customClass: null,
        closeOnClickModal: true,
        closeOnPressEscape: true,
        showClose: true
      },
      selectClassify: '',
      tableData1: [
        {
          value: '分配自定义分类',
          value2: '分配自定义分类'
        }
      ],

      tableData: [{}],
      emailAccountList: []
    }
  },
  created() {
    let vm = this
    vm.$api['email/emailAccountList']()
      .then(data => {
        this.emailAccountList = data.rows.map(item => {
          return {
            label: item.account,
            value: item.email_account_id
          }
        })
      })
      .catch(err => {
        console.log(err)
      })
  },
  mounted() {},
  watch: {},
  methods: {
    handleSure() {
      this.dialogVisible = true
      this.options.visible = false
      this.deleteFlag = true
      console.log(this.selectValue)
    },
    handleSubmit() {
      this.optionsFlag = false
      this.$emit('formSubmit', this.form)
    },
    addRule() {
      if (!this.optionsFlag) {
        this.options.visible = true
      }
    },
    deleteRule() {
      this.deleteFlag = false
      this.dialogVisible = false
      this.optionsFlag = false
    },
    change(val) {
      let index = this.selectValue.indexOf(val)
      this.selectValue.splice(index, 1)
      if (this.selectValue.length == 0) {
        this.dialogVisible = false
        this.deleteFlag = false
        this.optionsFlag = false
      }
    },
    addRuleForm() {
      let vm = this
      vm.ruleListForm.push({})
    },
    btnInput(item) {
      let vm = this
      vm.$refs.editor.setStr(item)
    }
  },
  components: {
    SimpleItem,
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
    width: 80px;
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
