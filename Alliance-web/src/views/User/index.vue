<template>
  <div>
    <div class="top flex">
      <div class="img-wrapper flex">
        <img src="./avator.png" alt="avator" width="100" />
        <h2>{{userInfo.username}}</h2>
      </div>
      <div class="bottom">
        <div class="box">
          <ElButton type="text" @click="invite">邀请入驻</ElButton>
        </div>
        <div class="box flex">
          <ElButton type="text" @click="options.visible = true">商户资料</ElButton>
        </div>
        <div class="box">
          <ElButton type="text" @click="goto(`editPass`)">修改密码</ElButton>
          <!-- <ElButton type="text" @click="goto(`findPass`)">忘记密码</ElButton> -->
        </div>
      </div>
    </div>
    <yt-dialog :options="options">
      <el-form size="small" ref="form" label-width="90px" :model="userInfo">
        <el-form-item label="商户编号:">
          <ElInput :value="userInfo.merchantNo || '-'" :disabled="true"></ElInput>
        </el-form-item>
        <el-form-item label="商户邮箱:">
          <ElInput :value="userInfo.email || '-'" :disabled="true"></ElInput>
        </el-form-item>
        <el-form-item label="手机号码:" prop="merchantMobile" :rules="[{required: true, message: '不能为空'},{validator}]">
          <ElInput v-model="userInfo.merchantMobile"></ElInput>
        </el-form-item>
      </el-form>
      <div slot="footer" class="txc">
        <ElButton type="primary" @click="save">确认</ElButton>
        <ElButton type="primary" @click="options.visible=false,resetMobile()" plain>取消</ElButton>
      </div>
    </yt-dialog>
    <yt-dialog :options="renewOpts" :events="renewEvents">
      <Renew ref="renew" />
    </yt-dialog>
  </div>
</template>

<script>
import Renew from './components/Renew'
import { mapActions, mapMutations } from 'vuex'
export default {
  components: { Renew },
  data() {
    let vm = this
    return {
      originMobile: null,
      validator(rule, value, cb) {
        if (!/^0?(13|14|15|17|18|19)[0-9]{9}$/.test(value)) {
          cb(new Error('请输入正确的手机号码'))
        }
        cb()
      },
      options: {
        visible: false,
        title: '商户资料',
        width: '400px',
        appendToBody: true
      },
      renewOpts: {
        visible: false,
        title: '会员费支付',
        width: '800px',
        appendToBody: true,
        okBtnText: '确认',
        cancelBtnText: '取消'
      },
      renewEvents: {
        handleOkClick() {
          return vm.$refs.renew.submit().then(() => {
            vm.renewOpts.visible = false
            vm.getUserInfo()
          })
        },
        open() {
          vm.$nextTick(() => {
            vm.$refs.renew.init()
          })
        }
      }
    }
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo
    }
  },
  methods: {
    ...mapActions(['getUserInfo']),
    ...mapMutations(['resetMobile']),
    invite() {
      this._openDialog({
        size: 'small',
        title: '邀请入驻',
        params: {},
        cancelBtnText: '取消',
        okBtnText: '邀请',
        component: () => import('./components/invite.vue')
      })
    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.$api[`main/merchantEditMobile`]({
            mobile: this.userInfo.merchantMobile
          })
            .then(() => {
              this.options.visible = false
              this.getUserInfo()
            })
            .catch(() => {
              this.resetMobile()
            })
        }
      })
    },
    goto(name) {
      this.$router.push({ name })
    }
  }
}
</script>

<style lang='scss' scoped>
.flex {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.top {
  display: flex;
  margin-top: 20px;
  .img-wrapper {
    img {
      border-radius: 100%;
    }
  }
}
.bottom {
  display: flex;
  max-width: 800px;
  width: 100%;
  margin-top: 20px;
  .box {
    &:not(:last-child) {
      border-right: 1px solid #ddd;
    }

    flex: 1;
    display: flex;
    justify-content: center;
  }
}
</style>
<style lang="scss">
.user-info {
  .el-form-item {
    margin-bottom: 8px;
  }
}
</style>
