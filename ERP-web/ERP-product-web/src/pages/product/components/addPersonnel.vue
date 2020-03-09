<template lang="html">
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="small">
            <el-form-item label="名称：" prop="nickName">
                <el-input v-model="ruleForm.nickName"/>
            </el-form-item>
            <el-form-item label="账号名：" prop="username">
                <el-input v-model="ruleForm.username"/>
            </el-form-item>
            <el-form-item label="密码：" prop="password">
                <el-input v-model="ruleForm.password"/>
            </el-form-item>
            <el-form-item label="确认密码：" prop="verifyPassword">
                <el-input v-model="ruleForm.verifyPassword"/>
            </el-form-item>
            <el-form-item label="选择角色：" prop="roleType">
                <el-checkbox-group v-model="ruleForm.roleType">
                    <el-checkbox :label="1">开发</el-checkbox>
                    <el-checkbox :label="2">采购</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item style="text-align:center">
              <div>
                <el-button @click="cancel">取消</el-button>
                <el-button type="primary" :loading="loading" @click="handleOk">确定</el-button>
              </div>
                
            </el-form-item>
        </el-form>
</template>

<script>
export default {
  props: {
    openDialog: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '添 加'
    }
  },
  computed: {
    _openDialog: {
      get() {
        this.$nextTick(() => {
          if (this.$refs.ruleForm.hasOwnProperty('resetFields')) {
            this.$refs.ruleForm.resetFields()
          }
        })
        return this.openDialog
      },
      set(val) {
        this.$emit('dialogCallback', val)
      }
    }
  },
  data() {
    let password = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.ruleForm.verifyPassword !== '') {
          this.$refs.ruleForm.validateField('verifyPassword')
        }
        callback()
      }
    }
    let verifyPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.ruleForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      loading: false,
      ruleForm: {
        username: '',
        password: '',
        verifyPassword: '',
        roleType: []
      },
      rules: {
        nickName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        username: [
          { required: true, message: '请输入账号名称', trigger: 'blur' }
        ],
        password: [{ required: true, validator: password, trigger: 'blur' }],
        verifyPassword: [
          { required: true, validator: verifyPassword, trigger: 'blur' }
        ],
        roleType: [
          {
            type: 'array',
            required: true,
            message: '至少选择一个角色',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    handleOk() {
      this.ok()
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm)
          this.$emit('submitDialogForm', this.ruleForm)
          this.loading = true
          this.$listeners.set(this)
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      this.loading = false
      this.$root.$children[0].asyncModalVisible = false
    },
    ok() {
      this.submitForm('ruleForm')
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
