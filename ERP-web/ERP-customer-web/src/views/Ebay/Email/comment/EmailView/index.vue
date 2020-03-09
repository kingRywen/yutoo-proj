<template>
  <div class="email-views">
    <div class="view-wrap" v-if="$route.path === '/viewEmail'">
      <div class="view-email">
        <div class="email-information">
          <el-row class="martop20">
            <el-col :span="2" :offset="2" class="title">平台订单号：</el-col>
            <el-col :span="4">
              {{ emailReply.orderNumPlatform }}
              <span v-if="!emailReply.orderNumPlatform" style="opacity: 0">1</span>
            </el-col>
            <el-col :span="2" class="title">系统订单号：</el-col>
            <el-col :span="4">
              {{ emailReply.orderNumSystem }}
              <span v-if="!emailReply.orderNumSystem" style="opacity: 0">1</span>
            </el-col>
            <el-col :span="2" class="title">订单来源：</el-col>
            <el-col :span="4">
              {{ emailReply.storeName }}
              <span v-if="!emailReply.storeName" style="opacity: 0">1</span>
            </el-col>
            <el-col :span="2" class="title">客服人员：</el-col>
            <el-col :span="2">
              {{ emailReply.serviceName }}
              <span v-if="!emailReply.serviceName" style="opacity: 0">1</span>
            </el-col>
          </el-row>
          <el-row class="martop20">
            <el-col :span="2" :offset="2" class="title">客户姓名：</el-col>
            <el-col :span="4">
              {{ emailReply.customerName }}
              <span v-if="!emailReply.customerName" style="opacity: 0">1</span>
            </el-col>
            <el-col :span="2" class="title">Item ID：</el-col>
            <el-col :span="4">
              {{ emailReply.itemId }}
              <span v-if="!emailReply.itemId" style="opacity: 0">1</span>
            </el-col>
            <el-col :span="2" class="title">邮箱：</el-col>
            <el-col :span="4">
              {{ emailReply.customerEmailBox }}
              <span v-if="!emailReply.customerEmailBox" style="opacity: 0">1</span>
            </el-col>
          </el-row>
          <el-row class="martop20">
            <el-col :span="2" :offset="2" class="title">主题：</el-col>
            <el-col :span="20">
              {{ emailReply.subject }}
              <span v-if="!emailReply.subject" style="opacity: 0">1</span>
            </el-col>
          </el-row>
        </div>
        <div ref="emailContent"></div>
      </div>
    </div>
    <yt-dialog v-else :options="options" :events="events">
      <div>
        <div class="view-wrap">
          <div class="view-email">
            <div class="email-information">
              <el-row class="martop20">
                <el-col :span="2" :offset="2" class="title">平台订单号：</el-col>
                <el-col :span="4">
                  {{ emailReply.orderNumPlatform }}
                  <span v-if="!emailReply.orderNumPlatform" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">系统订单号：</el-col>
                <el-col :span="4">
                  {{ emailReply.orderNumSystem }}
                  <span v-if="!emailReply.orderNumSystem" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">订单来源：</el-col>
                <el-col :span="4">
                  {{ emailReply.storeName }}
                  <span v-if="!emailReply.storeName" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">客服人员：</el-col>
                <el-col :span="2">
                  {{ emailReply.serviceName }}
                  <span v-if="!emailReply.serviceName" style="opacity: 0">1</span>
                </el-col>
              </el-row>
              <el-row class="martop20">
                <el-col :span="2" :offset="2" class="title">客户姓名：</el-col>
                <el-col :span="4">
                  {{ emailReply.customerName }}
                  <span v-if="!emailReply.customerName" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">Item ID：</el-col>
                <el-col :span="4">
                  {{ emailReply.itemId }}
                  <span v-if="!emailReply.itemId" style="opacity: 0">1</span>
                </el-col>
                <el-col :span="2" class="title">邮箱：</el-col>
                <el-col :span="4">
                  {{ emailReply.customerEmailBox }}
                  <span v-if="!emailReply.customerEmailBox" style="opacity: 0">1</span>
                </el-col>
              </el-row>
              <el-row class="martop20">
                <el-col :span="2" :offset="2" class="title">主题：</el-col>
                <el-col :span="20">
                  {{ emailReply.subject }}
                  <span v-if="!emailReply.subject" style="opacity: 0">1</span>
                </el-col>
              </el-row>
            </div>
            <div ref="emailContent"></div>
          </div>
        </div>
      </div>
      <div class="view-btn-group" slot="footer">
        <el-row class="martop">
          <el-col :span="21" v-if="isShow">
            <el-button type="primary" size="small" class="marright10" @click="handleReply(emailReply)">回复</el-button>
            <el-dropdown
              size="small"
              split-button
              type="primary"
              class="dropdown-btn"
              @command="handleCommandSeting"
            >标记为
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="1">设置已读</el-dropdown-item>
                <el-dropdown-item :command="2">设置未读</el-dropdown-item>
                <el-dropdown-item :command="3">设置已回复</el-dropdown-item>
                <el-dropdown-item :command="4">设置未回复</el-dropdown-item>
                <el-dropdown-item :command="5">标记星标</el-dropdown-item>
                <el-dropdown-item :command="6">撤销星标</el-dropdown-item>
                <el-dropdown-item :command="7">设置不需要回复</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <el-button
              type="primary"
              class="marleft10"
              size="small"
              @click="handleBlackAdd(emailReply.emailBaseId)"
            >加入智能营销邮件黑名单</el-button>
          </el-col>
          <el-col :span="21" v-else style="opacity:0">1</el-col>
          <el-col :span="3" style="padding-left: 5px;">
            <el-button type="primary" size="small" @click="handlePre(emailReply.emailBaseId)">上一封</el-button>
            <el-button type="primary" size="small" @click="handleNext(emailReply.emailBaseId)">下一封</el-button>
          </el-col>
        </el-row>
      </div>
    </yt-dialog>
  </div>
