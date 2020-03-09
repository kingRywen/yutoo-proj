<template>
  <div>
    <el-form :model="data" label-width="100px" size="small" ref="form" :rules="rules">
      <ElFormItem label="角色名称" prop="name">
        <el-input v-model="data.name" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="权限列表" prop="menuIdList">
        <!-- <el-input v-model="data.menuIdList" placeholder></el-input> -->
        <el-tree
          v-if="refresh"
          @check="handleCheck"
          :check-strictly="false"
          :default-checked-keys="defaultCheckedKeys"
          :default-expand-all="defaultExpandAll"
          :data="allMenuList"
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
    </div>-->
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  props: {
    editId: Number
  },
  data() {
    return {
      refresh: true,
      defaultCheckedKeys: [],
      defaultExpandAll: false,
      loading: false,
      data: { activateFlag: 0, menuIdList: undefined },
      props: {
        children: 'child',
        label: 'name'
      },
      rules: {
        name: [{ required: true, message: '请输入角色名称' }],
        menuIdList: [{ required: true, message: '请选择权限' }],
        activateFlag: [{ required: true, message: '请选择是否激活' }]
      }
    }
  },
  created() {
    this.pullAllMenuList()
  },
  computed: {
    ...mapState('common', ['allMenuList'])
  },
  methods: {
    ...mapActions('common', ['pullAllMenuList']),
    save(edit) {
      return this.$refs.form.validate().then(() => {
        let ytdialog = this.$parent.$parent
        this.loading = true
        this.data.roleId = this.data.id
        let { id, ...info } = this.data
        return this.$api[edit ? `perms/roleUpdate` : `perms/roleSave`]({
          roleId: id,
          ...info
        })
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
    handleCheck(data, { checkedKeys }) {
      this.data.menuIdList = checkedKeys.join(',')
      this.$refs.form.validateField('menuIdList')
    }
  },
  watch: {
    editId: {
      immediate: true,
      handler(val) {
        if (val == null) {
          this.data = { activateFlag: 0, menuIdList: undefined }
          this.defaultCheckedKeys = []
          this.refresh = false
          this.$nextTick(() => {
            this.refresh = true
          })
        } else {
          this.$api[`perms/roleInfo`]({ roleId: val })
            .then(data => {
              let { permIds } = data.rows
              this.data = {
                ...this.data,
                ...data.rows,
                menuIdList: permIds.join(',')
              }
              this.defaultCheckedKeys = permIds
              this.refresh = false
              this.$nextTick(() => {
                this.refresh = true
              })
            })
            .catch(err => {})
        }
      }
    }
  }
}
</script>

<style>
</style>
