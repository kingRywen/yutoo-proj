<template>
  <div class="customs-declaration">
    <el-form ref="form" :model="form" label-width="90px" :disabled="disabled" :rules="rules">
      <el-form-item label="选择报关单:" prop="customsDeclarationId">
        <el-select v-model="form.customsDeclarationId" size="small" placeholder="请选择" class="normal-input">
          <el-option v-for="item in manifestTempList" :label="item.label" :value="item.value" :key="item.id"></el-option>
          <!-- <el-option label="区域一" :value="1"></el-option>
          <el-option label="区域二" :value="0"></el-option>-->
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
export default {
  data() {
    let vm = this
    return {
      form: {},
      disabled: false,
      rules: vm.$formValidate([
        {
          label: '报关单',
          value: 'customsDeclarationId'
        }
      ])
    }
  },
  created() {
    this.getManifestTempList()
  },
  computed: {
    ...mapState('logistics', ['manifestTempList'])
  },
  methods: {
    ...mapActions('logistics', ['getManifestTempList']),
    getIdList(params) {
      this.form = params
    },
    resetForm() {},
    submitForm(cb) {
      let data = JSON.parse(JSON.stringify(this.form))
      this.$refs['form'].validate(valid => {
        if (valid) {
          cb && cb(data)
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
.customs-declaration {
  background: #fff;
}
</style>
