<template>
  <div class="add-region">
    <el-form ref="form" :rules="rules" :model="form" label-width="80px">
      <el-form-item label="区域名称:" prop="logisticRegionName">
        <el-input v-model="form.logisticRegionName" size="small" class="normal-input"></el-input>
      </el-form-item>
      <el-form-item label="区域描述:" prop="describe">
        <el-input v-model="form.describe" type="textarea" size="small" class="normal-input"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    let vm = this
    return {
      form: {},
      rules: vm.$formValidate([
        {
          label: '区域名称',
          value: 'logisticRegionName'
        },
        {
          label: '区域描述',
          value: 'describe'
        }
      ])
    }
  },
  methods: {
    edit(data) {
      let vm = this
      vm.$api['warehouse/regionGet'](data)
        .then(data => {
          let { rows } = data
          vm.form = rows
          vm.$emit('loading')
        })
        .catch(() => {
          vm.$emit('loading')
        })
    },
    resetForm() {
      this.form = {}
      this.$refs['form'].resetFields()
    },
    submitForm(cb) {
      let _data = JSON.parse(JSON.stringify(this.form))
      this.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(_data)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.add-region {
  background: #fff;
}
</style>
