<template>
  <div class="mr10">
    <el-form :model="data" label-width="100px" size="small" ref="form" :rules="rules">
      <ElFormItem label="用户名" prop="username">
        <el-input v-model="data.username" autocomplete="new-password" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="密码" prop="password">
        <el-input type="password" v-model="data.password" autocomplete="new-password" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="昵称" prop="nickName">
        <el-input v-model="data.nickName" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="QQ" prop="qq">
        <el-input v-model="data.qq" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="微信">
        <el-input v-model="data.wechat" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="邮箱" prop="email">
        <el-input v-model="data.email" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="手机" prop="mobile">
        <el-input v-model="data.mobile" placeholder></el-input>
      </ElFormItem>
      <!-- <ElFormItem label="所属店铺" prop="mobile">
        <ElSelect multiple v-model="data.storeIds" placeholder="可选择多个" style="width:100%;height:30px">
          <ElOption v-for="(item, index) in storeList" :key="index" :label="item.label" :value="item.value"></ElOption>
        </ElSelect>
      </ElFormItem> -->
      <ElFormItem label="角色列表" prop="roleList">
        <el-tree
          v-if="refresh"
          @check="handleCheck"
          :check-strictly="false"
          :default-checked-keys="defaultCheckedKeys"
          :default-expand-all="defaultExpandAll"
          :data="roleList"
          :props="props"
          show-checkbox
          node-key="id"
        ></el-tree>
      </ElFormItem>
      <ElFormItem label="是否激活" prop="activateFlag">
        <el-switch v-model="data.activateFlag" :active-value="1" :inactive-value="0"></el-switch>
      </ElFormItem>
    </el-form>
    <!-- <div class="txc">
      <el-button type="primary" size="small" @click="save" :loading="loading">保存</el-button>
    </div> -->
  </div>
</template>

<script>
import apis from 'apis'
import { fetchData, handlerCode, showToast } from 'common/common'
export default {
  props: {
    editId: Number
  },
  data() {
    function checkExp(reg, msg, notRequired = false) {
      return (rule, value, cb) => {
        if (notRequired) {
          if (value == null || value === '') {
            cb()
          }
        }
        if (!reg.test(value)) {
          cb(new Error(msg))
        }
        cb()
      }
    }
    let checkPass = checkExp(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{6,30}$/,
      '密码中必须包含大小写字母、数字、特殊字符，6-30位，不能包含空格'
    )
    let checkUserName = checkExp(
      /^(?=.*[a-zA-Z])(?=.*\d)[A-Za-z\d$@$!%*#?&]{4,16}$/,
      '用户名中必须包含字母、数字,不能包含空格，4-16位'
    )
    let checkQQ = checkExp(/^[0-9]*$/, '请填写正确的QQ', true)
    let checkEmail = checkExp(
      /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
      '请填写正确的邮箱',
      true
    )
    let checkMobile = checkExp(
      /^1[3|4|5|7|8][0-9]\d{8}$/,
      '请填写正确的手机号码',
      true
    )
    return {
      initialPass: '@wQ123$$',
      storeList: [],
      roleList: [],
      refresh: true,
      defaultCheckedKeys: [],
      defaultExpandAll: false,
      loading: false,
      data: { activateFlag: 0, menuIdList: undefined, storeIds: [] },
      props: {
        children: 'child',
        label: 'name'
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名' },
          {
            validator: checkUserName
          }
        ],
        password: [
          { required: true, message: '请输入密码' },
          {
            validator: checkPass
          }
        ],
        qq: [
          { required: false, message: '请输入QQ' },
          {
            validator: checkQQ
          }
        ],
        email: [
          { required: false, message: '请输入邮箱' },
          {
            validator: checkEmail
          }
        ],
        mobile: [
          { required: false, message: '请输入手机号码' },
          {
            validator: checkMobile
          }
        ],
        nickName: [{ required: true, message: '请输入昵称' }],
        nickName: [{ required: true, message: '请输入昵称' }],
        activateFlag: [{ required: true, message: '请选择是否激活' }]
      }
    }
  },
  created() {
    this.getRoleList()
    // this.getStoreList()
  },
  methods: {
    reset() {
      this.data = { activateFlag: 0, menuIdList: undefined, storeIds: [] }

      this.$nextTick(() => {
        this.$refs.form.clearValidate()
      })
    },
    $api(api, cb, params = {}) {
      let vm = this
      fetchData({
        ...apis[api],
        data: params
      }).then(res => {
        handlerCode(
          res,
          () => {
            cb(res)
          },
          () => {
            vm.$root.$children[0].asyncConfirmLoading = false
          },
          true
        )
      })
    },
    getStoreList() {
      this.$api('storeGetAllStore', ({ data }) => {
        this.storeList = data.data.map(el => ({
          label: el.allName,
          value: el.storeId
        }))
      })
    },
    getRoleList() {
      this.$api('merchantRoleDefList', ({ data }) => {
        let rows = data.rows.filter(el => el.name === '开发人员' || el.name === '采购人员')
        this.roleList = rows
      })
    },
    cancel() {
      this.loading = false
      this.$root.$children[0].asyncModalVisible = false
    },
    ok() {
      this.save()
    },
    save(edit) {
      return this.$refs.form.validate().then(() => {
        // let ytdialog = this.$parent.$parent
        this.loading = true
        // this.data.userId = this.data.id
        let { userId, roleIdList, roleList, ...info } = this.data

        // 如果是编辑状态，密码没有更新，则不传密码
        if (this.editId && this.data.password === this.initialPass) {
          info.password = null
        }
        if (!roleList) {
          showToast('error', '请选择角色')
          return
        }
        let params = {
          userId,
          roleIdList: roleList.join ? roleList.slice().join() : roleList,
          roleList: roleList.join ? roleList.slice().join() : roleList,
          ...info
        }
        let api = edit ? `merchantUserUpdate` : `merchantUserSave`
        this.$root.$children[0].asyncConfirmLoading = true
        this.$api(
          api,
          res => {
            showToast('success', '新增成功')
            this.$root.$children[0].asyncConfirmLoading = false
            this.$emit('submitDialogForm', this.ruleForm)
            this.$listeners.set(this)
            // ytdialog.options.visible = false
          },
          params
        )
        // this.$api[
        //   edit ? `login/merchantUserUpdate` : `login/merchantUserSave`
        // ]({
        //   userId,
        //   roleIdList: roleList.join ? roleList.slice().join() : roleList,
        //   roleList: roleList.join ? roleList.slice().join() : roleList,
        //   ...info
        // })
        //   .then(data => {
        //     this.loading = false
        //     this.$emit('success')
        //     ytdialog.options.visible = false
        //   })
        //   .catch(err => {
        //     this.loading = false
        //     return Promise.reject(err)
        //   })
      })
    },
    handleCheck(data, { checkedKeys }) {
      this.data.roleList = checkedKeys.join(',')
      // this.$refs.form.validateField('roleList')
    }
  }
}
</script>
