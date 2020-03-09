<template>
  <div v-loading="loading" element-loading-text="生成链接中.." class="w600 ad-auth">
    <p>
      1.选择开通站点：
      <el-checkbox-group style="display: inline" v-model="selectSites" @change="handleChange">
        <el-checkbox v-for="item in sites" :key="item.siteId" :label="item.siteId">{{item.siteName}}</el-checkbox>
        <!-- <el-checkbox label="复选框 B"></el-checkbox>
        <el-checkbox label="复选框 C"></el-checkbox>
        <el-checkbox label="禁用" disabled></el-checkbox>
        <el-checkbox label="选中且禁用" disabled></el-checkbox>-->
      </el-checkbox-group>
    </p>
    <p>
      2.
      <a href="javascript:void(0)" class="link" :class="{disabled: !selectSites.length}" @click="copy">点击复制URL。</a>
    </p>
    <p>
      3.为防止店铺关联，
      <span class="imp">请务必在店铺常用的电脑上操作</span>：打开浏览器，粘贴访问上面复制的URL。
    </p>
    <p>
      4.在弹出的亚马逊登录页面中，使用
      <span class="imp">店铺账号登录亚马逊</span>，完成授权。
    </p>
    <p>5.授权成功后，会收到成功提示；如果失败，也会收到失败提示。</p>
  </div>
</template>
<script>
export default {
  props: ['sites', 'platformId', 'sellerAuthId'],
  data() {
    return {
      selectSites: [],
      genUrl: '',
      loading: false
    }
  },
  methods: {
    _submit() {
      return this.$copyText(this.genUrl)
        .then(() => {
          this.$message.warning(
            '授权链接已复制到剪贴板，请务必按照步骤进行操作'
          )
          return Promise.resolve(true)
        })
        .catch(err => {
          this.$message.error('复制失败，请刷新重试')
        })
    },
    handleChange() {
      if (!this.selectSites.length) {
        this.setBtn(true)
      } else {
        this.getAuthUrl()
      }
    },
    setBtn(bool) {
      this.$parent.$parent.$parent.$parent.hadnleSetBtnDisabled(
        // !this.selectSites.length
        bool
      )
    },
    getAuthUrl() {
      this.loading = true
      this.$api[`shopAuth/sellerAuthAdGetAdAuthUrl`]({
        platformId: this.platformId,
        sellerAuthId: this.sellerAuthId,
        siteIds: this.selectSites
      }).then(data => {
        this.genUrl = data.data
        this.loading = false
        this.setBtn(false)
      })
    },
    copy() {
      this.$copyText(this.genUrl)
        .then(() => {
          this.$message.success('复制成功')
        })
        .catch(err => {
          this.$message.error('复制失败，请刷新重试')
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.imp {
  color: red;
  font-weight: bold;
}
</style>
<style lang="scss">
.ad-auth {
  .el-checkbox__input.is-checked + .el-checkbox__label {
    color: #555;
    font-weight: bold;
  }
  .el-checkbox__input.is-checked .el-checkbox__inner {
    color: #555;
    background-color: #555;
    border-color: #555;
  }
}
</style>