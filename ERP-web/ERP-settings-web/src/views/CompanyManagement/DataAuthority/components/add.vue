<template>
  <div>
    <el-form :model="data" label-width="100px" size="small" ref="form" :rules="rules">
      <ElFormItem v-if="editId == null" label="选择角色" prop="roleId">
        <el-select multiple filterable v-model="data.roleId" style="width:100%" @change="handleChange">
          <el-option v-for="item in merchantRoleAllList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </ElFormItem>
      <ElFormItem v-if="editId == null" label="选择人员" prop="userIds">
        <el-select :disabled="editId != null" v-model="data.userIds" multiple style="width:100%">
          <el-option v-for="item in users" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </ElFormItem>
      <ElFormItem v-else label="人员名称">
        <el-input disabled :value="editRow.userName"></el-input>
      </ElFormItem>
      <ElFormItem label="所属店铺" prop="storeIds">
        <el-select v-model="data.storeIds" multiple style="width:100%">
          <el-option v-for="item in AllStores" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </ElFormItem>
    </el-form>
    <!-- <div class="txc">
      <el-button type="primary" size="small" @click="save" :loading="loading">保存</el-button>
    </div>-->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    editId: Number,
    editRow: {
      default: () => ({})
    }
  },
  data() {
    return {
      users: [],
      roleList: [],
      defaultCheckedKeys: [],
      defaultExpandAll: false,
      loading: false,
      data: {
        roleId: []
      },
      props: {
        children: 'child',
        label: 'name'
      },
      rules: {
        storeIds: [{ required: true, message: '请选择所属店铺' }],
        userIds: [{ required: true, message: '请选择人员' }]
        // roleId: [{ required: true, message: '请选择角色' }]
      }
    }
  },
  computed: {
    ...mapState('common', ['merchantRoleAllList', 'AllStores', 'userAllList'])
  },
  created() {
    this.getRoleList()
    this.getUsers()
  },
  methods: {
    getUsers(roleIds) {
      this.$api[`login/merchantUserAllList`]({ roleIds })
        .then(data => {
          this.data.userIds = []
          this.users = data.data.map(el => ({ label: el.name, value: el.id }))
        })
        .catch(err => {})
    },
    handleChange(val) {
      this.getUsers(val)
    },
    getRoleList() {
      this.$api[`perms/merchantRoleDefList`]({})
        .then(data => {
          this.roleList = data.rows
        })
        .catch(err => {})
    },
    save(edit) {
      return this.$refs.form.validate().then(() => {
        let ytdialog = this.$parent.$parent
        this.loading = true
        return this.$api[
          edit
            ? `perms/permissionStoreDataUpdate`
            : `perms/permissionStoreDataCreate`
        ](
          edit
            ? {
                storeIds: this.data.storeIds,
                userId: this.data.userIds[0]
              }
            : {
                ...this.data
              }
        )
          .then(data => {
            this.loading = false
            this.$emit('success')
            ytdialog.options.visible = false
          })
          .catch(err => {
            this.loading = false
            return Promise.reject(err)
          })
      })
    },
    clear() {
      try {
        this.$refs.form && this.$refs.form.resetFields()
      } catch (error) {
        
      }
      
    },
    handleCheck(data, { checkedKeys }) {
      this.data.roleList = checkedKeys.join(',')
      // this.$refs.form.validateField('roleList')
    },
    _initData() {
      // this.users = [...this.merchantRoleAllList]
      //
      let val = this.editId
      this.data = {
        storeIds: [],
        roleId: [],
        userIds: []
      }
      if (val == null) {
        this.$nextTick(() => {
          this.clear()
        })
      } else {
        let vm = this
        this.$api[`perms/permissionStoreDataGerUserStoreIds`]({ userId: val })
          .then(data => {
            vm.data.storeIds = data.data
            vm.data.userIds = [val]
            // vm.$nextTick(() => {
            //   vm.clear()
            // })
          })
          .catch(err => {})
      }
    }
  }
  // watch: {
  //   editId: {
  //     immediate: true,

  //   }
  // }
}
</script>

<style>
</style>
