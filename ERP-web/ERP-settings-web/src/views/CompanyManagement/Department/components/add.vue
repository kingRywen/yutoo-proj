<template>
  <div v-loading="isloading">
    <el-form label-position="right" :model="data" label-width="69px" size="small" ref="form" :rules="rules">
      <ElFormItem label="上级部门" prop="parentId">
        <el-cascader :options="departmentList" change-on-select :props="props" v-model="data.parentId"></el-cascader>
      </ElFormItem>
      <ElFormItem label="部门编码" prop="code">
        <el-input v-model="data.code" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="部门名称" prop="name">
        <el-input v-model="data.name" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="部门描述" prop="description">
        <el-input type="textarea" :rows="4" v-model="data.description" placeholder></el-input>
      </ElFormItem>
      <ElFormItem label="是否激活" prop="activateFlag">
        <el-switch v-model="data.activateFlag" :active-value="1" :inactive-value="0"></el-switch>
      </ElFormItem>
    </el-form>
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
      props: {
        label: 'name',
        value: 'merchantDepartmentId',
        children: 'childs'
      },
      loading: false,
      data: { activateFlag: 0 },
      options: [],
      rules: {
        name: [{ required: true, message: '请输入部门名称' }],
        code: [{ required: true, message: '请输入部门编码' }],
        description: [{ required: true, message: '请输入部门描述' }],
        activateFlag: [{ required: true, message: '请选择是否激活' }]
      }
    }
  },
  // created() {
  //   this.pullDepartmentList()
  // },
  computed: {
    ...mapState('management', ['departmentList']),
    isloading() {
      return this.$store.state.isloading
    }
  },
  methods: {
    ...mapActions('management', ['pullDepartmentList']),
    resetForm() {
      this.data = { activateFlag: 0 }
      this.$refs.form.resetFields()
    },
    initData() {
      this.getInfo(this.editId)
      this.pullDepartmentList()
      this.resetForm()
    },
    save(edit) {
      return this.$refs.form.validate().then(() => {
        let ytdialog = this.$parent.$parent
        this.$store.commit('changeLoading', true)
        let { parentId = [0], ...info } = this.data
        return this.$api[
          edit ? `perms/departmentUpdate` : `perms/departmentSave`
        ]({
          parentId: parentId.slice(0).pop(),
          ...info
        })
          .then(() => {
            this.$store.commit('changeLoading')
            this.$emit('success')
            ytdialog.options.visible = false
          })
          .catch(err => {
            this.$store.commit('changeLoading')
            return Promise.reject(err)
          })
      }).catch(err => {
        console.error(err);
      })
    },
    handleCheck(data, { checkedKeys }) {
      this.data.menuIdList = checkedKeys.join(',')
      this.$refs.form.validateField('menuIdList')
    },
    getInfo(val) {
      if (val == null) {
        this.data = { activateFlag: 0 }
      } else {
        this.$api[`perms/departmentInfo`]({ merchantDepartmentId: val })
          .then(data => {
            let { parentIds, ...info } = data.rows
            this.data = {
              ...this.data,
              ...info,
              parentId: parentIds
            }
            this.$nextTick(() => {
              this.$refs.form.clearValidate()
            })
          })
          .catch(() => {})
      }
    }
  }
  // watch: {
  //   editId: {
  //     immediate: true,
  //     handler(val) {
  //       if (val == null) {
  //         this.data = { activateFlag: 0 }
  //       } else {
  //         this.$api[`perms/departmentInfo`]({ merchantDepartmentId: val })
  //           .then(data => {
  //             this.data = {
  //               ...this.data,
  //               ...data.rows
  //             }
  //             this.$nextTick(() => {
  //               this.$refs.form.clearValidate()
  //             })
  //           })
  //           .catch(() => {})
  //       }
  //     }
  //   }
  // }
}
</script>

<style>
</style>
