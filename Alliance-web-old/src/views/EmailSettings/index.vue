<template>
  <div>
    <el-row class="rows">
      <el-col :span="24">
        <el-button-group>
          <el-button icon="el-icon-setting" size="small" @click="handleSet" :disabled="!disabled">设置</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="getData">刷新</el-button>
        </el-button-group>
      </el-col>
    </el-row>

    <el-form :model="formData" size="small" label-width="120px" :disabled="disabled" :rules="rules" ref="form">
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="formData.email" :auto-complete="false"></el-input>
      </el-form-item>
      <el-form-item label="邮箱密码" v-show="!disabled" prop="emailPassword">
        <el-input type="password" v-model="formData.emailPassword" :auto-complete="false"></el-input>
      </el-form-item>
      <el-form-item label="模板名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="邮件主题" prop="subjects">
        <el-input v-model="formData.subjects"></el-input>
      </el-form-item>
      <el-form-item label="变量说明">
        <b>{UserName}</b> 替换用户真实姓名 &nbsp; &nbsp;
        <b>{ProductName}</b> 替换商品名称 &nbsp; &nbsp;
        <b>{ArriveData}</b> 替换商品到达时间
      </el-form-item>
      <el-form-item label="邮件内容">
        <!-- <el-input type="textarea" :rows="8" v-model="formData.name"></el-input> -->
        <ue-editor :disabled="disabled" v-model="formData.content"></ue-editor>
      </el-form-item>
      <el-form-item label-width="0" v-if="!disabled">
        <div class="txc">
          <el-button type="primary" @click="save" :loading="loading">确认</el-button>
          <el-button type="danger" @click="handleCancel">取消</el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  created() {
    this.init()
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.init()
    })
  },
  data() {
    return {
      loading: false,
      hasInit: false,
      formData: {},
      disabled: true,
      rules: {
        email: [{ required: true, type: 'email', message: '请填写邮箱' }],
        emailPassword: [{ required: true, message: '请填写邮箱密码' }],
        name: [{ required: true, message: '请填写模板名称' }],
        subjects: [{ required: true, message: '请填写邮件主题' }]
      }
    }
  },
  methods: {
    save() {
      this.loading = true
      this.$api[`main/merchantMailTemplateSet`](this.formData)
        .then(data => {
          this.loading = false
          this.disabled = true
          this.getData()
        })
        .catch(err => {
          this.loading = false
        })
    },
    handleCancel() {
      this.disabled = true
      this.getData()
    },
    handleSet() {
      this.disabled = false
    },
    init() {
      if (this.hasInit) {
        return
      }
      this.hasInit = true
      this.getData()
    },
    getData() {
      return this.$api[`main/merchantMailTemplateInfo`]({})
        .then(data => {
          this.formData = data.rows
          this.$nextTick(() => {
            this.$refs.form.clearValidate()
          })
        })
        .catch(err => {})
    }
  }
}
</script>

<style lang='scss' scoped>
.rows {
  text-align: right;
  margin-bottom: 20px;
}
</style>
