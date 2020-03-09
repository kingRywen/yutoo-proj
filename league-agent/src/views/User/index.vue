<template>
  <div class="user">
    <div class="top flex">
      <div class="img-wrapper flex mb20">
        <img class="mt20" src="./avator.png" alt="avator" width="100" />
        <h2>{{userInfo.email}}</h2>
        <span class="mb10" v-if="userInfo.discount && userInfo.discount <= 100">优惠折扣：{{userInfo.discount}}%</span>
      </div>
      <div class="bottom">
        <div class="box">
          <ElButton type="text" @click="invite">邀请入驻</ElButton>
        </div>
        <div class="box flex">
          <ElButton type="text" @click="view">商户资料</ElButton>
        </div>
        <div class="box">
          <ElButton type="text" @click="goto(`/editPass`)">修改密码</ElButton>
        </div>
      </div>
    </div>
    <!-- <yt-dialog :options="options">
      <el-form label-width="100px" class="user-info">
        <el-form-item label="登录账号:">
          <el-tag>{{userInfo.username || '-'}}</el-tag>
        </el-form-item>
        <el-form-item label="商户编号:">
          <el-tag>{{userInfo.merchantNo || '-'}}</el-tag>
        </el-form-item>
        <el-form-item label="商户名称:">
          <el-tag>{{userInfo.merchantName || '-'}}</el-tag>
        </el-form-item>
        <el-form-item label="手机号码:">
          <el-tag>{{userInfo.merchantMobile || '-'}}</el-tag>
        </el-form-item>
        <el-form-item label="商户邮箱:">
          <el-tag>{{userInfo.merchantEmail || '-'}}</el-tag>
        </el-form-item>
      </el-form>
    </yt-dialog>-->
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      userInfo: {
        email: '-'
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
  created() {
    this.getUserInfo()
  },
  methods: {
    invite() {
      this._openDialog({
        size: 'small',
        title: '邀请入驻',
        params: {},
        cancelBtnText: '取消',
        okBtnText: '邀请',
        component: () => import('./dialogs/invite.vue')
      })
    },
    view() {
      this._openDialog({
        size: 'small',
        title: '商户资料',
        params: { info: { ...this.userInfo } },

        okBtnText: '确认',
        cancelBtnText: '取消',
        component: () => import('./dialogs/info.vue')
      })
    },
    getUserInfo() {
      this.$api[`agent/merchantInfo`]({}).then(data => {
        this.userInfo = data.rows
      })
    },
    goto(path) {
      this.$router.push({ path })
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
.user {
  font-size: 14px;
}
</style>
