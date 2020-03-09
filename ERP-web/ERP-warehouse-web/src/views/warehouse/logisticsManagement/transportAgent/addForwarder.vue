<template>
  <div>
    <el-form ref="form" :rules="rules" :model="form" label-width="110px">
      <el-row>
        <ElCol :span="8" class="padright10">
          <el-form-item label="运输商名称:" prop="forwarderName">
            <el-input v-model="form.forwarderName" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
        <ElCol :span="8" class="padright10">
          <el-form-item label="运输商代码:" prop="forwarderCode">
            <el-input v-model="form.forwarderCode" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="8">
          <el-form-item label="取件联系人:" class="padright10" prop="accessName">
            <el-input v-model="form.accessName" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
        <ElCol :span="8">
          <el-form-item label="取件联系人电话:" class="padright10" prop="accessPhone">
            <el-input v-model="form.accessPhone" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
        <ElCol :span="8">
          <el-form-item label="取件联系人QQ:" class="padright10" prop="accessQq">
            <el-input v-model="form.accessQq" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="8">
          <el-form-item label="财务联系人:" class="padright10" prop="financialName">
            <el-input v-model="form.financialName" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
        <ElCol :span="8">
          <el-form-item label="财务联系人电话:" class="padright10" prop="financialPhone">
            <el-input v-model="form.financialPhone" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
        <ElCol :span="8">
          <el-form-item label="财务联系人QQ:" class="padright10" prop="financialQq">
            <el-input v-model="form.financialQq" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="8">
          <el-form-item label="客服联系人:" class="padright10" prop="serviceName">
            <el-input v-model="form.serviceName" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
        <ElCol :span="8">
          <el-form-item label="客服联系人电话:" class="padright10" prop="servicePhone">
            <el-input v-model="form.servicePhone" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
        <ElCol :span="8">
          <el-form-item label="客服联系人QQ:" class="padright10" prop="serviceQq">
            <el-input v-model="form.serviceQq" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="16">
          <el-form-item label="公司地址:" class="padright10" prop="forwarderAddress">
            <el-input v-model="form.forwarderAddress" class="normal-input" size="small"></el-input>
          </el-form-item>
        </ElCol>
      </el-row>
      <el-row>
        <ElCol :span="24">
          <el-form-item prop="activateFlag" label-width="24px">
            <el-checkbox :true-label="1" :false-label="0" class="isChecked" v-model="form.activateFlag">是否激活</el-checkbox>
          </el-form-item>
        </ElCol>
      </el-row>
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
          label: '运输商名称',
          value: 'forwarderName'
        },
        {
          label: '运输商代码',
          value: 'forwarderCode'
        },
        {
          label: '取件联系人',
          value: 'accessName'
        },
        {
          label: '取件联系人电话',
          value: 'accessPhone',
          type: 'phone'
        },
        {
          label: '取件联系人QQ',
          value: 'accessQq',
          type: 'qq'
        },
        {
          label: '财务联系人',
          value: 'financialName'
        },
        {
          label: '财务联系人电话',
          value: 'financialPhone',
          type: 'phone'
        },
        {
          label: '财务联系人QQ',
          value: 'financialQq',
          type: 'qq'
        },
        {
          label: '客服联系人',
          value: 'serviceName'
        },
        {
          label: '客服联系人电话',
          value: 'servicePhone',
          type: 'phone'
        },
        {
          label: '客服联系人QQ',
          value: 'serviceQq',
          type: 'qq'
        },
        {
          label: '公司地址',
          value: 'forwarderAddress'
        }
      ])
    }
  },
  created() {},
  methods: {
    edit(params) {
      let vm = this
      vm.$api['warehouse/forwarderGet'](params)
        .then(({ rows }) => {
          vm.form = rows
          vm.$emit('loading')
        })
        .catch(() => {
          vm.$emit('loading')
        })
    },
    resetForm() {},
    submitForm(cb) {
      let _data = JSON.parse(JSON.stringify(this.form))
      _data.activateFlag || (_data.activateFlag = 0)
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
</style>