</template>

<script>
export default {
  props: ['visible', 'form', 'ids', 'isShow', 'emailType'],
  created() {
    if (this.$route.path === '/viewEmail') {
      this.getData()
    }
  },
  data() {
    return {
      emailReply: {
        content: ''
      },
      options: {
        visible: false,
        title: '查看邮件',
        width: '1330px',
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
      nextFlag: true,
      events: {
        close: () => {
          this.$emit('sendFlag', false)
        }
      }
    }
  },
  watch: {
    visible() {
      this.options.visible = this.visible
    },
    form() {
      this.emailReply = this.form
      this.emailReply.content = this.form.content || ''
    },
    'emailReply.content'(val) {
      this.$nextTick(() => {
        this.$refs.emailContent.innerHTML = val
      })
    }
  },
  methods: {
    getData() {
      let vm = this,
        { emailBaseId, emailType } = this.$route.query
      let params = {
        emailBaseId:+emailBaseId,
        emailType:+emailType
      }
      vm.$api['email/baseGet'](params)
        .then(data => {
          if (!data) {
            return
          }
          vm.emailReply = data.rows
          vm.emailReply.content = data.rows.content || ''
        })
        .catch(err => {
          console.log(err)
        })
    },
    handleBlackAdd(id) {
      let vm = this
      let params = {}
      vm.$confirm('此操作将加入营销邮件黑名单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          params = {
            emailBaseId: id
          }
          vm.$api['email/emailListAdd'](params)
            .then(() => {
            })
            .catch(err => {
              console.log(err)
            })
        })
        .catch(() => {
          vm.$message({
            type: 'info',
            message: '已取消加入黑名单'
          })
        })
    },
    handlePre(id) {
      let vm = this
      if (!vm.nextFlag) {
        return
      }
      let emailAllBaseIds = vm.ids
      let index = emailAllBaseIds.indexOf(id) - 1
      if (index < 0) {
        return
      }
      vm.nextFlag = false
      vm.getEmailReply(emailAllBaseIds[index])
    },
    handleNext(id) {
      let vm = this
      if (!vm.nextFlag) {
        return
      }
      let emailAllBaseIds = vm.ids
      let len = emailAllBaseIds.length
      let index = emailAllBaseIds.indexOf(id) + 1
      if (index >= len) {
        return
      }
      vm.nextFlag = false
      vm.getEmailReply(emailAllBaseIds[index])
    },
    handleCommandSeting() {},
    getEmailReply(emailBaseId) {
      let vm = this
      return vm.$api['email/baseGet']({
        emailBaseId: emailBaseId,
        emailType: vm.emailType
      })
        .then(data => {
          if (!data) {
            return
          }
          vm.nextFlag = true
          vm.emailReply = data.rows
        })
        .catch(err => {
          vm.nextFlag = true
          console.log(err)
        })
    }
  }
}
</script>

<style lang="scss">
.email-views {
  .view-wrap {
    .view-email {
      width: 99.8%;
      height: 500px;
      border: 1px solid rgb(240, 240, 240);
      margin-top: -11px;
      .email-information {
        height: 120px;
        background: rgb(240, 240, 240);
        .martop20 {
          padding-top: 20px;
        }
        .title {
          text-align: right;
        }
      }
    }
  }
}
</style>
